#!/usr/bin/env zsh

SAMPLES=100

if [ ! -d "$1" ]; then
  echo "Error. Specify the path to the project as first argument."
  exit 1;
fi

if [[ $2 != "flow" && $2 != "ts" ]]; then
  echo "Error. Specify the measurement type as second argument: [flow|ts]";
  exit 1;
fi;

type=$2;
cwd=$(pwd);

file=$cwd/$type-complete-$(date +%m-%d_%H:%M).csv;

cd $1; # cd in project directory

echo "# $(pwd)@$(git rev-parse --short HEAD)" > $file;
echo "# $(uname -a)" >> $file;
echo "# $(LANG=en lscpu | grep "Model name:" | sed -r 's/Model name:\s{1,}//g')" >> $file;

if [ $type = "flow" ]; then
  echo "# $(npx flow --version)\n" >> $file;

  for i in {1..$SAMPLES}; do
    /usr/bin/time -ao $file -f '%e' npx flow check > /dev/null
  done

else
  echo "# $(npx tsc --version)\n" >> $file;

  for i in {1..$SAMPLES}; do
    /usr/bin/time -ao $file -f '%e' npx tsc > /dev/null
  done
fi
