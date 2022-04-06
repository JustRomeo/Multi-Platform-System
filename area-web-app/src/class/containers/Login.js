import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from "react-toasts";

import axios from 'axios';

import { setUser, setToken, removeUser } from '../reducers/userActionCreators';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            log_error: false,

        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.displayFailToast = this.displayFailToast.bind(this);
    }

    componentWillMount() {
        this.props.removeUser();
    }

    async componentDidMount() {
        await axios.get(`https://back-area.herokuapp.com/service/getTempUser`)
        .then(res => {
            if (res.status !== 404)
                for (let key in res.data)
                    if (key === "token") {
                        let user = {username: res.data.user.username, id: res.data.user._id};
                        this.props.setUser(user);
                        this.props.setToken(res.data[key]);
                        this.props.history.push('/dashboard');
                    }
        })
        .catch((e) => {})
    }

    async handleLogin(event) {
        event.preventDefault();
        const {email, password} = this.state;
        await axios.post(`https://back-area.herokuapp.com/login`, {email: email, password: password}).then((response) => {
            if (response.status === 201) {
                for (let key in response.data)
                    if (key === "token") {
                        let user = {username: response.data.user.username, id: response.data.user._id};
                        this.props.setUser(user);
                        this.props.setToken(response.data[key]);
                        this.props.history.push('/dashboard');
                    }
            }
            else {
                this.displayFailToast("Mauvais Email ou mot de passe");
            }
        }).catch((error) => {
            this.setState({log_error: true});
            this.displayFailToast("Mauvais Email ou mot de passe");
        });
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
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
                        <Link to={{pathname: "/register"}} className="button top-button ml-4">S'INSCRIRE</Link>
                    </div>
                </div>
                <h1 className="title is-1 has-text-white">Actions.</h1>
                <div className="columns mt-2">
                    <div className="column is-3"></div>
                    <div className="column has-text-centered">
                        <div className="has-background-white log-box">
                            <h2 className="subtitle has-text-black is-3 mt-5">SE CONNECTER</h2>
                            <form action="/" method="POST" onSubmit={this.handleLogin}>
                                <div className="field"  style={{width: 80 + '%', marginLeft:10 + '%'}}>
                                    <p className="control has-icons-left">
                                        <input className="input is-medium log-input mt-2" type="email" placeholder="Email" id="email" value={this.state.email} onChange={this.handleChangeEmail} required></input>
                                        <span className="icon is-small is-left mt-2 ml-1">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className="field"  style={{width: 80 + '%', marginLeft:10 + '%'}}>
                                    <p className="control has-icons-left">
                                        <input className="input is-medium log-input mt-2" type="password" placeholder="Password" id="password" value={this.state.password} onChange={this.handleChangePassword} required></input>
                                        <span className="icon is-small is-left mt-2 ml-1 p-3">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </p>
                                </div>
                                <button className="button is-medium sub-button mt-4 mb-5">CONNEXION</button>
                            </form>
                        </div>
                    <a className="button is-rounded"  style={{width:95 + "%", marginTop:3 + "%"}} href="https://back-area.herokuapp.com/oauth/login/google">Se connecter avec Google</a>
                    <a className="button is-rounded is-info"  style={{width:95 + "%", marginTop:3 + "%"}} href="https://back-area.herokuapp.com/oauth/login/outlook">Se connecter avec Outlook</a>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));