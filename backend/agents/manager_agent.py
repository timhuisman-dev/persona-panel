from dotenv import load_dotenv
import os
from openai import OpenAI
from typing import List
from backend.agents.agent_r import answer_input
from backend.agents.agent_kasper import chat_with_llm
from backend.agents.agent_sjoerd import chat_with_llm_sjoerd


load_dotenv()
api_key = os.getenv("OPENAIKEY")

client = OpenAI(api_key=api_key)

class ManagerAgent:
    def __init__(self, client: OpenAI, topic: str, user_input: str):
        self.client = client
        self.user_input = user_input
        self.topic = topic

    def put_into_perspectieven(self):
        for _ in range(5):
            for agent_func in [answer_input, chat_with_llm, chat_with_llm]:
                response = agent_func(self.topic, self.user_input)
                print(response, "\n")
                self.user_input += response
        #perspectieven.append(self.agent_sjoerd)
        return
    
    def host_discussion(self) -> str:
        """
        Neutrale manager die een discussie over een onderwerp host.
        Hij introduceert het onderwerp, vraagt meningen van meerdere 'stemmen',
        en geeft een samenvatting.
        """
        # 1. Introductie prompt
        intro_prompt = (
            f"Je bent een neutrale AI manager die een discussie host over het onderwerp: '{self.topic}'. "
            f"Je vraagt naar meningen van verschillende perspectieven en vat daarna neutraal samen."
        )
        
        messages = [{"role": "system", "content": intro_prompt}]
        self.put_into_perspectieven()
        messages.append({
            "role": "user",
            "content": f"Gegeven deze discussie: {self.user_input}. Wat is jouw mening over deze discussie en wie is de winnaar volgens jou? Je moet een winnaar kiezen."
        })
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
        )
        
        return response.choices[0].message.content.strip()

# Voorbeeldgebruik
if __name__ == "__main__":
    
    onderwerp = "Palestina-Israël conflict"
    manager = ManagerAgent(client, onderwerp, user_input="Start: Wat vinden jullie van het onderwerp?")
    final_answer = manager.host_discussion()
    print(final_answer)