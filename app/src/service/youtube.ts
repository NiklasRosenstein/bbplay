
import { authInstance } from './axiosInstances'
import { AxiosResponse } from 'axios'

export interface IThumbnail {
    url: string,
    width: number,
    height: number
}

export interface IVideoItem {
    kind: string,
    etag: string,
    contentDetails: {
        caption: boolean,
        definition: string,
        dimension: string,
        duration: string,
        licensedContent: boolean,
        projection: string,
        regionRestriction: {
            allowed: string[]
        }
    }
    id: {
        kind: string,
        videoId: string,
        channelId?: string,
        playlistId?: string
    },
    snippet: {
        publishedAt: Date,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {
            default: IThumbnail
            medium: IThumbnail
            high: IThumbnail
            [key: string]: IThumbnail
        },
        channelTitle: string,
        liveBroadcastContent: string
    }
}
interface IYouTubeResponse {
    kind: string,
    etag: string,
    nextPageToken: string,
    prevPageToken: string,
    regionCode: string,
    pageInfo: {
        totalResults: number,
        resultsPerPage: number
    },
    values: IVideoItem[]
}


export const search = (query: string, pageSize?: number, pageToken?: number): Promise<AxiosResponse<IYouTubeResponse>> => authInstance.get(`/youtube/search?q=${query}${pageToken ? `&pageToken=${pageToken}` : ''}${pageSize ? `&pageSize=${pageSize}` : ''}`)

