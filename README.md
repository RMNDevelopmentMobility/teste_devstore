# DevStore

Aplicativo de e-commerce em React Native com Clean Architecture.

## Stack

| Tecnologia | Uso |
|------------|-----|
| Expo + React Native | Framework |
| TypeScript (strict) | Linguagem |
| TanStack Query | Estado servidor |
| Zustand | Estado cliente |
| GraphQL Request | API |
| Expo Router | Navegacao |

## Funcionalidades

- **Listagem de produtos** com infinite scroll e cache inteligente
- **Detalhes do produto** com galeria de imagens
- **Carrinho de compras** persistido localmente
- **Toast** de confirmacao ao adicionar produtos
- **Badge animado** no icone do carrinho
- **Deep Linking** (`devstore://products/123`)
- **Splash Screen** com 2 segundos de duracao

---

## Como Executar

### Pre-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go app (iOS/Android) ou emulador configurado

### Instalacao

```bash
# Clonar o repositorio
git clone <repo-url>
cd test_devstore

# Instalar dependencias
npm install

# Corrigir versoes (se necessario)
npx expo install --fix
```

### Executar o Projeto

```bash
# Iniciar o servidor de desenvolvimento
npx expo start

# Ou especificamente para cada plataforma:
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

### Testar Deep Links

```bash
# Android (com emulador ou dispositivo conectado)
adb shell am start -a android.intent.action.VIEW -d "devstore://products/1"

# iOS Simulator
xcrun simctl openurl booted "devstore://products/1"

