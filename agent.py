from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Initialize OpenAI client using API key from env
client = OpenAI()

#topic, current discussion,
# Function to chat with GPT-4
def chat_with_llm(user_input):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message.content

# Chat loop
while True:
    user_message = input("You: ")
    if user_message.lower() in ["exit", "quit"]:
        break
    reply = chat_with_llm(user_message)
    print("AI:", reply)

