// app.ts
import { serve } from 'bun';
import { handler } from './api';
import { startJetstream } from './jetstream';

(async function main() {
    startJetstream();

    // Start the API server
    serve({
        fetch: handler,
        port: 3001,
        hostname: "0.0.0.0",
    });
})();