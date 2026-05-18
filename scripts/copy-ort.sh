#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/ort
SRC="node_modules/onnxruntime-web/dist"
for f in ort-wasm-simd-threaded.wasm ort-wasm-simd-threaded.jsep.wasm ort-wasm-simd-threaded.mjs ort-wasm-simd-threaded.jsep.mjs; do
  if [ -f "$SRC/$f" ]; then
    cp "$SRC/$f" "public/ort/$f"
  fi
done
