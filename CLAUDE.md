# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is a newly initialized repository. No source code, build system, or package manager has been configured yet.

# Project Instructions

## Documentation & Context
- **Always use Context7:** Before implementing code for external libraries or frameworks, use the `context7` MCP tools to fetch the latest documentation.
- **Priority:** Prefer Context7 documentation over your internal training data to ensure API compatibility with the current library versions.
- **Workflow:** 
- 1. Use `resolve-library` to find the correct library ID (e.g., `upstash/redis`, `fastapi/fastapi`).
  2. Use `get-library-docs` with specific keywords related to the task to pull relevant snippets. 