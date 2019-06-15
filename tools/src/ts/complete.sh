#!/usr/bin/env zsh
cwd=$(pwd);
file=$cwd/ts-complete-$(date +%m-%d_%H:%M).data;

cd $1;

echo "# $(pwd)@$(git rev-parse --short HEAD)" > $file;
echo "# $(uname -snrmpo)" >> $file;
echo "# TypeScript $(npx tsc --version)\n" >> $file;

for i in {1..100}; do
  /usr/bin/time -ao $file -f '%e' npx tsc > /dev/null
done
