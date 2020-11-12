import fetch from 'node-fetch';
import { Exchange } from '../types';

const requestAsync = (exchange: Exchange) => {
  return new Promise((resolve, reject) => {
    fetch(exchange.url)
      .then((response) => response.text())
      .then((body) => {
        return resolve(
          Object.assign(JSON.parse(body), { name: exchange.name }),
        );
      })
      .catch((err) => {
        if (err) {
          return reject(err);
        }
      });
  });
};

export { requestAsync };
