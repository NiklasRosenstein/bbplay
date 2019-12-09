
from bbplay.server.app import app
from bbplay.server.common.views.auth import require_auth
from bbplay.server.common.views.rest import body_accepts, json_response
from bbplay.server.models.core import User
from flask import abort, request
from nr.databind.core import Field, Struct
from pony import orm


class LoginRequest(Struct):
  username = Field(str)
  password = Field(str)


class LoginResponse(Struct):
  token = Field(str)


@app.route('/api/v1/auth', methods=['GET'])
@orm.db_session
@require_auth()
def api_v1_auth_get():
  return {'username': request.user.username}


@app.route('/api/v1/auth', methods=['POST'])
@body_accepts(LoginRequest)
@orm.db_session
def api_v1_auth_post(req: LoginRequest) -> LoginResponse:
  if not req.username:
    abort(400)
  user = User.get(username=req.username)
  if not user or not user.check_password(req.password):
    abort(403)
  return {'token': user.create_token().value}


@app.route('/api/v1/auth', methods=['DELETE'])
@orm.db_session
@require_auth()
def api_v1_auth_delete():
  request.token.delete()
  return json_response(None)
