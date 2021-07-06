# Stakenet Web Dex Interface

The open source interface of the Stakenet Web Dex -- a Layer 2 dex built on the stakenet masternode network of connext routers.
This project is currently in development, and is subject to frequent breaking changes.
The web dex should not be used to execute trades yet, this readme will be updated when that status changes.

- Website: [stakenet.io](https://stakenet.io/)
- Interface: [stakenet.app](https://stakenet.app)
- Twitter: [@XSNofficial](https://twitter.com/XSNofficial)
- Email: [contact@stakenet.io](mailto:contact@stakenet.io)
- Discord: [Stakenet](https://discord.gg/8a6gFVDTNA)
- Telegram: [Stakenet (XSN) English](https://t.me/joinchat/BdGxxw-s3b4_DdBdbChI4g)
- Whitepaper: [Link](https://stakenet.io/Stakenet_Whitepaper.pdf)

## Accessing the Stakenet Web Dex

Visit [stakenet.app](https://stakenet.app).

## Listing a token

The Stakenet WebApp is currently hooked into the uniswap token list. Please see the
[@uniswap/default-token-list](https://github.com/uniswap/default-token-list) 
repository.

### Install Dependencies

```bash
yarn
```
## Protobuf Information 

To generate the protobuf models you must Run `./generate-protos.sh`

### Run

```bash
yarn start
```