---
name: argon
description: Consult Gemini 4 Argon (higher reasoning model than 3.8) for hard tasks, 3D WebGL/Three.js, complex UI animations, performance optimization, and architectural decisions via PySlick CLI.
---

# Gemini 4 Argon Consultation Skill (`/argon`)

Use this skill whenever you need to consult **Gemini 4 Argon**—Google's advanced reasoning model that sits higher than Gemini 3.8—for complex or hard tasks that require deep architectural reasoning, 3D graphics expertise, or intricate UI math.

---

## When to Consult Argon:
* **3D Graphics & WebGL**: Three.js, React Three Fiber, scene graphs, custom shaders (GLSL), lighting calculations, diorama rendering, and camera projection.
* **Complex UI & Animations**: GSAP timelines, bidirectional scroll-scrubbing, PowerPoint wipe mechanics, CSS composite layers, `clip-path` math, and touch/wheel event coordination.
* **Heavy Architectural Bugs**: Deep state synchronization, memory thrashing, GPU texture bottlenecks, and multi-threaded event loop conflicts.

---

## How to Run:

### 1. Full Agentic Consultation (`pyslick consult`)
Pre-packs the project structure and AST call-graph, giving Argon autonomous local tool execution (`<exec>`) to inspect files and callers locally:
```bash
pyslick consult "<your hard engineering task>"
```

**With Screenshot / Visual Attachment:**
```bash
pyslick consult "<directive>" --image "path/to/screenshot.png"
```

### 2. Direct Question / Math / Diagram (`pyslick ask`)
Direct background question to Gemini:
```bash
# Standard question
pyslick ask "<question>"

# Attach image / 3D render
pyslick ask "<question>" --image "path/to/image.png"

# Return markdown format
pyslick ask "<question>" --format markdown

# Reset session
pyslick ask --reset

# Turn off persistent session
pyslick ask --stop

# One-time Edge extension integration
pyslick ask --integrate
```

### 3. Quick Local Code Navigation (`pyslick --help` summary)
* `pyslick graphify "<query>"` — Search codebase functions/classes without scanning files.
* `pyslick graphify explain <symbol>` — Plain-language explanation of function and caller/callee links.
* `pyslick graphify flow <funcA> <funcB>` — Trace exact step-by-step call chain between functions.
* `pyslick ast '<pattern>'` — Search code syntax trees for structural patterns.
* `pyslick grep "<natural query>"` — Hybrid semantic text + AST scope search.
