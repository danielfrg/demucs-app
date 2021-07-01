import sys
import hashlib
import subprocess
from pathlib import Path

import julius
import torch as th
import torchaudio as ta

from demucs.audio import AudioFile, convert_audio_channels
from demucs.pretrained import is_pretrained, load_pretrained
from demucs.utils import apply_model, load_model



class Demucs(object):
    def __init__(self, model_id, load=True, mp3=True):
        self.model_id = model_id
        self.shifts = 0
        self.split = True
        self.overlap = 0.25
        self.mp3 = True
        self.float32 = False
        self.mp3_bitrate = 320
        self.verbose = True

        # Load model
        th.hub.set_dir("./models/")
        self.model = load_pretrained(model_id)
        self.device = "cuda" if th.cuda.is_available() else "cpu"

        if not th.cuda.is_available():
            self.device = "cpu"
        else:
            self.device = "cuda"
        self.model.to(self.device)


    def verify_file(self, target, file_hash):
        hasher = hashlib.sha256()

        with open(target, "rb") as f:
            while True:
                data = f.read(65536)
                if not data:
                    break
                hasher.update(data)

        signature = hasher.hexdigest()
        if signature != file_hash:
            raise Exception(
                f"Invalid sha256 signature for the file {target}. Expected {file_hash} but got {signature}"
            )

    def separate(self, track, output_dir):
        """
        Returns
        -------
            dictionary of {source_name: fname}
                fname is a file inside the output_dir argument
                e.g. {"bass": "bass.mp3", "drums": "drums.mp3"}
        """
        track = Path(track)
        # self.out = Path("./src/separated")
        out = Path(output_dir)

        wav = load_track(track, self.device, self.model.audio_channels, self.model.samplerate)

        ref = wav.mean(0)
        wav = (wav - ref.mean()) / ref.std()
        sources = apply_model(self.model, wav, shifts=self.shifts, split=self.split,
                                overlap=self.overlap, progress=True)
        sources = sources * ref.std() + ref.mean()

        track_folder = out
        # track_folder = out / track.name.rsplit(".", 1)[0]
        track_folder.mkdir(exist_ok=True)

        generated_files = {}
        for source, name in zip(sources, self.model.sources):
            source = source / max(1.01 * source.abs().max(), 1)
            if self.mp3 or not self.float32:
                source = (source * 2**15).clamp_(-2**15, 2**15 - 1).short()
            source = source.cpu()
            stem = str(track_folder / name)
            if self.mp3:
                encode_mp3(source, stem + ".mp3",
                            bitrate=self.mp3_bitrate,
                            samplerate=self.model.samplerate,
                            channels=self.model.audio_channels,
                            verbose=self.verbose)
            else:
                wavname = str(track_folder / f"{name}.wav")
                ta.save(wavname, source, sample_rate=self.model.samplerate)

            generated_files[name] = stem + ".mp3"

        return generated_files


def load_track(track, device, audio_channels, samplerate):
    errors = {}
    wav = None

    try:
        wav = AudioFile(track).read(
            streams=0,
            samplerate=samplerate,
            channels=audio_channels).to(device)
    except FileNotFoundError:
        errors['ffmpeg'] = 'Ffmpeg is not installed.'
    except subprocess.CalledProcessError:
        errors['ffmpeg'] = 'FFmpeg could not read the file.'

    if wav is None:
        try:
            wav, sr = ta.load(str(track))
        except RuntimeError as err:
            errors['torchaudio'] = err.args[0]
        else:
            wav = convert_audio_channels(wav, audio_channels)
            wav = wav.to(device)
            wav = julius.resample_frac(wav, sr, samplerate)

    if wav is None:
        print(f"Could not load file {track}. "
            "Maybe it is not a supported file format? ")
        for backend, error in errors.items():
            print(f"When trying to load using {backend}, got the following error: {error}")
        sys.exit(1)
    return wav


def encode_mp3(wav, path, bitrate=320, samplerate=44100, channels=2, verbose=False):
    try:
        import lameenc
    except ImportError:
        print("Failed to call lame encoder. Maybe it is not installed? "
            "On windows, run `python.exe -m pip install -U lameenc`, "
            "on OSX/Linux, run `python3 -m pip install -U lameenc`, "
            "then try again.", file=sys.stderr)
        sys.exit(1)
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(bitrate)
    encoder.set_in_sample_rate(samplerate)
    encoder.set_channels(channels)
    encoder.set_quality(2)  # 2-highest, 7-fastest
    if not verbose:
        encoder.silence()
    wav = wav.transpose(0, 1).numpy()
    mp3_data = encoder.encode(wav.tobytes())
    mp3_data += encoder.flush()
    with open(path, "wb") as f:
        f.write(mp3_data)
