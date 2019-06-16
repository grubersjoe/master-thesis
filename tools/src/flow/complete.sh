#!/usr/bin/env zsh
cwd=$(pwd);
file=$cwd/flow-complete-$(date +%m-%d_%H:%M).data;

cd $1;

echo "# $(pwd)@$(git rev-parse --short HEAD)" > $file;
echo "# $(uname -a)" >> $file;
echo "# $(LANG=en lscpu | grep "Model name:" | sed -r 's/Model name:\s{1,}//g')" >> $file;
echo "# $(npx flow --version)\n" >> $file;

for i in {1..100}; do
  /usr/bin/time -ao $file -f '%e' npx flow check > /dev/null
done
