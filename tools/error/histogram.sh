 egrep -o "TS[0-9]{4}" $1 | sort | uniq -c | sort -r
