
from bbplay.server.app import app, config
from bbplay.server.models.playlist import *
from bbplay.server.common.views.auth import require_auth, authenticate
from bbplay.server.common.views.rest import body_accepts, json_response
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
@orm.db_session
def api_v1_playlist_get():
  results = []
  for playlist in Playlist.select():
    results.append(playlist.to_json())
  return json_response(results)


@app.route('/api/v1/playlist', methods=['PUT'])
@body_accepts(CreatePlaylistRequest)
@orm.db_session
@require_auth()
def api_v1_playlist_put(req):
  playlist = Playlist(name=req.name)
  orm.commit()
  return json_response(playlist.to_json())


@app.route('/api/v1/playlist', methods=['DELETE'])
@body_accepts(DeletePlaylistRequest)
@orm.db_session
@require_auth()
def api_v1_playlist_delete(req):
  playlist = Playlist.get(id=req.id)
  if not playlist:
    abort(404)
  playlist.delete()
  return json_response(None)


@app.route('/api/v1/playlist/<id>', methods=['GET'])
@orm.db_session
def api_v1_playlist_single_get(id):
  return json_response(Playlist[id].to_json())


@app.route('/api/v1/playlist/<id>', methods=['PUT'])
@body_accepts(PutTrackRequest)
@orm.db_session
def api_v1_playlist_single_put(req):
  """ Puts a track on the playlist. If the user is authenticated and the user
  has the right permissions, the request will be granted. Anonymous users
  may be limited to how many concurrent un-played tracks they can have in the
  queue at any given time. """

  raise NotImplementedError
