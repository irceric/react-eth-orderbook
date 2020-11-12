"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
const port = 8080;
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const parsePoloniexData = (data) => {
    const { asks = [], bids = [] } = data;
    return {
        asks: asks.map((ask) => ({ quantity: parseFloat(ask[0]), rate: ask[1] })),
        bids: bids.map((bid) => ({ quantity: parseFloat(bid[0]), rate: bid[1] })),
    };
};
const parseBittrexData = (data) => {
    const { ask: asks = [], bid: bids = [] } = data;
    return {
        asks: asks.map((ask) => ({ quantity: parseFloat(ask.quantity), rate: parseFloat(ask.rate) })),
        bids: bids.map((bid) => ({ quantity: parseFloat(bid.quantity), rate: parseFloat(bid.rate) })),
    };
};
app.get("/order_book", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const marketSymbol = req.query.market_symbol;
        const [from, to] = marketSymbol.split('_').reverse();
        const bittrexSymbol = `${from}-${to}`;
        const poloniexRawData = yield node_fetch_1.default(`https://poloniex.com/public?command=returnOrderBook&currencyPair=${marketSymbol}&depth=100`)
            .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(response => response);
        const poloniexParsedData = parsePoloniexData(poloniexRawData);
        const bittrexRawData = yield node_fetch_1.default(`https://api.bittrex.com/v3/markets/${bittrexSymbol}/orderbook?depth=500`)
            .then(response => response.json())
            .then(response => response);
        const bittrexParsedData = parseBittrexData(bittrexRawData);
        // const bittrexData = {
        // 	asks: [] as NormalizedOrder[],
        // 	bids: [] as NormalizedOrder[],
        // };
        res.json({
            poloniex: poloniexParsedData,
            bittrex: bittrexParsedData,
        });
    }
    catch (error) {
        next(error);
    }
}));
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=old-server.js.map