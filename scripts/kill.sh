#!/usr/bin/env bash

# Colors
R='\033[0;31m'
G='\033[0;32m'

N='\033[0m'

# Read Port
: ${PORT:=${1:-3000}}

# Locate Process
PID=$(lsof -ti:$PORT)

# Process Found?
if [ -z $PID ]; then
	echo -e "${R}No process found.${N}"
	exit 1
fi

# Kill Process
KILL=$(kill $PID 2>&1 > /dev/null)

# Handle Errors
if [ $? -ne 0 ]; then
	echo -e "${R}$KILL${N}"
	exit 1
fi

# Log
echo -e "${G}Killed process $PID.${N}"
