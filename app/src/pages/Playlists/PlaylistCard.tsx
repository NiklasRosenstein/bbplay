import React, { useContext } from 'react'
import styled from 'styled-components'
import { IPlaylist } from '../../service/playlist'
import { PlaylistsContext } from './Playlists'
import { AppToaster } from '../../components/Toaster'
import api from '../../service/apiService'
import { REMOVE_PLAYLIST } from './actions'
import { Link } from 'react-router-dom'
import { ListCard } from '../../components/List'
import { Button, Icon } from '@blueprintjs/core'

interface IPlaylistCardProps {
    playlist: IPlaylist
}

const OuterCardContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const PlaylistCard = ({ playlist }: IPlaylistCardProps) => {
    const { id, name, numTracks } = playlist
    const [, dispatch] = useContext(PlaylistsContext)!
    const handleDeleteClick = async (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
        ev.preventDefault()
        try {
            await api.playlists.remove(id)
            AppToaster.show({ message: 'Playlist successfully removed.', intent: 'success' })
            dispatch({ type: REMOVE_PLAYLIST, payload: { id } })
        } catch (e) {
            AppToaster.show({ message: 'Error while removing playlist.', intent: 'danger' })
        }
    }
    return (
        <Link to={`/playlist/${id}`}>
            <ListCard interactive>
                <OuterCardContainer>
                    <div>
                        <span className='name'>{name}</span>
                        <span className='num-tracks'>({numTracks})</span>
                    </div>
                    <Button onClick={handleDeleteClick}>
                        <Icon icon='trash' />
                    </Button>
                </OuterCardContainer>
            </ListCard>
        </Link>
    )
}

export default PlaylistCard
