# PRD — API Backend da Syntax Wear

## 1. Visão geral

Construir uma API para centralizar catálogo, clientes, estoque, carrinho, pedidos e pagamentos da Syntax Wear. A API substituirá os dados mockados e o carrinho armazenado apenas no navegador, permitindo que a loja e uma futura área administrativa usem dados persistentes e regras de negócio consistentes.

Este PRD considera a loja atual: listagem e detalhe de produtos, navegação por categoria, carrinho, cadastro/login, cálculo de entrega por CEP, preços promocionais para PIX e formulário de newsletter. O checkout e o processamento de pagamentos ainda não estão implementados.

## 2. Objetivos

- Disponibilizar catálogo e categorias persistidos e consultáveis pela loja.
- Permitir cadastro e autenticação segura de clientes e administradores.
- Criar pedidos com valores calculados e validados no servidor.
- Processar pagamentos pelo Stripe e manter o estado dos pedidos sincronizado.
- Oferecer operações administrativas para gerenciar produtos, categorias, usuários e pedidos.
- Garantir integridade de estoque e rastreabilidade das mudanças de status.

## 3. Usuários e permissões

| Perfil | Permissões principais |
|---|---|
| Visitante | Consultar produtos e categorias, calcular frete e iniciar checkout. |
| Cliente autenticado | Gerenciar os próprios dados e endereços, criar pedidos e consultar somente os próprios pedidos. |
| Administrador | Gerenciar produtos, categorias, usuários e pedidos; consultar dados operacionais da loja. |

Toda operação administrativa deve exigir autenticação e autorização por papel. Um cliente não pode acessar ou alterar dados de outro cliente.

## 4. Escopo funcional

### 4.1 Catálogo e consulta de produtos — Must

- Listar produtos ativos com paginação e filtros por categoria, disponibilidade e faixa de preço.
- Consultar produto por identificador ou slug, incluindo descrição, categoria, imagens, preço e disponibilidade.
- Permitir busca por nome e descrição.
- Retornar ordenação por relevância, preço e data de criação.
- Não expor produtos arquivados ou indisponíveis na vitrine pública, exceto quando explicitamente solicitados por um administrador.

### 4.2 CRUD de produtos — Must

- Criar, consultar, editar, ativar/desativar e arquivar produtos.
- Manter nome, slug, descrição, preço, preço promocional, cor, imagens, categoria, status e timestamps.
- Controlar estoque disponível; impedir quantidades negativas e compras acima do estoque.
- Registrar variações do produto (por exemplo, tamanho e cor) e estoque por variação caso a loja venda itens com essas opções.
- Validar preço, categoria e campos obrigatórios antes de persistir.
- Usar Supabase Storage (ou referência externa) para imagens; armazenar no banco apenas URLs e metadados.

### 4.3 CRUD de categorias — Must

- Criar, consultar, editar, ativar/desativar e arquivar categorias.
- Manter nome, slug, descrição opcional, imagem opcional e status.
- Listar produtos associados e impedir exclusão física de categoria vinculada a produtos ou pedidos; oferecer arquivamento ou exigir reclassificação.
- Garantir unicidade do slug.

### 4.4 Usuários, cadastro e autenticação — Must

- Cadastrar cliente com nome, sobrenome, e-mail, senha e dados de contato; CPF e data de nascimento conforme exigido no checkout/regra comercial.
- Autenticar por e-mail e senha e emitir JWT de acesso; oferecer renovação segura de sessão e logout/revogação.
- Permitir consulta e atualização do próprio perfil e endereços.
- Permitir que o administrador consulte, edite dados permitidos, bloqueie/desbloqueie e altere o papel dos usuários.
- Garantir e-mail único, validação dos dados e armazenamento de senha com hash seguro (nunca em texto puro).
- Prever recuperação de senha e verificação de e-mail, ainda que possam ficar fora do primeiro corte do MVP.

### 4.5 Carrinho — Must

- Criar e atualizar carrinho, adicionar/remover produtos e alterar quantidades.
- Associar carrinho ao cliente autenticado; permitir carrinho de visitante por identificador temporário se o checkout sem cadastro for habilitado.
- Recalcular preços e disponibilidade no servidor a cada alteração ou criação do pedido. O valor enviado pelo navegador nunca é fonte confiável.
- Consolidar itens duplicados e validar limites de quantidade e estoque.

### 4.6 Frete e endereço — Must

- Receber CEP e endereço de entrega e retornar opções, prazo e custo de frete.
- Validar CEP e endereço e manter a cotação associada ao checkout/pedido com prazo de validade.
- Centralizar regras de preço e cobertura no backend; não depender de valores fixos no frontend.
- Na primeira versão, integrar ViaCEP para consulta de endereço e suportar a regra de frete definida pela loja. Integrador logístico/cálculo por transportadora pode ser fase posterior.

