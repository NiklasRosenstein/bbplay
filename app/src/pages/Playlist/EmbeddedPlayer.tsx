import React from 'react'
import YouTube, { Options } from 'react-youtube'
import { useMediaQuery } from 'react-responsive'

interface IEmbeddedPlayer {
    id: string
    handleEnd: () => void
}
export default ({ id, handleEnd }: IEmbeddedPlayer) => {
    const isMobile = useMediaQuery({ maxWidth: 800 })
    const opts: Options = {
        height: isMobile ? '200' : '300',
        width: isMobile ? '100%' : '500',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }
    return <YouTube opts={opts} onEnd={handleEnd} videoId={id}></YouTube>
}
