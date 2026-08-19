import dbConnect from '@/lib/db'; import { requireUser, sanitizeUser } from '@/lib/api'; import { jsonError, jsonSuccess } from '@/utils/http';
export async function GET(request) { try { await dbConnect(); const user = await requireUser(request); return jsonSuccess(200, sanitizeUser(user)); } catch (error) { return jsonError(error); } }
