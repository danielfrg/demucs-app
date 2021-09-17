import torch as th
from demucs import pretrained


th.hub.set_dir("/models/")

model_id = "demucs_quantized"
pretrained.load_pretrained(model_id)
