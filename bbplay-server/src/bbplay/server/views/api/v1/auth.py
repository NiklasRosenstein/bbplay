
from ..base import Authentication
from bbplay.framework.rest import resource
from bbplay.server.app import app
from bbplay.server.models.core import User, Token
from flask import abort, request
from nr.databind.core import Field, Struct
from pony import orm


class LoginRequest(Struct):
  username = Field(str)
  password = Field(str)


class LoginResponse(Struct):
  token = Field(str)


@app.route('/api/v1/auth', methods=['GET'])
@orm.db_session()
@resource()
def api_v1_auth_get(token: Authentication):
  return {'username': token.user.username}


@app.route('/api/v1/auth', methods=['POST'])
@orm.db_session()
@resource()
def api_v1_auth_post(req: LoginRequest):
  if not req.username:
    abort(400)
  user = User.get(username=req.username)
  if not user or not user.check_password(req.password):
    abort(403)
  return LoginResponse(token=user.create_token().value)


@app.route('/api/v1/auth', methods=['DELETE'])
@orm.db_session()
@resource()
def api_v1_auth_delete(token: Authentication):
  token.delete()
  return None, 204
