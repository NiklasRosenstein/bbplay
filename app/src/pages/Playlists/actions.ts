import { IPlaylist } from "../../service/playlist"

export const SET_PLAYLISTS = 'playlists/SET_PLAYLISTS'
export const ADD_PLAYLIST = 'playlists/ADD_PLAYLIST'
export const REMOVE_PLAYLIST = 'playlists/REMOVE_PLAYLIST'

export interface AddPlaylist {
    type: typeof ADD_PLAYLIST
    payload: {
        playlist: IPlaylist
    }
}
export interface SetPlaylists {
    type: typeof SET_PLAYLISTS
    payload: {
        playlists: IPlaylist[]
    }
}

export interface RemovePlaylist {
    type: typeof REMOVE_PLAYLIST
    payload: {
        id: string
    }
}

export type IPlaylistsAction = AddPlaylist | SetPlaylists | RemovePlaylist