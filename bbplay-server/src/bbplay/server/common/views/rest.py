
from nr.databind.core import Struct, ObjectMapper, SerializationError
from nr.databind.json import JsonModule
from flask import request, make_response
import functools
import json


def body_accepts(struct_cls):
  assert issubclass(struct_cls, Struct), struct_cls
  def decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
      mapper = ObjectMapper(JsonModule())
      try:
        obj = mapper.deserialize(request.json, struct_cls)
      except (SerializationError, ValueError) as exc:
        # TODO (@NiklasRosenstein): Is it _safe_ to return the exception message?
        return bad_request(str(exc))
      result = func(obj, *args, **kwargs)
      if isinstance(result, Struct):
        result = json_response(mapper.serialize(result, type(result)))
      return result
    return wrapper
  return decorator


def json_response(data, status=200, headers=None):
  if headers is None:
    headers = {}
  headers['Content-type'] = 'application/json'
  return make_response(json.dumps(data), status, headers)


def bad_request(message=None):
  if message is None:
    message = 'Malformed request.'
  return json_response({'errorName': 'BAD_REQUEST', 'message': message})
