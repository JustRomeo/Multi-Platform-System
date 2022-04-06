import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class FormOutlookCreateEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subject: "",
            time_start: "",
            time_end: "",
            time_start_selected: false,
            time_end_selected: false,
        };
        this.handleChangeSubject = this.handleChangeSubject.bind(this);
        this.handleChangeTimeStart = this.handleChangeTimeStart.bind(this);
        this.handleChangeTimeEnd = this.handleChangeTimeEnd.bind(this);
        this.handleChangeFiltreTimeStart = this.handleChangeFiltreTimeStart.bind(this);
        this.handleChangeFiltreTimeEnd = this.handleChangeFiltreTimeEnd.bind(this);
    }

    handleChangeSubject(event) {
        this.setState({subject: event.target.value});
        this.props.changeParam(["createEvent", event.target.value, this.state.time_start, this.state.time_end]);
    }

    handleChangeTimeStart(event) {
        var c = event.target.value.substr(event.target.value.length - 1);
        var new_value = event.target.value;

        if(this.state.time_start.length > event.target.value.length) {
            if (event.target.value.length === 4 || event.target.value.length === 7)
                new_value = event.target.value.substr(0, event.target.value.length - 1);
            if (event.target.value.length === 23)
                new_value = event.target.value.substr(0, event.target.value.length - 5);
            if (event.target.value.length === 10)
                new_value = event.target.value.substr(0, event.target.value.length - 1);
            if (event.target.value.length === 13 || event.target.value.length === 16)
                new_value = event.target.value.substr(0, event.target.value.length - 1);
            this.setState({time_start: new_value});
            this.props.changeParam(["createEvent", this.state.subject, new_value, this.state.time_end]);
            return;
        }
        if (event.target.value.length == 0) {
            this.setState({time_start: event.target.value});
            this.props.changeParam(["createEvent", this.state.subject, new_value, this.state.time_end]);
            return;
        }
        if (c >= '0' && c <= '9') {
            if (event.target.value.length === 4 || event.target.value.length === 7)
                new_value += '-';
            if (event.target.value.length === 19)
                new_value += ':000Z';
            if (event.target.value.length === 10)
                new_value += 'T';
            if (event.target.value.length === 13 || event.target.value.length === 16)
                new_value += ':';
            if (event.target.value.length >= 20)
                return;
            this.setState({time_start: new_value});
            this.props.changeParam(["createEvent", this.state.subject, new_value, this.state.time_end]);
        }
    }

    handleChangeTimeEnd(event) {
        var c = event.target.value.substr(event.target.value.length - 1);
        var new_value = event.target.value;

        if(this.state.time_end.length > event.target.value.length) {
            if (event.target.value.length === 4 || event.target.value.length === 7)
                new_value = event.target.value.substr(0, event.target.value.length - 1);
            if (event.target.value.length === 23)
                new_value = event.target.value.substr(0, event.target.value.length - 5);
            if (event.target.value.length === 10)
                new_value = event.target.value.substr(0, event.target.value.length - 1);
            if (event.target.value.length === 13 || event.target.value.length === 16)
                new_value = event.target.value.substr(0, event.target.value.length - 1);
            this.setState({time_end: new_value});
            this.props.changeParam(["createEvent", this.state.subject, new_value, this.state.time_end]);
            return;
        }
        if (event.target.value.length == 0) {
            this.setState({time_end: event.target.value});
            this.props.changeParam(["createEvent", this.state.subject, new_value, this.state.time_end]);
            return;
        }
        if (c >= '0' && c <= '9') {
            if (event.target.value.length === 4 || event.target.value.length === 7)
                new_value += '-';
            if (event.target.value.length === 19)
                new_value += ':000Z';
            if (event.target.value.length === 10)
                new_value += 'T';
            if (event.target.value.length === 13 || event.target.value.length === 16)
                new_value += ':';
            if (event.target.value.length >= 20)
                return;
            this.setState({time_end: new_value});
            this.props.changeParam(["createEvent", this.state.subject, this.state.time_start, new_value]);
        }
    }

    handleChangeFiltreTimeStart(event) {
        if (event.value === "Début: Date précise")
            this.setState({time_start_selected: false, time_start: ""});
        else {
            this.setState({time_start_selected: true, time_start: "night"});
            this.props.changeParam(["createEvent", this.state.subject, "night", this.state.time_end]);
        }
    }

    handleChangeFiltreTimeEnd(event) {
        if (event.value === "Fin: Date précise")
            this.setState({time_end_selected: false, time_end: ""});
        else {
            this.setState({time_end_selected: true, time_end: "night"});
            this.props.changeParam(["createEvent", this.state.subject, this.state.time_start, "night"]);
        }

    }

    render() {
        const options_start = ["Début: Date précise", "Début: Aujourd'hui (19h)"];
        const option_start_choosed = options_start[0];
        const options_end = ["Fin: Date précise", "Fin: Aujourd'hui (20h)"];
        const option_end_choosed = options_end[0];

        return (
            <div>
                <input className="input is-medium log-input mt-2" type="text" placeholder="Nom du projet" id="subject" value={this.state.subject} onChange={this.handleChangeSubject} required></input>
                <Dropdown options={options_start} onChange={this.handleChangeFiltreTimeStart} value={option_start_choosed} placeholder="Selectionner une option" />
                {this.state.time_start_selected === false ?
                    <input className="input is-medium log-input mt-2" type="text" placeholder="2021-04-21T12:30:00" id="time" value={this.state.time_start} onChange={this.handleChangeTimeStart} required></input>
                    : null
                }
                <Dropdown options={options_end} onChange={this.handleChangeFiltreTimeEnd} value={option_end_choosed} placeholder="Selectionner une option" />
                {this.state.time_end_selected === false ?
                    <input className="input is-medium log-input mt-2" type="text" placeholder="2021-04-21T12:30:00" id="time" value={this.state.time_end} onChange={this.handleChangeTimeEnd} required></input>
                    : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormOutlookCreateEvent));