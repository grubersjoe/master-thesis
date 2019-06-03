all:
	latexmk -pdf -pdflatex=lualatex -shell-escape -output-directory=build src/index.tex

clean:
	latexmk -C -output-directory=build src/index.tex

watch:
	filewatcher "**/*.tex" "bib/*" "make"
