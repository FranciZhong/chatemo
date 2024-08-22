import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { PageUrl } from './app/constants';

export default async function middleware(req: NextRequest) {
	const token = await getToken({ req });

	// avoid infinitly fetching auth api
	if (!token && !req.nextUrl.pathname.startsWith('/api/auth')) {
		// todo log
		return NextResponse.redirect(new URL(PageUrl.LOGIN, req.url));
	}

	return NextResponse.next();
}

// todo why cannot use `${PageUrl.CHAT}(.*)`
// console.log(`${PageUrl.CHAT}(.*)` === '/chat(.*)'); => true

export const config = {
	matcher: ['/chat(.*)', '/api(.*)'],
};
