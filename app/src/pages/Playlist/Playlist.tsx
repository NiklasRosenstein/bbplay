import React, { useState, useEffect, useReducer } from 'react'
import { Breadcrumbs, Tabs, Tab } from '@blueprintjs/core'
import api from '../../service/apiService'
import { Playlist } from '../../service/playlist'
import { RouteComponentProps, Redirect } from 'react-router'
import styled from 'styled-components'
import PageContainer from '../../components/PageContainer'
import YoutubeSearch from './YoutubeSearch'
import SongList from './SongList'
import { reducer, initialState, IPlaylistState } from './reducer'
import { IPlaylistAction, SET_NEXT_TRACK } from './actions'
import EmbeddedPlayer from './EmbeddedPlayer'
import FooterPlayer from './FooterPlayer'

export const PlaylistContext = React.createContext<[IPlaylistState, React.Dispatch<IPlaylistAction>] | undefined>(
    undefined,
)

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`

const VideoContainer = styled.div`
    margin: auto;
`

const PlaylistView = ({ match }: RouteComponentProps<{ id: string }>) => {
    const { id } = match.params
    const [redirect, setRedirect] = useState('')
    const [playlist, setPlaylist] = useState<Playlist | undefined>(undefined)
    const [state, dispatch] = useReducer(reducer, initialState)
    const [tabId, setTabId] = useState('playlist')
    useEffect(() => {
        api.playlists
            .getOne(id)
            .then(({ data }) => setPlaylist(data))
            .catch(err => console.error(err))
    }, [id])

    const handleTabChange = (id: string) => {
        setTabId(id)
    }

    if (redirect) {
        return <Redirect to={redirect} />
    }

    const breadcrumbs = [
        { onClick: () => setRedirect('/'), text: 'Playlists' },
        { text: playlist ? playlist.name : 'Loading ...' },
    ]

    const handlePlayEnd = () => {
        dispatch({ type: SET_NEXT_TRACK })
    }

    return (
        <PlaylistContext.Provider value={[state, dispatch]}>
            <PageContainer>
                <Container>
                    <h1>
                        <Breadcrumbs items={breadcrumbs} />
                    </h1>
                    <InnerContainer>
                        {state.currentTrack && (
                            <VideoContainer>
                                <EmbeddedPlayer handleEnd={handlePlayEnd} id={state.currentTrack.videoId} />
                            </VideoContainer>
                        )}
                        <Tabs selectedTabId={tabId} onChange={handleTabChange}>
                            <Tab id='playlist' title='Playlist' panel={<SongList playlistId={id} />}></Tab>
                            <Tab id='youtube' title='Search Youtube' panel={<YoutubeSearch playlistId={id} />}></Tab>
                        </Tabs>
                    </InnerContainer>
                </Container>
            </PageContainer>
            <FooterPlayer />
        </PlaylistContext.Provider>
    )
}

export default PlaylistView
