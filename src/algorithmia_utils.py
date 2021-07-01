import os
import sys
import shutil
import getpass
import subprocess

import Algorithmia
from Algorithmia.errors import AlgorithmException

client = Algorithmia.client()
in_algorithmia = True if os.environ.get("ALGORITHMIA_API", False) else False


class BaseAPI(object):
    def __init__(self):
        self._model = None

    def get_model(self):
        """Singleton for the model
        """
        if self._model is None:
            print("BaseAPI: Loading model")
            self._model = self.load_model()
            print("BaseAPI: Model loaded")
        return self._model

    model = property(get_model)

    def load_model(self):
        """Subclasses must implement this method

        It should return an object that will be available as the .model property
        """
        raise NotImplementedError

    def apply(self, input):
        if isinstance(input, dict):
            if "ping" in input.keys():
                return True
            elif "debug" in input.keys():
                return self.debug_info_all()
            elif "cmd" in input.keys():
                return self.cmd(input["cmd"])
            elif "health" in input.keys():
                status = "live"
                if self._model:
                    status = "model_loaded"
                return {"status": status}
            elif "load" in input.keys():
                self.get_model()
                return "ok"
            elif "predict" in input.keys():
                self.get_model()
                return self.predict(input["predict"])
            else:
                raise AlgorithmException("Invalid input JSON format")
        else:
            raise AlgorithmException("Input should be JSON")

    def debug_info_all(self):
        data = {}
        data["env"] = dict(os.environ)
        data["sys_prefix"] = sys.prefix
        data["whoami"] = getpass.getuser()
        data["in_algorithmia"] = in_algorithmia
        data["which_python"] = shutil.which("python")
        data["pip_freeze"] = subprocess.check_output(["pip", "freeze"]).decode("utf-8")

        data.update(self.debug_info())
        return data

    def debug_info(self):
        return {}

    def cmd(self, args):
        return subprocess.check_output(args)

    def predict(self, input):
        raise NotImplementedError


def extract_tar_gz(file, output_dir="./models"):
    """
    Extract a .tar.gz

    Parameters
    ----------
        output_dir (default="./models"): Where to extract the .tar.gz

    Returns
    ------
        output_dir: full path to the output directory where files where extracted
    """
    os.makedirs(output_dir, exist_ok=True)

    try:
        output = subprocess.check_output(
            "tar -C {output} -xzf {targz}".format(output=output_dir, targz=file),
            stderr=subprocess.STDOUT,
            shell=True,
        ).decode()
    except subprocess.CalledProcessError as ex:
        output = ex.output.decode()
        raise Exception("Could not extract file: %s" % output)

    return os.path.realpath(os.path.join(output_dir))


def get_file(remote_fpath):
    """
    Download a file hosted on Algorithmia Hosted Data

    If the file ends with .tar.gz it will untar the file.
    It's recommended that the tar file contain a single files compressed like:
        tar -czvf model.format.tar.gz model.format

    Returns the local file path of the downloaded file
    """
    basename = os.path.basename(remote_fpath)

    if remote_fpath.startswith("data://"):
        # Download from Algoritmia hosted data
        local_fpath = client.file(remote_fpath).getFile().name

        if basename.endswith(".tar.gz"):
            output_dir = extract_tar_gz(fname)
            no_ext = basename[: -len(".tar.gz")]
            local_fpath = os.path.join(output_dir, no_ext)

        return local_fpath

    return remote_fpath


def exists(username, collection, fname=None, connector="data"):
    if fname is None:
        path = f"{connector}://{username}/{collection}"
        obj = client.dir(path)
        return obj.exists()
    else:
        path = f"{connector}://{username}/{collection}/{fname}"
        obj = client.file(path)
        return obj.exists()


def upload_file(
    local_filename, username, collection, fname, connector="data",
):
    dir_exists = exists(username=username, collection=collection, connector=connector)
    if dir_exists is False:
        dir_path = f"{connector}://{username}/{collection}/"
        new_dir = client.dir(dir_path)
        new_dir.create()

    remote_file = f"{connector}://{username}/{collection}/{fname}"
    client.file(remote_file).putFile(local_filename)
    return remote_file


if __name__ == "__main__":
    print(extract_tar_gz("./models/demucs_extra.th.tar.gz"))
