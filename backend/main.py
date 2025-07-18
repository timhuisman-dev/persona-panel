from datetime import datetime
import uuid
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from openai import OpenAI

from backend.agents import agent_discussion

openai_api_key = os.getenv("OPENAIKEY")
openai_client = OpenAI(api_key=openai_api_key)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    speaker_id: str
    content: str
    timestamp: datetime

class Session(BaseModel):
    id: str
    topic: str
    description: str
    messages: list[Message]
    turn_index: int = 0
    name_of_turn: str = "Kasper"  # Track whose turn it is

class StartSessionRequest(BaseModel):
    topic: str
    description: str

sessions: dict[str, Session] = {}

@app.post("/sessions", response_model=Session)
def start_session(req: StartSessionRequest):
    sid = str(uuid.uuid4())
    sess = Session(id=sid, topic=req.topic, description=req.description, messages=[], name_of_turn="Kasper")
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
    # Use the last message as input, or description if no messages yet
    if sess.messages:
        last_input = sess.messages[-1].content
    else:
        last_input = sess.description
    # Use agent_discussion.run_round to get the next turn
    name_of_turn, topic, response, turn_index = agent_discussion.run_round(sess.name_of_turn, sess.topic, last_input, sess.turn_index)
    msg = Message(speaker_id=name_of_turn, content=response, timestamp=datetime.utcnow())
    sess.messages.append(msg)
    sess.turn_index = turn_index
    sess.name_of_turn = name_of_turn
    return msg

@app.post("/sessions/{sid}/summary")
async def summary(sid: str):
    sess = sessions.get(sid)
    if not sess:
        raise HTTPException(404, "Session not found")
    transcript = "\n".join(f"User: {m.content}" for m in sess.messages)
    prompt = f"Summarize this discussion:\n\n{transcript}"
    resp = await openai.ChatCompletion.acreate(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":prompt}]
    )
    return {"summary": resp.choices[0].message.content}