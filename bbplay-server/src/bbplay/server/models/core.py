
from . import db
from ..config.roles import register_role_consumer
from datetime import datetime, timedelta
from nr.databind.core import Field, Struct, UnionType
from nr.databind.json import JsonFieldName
from pony import orm
from typing import Union
import hashlib
import logging
import uuid


@register_role_consumer('initial-user')
class InitialUserRole(Struct):
  username = Field(str)
  password = Field(str, default=None)
  password_hash = Field(str, JsonFieldName('password-hash'), default=None)

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
  def execute_once(self):
    logger = logging.getLogger(__name__)
    logger.info('Bulk-deleting initial resources')
    Resource.select(lambda r: r.initial).delete(bulk=True)

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


@register_role_consumer('initial-resource-additions')
class InitialResourceAdditionsRole(Struct):
  class UsernameStatement(Struct):
    usernames = Field([str])

  id = Field(str)
  permissions = Field([str])
  statements = Field([UnionType({
    "username": UsernameStatement
  })])

  def execute(self):
    logger = logging.getLogger(__name__)
    resource = Resource.get(id=self.id)
    if not resource:
      logger.error('InitialResourceAdditionsRole resource {!r} does not exist'.format(self.id))
      return
    if not resource.initial:
      logger.error('InitialResourceAdditionsRole resource {!r} must be initial'.format(self.id))
      return
    for statement in self.statements:
      assert isinstance(statement, self.UsernameStatement)
      for username in statement.usernames:
        user = User.get(username=username)
        if not user:
          logger.error('InitialResourceAdditionsRole user {!r} does not exist'
            .format(username))
          continue
        for perm in self.permissions:
          Permission(name=perm, user=user, resource=resource)


class User(db.Entity):
  """ Represents a user. An initial user can only be modified from the
  configuration file. At startup, all initial users are re-set. """

  username = orm.PrimaryKey(str)
  password_hash = orm.Required(str)
  initial = orm.Required(bool, default=False)
  permissions = orm.Set('Permission')
  tokens = orm.Set('Token')

  def __init__(self, **kwargs):
    password = kwargs.pop('password', None)
    if password is not None:
      kwargs['password_hash'] = 'foo32'
    super().__init__(**kwargs)
    if password is not None:
      self.set_password(password)

  def set_password(self, password: str):
    password += 'ThisIsMySalt(*'  # TODO (@NiklasRosenstein)
    self.password_hash = hashlib.sha256(password.encode('utf8')).hexdigest()

  @classmethod
  def get_for_token(cls, token_str: str) -> 'Token':
    token = Token.get(value=token_str)
    if token and token.expires_at < datetime.utcnow():
      token.delete()
      return None
    return token.user if token else None

  def create_token(self) -> 'Token':
    return Token(user=self)

  def check_permission(self, resource: Union[str, 'Resource'], perm: str) -> bool:
    if isinstance(resource, str):
      resource = Resource[resource]
    return Permission.get(name=perm, user=self, resource=resource) is not None


class Token(db.Entity):
  user = orm.Required(User)
  value = orm.PrimaryKey(str, default=lambda: str(uuid.uuid4()))  # TODO (@NiklasRosenstein): Security considerations
  expires_at = orm.Required(datetime, default=lambda: datetime.utcnow() + timedelta(days=2))  # TODO (@NiklasRosenstein): Configurable


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
