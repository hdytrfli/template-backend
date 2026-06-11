#!/bin/bash
set -euo pipefail

KEYS_DIR="${1:-keys}"

if [ ! -d "$KEYS_DIR" ]; then
  mkdir -p "$KEYS_DIR"
fi

PRIVATE_KEY="$KEYS_DIR/private.pem"
PUBLIC_KEY="$KEYS_DIR/public.pem"

if [ -f "$PRIVATE_KEY" ]; then
  echo "Error: $PRIVATE_KEY already exists. Delete it first to regenerate."
  exit 1
fi

openssl genpkey -algorithm RSA -out "$PRIVATE_KEY" -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in "$PRIVATE_KEY" -out "$PUBLIC_KEY"