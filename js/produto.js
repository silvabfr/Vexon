window.Vexon = window.Vexon || {};

Vexon.paginaProduto = {

    produto: null,

    obterId() {

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        return Number(
            parametros.get("id")
        );
    },

    carregar() {

        const id = this.obterId();

        if (
            !Number.isFinite(id) ||
            id <= 0
        ) {
            this.mostrarErro();
            return;
        }

        const produto =
            Vexon.buscarProduto(id);

        if (!produto) {
            this.mostrarErro();
            return;
        }

        this.produto = produto;

        this.renderizar();

        this.renderizarRelacionados();

        this.configurarCarrinho();

        document.title =
            `${produto.nome} | VEXON`;
    },

    renderizar() {

        const produto = this.produto;

        const emoji =
            document.getElementById(
                "product-emoji"
            );

        const categoria =
            document.getElementById(
                "product-category"
            );

        const nome =
            document.getElementById(
                "product-name"
            );

        const descricao =
            document.getElementById(
                "product-description"
            );

        const preco =
            document.getElementById(
                "product-price"
            );

        const specCategoria =
            document.getElementById(
                "spec-category"
            );

        const specNome =
            document.getElementById(
                "spec-name"
            );

        const specId =
            document.getElementById(
                "spec-id"
            );


        if (emoji) {
            emoji.textContent =
                produto.emoji;
        }

        if (categoria) {
            categoria.textContent =
                produto.categoria;
        }

        if (nome) {
            nome.textContent =
                produto.nome;
        }

        if (descricao) {
            descricao.textContent =
                produto.descricao ||
                "Produto VEXON para completar seu setup.";
        }

        if (preco) {
            preco.textContent =
                Vexon.formatarPreco(
                    produto.preco
                );
        }

        if (specCategoria) {
            specCategoria.textContent =
                produto.categoria;
        }

        if (specNome) {
            specNome.textContent =
                produto.nome;
        }

        if (specId) {
            specId.textContent =
                produto.id;
        }
    },

    configurarCarrinho() {

        const botao =
            document.querySelector(
                ".add-cart"
            );

        const menos =
            document.getElementById(
                "quantity-minus"
            );

        const mais =
            document.getElementById(
                "quantity-plus"
            );

        const valor =
            document.getElementById(
                "quantity-value"
            );

        if (!botao || !valor) {
            return;
        }


        /*
         * MUITO IMPORTANTE:
         *
         * O ID do botão é definido
         * dinamicamente de acordo
         * com o produto da URL.
         */

        botao.dataset.productId =
            String(this.produto.id);


        if (menos) {

            menos.addEventListener(
                "click",
                () => {

                    const atual =
                        Number(
                            valor.textContent
                        ) || 1;

                    if (atual > 1) {

                        valor.textContent =
                            atual - 1;
                    }
                }
            );
        }


        if (mais) {

            mais.addEventListener(
                "click",
                () => {

                    const atual =
                        Number(
                            valor.textContent
                        ) || 1;

                    valor.textContent =
                        atual + 1;
                }
            );
        }


        botao.addEventListener(
            "click",
            evento => {

                evento.preventDefault();

                const quantidade =
                    Number(
                        valor.textContent
                    ) || 1;

                const id =
                    Number(
                        botao.dataset.productId
                    );


                if (
                    !Number.isFinite(id) ||
                    id <= 0
                ) {

                    console.error(
                        "ID do produto inválido:",
                        botao.dataset.productId
                    );

                    return;
                }


                Vexon.carrinho.adicionar(
                    id,
                    quantidade
                );


                botao.textContent =
                    "✓ Adicionado ao carrinho";


                setTimeout(
                    () => {

                        botao.textContent =
                            "🛒 Adicionar ao carrinho";

                    },
                    2000
                );
            }
        );
    },

    renderizarRelacionados() {

        const container =
            document.getElementById(
                "related-products"
            );

        if (
            !container ||
            !this.produto
        ) {
            return;
        }

        const relacionados =
            Vexon.produtos
                .filter(
                    produto =>
                        produto.id !==
                        this.produto.id
                )
                .slice(0, 3);


        container.innerHTML =
            relacionados.map(
                produto => `

                    <article class="product-card">

                        <a
                            href="produto.html?id=${produto.id}"
                            class="product-image"
                        >

                            <div
                                class="product-placeholder"
                            >
                                ${produto.emoji}
                            </div>

                        </a>


                        <div class="product-info">

                            <span
                                class="product-category"
                            >
                                ${produto.categoria}
                            </span>

                            <h3>
                                ${produto.nome}
                            </h3>

                            <p>
                                ${produto.descricao}
                            </p>


                            <div class="price">

                                <span>
                                    ${Vexon.formatarPreco(
                                        produto.preco
                                    )}
                                </span>

                            </div>


                            <a
                                href="produto.html?id=${produto.id}"
                                class="product-button"
                            >
                                Comprar
                            </a>

                        </div>

                    </article>

                `
            ).join("");
    },

    mostrarErro() {

        const container =
            document.querySelector(
                ".product-detail .container"
            );

        if (!container) {
            return;
        }

        container.innerHTML = `

            <div class="empty-state">

                <h2>
                    Produto não encontrado
                </h2>

                <p>
                    O produto que você procura
                    não existe.
                </p>

                <a
                    href="produtos.html"
                    class="btn btn-primary"
                >
                    Ver produtos
                </a>

            </div>

        `;
    }
};


Vexon.paginaProduto.carregar();
