
import { Command, Event } from '../../models/protos/api_pb';
import { first } from 'rxjs/operators';
import { ProtobufFactory } from './helper/protobuf-factory';
import { CalculateTradeResponse, GetTradingPairsResponse, TradeResponse } from '../../models/protos/commands_pb';
import { Subject } from 'rxjs';
import { BigInteger, SendingSideMap } from '../../models/protos/models_pb';

import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';

const getStream = (webSocketListener: Subject<Event>, commandId: string) => {
  return webSocketListener
    .pipe(first(event => event.hasResponse() && event?.getResponse()?.getClientmessageid() === commandId));
}



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

export const getTradingPairs = (webSocketSubject: WebSocketSubject<Uint8Array>, webSocketListener: Subject<Event>) => {

  const message: Command = ProtobufFactory.getTradingPairs();
  webSocketSubject.next(message.serializeBinary());


  const streamVal = getStream(webSocketListener, message.getClientmessageid())
  console.log(getStream(webSocketListener, message.getClientmessageid()))

  const promise = new Promise<GetTradingPairsResponse.AsObject | undefined>((resolve, reject) => {
    streamVal.forEach((event: Event) => {
      const commandResponse = event.toObject().response;
      if (commandResponse?.commandfailed) {
        reject(Error(commandResponse?.commandfailed.reason));
      } else {
        resolve(commandResponse?.gettradingpairsresponse);
      }
    });
  });
  return promise;
}


export const createCalculateTrade = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>,
  tradindPair: string,
  currency: string,
  amount: string,
  sendingSide: SendingSideMap[keyof SendingSideMap]) => {

  const message: Command = ProtobufFactory.createCalculateTrade(tradindPair, currency, amount, sendingSide);
  webSocketSubject.next(message.serializeBinary());


  const streamVal = getStream(webSocketListener, message.getClientmessageid())

  const promise = new Promise<CalculateTradeResponse.AsObject | undefined>((resolve, reject) => {
    streamVal.forEach((event: Event) => {
      const commandResponse = event.toObject().response;
      if (commandResponse?.commandfailed) {
        reject(Error(commandResponse?.commandfailed.reason));
      } else {
        resolve(commandResponse?.calculatetraderesponse);
      }
    });
  });
  return promise;
}

export const createTrade = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>,
  clientAmount: BigInteger,
  clientCurrency: string,
  poolAmount: BigInteger,
  poolCurrency: string,
  price: BigInteger) => {

  const message: Command = ProtobufFactory.createTrade(clientAmount, clientCurrency, poolAmount, poolCurrency, price);
  webSocketSubject.next(message.serializeBinary());


  const streamVal = getStream(webSocketListener, message.getClientmessageid())
  console.log(getStream(webSocketListener, message.getClientmessageid()))

  const promise = new Promise<TradeResponse.AsObject | undefined>((resolve, reject) => {
    streamVal.forEach((event: Event) => {
      const commandResponse = event.toObject().response;
      if (commandResponse?.commandfailed) {
        reject(Error(commandResponse?.commandfailed.reason));
      } else {
        resolve(commandResponse?.traderesponse);
      }
    });
  });
  return promise;
}
