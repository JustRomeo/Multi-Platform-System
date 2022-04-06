import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class FormCurrencyIsCurrencyUnder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: "",
            label: "AUD"
        };

        this.handleChangeLabel = this.handleChangeLabel.bind(this);
        this.handleChangeAmount = this.handleChangeAmount.bind(this);
    }

    handleChangeLabel(event) {
        this.setState({label: event.value});
        this.props.changeParam(["isCurrencyUnder", event.value ,this.state.amount]);
    }

    handleChangeAmount(event) {
        this.setState({amount: event.target.value});
        this.props.changeParam(["isCurrencyUnder", this.state.label, event.target.value]);
    }

    render() {
        const options = ["AUD", "CAD", "CNY", "EUR", "JPY", "RUB", "BRL", "CHF", "CUP", "GPB", "HKD", "INR", "KRW", "KPW"];
        const option_choosed = options[0];
        return (
            <div>
                <Dropdown options={options} onChange={this.handleChangeLabel} value={option_choosed} placeholder="Selectionner une option"  className="mt-2"/>
                <input className="input is-medium log-input mt-2" type="number" placeholder="Entrer le montant du seuil voulu (en dollars $)" id="amount" value={this.state.amount} onChange={this.handleChangeAmount} required></input>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormCurrencyIsCurrencyUnder));