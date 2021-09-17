FROM python:3.8.12-buster

RUN apt-get update && apt-get install -y build-essential unzip wget python-dev ffmpeg libsndfile-dev

ARG POETRY_VERSION=1.1.8
RUN pip install "poetry==$POETRY_VERSION"

RUN mkdir -p /src
WORKDIR /src

COPY pyproject.toml pyproject.toml
# COPY poetry.lock poetry.lock
RUN poetry export --dev --without-hashes --no-interaction --no-ansi -f requirements.txt -o requirements.txt
RUN pip install -r requirements.txt

COPY src /src

RUN mkdir -p /data
RUN mkdir -p /models

CMD ["/bin/bash"]
