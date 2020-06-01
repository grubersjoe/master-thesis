#!/usr/bin/env sh
pandoc ../src/master.tex -f latex -t html -s -o ../index.html --filter=pandoc-citeproc --bibliography ../src/references.bib --csl=ieee.csl -M lang:de --toc --toc-depth=3 && prettier --write --print-width=120 ../index.html
