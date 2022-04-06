import React, { Component } from 'react';
import { withRouter, Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Navbar from './component/Navbar';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from "react-toasts";

import { setUser, setToken, removeUser } from '../reducers/userActionCreators';
import Services from './Services';
import AreaCreation from './AreaCreation';
import AreaModification from './AreaModification';
import Area from './component/Area';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            areas: [],
            area_key: 0,
            id_modified_area: null,
            key_modified_area: null,
            area_data: null,

            list_deleted_areas: [],

            service_intra: false,
            service_google: false,
            service_spotify: false,
            service_outlook: false,
        };
        this.changeAreaKey = this.changeAreaKey.bind(this);
        this.deleteArea = this.deleteArea.bind(this);
        this.displayFailToast = this.displayFailToast.bind(this);
        this.displaySuccessToast = this.displaySuccessToast.bind(this);
        this.modifyArea = this.modifyArea.bind(this);
        this.changeStateIntraService = this.changeStateIntraService.bind(this);
        this.changeStateGoogleService = this.changeStateGoogleService.bind(this);
        this.changeStateSpotifyService = this.changeStateSpotifyService.bind(this);
        this.changeStateOutlookService = this.changeStateOutlookService.bind(this);

    }

    changeStateIntraService(status) {
        this.setState({service_intra: status});
    }

    changeStateGoogleService(status) {
        this.setState({service_google: status});
    }

    changeStateSpotifyService(status) {
        this.setState({service_spotify: status});
    }

    changeStateOutlookService(status) {
        this.setState({service_outlook: status});
    }

    async componentWillMount() {
        await axios.get(`https://back-area.herokuapp.com/service/getTempUser`).then((response) => {
            if (response.status === 200) {
                for (let key in response.data)
                    if (key === "token") {
                        let user = {username: response.data.user.username, id: response.data.user._id};
                        this.props.setUser(user);
                        this.props.setToken(response.data[key]);
                    }
            }
            else {
                if (this.props.user.token === undefined)
                    this.props.history.push('/');
            }
        }).catch((error) => {
            console.log(error);
            if (this.props.user.token === undefined)
                this.props.history.push('/');
        });
        await axios.get(`https://back-area.herokuapp.com/getServiceToken`,
            {headers: {'Authorization': this.props.user.token,}}).then((response) => {
            if (response.status === 200) {
                response.data.tokenList.forEach(elem => {
                    if (elem.service === "intra") {
                        this.setState({service_intra: true});
                    }
                    else if (elem.service === "google") {
                        this.setState({service_google: true});
                    }
                    else if (elem.service === "outlook") {
                        this.setState({service_outlook: true});
                    }
                    else if (elem.service === "spotify") {
                        this.setState({service_spotify: true});
                    }
                });
            }
        }).catch((error) => {
        });
        await axios.get(`https://back-area.herokuapp.com/area/getUserArea`,
            { headers: { 'Authorization': this.props.user.token, } }).then((response) => {
                if (response.status === 200) {
                    const receivedAreas = [];
                    response.data.forEach(elem => {
                        receivedAreas.push(<Area key={this.state.area_key} key_index={this.state.area_key} id={elem._id} delete_area={this.deleteArea.bind(this)} data={elem} modify_area={this.modifyArea.bind(this)}/>);
                        this.changeAreaKey();
                    });
                    this.setState({areas: receivedAreas});
                    this.displaySuccessToast("Chargement de vos AREA");
                }
            }).catch((error) => {
                this.displayFailToast("Impossible de charger vos AREA");
            });
    }

    async modifyArea(key, id, data) {
        this.setState({id_modified_area: id, key_modified_area: key, area_data: data});
        this.props.history.push('/dashboard/area-modification');
    }

    displaySuccessToast(str) {
        ToastsStore.success(str);
    }

    displayFailToast(str) {
        ToastsStore.error(str);
    }

    changeAreaKey() {
        this.setState({ area_key: this.state.area_key + 1 });
    }

    async deleteArea(key, id) {
        await axios.post(`https://back-area.herokuapp.com/area/removeArea`,
            { id: id },
            { headers: { 'Authorization': this.props.user.token, } }).then((response) => {
                if (response.status === 200) {
                    let index = 0;
                    let found = false;
                    this.state.areas.forEach(area => {
                      if (area.key == key)
                        found = true;
                      if (found === false)
                        index += 1;
                    });
                    let start_areas = this.state.areas.splice(0, index);
                    let end_areas = this.state.areas.splice(1, this.state.areas.length);
                    end_areas.forEach(widget => {
                      start_areas.push(widget);
                    });
                    let deleted_areas = this.state.list_deleted_areas;
                    deleted_areas.push(key);
                    this.setState({areas: start_areas,
                        list_deleted_areas: deleted_areas,
                        id_modified_area: null,
                        key_modified_area: null,
                        area_data: null,});
                    this.displaySuccessToast("Votre AREA a été supprimé avec succès");
                }
        }).catch((error) => {
            this.displayFailToast("Error lors de la suppression de l'AREA");
        });
    }

    render() {
        return (
            <div className="App">
                <Navbar />
                <div className="main">
                    <Switch>
                        <Route exact path="/dashboard">
                            <div className="columns pt-6 pl-6">
                                <div className="column is-1" />
                                <div className="column is-one-fifths"><p className="is-size-4 has-text-weight-bold">Mes Actions :</p></div>
                                <div className="column is-half" />
                                <div className="column is-one-fifths"><Link to={{pathname: "/dashboard/area-creation"}} className="button is-rounded mt-1">Ajouter une action</Link></div>
                                <div className="column is-1" />
                            </div>
                            <div className="columns is-multiline pl-6 ml-6">
                                {this.state.areas}
                            </div>
                        </Route>
                        <Route exact path="/dashboard/services">
                            <div className="columns pt-6 pl-6">
                                <div className="column is-1" />
                                <div className="column is-one-fifths"><p className="is-size-4 has-text-weight-bold">Mes Services :</p></div>
                            </div>
                            <Services
                                service_intra={this.state.service_intra}
                                service_google={this.state.service_google}
                                service_spotify={this.state.service_spotify}
                                service_outlook={this.state.service_outlook}
                                changeStateIntraService={this.changeStateIntraService}
                                changeStateGoogleService={this.changeStateGoogleService}
                                changeStateSpotifyService={this.changeStateSpotifyService}
                                changeStateOutlookService={this.changeStateOutlookService}/>
                        </Route>
                        <Route exact path="/dashboard/area-creation">
                            <div className="columns pt-6 pl-6">
                                <div className="column is-1" />
                                <div className="column is-one-fifths"><p className="is-size-4 has-text-weight-bold">Créer une AREA :</p></div>
                            </div>
                            <AreaCreation
                                areas={this.state.areas}
                                area_key={this.state.area_key}
                                incr_key={this.changeAreaKey}
                                delete_area={this.deleteArea.bind(this)}
                                modify_area={this.modifyArea.bind(this)}/>
                        </Route>
                        <Route exact path="/dashboard/area-modification">
                            <AreaModification
                                areas={this.state.areas}
                                area_id={this.state.id_modified_area}
                                area_key={this.state.key_modified_area}
                                delete_area={this.deleteArea.bind(this)}
                                modify_area={this.modifyArea.bind(this)}
                                list_deleted_areas={this.state.list_deleted_areas}
                                data={this.state.area_data}/>
                        </Route>
                    </Switch>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));