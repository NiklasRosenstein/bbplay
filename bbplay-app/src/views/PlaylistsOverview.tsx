import React from 'react'
import {Route, Link, Switch, useRouteMatch} from 'react-router-dom'
import client, { Playlist } from '../client'
import {Button, Breadcrumbs, Card, InputGroup} from '@blueprintjs/core'
import { QRCode } from 'react-qr-svg'
import Navbar from './Navbar'


class PlaylistCard extends React.Component<Playlist> {

  render() {
    return <Card className="playlist-card">
      <span className="number">#{this.props.id}</span>
      <Link to={`/app/playlist/${this.props.id}`}>
        <span className="name">{this.props.name}</span>
        <span className="num-tracks"> ({this.props.numTracks})</span>
      </Link>
    </Card>
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
      this.setState({playlists, playlistName: ''})
    }
  }

  render() {
    let breadcrumbs = [{ text: "Playlists" }]
    return <div className="playlists">
      <h1><Breadcrumbs items={breadcrumbs}/></h1>
      <form className="create-playlist">
        {client.isAuthenticated() ?
          <InputGroup
            value={this.state.playlistName}
            leftIcon="add"
            rightElement={<Button
              type="submit"
              icon="arrow-right"
              onClick={this.createPlaylist}/>}
            placeholder="Add playlist"
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
              this.setState({playlistName: ev.currentTarget.value})
            }}/>
          : null}
      </form>
      <div className="playlist-list">
        {this.state.playlists.map(x => <PlaylistCard key={x.id} {...x}/>)}
      </div>
    </div>
  }

}
