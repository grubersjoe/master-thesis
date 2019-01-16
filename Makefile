all:
	latexmk -pdf -pdflatex=lualatex -shell-escape -output-directory=build tex/main.tex

clean:
	latexmk -C -output-directory=build tex/main.tex

watch:
	filewatcher "**/*.tex" "bib/*" "make"
