# Design: Core Application Architecture

## Context
We are starting from a blank Vite + React + TS project. We need to establish the foundational architecture for the chemistry flashcard application.

## Goals
- Setup modern React practices (React Router, Context/Zustand).
- Create a reusable, highly-aesthetic Flashcard component.
- Implement a robust offline storage mechanism (IndexedDB via idb or similar).
- Implement the SM-2 spaced repetition function.

## Non-Goals
- Backend synchronization (out of scope for MVP).
- Complex analytics dashboards.

## Decisions

### Decision 1: State Management
We will use React's built-in Context API and hooks for initial state management to keep dependencies low, as the primary source of truth will be IndexedDB.

### Decision 2: Styling
We will use vanilla CSS modules or global CSS variables matching the "Chemistry Lab" aesthetic. We drop Tailwind to allow more meticulous, custom styling.

### Decision 3: Storage
We will use the `idb` library (a lightweight promise wrapper for IndexedDB) to handle deck and card storage efficiently without blocking the main thread.
