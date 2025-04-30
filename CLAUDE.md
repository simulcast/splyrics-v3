# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version (runs TypeScript check first)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Code Style Guidelines
- **TypeScript**: Strict mode, with noUnusedLocals and noUnusedParameters enabled
- **Import paths**: Use `@/*` path alias (e.g., `import Button from '@/components/ui/button'`)
- **Component structure**: Follow React functional component patterns with proper typing
- **UI components**: Use shadcn/ui components from the `components/ui` directory
- **Styling**: Use Tailwind CSS with the project's custom theme variables
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **Error handling**: Use try/catch for async operations, proper error states in UI
- **File structure**: Group related components in dedicated directories under `src/components`
- **State management**: Use React Context (see AppContext.tsx) for shared state

## Notes
This project uses Vite, TypeScript, React, Tailwind CSS, and shadcn/ui components.