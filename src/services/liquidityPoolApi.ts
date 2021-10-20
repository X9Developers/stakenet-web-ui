
import { Command, Event } from '../models/protos/api_pb';
import { first } from 'rxjs/operators';
import { ProtobufFactory } from '../helpers/protobuf-factory';
import { CalculateTradeResponse, ConfirmTradeResponse, GetTradingPairsResponse, SubscribeResponse, TradeResponse, GetHistoricTradesResponse } from '../models/protos/commands_pb';
import { Subject } from 'rxjs';
import { BigInteger, SendingSideMap } from '../models/protos/models_pb';

import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { TradeCompleted } from 'models/protos/events_pb';

const getStream = (webSocketListener: Subject<Event>, commandId: string) => {
  return webSocketListener
    .pipe(first(event => event.hasResponse() && event?.getResponse()?.getClientmessageid() === commandId));
}

const getStreamUntrusted = (webSocketListener: Subject<Event>) => {
  return webSocketListener
    .pipe(first(event => event.hasResponse()));
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
  fee: BigInteger,
  transferId: string) => {
  const obj = {
    clientAmount,
    clientCurrency,
    poolAmount,
    poolCurrency,
    fee
  }
  console.log('create trade', obj)
  console.log('create trade', obj)
  console.log('create trade', obj)
  const message: Command = ProtobufFactory.createTrade(clientAmount, clientCurrency, poolAmount, poolCurrency, fee, transferId);
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


export const createConfirmTrade = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>,
  tradeId: string,
  transferId: string) => {

  const message: Command = ProtobufFactory.createConfirmTrade(tradeId, transferId);
  webSocketSubject.next(message.serializeBinary());


  const streamVal = getStream(webSocketListener, message.getClientmessageid())
  console.log(getStream(webSocketListener, message.getClientmessageid()))

  const promise = new Promise<ConfirmTradeResponse.AsObject | undefined>((resolve, reject) => {
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




export const awaitForTradeCompleted = (
  webSocketSubject: WebSocketSubject<Uint8Array>,
  webSocketListener: Subject<Event>) => {

  const streamVal = getStreamUntrusted(webSocketListener)

  const promise = new Promise<TradeCompleted.AsObject | undefined>((resolve, reject) => {
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


// public subscribe(tradingPair: string): Promise<SubscribeResponse.AsObject> {
//   const message: Command = ProtobufFactory.createSubscribe(tradingPair);
//   this.orderbookService.send(message);

//   const orderbookStream = this.getStream(message.getClientmessageid());
//   const promise = new Promise<SubscribeResponse.AsObject>((resolve, reject) => {
//     orderbookStream.forEach((event: Event) => {
//       const commandResponse = event.toObject().response;
//       if (commandResponse.commandfailed) {
//         reject(Error(commandResponse.commandfailed.reason));
//         this.notificationService.error(commandResponse.commandfailed.reason);
//       } else {
//         resolve(commandResponse.subscriberesponse);
//       }
//     });
//   });

//   return promiseTimeout(promise);
// }

