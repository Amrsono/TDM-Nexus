# Mobile-Friendly Responsive Redesign for TDM Nexus

This plan addresses the complete lack of mobile responsiveness in the TDM Nexus dashboard. The app currently uses a fixed 280px sidebar grid layout, hardcoded widths, and desktop-only UI patterns that make it unusable on screens smaller than ~1024px.

## Current Issues Found

| Issue | Severity | Files Affected |
|---|---|---|
| Fixed `grid-template-columns: 280px 1fr` layout — sidebar never collapses | 🔴 Critical | [index.css](file:///C:/New%20projects/TDM/src/index.css), [App.tsx](file:///C:/New%20projects/TDM/src/App.tsx) |
| No hamburger menu or mobile navigation | 🔴 Critical | [App.tsx](file:///C:/New%20projects/TDM/src/App.tsx) |
| HUD banner with 5 stat columns overflows on narrow screens | 🟠 High | [App.tsx](file:///C:/New%20projects/TDM/src/App.tsx#L352-L390), [index.css](file:///C:/New%20projects/TDM/src/index.css#L404-L436) |
| `max-width: 1000px` on active view overlay clips content | 🟠 High | [index.css](file:///C:/New%20projects/TDM/src/index.css#L446) |
| `max-height: calc(100vh - 250px)` on view-body doesn't account for mobile chrome | 🟠 High | [index.css](file:///C:/New%20projects/TDM/src/index.css#L488) |
| ThreeJS 3D canvas renders full-size behind panels — wastes GPU on mobile | 🟡 Medium | [ThreeCanvas.tsx](file:///C:/New%20projects/TDM/src/components/ThreeCanvas.tsx) |
| View inline styles use fixed widths (e.g., `split-mode` grid in RPM) | 🟡 Medium | Multiple view files |
| Export buttons text overflow on small screens | 🟡 Medium | [App.tsx](file:///C:/New%20projects/TDM/src/App.tsx#L401-L410) |
| Tables with `nowrap` headers overflow on mobile | 🟡 Medium | Multiple view files |
| Touch targets (nav items, buttons) too small for mobile interaction | 🟡 Medium | [index.css](file:///C:/New%20projects/TDM/src/index.css#L349-L372) |
| Wizard step chips overflow horizontally on narrow screens | 🟡 Medium | [WalkthroughWizard.tsx](file:///C:/New%20projects/TDM/src/views/WalkthroughWizard.tsx) |

## Breakpoint Strategy

| Breakpoint | Target | Token |
|---|---|---|
| `≤ 480px` | Small phones (portrait) | `--bp-xs` |
| `≤ 768px` | Large phones / small tablets | `--bp-sm` |
| `≤ 1024px` | Tablets / small laptops | `--bp-md` |
| `> 1024px` | Desktop (current, unchanged) | Default |

---

## Proposed Changes

### Component 1: Core Layout & Navigation

#### [MODIFY] [index.css](file:///C:/New%20projects/TDM/src/index.css)

**Responsive Dashboard Grid** — Add media queries to convert the 2-column sidebar layout to a single-column stacked layout on mobile:

```css
/* At ≤ 768px: collapse sidebar, full-width main content */
@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  .sidebar { /* becomes slide-out drawer */ }
}
```

**Key additions:**
- Mobile sidebar drawer styles (off-screen by default, slides in with overlay)
- Hamburger menu button styles
- Responsive HUD banner (stack stats vertically on mobile)
- Responsive active-view-overlay (remove max-width, adjust margins)
- Responsive view-body (use `dvh` units for mobile browser chrome)
- Responsive form grids, card grids, and tables
- Larger touch targets for nav-items and buttons (min 44×44px)
- Hide scanlines and grid overlay on mobile for performance

---

#### [MODIFY] [App.tsx](file:///C:/New%20projects/TDM/src/App.tsx)

**Mobile navigation state & hamburger toggle:**
- Add `sidebarOpen` state and `toggleSidebar` handler
- Add hamburger menu button visible only on mobile (`≤ 768px`)
- Add backdrop overlay when sidebar drawer is open
- Sidebar gets `sidebar--open` class toggled by state
- Close sidebar on nav item click (mobile UX)
- Conditionally hide or simplify export button text on small screens
- Optionally hide ThreeCanvas on very small screens (`≤ 480px`) to save GPU

```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);
// Close sidebar when navigating on mobile
const handleNavClick = (phaseId: PhaseId) => {
  setActivePhase(phaseId);
  setSidebarOpen(false);
};
```

---

### Component 2: 3D Canvas (Performance)

#### [MODIFY] [ThreeCanvas.tsx](file:///C:/New%20projects/TDM/src/components/ThreeCanvas.tsx)

- Reduce pixel ratio to `1` on mobile (vs `Math.min(devicePixelRatio, 2)` on desktop)
- Reduce geometry detail (fewer segments) on mobile
- Add a `matchMedia` check to simplify rendering on small screens
- Ensure the resize handler works correctly when sidebar toggles

---

### Component 3: View Components (Responsive Inline Styles)

#### [MODIFY] [WalkthroughWizard.tsx](file:///C:/New%20projects/TDM/src/views/WalkthroughWizard.tsx)

- Make wizard step chips horizontally scrollable on mobile instead of wrapping
- Stack form fields vertically on narrow screens
- Responsive export button group

#### [MODIFY] [ReleasePlanningMeeting.tsx](file:///C:/New%20projects/TDM/src/views/ReleasePlanningMeeting.tsx)

- Gate tab bar: horizontal scroll on mobile
- Force `edit` or `preview` only mode on mobile (no split view on `≤ 768px`)
- Responsive editor sections

#### [MODIFY] [POAPSlideBuilder.tsx](file:///C:/New%20projects/TDM/src/views/POAPSlideBuilder.tsx)

- Milestone table: horizontal scroll wrapper on mobile
- Form inputs stack vertically
- Preview panel: scale down for smaller viewports

#### [MODIFY] [FinancesApprovals.tsx](file:///C:/New%20projects/TDM/src/views/FinancesApprovals.tsx)

- Metric cards: single column on mobile
- Tables: horizontal scroll

#### [MODIFY] [TestingQuality.tsx](file:///C:/New%20projects/TDM/src/views/TestingQuality.tsx)

- Cards grid: single column on mobile
- Defect table: horizontal scroll

#### [MODIFY] [ReleaseGovernance.tsx](file:///C:/New%20projects/TDM/src/views/ReleaseGovernance.tsx)

- Checklist and risk tables: horizontal scroll on mobile
- RAG status badges: stack vertically

#### [MODIFY] [PostLaunchELS.tsx](file:///C:/New%20projects/TDM/src/views/PostLaunchELS.tsx)

- Hypercare table: horizontal scroll

#### [MODIFY] [FunnelReviewing.tsx](file:///C:/New%20projects/TDM/src/views/FunnelReviewing.tsx)

- Form grid: single column on mobile

#### [MODIFY] [Analysing.tsx](file:///C:/New%20projects/TDM/src/views/Analysing.tsx)

- Work items table: horizontal scroll
- Domain map nodes: wrap and center on mobile

#### [MODIFY] [POAP.tsx](file:///C:/New%20projects/TDM/src/views/POAP.tsx)

- Form layout responsive stacking

#### [MODIFY] [ImplementingBuild.tsx](file:///C:/New%20projects/TDM/src/views/ImplementingBuild.tsx)

- Squad cards and milestone table responsive

#### [MODIFY] [Settings.tsx](file:///C:/New%20projects/TDM/src/views/Settings.tsx)

- Theme selection cards: stack on mobile (already uses `auto-fit` but needs min-width reduction)

---

## Open Questions

> [!IMPORTANT]
> **Sidebar behavior on mobile:** Should the sidebar become:
> 1. **(Recommended) Slide-out drawer** — slides in from the left with a backdrop overlay, toggled by a hamburger icon
> 2. **Bottom tab bar** — fixed tabs at the bottom (but we have 12 navigation items, which is too many for a tab bar)
> 3. **Collapsible icon-only sidebar** — shrinks to icon-only on tablet, fully hidden on phone

> [!IMPORTANT]  
> **3D Canvas on mobile:** Should we:
> 1. **(Recommended) Keep it but simplify** — lower quality rendering, fewer particles, reduced pixel ratio
> 2. **Hide it completely on mobile** — save all GPU resources, show a static gradient background instead
> 3. **Show only on tablets, hide on phones** — compromise approach

> [!NOTE]
> **Export buttons on mobile:** The "Export Excel" and "Export PPT" buttons take significant header space. Options:
> 1. **(Recommended) Collapse to icon-only** on mobile (tooltip on long-press)
> 2. Move to a "⋮" overflow menu
> 3. Keep as-is (may overflow)

---

## Verification Plan

### Manual Verification
- Test on Chrome DevTools responsive mode at: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 1024px (iPad Pro)
- Verify sidebar drawer opens/closes smoothly with animation
- Verify all views are scrollable and content is readable at each breakpoint
- Verify touch targets are minimum 44×44px
- Verify 3D canvas doesn't cause performance issues on mobile
- Test landscape orientation on phone-sized viewports

### Build Verification
- Run `npm run build` to ensure no TypeScript errors
- Run `npm run dev` and test in browser
