import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { H3, Card, Classes, Button, Icon } from '@blueprintjs/core'
import { PlaylistContext } from './Playlist'
import api from '../../service/apiService'
import { AppToaster } from '../../components/Toaster'
import { REMOVE_TRACK, SET_CURRENT_TRACK } from './actions'
import { ITrack } from '../../service/track'
import { useMediaQuery } from 'react-responsive'
import Flex from '../../components/Flex'

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 70%;
`

const ThumbnailImage = styled.img`
    border-radius: 4px;
    filter: ${(props: { isActive?: boolean }) => (props.isActive ? 'blur(2px)' : 'unset')};
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
    white-space: nowrap;
    width: 100%;
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
        ${(props: { isDragging: boolean; isActive?: boolean }) =>
            props.isActive ? 'lightgreen' : props.isDragging ? 'lightblue' : '#30404d'};
`

interface ISongCardProps {
    playlistId: string
    track: ITrack
    isDragging: boolean
}
export default ({ playlistId, track, isDragging }: ISongCardProps) => {
    const [{ currentTrack, playing }, dispatch] = useContext(PlaylistContext)!
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

    const isActive = currentTrack && currentTrack.id === track.id
    return (
        <StyledCard interactive isActive={isActive} onClick={handleTrackClick(track)} isDragging={isDragging}>
            <InnerCardContainer isMobile={isMobile}>
                <div style={{ position: 'relative' }}>
                    {isActive && <PlayOverlay isPlaying={playing} />}
                    <ThumbnailImage isActive={isActive} src={track.videoData.snippet.thumbnails.default.url} />
                </div>
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

const Bar = styled.div`
    width: 5px;
    margin: 1px;
    background: rgba(255, 255, 255, 0.8);
    transition: height 0.5s ease-in-out;
    height: ${(props: { heightPercentage: number }) => (props.heightPercentage > 100 ? 100 : props.heightPercentage)}%;
`

const PlayContainer = styled(Flex)`
    position: absolute;
    height: 20px;
    left: 10px;
    top: 20px;
    z-index: 10;
    width: 40px;
`

const PlayOverlay = ({ isPlaying }: { isPlaying: boolean }) => {
    const [percentages, setPercentages] = useState([0, 20, 40, 60])

    useEffect(() => {
        const interval = setInterval(() => {
            const newPercentages = percentages.map(percentage => Math.round(Math.random() * 100))
            setPercentages(newPercentages)
        }, 500)
        return () => clearInterval(interval)
    }, [])
    return (
        <PlayContainer justify='center' align='flex-end'>
            {percentages.map(percentage => (
                <Bar heightPercentage={isPlaying ? percentage : 15}></Bar>
            ))}
        </PlayContainer>
    )
}
