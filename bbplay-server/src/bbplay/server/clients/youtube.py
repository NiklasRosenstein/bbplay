
from nr.databind.core import Field, Struct, ObjectMapper
from nr.databind.json import JsonModule
from nr.commons.api.pagination import Page, PaginatedList


class Youtube(object):

  def __init__(self, service):
    self._service = service

  def search(self, q, **kwargs):
    kwargs['part'] = 'snippet'
    kwargs['q'] = q
    def get_page(page_token):
      kwargs['pageToken'] = page_token
      request = self._service.search().list(**kwargs)
      response = request.execute()
      return Page(
        response['items'],
        response.get('nextPageToken'),
        response['pageInfo'])
    return PaginatedList(get_page, init_token=kwargs.get('pageToken'))
