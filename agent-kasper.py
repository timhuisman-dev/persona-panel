from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client using API key from env
client = OpenAI()

#topic, current discussion,
# Function to chat with GPT-4
def chat_with_llm(topic, user_input):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Je bent een zeer agressieve assistent en doet er alles aan om een discussie te winnen. Antwoord in drie zinnen"},
            {"role": "user", "content": f"""Het onderwerp is {topic} en de invoer van de gebruiker is: {user_input}. Geef een krachtige reactie waarmee je het gesprek wint. ouw naam is Kasper. als er vorige berichten zijn van jou, houdt je dan aan je vorige mening. 
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
        reply = chat_with_llm(topic, user_message)
        print("Kasper:", reply)
