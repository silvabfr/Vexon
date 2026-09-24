window.Vexon = window.Vexon || {};

Vexon.checkout = {

    renderResumo() {

        const items = document.getElementById("checkout-items");

        if (!items) {
            return;
        }

        const carrinho = Vexon.carrinho;
        const subtotal = carrinho.subtotal();
        const frete = carrinho.frete();

        if (!carrinho.itens.length) {

            items.innerHTML = "<p>Seu carrinho está vazio.</p>";

        } else {

            items.innerHTML = carrinho.itens.map(item => `
                <div class="summary-line">
                    <span>${item.nome} × ${item.quantidade}</span>
                    <strong>
                        ${Vexon.formatarPreco(item.preco * item.quantidade)}
                    </strong>
                </div>
            `).join("");

        }

        document.getElementById("checkout-subtotal").textContent =
            Vexon.formatarPreco(subtotal);

        document.getElementById("checkout-shipping").textContent =
            frete === 0
                ? "Grátis"
                : Vexon.formatarPreco(frete);

        document.getElementById("checkout-total").textContent =
            Vexon.formatarPreco(carrinho.total());
    },


    // ==========================================
    // FINALIZAR PEDIDO PELO WHATSAPP
    // ==========================================

    bindFormulario() {

        const form = document.getElementById("checkout-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", evento => {

            evento.preventDefault();


            // ==========================================
            // VERIFICAR CARRINHO
            // ==========================================

            if (!Vexon.carrinho.itens.length) {

                Vexon.mostrarMensagem(
                    "Seu carrinho está vazio."
                );

                return;
            }


            // ==========================================
            // NÚMERO DO WHATSAPP DA LOJA
            // ==========================================

            const numeroWhatsApp = "5521998415003";

            /*
                COLOQUE SEU NÚMERO AQUI.

                Exemplo:

                (21) 98765-4321

                vira:

                5521987654321
            */


            // ==========================================
            // DADOS DO CLIENTE
            // ==========================================

            const nome =
                document.getElementById("checkout-name").value.trim();

            const email =
                document.getElementById("checkout-email").value.trim();

            const endereco =
                document.getElementById("checkout-address").value.trim();

            const cidade =
                document.getElementById("checkout-city").value.trim();

            const cep =
                document.getElementById("checkout-cep").value.trim();

            const pagamentoSelect =
                document.getElementById("checkout-payment");

            const pagamento =
                pagamentoSelect.options[
                    pagamentoSelect.selectedIndex
                ].text;


            // ==========================================
            // DADOS DO CARRINHO
            // ==========================================

            const carrinho = Vexon.carrinho;

            const subtotal = carrinho.subtotal();

            const frete = carrinho.frete();

            const total = carrinho.total();


            // ==========================================
            // MONTAR LISTA DE PRODUTOS
            // ==========================================

            const produtos = carrinho.itens.map(item => {

                const valorProduto =
                    item.preco * item.quantidade;

                return (
                    `🛍️ ${item.nome}\n` +
                    `   Quantidade: ${item.quantidade}\n` +
                    `   Valor unitário: ${Vexon.formatarPreco(item.preco)}\n` +
                    `   Subtotal: ${Vexon.formatarPreco(valorProduto)}`
                );

            }).join("\n\n");


            // ==========================================
            // MONTAR MENSAGEM
            // ==========================================

            const mensagem = `
Olá! Gostaria de finalizar meu pedido na VEXON!!!

━━━━━━━━━━━━━━━━━━
 -- PEDIDO --
━━━━━━━━━━━━━━━━━━

${produtos}

━━━━━━━━━━━━━━━━━━
 -- RESUMO --
━━━━━━━━━━━━━━━━━━

Subtotal: ${Vexon.formatarPreco(subtotal)}
Frete: ${frete === 0 ? "Grátis" : Vexon.formatarPreco(frete)}

 TOTAL: ${Vexon.formatarPreco(total)}

━━━━━━━━━━━━━━━━━━
-- DADOS DO CLIENTE --
━━━━━━━━━━━━━━━━━━

Nome: ${nome}
E-mail: ${email}

ENDEREÇO DE ENTREGA

${endereco}
${cidade}
CEP: ${cep}

Forma de pagamento: ${pagamento}

━━━━━━━━━━━━━━━━━━

Aguardo as instruções para finalizar o pedido. Obrigado!
            `.trim();


            // ==========================================
            // CRIAR LINK DO WHATSAPP
            // ==========================================

            const url =
                `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;


            // ==========================================
            // SALVAR PEDIDO LOCALMENTE
            // ==========================================

            const pedidos =
                Vexon.lerJSON(Vexon.CHAVES.pedidos, []);

            const pedido = {

                id: String(pedidos.length + 1).padStart(4, "0"),

                status: "Aguardando confirmação",

                total: total,

                items: carrinho.itens.map(item => ({
                    ...item
                })),

                cliente: {
                    nome,
                    email,
                    endereco,
                    cidade,
                    cep,
                    pagamento
                }

            };


            pedidos.unshift(pedido);

            Vexon.salvarJSON(
                Vexon.CHAVES.pedidos,
                pedidos
            );


            // ==========================================
            // LIMPAR CARRINHO
            // ==========================================

            carrinho.limpar();


            // ==========================================
            // ABRIR WHATSAPP
            // ==========================================

            window.location.href = url;

        });
    },


    // ==========================================
    // PEDIDOS
    // ==========================================

    renderPedidos() {

        const container =
            document.getElementById("orders-list");

        if (!container) {
            return;
        }

        const pedidos =
            Vexon.lerJSON(Vexon.CHAVES.pedidos, []);

        if (!pedidos.length) {

            container.innerHTML = `
                <div class="empty-state">
                    <h2>Nenhum pedido encontrado</h2>
                    <p>
                        Quando você fizer uma compra,
                        seus pedidos aparecerão aqui.
                    </p>

                    <a
                        href="produtos.html"
                        class="btn btn-primary"
                    >
                        Ver produtos
                    </a>
                </div>
            `;

            return;
        }


        container.innerHTML = pedidos.map(pedido => {

            const itens =
                (pedido.items || [])
                    .map(Vexon.normalizarItem)
                    .filter(Boolean);


            return `
                <article class="card order-card">

                    <div class="order-header">

                        <div>
                            <span>Pedido</span>
                            <h2>#${pedido.id || "0001"}</h2>
                        </div>

                        <strong>
                            ${pedido.status || "Recebido"}
                        </strong>

                    </div>


                    <div class="order-products">

                        ${itens.map(item => `
                            <div class="summary-line">

                                <span>
                                    ${item.nome} × ${item.quantidade}
                                </span>

                                <strong>
                                    ${Vexon.formatarPreco(
                                        item.preco * item.quantidade
                                    )}
                                </strong>

                            </div>
                        `).join("")}

                    </div>


                    <div class="order-total">

                        <span>Total</span>

                        <strong>
                            ${Vexon.formatarPreco(
                                pedido.total || 0
                            )}
                        </strong>

                    </div>

                </article>
            `;

        }).join("");
    }

};


Vexon.checkout.renderResumo();

Vexon.checkout.bindFormulario();

Vexon.checkout.renderPedidos();
