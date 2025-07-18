# Persona Discussion Panel – Requirements Document

## Backend Implementation (as of 2024-07-18)

The backend is implemented using FastAPI and OpenAI's API. It provides endpoints for managing discussion sessions between AI personas. Key features:

### Data Models
- **Persona**: id, name, description, traits, tone
- **Message**: speaker_id, content, timestamp
- **Session**: id, topic, personas (list), messages (list), turn_index

### In-Memory Store
- All sessions are stored in a module-level dictionary: `sessions: dict[str, Session]`

### Endpoints
- `POST /sessions` – Start a new session with a topic and list of personas. Returns the created Session object.
- `GET /sessions/{sid}` – Retrieve a session by its ID.
- `POST /sessions/{sid}/next` – Advance the discussion by generating the next persona's response using OpenAI. Returns the new Message.
- `POST /sessions/{sid}/summary` – Generate a summary of the discussion so far using OpenAI. Returns a summary string.

### AI Integration
- Uses OpenAI's `gpt-4o-mini` model for persona responses and summary generation.
- Each persona's turn is generated with full access to the conversation history and persona traits.

### Notes
- All data is in-memory (no persistence).
- Requires `OPENAI_API_KEY` environment variable.
- See backend/main.py for implementation details.

## Frontend Implementation (as of 2024-07-18)

The frontend is implemented using Next.js (React) and Tailwind CSS. It provides a modern, responsive interface for managing persona-based discussions. Key features and structure:

### Project Structure
- **/app/**: Main application pages and layout (Next.js app directory).
- **/components/**: Reusable React components, including UI primitives (button, card, input, etc.) and higher-level elements (theme provider, sidebar, etc.).
- **/hooks/**: Custom React hooks for state and utility logic.
- **/styles/**: Global and utility CSS, primarily using Tailwind.
- **/public/**: Static assets (avatars, logos, etc.).
- **/lib/**: Utility functions and helpers.

### Main UI Elements
- **Header**: Fixed at the top, shows app title and controls for starting a new topic discussion.
- **Sidebar**: Vertical panel displaying persona avatars, connection status, and tooltips with persona info on hover.
- **Main Content**: 
  - **Topic Display**: Editable topic/question at the top of the chat area.
  - **Chat Area**: Threaded, chat-style display of persona responses, showing speaker name, timestamp, and message content.
  - **Input Bar**: At the bottom, allows the user to input new questions or continue the discussion.
- **Dialogs/Modals**: For creating new topics and managing personas.
- **Tooltips**: On persona avatars, showing persona details and connection status.

### Styling & Theming
- Uses **Tailwind CSS** for utility-first styling, with custom color variables for light/dark themes.
- Theme switching is supported via a ThemeProvider (next-themes).
- Responsive design for desktop and mobile.

### Component Library
- UI primitives are built on top of [shadcn/ui](https://ui.shadcn.com/) and Radix UI, providing accessible, composable components (e.g., Button, Card, Tabs, Dialog, Tooltip, etc.).
- Custom components extend these primitives for app-specific needs.

### Technical Notes
- State is managed with React hooks (useState, custom hooks).
- Mock data is currently used for personas and messages; integration with backend endpoints is planned.
- All logic is client-side; async API calls will be added for real persona/message flow.
- TypeScript is used throughout for type safety.
- See frontend/app/page.tsx for main panel implementation.

## 1. Purpose

Build a web application for creative ideation that simulates a structured discussion between diverse AI personas. The system helps users generate insight by observing how multiple viewpoints respond to a prompt.

## 2. Core Concept

* AI personas represent distinct perspectives, styles, or roles.
* The user moderates the discussion by providing a topic or question.
* Personas respond in turn, seeing full chat history.
* The discussion is styled like a group chat.
* A summary of the conversation is available at the end.

## 3. Functional Requirements

### 3.1 Topic Input

* User inputs a topic or question to discuss.
* Visible in fixed position throughout session.

### 3.2 Persona Management

* User creates personas via a form builder.
* Each persona has:

  * Name
  * Short description (1–2 sentences)
  * Optional demographic tags (age, gender, profession, etc.)
  * List of traits (e.g., optimistic, skeptical)
  * Speech style or tone (e.g., formal, casual, assertive)
* Option to export/import persona sets as JSON.

### 3.3 Discussion Engine

* User starts discussion after defining panel and topic.
* Personas respond one by one, in defined order.
* Each response has access to the full conversation history.
* Personas can refer to previous responses.
* User (moderator) can:

  * Pause/resume conversation
  * Add comments (optional)
  * End session at any time

### 3.4 Chat Interface

* Threaded, chat-style interface showing responses in order
* Each message shows:

  * Speaker name
  * Timestamp
  * Message content
* On hover over speaker name or avatar:

  * Show persona tooltip with key traits and description

### 3.5 Summary Output

* Upon stopping, system offers summary options:

  * AI-generated synthesis of perspectives
  * Full transcript export (Markdown/JSON)

## 4. Optional Settings (Stretch Goals)

* Max turns per persona or total discussion length
* Word count limit per response
* Enable/disable specific personas mid-session
* Toggle between chat-style and report-style view

## 5. Technical Notes

* All personas use the same AI model, differentiated via prompt context.
* Turn-based flow managed client-side with async AI calls.
* No memory across sessions unless saved/exported.
* Possible model config per persona (e.g., temperature, system prompt)

## 6. Future Features

* Save/load previous discussion sessions
* Voting or rating by personas
* Tagging or clustering of arguments
* Visualization of opinion spread
* Support for audio or animated avatars

## 7. MVP Scope (Phase 1)

* Topic input
* Persona form builder
* Turn-based discussion engine
* Chat-style interface
* Summary generation (via LLM)
* Import/export persona config

## 8. Roles & Responsibilities

* User: defines personas, moderates discussion, controls session flow
* App: handles turn logic, UI display, and AI interaction per persona

---

Document owner: Tim
Status: Draft
Last updated: 2025-07-18
