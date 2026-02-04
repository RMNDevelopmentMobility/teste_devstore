# AI & Workflow Log - DevStore Project

> **Requisito do Teste:** Documentar o uso de IA, prompts chave e **críticas técnicas** onde o código da IA foi recusado/corrigido por ser má prática ou alucinação.

---

## Stack de IA Utilizada

- **Claude Sonnet 4.5** (via Claude Code CLI)
- **Contexto:** Desenvolvimento completo do projeto React Native
- **Papel da IA:** Assistente de desenvolvimento, arquitetura e code review

---

## Sessão 1: Planejamento e Especificação Técnica

### Data: 2026-01-29

### Prompt Inicial
```
Teste Pagaleve "DevStore" em React Native

Dado que recebi desafio da empresa Pagaleve para fazer (PDF), em React Native,
preciso construir a aplicação e todos os requisitos do teste proposto.

A aplicação deverá ficar na pasta: /Users/rods/Desktop/Projects/React_Native/test_devstore

Gostaria de utilizar o openspec para mapear todas as tasks e funcionalidades
antes de construir o código

Para a aplicação devemos utilizar os conceitos de clean archicteture, SOLID,
KISS e as melhores práticas do mercado.
```

### Ação da IA
A IA leu o PDF do teste e criou uma especificação técnica completa com:
- Estrutura de pastas
- Stack tecnológica
- Arquitetura detalhada
- Funcionalidades mapeadas
- 15 seções documentadas

### Proposta Inicial da IA: Estrutura Horizontal
```
src/
├── domain/       # Todos os domínios juntos
├── data/         # Todos os dados juntos
├── external/     # Todos os external juntos
├── presentation/ # Toda apresentação junta
└── core/
```

---

## ⚠️ CRÍTICA TÉCNICA #1: Estrutura de Pastas Inadequada para Escalabilidade

### Problema Identificado pelo Desenvolvedor

A estrutura inicial proposta pela IA organizava o código por **tipo de camada** (horizontal), agrupando todos os domains, todos os data layers, etc. em pastas separadas.

**Por que isso é uma má prática para projetos escaláveis:**

1. **Baixa Coesão:** Código relacionado fica espalhado em pastas diferentes
   - Para adicionar uma feature "Product", preciso modificar 4+ pastas diferentes
   - Dificulta o entendimento do escopo de uma feature

2. **Alto Acoplamento:** Features diferentes se misturam nas mesmas pastas
   - `domain/entities/` contém `Product.ts`, `Cart.ts`, `User.ts` todos juntos
   - Difícil separar responsabilidades entre times

3. **Dificuldade de Manutenção:**
   - Remover uma feature = modificar múltiplas pastas
   - Adicionar feature = tocar em código não relacionado

4. **Conflitos de Merge:** Em times grandes, todo mundo mexe nas mesmas pastas
   - `presentation/components/` vira um inferno de conflitos
   - Dificulta trabalho paralelo

### Solução Proposta pelo Desenvolvedor

```
Só não gostei disso...

Na minha cabeça, deveríamos ter:
src/features
├─ product/
   ├── domain/
   ├── data/
   ├── external/
   ├── presentation/
   └── injection/
├─ cart/
   ├── domain/
   ├── data/
   ├── external/
   ├── presentation/
   └── injection/
├── design_system/
├── core/
```

**Por que isso é superior:**

✅ **Alta Coesão:** Todo código de uma feature está junto
✅ **Baixo Acoplamento:** Features são independentes
✅ **Escalabilidade:** Adicionar feature = nova pasta
✅ **Time:** Cada squad pode "possuir" uma feature
✅ **Manutenção:** Remover feature = delete pasta
✅ **Merge:** Menos conflitos (features separadas)

### Conclusão

A IA propôs uma estrutura **tecnicamente correta** para Clean Architecture tradicional, mas **não otimizada para escalabilidade em times grandes**. O desenvolvedor corrigiu para usar **Feature Slices (Vertical Slices)**, que é o padrão recomendado para:
- Aplicações modernas
- Times grandes (5+ pessoas)
- Projetos de longa duração
- Microsserviços/Modular Monolith

**Lição:** Sempre questionar se a arquitetura proposta se adequa ao contexto do projeto, não apenas se está "correta" teoricamente.

---

## ⚠️ CRÍTICA TÉCNICA #2: Design System Não Estava Separado Inicialmente

### Problema Identificado pelo Desenvolvedor

Na primeira versão, a IA colocou os componentes de UI em `shared/ui/` e o tema em `core/theme/`.

**Por que isso é subótimo:**

1. **Falta de Separação de Responsabilidades:**
   - UI components misturados com código compartilhado genérico
   - Theme misturado com providers e serviços

2. **Dificuldade de Documentação:**
   - Design System não tem um "home" claro
   - Designers não sabem onde encontrar componentes

3. **Evolução Limitada:**
   - Difícil adicionar Storybook ou ferramenta de Design System
   - Sem estrutura clara para Design Tokens

### Solução Proposta pelo Desenvolvedor

```
Outro ponto é: não deveríamos ter uma pasta chamada design_system
com os componentes de tela, que são compartilhados, lá dentro?

A parte do core/theme não deveria estar dentro do design_system?
```

