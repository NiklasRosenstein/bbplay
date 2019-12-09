import React from 'react'
import client, {Playlist} from '../client'
import {InputGroup, Button} from '@blueprintjs/core'

type PlaylistViewProps = {
  id: number
}

type PlaylistViewState = {
  searchString: string
  playlist?: Playlist
}

export default class PlaylistView extends React.Component<PlaylistViewProps, PlaylistViewState> {

  state: PlaylistViewState = {searchString: ''}

  constructor(props: PlaylistViewProps) {
    super(props)
  }

  async componentDidMount() {
    let props = this.props as any
    let playlist = await client.getPlaylist(props.match.params.id)
    this.setState({playlist})
    this.youtubeSearch = this.youtubeSearch.bind(this)
  }

  async youtubeSearch(ev: React.MouseEvent<HTMLElement>) {
    ev.preventDefault()
    console.log(this.state)
    alert(this.state.searchString)
  }

  render() {
    return <div>
      <h1>{this.state.playlist? this.state.playlist.name : "Loading ..."}</h1>
      <form><div className="bp3-input-group">
        <InputGroup
          value={this.state.searchString}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({searchString: ev.currentTarget.value})
          }}/>
        <Button
          type="submit"
          icon="arrow-right"
          onClick={this.youtubeSearch}/>
      </div></form>
    </div>
  }

}
