
from nr.proxy import Proxy, proxy_set_value
from .config import load_config
from .models import db
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

  app.run(debug=config.server.debug)


if __name__ == '__main__':
  from bbplay.server.app import main
  main()
