
import Client from './utils/Client'
import cookies from 'react-cookies'

interface OnTokenUpdate {
  (token: string | null): void
}

export interface Playlist {
  id: number
  name: string
  numTracks?: number
}

class BbplayClient extends Client {
  token: string | null
  onTokenUpdate: OnTokenUpdate | null = null

  constructor(baseUrl: string, token?: string | null) {
    super(baseUrl)
    this.token = token || null
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }

  async login(username: string, password: string): Promise<boolean> {
    let response = await this.requestJson('/v1/auth', {
      method: 'POST',
      json: {username, password}
    })
    this.token = response.token || null
    if (this.onTokenUpdate !== null) {
      this.onTokenUpdate(this.token)
    }
    return response.token !== undefined
  }

  async logout(): Promise<void> {
    await this.requestJson('/v1/auth', {
      method: 'DELETE',
      json: {token: this.token}
    })
    this.token = null
    if (this.onTokenUpdate !== null) {
      this.onTokenUpdate(null)
    }
  }

  async getPlaylists(): Promise<Playlist[]> {
    return await this.requestJson('/v1/playlist')
  }

  async getPlaylist(id: number): Promise<Playlist> {
    return await this.requestJson('/v1/playlist/' + id)
  }

  async createPlaylist(name: string): Promise<Playlist> {
    return await this.requestJson('/v1/playlist', {
      method: 'PUT',
      json: {name}
    })
  }

}

let client = new BbplayClient('http://localhost:5000/api', cookies.load('bbplay-token'))
client.onTokenUpdate = (token) => {
  if (token === null)
    cookies.remove('bbplay-token')
  else
    cookies.save('bbplay-token', token, {path: '/'})
}

export default client
