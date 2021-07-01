SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

PWD := $(shell pwd)


first: help

# ------------------------------------------------------------------------------
# Python

env:
	mamba env create


download-model:
	python download.py


# ------------------------------------------------------------------------------
# JS app

npm-i: npm-install
npm-install:  ## npm install
	cd $(CURDIR)/js; npm install


npm-build:  ## npm build
	cd $(CURDIR)/js; npm run build


# ------------------------------------------------------------------------------
# Other

cleanall:  ## Clean everything
	echo "clean"

help:  ## Show this help menu
	@grep -E '^[0-9a-zA-Z_-]+:.*?##.*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?##"; OFS="\t\t"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, ($$2==""?"":$$2)}'
