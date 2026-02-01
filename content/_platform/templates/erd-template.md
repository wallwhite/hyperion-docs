# ERD Template

Use this template for Entity Relationship Diagrams (ERD) to document database schema.

## When to Use

Create an ERD when:
- Designing database schema
- Documenting data model
- Planning schema migration

## Template

```plantuml
@startuml
!include /plantuml/themes/puml-theme-x-light.puml

entity EntityName {
  * id : UUID <<PK>>
  --
  * field_name : Type
  field_name : Type <<nullable>>
  foreign_key_id : UUID <<FK>>
  created_at : DateTime
  updated_at : DateTime
}

entity RelatedEntity {
  * id : UUID <<PK>>
  --
  * name : String
}

EntityName }|--|| RelatedEntity : "relationship"
@enduml
```

## Relationship Cardinality

- `||--||` : One to one
- `}|--||` : Many to one
- `||--o{` : One to many
- `}|--o{` : Many to many

## Best Practices

- **Primary Keys**: Mark with `<<PK>>`
- **Foreign Keys**: Mark with `<<FK>>`
- **Required Fields**: Prefix with `*`
- **Nullable Fields**: Mark with `<<nullable>>`
- **Timestamps**: Include `created_at` and `updated_at` when applicable
- **Relationship Notation**: Use PlantUML relationship syntax
- **Validation**: Validate ERD against actual database schema

## File Location

Place ERDs in: `/architecture/{project}/erd/`

Example: `/architecture/billing-system/erd/payment-schema.puml`

## Validation Example

See [ERD Validation Example](https://gist.github.com/Yozhef/0241b939e4d0f8a1cb8802b59cd8e52b) for how to validate ERD against database.
