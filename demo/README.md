# Room booking UI demo (no extension)

Use this while designing and testing the **Free Rooms First** interface. Edit files in `demo/` or `extension/content/overlay/overlay.css`, then **refresh the browser tab** — you do not need to reload the Chrome extension.

## Quick start

### Option A — Local server (recommended)

From the project root:

```bash
python -m http.server 8765
```

Open: [http://localhost:8765/demo/](http://localhost:8765/demo/)

### Option B — Direct file

Open `demo/index.html` in the browser. If styles fail to load, use Option A (some browsers block `file://` cross-folder CSS).

## Toolbar

| Control | Purpose |
|--------|---------|
| **Scenario** | Mock data for R2 test views, errors, slow network |
| **Open booking** | Show panel again after close |
| **Reload data** | Re-run mock fetch |
| **Toggle 320px** | R5 reflow check width |

## URL parameters

- `?scenario=r2_one_free` — deep-link a scenario (e.g. for usability scripts)

## Workflow with the real extension

1. Iterate UI/UX in **demo** (fast refresh).
2. Copy stable changes to `extension/content/overlay/` when ready.
3. Load unpacked extension once for live Insignia testing.

## Files

| File | Role |
|------|------|
| `index.html` | Shell + overlay markup |
| `demo-app.js` | UI logic (mock API) |
| `mock-data.js` | Scenarios aligned with D2 R2 |
| `demo.css` | Toolbar + fake portal + pass screen |
| `../extension/content/overlay/overlay.css` | Shared component styles |
