# bbplay-server API Documentation

## Authorization

Endpoints that require authorization check the existence of a user's
token in the `Authorization` header (1) or the `bbplay-token` cookie (2).

(1) Must be of the form `Bearer <TOKEN>`  
(2) Must be of the form `<TOKEN>`

## auth

### GET `/api/v1/auth` (authd)

If the token is valid, returns the user's information
(which is currently only the `username`).

Example response:

```json
{
  "username": "admin"
}
```

### POST `/api/v1/auth`

Supply a username and password to generate a new authentication token for
a user.

Example request:

```json
{
  "username": "admin",
  "password": "admin"
}
```

Example response:

```json
{
  "token": "0a9176d9-40be-418d-b913-ebde771ab1ce"
}
```

### DELETE `/api/v1/auth` (authd)

Revokes the current token.

## playlist

### Object: `Playlist`

* `id` (str): The UUID of the playlist.
* `name` (str): The Playlist name.
* `numTracks` (int): The number of tracks currently in the playlist.
* `htmlUrl` (str): The public URL to view the playlist.

Example Playlist:

```json
{
  "id": "a72424d0-07d4-4cf7-88d8-a4cd94a11dc3",
  "name": "BushBash in the mix",
  "numTracks": 19,
  "htmlUrl": "https://www.bushbash.de/bbplay/playlists/a72424d0-07d4-4cf7-88d8-a4cd94a11dc3"
}
```

### Object: `Track`

* `id` (int): The ID of the track.
* `playlistId` (str): The ID of the playlist that the track belongs to.
* `videoId` (str): The YouTube video ID for this track.
* `upvotes` (int): The number of upvotes for this track.
* `downvotes` (int): The number of downvotes for this track.
* `submittedTime` (str): The datetime when the track was submitted.
* `playedTime` (str|null): The datetime when the track was played by the DJ.
* `vetoedTime` (str|null): The datetime when the track was vetoed by the DJ.
* `vetoed` (boolean): Indicates whether your track was skipped by the DJ.
* `submittedByYou` (boolean): Indicates whether the track was submitted by
  the person requesting the resource.

### GET `/api/v1/playlist` (authd)

Returns a list of all playlists.

Return type: `Playlist[]`

### PUT `/api/v1/playlist` (authd)

Creates a new playlist.

Return type: `Playlist`

Example request:

```json
{
  "name": "BushBash in the mix"
}
```

### GET `/api/v1/playlist/<playlist>` (authd)

Return type: `Playlist`

### DELETE `/api/v1/playlist/<playlist>` (authd)

Deletes the playlist with the specified `<playlist>`.

Return type: `null`

### GET `/api/v1/playlist/<playlist>/tracks`

Returns all tracks in a playlist.

Return type: `Track[]`

### PUT `/api/v1/playlist/<playlist>/tracks`

Adds a new track to the playlist. Anonymous users may be limited by the number
or types of tracks they can submit to a playlist.

Return type: `Track`

*Todo: What kind of error would be returned if the user is not allowed to submit a track?*

### DELETE `/api/v1/playlist/<playlist>/tracks/<track>`

Deletes a track from the playlist. Authenticated users are allowed to remove
any track from a playlist, anonymous users can only delete their own tracks.

Return type: `null`

## youtube

### GET `/api/v1/youtube/search`

Proxies a YouTube video search request.

Query parameters:

* `q` (required) &ndash; The search string.
* `pageToken` (optional) &ndash; The token for the page to retrieve.
* `pageSize` (optional) &ndash; The page size (default: 10)

Example response:

