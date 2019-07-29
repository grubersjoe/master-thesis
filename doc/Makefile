all:
	latexmk -pdf -pdflatex=pdflatex -shell-escape -output-directory=build src/master.tex

clean:
	latexmk -C -output-directory=build src/master.tex

watch:
	latexmk -pvc -pdf -pdflatex=pdflatex -shell-escape -output-directory=build src/master.tex
