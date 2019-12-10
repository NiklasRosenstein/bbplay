
from ..base import Authentication
from bbplay.framework.rest import resource
from bbplay.server.app import app, config
from bbplay.server.models.playlist import *
from flask import abort, request
from nr.databind.core import Field, Struct
from nr.databind.json import JsonFieldName, JsonValidator
from pony import orm


class CreatePlaylistRequest(Struct):
  name = Field(str)


class DeletePlaylistRequest(Struct):
  id = Field(int)


class PutTrackRequest(Struct):
  video_id = Field(str, JsonFieldName('videoId'))


class VoteRequest(Struct):
  vote = Field(str)
  is_upvote = property(lambda self: self.vote == 'up')

  @JsonValidator
  def validate(self):
    if self.vote not in ('up', 'down'):
      raise ValueError('invalid value for "vote": {!r}'.format(self.vote))


@app.route('/api/v1/playlist', methods=['GET'])
@orm.db_session()
@resource()
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

  video_data = config.credentials.create_youtube_client().get_video(req.video_id)
  if video_data is None:
    return {'error': 'InvalidVideoId', 'message': 'Invalid YouTube Video ID.'}, 400

  track = Track(
    playlist=playlist,
    youtube_video_id=req.video_id,
    youtube_video_data=video_data,
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


@app.route('/api/v1/playlist/<playlist>/tracks/<track>/vote', methods=['POST'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_vote(playlist: str, track: int, req: VoteRequest) -> None:
  user = AnonymousUser.get_for_request(request)
  playlist = Playlist[playlist]
  track = Track[track]
  if track.playlist != playlist:
    abort(404)
  vote = track.votes.select(lambda v: v.by == user).first()
  if vote is None:
    vote = Vote(is_upvote=req.is_upvote, by=user, track=track)
  else:
    vote.is_upvot = req.is_upvot
  return None, 204


@app.route('/api/v1/playlist/<playlist>/tracks/<track>/vote', methods=['DELETE'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_vote_delete(playlist: str, track: int) -> None:
  user = AnonymousUser.get_for_request(request)
  playlist = Playlist[playlist]
  track = Track[track]
  if track.playlist != playlist:
    abort(404)
  vote = track.votes.select(lambda v: v.by == user).first()
  if vote is not None:
    vote.delete()
  return None, 204


@app.route('/api/v1/playlist/<playlist>/tracks/<track>/veto', methods=['POST'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_veto(playlist: str, track: int) -> None:
  user = AnonymousUser.get_for_request(request)
  playlist = Playlist[playlist]
  track = Track[track]
  if track.playlist != playlist:
    abort(404)
  if not track.vetoed_at:
    track.vetoed_at = datetime.utcnow()
  return None, 204
