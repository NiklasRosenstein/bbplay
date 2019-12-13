
from ..base import Authentication
from bbplay.framework.rest import resource
from bbplay.server.app import app, config
from bbplay.server.models.playlist import *
from datetime import datetime
from flask import abort, request
from nr.databind.core import Field, Struct
from nr.databind.json import JsonFieldName, JsonValidator
from pony import orm
from typing import Optional


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


class SetNowPlayingRequest(Struct):
  track_id = Field(int, JsonFieldName('trackId'))
  status = Field(str)

  PLAYING = 'playing'
  PAUSED = 'paused'
  STOPPED = 'stopped'

  @JsonValidator
  def validate(self):
    if self.status not in (self.PLAYING, self.PAUSED, self.STOPPED):
      raise ValueError('invalid status: {!r}'.format(self.status))


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


@app.route('/api/v1/playlist/<playlist>/tracks/up-next', methods=['GET'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_up_next(playlist: str) -> 'List[Track]':
  user = AnonymousUser.get_for_request(request)
  tracks = Playlist[playlist].tracks.select(lambda x: not x.played_at).order_by(Track.submitted_at)
  return [x.to_json(user) for x in tracks]


@app.route('/api/v1/playlist/<playlist>/tracks/history', methods=['GET'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_history(playlist: str) -> 'List[Track]':
  user = AnonymousUser.get_for_request(request)
  tracks = Playlist[playlist].tracks.select(lambda x: x.played_at).order_by(orm.desc(Track.played_at))
  return [x.to_json(user) for x in tracks]


@app.route('/api/v1/playlist/<playlist>/tracks/now-playing', methods=['PUT'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_now_playing(playlist: str, token: Authentication, req: SetNowPlayingRequest) -> None:
  if req.status == req.PAUSED:
    abort(501)
  playlist = Playlist[playlist]
  track = Track[req.track_id]
  if req.status == req.STOPPED:
    if track != playlist.current_track:
      abort(400, 'This is not the current track. Did not stop the track.')
    playlist.current_track = None
    track.playing_in = None
  else:
    track.played_at = datetime.utcnow()
    playlist.current_track = track
  return None, 204


@app.route('/api/v1/playlist/<playlist>/tracks/now-playing', methods=['GET'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_get_now_playing(playlist: str) -> Optional[Track]:
  playlist = Playlist[playlist]
  track = playlist.current_track
  if not track:
    return None, 204
  return track.to_json(AnonymousUser.get_for_request(request))


@app.route('/api/v1/playlist/<playlist>/tracks', methods=['PUT'])
@orm.db_session()
@resource()
def api_v1_playlist_tracks_put(playlist: str, req: PutTrackRequest) -> Track:
  """ Puts a track on the playlist. If the user is authenticated and the user
  has the right permissions, the request will be granted. Anonymous users
  may be limited to how many concurrent un-played tracks they can have in the
  queue at any given time. """

  token = Authentication.extract(request, None)
  playlist = Playlist[playlist]
  user = AnonymousUser.get_for_request(request)
  if not token and len(user.get_queued_tracks(playlist)) >= 1:
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
  token = Authentication.extract(request, None)
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
