
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
  host = Field(str, default='localhost')
  port = Field(int, default=5000)


class RuntimeConfig(Struct):
  credentials = Field(CredentialsConfig)
  database = Field(dict)
  external_url = Field(str, default=None)
  frontend_url = Field(str, default=None)
  produces = Field([dict])
  server = Field(ServerConfig)

  def get_external_url(self):
    if self.external_url is None:
      return 'http://{}:{}'.format(self.host, self.port)
    return self.external_url

  def get_frontend_url(self):
    if self.frontend_url is None:
      return self.get_external_url()
    return self.frontend_url


def load_config(filename, service_root):
  with open(filename) as fp:
    config = yaml.safe_load(fp)
  runtime = config_preprocess(
    config['config'],
    config['runtime'],
    plugins=[
      Vars({'$serviceRoot': os.path.normpath(service_root)}),
      Include(os.path.dirname(filename), yaml.safe_load)
    ]
  )
  return ObjectMapper(JsonModule()).deserialize(
    runtime, RuntimeConfig, filename=filename)
