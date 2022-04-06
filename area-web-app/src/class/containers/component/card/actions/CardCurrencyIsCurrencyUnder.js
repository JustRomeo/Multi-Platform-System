import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardCurrencyIsCurrencyUnder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currency_type: "",
            amount: "",
        };
    }

    componentDidMount() {
        this.setState({
            currency_type: this.props.currency_type,
            amount: this.props.amount,
        });
    }

    render() {
        return (
            <div className="column is-5 ml-3"><figure className="image is-64x64 mb-5">
                <img alt="" src="https://i.pinimg.com/originals/88/6d/e8/886de8237eb0b5de74f963cd80523e1e.png" /></figure>
                <p className="is-size-6">Lorsque <span className="has-text-weight-bold">"{this.state.currency_type}"</span> est en dessous de : <span className="has-text-weight-bold">{this.state.amount}$</span></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardCurrencyIsCurrencyUnder));