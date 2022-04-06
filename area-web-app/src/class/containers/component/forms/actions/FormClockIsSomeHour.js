import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class FormClockIsSomeHour extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: "",
        };
        this.handleChangeTime = this.handleChangeTime.bind(this);
    }

    handleChangeTime(event) {
        this.setState({time: event.target.value});
        if (parseInt(event.target.value) < 0)
            this.props.changeParam(["isSomeHour", "0"]);
        else if (parseInt(event.target.value) > 24)
            this.props.changeParam(["isSomeHour", "24"]);
        else
            this.props.changeParam(["isSomeHour", event.target.value]);
    }

    render() {
        return (
            <div>
                <input className="input is-medium log-input mt-2" type="number" placeholder="Durée avant le lancement de l'action" id="time" value={this.state.time} onChange={this.handleChangeTime} required></input>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormClockIsSomeHour));