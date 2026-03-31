## Structured Data Rollout

Source: review follow-up on 31 March 2026.

### What we agree with

- Structured data is a real gap.
- Breadcrumbs are the safest first win because they reinforce hierarchy without changing page copy.
- Event schema fits real countdown pages where we already know the target date.
- Homepage brand-level schema is worth adding once and leaving alone.

### What we are not doing in this first pass

- FAQ schema everywhere
- Search box schema
- Calculator schema
- Schema on custom countdown pages
- City/sports/media niche expansion

### Phase 1 implementation

- Add reusable JSON-LD helper component.
- Add reusable schema builders for:
  - WebSite
  - Organization
  - BreadcrumbList
  - Event
- Add WebSite and Organization schema to the homepage.
- Add BreadcrumbList to:
  - country hub pages
  - region hub pages
  - global event countdown pages
  - country event countdown pages
  - regional event countdown pages
  - exact-date countdown pages
  - calculator hub and live calculator pages
- Add Event schema to countdown pages only where we already have:
  - stable canonical URL
  - event name
  - target date

### Why this order

- It gives Google a clearer site hierarchy quickly.
- It avoids noisy or low-confidence schema.
- It keeps the implementation shared instead of page-by-page drift.

### Next likely structured-data follow-up

- Review whether country and region hub pages should get CollectionPage or Dataset-style schema later.
- Consider calculator schema only after the public calculator routes settle.
