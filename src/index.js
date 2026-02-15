import express from "express";
import { matchRouter } from "./routes/matches.js";
import http from 'http';
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const server = http.createServer(app);
 
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

// JSON middleware
app.use(express.json());

// Root GET route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Sports API!" });
});

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

// Start server
server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(`Websocket Server is running on ${baseUrl.replace('http', 'ws')}/ws`); 
});
