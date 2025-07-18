from agent_kasper import chat_with_llm
from agent_r import answer_input
from agent_sjoerd import chat_with_llm_sjoerd



def simulate_chat(topic, rounds=5):
    print(f"=== Topic: {topic} ===\n")
    kasper_input = "Let's start the discussion."

    for i in range(rounds):
        kasper_response = chat_with_llm(topic, kasper_input)
        print(f"Kasper ({i+1}): {kasper_response}")

        r_response = answer_input(topic, kasper_response)
        print(f"R ({i+1}): {r_response}\n")

        kasper_input = r_response





def run_round(name_of_turn, topic, input_text, round_tracker):
    # Cycle: Kasper (0), Rens (1), Sjoerd (2)
    if round_tracker % 3 == 0:
        response = chat_with_llm(topic, input_text)
        name_of_turn = 'Kasper'
        print(f"Kasper: {response}")
    elif round_tracker % 3 == 1:
        response = answer_input(topic, input_text)
        name_of_turn = 'Rens'
        print(f"Rens: {response}")
    else:
        response = chat_with_llm_sjoerd(topic, input_text)
        name_of_turn = 'Sjoerd'
        print(f"Sjoerd: {response}")

    round_tracker += 1

    return name_of_turn, topic, response, round_tracker


def start_discussion(topic, description):
    print(f"=== Topic: {topic} ===")
    print(f"Description: {description}\n")

    return "Kasper",topic, description, 0 # so you can continue manually



if __name__ == "__main__":

    # simulate_chat("lekkerste fruit", rounds=5)
    simulate_chat('fruit is het gezond')
