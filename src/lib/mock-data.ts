import { Skill } from "./types";

export const CATEGORIES = [
  "Code Generation",
  "Data Analysis",
  "Documentation",
  "Testing",
  "DevOps",
  "Security",
  "Communication",
];

export const initialSkills: Skill[] = [
  {
    id: "1",
    title: "Code Review Assistant",
    author: "Sarah Chen",
    version: "1.2.0",
    description: "Automatically reviews pull requests for code quality, security issues, and best practices compliance.",
    tags: ["code-review", "quality", "automation"],
    category: "Code Generation",
    markdownContent: `# Code Review Assistant

## Goal
Automatically review pull requests for code quality, security vulnerabilities, and adherence to team coding standards.

## When to Use
- When a new pull request is opened
- When existing PR code is updated
- During scheduled code audits

## Input / Output
**Input:** Pull request diff, repository coding standards document
**Output:** Structured review with inline comments, severity ratings, and suggested fixes

## Procedure
1. Parse the pull request diff to identify changed files
2. Analyze each change against the coding standards
3. Check for common security vulnerabilities (SQL injection, XSS, etc.)
4. Evaluate code complexity and suggest simplifications
5. Generate inline comments with severity levels (info, warning, error)
6. Produce a summary report with overall quality score

## Verification
- All flagged issues should reference specific lines in the diff
- Security checks should cover OWASP Top 10
- False positive rate should be below 5%`,
    status: "approved",
    evaluationScores: {
      security: { score: 92, explanation: "No injection vectors or unsafe execution patterns detected. Properly scopes access to PR diffs only. No curl|bash or remote code execution." },
      credentials: { score: 95, explanation: "No credential handling in the skill itself. Does not ask users to paste API keys. Relies on platform-managed Git authentication." },
      compatibility: { score: 88, explanation: "Works with major Git platforms (GitHub, GitLab, Bitbucket). Some edge cases with monorepo setups may require additional configuration. No sudo or privileged access required." },
      quality: { score: 95, explanation: "Comprehensive procedure with clear verification criteria. Covers OWASP Top 10 and maintains a low false-positive target. Well-structured output format." },
      networkEgress: { score: 90, explanation: "Read-only access to Git platform APIs. No outbound data uploads detected. All network actions are download-only against documented endpoints." },
      summary: "A high-quality, production-ready skill with excellent security awareness and thorough verification steps. Minor improvements possible in enterprise monorepo compatibility.",
    },
    downloads: 1247,
    rating: 4.7,
    submissionMethod: "template",
    submittedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "API Documentation Generator",
    author: "Marcus Johnson",
    version: "2.0.1",
    description: "Generates comprehensive API documentation from code annotations and OpenAPI specs.",
    tags: ["documentation", "api", "openapi"],
    category: "Documentation",
    markdownContent: `# API Documentation Generator

## Goal
Generate comprehensive, developer-friendly API documentation from source code annotations and OpenAPI specifications.

## When to Use
- After API endpoints are created or modified
- During release preparation
- When onboarding new team members to an API

## Input / Output
**Input:** Source code with annotations, OpenAPI/Swagger spec files
**Output:** Rendered HTML documentation with interactive examples, markdown files

## Procedure
1. Scan source files for API route annotations
2. Parse OpenAPI specification if available
3. Merge code annotations with spec data
4. Generate request/response examples for each endpoint
5. Create navigation structure grouped by resource
6. Output documentation in requested format (HTML, Markdown)

## Verification
- Every documented endpoint must have at least one example
- Response schemas must match actual API responses
- Links and cross-references must resolve correctly`,
    status: "approved",
    evaluationScores: {
      security: { score: 85, explanation: "Handles source code parsing safely. No execution of user code. Potential risk if OpenAPI specs contain malicious payloads—recommend input sanitization." },
      credentials: { score: 90, explanation: "Does not request or handle credentials directly. No secrets printed to stdout or written to disk." },
      compatibility: { score: 94, explanation: "Supports OpenAPI 3.x, Swagger 2.0, and common annotation formats. No privileged access required. Works in standard dev environments." },
      quality: { score: 91, explanation: "Strong output quality with interactive examples. Schema validation ensures accuracy. Could improve by adding versioned documentation support." },
      networkEgress: { score: 88, explanation: "Downloads spec files from local or configured endpoints. No data upload behavior detected. Documentation output stays local." },
      summary: "Reliable documentation generator with broad framework support. Security posture is solid with minor input validation recommendations.",
    },
    downloads: 892,
    rating: 4.5,
    submissionMethod: "upload",
    submittedAt: "2026-01-20T14:15:00Z",
  },
  {
    id: "3",
    title: "Test Suite Generator",
    author: "Aisha Patel",
    version: "1.0.0",
    description: "Generates unit and integration tests from function signatures and docstrings.",
    tags: ["testing", "unit-tests", "automation"],
    category: "Testing",
    markdownContent: `# Test Suite Generator

## Goal
Automatically generate comprehensive unit and integration tests from function signatures, docstrings, and usage patterns.

## When to Use
- When new functions or modules are created
- When test coverage falls below threshold
- During refactoring to ensure behavior preservation

## Input / Output
**Input:** Source code files, coverage reports, existing test patterns
**Output:** Test files with unit and integration tests, coverage improvement report

## Procedure
1. Analyze function signatures and type annotations
2. Extract expected behavior from docstrings
3. Identify edge cases from parameter types
4. Generate test cases covering happy path and edge cases
5. Create mock objects for external dependencies
6. Write assertions based on documented return types

## Verification
- Generated tests must compile and run without errors
- Coverage improvement must be measurable
- No duplicate tests should be generated`,
    status: "approved",
    evaluationScores: {
      security: { score: 78, explanation: "Test generation is sandboxed but mock object creation could inadvertently expose internal APIs. Recommend restricting mock scope to declared interfaces." },
      credentials: { score: 92, explanation: "No credential handling required. Mock objects do not reference real secrets or environment variables." },
      compatibility: { score: 92, explanation: "Supports Jest, Vitest, Mocha, and pytest. TypeScript and Python type annotations are well-utilized for test inference." },
      quality: { score: 87, explanation: "Good coverage of happy-path and edge cases. Could improve by detecting integration boundaries and generating contract tests." },
      networkEgress: { score: 95, explanation: "Purely local operation. No network calls detected in the skill definition or expected bash behavior." },
      summary: "Solid test generation skill with good multi-framework support. Security could be tightened around mock object scoping.",
    },
    downloads: 634,
    rating: 4.3,
    submissionMethod: "template",
    submittedAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "4",
    title: "Infrastructure Drift Detector",
    author: "Tom Williams",
    version: "0.9.0",
    description: "Detects configuration drift between IaC definitions and actual cloud infrastructure state.",
    tags: ["devops", "infrastructure", "drift-detection"],
    category: "DevOps",
    markdownContent: `# Infrastructure Drift Detector

## Goal
Detect and report discrepancies between Infrastructure as Code definitions and the actual state of cloud resources.

## When to Use
- On a scheduled basis (daily/weekly)
- Before applying infrastructure changes
- After manual cloud console modifications

## Input / Output
**Input:** Terraform/CloudFormation state files, cloud provider API access
**Output:** Drift report with affected resources, severity, and remediation steps

## Procedure
1. Load the declared infrastructure state from IaC files
2. Query cloud provider APIs for actual resource configurations
3. Compare declared vs actual state for each resource
4. Classify drifts by severity (cosmetic, functional, security)
5. Generate remediation suggestions
6. Alert on critical security-related drifts

## Verification
- All resource types in the IaC should be checked
- Drift detection must not modify any resources
- Reports must include timestamps and resource identifiers`,
    status: "pending",
    evaluationScores: {
      security: { score: 88, explanation: "Read-only cloud API access with no resource modification risk. No curl|bash patterns. Drift scans are non-destructive." },
      credentials: { score: 72, explanation: "Requires cloud provider API keys. SKILL.md mentions environment variables but doesn't explicitly document which secret manager to use. Should clarify credential storage." },
      compatibility: { score: 75, explanation: "Currently supports AWS and Terraform only. Azure and GCP support is planned but not yet implemented, limiting enterprise adoption. No sudo required." },
      quality: { score: 82, explanation: "Good drift classification by severity. Remediation suggestions are helpful but lack automated fix options. Report format is clear." },
      networkEgress: { score: 68, explanation: "Makes outbound API calls to cloud providers (AWS APIs). Endpoints are documented but the data sent in API requests (resource identifiers, account info) is not fully disclosed in SKILL.md." },
      summary: "Promising DevOps skill with strong security posture. Limited cloud provider support and incomplete credential/network egress documentation are the main gaps.",
    },
    downloads: 0,
    rating: 0,
    submissionMethod: "upload",
    submittedAt: "2026-02-18T16:45:00Z",
  },
  {
    id: "5",
    title: "Sensitive Data Scanner",
    author: "Elena Rodriguez",
    version: "1.1.0",
    description: "Scans codebases and configs for accidentally committed secrets, tokens, and PII.",
    tags: ["security", "secrets", "compliance"],
    category: "Security",
    markdownContent: `# Sensitive Data Scanner

## Goal
Scan repositories for accidentally committed secrets, API tokens, passwords, and personally identifiable information.

## When to Use
- On every commit (pre-commit hook)
- During CI/CD pipeline
- For periodic full-repository audits

## Input / Output
**Input:** Repository files, custom regex patterns, known secret formats
**Output:** List of findings with file locations, severity, and recommended actions

## Procedure
1. Scan all files against known secret patterns (AWS keys, JWT tokens, etc.)
2. Check environment and config files for hardcoded credentials
3. Detect PII patterns (emails, SSNs, phone numbers)
4. Cross-reference with .gitignore to flag unignored sensitive files
5. Generate findings report sorted by severity
6. Suggest remediation (rotate key, add to .gitignore, etc.)

## Verification
- Must detect all OWASP-listed secret patterns
- False positive rate below 10%
- Should not flag properly encrypted values`,
    status: "approved",
    evaluationScores: {
      security: { score: 97, explanation: "Excellent coverage of secret patterns including OWASP-listed formats. No unsafe execution, no eval or obfuscated scripts. Pre-commit hook integration prevents accidental commits." },
      credentials: { score: 94, explanation: "Properly handles found credentials as read-only findings. Does not print, store, or transmit discovered secrets. Uses platform auth for repo access." },
      compatibility: { score: 90, explanation: "Works across all major languages and CI/CD platforms. Custom regex pattern support enables organization-specific rules. Minor gaps in binary file scanning. No privileged access needed." },
      quality: { score: 93, explanation: "Thorough procedure with clear severity classification. Remediation suggestions are actionable. Low false-positive target (under 10%) is well-defined and achievable." },
      networkEgress: { score: 96, explanation: "Purely local scanning operation. No outbound network calls. Findings report stays local and is not transmitted to any external service." },
      summary: "Outstanding security skill with near-perfect detection capabilities. The gold standard for secret scanning in enterprise environments.",
    },
    downloads: 2103,
    rating: 4.9,
    submissionMethod: "template",
    submittedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "6",
    title: "Meeting Notes Summarizer",
    author: "David Kim",
    version: "1.0.0",
    description: "Summarizes meeting transcripts into action items, decisions, and key discussion points.",
    tags: ["communication", "summarization", "meetings"],
    category: "Communication",
    markdownContent: `# Meeting Notes Summarizer

## Goal
Transform meeting transcripts into structured summaries with action items, decisions made, and key discussion points.

## When to Use
- After any recorded meeting
- When processing meeting backlog
- For generating weekly team summaries

## Input / Output
**Input:** Meeting transcript (text or audio file)
**Output:** Structured summary with sections for decisions, action items (with owners), and discussion highlights

## Procedure
1. Parse transcript and identify speakers
2. Extract explicit decisions ("we decided to...")
3. Identify action items and assign owners
4. Summarize key discussion topics
5. Flag unresolved questions or parking lot items
6. Format output with consistent structure

## Verification
- All action items must have an assigned owner
- Decisions must be clearly stated, not implied
- Summary should be under 20% of original transcript length`,
    status: "pending",
    evaluationScores: {
      security: { score: 70, explanation: "Processes potentially sensitive meeting content. Lacks explicit sandboxing for transcript parsing. No injection vectors but PII handling is not addressed." },
      credentials: { score: 85, explanation: "No credential handling in the skill itself. However, accessing meeting recordings may require platform tokens—not documented." },
      compatibility: { score: 85, explanation: "Supports text transcripts from major platforms (Zoom, Teams, Meet). Audio file support is limited. No sudo or system modifications required." },
      quality: { score: 80, explanation: "Action item extraction is reliable but decision identification could be more nuanced. Summary length constraint is well-defined." },
      networkEgress: { score: 65, explanation: "May need to access meeting platform APIs to fetch transcripts. Endpoints and data transmitted are not documented in SKILL.md. Needs clarification on what data leaves the system." },
      summary: "Useful communication skill with room for improvement in security (PII handling) and network egress documentation.",
    },
    downloads: 0,
    rating: 0,
    submissionMethod: "template",
    submittedAt: "2026-02-19T11:30:00Z",
  },
  {
    id: "7",
    title: "Data Pipeline Validator",
    author: "Priya Sharma",
    version: "1.3.0",
    description: "Validates data pipeline configurations and checks for data quality issues before deployment.",
    tags: ["data", "validation", "pipeline"],
    category: "Data Analysis",
    markdownContent: `# Data Pipeline Validator

## Goal
Validate data pipeline configurations and perform pre-deployment data quality checks to prevent bad data from reaching production.

## When to Use
- Before deploying pipeline changes
- When adding new data sources
- During scheduled data quality audits

## Input / Output
**Input:** Pipeline configuration files, sample data, schema definitions
**Output:** Validation report with pass/fail status, data quality metrics, and recommendations

## Procedure
1. Parse pipeline configuration for structural validity
2. Validate schema definitions against source data
3. Run data quality checks (nulls, duplicates, range violations)
4. Test transformation logic with sample data
5. Verify output schema matches downstream expectations
6. Generate comprehensive validation report

## Verification
- All schema mismatches must be detected
- Data quality thresholds must be configurable
- Report must include sample failing records`,
    status: "approved",
    evaluationScores: {
      security: { score: 82, explanation: "Data validation is properly sandboxed. No write operations on production data. No eval or arbitrary command execution detected." },
      credentials: { score: 88, explanation: "Database connection strings should use environment variables. Skill does not print credentials but doesn't explicitly mandate secret managers." },
      compatibility: { score: 91, explanation: "Supports common pipeline frameworks (Airflow, dbt, Spark). Schema format support is broad. No privileged access or system modifications required." },
      quality: { score: 89, explanation: "Comprehensive validation checks with configurable thresholds. Sample failing records in reports are very useful for debugging." },
      networkEgress: { score: 86, explanation: "Connects to configured data sources for validation. All endpoints are expected to be internal. No external uploads or telemetry detected." },
      summary: "Well-rounded data quality skill with strong compatibility across pipeline frameworks. Security and quality are both solid.",
    },
    downloads: 456,
    rating: 4.4,
    submissionMethod: "upload",
    submittedAt: "2026-01-25T13:00:00Z",
  },
  {
    id: "8",
    title: "Changelog Composer",
    author: "Alex Turner",
    version: "0.5.0",
    description: "Generates changelogs from git commits and PR descriptions following Keep a Changelog format.",
    tags: ["documentation", "changelog", "git"],
    category: "Documentation",
    markdownContent: `# Changelog Composer

## Goal
Automatically generate well-formatted changelogs from git commit history and pull request descriptions.

## When to Use
- Before each release
- Weekly for continuous deployment projects
- When preparing release notes

## Input / Output
**Input:** Git commit log, merged PR descriptions, previous changelog
**Output:** Formatted changelog following Keep a Changelog specification

## Procedure
1. Fetch commits since last release tag
2. Parse conventional commit messages
3. Group changes by type (Added, Changed, Fixed, Removed)
4. Enrich entries with PR descriptions where available
5. Format according to Keep a Changelog spec
6. Append to existing CHANGELOG.md

## Verification
- All commits since last tag must be represented
- Categories must follow conventional commit types
- Breaking changes must be prominently highlighted`,
    status: "rejected",
    evaluationScores: {
      security: { score: 65, explanation: "Git history access is read-only but lacks authentication safeguards for private repositories. No input validation for commit messages that could contain injection payloads." },
      credentials: { score: 58, explanation: "Private repo access credentials are not documented. Unclear whether Git tokens are handled via env vars or passed directly. Over-requests repo access scope." },
      compatibility: { score: 60, explanation: "Only supports conventional commit format. Repositories using other commit conventions will produce incomplete changelogs. Limited to Git-based workflows." },
      quality: { score: 55, explanation: "Procedure lacks error handling for non-conventional commits. No fallback strategy for malformed commit messages. Breaking change detection is unreliable." },
      networkEgress: { score: 50, explanation: "Fetches data from Git remotes but documentation doesn't specify which endpoints are accessed. Potential to leak commit metadata if changelog is posted to external services." },
      summary: "Below quality threshold. Credential handling is unclear, commit convention assumptions are too rigid, and network egress behavior is insufficiently documented.",
    },
    downloads: 0,
    rating: 0,
    submissionMethod: "upload",
    submittedAt: "2026-02-10T15:00:00Z",
    adminNotes: "Multiple evaluation categories below threshold. Credential handling and network egress documentation need significant work. Please revise and resubmit.",
  },
];
