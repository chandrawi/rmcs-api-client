import subprocess
import time
from typing import Optional
import psycopg


def truncate_tables_auth(db_url: str):
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("TRUNCATE TABLE \"api\" CASCADE;")
            cur.execute("TRUNCATE TABLE \"user\" CASCADE;")
            cur.execute("TRUNCATE TABLE \"token\" CASCADE;")

def truncate_tables_resource(db_url: str):
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("TRUNCATE TABLE \"device_type\" CASCADE;")
            cur.execute("TRUNCATE TABLE \"model\" CASCADE;")

def wait_server(server_name: str):
    name = server_name[0:15]
    start = time.time()
    while True:
        proc1 = subprocess.Popen(['ss', '-tupln'], stdout=subprocess.PIPE)
        proc2 = subprocess.Popen(['grep', name, '-c'], stdin=proc1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        proc1.stdout.close()
        out, _ = proc2.communicate()
        if out == b'1\n': break
        if time.time() - start > 10: break
        time.sleep(0.1)

def start_auth_server(db_url: Optional[str]=None, address: Optional[str]=None, secured: bool=False):
    command = ["cargo", "run", "-p", "rmcs-api-server", "--bin", "test_auth_server", "--"]
    if db_url != None:
        command = command + ["--db-url", db_url]
    if address != None:
        command = command + ["--address", address]
    if secured:
        command.append("--secured")
    subprocess.Popen(command, start_new_session=True)
    wait_server("test_auth_server")

def stop_auth_server():
    subprocess.run(["killall", "test_auth_server"])

def start_resource_server(db_url: Optional[str]=None, address: Optional[str]=None, secured: bool=False, auth_address: Optional[str]=None, api_id: Optional[str]=None, password: Optional[str]=None):
    command = ["cargo", "run", "-p", "rmcs-api-server", "--bin", "test_resource_server", "--"]
    if db_url != None:
        command = command + ["--db-url", db_url]
    if address != None:
        command = command + ["--address", address]
    if auth_address != None:
        command = command + ["--auth-address", auth_address]
    if api_id != None:
        command = command + ["--api-id", api_id]
    if password != None:
        command = command + ["--password", password]
    if secured:
        command.append("--secured")
    subprocess.Popen(command, start_new_session=True)
    wait_server("test_resource_server")

def stop_resource_server():
    subprocess.run(["killall", "test_resource_server"])
