import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const preferredPort = Number(process.env.PORT ?? 8082);

const startServer = (port: number) => {
  const httpServer = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running. Use ws://localhost:' + port + ' to connect.');
  });

  const wss = new WebSocketServer({ server: httpServer });

  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`WebSocket server running on ws://localhost:${port}`);
  });

  httpServer.on('error', (error: Error & { code?: string }) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is busy. Please close the process using it or set PORT to another value.`);
      process.exit(1);
      return;
    }

    console.error('HTTP server error:', error);
    process.exit(1);
  });

  wss.on('connection', (socket: WebSocket) => {
    console.log('Client connected');
    socket.send('WebSocket server is running.');

    socket.on('message', (data) => {
      const message = data.toString();
      console.log('Received:', message);

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Server: ${message}`);
        }
      });
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

startServer(preferredPort);