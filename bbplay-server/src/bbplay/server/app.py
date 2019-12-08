
from .config import load_config
from .config.roles import execute_role_consumers
from .models import db
from .models.core import User, Token
from nr.proxy import Proxy, proxy_set_value
from pony import orm
import argparse
import flask
import os

app = flask.Flask(__name__)
config = Proxy()


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('-R', '--service-root')
  parser.add_argument('--generate-token', metavar='USERNAME')
  parser.add_argument('--revoke-tokens', metavar='USERNAME')
  parser.add_argument('--revoke-token', metavar='TOKEN')

  args = parser.parse_args()
  if not args.service_root:
    args.service_root = os.getcwd()

  filename = os.path.join(args.service_root, 'var', 'conf', 'runtime.yaml')
  proxy_set_value(config, load_config(filename, args.service_root))

  db.bind(**config.server.database)
  db.generate_mapping(create_tables=True)

  if args.generate_token:
    with orm.db_session:
      user = User.get(username=args.generate_token)
      if not user:
        parser.error('user {!r} does not exist'.format(args.generate_token))
      print(user.create_token().value)
    return 0
  elif args.revoke_tokens:
    with orm.db_session:
      user = User.get(username=args.revoke_tokens)
      if not user:
        parser.error('user {!r} does not exist'.format(args.revoke_tokens))
      user.tokens.select().delete(bulk=True)
    return 0
  elif args.revoke_token:
    with orm.db_session():
      token = Token.get(value=args.revoke_token)
      if not token:
        parser.error('token does not exist or already revoked')
      token.delete()
    return 0

  from bbplay.server import views

  with orm.db_session:
    execute_role_consumers(config.produces)

  app.run(debug=config.server.debug, host=config.server.host,
    port=config.server.port)


if __name__ == '__main__':
  from bbplay.server.app import main
  main()
