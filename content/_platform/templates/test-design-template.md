# Test Design Template

Use this template for documenting testing strategy alongside solution designs.

## When to Use

Create a test design together with every solution design to document:
- Test strategy for new feature
- QA checklist
- Performance testing approach
- Integration test plan

## Template

```mdx
---
title: Test Design - Feature Name
description: Testing strategy for [feature]
---

# Test Design: Feature Name

## Overview
Brief description of what this test design covers and the feature being tested.

## Test Strategy

### Scope
What will be tested:
- [ ] Component 1
- [ ] Component 2
- [ ] Integration points
- [ ] Edge cases

### Out of Scope
What will not be tested:
- [ ] Item 1
- [ ] Item 2

## Test Levels

### Unit Tests
**Coverage Target**: X%

**Focus Areas**:
- [ ] Core business logic
- [ ] Data validation
- [ ] Error handling
- [ ] Edge cases

**Tools**: List testing frameworks and tools

### Integration Tests
**Focus Areas**:
- [ ] API endpoints
- [ ] Database interactions
- [ ] External service integrations
- [ ] Message queues

**Test Scenarios**:
1. Scenario 1 description
2. Scenario 2 description

### End-to-End Tests
**User Flows**:
1. Flow 1: Step-by-step description
2. Flow 2: Step-by-step description

**Tools**: List E2E testing tools

### Performance Tests
**Metrics**:
- Response time: Target X ms
- Throughput: X requests/second
- Resource usage: CPU, Memory targets

**Load Scenarios**:
- Normal load
- Peak load
- Stress test

## Test Cases

### Critical Path Tests

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| TC-001 | Description | Expected outcome | High |
| TC-002 | Description | Expected outcome | High |

### Edge Cases

| ID | Test Case | Expected Result | Priority |
|----|-----------|-----------------|----------|
| TC-100 | Description | Expected outcome | Medium |

### Error Scenarios

| ID | Test Case | Expected Error | Priority |
|----|-----------|----------------|----------|
| TC-200 | Description | Error message/code | High |

## Test Data

### Data Requirements
- Data set 1: Description
- Data set 2: Description

### Test Environment Setup
```bash
# Commands to set up test environment
```

## Localization Testing (if applicable)
- [ ] Language 1
- [ ] Language 2
- [ ] Date/time formats
- [ ] Currency formats

## Security Testing
- [ ] Authentication tests
- [ ] Authorization tests
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention

## Acceptance Criteria
- [ ] All critical path tests pass
- [ ] No high-priority bugs
- [ ] Performance targets met
- [ ] Security tests pass
- [ ] Documentation updated

## Test Schedule
| Phase | Duration | Notes |
|-------|----------|-------|
| Unit testing | X days | During development |
| Integration testing | X days | After feature complete |
| E2E testing | X days | In staging environment |
| Performance testing | X days | Before production |

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Test environment instability | High | Setup dedicated test env |
| Insufficient test data | Medium | Generate synthetic data |

## References
- Solution Design document
- API documentation
- User stories/requirements
```

## Best Practices

- **Pair with Solution Design**: Always create alongside solution design
- **Be specific**: Define concrete test cases, not just "test the feature"
- **Set targets**: Include performance and coverage targets
- **Consider all levels**: Unit, integration, E2E, performance tests
- **Document test data**: Specify what data is needed for testing
- **Include security**: Don't forget security testing requirements
- **Define acceptance criteria**: Clear pass/fail criteria
- **Plan the schedule**: Estimate time for each testing phase

## File Location

Place test designs in: `/architecture/{project}/solution-designs/{number}/test-design.mdx`

Example: `/architecture/billing-system/solution-designs/001/test-design.mdx`

**Note**: Test design should be in the same directory as its corresponding solution design.
