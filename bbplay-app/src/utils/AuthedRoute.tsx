import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

interface AuthedCallback {
  () : boolean
}

interface AuthedRouteProps extends RouteProps {
  authed: AuthedCallback | boolean
  unauthedRedirect: string
}

class AuthedRoute extends React.Component<AuthedRouteProps> {

  render() {
    let authed = false
    if (typeof this.props.authed === 'boolean') {
      authed = this.props.authed
    }
    else {
      authed = this.props.authed()
    }
    if (authed) {
      return <Route {...this.props}>
        {this.props.children}
      </Route>
    }
    else {
      return <Redirect to={this.props.unauthedRedirect}/>
    }
  }

}

export default AuthedRoute
