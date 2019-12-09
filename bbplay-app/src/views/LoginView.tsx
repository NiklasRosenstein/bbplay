import React from 'react';
import logo from '../static/bushbash-logo.png';
import client from '../client'
import { Button, InputGroup } from '@blueprintjs/core';

type LoginState = {
  username: string,
  password: string
}

class LoginView extends React.Component<{}, LoginState> {

  state = {username: '', password: ''}

  async postLogin() {
    let response = await client.login(this.state.username, this.state.password)
    console.log(response)
    window.location.reload()
  }

  render() {
    return <div className="login-screen bp3-dark" id="main">
      <div className="login-screen-inner">
      <div className="login-screen-inner2">
        <img src={logo}/>
        <form className="login-form" action="/login">
          <InputGroup
            small={true}
            placeholder="Username"
            value={this.state.username}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({username: ev.currentTarget.value})}
              />
          <InputGroup
            type="password"
            small={true}
            placeholder="Password"
            value={this.state.password}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              this.setState({password: ev.currentTarget.value})}
            />
          <Button
            text="Login"
            className="bp3-intent-primary"
            onClick={this.postLogin.bind(this)}
            />
        </form>
      </div>
      </div>
    </div>
  }

}


export default LoginView
