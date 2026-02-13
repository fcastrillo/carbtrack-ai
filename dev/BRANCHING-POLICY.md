# Branching Policy — carbtrack-ai (Hybrid RaiSE Model)

> **Adopted:** 2026-02-13 (Session SES-008)
> **Rationale:** RaiSE epic-only push creates false "ready to merge" signal. Hybrid model provides continuous visibility while maintaining main stability.

## Branch Structure

```
main (stable, merged epics only)
  ↑
  └── origin/epic/eN-{name} (WIP, all features in progress)
       ├── FN.1-{name} (scope + design + plan + implement + review)
       ├── FN.2-{name} (scope + design + plan + implement + review)
       └── FN.M-{name} ← Latest feature
```

## Push Timing

### During Epic Development

**When:** Each feature completed (design → plan → implement → review all done)

**What:** Push to `origin/epic/eN-{name}` (NOT main)

**Command:**
```bash
git push origin epic/eN-{name}
# Or if branch not yet tracked:
git push -u origin epic/eN-{name}
```

**Purpose:**
- Real-time backup (code on GitHub, not just local)
- Team visibility (collaborators see progress)
- WIP tracking (branch clearly isolated from main)

### Epic Closure

**When:** All features complete, epic tested, retrospective done

**What:** `/rai-epic-close` merges `epic/eN/...` → `main` and pushes

**Purpose:** Atomic update to stable main, epic closure complete

**Result:**
```
main now has all epic commits
epic/eN/... deleted (merged)
```

---

## Branch Semantics

| Branch | Meaning | Content | Update Frequency |
|--------|---------|---------|------------------|
| `main` | Stable, canonical, production-ready | Merged epics only | Rarely (at epic closure) |
| `origin/epic/eN/...` | WIP epic, features in progress | All feature work (F.1-FN.M) | Frequently (per feature) |
| Local `epic/eN/...` | Current development branch | Uncommitted work + commits | Continuous (per task) |

---

## Collaboration Signals

### For Team Members (when using this repo)

- **"I see `epic/e0/...` on GitHub"** → E0 is in progress, features being implemented, watching for closure PR
- **"Should I merge `epic/e0/...` to main?"** → NO. Only `/rai-epic-close` merges to main
- **"`main` has new commits from my team"** → An epic just closed and merged; pull to stay in sync
- **"What's the status of E0?"** → Check `origin/epic/e0/...` commits; if all features done, PR to main will appear soon

---

## Workflow Example: Feature Complete

```bash
# 1. Feature F0.5 complete (design → plan → implement → review done)
git status
# On branch epic/e0/doc-homologation
# nothing to commit (all features committed in scope commits)

# 2. Push the epic branch (first push for this epic, or subsequent feature complete)
git push -u origin epic/e0/doc-homologation
# ✓ Branch now on GitHub, visible to team
# ✓ All commits backed up
# ✓ Team can see progress

# 3. Continue with F0.6 or wait for epic closure
# ... more features in same epic branch ...

# 4. When epic complete: /rai-epic-close handles merge to main + push
```

---

## Key Principle

**Hybrid approach = Push progress, merge discipline**

- ✅ **Push frequently** — Features backed up, team visibility
- ✅ **Merge rarely** — Only at epic closure, through `/rai-epic-close`
- ✅ **main stays stable** — Never WIP branches, never direct merges
- ✅ **Clear signals** — Branch on GitHub = WIP epic, main updated = epic closed

---

## Comparison: Three Models

| Model | When Push | main Status | Team Visibility | Drawback |
|-------|-----------|------------|-----------------|----------|
| **Pure RaiSE** | Epic closure only | Always stable | None until closure | False "ready to merge" when branch appears |
| **Continuous** | Every commit | Always stable | Real-time | WIP branches clutter GitHub |
| **Hybrid (ours)** | Per feature | Always stable | Frequent updates | Requires discipline (don't merge epic branches) |

---

## Rules for carbtrack-ai

1. **Push after feature complete** — Each F0.x → origin/epic/e0/...
2. **Never merge epic branches to main directly** — Only via `/rai-epic-close`
3. **main = stable** — Only merged, complete epics
4. **Local commit often** — Per task, per decision
5. **Push periodically** — Per feature, per discussion point

---

*Policy established: 2026-02-13*
*Model: Hybrid (push progress, merge discipline)*
*Applies to: All future epics in carbtrack-ai*
