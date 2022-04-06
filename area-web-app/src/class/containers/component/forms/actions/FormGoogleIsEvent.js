import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class FormGoogleIsEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            number_of_days: "",
        };
        this.handleChangeNumberOfDays = this.handleChangeNumberOfDays.bind(this);
    }

    handleChangeNumberOfDays(event) {
        this.setState({number_of_days: event.target.value});
        this.props.changeParam(["isEvent", event.target.value]);
    }

    render() {
        return (
            <div>
                <input className="input is-medium log-input mt-2" type="number" placeholder="Nombre de jours" id="number_of_days" value={this.state.number_of_days} onChange={this.handleChangeNumberOfDays} required></input>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormGoogleIsEvent));