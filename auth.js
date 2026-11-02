(() => {
  const CHAVE_USUARIOS = "blackzest_usuarios";
  const CHAVE_SESSAO = "blackzest_sessao";

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const paraHex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
  const deHex = hex => Uint8Array.from(hex.match(/.{2}/g), h => parseInt(h, 16));

  function lerUsuarios() {
    try { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || {}; }
    catch { return {}; }
  }

  function salvarUsuarios(usuarios) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  }

  function usuarioAtual() {
    const email = localStorage.getItem(CHAVE_SESSAO);
    return lerUsuarios()[email] || null;
  }

  // Transforma a senha em um código embaralhado (a senha em si nunca é salva)
  async function gerarHash(senha, saltHex) {
    const chave = await crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: deHex(saltHex), iterations: 100000, hash: "SHA-256" },
      chave,
      256
    );
    return paraHex(new Uint8Array(bits));
  }

  function mostrarMsg(texto) {
    const msg = document.getElementById("msg");
    if (msg) msg.textContent = texto;
  }

  function iniciarSessao(email) {
    localStorage.setItem(CHAVE_SESSAO, email);
    location.href = "index.html";
  }

  // Cabeçalho: mostra Entrar / Criar conta ou o nome e o botão Sair
   function desenharConta() {
    const nav = document.querySelector(".topo nav");
    if (!nav) return;
    const usuario = usuarioAtual();
    if (usuario) {
      const primeiro = usuario.nome.split(" ")[0];
      nav.insertAdjacentHTML("beforeend",
        `<a href="favoritos.html">♥ Favoritos</a><span class="ola">Olá, ${esc(primeiro)}</span><button type="button" class="link-sair" id="sair">Sair</button>`);
      document.getElementById("sair").addEventListener("click", () => {
        localStorage.removeItem(CHAVE_SESSAO);
        location.href = "index.html";
      });
    } else {
      nav.insertAdjacentHTML("beforeend",
        `<a href="login.html">Entrar</a><a class="btn-cad" href="cadastro.html">Criar conta</a>`);
    }
  }

  // Formulário de cadastro
  const formCad = document.getElementById("form-cadastro");
  if (formCad) {
    formCad.addEventListener("submit", async e => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const senha = document.getElementById("senha").value;
      const senha2 = document.getElementById("senha2").value;

      if (nome.length < 2) return mostrarMsg("Digite seu nome.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return mostrarMsg("Digite um e-mail válido.");
      if (senha.length < 6) return mostrarMsg("A senha precisa ter pelo menos 6 caracteres.");
      if (senha !== senha2) return mostrarMsg("As senhas não são iguais.");

      const usuarios = lerUsuarios();
      if (usuarios[email]) return mostrarMsg("Já existe uma conta com esse e-mail. Tente entrar.");

      try {
        const salt = paraHex(crypto.getRandomValues(new Uint8Array(16)));
        const hash = await gerarHash(senha, salt);
        usuarios[email] = { nome, email, salt, hash };
        salvarUsuarios(usuarios);
        iniciarSessao(email);
      } catch {
        mostrarMsg("Não foi possível criar a conta. Abra o site pelo Live Server e tente de novo.");
      }
    });
  }

  // Formulário de login
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", async e => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const senha = document.getElementById("senha").value;
      const erro = "E-mail ou senha incorretos.";

      if (!email || !senha) return mostrarMsg("Preencha o e-mail e a senha.");

      const usuario = lerUsuarios()[email];
      if (!usuario) return mostrarMsg(erro);

      try {
        const hash = await gerarHash(senha, usuario.salt);
        if (hash !== usuario.hash) return mostrarMsg(erro);
        iniciarSessao(email);
      } catch {
        mostrarMsg("Não foi possível entrar. Abra o site pelo Live Server e tente de novo.");
      }
    });
  }

   // Destaca a aba da página em que a pessoa está
  function marcarAbaAtual() {
    const pagina = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".topo nav a").forEach(a => {
      if (a.getAttribute("href") === pagina) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  desenharConta();
  marcarAbaAtual();
})();