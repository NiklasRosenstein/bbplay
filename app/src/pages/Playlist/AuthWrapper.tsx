import React, { useContext, useReducer, useEffect } from 'react'
import { AuthContext } from '../../App'
import Playlist from './Playlist'
import PublicPlaylist from './PublicPlaylist'
import { RouteComponentProps } from 'react-router'
import { reducer, initialState, IPlaylistState } from './reducer'
import { IPlaylistAction, SET_PLAYLIST } from './actions'
import api from '../../service/apiService'

export const PlaylistContext = React.createContext<[IPlaylistState, React.Dispatch<IPlaylistAction>] | undefined>(
    undefined,
)

const AuthWrapper = (props: RouteComponentProps<{ id: string }>) => {
    const { id } = props.match.params
    const [isAuthenticated] = useContext(AuthContext)!
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        api.playlists.getOne(id).then(({ data }) => {
            dispatch({ type: SET_PLAYLIST, payload: { playlist: data } })
        })
    }, [])

    return (
        <PlaylistContext.Provider value={[state, dispatch]}>
            {isAuthenticated ? <Playlist {...props} /> : <PublicPlaylist {...props} />}
        </PlaylistContext.Provider>
    )
}

export default AuthWrapper
