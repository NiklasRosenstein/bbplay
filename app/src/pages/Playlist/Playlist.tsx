import React, { useState, useEffect, useContext } from 'react'
import { Breadcrumbs, Tabs, Tab, Overlay, Button, Card, H6 } from '@blueprintjs/core'
import api from '../../service/apiService'
import { IPlaylist } from '../../service/playlist'
import { RouteComponentProps, Redirect } from 'react-router'
import styled from 'styled-components'
import PageContainer from '../../components/PageContainer'
import YoutubeSearch from './YoutubeSearch'
import SongList from './SongList'
import { SET_NEXT_TRACK } from './actions'
import QRCode from 'qrcode.react'
import EmbeddedPlayer from './EmbeddedPlayer'
import FooterPlayer from './FooterPlayer'
import { PlaylistContext } from './AuthWrapper'
import Flex from '../../components/Flex'
import UpNext from './UpNext'
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

const VideoContainer = styled.div`
    margin: auto;
`

const OverlayCard = styled(Card)`
    left: calc(50% - 150px);
    top: calc(50% - 150px);
    height: 300px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const QRTitle = styled(H6)`
    margin-bottom: 40px !important;
    text-align: center;
`

const Playlist = ({ match }: RouteComponentProps<{ id: string }>) => {
    const { id } = match.params
    const [redirect, setRedirect] = useState('')
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [state, dispatch] = useContext(PlaylistContext)!
    const [playlist, setPlaylist] = useState<IPlaylist | undefined>(undefined)
    const [tabId, setTabId] = useState('upnext')
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

    const handleOverlayClose = () => {
        setIsOverlayOpen(false)
    }

    const handleShareQR = () => {
        setIsOverlayOpen(true)
    }

    const shareURL = `${process.env.REACT_APP_FRONTEND_URL}/playlist/${id}`

    return (
        <>
            <PageContainer hasFooter>
                <Container>
                    <Flex justify='space-between' align='center'>
                        <h1>
                            <Breadcrumbs items={breadcrumbs} />
                        </h1>
                        <Button icon='share' intent='primary' onClick={handleShareQR}>
                            Share
                        </Button>
                    </Flex>
                    <InnerContainer>
                        {state.currentTrack && (
                            <VideoContainer>
                                <EmbeddedPlayer handleEnd={handlePlayEnd} id={state.currentTrack.videoId} />
                            </VideoContainer>
                        )}
                        <Tabs large selectedTabId={tabId} onChange={handleTabChange}>
                            <Tab id='upnext' title='Up Next' panel={<UpNext playlistId={id} />}></Tab>
                            <Tab id='youtube' title='Search Youtube' panel={<YoutubeSearch playlistId={id} />}></Tab>
                            <Tab id='youtube-paste' title='Paste Youtube Link' panel={<YoutubePaste playlistId={id} />}></Tab>
                        </Tabs>
                    </InnerContainer>
                    <Overlay isOpen={isOverlayOpen} onClose={handleOverlayClose}>
                        <OverlayCard>
                            <QRTitle>{shareURL}</QRTitle>
                            <QRCode value={shareURL} />
                        </OverlayCard>
                    </Overlay>
                </Container>
            </PageContainer>
            <FooterPlayer />
        </>
    )
}

export default Playlist
