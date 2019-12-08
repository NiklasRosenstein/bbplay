
from bbplay.server.app import app, config
from bbplay.server.common.views.rest import json_response, bad_request
from flask import request


@app.route('/api/v1/youtube/search', methods=['GET'])
def api_v1_youtube_search():
  query = request.args.get('q')
  if not query:
    return bad_request()
  page_token = request.args.get('pageToken')
  page_size = int(request.args.get('pageSize', 10))

  # TODO (@NiklasRosenstein): Cache the Youtube client instance?
  youtube = config.credentials.create_youtube_client()
  result = youtube.search(query, pageToken=page_token, maxResults=page_size).page
  return json_response({
    'nextPageToken': result.next_page_token,
    'values': result.items
  })
