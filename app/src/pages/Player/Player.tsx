import React from 'react'
import YouTube, { Options } from 'react-youtube'
import PageContainer from '../../components/PageContainer'
import { RouteComponentProps } from 'react-router'
import { useMediaQuery } from 'react-responsive'

export default ({ match }: RouteComponentProps<{ id: string }>) => {
    const { id } = match.params
    const isMobile = useMediaQuery({ maxWidth: 800 })
    const opts: Options = {
        height: '300',
        width: isMobile ? '100%' : '500',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }
    return (
        <PageContainer>
            <YouTube opts={opts} videoId={id}></YouTube>
        </PageContainer>
    )
}
