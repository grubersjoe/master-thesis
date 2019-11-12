#!/usr/bin/gnuplot

set terminal cairolatex pdf input size 13cm,8cm
set output 'components-plot.tex'

# set terminal pngcairo dashed size 1300,800
# set output 'plot.png'

set title '\small\bfseries Components' offset 0,-3
set xlabel '\small Anzahl eingesetzter Prozessorkerne'
set ylabel '\small durchschnittliche Laufzeit in s' offset -1
set key top right height 1

set style line 100 dt '.' lt rgb '#999999'
set grid ytics ls 100
set xtics scale 0

set style data histogram
set style histogram cluster gap 1.5
set style fill solid
set boxwidth 0.8

flow = '#888888';
ts = '#333333';

plot 'cores.dat' using 2:xtic(1) title '\small Flow' linecolor rgb flow, \
  '' using 3 title '\small TypeScript' linecolor rgb ts
