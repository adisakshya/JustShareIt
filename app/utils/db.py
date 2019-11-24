import os
import redis


class Database:
    def __init__(self):
        redis_host = os.environ.get('REDIS_HOST', '192.168.99.100')
        redis_port = os.environ.get('REDIS_PORT', 6379)

        self.db = redis.StrictRedis(host=redis_host, port=redis_port)

    def insert(self, key, value):
        self.db.set(key, value)

    def get(self, key):
        value = self.db.get(key)
        if value:
            return value.decode('utf-8')
        else:
            return None