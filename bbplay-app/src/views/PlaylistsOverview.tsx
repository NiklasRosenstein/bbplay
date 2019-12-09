import React from 'react'
import {Route, Link, Switch, useRouteMatch} from 'react-router-dom'
import client, { Playlist } from '../client'
import { Button, InputGroup, Icon } from '@blueprintjs/core'
import { QRCode } from 'react-qr-svg'
import Navbar from './Navbar'


class PlaylistCard extends React.Component<Playlist> {

  render() {
    return <div className="playlist-card">
      <span className="number">#{this.props.id}</span>
      <span className="name">{this.props.name}</span>
      <span className="num-tracks"> ({this.props.numTracks})</span>
      <span className="create-qr">
        <Link to={`/app/playlist/${this.props.id}`}>
          <QRCode level="L" value="hello" style={{width: 40}}/>
        </Link>
      </span>
    </div>
  }

}

type DashboardViewState = {
  playlistName: string
  playlists: Playlist[]
}

export default class PlaylistsOverview extends React.Component<{}, DashboardViewState> {

  state: DashboardViewState = {
    playlistName: '',
    playlists: []
  }

  constructor(props: {}) {
    super(props)
    this.createPlaylist = this.createPlaylist.bind(this)
  }

  async componentDidMount() {
    let playlists = await client.getPlaylists()
    this.setState({playlists})
    this.createPlaylist = this.createPlaylist.bind(this)
  }

  async createPlaylist(ev: React.MouseEvent<HTMLElement>) {
    ev.preventDefault()
    let playlist = await client.createPlaylist(this.state.playlistName)
    if (playlist !== null) {
      let playlists = this.state.playlists as any[]
      playlists.push(playlist)
      this.setState({playlists})
    }
  }

  render() {
    return <div className="playlists">
      <h1>Playlists</h1>
      <form className="create-playlist">
        {client.isAuthenticated() ?
        <div className="bp3-input-group">
          <InputGroup
            value={this.state.playlistName}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({playlistName: ev.currentTarget.value})
            }}/>
          <Button
            type="submit"
            icon="arrow-right"
            onClick={this.createPlaylist}/>
        </div> : null}
      </form>
      <div className="playlist-list">
        {this.state.playlists.map(x => <PlaylistCard key={x.id} {...x}/>)}
      </div>
    </div>
  }

}
