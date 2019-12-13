import React, { useContext, useReducer } from 'react'
import { AuthContext } from '../../App'
import Playlist from './Playlist'
import PublicPlaylist from './PublicPlaylist'
import { RouteComponentProps } from 'react-router'
import { reducer, initialState, IPlaylistState } from './reducer'
import { IPlaylistAction } from './actions'

export const PlaylistContext = React.createContext<[IPlaylistState, React.Dispatch<IPlaylistAction>] | undefined>(
    undefined,
)

const AuthWrapper = (props: RouteComponentProps<{ id: string }>) => {
    const [isAuthenticated] = useContext(AuthContext)!
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <PlaylistContext.Provider value={[state, dispatch]}>
            {isAuthenticated ? <Playlist {...props} /> : <PublicPlaylist {...props} />}
        </PlaylistContext.Provider>
    )
}

export default AuthWrapper
