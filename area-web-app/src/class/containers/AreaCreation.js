import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from "react-toasts";

import Area from './component/Area'

import FormIntraEndOfProject from './component/forms/actions/FormIntraEndOfProject'
import FormWeatherIsTempUnder from './component/forms/actions/FormWeatherIsTempUnder'
import FormGoogleAsUnreadEmail from './component/forms/actions/FormGoogleAsUnreadEmail'
import FormGoogleIsEvent from './component/forms/actions/FormGoogleIsEvent'
import FormGoogleGetNewVideo from './component/forms/actions/FormGoogleGetNewVideo'
import FormOutlookAsUnreadEmail from './component/forms/actions/FormOutlookAsUnreadEmail'
import FormOutlookIsEvent from './component/forms/actions/FormOutlookIsEvent'
import FormSpotifyNewAlbum from './component/forms/actions/FormSpotifyNewAlbum'
import FormCurrencyIsCurrencyUnder from './component/forms/actions/FormCurrencyIsCurrencyUnder'
import FormClockIsSomeHour from './component/forms/actions/FormClockIsSomeHour'

import FormGoogleSendEmail from './component/forms/reactions/FormGoogleSendEmail'
import FormGoogleCreateEvent from './component/forms/reactions/FormGoogleCreateEvent'
import FormGoogleAddVideoToWatchLater from './component/forms/reactions/FormGoogleAddVideoToWatchLater'
import FormOutlookSendEmail from './component/forms/reactions/FormOutlookSendEmail'
import FormOutlookCreateEvent from './component/forms/reactions/FormOutlookCreateEvent'
import FormSpotifyAddToSaveTracks from './component/forms/reactions/FormSpotifyAddToSaveTracks'

const delay = time => new Promise(
    rest => setTimeout(rest, time)
);