```json
{
  "nextPageToken": "CA0daa",
  "values": [
    {"kind":"youtube#searchResult","etag":"\"j6xRRd8dTPVVptg711_CSPADRfg/k1MIvVz0dChH9AAb_oDPeh3_czU\"","id":{"kind":"youtube#video","videoId":"0uyLRPmmYPk"},"snippet":{"publishedAt":"2019-12-08T13:00:01.000Z","channelId":"UCq8up0Ew9K0IiRxbz75BZsg","title":"A Complete Beginner&#39;s Guide To League of Legends","description":"We upload a TON of useful and informative guides on our website over at https://www.proguides.com/yt Whether you're a beginner or a veteran, Proguides will ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/0uyLRPmmYPk/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/0uyLRPmmYPk/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/0uyLRPmmYPk/hqdefault.jpg","width":480,"height":360}},"channelTitle":"ProGuides Challenger League of Legends Guides","liveBroadcastContent":"none"}},
    {"kind":"youtube#searchResult","etag":"\"j6xRRd8dTPVVptg711_CSPADRfg/DkWi-5pFK8xbcKnexAqBOT8S1XY\"","id":{"kind":"youtube#video","videoId":"btB28MdMfw0"},"snippet":{"publishedAt":"2019-12-08T11:51:15.000Z","channelId":"UCWVz07amFIiK8n1HwiJmU1A","title":"INCREDIBLE MOMENTS in the League of Legends","description":"INCREDIBLE MOMENTS in the League of Legends ❤ FB: https://www.facebook.com/LongAK1005/ Gmail: longak1005@gmail.com ❤ Credits: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/btB28MdMfw0/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/btB28MdMfw0/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/btB28MdMfw0/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Sara LoL","liveBroadcastContent":"none"}},
    {"kind":"youtube#searchResult","etag":"\"j6xRRd8dTPVVptg711_CSPADRfg/PwcfIwNfJDEUMH4OhVVytc3M6R4\"","id":{"kind":"youtube#channel","channelId":"UC2t5bjwHdUX4vM2g8TRDq5g"},"snippet":{"publishedAt":"2009-02-09T20:19:08.000Z","channelId":"UC2t5bjwHdUX4vM2g8TRDq5g","title":"League of Legends","description":"Recently recognized as the most played video game in the world—100 million play every month—League of Legends® is a multiplayer online battle arena ...","thumbnails":{"default":{"url":"https://yt3.ggpht.com/-AEerXPqHm3M/AAAAAAAAAAI/AAAAAAAAAAA/S8WpkwxItLQ/s88-c-k-no-mo-rj-c0xffffff/photo.jpg"},"medium":{"url":"https://yt3.ggpht.com/-AEerXPqHm3M/AAAAAAAAAAI/AAAAAAAAAAA/S8WpkwxItLQ/s240-c-k-no-mo-rj-c0xffffff/photo.jpg"},"high":{"url":"https://yt3.ggpht.com/-AEerXPqHm3M/AAAAAAAAAAI/AAAAAAAAAAA/S8WpkwxItLQ/s800-c-k-no-mo-rj-c0xffffff/photo.jpg"}},"channelTitle":"League of Legends","liveBroadcastContent":"upcoming"}},
    {"kind":"youtube#searchResult","etag":"\"j6xRRd8dTPVVptg711_CSPADRfg/RlUC4Ecj-_ZbKOkhXkomemOb_n0\"","id":{"kind":"youtube#video","videoId":"PUzta_hm238"},"snippet":{"publishedAt":"2019-12-07T17:15:10.000Z","channelId":"UCNAf1k0yIjyGu3k9BwAg3lg","title":"Calvert-Lewin&#39;s brace stuns Chelsea💥 | Everton 3-1 Chelsea | Premier League Highlights","description":"SUBSCRIBE ▻ http://bit.ly/SSFootballSub PREMIER LEAGUE HIGHLIGHTS ▻ http://bit.ly/SkySportsPLHighlights Dominic Calvert-Lewin's double gave Duncan ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/PUzta_hm238/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/PUzta_hm238/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/PUzta_hm238/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Sky Sports Football","liveBroadcastContent":"none"}},
    {"kind":"youtube#searchResult","etag":"\"j6xRRd8dTPVVptg711_CSPADRfg/HgdL8NG7Hp8Lsq3gwTfqv95H2oE\"","id":{"kind":"youtube#video","videoId":"SW8DUz4BpF0"},"snippet":{"publishedAt":"2019-12-08T12:57:27.000Z","channelId":"UCHOgFpGQ1DG-PmzWVhPA_Jg","title":"MI-AM LUAT ANTRENOR LA WEEKEND LEAGUE pe FIFA 20 !","description":"Donatii AICI (apari pe ecran): https://www.tipeeestream.com/dizomania/donation ➥Moderatorul este 10 EURO ➥Promovarea este 10 EURO (Doar la canale de ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/SW8DUz4BpF0/default_live.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/SW8DUz4BpF0/mqdefault_live.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/SW8DUz4BpF0/hqdefault_live.jpg","width":480,"height":360}},"channelTitle":"Dizomania","liveBroadcastContent":"live"}}
  ]
}
```