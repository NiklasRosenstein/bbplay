
from nr.databind.core import Struct, ObjectMapper
from nr.databind.json import JsonModule
import logging

_role_consumers = {}


def register_role_consumer(role, role_cls=None):

  # Return a class decorator if the role class was not specified.
  if role_cls is None:
    def decorator(role_cls):
      assert role_cls is not None
      register_role_consumer(role, role_cls)
      return role_cls
    return decorator

  # Register the role class.
  if not issubclass(role_cls, Struct):
    raise TypeError('role_cls must be subclass of Struct')
  assert hasattr(role_cls, 'execute'), 'role class requires an execute() method'
  if role in _role_consumers:
    raise RuntimeError('consumer for role {!r} already registered'.format(role))
  _role_consumers[role] = role_cls


def execute_role_consumers(produced_roles):
  logger = logging.getLogger(__name__)
  mapper = ObjectMapper(JsonModule())
  ignored_roles = set()

  for role_cls in _role_consumers.values():
    if hasattr(role_cls, 'execute_once'):
      role_cls.execute_once()

  for role in produced_roles:
    if role['role'] in ignored_roles:
      continue
    if role['role'] not in _role_consumers:
      logger.warning('produced role {!r} is not consumed'.format(role['role']))
      ignored_roles.add(role['role'])
      continue
    role_cls = _role_consumers[role['role']]
    mapper.deserialize(role, role_cls).execute()
