import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class FormGoogleSendEmail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content_selected: true,
            event_selected: false,
            weather_selected: false,
            subject_email: "",
            mail_content: "",
            city: "",
            days: "",
            email: this.props.email("google"),
        };
        this.handleChangeSubjectEmail = this.handleChangeSubjectEmail.bind(this);
        this.handleChangeMailContent = this.handleChangeMailContent.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.handleChangeDays = this.handleChangeDays.bind(this);
        this.handleChangeFiltre = this.handleChangeFiltre.bind(this);
    }

    handleChangeSubjectEmail(event) {
        this.setState({subject_email: event.target.value});
        if (this.state.event_selected === true)
            this.props.changeParam(["sendEmail", this.state.email, event.target.value, "getEvent", this.state.days]);
        else if (this.state.weather_selected === true)
            this.props.changeParam(["sendEmail", this.state.email, event.target.value, "getWeather", this.state.city]);
        else
            this.props.changeParam(["sendEmail", this.state.email, event.target.value, this.state.mail_content]);
    }

    handleChangeMailContent(event) {
        this.setState({mail_content: event.target.value});
        this.props.changeParam(["sendEmail", this.state.email, this.state.subject_email, event.target.value]);
    }

    handleChangeCity(event) {
        this.setState({city: event.target.value});
        this.props.changeParam(["sendEmail", this.state.email, this.state.subject_email, "getWeather", event.target.value]);
    }

    handleChangeDays(event) {
        this.setState({days: event.target.value});
        this.props.changeParam(["sendEmail", this.state.email, this.state.subject_email, "getEvent", event.target.value]);
    }

    handleChangeFiltre(event) {
        if (event.value === "Contenu du mail")
            this.setState({content_selected: true, event_selected: false, weather_selected: false});
        if (event.value === "Renvoyer le calendrier")
            this.setState({content_selected: false, event_selected: true, weather_selected: false});
        if (event.value === "Renvoyer la météo de la journée")
            this.setState({content_selected: false, event_selected: false, weather_selected: true});
    }

    render() {
        const options = ["Contenu du mail", "Renvoyer le calendrier", "Renvoyer la météo de la journée"];
        const option_choosed = options[0];
        return (
            <div className="mt-2">
                <Dropdown options={options} onChange={this.handleChangeFiltre} value={option_choosed} placeholder="Selectionner une option" />
                <input className="input is-medium log-input mt-2" type="text" placeholder="Sujet du mail" id="subject_email" value={this.state.subject_email} onChange={this.handleChangeSubjectEmail} required></input>
                {this.state.content_selected === true ?
                    <input className="input is-medium log-input mt-2" type="text" placeholder="Contenu du mail" id="mail_content" value={this.state.mail_content} onChange={this.handleChangeMailContent} required></input>
                    : null
                }
                {this.state.weather_selected === true ?
                    <input className="input is-medium log-input mt-2" type="text" placeholder="Nom de la ville" id="city" value={this.state.city} onChange={this.handleChangeCity} required></input>
                    : null
                }
                {this.state.event_selected === true ?
                    <input className="input is-medium log-input mt-2" type="number" placeholder="Nombre de jours" id="days" value={this.state.days} onChange={this.handleChangeDays} required></input>
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

export default withRouter(connect(mapStateToProps)(FormGoogleSendEmail));