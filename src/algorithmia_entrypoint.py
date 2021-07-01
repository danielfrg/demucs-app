api = None


def get_api():
    global api
    if api is None:
        try:
            from .api import DemucsAPI
        except Exception:
            from api import DemucsAPI

        api = DemucsAPI()
    return api


def apply(input):
    try:
        api = get_api()
        return api.apply(input)
    except Exception as ex:
        raise ex


if __name__ == "__main__":
    print(apply({"ping": ""}))
    print(apply({"debug": ""}))
    print(apply({"cmd": ["ls", "-la", "/tmp"]}))
    print(apply({"health": ""}))
    print(apply({"load": ""}))
    print(apply({"health": ""}))

    print(apply({"predict": {"fpath": "./tracks/mixture.mp3"}}))

    with open("./tracks/mixture.txt") as f:
        base64_content = f.read()
        print(apply({"predict": {"base64": base64_content}}))