### 4.7 Checkout, pedidos e Stripe — Must

- Criar pedido a partir do carrinho após validar cliente/visitante, endereço, preços, estoque, frete e descontos.
- Persistir uma fotografia dos itens do pedido (nome, SKU/variação, quantidade e preço unitário no momento da compra), além de subtotal, frete, descontos e total.
- Criar sessão/intenção de pagamento no Stripe a partir dos valores calculados pelo backend. Não armazenar dados de cartão.
- Suportar os meios de pagamento habilitados na conta Stripe da loja; validar disponibilidade de cartão e PIX para país/moeda configurados.
- Confirmar pagamento exclusivamente por webhook Stripe com validação de assinatura; tratar reenvios de forma idempotente.
- Atualizar status de pagamento e pedido de forma consistente, reservar/baixar estoque conforme política definida e registrar falhas/cancelamentos.
- Permitir ao cliente consultar seus pedidos e ao administrador pesquisar, filtrar e atualizar status operacional.
- Manter histórico de eventos/status, incluindo data e responsável quando a alteração for manual.
- Implementar cancelamento e reembolso via Stripe, respeitando o estado do pedido e registrando o resultado da operação.

**Estados iniciais sugeridos**

- Pedido: `PENDING_PAYMENT`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELED`, `REFUNDED`.
- Pagamento: `PENDING`, `SUCCEEDED`, `FAILED`, `CANCELED`, `REFUNDED`.

As transições permitidas devem ser validadas no backend. O status `PAID` deve decorrer de confirmação confiável do Stripe, não de uma chamada do cliente.

### 4.8 Newsletter — Should

- Receber inscrição por e-mail, validar formato e evitar inscrições duplicadas.
- Permitir descadastro e armazenar consentimento e data de inscrição conforme requisitos de privacidade.
- Integrar futuramente com uma plataforma de e-mail marketing; não enviar campanhas diretamente pela API transacional.

### 4.9 Administração e auditoria — Should

- Disponibilizar recursos para o painel administrativo operar catálogo, categorias, usuários e pedidos.
- Registrar alterações administrativas sensíveis (ator, recurso, ação e data).
- Permitir busca e filtros para pedidos por status, cliente, período e identificador.
- Não incluir construção do painel administrativo no escopo desta API, salvo decisão posterior.

## 5. Requisitos não funcionais

- **Segurança:** validar e sanitizar entradas; usar HTTPS; limitar tentativas de autenticação; aplicar autorização em cada recurso; proteger segredos via variáveis de ambiente; nunca registrar senhas, tokens ou dados de cartão.
- **Privacidade:** coletar apenas dados necessários, restringir acesso por perfil e permitir correção/remoção conforme política de retenção e LGPD.
- **Integridade:** usar transações do banco para operações relacionadas a pedido, itens e estoque; usar idempotência em webhooks e criação de pagamento.
- **Disponibilidade e observabilidade:** logs estruturados sem dados sensíveis, rastreamento de erros e health check.
- **API:** versionar rotas (por exemplo, `/api/v1`), documentar contratos e padronizar erros e paginação.
- **Qualidade:** testes unitários e de integração com Vitest; testar autorização, validação, estoque, fluxo de pedido, webhook e cenários de falha do Stripe.

## 6. Requisitos técnicos

- Node.js + Fastify + TypeScript.
- Supabase PostgreSQL como banco de dados; Supabase Storage para imagens, se adotado.
- Prisma para schema, acesso a dados e migrações. Configurar corretamente URLs de conexão direta e pooler do Supabase conforme o uso (migrações versus runtime).
- JWT para autenticação, com segredo/chaves fora do código-fonte e expiração curta para token de acesso.
- Stripe para criação e acompanhamento de pagamentos e reembolsos.
- Vitest para testes automatizados.

## 7. Modelo de dados inicial

- **User:** id, nome, sobrenome, e-mail único, hash da senha (se autenticação própria), telefone, CPF/data de nascimento opcionais conforme necessidade, papel, status, timestamps.
- **Address:** id, userId opcional para checkout visitante, CEP, logradouro, número, complemento, bairro, cidade, estado e referência.
- **Category:** id, nome, slug único, descrição/imagem opcionais, status, timestamps.
- **Product:** id, nome, slug, descrição, preço, preço promocional opcional, cor, status, categoryId, timestamps.
- **ProductImage:** id, productId, URL, texto alternativo e ordem.
- **ProductVariant/Inventory:** variação (ex.: tamanho/cor), SKU e quantidade disponível/reservada, caso haja venda por variante.
- **Cart/CartItem:** cliente ou sessão temporária, produto/variação, quantidade e timestamps.
- **Order/OrderItem:** cliente opcional, endereço de entrega, snapshot de itens e valores, status e timestamps.
- **Payment:** orderId, identificador Stripe, valor, moeda, status e timestamps; nunca dados de cartão.
- **OrderStatusHistory:** pedido, status anterior/novo, ator e data.
- **NewsletterSubscription:** e-mail, status de consentimento e timestamps.

## 8. API inicial sugerida

Rotas ilustrativas; o contrato final deve ser documentado com OpenAPI.

| Método e rota | Acesso | Finalidade |
|---|---|---|
| `GET /api/v1/products` | Público | Listar, buscar e filtrar produtos. |
| `GET /api/v1/products/:idOrSlug` | Público | Consultar detalhe de produto. |
| `POST /api/v1/products` | Admin | Criar produto. |
| `PATCH /api/v1/products/:id` | Admin | Atualizar produto. |
| `DELETE /api/v1/products/:id` | Admin | Arquivar produto (exclusão lógica). |
| `GET /api/v1/categories` | Público | Listar categorias ativas. |
| `POST /api/v1/categories` | Admin | Criar categoria. |
| `PATCH /api/v1/categories/:id` | Admin | Atualizar categoria. |
| `DELETE /api/v1/categories/:id` | Admin | Arquivar categoria. |
| `POST /api/v1/auth/register` | Público | Cadastrar cliente. |
| `POST /api/v1/auth/login` | Público | Autenticar e emitir JWT. |
| `POST /api/v1/auth/refresh` | Autenticado | Renovar sessão. |
| `GET/PATCH /api/v1/users/me` | Cliente | Consultar/atualizar o próprio perfil. |
| `GET /api/v1/admin/users` | Admin | Consultar usuários. |
| `POST /api/v1/carts` e `/api/v1/carts/:id/items` | Público/cliente | Gerenciar carrinho. |
| `POST /api/v1/shipping/quotes` | Público/cliente | Consultar frete e prazo por CEP. |
| `POST /api/v1/orders` | Público/cliente | Validar checkout e criar pedido. |
| `GET /api/v1/orders` | Cliente/Admin | Listar os próprios pedidos ou todos, conforme papel. |
| `GET /api/v1/orders/:id` | Cliente/Admin | Consultar pedido autorizado. |
| `PATCH /api/v1/admin/orders/:id/status` | Admin | Atualizar status operacional. |
| `POST /api/v1/payments/:orderId/checkout` | Cliente/visitante | Iniciar pagamento Stripe. |
| `POST /api/v1/webhooks/stripe` | Stripe | Processar eventos assinados do Stripe. |
| `POST /api/v1/newsletter/subscriptions` | Público | Inscrever e-mail na newsletter. |

## 9. Critérios de aceite do MVP

1. Produtos e categorias podem ser criados e administrados por usuário autorizado e são persistidos no Supabase.
2. A vitrine consegue listar, buscar e filtrar somente produtos publicados, incluindo categoria, preço e disponibilidade.
3. Cliente consegue se cadastrar, autenticar e consultar/editar apenas seus próprios dados.
4. A API rejeita operações administrativas sem papel autorizado e pedidos que tentem acessar dados de outro cliente.
5. Pedido é criado com valores recalculados no servidor e fotografia imutável dos itens e preços da compra.
6. Estoque insuficiente impede a conclusão do pedido; pedidos concorrentes não causam estoque negativo.
7. Pagamento Stripe é atualizado apenas por webhook assinado; eventos repetidos não duplicam cobrança, baixa de estoque ou transição de status.
8. Cliente pode consultar os próprios pedidos e administrador pode consultar e atualizar pedidos conforme as transições válidas.
9. Testes automatizados cobrem sucesso e falhas principais de autenticação, permissões, CRUD, pedido, estoque e integração de pagamento.

## 10. Fora do escopo inicial

- Implementação visual do painel administrativo.
- Integração avançada com transportadoras, emissão fiscal e ERP.
- Programa de fidelidade, avaliações, lista de desejos e recomendações.
- Campanhas de e-mail marketing.
- Multi-loja ou múltiplas moedas, salvo requisito comercial.

## 11. Premissas e decisões a confirmar

- O primeiro mercado é Brasil; moeda, impostos, cobertura de entrega e meios de pagamento devem ser configurados para a operação real.
- A loja deve decidir se permitirá checkout como visitante ou exigirá conta.
- A loja deve confirmar se produtos têm tamanhos/variações e estoque por variante; para calçados/vestuário, isso é recomendado.
- Definir regra de frete, regiões atendidas, prazo de cotação e política de reserva/baixa de estoque.
- A interface atual mostra desconto de 10% no PIX e parcelamento em até 6 vezes; confirmar se são regras comerciais permanentes e quais meios/condições o Stripe deve oferecer antes de expor esses valores pela API.
- Definir políticas de cancelamento, reembolso, retenção de dados e recuperação/verificação de conta.
