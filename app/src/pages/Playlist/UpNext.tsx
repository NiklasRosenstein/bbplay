import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { PlaylistContext } from './AuthWrapper'
import { SET_UP_NEXT, SET_TRACKS, SET_CURRENT_TRACK } from './actions'
import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd'
import { ITrack } from '../../service/track'
import SongCard from './SongCard'
import { H6 } from '@blueprintjs/core'
import api from '../../service/apiService'
import { PlayingStatus } from '../../service/track'

const Container = styled.div``

const DroppableContainer = styled.div`
    border-radius: 4px;
    margin-bottom: 6rem;
    height: ${(props: { isDraggingOver: boolean; itemCount: number }) => props.itemCount * 8.5}rem;
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

export default ({ playlistId, isPublic }: { playlistId: string; isPublic?: boolean }) => {
    const [{ upNext, currentTrack }, dispatch] = useContext(PlaylistContext)!

    const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
        if (!result.destination) {
            return
        }
        const newTracks = reorder(upNext, result.source.index, result.destination.index)
        dispatch({ type: SET_UP_NEXT, payload: { upNext: newTracks } })
    }

    useEffect(() => {
        api.tracks.getUpNext(playlistId).then(({ data }) => {
            dispatch({ type: SET_TRACKS, payload: { tracks: data } })
            if (data.length) {
                api.tracks.putNowPlaying(playlistId, data[0].id, PlayingStatus.playing)
                dispatch({ type: SET_CURRENT_TRACK, payload: { currentTrack: data[0] } })
            }
        })
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            const { data } = await api.tracks.getUpNext(playlistId)
            dispatch({ type: SET_TRACKS, payload: { tracks: data } })
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return upNext.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Container>
                <Droppable isDropDisabled={isPublic} droppableId='droppable'>
                    {(provided, snapshot) => (
                        <DroppableContainer
                            itemCount={upNext.length}
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {upNext.map((track, index) => (
                                <Draggable
                                    isDragDisabled={isPublic}
                                    key={track.id}
                                    draggableId={track.id.toString()}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <DraggableContainer
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <SongCard
                                                draggable
                                                isPublic={isPublic}
                                                track={track}
                                                playlistId={playlistId}
                                                isDragging={snapshot.isDragging}
                                            />
                                        </DraggableContainer>
                                    )}
                                </Draggable>
                            ))}
                        </DroppableContainer>
                    )}
                </Droppable>
            </Container>
        </DragDropContext>
    ) : (
        <H6>There is no queue yet. Start playing a song to generate a queue.</H6>
    )
}
