#!/usr/bin/env bash
grep --color -E "\b(\w+)\s+\1\b" src/**/*.tex
