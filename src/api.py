import os
import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

import model
from config import settings


autoload = settings.in_docker
outdir = os.path.join(settings.data, "separated")
model_ = model.Demucs(output_dir=outdir, load=False)


app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

static_js = os.path.join(settings.static, "js/out")
app.mount("/static", StaticFiles(directory=static_js), name="static")
app.mount(
    "/_next",
    StaticFiles(directory=os.path.join(static_js, "_next")),
    name="static_next",
)


@app.get("/")
async def root():
    index_file = os.path.join(static_js, "index.html")
    with open(index_file) as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/song.html")
async def song():
    index_file = os.path.join(static_js, "song.html")
    with open(index_file) as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)


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


@app.get("/file/{unique_id}/{track}")
async def download_file(unique_id, track):
    fpath = os.path.join(outdir, unique_id, f"{track}.mp3")
    return FileResponse(fpath)


@app.head("/file/{unique_id}/{track}")
async def download_file_exists(unique_id, track):
    fpath = os.path.join(outdir, unique_id, f"{track}.mp3")
    if os.path.exists(fpath):
        return Response()
    raise HTTPException(status_code=404, detail="File not found")


def predict(file):
    model_.load()

    with NamedTemporaryFile(delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        fpath = Path(tmp.name)

        exists, unique_id = model_.cached(fpath)

        if not exists:
            generated_files = model_.separate(fpath)

        return unique_id
