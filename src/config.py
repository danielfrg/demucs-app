from dynaconf import Dynaconf


settings = Dynaconf(
    envvar_prefix="DEMUCS",
    settings_files=["settings.toml", ".secrets.toml"],
)
