import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class FormGoogleAddVideoToWatchLater extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist_name: "",
            channels_name: [],
            channels_id: [],
            id_selected: "",
        };
        this.handleChangePlaylistName = this.handleChangePlaylistName.bind(this);
        this.handleChangeChannel = this.handleChangeChannel.bind(this);
    }

    async componentDidMount() {
        await axios.get(`https://back-area.herokuapp.com/google/getAllSubscription`,
        {headers: {
            'Authorization': this.props.user.token,
        }})
        .then(res => {
            if (res.status === 200) {
                res.data.forEach(elem => {
                    this.setState(prevState => ({channels_name: [...prevState.channels_name, elem.title], channels_id: [...prevState.channels_id, elem.id]}));
                });
                this.props.changeParam(["getNewVideo", this.state.channels_id[0]]);
            }
        })
        .catch((e) => {})
    }

    handleChangeChannel(event) {
        var id = "";
        var index = 0;
        this.state.channels_name.forEach(elem => {
            if (elem === event.value) {
                id = this.state.channels_id[index];
                this.setState({id_selected: this.state.channels_id[index]})
            }
            index++;
        });
        this.props.changeParam(["addVideoToWatchLater", this.state.playlist_name, "getNewVideo", id]);
    }

    handleChangePlaylistName(event) {
        this.setState({playlist_name: event.target.value});
        this.props.changeParam(["addVideoToWatchLater", event.target.value, "getNewVideo", this.state.id_selected]);
    }

    render() {
        const option_choosed = null;
        return (
            <div>
                <input className="input is-medium log-input mt-2" type="text" placeholder="Nom de la playlist" id="playlist_name" value={this.state.playlist_name} onChange={this.handleChangePlaylistName} required></input>
                <Dropdown options={this.state.channels_name} onChange={this.handleChangeChannel} value={option_choosed} placeholder="Selectionner la chaine" />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormGoogleAddVideoToWatchLater));