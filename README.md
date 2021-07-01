# demucs-app

[![demucs-app](https://raw.githubusercontent.com/danielfrg/demucs-app/main/demucs-app.png)](https://demucs.danielfrg.com)

[![build](https://github.com/danielfrg/demucs-app/workflows/deploy/badge.svg)](https://github.com/danielfrg/demucs-app/actions/workflows/deploy.yml)
[![license](https://img.shields.io/:license-Apache%202-blue.svg)](https://github.com/danielfrg/demucs-app/blob/master/LICENSE.txt)

Music Source Separation: Separate a song into drums, bass, vocals and others.

[Online App](https://demucs.danielfrg.com) -
[Algorithm](https://algorithmia.com/algorithms/danielfrg/demucs)

```
content=$(tr -d "\n" < src/tracks/mixture.txt)
JSON_STRING=$( jq -n --arg content "$content" '{predict: {base64: $content} }' )

curl -X POST -d $JSON_STRING -H 'Content-Type: application/json' -H 'Authorization: Simple YOUR_API_KEY' https://api.algorithmia.com/v1/algo/danielfrg/demucs?timeout=300
```
