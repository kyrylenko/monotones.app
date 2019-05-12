import React from 'react';

//TODO: donations using PayPal https://github.com/paypal/paypal-checkout-components
//https://github.com/thinhvo0108/react-paypal-express-checkout
// & BTC http://www.reactjstutorial.net/donate.html

const Donate = () => (
    <section className='mt-5'>
        <p>If you're willing to donate, please
            <a className="bmc-button" target="_blank" href="https://www.buymeacoffee.com/kyrylenko">
                <img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy us a coffee"></img>
                <span style={{ marginLeft: '5px' }}>Buy us a coffee</span>
            </a>!
        </p>
        <p>Or</p>
        <p>just contact us! <a target='_blank' rel='noopener noreferrer' href='mailto:contact@monotones.app'>contact@monotones.app</a></p>
        {/* <h5>PayPal</h5>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick" />
                <input type="hidden" name="hosted_button_id" value="5BERTKKK3B78J" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form> */}
    </section>
);

export default Donate;