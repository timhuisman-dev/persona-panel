from dotenv import load_dotenv
import os
from openai import OpenAI
from typing import List
from agent-r import answer_input
from agent-kasper import chat_with_llm
from agent_sjoerd import chat_with_llm_sjoerd


load_dotenv()
api_key = os.getenv("OPENAIKEY")

client = OpenAI(api_key=api_key)

class ManagerAgent:
    def __init__(self, client: OpenAI, topic: str, user_input: str):
        self.client = client
        self.user_input = user_input
        self.topic = topic
        self.agent_rens = answer_input(self.topic, self.user_input)
        self.agent_kasper = chat_with_llm(self.topic, self.user_input)
        self.agent_sjoerd = chat_with_llm_sjoerd(self.topic, self.user_input)

    def put_into_perspectieven(self):
        perspectieven = []
        perspectieven.append(self.agent_rens)
        perspectieven.append(self.agent_kasper)
        perspectieven.append(self.agent_sjoerd)
        return(perspectieven)
    
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
        perspectives = self.put_into_perspectieven()
        for i, p in enumerate(perspectives):
            messages.append({
                "role": "user",
                "content": f"Perspectief {i+1}: {p}. Wat is jouw mening hierover binnen dat perspectief?"
            })
        
        # 2. Vraag om discussie
        messages.append({
            "role": "user",
            "content": f"Kun je als neutrale manager een samenvatting geven van de discussie over '{self.topic}'?"
        })
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.7,
        )
        
        return response.choices[0].message.content.strip()

# Voorbeeldgebruik
if __name__ == "__main__":
    manager = ManagerAgent(client)
    onderwerp = "Kunstmatige intelligentie in het onderwijs"
    resultaat = manager.host_discussion(onderwerp, )
    print(resultaat)