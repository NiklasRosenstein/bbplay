
from nr.databind.core import Field, Struct, ObjectMapper
from nr.databind.json import JsonModule, JsonFieldName
from nr.databind.contrib.preprocessor import config_preprocess, Include, Vars
import os
import yaml


class CredentialsConfig(Struct):
  youtube_data_api = Field(str, JsonFieldName('youtube-data-api'))

  def create_youtube_client(self):
    from googleapiclient import discovery
    from ..clients.youtube import Youtube
    service = discovery.build('youtube', 'v3', developerKey=self.youtube_data_api)
    return Youtube(service)


class ServerConfig(Struct):
  debug = Field(bool, default=False)
  database = Field(dict)
  host = Field(str, default='localhost')
  port = Field(int, default=5000)
  external_url = Field(str, default=None)

  def get_external_url(self):
    if self.external_url is None:
      return 'http://{}:{}'.format(self.host, self.port)
    return self.external_url


class RuntimeConfig(Struct):
  credentials = Field(CredentialsConfig)
  server = Field(ServerConfig)
  produces = Field([dict])


def load_config(filename, service_root):
  with open(filename) as fp:
    config = yaml.safe_load(fp)
  runtime = config_preprocess(
    config['config'],
    config['runtime'],
    plugins=[
      Vars({'$serviceRoot': service_root}),
      Include(os.path.dirname(filename), yaml.safe_load)
    ]
  )
  return ObjectMapper(JsonModule()).deserialize(
    runtime, RuntimeConfig, filename=filename)
