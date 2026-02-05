/**
 * CORS debug endpoint - visit /api/cors-check to see Origin and whether it would be allowed.
 * Use this when chat/discover fail with CORS errors.
 */
export async function GET(request) {
  const origin = request.headers.get('origin') || '(none - same-origin request)';
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_WWW,
    process.env.FRONTEND_URL_ALT,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);

  let allowed = allowedOrigins.includes(origin);
  if (!allowed && origin !== '(none - same-origin request)') {
    try {
      const hostname = new URL(origin).hostname;
      allowed =
        hostname === 'vercel.app' || hostname.endsWith('.vercel.app') ||
        hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.localhost') ||
        hostname === 'birdieapp.co' || hostname.endsWith('.birdieapp.co') ||
        allowedOrigins.some((url) => {
          try { return new URL(url).hostname === hostname; } catch { return false; }
        });
    } catch {
      allowed = false;
    }
  } else if (origin === '(none - same-origin request)') {
    allowed = true;
  }

  return new Response(
    JSON.stringify({ origin, allowed, allowedOrigins }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
