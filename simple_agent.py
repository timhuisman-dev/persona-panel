client = OpenAI(api_key=Secret.OPENAI_API_KEY)

def answer_input(df: dict, input_question: str) -> Optional[str]:

    prompt = (f"gegeven data {df}, beantwoord input vraag {input_question}"
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "Je bent een behulpzame assistent die uitsluitend de meest vergelijkbare vraag teruggeeft in een string.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )
    return response