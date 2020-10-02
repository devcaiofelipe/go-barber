import * as Tracing from "@sentry/tracing";
import * as Sentry from "@sentry/node";

export default {
  dsn: "https://e7aa8f1d48b7416b8b09711b2d3b04cb@o456213.ingest.sentry.io/5448953",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app: this.server }),
  ],
}