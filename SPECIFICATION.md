# DevStore - Especificação Técnica Completa

## 1. Visão Geral do Projeto

**Produto:** DevStore - Aplicação E-commerce React Native
**Cliente:** Pagaleve
**API:** Platzi Fake Store GraphQL (https://api.escuelajs.co/graphql)

### 1.1 Objetivos
- Demonstrar engenharia de produto robusta
- Código escalável para equipes grandes
- Separação clara de responsabilidades
- Tratamento de erros resiliente
- Arquitetura limpa e testável

---

## 2. Stack Tecnológica

### 2.1 Obrigatórias
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| Expo | Latest (Managed Workflow) | Framework base |
| TypeScript | 5.x (Rigoroso) | Linguagem |
| TanStack Query | v5 | Data fetching + cache |
| Zustand | v4 | Estado global client-side |
| Expo Router | Latest | Navegação + Deep Linking |
| GraphQL Request | Latest | GraphQL fetcher |

### 2.2 Adicionais
| Tecnologia | Propósito |
|-----------|-----------|
| @tanstack/react-query-devtools | Debug do cache |
| zustand/middleware | Persistência (persist) |
| @react-native-async-storage/async-storage | Storage local |
| react-native-mmkv | Storage performático (alternativa) |
| fp-ts | Programação funcional (Either, Option, pipe) |
| zod | Validação de schemas |
| react-error-boundary | Error Boundary component |

---

## 3. Arquitetura do Projeto

### 3.1 Princípios Arquiteturais

#### Clean Architecture
```
Presentation Layer (UI) → Use Cases (Business Logic) → Data Layer (API/Storage)
```

#### SOLID
- **S**ingle Responsibility: Cada módulo tem uma única responsabilidade
- **O**pen/Closed: Componentes abertos para extensão, fechados para modificação
- **L**iskov Substitution: Interfaces consistentes
- **I**nterface Segregation: Interfaces específicas, não genéricas
- **D**ependency Inversion: Dependências para abstrações, não implementações

#### KISS (Keep It Simple, Stupid)
- Evitar over-engineering
- Componentes simples e focados
- Abstrações apenas quando necessário

### 3.2 Estrutura de Pastas (Feature Slices - Vertical Slices)

Esta estrutura organiza o código por **features** (fatias verticais), onde cada feature contém todas as suas camadas. Isso facilita escalabilidade, trabalho em equipe e manutenção.

```
test_devstore/
├── app/                          # Expo Router (Presentation - Routes)
│   ├── (tabs)/                   # Navegação por tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home (Listagem de produtos)
│   │   └── cart.tsx              # Carrinho
│   ├── product/
│   │   └── [id].tsx              # Detalhes do produto
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
│
├── src/
│   ├── features/                 # 📦 FEATURES (Vertical Slices)
│   │   │
│   │   ├── product/              # Feature: Produtos
│   │   │   ├── domain/           # ⭕ Camada de Domínio
│   │   │   │   ├── entities/
│   │   │   │   │   ├── Product.ts
│   │   │   │   │   └── Category.ts
│   │   │   │   └── repositories/
│   │   │   │       └── ProductRepository.ts  # Interface abstrata
│   │   │   │
│   │   │   ├── data/             # 🔵 Camada de Dados
│   │   │   │   ├── repositories/
│   │   │   │   │   └── ProductRepositoryImpl.ts
│   │   │   │   ├── dtos/
│   │   │   │   │   └── ProductDTO.ts  # DTOs com schemas Zod
│   │   │   │   └── datasources/
│   │   │   │       └── ProductRemoteDataSource.ts  # Interface abstrata
│   │   │   │
│   │   │   ├── external/         # 🟢 Camada Externa
│   │   │   │   ├── datasources/
│   │   │   │   │   └── ProductRemoteDataSourceImpl.ts
│   │   │   │   └── graphql/
│   │   │   │       └── queries.ts
│   │   │   │
│   │   │   ├── presentation/     # 🟣 Camada de Apresentação
│   │   │   │   ├── screens/
│   │   │   │   │   ├── ProductListScreen.tsx
│   │   │   │   │   └── ProductDetailScreen.tsx
│   │   │   │   ├── components/
│   │   │   │   │   ├── ProductCard.tsx
│   │   │   │   │   └── ProductListItem.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useProducts.ts
│   │   │   │       ├── useProduct.ts
│   │   │   │       └── useInfiniteProducts.ts
│   │   │   │
│   │   │   └── injection/        # 💉 DI da Feature
│   │   │       └── ProductContainer.ts
│   │   │
│   │   └── cart/                 # Feature: Carrinho
│   │       ├── domain/           # ⭕ Camada de Domínio
│   │       │   ├── entities/
│   │       │   │   ├── Cart.ts         # Entidade Cart e CartItem
│   │       │   │   └── index.ts
│   │       │   └── repositories/
│   │       │       └── CartRepository.ts  # Interface abstrata
│   │       │
│   │       ├── data/             # 🔵 Camada de Dados
│   │       │   └── repositories/
│   │       │       └── CartRepositoryImpl.ts  # Implementação
│   │       │
│   │       ├── external/         # 🟢 Camada Externa
│   │       │   └── stores/
│   │       │       └── ZustandCartStore.ts  # Zustand com persist
│   │       │
│   │       ├── presentation/     # 🟣 Camada de Apresentação
│   │       │   ├── screens/
│   │       │   │   └── CartScreen.tsx
│   │       │   ├── components/
│   │       │   │   ├── CartItemCard.tsx
│   │       │   │   ├── CartSummary.tsx
│   │       │   │   └── EmptyCart.tsx
│   │       │   └── hooks/
│   │       │       └── useCart.ts  # Usa useSyncExternalStore
│   │       │
│   │       └── injection/        # 💉 DI da Feature
│   │           └── CartContainer.ts
│   │
│   ├── design_system/            # 🎨 DESIGN SYSTEM (Compartilhado)
│   │   ├── components/           # Componentes base reutilizáveis
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── Button.styles.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Card.types.ts
│   │   │   ├── Input/
│   │   │   │   └── Input.tsx
│   │   │   ├── ErrorState/
│   │   │   │   └── ErrorState.tsx
│   │   │   ├── LoadingState/
│   │   │   │   └── LoadingState.tsx
│   │   │   └── Toast/
│   │   │       └── Toast.tsx
│   │   │
│   │   ├── theme/                # Configuração de tema
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── shadows.ts
│   │   │   └── index.ts
│   │   │
│   │   └── tokens/               # Design tokens
│   │       ├── colors.tokens.ts
│   │       └── spacing.tokens.ts
│   │
│   ├── core/                     # ⚙️ CORE/INFRASTRUCTURE (Compartilhado)
│   │   ├── providers/            # React providers
│   │   │   └── QueryProvider.tsx
│   │   │
│   │   ├── errors/               # Erros base
│   │   │   ├── AppError.ts       # Tipos de erro (NetworkError, etc.)
│   │   │   └── index.ts
│   │   │
│   │   ├── either/               # Functional error handling
│   │   │   └── index.ts          # Either<L, R> type
│   │   │
│   │   ├── logger/               # Logger service
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/              # Storage abstraction
│   │   │   ├── StorageService.ts           # Interface abstrata
│   │   │   ├── AsyncStorageService.ts      # Implementação AsyncStorage
│   │   │   ├── zustandStorageAdapter.ts    # Adapter para Zustand persist
│   │   │   └── index.ts
│   │   │
│   │   └── graphql/              # GraphQL client abstraction
│   │       ├── graphql-client.ts # Singleton com timeout handling
│   │       └── index.ts
│   │
│   └── shared/                   # 🔗 SHARED (Código compartilhado entre features)
│       ├── components/           # Componentes compartilhados
│       │   ├── Toast/
│       │   │   ├── ToastContext.tsx
│       │   │   └── ToastContainer.tsx
│       │   └── CartIcon/
│       │       └── CartIcon.tsx
│       │
│       ├── types/                # Types globais
│       │   └── global.d.ts
│       │
│       └── constants/            # Constantes globais
│           ├── api.ts            # API_CONFIG (endpoint, timeout)
│           ├── query.ts          # QUERY_CONFIG (staleTime, gcTime)
│           └── index.ts
│
├── __tests__/                    # Testes (espelham a estrutura src/)
│   ├── features/
│   │   ├── product/
│   │   │   ├── domain/
│   │   │   │   └── usecases/
│   │   │   ├── data/
│   │   │   │   └── repositories/
│   │   │   └── presentation/
│   │   │       ├── components/
│   │   │       └── hooks/
│   │   └── cart/
│   │       └── presentation/
│   │           └── state/
│   ├── design_system/
│   │   └── components/
│   └── integration/
│
├── app.json                      # Configuração Expo (Deep Linking)
├── tsconfig.json
├── package.json
└── README.md
```

#### Vantagens da Estrutura Feature Slices

**✅ Escalabilidade:**
- Cada feature é auto-contida
- Fácil adicionar novas features sem impactar existentes
- Fácil remover features inteiras (delete a pasta)

**✅ Trabalho em Equipe:**
- Times diferentes podem trabalhar em features diferentes
- Menos conflitos de merge
- Ownership claro (cada time "possui" uma feature)

**✅ Manutenibilidade:**
- Todo código relacionado está junto
- Fácil entender o escopo de uma feature
- Mudanças em uma feature não quebram outras

**✅ Testabilidade:**
- Cada feature pode ser testada isoladamente
- Mocks específicos por feature
- Testes espelham a estrutura do código

**✅ Otimização de Bundle:**
- Tree shaking natural (código não usado é removido automaticamente)
- Route-based splitting (Expo Router já faz por rota)
- Feature flags (não incluir features desabilitadas no build)
- Bundle mais organizado e modular

**⚠️ Nota sobre Code Splitting Dinâmico:**
- `React.lazy()` NÃO funciona nativamente no React Native
- Lazy loading dinâmico de features é complexo (Metro bundler)
- Benefícios de Feature Slices são **organização** e **manutenibilidade**, não lazy loading mágico
- Ver [AI_WORKFLOW_LOG.md](./AI_WORKFLOW_LOG.md#-discussão-técnica-2-code-splitting-e-feature-slices) para discussão completa

#### Fluxo de Dependências (Dentro de uma Feature)

```
Feature: Product
    External → Data → Domain ← Presentation
                ↓               ↓
           Shared/Core    Design System
```

**Regra de Dependência (dentro de cada feature):**
- **Domain** não depende de ninguém (camada mais interna)
- **Data** depende apenas de Domain
- **External** depende de Data e Domain
- **Presentation** depende de Domain (via hooks que usam usecases)
- **Features** podem se comunicar apenas via Domain (entidades compartilhadas)
- **Design System** e **Core** são compartilhados por todas as features

---

## 4. Funcionalidades Detalhadas

### 4.1 Feature: Produtos

#### 4.1.1 Listagem de Produtos (Home)
**Tela:** `app/(tabs)/index.tsx`

**User Stories:**
- Como usuário, quero ver uma lista de produtos disponíveis
- Como usuário, quero carregar mais produtos ao rolar (infinite scroll)
- Como usuário, quero ver um estado de carregamento
- Como usuário, quero ver uma mensagem amigável quando houver erro

**Requisitos Técnicos:**
- ✅ Usar TanStack Query com `useInfiniteQuery`
- ✅ Implementar infinite scroll
- ✅ Cache inteligente (staleTime, cacheTime)
- ✅ Loading states (skeleton)
- ✅ Error states com retry
- ✅ Otimização de performance (FlatList, memo)

**GraphQL Query:**
```graphql
query GetProducts($limit: Int!, $offset: Int!) {
  products(limit: $limit, offset: $offset) {
    id
    title
    price
    description
    images
    category {
      id
      name
    }
  }
}
```

**Componentes:**
```
ProductList (Smart)
  └── ProductCard (Dumb)
      ├── Card (Design System)
      ├── Image
      └── Button (Design System)
```

#### 4.1.2 Detalhes do Produto
**Tela:** `app/product/[id].tsx`

**User Stories:**
- Como usuário, quero ver detalhes completos de um produto
- Como usuário, quero adicionar o produto ao carrinho
- Como usuário, quero navegar de volta à home

**Requisitos Técnicos:**
- ✅ Usar TanStack Query com `useQuery`
- ✅ Suportar Deep Linking (`devstore://product/{id}`)
- ✅ Cache do produto já listado
- ✅ Prefetch opcional

**GraphQL Query:**
```graphql
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    title
    price
    description
    images
    category {
      id
      name
      image
    }
  }
}
```

### 4.2 Feature: Carrinho de Compras

**Tela:** `app/(tabs)/cart.tsx`

**User Stories:**
- Como usuário, quero adicionar produtos ao carrinho
- Como usuário, quero remover produtos do carrinho
- Como usuário, quero ver o total do carrinho
- Como usuário, quero que meu carrinho persista mesmo fechando o app
- Como usuário, quero receber feedback visual ao adicionar produtos ao carrinho
- Como usuário, quero ver quantos itens tenho no carrinho através de um badge no header

**Requisitos Técnicos:**
- ✅ Usar Zustand para estado
- ✅ Persistir com middleware `persist`
- ✅ Storage: AsyncStorage
- ✅ Cálculos derivados (total, quantidade)
- ✅ Toast de confirmação ao adicionar produto
- ✅ Badge animado no ícone do carrinho

**Arquitetura do Carrinho (Repository Pattern):**

```typescript
// domain/entities/Cart.ts
interface CartItem {
  productId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// domain/repositories/CartRepository.ts (Interface)
interface CartRepository {
  getCart(): Cart;
  addToCart(params: AddToCartParams): void;
  removeFromCart(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  clearCart(): void;
  subscribe(listener: (cart: Cart) => void): () => void;
}

// data/repositories/CartRepositoryImpl.ts (Implementação)
// Usa ZustandCartStore internamente

// external/stores/ZustandCartStore.ts
// Zustand store isolado com persist middleware usando @core/storage
```

### 4.3 Feature: Safe Area e Layout Android

**Requisitos:**
- ✅ Status bar não sobrepõe o header
- ✅ Navigation bar não sobrepõe o footer
- ✅ Footers fixos com padding dinâmico

**Implementação:**

```typescript
// app/_layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';

// app.json
"androidStatusBar": {
  "barStyle": "dark-content",
  "backgroundColor": "#ffffff",
  "translucent": false
}

// Em telas com footer fixo
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
<View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.md }]}>
```

**Componentes afetados:**
- `ProductDetailScreen`: Footer com botão "Adicionar ao Carrinho"
- `CartScreen`: Footer com total e botões de ação

---

### 4.4 Feature: Navegação e Deep Linking

**Requisitos:**
- ✅ Esquema de URL: `devstore://`
- ✅ Rotas:
  - `devstore://` → Home
  - `devstore://product/{id}` → Detalhes do produto
  - `devstore://cart` → Carrinho

**Configuração (app.json):**
```json
{
  "expo": {
    "scheme": "devstore",
    "ios": {
      "bundleIdentifier": "com.pagaleve.devstore"
    },
    "android": {
      "package": "com.pagaleve.devstore",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [{"scheme": "devstore"}],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

**Testes de Deep Linking:**
```bash
# iOS
npx uri-scheme open devstore://product/1 --ios

# Android
npx uri-scheme open devstore://product/1 --android
```

---

## 5. Tratamento de Erros

### 5.1 Camadas de Erro

#### 5.1.1 API Errors (Server State)
**Responsabilidade:** TanStack Query

**Estratégia:**
```typescript
// Error handling no hook
const { data, error, isLoading, refetch } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  onError: (error) => {
    loggerService.error('Failed to fetch products', error)
    // Toast notification
  }
})
```

**UI Feedback:**
- Loading: Skeleton/Spinner
- Error: ErrorState component com retry button
- Partial error: Toast + manter dados anteriores

#### 5.1.2 Runtime Errors (React)
**Responsabilidade:** Error Boundary

**Implementação:**
```typescript
// shared/components/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <ErrorState
      title="Algo deu errado"
      message={error.message}
      onRetry={resetErrorBoundary}
    />
  )
}

