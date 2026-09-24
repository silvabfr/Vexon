window.Vexon = window.Vexon || {};

Vexon.layout = {
    paginaAtual() {
        const arquivo = (location.pathname.split("/").pop() || "index.html").toLowerCase();
        return arquivo === "" ? "index.html" : arquivo;
    },

    ehAuth() {
        return document.body.classList.contains("auth-body");
    },

    topBarTexto() {
        return document.body.dataset.topbar ||
            "🚀 Frete grátis em compras acima de R$ 299";
    },

    contaHref() {
        const logado = localStorage.getItem(Vexon.CHAVES.logado) === "true";
        return logado ? "perfil.html" : "login.html";
    },

    navHtml() {
        const atual = this.paginaAtual();
        const links = [
            ["index.html", "Início"],
            ["produtos.html", "Produtos"],
            ["categorias.html", "Categorias"],
            ["ofertas.html", "Ofertas"],
            ["sobre.html", "Sobre nós"],
            ["contato.html", "Contato"]
        ];

        return links.map(([href, label]) => {
            const ativo = atual === href ? " class=\"active\"" : "";
            return `<a href="${href}"${ativo}>${label}</a>`;
        }).join("");
    },

    headerHtml() {
        return `
            <div class="top-bar">
                <p>${this.topBarTexto()}</p>
            </div>
            <header class="header">
                <div class="container header-content">
                    <a href="index.html" class="logo">VEXON<span>.</span></a>
                    <nav class="nav">${this.navHtml()}</nav>
                    <div class="header-actions">
                        <a href="${this.contaHref()}" class="icon-button" aria-label="Minha conta">♙</a>
                        <a href="carrinho.html" class="cart-button">
                            🛒
                            <span>0</span>
                        </a>
                    </div>
                </div>
            </header>
        `;
    },

    footerHtml() {
        return `
            <footer class="footer">
                <div class="container footer-grid">
                    <div class="footer-brand">
                        <a href="index.html" class="logo">VEXON<span>.</span></a>
                        <p>
                            Seu setup, seu nível.
                            <br>
                            Acessórios para PC para quem busca mais.
                        </p>
                        <div class="socials">
                            <a href="#" aria-label="Instagram">IG</a>
                            <a href="#" aria-label="TikTok">TK</a>
                            <a href="#" aria-label="YouTube">YT</a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h3>Loja</h3>
                        <a href="produtos.html">Produtos</a>
                        <a href="categorias.html">Categorias</a>
                        <a href="ofertas.html">Ofertas</a>
                        <a href="carrinho.html">Carrinho</a>
                    </div>
                    <div class="footer-column">
                        <h3>VEXON</h3>
                        <a href="sobre.html">Sobre nós</a>
                        <a href="contato.html">Contato</a>
                        <a href="perfil.html">Minha conta</a>
                        <a href="pedidos.html">Pedidos</a>
                    </div>
                    <div class="footer-column">
                        <h3>Atendimento</h3>
                        <p>Seg. a Sex.</p>
                        <p>09:00 — 18:00</p>
                        <a href="mailto:contato@vexon.com">contato@vexon.com</a>
                    </div>
                </div>
                <div class="container footer-bottom">
                    <p>© 2026 VEXON. Todos os direitos reservados.</p>
                    <p>Feito para elevar seu setup.</p>
                </div>
            </footer>
        `;
    },

    render() {
        if (this.ehAuth()) {
            return;
        }

        document.body.insertAdjacentHTML("afterbegin", this.headerHtml());
        document.body.insertAdjacentHTML("beforeend", this.footerHtml());
    },

    bindContato() {
        const form = document.getElementById("contact-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", evento => {
            evento.preventDefault();

            const nome = document.getElementById("contact-name")?.value.trim();

            if (!nome) {
                return;
            }

            Vexon.mostrarMensagem(`Obrigado, ${nome}! Sua mensagem foi recebida pela VEXON.`);
            form.reset();
        });
    },

    bindNewsletter() {
        const form = document.querySelector(".newsletter-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", evento => {
            evento.preventDefault();
            Vexon.mostrarMensagem("Inscrição registrada. Novidades chegam no seu e-mail.");
            form.reset();
        });
    }
};

Vexon.layout.render();
Vexon.layout.bindContato();
Vexon.layout.bindNewsletter();
