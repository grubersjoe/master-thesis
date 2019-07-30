#!/usr/bin/env zsh
mkdir -p cropped
for f in *.pdf; do
  pdfcrop --margins '0 10 0 10' $f cropped/$f
done