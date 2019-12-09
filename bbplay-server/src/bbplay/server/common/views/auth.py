
from bbplay.server.models.core import User, Token
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
  elif 'bbplay-token' in request.cookies:
    token = request.cookies['bbplay-token']
  else:
    return None
  token = Token.get(value=token)
  if not token:
    return None
  return token


def require_auth():
  def decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
      request.token = authenticate()
      if not request.token:
        abort(403)
      request.user = request.token.user
      return func(*args, **kwargs)
    return wrapper
  return decorator
