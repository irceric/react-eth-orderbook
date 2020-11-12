"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestAsync = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const requestAsync = (exchange) => {
    return new Promise((resolve, reject) => {
        node_fetch_1.default(exchange.url)
            .then((response) => response.text())
            .then((body) => {
            return resolve(Object.assign(JSON.parse(body), { name: exchange.name }));
        })
            .catch((err) => {
            if (err) {
                return reject(err);
            }
        });
    });
};
exports.requestAsync = requestAsync;
//# sourceMappingURL=requests.js.map