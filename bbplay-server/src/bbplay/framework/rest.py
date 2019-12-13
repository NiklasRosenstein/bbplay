
from flask import abort, make_response, request, Response
from nr.commons.notset import NotSet
from nr.databind.core import Struct, ObjectMapper, SerializationValueError
from nr.databind.json import JsonModule, JsonEncoder
from werkzeug.exceptions import HTTPException
import functools
import json

mapper = ObjectMapper(JsonModule())
json_encoder = JsonEncoder(mapper)


def json_response(data, status=200, headers=None):
  """ Converts *data* into a Flask JSON response. """

  if isinstance(data, Struct):
    data = ObjectMapper(JsonModule()).serialize(data, type(data))
  elif hasattr(data, 'to_json'):
    data = data.to_json()

  if headers is None:
    headers = {}
  headers['Content-type'] = 'application/json'
  return make_response(json_encoder.encode(data), status, headers)


class Param:
  """ A resource parameter. Can be created from a Flask request. """

  @classmethod
  def extract(cls, request: 'flask.Request') -> 'Any':
    raise NotImplementedError


class DatabindStructParam(Param):
  """ Param struct type wrapper. """

  def __init__(self, struct, mapper=None):
    assert issubclass(struct, Struct), type(struct)
    self._struct = struct
    self._mapper = mapper or ObjectMapper(JsonModule())

  def extract(self, request: 'flask.Request') -> 'Any':
    if request.json is None:
      abort(400)
    try:
      return self._mapper.deserialize(request.json, self._struct)
    except SerializationValueError as exc:
      abort(400, str(exc))


class AuthenticationParam(Param):

  def __init__(self, header=None, cookie=None, resolve=None):
    self._header = header
    self._cookie = cookie
    self._resolve = resolve

  def extract(self, request: 'flask.Request', default=NotSet) -> 'Any':
    if self._header and self._header in request.headers:
      value = request.headers[self._header]
      if not value.startswith('Bearer '):
        return abort(403) if default is NotSet else default
      value = value[7:]
    elif self._cookie and self._cookie in request.cookies:
      value = request.cookies
    else:
      return abort(403) if default is NotSet else default
    if self._resolve:
      value = self._resolve(value)
      if value is None:
        return abort(403) if default is NotSet else default
    return value


def wrap_param(x: 'Any') -> 'Union[Param | Type[Param]]':
  if isinstance(x, type) and issubclass(x, Struct):
    return DatabindStructParam(x)
  elif not isinstance(x, Param):
    raise TypeError('cannot understand annotation {!r}'.format(x))
  return x


def resource() -> 'Callable[types.FunctionType, [types.FunctionType]]':
  """ Decorator for Flask routes that parses the annotations of a function
  to retrieve the data that needs to be extracted from the request. The return
  values of routes are automatically coerced into JSON responses. Errors are
  caught and turned into JSON responses as well. """

  def decorator(func: 'types.FunctionType'):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
      try:
        for key, value in func.__annotations__.items():
          if key == 'return': continue
          annotation = func.__annotations__.get(key, NotImplemented)
          if key in kwargs or annotation is NotImplemented:
              continue
          param = wrap_param(annotation)
          kwargs[key] = param.extract(request)
        response = func(*args, **kwargs)
      except HTTPException as exc:
        response = {'error': exc.name, 'message': exc.description}, exc.code
      if not isinstance(response, Response):
        if isinstance(response, tuple):
          response = json_response(*response)
        else:
          response = json_response(response)
      return response
    return wrapper
  return decorator
