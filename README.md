# bbplay

## Development Setup

`bbplay-app` performs CORS requests to `bbplay-server` (under
`http://localhost:5000`).

_Todo_

* [ ] Have the frontend bundle automatically pick the right URL, depending
      on whether it is running in development or production

### bbplay-server

    $ python3 -m venv .venv
    $ . .venv/bin/activate
    $ git clone https://git.niklasrosenstein.com/NiklasRosenstein/nr-python-libs.git
    $ cd nr-python-libs
    $ pip install -e nr.commons -e nr.metaclass -e nr.collections -e nr.interface -e nr.stream -e nr.databind -e nr.proxy
    $ cd ../bbplay-server
    $ pip install -e .
    $ echo "youtube-data-api: YOUTUBE_API_TOKEN" > var/conf/credentials.yaml
    $ python -m bbplay.server.app

### bbplay-app

    $ cd bbplay-app
    $ yarn start

## Production Setup

`bbplay-app` and `bbplay-server` can be served via NGinx as the front-door.

    server {
        # ...
        location /api {
            proxy_pass https://localhost:5000;
        }
        location / {
            # Serve the bundled application
        }
    }

Replace the `frontend_url` in `var/conf/runtime.yaml` with the `external_url`
for your NGinx server.

```yaml
runtime:
  server:
    external_url: 'https://example.org'
```
