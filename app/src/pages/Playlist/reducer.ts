import { ITrack, PlayingStatus } from "../../service/track";
import { IPlaylist } from "../../service/playlist";
import { IPlaylistAction, PLAY, SET_TRACKS, SET_PLAYLIST, ADD_TRACK, REMOVE_TRACK, SET_CURRENT_TRACK, SET_NEXT_TRACK, SET_PLAYER, PAUSE, SET_PREV_TRACK, SET_UP_NEXT } from "./actions";
import api from "../../service/apiService";

export interface IPlaylistState {
    playlist?: IPlaylist
    tracks: ITrack[]
    upNext: ITrack[]
    playedTracks: ITrack[]
    currentTrack?: ITrack
    player?: any
    playing: boolean
}

export const initialState: IPlaylistState = {
    tracks: [],
    upNext: [],
    playedTracks: [],
    playing: false
}

export const reducer = (state: IPlaylistState, action: IPlaylistAction): IPlaylistState => {
    switch (action.type) {
        case PLAY: {
            return {
                ...state,
                playing: true
            }
        }
        case PAUSE: {
            return {
                ...state,
                playing: false
            }
        }
        case SET_TRACKS: {
            const { tracks } = action.payload
            const setCurrentTrack = state.currentTrack === undefined && state.tracks.length === 0 && tracks.length > 0
            if (setCurrentTrack) {
                api.tracks.putNowPlaying(state.playlist ? state.playlist.id : '', tracks[0] ? tracks[0].id : -1, PlayingStatus.playing)
            }
            return {
                ...state,
                upNext: tracks,
                currentTrack: setCurrentTrack ? tracks[0] : state.currentTrack
            };
        }
        case SET_PLAYER: {
            const { player } = action.payload
            return {
                ...state, player
            }
        }
        case SET_CURRENT_TRACK: {
            const { currentTrack } = action.payload
            return {
                ...state,
                currentTrack
            }
        }
        case SET_UP_NEXT: {
            const { upNext } = action.payload
            return {
                ...state,
                upNext
            }
        }
        case SET_PREV_TRACK: {
            const prevTrack = state.playedTracks[state.playedTracks.length - 1]
            return {
                ...state,
                currentTrack: prevTrack,
                upNext: state.currentTrack ? [state.currentTrack, ...state.upNext] : state.upNext,
                playedTracks: state.playedTracks.filter(track => track.id !== prevTrack.id)
            }
        }

        case SET_NEXT_TRACK: {
            const nextTrack = state.upNext[0]
            api.tracks.putNowPlaying(state.playlist ? state.playlist.id : '', nextTrack ? nextTrack.id : state.currentTrack ? state.currentTrack.id : -1, nextTrack ? PlayingStatus.playing : PlayingStatus.stopped)

            return {
                ...state,
                currentTrack: nextTrack,
                upNext: state.upNext.filter(track => nextTrack ? track.id !== nextTrack.id : false),
                playedTracks: state.currentTrack ? [...state.playedTracks, state.currentTrack] : state.playedTracks
            }
        }
        case ADD_TRACK: {
            const { track } = action.payload
            return {
                ...state,
                upNext: [...state.upNext, track]
            }
        }
        case REMOVE_TRACK: {
            const { id } = action.payload
            return {
                ...state,
                upNext: state.upNext.filter(track => track.id !== id)
            }
        }
        case SET_PLAYLIST: {
            const { playlist } = action.payload
            return { ...state, playlist };
        }
        default:
            throw new Error();
    }
}