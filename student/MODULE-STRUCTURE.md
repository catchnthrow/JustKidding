# Angular Module Structure Documentation

## Overview
This Angular application has been refactored to follow Angular best practices for module organization and maintainability.

## Module Structure

### 📁 Core Module (`/src/app/core/`)
- **Purpose**: Houses application-wide singleton services and configurations
- **Import**: Only in `AppModule` (enforced with constructor guard)
- **Contents**: 
  - Application-wide services
  - Authentication guards
  - HTTP interceptors

### 📁 Shared Module (`/src/app/shared/`)
- **Purpose**: Contains reusable components, directives, pipes, and services
- **Import**: Can be imported by any feature module
- **Contents**:
  - `MathService` - Mathematical operations and question generation
  - Common Angular modules (CommonModule, RouterModule)
  - Reusable utilities

### 📁 Features (`/src/app/features/`)
Contains all feature modules organized by domain:

#### 📁 Year 1 Module (`/src/app/features/year1/`)
- **Purpose**: Contains all Year 1 math learning components
- **Components**:
  - `HomeComponent` - Main navigation for Year 1 chapters
  - `AdditionChapterComponent` - Addition practice exercises
  - `MakingTenChapterComponent` - Making ten exercises
  - `NumberPairsChapterComponent` - Number pairs to 10 exercises
- **Routing**: Lazy-loaded routes defined in `year1.module.ts`

## File Structure
```
src/app/
├── core/
│   ├── core.module.ts
│   └── index.ts
├── shared/
│   ├── services/
│   │   └── math.service.ts
│   ├── shared.module.ts
│   └── index.ts
├── features/
│   ├── year1/
│   │   ├── components/
│   │   │   ├── home.component.*
│   │   │   ├── addition-chapter.component.*
│   │   │   ├── making-ten-chapter.component.*
│   │   │   └── number-pairs-chapter.component.*
│   │   ├── year1.module.ts (routes configuration)
│   │   └── index.ts
│   └── index.ts
├── app.routes.ts
├── app.component.*
└── ...
```

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a clear responsibility
2. **Lazy Loading**: Feature modules are lazy-loaded for better performance
3. **Reusability**: Shared module can be used across all features
4. **Maintainability**: Easy to add new features without affecting existing ones
5. **Scalability**: Structure supports easy addition of Year 2, Year 3, etc.

## Adding New Features

### Adding a New Year Level:
1. Create a new folder under `features/` (e.g., `year2/`)
2. Create components and routing module
3. Add routes to main `app.routes.ts`
4. Export from `features/index.ts`

### Adding Shared Components:
1. Add component to `shared/` module
2. Export from `shared.module.ts`
3. Import `SharedModule` in feature modules that need it

## Import Guidelines

- **Core Module**: Import only in `AppModule`
- **Shared Module**: Import in any feature module that needs shared functionality
- **Feature Modules**: Lazy-loaded through routing

## Standalone Components
This application uses Angular standalone components, which provides:
- Reduced boilerplate
- Better tree-shaking
- Simplified testing
- More explicit dependencies
