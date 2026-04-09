import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

type LocalApiResponseBody = string | Buffer | Record<string, unknown>;
type LocalApiResponse = ServerResponse & {
  status: (statusCode: number) => LocalApiResponse;
  json: (jsonBody: unknown) => LocalApiResponse;
  send: (responseBody: LocalApiResponseBody) => LocalApiResponse;
};
type LocalApiRequest = IncomingMessage & {
  query: Record<string, string>;
};
type WebApiHandler = (request: Request) => Response | Promise<Response>;
type NodeApiHandler = (
  requestObject: LocalApiRequest,
  responseObject: LocalApiResponse,
) => void | Promise<void>;
type ApiHandlerModule = {
  default: WebApiHandler | NodeApiHandler;
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
            const handlerModule = await loadHandlerModule();
            const apiHandler = handlerModule.default;
            if (isNodeApiHandler(apiHandler)) {
              const localApiRequest = Object.assign(incomingRequest, {
                query: Object.fromEntries(requestUrl.searchParams.entries()),
              }) as LocalApiRequest;
              const localApiResponse = createLocalApiResponse(serverResponse);
              await apiHandler(localApiRequest, localApiResponse);
              return;
            }

            const webRequest = await incomingMessageToWebRequest(
              incomingRequest,
              requestUrl.href,
            );
            const webResponse = await apiHandler(webRequest);
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

function createLocalApiResponse(serverResponse: ServerResponse): LocalApiResponse {
  const responseObject = serverResponse as LocalApiResponse;
  responseObject.status = (statusCode: number): LocalApiResponse => {
    responseObject.statusCode = statusCode;
    return responseObject;
  };
  responseObject.json = (jsonBody: unknown): LocalApiResponse => {
    responseObject.setHeader("content-type", "application/json; charset=utf-8");
    responseObject.end(JSON.stringify(jsonBody));
    return responseObject;
  };
  responseObject.send = (responseBody: LocalApiResponseBody): LocalApiResponse => {
    if (typeof responseBody === "string" || Buffer.isBuffer(responseBody)) {
      responseObject.end(responseBody);
    } else {
      responseObject.setHeader("content-type", "application/json; charset=utf-8");
      responseObject.end(JSON.stringify(responseBody));
    }
    return responseObject;
  };
  return responseObject;
}

function isNodeApiHandler(handler: WebApiHandler | NodeApiHandler): handler is NodeApiHandler {
  return handler.length >= 2;
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
