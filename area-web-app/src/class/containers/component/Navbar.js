import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';

class Navbar extends Component {
    render() {
        return (
            <div className='sidenav'>
                <ul>
                    <li>
                        <p className="title is-3 mb-6">Actions.</p>
                        <Link to={{pathname: "/dashboard"}} className="nav-link">Mes Actions</Link>
                        <p className="has-text-black">-</p>
                        <Link to={{pathname: "/dashboard/services"}} className="nav-link">Mes Services</Link>
                        <p className="has-text-black">-</p>
                        <Link to={{pathname: "/dashboard/area-creation"}} className="nav-link">Créer une Action</Link>
                        <p className="has-text-black">-</p>
                        <Link to={{pathname: "/dashboard/area-modification"}} className="nav-link">Modifier une Action</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(Navbar));
