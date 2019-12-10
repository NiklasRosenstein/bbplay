import React, { useEffect, useState, useContext } from 'react'
import { ListContainer } from '../../components/List'
import styled from 'styled-components'
import api from '../../service/apiService'
import { Spinner, Card, Button, Icon } from '@blueprintjs/core'
import { PlaylistContext } from './Playlist'
import { SET_TRACKS, REMOVE_TRACK, SET_CURRENT_TRACK } from './actions'
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { Track } from '../../service/track'
import { AppToaster } from '../../components/Toaster'
import { Redirect } from 'react-router'
import { useMediaQuery } from 'react-responsive'

const Container = styled.div`
    height: ${(props: { offset: number }) => `calc(100vh - ${props.offset}px)`};
`

const DroppableContainer = styled.div`
    height: 100%;
    border-radius: 4px;
    border: ${(props: { isDraggingOver: boolean }) =>
        props.isDraggingOver ? '2px dashed lightgreen' : '2px dashed lightgrey'} !important;
`

const DraggableContainer = styled.div`
    margin: 1rem;
`

const StyledCard = styled(Card)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid
        ${(props: { isDragging: boolean; isPlaying?: boolean }) =>
            props.isPlaying ? 'lightgreen' : props.isDragging ? 'lightblue' : '#30404d'};
`

const reorder = (tracks: Track[], startIndex: number, endIndex: number) => {
    const result = Array.from(tracks)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

export default ({ playlistId }: { playlistId: string }) => {
    const [{ tracks, currentTrack }, dispatch] = useContext(PlaylistContext)!
    const [loading, setLoading] = useState(false)
    const [redirect, setRedirect] = useState('')
    const isMobile = useMediaQuery({ maxWidth: 800 })

    useEffect(() => {
        setLoading(true)
        api.tracks
            .getMany(playlistId)
            .then(({ data }) => {
                dispatch({ type: SET_TRACKS, payload: { tracks: data } })
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }, [dispatch, playlistId])

    const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
        if (!result.destination) {
            return
        }

        const newTracks = reorder(tracks, result.source.index, result.destination.index)

        dispatch({ type: SET_TRACKS, payload: { tracks: newTracks } })
    }

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

    const handleTrackClick = (track: Track) => () => {
        dispatch({ type: SET_CURRENT_TRACK, payload: { currentTrack: track } })
        //setRedirect(`/player/${track.videoId}`)
    }

    if (redirect) {
        return <Redirect to={redirect} push />
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container offset={isMobile && currentTrack !== undefined ? 410 : currentTrack ? 510 : 210}>
                <Droppable droppableId='droppable'>
                    {(provided, snapshot) => (
                        <DroppableContainer
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <ListContainer>
                                {loading ? (
                                    <Spinner size={Spinner.SIZE_SMALL} />
                                ) : (
                                    tracks.map((track, index) => (
                                        <Draggable key={track.id} draggableId={track.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <DraggableContainer
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <StyledCard
                                                        isPlaying={currentTrack && currentTrack.id === track.id}
                                                        onClick={handleTrackClick(track)}
                                                        isDragging={snapshot.isDragging}
                                                    >
                                                        {track.id}
                                                        <Button onClick={handleDeleteClick(track.id)}>
                                                            <Icon icon='trash' />
                                                        </Button>
                                                    </StyledCard>
                                                </DraggableContainer>
                                            )}
                                        </Draggable>
                                    ))
                                )}
                            </ListContainer>
                        </DroppableContainer>
                    )}
                </Droppable>
            </Container>
        </DragDropContext>
    )
}
