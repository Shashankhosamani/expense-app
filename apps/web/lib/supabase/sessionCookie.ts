// How long a signed-in session survives without the user coming back — shared
// by the browser client, server client, and proxy so the cookie's actual
// lifetime always matches what each of them thinks it set.
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
