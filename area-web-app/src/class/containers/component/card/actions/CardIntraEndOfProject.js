import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class CardIntraEndOfProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project_name: "",
        };
    }

    componentDidMount() {
        this.setState({project_name: this.props.project_name});
    }

    render() {
        return (
            <div className="column ml-3"><figure className="image mb-5 mt-2">
                <img alt="" style={{width: 80 + "%"}} src="https://newsroom.ionis-group.com/wp-content/uploads/2018/12/epitech-logo-blanc.png" /></figure>
                <p className="is-size-6">Déclenché lorsqu'il reste moins de 24h au rendu du projet: <span className="has-text-weight-bold">{this.state.project_name}</span></p>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(CardIntraEndOfProject));