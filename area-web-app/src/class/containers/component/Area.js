import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import CardClockIsSomeHour from './card/actions/CardClockIsSomeHour'
import CardCurrencyIsCurrencyUnder from './card/actions/CardCurrencyIsCurrencyUnder'
import CardGoogleAsUnreadEmail from './card/actions/CardGoogleAsUnreadEmail'
import CardGoogleGetNewVideo from './card/actions/CardGoogleGetNewVideo'
import CardGoogleIsEvent from './card/actions/CardGoogleIsEvent'
import CardIntraCredits from './card/actions/CardIntraCredits'
import CardIntraEndOfProject from './card/actions/CardIntraEndOfProject'
import CardIntraGPA from './card/actions/CardIntraGPA'
import CardIntraNotification from './card/actions/CardIntraNotification'
import CardIntraMissed from './card/actions/CardIntraMissed'
import CardOutlookAsUnreadEmail from './card/actions/CardOutlookAsUnreadEmail'
import CardOutlookIsEvent from './card/actions/CardOutlookIsEvent'
import CardSpotifyNewAlbum from './card/actions/CardSpotifyNewAlbum'
import CardWeatherIsTempUnder from './card/actions/CardWeatherIsTempUnder'

import CardGoogleAddVideoToWatchLater from './card/reactions/CardGoogleAddVideoToWatchLater'
import CardGoogleCreateEvent from './card/reactions/CardGoogleCreateEvent'
import CardGoogleSendEmail from './card/reactions/CardGoogleSendEmail'
import CardOutlookSendEmail from './card/reactions/CardOutlookSendEmail'
import CardOutlookCreateEvent from './card/reactions/CardOutlookCreateEvent'
import CardSpotifyAddToSaveTracks from './card/reactions/CardSpotifyAddToSaveTracks'
import CardIsEndOfWeek from './card/actions/CardIsEndOfWeek';


class Area extends Component {
    constructor(props) {
        super(props);

        this.state = {
            label_action: ["isEndOfWeek", "isSomeHour", "isCurrencyUnder",
                        "isTempUnder", "getGPA", "getCredits", "getNotification",
                        "getMissed", "getEndProject", "asUnreadEmail", "isEvent",
                        "getNewVideo", "newAlbum"],
            label_reaction: ["sendEmail","createEvent", "addVideoToWatchLater",
                        "addToSavedTracks"],

            name_action: ["Fin de semaine", "Heure", "Bourse", "Météo",
                        "Intra: GPA", "Intra: Crédits", "Intra: Notification",
                        "Intra: Absence", "Intra: Fin de projet", "Google: Mail non lu",
                        "Google: Vérifier les évènements", "Google: Nouvelle vidéo youtube",
                        "Spotify: Nouvel album", "Outlook: Mail non lu",
                        "Outlook: Vérifier les évènements"],
            name_reaction: ["Google: Envoyer un mail", "Google: Créer un évènement",
                        "Google: Ajouter la vidéo dans une playlist",  "Spotify: Ajouter un nouvel album", "Outlook: Envoyer un mail",
                        "Outlook: Créer un évènement"],

            action_area: "",
            reaction_area: "",
            action_area_card_part: null,
            reaction_area_card_part: null,
        };
        this.box = ["p-5"];

        this.removeArea = this.removeArea.bind(this);
        this.modifyArea = this.modifyArea.bind(this);
        this.addReactionCardPart = this.addReactionCardPart.bind(this);
        this.addActionCardPart = this.addActionCardPart.bind(this);
    }

    removeArea() {
        this.props.delete_area(this.props.key_index, this.props.id);
    }

    modifyArea() {
        this.props.modify_area(this.props.key_index, this.props.id, this.props.data);
    }

    addReactionCardPart() {
        switch(this.props.data.ReactionParameter[0]) {
            case "sendEmail":
                if (this.props.data.Reaction === "Google")
                    this.setState({reaction_area_card_part: <CardGoogleSendEmail email={this.props.data.ReactionParameter[1]} subject={this.props.data.ReactionParameter[2]} content={this.props.data.ReactionParameter[3]} options={this.props.data.ReactionParameter[4]}/>});
                else
                    this.setState({reaction_area_card_part: <CardOutlookSendEmail email={this.props.data.ReactionParameter[1]} subject={this.props.data.ReactionParameter[2]} content={this.props.data.ReactionParameter[3]} options={this.props.data.ReactionParameter[4]}/>});
                break;
            case "createEvent":
                if (this.props.data.Reaction === "Google")
                    this.setState({reaction_area_card_part: <CardGoogleCreateEvent subject={this.props.data.ReactionParameter[1]} time_start={this.props.data.ReactionParameter[2]} time_end={this.props.data.ReactionParameter[3]}/>});
                else
                    this.setState({reaction_area_card_part: <CardOutlookCreateEvent subject={this.props.data.ReactionParameter[1]} time_start={this.props.data.ReactionParameter[2]} time_end={this.props.data.ReactionParameter[3]}/>});
                break;
            case "addVideoToWatchLater": this.setState({reaction_area_card_part: <CardGoogleAddVideoToWatchLater playlist_name={this.props.data.ReactionParameter[1]} channel_id={this.props.data.ReactionParameter[3]}/>}); break;
            case "addToSavedTracks": this.setState({reaction_area_card_part: <CardSpotifyAddToSaveTracks artist_name={this.props.data.ReactionParameter[2]} />}); break;
            default: return;
        }
    }

    setColors(color) {
        if (color) {
            this.box = [color];
        } else {
            this.box = ["white-gradient p-5 has-text-dark"]
        }
    }

    addActionCardPart() {
        switch(this.props.data.ActionParameter[0]) {
            case "asUnreadEmail":
                if (this.props.data.Action === "Google")
                    this.setState({action_area_card_part: <CardGoogleAsUnreadEmail filtre={this.props.data.ActionParameter[1]} filtre_option={this.props.data.ActionParameter[2]}/>});
                else
                    this.setState({action_area_card_part: <CardOutlookAsUnreadEmail filtre={this.props.data.ActionParameter[2]} filtre_option={this.props.data.ActionParameter[3]}/>});
                break;
            case "isEvent":
                if (this.props.data.Action === "Google")
                    this.setState({action_area_card_part: <CardGoogleIsEvent days_number={this.props.data.ActionParameter[1]}/>});
                else
                    this.setState({action_area_card_part: <CardOutlookIsEvent days_number={this.props.data.ActionParameter[1]}/>});
                break;
            case "isEndOfWeek": this.setState({action_area_card_part: <CardIsEndOfWeek />}); this.setColors("orange-gradient p-5");break;
            case "isSomeHour": this.setState({action_area_card_part: <CardClockIsSomeHour hour={this.props.data.ActionParameter[1]}/>}); this.setColors("orange-gradient p-5");break;
            case "isCurrencyUnder": this.setState({action_area_card_part: <CardCurrencyIsCurrencyUnder currency_type={this.props.data.ActionParameter[1]} amount={this.props.data.ActionParameter[2]}/>}); this.setColors("yellow-gradient p-5");break;
            case "isTempUnder": this.setState({action_area_card_part: <CardWeatherIsTempUnder city_name={this.props.data.ActionParameter[1]} temp={this.props.data.ActionParameter[2]}/>}); this.setColors("orange-gradient p-5"); break;
            case "getGPA": this.setState({action_area_card_part: <CardIntraGPA />}); this.setColors("blue-gradient p-5"); break;
            case "getCredits": this.setState({action_area_card_part: <CardIntraCredits />}); this.setColors("blue-gradient p-5"); break;
            case "getNotification": this.setState({action_area_card_part: <CardIntraNotification />}); this.setColors("blue-gradient p-5"); break;
            case "getMissed": this.setState({action_area_card_part: <CardIntraMissed />}); this.setColors("blue-gradient p-5"); break;
            case "getEndProject": this.setState({action_area_card_part: <CardIntraEndOfProject project_name={this.props.data.ActionParameter[1]}/>}); this.setColors("blue-gradient p-5"); break;
            case "getNewVideo": this.setState({action_area_card_part: <CardGoogleGetNewVideo channel_id={this.props.data.ActionParameter[1]}/>}); this.setColors("red-gradient p-5"); break;
            case "newAlbum": this.setState({action_area_card_part: <CardSpotifyNewAlbum artist_name={this.props.data.ActionParameter[1]}/>}); this.setColors("green-gradient p-5"); break;
            default: return;
        }
    }


    componentDidMount() {
        var index = 0;
        this.state.label_action.forEach(elem => {
            if (elem === this.props.data.ActionParameter[0]) {
                if (elem === "asUnreadEmail") {
                    if (this.props.data.Action === "Google"){
                        this.setState({action_area: this.state.name_action[9]})
                        this.setColors("red-gradient p-5")
                    } else {
                        this.setState({action_area: this.state.name_action[13]})
                        this.setColors("light-blue-gradient p-5")
                    } 
                }
                else if (elem === "isEvent") {
                    if (this.props.data.Action === "Google") {
                        this.setState({action_area: this.state.name_action[10]})
                        this.setColors("red-gradient p-5")
                    } else {
                        this.setState({action_area: this.state.name_action[14]})
                        this.setColors("light-blue-gradient p-5")
                    } 
                } else {
                    this.setState({action_area: this.state.name_action[index]})
                }
            }
            index++;
        })
        index = 0;
        this.state.label_reaction.forEach(elem => {
            if (elem === this.props.data.ReactionParameter[0]) {
                if (elem === "sendEmail") {
                    if (this.props.data.Reaction === "Google")
                        this.setState({reaction_area: this.state.name_reaction[0]})
                    else
                        this.setState({reaction_area: this.state.name_reaction[4]})
                }
                else if (elem === "createEvent") {
                    if (this.props.data.Reaction === "Google")
                        this.setState({reaction_area: this.state.name_reaction[1]})
                    else
                        this.setState({reaction_area: this.state.name_reaction[5]})
                }
                else {
                    this.setState({reaction_area: this.state.name_reaction[index]})
                }
            }
            index++;
        })
        this.addActionCardPart();
        this.addReactionCardPart();
    }


    render() {
        return (
            <div className="column is-two-fifths ml-6 mb-5 an-action">
                <div className={this.box.join('' )}>
                    <div className="columns is-vcentered">
                        {this.state.action_area_card_part}
                        {this.state.reaction_area_card_part}
                    </div>
                    <p className="is-size-6 has-text-centered areatitle">{this.state.action_area} -> {this.state.reaction_area}</p>
                </div>
                <div className="columns hover-buttons-div">
                    <div className="hover-button column is-1">
                        <button onClick={this.modifyArea} className="button is-rounded">
                            <span className="icon">
                                <i className="fas fa-pen"></i>
                            </span>
                        </button>
                    </div>
                    <div className=" hover-button column is-3 is-offset-10">
                        <button onClick={this.removeArea} className="button is-rounded">
                            <span className="icon has-text-danger">
                                <i className="fas fa-trash"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(Area));