import os
import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

import model
from config import settings


autoload = settings.in_docker
outdir = os.path.join(settings.data, "separated")
model_ = model.Demucs(output_dir=outdir, load=autoload)


app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health/live", status_code=200)
async def health_live():
    return "OK"


@app.get("/health/ready", status_code=200)
async def health_ready():
    if model_.model is None:
        raise HTTPException(status_code=418, detail="Model not loaded")
    return "OK"


@app.get("/load", status_code=200)
async def load():
    model_.load()
    return "OK"


@app.post("/infer")
async def infer(file: UploadFile = File(...)):
    return predict(file)


@app.post("/invocations")
async def invocations(file: UploadFile = File(...)):
    return predict(file)


@app.post("/files")
async def create_file(request: Request):
    form = await request.form()
    files = form.getlist("files")
    print(files)


@app.get("/file/{unique_id}/{track}")
async def download_file(unique_id, track):
    fpath = os.path.join(outdir, unique_id, f"{track}.mp3")
    return FileResponse(fpath)


def predict(file):
    # model_.load()

    with NamedTemporaryFile(delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        fpath = Path(tmp.name)

        exists, unique_id = model_.cached(fpath)

        if not exists:
            generated_files = model_.separate(fpath)

        return unique_id
