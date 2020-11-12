import express from "express";
import http from "http";
import * as path from "path";
import cors from "cors";
import socketIo from "socket.io";
import * as books from "./lib/books";
import mainRoute from "./routes";
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(mainRoute);

app.use(express.static(path.join(__dirname, "../build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));

const io = socketIo(server);

const pollAndEmit = (socket: socketIo.Socket) => {
  const market: string = socket.handshake.query.market;
  const orders = books.getOrders(market);

  socket.emit("orders", orders);
};

let interval: any;
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => pollAndEmit(socket), 500);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
