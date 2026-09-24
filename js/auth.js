window.Vexon = window.Vexon || {};

Vexon.auth = {
    usuario() {
        return Vexon.lerJSON(Vexon.CHAVES.usuario, null);
    },

    estaLogado() {
        return localStorage.getItem(Vexon.CHAVES.logado) === "true";
    },

    bindCadastro() {
        const form = document.getElementById("cadastro-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", evento => {
            evento.preventDefault();

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;
            const senhaConfirmada = document.getElementById("confirmar-senha").value;

            if (!nome || !email || !senha) {
                Vexon.mostrarMensagem("Preencha todos os campos.");
                return;
            }

            if (senha.length < 6) {
                Vexon.mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.");
                return;
            }

            if (senha !== senhaConfirmada) {
                Vexon.mostrarMensagem("As senhas não são iguais.");
                return;
            }

            Vexon.salvarJSON(Vexon.CHAVES.usuario, { nome, email, senha });
            Vexon.mostrarMensagem("Conta criada com sucesso!");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);
        });
    },

    bindLogin() {
        const form = document.getElementById("login-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", evento => {
            evento.preventDefault();

            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;
            const usuario = this.usuario();

            if (!usuario) {
                Vexon.mostrarMensagem("Nenhuma conta encontrada. Crie uma conta primeiro.");
                return;
            }

            if (email !== usuario.email || senha !== usuario.senha) {
                Vexon.mostrarMensagem("E-mail ou senha incorretos.");
                return;
            }

            localStorage.setItem(Vexon.CHAVES.logado, "true");
            Vexon.mostrarMensagem(`Bem-vindo, ${usuario.nome}!`);

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        });
    },

    bindRecuperar() {
        const form = document.getElementById("recover-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", evento => {
            evento.preventDefault();
            Vexon.mostrarMensagem(
                "Solicitação registrada. Em breve um link de recuperação seria enviado a este e-mail."
            );
            form.reset();
        });
    },

    bindPerfil() {
        const nomeEl = document.getElementById("profile-name");
        const logout = document.getElementById("logout-button");

        if (!nomeEl && !logout) {
            return;
        }

        const usuario = this.usuario();
        const logado = this.estaLogado();

        if (usuario && logado && nomeEl) {
            nomeEl.textContent = usuario.nome || "Usuário VEXON";
            document.getElementById("profile-email").textContent = usuario.email || "";
            document.getElementById("profile-name-data").textContent = usuario.nome || "—";
            document.getElementById("profile-email-data").textContent = usuario.email || "—";
            document.getElementById("profile-status").textContent = "Conectado";
        }

        logout?.addEventListener("click", () => {
            localStorage.setItem(Vexon.CHAVES.logado, "false");
            window.location.href = "login.html";
        });
    }
};

Vexon.auth.bindCadastro();
Vexon.auth.bindLogin();
Vexon.auth.bindRecuperar();
Vexon.auth.bindPerfil();
