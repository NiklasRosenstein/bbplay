
from nr.databind.core import Field, Struct, ObjectMapper
from nr.databind.json import JsonModule, JsonFieldName
from nr.databind.contrib import preprocessor
import os
import yaml


class CredentialsConfig(Struct):
  youtube_data_api = Field(str, JsonFieldName('youtube-data-api'))

  def create_youtube_client(self):
    from googleapiclient import discovery
    from .clients.youtube import Youtube
    service = discovery.build('youtube', 'v3', developerKey=self.youtube_data_api)
    return Youtube(service)


class ServerConfig(Struct):
  debug = Field(bool, default=False)
  database = Field(dict)


class RuntimeConfig(Struct):
  credentials = Field(CredentialsConfig)
  server = Field(ServerConfig)


def load_config(filename, service_root):
  with open(filename) as fp:
    config = yaml.safe_load(fp)

  vars_plugin = preprocessor.Vars({'$serviceRoot': service_root})
  preproc = preprocessor.Preprocessor([
    vars_plugin,
    preprocessor.Include(os.path.dirname(filename), yaml.safe_load)
  ])

  vars_plugin.flat_update(preproc.process(config.pop('config')))
  runtime = preproc.process(config['runtime'])

  return ObjectMapper(JsonModule()).deserialize(
    runtime, RuntimeConfig, filename=filename)
