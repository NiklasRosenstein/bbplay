import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from '@blueprintjs/core'
import api from '../../service/apiService'
import { IPlaylist } from '../../service/playlist'
import { RouteComponentProps } from 'react-router'
import styled from 'styled-components'
import PageContainer from '../../components/PageContainer'
import YoutubeSearch from './YoutubeSearch'
import SongList from './SongList'
import YoutubePaste from './YoutubePaste'

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

const PublicPlaylist = ({ match }: RouteComponentProps<{ id: string }>) => {
    const { id } = match.params
    const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined)
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

    return (
        <PageContainer>
            <Container>
                <h1>{playlist && playlist.name}</h1>
                <InnerContainer>
                    <Tabs large selectedTabId={tabId} onChange={handleTabChange}>
                        <Tab id='playlist' title='Playlist' panel={<SongList isPublic playlistId={id} />}></Tab>
                        <Tab id='youtube' title='Search Youtube' panel={<YoutubeSearch playlistId={id} />}></Tab>
                        <Tab
                            id='youtube-paste'
                            title='Paste Youtube Link'
                            panel={<YoutubePaste playlistId={id} />}
                        ></Tab>
                    </Tabs>
                </InnerContainer>
            </Container>
        </PageContainer>
    )
}

export default PublicPlaylist
