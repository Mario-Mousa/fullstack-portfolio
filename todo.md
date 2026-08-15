# Project TODO

- [x] Define database schema for profile, skills, projects, certificates, and contact messages.
- [x] Add public and owner-restricted tRPC procedures for all portfolio content.
- [x] Add secure profile-photo upload to S3 storage and persist the resulting URL.
- [x] Build bilingual English/Arabic language infrastructure with automatic RTL/LTR direction and localStorage persistence.
- [x] Build persisted dark/light theme toggle with Navy/Teal dark palette and clean light palette.
- [x] Build the responsive public portfolio sections: hero, about, skills, projects, certificates, and contact.
- [x] Load all public profile, projects, certificates, and skills content from the database.
- [x] Build public project and certificate cards with accessible links, loading states, and subtle motion.
- [x] Build the owner-only dashboard overview, profile editor, project CRUD, certificate CRUD, and message inbox.
- [x] Restrict all dashboard routes and server mutations to the Manus OAuth owner role.
- [x] Add SEO and Open Graph metadata for the public portfolio.
- [x] Remove public profile placeholders and use a database-backed empty-state strategy.
- [x] Add a visible error and retry state when the public portfolio data request fails.
- [x] Add tests for validation, access control, and public data APIs.
- [x] Verify desktop and mobile UI, run tests and type checks, and prepare the final project checkpoint.
- [x] Enforce frontend dashboard access through a server-derived owner identity, not the role alone.
- [x] Add real validation and public-data API coverage to the automated test suite.
- [x] Create a final verified project checkpoint for delivery.