**Estrutura Corrigida:**
```
src/
├── design_system/
│   ├── components/  # UI components
│   ├── theme/       # Theme config
│   └── tokens/      # Design tokens
```

**Benefícios:**

✅ Separação clara do Design System
✅ Fácil adicionar Storybook
✅ Designers sabem onde encontrar componentes
✅ Possibilidade de publicar como npm package separado
✅ Design Tokens centralizados

### Conclusão

A IA não considerou a **evolução futura** do Design System. O desenvolvedor antecipou que ter uma pasta dedicada facilitaria:
- Documentação (Storybook)
- Governança (Design Tokens)
- Reuso (potencial npm package)

**Lição:** Arquitetura deve considerar não apenas o estado atual, mas a evolução futura do projeto.

---

## ✅ Decisões Arquiteturais Corretas da IA

### 1. Abordagem Híbrida Clean Architecture + React Native

**Proposta da IA:** Não usar Clean Architecture puro (como Flutter), mas adaptar para o ecossistema React Native.

**Justificativa:**
- TanStack Query já faz o papel de Repository Pattern com cache
- Hooks são mais idiomáticos que UseCases como classes
- Zustand é mais simples que BLoC para client state
- TypeScript tem error handling robusto (não precisa Either<L,R> obrigatoriamente)

**Aprovado pelo desenvolvedor:** ✅ Pragmatismo sem perder princípios SOLID

### 2. Separação Server State vs Client State

**Proposta da IA:**
- Server State → TanStack Query (dados da API)
- Client State → Zustand (carrinho, tema, preferências)

**Justificativa:**
- Evita duplicação de cache
- Cada ferramenta faz o que faz melhor
- Manutenção mais simples

**Aprovado pelo desenvolvedor:** ✅ Seguindo melhores práticas do React

### 3. GraphQL-Request ao invés de Apollo Client

**Proposta da IA:** Usar GraphQL-Request (leve) + TanStack Query

**Justificativa:**
- Apollo Client é pesado (~100kb) e traz complexidade
- GraphQL-Request (~10kb) + React Query oferece 90% dos benefícios
- Mais controle sobre cache
- Teste pede explicitamente "leveza do React Query"

**Aprovado pelo desenvolvedor:** ✅ Seguindo requisitos do teste

---

## Prompts-Chave Utilizados

### Prompt 1: Análise de Requisitos
```
Vou ajudá-lo a construir a aplicação "DevStore" para o teste da Pagaleve.
Primeiro, deixe-me ler o PDF para entender os requisitos do teste.
```

**Resultado:** Leitura e extração de todos os requisitos do PDF

### Prompt 2: Análise de Projeto Flutter Existente
```
Vou analisar seu projeto Flutter para entender melhor a estrutura de
Clean Architecture que você já utiliza e adaptar a especificação do
React Native para seguir os mesmos padrões.
```

**Resultado:**
- Exploração completa do projeto Flutter
- Identificação de padrões usados (domain, data, external, presentation)
- Adaptação para React Native

### Prompt 3: Criação de Especificação
```
Vou criar uma especificação técnica completa do projeto DevStore antes
de começar a implementação, seguindo Clean Architecture, SOLID e KISS.
```

**Resultado:** Documento de 15 seções com 1000+ linhas

---

## Workflow Utilizado

### Fase 1: Descoberta (Completo ✅)
1. ✅ Leitura do PDF do teste
2. ✅ Análise do projeto Flutter de referência
3. ✅ Criação de especificação técnica
4. ✅ Validação e correção da arquitetura

### Fase 2: Implementação (Próximo)
1. ⏳ Setup do projeto Expo + TypeScript
2. ⏳ Criação da estrutura de pastas
3. ⏳ Implementação do Design System
4. ⏳ Implementação das features
5. ⏳ Testes
6. ⏳ Documentação final

---

## Críticas Técnicas Planejadas para Implementação

Durante a implementação, irei avaliar criticamente:

### 1. Código Gerado pela IA
- [ ] Verificar se há `any` types (TypeScript rigoroso exigido)
- [ ] Validar nomes de variáveis (devem ser semânticos)
- [ ] Revisar lógica de negócio (evitar bugs sutis)
- [ ] Checar error handling (não usar apenas try/catch genérico)

### 2. Sugestões de Arquitetura
- [ ] Questionar over-engineering (KISS principle)
- [ ] Validar se segue SOLID
- [ ] Verificar se é escalável para time grande
- [ ] Checar se há código duplicado

### 3. Performance
- [ ] FlatList otimizado (getItemLayout, windowSize)
- [ ] Imagens otimizadas (lazy loading)
- [ ] Bundle size
- [ ] Evitar re-renders desnecessários

### 4. Segurança
- [ ] Não commitar secrets (.env, API keys)
- [ ] Validação de inputs
- [ ] Evitar SQL injection, XSS (mesmo com GraphQL)

---

## 💬 DISCUSSÃO TÉCNICA #1: Either<L, R> e Programação Funcional

### Contexto

Durante a revisão da especificação, o desenvolvedor questionou o arquivo `either.ts` incluído em `core/utils/`, perguntando se programação funcional com Either é comum no React Native.

