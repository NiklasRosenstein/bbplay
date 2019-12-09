import React from 'react'
import {Link} from 'react-router-dom'
import client from '../client'
import {Button} from '@blueprintjs/core'
import logo from '../static/bushbash-logo.png'


export default class Navbar extends React.Component<{}> {

  constructor(props: {}) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  async logout() {
    await client.logout()
    window.location.reload(true)
  }

  render() {
    return <div className="navbar">
      <div className="branding">
        <img src={logo} className="logo"/>
        <span>bbplay</span>
      </div>
      <div className="controls">
        {client.isAuthenticated() ?
        <Button text="Logout" onClick={this.logout}/> :
        <Link to="/login"><Button text="Login" intent="primary"/></Link>}
      </div>
    </div>
  }
}
