Design a UI. Integrate modern principles.
• Aesthetics:
    ◦ Blend purposeful minimalism with expressive elements.
    ◦ Incorporate subtle depth, layers, shadows, and 3D/glassmorphism.
    ◦ Consider brutalism, bento grid layouts, and organic elements for visual interest.
    ◦ Prioritize clarity with depth.
• Typography:
    ◦ Use bold, expressive typefaces for impact and brand voice.
    ◦ Employ variable and fluid fonts for responsive scaling.
    ◦ Prioritize legibility with good line-spacing and length.
• Colors & Theming:
    ◦ Implement bold, rich color palettes with strategic accents.
    ◦ Provide comprehensive dark/light theming, including "Low Light Mode".
    ◦ Define semantic color roles (e.g., --color-primary).
    ◦ Ensure all color combinations meet WCAG contrast guidelines.
• Spacing & Layout:
    ◦ Utilize a consistent 8-point grid system (or 4-point for fine-tuning).
    ◦ Employ CSS container queries for truly responsive components.
    ◦ Leverage flexbox and grid layouts for fluid designs.
    ◦ Integrate negative space actively to guide focus and reduce cognitive load.
    ◦ Consider bento grid layouts for visual hierarchy and adaptability.
• Motion & Micro-interactions:
    ◦ Use purposeful, subtle animations for feedback and state changes.
    ◦ Implement scroll-triggered animations and advanced cursor interactions.
    ◦ Respect prefers-reduced-motion to disable or simplify animations for users.
• Accessibility:
    ◦ Adhere strictly to WCAG 2.2 AA standards.
    ◦ Ensure all interactive elements are keyboard-navigable with visible focus styles.
    ◦ Provide clear ARIA roles and labels for all interactive elements.
• Performance:
    ◦ Optimize for Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1).
    ◦ Use modern image formats like AVIF/WebP.
    ◦ Employ efficient font loading strategies.
• Modal Design:
    ◦ Use role="dialog" and aria-modal="true" on modal containers.
    ◦ Implement robust focus trapping: move focus into the modal on open, keep it trapped within, and return focus to the trigger on close.
    ◦ Allow closing via the Escape key and provide a clear close button.
    ◦ Center modals with ample padding; avoid full-screen unless critical.
    ◦ Prevent background scrolling while open.