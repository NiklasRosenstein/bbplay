import React, { useContext, useState, useEffect } from 'react'
import styled from 'styled-components'
import { PlaylistContext } from './AuthWrapper'
import { Icon, Button, Slider, ButtonGroup } from '@blueprintjs/core'
import { SET_NEXT_TRACK, SET_PREV_TRACK } from './actions'
import Flex from '../../components/Flex'
import { useMediaQuery } from 'react-responsive'
import api from '../../service/apiService'

const Footer = styled.footer`
    position: fixed;
    padding: 5px;
    bottom: 0;
    height: ${(props: { isMobile: boolean }) => (props.isMobile ? 90 : 60)}px;
    width: 100%;
    background: rgb(40, 45, 51);
    display: flex;
    flex-direction: ${(props: { isMobile: boolean }) => (props.isMobile ? 'column' : 'row')};
    align-items: center;
    justify-content: space-between;
`
const ThumbnailImage = styled.img`
    border-radius: 4px;
    width: 50px;
    height: 50px;
`

const InfoContainer = styled(Flex)`
    flex: 5;
    width: 100%;
`

const CardTitle = styled.span`
    font-size: 16px;
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

const TitileContainer = styled(Flex)`
    width: 100%;
    margin: 0px 2rem;
`

const TimeLabel = styled.label`
    width: 40px;
    font-size: 12px;
    &:first-child {
        text-align: left;
        margin-right: 0.5rem;
    }
    &:last-child {
        text-align: right;
        margin-left: 0.5rem;
    }
`

const extractDuration = (duration: string) => {
    const split = duration.split('PT')
    const min = split[1].split('M')
    const sec = min[1].split('S')
    try {
        const res = parseInt(min[0], 10) * 60 + parseInt(sec[0], 10)
        return res
    } catch (e) {
        return 0
    }
}

const extractTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const relativeSeconds = Math.round(seconds % 60)
    return `${minutes < 10 ? '0' + minutes : minutes}:${relativeSeconds < 10 ? '0' + relativeSeconds : relativeSeconds}`
}

export default () => {
    const [{ currentTrack, player, playing, playlist }, dispatch] = useContext(PlaylistContext)!
    const [currentTime, setCurrentTime] = useState(0)
    const isMobile = useMediaQuery({ maxWidth: 800 })

    const handleClick = () => {
        if (playing) {
            player && player.pauseVideo()
        } else {
            player && player.playVideo()
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const newTime = player ? player.getCurrentTime() : 0
            setCurrentTime(newTime)
        }, 1000)
        return () => clearInterval(interval)
    }, [player, currentTrack])

    const handleNextClick = () => {

        dispatch({ type: SET_NEXT_TRACK })
    }

    const handlePrevClick = () => {
        dispatch({ type: SET_PREV_TRACK })
    }

    const handleSliderRelease = (value: number) => {
        player.seekTo(value)
    }

    const handleSliderChange = (value: number) => {
        setCurrentTime(value)
    }
    const duration = currentTrack ? extractDuration(currentTrack.videoData.contentDetails.duration) : 1

    return (
        <Footer isMobile={isMobile}>
            {currentTrack && (
                <>
                    <InfoContainer align='center' justify='flex-start'>
                        <ThumbnailImage src={currentTrack.videoData.snippet.thumbnails.default.url} />
                        <TitileContainer direction='column' align='flex-start' justify='center'>
                            <CardTitle>{currentTrack.videoData.snippet.title}</CardTitle>
                            <Flex style={{ width: '100%' }} align='center' justify='space-between'>
                                <TimeLabel>{extractTime(currentTime)}</TimeLabel>
                                <Slider
                                    labelRenderer={() => ''}
                                    min={0}
                                    labelStepSize={duration}
                                    max={duration}
                                    stepSize={0.1}
                                    onChange={handleSliderChange}
                                    onRelease={handleSliderRelease}
                                    value={currentTime}
                                />
                                <TimeLabel>{extractTime(duration)}</TimeLabel>
                            </Flex>
                        </TitileContainer>
                    </InfoContainer>
                    <Controls>
                        <ButtonGroup>
                            <Button onClick={handlePrevClick}>
                                <Icon icon='step-backward' />
                            </Button>
                            <Button onClick={handleClick}>
                                <Icon icon={playing ? 'pause' : 'play'} />
                            </Button>
                            <Button onClick={handleNextClick}>
                                <Icon icon='step-forward' />
                            </Button>
                        </ButtonGroup>
                    </Controls>
                </>
            )}
        </Footer>
    )
}
