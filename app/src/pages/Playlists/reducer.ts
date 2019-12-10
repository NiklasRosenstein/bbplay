import { Playlist } from "../../service/playlist";
import { IPlaylistsAction, SET_PLAYLISTS, ADD_PLAYLIST, REMOVE_PLAYLIST, } from "./actions";

export interface IPlaylistsState {
    playlists: Playlist[]
}

export const initialState: IPlaylistsState = {
    playlists: []
}

export const reducer = (state: IPlaylistsState, action: IPlaylistsAction): IPlaylistsState => {
    switch (action.type) {
        case SET_PLAYLISTS:
            const { playlists } = action.payload
            return {
                ...state,
                playlists
            };
        case REMOVE_PLAYLIST:
            const { id } = action.payload
            return {
                ...state,
                playlists: state.playlists.filter(playlist => playlist.id !== id)
            }
        case ADD_PLAYLIST:
            const { playlist } = action.payload
            return { ...state, playlists: [...state.playlists, playlist] };
        default:
            throw new Error();
    }
}