function onError(error, info) {
  loggerService.error('React Error Boundary', { error, info })
  // Simulate sending to external service
}

export function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onError}
      onReset={() => {
        // Reset app state
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
```

#### 5.1.3 GraphQL Errors
**Tipos:**
- Network errors (sem conexão)
- GraphQL errors (query inválida, campo inexistente)
- Partial errors (alguns campos falharam)

**Tratamento:**
```typescript
const fetchGraphQL = async (query: string, variables?: any) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })

    const { data, errors } = await response.json()

    if (errors) {
      loggerService.error('GraphQL Errors', errors)
      throw new GraphQLError(errors)
    }

    return data
  } catch (error) {
    if (error instanceof NetworkError) {
      loggerService.error('Network Error', error)
      throw error
    }
    throw error
  }
}
```

### 5.2 Logger Service

**Interface:**
```typescript
interface LoggerService {
  debug(message: string, context?: any): void
  info(message: string, context?: any): void
  warn(message: string, context?: any): void
  error(message: string, context?: any): void
  fatal(message: string, context?: any): void
}
```

**Implementação:**
```typescript
// shared/services/logger.service.ts
class Logger implements LoggerService {
  private log(level: string, message: string, context?: any) {
    const timestamp = new Date().toISOString()
    const logEntry = { timestamp, level, message, context }

    // Console output (development)
    if (__DEV__) {
      console[level](`[${level.toUpperCase()}]`, message, context)
    }

    // Simulate external service (production)
    if (!__DEV__) {
      this.sendToExternalService(logEntry)
    }
  }

