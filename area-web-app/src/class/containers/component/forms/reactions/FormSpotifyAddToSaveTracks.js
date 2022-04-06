import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class FormSpotifyAddToSaveTracks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artist_name: "",
        };
        this.handleChangeArtistName = this.handleChangeArtistName.bind(this);
    }

    handleChangeArtistName(event) {
        this.setState({artist_name: event.target.value});
        this.props.changeParam(["addToSavedTracks", "newAlbum", event.target.value]);
    }

    render() {
        return (
            <div>
                <input className="input is-medium log-input mt-2" type="text" placeholder="Nom de l'artiste" id="artist_name" value={this.state.artist_name} onChange={this.handleChangeArtistName} required></input>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormSpotifyAddToSaveTracks));