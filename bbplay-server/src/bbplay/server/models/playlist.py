
from . import db
from .core import Resource
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
  playlist = orm.Required(Playlist)
  youtube_video_id = orm.Required(str)
  submitted_by = orm.Required('AnonymousUser')
  submitted_at = orm.Required(datetime, default=datetime.utcnow)
  played_at = orm.Optional(datetime)
  votes = orm.Set('Vote')
  disqualified = orm.Required(bool, default=False)


class AnonymousUser(db.Entity):
  ip = orm.Required(str)
  browser_id = orm.Required(str)
  date_connected = orm.Required(datetime, default=datetime.utcnow)
  tracks = orm.Set(Track)
  votes = orm.Set('Vote')


class Vote(db.Entity):
  is_upvot = orm.Required(bool)
  track = orm.Required(Track)
  by = orm.Required(AnonymousUser)
  orm.PrimaryKey(track, by)

  @property
  def is_downvote(self):
    return not self.is_upvote
