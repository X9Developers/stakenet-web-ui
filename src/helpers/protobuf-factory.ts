import { BigInteger, Order, OrderDetails, SendingSideMap } from '../models/protos/models_pb';
import { Command } from '../models/protos/api_pb';
import * as Commands from '../models/protos/commands_pb';
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

  createTrade: (clientAmount: BigInteger, clientCurrency: string, poolAmount: BigInteger, poolCurrency: string, fee: BigInteger, transferId: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.TradeCommand();
    message.setClientamount(clientAmount);
    message.setClientcurrency(clientCurrency);
    message.setPoolamount(poolAmount);
    message.setPoolcurrency(poolCurrency);
    message.setFee(fee);
    message.setTransferid(transferId)
    command.setTradecommand(message);
    return command;
  },

  createConfirmTrade: (tradeId: string, transferId: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.ConfirmTrade();
    message.setTradeid(tradeId);
    message.setTransferid(transferId);
    command.setConfirmtrade(message);
    return command;
  },



  newOrder: (
    tradingpair: string,
    type: Order.OrderTypeMap[keyof Order.OrderTypeMap],
    side: Order.OrderSideMap[keyof Order.OrderSideMap],
    details?: OrderDetails): Order => {

    const order = new Order();
    order.setTradingpair(tradingpair);
    order.setType(type);
    order.setSide(side);
    order.setDetails(details);

    return order;
  },



  newOrderDetails: (funds?: string, price?: string, orderid?: string): OrderDetails => {
    const orderdetails = new OrderDetails();
    orderdetails.setFunds(newBigInteger(funds!));
    if (price !== '') {
      orderdetails.setPrice(newBigInteger(price!));
    }

    if (orderid) {
      orderdetails.setOrderid(orderid);
    }
    return orderdetails;
  },




  createGetOpenOrders: (tradindPair: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const type = new Commands.GetOpenOrdersCommand();
    type.setTradingpair(tradindPair);
    command.setGetopenorders(type);
    return command;
  },

  createPlaceOrder: (order: Order): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.PlaceOrderCommand();
    message.setOrder(order);
    command.setPlaceorder(message);
    return command;
  },

  createCancelOpenOrder: (orderid: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.CancelOpenOrderCommand();
    message.setOrderid(orderid);
    command.setCancelorder(message);
    return command;
  },

  createSendMessage: (orderMessage: string, orderid: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.SendOrderMessageCommand();
    message.setMessage(orderMessage);
    message.setOrderid(orderid);
    command.setSendordermessage(message);
    return command;
  },

  createSubscribe: (tradindPair: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.SubscribeCommand();
    message.setTradingpair(tradindPair);
    message.setRetrieveorderssummary(true);
    command.setSubscribe(message);
    return command;
  },

  createUnsubscribe: (tradindPair: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.UnsubscribeCommand();
    message.setTradingpair(tradindPair);
    command.setUnsubscribe(message);
    return command;
  },

  createGetHistoricTrades: (tradindPair: string): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.GetHistoricTradesCommand();
    message.setTradingpair(tradindPair);
    message.setLimit(30);
    command.setGethistorictrades(message);
    return command;
  },

  createGetBarsPrices: (tradindPair: string, resolution: string, from: number, to: number, limit: number): Command => {
    const command = new Command();
    command.setClientmessageid(Uuid.from());
    const message = new Commands.GetBarsPricesCommand();
    message.setTradingpair(tradindPair);
    message.setResolution(resolution);
    message.setFrom(from);
    message.setTo(to);
    message.setLimit(limit);
    command.setGetbarsprices(message);
    return command;
  },


};

