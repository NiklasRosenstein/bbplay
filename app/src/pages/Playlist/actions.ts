import { Track } from "../../service/track"
import { Playlist } from "../../service/playlist"

export const SET_TRACKS = 'playlist/SET_TRACKS'
export const ADD_TRACK = 'playlist/ADD_TRACK'
export const REMOVE_TRACK = 'playlist/REMOVE_TRACK'
export const SET_PLAYLIST = 'playlist/SET_PLAYLIST'
export const SET_NEXT_TRACK = 'playlist/SET_NEXT_TRACK'
export const SET_CURRENT_TRACK = 'playlist/SET_CURRENT_TRACK'

export interface SetCurrentTrack {
    type: typeof SET_CURRENT_TRACK
    payload: {
        currentTrack: Track
    }
}

export interface SetNextTrack {
    type: typeof SET_NEXT_TRACK
}
export interface AddTrack {
    type: typeof ADD_TRACK
    payload: {
        track: Track
    }
}

export interface RemoveTrack {
    type: typeof REMOVE_TRACK
    payload: {
        id: number
    }
}
export interface SetTracks {
    type: typeof SET_TRACKS
    payload: {
        tracks: Track[]
    }
}

export interface SetPlaylist {
    type: typeof SET_PLAYLIST
    payload: {
        playlist: Playlist
    }
}

export type IPlaylistAction = SetTracks | SetPlaylist | AddTrack | RemoveTrack | SetCurrentTrack | SetNextTrack