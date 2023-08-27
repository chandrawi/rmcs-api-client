from datetime import datetime
from uuid import UUID
from typing import Optional

class Auth:

    def __init__(self, address: str, auth_token: str = None):
        self.address = address
        self.auth_token = auth_token
