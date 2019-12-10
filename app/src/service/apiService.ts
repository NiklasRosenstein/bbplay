import { login, me, logout } from "./auth";
import { getOne as getOneList, getMany as getManyLists, create as createList, remove as removeList } from "./playlist";
import { getMany as getManyTracks, add as addTrack, remove as removeTrack, vote, veto, removeVote } from "./track";

import { search } from "./youtube";

import axios from 'axios'

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = process.env.REACT_APP_AUTH_TOKEN;

const api = {
    auth: {
        login,
        me,
        logout
    },
    playlists: {
        getOne: getOneList,
        getMany: getManyLists,
        create: createList,
        remove: removeList
    },
    youtube: {
        search
    },
    tracks: {
        getMany: getManyTracks,
        add: addTrack,
        remove: removeTrack,
        vote,
        veto,
        removeVote
    }
}

export default api