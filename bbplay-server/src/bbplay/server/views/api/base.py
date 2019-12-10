

from bbplay.framework.rest import resource, AuthenticationParam
from bbplay.server.models.core import Token


Authentication = AuthenticationParam(
  header='Authorization',
  cookie='bbplay-token',
  resolve=lambda x: Token.get(value=x))
