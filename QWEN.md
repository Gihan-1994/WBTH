# WBTH Project Context

This file provides context for AI assistants working on the WBTH project.

## Project Overview
- **Project Name**: WBTH (presumably a software project)
- **Type**: Monorepo (as evidenced by the apps/ directory and turbo.json)
- **Language**: TypeScript (based on tsconfig.json)
- **Package Manager**: Yarn (based on yarn.lock)
- **Build System**: Turbo (based on turbo.json)

## Key Configuration Files
- `package.json` - Root package configuration
- `tsconfig.json` - TypeScript configuration
- `turbo.json` - Build system configuration
- `.env.example` - Environment variable examples
- `wbth_6_week_build_plan_architecture_spec.md` - Architecture specification
- `wbth_monorepo_structure.md` - Monorepo structure documentation

## Project Structure
- `apps/` - Contains application packages (structure not fully visible)
- `.github/` - GitHub configuration
- `.idea/` - IDE configuration

## Development Guidelines
- Follow TypeScript best practices as defined in tsconfig.json
- Use ESLint for code linting (based on .eslintrc.cjs)
- Use Prettier for code formatting (based on .prettierrc)
- Respect the monorepo structure when making changes

## Context for AI Assistants
- When modifying code, consider the monorepo architecture
- Maintain consistency with existing code style and patterns
- Respect the environment variable system defined in .env files
- Consider how changes may affect multiple apps in the monorepo