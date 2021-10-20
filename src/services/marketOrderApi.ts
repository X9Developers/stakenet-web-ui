
import { Command, Event } from '../models/protos/api_pb';
import { first } from 'rxjs/operators';
import { ProtobufFactory } from '../helpers/protobuf-factory';
import { SubscribeResponse, GetHistoricTradesResponse, PlaceOrderResponse } from '../models/protos/commands_pb';
import { Subject } from 'rxjs';
import { Order } from '../models/protos/models_pb';

import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
// import { TradeCompleted } from 'models/protos/events_pb';

const getStream = (webSocketListener: Subject<Event>, commandId: string) => {
  return webSocketListener
    .pipe(first(event => event.hasResponse() && event?.getResponse()?.getClientmessageid() === commandId));
}

// const getStreamUntrusted = (webSocketListener: Subject<Event>) => {
//   return webSocketListener
//     .pipe(first(event => event.hasResponse()));
// }



export const promiseTimeout = (promise: Promise<any>, ms = 60000) => {

  // Create a promise that rejects in <ms> milliseconds
  const timeout = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([
    promise,
    timeout
  ]);
};


export const subscribe = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>,
  tradingPair: string) => {

  const message: Command = ProtobufFactory.createSubscribe(tradingPair);
  webSocketSubject.next(message.serializeBinary());

  const orderbookStream = getStream(webSocketListener, message.getClientmessageid());
  const promise = new Promise<SubscribeResponse.AsObject | undefined>((resolve, reject) => {
    orderbookStream.forEach((event: Event) => {
      const commandResponse = event.toObject().response;
      if (commandResponse?.commandfailed) {
        reject(Error(commandResponse?.commandfailed.reason));
      } else {
        resolve(commandResponse?.subscriberesponse);
      }
    });
  });
  return promise;
}


export const getHistoryTrades = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>,
  tradingPair: string) => {

  const message: Command = ProtobufFactory.createGetHistoricTrades(tradingPair);
  webSocketSubject.next(message.serializeBinary());

  const orderbookStream = getStream(webSocketListener, message.getClientmessageid());
  const promise = new Promise<GetHistoricTradesResponse.AsObject | undefined>((resolve, reject) => {
    orderbookStream.forEach((event: Event) => {
      const commandResponse = event.toObject().response;
      if (commandResponse?.commandfailed) {
        reject(Error(commandResponse?.commandfailed.reason));
      } else {
        resolve(commandResponse?.gethistorictradesresponse);
      }
    });
  });
  return promise;
}





export const createPlaceOrder = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>,
  order: Order) => {

  const message: Command = ProtobufFactory.createPlaceOrder(order);
  // const message: Command = ProtobufFactory.createSubscribe(tradingPair);
  webSocketSubject.next(message.serializeBinary());

  const orderbookStream = getStream(webSocketListener, message.getClientmessageid());
  const promise = new Promise<PlaceOrderResponse.AsObject | undefined>((resolve, reject) => {
    orderbookStream.forEach((event: Event) => {
      const commandResponse = event.toObject().response;
      if (commandResponse?.commandfailed) {
        reject(Error(commandResponse?.commandfailed.reason));
      } else {
        resolve(commandResponse?.placeorderresponse);
      }
    });
  });
  return promise;
}
