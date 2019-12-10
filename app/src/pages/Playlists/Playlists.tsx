import React, { useState, useEffect, useReducer } from 'react'
import { Button, Breadcrumbs, InputGroup } from '@blueprintjs/core'
import api from '../../service/apiService'
import styled from 'styled-components'
import { ListContainer } from '../../components/List'
import PageContainer from '../../components/PageContainer'
import { reducer, initialState, IPlaylistsState } from './reducer'
import { IPlaylistsAction, SET_PLAYLISTS, ADD_PLAYLIST } from './actions'
import PlaylistCard from './PlaylistCard'

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const PlaylistForm = styled.form``

export const PlaylistsContext = React.createContext<[IPlaylistsState, React.Dispatch<IPlaylistsAction>] | undefined>(
    undefined,
)

const PlaylistOverview = () => {
    const [playlistName, setPlaylistName] = useState('')
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        api.playlists
            .getMany()
            .then(({ data }) => {
                dispatch({ type: SET_PLAYLISTS, payload: { playlists: data } })
            })
            .catch(err => {
                //error toast
                console.error(err)
            })
    }, [])

    const createPlaylist = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        try {
            const { data } = await api.playlists.create(playlistName)
            dispatch({ type: ADD_PLAYLIST, payload: { playlist: data } })
        } catch (e) {
            //error toast
        }
    }

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistName(ev.target.value)
    }
    const breadcrumbs = [{ text: 'Playlists' }]

    return (
        <PlaylistsContext.Provider value={[state, dispatch]}>
            <PageContainer>
                <Container>
                    <h1>
                        <Breadcrumbs items={breadcrumbs} />
                    </h1>
                    <PlaylistForm onSubmit={createPlaylist}>
                        <InputGroup
                            value={playlistName}
                            leftIcon='add'
                            rightElement={<Button icon='arrow-right' type='submit' />}
                            placeholder='Add playlist'
                            onChange={handleChange}
                        />
                    </PlaylistForm>
                    <ListContainer>
                        {state.playlists.map(playlist => (
                            <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))}
                    </ListContainer>
                </Container>
            </PageContainer>
        </PlaylistsContext.Provider>
    )
}

export default PlaylistOverview
