import type { Server as HttpServer } from 'http';

import { Server as SocketIOServer } from 'socket.io';

import { UnauthorizedError } from '@/helpers/error';
import { env } from '@/libs/env';
import { log } from '@/libs/logger';
import { JWTService } from '@/services/jwt.service';

export class SocketServer {
  readonly client = new SocketIOServer();
  private readonly auth = new JWTService();

  connect(server: HttpServer) {
    this.client.attach(server, {
      cors: { origin: env.ORIGIN },
      maxHttpBufferSize: 1e6,
    });

    this.client.use((socket, next) => {
      const token = socket.handshake.auth['token'] ?? socket.handshake.query['token'];
      if (!token) return next(new UnauthorizedError());

      try {
        const payload = this.auth.verifyAccessToken(token);
        socket.data.id = payload.sub;
        socket.data.level = payload.level;
        next();
      } catch {
        next(new UnauthorizedError('Invalid or expired token'));
      }
    });

    this.client.on('connection', (socket) => {
      const id = socket.data.id;

      socket.join(id);
      log.info('[ws] connected with id %s', id);

      socket.on('disconnect', (reason) => {
        log.info('[ws] disconnected with id %s (%s)', id, reason);
      });
    });

    log.info('[ws] server created');
  }

  async disconnect(): Promise<void> {
    this.client.close();
    log.info('[ws] server closed');
  }

  healthcheck(): boolean {
    return this.client.engine?.clientsCount > 0;
  }
}

export const socket = new SocketServer();
