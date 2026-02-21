# SkillGuard

[Live Demo](https://skillguard.lovable.app/)

*SkillGuard* is an enterprise platform that automatically evaluates, scores, and governs AI Agent Skills before they are deployed into corporate environments.

## The Problem: The "ClawHavoc" Vulnerability
Agent Skills are often just Markdown files (SKILL.md). To a human, it's text. To an AI Agent, it is executable intent.

Recent supply chain attacks on open-source agent hubs (like the "[ClawHavoc](https://cybersecuritynews.com/clawhavoc-poisoned-openclaws-clawhub/)" incident) demonstrated how easily malicious actors can upload skills containing prompt injections. These hidden instructions trick internal AI agents into exfiltrating API keys, bypassing network restrictions, or executing malicious code. Enterprises want the power of open-source agent skills, but they cannot risk the security vulnerabilities.

## The Solution: Zero-Trust Skill Governance
*SkillGuard* provides a secure internal marketplace for enterprises. Developers can submit or import SKILL.md files, which are immediately intercepted by our Auto-Rater Pipeline. The pipeline rigorously evaluates the prompt for security risks, credential mishandling, and capability alignment, outputting a strict "Pass/Fail" scorecard.

## Architecture
We build an agentic evaluation pipeline for skill evaluations.

Frontend Skill Marketplace (Powered by Lovable.dev): We utilized Lovable to rapidly vibe-code a high-fidelity enterprise dashboard. This allowed us to focus on the backend complexity while still delivering a polished UI featuring real-time evaluation loading states and interactive Markdown diffs.

Auto-Rater Pipeline (Powered by Dust.tt): The core brain of *SkillGuard*. We built a custom agent on Dust that ingests raw Markdown and runs a multi-step semantic analysis. It simulates the intent of the prompt against a strict corporate security rubric.

We use the Gemini API key as a custom LLM backend for the Dust agent.
