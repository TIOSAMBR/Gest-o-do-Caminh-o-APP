/* =========================================================
   ☁️ GESTÃO DO CAMINHÃO — FIREBASE / SINCRONIZAÇÃO
   ========================================================= */

(() => {
  "use strict";

  const KEYS = [
    "configuracaoCaminhao",
    "fretesCaminhao",
    "despesasCaminhao"
  ];

  const CONFIG = window.FIREBASE_CONFIG || {};
  const CONFIG_OK = CONFIG.apiKey && !String(CONFIG.apiKey).includes("COLE_") && CONFIG.projectId && !String(CONFIG.projectId).includes("SEU_");

  let auth = null;
  let db = null;
  let usuario = null;
  let sincronizando = false;
  let timer = null;
  let inicializando = true;

  function el(id) {
    return document.getElementById(id);
  }

  function status(texto, tipo = "normal") {
    const e = el("cloudStatus");
    if (!e) return;
    e.textContent = texto;
    e.className = `cloud-status ${tipo}`;
  }

  function mensagem(texto) {
    const e = el("cloudMessage");
    if (e) e.textContent = texto;
  }

  function mostrarPainel(logado) {
    const login = el("cloudLogin");
    const conta = el("cloudAccount");
    if (login) login.style.display = logado ? "none" : "block";
    if (conta) conta.style.display = logado ? "block" : "none";
  }

  function renderUsuario() {
    const email = el("cloudEmailLogado");
    if (email) email.textContent = usuario?.email || "Conta conectada";
  }

  function lerDadosLocais() {
    const dados = {};
    KEYS.forEach(key => {
      const valor = localStorage.getItem(key);
      if (valor !== null) {
        try { dados[key] = JSON.parse(valor); }
        catch { dados[key] = valor; }
      }
    });
    return dados;
  }

  function salvarDadosLocais(dados) {
    KEYS.forEach(key => {
      if (dados[key] !== undefined) {
        localStorage.setItem(key, typeof dados[key] === "string" ? dados[key] : JSON.stringify(dados[key]));
      }
    });
  }

  async function carregarNuvem() {
    if (!usuario || !db) return;
    const ref = db.collection("usuarios").doc(usuario.uid).collection("gestaoCaminhao").doc("dados");
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({ ...lerDadosLocais(), atualizadoEm: firebase.firestore.FieldValue.serverTimestamp() });
      status("☁️ Dados enviados para a nuvem", "ok");
      return;
    }

    const nuvem = snap.data() || {};
    const temDadosLocais = KEYS.some(k => localStorage.getItem(k) !== null);
    const temDadosNuvem = KEYS.some(k => nuvem[k] !== undefined);

    if (temDadosNuvem) {
      // Evita que a restauração da nuvem dispare uma nova sincronização.
      sincronizando = true;
      try {
        salvarDadosLocais(nuvem);

        // Atualiza também as variáveis em memória do sistema principal,
        // sem recarregar a página. Isso evita o loop de atualização.
        if (nuvem.configuracaoCaminhao !== undefined) {
          configuracao = nuvem.configuracaoCaminhao;
        }
        if (nuvem.fretesCaminhao !== undefined) {
          fretes = Array.isArray(nuvem.fretesCaminhao) ? nuvem.fretesCaminhao : [];
        }
        if (nuvem.despesasCaminhao !== undefined) {
          despesas = Array.isArray(nuvem.despesasCaminhao) ? nuvem.despesasCaminhao : [];
        }

        // Re-renderiza a interface com os dados recuperados.
        if (typeof carregarConfiguracao === "function") carregarConfiguracao();
        if (typeof atualizarTudo === "function") atualizarTudo();
      } finally {
        sincronizando = false;
      }

      status("☁️ Dados sincronizados", "ok");
    } else if (temDadosLocais) {
      await ref.set({ ...lerDadosLocais(), atualizadoEm: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      status("☁️ Dados enviados para a nuvem", "ok");
    }
  }

  async function sincronizarAgora() {
    if (!usuario || !db || sincronizando) return;
    try {
      sincronizando = true;
      status("☁️ Sincronizando...", "sync");
      const ref = db.collection("usuarios").doc(usuario.uid).collection("gestaoCaminhao").doc("dados");
      await ref.set({ ...lerDadosLocais(), atualizadoEm: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      status("☁️ Sincronizado agora", "ok");
    } catch (erro) {
      console.error(erro);
      status("⚠️ Não foi possível sincronizar", "erro");
    } finally {
      sincronizando = false;
    }
  }

  function agendarSincronizacao() {
    if (inicializando || sincronizando || !usuario) return;
    clearTimeout(timer);
    timer = setTimeout(sincronizarAgora, 900);
  }

  async function entrar() {
    const email = el("cloudEmail")?.value.trim();
    const senha = el("cloudSenha")?.value;
    if (!email || !senha) {
      mensagem("Informe e-mail e senha.");
      return;
    }
    try {
      mensagem("Entrando...");
      await auth.signInWithEmailAndPassword(email, senha);
      mensagem("");
    } catch (erro) {
      console.error(erro);
      mensagem("Não foi possível entrar. Confira o e-mail e a senha.");
    }
  }

  async function criarConta() {
    const email = el("cloudEmail")?.value.trim();
    const senha = el("cloudSenha")?.value;
    if (!email || !senha) {
      mensagem("Informe e-mail e senha para criar a conta.");
      return;
    }
    if (senha.length < 6) {
      mensagem("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    try {
      mensagem("Criando conta...");
      await auth.createUserWithEmailAndPassword(email, senha);
      mensagem("");
    } catch (erro) {
      console.error(erro);
      mensagem(erro.code === "auth/email-already-in-use" ? "Esse e-mail já possui uma conta. Use Entrar." : "Não foi possível criar a conta.");
    }
  }

  async function sair() {
    await auth.signOut();
  }

  window.entrarFirebase = entrar;
  window.criarContaFirebase = criarConta;
  window.sairFirebase = sair;
  window.sincronizarFirebaseAgora = sincronizarAgora;

  // Intercepta gravações do projeto atual para sincronizar automaticamente.
  const setItemOriginal = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    setItemOriginal.call(this, key, value);
    if (this === localStorage && KEYS.includes(key)) agendarSincronizacao();
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!CONFIG_OK) {
      status("☁️ Firebase ainda não configurado", "normal");
      mostrarPainel(false);
      return;
    }

    if (!window.firebase) {
      status("⚠️ Firebase não carregou", "erro");
      return;
    }

    firebase.initializeApp(CONFIG);
    auth = firebase.auth();
    db = firebase.firestore();

    auth.onAuthStateChanged(async (user) => {
      usuario = user;
      if (!user) {
        mostrarPainel(false);
        status("☁️ Entre para ativar o backup", "normal");
        inicializando = false;
        return;
      }

      mostrarPainel(true);
      renderUsuario();
      status("☁️ Conectado", "ok");
      try {
        await carregarNuvem();
      } catch (erro) {
        console.error(erro);
        status("⚠️ Erro ao carregar a nuvem", "erro");
      } finally {
        inicializando = false;
      }
    });
  });
})();
