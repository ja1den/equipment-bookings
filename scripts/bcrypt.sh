#!/usr/bin/env bash

# Import
source $(dirname "$0")/lib/colors.sh

# Read Password
if [ -z $1 ]; then
	echo -e "${R}No password provided.${N}"
	exit 1
fi

# Bcrypt
HASH=$(htpasswd -bnBC 10 '' $1 | tr -d ':\n' | sed 's/$2y/$2a/' )

# Log
echo -e "${G}$HASH${N}"