  private sendToExternalService(entry: any) {
    // Simulate Sentry, LogRocket, etc.
    console.log('📤 Sending to external service:', entry)
  }

  debug(message: string, context?: any) {
    this.log('debug', message, context)
  }

  error(message: string, context?: any) {
    this.log('error', message, context)
  }

  // ... outros métodos
}

export const loggerService = new Logger()
```

---

## 6. Design System

O Design System centraliza todos os componentes de UI reutilizáveis, tema e tokens de design, seguindo os princípios de **Atomic Design** e **Design Tokens**.

### 6.1 Estrutura do Design System

```
/src/design_system/
├── components/           # Componentes base (átomos e moléculas)
├── theme/                # Configuração de tema
└── tokens/               # Design tokens (valores primitivos)
```

### 6.2 Componentes Base

Componentes "burros" (dumb components) que apenas recebem props e não têm lógica de negócio.

#### Button
```typescript
// design_system/components/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onPress: () => void
  children: React.ReactNode
  testID?: string
}

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  // Implementação com StyleSheet ou styled-components
}
```

#### Card
```typescript
// design_system/components/Card/Card.tsx
interface CardProps {
  variant?: 'elevated' | 'outlined' | 'filled'
  elevation?: 0 | 1 | 2 | 3 | 4
  padding?: keyof typeof spacing
  borderRadius?: number
  children: React.ReactNode
  onPress?: () => void
  testID?: string
}
```

#### Input
```typescript
// design_system/components/Input/Input.tsx
interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  secureTextEntry?: boolean
  disabled?: boolean
  testID?: string
}
```

#### ErrorState
```typescript
// design_system/components/ErrorState/ErrorState.tsx
interface ErrorStateProps {
  title: string
  message?: string
  icon?: React.ReactNode
  illustration?: 'network' | 'notfound' | 'generic'
  actionLabel?: string
  onRetry?: () => void
  testID?: string
}
```

#### LoadingState
```typescript
// design_system/components/LoadingState/LoadingState.tsx
interface LoadingStateProps {
  type: 'spinner' | 'skeleton'
  count?: number // Para skeleton list
  size?: 'sm' | 'md' | 'lg'
  testID?: string
}
```

#### Toast (Implementado em `src/shared/components/Toast/`)
```typescript
// shared/components/Toast/ToastContext.tsx
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  hideToast: () => void;
  currentToast: ToastMessage | null;
}

