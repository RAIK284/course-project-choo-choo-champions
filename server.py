import asyncio
import websockets
import json

clients = set()
sessions = {}


async def handle_client(websocket, path):
    clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")
    try:
        async for message in websocket:
            data = json.loads(message)
            message_type = data.get('type')

            if message_type == 'joinGame':
                sessionId = data.get('sessionId')
                username = data.get('username')

                if sessionId in sessions:
                    sessions[sessionId].append(
                        {'username': username, 'ready': False})
                else:
                    sessions[sessionId] = [
                        {'username': username, 'ready': False}]

                for client in clients:
                    if client != websocket:
                        await client.send(json.dumps({'type': 'playerJoined', 'player': {'username': username, 'ready': False}}))

    finally:
        clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")


async def main():
    async with websockets.serve(handle_client, "localhost", 8765):
        print("WebSocket server started. Listening on port 8765...")
        await asyncio.Future()

asyncio.run(main())
