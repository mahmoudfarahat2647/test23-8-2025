---
trigger: manual
---
To create stunning modern UI "beyond magic" with an AI agent, follow direct instructions based on 2025 design trends and structured Context Engineering principles.
1. Adopt 2025 UI/UX Design Trends:
• Aesthetics:
    ◦ Blend minimalism with expressive elements, micro-interactions, strategic color pops, immersive 3D/glassmorphic effects, and expressive typography.
    ◦ Embrace "Post-Neumorphism" for depth, using subtle shadows and rounded geometry for hierarchy.
    ◦ Utilize Bento Grid layouts for visual hierarchy and adaptability.
    ◦ Consider brutalist principles for bold typography and simple layouts.
    ◦ Integrate organic and fluid design elements with natural shapes and textures.
    ◦ Draw influence from futuristic and sci-fi UIs with neon glows and holographic visuals.
• Colors & Theming:
    ◦ Use bold, rich color palettes with high saturation against neutral backgrounds.
    ◦ Implement dynamic theming (e.g., Material Design 3) that generates palettes from a source color.
    ◦ Define semantic color roles (e.g., --color-primary) for flexibility and theming.
    ◦ Ensure high color contrast (≥4.5:1 for normal text, 3:1 for large text) for accessibility.
    ◦ Support dark mode as a standard option.
    ◦ Use wide-gamut, perceptually uniform colors like OKLCH/OKLab for predictable palettes.
• Typography:
    ◦ Prioritize bold, expressive typefaces that capture attention (oversized, animated fonts).
    ◦ Use variable fonts for flexible styling, improved load times, and dynamic effects.
    ◦ Implement fluid, responsive type with CSS clamp() or vw units for legibility across screen sizes.
    ◦ Incorporate kinetic typography for immersive and interactive applications.
• Spacing & Layout:
    ◦ Adopt a consistent 8-point (or 4-point for finer control) grid system for modularity and rhythm.
    ◦ Leverage CSS container queries for components to adapt layout based on their container's size, not just the viewport.
    ◦ Utilize Flexbox and CSS Grid for fluid and adaptable layouts.
    ◦ Emphasize negative space to enhance readability and visual hierarchy.
    ◦ Use full-screen hero sections to capture immediate attention.
• Motion & Interaction:
    ◦ Apply purposeful animations and micro-interactions for instant feedback and to guide users.
    ◦ Ensure all animations respect prefers-reduced-motion for accessibility.
    ◦ Consider advanced cursor interactions and scroll-triggered animations.
    ◦ Prefer spring/physics-based easing for micro-interactions.
• Accessibility (WCAG 2.2+ Compliance):
    ◦ Ensure all interactive elements are keyboard-navigable with clear focus styles.
    ◦ For modals, apply role="dialog", aria-modal="true", trap focus, and restore focus on close. Allow ESC key to close.
    ◦ Provide alternative text for images and proper labels on form inputs.
• Performance (Core Web Vitals):
    ◦ Optimize for Largest Contentful Paint (LCP < 2.5s), Interaction-to-Next-Paint (INP < 200ms), and Cumulative Layout Shift (CLS < 0.1).
    ◦ Use modern image formats like AVIF or WebP with fallbacks.
    ◦ Leverage variable fonts and lazy-loading for offscreen content.
2. Engineer Context for AI Agents (e.g., Kilo Code, TaskMaster AI):
• Specify Role and Goal: Define the AI's role (e.g., "senior backend engineer" for Kilo Code, "expert research planner" for agents) and clearly state the UI implementation goal.
• Provide Comprehensive Instructions:
    ◦ Be clear and specific about functionality and requirements for UI components. Avoid ambiguity (e.g., "Fix the bug in calculateTotal that returns incorrect results" over "Fix the code").
    ◦ Break down complex UI tasks into smaller, well-defined steps.
    ◦ Specify the desired output format (e.g., JSON, Markdown) for UI components.
• Set Global and Project-Specific Rules:
    ◦ Use CLAUDE.md or Kilo Code's custom rules (in .kilocode/rules/) to enforce project-wide coding standards, style conventions, documentation standards, and UI guidelines (e.g., responsive and accessible features).
    ◦ Custom instructions (global or mode-specific) can further tailor the AI's behavior to enforce UI style, preferred libraries (e.g., Tailwind, Radix), and design conventions.
• Include Examples:
    ◦ Provide relevant code examples in a dedicated examples/ folder. Show desired code structure patterns, testing patterns, and integration patterns for UI components. Include examples of both good and bad practices and error handling.
• Leverage Documentation:
    ◦ Include links to relevant documentation, APIs (e.g., for Figma AI, Material Design 3, Tailwind CSS, Radix UI, Framer Motion), and MCP server resources.
• Dynamic Context and Tools:
    ◦ Instruct the AI to use tools like read_file, write_to_file, execute_command, browser_action, and ask_followup_question for tasks like referencing existing frontend code, implementing backend APIs, running tests, or clarifying requirements.
    ◦ Allow the AI to dynamically adapt context based on task requirements (e.g., calendar data for scheduling, web search for research).
• Implement "Think-Then-Do" Process: Guide the AI to first analyze, then plan, then execute, and finally review each step of UI implementation.
• Utilize Validation: Set up validation loops or "validation gates" (e.g., test commands in PRPs) so the AI can self-correct and ensure generated UI code meets success criteria (e.g., accessibility checks, performance audits).
• Iterate and Refine: Continuously refine your context and instructions based on the AI's outputs to achieve optimal UI results.
By combining these modern UI principles with a disciplined Context Engineering approach, you direct AI agents to build interfaces that are not only visually appealing but also functional, accessible, and performant.