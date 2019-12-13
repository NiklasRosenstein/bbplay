import { ITrack } from "../../service/track";
import { IPlaylist } from "../../service/playlist";
import { IPlaylistAction, PLAY, SET_TRACKS, SET_PLAYLIST, ADD_TRACK, REMOVE_TRACK, SET_CURRENT_TRACK, SET_NEXT_TRACK, SET_PLAYER, PAUSE, SET_PREV_TRACK, SET_UP_NEXT } from "./actions";

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
            return {
                ...state,
                tracks
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
            return {
                ...state,
                currentTrack: nextTrack,
                upNext: state.upNext.filter(track => track.id !== nextTrack.id),
                playedTracks: state.currentTrack ? [...state.playedTracks, state.currentTrack] : state.playedTracks
            }
        }
        case ADD_TRACK: {
            const { track } = action.payload
            return {
                ...state,
                tracks: [...state.tracks, track]
            }
        }
        case REMOVE_TRACK: {
            const { id } = action.payload
            return {
                ...state,
                tracks: state.tracks.filter(track => track.id !== id)
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