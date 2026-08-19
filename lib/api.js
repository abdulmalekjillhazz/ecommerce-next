import User from '@/models/User.model';
import { verifyAccessToken, verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth';
import { HttpError } from '@/utils/http';

export const sanitizeUser = (user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });

export async function requireUser(request) {
  const token = request.cookies.get('accessToken')?.value;
  if (!token) throw new HttpError(401, 'Not authenticated. Please log in.');
  let decoded;
  try { decoded = verifyAccessToken(token); } catch { throw new HttpError(401, 'Session expired. Please refresh your token or log in again.'); }
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new HttpError(401, 'User no longer exists or is deactivated.');
  return user;
}

export function requireRole(user, ...roles) {
  if (!user || !roles.includes(user.role)) throw new HttpError(403, 'You do not have permission to perform this action.');
}

export async function refreshFromCookie(request) {
  const token = request.cookies.get('refreshToken')?.value;
  if (!token) throw new HttpError(401, 'No refresh token provided');
  let decoded;
  try { decoded = verifyRefreshToken(token); } catch { throw new HttpError(401, 'Invalid or expired refresh token'); }
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new HttpError(401, 'Refresh token is invalid, please log in again');
  const newAccessToken = signAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = signRefreshToken({ id: user._id });
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });
  return { user, newAccessToken, newRefreshToken };
}
