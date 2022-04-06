import React, {Component}  from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';

import Login from "./class/containers/Login";
import Register from "./class/containers/Register";
import Dashboard from "./class/containers/Dashboard";
import Apk from "./class/containers/Apk";

class App extends Component {
  render() {
    return (
      <div className="app">
        <Switch>
          <Route exact path="/">
            <Login/>
          </Route>
          <Route exact path="/register">
            <Register/>
          </Route>
          <Route exact path="/dashboard">
            <Dashboard/>
          </Route>
          <Route exact path="/dashboard/services">
            <Dashboard/>
          </Route>
          <Route exact path="/dashboard/area-creation">
            <Dashboard/>
          </Route>
          <Route exact path="/dashboard/area-modification">
            <Dashboard/>
          </Route>
          <Route exact path="/client.apk">
            <Apk/>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
