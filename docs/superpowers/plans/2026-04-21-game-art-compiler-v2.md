# Game-Art-Compiler V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the game-art-compiler SKILL.md to enforce RAG-optimized Asset vs UI checks organized under three strict pillars: Visual DNA, Product Logic, and Technical Excellence.

**Architecture:** We are directly integrating chunkable Markdown hierarchies and semantic JSON schemas into the prompt instructions of the main `SKILL.md` file.

**Tech Stack:** Markdown, AI Prompt Engineering, RAG structures

---

### Task 1: Update SKILL.md VLM Tagging (Embedding-Ready)

**Files:**
- Modify: `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-art-compiler\SKILL.md`

- [ ] **Step 1: Update Semantic Tagging Logic**
Replace the loose requirements in step 2 (VLM Semantic Tagging) with strict RAG-focused extraction keywords.

### Task 2: Update SKILL.md Generation DNA (Three Pillars)

**Files:**
- Modify: `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-art-compiler\SKILL.md`

- [ ] **Step 1: Update DNA Output Structure**
Rewrite Step 4A (`Generation_DNA.md`) to instruct the LLM to output precise nested Markdown headings for Visual DNA, Product Logic, and Technical Excellence.

### Task 3: Update SKILL.md Evaluation JSON Schema

**Files:**
- Modify: `e:\_Project_2026\GamePipeline\game_pipeline\.agents\skills\game-art-compiler\SKILL.md`

- [ ] **Step 1: Update JSON Example Structure**
Rewrite Step 4B (`Evaluation_Rules.json`) to provide the JSON schema covering `semantic_metadata` and nested criteria for the three pillars.

- [ ] **Step 2: Verify File and Commit**
Verify the file is correctly updated and run git commit.
```bash
git add .agents/skills/game-art-compiler/SKILL.md
git commit -m "feat: upgrade game-art-compiler to RAG-optimized Asset & UI structure"
```
