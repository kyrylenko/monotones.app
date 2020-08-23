import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

//TODO: donations using PayPal https://github.com/paypal/paypal-checkout-components
//https://github.com/thinhvo0108/react-paypal-express-checkout
// & BTC http://www.reactjstutorial.net/donate.html

class Donate extends Component {

  componentDidMount() {
    window.LiqPayCheckoutCallback = function () {
      window.LiqPayCheckout.init({
        data: "eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXlkb25hdGUiLCJhbW91bnQiOiI1MCIsImN1cnJlbmN5IjoiVUFIIiwiZGVzY3JpcHRpb24iOiJTdXBwb3J0IE1vbm90b25lcyEiLCJwdWJsaWNfa2V5IjoiaTc2NzM0NTIxNjk0IiwibGFuZ3VhZ2UiOiJlbiJ9",
        signature: "gWGx3NfrzfuuW6pedgXDjfY0HXw=",
        embedTo: "#liqpay_checkout",
        mode: "embed", // embed || popup,
        language: "en",
      }).on("liqpay.callback", function (data) {
        console.log(data.status);
        console.log(data);
      }).on("liqpay.ready", function (data) {
        // ready
      }).on("liqpay.close", function (data) {
        // close
      });
    };

    window.LiqPayCheckoutCallback();
  }

  render() {
    const { t } = this.props;
    
    return (<section className='mt-5'>
      <p>{t('buy_us_coffee')}</p>
      <div id="liqpay_checkout"></div>
      {/* <a href='https://www.liqpay.ua/api/3/checkout?data=eyJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXlkb25hdGUiLCJhbW91bnQiOiIxMCIsImN1cnJlbmN5IjoiVUFIIiwiZGVzY3JpcHRpb24iOiJEb25hdGUiLCJwdWJsaWNfa2V5IjoiaTc2NzM0NTIxNjk0IiwibGFuZ3VhZ2UiOiJydSJ9&signature=pmyA21MndqhIHkacm+48A6LfOAI='>Liq</a> */}
    </section>);
  }
}

export default withTranslation()(Donate);