// Uso:
const { showToast } = useToast();
showToast('Produto adicionado ao carrinho', 'success');
```

**Características:**
- Context API para gerenciamento global
- Animação de entrada/saída com `Animated.spring`
- Auto-dismiss configurável (padrão: 3 segundos)
- Posicionamento respeitando Safe Area
- Tipos: `success` (verde), `error` (vermelho), `info` (azul)

#### CartIcon (Implementado em `src/shared/components/CartIcon/`)
```typescript
// shared/components/CartIcon/CartIcon.tsx
export const CartIcon: React.FC = () => {
  const { cart } = useCart();
  const totalItems = cart.totalItems;
  // Badge animado quando itens são adicionados
}
```

**Características:**
- Badge com contagem de itens
- Animação "pulse" ao adicionar item (scale 1.0 → 1.4 → 1.0)
- Navega para tela do carrinho ao clicar
- Escondido na própria tela do carrinho

### 6.3 Design Tokens

Design tokens são os valores primitivos do design system (cores, espaçamentos, tipografia, etc.).

```typescript
// design_system/tokens/colors.tokens.ts
export const colorTokens = {
  // Brand colors
  brand: {
    primary: '#007AFF',
    secondary: '#5856D6',
  },

  // Semantic colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  }
} as const

// design_system/tokens/spacing.tokens.ts
export const spacingTokens = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

