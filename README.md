# Graph-Architect
A spatial collaboration platform (Next.js + Socket.io + Express + MongoDB) where teams architect systems and write code in a shared canvas with real-time synchronization.

## Collaboration + persistence (the “production constraints” bits)
- **Debounced snapshot persistence**: canvas state is persisted to MongoDB as a snapshot on a debounce (not on every keystroke/mutation). Tunable via `CANVAS_PERSIST_DEBOUNCE_MS` and `CANVAS_PERSIST_MAX_WAIT_MS`.
- **Basic conflict handling**: each canvas has a monotonic `revision`. Clients send `baseRevision`; if it doesn’t match, the server triggers a `canvas-resync` so clients converge.
- **Horizontal scalability (optional)**: if `REDIS_URL` is set, Socket.io uses the Redis adapter so rooms/events work across multiple server instances.
