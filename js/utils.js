window.Vexon = window.Vexon || {};

Vexon.CHAVES = {
    carrinho: "vexonCarrinho",
    usuario: "vexonUsuario",
    logado: "vexonLogado",
    pedidos: "vexonPedidos",
    favoritos: "vexonFavoritos"
};

Vexon.lerJSON = function (chave, fallback) {
    try {
        const bruto = localStorage.getItem(chave);
        return bruto ? JSON.parse(bruto) : fallback;
    } catch (erro) {
        return fallback;
    }
};

Vexon.salvarJSON = function (chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
};

Vexon.formatarPreco = function (valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
};

Vexon.normalizarItem = function (item) {
    if (!item || typeof item !== "object") {
        return null;
    }

    const quantidade = Number(item.quantidade ?? item.quantity ?? 1);

    return {
        id: Number(item.id),
        nome: item.nome || item.name || "",
        categoria: item.categoria || item.category || "",
        preco: Number(item.preco ?? item.price ?? 0),
        emoji: item.emoji || item.icon || "🖱️",
        descricao: item.descricao || item.description || "",
        quantidade: Number.isFinite(quantidade) && quantidade > 0 ? quantidade : 1
    };
};

Vexon.mostrarMensagem = function (texto) {
    const antiga = document.querySelector(".vexon-message");

    if (antiga) {
        antiga.remove();
    }

    const mensagem = document.createElement("div");
    mensagem.className = "vexon-message";
    mensagem.textContent = texto;
    document.body.appendChild(mensagem);

    setTimeout(() => mensagem.remove(), 3000);
};
