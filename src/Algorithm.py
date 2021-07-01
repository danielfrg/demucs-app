import Algorithmia
# API calls will begin at the apply() method, with the request body passed as 'input'
# For more details, see algorithmia.com/developers/algorithm-development/languages

def apply(input):
    return "hello {}".format(str(input))

# Here is an example of an advanced form of an algorithm function,
# which also uses a load function (see the example below)
# -- ADVANCED ALGORITHM USAGE --
# def apply(input, keras_model):
#     prediction = keras_model.predict(input)
#     result = {"class": prediction[0], "confidence": prediction[1]}
#     return result

def load():
    # Here you can optionally define a function that will be called when the algorithm is loaded.
    # The return object from this function can be passed directly as input to your apply function.
    # A great example would be any model files that need to be available to this algorithm
    # during runtime.
    # Any variables returned here, will be passed as the secondary argument to your 'algorithm' function

    # -- USAGE EXAMPLE ---
    # client = Algorithmia.client()
    # model_file_path = client.file('data://path/to/my/modelFile.hd5).getFile().name
    # keras_model = keras.load_model(model_path)
    # return keras_model

    return None

# This code turns your library code into an algorithm that can run on the platform.
# If you intend to use loading operations, remember to pass a `load` function as a second variable.
algo = Algorithmia.handler(apply, load)
# The 'serve()' function actually starts the algorithm, you can follow along in the source code
# to see how everything works.
algo.serve()
