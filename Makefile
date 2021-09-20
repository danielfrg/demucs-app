SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


first: help


build: npm-build image  ## Build everything


# ------------------------------------------------------------------------------
# Docker

image:
	docker build --platform linux/amd64 -t danielfrg/demucs .


run:
	docker run -it --platform linux/amd64 -p 8000:8000 -v $(PWD)/data:/data danielfrg/demucs


run-bash:
	docker run -it --platform linux/amd64 -p 8000:8000 -v $(PWD)/data:/data danielfrg/demucs bash


npm-build-docker:  ## Build website for docker
	cd $(CURDIR)/js; npm run build:docker
	cd $(CURDIR)/js; npm run export


npm-build-algorithmia:  ## Build website for algorithmia
	cd $(CURDIR)/js; npm run build:algorithmia
	cd $(CURDIR)/js; npm run export


# ------------------------------------------------------------------------------
# Python

env:  ## Make Python environment
	poetry install


fmt:  ## Format source
	cd $(CURDIR)/src; isort .
	cd $(CURDIR)/src; black .


check:  ## Check code quality
	cd $(CURDIR)/src; flake8
	cd $(CURDIR)/src; isort . --check-only --diff
	cd $(CURDIR)/src; black . --check

# ------------------------------------------------------------------------------
# Build (JS)

npm-build:  ## Build website
	cd $(CURDIR)/js; npm run build
	cd $(CURDIR)/js; npm run export


npm-i: npm-install
npm-install:  ## Install JS dependencies
	cd $(CURDIR)/js; npm install


npm-dev:  ## Run dev server
	cd $(CURDIR)/js; npm run dev


cleanjs:  ## Clean JS files
	rm -rf $(CURDIR)js/out
	rm -rf $(CURDIR)js/.next


cleanalljs: cleanjs  ## Clean JS files
	rm -rf $(CURDIR)js/node_modules
	rm -rf $(CURDIR)js/package-lock.json


# ------------------------------------------------------------------------------
# Other

clean: cleanjs  ## Clean build files


cleanall: cleanalljs  ## Clean everything


models:  ## Download models
	mkdir -p models/checkpoints
	# python download.py  # This is not working on Mac M1 - we do it manually
	curl https://dl.fbaipublicfiles.com/demucs/v3.0/demucs_quantized-07afea75.th -o ./models/checkpoints/demucs_quantized-07afea75.th
.PHONY: models


help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
