
from flask import make_response
import json


def json_response(data, status=200, headers=None):
  if headers is None:
    headers = {}
  headers['Content-type'] = 'application/json'
  return make_response(json.dumps(data), status, headers)


def bad_request(message=None):
  if message is None:
    message = 'Malformed request.'
  return json_response({'errorName': 'BAD_REQUEST', 'message': message})
