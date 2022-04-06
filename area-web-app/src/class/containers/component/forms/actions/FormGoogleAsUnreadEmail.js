import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class FormGoogleAsUnreadEmail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filtre_email_selected: false,
            filtre_subject_selected: false,
            filtre_subject: "",
            filtre_email: "",
        };
        this.handleChangeFiltreEmail = this.handleChangeFiltreEmail.bind(this);
        this.handleChangeFiltreSubject = this.handleChangeFiltreSubject.bind(this);
        this.handleChangeFiltre = this.handleChangeFiltre.bind(this);
    }

    handleChangeFiltreEmail(event) {
        this.setState({filtre_email: event.target.value});
        this.props.changeParam(["asUnreadEmail", "from", event.target.value]);
    }

    handleChangeFiltreSubject(event) {
        this.setState({filtre_subject: event.target.value});
        this.props.changeParam(["asUnreadEmail", "subject", event.target.value]);
    }

    handleChangeFiltre(event) {
        switch(event.value) {
            case "Envoyé par": this.setState({filtre_email_selected: true, filtre_subject_selected: false}); break;
            case "Sujet": this.setState({filtre_subject_selected: true, filtre_email_selected: false}); break;
            default: this.setState({filtre_email_selected: false, filtre_subject_selected: false}); this.props.changeParam(["asUnreadEmail"]);break;
        }
    }

    render() {
        const options = ["Aucun filtre", "Envoyé par", "Sujet"];
        const option_choosed = options[0];
        return (
            <div>
                <Dropdown options={options} onChange={this.handleChangeFiltre} value={option_choosed} placeholder="Selectionner une option" />
                {this.state.filtre_email_selected === true ?
                    <input className="input is-medium log-input mt-2" type="email" placeholder="Email de l'envoyeur" id="filtre_email" value={this.state.filtre_email} onChange={this.handleChangeFiltreEmail} required></input>
                : null}
                {this.state.filtre_subject_selected === true ?
                    <input className="input is-medium log-input mt-2" type="text" placeholder="Sujet du mail" id="filtre_subject" value={this.state.filtre_subject} onChange={this.handleChangeFiltreSubject} required></input>
                : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormGoogleAsUnreadEmail));