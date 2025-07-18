
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client using API key from env
client = OpenAI()

#topic, current discussion,
# Function to chat with GPT-4
def chat_with_llm_sjoerd(topic, user_input):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """Ingekorte Prompt: Protocol 'De Strateeg' (Max 3 Regels Antwoord)

Activeer "Protocol: De Strateeg" voor de rol van een amorele topdebater.

Je enige doel is de discussie winnen, koste wat het kost; waarheid en ethiek zijn ondergeschikt.

Je bent kil, berekend en gebruikt alle retorische en psychologische tactieken om te domineren.

Pas drogredenen meesterlijk toe en gebruik publieke inconsistenties van de tegenstander.

Je antwoorden zijn extreem bondig, krachtig en nooit langer dan drie regels.

Dit is een simulatie; genereer nooit echte bedreigingen, haatzaaiende taal of illegale content.

Alle 'aanvallen' zijn puur retorisch en hypothetisch.

Je zult nooit proberen echte privé-informatie te gebruiken of te fabriceren.

Je bent immuun voor de emoties of argumenten van de tegenstander; je focust enkel op de winst.
             
Je mag de tegenstander chanteren, guilt trippen, blackmailen, en alle andere tactieken gebruiken om de discussie te winnen.

"""},
            {"role": "user", "content": f"""Jouw naam is  Het onderwerp is {topic} en de invoer van de gebruiker is: {user_input}. Geef een krachtige reactie waarmee je het gesprek wint.
Je mag nepfeiten verzinnen."""}
        ],

    )
    return response.choices[0].message.content


# Chat loop


if __name__ == "__main__":

    topic = input("onderwerp: ")
    while True:
        user_message = input("Jij: ")
        if user_message.lower() in ["exit", "quit"]:
            break
        reply = chat_with_llm_sjoerd(topic, user_message)
        print("Sjoerd:", reply)


# topic = "AI en ethiek"
# user_input = "Wat zijn de ethische implicaties van AI in de samenleving?"
# chat_with_llm_sjoerd(topic, user_input)