### Pergunta do Desenvolvedor

```
Vi também que você adicionou um arquivo either.ts na pasta core/utils/...
no Flutter isso serve como programação funcional, onde temos o retorno
em tuplas minimizando o uso de try/catch no código.
A pergunta é: isso também é comum no React Native?
```

### Análise da IA

A IA apresentou 3 opções de error handling:

#### Opção 1: Try/Catch Tradicional (90% dos projetos)
```typescript
try {
  const products = await getProducts()
  setProducts(products)
} catch (error) {
  setError(error)
}
```

**Vantagens:**
- ✅ Familiar para maioria dos devs JavaScript
- ✅ Nativo da linguagem
- ✅ Menos abstrações

**Desvantagens:**
- ❌ Fácil esquecer try/catch
- ❌ Menos type-safe
- ❌ Erros podem não ser tratados

#### Opção 2: Either<L, R> com fp-ts (10-20% dos projetos)
```typescript
import { Either, left, right } from 'fp-ts/Either'

async function getProducts(): Promise<Either<AppError, Product[]>> {
  try {
    const data = await fetch('/api/products')
    return right(data) // Success
  } catch (error) {
    return left(new AppError('Failed', error)) // Failure
  }
}

// Uso type-safe
const result = await getProducts()
if (result._tag === 'Left') {
  setError(result.left)
} else {
  setProducts(result.right)
}
```

**Vantagens:**
- ✅ Type-safe (TypeScript força tratamento de erro)
- ✅ Composição funcional (map, flatMap, fold)
- ✅ Explicita sucesso vs erro
- ✅ Similar ao Flutter (Dartz)

**Desvantagens:**
- ❌ Curva de aprendizado (programação funcional)
- ❌ Menos familiar para devs JavaScript
- ❌ Mais verboso
- ❌ Dependência extra (fp-ts ~150KB)

#### Opção 3: Result Pattern (Meio Termo)
```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

async function getProducts(): Promise<Result<Product[], AppError>> {
  try {
    const data = await fetch('/api/products')
    return { ok: true, value: data }
  } catch (error) {
    return { ok: false, error: new AppError('Failed', error) }
  }
}

// Uso type-safe
const result = await getProducts()
if (result.ok) {
  setProducts(result.value) // TypeScript sabe que é Product[]
} else {
  setError(result.error) // TypeScript sabe que é AppError
}
```

**Vantagens:**
- ✅ Type-safe
- ✅ Simples (sem dependências)
- ✅ Familiar (similar a Rust Result)

**Desvantagens:**
- ⚠️ Sem composição funcional completa

### Recomendação Inicial da IA

A IA recomendou **Opção 3 (Result Pattern)** ou **Try/Catch** por pragmatismo:
- Time pode não ter background funcional
- KISS principle (Keep It Simple)
- Evitar over-engineering

### Decisão Final do Desenvolvedor

**Escolheu: Opção 2 - Either<L, R> com fp-ts** ✅

**Justificativa do Desenvolvedor:**
> "Vamos com a opção C, mas importante logar essa nossa discussão sobre este ponto"

### Análise da Decisão

#### Por que Either<L, R> é uma boa escolha neste contexto:

**1. Demonstra Conhecimento Avançado:**
- Mostra familiaridade com programação funcional
- Demonstra consistência (já usa no Flutter)
- Indica maturidade técnica

**2. Type Safety Completo:**
- TypeScript força tratamento de todos os casos
- Impossível esquecer de tratar erros
- Compiler garante robustez

**3. Composição Funcional:**
```typescript
import { pipe } from 'fp-ts/function'
import { map, mapLeft, fold } from 'fp-ts/Either'

// Composição elegante
const result = await pipe(
  getProducts(),
  map(products => products.filter(p => p.price > 100)),
  map(products => products.map(toViewModel)),
  fold(
    (error) => ({ type: 'error', error }),
    (products) => ({ type: 'success', products })
  )
)
```

**4. Consistência com Flutter:**
- Mesma abordagem usada no projeto Flutter de referência
- Facilita transição mental entre projetos
- Mostra padrão consistente de pensamento

#### Trade-offs Aceitos:

**Complexidade:**
- ✅ **Aceito:** Time de senior developers pode aprender
- ✅ **Aceito:** Documentação e exemplos compensam
- ✅ **Aceito:** Benefícios de type safety superam curva de aprendizado

**Performance:**
- ✅ **Impacto mínimo:** fp-ts é otimizado
- ✅ **Tree shaking:** Bundler remove código não usado
- ✅ **150KB é aceitável** para os benefícios

**Verbosidade:**
- ✅ **Aceito:** Código mais explícito é mais seguro
- ✅ **Aceito:** IDE autocomplete ajuda
- ✅ **Aceito:** Clareza > concisão

### Implementação Planejada

**Dependências:**
```json
{
  "dependencies": {
    "fp-ts": "^2.16.0"
  }
}
```

**Estrutura:**
```typescript
// core/utils/either.ts
export { Either, left, right } from 'fp-ts/Either'
export { pipe } from 'fp-ts/function'
export * from 'fp-ts/Either'

// Helper type
export type AsyncEither<E, A> = Promise<Either<E, A>>
```

