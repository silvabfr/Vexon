window.Vexon = window.Vexon || {};

Vexon.produtos = [
    {
        id: 1,
        nome: "VEXON Pulse X1",
        categoria: "Mouse",
        preco: 249.90,
        emoji: "🖱️",
        descricao: "Mouse gamer feito para precisão e controle."
    },
    {
        id: 2,
        nome: "VEXON Mech K60",
        categoria: "Teclado",
        preco: 399.90,
        emoji: "⌨️",
        descricao: "Teclado mecânico para longas sessões."
    },
    {
        id: 3,
        nome: "VEXON Storm H7",
        categoria: "Headset",
        preco: 329.90,
        emoji: "🎧",
        descricao: "Headset com som imersivo para o seu setup."
    },
    {
        id: 4,
        nome: "VEXON Control XL",
        categoria: "Mousepad",
        preco: 159.90,
        emoji: "▰",
        descricao: "Superfície ampla para movimentos precisos."
    },
    {
        id: 5,
        nome: "VEXON Voice M1",
        categoria: "Microfone",
        preco: 289.90,
        emoji: "🎙️",
        descricao: "Captura de voz limpa para streams e calls."
    },
    {
        id: 6,
        nome: "VEXON Vision 1080",
        categoria: "Webcam",
        preco: 259.90,
        emoji: "📷",
        descricao: "Imagem nítida para reuniões e conteúdo."
    },
    {
        id: 7,
        nome: "VEXON Light Bar",
        categoria: "RGB",
        preco: 179.90,
        emoji: "💡",
        descricao: "Iluminação para completar o setup."
    },
    {
        id: 8,
        nome: "VEXON Hub X4",
        categoria: "Hub USB",
        preco: 119.90,
        emoji: "🔌",
        descricao: "Mais portas, menos bagunça na mesa."
    }
];

Vexon.buscarProduto = function (id) {
    const produtoId = Number(id);

    if (!Number.isFinite(produtoId)) {
        return null;
    }

    return Vexon.produtos.find(
        produto => produto.id === produtoId
    ) || null;
};

Vexon.buscarProdutoPorNome = function (nome) {
    const alvo = (nome || "").trim().toLowerCase();

    return Vexon.produtos.find(
        produto => produto.nome.toLowerCase() === alvo
    ) || null;
};


Vexon.favoritos = {

    listar() {
        const lista = Vexon.lerJSON(
            Vexon.CHAVES.favoritos,
            []
        );

        return lista
            .map(Vexon.normalizarItem)
            .filter(Boolean);
    },

    salvar(lista) {
        Vexon.salvarJSON(
            Vexon.CHAVES.favoritos,
            lista
        );
    },

    tem(id) {
        const produtoId = Number(id);

        return this.listar().some(
            item => Number(item.id) === produtoId
        );
    },

    alternar(id) {
        const produto = Vexon.buscarProduto(id);

        if (!produto) {
            return false;
        }

        const lista = this.listar();

        const indice = lista.findIndex(
            item => Number(item.id) === produto.id
        );

        if (indice >= 0) {
            lista.splice(indice, 1);

            this.salvar(lista);

            Vexon.mostrarMensagem(
                `${produto.nome} saiu dos favoritos.`
            );

            return false;
        }

        lista.push({
            ...produto,
            quantidade: 1
        });

        this.salvar(lista);

        Vexon.mostrarMensagem(
            `${produto.nome} foi salvo nos favoritos.`
        );

        return true;
    },

    remover(id) {
        const produtoId = Number(id);

        this.salvar(
            this.listar().filter(
                item => Number(item.id) !== produtoId
            )
        );
    },

    atualizarBotoes() {
        document
            .querySelectorAll(".favorite")
            .forEach(botao => {

                const card =
                    botao.closest(".product-card");

                const nome =
                    card?.querySelector("h3")?.textContent;

                const produto =
                    Vexon.buscarProduto(
                        botao.dataset.productId
                    ) ||
                    Vexon.buscarProdutoPorNome(nome);

                if (!produto) {
                    return;
                }

                botao.dataset.productId =
                    String(produto.id);

                const ativo = this.tem(produto.id);

                botao.classList.toggle(
                    "is-active",
                    ativo
                );

                botao.setAttribute(
                    "aria-label",
                    ativo
                        ? "Remover dos favoritos"
                        : "Adicionar aos favoritos"
                );
            });
    },

    bindBotoes() {
        document
            .querySelectorAll(".favorite")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    evento => {

                        evento.preventDefault();

                        const card =
                            botao.closest(".product-card");

                        const nome =
                            card?.querySelector("h3")
                                ?.textContent;

                        const produto =
                            Vexon.buscarProduto(
                                botao.dataset.productId
                            ) ||
                            Vexon.buscarProdutoPorNome(
                                nome
                            );

                        if (!produto) {
                            return;
                        }

                        this.alternar(produto.id);
                        this.atualizarBotoes();
                    }
                );
            });

        this.atualizarBotoes();
    },

    renderPagina() {
        const container =
            document.getElementById("favorites-list");

        if (!container) {
            return;
        }

        const lista = this.listar();

        if (!lista.length) {

            container.innerHTML = `
                <div class="empty-state">

                    <h2>
                        Nenhum favorito ainda
                    </h2>

                    <p>
                        Adicione produtos aos favoritos
                        para encontrá-los aqui.
                    </p>

                    <a
                        href="produtos.html"
                        class="btn btn-primary"
                    >
                        Explorar produtos
                    </a>

                </div>
            `;

            return;
        }

        container.innerHTML = lista.map(produto => `

            <article class="product-card">

                <a
                    href="produto.html?id=${produto.id}"
                    class="product-image"
                >
                    <span class="product-placeholder">
                        ${produto.emoji}
                    </span>
                </a>

                <div class="product-info">

                    <span class="product-category">
                        ${produto.categoria}
                    </span>

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${produto.descricao ||
                        "Produto VEXON para seu setup."}
                    </p>

                    <div class="product-bottom">

                        <strong>
                            ${Vexon.formatarPreco(
                                produto.preco
                            )}
                        </strong>

                        <button
                            type="button"
                            class="btn btn-small remove-favorite"
                            data-id="${produto.id}"
                        >
                            Remover
                        </button>

                    </div>

                </div>

            </article>

        `).join("");

        container
            .querySelectorAll(".remove-favorite")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        this.remover(
                            botao.dataset.id
                        );

                        this.renderPagina();
                    }
                );
            });
    }
};

Vexon.favoritos.bindBotoes();
Vexon.favoritos.renderPagina();
