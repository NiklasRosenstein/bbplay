import React, { useState, useContext } from 'react'
import YouTube, { Options } from 'react-youtube'
import { useMediaQuery } from 'react-responsive'
import { PlaylistContext } from './Playlist'
import { SET_PLAYER, PLAY, PAUSE } from './actions'

interface IEmbeddedPlayer {
    id: string
    handleEnd: () => void
}
export default ({ id, handleEnd }: IEmbeddedPlayer) => {
    const [, dispatch] = useContext(PlaylistContext)!

    const isMobile = useMediaQuery({ maxWidth: 800 })
    const opts: Options = {
        height: isMobile ? '0' : '300',
        width: isMobile ? '0' : '500',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }

    const handlePlay = () => {
        dispatch({ type: PLAY })
    }

    const handlePause = () => {
        dispatch({ type: PAUSE })
    }

    const handleReady = (event: { target: any }) => dispatch({ type: SET_PLAYER, payload: { player: event.target } })

    return (
        <YouTube
            opts={opts}
            onReady={handleReady}
            onPause={handlePause}
            onPlay={handlePlay}
            onEnd={handleEnd}
            videoId={id}
        ></YouTube>
    )
}
