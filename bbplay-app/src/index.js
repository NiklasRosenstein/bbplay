import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Navbar from './views/Navbar';
import PlaylistsOverview from './views/PlaylistsOverview';
import PlaylistView from './views/PlaylistView';
import LoginView from './views/LoginView';
import * as serviceWorker from './serviceWorker';

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";


import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthedRoute from './utils/AuthedRoute'
import client from './client'

function NoMatch(props) {
  return <div>404</div>
}

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <AuthedRoute path="/" exact authed={client.isAuthenticated} unauthedRedirect="/login">
        <Redirect to="/app"/>
      </AuthedRoute>
      <AuthedRoute path="/login" exact authed={() => !client.isAuthenticated()} unauthedRedirect="/app">
        <LoginView/>
      </AuthedRoute>
      <Route path="/app">
        <div className="dashboard bp3-dark" id="main">
          <Navbar/>
          <div className="inner">
            <Switch>
              <Route path="/app" exact component={PlaylistsOverview}/>
              <Route path="/app/playlist/:id" exact component={PlaylistView}/>
              <Route component={NoMatch}/>
            </Switch>
          </div>
        </div>
      </Route>
      <Route component={NoMatch}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
