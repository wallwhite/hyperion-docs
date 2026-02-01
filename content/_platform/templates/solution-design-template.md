# Solution Design Template

Use this template for documenting features or technical solutions before implementation.

## When to Use

Create a solution design when planning a significant feature or system component, such as:
- New payment processing feature
- Email notification system
- API versioning approach
- Data migration plan

**Always pair with Test Design** - create both documents together.

## Template

```mdx
---
title: Solution Design Title
description: Brief description
---

# Feature/Solution Name

## Purpose
Business requirements and goals. Explain what problem this solves and why.

## Owners
- **Manager**: Name/Role
- **Team**: Team name

## Flow Overview

Visual diagrams showing the solution flow:

### Diagram Name
<Diagram lang="plantuml" path="path/to/diagram.puml" alt="Description" />

## Scope

### In Scope
- [ ] Feature/requirement 1
- [ ] Feature/requirement 2
- [ ] Feature/requirement 3

### Out of Scope
- [ ] Item 1
- [ ] Item 2

## Risk

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk description | Low/Medium/High | Mitigation strategy |

### Stability Concerns
- [ ] Concern 1
- [ ] Concern 2

## Research

### Research Topic
Description of research findings, constraints, or discoveries.

Result: Conclusion or decision

## Additional Requirements

### Backend
- [ ] Requirement 1
- [ ] Requirement 2

### API
Document API endpoints, request/response formats

### Frontend
- [ ] Requirement 1
- [ ] Requirement 2

### QA
- [ ] Test requirement 1
- [ ] Test requirement 2

## Additional Documentation
- Link to Jira tickets
- Link to design documents
- Link to ADRs (Architecture Decision Records)
```

## Best Practices

- **Create before implementation**: Write solution design before starting coding
- **Include diagrams**: Visual representation of flows and architecture
- **Be specific**: Clearly define what's in scope and out of scope
- **Identify risks**: Document technical risks and mitigation strategies
- **Document research**: Include findings from exploration and investigation
- **Break down requirements**: Separate by component (Backend, API, Frontend, QA)
- **Link related docs**: Reference ADRs, test designs, and other relevant documentation
- **Keep as historical record**: Don't delete old solution designs, mark as implemented

## File Location

Place solution designs in: `/architecture/{project}/solution-designs/{number}/solution-design.mdx`

Example: `/architecture/billing-system/solution-designs/001/solution-design.mdx`

## Complete Example

See [Solution Design Example](https://gist.github.com/Yozhef/9d58c6afc36fee4c3ff55fd6904c4d04) for a complete, real-world solution design.
