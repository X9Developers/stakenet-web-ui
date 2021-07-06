
import { webSocket } from "rxjs/webSocket";
import { Subject } from "rxjs";
import { Event } from '../../models/protos/api_pb';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { createContext, useContext } from 'react';
import { webSocketContext } from "./webSocketContext";

interface webSocketObject {
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>
}

const notifyWebSocketListener = (webSocketListener: Subject<Event>, data: any) => {
  webSocketListener.next(Event.deserializeBinary(new Uint8Array(data)))
}

export const useWebSocket = (): webSocketObject => {
  const context = useContext(webSocketContext)
  let webSocketObject: webSocketObject;

  if (context && Object.entries(context).length === 0 && context.constructor === Object) {
    webSocketObject = createWebSocket()
    createContext(webSocketObject)
  } else {
    webSocketObject = context as webSocketObject;
  }

  return webSocketObject;
}

const reconnectSocket = (): void => {
  setTimeout(() => createWebSocket(), 500);
}

const createWebSocket = () => {
  const webSocketListener: Subject<Event> = new Subject();
  const webSocketSubjet = webSocket({
    url: process.env.REACT_APP_SERVER_URL || '',
    protocol: "100",
    deserializer: ({ data }) => data,
    serializer: (msg: Uint8Array) => msg,
    openObserver: {
      next: () => {
        console.log('connetion ok');
      }
    },
    binaryType: 'arraybuffer'
  });

  webSocketSubjet.subscribe(
    data => notifyWebSocketListener(webSocketListener, data), // Called whenever there is a message from the server.
    err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    () => reconnectSocket() // Called when connection is closed (for whatever reason).
  );
  const webSocketObject = {
    webSocketSubject: webSocketSubjet,
    webSocketListener: webSocketListener
  }
  return webSocketObject;
}
