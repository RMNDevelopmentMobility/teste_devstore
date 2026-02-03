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
| Expo Router | Navegação |

## Funcionalidades

- **Listagem de produtos** com infinite scroll e cache inteligente
- **Detalhes do produto** com galeria de imagens
- **Carrinho de compras** persistido localmente
- **Toast** de confirmação ao adicionar produtos
- **Badge animado** no ícone do carrinho
- **Deep Linking** (`devstore://products/123`)
- **Splash Screen** com 2 segundos de duração

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go app (iOS/Android) ou emulador configurado

### Instalação

```bash
# Clonar o repositório
git clone <repo-url>
cd test_devstore

# Instalar dependências
npm install

# Corrigir versões (se necessário)
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

## Decisões Arquiteturais

### 1. Estrutura de Pastas: Feature Slices (Vertical Slices)

**Escolha:** Organização por feature ao invés de por camada (horizontal).

```
src/features/
├── product/
│   ├── domain/        # Entidades, interfaces de repositório
│   ├── data/          # DTOs, repositórios, interfaces de datasource
│   ├── external/      # Implementações de datasource, queries GraphQL
│   ├── presentation/  # Screens, components, hooks
│   └── injection/     # Container de DI
├── cart/
│   └── ...mesma estrutura
```

**Por que:**
- Alta coesão: todo código de uma feature está junto
- Baixo acoplamento: features são independentes
- Escalabilidade: adicionar feature = nova pasta
- Manutenção: remover feature = deletar pasta

### 2. TanStack Query para Server State

**Escolha:** Usar TanStack Query (React Query) para gerenciar dados do servidor.

**Por que:**
- Cache automático com stale-while-revalidate
- Deduplicação de requests
- Refetch automático em background
- Estados de loading/error/success built-in
- Infinite scroll com `useInfiniteQuery`

### 3. Zustand para Client State (Carrinho)

**Escolha:** Zustand ao invés de Redux ou Context API.

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
- Type-safe: TypeScript força tratamento de todos os casos
- Explicita sucesso vs erro no retorno
- Composição funcional (map, flatMap)
- Consistente com projeto Flutter de referência

### 5. GraphQL-Request ao invés de Apollo Client

**Escolha:** Biblioteca leve (`graphql-request`) + TanStack Query.

**Por que:**
- Apollo Client é pesado (~100kb) e complexo
- GraphQL-Request (~10kb) oferece 90% dos benefícios
- TanStack Query já gerencia cache
- Mais controle sobre estratégia de cache

### 6. Expo Router para Navegação

**Escolha:** File-based routing com Expo Router.

**Por que:**
- Rotas baseadas em arquivos (similar Next.js)
- Deep linking automático
- Type-safe routes com `typedRoutes: true`
- Melhor DX que React Navigation manual

---

## AI Log

Este projeto foi desenvolvido com assistência de IA (Claude). Abaixo estão as principais interações e correções técnicas realizadas.

### Correções Críticas

#### 1. Estrutura de Pastas (Horizontal -> Vertical)

**Proposta inicial da IA:**
```
src/
├── domain/       # Todos os domínios juntos
├── data/         # Todos os dados juntos
└── presentation/ # Toda apresentação junta
```

**Problema:** Baixa coesão, alto acoplamento, difícil escalar.

**Correção do desenvolvedor:** Feature Slices (vertical), onde cada feature tem suas próprias camadas.

#### 2. Design System Separado

**Proposta inicial da IA:** Componentes de UI em `shared/ui/` e tema em `core/theme/`.

**Correção do desenvolvedor:** Criar pasta `design_system/` dedicada para facilitar documentação, Storybook e potencial publicação como npm package.

#### 3. Code Splitting no React Native

**Afirmação da IA:** Feature Slices permitem lazy loading dinâmico.

**Realidade:** `React.lazy()` não funciona nativamente no React Native. A IA corrigiu explicando que o benefício real é organização e tree shaking, não lazy loading.

### Decisões Aprovadas da IA

- Abordagem híbrida Clean Architecture + React Native
- Separação Server State (TanStack Query) vs Client State (Zustand)
- GraphQL-Request como cliente leve
- Either<L,R> para error handling type-safe

### Discussões Técnicas Documentadas

Veja [AI_WORKFLOW_LOG.md](AI_WORKFLOW_LOG.md) para o log completo incluindo:
- Discussão sobre Either<L,R> vs Try/Catch
- Análise crítica de repositório externo
- Trade-offs de cada decisão arquitetural

---

## Adaptação: Flutter vs Expo (Deep Links e Rotas)

### Deep Links

| Aspecto | Flutter | Expo Router |
|---------|---------|-------------|
| **Configuração** | `AndroidManifest.xml` + `Info.plist` manual | `app.json` com `scheme` e `intentFilters` |
| **Roteamento** | `go_router` ou `auto_route` | File-based automático |
| **Parsing** | Manual com `Uri.parse()` | Automático via `useLocalSearchParams` |
| **Type Safety** | Requer configuração extra | Built-in com `typedRoutes: true` |

### Exemplo Comparativo

**Flutter (go_router):**
```dart
// Configuração manual de rotas
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
// Rota automática baseada no nome do arquivo
export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProductDetailScreen productId={parseInt(id)} />;
}
```

### Principais Diferenças

1. **Configuração:** Flutter exige configuração manual em arquivos nativos; Expo centraliza em `app.json`
2. **Rotas:** Flutter usa definição explícita de rotas; Expo usa convenção de arquivos
3. **Parâmetros:** Flutter requer parsing manual; Expo extrai automaticamente com hooks type-safe
4. **DX:** Expo Router tem experiência similar a Next.js; Flutter segue padrão mais tradicional

### Vantagens do Expo Router

- Zero configuração para rotas básicas
- Deep links funcionam automaticamente com o scheme definido
- Hot reload preserva estado de navegação
- Layouts aninhados com `_layout.tsx`

---

## Estrutura do Projeto

```
src/
├── features/           # Features (product, cart)
│   └── [feature]/
│       ├── domain/     # Entidades, interfaces de repositório
│       ├── data/       # DTOs, repositórios, interfaces de datasource
│       ├── external/   # Implementações de datasource, queries GraphQL
│       └── presentation/ # Screens, components, hooks
├── design_system/      # Tema e componentes base
├── core/               # Erros, logger, either, graphql client
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

## Documentação

- [Especificação Técnica](SPECIFICATION.md)
- [Log de Desenvolvimento com IA](AI_WORKFLOW_LOG.md)
