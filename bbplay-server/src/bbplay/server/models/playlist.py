
from . import db
from .core import User
from ..app import config
from datetime import datetime
from pony import orm
import uuid


class Playlist(db.Entity):
  id = orm.PrimaryKey(str, default=lambda: str(uuid.uuid4()))
  name = orm.Required(str)
  date_created = orm.Required(datetime, default=datetime.utcnow)
  tracks = orm.Set('Track')

  def to_json(self):
    return {
      'id': self.id,
      'name': self.name,
      'numTracks': len(self.tracks),
      'htmlUrl': config.server.get_frontend_url() + '/app/playlist/' + self.id}


class Track(db.Entity):
  playlist = orm.Required(Playlist, lazy=True)
  youtube_video_id = orm.Required(str)
  youtube_video_data = orm.Required(orm.Json)
  submitted_by = orm.Required('AnonymousUser')
  submitted_at = orm.Required(datetime, default=datetime.utcnow)
  played_at = orm.Optional(datetime)
  vetoed_at = orm.Optional(datetime)
  #vetoed_by = orm.Optional(User)  # TODO: Requires reverse attribute in User ...
  votes = orm.Set('Vote')
  disqualified = orm.Required(bool, default=False)

  def to_json(self, current_user: 'Optional[AnonymousUser]'):
    return {
      'id': self.id,
      'playlistId': self.playlist.id,
      'videoId': self.youtube_video_id,
      'videoData': self.youtube_video_data,
      'upvotes': len(self.votes.select(lambda x: x.is_upvote)),
      'downvotes': len(self.votes.select(lambda x: not x.is_upvote)),
      'submittedTime': self.submitted_at,
      'playedTime': self.played_at,
      'vetoedTime': self.vetoed_at,
      'vetoed': self.vetoed_at is not None,
      'submittedByYou': (current_user == self.submitted_by) if current_user is not None else None
    }


class AnonymousUser(db.Entity):
  ip = orm.Required(str)
  browser_id = orm.Required(str)
  date_connected = orm.Required(datetime, default=datetime.utcnow)
  tracks = orm.Set(Track)
  votes = orm.Set('Vote')
  orm.PrimaryKey(ip, browser_id)

  @classmethod
  def get_for_request(cls, request):
    ip = request.remote_addr
    browser_id = 'TODO'
    return cls.get(ip=ip, browser_id=browser_id) or cls(ip=ip, browser_id=browser_id)

  def get_queued_tracks(self, playlist: Playlist):
    return self.tracks.select(lambda x: x.playlist == playlist and (x.played_at is None or x.disqualified))


class Vote(db.Entity):
  is_upvote = orm.Required(bool)
  track = orm.Required(Track)
  by = orm.Required(AnonymousUser)
  orm.PrimaryKey(track, by)

  @property
  def is_downvote(self):
    return not self.is_upvote
