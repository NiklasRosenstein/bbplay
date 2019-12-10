
from ..base import Authentication
from bbplay.framework.rest import resource
from bbplay.server.app import app, config
from bbplay.server.models.playlist import *
from flask import abort, request
from nr.databind.core import Field, Struct
from nr.databind.json import JsonFieldName
from pony import orm


class CreatePlaylistRequest(Struct):
  name = Field(str)


class DeletePlaylistRequest(Struct):
  id = Field(int)


class PutTrackRequest(Struct):
  video_id = Field(str, JsonFieldName('videoId'))


@app.route('/api/v1/playlist', methods=['GET'])
@orm.db_session()
def api_v1_playlist_get():
  return [x.to_json() for x in Playlist.select()]


@app.route('/api/v1/playlist', methods=['PUT'])
@orm.db_session()
@resource()
def api_v1_playlist_put(token: Authentication, req: CreatePlaylistRequest):
  playlist = Playlist(name=req.name)
  orm.commit()
  return playlist


@app.route('/api/v1/playlist/<playlist>', methods=['GET'])
@orm.db_session()
@resource()
def api_v1_playlist_single_get(playlist: int):
  return Playlist[playlist]


@app.route('/api/v1/playlist/<playlist>', methods=['DELETE'])
@orm.db_session()
@resource()
def api_v1_playlist_delete(token: Authentication, playlist: str):
  playlist = Playlist[playlist].delete()
  return None, 204


@app.route('/api/v1/playlist/<playlist>/tracks', methods=['GET'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_get(playlist: str) -> 'List[Track]':
  user = AnonymousUser.get_for_request(request)
  return [x.to_json(user) for x in Playlist[playlist].tracks.select()]


@app.route('/api/v1/playlist/<playlist>/tracks', methods=['PUT'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_put(playlist: str, req: PutTrackRequest) -> Track:
  """ Puts a track on the playlist. If the user is authenticated and the user
  has the right permissions, the request will be granted. Anonymous users
  may be limited to how many concurrent un-played tracks they can have in the
  queue at any given time. """

  playlist = Playlist[playlist]
  user = AnonymousUser.get_for_request(request)
  if len(user.get_queued_tracks(playlist)) > 1:
    return {'error': 'QueueLimit', 'message': 'Max number of queued tracks.'}, 409

  track = Track(
    playlist=playlist,
    youtube_video_id=req.video_id,
    submitted_by=user
  )
  orm.commit()
  return track.to_json(user)


@app.route('/api/v1/playlist/<playlist>/tracks/<track>', methods=['DELETE'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_delete(playlist: str, track: int) -> None:
  token = Authentication.extract(request)
  user = AnonymousUser.get_for_request(request)
  playlist = Playlist[playlist]
  track = Track[track]
  if track.playlist != playlist:
    abort(404)  # Track for this playlist doesn't exist
  if not token and track.submitted_by != user:
    abort(403)
  track.delete()
