interface IErrorWithStatus {
  status: number;
}

interface IErrorWithCause {
  cause?: unknown;
}

interface IErrorWithStatusText {
  statusText?: string;
}

interface ITrpcErrorData {
  code?: string;
}

interface IErrorWithData {
  data?: ITrpcErrorData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasNumberStatus(value: unknown): value is IErrorWithStatus {
  return isRecord(value) && typeof value.status === "number";
}

function hasStatusText(value: unknown): value is IErrorWithStatusText {
  return (
    isRecord(value) &&
    (value.statusText === undefined || typeof value.statusText === "string")
  );
}

function hasErrorData(value: unknown): value is IErrorWithData {
  return isRecord(value) && (value.data === undefined || isRecord(value.data));
}

function hasCause(value: unknown): value is IErrorWithCause {
  return isRecord(value) && "cause" in value;
}

function readResponse(value: Record<string, unknown>): unknown {
  return value.response;
}

// Extract HTTP status from various error shapes (with cycle guard)
export function getErrorStatus(
  error: unknown,
  seen = new WeakSet<object>(),
): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  if (seen.has(error)) {
    return undefined;
  }

  seen.add(error);

  if (hasNumberStatus(error)) {
    return error.status;
  }

  const response = readResponse(error);
  if (hasNumberStatus(response)) {
    return response.status;
  }

  if (hasCause(error)) {
    return getErrorStatus(error.cause, seen);
  }

  return undefined;
}

export function isUnauthenticatedError(error: unknown): boolean {
  if (hasErrorData(error) && error.data?.code === "UNAUTHORIZED") {
    return true;
  }

  return getErrorStatus(error) === 401;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (hasStatusText(error) && error.statusText) {
    return error.statusText;
  }

  return "An unexpected error occurred";
}
