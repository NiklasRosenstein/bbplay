import React, { useState, useContext } from 'react'
import { IVideoItem } from '../../service/youtube'
import api from '../../service/apiService'
import { InputGroup, Button, Spinner } from '@blueprintjs/core'
import { ListContainer } from '../../components/List'
import styled from 'styled-components'
import YoutubeCard from './YoutubeCard'
import { useMediaQuery } from 'react-responsive'
import { PlaylistContext } from './Playlist'

const Container = styled.div`
    height: ${(props: { offset: number }) => `calc(100vh - ${props.offset}px)`};
`

export default ({ playlistId }: { playlistId: string }) => {
    const [searchString, setSearchString] = useState('')

    const [videos, setVideos] = useState<IVideoItem[]>([])
    const [loading, setLoading] = useState(false)
    const isMobile = useMediaQuery({ maxWidth: 800 })

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(ev.target.value)
    }

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        try {
            setLoading(true)
            const { data } = await api.youtube.search(searchString)
            setLoading(false)
            setVideos(data.values)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Container offset={310}>
            <form onSubmit={handleSubmit}>
                <InputGroup
                    leftIcon='search'
                    rightElement={<Button icon='arrow-right' type='submit' />}
                    placeholder='Search YouTube'
                    value={searchString}
                    onChange={handleChange}
                />
            </form>

            <ListContainer>
                {loading ? (
                    <Spinner size={Spinner.SIZE_SMALL} />
                ) : (
                    videos.map(track => <YoutubeCard track={track} playlistId={playlistId} />)
                )}
            </ListContainer>
        </Container>
    )
}