// design_system/tokens/typography.tokens.ts
export const typographyTokens = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
} as const
```

### 6.4 Sistema de Temas

O tema consome os design tokens e cria variações (light/dark).

```typescript
// design_system/theme/colors.ts
import { colorTokens } from '../tokens/colors.tokens'

export const lightColors = {
  primary: {
    main: colorTokens.brand.primary,
    light: '#5AC8FA',
    dark: '#0051D5',
    contrast: colorTokens.neutral.white,
  },
  secondary: {
    main: colorTokens.brand.secondary,
    light: '#AF52DE',
    dark: '#3634A3',
    contrast: colorTokens.neutral.white,
  },
  background: {
    default: colorTokens.neutral.white,
    paper: colorTokens.neutral.gray50,
    elevated: colorTokens.neutral.white,
  },
  text: {
    primary: colorTokens.neutral.gray900,
    secondary: colorTokens.neutral.gray600,
    disabled: colorTokens.neutral.gray400,
  },
  error: {
    main: colorTokens.error,
    light: '#FF6961',
    dark: '#C62828',
    contrast: colorTokens.neutral.white,
  },
  success: {
    main: colorTokens.success,
    light: '#81C784',
    dark: '#2E7D32',
    contrast: colorTokens.neutral.white,
  },
  divider: colorTokens.neutral.gray200,
  border: colorTokens.neutral.gray300,
}

export const darkColors = {
  primary: {
    main: '#0A84FF',
    light: '#64D2FF',
    dark: '#0055D4',
    contrast: colorTokens.neutral.black,
  },
  // ... versão dark
}

// design_system/theme/spacing.ts
import { spacingTokens } from '../tokens/spacing.tokens'

export const spacing = spacingTokens

// design_system/theme/typography.ts
import { typographyTokens } from '../tokens/typography.tokens'

export const typography = {
  h1: {
    fontSize: typographyTokens.fontSize.xxxl,
    fontWeight: typographyTokens.fontWeight.bold,
    lineHeight: typographyTokens.lineHeight.tight,
  },
  h2: {
    fontSize: typographyTokens.fontSize.xxl,
    fontWeight: typographyTokens.fontWeight.bold,
    lineHeight: typographyTokens.lineHeight.tight,
  },
  h3: {
    fontSize: typographyTokens.fontSize.xl,
    fontWeight: typographyTokens.fontWeight.semibold,
    lineHeight: typographyTokens.lineHeight.normal,
  },
  body1: {
    fontSize: typographyTokens.fontSize.md,
    fontWeight: typographyTokens.fontWeight.regular,
    lineHeight: typographyTokens.lineHeight.normal,
  },
  body2: {
    fontSize: typographyTokens.fontSize.sm,
    fontWeight: typographyTokens.fontWeight.regular,
    lineHeight: typographyTokens.lineHeight.normal,
  },
  caption: {
    fontSize: typographyTokens.fontSize.xs,
    fontWeight: typographyTokens.fontWeight.regular,
    lineHeight: typographyTokens.lineHeight.normal,
  },
  button: {
    fontSize: typographyTokens.fontSize.md,
    fontWeight: typographyTokens.fontWeight.semibold,
    lineHeight: typographyTokens.lineHeight.tight,
  },
}

// design_system/theme/index.ts
export const theme = {
  colors: lightColors,
  spacing,
  typography,
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
}

export type Theme = typeof theme
```

### 6.5 Uso do Design System

```typescript
// Exemplo de uso em um componente de apresentação
import { Button } from '@/design_system/components/Button/Button'
import { theme } from '@/design_system/theme'

