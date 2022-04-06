import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from "react-toasts";

import { setUser, setToken, removeUser } from '../reducers/userActionCreators';

const delay = time => new Promise(
    rest => setTimeout(rest, time)
);

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            password_verif: "",
            error_password: false,
            error_email_alreay_used: false,
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangePasswordVerif = this.handleChangePasswordVerif.bind(this);
        this.displayFailToast = this.displayFailToast.bind(this);
        this.displaySuccessToast = this.displaySuccessToast.bind(this);
    }

    async handleRegister(event) {
        event.preventDefault();
        const {username, email, password} = this.state;
        if (this.state.password !== this.state.password_verif) {
            this.setState({error_password: true});
            this.displayFailToast("Vérification du mot de passe non valide");
            return;
        }
        this.setState({error_password: false});
        await axios.post(`https://back-area.herokuapp.com/register`, {username: username, email: email, password: password}).then(async (response) => {
            if (response.status === 201 && response.statusText === "Created") {
                this.displaySuccessToast("Votre compte a été créé");
                await delay(3000);
                this.props.history.push('../');
            }
            else {
                this.displayFailToast("Email déjà utilisé");
            }
        }).catch((error) => {
            this.setState({error_email_alreay_used: true});
            this.displayFailToast("Email déjà utilisé");
        });
    }

    handleChangeUsername(event) {
        this.setState({username: event.target.value});
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    handleChangePasswordVerif(event) {
        this.setState({password_verif: event.target.value});
    }

    displaySuccessToast(str) {
        ToastsStore.success(str);
    }

    displayFailToast(str) {
        ToastsStore.error(str);
    }

    render() {
        return (
            <div className="login-page has-text-centered">
                <div className="columns mt-2">
                    <div className="column is-10"></div>
                    <div className="column">
                        <Link to={{pathname: "/"}} className="button top-button ml-4" onClick="">SE CONNECTER</Link>
                    </div>
                </div>
                <h1 className="title is-1 has-text-white">Actions.</h1>
                <div className="columns mt-2">
                    <div className="column is-3"></div>
                    <div className="column has-text-centered">
                        <div className="has-background-white log-box">
                            <h2 className="subtitle has-text-black is-3 mt-5">S'INSCRIRE</h2>
                            <form action="/" method="POST" onSubmit={this.handleRegister}>
                                <div className="field" style={{ width: 80 + '%', marginLeft: 10 + '%' }}>
                                    <p className="control has-icons-left">
                                        <input className="input is-medium log-input mt-2" type="text" placeholder="Nom d'utilisateur" name="username" id="username" value={this.state.username} onChange={this.handleChangeUsername} required minLength={4}></input>
                                        <span className="icon is-small is-left mt-2 ml-1">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className="field" style={{ width: 80 + '%', marginLeft: 10 + '%' }}>
                                    <p className="control has-icons-left">
                                        <input className="input is-medium log-input mt-2" type="mail" placeholder="Email" name="email" id="email" value={this.state.email} onChange={this.handleChangeEmail} required></input>
                                        <span className="icon is-small is-left mt-2 ml-1 p-3">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className="field" style={{ width: 80 + '%', marginLeft: 10 + '%' }}>
                                    <p className="control has-icons-left">
                                        <input className="input is-medium log-input mt-2" type="password" placeholder="Mot de Passe" name="password" id="password" value={this.state.password} onChange={this.handleChangePassword} required minLength={8}></input>
                                        <span className="icon is-small is-left mt-2 ml-1 p-3">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className="field" style={{ width: 80 + '%', marginLeft: 10 + '%' }}>
                                    <p className="control has-icons-left">
                                        <input className="input is-medium log-input mt-2" type="password" placeholder="Confirmez votre mot de passe"  name="password_verif" id="password_verif" value={this.state.password_verif} onChange={this.handleChangePasswordVerif} required minLength={8}></input>
                                        <span className="icon is-small is-left mt-2 ml-1 p-3">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </p>
                                </div>
                                <button className="button is-medium sub-button mt-4 mb-5">INSCRIPTION</button>
                            </form>
                        </div>
                    </div>
                    <div className="column is-3"></div>
                </div>
                <ToastsContainer
                    className="toast-cst"
                    store={ToastsStore}
                    position={ToastsContainerPosition.BOTTOM_CENTER}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    setUser,
    setToken,
    removeUser,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register));