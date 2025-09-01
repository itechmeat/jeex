# Project's prompts

## Initial prompt about project'e idea (use in ChatGPT)

I want to develop a new project that will be an application for communication with LLMs and AI agents, as well as for searching information on the web and summarizing it. The closest analogues are Perplexity.ai, ChatGPT Chat, and Claude.AI Chat. The project will be developed in several stages. At the first stage, the following is required:

- **User authentication** through login and password. At this stage, the authorization should be as simple as possible, but it is necessary to provide the ability to replace this service later with a more powerful one, including tenants, roles, and so on.
- **Chats** – a chat with an LLM with response formatting support.
- **Spaces** – shared work folders that can contain any number of chats. Within one Space, all chats share information in RAG about neighboring chats, i.e., a common context is created for the Space. A Space should also have a name, may include a description, and allow uploading documents in MD and PDF formats. After uploading, documents must be parsed, recognized, and indexed into RAG, linked to their document title so that when the user refers to the document, the information is taken from RAG. Any chat outside a Space or from another Space can be added to the current Space, but one chat cannot belong to multiple Spaces simultaneously.
- **Web search** – a simple service at this stage with the possibility of replacing it later with a more powerful service. For now, an existing external API or MCP will be used.
- **Model switching** – the ability to change the model even within a single chat. It should support multiple providers, each offering several models, and allow the user to choose any available model. At this stage, providers and models are configured via a config file; in later stages, this will be managed through an admin panel.

**Technical expectations:**

- **Monorepo and microservice architecture**: the frontend will be a simple interface for communicating with the backend; the backend should be divided into functional microservices, each responsible for its own task.
- **Languages**: Microservices can be written in different languages; Python will be used for AI-related tasks, Rust for high-load services.
- **Databases**: Each microservice must have its own database instance, and communication between services should happen strictly via API.
- **Main database**: PostgreSQL 18+, since it provides native support for OAuth 2.0 authentication.
- **Additional databases/services**: Redis 8.2.1+ for caching, RabbitMQ 4.1+ for queues.
- **Vector database**: Qdrant with strict data isolation. One user’s data must not be accessible to others. Within a Space, all chats and documents must be available to any chat in that Space. When moving a chat or document from one Space to another, visibility must change accordingly.
- **Frontend stack**: ReactJS + TypeScript + RadixUI + Vite + TanStack Query + TanStack Router + TanStack DB.
- **Frontend requirements**: Mobile-first responsive interface, with PWA support planned for later stages.
- **API Gateway**: The frontend can communicate only with the main communication service via an API Gateway using Traefik as the single entry point. In the first stage, only Server-Sent Events (SSE) will be used.
- **Deployment**: The entire project must run in Docker containers.
- **Configuration**: All microservices must share a single `.env` file and use it exclusively.

The idea of this project should be described in detail in the file `docs/about/idea.md`. This is not a technical document — the focus should be on the idea and functionality description without writing code fragments or architecture details. Separate documents will be created for that purpose.

## Prompt for improve the initial chat (use in ChatGPT)

Try to expand this prompt a little if you see where it can be improved for a more correct start of work on the project.

## Improved prompt (use in Claude Code)

You are an expert product manager and technical writer. Produce a clear, ready-to-use prompt that will guide a team (or an AI) to create the product idea document `docs/about/idea.md` and to start Phase 1 implementation planning. Keep the result non-technical in tone where requested, but include precise functional and non-functional requirements so work can start correctly. Do not write code or low-level architecture; focus on product functionality, constraints, and acceptance criteria. Use plain paragraphs and simple bullet lists only.

Project summary:
I want to build an application for interacting with LLMs and AI agents, searching the web, and summarizing retrieved information. Closest analogues are Perplexity.ai, ChatGPT, and Claude.ai, but this product emphasizes shared workspaces (Spaces), RAG-based context sharing inside Spaces, flexible model switching, and pluggable search providers. The product will be delivered in stages; this prompt describes Phase 1 requirements and the desired scope of `docs/about/idea.md`.

Phase 1 — core functionality (required):

- **User authentication**: simple username/password sign-in for Phase 1. The implementation must be designed so the auth mechanism can be replaced later with a full-featured identity service (tenants, roles, SSO) without changing the user experience.
- **Chats**: conversational interface with LLMs supporting formatted responses (lists, code blocks, headings, basic citations when available). Users can create, rename, delete, and move chats.
- **Spaces**: shared work folders containing any number of chats and documents. Key Space behavior:

  - Each Space has a name, optional description, and its own RAG context shared by all chats in that Space.
  - Users can upload Markdown (.md) and PDF files into a Space. Uploaded documents must be parsed and indexed into the Space’s RAG store and linked to the document title so queries like “Summarize ‘Quarterly Report’” return answers grounded in the indexed content.
  - Chats outside a Space, or in another Space, can be added to the current Space. A chat may belong to only one Space at a time.
  - Moving a chat or document between Spaces updates RAG visibility accordingly.

- **Web search**: a simple, replaceable web search connector. Phase 1 will use an existing external API or MCP. The design should make it straightforward to swap in a stronger search provider later.
- **Model selection and switching**: users can change the model for a chat at any time. Support multiple providers and multiple models per provider. In Phase 1 providers/models are declared in a configuration file; later this will move into an admin UI.

Technical and non-functional expectations (high level, for context):

- Monorepo containing a microservice-based backend; frontend is a thin client.
- Microservices may use different languages (Python for AI work, Rust for high-throughput services).
- Each microservice owns its own database instance and communicates only via APIs.
- Datastores: PostgreSQL 18+ as primary DB, Redis 8.2.1+ for cache, RabbitMQ 4.1+ for queues. Qdrant for vector storage with strict per-user and per-Space isolation.
- Frontend stack: React + TypeScript + Radix UI + Vite + TanStack Query + TanStack Router + TanStack DB. Mobile-first responsive design; PWA capability planned.
- API Gateway as single entry point (Traefik); Phase 1 streaming via Server-Sent Events (SSE).
- All components run in Docker. All services use a single shared `.env` for environment config.

Data, privacy and visibility rules (explicit):

- One user’s private data must never be visible to other users.
- Within one Space, chats and documents are visible to any chat in that Space via the Space RAG index.
- Moving an object between Spaces must change visibility deterministically and immediately in the RAG layer.
- Documents uploaded to a Space are parsed, indexed, and linked to their title; answers referencing the document must be grounded in that indexed content.

Deliverable for this prompt:

- Write the file `docs/about/idea.md`. It must be a product-level idea document (not a technical spec). Focus on the product vision, core Phase 1 features, user value, primary use cases, constraints, early acceptance criteria, and a short list of next-phase extension points. Avoid code snippets, architecture diagrams, or implementation instructions. Keep language clear and actionable so engineers and PMs can turn it into a technical plan and backlog items.

Acceptance criteria for `docs/about/idea.md`:

- Clearly states the product goal and differentiators.
- Lists Phase 1 features and how they behave (authentication, chats, Spaces, document handling, web search, model switching).
- Includes explicit data visibility/privacy rules and the requirement that RAG content be linked to document titles.
- Outlines non-goals for Phase 1 and important constraints (datastores, Docker, single `.env`, API gateway, SSE).
- Provides 5–8 early success metrics / signals to evaluate Phase 1.
- Concludes with a concise “next steps” list for Phase 2 planning (identity, admin console, richer search, collaboration/permissions, observability).

Tone and style:

- Clear, concise, product-focused, suitable for `docs/about/idea.md`.
- No low-level technical implementation details or code. Use simple paragraphs and bullet lists only.
