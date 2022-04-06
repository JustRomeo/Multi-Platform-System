import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardSpotifyAddToSaveTrack extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artist_name: "",
        };
    }

    componentDidMount() {
        this.setState({artist_name: this.props.artist_name});
    }


    render() {
        return (
            <div className="column mr-3"><figure className="image mb-5 mt-2">
                <img alt=""  style={{width: 80 + "%"}}  src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_White.png" /></figure>
                <p className="is-size-6">Le dernier album de <span className="has-text-weight-bold">{this.state.artist_name}</span> sera dans <span className="has-text-weight-bold">"Titres Likés"</span></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardSpotifyAddToSaveTrack));