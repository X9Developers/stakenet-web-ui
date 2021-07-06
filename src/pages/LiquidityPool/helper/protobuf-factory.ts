import { BigInteger, SendingSideMap } from '../../../models/protos/models_pb';
import { Command } from '../../../models/protos/api_pb';
import * as Commands from '../../../models/protos/commands_pb';
import { Uuid } from './Uuid';

export const newBigInteger = (value: string): BigInteger => {
  const bigInteger = new BigInteger();
  bigInteger.setValue(value);
  return bigInteger;
};

export const ProtobufFactory = {

  createPing: () => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const type = new Commands.PingCommand();
    command.setPing(type);
    return command;
  },

  getTradingPairs: () => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const type = new Commands.GetTradingPairsCommand();
    command.setGettradingpairs(type);
    return command;
  },

  createCalculateTrade: (tradindPair: string, currency: string, amount: string, sendingSide: SendingSideMap[keyof SendingSideMap]): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.CalculateTradeCommand();
    message.setTradingpair(tradindPair);
    message.setCurrency(currency);
    message.setAmount(newBigInteger(amount));
    message.setSide(sendingSide);
    command.setCalculatetradecommand(message);
    return command;
  },

  createTrade: (clientAmount: BigInteger, clientCurrency: string, poolAmount: BigInteger, poolCurrency: string, price: BigInteger): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.TradeCommand();
    message.setClientamount(clientAmount);
    message.setClientcurrency(clientCurrency);
    message.setPoolamount(poolAmount);
    message.setPoolcurrency(poolCurrency);
    message.setPrice(price);
    command.setTradecommand(message);
    return command;
  }
};
