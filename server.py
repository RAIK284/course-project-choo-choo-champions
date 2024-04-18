import asyncio
import websockets
import json
import random
import string

clients = set()
session_id = None
confirmed_train = None
player_train_selection = {}
confirmed_trains = {}
player_session_ids = {}


async def handle_client(websocket):
    global confirmed_train, player_train_selection, confirmed_trains, player_session_ids
    clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")

    session_id = generate_session_id_for_client()
    player_session_ids[websocket] = session_id

    await websocket.send(json.dumps({'type': 'sessionId', 'sessionId': session_id}))

    try:
        async for message in websocket:
            data = json.loads(message)
            message_type = data.get('type')
            username = data.get('username')

            if message_type == 'joinGame':
                requested_session_id = data.get('sessionId')
                if requested_session_id in player_session_ids.values():
                    new_player = {'username': username, 'ready': True}
                    for client in clients:
                        await client.send(json.dumps({'type': 'playerJoined', 'player': new_player}))
                else:
                    await websocket.send(json.dumps({'type': 'invalidSessionId'}))

            elif message_type == 'selectTrain':
                train = data.get('train')
                player_train_selection[websocket] = train

            elif message_type == 'confirmTrain':
                username = data.get('username')
                confirmed_train = data.get('train')
                player_train_selection[username] = confirmed_train
                confirmed_trains[username] = confirmed_train
                for client in clients:
                    await client.send(json.dumps({'type': 'trainConfirmed', 'username': username, 'train': confirmed_train}))
                if all_players_confirmed():
                    for client in clients:
                        await client.send(json.dumps({'type': 'redirect', 'url': '/gamebase'}))
                print(f"Player {username} confirmed train: {confirmed_train}")

            elif message_type == 'startGame':
                if websocket in clients:
                    for client in clients:
                        await client.send(json.dumps({'type': 'redirect', 'url': '/trains'}))
    finally:
        clients.remove(websocket)
        if websocket in player_train_selection:
            del player_train_selection[websocket]
        print(f"Client disconnected: {websocket.remote_address}")


async def main():
    global session_id
    session_id = generate_session_id()
    async with websockets.serve(handle_client, "localhost", 8765):
        print("WebSocket server started. Listening on port 8765...")
        await asyncio.Future()


def generate_session_id_for_client():
    session_id = generate_session_id()
    while session_id in player_session_ids.values():
        session_id = generate_session_id()
    return session_id


def generate_session_id():
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=6))


def all_players_confirmed():
    return len(confirmed_trains) == len(clients)


asyncio.run(main())
