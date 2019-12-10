
import { authInstance } from './axiosInstances'
import { AxiosResponse } from 'axios'


export interface Playlist {
    id: string
    name: string
    numTracks: number
    htmlUrl: string
}


export const getMany = (): Promise<AxiosResponse<Playlist[]>> => authInstance.get('/playlist')

export const getOne = (id: string): Promise<AxiosResponse<Playlist>> => authInstance.get(`/playlist/${id}`)

export const create = (name: string): Promise<AxiosResponse<Playlist>> => authInstance.put('/playlist', { name })

export const remove = (id: string): Promise<AxiosResponse<null>> => authInstance.delete(`/playlist/${id}`)