# Expo Go (qualquer plataforma)
npx uri-scheme open "devstore://products/1" --android
npx uri-scheme open "devstore://products/1" --ios
```

---

## Decisoes Arquiteturais

### 1. Estrutura de Pastas: Feature Slices (Vertical Slices)

**Escolha:** Organizacao por feature ao inves de por camada (horizontal).

```
src/features/
├── product/
│   ├── domain/        # Entidades, interfaces
│   ├── data/          # DTOs, repositorios
│   ├── external/      # GraphQL, APIs
│   ├── presentation/  # Screens, components, hooks
│   └── injection/     # Container de DI
├── cart/
│   └── ...mesma estrutura
```

**Por que:**
- Alta coesao: todo codigo de uma feature esta junto
- Baixo acoplamento: features sao independentes
- Escalabilidade: adicionar feature = nova pasta
- Manutencao: remover feature = deletar pasta

### 2. TanStack Query para Server State

**Escolha:** Usar TanStack Query (React Query) para gerenciar dados do servidor.

**Por que:**
- Cache automatico com stale-while-revalidate
- Deduplicacao de requests
- Refetch automatico em background
- Estados de loading/error/success built-in
- Infinite scroll com `useInfiniteQuery`

### 3. Zustand para Client State (Carrinho)

**Escolha:** Zustand ao inves de Redux ou Context API.

**Por que:**
- API simples e minimalista
- Sem boilerplate (actions, reducers, dispatchers)
- Persist middleware para AsyncStorage
- TypeScript first-class support
- Bundle size pequeno (~1kb)

### 4. Either<L, R> para Error Handling

**Escolha:** Usar pattern funcional Either com tipo customizado.

```typescript
type Either<L, R> = { _tag: 'Left'; left: L } | { _tag: 'Right'; right: R };
```

**Por que:**
- Type-safe: TypeScript forca tratamento de todos os casos
- Explicita sucesso vs erro no retorno
- Composicao funcional (map, flatMap)
- Consistente com projeto Flutter de referencia

### 5. GraphQL-Request ao inves de Apollo Client

**Escolha:** Biblioteca leve (`graphql-request`) + TanStack Query.

**Por que:**
- Apollo Client e pesado (~100kb) e complexo
- GraphQL-Request (~10kb) oferece 90% dos beneficios
- TanStack Query ja gerencia cache
- Mais controle sobre estrategia de cache

### 6. Expo Router para Navegacao

**Escolha:** File-based routing com Expo Router.

**Por que:**
- Rotas baseadas em arquivos (similar Next.js)
- Deep linking automatico
- Type-safe routes com `typedRoutes: true`
- Melhor DX que React Navigation manual

---

## AI Log

Este projeto foi desenvolvido com assistencia de IA (Claude). Abaixo estao as principais interacoes e correcoes tecnicas realizadas.

### Correcoes Criticas

#### 1. Estrutura de Pastas (Horizontal -> Vertical)

**Proposta inicial da IA:**
```
src/
├── domain/       # Todos os dominios juntos
├── data/         # Todos os dados juntos
└── presentation/ # Toda apresentacao junta
```

**Problema:** Baixa coesao, alto acoplamento, dificil escalar.

**Correcao do desenvolvedor:** Feature Slices (vertical), onde cada feature tem suas proprias camadas.

#### 2. Design System Separado

**Proposta inicial da IA:** Componentes de UI em `shared/ui/` e tema em `core/theme/`.

**Correcao do desenvolvedor:** Criar pasta `design_system/` dedicada para facilitar documentacao, Storybook e potencial publicacao como npm package.

#### 3. Code Splitting no React Native

**Afirmacao da IA:** Feature Slices permitem lazy loading dinamico.

**Realidade:** `React.lazy()` nao funciona nativamente no React Native. A IA corrigiu explicando que o beneficio real e organizacao e tree shaking, nao lazy loading.

### Decisoes Aprovadas da IA

- Abordagem hibrida Clean Architecture + React Native
- Separacao Server State (TanStack Query) vs Client State (Zustand)
- GraphQL-Request como cliente leve
- Either<L,R> para error handling type-safe

### Discussoes Tecnicas Documentadas

Veja [AI_WORKFLOW_LOG.md](AI_WORKFLOW_LOG.md) para o log completo incluindo:
- Discussao sobre Either<L,R> vs Try/Catch
- Analise critica de repositorio externo
- Trade-offs de cada decisao arquitetural

---

## Adaptacao: Flutter vs Expo (Deep Links e Rotas)

### Deep Links

| Aspecto | Flutter | Expo Router |
|---------|---------|-------------|
| **Configuracao** | `AndroidManifest.xml` + `Info.plist` manual | `app.json` com `scheme` e `intentFilters` |
| **Roteamento** | `go_router` ou `auto_route` | File-based automatico |
| **Parsing** | Manual com `Uri.parse()` | Automatico via `useLocalSearchParams` |
| **Type Safety** | Requer configuracao extra | Built-in com `typedRoutes: true` |

### Exemplo Comparativo

**Flutter (go_router):**
```dart
// Configuracao manual de rotas
GoRouter(
  routes: [
    GoRoute(
      path: '/products/:id',
      builder: (context, state) => ProductScreen(
        id: int.parse(state.params['id']!),
      ),
    ),
  ],
);
```

**Expo Router:**
```typescript
// Arquivo: app/products/[id].tsx
// Rota automatica baseada no nome do arquivo
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailScreen productId={parseInt(id)} />;
}
```

### Principais Diferencas

1. **Configuracao:** Flutter exige configuracao manual em arquivos nativos; Expo centraliza em `app.json`
2. **Rotas:** Flutter usa definicao explicita de rotas; Expo usa convencao de arquivos
3. **Parametros:** Flutter requer parsing manual; Expo extrai automaticamente com hooks type-safe
4. **DX:** Expo Router tem experiencia similar a Next.js; Flutter segue padrao mais tradicional

### Vantagens do Expo Router

- Zero configuracao para rotas basicas
- Deep links funcionam automaticamente com o scheme definido
- Hot reload preserva estado de navegacao
- Layouts aninhados com `_layout.tsx`

---

## Estrutura do Projeto

```
src/
├── features/           # Features (product, cart)
│   └── [feature]/
│       ├── domain/     # Entidades e casos de uso
│       ├── data/       # DTOs, repositorios
│       ├── external/   # GraphQL, APIs
│       └── presentation/ # Screens, components, hooks
├── design_system/      # Tema e componentes base
├── core/               # Erros, logger, either
└── shared/             # Componentes compartilhados

app/                    # Expo Router (file-based routes)
├── _layout.tsx         # Layout raiz
├── index.tsx           # Tela inicial (lista de produtos)
├── products/[id].tsx   # Detalhes do produto
└── cart.tsx            # Carrinho
```

## API

**Platzi Fake Store GraphQL**
`https://api.escuelajs.co/graphql`

## Documentacao

- [Especificacao Tecnica](SPECIFICATION.md)
- [Log de Desenvolvimento com IA](AI_WORKFLOW_LOG.md)
