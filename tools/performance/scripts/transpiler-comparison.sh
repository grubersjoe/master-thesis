#!/usr/bin/env zsh

SAMPLES=50

cat /dev/null > ~/codemod-components-{khan,kiikurage,reflow}.dat

cd ~/components_TEST
git co packages/ && git clean -f packages/

for i in {1..$SAMPLES}; do
  git co packages/ && git clean -f packages/
  /usr/bin/time -q -f '%e' -ao ~/codemod-components-khan.dat flow-to-ts --write packages/**/*.js &> /dev/null
done;
sleep 2

for i in {1..$SAMPLES}; do
  git co packages/ && git clean -f packages/
  /usr/bin/time -q -f '%e' -ao ~/codemod-components-kiikurage.dat codemod -p babel-plugin-flow-to-typescript packages/ &> /dev/null
done;
sleep 2

for i in {1..$SAMPLES}; do
  git co packages/ && git clean -f packages/
  /usr/bin/time -q -f '%e' -ao ~/codemod-components-reflow.dat codemod -p ~/git/reflow/build/plugin.js packages/ &> /dev/null
done;
sleep 2

git co packages/ && git clean -f packages/

# ----

 cat /dev/null > ~/codemod-helios-{khan,kiikurage,reflow}.dat

cd ~/helios_TEST
git co src/ && git clean -f src/

for i in {1..$SAMPLES}; do
  git co src/ && git clean -f src/
  /usr/bin/time -q -f '%e' -ao ~/codemod-helios-khan.dat flow-to-ts --write src/**/*.js &> /dev/null
done;
sleep 2

for i in {1..$SAMPLES}; do
  git co src/ && git clean -f src/
  /usr/bin/time -q -f '%e' -ao ~/codemod-helios-kiikurage.dat codemod -p babel-plugin-flow-to-typescript src/ &> /dev/null
done;
sleep 2

for i in {1..$SAMPLES}; do
  git co src/ && git clean -f src/
  /usr/bin/time -q -f '%e' -ao ~/codemod-helios-reflow.dat codemod -p ~/git/reflow/build/plugin.js src/ &> /dev/null
done;
sleep 2

git co src/ && git clean -f src/
