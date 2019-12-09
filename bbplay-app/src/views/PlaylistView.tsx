import React from 'react'
import client, {Playlist} from '../client'
import {Icon, InputGroup, Button, Breadcrumbs, Breadcrumb, IBreadcrumbProps} from '@blueprintjs/core'

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
    alert(this.state.searchString)
  }

  render() {
    let breadcrumbs = [
      { href: "/app", text: "Playlists" },
      { text: this.state.playlist ? this.state.playlist.name : "Loading ..." }
    ]
    return <div>
      <h1><Breadcrumbs items={breadcrumbs}/>
      </h1>
      <form>
        <InputGroup
          leftIcon="search"
          rightElement={<Button
            type="submit"
            icon="arrow-right"
            onClick={this.youtubeSearch}/>}
          placeholder="Search YouTube"
          value={this.state.searchString}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({searchString: ev.currentTarget.value})
          }}/>
        </form>
    </div>
  }

}
