"server only"
import { authAdmin } from "@/firebaseAdminConfig";

export async function verifyTokenServer(request = null) {
  //"server only"
  try {
    const TOKENS_APP = [process.env.BEARER_TOKEN_DASHBOARD];
    if (TOKENS_APP.length === 0) {
      return { is_verified: false, status: 401, statusText: 'The tokens permission array is empty' };
    }
    const appToken =
      request.headers.get("App-Token") ||
      request.headers.get("app-Token") ||
      request.headers.get("App-token") ||
      request.headers.get("app-token") ||
      "";
    const match = appToken.match(/^Bearer\s+(.+)$/i);
    const idAppToken = match?.[1] || null;
    if (!idAppToken) {
      return { is_verified: false, status: 401, statusText: 'Your App Token is missing' };
    }
    if (!TOKENS_APP.includes(idAppToken)) {
      return { is_verified: false, status: 401, statusText: 'Your App Token is unauthorized' };
    }
    const authHeader =
      request.headers.get("authorization") ||
      request.headers.get("Authorization") ||
      "";
    const matchAuth = authHeader.match(/^Bearer\s+(.+)$/i);
    const idAuthToken = matchAuth?.[1] || null;
    if (!idAuthToken) {
      return { is_verified: false, status: 401, statusText: 'Your Auth Token is missing' };
    }
    try{
      await authAdmin.verifyIdToken(idAuthToken, true);
    }catch(_) {
      return { is_verified: false, status: 401, statusText: 'Your Auth Token is unauthorized' };
    }
    return { is_verified: true, status: 200, statusText: 'Token is verified' };
  } catch (_error) {
    return { is_verified: false, status: 401, statusText: 'Your Token is unauthorized' };
  }
}