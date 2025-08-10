from typing import List

from openai import OpenAI

from ..config.settings import settings


class EmbeddingService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)

    def get_embedding(self, text: str) -> List[float]:
        """Get OpenAI embedding for text."""
        response = self.client.embeddings.create(
            model="text-embedding-3-small", input=text
        )
        return response.data[0].embedding


embedding_service = EmbeddingService()
