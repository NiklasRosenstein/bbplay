# bbplay

## bbplay-server

    $ python3 -m venv .venv
    $ . .venv/bin/activate
    $ git clone git@niklasrosenstein.com:NiklasRosenstein/nr-python-libs.git
    $ cd nr-python-libs
    $ pip install -e nr.commons -e nr.metaclass -e nr.collections -e nr.interface -e nr.databind -e nr.proxy
    $ cd ../bbplay-server
    $ pip install -e .
    $ python -m bbplay.server.app

## bbplay-app

    $ cd bbplay-app
    $ yarn start
