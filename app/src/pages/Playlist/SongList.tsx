import React, { useEffect, useState, useContext } from 'react'
import { ListContainer } from '../../components/List'
import styled from 'styled-components'
import api from '../../service/apiService'
import { Spinner } from '@blueprintjs/core'
import { PlaylistContext } from './AuthWrapper'
import { SET_UP_NEXT, SET_CURRENT_TRACK } from './actions'
import SongCard from './SongCard'

const Container = styled.div``

const SongCardContainer = styled.div`
    margin: 1rem;
`

export default ({ playlistId, isPublic }: { playlistId: string; isPublic?: boolean }) => {
    const [{ upNext, currentTrack }, dispatch] = useContext(PlaylistContext)!
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const interval = setInterval(() => {
            api.tracks
                .getUpNext(playlistId)
                .then(({ data }) => {
                    dispatch({ type: SET_UP_NEXT, payload: { upNext: data } })
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
            api.tracks
                .getNowPlaying(playlistId)
                .then(({ data }) => {
                    dispatch({ type: SET_CURRENT_TRACK, payload: { currentTrack: data } })
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
        }, 5000)
        return () => clearInterval(interval)
    }, [dispatch, playlistId])

    return (
        <Container>
            <ListContainer>
                {loading ? (
                    <Spinner size={Spinner.SIZE_SMALL} />
                ) : (
                    <>
                        <SongCardContainer>
                            {currentTrack && (
                                <SongCard isPublic={isPublic} track={currentTrack} playlistId={playlistId} />
                            )}
                        </SongCardContainer>

                        {upNext.map((track, index) => (
                            <SongCardContainer>
                                <SongCard isPublic={isPublic} track={track} playlistId={playlistId} />
                            </SongCardContainer>
                        ))}
                    </>
                )}
            </ListContainer>
        </Container>
    )
}
