
import { authInstance } from './axiosInstances'
import { AxiosResponse } from 'axios'


export interface Track {
    id: number
    playlistId: string
    videoId: string
    upvotes: number
    downvotes: number
    submittedTime: string
    playedTime: string | null
    vetoedTime: string | null
    vetoed: boolean
    submittedByYou: boolean
}


export const getMany = (playlistId: string): Promise<AxiosResponse<Track[]>> => authInstance.get(`/playlist/${playlistId}/tracks`)

export const remove = (playlistId: string, trackId: number): Promise<AxiosResponse<Track>> => authInstance.delete(`/playlist/${playlistId}/tracks/${trackId}`)

export const add = (playlistId: string, videoId: string): Promise<AxiosResponse<Track>> => authInstance.put(`/playlist/${playlistId}/tracks`, { videoId })