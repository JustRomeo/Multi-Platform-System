import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class FormWeatherIsTempUnder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            city_name: "",
            temp: "",
        };
        this.handleChangeCityName = this.handleChangeCityName.bind(this);
        this.handleChangeTemp = this.handleChangeTemp.bind(this);
    }

    handleChangeCityName(event) {
        this.setState({city_name: event.target.value});
        this.props.changeParam(["isTempUnder", event.target.value, this.state.temp]);
    }

    handleChangeTemp(event) {
        this.setState({temp: event.target.value});
        this.props.changeParam(["isTempUnder", this.state.city_name, event.target.value]);
    }

    render() {
        return (
            <div>
                <input className="input is-medium log-input mt-2" type="text" placeholder="Nom de la ville" id="city_name" value={this.state.city_name} onChange={this.handleChangeCityName} required></input>
                <input className="input is-medium log-input mt-2" type="number" placeholder="Température ciblé" id="temp" value={this.state.temp} onChange={this.handleChangeTemp} required></input>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormWeatherIsTempUnder));