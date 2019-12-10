
from .config import load_config
from .config.roles import execute_role_consumers
from nr.proxy import Proxy, proxy_set_value
from pony import orm
import argparse
import flask
import os
import re

app = flask.Flask(__name__)
config = Proxy()


from .models import db
from .models.core import User, Token


def main():
  parser = argparse.ArgumentParser()
  parser.add_argument('-R', '--service-root')
  parser.add_argument('--generate-token', metavar='USERNAME')
  parser.add_argument('--revoke-tokens', metavar='USERNAME')
  parser.add_argument('--revoke-token', metavar='TOKEN')
  parser.add_argument('--cli', action='store_true')
  parser.add_argument('--exec', nargs='...')

  args = parser.parse_args()
  if not args.service_root:
    args.service_root = os.getcwd()

  filename = os.path.join(args.service_root, 'var', 'conf', 'runtime.yaml')
  proxy_set_value(config, load_config(filename, args.service_root))

  database = config.server.database.copy()
  if 'filename' in database:
    database['filename'] = os.path.abspath(database['filename'])
  db.bind(**database)
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
  elif args.cli or args.exec:
    import json
    def dumps(x):
      print(json.dumps(x))
    local = {'app': app, 'config': config, 'orm': orm, 'db': db, 'dumps': dumps}
    if args.cli:
      import code
      code.interact(local)
    else:
      for item in args.exec:
        match = re.match('\s*([\w_\d]+)\s*:\s*(.+)', item)
        if match:
          key, expr = match.groups()
          local[key.strip()] = eval(expr, local, local)
        else:
          exec(item, local, local)
    return 0

  from bbplay.server import views

  with orm.db_session:
    execute_role_consumers(config.produces)

  if config.server.debug:
    # Allow CORS in debug mode (frontend not served through the same server).
    @app.after_request
    def after_request(response):
      response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
      response.headers['Access-Control-Allow-Methods'] = 'GET, DELETE, POST, PUT, OPTIONS'
      response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
      response.headers['Access-Control-Allow-Credentials'] = 'true'
      return response

  app.run(debug=config.server.debug, host=config.server.host,
    port=config.server.port)


# Legacy, use `python -m bbplay.server` in the future
if __name__ == '__main__':
  from bbplay.server.app import main
  main()
