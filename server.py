import asyncio
import websockets
import json
import random
import string

clients = set()
session_id = None


async def handle_client(websocket):
    global session_id
    clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")

    await websocket.send(json.dumps({'type': 'sessionId', 'sessionId': session_id}))

    try:
        async for message in websocket:
            data = json.loads(message)
            message_type = data.get('type')

            if message_type == 'joinGame':
                if data.get('sessionId') == session_id:
                    username = data.get('username')
                    new_player = {'username': username, 'ready': True}
                    for client in clients:
                        await client.send(json.dumps({'type': 'playerJoined', 'player': new_player}))
                else:
                    await websocket.send(json.dumps({'type': 'invalidSessionId'}))

            elif message_type == 'startGame':
                if websocket in clients:
                    for client in clients:
                        await client.send(json.dumps({'type': 'redirect', 'url': '/trains'}))

    finally:
        clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")


async def main():
    global session_id
    session_id = generate_session_id()
    async with websockets.serve(handle_client, "localhost", 8765):
        print("WebSocket server started. Listening on port 8765...")
        await asyncio.Future()


def generate_session_id():
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=6))


asyncio.run(main())
