# Quality Review

## Scope

This review covers the public portfolio, owner dashboard, credential gate, media uploads, bilingual direction switching, tab navigation, lightbox behavior, and production bundling.

## Responsibility boundaries

| Area | Primary responsibility | Boundary kept |
|---|---|---|
| `client/src/pages/Home.tsx` | Public composition, tab state, and visitor interactions | Data access remains in typed tRPC hooks; reusable photo behavior lives in `ProfileLightbox` |
| `client/src/pages/Admin.tsx` | Owner CRUD screens and editor composition | Shared file parsing and validation lives in `lib/fileUpload.ts`; dashboard shell remains in `DashboardLayout` |
| `client/src/components/DashboardLayout.tsx` | Protected workspace shell, navigation, and session exit | It does not own portfolio CRUD or public-site rendering |
| `client/src/components/ProfileLightbox.tsx` | Accessible image presentation and close behavior | It does not mutate profile data |
| `client/src/lib/portfolioLanguage.ts` | Pure language normalization and document direction helpers | It has no React or network dependency and is covered by unit tests |
| `client/src/lib/fileUpload.ts` | File-size/type validation and base64 reading | It has no storage or database responsibility and is covered by unit tests |
| `server/routers/portfolio.ts` | Typed input contracts, owner authorization, and media/profile procedures | Persistence remains in `server/db.ts`; storage bytes remain in the S3 helper |
| `server/db.ts` | Database reads, writes, normalization, and public/admin projections | It does not render UI or manage browser state |

## Cleanup completed

Unused template-only pages/components were removed, unused imports were cleaned, repeated file-reader logic was extracted, decorative lightbox orbit rules were removed, and route-level lazy loading separates public code from admin/login code. The public app remains the default path while protected screens are loaded only when requested.

## Interaction and persistence checks

The public contact form required fields were checked without creating a test message. Owner login success and rejection, logout, tab navigation, language direction switching, theme switching, profile lightbox keyboard close, profile save, upload validation, temporary image upload, public propagation, and restoration of the original image were exercised. The temporary upload was restored through a second real upload and profile save; the database query confirmed the restored avatar and unchanged CV references.

## Bundle strategy

Vite manual chunks isolate React/ReactDOM, Framer Motion, Lucide, Radix, i18n, and other shared vendor dependencies. This keeps the public entry chunk focused on portfolio composition and allows browser caching of stable vendor code. Admin and login screens are lazy-loaded, reducing initial public JavaScript and avoiding unnecessary dashboard code for visitors.

## Remaining trade-off

`Home.tsx` and `Admin.tsx` remain page-level composition modules because their content is tightly coupled to their respective screen flows. Their IO boundaries are explicit through typed hooks and extracted utilities; further splitting should be feature-driven rather than a cosmetic file-count reduction.
