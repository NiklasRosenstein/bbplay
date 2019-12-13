
from bbplay.framework.rest import resource
from bbplay.server.app import app, config
from flask import request
from nr.parsing.date import parse_iso8601_duration
import threading


class LockedMap(object):

  def __init__(self):
    self._data = {}
    self._lock = threading.Lock()

  def __getitem__(self, key):
    with self._lock:
      return self._data[key]

  def __setitem__(self, key, value):
    with self._lock:
      self._data[key] = value

  def __contains__(self, key):
    with self._lock:
      return key in self._data


_video_duration_cache = LockedMap()


@app.route('/api/v1/youtube/search', methods=['GET'])
@resource()
def api_v1_youtube_search():
  query = request.args.get('q')
  if not query:
    return bad_request()
  page_token = request.args.get('pageToken')
  page_size = int(request.args.get('pageSize', 10))

  # TODO (@NiklasRosenstein): Cache the Youtube client instance?
  youtube = config.credentials.create_youtube_client()
  result = youtube.search(
    query,
    pageToken=page_token,
    maxResults=page_size,
    type='video').page

  #def _filter_result(result):
  #  video_id = result['id']['videoId']
  #  if video_id in _video_duration_cache:
  #    duration = _video_duration_cache[video_id]
  #  else:
  #    result = youtube.get_video(video_id)
  #    duration = parse_iso8601_duration(result['contentDetails']['duration'])
  #    _video_duration_cache[video_id] = duration
  #  if duration > 600:
  #    return False
  #  return True

  return {
    'nextPageToken': result.next_page_token,
    #'values': [x for x in result.items if _filter_result(x)]
    'values': result.items
  }