export function MyComponent() {
  return (
    <Button
      variant="primary"
      size="md"
      onPress={() => console.log('Pressed')}
    >
      Clique aqui
    </Button>
  )
}
```

### 6.6 Princípios do Design System

1. **Componentes Burros:** Não contêm lógica de negócio, apenas UI
2. **Type-safe:** Todas as props são tipadas com TypeScript
3. **Testáveis:** testID em todos os componentes para testes
4. **Acessíveis:** Suporte a screen readers e navegação por teclado
5. **Consistentes:** Usam sempre os design tokens
6. **Documentados:** Cada componente tem exemplos de uso

---

## 7. Clean Architecture + React Native: Adaptações

### 7.1 Diferenças do Flutter para React Native

No Flutter, Clean Architecture segue um padrão rígido com:
- **Repositories** (interfaces e implementações)
- **DataSources** (interfaces e implementações)
- **UseCases** (classes com método call())
- **BLoC/Cubit** (state management)
- **GetIt** (dependency injection)
- **Either<L, R>** da biblioteca Dartz (error handling funcional)

No React Native com Expo + TanStack Query + Zustand, adaptamos para:

| Flutter | React Native | Justificativa |
|---------|-------------|---------------|
| Repository Pattern | TanStack Query Hooks | React Query já é um repository com cache |
| BLoC/Cubit | Hooks + TanStack Query | Hooks são mais idiomáticos no React |
| GetIt (DI) | Context + Hooks | React tem DI nativo via Context |
| Either<L, R> | Try/Catch + Type Guards | TypeScript tem error handling robusto |
| Equatable | Immer (no Zustand) | Imutabilidade automática |

### 7.2 Fluxo de Dados Comparado

#### Flutter (Tradicional)
```
UI → Cubit → UseCase → Repository → DataSource → API
                ↓
              State
```

#### React Native (Adaptado)
```
UI → Hook (useProducts) → TanStack Query → External DataSource → API
                             ↓
                          Cache/State
```

### 7.3 Mapeamento de Camadas

#### Domain Layer (Entidades e Interfaces)
```typescript
// domain/entities/Product.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
}

// domain/repositories/ProductRepository.ts (Interface Abstrata)
import { Either } from '@core/either';
import { AppError } from '@core/errors';

export interface ProductRepository {
  getProducts(params: GetProductsParams): Promise<Either<AppError, Product[]>>;
  getProductById(id: number): Promise<Either<AppError, Product>>;
}
```

**Nota:** A camada Domain define apenas interfaces (contratos). Implementações ficam em Data/External.

#### Data Layer (DTOs e Implementações)
```typescript
// data/dtos/ProductDTO.ts (com validação Zod)
import { z } from 'zod';

export const ProductDTOSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  // ...
});

export type ProductDTO = z.infer<typeof ProductDTOSchema>;

// data/datasources/ProductRemoteDataSource.ts (Interface)
export interface ProductRemoteDataSource {
  getProducts(params: GetProductsParams): Promise<Either<AppError, ProductDTO[]>>;
  getProductById(id: number): Promise<Either<AppError, ProductDTO>>;
}

// data/repositories/ProductRepositoryImpl.ts (Implementação)
export class ProductRepositoryImpl implements ProductRepository {
  constructor(private remoteDataSource: ProductRemoteDataSource) {}

  async getProducts(params: GetProductsParams): Promise<Either<AppError, Product[]>> {
    const result = await this.remoteDataSource.getProducts(params);
    return result.map(dtos => dtos.map(ProductMapper.toDomain));
  }
}
```

#### External Layer (GraphQL)
```typescript
// external/datasources/ProductRemoteDataSourceImpl.ts
import { graphqlClient } from '@core/graphql';
import { GET_PRODUCTS } from '../graphql/queries';

export class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  async getProducts(params: GetProductsParams): Promise<Either<AppError, ProductDTO[]>> {
    try {
      const response = await graphqlClient.request<ProductsResponseDTO>(GET_PRODUCTS, params);
      const validation = ProductsResponseDTOSchema.safeParse(response);

      if (!validation.success) {
        return left(validationError('Invalid data'));
      }

      return right(validation.data.products);
    } catch (error) {
      return left(networkError('Failed to fetch products', error));
    }
  }
}
```

#### Injection Layer (DI Container)
```typescript
// injection/ProductContainer.ts
import { ProductRemoteDataSourceImpl } from '../external/datasources/ProductRemoteDataSourceImpl';
import { ProductRepositoryImpl } from '../data/repositories/ProductRepositoryImpl';

const remoteDataSource = new ProductRemoteDataSourceImpl();
const repository = new ProductRepositoryImpl(remoteDataSource);

export const productContainer = {
  remoteDataSource,
  repository,
};
```

#### Presentation Layer (Hooks)
```typescript
// presentation/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productContainer } from '../../injection/ProductContainer';
import { QUERY_CONFIG } from '@shared/constants';

export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const result = await productContainer.repository.getProducts(params);

      if (result.isLeft()) {
        throw result.value;
      }

      return result.value;
    },
    staleTime: QUERY_CONFIG.STALE_TIME,
  });
}
```

### 7.4 Simplificação Pragmática (Opcional)

Para projetos menores, podemos simplificar eliminando algumas abstrações:

**Versão Simplificada (Mantendo Princípios):**
```typescript
// presentation/hooks/products/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '@/external/api/products.api'
import { ProductModel } from '@/data/models/ProductModel'

