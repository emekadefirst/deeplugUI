# UI & Design System Guidelines (Deeplug Style)

## 1. Visual Language
- **The "Glass" Effect:** Use semi-transparent backgrounds with backdrops (`bg-white/80 backdrop-blur-md` or `bg-zinc-900/80`).
- **Surface Leveling:** Use `zinc` or `slate` palettes. 
  - Level 1: `bg-zinc-50` / `dark:bg-zinc-950`
  - Level 2 (Cards): `bg-white` / `dark:bg-zinc-900`
- **Borders:** Subtle borders are key. Use `border-zinc-200/50` for light and `border-zinc-800/50` for dark.
- **Corners:** High radius for containers (`rounded-2xl` or `rounded-3xl`), medium for interactive elements (`rounded-xl`).

## 2. Component Design Patterns
- **Buttons:** - Primary: High contrast (Black in light mode, White in dark mode).
  - Ghost: Subtle hover states using `hover:bg-zinc-100`.
- **Inputs:** Focus states should use a subtle ring: `focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500`.
- **Interactions:** Always include `transition-all duration-200`. Use `active:scale-95` for a tactile button feel.

## 3. Tailwind v4 Specifics
- Use the new configuration approach (CSS-first configuration).
- Use container queries where applicable for responsive components.
- Avoid "Magic Numbers"—stick to the standard spacing scale (`p-4`, `m-6`, etc.).

## 4. Responsive & Accessibility
- **Mobile First:** Start layouts for 375px and scale up.
- **A11y:** Every interactive element must have an `aria-label` if it's icon-only.
- **Contrast:** Ensure text maintains at least 4.5:1 ratio against backgrounds.