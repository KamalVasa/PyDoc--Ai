import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = logging.getLogger("app.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for structured request and response logging with timing."""

    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        client_host = request.client.host if request.client else "unknown"

        logger.info(f"--> {request.method} {request.url.path} from {client_host}")

        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000
            logger.info(
                f"<-- {request.method} {request.url.path} - Status {response.status_code} in {process_time:.2f}ms"
            )
            response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
            return response
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"<-- EXCEPTION {request.method} {request.url.path} after {process_time:.2f}ms: {str(e)}"
            )
            raise
