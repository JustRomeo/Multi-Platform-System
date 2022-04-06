import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class FormIntraEndOfProject extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project_name: "",
        };
        this.handleChangeProjectName = this.handleChangeProjectName.bind(this);
    }

    handleChangeProjectName(event) {
        this.setState({project_name: event.target.value});
        this.props.changeParam(["getEndProject", event.target.value]);
    }

    render() {
        return (
            <div>
                <input className="input is-medium log-input mt-2" type="text" placeholder="Nom du projet" id="project_name" value={this.state.project_name} onChange={this.handleChangeProjectName} required></input>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(FormIntraEndOfProject));