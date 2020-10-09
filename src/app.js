import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import routes from './routes.js';
import Youch from 'youch';
import helmet from 'helmet';
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';
import path from 'path';
import * as Sentry from "@sentry/node";
import sentryConfig from './config/sentry';
import './database';


class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  };

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(Sentry.Handlers.tracingHandler());
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
    
    if(process.env.NODE_ENV !== 'development') {
      this.server.use(new RateLimit({
        store: new RateLimitRedis({
          client: redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
          }),
        }),
        windowMs: 1000 * 60 * 15,
        max: 5,
      }));
    };
  };

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  };

  exceptionHandler() {
    this.server.use(async(error, req, res, next) => {
      if(process.env.NODE_ENV === 'development') {
        const errors = await new Youch(error, req).toJSON();
        return res.status(500).json(errors);
      };
      
      return res.status(500).json({ error: 'Internal server error' });
    })
  };
};


export default new App().server;