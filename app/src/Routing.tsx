import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import PlaylistsOverview from './pages/Playlists/Playlists'
import LoginView from './pages/Login/Login'

import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

import { BrowserRouter, Route, Redirect, Switch, RouteProps } from 'react-router-dom'
import { AuthContext } from './App'
import styled from 'styled-components'
import Player from './pages/Player/Player'
import AuthWrapper from './pages/Playlist/AuthWrapper'

const AppContainer = styled.div`
    width: 100vw;
    height: calc(100vh - 60px);
`

interface IAuthRouteProps extends RouteProps {
    redirectPath: string
}
const AuthRoute = ({ redirectPath, ...props }: IAuthRouteProps) => {
    const [isAuthenticated] = useContext(AuthContext)!
    return isAuthenticated ? <Route {...props} /> : <Redirect to={redirectPath} />
}

interface INoAuthRouteProps extends RouteProps {
    redirectPath: string
}
const NoAuthRoute = ({ redirectPath, ...props }: INoAuthRouteProps) => {
    const [isAuthenticated] = useContext(AuthContext)!
    return !isAuthenticated ? <Route {...props} /> : <Redirect to={redirectPath} />
}

const Routing = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <AppContainer>
                <Switch>
                    <AuthRoute redirectPath='/login' path='/' exact component={PlaylistsOverview} />
                    <NoAuthRoute path='/login' redirectPath='/' component={LoginView} />
                    <Route path='/playlist/:id' redirectPath='/login' component={AuthWrapper} />
                    <AuthRoute path='/player/:id' redirectPath='/login' component={Player} />
                    <Route render={() => <div>No match</div>} />
                </Switch>
            </AppContainer>
        </BrowserRouter>
    )
}

export default Routing
