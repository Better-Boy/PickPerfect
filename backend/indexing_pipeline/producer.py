import redis

redis_client = redis.Redis(
    host='',
    port=13451,
    decode_responses=True,
    username="default",
    password="",
)

with open("sample_data.json", "r") as f:
    for line in f:
        redis_client.xadd("products_stream", {"product": line})
