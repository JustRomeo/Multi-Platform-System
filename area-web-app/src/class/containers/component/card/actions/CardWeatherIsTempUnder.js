import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardWeatherIsTempUnder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            city_name: "",
            temp: "",
        };
    }

    componentDidMount() {
        this.setState({
            city_name: this.props.city_name,
            temp: this.props.temp,
        });
    }

    render() {
        return (
            <div className="column ml-3"><figure className="image is-64x64 mb-5">
                <img alt="" src="https://i.pinimg.com/originals/77/0b/80/770b805d5c99c7931366c2e84e88f251.png" /></figure>
                <p className="is-size-6">Déclenché si la température de <span className="has-text-weight-bold">{this.state.city_name}</span> tombe en dessous de: <span className="has-text-weight-bold">{this.state.temp}°C</span></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardWeatherIsTempUnder));