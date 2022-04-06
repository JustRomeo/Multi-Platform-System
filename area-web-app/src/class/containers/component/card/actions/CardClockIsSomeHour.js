import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardClockIsSomeHour extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hour : "",
        };
    }

    componentDidMount() {
        this.setState({hour: this.props.hour});
    }

    render() {
        return (
            <div className="column is-5 ml-3"><figure className="image is-64x64 mb-5">
                <img alt="" src="https://i.pinimg.com/originals/03/fd/28/03fd284948387458641483ef58822e3c.png" /></figure>
                <p className="is-size-6">Déclenché chaque jour à: <span className="has-text-weight-bold">{this.state.hour}h</span></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardClockIsSomeHour));