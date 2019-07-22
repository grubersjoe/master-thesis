all:
	latexmk -pdf -pdflatex=lualatex -shell-escape -output-directory=build src/master.tex

clean:
	latexmk -C -output-directory=build src/master.tex

watch:
	latexmk -pvc -pdf -pdflatex=lualatex -shell-escape -output-directory=build src/master.tex
