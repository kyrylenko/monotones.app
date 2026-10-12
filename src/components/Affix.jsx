import React, { Component } from 'react';

class Affix extends Component {

    /*     static defaultProps = {
            offsettop: 0,
            offsetbottom: 0
        }; */

    state = {
        affix: true,
    };


    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight - this.props.offsetbottom;

        //console.log('pageYOffset: ', window.pageYOffset, 'scrollHeight: ', scrollHeight);

        if (window.pageYOffset < scrollHeight) {
            if (!this.state.affix)
                this.setState({ affix: true })
        }

        if (window.pageYOffset >= scrollHeight + this.props.offsetbottom) {
            if (this.state.affix)
                this.setState({ affix: false })
        }
    };

    render() {
        const { className } = this.props;
        const affix = this.state.affix ? className : '';

        return (
            <footer className={affix}>
                {this.props.children}
            </footer>
        );
    }
}

export default Affix;