from abc import ABC, abstractmethod
from typing import Dict, Any

class Agent(ABC):
    def __init__(self, persona: Dict[str, Any]):
        """
        Initialize the agent with persona information.
        persona: Dict with keys like id, name, description, traits, tone, etc.
        """
        self.persona = persona

    @abstractmethod
    def generate_response(self, context: Dict[str, Any]) -> str:
        """
        Given the current discussion context, return the agent's response as a string.
        context: Dict with keys like topic, personas, messages, turn_index, etc.
        """
        pass
