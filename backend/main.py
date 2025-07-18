from datetime import datetime
import uuid
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Persona(BaseModel):
    id: str
    name: str
    description: str
    traits: list[str]
    tone: str

class Message(BaseModel):
    speaker_id: str
    content: str
    timestamp: datetime

class Session(BaseModel):
    id: str
    topic: str
    personas: list[Persona]
    messages: list[Message]
    turn_index: int = 0

class StartSessionRequest(BaseModel):
    topic: str
    personas: list[Persona]

sessions: dict[str, Session] = {}

@app.post("/sessions", response_model=Session)
def start_session(req: StartSessionRequest):
    sid = str(uuid.uuid4())
    sess = Session(id=sid, topic=req.topic, personas=req.personas, messages=[])
    sessions[sid] = sess
    return sess

@app.get("/sessions/{sid}", response_model=Session)
def get_session(sid: str):
    sess = sessions.get(sid)
    if not sess:
        raise HTTPException(404, "Session not found")
    return sess

@app.post("/sessions/{sid}/next", response_model=Message)
async def next_turn(sid: str):
    sess = sessions.get(sid)
    if not sess:
        raise HTTPException(404, "Session not found")
    persona = sess.personas[sess.turn_index % len(sess.personas)]
    history = "\n".join(
        f"{next(p.name for p in sess.personas if p.id==m.speaker_id)}: {m.content}"
        for m in sess.messages
    )
    prompt = (
        f"Topic: {sess.topic}\n\n"
        f"{history}\n"
        f"{persona.name} ({persona.description}, traits: {', '.join(persona.traits)}, tone: {persona.tone})\n"
        "Respond in one paragraph:"
    )
    resp = await openai.ChatCompletion.acreate(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )
    text = resp.choices[0].message.content
    msg = Message(speaker_id=persona.id, content=text, timestamp=datetime.utcnow())
    sess.messages.append(msg)
    sess.turn_index += 1
    return msg

@app.post("/sessions/{sid}/summary")
async def summary(sid: str):
    sess = sessions.get(sid)
    if not sess:
        raise HTTPException(404, "Session not found")
    transcript = "\n".join(
        f"{next(p.name for p in sess.personas if p.id==m.speaker_id)}: {m.content}"
        for m in sess.messages
    )
    prompt = f"Summarize these perspectives:\n\n{transcript}"
    resp = await openai.ChatCompletion.acreate(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )
    return {"summary": resp.choices[0].message.content}