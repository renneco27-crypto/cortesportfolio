---
name: pyslick
description: Consult Gemini 4 Argon and parent Google Gemini via PySlick CLI for hard tasks (3D Three.js/WebGL, complex UI, animations, architecture) with pyslick consult and pyslick ask, and explore AST call-graphs with zero scanning.
---

# PySlick & Gemini 4 Argon Consultation Skill (`/pyslick`)

Use this skill whenever you encounter **hard tasks** that require deep reasoning beyond Gemini 3.8 Flash, especially:
1. **3D & Graphics**: Three.js, WebGL, React Three Fiber, GLSL shaders, camera/lighting matrices, diorama physics, canvas 2D frame pipelines.
2. **Complex UI & Animation**: GSAP timelines, PowerPoint wipe mechanics, CSS stacking contexts, z-index and clip-path interactions, responsive layout math.
3. **Hard Architectural Decisions**: State management, cache strategies, offline sync, performance profiling.
4. **Codebase Navigation without Hallucination**: Querying AST call-graphs, callers/callees, and data flows using `pyslick graphify`.

---

## 1. Consulting Gemini 4 Argon (`pyslick consult`)

When a task is complex or tricky (e.g. 3D WebGL scenes, complex GSAP animations, difficult UI bugs), hand off the task to **Gemini 4 Argon** (Google's higher-tier reasoning model).

### Syntax:
```bash
pyslick consult "<detailed directive or question>"
```

### With Screenshot / Render Attachment (for UI/3D debugging):
```bash
pyslick consult "<directive>" --image "path/to/screenshot.png"
```

### How `pyslick consult` works:
1. **Auto Context Packing**: Automatically scans project structure (`pyslick ls`) and AST symbol graph (`pyslick graphify`) and pre-packs it into the prompt.
2. **Autonomous Tool Execution (`<exec>`)**: Argon can autonomously invoke local tools (e.g. `pyslick lines`, `pyslick graphify explain`, `pyslick ast`) to inspect exact code lines before giving the final architectural solution.
3. **Runs in Background**: Executes silently in the background without stealing window focus.

---

## 2. Gemini Background Bridge (`pyslick ask`)

Use `pyslick ask` to ask parent Gemini direct questions, request mathematical formulas (LaTeX), or retrieve architectural diagrams/images.

### Syntax & Flags:
```bash
# Standard question
pyslick ask "<your question>"

# Attach an image for visual inspection (3D renders, UI bugs)
pyslick ask "<question>" --image "C:\path\to\image.png"

# Return structured output (text, json, or markdown)
pyslick ask "<question>" --format markdown

# Reset conversation session (starts a fresh chat)
pyslick ask --reset

# Turn off persistent background session
pyslick ask --stop

# One-time Edge browser extension integration (idempotent)
pyslick ask --integrate
```

### Automatic Image Downloading:
When Gemini generates an image or diagram, PySlick automatically downloads it to `~/pyslick_images/` and outputs:
```
[image saved] C:\Users\<user>\pyslick_images\<filename>.png
```

---

## 3. PySlick Quick Reference (`pyslick --help`)

### AST Call-Graph & Zero Code Scanning:
* `pyslick graphify extract .` — Index or refresh the AST call graph into `graphify-out/graph.json`.
* `pyslick graphify "<symbol>"` — Inspect function signature, code, callers, and callees.
* `pyslick graphify explain <symbol>` — Plain-English explanation of function and its connections.
* `pyslick graphify flow <funcA> <funcB>` — Trace exact step-by-step data flow & BFS call chain between two functions.
* `pyslick graphify callers <func>` — List all functions calling `<func>`.
* `pyslick graphify callees <func>` — List all functions called by `<func>`.

### Structural Code Pattern Search:
* `pyslick ast '<pattern>'` — Search AST syntax tree (e.g., `pyslick ast 'useFrame($$$)'`).
* `pyslick grep "<natural language query>"` — Hybrid BM25 semantic search with Tree-Sitter AST scope snapping.
* `pyslick recon-pack "<directive>"` — Zero-API curated context packer for LLM prompts.

---

## Workflow for Hard Tasks (UI & 3D):
1. **Identify Bottleneck**: If a 3D Canvas / Three.js scene, GSAP scrub, or complex UI component has bugs or needs advanced mathematics, capture the exact symptoms.
2. **Consult Argon**:
   ```bash
   pyslick consult "Review ClayHeroScene.tsx: how do we optimize the Three.js useFrame loop to stop rendering when scrolled out of view and prevent WebGL context loss?"
   ```
3. **Apply Solution**: Implement Argon's recommendations and verify with `pnpm tsc --noEmit` and browser tests.