**Uso em Repositories:**
```typescript
// features/product/data/repositories/ProductRepositoryImpl.ts
import { Either, left, right } from '@/core/utils/either'
import { AppError } from '@/shared/errors/AppError'
import { Product } from '../../domain/entities/Product'

export class ProductRepositoryImpl {
  async getProducts(): Promise<Either<AppError, Product[]>> {
    try {
      const models = await this.datasource.fetchProducts()
      const entities = models.map(m => m.toEntity())
      return right(entities)
    } catch (error) {
      return left(new NetworkError('Failed to fetch products', error))
    }
  }
}
```

**Uso em Hooks:**
```typescript
// features/product/presentation/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { pipe } from 'fp-ts/function'
import { fold } from 'fp-ts/Either'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const result = await productRepository.getProducts()

      return pipe(
        result,
        fold(
          (error) => { throw error }, // React Query trata erro
          (products) => products      // Sucesso
        )
      )
    }
  })
}
```

### Conclusão

Decisão de usar **Either<L, R> com fp-ts** foi:

**✅ Tecnicamente Superior:**
- Type safety completo
- Composição funcional
- Impossível esquecer tratamento de erro

**✅ Alinhado com Experiência:**
- Mesma abordagem do projeto Flutter
- Demonstra conhecimento avançado
- Consistência entre projetos

**⚠️ Trade-off Consciente:**
- Adiciona complexidade (aceitável)
- Curva de aprendizado (documentado)
- Dependência extra (150KB aceitável)

**Lição:** Às vezes vale a pena escolher a solução mais sofisticada quando:
1. Demonstra conhecimento diferenciado
2. Benefícios superam complexidade
3. Trade-offs são conscientes e documentados
4. Alinha com padrões já estabelecidos (Flutter)

---

## 💬 DISCUSSÃO TÉCNICA #2: Code Splitting e Feature Slices

### Contexto

Durante a revisão, o desenvolvedor questionou a vantagem de "Code Splitting" mencionada na estrutura de Feature Slices.

### Pergunta do Desenvolvedor

```
Me explique isso:
**✅ Code Splitting:**
- Potencial para lazy loading de features
- Bundle mais otimizado
- Melhor performance
```

### Explicação Inicial da IA

A IA explicou code splitting como dividir o bundle JavaScript em pedaços menores carregados sob demanda:

```typescript
// Lazy loading de features
const ProductListScreen = lazy(() =>
  import('@/features/product/presentation/screens/ProductListScreen')
)
```

### ⚠️ CORREÇÃO DA IA: Limitações no React Native

A IA inicialmente foi **otimista demais** sobre code splitting, mas corrigiu:

**Web React:**
- ✅ Code splitting funciona perfeitamente (Webpack/Vite)
- ✅ `React.lazy()` funciona out-of-the-box

**React Native:**
- ❌ `React.lazy()` NÃO funciona nativamente
- ❌ Expo não suporta code splitting dinâmico por padrão
- ⚠️ Possível com Metro bundler config avançada (muito complexo)

### Realidade no React Native

**O que FUNCIONA:**

1. **Tree Shaking:** Remove código não usado (automático)
2. **Route-based splitting:** Expo Router já faz (automático)
3. **Feature Flags:** Não incluir features desabilitadas

**O que NÃO FUNCIONA facilmente:**

1. **Dynamic lazy loading:** Complexo demais
2. **On-demand feature loading:** Não vale a pena

### Correção da Especificação

A IA reconheceu que a vantagem de Feature Slices **NÃO É** lazy loading dinâmico, mas sim:

**Verdadeiras Vantagens:**
- ✅ Organização e manutenibilidade
- ✅ Potencial para feature flags
- ✅ Tree shaking natural (código não usado é removido)
- ✅ Route-based splitting (Expo Router faz automaticamente)

### Auto-Crítica da IA

**Erro:** Superestimar capacidades de code splitting no React Native

**Por que aconteceu:**
- IA generalizou conhecimento de Web React para React Native
- Não considerou limitações do Metro bundler
- Marketing excessivo das vantagens

**Correção:**
- Ser mais honesto sobre limitações
- Focar em benefícios reais (organização, feature flags)
- Não prometer o que a plataforma não entrega facilmente

### Conclusão

**Lição Importante:** Sempre questionar claims de performance/otimização da IA:
- Web ≠ React Native (bundlers diferentes)
- Nem tudo que funciona no Web funciona no Mobile
- Benefícios reais > marketing de features

**Decisão:** Manter Feature Slices pelos benefícios de **organização**, não por code splitting dinâmico.

---

## 🔍 ANÁLISE TÉCNICA: Repositório Externo React Native Clean Architecture

### Contexto

