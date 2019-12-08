
from . import db
from ..config.roles import register_role_consumer
from nr.databind.core import Field, Struct
from nr.databind.json import JsonFieldName
from pony import orm
import hashlib
import logging


@register_role_consumer('initial-user')
class InitialUserRole(Struct):
  username = Field(str)
  password = Field(str, default=None)
  password_hash = Field(str, JsonFieldName('password-hash'), default=None)

  @orm.db_session
  def execute(self):
    logger = logging.getLogger(__name__)
    if not self.password and not self.password_hash:
      logger.warning('InitialUserRole missing password/password-hash')
      return

    user = User.get(username=self.username)
    if user and not user.initial:
      logger.error('InitialUserRole targets non-initial user {!r}'
                    .format(user.username))
      return
    if user:
      if self.password:
        user.set_password(self.password)
      else:
        user.password_hash = self.password_hash
      logger.info('Updated initial user {!r}'.format(self.username))
    else:
      user = User(username=self.username, password=self.password,
        password_hash=self.password_hash, initial=True)
      logger.info('Created initial user {!r}'.format(self.username))


@register_role_consumer('initial-resource')
class InitialResourceRole(Struct):
  id = Field(str)

  @classmethod
  @orm.db_session
  def execute_once(self):
    logger = logging.getLogger(__name__)
    logger.info('Bulk-deleting initial resources')
    Resource.select(lambda r: r.initial).delete(bulk=True)

  @orm.db_session
  def execute(self):
    logger = logging.getLogger(__name__)
    resource = Resource.get(id=self.id)
    if resource is not None:
      if resource.initial:
        logger.warn('InitialResourceRole {!r} already exists'.format(self.id))
      else:
        logger.error('InitialResourceRole {!r} is a non-initial resource'.format(self.id))
      return
    resource = Resource(id=self.id, initial=True)
    logger.info('InitialResourceRole {!r} created'.format(self.id))


class User(db.Entity):
  """ Represents a user. An initial user can only be modified from the
  configuration file. At startup, all initial users are re-set. """

  username = orm.PrimaryKey(str)
  password_hash = orm.Required(str)
  initial = orm.Required(bool, default=False)
  permissions = orm.Set('Permission')

  def __init__(self, **kwargs):
    password = kwargs.pop('password', None)
    if password is not None:
      kwargs['password_hash'] = 'foo32'
    super().__init__(**kwargs)
    if password is not None:
      self.set_password(password)

  def set_password(self, password):
    password += 'ThisIsMySalt(*'  # TODO (@NiklasRosenstein)
    self.password_hash = hashlib.sha256(password.encode('utf8')).hexdigest()


class Resource(db.Entity):
  """ Represents a resource node. An initial resource can only be modified
  from the configuration file. At startup, all initial resources are deleted
  and their associated permissions are flushed. """

  id = orm.PrimaryKey(str)
  initial = orm.Required(bool, default=False)
  permissions = orm.Set('Permission')


class Permission(db.Entity):
  name = orm.Required(str)
  user = orm.Required(User)
  resource = orm.Required(Resource)
  orm.PrimaryKey(name, user, resource)
