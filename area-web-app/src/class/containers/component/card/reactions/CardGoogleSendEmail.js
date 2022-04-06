import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardGoogleSendEmail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            subject: "",
            content: "",
            options: "",
            options_event: false,
            options_weather: false,
        };
    }

    componentDidMount() {
        this.setState({
            email: this.props.email,
            subject: this.props.subject,
            content: this.props.content,
        });
        if (this.props.content === "getEvent") {
            this.setState({options_event: true, options: this.props.options});
        }
        else if (this.props.content === "getWeather") {
            this.setState({options_weather: true, options: this.props.options});
        }
    }

    render() {
        return (
            <div className="column is-6 mr-3"><figure className="image is-64x64 mb-5">
                <img alt="" src="https://image.flaticon.com/icons/png/512/281/281769.png" /></figure>
                <p className="is-size-7 mb-1">Sur : <span className="has-text-weight-bold">{this.state.email}</span></p>
                <p className="is-size-7 mb-1">Objet : <span className="has-text-weight-bold">{this.state.subject}</span></p>
                {this.state.options_event === true ?
                    <p className="is-size-7 mb-1">Nombre de Jour: <span className="has-text-weight-bold">{this.state.options}</span></p>
                : null}
                {this.state.options_weather === true ?
                    <p className="is-size-7 mb-1">Météo de : <span className="has-text-weight-bold">{this.state.options}</span></p>
                : null}
                {this.state.options_event === false && this.state.options_weather === false ?
                    <p className="is-size-7">Contenu: <span className="has-text-weight-bold">{this.state.content}</span></p>
                : null}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardGoogleSendEmail));