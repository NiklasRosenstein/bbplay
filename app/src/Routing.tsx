import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import PlaylistsOverview from './pages/Playlists/Playlists'
import LoginView from './pages/Login/Login'

import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'

import { BrowserRouter, Route, Redirect, Switch, RouteProps } from 'react-router-dom'
import { AuthContext } from './App'
import PlaylistView from './pages/Playlist/Playlist'
import styled from 'styled-components'
import Player from './pages/Player/Player'

const AppContainer = styled.div`
    width: 100vw;
    height: calc(100vh - 60px);
`

interface IAuthRouteProps extends RouteProps {
    isAuthenticated: boolean
    redirectPath: string
}
const AuthRoute = ({ redirectPath, ...props }: IAuthRouteProps) => {
    const [isAuthenticated] = useContext(AuthContext)!
    return isAuthenticated ? <Route {...props} /> : <Redirect to={redirectPath} />
}

interface INoAuthRouteProps extends RouteProps {
    isUnauthorized: boolean
    redirectPath: string
}
const NoAuthRoute = ({ isUnauthorized, redirectPath, ...props }: INoAuthRouteProps) => {
    const [isAuthenticated] = useContext(AuthContext)!
    return !isAuthenticated ? <Route {...props} /> : <Redirect to={redirectPath} />
}

const Routing = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <AppContainer>
                <Switch>
                    <AuthRoute isAuthenticated redirectPath='/login' path='/' exact component={PlaylistsOverview} />
                    <NoAuthRoute isUnauthorized path='/login' redirectPath='/' component={LoginView} />
                    <AuthRoute path='/playlist/:id' isAuthenticated redirectPath='/login' component={PlaylistView} />
                    <AuthRoute path='/player/:id' isAuthenticated redirectPath='/login' component={Player} />
                    <Route render={() => <div>No match</div>} />
                </Switch>
            </AppContainer>
        </BrowserRouter>
    )
}

export default Routing
