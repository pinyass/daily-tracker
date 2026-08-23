# Daily Tracker

A mobile-first React app for logging daily weight/steps/water/sleep/supplements/diet
and a workout log, built to replace filling in the Excel sheet by hand on a phone.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Works entirely offline — data is stored in the
browser's `localStorage`, so it's per-device/per-browser (clearing site data wipes it).

## Project layout

```
src/
  App.jsx                 tab navigation (Daily Log / Workout / History)
  App.css                 all styling (CSS variables at the top — easy to retheme)
  data/plan.js             your exercise split (A-E) and supplement list — edit this
                            when your plan changes, nothing else needs to
  lib/storage.js           storage abstraction — swap this for a real backend later
  components/
    ChipRow.jsx            reusable tap-to-select chip group
    DailyLog.jsx            weight/steps/water/sleep/diet/supplements/activities form
    WorkoutLog.jsx           per-day exercise log (weight × reps per set)
    History.jsx              recent entries, delete, and the Excel export button
```

## Hosting it

This is a static site (no server needed for the localStorage version). Any of these
work with basically zero config:

- **Vercel** — `npm i -g vercel`, then `vercel` in this folder. Auto-detects Vite.
- **Netlify** — drag-and-drop the `dist/` folder after `npm run build`, or connect
  the git repo and set build command `npm run build`, publish dir `dist`.
- **GitHub Pages** — `npm run build`, push `dist/` to a `gh-pages` branch (the
  `gh-pages` npm package automates this).

Since it's static, hosting is basically free on all three.

## Sharing with other devs

It's a normal Vite + React project, so:

```bash
git init
git add .
git commit -m "Daily tracker"
git remote add origin <your-repo-url>
git push -u origin main
```

Nothing here is tied to Claude or any special environment — anyone with Node.js can
clone it and run `npm install && npm run dev`.

## If you want data to sync across devices (backend upgrade path)

Right now each device's `localStorage` is its own island. If you (or someone you
share this with) wants the same log visible from phone + laptop, or wants another
person to see it too, add a small API and point `src/lib/storage.js` at it instead
of `localStorage` — the four components never talk to storage directly, so this is
a one-file change.

A minimal version, since you know Python:

```python
# api.py
from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3, json

app = FastAPI()
db = sqlite3.connect("tracker.db", check_same_thread=False)
db.execute("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT)")

class Item(BaseModel):
    value: dict

@app.get("/kv/{key}")
def get_item(key: str):
    row = db.execute("SELECT value FROM kv WHERE key=?", (key,)).fetchone()
    return json.loads(row[0]) if row else None

@app.put("/kv/{key}")
def set_item(key: str, item: Item):
    db.execute("INSERT OR REPLACE INTO kv VALUES (?, ?)", (key, json.dumps(item.value)))
    db.commit()
    return {"ok": True}

@app.get("/kv")
def list_keys(prefix: str = ""):
    rows = db.execute("SELECT key FROM kv WHERE key LIKE ?", (prefix + "%",)).fetchall()
    return [r[0] for r in rows]

@app.delete("/kv/{key}")
def delete_item(key: str):
    db.execute("DELETE FROM kv WHERE key=?", (key,))
    db.commit()
    return {"ok": True}
```

Run with `uvicorn api:app --reload`, deploy on Render/Railway/Fly.io (all have free
tiers), then update `src/lib/storage.js` to `fetch` that instead of touching
`localStorage`. Add auth (even a single shared token in a header) before putting
this on the open internet, since it has no access control as written.

## Editing the plan

`src/data/plan.js` is the single source of truth for exercises and supplements.
When your workout split or supplement stack changes, edit that file only — the
UI regenerates itself from it.
