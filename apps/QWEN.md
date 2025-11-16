# WBTH Apps Directory Context

This file provides context for AI assistants working on applications within the WBTH monorepo.

## Directory Overview
- **Location**: `/apps/` - Contains individual applications in the monorepo
- **Structure**: Multi-app monorepo managed by Turbo (turbo.json)

## App Development Guidelines
- Each app may have its own package.json but shares root configuration
- Follow monorepo patterns for dependencies and shared code
- Use consistent TypeScript configuration from root tsconfig.json
- Maintain consistent linting and formatting across all apps

## Common App Patterns
- Likely React/Next.js applications (common monorepo pattern)
- May share components, utilities, or services from other directories
- Each app should be independently deployable
- Use shared configuration from the root directory

## Development Considerations
- Changes in one app may affect others if using shared dependencies
- Use `turbo` commands for building and running apps efficiently
- Check for shared packages/libraries that apps may depend on
- Follow the architecture as defined in wbth_6_week_build_plan_architecture_spec.md