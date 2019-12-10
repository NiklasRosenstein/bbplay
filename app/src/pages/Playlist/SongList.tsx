import React, { useEffect, useState, useContext } from 'react'
import { ListContainer } from '../../components/List'
import styled from 'styled-components'
import api from '../../service/apiService'
import { Spinner } from '@blueprintjs/core'
import { PlaylistContext } from './Playlist'
import { SET_TRACKS } from './actions'
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { ITrack } from '../../service/track'
import { Redirect } from 'react-router'
import { useMediaQuery } from 'react-responsive'
import SongCard from './SongCard'

const Container = styled.div``

const DroppableContainer = styled.div`
    height: 100%;
    border-radius: 4px;
    border: ${(props: { isDraggingOver: boolean }) =>
        props.isDraggingOver ? '2px dashed lightgreen' : '2px dashed lightgrey'} !important;
`
const DraggableContainer = styled.div`
    margin: 1rem;
`

const reorder = (tracks: ITrack[], startIndex: number, endIndex: number) => {
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

    if (redirect) {
        return <Redirect to={redirect} push />
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container>
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
                                                    <SongCard
                                                        track={track}
                                                        playlistId={playlistId}
                                                        isDragging={snapshot.isDragging}
                                                    />
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
