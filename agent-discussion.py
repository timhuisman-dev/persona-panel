from agent_kasper import chat_with_llm
from agent_r import answer_input




def simulate_chat(topic, rounds=5):
    print(f"=== Topic: {topic} ===\n")
    kasper_input = "Let's start the discussion."

    for i in range(rounds):
        kasper_response = chat_with_llm(topic, kasper_input)
        print(f"Kasper ({i+1}): {kasper_response}")

        r_response = answer_input(topic, kasper_response)
        print(f"R ({i+1}): {r_response}\n")

        kasper_input = r_response




round_tracker = {"round": 0}  # global-like mutable tracker


def run_round(topic, input_text):
    if round_tracker["round"] % 2 == 0:
        response = chat_with_llm(topic, input_text)
        print(f"Kasper: {response}")
    else:
        response = answer_input(topic, input_text)
        print(f"Rens: {response}")

    round_tracker["round"] += 1

    return response


def start_discussion(topic, description):
    print(f"=== Topic: {topic} ===")
    print(f"Description: {description}\n")

    return topic, description  # so you can continue manually



if __name__ == "__main__":

    # simulate_chat("lekkerste fruit", rounds=5)
    start_discussion('fruit','wat is het lekkerst')
