# Technical Architecture

Based on the project idea described in `docs/about/idea.md`, create a technical architecture document that defines the future architecture of the project. This must be a technical, architecture-focused document that shows specifications, requirements, and diagrams of relationships between the system’s components. Do **not** write implementation code — this is an architecture document, not an implementation guide.

Requirements for the document:

- Provide a clear system overview and rationale for the chosen architecture.
- Describe all major components and services, their responsibilities, and how they interact.
- Pay special attention to the primary service that the frontend will communicate with — design its responsibilities, high-level API surface, failure/isolation modes, and upgrade/replacement considerations — because other services should remain relatively easy to replace.
- Specify non-functional requirements and constraints (scalability, availability, performance, security, data isolation, deployment unit boundaries, configuration, observability).
- Define data flow and ownership: which services own which data, where data is persisted, where RAG and vector storage live, and how access/visibility rules (per-user and per-Space) are enforced.
- Describe deployment and operational considerations (containerization, environment configuration, API gateway, streaming options), and how these support extensibility and safe upgrades.
- Offer concrete recommendations and best practices for building a flexible, extensible, and maintainable architecture.
- For multiple contested or risky components, propose 2–3 alternative implementation options with tradeoffs, pros/cons, and guidance on when to choose each.
- Include high-level acceptance criteria and migration/upgrade considerations for replacing or evolving services.

Diagrams (special instruction):

- Explain where diagrams would be helpful (component topology, data flow, sequence flows) and specify what each diagram would show.
- **Do not create diagrams at this stage.** Instead, insert the exact placeholder text `[DIAGRAM TO BE ADDED HERE]` at each location where a diagram should appear.
- Note after each placeholder that the actual diagram will be composed later in this same document.
- When diagrams are added later, prefer **Mermaid** format (flowcharts, sequence diagrams, component diagrams) so they can be embedded directly in the documentation.

Style and constraints:

- Use clear, technical language but avoid low-level code or configuration fragments.
- Produce a document suitable for `docs/architecture/description.md` (or similar), intended for engineers and architects to iterate into detailed technical specifications.
- Keep the document self-contained but explicitly based on the ideas from `docs/about/idea.md`.

Output: a complete, ready-to-use architecture prompt/instruction that an AI or engineering team can follow to produce the described architecture document.

## Improvements

Here are the changes I would like to apply to the architecture document:

- The `Space Management Service` and `Chat Service` should be merged into a single service.
- A dedicated, S3-like service for file storage is needed. This service will be responsible for securely storing all uploaded files and managing the appropriate access rights for them.
- The `Document Processing Service` and `RAG Service` should also be merged into a single service (we can call it `RAG Service`). The files themselves will be stored in the new S3-like service. Their logic is tightly coupled, as one part is responsible for parsing documents and the other for generating embeddings and searching. Separating them only makes sense to handle very high parsing or indexing loads, which we don't anticipate at the start.
- We will use Server-Sent Events (SSE) as our primary approach for real-time communication. WebSockets are not required for now.
- Remove all other "Alternative Implementation Options" from the document.

# Add schemes

Find all the [DIAGRAM TO BE ADDED HERE] placeholders in the document and replace each one with the appropriate diagram. Use mermaid where possible. Plan this procedure so that you do one diagram at a time. All diagrams should be detailed and 100% accurate to what they refer to.
