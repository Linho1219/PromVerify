import * as express from "express";

declare global {
  namespace Express {
    interface Application {
      ws: (route: string, callback: (ws: WebSocket, req: express.Request) => void) => void;
    }
  }
}