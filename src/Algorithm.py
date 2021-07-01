import Algorithmia

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


def load():
    return None


algo = Algorithmia.handler(apply, load)
algo.serve()
