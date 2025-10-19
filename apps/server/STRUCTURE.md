# NestJS Server Directory Structure

## 📁 Overview Structure

```
src/
├── 📁 config/                    # Application configuration
│   ├── app.config.ts            # General config (port, JWT, etc.)
│   └── index.ts                 # Export all config
│
├── 📁 modules/                  # Feature modules
│   ├── 📁 auth/                 # 🔐 Authentication & Authorization
│   │   ├── 📁 dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── index.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── 📁 products/             # 📦 Product Management
│   │   ├── 📁 dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts
│   │   │   └── index.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   └── products.module.ts
│   │
│   ├── 📁 inventory/            # 📊 Inventory Management
│   └── 📁 users/               # 👥 User Management
│
├── 📁 shared/                   # 🔧 Shared code
│   ├── 📁 dto/                  # Common DTOs
│   │   ├── base.dto.ts
│   │   └── pagination.dto.ts
│   ├── 📁 interfaces/           # Common interfaces
│   │   ├── api-response.interface.ts
│   │   └── index.ts
│   ├── 📁 guards/              # Security guards
│   ├── 📁 decorators/          # Custom decorators
│   └── 📁 utils/               # Utility functions
│       ├── response.util.ts
│       └── index.ts
│
├── 📁 infra/                    # 🏗️ Infrastructure
│   └── 📁 prisma/              # Database layer
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── app.module.ts               # 🏠 Root module
├── app.controller.ts           # Root controller
├── app.service.ts              # Root service
├── main.ts                     # 🚀 Entry point
└── README.md                   # 📖 Documentation
```

## 🎯 Organization Principles

### 1. **Modules** (modules/)

- **Purpose**: Each module = 1 business feature
- **Structure**: Controller + Service + DTOs + Module
- **Examples**: `auth/`, `products/`, `inventory/`

### 2. **Shared** (shared/)

- **Purpose**: Code used across the application
- **Includes**: DTOs, Interfaces, Utils, Guards
- **Benefits**: Avoid code duplication

### 3. **Config** (config/)

- **Purpose**: General application configuration
- **Includes**: JWT, Environment variables, App settings
- **Benefits**: Centralized configuration
- **Note**: Database config is managed by Prisma

### 4. **Infrastructure** (infra/)

- **Purpose**: Database, external services
- **Includes**: Prisma, Redis, Email services

## 📋 Naming Conventions

| Type          | Convention       | Example              |
| ------------- | ---------------- | -------------------- |
| **Files**     | kebab-case       | `auth.controller.ts` |
| **Classes**   | PascalCase       | `AuthController`     |
| **Variables** | camelCase        | `userService`        |
| **Constants** | UPPER_SNAKE_CASE | `JWT_SECRET`         |
| **Folders**   | kebab-case       | `user-management`    |

## 🚀 Best Practices

### ✅ Do's

- Consistent module structure
- Use DTOs for validation
- Create index.ts for clean exports
- Use shared utilities
- Centralized error handling

### ❌ Don'ts

- Put business logic in controllers
- Hardcode configuration
- Duplicate code across modules
- Mix concerns in the same file

## 🔄 Development Workflow

1. **Create new module**:

   ```bash
   mkdir modules/new-feature
   # Create controller, service, dto, module
   ```

2. **Add to app.module.ts**:

   ```typescript
   imports: [NewFeatureModule];
   ```

3. **Use shared utilities**:
   ```typescript
   import { ResponseUtil } from '../shared/utils';
   ```

## 📊 Usage Examples

### Controller

```typescript
@Controller('products')
export class ProductsController {
  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    return this.productsService.findAll(pagination);
  }
}
```

### Service

```typescript
@Injectable()
export class ProductsService {
  async findAll(pagination: PaginationDto) {
    // Business logic here
    return ResponseUtil.paginated(data, page, limit, total);
  }
}
```

### DTO

```typescript
export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

## 🎨 Benefits of This Structure

- ✅ **Scalable**: Easy to add new modules
- ✅ **Maintainable**: Code is well organized
- ✅ **Reusable**: Shared code is reusable
- ✅ **Testable**: Easy to write unit tests
- ✅ **Team-friendly**: Multiple developers can work in parallel

## 🔧 Module Structure Template

When creating a new module, follow this structure:

```
modules/feature-name/
├── dto/
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── index.ts
├── feature.controller.ts
├── feature.service.ts
└── feature.module.ts
```

## 📝 Key Files to Remember

- **app.module.ts**: Root module that imports all feature modules
- **main.ts**: Application entry point with global configurations
- **shared/utils/**: Common utilities used across modules
- **config/**: Application configuration (avoid database config here)
- **infra/prisma/**: Database layer with Prisma ORM

## 🚀 Getting Started

1. **Add new feature**: Create module in `modules/`
2. **Import module**: Add to `app.module.ts` imports
3. **Use shared code**: Import from `shared/` folder
4. **Configure**: Update settings in `config/` folder
