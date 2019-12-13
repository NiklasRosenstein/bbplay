import React, { useState, useContext } from 'react'
import api from '../../service/apiService'
import { InputGroup, Button } from '@blueprintjs/core'
import styled from 'styled-components'
import { PlaylistContext } from './AuthWrapper'
import { AppToaster } from '../../components/Toaster'
import { ADD_TRACK } from './actions'

const Container = styled.div`
    height: ${(props: { offset: number }) => `calc(100vh - ${props.offset}px)`};
`

export default ({ playlistId }: { playlistId: string }) => {
    const [youtubeLink, setYoutubeLink] = useState('')
    const [, dispatch] = useContext(PlaylistContext)!

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setYoutubeLink(ev.target.value)
    }

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        handleAddSong()
    }

    const handleAddSong = async () => {
        try {
            var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
            var match = youtubeLink.match(regExp)
            if (match && match[2].length == 11) {
                const { data } = await api.tracks.add(playlistId, match[2])
                dispatch({ type: ADD_TRACK, payload: { track: data } })
                AppToaster.show({ message: 'Song successfully added', intent: 'success', icon: 'tick' })
            } else {
                throw Error('Rip')
            }
        } catch (e) {
            AppToaster.show({ message: 'Error while adding song', intent: 'danger', icon: 'error' })
            console.error(e)
        }
    }

    return (
        <Container offset={310}>
            <form onSubmit={handleSubmit}>
                <InputGroup
                    leftIcon='search'
                    rightElement={<Button icon='arrow-right' type='submit' />}
                    placeholder='Paste YouTube Link'
                    value={youtubeLink}
                    onChange={handleChange}
                />
            </form>
        </Container>
    )
}
