import React from 'react';

//TODO: donations using PayPal https://github.com/paypal/paypal-checkout-components
//https://github.com/thinhvo0108/react-paypal-express-checkout
// & BTC http://www.reactjstutorial.net/donate.html

const Donate = () => (
    <div className='container'>
        <h3>Donate</h3>
        <section>
            <h5>PayPal</h5>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="5BERTKKK3B78J" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
        </section>
        <section>
            <h4>BTC</h4>
            <form action="https://bitpay.com/checkout" method="post" >
                <input type="hidden" name="action" value="checkout" ></input>
                <input type="hidden" name="posData" value="" ></input>
                <input type="hidden" name="data" value="tO4CYSvMKjUGXJJsE3efnIvwlI7Bf/HiZ9TK3JPXEXgS+nRz7e9+xaGOHUC6rFkrvcQm1+goWS9qci3BH5qh0W6xZUdq+MB3R+MWbJ6j68+IOz/PTsEMwHkK4DncyVar9pnrHdfJibHe6wfcdu5REU4tWI7r+NpRYBIpXMbjkm5X9Jwtcrf3GqgEac4l7KfVEC2cEJFwUylExEgpCounQf1QO7vO2X24mpYgRu05j8g=" ></input>
                <input type="image" src="https://bitpay.com/cdn/en_US/bp-btn-pay-currencies.svg" name="submit" style={{ width: '210px' }} alt="BitPay, the easy way to pay with bitcoins." ></input>
            </form>
        </section>
    </div>
);

export default Donate;