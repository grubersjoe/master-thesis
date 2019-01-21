all:
	latexmk -pdf -pdflatex=lualatex -shell-escape -output-directory=build src/Main.tex

clean:
	latexmk -C -output-directory=build src/Main.tex

watch:
	filewatcher "**/*.tex" "bib/*" "make"
