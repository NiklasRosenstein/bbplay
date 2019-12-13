import React, { useContext } from 'react'
import styled from 'styled-components'
import { H3, Button, Classes, Icon } from '@blueprintjs/core'
import { IVideoItem } from '../../service/youtube'
import { AppToaster } from '../../components/Toaster'
import api from '../../service/apiService'
import { useMediaQuery } from 'react-responsive'
import { ListCard } from '../../components/List'
import { PlaylistContext } from './AuthWrapper'
import { ADD_TRACK } from './actions'

const ThumbnailImage = styled.img`
    border-radius: 4px;
    width: 60px;
    height: 60px;
    margin-right: 1rem;
`

const InnerCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: ${(props: { isMobile: boolean }) => (props.isMobile ? 'flex-start' : 'center')};
    max-width: ${(props: { isMobile: boolean }) => (props.isMobile ? '100%' : 'calc(100% - 150px)')};
`

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    max-width: 70%;
`

const OuterCardContainer = styled.div`
    display: flex;
    flex-direction: ${(props: { isMobile: boolean }) => (props.isMobile ? 'column' : 'row')};
    justify-content: space-between;
    align-items: ${(props: { isMobile: boolean }) => (props.isMobile ? 'flex-end' : 'center')};
`

const StyledButton = styled(Button)`
    margin: 1rem;
`

const CardTitle = styled(H3)`
    font-size: ${(props: { isMobile: boolean }) => (props.isMobile ? 20 : 30)}px;
`

interface IYoutubeCardProps {
    track: IVideoItem
    playlistId: string
}
const YoutubeCard = ({ track, playlistId }: IYoutubeCardProps) => {
    const [, dispatch] = useContext(PlaylistContext)!

    const handleAddSong = async () => {
        try {
            const { data } = await api.tracks.add(playlistId, track.id.videoId)
            dispatch({ type: ADD_TRACK, payload: { track: data } })
            AppToaster.show({ message: 'Song successfully added', intent: 'success', icon: 'tick' })
        } catch (e) {
            AppToaster.show({ message: 'Error while adding song', intent: 'danger', icon: 'error' })
            console.error(e)
        }
    }
    const isMobile = useMediaQuery({ maxWidth: 800 })
    return (
        <ListCard interactive>
            <OuterCardContainer isMobile={isMobile}>
                <InnerCardContainer isMobile={isMobile}>
                    <ThumbnailImage src={track.snippet.thumbnails.default.url} />
                    <TitleContainer>
                        <CardTitle isMobile={isMobile}>{track.snippet.title}</CardTitle>
                        <span className={Classes.UI_TEXT}>{track.snippet.description}</span>
                    </TitleContainer>
                </InnerCardContainer>
                <StyledButton intent='primary' onClick={handleAddSong}>
                    <Icon icon='plus' /> <span> Add to Playlist</span>
                </StyledButton>
            </OuterCardContainer>
        </ListCard>
    )
}

export default YoutubeCard
