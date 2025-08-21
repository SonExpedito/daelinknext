import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const uid = body.uid;

    const response = NextResponse.json({ message: 'Cookie definido com sucesso!' });
    response.cookies.set('tokenId', uid, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 3600, // segundos
        path: '/',
    });

    return response;
}
