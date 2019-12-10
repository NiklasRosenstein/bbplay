import React, { useContext } from 'react'
import styled from 'styled-components'
import { H3, Card, Classes, Button, Icon } from '@blueprintjs/core'
import { PlaylistContext } from './Playlist'
import api from '../../service/apiService'
import { AppToaster } from '../../components/Toaster'
import { REMOVE_TRACK, SET_CURRENT_TRACK } from './actions'
import { ITrack } from '../../service/track'
import { useMediaQuery } from 'react-responsive'

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 70%;
`

const ThumbnailImage = styled.img`
    border-radius: 4px;
    width: 60px;
    height: 60px;
    margin-right: 1rem;
`

const CardTitle = styled(H3)`
    font-size: ${(props: { isMobile: boolean }) => (props.isMobile ? 20 : 30)}px;
`

const CardDescription = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4; /* number of lines to show */
`

const InnerCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: ${(props: { isMobile: boolean }) => (props.isMobile ? 'flex-start' : 'center')};
    max-width: ${(props: { isMobile: boolean }) => (props.isMobile ? '100%' : 'calc(100% - 150px)')};
`

const StyledCard = styled(Card)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid
        ${(props: { isDragging: boolean; isPlaying?: boolean }) =>
            props.isPlaying ? 'lightgreen' : props.isDragging ? 'lightblue' : '#30404d'};
`

interface ISongCardProps {
    playlistId: string
    track: ITrack
    isDragging: boolean
}
export default ({ playlistId, track, isDragging }: ISongCardProps) => {
    const [{ currentTrack }, dispatch] = useContext(PlaylistContext)!
    const isMobile = useMediaQuery({ maxWidth: 800 })

    const handleDeleteClick = (id: number) => async (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
        ev.preventDefault()
        try {
            await api.tracks.remove(playlistId, id)
            AppToaster.show({ message: 'Track successfully removed.', intent: 'success' })
            dispatch({ type: REMOVE_TRACK, payload: { id } })
        } catch (e) {
            AppToaster.show({ message: 'Error while removing track.', intent: 'danger' })
        }
    }

    const handleTrackClick = (track: ITrack) => () => {
        dispatch({ type: SET_CURRENT_TRACK, payload: { currentTrack: track } })
        //setRedirect(`/player/${track.videoId}`)
    }

    return (
        <StyledCard
            isPlaying={currentTrack && currentTrack.id === track.id}
            onClick={handleTrackClick(track)}
            isDragging={isDragging}
        >
            <InnerCardContainer isMobile={isMobile}>
                <ThumbnailImage src={track.videoData.snippet.thumbnails.default.url} />
                <TitleContainer>
                    <CardTitle isMobile={isMobile}>{track.videoData.snippet.title}</CardTitle>
                    <CardDescription className={Classes.UI_TEXT}>{track.videoData.snippet.description}</CardDescription>
                </TitleContainer>
            </InnerCardContainer>

            <Button onClick={handleDeleteClick(track.id)}>
                <Icon icon='trash' />
            </Button>
        </StyledCard>
    )
}
