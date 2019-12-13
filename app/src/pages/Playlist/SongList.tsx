import React, { useEffect, useState, useContext } from 'react'
import { ListContainer } from '../../components/List'
import styled from 'styled-components'
import api from '../../service/apiService'
import { Spinner } from '@blueprintjs/core'
import { PlaylistContext } from './AuthWrapper'
import { SET_TRACKS } from './actions'
import SongCard from './SongCard'

const Container = styled.div``

const SongCardContainer = styled.div`
    margin: 1rem;
`

export default ({ playlistId, isPublic }: { playlistId: string; isPublic?: boolean }) => {
    const [{ tracks }, dispatch] = useContext(PlaylistContext)!
    const [loading, setLoading] = useState(false)

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

    return (
        <Container>
            <ListContainer>
                {loading ? (
                    <Spinner size={Spinner.SIZE_SMALL} />
                ) : (
                    tracks.map((track, index) => (
                        <SongCardContainer>
                            <SongCard isPublic={isPublic} track={track} playlistId={playlistId} />
                        </SongCardContainer>
                    ))
                )}
            </ListContainer>
        </Container>
    )
}
