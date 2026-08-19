import { NextResponse } from 'next/server';

export class HttpError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
  }
}

export function jsonSuccess(statusCode, data, message = 'Success') {
  return NextResponse.json({ statusCode, success: statusCode < 400, message, data }, { status: statusCode });
}

export function jsonError(error) {
  const statusCode = error?.statusCode || 500;
  return NextResponse.json(
    { statusCode, success: false, message: error?.message || 'Something went wrong', errors: error?.errors || [] },
    { status: statusCode }
  );
}

export async function parseJson(request, limit = 10_240) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && Number(contentLength) > limit) throw new HttpError(413, 'Request body too large');
  try { return await request.json(); } catch { throw new HttpError(400, 'Invalid JSON body'); }
}

export function sanitize(value) {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue;
      result[key] = sanitize(val);
    }
    return result;
  }
  return value;
}

export function getSearchParams(request) {
  const obj = {};
  for (const [key, value] of request.nextUrl.searchParams.entries()) obj[key] = value;
  return sanitize(obj);
}
