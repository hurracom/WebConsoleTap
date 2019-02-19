#!/bin/bash

# Prepare a zip package with the source code, to be signed via addons.mozilla.org
zip -r -FS ../webconsoletap.zip * -x build.sh
