import { ITrack } from "../../service/track"
import { Playlist } from "../../service/playlist"

export const SET_TRACKS = 'playlist/SET_TRACKS'
export const SET_PLAYER = 'playlist/SET_PLAYER'
export const ADD_TRACK = 'playlist/ADD_TRACK'
export const REMOVE_TRACK = 'playlist/REMOVE_TRACK'
export const SET_PLAYLIST = 'playlist/SET_PLAYLIST'
export const SET_NEXT_TRACK = 'playlist/SET_NEXT_TRACK'
export const SET_PREV_TRACK = 'playlist/SET_PREV_TRACK'

export const SET_CURRENT_TRACK = 'playlist/SET_CURRENT_TRACK'
export const PLAY = 'playlist/PLAY'
export const PAUSE = 'playlist/PAUSE'

export interface Play {
    type: typeof PLAY
}

export interface Pause {
    type: typeof PAUSE
}

export interface SetPlayer {
    type: typeof SET_PLAYER
    payload: {
        player: any
    }
}
export interface SetCurrentTrack {
    type: typeof SET_CURRENT_TRACK
    payload: {
        currentTrack: ITrack
    }
}

export interface SetNextTrack {
    type: typeof SET_NEXT_TRACK
}

export interface SetPrevTrack {
    type: typeof SET_PREV_TRACK
}
export interface AddTrack {
    type: typeof ADD_TRACK
    payload: {
        track: ITrack
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
        tracks: ITrack[]
    }
}

export interface SetPlaylist {
    type: typeof SET_PLAYLIST
    payload: {
        playlist: Playlist
    }
}

export type IPlaylistAction = SetTracks | SetPlaylist | AddTrack | RemoveTrack | SetCurrentTrack | SetNextTrack | SetPlayer | Play | Pause | SetPrevTrack
