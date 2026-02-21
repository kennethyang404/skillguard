import { Skill } from "./types";

export const CATEGORIES = [
  "Communication",
  "Productivity",
  "DevOps",
  "Data & Knowledge",
  "Security",
  "Documentation",
  "Media",
];

export const initialSkills: Skill[] = [
  {
    id: "1",
    title: "Slack",
    author: "steipete",
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

## Actions

### React to a message
\`\`\`json
{ "action": "react", "channelId": "C123", "messageId": "1712023032.1234", "emoji": "✅" }
\`\`\`

### Send a message
\`\`\`json
{ "action": "sendMessage", "to": "channel:C123", "content": "Hello from Clawdbot" }
\`\`\`

### Edit / Delete / Read / Pin / Unpin / List Pins / Member Info / Emoji List
See full SKILL.md for all action schemas.

## Ideas to try
- React with ✅ to mark completed tasks.
- Pin key decisions or weekly status updates.`,
    status: "pending",
    evaluationScores: {
      purposeCapability: {
        score: 30,
        explanation:
          "Name/description and the SKILL.md actions (react, send/edit/delete messages, pins, member info, emoji list) are consistent with a Slack control skill. However, the instructions explicitly reference using a 'slack' tool and 'the bot token configured for Clawdbot' while the registry metadata lists no required binaries or environment variables — the skill expects access that it does not declare.",
      },
      instructionScope: {
        score: 15,
        explanation:
          "SKILL.md limits behavior to Slack operations and does not ask to read local files or unrelated env vars. That scope is appropriate, but it relies on an externally configured bot token and a 'slack' tool present in the agent environment; those implicit dependencies widen the runtime surface without being documented.",
      },
      installMechanism: {
        score: 5,
        explanation:
          "Instruction-only skill with no install spec or code files — lowest install risk. Nothing is written to disk by the skill itself based on provided metadata.",
      },
      credentials: {
        score: 55,
        explanation:
          "The skill will need a Slack bot token and a usable Slack CLI/tool to operate, but requires.env and primary credential are empty. Not declaring the token or tool is a proportionality problem: users can't see what secrets will be used or by whom.",
      },
      persistencePrivilege: {
        score: 8,
        explanation:
          "always is false and the skill does not request persistent system-wide changes. The agent can invoke the skill autonomously (default), which is expected for an integration that controls Slack.",
      },
      summary:
        "This skill appears to do what it says (control Slack), but it fails to declare two important runtime dependencies: the 'slack' CLI/tool and the Slack bot token it will use. Verify where the bot token comes from and who controls it before installing.",
    },
    downloads: 198,
    rating: 4.5,
    submissionMethod: "upload",
    submittedAt: "2026-02-10T10:30:00Z",
  },
  {
    id: "2",
    title: "YouTube",
    author: "byungkyu",
    version: "1.0.3",
    description:
      "YouTube Data API integration with managed OAuth. Search videos, manage playlists, access channel data, and interact with comments.",
    tags: ["youtube", "api", "video", "oauth"],
    category: "Media",
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
\`https://gateway.maton.ai/youtube/{native-api-path}\`

## Authentication
All requests require: \`Authorization: Bearer $MATON_API_KEY\`

## Connection Management
Manage your Google OAuth connections at \`https://ctrl.maton.ai\`.`,
    status: "approved",
    evaluationScores: {
      purposeCapability: {
        score: 10,
        explanation:
          "Name and description describe a YouTube Data API integration and the skill only requires MATON_API_KEY and network access to Maton endpoints (gateway.maton.ai, ctrl.maton.ai). Those requirements are proportionate to a managed-OAuth proxy for YouTube.",
      },
      instructionScope: {
        score: 12,
        explanation:
          "SKILL.md instructs the agent to call Maton gateway and control endpoints and to open Maton-provided OAuth URLs. It does not instruct reading unrelated files or environment variables. All network calls are to the Maton service.",
      },
      installMechanism: {
        score: 5,
        explanation:
          "No install spec or code files (instruction-only). This minimizes on-disk risk; nothing is downloaded or written by an installer.",
      },
      credentials: {
        score: 10,
        explanation:
          "Only a single environment variable (MATON_API_KEY) is required. That is consistent: Maton handles OAuth and the API key is the expected bearer credential for Maton's gateway.",
      },
      persistencePrivilege: {
        score: 5,
        explanation:
          "always is false and the skill requests no special persistent agent privileges or filesystem/config modifications. Model-invocation is allowed (default), which is normal for an invocable skill.",
      },
      summary:
        "This skill appears internally consistent for using a Maton-managed YouTube proxy. Verify you trust Maton (maton.ai) and the skill publisher. Review Maton's privacy/security policy and how it stores OAuth tokens.",
    },
    downloads: 13,
    rating: 4.2,
    submissionMethod: "upload",
    submittedAt: "2026-01-20T14:15:00Z",
  },
  {
    id: "3",
    title: "Gog",
    author: "steipete",
    version: "1.0.0",
    description:
      "Google Workspace CLI for Gmail, Calendar, Drive, Contacts, Sheets, and Docs.",
    tags: ["google", "gmail", "calendar", "drive", "sheets"],
    category: "Productivity",
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
- Docs export: \`gog docs export <docId> --format txt --out /tmp/doc.txt\`

## Notes
- Set \`GOG_ACCOUNT=you@gmail.com\` to avoid repeating \`--account\`.
- Confirm before sending mail or creating events.`,
    status: "pending",
    evaluationScores: {
      purposeCapability: {
        score: 28,
        explanation:
          "The SKILL.md describes a Google Workspace CLI and its commands — purpose aligns with actions shown. However the registry metadata lists no required binaries or install spec, while the SKILL.md includes metadata that requires the 'gog' binary and even provides a Homebrew formula. This mismatch is an inconsistency worth verifying.",
      },
      instructionScope: {
        score: 12,
        explanation:
          "Instructions stay on-topic: OAuth setup with a client_secret.json, add an account and run Gmail/Calendar/Drive/Sheets/Docs commands. They require running a local CLI and providing OAuth credentials but do not instruct the agent to read unrelated system files or exfiltrate data.",
      },
      installMechanism: {
        score: 40,
        explanation:
          "There is no install spec in the registry listing, yet SKILL.md metadata includes a Homebrew install entry (steipete/tap/gogcli). Installing a third-party Homebrew tap is moderately risky if you don't trust its source; the registry's omission of the install step is an incoherence.",
      },
      credentials: {
        score: 30,
        explanation:
          "No environment variables or primary credentials are declared in the registry, but the SKILL.md requires OAuth credentials (client_secret.json) and suggests setting GOG_ACCOUNT. These are sensitive and the lack of declared credentials in the registry metadata is an omission.",
      },
      persistencePrivilege: {
        score: 8,
        explanation:
          "The skill does not request always:true and does not declare persistent system-wide changes. It is user-invocable and allows autonomous invocation by default.",
      },
      summary:
        "This skill appears to be a wrapper for the 'gog' CLI and legitimately needs OAuth credentials and a local binary. The SKILL.md and registry metadata disagree about install/requirements — ask the publisher to clarify.",
    },
    downloads: 495,
    rating: 4.6,
    submissionMethod: "upload",
    submittedAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "4",
    title: "Weather",
    author: "steipete",
    version: "1.0.0",
    description:
      "Get current weather and forecasts (no API key required).",
    tags: ["weather", "curl", "api-free"],
    category: "Productivity",
    markdownContent: `# Weather

Two free services, no API keys needed.

## wttr.in (primary)

Quick one-liner:
\`\`\`bash
curl -s "wttr.in/London?format=3"
# Output: London: ⛅️ +8°C
\`\`\`

Full forecast:
\`\`\`bash
curl -s "wttr.in/London?T"
\`\`\`

Tips:
- URL-encode spaces: \`wttr.in/New+York\`
- Units: \`?m\` (metric) \`?u\` (USCS)
- PNG: \`curl -s "wttr.in/Berlin.png" -o /tmp/weather.png\`

## Open-Meteo (fallback, JSON)

\`\`\`bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
\`\`\`

Docs: https://open-meteo.com/en/docs`,
    status: "approved",
    evaluationScores: {
      purposeCapability: {
        score: 15,
        explanation:
          "Name/description claim 'no API key required' and the instructions call only to wttr.in and open-meteo (both free/no-key). However, SKILL.md metadata lists curl as a required binary while the registry metadata shows 'Required binaries: none' — a small inconsistency.",
      },
      instructionScope: {
        score: 5,
        explanation:
          "SKILL.md only instructs making HTTP requests to wttr.in and open-meteo and saving an optional PNG to /tmp; it does not instruct reading unrelated files, accessing credentials, or sending data to unexpected endpoints.",
      },
      installMechanism: {
        score: 5,
        explanation:
          "No install spec and no code files — instruction-only skill. This minimizes disk footprint and is appropriate for a curl-based weather helper.",
      },
      credentials: {
        score: 3,
        explanation:
          "The skill requests no environment variables or credentials, which is proportionate to its function. (curl availability is the only operational dependency.)",
      },
      persistencePrivilege: {
        score: 3,
        explanation:
          "always:false and no special persistence requested. The skill can be invoked autonomously by the agent per platform defaults, but it does not request elevated or permanent privileges.",
      },
      summary:
        "This skill uses curl to fetch weather from wttr.in and Open-Meteo and does not request any keys or install software. Benign with high confidence.",
    },
    downloads: 344,
    rating: 4.8,
    submissionMethod: "upload",
    submittedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "5",
    title: "Summarize",
    author: "steipete",
    version: "1.0.0",
    description:
      "Summarize URLs or files with the summarize CLI (web, PDFs, images, audio, YouTube).",
    tags: ["summarize", "cli", "llm", "youtube"],
    category: "Productivity",
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

## Useful flags
- \`--length short|medium|long|xl|xxl|<chars>\`
- \`--extract-only\` (URLs only)
- \`--json\` (machine readable)
- \`--firecrawl auto|off|always\` (fallback extraction)
- \`--youtube auto\` (Apify fallback if \`APIFY_API_TOKEN\` set)

## Config
Optional config file: \`~/.summarize/config.json\`
Optional services: \`FIRECRAWL_API_KEY\`, \`APIFY_API_TOKEN\``,
    status: "approved",
    evaluationScores: {
      purposeCapability: {
        score: 18,
        explanation:
          "The name/description (summarize URLs/files/YouTube) matches what the instructions do: call the external 'summarize' CLI and send content to LLM providers. However, registry metadata listed no required binaries while the SKILL.md metadata declares a required 'summarize' binary — a mismatch.",
      },
      instructionScope: {
        score: 8,
        explanation:
          "Runtime instructions simply show how to invoke the summarize CLI, specify provider API keys, and optional fallback tokens (FIRECRAWL/APIFY). The SKILL.md does not instruct the agent to read unrelated files or system credentials.",
      },
      installMechanism: {
        score: 28,
        explanation:
          "There is no packaged install in the registry, but the SKILL.md metadata suggests installing a brew formula from steipete/tap/summarize. Installing from a third-party brew tap is common but carries more trust risk than an official formula.",
      },
      credentials: {
        score: 12,
        explanation:
          "Requested environment variables are API keys for LLM providers (OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.) and optional service keys (FIRECRAWL_API_KEY, APIFY_API_TOKEN). These are proportionate to a tool that extracts content and forwards it to models.",
      },
      persistencePrivilege: {
        score: 5,
        explanation:
          "Skill is instruction-only, does not request permanent presence (always:false), and does not claim to modify other skills or system-wide settings.",
      },
      summary:
        "This skill is an instruction-only wrapper that expects the external 'summarize' CLI. Benign with high confidence. Ensure you trust the brew tap source before installing.",
    },
    downloads: 463,
    rating: 4.7,
    submissionMethod: "upload",
    submittedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "6",
    title: "Twitter",
    author: "blueberrywoodsym",
    version: "1.0.6",
    description:
      "Write viral, persuasive, engaging tweets and threads. Uses web research to find viral examples in your niche, then models writing based on proven formulas.",
    tags: ["twitter", "x", "social-media", "copywriting"],
    category: "Communication",
    markdownContent: `# Tweet Writer Skill

## Overview
This skill helps you write viral, persuasive tweets and threads optimized for X's algorithm. It combines proven copywriting frameworks, viral hook formulas, and real-time research.

## Process Workflow

### Phase 1: Niche Research (CRITICAL)
Before writing ANY tweet, research viral examples in the user's specific niche using WebSearch.

### Phase 2: Tweet Creation
Use frameworks: Bold Statement, Specific Result, Curiosity Gap, Question Hook.

## The X Algorithm (2026)
### Engagement Hierarchy
1. Replies — Most weighted signal
2. Quote tweets — High value
3. Bookmarks — Strong signal of value
4. Retweets — Amplification
5. Likes — Baseline

### Tips
- First hour is critical for traction
- Threads naturally increase dwell time
- Native video gets priority over external links
- Avoid asking for engagement ("Like and RT" hurts reach)`,
    status: "approved",
    evaluationScores: {
      purposeCapability: {
        score: 5,
        explanation:
          "Name/description (tweet/threads authoring) aligns with the SKILL.md: all instructions describe researching viral examples and applying copy frameworks. The skill does not ask for unrelated credentials or binaries.",
      },
      instructionScope: {
        score: 5,
        explanation:
          "Runtime instructions only direct the agent to perform web searches, analyze public tweets, and craft copy. They do not ask the agent to read local files, access unrelated env vars, or transmit data to third-party endpoints.",
      },
      installMechanism: {
        score: 3,
        explanation:
          "No install spec or code files are provided (instruction-only). Nothing will be downloaded or written to disk by the skill itself.",
      },
      credentials: {
        score: 3,
        explanation:
          "The skill declares no required environment variables, credentials, or config paths. That is proportional to the stated purpose (writing and web research).",
      },
      persistencePrivilege: {
        score: 3,
        explanation:
          "always is false and model invocation is not disabled (normal defaults). The skill does not request persistent privileges or attempt to modify other skills.",
      },
      summary:
        "This is an instruction-only skill that coherently documents how to research and write viral X/Twitter content and requests no installs, credentials, or system access. Benign with high confidence.",
    },
    downloads: 3,
    rating: 4.0,
    submissionMethod: "upload",
    submittedAt: "2026-02-19T11:30:00Z",
  },
  {
    id: "7",
    title: "Outlook",
    author: "byungkyu",
    version: "1.0.3",
    description:
      "Microsoft Outlook API integration with managed OAuth. Read, send, and manage emails, folders, calendar events, and contacts via Microsoft Graph.",
    tags: ["outlook", "email", "calendar", "microsoft", "oauth"],
    category: "Productivity",
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
\`https://gateway.maton.ai/outlook/{native-api-path}\`

## Authentication
All requests require: \`Authorization: Bearer $MATON_API_KEY\`

## Connection Management
Manage your Microsoft OAuth connections at \`https://ctrl.maton.ai\`.`,
    status: "approved",
    evaluationScores: {
      purposeCapability: {
        score: 8,
        explanation:
          "The name/description say Microsoft Graph (Outlook) via a managed OAuth gateway, and the skill only requires MATON_API_KEY and references maton endpoints. There are no unrelated env vars, binaries, or install steps.",
      },
      instructionScope: {
        score: 8,
        explanation:
          "SKILL.md contains explicit HTTP examples using the Maton gateway and only references the MATON_API_KEY environment variable. It does not instruct reading unrelated files or other environment variables.",
      },
      installMechanism: {
        score: 3,
        explanation:
          "Instruction-only skill with no install spec and no code files — nothing is written to disk or pulled from external URLs during install.",
      },
      credentials: {
        score: 10,
        explanation:
          "Only one required environment variable (MATON_API_KEY) is declared and used. This is proportionate to a gateway-based OAuth integration, but the key is sensitive because it grants access to email/calendar/contacts via Maton.",
      },
      persistencePrivilege: {
        score: 15,
        explanation:
          "Skill does not set always:true (good) but also does not set disableModelInvocation, so by default the model could call the skill autonomously if the key is present in the agent environment.",
      },
      summary:
        "This skill appears internally consistent: it proxies Microsoft Graph through Maton and needs a single MATON_API_KEY. Benign with high confidence.",
    },
    downloads: 8,
    rating: 4.1,
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
    tags: ["knowledge-graph", "memory", "ontology", "agent"],
    category: "Data & Knowledge",
    markdownContent: `# Ontology

A typed vocabulary + constraint system for representing knowledge as a verifiable graph.

## Core Concept
Everything is an **entity** with a **type**, **properties**, and **relations** to other entities.

\`\`\`
Entity: { id, type, properties, relations, created, updated }
Relation: { from_id, relation_type, to_id, properties }
\`\`\`

## When to Use
| Trigger | Action |
|---------|--------|
| "Remember that..." | Create/update entity |
| "What do I know about X?" | Query graph |
| "Link X to Y" | Create relation |
| Planning multi-step work | Model as graph transformations |

## Core Types
Person, Organization, Project, Task, Goal, Event, Location, Document, Message, Note, Account, Credential (secret_ref only), Action, Policy.

## Storage
Default: \`memory/ontology/graph.jsonl\` (append-only JSONL)

## Workflows
\`\`\`bash
python3 scripts/ontology.py create --type Person --props '{"name":"Alice"}'
python3 scripts/ontology.py query --type Task --where '{"status":"open"}'
python3 scripts/ontology.py relate --from proj_001 --rel has_task --to task_001
python3 scripts/ontology.py validate
\`\`\``,
    status: "approved",
    evaluationScores: {
      purposeCapability: {
        score: 8,
        explanation:
          "Name/description (typed knowledge graph for agent memory) align with the included SKILL.md and the Python script: it implements entity CRUD, relations, queries, validation, and a local append-only JSONL storage.",
      },
      instructionScope: {
        score: 18,
        explanation:
          "Runtime instructions operate on a local graph file and describe migrations to SQLite; they do not instruct network calls or secret exfiltration. The docs do reference local file paths and secret references — storing paths/metadata is expected, but be aware other skills that read the ontology could access those paths.",
      },
      installMechanism: {
        score: 5,
        explanation:
          "No install spec; the skill is instruction-only with an included script. Nothing is downloaded or executed during install, so install risk is low.",
      },
      credentials: {
        score: 5,
        explanation:
          "The skill requests no environment variables, no credentials, and no config paths. The schema explicitly forbids storing secrets directly (uses secret_ref), which is appropriate.",
      },
      persistencePrivilege: {
        score: 5,
        explanation:
          "always:false and normal model invocation settings. The skill writes only to its own graph storage (by default under memory/ontology) and does not attempt to install itself or elevate privileges.",
      },
      summary:
        "This skill appears coherent for a local, file-backed ontology used as agent memory. Benign with medium confidence — a quick code review is recommended to confirm safe path handling.",
    },
    downloads: 19,
    rating: 4.3,
    submissionMethod: "upload",
    submittedAt: "2026-02-15T16:45:00Z",
  },
];