export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const models = await fetchProducts(params)
      return models.map(model => model.toEntity()) // Convert to domain entity
    },
  })
}
```

**Vantagens da Simplificação:**
- Menos boilerplate
- Mais rápido de implementar
- Ainda mantém separação de camadas (Model → Entity)
- TanStack Query já fornece cache, retry, etc.

**Quando usar versão completa:**
- Equipe grande (>5 pessoas)
- Projeto de longa duração (>1 ano)
- Múltiplas fontes de dados
- Necessidade de trocar implementações

**Quando simplificar:**
- Projeto pequeno/médio
- Prova de conceito
- Equipe pequena
- Deadline apertado

### 7.5 Recomendação para Este Projeto

Para o teste da Pagaleve, vamos usar uma **abordagem híbrida**:

✅ **Manter:**
- Separação de camadas (domain, data, external, presentation)
- Entities no domain
- Models no data (com toEntity/fromEntity)
- Error handling tipado
- Design System separado

⚡ **Simplificar:**
- Hooks ao invés de UseCases como classes
- TanStack Query ao invés de Repository pattern completo
- Zustand direto ao invés de BLoC pattern
- Dependency injection simples (não precisa de GetIt/tsyringe)

Esta abordagem demonstra conhecimento de Clean Architecture enquanto é pragmática para React Native.

---

## 8. Estado da Aplicação

### 8.1 Server State (TanStack Query)

**O que vai aqui:**
- Dados de produtos (listagem, detalhes)
- Categorias
- Dados de API em geral

**Configuração:**
```typescript
// shared/constants/query.ts
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000,  // 5 minutos
  GC_TIME: 10 * 60 * 1000,    // 10 minutos
} as const;

// core/providers/QueryProvider.tsx
import { QUERY_CONFIG } from '@shared/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      gcTime: QUERY_CONFIG.GC_TIME,
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

### 8.2 Client State (Zustand)

**O que vai aqui:**
- Carrinho de compras
- Preferências de usuário
- Tema (dark/light)
- Sessão/autenticação (se houver)

**Estrutura:**
```typescript
// features/cart/external/stores/ZustandCartStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { asyncStorageService, zustandStorageAdapter } from '@core/storage'

const zustandStorage = zustandStorageAdapter(asyncStorageService)

export const useZustandCartStore = create(
  persist(
    (set) => ({
      cart: createEmptyCart(),
      setItems: (items) => set({ cart: createCart(items) }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
```

**Nota:** O Zustand Store fica em `/external/stores/` e usa a abstração `@core/storage` ao invés de importar AsyncStorage diretamente. O hook `useCart` em `/presentation/hooks/` consome o repositório via `CartContainer`.

---

## 9. Testes

### 8.1 Testes Unitários

**O que testar:**
- Zustand stores
- Hooks customizados
- Utilitários/helpers
- Schemas de validação

**Exemplo:**
```typescript
// __tests__/unit/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useCart } from '@/features/cart/presentation/hooks/useCart'

describe('useCart', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addToCart({
        productId: 1,
        title: 'Product',
        price: 100,
        imageUrl: 'url'
      })
    })

    expect(result.current.cart.items).toHaveLength(1)
    expect(result.current.cart.totalPrice).toBe(100)
  })
})
```

### 8.2 Testes de Integração

**O que testar:**
- Componentes visuais
- Fluxos de usuário
- Interação entre componentes

**Exemplo:**
```typescript
// __tests__/integration/components/ProductCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { ProductCard } from '@/features/products/components/ProductCard'

describe('ProductCard', () => {
  it('should call onPress when tapped', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={onPress}
      />
    )

    fireEvent.press(getByTestId('product-card'))
    expect(onPress).toHaveBeenCalledWith(mockProduct.id)
  })
})
```

---

## 10. Checklist de Implementação

### Phase 1: Setup (Prioridade Alta)
- [ ] Criar projeto Expo com TypeScript
- [ ] Configurar estrutura de pastas
- [ ] Instalar dependências obrigatórias
- [ ] Configurar TanStack Query
- [ ] Configurar GraphQL client
- [ ] Configurar Expo Router
- [ ] Configurar Deep Linking (app.json)

### Phase 2: Design System (Prioridade Alta)
- [ ] Criar tema (colors, spacing, typography)
- [ ] Implementar Button component
- [ ] Implementar Card component
- [ ] Implementar Input component
- [ ] Implementar ErrorState component
- [ ] Implementar LoadingState component
- [ ] Implementar Toast component

### Phase 3: Core Features (Prioridade Alta)
- [ ] Implementar Error Boundary
- [ ] Implementar Logger Service
- [ ] Configurar Query Provider
- [ ] Implementar GraphQL queries (products)
- [ ] Implementar hooks de produtos
- [ ] Implementar ProductList component
- [ ] Implementar ProductCard component
- [ ] Implementar ProductDetail component

### Phase 4: Carrinho (Prioridade Média)
- [ ] Criar Zustand cart store
- [ ] Configurar persistência
- [ ] Implementar CartItem component
- [ ] Implementar CartSummary component
- [ ] Integrar adicionar ao carrinho
- [ ] Implementar tela de carrinho

### Phase 5: Navegação (Prioridade Alta)
- [ ] Configurar tabs navigation
- [ ] Implementar tela Home
- [ ] Implementar tela Product Details
- [ ] Implementar tela Cart
- [ ] Testar Deep Linking (iOS/Android)

### Phase 6: Polimento (Prioridade Baixa)
- [ ] Implementar infinite scroll
- [ ] Implementar pull to refresh
- [ ] Adicionar animações
- [ ] Otimizar performance
- [ ] Adicionar feedback visual

