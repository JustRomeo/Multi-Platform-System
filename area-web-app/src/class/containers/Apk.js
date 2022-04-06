import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Apk extends Component {

    render() {
        return (
            <div className="login-page has-text-centered">
                <div className="columns mt-2">
                    <div className="column is-10"></div>
                    <div className="column">
                        <Link to={{ pathname: "/" }} className="button top-button ml-4" onClick="">SE CONNECTER</Link>
                    </div>
                </div>
                <h1 className="title is-1 has-text-white">Actions.</h1>
                <div className="columns mt-2">
                    <div className="column is-3"></div>
                    <div className="column has-text-centered">
                        <div className="has-background-white log-box">
                            <h2 className="subtitle has-text-black is-3 mt-5">Télécharger l'application</h2>
                            <p className="subtitle has-text-black is-6 mx-6">Utiliser notre application Android disponible en téléchargant le fichier APK ci-dessous.</p>
                            <Link to="/img/app-release.apk" target="_blank" className="button is-link mb-5" download>Télécharger</Link>
                        </div>
                    </div>
                    <div className="column is-3"></div>
                </div>
            </div>
        );
    }
}

export default withRouter((Apk));