Durante o planejamento, o desenvolvedor encontrou um repositório público de exemplo: [react-native-clean-architecture](https://github.com/carlossalasamper/react-native-clean-architecture)

**Objetivo:** Analisar criticamente para identificar patterns úteis sem comprometer a arquitetura já desenhada.

### Análise Realizada

A IA conduziu análise completa do repositório focando em:
1. Estrutura de pastas e organização
2. Patterns arquiteturais (Use Cases, Repositories, DI)
3. Stack tecnológica (MobX, Inversiland, React Navigation)
4. Boas práticas e gaps críticos

### Principais Descobertas

#### ✅ Pontos Fortes do Repositório

**1. Separação de Camadas Clara**
```
feature/
├── domain/          # Entities + Interfaces
├── application/     # Use Cases
├── infrastructure/  # Implementations + DTOs
└── presentation/    # MobX Stores + UI
```

**2. DTO → Entity Transformation**
- Usa `class-transformer` para automação
- Método `toDomain()` converte DTO para Entity
- Separação clara entre API shape e domain model

**3. Dependency Injection com Inversiland**
```typescript
@module({
  providers: [
    { provide: IRepositoryToken, useClass: RepositoryImpl },
    GetPostsUseCase,
  ]
})
```

**4. MobX + Context Pattern**
```typescript
export class GetPostsStore {
  isLoading = false
  results: PostEntity[] = []

  constructor(@inject(UseCase) private useCase) {
    makeAutoObservable(this)  // Auto-observable
  }
}

const Screen = observer(() => {
  const store = useStore()
  return <FlatList data={store.results} />
})
```

#### ❌ Gaps Críticos Encontrados

**1. Error Handling - INEXISTENTE** 🚨
```typescript
// Código real do repositório:
catch (error) {
  // silently ignored ← RED FLAG
}
```
- Sem estado de erro nas stores
- Erros são engolidos sem feedback
- Usuário fica sem saber o que aconteceu

**2. Testes - ZERO** 🚨
- Nenhum arquivo de teste implementado
- Jest configurado mas com `--passWithNoTests`
- Impossível refatorar com segurança

**3. Input Validation - AUSENTE** ⚠️
- Sem Zod, Yup ou validação
- DTOs transformam mas não validam dados

**4. Tecnologias Menos Comuns**
- **Inversiland**: DI framework pouco conhecido
- **MobX**: Menos usado que Redux/Zustand em RN
- **class-transformer**: Muito verboso para DTOs

### Comparação com Nossa Abordagem DevStore

| Aspecto | Repo Analisado | DevStore (Nossa Spec) | Vencedor |
|---------|----------------|----------------------|----------|
| **Organização** | Bounded Contexts (horizontal) | Feature Slices (vertical) | ✅ DevStore |
| **State Management** | MobX + Context | Zustand | ✅ DevStore |
| **Error Handling** | Inexistente ❌ | Either<L,R> + Error Boundary | ✅ DevStore |
| **DI Framework** | Inversiland (uncommon) | Manual/Simples | ✅ DevStore |
| **Testes** | Zero ❌ | Planejados desde início | ✅ DevStore |
| **DTO Pattern** | class-transformer (verboso) | Simplificado | ✅ DevStore |
| **Navigation** | React Navigation | Expo Router | ✅ DevStore |
| **Validation** | Nenhuma ❌ | Zod | ✅ DevStore |

### Patterns Aprovados para Adoção

Após análise crítica, decidimos **ADOTAR** apenas os seguintes patterns:

**1. Store Interface Pattern** ✅
```typescript
// Definir interface do estado primeiro
interface ProductStoreState {
  isLoading: boolean
  products: Product[]
  error: string | null  // ← Adicionamos isso (repo não tem)
}

// Implementar com type safety
class ProductStore implements ProductStoreState {
  // TypeScript garante todos os campos
}
```

**2. Provider HOC Pattern** ✅
```typescript
export const withProviders = (...providers) => (Component) =>
  providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    <Component />
  )

// Uso elegante
export default withProviders(
  QueryProvider,
  ErrorBoundary,
  ThemeProvider
)(App)
```

**3. Context Hook com Validação** ✅
```typescript
export const useProductStore = () => {
  const store = useContext(ProductStoreContext)

  if (!store) {
    throw new Error(
      'useProductStore must be used within ProductStoreProvider'
    )
  }

  return store
}
```

**4. DTO → Entity Pattern (Simplificado)** ✅
```typescript
// Sem class-transformer (muito verboso)
// Usar transformação simples
export class ProductModel {
  static toEntity(dto: ProductDTO): Product {
    return {
      id: dto.id,
      title: dto.title,
      price: dto.price,
      // ... transformação manual mas clara
    }
  }
}
```

### Patterns Rejeitados

**EVITAR:**

**1. Silent Error Swallowing** ❌
```typescript
// NUNCA fazer isso
catch (error) {
  // nothing
}

// SEMPRE fazer
catch (error) {
  setError(error)
  loggerService.error('Failed to fetch', error)
}
```

**2. Inversiland DI Framework** ❌
- Biblioteca pouco conhecida (baixa adoção)
- Melhor usar DI manual ou tsyringe se necessário
- Evitar lock-in em biblioteca obscura

**3. MobX** ❌
- Já decidimos usar Zustand (mais simples, mais comum)
- MobX adiciona "magic" com decorators
- Zustand é mais explícito e type-safe

**4. class-transformer Verbosity** ❌
```typescript
// Muito boilerplate para cada campo
@Expose()
id!: number

@Expose()
title!: string

@Expose()
description!: string
// ... repete para 20 campos
```

**5. Transient Store Scope** ❌
```typescript
scope: "Transient"  // Nova instância por tela
```
- Perde estado ao navegar para outra tela
- Ruim para "voltar" na navegação
- Melhor usar Singleton + persist

### Decisão Final

**MANTER 100% da Nossa Especificação DevStore** ✅

**Justificativa:**

Nossa abordagem é **superior** porque:

1. **Feature Slices** são mais escaláveis que Bounded Contexts horizontais
   - Melhor para times grandes
   - Código relacionado fica junto
   - Fácil adicionar/remover features

2. **Error Handling Robusto**
   - Either<L,R> com fp-ts (type-safe)
   - Error Boundary implementado
   - Logger Service planejado
   - Repo analisado não tem NENHUM disso

3. **Testes Desde Início**
   - Já planejados na spec
   - Repo analisado tem zero testes

4. **Stack Mainstream**
   - Zustand > MobX (mais comum, mais simples)
   - Expo Router > React Navigation (file-based, type-safe)
   - Zod para validação (repo não tem)

5. **Validação de Inputs**
   - Zod planejado
   - Repo não valida dados

6. **Pragmatismo Sem Over-Engineering**
   - DI simples (sem Inversiland)
   - DTOs simples (sem class-transformer)
   - KISS principle mantido

### Lições Aprendidas

**1. Nem Todo Código Open Source é Bom Exemplo** ⚠️
- Repositório tem 200+ stars mas zero testes
- Clean Architecture != Código de Produção
- Sempre analisar criticamente

**2. Padrões Válidos vs Implementação Problemática** 📊
- Separação de camadas é boa (padrão válido)
- Mas implementação tem gaps críticos (execução ruim)
- Adotar conceitos, não código cegamente

**3. Red Flags em Repositórios de Exemplo** 🚩
- Zero testes
- Errors silently ignored
- TODO comments não implementados
- Bibliotecas obscuras (Inversiland)

**4. Nossa Arquitetura Foi Validada** ✅
- Comparação mostrou que estamos no caminho certo
- Feature Slices > Bounded Contexts horizontais
- Either + Error Boundary > Nada
- Testes planejados > Sem testes

### Conclusão

A análise do repositório externo **validou nossa abordagem** e **reforçou decisões** já tomadas:

✅ **Manter:** Feature Slices, Zustand, Expo Router, Either, Testes
✅ **Adotar:** Store interfaces, Provider HOC, Context hooks com validação
❌ **Evitar:** Inversiland, MobX, class-transformer, silent errors

**Decisão:** Seguir 100% com a especificação DevStore já desenhada, incorporando apenas os 4 patterns úteis identificados (store interfaces, provider HOC, context hooks, DTO simplificado).

**Valor Agregado:** Confirmou que nossa arquitetura é tecnicamente superior e evitou armadilhas (zero testes, sem error handling) que o repositório externo tem.

---

## Próximos Passos

1. **Implementação:** Começar código seguindo a especificação corrigida
2. **Documentação Contínua:** Atualizar este log durante a implementação
3. **Code Review:** Revisar criticamente cada sugestão da IA
4. **Testes:** Validar que tudo funciona conforme esperado

---

## ⚠️ CRÍTICA TÉCNICA #3: GraphQL Client na Pasta Errada

### Data: 2026-02-03

### Problema Identificado pelo Desenvolvedor

A IA colocou o `GraphQLClientSingleton` dentro de `/features/product/external/graphql/graphql-client.ts`.

**Por que isso é uma má prática:**

1. **Violação de Single Responsibility:**
   - O client GraphQL é uma **infraestrutura compartilhada**, não específica de Product
   - Se adicionarmos features como `User`, `Order`, todas usariam o mesmo client
   - Feature não deve "possuir" infraestrutura global

2. **Acoplamento Indevido:**
   - Outras features precisariam importar de `/features/product/...`
   - Cria dependência circular potencial entre features
   - Viola o princípio de que features devem ser independentes

3. **Localização Incorreta na Arquitetura:**
   - `/core` é o lugar correto para infraestrutura compartilhada
   - `/features/*/external` deve conter apenas código específico da feature (ex: queries GraphQL)

### Solução Proposta pelo Desenvolvedor

```
O arquivo graphql-client.ts tem o erro...
Como ele instancia um Singleton do GraphQL, acredito que o lugar
correto seria na pasta /core
```

**Estrutura Corrigida:**
```
src/
├── core/
│   ├── graphql/           # ← NOVO: Client compartilhado
│   │   ├── graphql-client.ts
│   │   └── index.ts
│   ├── either/
│   ├── errors/
│   └── logger/
├── features/
│   └── product/
│       ├── data/
│       │   └── datasources/
│       │       └── ProductRemoteDataSource.ts  # ← Interface apenas
│       └── external/
│           ├── datasources/
│           │   └── ProductRemoteDataSourceImpl.ts  # ← Implementação
│           └── graphql/
│               └── queries.ts  # ← Queries específicas de Product
```

### Correção Adicional: Timeout Inválido

A IA também usou uma propriedade `timeout` que não existe em `graphql-request`:

```typescript
// ❌ ANTES (erro de tipo)
new GraphQLClient(endpoint, {
  timeout: API_CONFIG.TIMEOUT,  // Não existe!
});

// ✅ DEPOIS (correto para React Native)
const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

new GraphQLClient(endpoint, {
  fetch: (url, options) =>
    fetch(url, {
      ...options,
      signal: createTimeoutSignal(API_CONFIG.TIMEOUT),
    }),
});
```

**Nota:** `AbortSignal.timeout()` não é suportado no React Native/Hermes. Usamos `AbortController` com `setTimeout` como alternativa compatível.

### Benefícios da Correção

✅ **Separação Clara:** Infraestrutura em `/core`, queries específicas em `/features`
✅ **Reutilização:** Qualquer feature pode usar `@core/graphql`
✅ **Independência:** Features não dependem umas das outras
✅ **Compatibilidade:** Timeout implementado com AbortController (suportado no React Native)

### Conclusão

A IA cometeu dois erros:
1. **Erro de Arquitetura:** Colocar código compartilhado dentro de uma feature
2. **Erro de API:** Usar propriedade inexistente na biblioteca

**Lição:** Sempre questionar onde o código deve viver na arquitetura, não apenas se funciona.

---

## ⚠️ CRÍTICA TÉCNICA #4: Valores Hardcoded nos Hooks

### Data: 2026-02-03

### Problema Identificado pelo Desenvolvedor

A IA colocou valores de configuração do TanStack Query hardcoded diretamente nos hooks:

```typescript
// ❌ ANTES (hardcoded em múltiplos lugares)
staleTime: 5 * 60 * 1000, // 5 minutes
```

Encontrado em:
- `app/_layout.tsx` (QueryClient defaults)
- `src/features/product/presentation/hooks/useProducts.ts` (3 ocorrências)

**Por que isso é uma má prática:**

1. **Violação de DRY (Don't Repeat Yourself):**
   - Mesmo valor repetido em 4 lugares diferentes
   - Mudança requer editar múltiplos arquivos

2. **Manutenibilidade:**
   - Difícil encontrar todos os lugares que usam o valor
   - Risco de inconsistência se um lugar for esquecido

3. **Configurabilidade:**
   - Valores de configuração devem estar centralizados
   - Facilita ajustes futuros (ex: diferentes staleTime por ambiente)

### Solução Proposta pelo Desenvolvedor

Criar arquivo de configuração dedicado para TanStack Query:

```typescript
// src/shared/constants/query.ts
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutos
  GC_TIME: 10 * 60 * 1000,   // 10 minutos (garbage collection)
} as const;
```

**Uso:**
```typescript
// ✅ DEPOIS (centralizado)
import { QUERY_CONFIG } from '@shared/constants';

staleTime: QUERY_CONFIG.STALE_TIME,
```

### Benefícios da Correção

✅ **Single Source of Truth:** Um único lugar para configurações de query
✅ **Manutenibilidade:** Mudança em um arquivo afeta todos os usos
✅ **Extensibilidade:** Fácil adicionar novas configurações (GC_TIME, retry, etc.)
✅ **Legibilidade:** `QUERY_CONFIG.STALE_TIME` é mais expressivo que `5 * 60 * 1000`

### Conclusão

A IA não considerou a centralização de valores de configuração. Embora funcional, o código hardcoded dificulta manutenção a longo prazo.

**Lição:** Identificar "magic numbers" e extraí-los para constantes nomeadas em arquivos de configuração.

---

## ⚠️ CRÍTICA TÉCNICA #5: Feature Cart sem Abstração de Repositório

### Data: 2026-02-03

### Problema Identificado pelo Desenvolvedor

A IA implementou a feature `/cart` com acoplamento direto ao Zustand:

```typescript
// ❌ ANTES: Hook acoplado diretamente ao Zustand
import { useCartStore } from '../../data/stores/CartStore';

export const useCart = () => {
  const cart = useCartStore((state) => state.cart);
  // ...
};
```

**Estrutura anterior:**
```
src/features/cart/
├── domain/
│   ├── entities/
│   └── use_cases/
├── data/
│   └── stores/
│       └── CartStore.ts  # ← Zustand direto, sem abstração
└── presentation/
    └── hooks/
        └── useCart.ts    # ← Acoplado ao Zustand
```

**Por que isso é uma má prática:**

1. **Violação do Dependency Inversion Principle:**
   - Presentation layer depende de implementação concreta (Zustand)
   - Impossível trocar Zustand por outra solução sem alterar hooks

2. **Inconsistência Arquitetural:**
   - Feature `/product` segue Clean Architecture com abstrações
   - Feature `/cart` não segue o mesmo padrão
   - Dificulta onboarding de novos desenvolvedores

3. **Testabilidade Comprometida:**
   - Não é possível mockar o repositório em testes
   - Testes ficam acoplados à implementação

### Solução Proposta pelo Desenvolvedor

Aplicar o mesmo padrão de `/product` com Repository Pattern:

```
// ✅ DEPOIS: Estrutura com abstrações
src/features/cart/
├── domain/
│   ├── entities/
│   ├── repositories/
│   │   └── CartRepository.ts       # ← Interface (abstração)
│   └── use_cases/
├── data/
│   └── repositories/
│       └── CartRepositoryImpl.ts   # ← Implementação
├── external/
│   └── stores/
│       └── ZustandCartStore.ts     # ← Detalhes do Zustand isolados
├── injection/
│   └── CartContainer.ts            # ← DI Container
└── presentation/
    └── hooks/
        └── useCart.ts              # ← Usa CartContainer
```

**Interface do repositório:**
```typescript
// domain/repositories/CartRepository.ts
export interface CartRepository {
  getCart(): Cart;
  addToCart(params: AddToCartParams): void;
  removeFromCart(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  clearCart(): void;
  subscribe(listener: (cart: Cart) => void): () => void;
}
```

**Hook refatorado:**
```typescript
// presentation/hooks/useCart.ts
import { useSyncExternalStore, useCallback } from 'react';
import { cartContainer } from '../../injection/CartContainer';

export const useCart = () => {
  const cart = useSyncExternalStore(
    (onStoreChange) => repository.subscribe(onStoreChange),
    () => repository.getCart()
  );
  // ...
};
```

### Benefícios da Correção

✅ **Dependency Inversion:** Presentation depende de abstração, não de Zustand
✅ **Consistência:** Ambas features seguem o mesmo padrão arquitetural
✅ **Flexibilidade:** Trocar Zustand requer apenas nova implementação de `CartRepository`
✅ **Testabilidade:** Fácil mockar `CartRepository` em testes unitários
✅ **Manutenibilidade:** Separação clara de responsabilidades

### Conclusão

A IA tratou client state (Cart) diferente de server state (Product), mas o Dependency Inversion Principle deve ser aplicado independente da origem dos dados.

**Lição:** Abstrações são sobre desacoplamento, não sobre a natureza dos dados (local vs remoto).

---

## ⚠️ CRÍTICA TÉCNICA #6: AsyncStorage sem Abstração

### Data: 2026-02-03

### Problema Identificado pelo Desenvolvedor

A IA usou AsyncStorage diretamente no ZustandCartStore:

```typescript
// ❌ ANTES: Dependência direta do AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

storage: createJSONStorage(() => AsyncStorage),
```

**Por que isso é uma má prática:**

1. **Acoplamento a Implementação Específica:**
   - Se quiser trocar AsyncStorage por MMKV (mais performático), precisa alterar todos os stores
   - Não segue o mesmo padrão do GraphQL Client que foi para `/core`

2. **Inconsistência Arquitetural:**
   - GraphQL Client tem abstração em `/core/graphql`
   - Storage não tinha abstração equivalente

### Solução Proposta pelo Desenvolvedor

Criar abstração de Storage em `/core/storage`:

```typescript
// src/core/storage/StorageService.ts (Interface)
export interface StorageService {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// src/core/storage/AsyncStorageService.ts (Implementação)
export class AsyncStorageService implements StorageService {
  // Wrapper do AsyncStorage
}

// src/core/storage/zustandStorageAdapter.ts (Adapter para Zustand)
export const zustandStorageAdapter = (storageService: StorageService): StateStorage => ({
  getItem: (name) => storageService.getItem(name),
  setItem: (name, value) => storageService.setItem(name, value),
  removeItem: (name) => storageService.removeItem(name),
});
```

**Uso no ZustandCartStore:**
```typescript
// ✅ DEPOIS: Usa abstração do /core
import { asyncStorageService, zustandStorageAdapter } from '@core/storage';

const zustandStorage = zustandStorageAdapter(asyncStorageService);

storage: createJSONStorage(() => zustandStorage),
```

### Benefícios da Correção

✅ **Flexibilidade:** Trocar AsyncStorage por MMKV = mudar apenas `/core/storage`
✅ **Consistência:** Mesma abordagem de GraphQL Client e Storage
✅ **Testabilidade:** Fácil mockar storage em testes
✅ **Single Responsibility:** `/core` concentra todas as infraestruturas compartilhadas

### Conclusão

A IA criou abstração para GraphQL mas não para Storage. Ambos são infraestrutura compartilhada e merecem o mesmo tratamento.

**Lição:** Quando criar uma abstração para uma infraestrutura, avaliar se outras infraestruturas similares também precisam.

---

## Conclusão Parcial

A IA foi muito útil para:
✅ Acelerar criação de documentação
✅ Propor arquitetura inicial
✅ Mapear requisitos

Mas o **pensamento crítico do desenvolvedor** foi essencial para:
⚠️ Corrigir estrutura de pastas (horizontal → vertical)
⚠️ Separar Design System adequadamente
⚠️ Adaptar Clean Architecture para contexto React Native
⚠️ Mover GraphQL Client para /core (infraestrutura compartilhada)
⚠️ Separar interface de datasource (/data) da implementação (/external)
⚠️ Centralizar configurações de query em arquivo dedicado
⚠️ Aplicar Repository Pattern na feature Cart (consistência arquitetural)
⚠️ Criar abstração de Storage em /core (mesma abordagem do GraphQL)

**Lição Principal:** IA é uma ferramenta poderosa, mas não substitui experiência e pensamento crítico sobre trade-offs arquiteturais.

---

**Última atualização:** 2026-02-03
**Status:** Implementação Completa | Revisão de Código em Andamento
