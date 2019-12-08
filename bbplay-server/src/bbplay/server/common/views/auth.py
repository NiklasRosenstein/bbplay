
from bbplay.server.models.core import User
from flask import abort, request
from pony import orm
import functools


@orm.db_session
def authenticate():
  if 'Authorization' in request.headers:
    token = request.headers['Authorization']
    if not token.lower().startswith('bearer '):
      return None
    token = token[7:].strip()
  elif 'bbplay_token' in request.cookies:
    token = request.cookies['bbplay_token']
  else:
    return None
  return User.get_for_token(token)


def require_auth():
  def decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
      request.user = authenticate()
      if not request.user:
        abort(403)
      return func(*args, **kwargs)
    return wrapper
  return decorator
