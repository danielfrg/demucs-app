# demucs-app

[![demucs-app](https://raw.githubusercontent.com/danielfrg/demucs-app/main/demucs-app.png)](https://demucs.danielfrg.com)

[![build](https://github.com/danielfrg/demucs-app/workflows/deploy/badge.svg)](https://github.com/danielfrg/demucs-app/actions/workflows/deploy.yml)
[![license](https://img.shields.io/:license-Apache%202-blue.svg)](https://github.com/danielfrg/demucs-app/blob/master/LICENSE.txt)

Music Source Separation: Separate a song into drums, bass, vocals and others.

[Online App](https://demucs.danielfrg.com) - [Docker container](https://hub.docker.com/repository/docker/danielfrg/demucs)


```shell
docker run -it -p 8000:8000 -v $(PWD)/data:/data danielfrg/demucs
```
