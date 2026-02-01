# Sequence Diagram Template

Use this template for sequence diagrams showing component interactions over time.

## When to Use

Create a sequence diagram when showing:
- API request flow
- Authentication process
- Payment transaction
- Data synchronization
- Any step-by-step interaction between components

## MDX Page Template

```mdx
---
title: Operation Name
description: Brief description of the sequence
---

# Operation Name

Brief description of what this sequence diagram shows.

<Diagram lang="plantuml" path="seq/operation-name.puml" alt="Description" />

## Flow Description

Explain the key steps or important details about the sequence:

1. **Step 1**: What happens first
2. **Step 2**: What happens next
3. **Step 3**: Final step

## Key Points

- Important detail 1
- Important detail 2
- Error handling approach
```

## PlantUML Diagram Template

```plantuml
@startuml
!include /plantuml/themes/puml-theme-x-light.puml

participant "Client" as Client
participant "API Gateway" as Gateway
participant "Service" as Service
participant "Database" as DB

Client -> Gateway: Request
activate Gateway

Gateway -> Service: Forward request
activate Service

Service -> DB: Query data
activate DB
DB --> Service: Return data
deactivate DB

Service --> Gateway: Response
deactivate Service

Gateway --> Client: Final response
deactivate Gateway
@enduml
```

## Best Practices

### 1. Clear Actor Names
Use descriptive, unambiguous names for participants.

### 2. Show Request and Response
Include both arrows: `->` for requests, `-->` for responses.

### 3. Use Activation Boxes
Show when components are active/processing with `activate`/`deactivate`.

### 4. Include Error Scenarios
Document error handling with `alt`/`else` blocks:

```plantuml
alt success case
    Service --> Client: 200 OK
else failure case
    Service --> Client: 404 Not Found
end
```

### 5. Time Ordering
Arrange messages chronologically from top to bottom.

### 6. Add Notes for Clarity
Use notes to explain complex logic:

```plantuml
note right of Service
  This is an important
  implementation detail
end note
```

## File Location

Place sequence diagrams in: `/architecture/{project}/sequence/{client}/`

Example: `/architecture/billing-system/sequence/admin-portal/deactivate-customer.puml`

## See Also

- [Diagram Guide](../guides/diagram-guide.md#sequence-diagram-standards) for detailed standards
- [Solution Design Template](solution-design-template.md) for including sequences in designs
