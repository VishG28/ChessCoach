# Maia ONNX models

These five `.onnx` files are Leela-format ONNX exports of the original Maia
networks from the [CSSLab/maia-chess](https://github.com/CSSLab/maia-chess)
project (KDD 2020). They were obtained pre-converted from the
[`lczerolens`](https://huggingface.co/lczerolens) Hugging Face organization,
which maintains ONNX dumps produced by the
[Xmaster6y/lczerolens](https://github.com/Xmaster6y/lczerolens) tooling.

## Source URLs

| File              | Size | Source |
| ----------------- | ---- | ------ |
| `maia-1100.onnx`  | 3.5 MB | https://huggingface.co/lczerolens/maia-1100/resolve/main/model.onnx |
| `maia-1300.onnx`  | 3.5 MB | https://huggingface.co/lczerolens/maia-1300/resolve/main/model.onnx |
| `maia-1500.onnx`  | 3.5 MB | https://huggingface.co/lczerolens/maia-1500/resolve/main/model.onnx |
| `maia-1700.onnx`  | 3.5 MB | https://huggingface.co/lczerolens/maia-1700/resolve/main/model.onnx |
| `maia-1900.onnx`  | 3.5 MB | https://huggingface.co/lczerolens/maia-1900/resolve/main/model.onnx |

## Architecture

Each model is a Leela-style residual network with:

- **Input**: `/input/planes`, shape `[batch, 112, 8, 8]`, dtype `float32`
- **Output**: `/output/policy`, shape `[batch, 1858]` — Leela 1858-move policy logits
- **Output**: `/output/wdl`, shape `[batch, 3]` — win/draw/loss logits
- **Opset**: 17

The 112 input planes follow the standard Leela 8-history-position encoding
(see https://lczero.org/dev/backend/nn/). The 1858-move policy index uses
Leela's per-from-square encoding: 56 sliding moves + 8 knight moves + 9
underpromotions per pawn square.

## How to regenerate (Python, one-time)

If the upstream Hugging Face files disappear:

```bash
# 1. Download the original .pb.gz weights from CSSLab
curl -LO https://github.com/CSSLab/maia-chess/releases/download/v1.0/maia-1100.pb.gz
# (repeat for 1300, 1500, 1700, 1900)

# 2. Install lczerolens (or use lc0 build with --onnx export)
pip install lczerolens

# 3. Convert each .pb.gz to ONNX
python -c "
from lczerolens.model import LczeroModel
m = LczeroModel.from_path('maia-1100.pb.gz')
m.to_onnx('maia-1100.onnx', opset_version=17)
"

# 4. Copy results into public/maia/
```

## Lazy-loading

Files are downloaded on first opponent move at the relevant Elo bucket. See
`src/engine/maia.ts` for the worker-based loader and Elo-bucket mapping.

## License

The original Maia networks are released under MIT by the
[Computational Social Science Lab at the University of Toronto](https://csslab.cs.toronto.edu/).
The ONNX conversions retain the same license.
