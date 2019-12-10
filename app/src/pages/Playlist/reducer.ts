import { ITrack } from "../../service/track";
import { Playlist } from "../../service/playlist";
import { IPlaylistAction, PLAY, SET_TRACKS, SET_PLAYLIST, ADD_TRACK, REMOVE_TRACK, SET_CURRENT_TRACK, SET_NEXT_TRACK, SET_PLAYER, PAUSE, SET_PREV_TRACK } from "./actions";

export interface IPlaylistState {
    playlist?: Playlist
    tracks: ITrack[]
    currentTrack?: ITrack
    player?: any
    playing: boolean
}

export const initialState: IPlaylistState = {
    tracks: [],
    playing: false
}

export const reducer = (state: IPlaylistState, action: IPlaylistAction): IPlaylistState => {
    switch (action.type) {
        case PLAY:
            return {
                ...state,
                playing: true
            }
        case PAUSE:
            return {
                ...state,
                playing: false
            }
        case SET_TRACKS:
            const { tracks } = action.payload
            return {
                ...state,
                tracks
            };
        case SET_PLAYER:
            const { player } = action.payload
            return {
                ...state, player
            }
        case SET_CURRENT_TRACK:
            const { currentTrack } = action.payload
            return {
                ...state,
                currentTrack
            }
        case SET_PREV_TRACK: {

            const currentTrackIndex = state.tracks.findIndex(track => track.id === (state.currentTrack && state.currentTrack.id))
            return {
                ...state,
                currentTrack: currentTrackIndex > -1 ? state.tracks[currentTrackIndex > 0 ? currentTrackIndex - 1 : state.tracks.length - 1] : state.currentTrack
            }
        }

        case SET_NEXT_TRACK: {
            const currentTrackIndex = state.tracks.findIndex(track => track.id === (state.currentTrack && state.currentTrack.id))
            return {
                ...state,
                currentTrack: currentTrackIndex > -1 ? state.tracks[(currentTrackIndex + 1) % state.tracks.length] : state.currentTrack
            }
        }
        case ADD_TRACK:
            const { track } = action.payload
            return {
                ...state,
                tracks: [...state.tracks, track]
            }
        case REMOVE_TRACK:
            const { id } = action.payload
            return {
                ...state,
                tracks: state.tracks.filter(track => track.id !== id)
            }
        case SET_PLAYLIST:
            const { playlist } = action.payload
            return { ...state, playlist };
        default:
            throw new Error();
    }
}