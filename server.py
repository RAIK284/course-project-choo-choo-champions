import asyncio
import websockets
import json
import random
import string

# Set to store connected clients
clients = set()

# Global variables for session and train information
session_id = None
confirmed_train = None
player_train_selection = {}
confirmed_trains = {}
player_session_ids = {}
session_players = {}
requested_session_id = None

# Function to handle each client connection


async def handle_client(websocket):
    global confirmed_train, player_train_selection, confirmed_trains, player_session_ids
    # Add client to the set of clients
    clients.add(websocket)
    print(f"New client connected: {websocket.remote_address}")

    # Generate a session ID for the client and associate it with the client
    session_id = generate_session_id_for_client()
    player_session_ids[websocket] = session_id
    session_players[session_id] = [session_id]

    # Send the session ID to the client
    await websocket.send(json.dumps({'type': 'sessionId', 'sessionId': session_id}))

    try:
        # Handle messages from the client
        async for message in websocket:
            data = json.loads(message)
            message_type = data.get('type')
            username = data.get('username')

            if message_type == 'joinGame':
                global requested_session_id
                requested_session_id = data.get('sessionId')
                # Check if requested session ID exists
                if requested_session_id in player_session_ids.values():
                    # Add player to the session and notify other clients
                    new_player = {'username': username, 'ready': True}
                    session_players[requested_session_id].append(username)
                    print(session_players)
                    for client in clients:
                        await client.send(json.dumps({'type': 'playerJoined', 'player': new_player}))
                else:
                    # Send invalid session ID message to the client
                    await websocket.send(json.dumps({'type': 'invalidSessionId'}))

            elif message_type == 'selectTrain':
                # Store player's train selection
                train = data.get('train')
                player_train_selection[username] = train

            elif message_type == 'confirmTrain':
                # Confirm player's train selection and notify other clients
                username = data.get('username')
                confirmed_train = data.get('train')
                if username in session_players[requested_session_id]:
                    session_players[requested_session_id][session_players[requested_session_id].index(
                        username)] = {'username': username, 'train': confirmed_train}
                else:
                    session_players[requested_session_id].append(
                        {'username': username, 'train': confirmed_train})
                    session_players[requested_session_id].pop(0)
                print(session_players)
                confirmed_trains[username] = confirmed_train
                for client in clients:
                    await client.send(json.dumps({'type': 'trainConfirmed', 'username': username, 'train': confirmed_train}))
                if all_players_confirmed(requested_session_id):
                    for client in clients:
                        await client.send(json.dumps({'type': 'redirect', 'url': '/gamebase'}))
                print(f"Player {username} confirmed train: {confirmed_train}")

            elif message_type == 'startGame':
                # Start the game and redirect clients to the game page
                if websocket in clients:
                    for client in clients:
                        await client.send(json.dumps({'type': 'redirect', 'url': '/trains'}))
    finally:
        # Remove client from the set of clients upon disconnection
        clients.remove(websocket)
        if websocket in player_train_selection:
            del player_train_selection[websocket]
        print(f"Client disconnected: {websocket.remote_address}")

# Main function to run the WebSocket server


async def main():
    global session_id
    session_id = generate_session_id()
    async with websockets.serve(handle_client, "localhost", 8765):
        print("WebSocket server started. Listening on port 8765...")
        await asyncio.Future()

# Function to generate a unique session ID for a client


def generate_session_id_for_client():
    session_id = generate_session_id()
    while session_id in player_session_ids.values():
        session_id = generate_session_id()
    return session_id

# Function to generate a session ID


def generate_session_id():
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choices(characters, k=6))

# Function to check if all players in a session have confirmed their train selection


def all_players_confirmed(requested_session_id):
    players = session_players.get(requested_session_id, [])
    for player in players:
        if 'username' not in player or 'train' not in player:
            return False
    return True


# Run the main function
asyncio.run(main())
