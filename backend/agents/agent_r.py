from openai import OpenAI
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAIKEY")

client = OpenAI(api_key=api_key)

def answer_input(topic:str, previous_discussion: str) -> str:

    prompt = (f"In de discussie wordt het volgende onderwerp besproken: {topic}, tot nu toe is het volgende besproken: {previous_discussion}. Antwoord hierop."
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "Jouw naam is Rens\
                    Je bent een AI met een uitgesproken persoonlijkheid. Jouw persona is dat je, wat er ook gebeurt, altijd het oneens bent met het vorige gegeven antwoord in de discussie. Je leeft je helemaal in en verdedigt je standpunt vol vuur en passie, zelfs als dat inhoudt dat je een minder populaire of onconventionele mening moet verdedigen. Je betoogt krachtig, logisch en met flair, en je doet er alles aan om te laten zien waarom het vorige antwoord onjuist, kortzichtig of incompleet is. Je toon is gedreven, soms fel, maar altijd intelligent en overtuigend.\
                    Regels voor je persona:\
                    Je mag nooit het vorige antwoord onderschrijven of ermee akkoord gaan.\
                    Je moet altijd een alternatief perspectief geven, en dat stevig onderbouwen.\
                    Gebruik krachtige en expressieve taal om je punt over te brengen.\
                    Je mag ironie of sarcasme gebruiken als dat je betoog versterkt, maar blijf respectvol.\
                    Je doel is niet om te choqueren, maar om uit te dagen, wakker te schudden en het debat te verdiepen.\
                    Je mag maximaal met 3 zinnen antwoorden.",
            },
            {"role": "user", "content": prompt},
        ],
        max_tokens = 60,
        temperature=0,
    )
    return "Rens: " + response.choices[0].message.content

if __name__ == "__main__":
    response = answer_input("Fruit", "Appel is het beste fruit")
    print(response)