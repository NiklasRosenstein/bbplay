import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { PlaylistContext } from './Playlist'
import { Icon, Button } from '@blueprintjs/core'
import { SET_NEXT_TRACK, SET_PREV_TRACK } from './actions'

const Footer = styled.footer`
    position: fixed;
    padding: 5px;
    bottom: 0;
    height: 60px;
    width: 100%;
    background: rgb(40, 45, 51);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const ThumbnailImage = styled.img`
    border-radius: 4px;
    width: 40px;
    height: 40px;
    margin-right: 1rem;
`

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`

const CardTitle = styled.span`
    font-size: 16px;
    max-width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 120px;
`

export default () => {
    const [{ currentTrack, player, playing }, dispatch] = useContext(PlaylistContext)!
    const handleClick = () => {
        if (playing) {
            player && player.pauseVideo()
        } else {
            player && player.playVideo()
        }
    }

    const handleNextClick = () => {
        dispatch({ type: SET_NEXT_TRACK })
    }

    const handlePrevClick = () => {
        dispatch({ type: SET_PREV_TRACK })
    }
    return (
        <Footer>
            {currentTrack && (
                <>
                    <TitleContainer>
                        <ThumbnailImage src={currentTrack.videoData.snippet.thumbnails.default.url} />
                        <CardTitle>{currentTrack.videoData.snippet.title}</CardTitle>
                    </TitleContainer>
                    <Controls>
                        <Button onClick={handlePrevClick}>
                            <Icon icon='step-backward' />
                        </Button>
                        <Button onClick={handleClick}>
                            <Icon icon={playing ? 'pause' : 'play'} />
                        </Button>
                        <Button onClick={handleNextClick}>
                            <Icon icon='step-forward' />
                        </Button>
                    </Controls>
                </>
            )}
        </Footer>
    )
}