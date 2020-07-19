/* eslint-disable dot-notation */
import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import moment from 'moment';
import CurrencyVsTimeChart from './CurrencyVsTimeChart';
const getSymbolFromCurrency = require('currency-symbol-map');
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

export default class CryptoCharts extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: 'Loading',
      buyPrice: 0,
      sellPrice: 0,
      buyPriceLabels: [0, 0, 0, 0, 0],
      sellPriceLabels: [0, 0, 0, 0, 0],
      buyTimeLabels: [
        '00:00:00',
        '00:00:00',
        '00:00:00',
        '00:00:00',
        '00:00:00',
      ],
      sellTimeLabels: [
        '00:00:00',
        '00:00:00',
        '00:00:00',
        '00:00:00',
        '00:00:00',
      ],
    };
    this.webSocket = new WebSocket('wss://ws-feed.pro.coinbase.com');
  }

  conversionCode = `${this.props.cryptoCurrencyCode}-${this.props.market}`;
  subscibeMessage = {
    type: 'subscribe',
    product_ids: [this.conversionCode],
    channels: [
      'level2',
      {
        name: 'ticker',
        product_ids: [this.conversionCode],
      },
    ],
  };

  componentDidMount() {
    this.webSocket.onopen = () => {
      this.webSocket.send(JSON.stringify(this.subscibeMessage));
      this.setState({
        status: 'Loading Data',
      });
    };

    this.webSocket.onmessage = (priceUpdate) => {
      let data = JSON.parse(priceUpdate['data']);
      let change = data['changes'];
      this.parseMessage(data, change);
      this.setState({
        status: '',
      });
    };
    this.webSocket.onerror = (e) => {
      console.log(e.message);
    };

    this.webSocket.onclose = () => {};
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.market !== prevProps.market ||
      this.props.cryptoCurrencyCode !== prevProps.cryptoCurrencyCode
    ) {
      let conversionCode = `${prevProps.cryptoCurrencyCode}-${prevProps.market}`;
      let unSubScribeMessage = {
        type: 'unsubscribe',
        product_ids: [conversionCode],
        channels: [
          'level2',
          {
            name: 'ticker',
            product_ids: [conversionCode],
          },
        ],
      };
      this.webSocket.send(JSON.stringify(unSubScribeMessage));
      this.setState({
        buyPriceLabels: [0, 0, 0, 0, 0],
        sellPriceLabels: [0, 0, 0, 0, 0],
      });
      let newCoversionCode = `${this.props.cryptoCurrencyCode}-${this.props.market}`;
      let subScribeMessage = {
        type: 'subscribe',
        product_ids: [newCoversionCode],
        channels: [
          'level2',
          {
            name: 'ticker',
            product_ids: [newCoversionCode],
          },
        ],
      };
      this.webSocket.send(JSON.stringify(subScribeMessage));
    }
  }

  componentWillUnmount() {
    this.webSocket.close();
  }

  parseMessage(data, change) {
    if (change === undefined || data['time'] === undefined) {
      this.setState({
        buyPriceLabels: this.state.buyPriceLabels,
        buyTimeLabels: this.state.buyTimeLabels,
        sellPriceLabels: this.state.sellPriceLabels,
        sellTimeLabels: this.state.sellTimeLabels,
      });
    } else if (change !== undefined && data['time'] !== undefined) {
      if (
        change[0][0] === 'buy' &&
        moment(data['time']).format('HH:mm:ss') !==
          this.state.buyTimeLabels[4] &&
        typeof change[0][1] !== undefined
      ) {
        let priceLabels = this.state.buyPriceLabels;
        let timeLabels = this.state.buyTimeLabels;
        let updatedPrice =
          change[0][1] >= 1000
            ? Number(change[0][1] / 1000)
            : Number(change[0][1]);
        this.setState({
          buyPrice: change[0][1],
          buyPriceLabels: priceLabels
            .splice(1, priceLabels.length - 1)
            .concat(typeof updatedPrice === 'number' ? updatedPrice : 0),
          buyTimeLabels: timeLabels
            .splice(1, timeLabels.length - 1)
            .concat(moment(data['time']).format('HH:mm:ss')),
        });
      }
      if (
        change[0][0] === 'sell' &&
        moment(data['time']).format('HH:mm:ss') !==
          this.state.sellTimeLabels[4] &&
        typeof change[0][1] !== undefined
      ) {
        let priceLabels = this.state.sellPriceLabels;
        let timeLabels = this.state.sellTimeLabels;
        let updatedPrice =
          change[0][1] >= 1000
            ? Number(change[0][1] / 1000)
            : Number(change[0][1]);
        this.setState({
          sellPrice: change[0][1],
          sellPriceLabels: priceLabels
            .splice(1, priceLabels.length - 1)
            .concat(typeof updatedPrice === 'number' ? updatedPrice : 0),
          sellTimeLabels: timeLabels
            .splice(1, timeLabels.length - 1)
            .concat(moment(data['time']).format('HH:mm:ss')),
        });
      }
    }
  }

  render() {
    const [
      buyPrice,
      sellPrice,
      buyPriceLabels,
      sellPriceLabels,
      buyTimeLabels,
      sellTimeLabels,
    ] = [
      this.state.buyPrice,
      this.state.sellPrice,
      this.state.buyPriceLabels,
      this.state.sellPriceLabels,
      this.state.buyTimeLabels,
      this.state.sellTimeLabels,
    ];

    return (
      <LinearGradient
        colors={['#fbc2eb', '#a6c1ee', '#a6c1ee']}
        style={styles.container}>
        <View style={styles.chartContainer}>
          <CurrencyVsTimeChart
            timeLabels={buyTimeLabels}
            priceLabels={buyPriceLabels}
            legend={`Buying Price: ${getSymbolFromCurrency(
              this.props.market,
            )}${buyPrice}`}
            gradient={['#434343', '#000000']}
            currency={this.props.market}
            currencySuffix={Number(buyPrice) >= 1000 ? 'k' : ''}
            strokeColor={'#FFF'}
            color={(opacity = 1) => `rgba(0, 255, 0, ${opacity})`}
          />
        </View>
        <View style={styles.chartContainer}>
          <CurrencyVsTimeChart
            timeLabels={sellTimeLabels}
            priceLabels={sellPriceLabels}
            legend={`Selling Price: ${getSymbolFromCurrency(
              this.props.market,
            )}${sellPrice}`}
            gradient={['#09203f', '#537895']}
            currency={this.props.market}
            currencySuffix={Number(sellPrice) >= 1000 ? 'k' : ''}
            strokeColor={'#FF0000'}
            color={(opacity = 1) => `rgba(255, 255, 255, ${opacity})`}
          />
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    flex: 0.5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
