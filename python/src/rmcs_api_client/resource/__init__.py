from datetime import datetime
from uuid import UUID
from typing import Optional

class Resource:

    def __init__(self, address: str, access_token: str = None, refresh_token: str = None):
        self.address = address
        self.access_token = access_token
        self.refresh_token = refresh_token
