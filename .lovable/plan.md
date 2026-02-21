

# SkillGuard Enterprise

A B2B internal marketplace for enterprises to manage, evaluate, and distribute agent skills (SKILL.md files) safely within an organization.

---

## Pages & Features

### 1. Marketplace (Home Page)
- **Grid of approved skills** displayed as cards
- Each card shows: name, author, version, short description, category tags, download count, star rating
- **Search & filter** by category/tags, sort by popularity or recency
- **"Install" button** on each card (simulated action with a toast confirmation)
- Clicking a card navigates to the **Skill Detail Page**

### 2. Skill Detail Page
- Full metadata (name, author, version, description, tags)
- **Rendered markdown preview** of the SKILL.md content
- **Evaluation report section** showing placeholder scores for Security & Safety, Enterprise Compatibility, Quality & Capability
- Install button + download count + star rating
- Status badge (Approved / Pending / Rejected)

### 3. Submission Portal
Two submission methods, presented as tabs:

**Tab A: Template Form (Recommended)**
- A structured form with fields that enforce a consistent skill format:
  - **Title** — name of the skill
  - **Goal** — what the skill accomplishes
  - **When to Use** — conditions/triggers for using the skill
  - **Input / Output** — what the skill expects and produces
  - **Procedure** — step-by-step instructions (rich text or multi-line)
  - **Verification** — how to confirm the skill worked correctly
- Additional metadata fields: version, author, category/tags
- **Live markdown preview** panel alongside the form, showing the generated SKILL.md in real-time as the user fills in fields
- Submit generates the markdown and sends for review

**Tab B: Raw Upload**
- **Upload a SKILL.md file** via drag & drop or file picker
- **Or import from ClawHub** by entering a skill URL/ID
- Fill in metadata: name, version, description, category/tags

Both tabs submit the skill into "Pending" state for admin review.

### 4. Admin Review Dashboard
- **Table of all submitted skills** with status filters (Pending, Approved, Rejected)
- Click into a submission to see:
  - Full skill metadata and rendered markdown preview
  - **Evaluation report** (mock/placeholder data for now)
  - Score breakdown with visual indicators (progress bars / color-coded badges)
- **Approve / Reject buttons** with optional admin notes
- Approved skills immediately appear in the marketplace

### 5. Role Toggle
- A toggle in the header to switch between **Employee** and **Admin** view
- Employee view: Marketplace + Submission Portal
- Admin view: additionally sees the Admin Review Dashboard
- No real authentication — purely a UI toggle for demo purposes

---

## Backend (Supabase / Lovable Cloud)
- **Skills table**: metadata, markdown content, status (pending/approved/rejected), evaluation scores (JSON), download count, rating, submission method (template/upload)
- No real auth — role toggle is client-side only
- Evaluation report stored as JSON on the skill record (to be populated by external API later)

---

## Design
- Clean, modern corporate aesthetic with neutral color palette
- Card-based grid layout for marketplace
- Dashboard-style table layout for admin review
- Side-by-side form + live preview for template submission
- Responsive, desktop-first with basic mobile support
- shadcn/ui components throughout

