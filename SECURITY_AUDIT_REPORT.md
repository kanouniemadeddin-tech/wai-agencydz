# WAI Agency — Security Audit Report

**Date:** 2026-11-20
**Scope:** Production readiness audit of the WAI Agency website (React 19 + Vite 7 + TypeScript, static SPA, no backend).
**Method:** Full source inspection, bundle inspection, dependency audit, and live functional verification against the local production build.

---

## 1. Initial Security Assessment

### Architecture (verified)

| Area | Finding |
|---|---|
| Frontend | React 19.2, Vite 7.3, TypeScript 5.9 — single-page static site |
| Backend / API | **None** — no server code, no API endpoints, no database, no cookies, no sessions |
| Authentication | None (public brochure site; nothing to authenticate) |
| Data submission | Contact form → `wa.me` deep link or `mailto:` only. No user data stored or transmitted to any server |
| Hosting target | Static output (`dist/`) with Netlify-style `_redirects` SPA fallback |
| Third-party resources | CloudFront hero video, Google Fonts, `wa.me` / `mailto:` |

### Key facts established during the audit

- **No injection sinks:** zero occurrences of `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, `new Function()`, `document.write`, `localStorage`, `sessionStorage`, or `document.cookie` in the source.
- **No XSS surface:** all user input (name, service, message) is passed through `encodeURIComponent` before being placed in the WhatsApp URL (`src/config/site.ts` `buildWhatsAppUrl()`); React escapes all rendered output; every `mailto:` value comes from static config (`site.email`), never from user input — no open-redirect or XSS sink exists.
- **No CSRF/injection applicability:** there are no cookies, no sessions, and no server-side endpoints, so CSRF and SQL/NoSQL injection are not applicable.
- **No secrets in the codebase:** verified by pattern scan (`api_key`, `AKIA…`, `sk-…`, `ghp_…`, `Bearer …`, private-key markers) against source and production bundle. The only "matches" were React's internal input-type strings and the **intentional placeholder** WhatsApp number `213XXXXXXXXX`.
- **No source maps** are emitted to `dist/` (verified: 0 `.map` files).
- **Outbound links hardened:** both `window.open` calls use `'noopener,noreferrer'` (`src/components/sections/Contact.tsx:46`, `src/components/sections/ServiceModal.tsx:80`).
- **Placeholder guard works:** with the WhatsApp number still a placeholder, the app refuses to open `wa.me` and shows an inline notice instead (verified live; see §5).
- No Git repository exists, so there is no committed-history exposure — and also no rollback safety (see remaining risks).

---

## 2. Identified Vulnerabilities & Risks

| # | Severity | Finding | Location | Impact | Status |
|---|---|---|---|---|---|
| H1 | High | No HTTP security headers (no CSP, no `X-Frame-Options`, no `nosniff`, no `Referrer-Policy`, no `Permissions-Policy`, no HSTS) | missing `public/_headers` | With no CSP, any injected script could execute; site could be framed (clickjacking); no MIME/referrer hardening | **Fixed** (see §3) |
| M1 | Medium | Unused dependencies increase supply-chain surface: `react-router-dom`, `tailwindcss`, `@tailwindcss/vite` | `package.json` | Larger attack/update surface; no functional use | **Fixed** — removed after conclusive verification (§3) |
| M2 | Medium | No React error boundary — an unexpected runtime error rendered a white screen | `src/main.tsx` | Poor production resilience | **Fixed** (see §3) |
| M3 | Medium | Third-party availability coupling: hero video (CloudFront) and fonts (Google Fonts) are hard dependencies | `src/components/sections/Hero.tsx:5`, `index.html:30` | If unavailable, the site degrades (video fails silently; fonts fall back to system stack) | Accepted / mitigated by CSP allow-listing; optional future self-hosting |
| L1 | Low | `npm audit` reported **0 vulnerabilities**; majors are outdated (`vite` 7→8, `@vitejs/plugin-react` 5→6, `lucide-react` 0.545→1.x, `typescript` 5.9→7) | `package.json` | No known vulnerabilities; major upgrades deferred pre-launch to avoid breaking changes | Deferred (documented) |
| L2 | Low | Hero video URL embeds an internal CloudFront asset path (asset ID disclosure only — not a credential) | `src/components/sections/Hero.tsx` | Minimal information disclosure | Accepted |
| L3 | Low | Real contact email is present in the production bundle | `src/config/site.ts` | By design — public contact address; spam-harvest risk only | Accepted |
| L4 | Low | `sitemap.xml` still contains the placeholder domain; canonical URL not configured | `public/sitemap.xml`, `src/config/site.ts` (`url: ''`) | SEO misconfiguration, not a vulnerability | Open launch task |
| L5 | Low | No OG image (1200×630) | `index.html` comment | Link-preview quality, not security | Open launch task |
| L6 | Low | No Git repository — no committed history to leak, but also no rollback safety | project root | Operational risk | Noted for the user |
| L7 | Low | `form-action 'self'` is declared; forms submit via JS (`window.open`), which is unaffected — verified correct | `public/_headers` | None | n/a |

**Inapplicable checks (documented for completeness):** SQL/NoSQL injection (no database), CSRF (no cookies/sessions/server), file uploads (none), CORS (no server API), authorization checks (no protected resources), secure cookies (no cookies).

---

## 3. Fixes Implemented (all approved before implementation)

### 3.1 `public/_headers` (new file)

Netlify-compatible security headers applied to all routes:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  media-src 'self' https://d8j0ntlcm91z4.cloudfront.net;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  form-action 'self';
  upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Notes:
- CSP was derived from the **actual** external resources in use: Google Fonts (`style-src`/`font-src`) and the CloudFront video (`media-src`). `script-src 'self'` is sufficient — verified the production bundle contains **no inline `<script>`**.
- `style-src 'unsafe-inline'` is required by React's inline `style` attributes (CSSOM manipulation used by `motion/react`); it does not enable script execution.
- HSTS is included for the HTTPS production environment; it only takes effect once the site is served over HTTPS (hosts that read `_headers`, e.g. Netlify, serve over HTTPS by default).
- No CSP directive was weakened to bypass an error; the policy was built resource-first.

### 3.2 Minimal React ErrorBoundary (new file)

- `src/components/ErrorBoundary.tsx` — class component wrapping `<App />` in `src/main.tsx`.
- On any render error it shows a plain, deliberately unstyled white/black fallback ("Something went wrong. Please reload the page to continue.") with a Reload button — no interference with the site design, which is otherwise untouched.
- Errors are logged locally via `console.error` (no external reporting service exists to receive secrets).

### 3.3 Dependency removal (conclusively verified before removal)

Evidence gathered per the approval conditions:

1. `vite.config.ts` — contains only the `react()` plugin; no Tailwind plugin.
2. All CSS (`src/styles/*.css`) — hand-written; **zero** occurrences of `@tailwind`, `@apply`, or Tailwind imports.
3. `react-router-dom` — imported **only** by files that are themselves imported nowhere (`src/pages/{Home,Services,Portfolio,Contact}Page.tsx`, `src/components/sections/CtaPanel.tsx`); the production bundle contains **0** references (`grep -c "react-router|BrowserRouter" dist/assets/*.js` → 0).
4. Lockfile re-generated by `npm uninstall`.

Removed: `react-router-dom`, `tailwindcss`, `@tailwindcss/vite`.
Deleted as a necessary consequence (dead, unreachable files whose type-checking was the only thing referencing the removed package): the four never-routed page components and `CtaPanel.tsx`. The rendered website is byte-for-byte unaffected (these files were not part of the bundle).

---

## 4. Verification Results

| Check | Result |
|---|---|
| `npm audit` | ✅ `found 0 vulnerabilities` (re-run after changes) |
| TypeScript check + production build (`npm run build`) | ✅ `tsc -b && vite build` passes; bundle 408 kB JS (131 kB gzip), 22.8 kB CSS |
| Routes/sections | ✅ `#home`, `#services`, `#portfolio`, `#why`, `#contact` all render in the production preview |
| Contact form validation | ✅ Empty/invalid submit blocked with inline errors; no navigation occurs |
| WhatsApp placeholder guard | ✅ With a valid form and placeholder number, `window.open` is **not called** (verified by intercepting `window.open`); the "not configured" notice renders and points to the real email |
| mailto behavior | ✅ `mailto:waiagencyfor@gmail.com` present in Contact section, offer dialog, and footer |
| Offer dialog / full-card click | ✅ Opens with correct title and preselection; closes via button and Escape; body scroll locks/unlocks |
| Menu overlay | ✅ Opens and closes; Escape works; scroll unlocks |
| Bundle secret scan (re-run post-changes) | ✅ No keys, tokens, or credentials; only the intentional placeholder number and public email |
| Source maps in `dist/` | ✅ 0 files |
| Security headers at runtime | ⚠️ Partial — `vite preview` (local static server) does not read `_headers`; the file's syntax and directives were verified, and the exact header delivery must be confirmed on the real host after deployment (headers only apply on hosts that support `_headers`, e.g. Netlify) |
| Design/UI/UX changes | ✅ None — all existing components, styles, animations, and behavior preserved |

---

## 5. Remaining Risks & Open Items

1. **Header delivery unverified on a real host** — `public/_headers` is Netlify-syntax; if you deploy elsewhere (Vercel, Cloudflare Pages, nginx), the equivalent headers must be configured there. Verify with `curl -I https://<domain>` after launch.
2. **WhatsApp number configured (2026-11-20):** the real number is now set in `src/config/site.ts` and the `wa.me` handoff was verified live (`https://wa.me/213652053208` with the pre-filled message) from both the main contact form and the offer dialog. The email channel remains available alongside it.
3. **Production domain not configured** — canonical URL and sitemap remain placeholders (`site.url`, `public/sitemap.xml`); complete before launch for SEO correctness.
4. ~~OG image (1200×630) not yet produced.~~ **Done (2026-11-20):** `public/og-image.png` generated and wired via `og:image` meta (set the absolute URL once the domain is configured). Apple touch icon PNG also added.
5. **Third-party coupling** (CloudFront video, Google Fonts) — accepted; consider self-hosting both for full independence and stricter CSP (`media-src 'self'`, `font-src 'self'`, drop Google Fonts origins).
6. **Outdated major versions** (vite 8, plugin-react 6, lucide-react 1.x, TypeScript 7) — 0 known vulnerabilities today; schedule major upgrades post-launch.
7. **No automated tests / no CI** — the project has no test suite; the checks in this report were manual. A minimal smoke test + CI would prevent regressions.
8. **No Git repository** — nothing committed to leak, but also no history/rollback; recommend initializing Git (with `.gitignore` covering `node_modules`, `dist`) before launch.
9. **No email-sending backend** — the contact flow relies on the visitor's own WhatsApp/mail client. This is a deliberate architectural choice; if a server-mediated inbox is ever added, the entire server-side section of this audit must be redone.

## 6. Production Readiness Assessment

**Ready from a code-security standpoint:** no known vulnerable dependencies, no injection/XSS sinks, no secrets in the bundle, hardened headers configured, error resilience added, and all existing functionality verified intact.

**Conditional items before public launch:** real WhatsApp number, production domain (canonical + sitemap), OG image, and header verification on the actual host. None of these are code-security blockers.

*This report reflects only the checks actually performed. A successful build was treated as necessary but not sufficient.*
