"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = __importDefault(require("socket.io"));
const books = __importStar(require("./lib/books"));
const routes_1 = __importDefault(require("./routes"));
const port = process.env.PORT || 8080;
const app = express_1.default();
app.use(cors_1.default());
app.use(routes_1.default);
const server = http_1.default.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));
const io = socket_io_1.default(server);
const pollAndEmit = (socket) => {
    const market = socket.handshake.query.market;
    const orders = books.getOrders(market);
    socket.emit('orders', orders);
};
let interval;
io.on('connection', (socket) => {
    console.log('New client connected');
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => pollAndEmit(socket), 500);
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
//# sourceMappingURL=index.js.map