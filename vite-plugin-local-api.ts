import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

type ApiHandlerModule = {
  default: (request: Request) => Response | Promise<Response>;
};

const apiRouteLoaders: Record<string, () => Promise<ApiHandlerModule>> = {
  "/api/health": () => import("./api/health.ts"),
  "/api/lineup-count": () => import("./api/lineup-count.ts"),
  "/api/artist-suggestions": () => import("./api/artist-suggestions.ts"),
};

export function dreamfloorLocalApiPlugin(): Plugin {
  return {
    name: "dreamfloor-local-api",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(
        async (
          incomingRequest: IncomingMessage,
          serverResponse: ServerResponse,
          next: () => void,
        ) => {
          const requestUrlString = incomingRequest.url ?? "/";
          if (!requestUrlString.startsWith("/api")) {
            next();
            return;
          }

          const requestUrl = new URL(
            requestUrlString,
            `http://${incomingRequest.headers.host ?? "localhost"}`,
          );
          const pathname = requestUrl.pathname;

          const loadHandlerModule = apiRouteLoaders[pathname];
          if (!loadHandlerModule) {
            serverResponse.statusCode = 404;
            serverResponse.setHeader("content-type", "application/json; charset=utf-8");
            serverResponse.end(JSON.stringify({ error: "Unknown API route." }));
            return;
          }

          try {
            const webRequest = await incomingMessageToWebRequest(
              incomingRequest,
              requestUrl.href,
            );
            const handlerModule = await loadHandlerModule();
            const webResponse = await handlerModule.default(webRequest);
            await sendNodeResponseFromWebResponse(serverResponse, webResponse);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            serverResponse.statusCode = 500;
            serverResponse.setHeader("content-type", "application/json; charset=utf-8");
            serverResponse.end(JSON.stringify({ error: message }));
          }
        },
      );
    },
  };
}

async function incomingMessageToWebRequest(
  incomingRequest: IncomingMessage,
  fullRequestUrl: string,
): Promise<Request> {
  const method = incomingRequest.method ?? "GET";
  if (method === "GET" || method === "HEAD") {
    return new Request(fullRequestUrl, {
      method,
      headers: incomingRequest.headers as Record<string, string>,
    });
  }

  const requestBodyBuffer = await readIncomingMessageBody(incomingRequest);
  return new Request(fullRequestUrl, {
    method,
    headers: incomingRequest.headers as Record<string, string>,
    body: requestBodyBuffer.length > 0 ? requestBodyBuffer : undefined,
  });
}

async function readIncomingMessageBody(
  incomingRequest: IncomingMessage,
): Promise<Buffer> {
  const bodyChunks: Buffer[] = [];
  for await (const chunk of incomingRequest) {
    bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(bodyChunks);
}

async function sendNodeResponseFromWebResponse(
  serverResponse: ServerResponse,
  webResponse: Response,
): Promise<void> {
  serverResponse.statusCode = webResponse.status;
  webResponse.headers.forEach((headerValue, headerName) => {
    serverResponse.setHeader(headerName, headerValue);
  });
  const responseBodyBuffer = Buffer.from(await webResponse.arrayBuffer());
  serverResponse.end(responseBodyBuffer);
}
