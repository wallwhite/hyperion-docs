# ADR Template

Use this template for Architecture Decision Records (ADRs).

## When to Use

Create an ADR when making significant architectural decisions that will impact the system long-term, such as:
- Choosing microservices vs monolith
- Selecting a database technology
- Deciding on authentication approach
- Trunk-based development vs GitFlow

## Template

```mdx
---
title: ADR-{number}: Decision Title
description: Brief summary of the decision
---

# ADR-{number}: Decision Title

## Status
**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Decision Makers**: [Names/Roles]

## Context
What is the issue or situation that we're facing? What factors influenced this decision?

- Background information
- Constraints
- Forces at play

## Decision
What is the change that we're proposing and/or doing?

Clear statement of the architectural decision.

## Rationale
Why did we choose this option? What are the reasons behind this decision?

### Considered Options

1. **Option 1**: Description
   - Pros:
   - Cons:

2. **Option 2**: Description
   - Pros:
   - Cons:

3. **Chosen Option**: Description
   - Pros:
   - Cons:

## Consequences

### Positive
- What becomes easier
- What improves

### Negative
- What becomes harder
- Trade-offs made

### Neutral
- Changes that are neither positive nor negative

## Implementation Notes
How will this decision be implemented?

- Action items
- Migration path
- Timeline

## References
- Related ADRs
- External resources
- Documentation links
```

## Best Practices

- **Number sequentially**: ADR-001, ADR-002, etc.
- **Immutable**: Once accepted, don't modify. Create new ADRs to supersede
- **Document WHY**: Focus on context and rationale, not just what was decided
- **Consider alternatives**: Show options that were considered and rejected
- **Update status**: Mark as Deprecated or Superseded when no longer valid
- **Link related ADRs**: Reference previous decisions that relate

## File Location

Place ADRs in: `/architecture/{project}/adr/ADR-{number}-title.mdx`

Example: `/architecture/billing-system/adr/ADR-001-microservices-architecture.mdx`
