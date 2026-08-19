import dbConnect from '@/lib/db';
import User from '@/models/User.model';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { sanitizeUser } from '@/lib/api';
import { HttpError, jsonError, jsonSuccess, parseJson, sanitize } from '@/utils/http';

const windowMs = 15 * 60 * 1000;
const limit = 20;
const buckets = globalThis.__authRateLimit ??= new Map();
function rateLimit(request) { const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'; const now = Date.now(); const b = buckets.get(`register:${key}`); if (!b || now - b.start >= windowMs) buckets.set(`register:${key}`, { start: now, count: 1 }); else if (b.count >= limit) throw new HttpError(429, 'Too many attempts, please try again later.'); else b.count += 1; }
export async function POST(request) { try { rateLimit(request); await dbConnect(); const body = sanitize(await parseJson(request)); const { name, email, password } = body; const existing = await User.findOne({ email }); if (existing) throw new HttpError(409, 'An account with this email already exists'); const user = await User.create({ name, email, password }); const accessToken = signAccessToken({ id: user._id, role: user.role }); const refreshToken = signRefreshToken({ id: user._id }); user.refreshToken = refreshToken; await user.save({ validateBeforeSave: false }); const response = jsonSuccess(201, sanitizeUser(user), 'Registered successfully'); setAuthCookies(response, accessToken, refreshToken); return response; } catch (error) { return jsonError(error); } }
