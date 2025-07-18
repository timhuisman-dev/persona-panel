# Persona Discussion Panel – Requirements Document

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
