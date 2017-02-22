import asyncio
import websockets
import configparser
import socket

async def handle(websocket, path):
    web_request = await websocket.recv()
    print("< {}".format(web_request))
    ahgrar_config = configparser.ConfigParser()
    try:
        ahgrar_config.read('AHGraR_config.txt')
    except OSError:
        print("Config file not found. Exiting.")
        exit(3)
    connection = socket.create_connection(
        (ahgrar_config['AHGraR_Gateway']['ip'], ahgrar_config['AHGraR_Gateway']['port']))
    result = await connection.send("Hey")
    connection.close()
    greeting = "Hello {}!".format(web_request)
    await websocket.send(greeting)
    print("> {}".format(greeting))

start_server = websockets.serve(handle, 'localhost', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()