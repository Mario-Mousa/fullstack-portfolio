# Visual Redesign Direction

The reference uses a focused personal-portfolio composition: a compact identity panel, a dark layered canvas, warm accent details, high-contrast cards, and navigation that feels like a portfolio control surface rather than a marketing site.

For this portfolio, the redesign will retain the existing database-driven sections while introducing a distinct **Signal Garden** direction. It will use a deep midnight-to-indigo background, a calm animated aurora mesh and faint orbital lines, an offset profile panel in the hero, translucent section surfaces, and restrained lime/cyan accents. Motion will be limited to low-cost opacity and transform transitions, and will respect `prefers-reduced-motion`.

The second refinement will reinterpret the reference's split portfolio experience rather than replicate it: a permanent **Identity Rail** on wide screens will combine the portrait, availability, location, phone, and social links; a soft glass content canvas will hold the existing dynamic sections and a compact section navigator. The existing Signal Garden aurora will remain as the surrounding environment, with a warmer graphite, sage, lilac, and amber palette for improved long-form comfort.

The visual-polish pass shifts the system to a single electric-teal signal palette on charcoal/off-white foundations. Verification confirmed the original monogram loader appears during initial load and resolves into the identity-rail layout. The public profile, contacts, CTA hierarchy, and dark backdrop remain readable; the next pass must verify the image lightbox and dashboard state, plus light theme and RTL behavior.

Public lightbox verification completed: selecting the identity-rail photo opens a centered image card with the profile title, a dimmed and blurred backdrop, the circuit-orbit treatment, and a visible close control. Pressing Escape restores the portfolio successfully.

Light-theme verification confirmed the off-white counterpart retains readable charcoal text, electric-teal actions, and the same low-contrast network atmosphere. The first language-toggle attempt did not visibly update the captured page, so RTL will be rechecked directly before delivery.

The direct language-control recheck succeeded: Arabic copy renders, the content canvas flips to RTL, the identity rail moves to the opposing side, and the teal/light theme stays readable with the new typography.

Dashboard-entry verification completed in the unauthenticated state: the original loader is brief and theme-aware, then resolves into the owner sign-in card with the shared type scale, off-white surface, and teal action treatment. The protected profile editor reuses the same lightbox component in code; access remains owner-only.

Tab workspace verification confirmed that loading `#work` mounts the projects panel directly without the prior stacked long-scroll sections. The Arabic light-theme presentation remained RTL, and the identity rail stayed pinned and balanced against the active tab surface.

Interactive navigation verification confirmed selecting the contact tab changes the URL to `#contact` and mounts the contact panel in place with no long-scroll jump. The preview environment did not act on the Alt+Left shortcut, but the implementation listens to both `popstate` and `hashchange` for browser navigation synchronization.

History verification completed through `history.back()`: the URL returned from `#contact` to `#work` and the projects tab re-mounted correctly, confirming browser history synchronization.

Post-refactor verification confirmed the active work tab remains stable in the dark palette with the sticky identity rail present. The profile photo lightbox also opens correctly over the dark tab workspace, retaining the blurred backdrop and modal controls.

The photo modal also dismisses with Escape and returns to the active work panel cleanly. A phone-viewport capture confirms the short loader preserves its centered, readable form before the responsive workspace handoff; the tab layout’s mobile breakpoint removes the desktop sticky constraint and stacks the rail above content.

Owner-dashboard login verification: the public dashboard path now has a dedicated, visually consistent sign-in screen with email, password, password-visibility, submit, and return-to-site controls after the branded preloader.

Credential login verification succeeded with the supplied owner email and password. The successful endpoint response minted the owner session and opened the protected dashboard shell with its existing Overview, Profile, Projects, Certificates, and Messages controls.

The post-login owner session was confirmed at `/admin`, where protected dashboard statistics and all management navigation rendered under the owner identity. The sign-out control was then triggered for the next security check.

The dashboard sign-out behavior now explicitly routes to `/admin/login` after the server logout mutation resolves, avoiding a stale owner shell after a session is cleared.

The public About route continues to enter through the branded loader before mounting tab content; the next interaction verifies the repaired language switch once the tab is visible.

About-language verification succeeded: the visible language control switched the active About tab from Arabic RTL to English LTR without navigating away or altering the selected tab. The wider About grid keeps the single biography block readable with fewer lines on desktop.

Security verification found that a direct visit to `/admin/login` while an owner session remains active returns to `/admin`, as intended for an already authenticated owner. The sign-out action itself requires a final implementation-level review before the completed behavior is recorded.

