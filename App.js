// React Imports
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

// Navigation
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
const Drawer = createDrawerNavigator();

// Layout Helper Modules
import {Picker} from '@react-native-community/picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// currency related modules
import cryptocurrencies from 'cryptocurrencies';
import CryptoCharts from './src/components/CryptoCharts';
const currencyCode = require('currency-codes');
const currencies = ['BTC', 'ETH', 'ETC', 'XRP', 'LTC', 'BCH', 'EOS', 'XLM'];
const markets = ['USD', 'EUR', 'GBP'];

// Drawer Navigation Implementation
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        {currencies.map((currency) => {
          return (
            <Drawer.Screen
              key={currency}
              name={`${cryptocurrencies[currency]}`}
              component={CryptoScreen}
              initialParams={{currency: currency}}
            />
          );
        })}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

// One Screen Component for all different screens of currencies
const CryptoScreen = ({route, navigation}) => {
  const [market, setmarket] = useState(markets[0]);

  const Header = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.burgerMenuTouchArea}
          onPress={() => navigation.toggleDrawer()}>
          <Image
            source={require('./src/assets/images/menu.png')}
            style={styles.burgerMenuImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerTextArea}
          onPress={() => navigation.toggleDrawer()}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={styles.headerText}>{`${
            cryptocurrencies[route.params.currency]
          }   vs`}</Text>
        </TouchableOpacity>
        <View style={styles.pickerArea}>
          <Picker
            selectedValue={market}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setmarket(itemValue)}>
            {markets.map((marketEntry) => {
              return (
                <Picker.Item
                  label={`${currencyCode.code(marketEntry).currency}`}
                  value={marketEntry}
                  key={marketEntry}
                />
              );
            })}
          </Picker>
        </View>
      </View>
    );
  };

  const Body = () => {
    return (
      <View style={styles.body}>
        <View style={styles.chartContainer}>
          <CryptoCharts
            cryptoCurrencyCode={route.params.currency}
            market={market}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fbc2eb" />
      <SafeAreaView style={styles.SafeArea}>
        <View style={styles.root}>
          <Header />
          <Body />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  SafeArea: {flex: 1},
  root: {
    flex: 1,
    width: wp('100%'),
    height: wp('100%'),
    backgroundColor: '#FFF',
  },
  header: {
    flex: 0.1,
    flexDirection: 'row',
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fbc2eb',
  },
  body: {
    flex: 0.9,
    width: wp('100%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  burgerMenuTouchArea: {
    flex: 0.1,
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  burgerMenuImage: {
    height: '100%',
    resizeMode: 'contain',
  },
  headerTextArea: {
    flex: 0.45,
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
  },
  pickerArea: {
    flex: 0.45,
    flexDirection: 'row',
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDropdownArea: {
    flex: 0.6,
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
