import json
import redis
from openai import OpenAI

REDIS_HOST = ""
REDIS_PORT = 6379
STREAM_NAME = "products_stream"
GROUP_NAME = "product_indexers"
CONSUMER_NAME = "consumer-1"
SEARCH_INDEX_NAME = "products_idx"
VECTOR_ALGORITHM = "COSINE"
EMBED_DIM = 1536
OPENAI_MODEL = "text-embedding-3-small"

redis_client = redis.Redis(
    host='',
    port=13451,
    decode_responses=True,
    username="default",
    password="",
)

openai_client = OpenAI(api_key="")

try:
    redis_client.xgroup_create(STREAM_NAME, GROUP_NAME, id="0-0", mkstream=True)
except redis.exceptions.ResponseError as e:
    if "BUSYGROUP" not in str(e):
        raise

def ensure_index():
    try:
        redis_client.execute_command(
            f"""
            FT.CREATE {SEARCH_INDEX_NAME} ON JSON PREFIX 1 product: SCHEMA
            $.name AS name TEXT
            $.description AS description TEXT
            $.brand AS brand TAG
            $.price AS price NUMERIC
            $.rating AS rating NUMERIC
            $.reviews AS reviews NUMERIC
            $.category AS category TAG
            $.inStock AS inStock TAG
            $.features[*] AS features TEXT
            $.warehouse_geolocation AS warehouse_location GEO
            $.image AS image TEXT NOINDEX
            $.embedding AS embedding VECTOR FLAT 6 TYPE FLOAT32 DIM {EMBED_DIM} DISTANCE_METRIC {VECTOR_ALGORITHM}
            """
        )
        print(f"✅ Created index '{SEARCH_INDEX_NAME}'")
    except redis.exceptions.ResponseError as e:
        if "Index already exists" in str(e):
            print(f"ℹ️ Index '{SEARCH_INDEX_NAME}' already exists")
        else:
            raise

def drop_index():
    try:
        print("Deleting index...")
        redis_client.ft().dropindex(SEARCH_INDEX_NAME)
    except:
        pass

def generate_embedding(text: str):
    if not text.strip():
        return [0.0] * EMBED_DIM
    resp = openai_client.embeddings.create(input=text, model=OPENAI_MODEL)
    return resp.data[0].embedding


def index_product(product: dict):
    key_value_str = ", ".join(f"{k}: {v}" for k, v in product.items() if k not in ("id", "image"))
    embedding = generate_embedding(key_value_str)
    product["embedding"] = embedding
    # product_id = redis_client.incr("pid_cnt")
    # product["id"] = int(product_id)
    key = f"product:{product['id']}"
    redis_client.json().set(key, "$", product)
    print(f"📦 Indexed product: {product['id']}")

def process_stream():
    print(f"🚀 Listening for new products on stream '{STREAM_NAME}' in group '{GROUP_NAME}'...")
    while True:
        messages = redis_client.xreadgroup(
            groupname=GROUP_NAME,
            consumername=CONSUMER_NAME,
            streams={STREAM_NAME: ">"},
            count=10,
            block=5000
        )
        if messages:
            for stream_name, entries in messages:
                for entry_id, data in entries:
                    try:
                        product_data = json.loads(data["product"])
                        index_product(product_data)
                        # ✅ Acknowledge message
                        redis_client.xack(STREAM_NAME, GROUP_NAME, entry_id)
                        print(f"📨 Acknowledged message {entry_id}")
                    except Exception as e:
                        print(f"❌ Error processing message {entry_id}: {e}")


if __name__ == "__main__":
    drop_index()
    ensure_index()
    process_stream()
