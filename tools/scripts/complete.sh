#!/usr/bin/env zsh

if [[ $2 != "flow" && $2 != "ts" ]]; then
  echo "Error. Specify the measurement type: either 'flow' or 'ts'";
  exit 1;
fi;


type=$2;
cwd=$(pwd);

file=$cwd/$type-complete-$(date +%m-%d_%H:%M).data;

if [ ! -d "$1" ]; then
  echo "Directory $1 does not exist. Exiting."
  exit 1;
fi

cd $1; # cd in project directory

echo "# $(pwd)@$(git rev-parse --short HEAD)" > $file;
echo "# $(uname -a)" >> $file;
echo "# $(LANG=en lscpu | grep "Model name:" | sed -r 's/Model name:\s{1,}//g')" >> $file;

if [ $type = "flow" ]; then
  echo "# $(npx flow --version)\n" >> $file;

  for i in {1..100}; do
    /usr/bin/time -ao $file -f '%e' npx flow check > /dev/null
  done

else
  echo "# $(npx tsc --version)\n" >> $file;

  for i in {1..100}; do
    /usr/bin/time -ao $file -f '%e' npx tsc > /dev/null
  done
fi
