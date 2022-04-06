import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardIsEndOfWeek extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div className="column ml-3"><figure className="image is-64x64 mb-5">
                <img alt="" src="https://i.pinimg.com/originals/03/fd/28/03fd284948387458641483ef58822e3c.png" /></figure>
                <p className="is-size-6">Déclenché tous les lundis à minuit</p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardIsEndOfWeek));