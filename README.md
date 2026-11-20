# WAI Agency — Website

Production website for WAI Agency (Web, AI & Creative Production).
Built with React 19 + TypeScript + Vite 7. Monochrome design, single-page, static output.

## Quick start

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
```

## Publishing (Netlify)

The `dist/` folder is fully self-contained and deploy-ready:

1. **Easiest:** drag the `dist/` folder onto https://app.netlify.com/drop
2. **Or** connect this folder as a Git repo / use the Netlify CLI: `npx netlify-cli deploy --prod --dir=dist`

Included in `dist/`:
- `public/_headers` → CSP + security headers (applied automatically by Netlify)
- `public/_redirects` → SPA fallback (`/* /index.html 200`)
- `og-image.png`, `apple-touch-icon.png`, `favicon.svg`, portfolio images

Other hosts (Vercel, Cloudflare Pages, nginx): replicate the headers in `_headers`
on the host's own configuration mechanism — see `SECURITY_AUDIT_REPORT.md` for the exact directives.

## Pre-launch checklist

- [x] WhatsApp number configured (+213652053208) — verified live
- [x] Gmail contact (waiagencyfor@gmail.com) — verified live
- [x] Security headers + CSP, no secrets in bundle, 0 vulnerable dependencies
- [x] **Production domain configured:** `https://waiagency.dz` — canonical link, `og:url`, absolute `og:image`, and `sitemap.xml` all set. After deploy, verify: `curl -I https://waiagency.dz` shows the security headers.

## Contact channels

- **WhatsApp:** +213652053208 (opens `wa.me` with a pre-filled inquiry)
- **Email:** waiagencyfor@gmail.com (opens the visitor's mail app, pre-filled)

## Security

See `SECURITY_AUDIT_REPORT.md` for the full audit, fixes, and verification results.
