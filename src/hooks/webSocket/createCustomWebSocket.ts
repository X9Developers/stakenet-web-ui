import { webSocket } from "rxjs/webSocket";
import { Subject } from "rxjs";
import { Event } from '../../models/protos/api_pb';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';

interface webSocketObject {
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>
}

const notifyWebSocketListener = (webSocketListener: Subject<Event>, data: any) => {
  webSocketListener.next(Event.deserializeBinary(new Uint8Array(data)))
}

export const createCustomWebSocket = (urlParams: string): webSocketObject => {
  const webSocketListener: Subject<Event> = new Subject();
  const webSocketSubjet = webSocket({
    url: process.env.REACT_APP_SERVER_URL + urlParams,
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
    // () => reconnectSocket() // Called when connection is closed (for whatever reason).
    () => console.log('webSocket closed') // Called when connection is closed (for whatever reason).
  );
  const webSocketObject = {
    webSocketSubject: webSocketSubjet,
    webSocketListener: webSocketListener
  }
  return webSocketObject;
}
