import { encode } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const now = Math.floor(Date.now() / 1000);

    // Create a mock JWT token for dev user that matches NextAuth expectations
    const token = await encode({
      token: {
        sub: '1',
        id: '1',
        name: 'Dev User',
        email: 'dev@xionco.local',
        picture: null,
        iat: now,
        exp: now + 24 * 60 * 60, // 24 hours
        jti: 'dev-session-' + now,
      },
      secret: process.env.NEXTAUTH_SECRET || 'default-secret',
    });

    const response = NextResponse.json({ message: 'Dev login successful', ok: true });

    // Set the session token cookie
    response.cookies.set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Dev login error:', error);
    return NextResponse.json(
      { error: 'Dev login failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
