
from nr.databind.core import Field, Struct, ObjectMapper
from nr.databind.json import JsonModule
from nr.databind.contrib.preprocessor import preprocess
import yaml


class ServerConfig(Struct):
  database = Field(dict)


class RuntimeConfig(Struct):
  server = Field(ServerConfig)


def load_config(filename, service_root):
  with open(filename) as fp:
    config = yaml.safe_load(fp)
  config = preprocess(config, init_variables={'$serviceRoot': service_root})
  return ObjectMapper(JsonModule()).deserialize(
    config['runtime'], RuntimeConfig, filename=filename)