Sign-out verification now succeeded: the actual sidebar action cleared the owner session and routed from `/admin` to `/admin/login`, which rendered the credential form. The earlier false-negative check had targeted the preview wrapper rather than the interactive sidebar control.

An invalid email and password were submitted from the credential form while no owner session was present. The next interface check validates the user-facing rejection message and confirms that the route stays on `/admin/login`.

Narrow-viewport capture confirmed the authenticated dashboard reduces to a compact mobile header and single-column cards without horizontal overflow. The full-page capture of public About did not expose content because the screenshot mechanism suppresses fixed loader chrome during the initial loading interval, so this capture is not used as evidence for the content layout.

The interactive About route successfully rendered after its intended brief loader, preserving the single wide English biography, active About tab, identity rail, and bilingual switch. The mobile-screen capture limitation affects only the automated full-page public-page snapshot, not this interactive rendering.

Final mobile verification used a controlled 375 × 812 viewport after the loader completed. About rendered the stacked identity card, horizontally scrollable tab navigator, compact top bar, and active About content without horizontal page overflow. The `/admin/login` credential form rendered as a single readable card with full-width email/password inputs, password visibility control, submit action, and return link. The evidence captures are retained in the sandbox screenshots directory.

Follow-up language-switch investigation: the published domain redirected this sandbox browser session through the platform sign-in gate, so the interactive diagnosis continues against the same live development build used for implementation verification.

Direct in-page diagnostics on the About view confirmed that the current handler can switch from `en`/LTR to `ar`/RTL and persist `portfolio-language=ar` in development. The follow-up correction will make the visible language state explicitly React-controlled and apply the document direction before the async i18n transition, removing any reliance on delayed external language events.

Post-fix verification completed in the About tab: Arabic switched to English with `en`/LTR persisted, then English switched back to Arabic with `ar`/RTL persisted. The visible action label updated at each step, and the active About tab was retained throughout.

Credential follow-up verification: after the secured password refresh and development-service restart, `/admin/login` loads the intended owner credential form with editable email/password inputs, visibility control, submit state, and public-portfolio return path.

The owner credentials supplied in the follow-up request were entered into the live development login form and submitted; the next route-state check confirms the user-facing result.

The submitted owner credentials successfully opened the protected dashboard after the secret refresh. The quality pass then removed unused template modules, pruned unused icon imports, and simplified the photo-modal markup ahead of visual interaction testing.

The visible About language control is confirmed enabled and directly hit-testable at its center with `pointer-events: auto`; no decorative layer is intercepting user clicks. The remaining verification focuses on the post-click language state and persistence.

Profile lightbox verification passed after the cleanup: the enlarged image is shown without the former circular/orbital overlay, and Escape still closes the accessible dialog and returns focus to the profile-photo trigger.

Physical-click investigation: Arabic-to-English works through the visible control. After the layout becomes English/LTR, hit testing at the displayed Arabic-control center identifies an overlapping element rather than the button itself. This reproduces the user's English-to-Arabic failure and isolates it as a stacking/layering defect in the header rather than an i18n state defect.

The header fix sets the decorative hero grid to ignore pointer events and explicitly layers the sticky topbar above content. Post-fix hit testing targets the button itself, and a physical click changed English/LTR back to Arabic/RTL while preserving the About tab.

Public navigation verification passed: a physical click on the projects control updated the URL hash to `#work`, mounted the Arabic projects panel in place, and retained the responsive identity rail.

Theme-control verification passed: a physical click changed the portfolio from dark to light mode, updated the accessible action label for the reverse operation, and preserved the active Arabic projects tab and its content.

Lazy-route verification passed: an existing authenticated owner session loads the admin route after the branded fallback and renders the correct protected dashboard summary, including five projects, two certificates, and zero unread messages.

The sidebar sign-out control remains present and reachable in the lazy-loaded dashboard. Preview-coordinate variance did not trigger its action, so the next check activates the actual DOM control directly before confirming the route and session state.

Sign-out verification completed: invoking the actual sidebar control cleared the owner session and routed the user to `/admin/login`, where the credential form rendered again in the current light theme.

An incorrect email/password pair was submitted from the rendered login form while no owner session was present. The next interface check validates the rejection message and confirms that the route stays on the credential screen.

Credential rejection verification completed: incorrect values keep the route on `/admin/login` and display the generic error message without issuing a session. The final quality gate passed TypeScript, sixteen automated tests covering language, uploads, validation, authorization, login success/failure, logout, and public outputs, plus a production build. Route-level lazy loading places the admin dashboard and login code in separate production chunks.

