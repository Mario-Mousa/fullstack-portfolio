# Visual Redesign Direction

The reference uses a focused personal-portfolio composition: a compact identity panel, a dark layered canvas, warm accent details, high-contrast cards, and navigation that feels like a portfolio control surface rather than a marketing site.

For this portfolio, the redesign will retain the existing database-driven sections while introducing a distinct **Signal Garden** direction. It will use a deep midnight-to-indigo background, a calm animated aurora mesh and faint orbital lines, an offset profile panel in the hero, translucent section surfaces, and restrained lime/cyan accents. Motion will be limited to low-cost opacity and transform transitions, and will respect `prefers-reduced-motion`.

The second refinement will reinterpret the reference's split portfolio experience rather than replicate it: a permanent **Identity Rail** on wide screens will combine the portrait, availability, location, phone, and social links; a soft glass content canvas will hold the existing dynamic sections and a compact section navigator. The existing Signal Garden aurora will remain as the surrounding environment, with a warmer graphite, sage, lilac, and amber palette for improved long-form comfort.

The visual-polish pass shifts the system to a single electric-teal signal palette on charcoal/off-white foundations. Verification confirmed the original monogram loader appears during initial load and resolves into the identity-rail layout. The public profile, contacts, CTA hierarchy, and dark backdrop remain readable; the next pass must verify the image lightbox and dashboard state, plus light theme and RTL behavior.

Public lightbox verification completed: selecting the identity-rail photo opens a centered image card with the profile title, a dimmed and blurred backdrop, the circuit-orbit treatment, and a visible close control. Pressing Escape restores the portfolio successfully.

Light-theme verification confirmed the off-white counterpart retains readable charcoal text, electric-teal actions, and the same low-contrast network atmosphere. The first language-toggle attempt did not visibly update the captured page, so RTL will be rechecked directly before delivery.

The direct language-control recheck succeeded: Arabic copy renders, the content canvas flips to RTL, the identity rail moves to the opposing side, and the teal/light theme stays readable with the new typography.

Dashboard-entry verification completed in the unauthenticated state: the original loader is brief and theme-aware, then resolves into the owner sign-in card with the shared type scale, off-white surface, and teal action treatment. The protected profile editor reuses the same lightbox component in code; access remains owner-only.