class AreaCreation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            action_proposed: ["Fin de semaine", "Heure", "Bourse", "Météo"],
            action_forms: null,
            reaction_proposed: [],
            reaction_forms: null,

            action_selected: false,
            reaction_selected: false,

            actionService: null,
            actionParameter: [],
            reactionService: null,
            reactionParameter: [],

            token_list: null,
        };
        this.handleChangeAction = this.handleChangeAction.bind(this);
        this.handleChangeReaction = this.handleChangeReaction.bind(this);
        this.actionToReaction = this.actionToReaction.bind(this);
        this.changeActionParameter = this.changeActionParameter.bind(this);
        this.changeReactionParameter = this.changeReactionParameter.bind(this);
        this.createNewArea = this.createNewArea.bind(this);
        this.getEmail = this.getEmail.bind(this);
        this.displayFailToast = this.displayFailToast.bind(this);
        this.displaySuccessToast = this.displaySuccessToast.bind(this);
    }

    async componentDidMount() {
        await axios.get(`https://back-area.herokuapp.com/getServiceToken`,
            {
                headers: {
                    'Authorization': this.props.user.token,
                }
            })
            .then(res => {
                if (res.status === 200) {
                    res.data.tokenList.forEach(elem => {
                        if (elem.service === "intra") {
                            this.setState(prevState => ({ action_proposed: [...prevState.action_proposed, "Intra: GPA", "Intra: Crédits", "Intra: Notification", "Intra: Absence", "Intra: Fin de projet"] }));
                        }
                        else if (elem.service === "google") {
                            this.setState(prevState => ({ action_proposed: [...prevState.action_proposed, "Google: Mail non lu", "Google: Vérifier les évènements", "Google: Nouvelle vidéo youtube"] }));
                        }
                        else if (elem.service === "outlook") {
                            this.setState(prevState => ({ action_proposed: [...prevState.action_proposed, "Outlook: Mail non lu", "Outlook: Vérifier les évènements"] }));
                        }
                        else if (elem.service === "spotify") {
                            this.setState(prevState => ({ action_proposed: [...prevState.action_proposed, "Spotify: Nouvel album",] }));
                        }
                    });
                    this.setState({ token_list: res.data.tokenList });
                }
            })
            .catch((e) => { })
    }

    actionToReaction(name) {
        this.setState({ reaction_proposed: [] });
        this.state.token_list.forEach(elem => {
            if (elem.service === "google") {
                this.setState(prevState => ({ reaction_proposed: [...prevState.reaction_proposed, "Google: Envoyer un mail", "Google: Créer un évènement", "Google: Ajouter la vidéo dans une playlist"] }));
            }
            else if (elem.service === "outlook") {
                this.setState(prevState => ({ reaction_proposed: [...prevState.reaction_proposed, "Outlook: Envoyer un mail", "Outlook: Créer un évènement"] }));
            }
            else if (elem.service === "spotify") {
                this.setState(prevState => ({ reaction_proposed: [...prevState.reaction_proposed, "Spotify: Ajouter un nouvel album",] }));
            }
        });
    }

    changeActionParameter(param) {
        this.setState({ actionParameter: param });
    }

    changeReactionParameter(param) {
        this.setState({ reactionParameter: param });
    }

    async createNewArea(event) {
        event.preventDefault();
        const { actionService: actionService, actionParameter: actionParameter, reactionService: reactionService, reactionParameter: reactionParameter } = this.state;
        await axios.post(`https://back-area.herokuapp.com/area/AddAREA`,
            {
                actionService: actionService,
                actionParameter: actionParameter,
                reactionService: reactionService,
                reactionParameter: reactionParameter,
                data: "",
            },
            { headers: { 'Authorization': this.props.user.token, } }).then(async (response) => {
                if (response.status === 201) {
                    this.props.areas.push(<Area key={this.props.area_key} key_index={this.props.area_key} id={response.data._id} delete_area={this.props.delete_area.bind(this)} data={response.data} modify_area={this.props.modify_area}/>);
                    this.props.incr_key();
                    this.displaySuccessToast("Votre AREA a été créé");
                    await delay(2000);
                    this.props.history.push('/dashboard');
                }
            }).catch((error) => {
                this.displayFailToast("L'AREA n'a pas pu être créé");
            });
    }

    getEmail(service) {
        var email = "";
        this.state.token_list.forEach(elem => {
            if (elem.service === service)
                email = elem.email;
        });
        return (email);
    }

    handleChangeAction(res) {
        this.setState({ action_selected: true, reaction_selected: false });
        switch (res.value) {
            case "Fin de semaine": this.setState({ action_forms: <div>Aucun paramètres requis</div>, actionService: "Clock", actionParameter: ["isEndOfWeek"] }); this.actionToReaction("Fin de semaine"); break;
            case "Heure": this.setState({ action_forms: <FormClockIsSomeHour changeParam={this.changeActionParameter.bind(this)} />, actionService: "Clock", actionParameter: ["isSomeHour"] }); this.actionToReaction("Heure"); break;
            case "Bourse": this.setState({ action_forms: <FormCurrencyIsCurrencyUnder changeParam={this.changeActionParameter.bind(this)} />, actionService: "Currency", actionParameter: ["isCurrencyUnder", "AUD", "1"] }); this.actionToReaction("Bourse"); break;
            case "Météo": this.setState({ action_forms: <FormWeatherIsTempUnder changeParam={this.changeActionParameter.bind(this)} />, actionService: "Weather", actionParameter: ["isTempUnder"] }); this.actionToReaction("Météo"); break;
            case "Intra: GPA": this.setState({ action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: ["getGPA"] }); this.actionToReaction("Intra: GPA"); break;
            case "Intra: Crédits": this.setState({ action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: ["getCredits"] }); this.actionToReaction("Intra: Crédits"); break;
            case "Intra: Notification": this.setState({ action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: ["getNotification"] }); this.actionToReaction("Intra: Notification"); break;
            case "Intra: Absence": this.setState({ action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: ["getMissed"] }); this.actionToReaction("Intra: Absence"); break;
            case "Intra: Fin de projet": this.setState({ action_forms: <FormIntraEndOfProject changeParam={this.changeActionParameter.bind(this)} />, actionService: "Epitech", actionParameter: ["getEndProject"] }); this.actionToReaction("Intra: Fin de projet"); break;
            case "Google: Mail non lu": this.setState({ action_forms: <FormGoogleAsUnreadEmail changeParam={this.changeActionParameter.bind(this)} />, actionService: "Google", actionParameter: ["asUnreadEmail"] }); this.actionToReaction("Google: Mail non lu"); break;
            case "Google: Vérifier les évènements": this.setState({ action_forms: <FormGoogleIsEvent changeParam={this.changeActionParameter.bind(this)} />, actionService: "Google", actionParameter: ["isEvent"] }); this.actionToReaction("Google: Vérifier les évènements"); break;
            case "Google: Nouvelle vidéo youtube": this.setState({ action_forms: <FormGoogleGetNewVideo changeParam={this.changeActionParameter.bind(this)} />, actionService: "Google", actionParameter: ["getNewVideo"] }); this.actionToReaction("Google: Nouvelle vidéo youtube"); break;
            case "Outlook: Mail non lu": this.setState({ action_forms: <FormOutlookAsUnreadEmail changeParam={this.changeActionParameter.bind(this)} />, actionService: "Outlook", actionParameter: ["asUnreadEmail"] }); this.actionToReaction("Outlook: Mail non lu"); break;
            case "Outlook: Vérifier les évènements": this.setState({ action_forms: <FormOutlookIsEvent changeParam={this.changeActionParameter.bind(this)} />, actionService: "Outlook", actionParameter: ["isEvent"] }); this.actionToReaction("Outlook: Vérifier les évènements"); break;
            case "Spotify: Nouvel album": this.setState({ action_forms: <FormSpotifyNewAlbum changeParam={this.changeActionParameter.bind(this)} />, actionService: "Spotify", actionParameter: ["newAlbum"] }); this.actionToReaction("Spotify: Nouvel album"); break;
            default: this.setState({ action_forms: null, action_selected: false, reaction_selected: false }); return;
        }
    }

    handleChangeReaction(res) {
        this.setState({ reaction_selected: true })
        switch (res.value) {
            case "Google: Envoyer un mail": this.setState({ reaction_forms: <FormGoogleSendEmail changeParam={this.changeReactionParameter.bind(this)} email={this.getEmail.bind(this)} />, reactionService: "Google", reactionParameter: ["sendEmail"] }); break;
            case "Google: Créer un évènement": this.setState({ reaction_forms: <FormGoogleCreateEvent changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Google", reactionParameter: ["createEvent"] }); break;
            case "Google: Ajouter la vidéo dans une playlist": this.setState({ reaction_forms: <FormGoogleAddVideoToWatchLater changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Google", reactionParameter: ["addVideoToWatchLater", "", "getNewVideo", ""] }); break;
            case "Outlook: Envoyer un mail": this.setState({ reaction_forms: <FormOutlookSendEmail changeParam={this.changeReactionParameter.bind(this)} email={this.getEmail.bind(this)} />, reactionService: "Outlook", reactionParameter: ["sendEmail"] }); break;
            case "Outlook: Créer un évènement": this.setState({ reaction_forms: <FormOutlookCreateEvent changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Outlook", reactionParameter: ["createEvent"] }); break;
            case "Spotify: Ajouter un nouvel album": this.setState({ reaction_forms: <FormSpotifyAddToSaveTracks changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Spotify", reactionParameter: ["addToSavedTracks", "newAlbum"] }); break;
            default: return;
        }
    }

    displaySuccessToast(str) {
        ToastsStore.success(str);
    }

    displayFailToast(str) {
        ToastsStore.error(str);
    }

    render() {
        const action_choosed = null;
        const reaction_choosed = null;
        return (
            <div className="columns is-multiline pl-6 ml-6">
                <div className="column is-2" />
                <form action="/" method="POST" onSubmit={this.createNewArea} className="column">
                    <p className="is-size-5 mb-2">Quand :</p>
                    <Dropdown options={this.state.action_proposed} onChange={this.handleChangeAction} value={action_choosed} placeholder="Selectionner une option" className="" />
                    {this.state.action_selected === true ?
                        <div>
                            {this.state.action_forms}
                            <hr className="solid"/>
                            <p className="is-size-5 mb-2 mt-5">Alors :</p>
                            <Dropdown options={this.state.reaction_proposed} onChange={this.handleChangeReaction} value={reaction_choosed} placeholder="Selectionner une réaction" className="mt-4" />
                            {this.state.reaction_selected === true ?
                                <div>
                                    {this.state.reaction_forms}
                                    <hr className="solid"/>
                                    <button className="button is-success is-fullwidth is-rounded is-large">Terminer votre AREA</button>
                                </div>
                                : null
                            }
                        </div>
                        : null
                    }
                </form>
                <div className="column is-2" />
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

export default withRouter(connect(mapStateToProps)(AreaCreation));