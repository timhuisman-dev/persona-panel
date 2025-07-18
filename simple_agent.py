from dotenv import load_dotenv
import os
from openai import OpenAI
from typing import List

load_dotenv()
api_key = os.getenv("OPENAIKEY")

client = OpenAI(api_key=api_key)

class ManagerAgent:
    def __init__(self, client: OpenAI):
        self.client = client
    
    def host_discussion(self, topic: str, perspectives: List[str]) -> str:
        """
        Neutrale manager die een discussie over een onderwerp host.
        Hij introduceert het onderwerp, vraagt meningen van meerdere 'stemmen',
        en geeft een samenvatting.
        """
        # 1. Introductie prompt
        intro_prompt = (
            f"Je bent een neutrale AI manager die een discussie host over het onderwerp: '{topic}'. "
            f"Je vraagt naar meningen van verschillende perspectieven en vat daarna neutraal samen."
        )
        
        messages = [{"role": "system", "content": intro_prompt}]
        
        for i, p in enumerate(perspectives):
            messages.append({
                "role": "user",
                "content": f"Perspectief {i+1}: {p}. Wat is jouw mening hierover binnen dat perspectief?"
            })
        
        # 2. Vraag om discussie
        messages.append({
            "role": "user",
            "content": f"Kun je als neutrale manager een samenvatting geven van de discussie over '{topic}'?"
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
    perspectieven = [
        "Leraar in het middelbaar onderwijs",
        "Technologiebedrijf",
        "Ouder van een leerling",
        "Onderwijsbeleidsmaker"
    ]

    resultaat = manager.host_discussion(onderwerp, perspectieven)
    print(resultaat)