import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from "react-toasts";


class Services extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email_intra: "",
            autologin_intra: "",
            service_intra: false,
            service_google: false,
            service_outlook: false,
            service_spotify: false,
        };

        this.displayFailToast = this.displayFailToast.bind(this);
        this.displaySuccessToast = this.displaySuccessToast.bind(this);
        this.handleIntraRegistration = this.handleIntraRegistration.bind(this);
        this.handleChangeEmailIntra = this.handleChangeEmailIntra.bind(this);
        this.handleChangeAutologinIntra = this.handleChangeAutologinIntra.bind(this);
        this.handleRemoveService = this.handleRemoveService.bind(this);
    }

    displaySuccessToast(str) {
        ToastsStore.success(str);
    }

    displayFailToast(str) {
        ToastsStore.error(str);
    }

    handleChangeEmailIntra(event) {
        this.setState({ email_intra: event.target.value });
    }

    handleChangeAutologinIntra(event) {
        this.setState({ autologin_intra: event.target.value });
    }

    async handleIntraRegistration(event) {
        event.preventDefault();
        const { autologin_intra, email_intra } = this.state;
        await axios.post(`https://back-area.herokuapp.com/addIntraToken`,
            { token: autologin_intra, email: email_intra },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.props.user.token,
                }
            }).then((response) => {
                if (response.status === 200) {
                    this.props.changeStateIntraService(true);
                    this.displaySuccessToast("L'inscription au service intra a réussie");
                }
            }).catch((error) => {
                this.displayFailToast("L'inscription au service intra a échoué");
            });
    }

    async handleRemoveService(service) {
        await axios.post(`https://back-area.herokuapp.com/removeServiceToken`,
            { service: service },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.props.user.token,
                }
            }).then((response) => {
                if (response.status === 200) {
                    if (service === "intra") {
                        this.props.changeStateIntraService(false);
                        this.displaySuccessToast("La désinscription au service intra a réussie");
                    }
                    else if (service === "google") {
                        this.props.changeStateGoogleService(false);
                        this.displaySuccessToast("La désinscription au service google a réussie");
                    }
                    else if (service === "outlook") {
                        this.props.changeStateOutlookService(false);
                        this.displaySuccessToast("La désinscription au service outlook a réussie");
                    }
                    else if (service === "spotify") {
                        this.props.changeStateSpotifyService(false);
                        this.displaySuccessToast("La désinscription au service spotify a réussie");
                    }
                }
            }).catch((error) => {
                this.displayFailToast("La désinscription au service intra a échoué");
            });
    }

    render() {
        return (
            <div>
                <div className="columns is-multiline pl-6 ml-6">
                    <div className="column is-one-quarter ml-6 mb-5 an-action">
                        <div className="white-gradient p-5">
                            <figure className="image is-5by2 m-3">
                              <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c51f.png"/>
                            </figure>
                    {this.props.service_google === false ?
                        <a className="button is-rounded"  style={{width:95 + "%", marginTop:3 + "%"}} href={`https://back-area.herokuapp.com/service/addService/google?id=${this.props.user.id}`}>S'abonner avec Google</a>
                        : <button className="button is-danger" onClick={() => this.handleRemoveService("google")}>Se désabonner</button>

                    }
                                            </div>
                    </div>
                    <div className="column is-one-quarter ml-6 mb-5 an-action">
                        <div className="white-gradient p-5">
                        <figure className="image is-5by2 m-3">
                              <img src="https://www.klood.io/wp-content/uploads/2014/02/outlook-logo-1.png"/>
                            </figure>
                    {this.props.service_outlook === false ?
                        <a className="button is-rounded"  style={{width:95 + "%", marginTop:3 + "%"}} href={`https://back-area.herokuapp.com/service/addService/outlook?id=${this.props.user.id}`}>S'abonner avec Outlook</a>
                        : <button className="button is-danger" onClick={() => this.handleRemoveService("outlook")}>Se Désabonner</button>

                    }

                </div>
                    </div>
                    <div className="column is-one-quarter ml-6 mb-5 an-action">
                        <div className="white-gradient p-5">
                        <figure className="image is-5by2 m-3 mb-4">
                              <img src="https://newsroom.ionis-group.com/wp-content/uploads/2018/12/epitech-logo-quadri.png"/>
                            </figure>
                    {this.props.service_intra === false ?
                        <form action="/" method="POST" onSubmit={this.handleIntraRegistration}>
                            <input type="email" placeholder="Email Intra" id="email_intra" value={this.state.email_intra} onChange={this.handleChangeEmailIntra} required></input>
                            <input placeholder="Autologin Intra" id="autologin_intra" value={this.state.autologin_intra} onChange={this.handleChangeAutologinIntra} required></input>
                            <button>Intra Login</button>
                        </form>
                        : <button className="button is-danger" onClick={() => this.handleRemoveService("intra")}>Se Désabonner</button>
                    }

                </div>
                    </div>
                    <div className="column is-one-quarter ml-6 mb-5 an-action">
                        <div className="white-gradient p-5">
                        <figure className="image is-5by2 m-3 mb-4">
                              <img src="https://logo-marque.com/wp-content/uploads/2020/09/Spotify-Logo.png"/>
                            </figure>
                    {this.props.service_spotify === false ?
                        <a className="button is-rounded"  style={{width:95 + "%", marginTop:3 + "%"}} href={`https://back-area.herokuapp.com/service/addService/spotify?id=${this.props.user.id}`}>S'abonner avec Spotify</a>
                        : <button className="button is-danger" onClick={() => this.handleRemoveService("spotify")}>Se Désabonner</button>
                    }
                        </div>
                    </div>
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

export default withRouter(connect(mapStateToProps)(Services));