import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardIntraNotification extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div className="column ml-3"><figure className="image mb-5 mt-2">
                <img alt="" style={{width: 80 + "%"}} src="https://newsroom.ionis-group.com/wp-content/uploads/2018/12/epitech-logo-blanc.png" /></figure>
                <p className="is-size-6">Déclenché lorsque vous avez une notification</p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardIntraNotification));