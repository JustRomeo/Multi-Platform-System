import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
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

class AreaModification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            action_forms: null,
            reaction_forms: null,

            actionService: null,
            actionParameter: [],
            reactionService: null,
            reactionParameter: [],

            action_name: "",
            reaction_name: "",

            id_area: null,
            key_area: null,

            token_list: null,
        };
        this.loadActionForm = this.loadActionForm.bind(this);
        this.loadReactionForm = this.loadReactionForm.bind(this);
        this.changeActionParameter = this.changeActionParameter.bind(this);
        this.changeReactionParameter = this.changeReactionParameter.bind(this);
        this.modifyArea = this.modifyArea.bind(this);
        this.getEmail = this.getEmail.bind(this);
        this.displayFailToast = this.displayFailToast.bind(this);
        this.displaySuccessToast = this.displaySuccessToast.bind(this);
    }

    async componentDidMount() {
        if (this.props.areas.length <= 0) {
            this.setState({
                action_forms: null,
                reaction_forms: null,
                actionService: null,
                actionParameter: [],
                reactionService: null,
                reactionParameter: [],
                action_name: "",
                reaction_name: "",
                id_area: null,
                key_area: null,
                token_list: null,});
        }
        else {
            this.setState({
                id_area: this.props.area_id,
                key_area: this.props.area_key,
            });
        }
        await axios.get(`https://back-area.herokuapp.com/getServiceToken`,
            {headers: {'Authorization': this.props.user.token,}
        }).then(res => {
            if (res.status === 200) {
                this.setState({ token_list: res.data.tokenList });
            }
        })
        .catch((e) => { })
        if (this.props.data !== null) {
            this.loadActionForm();
            this.loadReactionForm();
        }
    }

    changeActionParameter(param) {
        this.setState({ actionParameter: param });
    }

    changeReactionParameter(param) {
        this.setState({ reactionParameter: param });
    }

    async modifyArea(event) {
        event.preventDefault();
        var id = this.props.area_id;
        const { actionService: actionService, actionParameter: actionParameter, reactionService: reactionService, reactionParameter: reactionParameter } = this.state;
        await axios.post(`https://back-area.herokuapp.com/area/modifyArea`,
            {
                id: id,
                actionService: actionService,
                actionParameter: actionParameter,
                reactionService: reactionService,
                reactionParameter: reactionParameter,
                data: "",
            },
            { headers: { 'Authorization': this.props.user.token, } }).then(async (response) => {
                if (response.status === 200) {
                    let count = 0;
                    this.props.list_deleted_areas.forEach(nb => {
                        if (nb < this.props.area_key)
                            count++;
                    });
                    this.props.areas[this.props.area_key - count] = <Area key={this.props.area_key} key_index={this.props.area_key} id={this.props.area_id} delete_area={this.props.delete_area.bind(this)} modify_area={this.props.modify_area}
                        data={{
                                _id: id,
                                Action: actionService,
                                ActionParameter: actionParameter,
                                Reaction: reactionService,
                                ReactionParameter: reactionParameter,
                        }}/>;
                    this.displaySuccessToast("Votre AREA a été modifié");
                    await delay(2000);
                    this.props.history.push('/dashboard');
                }
            }).catch((error) => {
                this.displayFailToast("L'AREA n'a pas pu être modifié");
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

    loadActionForm() {
        switch(this.props.data.ActionParameter[0]) {
            case "asUnreadEmail":
                if (this.props.data.Action === "Google")
                    this.setState({action_forms: <FormGoogleAsUnreadEmail changeParam={this.changeActionParameter.bind(this)} />, actionService: "Google", actionParameter: this.props.data.ActionParameter, action_name: "Email non lu (Google)"});
                else
                    this.setState({action_forms: <FormOutlookAsUnreadEmail changeParam={this.changeActionParameter.bind(this)} />, actionService: "Outlook", actionParameter: this.props.data.ActionParameter, action_name: "Email non lu (Outlook)"});
                break;
            case "isEvent":
                if (this.props.data.Action === "Google")
                    this.setState({action_forms: <FormGoogleIsEvent changeParam={this.changeActionParameter.bind(this)} />, actionService: "Google", actionParameter: this.props.data.ActionParameter, action_name: "Evènement (Google)"});
                else
                    this.setState({action_forms: <FormOutlookIsEvent changeParam={this.changeActionParameter.bind(this)} />, actionService: "Outlook", actionParameter: this.props.data.ActionParameter, action_name: "Evènement (Outlook)"});
                break;
            case "isEndOfWeek": this.setState({action_forms: <div>Aucun paramètres requis</div>, actionService: "Clock", actionParameter: this.props.data.ActionParameter, action_name: "C'est la fin de semaine"}); break;
            case "isSomeHour": this.setState({action_forms: <FormClockIsSomeHour changeParam={this.changeActionParameter.bind(this)} />, actionService: "Clock", actionParameter: this.props.data.ActionParameter, action_name: "Il est"}); break;
            case "isCurrencyUnder": this.setState({action_forms: <FormCurrencyIsCurrencyUnder changeParam={this.changeActionParameter.bind(this)} />, actionService: "Currency", actionParameter: this.props.data.ActionParameter, action_name: "La monnaie"}); break;
            case "isTempUnder": this.setState({action_forms: <FormWeatherIsTempUnder changeParam={this.changeActionParameter.bind(this)} />, actionService: "Weather", actionParameter: this.props.data.ActionParameter, action_name: "Il fait moins de"}); break;
            case "getGPA": this.setState({action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: this.props.data.ActionParameter, action_name: "Le GPA change (Intra)"}); break;
            case "getCredits": this.setState({action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: this.props.data.ActionParameter, action_name: "Le nombre de Crédits change (Intra)"}); break;
            case "getNotification": this.setState({action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: this.props.data.ActionParameter, action_name: "J'ai une notification (Intra)"}); break;
            case "getMissed": this.setState({action_forms: <div>Aucun paramètres requis</div>, actionService: "Epitech", actionParameter: this.props.data.ActionParameter, action_name: "J'ai une absence (Intra)"}); break;
            case "getEndProject": this.setState({action_forms: <FormIntraEndOfProject changeParam={this.changeActionParameter.bind(this)} />, actionService: "Epitech", actionParameter: this.props.data.ActionParameter, action_name: "C'est la fin du projet (Intra)"}); break;
            case "getNewVideo": this.setState({action_forms: <FormGoogleGetNewVideo changeParam={this.changeActionParameter.bind(this)} />, actionService: "Google", actionParameter: this.props.data.ActionParameter, action_name: "Une nouvelle vidéo est sortie de (Google)"}); break;
            case "newAlbum": this.setState({action_forms: <FormSpotifyNewAlbum changeParam={this.changeActionParameter.bind(this)} />, actionService: "Spotify", actionParameter: this.props.data.ActionParameter, action_name: "Un nouvel album est sorti de (Spotify)"}); break;
            default: return;
        }
    }

    loadReactionForm() {
        switch(this.props.data.ReactionParameter[0]) {
            case "sendEmail":
                if (this.props.data.Reaction === "Google")
                    this.setState({reaction_forms: <FormGoogleSendEmail changeParam={this.changeReactionParameter.bind(this)} email={this.getEmail.bind(this)} />, reactionService: "Google", reactionParameter: this.props.data.ReactionParameter, reaction_name: "J'envoie un mail (Google)"});
                else
                    this.setState({reaction_forms: <FormOutlookSendEmail changeParam={this.changeReactionParameter.bind(this)} email={this.getEmail.bind(this)} />, reactionService: "Outlook", reactionParameter: this.props.data.ReactionParameter, reaction_name: "J'envoie un mail (Outlook)"});
                break;
            case "createEvent":
                if (this.props.data.Reaction === "Google")
                    this.setState({reaction_forms: <FormGoogleCreateEvent changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Google", reactionParameter: this.props.data.ReactionParameter, reaction_name: "Je crée un évènement (Google)"});
                else
                    this.setState({reaction_forms: <FormOutlookCreateEvent changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Outlook", reactionParameter: this.props.data.ReactionParameter, reaction_name: "Je crée un évènement (Outlook)"});
                break;
            case "addVideoToWatchLater": this.setState({reaction_forms: <FormGoogleAddVideoToWatchLater changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Google", reactionParameter: this.props.data.ReactionParameter, reaction_name: "J'ajoute une vidéo youtube dans une playlist (Google)"}); break;
            case "addToSavedTracks": this.setState({reaction_forms: <FormSpotifyAddToSaveTracks changeParam={this.changeReactionParameter.bind(this)} />, reactionService: "Spotify", reactionParameter: this.props.data.ReactionParameter, reaction_name: "J'ajoute un album dans une playlist (Spotify)"}); break;
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
        return (
            <div className="columns is-multiline pl-6 ml-6">
                <div className="column is-2" />
                {this.state.id_area !== null ?
                    <form action="/" method="POST" onSubmit={this.modifyArea} className="column">
                        <p className="is-size-5 mb-2">Quand : {this.state.action_name}</p>
                        <div>
                            {this.state.action_forms}
                            <hr className="solid"/>
                            <p className="is-size-5 mb-2 mt-5">Alors : {this.state.reaction_name}</p>
                            <div>
                                {this.state.reaction_forms}
                                <hr className="solid"/>
                                <button className="button is-success is-fullwidth is-rounded is-large">Terminer la modification de votre AREA</button>
                            </div>
                        </div>
                    </form>
                : <p>Aucune AREA n'a été séléctionné pour la modification</p>}
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

export default withRouter(connect(mapStateToProps)(AreaModification));