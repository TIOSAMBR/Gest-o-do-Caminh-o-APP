/* =========================================================
   ☁️ GESTÃO DO CAMINHÃO — FIREBASE / SINCRONIZAÇÃO EM TEMPO REAL
   ========================================================= */

(() => {
  "use strict";

  const KEYS = [
    "configuracaoCaminhao",
    "fretesCaminhao",
    "despesasCaminhao"
  ];

  const CONFIG = window.FIREBASE_CONFIG || {};
  const CONFIG_OK =
    CONFIG.apiKey &&
    !String(CONFIG.apiKey).includes("COLE_") &&
    CONFIG.projectId &&
    !String(CONFIG.projectId).includes("SEU_");

  let auth = null;
  let db = null;
  let usuario = null;
  let sincronizando = false;
  let timer = null;
  let inicializando = true;
  let unsubscribeRealtime = null;

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
    if (conta) conta.style.display = logado ? "flex" : "none";
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
        try {
          dados[key] = JSON.parse(valor);
        } catch {
          dados[key] = valor;
        }
      }
    });

    return dados;
  }

  function salvarDadosLocais(dados) {
    KEYS.forEach(key => {
      if (dados[key] !== undefined) {
        localStorage.setItem(
          key,
          typeof dados[key] === "string"
            ? dados[key]
            : JSON.stringify(dados[key])
        );
      }
    });
  }

  function aplicarDadosNaMemoria(dados) {
    if (dados.configuracaoCaminhao !== undefined) {
      configuracao = dados.configuracaoCaminhao;
    }

    if (dados.fretesCaminhao !== undefined) {
      fretes = Array.isArray(dados.fretesCaminhao)
        ? dados.fretesCaminhao
        : [];
    }

    if (dados.despesasCaminhao !== undefined) {
      despesas = Array.isArray(dados.despesasCaminhao)
        ? dados.despesasCaminhao
        : [];
    }

    // Atualiza a interface sem recarregar a página.
    if (typeof carregarConfiguracao === "function") {
      carregarConfiguracao();
    }

    if (typeof atualizarTudo === "function") {
      atualizarTudo();
    }

    if (typeof atualizarTabela === "function") {
      atualizarTabela();
    }

    if (typeof atualizarTabelaDespesas === "function") {
      atualizarTabelaDespesas();
    }
  }

  function obterRefDados() {
    if (!usuario || !db) return null;

    return db
      .collection("usuarios")
      .doc(usuario.uid)
      .collection("gestaoCaminhao")
      .doc("dados");
  }

  async function carregarNuvem() {
    if (!usuario || !db) return;

    const ref = obterRefDados();
    if (!ref) return;

    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({
        ...lerDadosLocais(),
        atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
      });

      status("☁️ Dados enviados para a nuvem", "ok");
      return;
    }

    const nuvem = snap.data() || {};

    const temDadosLocais =
      KEYS.some(k => localStorage.getItem(k) !== null);

    const temDadosNuvem =
      KEYS.some(k => nuvem[k] !== undefined);

    if (temDadosNuvem) {
      sincronizando = true;

      try {
        salvarDadosLocais(nuvem);
        aplicarDadosNaMemoria(nuvem);
      } finally {
        sincronizando = false;
      }

      status("☁️ Dados sincronizados", "ok");
    } else if (temDadosLocais) {
      await ref.set(
        {
          ...lerDadosLocais(),
          atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      status("☁️ Dados enviados para a nuvem", "ok");
    }
  }

  /*
   * =========================================================
   * 🔄 SINCRONIZAÇÃO EM TEMPO REAL
   *
   * O Firestore mantém este listener aberto.
   * Quando outro dispositivo alterar os dados, o aplicativo
   * recebe a alteração automaticamente, sem precisar:
   *
   * - atualizar a página;
   * - clicar em sincronizar;
   * - fechar e abrir o aplicativo.
   * =========================================================
   */
  function iniciarSincronizacaoEmTempoReal() {
    if (!usuario || !db) return;

    if (typeof unsubscribeRealtime === "function") {
      unsubscribeRealtime();
      unsubscribeRealtime = null;
    }

    const ref = obterRefDados();
    if (!ref) return;

    unsubscribeRealtime = ref.onSnapshot(
      snapshot => {
        // Ignora snapshots inexistentes.
        if (!snapshot.exists) return;

        const dadosNuvem = snapshot.data() || {};

        const dadosParaAplicar = {};

        KEYS.forEach(key => {
          if (dadosNuvem[key] !== undefined) {
            dadosParaAplicar[key] = dadosNuvem[key];
          }
        });

        if (!Object.keys(dadosParaAplicar).length) return;

        /*
         * Impede que salvarDadosLocais() acione novamente
         * a sincronização para a nuvem.
         */
        sincronizando = true;

        try {
          salvarDadosLocais(dadosParaAplicar);
          aplicarDadosNaMemoria(dadosParaAplicar);
        } finally {
          sincronizando = false;
        }

        status("☁️ Sincronizado em tempo real", "ok");
      },

      erro => {
        console.error("Erro na sincronização em tempo real:", erro);
        status("⚠️ Conexão em tempo real perdida", "erro");
      }
    );
  }

  async function sincronizarAgora() {
    if (!usuario || !db || sincronizando) return;

    try {
      sincronizando = true;

      status("☁️ Sincronizando...", "sync");

      const ref = obterRefDados();

      await ref.set(
        {
          ...lerDadosLocais(),
          atualizadoEm: firebase.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

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

    timer = setTimeout(() => {
      sincronizarAgora();
    }, 900);
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

      mensagem(
        "Não foi possível entrar. Confira o e-mail e a senha."
      );
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

      await auth.createUserWithEmailAndPassword(
        email,
        senha
      );

      mensagem("");
    } catch (erro) {
      console.error(erro);

      mensagem(
        erro.code === "auth/email-already-in-use"
          ? "Esse e-mail já possui uma conta. Use Entrar."
          : "Não foi possível criar a conta."
      );
    }
  }

  async function sair() {
    if (typeof unsubscribeRealtime === "function") {
      unsubscribeRealtime();
      unsubscribeRealtime = null;
    }

    await auth.signOut();
  }

  window.entrarFirebase = entrar;
  window.criarContaFirebase = criarConta;
  window.sairFirebase = sair;
  window.sincronizarFirebaseAgora = sincronizarAgora;

  /*
   * Intercepta gravações do projeto atual.
   * Assim, qualquer alteração feita pelo sistema continua
   * sendo enviada automaticamente para o Firebase.
   */
  const setItemOriginal = Storage.prototype.setItem;

  Storage.prototype.setItem = function(key, value) {
    setItemOriginal.call(this, key, value);

    if (
      this === localStorage &&
      KEYS.includes(key)
    ) {
      agendarSincronizacao();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!CONFIG_OK) {
      status(
        "☁️ Firebase ainda não configurado",
        "normal"
      );

      mostrarPainel(false);
      return;
    }

    if (!window.firebase) {
      status(
        "⚠️ Firebase não carregou",
        "erro"
      );

      return;
    }

    firebase.initializeApp(CONFIG);

    auth = firebase.auth();
    db = firebase.firestore();

    auth.onAuthStateChanged(async user => {
      usuario = user;

      if (!user) {
        if (typeof unsubscribeRealtime === "function") {
          unsubscribeRealtime();
          unsubscribeRealtime = null;
        }

        mostrarPainel(false);

        status(
          "☁️ Entre para ativar o backup",
          "normal"
        );

        inicializando = false;
        return;
      }

      mostrarPainel(true);
      renderUsuario();

      status("☁️ Conectado", "ok");

      try {
        /*
         * Primeiro recupera os dados existentes.
         */
        await carregarNuvem();

        /*
         * Depois mantém a conexão em tempo real.
         */
        iniciarSincronizacaoEmTempoReal();

      } catch (erro) {
        console.error(erro);

        status(
          "⚠️ Erro ao carregar a nuvem",
          "erro"
        );
      } finally {
        inicializando = false;
      }
    });
  });
})();
