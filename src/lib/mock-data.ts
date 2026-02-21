import { Skill } from "./types";

export const CATEGORIES = [
  "Communication",
  "Data Analysis",
  "DevOps",
  "Documentation",
  "Integration",
  "Knowledge Management",
  "Security",
];

export const initialSkills: Skill[] = [
  {
    id: "1",
    title: "Slack",
    author: "Peter Steinberger",
    version: "1.0.0",
    description:
      "Use when you need to control Slack from Clawdbot via the slack tool, including reacting to messages or pinning/unpinning items in Slack channels or DMs.",
    tags: ["slack", "messaging", "automation"],
    category: "Communication",
    markdownContent: `# Slack Actions

## Overview

Use \`slack\` to react, manage pins, send/edit/delete messages, and fetch member info. The tool uses the bot token configured for Clawdbot.

## Inputs to collect

- \`channelId\` and \`messageId\` (Slack message timestamp, e.g. \`1712023032.1234\`).
- For reactions, an \`emoji\` (Unicode or \`:name:\`).
- For message sends, a \`to\` target (\`channel:<id>\` or \`user:<id>\`) and \`content\`.

Message context lines include \`slack message id\` and \`channel\` fields you can reuse directly.

## Actions

### Action groups

| Action group | Default | Notes |
| --- | --- | --- |
| reactions | enabled | React + list reactions |
| messages | enabled | Read/send/edit/delete |
| pins | enabled | Pin/unpin/list |
| memberInfo | enabled | Member info |
| emojiList | enabled | Custom emoji list |

### React to a message

\`\`\`json
{
  "action": "react",
  "channelId": "C123",
  "messageId": "1712023032.1234",
  "emoji": "✅"
}
\`\`\`

### Send a message

\`\`\`json
{
  "action": "sendMessage",
  "to": "channel:C123",
  "content": "Hello from Clawdbot"
}
\`\`\`

### Edit a message

\`\`\`json
{
  "action": "editMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234",
  "content": "Updated text"
}
\`\`\`

### Delete a message

\`\`\`json
{
  "action": "deleteMessage",
  "channelId": "C123",
  "messageId": "1712023032.1234"
}
\`\`\`

### Pin / Unpin / List pins

\`\`\`json
{ "action": "pinMessage", "channelId": "C123", "messageId": "1712023032.1234" }
{ "action": "unpinMessage", "channelId": "C123", "messageId": "1712023032.1234" }
{ "action": "listPins", "channelId": "C123" }
\`\`\`

### Member info

\`\`\`json
{ "action": "memberInfo", "userId": "U123" }
\`\`\`

## Ideas to try

- React with ✅ to mark completed tasks.
- Pin key decisions or weekly status updates.`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 82,
        explanation:
          "No curl|bash, eval, or obfuscated scripts. Instruction-only skill with no code files. Actions are well-structured JSON payloads. However, the skill expects an implicit 'slack' CLI tool and bot token that are not declared in metadata, widening the runtime surface without documentation.",
      },
      credentials: {
        score: 60,
        explanation:
          "The skill relies on a Slack bot token configured for Clawdbot but does not declare it as a required environment variable. Users cannot see what secrets will be used or by whom. This is a proportionality problem — the token and tool should be explicitly listed.",
      },
      compatibility: {
        score: 88,
        explanation:
          "Instruction-only skill with no install spec or code files — lowest install risk. Nothing is written to disk. No sudo, no system modifications. Works in standard agent environments that have the slack tool available.",
      },
      quality: {
        score: 85,
        explanation:
          "Well-defined action groups with clear JSON payloads. Scope is limited to Slack operations. Does not ask to read local files or unrelated env vars. Could improve by documenting required permissions and scopes for the bot token.",
      },
      networkEgress: {
        score: 75,
        explanation:
          "All actions go through the Slack API via the configured bot token. Endpoints are implicit (Slack API) rather than explicitly documented. No outbound data uploads beyond Slack actions. The undeclared bot token dependency means network behavior is partially opaque.",
      },
      summary:
        "Functional Slack integration with well-structured actions, but fails to declare two important runtime dependencies: the 'slack' CLI/tool and the Slack bot token. Verify token origin and scope before installing.",
    },
    downloads: 198,
    rating: 4.5,
    submissionMethod: "upload",
    submittedAt: "2026-02-01T10:30:00Z",
  },
  {
    id: "2",
    title: "YouTube API",
    author: "byungkyu",
    version: "1.0.3",
    description:
      "YouTube Data API integration with managed OAuth. Search videos, manage playlists, access channel data, and interact with comments.",
    tags: ["youtube", "api", "oauth", "video"],
    category: "Integration",
    markdownContent: `# YouTube

Access the YouTube Data API v3 with managed OAuth authentication. Search videos, manage playlists, access channel information, and interact with comments and subscriptions.

## Quick Start

\`\`\`bash
# Search for videos
python <<'EOF'
import urllib.request, os, json
req = urllib.request.Request('https://gateway.maton.ai/youtube/youtube/v3/search?part=snippet&q=coding+tutorial&type=video&maxResults=10')
req.add_header('Authorization', f'Bearer {os.environ["MATON_API_KEY"]}')
print(json.dumps(json.load(urllib.request.urlopen(req)), indent=2))
EOF
\`\`\`

## Base URL

\`\`\`
https://gateway.maton.ai/youtube/{native-api-path}
\`\`\`

Replace \`{native-api-path}\` with the actual YouTube Data API endpoint path. The gateway proxies requests to \`www.googleapis.com\` and automatically injects your OAuth token.

## Authentication

All requests require the Maton API key:

\`\`\`
Authorization: Bearer $MATON_API_KEY
\`\`\`

## Connection Management

Manage your Google OAuth connections at \`https://ctrl.maton.ai\`.

## API Reference

### Search Videos, Channels, or Playlists

\`\`\`bash
GET /youtube/youtube/v3/search
\`\`\`

### Get Video Details

\`\`\`bash
GET /youtube/youtube/v3/videos?part=snippet,statistics,contentDetails&id={videoId}
\`\`\`

### Playlists (Create / Update / Delete)

\`\`\`bash
POST /youtube/youtube/v3/playlists?part=snippet,status
PUT /youtube/youtube/v3/playlists?part=snippet,status
DELETE /youtube/youtube/v3/playlists?id={playlistId}
\`\`\`

### Comments

\`\`\`bash
GET /youtube/youtube/v3/commentThreads?part=snippet,replies&videoId={videoId}
POST /youtube/youtube/v3/commentThreads?part=snippet
DELETE /youtube/youtube/v3/comments?id={commentId}
\`\`\`

## Notes

- Video IDs are 11 characters (e.g., \`dQw4w9WgXcQ\`)
- Use \`pageToken\` for pagination
- Quota costs vary by endpoint — search is expensive (100 units)
- Rate limit: 10 req/sec per Maton account`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 80,
        explanation:
          "No curl|bash, eval, or obfuscated scripts. All network calls go to documented Maton endpoints (gateway.maton.ai, ctrl.maton.ai). Python urllib snippets are straightforward with no injection vectors. However, all data is routed through a third-party proxy (Maton) which centralizes OAuth and data access.",
      },
      credentials: {
        score: 85,
        explanation:
          "Single environment variable (MATON_API_KEY) is properly declared and used via Authorization header. No credentials printed to stdout or written to disk. The key is sensitive as it grants access to your Maton account and proxied YouTube OAuth connections.",
      },
      compatibility: {
        score: 90,
        explanation:
          "Instruction-only skill with no install spec. Only requires Python (standard) and network access to Maton endpoints. No sudo, no system modifications, no privileged access needed. Works in locked-down corp environments that allow outbound HTTPS.",
      },
      quality: {
        score: 88,
        explanation:
          "Comprehensive API reference covering search, videos, channels, playlists, subscriptions, and comments. Clear examples in both Python and bash. Well-documented error handling and troubleshooting. Connection management workflow is clear.",
      },
      networkEgress: {
        score: 78,
        explanation:
          "All outbound calls go to gateway.maton.ai and ctrl.maton.ai (documented). Both download and upload operations are present (GET for reads, POST/PUT/DELETE for writes). Data sent includes YouTube API payloads proxied through Maton. The Maton service stores OAuth tokens — review their privacy policy.",
      },
      summary:
        "Internally consistent YouTube API proxy via Maton. Single API key is proportionate. Before installing, verify you trust Maton (maton.ai) and review how they store OAuth tokens. Limit Google OAuth scopes when connecting.",
    },
    downloads: 13,
    rating: 4.2,
    submissionMethod: "upload",
    submittedAt: "2026-01-20T14:15:00Z",
  },
  {
    id: "3",
    title: "Gog (Google Workspace CLI)",
    author: "Peter Steinberger",
    version: "1.0.0",
    description:
      "Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs.",
    tags: ["google", "gmail", "calendar", "drive", "sheets"],
    category: "Integration",
    markdownContent: `# gog

Use \`gog\` for Gmail/Calendar/Drive/Contacts/Sheets/Docs. Requires OAuth setup.

## Setup (once)

- \`gog auth credentials /path/to/client_secret.json\`
- \`gog auth add you@gmail.com --services gmail,calendar,drive,contacts,sheets,docs\`
- \`gog auth list\`

## Common commands

- Gmail search: \`gog gmail search 'newer_than:7d' --max 10\`
- Gmail send: \`gog gmail send --to a@b.com --subject "Hi" --body "Hello"\`
- Calendar: \`gog calendar events <calendarId> --from <iso> --to <iso>\`
- Drive search: \`gog drive search "query" --max 10\`
- Contacts: \`gog contacts list --max 20\`
- Sheets get: \`gog sheets get <sheetId> "Tab!A1:D10" --json\`
- Sheets update: \`gog sheets update <sheetId> "Tab!A1:B2" --values-json '[["A","B"],["1","2"]]' --input USER_ENTERED\`
- Sheets append: \`gog sheets append <sheetId> "Tab!A:C" --values-json '[["x","y","z"]]' --insert INSERT_ROWS\`
- Sheets clear: \`gog sheets clear <sheetId> "Tab!A2:Z"\`
- Docs export: \`gog docs export <docId> --format txt --out /tmp/doc.txt\`
- Docs cat: \`gog docs cat <docId>\`

## Notes

- Set \`GOG_ACCOUNT=you@gmail.com\` to avoid repeating \`--account\`.
- For scripting, prefer \`--json\` plus \`--no-input\`.
- Confirm before sending mail or creating events.`,
    status: "pending",
    evaluationScores: {
      security: {
        score: 72,
        explanation:
          "No eval, no obfuscated scripts, no curl|bash. However, the skill requires installing a third-party binary via Homebrew tap (steipete/tap/gogcli) which carries trust risk. The registry metadata and SKILL.md disagree about required binaries — an important inconsistency to resolve.",
      },
      credentials: {
        score: 55,
        explanation:
          "Requires OAuth credentials (client_secret.json) and suggests setting GOG_ACCOUNT env var. These are sensitive and proportionate to a Google Workspace CLI, but they are not declared in the registry metadata. Users must supply OAuth client secrets which grant broad access to Google services.",
      },
      compatibility: {
        score: 65,
        explanation:
          "Requires installing a third-party Homebrew tap binary. Linux users report path issues. Registry metadata shows no install/binaries while SKILL.md references them — this mismatch limits enterprise adoption. Requires local CLI installation which may conflict with IT policies.",
      },
      quality: {
        score: 78,
        explanation:
          "Comprehensive command reference covering all Google Workspace services. Clear setup instructions. However, lacks error handling documentation and doesn't explain what happens with malformed inputs. Confirms before destructive actions (good).",
      },
      networkEgress: {
        score: 70,
        explanation:
          "The gog CLI communicates with Google APIs (googleapis.com) using OAuth tokens stored locally. Endpoints are implicit — not explicitly listed in SKILL.md. Data sent includes email content, calendar events, drive files. No documentation on what data leaves the system or telemetry behavior of the CLI binary.",
      },
      summary:
        "Promising Google Workspace CLI wrapper but has significant gaps: registry/SKILL.md metadata mismatch on required binaries, undeclared OAuth credential requirements, and incomplete network egress documentation. Verify the Homebrew tap source and only provide OAuth credentials from a test account.",
    },
    downloads: 495,
    rating: 4.0,
    submissionMethod: "upload",
    submittedAt: "2026-02-10T16:45:00Z",
  },
  {
    id: "4",
    title: "Weather",
    author: "Peter Steinberger",
    version: "1.0.0",
    description:
      "Get current weather and forecasts (no API key required).",
    tags: ["weather", "curl", "api-free"],
    category: "DevOps",
    markdownContent: `# Weather

Two free services, no API keys needed.

## wttr.in (primary)

Quick one-liner:

\`\`\`bash
curl -s "wttr.in/London?format=3"
# Output: London: ⛅️ +8°C
\`\`\`

Compact format:

\`\`\`bash
curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"
# Output: London: ⛅️ +8°C 71% ↙5km/h
\`\`\`

Full forecast:

\`\`\`bash
curl -s "wttr.in/London?T"
\`\`\`

Format codes: \`%c\` condition · \`%t\` temp · \`%h\` humidity · \`%w\` wind · \`%l\` location · \`%m\` moon

Tips:

- URL-encode spaces: \`wttr.in/New+York\`
- Airport codes: \`wttr.in/JFK\`
- Units: \`?m\` (metric) \`?u\` (USCS)
- Today only: \`?1\` · Current only: \`?0\`
- PNG: \`curl -s "wttr.in/Berlin.png" -o /tmp/weather.png\`

## Open-Meteo (fallback, JSON)

Free, no key, good for programmatic use:

\`\`\`bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
\`\`\`

Find coordinates for a city, then query. Returns JSON with temp, windspeed, weathercode.

Docs: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 95,
        explanation:
          "Minimal risk. Uses only curl to fetch weather data from two well-known public APIs (wttr.in, Open-Meteo). No eval, no obfuscated scripts, no remote code execution patterns. All operations are read-only HTTP GETs. Only writes to /tmp for optional PNG output.",
      },
      credentials: {
        score: 98,
        explanation:
          "No credentials required whatsoever. Both wttr.in and Open-Meteo are free, no-key APIs. The skill does not request, handle, or store any secrets. Fully proportionate to its stated purpose.",
      },
      compatibility: {
        score: 92,
        explanation:
          "Only requires curl, which is available on virtually all systems. No install spec, no code files, no sudo, no system modifications. Minor metadata mismatch: registry says no required binaries while SKILL.md lists curl — but curl is universally available.",
      },
      quality: {
        score: 90,
        explanation:
          "Clear, concise instructions with practical examples. Provides both human-readable (wttr.in) and machine-readable (Open-Meteo) options. Format codes are well-documented. Scope is well-defined and narrow.",
      },
      networkEgress: {
        score: 93,
        explanation:
          "All outbound calls are download-only (HTTP GET) to two documented endpoints: wttr.in and api.open-meteo.com. No data upload, no POST/PUT requests. The only data sent is the location query string. No telemetry or analytics. Fully transparent.",
      },
      summary:
        "Exemplary low-risk skill. No credentials, no installs, read-only network access to well-known public APIs. Safe for enterprise use. Only consideration: queried locations are sent to external services (wttr.in, Open-Meteo).",
    },
    downloads: 344,
    rating: 4.8,
    submissionMethod: "template",
    submittedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "5",
    title: "Summarize",
    author: "Peter Steinberger",
    version: "1.0.0",
    description:
      "Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube).",
    tags: ["summarization", "cli", "content-extraction"],
    category: "Documentation",
    markdownContent: `# Summarize

Fast CLI to summarize URLs, local files, and YouTube links.

## Quick start

\`\`\`bash
summarize "https://example.com" --model google/gemini-3-flash-preview
summarize "/path/to/file.pdf" --model google/gemini-3-flash-preview
summarize "https://youtu.be/dQw4w9WgXcQ" --youtube auto
\`\`\`

## Model + keys

Set the API key for your chosen provider:

- OpenAI: \`OPENAI_API_KEY\`
- Anthropic: \`ANTHROPIC_API_KEY\`
- xAI: \`XAI_API_KEY\`
- Google: \`GEMINI_API_KEY\`

Default model is \`google/gemini-3-flash-preview\` if none is set.

## Useful flags

- \`--length short|medium|long|xl|xxl|<chars>\`
- \`--max-output-tokens <count>\`
- \`--extract-only\` (URLs only)
- \`--json\` (machine readable)
- \`--firecrawl auto|off|always\` (fallback extraction)
- \`--youtube auto\` (Apify fallback if \`APIFY_API_TOKEN\` set)

## Config

Optional config file: \`~/.summarize/config.json\`

\`\`\`json
{ "model": "openai/gpt-5.2" }
\`\`\`

Optional services:

- \`FIRECRAWL_API_KEY\` for blocked sites
- \`APIFY_API_TOKEN\` for YouTube fallback`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 80,
        explanation:
          "No eval, no obfuscated scripts, no curl|bash patterns. The skill is an instruction-only wrapper for an external CLI. However, it requires installing a third-party binary via Homebrew tap (steipete/tap/summarize) which carries some trust risk. Content is sent to LLM providers for processing.",
      },
      credentials: {
        score: 82,
        explanation:
          "Requested API keys (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.) are proportionate to a tool that sends content to LLM providers. Optional FIRECRAWL_API_KEY and APIFY_API_TOKEN are documented. Config file in ~/.summarize/ is expected. No credentials printed to stdout.",
      },
      compatibility: {
        score: 70,
        explanation:
          "Requires installing the 'summarize' binary via third-party Homebrew tap. Registry metadata lists no required binaries while SKILL.md declares the summarize binary — a metadata mismatch. May conflict with IT policies around third-party CLI installations.",
      },
      quality: {
        score: 85,
        explanation:
          "Clear quick-start examples, well-documented flags and model options. Config file support for customization. Scope is well-defined: summarize URLs/files/YouTube. Good fallback strategy with Firecrawl and Apify.",
      },
      networkEgress: {
        score: 68,
        explanation:
          "The CLI sends file/URL content to whichever LLM provider is configured (OpenAI, Anthropic, Google, xAI). Optional Firecrawl and Apify services receive URLs/content. Multiple external services may receive data but endpoints are documented. Full content of summarized files is transmitted externally.",
      },
      summary:
        "Useful content summarization wrapper with clear documentation. Multiple LLM provider support is well-designed. Main concerns: third-party binary installation, content sent to external LLM providers, and metadata mismatch on required binaries. Only use with provider API keys you trust.",
    },
    downloads: 463,
    rating: 4.6,
    submissionMethod: "upload",
    submittedAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "6",
    title: "Tweet Writer",
    author: "blueberrywoodsym",
    version: "1.0.6",
    description:
      "Write viral, persuasive, engaging tweets and threads. Uses web research to find viral examples in your niche, then models writing based on proven formulas.",
    tags: ["twitter", "content", "copywriting", "social-media"],
    category: "Communication",
    markdownContent: `# Tweet Writer Skill

## Overview

This skill helps you write viral, persuasive tweets and threads optimized for X's algorithm. It combines proven copywriting frameworks, viral hook formulas, and real-time research to model your content after successful examples in your niche.

## Process Workflow

### Phase 1: Niche Research (CRITICAL)

Before writing ANY tweet, you MUST research viral examples in the user's specific niche.

**Research Steps:**

1. **Identify the niche/topic**
2. **Search for viral examples** — Use WebSearch to find viral tweet examples
3. **Analyze patterns** — Extract hook styles, content structure, tone
4. **Document insights** — Create a brief analysis before writing

### Phase 2: Tweet Creation

Use the frameworks below to craft content modeled after successful examples.

## Hook Formulas

- **Bold Statement**: "Nobody talks about this, but..."
- **Specific Result**: "I [result] in [timeframe]. Here's how:"
- **Curiosity Gap**: "The one thing [person] gets wrong about [topic]"
- **Story Hook**: "3 years ago I was [bad state]. Today I [good state]."
- **List Promise**: "[Number] [things] that will [benefit] (thread):"

## Tweet Formats That Go Viral

1. **Listicle** — Highest engagement format
2. **Contrarian Take** — Challenge popular beliefs
3. **Before/After** — Transformation stories
4. **Framework** — Step-by-step methodology
5. **Fill in the Blank** — Generates massive replies

## Copywriting Frameworks

- **PAS** (Problem → Agitate → Solution)
- **AIDA** (Attention → Interest → Desire → Action)
- **BAB** (Before → After → Bridge)

## Execution Checklist

- [ ] Hook stops the scroll
- [ ] First 7 words earn the rest of the tweet
- [ ] Specific numbers included
- [ ] Under character limit
- [ ] No external links in main tweet
- [ ] Clear CTA or engagement driver`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 95,
        explanation:
          "Instruction-only skill with no code files, no install spec, no binary requirements. No curl|bash, no eval, no obfuscated scripts. All instructions are about content creation methodology — purely advisory. No injection vectors or unsafe execution patterns.",
      },
      credentials: {
        score: 98,
        explanation:
          "No credentials required whatsoever. The skill declares no environment variables, API keys, or config paths. Fully proportionate to its stated purpose of writing content and web research.",
      },
      compatibility: {
        score: 95,
        explanation:
          "No install spec, no code files, no binaries, no sudo, no system modifications. Instruction-only skill that works in any agent environment with web search capability. Zero friction for enterprise deployment.",
      },
      quality: {
        score: 82,
        explanation:
          "Well-structured content creation methodology with clear frameworks and templates. Research-first approach is good practice. However, outputs may closely paraphrase public tweets — review for copyright. The skill doesn't include posting capability (good separation of concerns).",
      },
      networkEgress: {
        score: 96,
        explanation:
          "No outbound network calls from the skill itself. Only uses the platform's built-in WebSearch tool for research. No data uploads, no webhooks, no telemetry. All content generation is local to the agent.",
      },
      summary:
        "Excellent low-risk skill. Instruction-only, no credentials, no installs, no network egress. Safe for enterprise use. Only consideration: review generated content for copyright/attribution before publishing.",
    },
    downloads: 3,
    rating: 4.1,
    submissionMethod: "template",
    submittedAt: "2026-02-15T11:30:00Z",
  },
  {
    id: "7",
    title: "Outlook API",
    author: "byungkyu",
    version: "1.0.3",
    description:
      "Microsoft Outlook API integration with managed OAuth. Read, send, and manage emails, folders, calendar events, and contacts via Microsoft Graph.",
    tags: ["outlook", "email", "calendar", "microsoft-graph"],
    category: "Integration",
    markdownContent: `# Outlook

Access the Microsoft Outlook API (via Microsoft Graph) with managed OAuth authentication. Read, send, and manage emails, folders, calendar events, and contacts.

## Quick Start

\`\`\`bash
# Get user profile
python <<'EOF'
import urllib.request, os, json
req = urllib.request.Request('https://gateway.maton.ai/outlook/v1.0/me')
req.add_header('Authorization', f'Bearer {os.environ["MATON_API_KEY"]}')
print(json.dumps(json.load(urllib.request.urlopen(req)), indent=2))
EOF
\`\`\`

## Base URL

\`\`\`
https://gateway.maton.ai/outlook/{native-api-path}
\`\`\`

The gateway proxies requests to \`graph.microsoft.com\` and automatically injects your OAuth token.

## Authentication

\`\`\`
Authorization: Bearer $MATON_API_KEY
\`\`\`

## API Reference

### Messages

\`\`\`bash
GET /outlook/v1.0/me/messages
GET /outlook/v1.0/me/messages/{messageId}
POST /outlook/v1.0/me/sendMail
PATCH /outlook/v1.0/me/messages/{messageId}
DELETE /outlook/v1.0/me/messages/{messageId}
POST /outlook/v1.0/me/messages/{messageId}/move
\`\`\`

### Calendar

\`\`\`bash
GET /outlook/v1.0/me/calendar/events
POST /outlook/v1.0/me/calendar/events
DELETE /outlook/v1.0/me/events/{eventId}
\`\`\`

### Contacts

\`\`\`bash
GET /outlook/v1.0/me/contacts
POST /outlook/v1.0/me/contacts
DELETE /outlook/v1.0/me/contacts/{contactId}
\`\`\`

## Query Parameters

- \`$top=10\` — Limit results
- \`$filter=isRead eq false\` — Filter results
- \`$orderby=receivedDateTime desc\` — Sort results
- \`$search="keyword"\` — Search content

## Error Handling

| Status | Meaning |
| --- | --- |
| 400 | Missing Outlook connection |
| 401 | Invalid or missing Maton API key |
| 429 | Rate limited (10 req/sec) |`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 82,
        explanation:
          "No curl|bash, eval, or obfuscated scripts. Python urllib snippets are straightforward. All calls go to documented Maton endpoints. However, email data (potentially containing PII and sensitive business communications) is routed through a third-party proxy (Maton).",
      },
      credentials: {
        score: 88,
        explanation:
          "Single MATON_API_KEY environment variable is properly declared and used. Proportionate to a gateway-based OAuth integration. No credentials printed to stdout or written to disk. The key is sensitive as it grants access to email/calendar/contacts.",
      },
      compatibility: {
        score: 90,
        explanation:
          "Instruction-only skill with no install spec or code files. Only requires Python (standard) and outbound HTTPS to Maton. No sudo, no system modifications, no privileged access needed.",
      },
      quality: {
        score: 86,
        explanation:
          "Clean API reference covering mail, calendar, and contacts. OData query parameter documentation is helpful. Connection management is clear. Could improve by documenting what Microsoft Graph scopes are requested during OAuth.",
      },
      networkEgress: {
        score: 75,
        explanation:
          "All outbound calls go to gateway.maton.ai and ctrl.maton.ai (documented). Both download and upload operations: GET for reads, POST for sending emails, creating events. Email content and calendar data are transmitted through Maton's proxy. Maton stores OAuth tokens — review their privacy/security policy.",
      },
      summary:
        "Internally consistent Microsoft Graph proxy via Maton. Single API key is proportionate. Key concern: sensitive email/calendar data routes through a third-party service. Verify Maton's privacy policy and limit OAuth scopes. Consider disabling autonomous model invocation to prevent unattended email access.",
    },
    downloads: 8,
    rating: 4.3,
    submissionMethod: "upload",
    submittedAt: "2026-01-25T13:00:00Z",
  },
  {
    id: "8",
    title: "Ontology",
    author: "oswalpalash",
    version: "0.1.2",
    description:
      "Typed knowledge graph for structured agent memory and composable skills. Use when creating/querying entities, linking related objects, enforcing constraints, or when skills need to share state.",
    tags: ["knowledge-graph", "memory", "ontology", "agent-state"],
    category: "Knowledge Management",
    markdownContent: `# Ontology

A typed vocabulary + constraint system for representing knowledge as a verifiable graph.

## Core Concept

Everything is an **entity** with a **type**, **properties**, and **relations** to other entities. Every mutation is validated against type constraints before committing.

\`\`\`
Entity: { id, type, properties, relations, created, updated }
Relation: { from_id, relation_type, to_id, properties }
\`\`\`

## When to Use

| Trigger | Action |
| --- | --- |
| "Remember that..." | Create/update entity |
| "What do I know about X?" | Query graph |
| "Link X to Y" | Create relation |
| "Show all tasks for project Z" | Graph traversal |
| "What depends on X?" | Dependency query |

## Core Types

\`\`\`yaml
Person: { name, email?, phone?, notes? }
Organization: { name, type?, members[] }
Project: { name, status, goals[], owner? }
Task: { title, status, due?, priority?, assignee?, blockers[] }
Event: { title, start, end?, location?, attendees[] }
Document: { title, path?, url?, summary? }
Credential: { service, secret_ref }  # Never store secrets directly
\`\`\`

## Storage

Default: \`memory/ontology/graph.jsonl\`

\`\`\`jsonl
{"op":"create","entity":{"id":"p_001","type":"Person","properties":{"name":"Alice"}}}
{"op":"relate","from":"proj_001","rel":"has_owner","to":"p_001"}
\`\`\`

## Workflows

### Create Entity

\`\`\`bash
python3 scripts/ontology.py create --type Person --props '{"name":"Alice","email":"alice@example.com"}'
\`\`\`

### Query

\`\`\`bash
python3 scripts/ontology.py query --type Task --where '{"status":"open"}'
python3 scripts/ontology.py get --id task_001
python3 scripts/ontology.py related --id proj_001 --rel has_task
\`\`\`

### Validate

\`\`\`bash
python3 scripts/ontology.py validate  # Check all constraints
\`\`\`

## Constraints

Defined in \`memory/ontology/schema.yaml\` with type validation, enum enforcement, forbidden properties, relation cardinality, and acyclicity checks.

## Skill Contract

Skills using ontology declare what types they read/write, preconditions, and postconditions.`,
    bashScript: `#!/usr/bin/env python3
"""Ontology CLI — typed knowledge graph for agent memory."""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

GRAPH_FILE = os.environ.get("ONTOLOGY_GRAPH", "memory/ontology/graph.jsonl")

def ensure_storage():
    Path(GRAPH_FILE).parent.mkdir(parents=True, exist_ok=True)
    Path(GRAPH_FILE).touch(exist_ok=True)

def load_graph():
    ensure_storage()
    entities = {}
    relations = []
    with open(GRAPH_FILE) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            op = json.loads(line)
            if op["op"] == "create":
                entities[op["entity"]["id"]] = op["entity"]
            elif op["op"] == "update":
                if op["entity"]["id"] in entities:
                    entities[op["entity"]["id"]]["properties"].update(
                        op["entity"].get("properties", {})
                    )
            elif op["op"] == "delete":
                entities.pop(op.get("id"), None)
            elif op["op"] == "relate":
                relations.append({
                    "from": op["from"],
                    "rel": op["rel"],
                    "to": op["to"],
                    "properties": op.get("properties", {})
                })
    return entities, relations

def append_op(op):
    ensure_storage()
    with open(GRAPH_FILE, "a") as f:
        f.write(json.dumps(op) + "\\n")

def create_entity(type_name, props):
    eid = f"{type_name.lower()}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    entity = {"id": eid, "type": type_name, "properties": props,
              "created": datetime.now().isoformat(), "updated": datetime.now().isoformat()}
    append_op({"op": "create", "entity": entity})
    return entity

def query_entities(type_name=None, where=None):
    entities, _ = load_graph()
    results = []
    for e in entities.values():
        if type_name and e["type"] != type_name:
            continue
        if where:
            match = all(e["properties"].get(k) == v for k, v in where.items())
            if not match:
                continue
        results.append(e)
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: ontology.py <create|query|get|relate|validate|list>")
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "list":
        entities, relations = load_graph()
        print(json.dumps({"entities": len(entities), "relations": len(relations)}))
    else:
        print(f"Command: {cmd}")`,
    status: "approved",
    evaluationScores: {
      security: {
        score: 85,
        explanation:
          "The Python script performs only local file operations (read/write JSONL). No eval, no subprocess calls, no network access, no obfuscated code. Uses json.loads for parsing (safe). Path handling should be reviewed to confirm resolve_safe_path prevents directory traversal. Append-only design is good for auditability.",
      },
      credentials: {
        score: 95,
        explanation:
          "No credentials required. The schema explicitly forbids storing secrets directly (uses secret_ref pattern instead). No environment variables needed beyond optional ONTOLOGY_GRAPH path. Excellent credential hygiene.",
      },
      compatibility: {
        score: 88,
        explanation:
          "Requires only Python 3 (standard). No install spec, no third-party packages, no sudo, no system modifications. Writes only to its own workspace directory (memory/ontology/). Works in locked-down environments. No privileged access needed.",
      },
      quality: {
        score: 90,
        explanation:
          "Well-designed type system with clear constraints, validation, and schema enforcement. Append-only JSONL storage provides auditability. Skill contract pattern for cross-skill communication is thoughtful. Good separation of concerns.",
      },
      networkEgress: {
        score: 97,
        explanation:
          "Purely local operation. No outbound network calls whatsoever. All data stays in the local filesystem (memory/ontology/graph.jsonl). No telemetry, no webhooks, no analytics. Fully offline-capable.",
      },
      summary:
        "High-quality, low-risk knowledge graph skill with excellent security posture. No credentials, no network access, append-only local storage. Only recommendation: review path handling in the full scripts/ontology.py for directory traversal prevention, and consider access controls if multiple skills read the ontology.",
    },
    downloads: 19,
    rating: 4.4,
    submissionMethod: "upload",
    submittedAt: "2026-02-05T09:00:00Z",
  },
];
