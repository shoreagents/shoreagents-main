# SQL Schema Organization

This directory contains the organized SQL schema files, separated from the original `main.sql` file for better maintainability and organization.

## File Structure

### Core Schema Files
- **`00_schema_main.sql`** - Main entry point that imports all other files in correct order
- **`01_data_types.sql`** - Data types, domains, and enums
- **`02_sequences.sql`** - Database sequences
- **`03_tables.sql`** - All table definitions with indexes and constraints
- **`04_views.sql`** - Database views
- **`05_triggers.sql`** - Database triggers

### Function Categories
- **`06_functions_http.sql`** - HTTP extension functions for API calls
- **`07_functions_user_management.sql`** - User creation and management functions
- **`08_functions_candidate_views.sql`** - Candidate view tracking functions
- **`09_functions_analytics.sql`** - Analytics and reporting functions
- **`10_functions_bpoc_integration.sql`** - BPOC API integration functions
- **`11_functions_utility.sql`** - Utility functions and triggers

## Usage

### To set up the complete schema:
```bash
psql -d your_database -f 00_schema_main.sql
```

### To run individual components:
```bash
# Example: Just run the tables
psql -d your_database -f 03_tables.sql

# Example: Just run analytics functions
psql -d your_database -f 09_functions_analytics.sql
```

## Dependencies

The files must be executed in the order specified in `00_schema_main.sql`:

1. Data types and domains
2. Sequences
3. Tables (with indexes and constraints)
4. Views
5. Functions (in dependency order)
6. Triggers (must come after functions they reference)

## Benefits of This Organization

1. **Maintainability** - Each file focuses on a specific aspect of the schema
2. **Modularity** - Can update individual components without affecting others
3. **Readability** - Easier to find and understand specific functionality
4. **Version Control** - Better tracking of changes to specific components
5. **Development** - Teams can work on different files simultaneously

## Notes

- The original `main.sql` file has been preserved for reference
- All functions maintain their original functionality
- Dependencies are properly ordered to avoid conflicts
- Comments and documentation are preserved from the original file
