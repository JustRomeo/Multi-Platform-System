import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';

class CardGoogleAddVideoToWatchLater extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist_name: "",
            channel_name: "not found",
        };
    }

    async componentDidMount() {
        this.setState({playlist_name: this.props.playlist_name});
        await axios.get(`https://back-area.herokuapp.com/google/getAllSubscription`,
        {headers: {
            'Authorization': this.props.user.token,
        }})
        .then(res => {
            if (res.status === 200) {
                res.data.forEach(elem => {
                    if (elem.id === this.props.channel_id)
                        this.setState({channel_name: elem.title});
                });
            }
        })
        .catch((e) => {})
    }

    render() {
        return (
            <div className="column mr-3"><figure className="image mb-5 mt-2">
                <img alt="" style={{width: 80 + "%"}} src="https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube-logo-full_color_dark.svg?cache=bb9b9c6" /></figure>
                <p className="is-size-6">La dernière vidéo de : <span className="has-text-weight-bold">{this.state.channel_name}</span></p>
                <p className="is-size-6">Se mettra dans la playlist: <span className="has-text-weight-bold">{this.state.playlist_name}</span></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardGoogleAddVideoToWatchLater));