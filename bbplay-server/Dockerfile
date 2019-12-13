FROM python:3.7-alpine as BASE
RUN apk add --no-cache bash

RUN mkdir /opt/app
WORKDIR /opt/app

COPY vendor/ /opt/app/vendor
COPY scripts/ /opt/app/scripts
RUN scripts/install-nr-python-libs

COPY var/ /opt/app/var
COPY src/ /opt/app/src
COPY setup.py /opt/app/setup.py
RUN pip install -e .

VOLUME /opt/app/var/conf
VOLUME /opt/app/var/data

EXPOSE 5000
CMD python3 -m bbplay.server
