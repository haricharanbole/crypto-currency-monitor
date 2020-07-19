/* eslint-disable dot-notation */
import React, {PureComponent} from 'react';
import {LineChart} from 'react-native-chart-kit';
import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const getSymbolFromCurrency = require('currency-symbol-map');

export default class CurrencyVsTimeChart extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <LineChart
        data={{
          labels: this.props.timeLabels,
          datasets: [
            {
              data: this.props.priceLabels,
            },
          ],
          legend: [this.props.legend],
        }}
        width={wp('90%')}
        height={hp('30%')}
        yAxisLabel={getSymbolFromCurrency(this.props.currency)}
        yAxisSuffix={this.props.currencySuffix}
        chartConfig={{
          backgroundColor: '#000000',
          backgroundGradientFrom: this.props.gradient[0],
          backgroundGradientTo: this.props.gradient[1],
          decimalPlaces: 2,
          color: this.props.color,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 20,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: this.props.strokeColor,
          },
        }}
        bezier
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 20,
  },
});
