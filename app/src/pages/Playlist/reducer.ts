import { Track } from "../../service/track";
import { Playlist } from "../../service/playlist";
import { IPlaylistAction, SET_TRACKS, SET_PLAYLIST, ADD_TRACK, REMOVE_TRACK, SET_CURRENT_TRACK, SET_NEXT_TRACK } from "./actions";

export interface IPlaylistState {
    playlist?: Playlist
    tracks: Track[]
    currentTrack?: Track
}

export const initialState: IPlaylistState = {
    tracks: [],
}

export const reducer = (state: IPlaylistState, action: IPlaylistAction): IPlaylistState => {
    switch (action.type) {
        case SET_TRACKS:
            const { tracks } = action.payload
            return {
                ...state,
                tracks
            };
        case SET_CURRENT_TRACK:
            const { currentTrack } = action.payload
            return {
                ...state,
                currentTrack
            }
        case SET_NEXT_TRACK:
            const currentTrackIndex = state.tracks.findIndex(track => track.id === (state.currentTrack && state.currentTrack.id))
            return {
                ...state,
                currentTrack: state.tracks.length > currentTrackIndex ? state.tracks[(currentTrackIndex + 1) % state.tracks.length] : state.currentTrack
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