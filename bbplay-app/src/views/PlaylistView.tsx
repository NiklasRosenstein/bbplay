import React from 'react'
import client, {Playlist} from '../client'

type PlaylistViewProps = {
  id: number
}

type PlaylistViewState = {
  playlist?: Playlist
}

export default class PlaylistView extends React.Component<PlaylistViewProps, PlaylistViewState> {

  state: PlaylistViewState = {}

  constructor(props: PlaylistViewProps) {
    super(props)
  }

  async componentDidMount() {
    let props = this.props as any
    let playlist = await client.getPlaylist(props.match.params.id)
    this.setState({playlist})
  }

  render() {
    return <div>
      <h1>{this.state.playlist? this.state.playlist.name : "Loading ..."}</h1>
    </div>
  }

}
