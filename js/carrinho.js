window.Vexon = window.Vexon || {};

Vexon.FRETE_GRATIS_A_PARTIR = 299;
Vexon.VALOR_FRETE = 29.90;

Vexon.carrinho = {

    itens: [],

    carregar() {
        const bruto = Vexon.lerJSON(
            Vexon.CHAVES.carrinho,
            []
        );

        this.itens = bruto
            .map(item => {

                const normalizado =
                    Vexon.normalizarItem(item);

                if (!normalizado) {
                    return null;
                }

                return {
                    ...normalizado,

                    id: Number(normalizado.id),

                    quantidade:
                        Number(normalizado.quantidade) || 1
                };
            })
            .filter(item =>
                item &&
                Number.isFinite(item.id)
            );

        this.salvar();

        return this.itens;
    },

    salvar() {
        Vexon.salvarJSON(
            Vexon.CHAVES.carrinho,
            this.itens
        );
    },

    quantidadeTotal() {
        return this.itens.reduce(
            (total, item) => {

                return total +
                    Number(item.quantidade || 0);

            },
            0
        );
    },

    subtotal() {
        return this.itens.reduce(
            (total, item) => {

                return total +
                    Number(item.preco || 0) *
                    Number(item.quantidade || 0);

            },
            0
        );
    },

    frete() {
        const subtotal = this.subtotal();

        if (subtotal === 0) {
            return 0;
        }

        return subtotal >=
            Vexon.FRETE_GRATIS_A_PARTIR
            ? 0
            : Vexon.VALOR_FRETE;
    },

    total() {
        return this.subtotal() + this.frete();
    },

    atualizarContador() {

        const quantidade =
            this.quantidadeTotal();

        document
            .querySelectorAll(
                ".cart-button span, #cart-count"
            )
            .forEach(elemento => {

                elemento.textContent =
                    quantidade;
            });
    },

    adicionar(id, quantidade = 1) {

        const produtoId = Number(id);

        if (
            !Number.isFinite(produtoId) ||
            produtoId <= 0
        ) {
            console.error(
                "ID do produto inválido:",
                id
            );

            return;
        }

        const produto =
            Vexon.buscarProduto(produtoId);

        if (!produto) {
            console.error(
                "Produto não encontrado:",
                produtoId
            );

            return;
        }

        const quantidadeAdicionar =
            Number(quantidade);

        if (
            !Number.isFinite(quantidadeAdicionar) ||
            quantidadeAdicionar <= 0
        ) {
            return;
        }

        const existente =
            this.itens.find(
                item =>
                    Number(item.id) === produtoId
            );

        if (existente) {

            existente.quantidade =
                Number(existente.quantidade || 0) +
                quantidadeAdicionar;

        } else {

            this.itens.push({

                ...produto,

                id: produtoId,

                quantidade:
                    quantidadeAdicionar
            });
        }

        this.salvar();

        this.atualizarContador();

        this.renderizar();

        Vexon.mostrarMensagem(
            `${produto.nome} foi adicionado ao carrinho!`
        );
    },

    remover(id) {

        const produtoId = Number(id);

        this.itens =
            this.itens.filter(
                item =>
                    Number(item.id) !== produtoId
            );

        this.salvar();

        this.atualizarContador();

        this.renderizar();
    },

    alterarQuantidade(id, delta) {

        const produtoId = Number(id);

        const item =
            this.itens.find(
                produto =>
                    Number(produto.id) === produtoId
            );

        if (!item) {
            return;
        }

        item.quantidade =
            Number(item.quantidade || 0) +
            Number(delta || 0);

        if (item.quantidade <= 0) {

            this.remover(produtoId);

            return;
        }

        this.salvar();

        this.atualizarContador();

        this.renderizar();
    },

    limpar() {

        this.itens = [];

        this.salvar();

        this.atualizarContador();

        this.renderizar();
    },

    renderizar() {

        const container =
            document.querySelector(".cart-items");

        if (!container) {
            return;
        }

        if (!this.itens.length) {

            container.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Seu carrinho está vazio
                    </h2>

                    <p>
                        Que tal dar uma olhada
                        nos nossos produtos?
                    </p>

                    <a
                        href="produtos.html"
                        class="btn btn-primary"
                    >
                        Ver produtos
                    </a>

                </div>

            `;

            this.atualizarResumo();

            return;
        }

        container.innerHTML =
            this.itens.map(produto => `

                <div class="cart-item">

                    <div class="cart-product-image">
                        ${produto.emoji || "🛍️"}
                    </div>

                    <div class="cart-product-info">

                        <span class="product-category">
                            ${produto.categoria || ""}
                        </span>

                        <h3>
                            ${produto.nome}
                        </h3>

                        <p>
                            ${Vexon.formatarPreco(
                                produto.preco
                            )}
                        </p>

                    </div>

                    <div class="quantity">

                        <button
                            type="button"
                            class="quantity-minus"
                            data-id="${produto.id}"
                        >
                            −
                        </button>

                        <span>
                            ${produto.quantidade}
                        </span>

                        <button
                            type="button"
                            class="quantity-plus"
                            data-id="${produto.id}"
                        >
                            +
                        </button>

                    </div>

                    <strong>

                        ${Vexon.formatarPreco(
                            Number(produto.preco) *
                            Number(produto.quantidade)
                        )}

                    </strong>

                    <button
                        type="button"
                        class="remove-product"
                        data-id="${produto.id}"
                    >
                        ✕
                    </button>

                </div>

            `).join("");

        container
            .querySelectorAll(".quantity-minus")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        this.alterarQuantidade(
                            botao.dataset.id,
                            -1
                        );
                    }
                );
            });

        container
            .querySelectorAll(".quantity-plus")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        this.alterarQuantidade(
                            botao.dataset.id,
                            1
                        );
                    }
                );
            });

        container
            .querySelectorAll(".remove-product")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        this.remover(
                            botao.dataset.id
                        );
                    }
                );
            });

        this.atualizarResumo();
    },

    atualizarResumo() {

        const resumo =
            document.querySelector(
                ".cart-summary"
            );

        if (!resumo) {
            return;
        }

        const linhas =
            resumo.querySelectorAll(
                ":scope > div"
            );

        const subtotalEl =
            linhas[0]?.querySelector(
                "strong"
            );

        const freteEl =
            linhas[1]?.querySelector(
                "strong"
            );

        const totalEl =
            resumo.querySelector(
                ".cart-total strong"
            );

        const frete =
            this.frete();

        if (subtotalEl) {

            subtotalEl.textContent =
                Vexon.formatarPreco(
                    this.subtotal()
                );
        }

        if (freteEl) {

            freteEl.textContent =
                frete === 0
                    ? "Grátis"
                    : Vexon.formatarPreco(frete);
        }

        if (totalEl) {

            totalEl.textContent =
                Vexon.formatarPreco(
                    this.total()
                );
        }
    }
};


// Inicialização do carrinho

Vexon.carrinho.carregar();

Vexon.carrinho.atualizarContador();

Vexon.carrinho.renderizar();
