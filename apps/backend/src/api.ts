// server.ts
import { backfillUserIfNecessary, deleteAllByUser, getAuthorDids, getLatestTimestamp, getMostRecentRecords, getRecentRecordsByItemRef, getRecentRecordsByUser, getRecord } from './database';

// Define your API routes and handlers
export const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    
    if (method === "GET") {
        if (path === "/api/latest-timestamp") {
          const timestamp = getLatestTimestamp();
          return new Response(JSON.stringify({ latest_timestamp: timestamp }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
    
        if (path === "/api/most-recent-records") {
          const limit = parseInt(url.searchParams.get("limit") ?? "50");
          const cursor = url.searchParams.get("cursor");
          const records = getMostRecentRecords(limit, cursor);
          return new Response(JSON.stringify(records), { status: 200, headers: { "Content-Type": "application/json" } });
        }
    
        if (path === "/api/recent-records-by-user") {
          const user_did = url.searchParams.get("did");

          const limit = parseInt(url.searchParams.get("limit") ?? "50");
          const cursor = url.searchParams.get("cursor");
          if (!user_did) {
            return new Response(JSON.stringify({ error: "did is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
          }
          let records = getRecentRecordsByUser(user_did, limit, cursor);

          if(records.length === 0) {
            await backfillUserIfNecessary(user_did);
            records = getRecentRecordsByUser(user_did, limit, cursor);
          }

          return new Response(JSON.stringify(records), { status: 200, headers: { "Content-Type": "application/json" } });
        }
    
        if (path === "/api/recent-records-by-item") {
          const item_ref = url.searchParams.get("ref");
          const item_value = url.searchParams.get("value");
          const limit = parseInt(url.searchParams.get("limit") ?? "50");
          const cursor = url.searchParams.get("cursor");
          if (!item_ref || !item_value) {
            return new Response(JSON.stringify({ error: "item_ref and item_value are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
          }
          const records = getRecentRecordsByItemRef(item_ref, item_value, limit, cursor);
          return new Response(JSON.stringify(records), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if(path === "/api/record") {
          const uri = url.searchParams.get("uri");
          if (!uri) {
            return new Response(JSON.stringify({ error: "uri is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
          }
          const record = getRecord(uri);
          return new Response(JSON.stringify(record), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if(path === "/api/author-dids") {
          const author_dids = getAuthorDids();
          return new Response(JSON.stringify(author_dids), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        if(path === "/api/refresh-user") {
          const did = url.searchParams.get("did");
          if (!did) {
            return new Response(JSON.stringify({ error: "did is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
          }
          deleteAllByUser(did);
          await backfillUserIfNecessary(did);
          return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
        }
      }

    // Handle 404 Not Found
    return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: { "Content-Type": "application/json" } });
};
