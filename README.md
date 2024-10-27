# Next Starter Pack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).
This is my personal starter pack for new SSR projects. It's not really built as a boilerplate or starting point for anyone else, but feel free to use it if you'd like.

## Why Next? Why Page Router?
I personally like to build highlyinteractive applications. Which means I want as much CSR as possible. However, I there are some great benefits to SSR that it's often useful to take advantage of.
Next, and pages router in particular, gives me the best balance of being to write lots of CSR code but with the option of SSR to help with certain things.

Although I'm a fan of RSC, pages router model is a lot more familiar and easier for me. I spend less time fighting rendering issues or worrying about where my code runs, and more time building.
That's also the reason why a full-stack TS app makes sense for me.

## Included
[x] Pages Router
[x] Tailwind
[x] Custom Radix-based colour system
[x] Out-of-the-box primitives, built on top of Radix (mostly)
[x] drizzle ORM for Postgres
[x] Docker setup with local database, including table prefix so no need to run multiple containers
[x] Auth with Auth.js
[x] react-query for data fetching
[x] Magic link login with Resend
[x] Protected routes, api, and component templates
[x] Useful hooks
[x] Pre-commit CI (Typecheck, Lint)
[ ] Optional IndexedDB persistance
[ ] PWA support
[ ] Rich components like TipTap Editor,
[ ] Generic OpenAI routes with Instructor JS setup


## Approaches
There are several approaches to how I build applications contained. Everything is a learning process so these may change.

- Caching is mostly handled client-side through in-memory or persisted (IndexedDB), managed by React Query.
I find it easier to have the client control the caching and revalidation so I know that every request is fresh data that I need, and I don't make server requests (which cost on Vercel/Serverless).

- Auth checks are made on every request. We use Redis (Vercel KV) for this as it's really fast and cheap for simpe session storage. We can use 1 database for all projects as long as we prefix the keys.