### Phase 7: Testes (Prioridade Média)
- [ ] Testes unitários (cart store)
- [ ] Testes unitários (hooks)
- [ ] Testes de integração (componentes)
- [ ] Testes de deep linking

### Phase 8: Documentação (Prioridade Alta)
- [ ] README.md completo
- [ ] Instruções de instalação
- [ ] Decisões arquiteturais
- [ ] AI & Workflow Log
- [ ] Comparação Flutter vs Expo (Deep Linking)

---

## 11. Decisões Arquiteturais

### 10.1 Por que Expo Router ao invés de React Navigation?
- **Vantagem:** File-based routing (mais intuitivo)
- **Vantagem:** Deep Linking out-of-the-box
- **Vantagem:** Type-safety automático
- **Desvantagem:** Menos flexível para navegações complexas
- **Decisão:** Usar Expo Router pela simplicidade e Deep Linking nativo

### 10.2 Por que GraphQL-Request ao invés de Apollo Client?
- **Vantagem:** Muito mais leve (~10kb vs ~100kb)
- **Vantagem:** Integração perfeita com React Query
- **Vantagem:** Controle total sobre cache (React Query)
- **Desvantagem:** Sem features avançadas (optimistic updates, etc.)
- **Decisão:** GraphQL-Request + React Query (como sugerido no teste)

### 10.3 Abstração de Storage

Criamos uma abstração em `@core/storage` que permite trocar a implementação de storage facilmente:

```typescript
// core/storage/StorageService.ts (Interface)
export interface StorageService {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// core/storage/zustandStorageAdapter.ts
export const zustandStorageAdapter = (storageService: StorageService): StateStorage => ({
  getItem: async (name) => storageService.getItem(name),
  setItem: async (name, value) => storageService.setItem(name, value),
  removeItem: async (name) => storageService.removeItem(name),
});
```

**Decisão:** Implementação atual usa AsyncStorage. Para migrar para MMKV, basta criar `MMKVStorageService` implementando `StorageService`.

### 10.4 Estrutura Feature-Based vs Domain-Driven
- **Feature-Based:** Agrupa por funcionalidade (`features/products`, `features/cart`)
- **Domain-Driven:** Agrupa por domínio de negócio
- **Decisão:** Feature-Based (mais simples para este escopo)

---

## 12. Métricas de Sucesso

### 11.1 Qualidade de Código
- ✅ TypeScript rigoroso (strict: true, noImplicitAny: true)
- ✅ Zero "any" types
- ✅ ESLint sem warnings
- ✅ Componentes com responsabilidade única
- ✅ Máximo 200 linhas por arquivo

### 11.2 Performance
- ✅ TTI (Time to Interactive) < 3s
- ✅ FlatList otimizado (getItemLayout, windowSize)
- ✅ Imagens otimizadas (lazy loading)
- ✅ Bundle size < 5MB

### 11.3 Resiliência
- ✅ App não crasha com erro de API
- ✅ Error Boundary captura todos os erros
- ✅ Feedback visual para todos os estados
- ✅ Deep Linking funciona 100%

### 11.4 Testabilidade
- ✅ Cobertura de testes > 70%
- ✅ Stores 100% testados
- ✅ Componentes críticos testados

---

## 13. Cronograma Estimado (Referência)

**Nota:** Não fornecemos estimativas de tempo, mas segue a sequência lógica:

1. **Setup** → Base do projeto
2. **Design System** → UI components reutilizáveis
3. **Core Features** → Produtos e listagem
4. **Carrinho** → Estado client-side
5. **Navegação** → Deep Linking
6. **Polimento** → UX improvements
7. **Testes** → Garantir qualidade
8. **Documentação** → README e AI Log

---

## 14. Comparação: Flutter vs React Native (Deep Linking)

### Flutter (GoRouter / auto_route)
```dart
// Definição de rotas
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/product/:id',
      builder: (context, state) {
        final id = state.params['id']!;
        return ProductDetailScreen(id: id);
      },
    ),
  ],
);

// AndroidManifest.xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="devstore" />
</intent-filter>
```

### React Native (Expo Router)
```typescript
// File-based: app/product/[id].tsx
export default function ProductScreen() {
  const { id } = useLocalSearchParams()
  return <ProductDetail id={id} />
}

// app.json
{
  "expo": {
    "scheme": "devstore"
  }
}
```

**Diferenças:**
- **Flutter:** Precisa definir rotas manualmente + configuração nativa
- **Expo Router:** File-based automático + configuração simples no app.json
- **Flutter:** Mais controle granular, mais verbose
- **Expo Router:** Mais mágico, menos boilerplate

---

## 15. Referências

- [Platzi Fake Store API](https://api.escuelajs.co/graphql)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Expo Router Docs](https://docs.expo.dev/routing/introduction/)
- [React Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Documento criado por:** Claude Code (AI Assistant)
**Data:** 2026-01-29
**Última atualização:** 2026-02-03
**Versão:** 1.1

### Changelog v1.1
- Atualizada estrutura de pastas para refletir implementação real
- Adicionado Repository Pattern na feature /cart
- Adicionada abstração de Storage em @core/storage
- Adicionada abstração de GraphQL Client em @core/graphql
- Centralização de configurações em QUERY_CONFIG
- Atualizado mapeamento de camadas com exemplos reais
