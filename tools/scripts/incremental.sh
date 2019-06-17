#!/usr/bin/env zsh

THROTTLE=5; # seconds
SAMPLES=20

if [ ! -d "$1" ]; then
  echo "Error. Specify the correct Git directory as first argument.";
  exit 1;
fi

if [ -z "$2" ]; then
  echo "Error. Specify the patch prefix (e.g. components.flow) as second argument";
  exit 1;
fi

patchdir=$(realpath ./patches);

cd $1; # cd in project directory
git reset --hard;

for patch in $patchdir/$2*.patch; do
  for i in {1..$SAMPLES}; do
    git apply $patch && echo "[$i/$SAMPLES] $(basename $patch) applied";
    sleep $THROTTLE;
    git apply -R $patch && echo "[$i/$SAMPLES] $(basename $patch) reverted";
    sleep $THROTTLE;
  done;

  git reset --hard;
  echo "----------------------------------------";
done;
