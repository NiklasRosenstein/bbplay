
from nr.databind.core import Field, Struct, ObjectMapper
from nr.databind.json import JsonModule
from nr.commons.api.pagination import Page, PaginatedList


class Youtube(object):

  def __init__(self, service):
    self._service = service

  def get_video(self, video_id: str, part: str='snippet,contentDetails'):
    """ Gets a single video from the YouTube Data API. """

    response = self._service.videos().list(
      part=part,
      id=video_id
    ).execute()
    if not response['items']:
      return None
    return response['items'][0]

  def search(self, q, **kwargs):
    """ Searches for videos with the YouTube Data API. """

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