Performance follow-up completed: manual vendor chunks reduced the main application asset from roughly 897 kB minified to roughly 217 kB minified, with React, motion, UI, icons, and i18n delivered as independently cacheable chunks. The remaining interaction pass continues with the public contact form.

Public contact-form validation passed without creating test data: all four required fields report invalid while empty, so browser-native validation blocks an accidental blank submission. Server contract tests additionally reject malformed payloads before persistence.

The owner login route remains available after the public-form verification and exposes the expected email, password, visibility, submit, and public-return controls before the non-destructive dashboard save check.

The configured owner credentials were entered and submitted again from the login form to begin the non-destructive profile-save and upload-control verification.

The valid owner session opened the dashboard successfully, and the Profile navigation target is available for the current non-destructive save-path verification.

Profile-save and upload-control verification completed without altering visitor-facing data. The editor retained its current bilingual profile values after the save action; the existing portrait remained rendered in the editor and the current CV path remained available. The two upload controls accept a single image (`PNG`, `JPEG`, or `WebP`) or a single PDF, respectively, matching the client and server validation contracts.

The profile save action was invoked a second time with unchanged values and the editor still presented the expected persisted profile fields, portrait, and CV reference. The success toast’s short display interval was not retained in the later capture, so request-level confirmation and an explicit reversible upload are being completed before closing the validation.

The profile editor loaded its current bilingual text, public links, image, CV path, and upload controls. A save was invoked with the unchanged values to test the live profile mutation without changing visitor-facing content; the next check confirms the success output.
A durable `Saved` status was added beside the profile save button. It is cleared on field edits and set only after the typed profile mutation succeeds, so the owner has persistent visual confirmation beyond the short toast. TypeScript, all 16 Vitest tests, and the production build pass after this change.

Published-page diagnosis: the production root stayed empty because the entry module failed during import with `TypeError: Cannot set properties of undefined (setting 'Activity')`, traced to the generated React/i18n chunks. The direct development preview did not exhibit the failure, isolating the issue to the custom production vendor-chunk boundary rather than public content, routing, or the loading screen.

After publishing the source correction, the public domain still served the older `index-BqYv67cy.js` asset and retained the empty root. The next investigation focuses on the deployment build artifact path and deployment cache rather than browser-level routing.

Published verification completed after the deployment refresh: the public domain loaded the branded loader and then rendered the full English portfolio instead of an empty root. The header Work control updated the published URL to `#work` and rendered the project list, confirming that the live JavaScript bundle, route state, and primary tab interaction are healthy.

Credential-rejection follow-up: the owner secret was explicitly refreshed and the lightweight login endpoint test passed. The restarted development service now loads the credential form normally; the next step verifies the same values through the rendered fields.

Direct published-domain diagnosis later established that the password was valid, but session provisioning returned `User openId is required for upsert` because the production `OWNER_OPEN_ID` was unavailable. The correction resolves the persisted administrator record's OpenID first, uses the environment value only for a first-run fallback, and authorizes dashboard actions through the stored administrator role plus matching profile email.

After publishing the database-backed correction, the development login passed from a freshly cleared session. The published form still returned the exact earlier `User openId is required for upsert` response, which cannot be emitted by the newly guarded resolver. This indicates that production is still serving a prior backend artifact; the next step is to restart the managed service and publish a fresh checkpoint before retesting the same endpoint.

The fresh backend served the corrected login request successfully, but the dashboard remained restricted. Session diagnostics showed why: routine session validation upserted the existing owner record without a role, and the database helper treated absent `OWNER_OPEN_ID` as a reason to reset that record to `user`. The helper now preserves an existing role during ordinary session-heartbeat updates, while explicit dashboard-login upserts continue to set the owner record to `admin`.

Live credential verification completed: submitting the owner email and configured password through the rendered login form redirected successfully to `/admin` and loaded the owner dashboard with the expected overview cards.

The supplied recording confirms that the user entered the expected email and the password `[REDACTED]`, then received the generic rejection while remaining on the published login page. The same published login screen has now been loaded for direct reproduction against the production server.

Published reproduction completed: the same email and password are accepted by the restarted development server but rejected by the published endpoint. This isolates the defect to the production credential configuration or production-only server environment, not client-side field entry or the credential form.

The updated production release has reached the published login form after centralizing and normalizing the password environment value. A fresh live credential attempt is now underway against that release.

Direct production diagnosis identified the actual failure: the published `dashboard.login` request returns HTTP 500 with `User openId is required for upsert`. The password passed verification; the production server lacks a usable `OWNER_OPEN_ID`, so session provisioning fails after credential validation. The correction must derive the owner session identity from persisted owner data or provide a safe fallback rather than relying solely on that unavailable environment value.
