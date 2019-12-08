
from .config import load_config
from .config.roles import execute_role_consumers
from .models import db
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
  args = parser.parse_args()
  if not args.service_root:
    args.service_root = os.getcwd()

  filename = os.path.join(args.service_root, 'var', 'conf', 'runtime.yaml')
  proxy_set_value(config, load_config(filename, args.service_root))

  db.bind(**config.server.database)
  db.generate_mapping(create_tables=True)

  from bbplay.server import views

  with orm.db_session:
    execute_role_consumers(config.produces)

  app.run(debug=config.server.debug, host=config.server.host,
    port=config.server.port)


if __name__ == '__main__':
  from bbplay.server.app import main
  main()
