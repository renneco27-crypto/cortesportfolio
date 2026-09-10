# Original User Request

## Initial Request — 2026-08-25T12:22:49Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: A small focused team

This is a single self-contained set of fixes; keep it small and focused. Implement specific portfolio UI/UX refinements: integrate a real GitHub contributions API (using GraphQL), update the About section text and transitions to match 'lawrence.html', fix dead project links, restore the custom purple circle cursor, and migrate the Projects section to a dedicated standalone page.

Working directory: c:\Users\corte\Documents\projects NOT DELETE\CORTES-Engineering-Portfolio-main
Integrity mode: development

## Requirements

### R1. Real GitHub Contributions Integration
Replace the mocked contribution graph data with real data fetched via the GitHub GraphQL API (or a reliable third-party component/wrapper).

### R2. Text & Transition Alignment
Update the About section to feature the text "Developer by code. Designer by eye." as seen in `lawrence.html`, and ensure the page transitions reflect the style used in that reference file.

### R3. Restore Custom Cursor
Implement the custom purple circle cursor that tracks mouse movement and changes state on interactive elements.

### R4. Dedicated Projects Page & Link Fixes
Migrate the "Selected Engineering Works" projects out of the main scrolling page into its own dedicated Next.js page (e.g., `/projects`). Ensure the project images are restored and visible. Fix any dead/404 GitHub links within the projects data. Add a link to this new page in the main navigation bar.

## Acceptance Criteria

### Objective Verification
- [ ] Running the Next.js development server and visiting the main page displays a GitHub contribution chart populated with real fetched data, not hardcoded mock arrays.
- [ ] The text "Developer by code. Designer by eye." is programmatically present on the main page.
- [ ] A custom cursor element (purple circle) exists in the DOM and tracks the mouse.
- [ ] A dedicated `/projects` route exists and successfully renders.
- [ ] The project cards on the `/projects` page render images, and all `<a href>` links to GitHub in the project data resolve to valid URLs (no 404s).
