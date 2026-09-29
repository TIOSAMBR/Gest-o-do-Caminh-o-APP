// =====================================================
// 🚚 GESTÃO DO CAMINHÃO
// JavaScript principal
// =====================================================


// =====================================================
// DADOS
// =====================================================

let configuracao =
    JSON.parse(
        localStorage.getItem("configuracaoCaminhao")
    ) || {
        consumo: 7,
        diesel: 6.20,
        manutencao: 0,
        seguro: 0,
        ipva: 0,
        pneus: 0
    };


let fretes =
    JSON.parse(
        localStorage.getItem("fretesCaminhao")
    ) || [];


let despesas =
    JSON.parse(
        localStorage.getItem("despesasCaminhao")
    ) || [];


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    carregarConfiguracao();

    definirDataAtual();

    definirDataDespesa();

    definirMesAtual();

    carregarTema();

    atualizarTudo();

    adicionarEventosPreview();

    inicializarEventos();

    inicializarComparacao();

});


// =====================================================
// EVENTOS
// =====================================================

function inicializarEventos() {

    const mesPrincipal =
        document.getElementById("mesPrincipal");

    if (mesPrincipal) {

        mesPrincipal.addEventListener(
            "change",
            atualizarPainelPrincipal
        );

    }


    const mesAnalise =
        document.getElementById("mesAnalise");

    if (mesAnalise) {

        mesAnalise.addEventListener(
            "change",
            atualizarAnaliseMensal
        );

    }

}


// =====================================================
// ATUALIZAR TUDO
// =====================================================

function atualizarTudo() {

    atualizarTabela();

    atualizarTabelaDespesas();

    atualizarPainelPrincipal();

    atualizarAnaliseMensal();

    atualizarPreview();

    atualizarComparacao();

}


// =====================================================
// CONFIGURAÇÃO
// =====================================================

function carregarConfiguracao() {

    const campos = [
        "consumo",
        "diesel",
        "manutencao",
        "seguro",
        "ipva",
        "pneus"
    ];


    campos.forEach(id => {

        const campo =
            document.getElementById(id);

        if (campo) {

            campo.value =
                configuracao[id] || 0;

        }

    });

}


// =====================================================
// SALVAR CONFIGURAÇÃO
// =====================================================

function salvarConfiguracao() {

    configuracao = {

        consumo: numero("consumo"),

        diesel: numero("diesel"),

        manutencao: numero("manutencao"),

        seguro: numero("seguro"),

        ipva: numero("ipva"),

        pneus: numero("pneus")

    };


    localStorage.setItem(
        "configuracaoCaminhao",
        JSON.stringify(configuracao)
    );


    atualizarTudo();


    alert(
        "Configuração salva com sucesso!"
    );

}


// =====================================================
// DATAS
// =====================================================

function obterMesAtual() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    return `${ano}-${mes}`;

}


// =====================================================
// DEFINIR MÊS ATUAL
// =====================================================

function definirMesAtual() {

    const mes =
        obterMesAtual();


    const mesPrincipal =
        document.getElementById(
            "mesPrincipal"
        );


    const mesAnalise =
        document.getElementById(
            "mesAnalise"
        );


    if (mesPrincipal) {

        mesPrincipal.value =
            mes;

    }


    if (mesAnalise) {

        mesAnalise.value =
            mes;

    }

}


// =====================================================
// DEFINIR DATA
// =====================================================

function dataHoje() {

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}


// =====================================================
// DADOS DO MÊS ATUAL
// =====================================================
// Os dados antigos continuam salvos para o Resumo/Análise
// mensal e para a comparação entre meses.
// A tela operacional mostra somente o mês atual.

function obterDadosMesSelecionado() {
    // Usa o seletor principal de mês que fica no topo da página
    const seletor = document.getElementById("mesPrincipal");

    const periodo =
        seletor && seletor.value
            ? seletor.value
            : obterMesAtual();

    return {
        periodo,

        // Mostra somente os fretes do mês selecionado
        fretes: fretes.filter(frete =>
            frete.data &&
            frete.data.startsWith(periodo)
        ),

        // Mostra somente as despesas do mês selecionado
        despesas: despesas.filter(despesa =>
            despesa.data &&
            despesa.data.startsWith(periodo)
        )
    };
}


// Atualiza os históricos imediatamente quando o mês do topo é alterado.

function atualizarHistoricosAoTrocarMes() {
    const seletor = document.getElementById("mesPrincipal");

    if (!seletor) {
        return;
    }

    // Quando o mês principal mudar,
    // atualiza os dois históricos
    seletor.addEventListener("change", function () {

        // Histórico de fretes
        atualizarTabela();

        // Histórico de despesas
        atualizarTabelaDespesas();

    });

    // Carrega os dados do mês selecionado
    // assim que a página abrir
    atualizarTabela();
    atualizarTabelaDespesas();
}



// Mantém compatibilidade com qualquer parte do sistema que ainda
// utilize o nome antigo.
function obterDadosMesAtual() {
    return obterDadosMesSelecionado();
}


// =====================================================
// DATA ATUAL
// =====================================================

function definirDataAtual() {

    const campo =
        document.getElementById("data");


    if (campo) {

        campo.value =
            dataHoje();

    }

}


// =====================================================
// DATA DA DESPESA
// =====================================================

function definirDataDespesa() {

    const campo =
        document.getElementById(
            "dataDespesa"
        );


    if (campo) {

        campo.value =
            dataHoje();

    }

}


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function numero(id) {

    const elemento =
        document.getElementById(id);


    if (!elemento)
        return 0;


    let valor =
        String(
            elemento.value || ""
        ).trim();


    valor =
        valor.replace(",", ".");


    const numeroConvertido =
        parseFloat(valor);


    return Number.isFinite(
        numeroConvertido
    )
        ? numeroConvertido
        : 0;

}


// =====================================================
// DINHEIRO
// =====================================================

function dinheiro(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =====================================================
// PORCENTAGEM
// =====================================================

function porcentagem(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }
    ) + "%";

}


// =====================================================
// NÚMERO FORMATADO
// =====================================================

function formatarNumero(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }
    );

}


// =====================================================
// FORMATAR DATA
// =====================================================

function formatarData(data) {

    if (!data)
        return "-";


    const partes =
        data.split("-");


    if (partes.length !== 3)
        return data;


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// =====================================================
// ESCAPAR HTML
// =====================================================

function escapar(texto) {

    return String(texto || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================================
// ATUALIZAR ELEMENTO
// =====================================================

function atualizarElemento(id, valor) {

    const elemento =
        document.getElementById(id);


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


// =====================================================
// PREVIEW
// =====================================================

function adicionarEventosPreview() {

    const campos = [

        "km",
        "valorFrete",
        "pedagio",
        "ajudantes",
        "alimentacao",
        "outrasDespesas"

    ];


    campos.forEach(id => {

        const campo =
            document.getElementById(id);


        if (campo) {

            campo.addEventListener(
                "input",
                atualizarPreview
            );

        }

    });

}


// =====================================================
// CÁLCULO DO FRETE
// =====================================================

function calcularFrete() {

    const km =
        numero("km");


    const valorFrete =
        numero("valorFrete");


    const pedagio =
        numero("pedagio");


    const ajudantes =
        numero("ajudantes");


    const alimentacao =
        numero("alimentacao");


    const outrasDespesas =
        numero("outrasDespesas");


    // -------------------------------------------------
    // COMBUSTÍVEL
    // -------------------------------------------------

    let combustivel = 0;


    if (configuracao.consumo > 0) {

        combustivel =
            (
                km /
                configuracao.consumo
            ) *
            configuracao.diesel;

    }


    // -------------------------------------------------
    // CUSTO FIXO MENSAL
    // -------------------------------------------------

    const custoFixoMensal =

        Number(configuracao.manutencao || 0) +

        Number(configuracao.seguro || 0) +

        Number(configuracao.pneus || 0) +

        (
            Number(configuracao.ipva || 0) /
            12
        );


    // -------------------------------------------------
    // CUSTO FIXO DIÁRIO
    // -------------------------------------------------

    const custoFixoDiario =
        custoFixoMensal / 26;


    // -------------------------------------------------
    // CUSTO TOTAL DO FRETE
    // -------------------------------------------------

    const custoTotal =

        combustivel +

        pedagio +

        ajudantes +

        alimentacao +

        outrasDespesas +

        custoFixoDiario;


    // -------------------------------------------------
    // LUCRO
    // -------------------------------------------------

    const lucro =
        valorFrete -
        custoTotal;


    // -------------------------------------------------
    // MARGEM
    // -------------------------------------------------

    const margem =
        valorFrete > 0
            ? (
                lucro /
                valorFrete
            ) * 100
            : 0;


    return {

        km,

        valorFrete,

        combustivel,

        pedagio,

        ajudantes,

        alimentacao,

        outrasDespesas,

        custoFixoDiario,

        custoTotal,

        lucro,

        margem

    };

}


// =====================================================
// PREVIEW
// =====================================================

function atualizarPreview() {

    const calculo =
        calcularFrete();


    atualizarElemento(
        "previewCombustivel",
        dinheiro(
            calculo.combustivel
        )
    );


    atualizarElemento(
        "previewCustos",
        dinheiro(
            calculo.custoTotal
        )
    );


    atualizarElemento(
        "previewLucro",
        dinheiro(
            calculo.lucro
        )
    );


    atualizarElemento(
        "previewMargem",
        porcentagem(
            calculo.margem
        )
    );


    const lucro =
        document.getElementById(
            "previewLucro"
        );


    if (lucro) {

        lucro.style.color =
            calculo.lucro >= 0
                ? "#16a34a"
                : "#dc2626";

    }

}


// =====================================================
// REGISTRAR FRETE
// =====================================================

function registrarFrete() {

    const cliente =
        document.getElementById(
            "cliente"
        )?.value.trim() || "";


    const origem =
        document.getElementById(
            "origem"
        )?.value.trim() || "";


    const destino =
        document.getElementById(
            "destino"
        )?.value.trim() || "";


    const data =
        document.getElementById(
            "data"
        )?.value || "";


    const calculo =
        calcularFrete();


    if (!data) {

        alert(
            "Informe a data do frete."
        );

        return;

    }


    if (calculo.km <= 0) {

        alert(
            "Informe a quilometragem."
        );

        return;

    }


    if (calculo.valorFrete <= 0) {

        alert(
            "Informe o valor cobrado."
        );

        return;

    }


    const frete = {

        id: Date.now(),

        data,

        cliente,

        origem,

        destino,

        ...calculo

    };


    fretes.push(frete);


    salvarFretes();


    limparFormularioFrete();


    atualizarTudo();


    alert(
        "Frete registrado com sucesso!"
    );

}


// =====================================================
// SALVAR FRETES
// =====================================================

function salvarFretes() {

    localStorage.setItem(
        "fretesCaminhao",
        JSON.stringify(fretes)
    );

}


// =====================================================
// LIMPAR FORMULÁRIO FRETE
// =====================================================

function limparFormularioFrete() {

    const campos = [

        "cliente",
        "origem",
        "destino",
        "km",
        "valorFrete",
        "pedagio",
        "ajudantes",
        "alimentacao",
        "outrasDespesas"

    ];


    campos.forEach(id => {

        const campo =
            document.getElementById(id);


        if (campo) {

            campo.value = "";

        }

    });


    definirDataAtual();

    atualizarPreview();

}


// =====================================================
// REGISTRAR DESPESA
// =====================================================

function registrarDespesa() {

    const data =
        document.getElementById(
            "dataDespesa"
        )?.value || "";


    const tipo =
        document.getElementById(
            "tipoDespesa"
        )?.value || "";


    const descricao =
        document.getElementById(
            "descricaoDespesa"
        )?.value.trim() || "";


    const valor =
        numero("valorDespesa");


    if (!data) {

        alert(
            "Informe a data da despesa."
        );

        return;

    }


    if (!tipo) {

        alert(
            "Selecione o tipo da despesa."
        );

        return;

    }


    if (valor <= 0) {

        alert(
            "Informe o valor da despesa."
        );

        return;

    }


    const despesa = {

        id: Date.now(),

        data,

        tipo,

        descricao,

        valor

    };


    despesas.push(despesa);


    salvarDespesas();


    limparFormularioDespesa();


    atualizarTudo();


    alert(
        "Despesa registrada com sucesso!"
    );

}


// =====================================================
// SALVAR DESPESAS
// =====================================================

function salvarDespesas() {

    localStorage.setItem(
        "despesasCaminhao",
        JSON.stringify(despesas)
    );

}


// =====================================================
// LIMPAR FORMULÁRIO DESPESA
// =====================================================

function limparFormularioDespesa() {

    const tipo =
        document.getElementById(
            "tipoDespesa"
        );


    const descricao =
        document.getElementById(
            "descricaoDespesa"
        );


    const valor =
        document.getElementById(
            "valorDespesa"
        );


    if (tipo)
        tipo.value = "";


    if (descricao)
        descricao.value = "";


    if (valor)
        valor.value = "";


    definirDataDespesa();

}


// =====================================================
// HISTÓRICO DE FRETES
// =====================================================

function atualizarTabela() {

    const tabela =
        document.getElementById(
            "tabelaFretes"
        );


    const semFretes =
        document.getElementById(
            "semFretes"
        );


    if (!tabela)
        return;


    tabela.innerHTML = "";

    const dadosMesAtual = obterDadosMesAtual();
    const fretesMesAtual = dadosMesAtual.fretes;


    if (fretesMesAtual.length === 0) {

        if (semFretes)
            semFretes.style.display = "block";

        return;

    }


    if (semFretes)
        semFretes.style.display = "none";


    const ordenados =
        [...fretesMesAtual].sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );


    ordenados.forEach(frete => {

        const tr =
            document.createElement("tr");


        const classe =
            frete.lucro >= 0
                ? "lucro-positive"
                : "lucro-negative";


        tr.innerHTML = `

            <td>${formatarData(frete.data)}</td>

            <td>${escapar(frete.cliente)}</td>

            <td>${escapar(frete.origem)}</td>

            <td>${escapar(frete.destino)}</td>

            <td>
                ${formatarNumero(frete.km)} km
            </td>

            <td>
                ${dinheiro(frete.valorFrete)}
            </td>

            <td>
                ${dinheiro(frete.custoTotal)}
            </td>

            <td class="${classe}">
                ${dinheiro(frete.lucro)}
            </td>

            <td>
                ${porcentagem(frete.margem)}
            </td>

            <td>

                <button
                    class="btn-delete"
                    onclick="excluirFrete(${frete.id})"
                    title="Excluir frete"
                >
                    🗑️
                </button>

            </td>

        `;


        tabela.appendChild(tr);

    });

}


// =====================================================
// EXCLUIR FRETE
// =====================================================

function excluirFrete(id) {

    if (
        !confirm(
            "Deseja realmente excluir este frete?"
        )
    ) {

        return;

    }


    fretes =
        fretes.filter(
            frete =>
                frete.id !== id
        );


    salvarFretes();


    atualizarTudo();

}


// =====================================================
// HISTÓRICO DE DESPESAS
// =====================================================

function atualizarTabelaDespesas() {

    const tabela =
        document.getElementById(
            "tabelaDespesas"
        );


    const vazio =
        document.getElementById(
            "semDespesas"
        );


    if (!tabela)
        return;


    tabela.innerHTML = "";

    const dadosMesAtual = obterDadosMesAtual();
    const despesasMesAtual = dadosMesAtual.despesas;


    if (despesasMesAtual.length === 0) {

        if (vazio)
            vazio.style.display = "block";

        return;

    }


    if (vazio)
        vazio.style.display = "none";


    const ordenadas =
        [...despesasMesAtual].sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );


    ordenadas.forEach(despesa => {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>
                ${formatarData(despesa.data)}
            </td>

            <td>
                ${escapar(despesa.tipo)}
            </td>

            <td>
                ${escapar(despesa.descricao)}
            </td>

            <td class="lucro-negative">
                ${dinheiro(despesa.valor)}
            </td>

            <td>

                <button
                    class="btn-delete"
                    onclick="excluirDespesa(${despesa.id})"
                    title="Excluir despesa"
                >
                    🗑️
                </button>

            </td>

        `;


        tabela.appendChild(tr);

    });

}


// =====================================================
// EXCLUIR DESPESA
// =====================================================

function excluirDespesa(id) {

    if (
        !confirm(
            "Deseja realmente excluir esta despesa?"
        )
    ) {

        return;

    }


    despesas =
        despesas.filter(
            despesa =>
                despesa.id !== id
        );


    salvarDespesas();


    atualizarTudo();

}


// =====================================================
// PAINEL PRINCIPAL
// =====================================================

function atualizarPainelPrincipal() {

    const elemento =
        document.getElementById(
            "mesPrincipal"
        );


    if (!elemento)
        return;


    const periodo =
        elemento.value;


    if (!periodo)
        return;


    const fretesMes =
        fretes.filter(
            frete =>
                frete.data &&
                frete.data.startsWith(periodo)
        );


    const despesasMes =
        despesas.filter(
            despesa =>
                despesa.data &&
                despesa.data.startsWith(periodo)
        );


    const dados =
        calcularResumo(
            fretesMes,
            despesasMes
        );


    // -------------------------------------------------
    // FATURAMENTO
    // -------------------------------------------------

    atualizarElemento(
        "totalFaturamento",
        dinheiro(dados.faturamento)
    );


    // -------------------------------------------------
    // CUSTOS DOS FRETES
    // -------------------------------------------------

    atualizarElemento(
        "totalCustosFretes",
        dinheiro(dados.custosFretes)
    );


    // -------------------------------------------------
    // DESPESAS AVULSAS
    // -------------------------------------------------

    atualizarElemento(
        "totalDespesas",
        dinheiro(dados.despesas)
    );


    // -------------------------------------------------
    // 💸 GASTOS TOTAIS
    // -------------------------------------------------

    atualizarElemento(
        "totalGastos",
        dinheiro(
            dados.custosFretes +
            dados.despesas
        )
    );


    // -------------------------------------------------
    // LUCRO REAL
    // -------------------------------------------------

    atualizarElemento(
        "totalLucro",
        dinheiro(dados.lucroReal)
    );


    // -------------------------------------------------
    // MARGEM
    // -------------------------------------------------

    atualizarElemento(
        "margemMedia",
        porcentagem(dados.margem)
    );


    // -------------------------------------------------
    // KM
    // -------------------------------------------------

    atualizarElemento(
        "totalKm",
        formatarNumero(dados.km) +
        " km"
    );


    // -------------------------------------------------
    // LUCRO POR KM
    // -------------------------------------------------

    atualizarElemento(
        "lucroPorKm",
        dinheiro(dados.lucroPorKm)
    );


    // -------------------------------------------------
    // QUANTIDADE DE FRETES
    // -------------------------------------------------

    atualizarElemento(
        "totalFretes",
        dados.quantidade
    );


    // -------------------------------------------------
    // CLASSE DO LUCRO
    // -------------------------------------------------

    const lucro =
        document.getElementById(
            "totalLucro"
        );


    if (lucro) {

        lucro.classList.remove(
            "positivo",
            "negativo"
        );


        lucro.classList.add(
            dados.lucroReal >= 0
                ? "positivo"
                : "negativo"
        );

    }

}


// =====================================================
// RESUMO
// =====================================================

function calcularResumo(
    fretesLista = [],
    despesasLista = []
) {

    let faturamento = 0;

    let custosFretes = 0;

    let despesasGerais = 0;

    let km = 0;


    fretesLista.forEach(frete => {

        faturamento +=
            Number(
                frete.valorFrete
            ) || 0;


        custosFretes +=
            Number(
                frete.custoTotal
            ) || 0;


        km +=
            Number(
                frete.km
            ) || 0;

    });


    despesasLista.forEach(despesa => {

        despesasGerais +=
            Number(
                despesa.valor
            ) || 0;

    });


    // -------------------------------------------------
    // GASTOS TOTAIS
    // -------------------------------------------------

    const gastosTotais =
        custosFretes +
        despesasGerais;


    // -------------------------------------------------
    // LUCRO REAL
    // -------------------------------------------------

    const lucroReal =
        faturamento -
        gastosTotais;


    // -------------------------------------------------
    // MARGEM
    // -------------------------------------------------

    const margem =
        faturamento > 0
            ? (
                lucroReal /
                faturamento
            ) * 100
            : 0;


    // -------------------------------------------------
    // LUCRO POR KM
    // -------------------------------------------------

    const lucroPorKm =
        km > 0
            ? lucroReal / km
            : 0;


    return {

        faturamento,

        custosFretes,

        despesas: despesasGerais,

        gastosTotais,

        lucroReal,

        margem,

        km,

        lucroPorKm,

        quantidade:
            fretesLista.length

    };

}


// =====================================================
// ANÁLISE MENSAL
// =====================================================

function atualizarAnaliseMensal() {

    const elemento =
        document.getElementById(
            "mesAnalise"
        );


    if (!elemento)
        return;


    const periodo =
        elemento.value;


    if (!periodo)
        return;


    const fretesMes =
        fretes.filter(
            frete =>
                frete.data &&
                frete.data.startsWith(periodo)
        );


    const despesasMes =
        despesas.filter(
            despesa =>
                despesa.data &&
                despesa.data.startsWith(periodo)
        );


    const dados =
        calcularResumo(
            fretesMes,
            despesasMes
        );


    atualizarElemento(
        "mesFaturamento",
        dinheiro(dados.faturamento)
    );


    atualizarElemento(
        "mesCustosFretes",
        dinheiro(dados.custosFretes)
    );


    atualizarElemento(
        "mesDespesas",
        dinheiro(dados.despesas)
    );


    atualizarElemento(
        "mesLucro",
        dinheiro(dados.lucroReal)
    );


    atualizarElemento(
        "mesMargem",
        porcentagem(dados.margem)
    );


    atualizarElemento(
        "mesKm",
        formatarNumero(dados.km) +
        " km"
    );


    atualizarElemento(
        "mesQuantidade",
        dados.quantidade
    );


    atualizarElemento(
        "mesLucroKm",
        dinheiro(dados.lucroPorKm)
    );


    atualizarGraficoMensal(
        dados.faturamento,
        dados.custosFretes,
        dados.despesas,
        dados.lucroReal
    );


    atualizarRanking(fretesMes);

}


// =====================================================
// GRÁFICO
// =====================================================

function atualizarGraficoMensal(
    faturamento,
    custos,
    despesas,
    lucro
) {

    const valores = [

        faturamento,

        custos,

        despesas,

        Math.max(lucro, 0)

    ];


    const maior =
        Math.max(...valores);


    const barras = [

        {
            id: "barFaturamento",
            valor: faturamento
        },

        {
            id: "barCustos",
            valor: custos
        },

        {
            id: "barDespesas",
            valor: despesas
        },

        {
            id: "barLucro",
            valor: Math.max(lucro, 0)
        }

    ];


    barras.forEach(barra => {

        const elemento =
            document.getElementById(
                barra.id
            );


        if (!elemento)
            return;


        if (maior <= 0) {

            elemento.style.height =
                "4px";

            return;

        }


        const altura =
            (
                barra.valor /
                maior
            ) * 210;


        elemento.style.height =
            `${Math.max(
                altura,
                4
            )}px`;

    });

}


// =====================================================
// RANKING DE FRETES
// =====================================================

function atualizarRanking(fretesMes) {

    const container =
        document.getElementById(
            "rankingFretes"
        );


    if (!container)
        return;


    container.innerHTML = "";


    if (fretesMes.length === 0) {

        container.innerHTML = `

            <p class="empty">
                Nenhum frete neste mês.
            </p>

        `;

        return;

    }


    const ranking =
        [...fretesMes]
            .sort(
                (a, b) =>
                    b.lucro -
                    a.lucro
            )
            .slice(0, 5);


    ranking.forEach(
        (frete, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "ranking-item";


            const nome =
                frete.cliente ||
                `${frete.origem} → ${frete.destino}`;


            item.innerHTML = `

                <div class="ranking-info">

                    <strong>
                        ${index + 1}º -
                        ${escapar(nome)}
                    </strong>

                    <span>

                        ${formatarNumero(frete.km)}
                        km ·
                        ${dinheiro(frete.valorFrete)}

                    </span>

                </div>

                <div class="ranking-value">

                    ${dinheiro(frete.lucro)}

                </div>

            `;


            container.appendChild(item);

        }
    );

}


// =====================================================
// NOME DO MÊS
// =====================================================

function nomeMes(periodo) {

    if (!periodo)
        return "-";


    const partes =
        periodo.split("-");


    const ano =
        partes[0];


    const mes =
        parseInt(partes[1]);


    const nomes = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];


    return `${nomes[mes - 1]}/${ano}`;

}


// =====================================================
// OBTER DADOS DE UM MÊS
// =====================================================

function obterDadosMes(periodo) {

    const fretesMes =
        fretes.filter(
            frete =>
                frete.data &&
                frete.data.startsWith(periodo)
        );


    const despesasMes =
        despesas.filter(
            despesa =>
                despesa.data &&
                despesa.data.startsWith(periodo)
        );


    return calcularResumo(
        fretesMes,
        despesasMes
    );

}


// =====================================================
// COMPARAÇÃO ENTRE MESES
// =====================================================

function inicializarComparacao() {

    const mes1 =
        document.getElementById(
            "mesComparacao1"
        );


    const mes2 =
        document.getElementById(
            "mesComparacao2"
        );


    if (!mes1 || !mes2)
        return;


    const atual =
        obterMesAtual();


    const dataAnterior =
        new Date();


    dataAnterior.setMonth(
        dataAnterior.getMonth() - 1
    );


    const anoAnterior =
        dataAnterior.getFullYear();


    const mesAnterior =
        String(
            dataAnterior.getMonth() + 1
        ).padStart(2, "0");


    mes1.value =
        atual;


    mes2.value =
        `${anoAnterior}-${mesAnterior}`;


    mes1.addEventListener(
        "change",
        atualizarComparacao
    );


    mes2.addEventListener(
        "change",
        atualizarComparacao
    );


    atualizarComparacao();

}


// =====================================================
// ATUALIZAR COMPARAÇÃO
// =====================================================

function atualizarComparacao() {

    const mes1 =
        document.getElementById(
            "mesComparacao1"
        );


    const mes2 =
        document.getElementById(
            "mesComparacao2"
        );


    if (!mes1 || !mes2)
        return;


    const periodo1 =
        mes1.value;


    const periodo2 =
        mes2.value;


    if (!periodo1 || !periodo2)
        return;


    const dados1 =
        obterDadosMes(periodo1);


    const dados2 =
        obterDadosMes(periodo2);


    atualizarElemento(
        "tituloMes1",
        nomeMes(periodo1)
    );


    atualizarElemento(
        "tituloMes2",
        nomeMes(periodo2)
    );


    // FATURAMENTO

    preencherComparacao(
        "comparacaoFaturamento1",
        dinheiro(dados1.faturamento)
    );


    preencherComparacao(
        "comparacaoFaturamento2",
        dinheiro(dados2.faturamento)
    );


    preencherDiferenca(
        "diferencaFaturamento",
        dados1.faturamento,
        dados2.faturamento
    );


    // CUSTOS

    preencherComparacao(
        "comparacaoCustos1",
        dinheiro(dados1.custosFretes)
    );


    preencherComparacao(
        "comparacaoCustos2",
        dinheiro(dados2.custosFretes)
    );


    preencherDiferenca(
        "diferencaCustos",
        dados1.custosFretes,
        dados2.custosFretes,
        true
    );


    // DESPESAS

    preencherComparacao(
        "comparacaoDespesas1",
        dinheiro(dados1.despesas)
    );


    preencherComparacao(
        "comparacaoDespesas2",
        dinheiro(dados2.despesas)
    );


    preencherDiferenca(
        "diferencaDespesas",
        dados1.despesas,
        dados2.despesas,
        true
    );


    // LUCRO

    preencherComparacao(
        "comparacaoLucro1",
        dinheiro(dados1.lucroReal)
    );


    preencherComparacao(
        "comparacaoLucro2",
        dinheiro(dados2.lucroReal)
    );


    preencherDiferenca(
        "diferencaLucro",
        dados1.lucroReal,
        dados2.lucroReal
    );


    // KM

    preencherComparacao(
        "comparacaoKm1",
        formatarNumero(dados1.km) +
        " km"
    );


    preencherComparacao(
        "comparacaoKm2",
        formatarNumero(dados2.km) +
        " km"
    );


    preencherDiferenca(
        "diferencaKm",
        dados1.km,
        dados2.km
    );


    // FRETES

    preencherComparacao(
        "comparacaoFretes1",
        dados1.quantidade
    );


    preencherComparacao(
        "comparacaoFretes2",
        dados2.quantidade
    );


    preencherDiferenca(
        "diferencaFretes",
        dados1.quantidade,
        dados2.quantidade
    );


    // MARGEM

    preencherComparacao(
        "comparacaoMargem1",
        porcentagem(dados1.margem)
    );


    preencherComparacao(
        "comparacaoMargem2",
        porcentagem(dados2.margem)
    );


    preencherDiferenca(
        "diferencaMargem",
        dados1.margem,
        dados2.margem,
        false,
        true
    );


    atualizarResumoComparacao(
        periodo1,
        periodo2,
        dados1,
        dados2
    );

}


// =====================================================
// PREENCHER COMPARAÇÃO
// =====================================================

function preencherComparacao(id, valor) {

    atualizarElemento(
        id,
        valor
    );

}


// =====================================================
// PREENCHER DIFERENÇA
// =====================================================

function preencherDiferenca(
    id,
    valor1,
    valor2,
    custo = false,
    margem = false
) {

    const elemento =
        document.getElementById(id);


    if (!elemento)
        return;


    const diferenca =
        valor1 - valor2;


    let percentual = 0;


    if (valor2 !== 0) {

        percentual =
            (
                diferenca /
                Math.abs(valor2)
            ) * 100;

    }


    elemento.classList.remove(

        "comparacao-positiva",

        "comparacao-negativa",

        "comparacao-neutra"

    );


    let texto;


    if (margem) {

        texto =
            `${diferenca >= 0 ? "+" : ""}` +
            `${diferenca.toFixed(1)} p.p.`;

    }

    else {

        texto =
            `${diferenca >= 0 ? "+" : ""}` +
            `${dinheiro(diferenca)}`;


        if (valor2 !== 0) {

            texto +=
                ` (${percentual >= 0 ? "+" : ""}` +
                `${percentual.toFixed(1)}%)`;

        }

    }


    elemento.textContent =
        texto;


    // -------------------------------------------------
    // CUSTOS / DESPESAS
    // Menor = melhor
    // -------------------------------------------------

    if (custo) {

        if (diferenca < 0) {

            elemento.classList.add(
                "comparacao-positiva"
            );

        }

        else if (diferenca > 0) {

            elemento.classList.add(
                "comparacao-negativa"
            );

        }

        else {

            elemento.classList.add(
                "comparacao-neutra"
            );

        }

    }

    else {

        if (diferenca > 0) {

            elemento.classList.add(
                "comparacao-positiva"
            );

        }

        else if (diferenca < 0) {

            elemento.classList.add(
                "comparacao-negativa"
            );

        }

        else {

            elemento.classList.add(
                "comparacao-neutra"
            );

        }

    }

}


// =====================================================
// RESUMO DA COMPARAÇÃO
// =====================================================

function atualizarResumoComparacao(
    periodo1,
    periodo2,
    dados1,
    dados2
) {

    const elemento =
        document.getElementById(
            "resumoComparacao"
        );


    if (!elemento)
        return;


    const semDados1 =
        dados1.faturamento === 0 &&
        dados1.lucroReal === 0 &&
        dados1.despesas === 0;


    const semDados2 =
        dados2.faturamento === 0 &&
        dados2.lucroReal === 0 &&
        dados2.despesas === 0;


    if (semDados1 && semDados2) {

        elemento.textContent =

            `Ainda não existem dados registrados ` +
            `para ${nomeMes(periodo1)} e ` +
            `${nomeMes(periodo2)}.`;

        return;

    }


    let mensagem;


    if (
        dados1.lucroReal >
        dados2.lucroReal
    ) {

        mensagem =

            `📈 ${nomeMes(periodo1)} teve um lucro ` +
            `maior que ${nomeMes(periodo2)} em ` +
            `${dinheiro(
                dados1.lucroReal -
                dados2.lucroReal
            )}.`;

    }

    else if (
        dados1.lucroReal <
        dados2.lucroReal
    ) {

        mensagem =

            `📉 ${nomeMes(periodo1)} teve um lucro ` +
            `menor que ${nomeMes(periodo2)} em ` +
            `${dinheiro(
                dados2.lucroReal -
                dados1.lucroReal
            )}.`;

    }

    else {

        mensagem =
            `⚖️ Os dois meses tiveram o mesmo lucro.`;

    }


    elemento.textContent =
        mensagem;

}


// =====================================================
// MODO ESCURO
// =====================================================

function alternarTema() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const escuro =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "modoEscuro",
        escuro
    );


    atualizarBotaoTema();

}


// =====================================================
// CARREGAR TEMA
// =====================================================

function carregarTema() {

    const escuro =
        localStorage.getItem(
            "modoEscuro"
        );


    if (escuro === "true") {

        document.body.classList.add(
            "dark-mode"
        );

    }


    atualizarBotaoTema();

}


// =====================================================
// BOTÃO TEMA
// =====================================================

function atualizarBotaoTema() {

    const botao =
        document.getElementById(
            "themeToggle"
        );


    if (!botao)
        return;


    const escuro =
        document.body.classList.contains(
            "dark-mode"
        );


    botao.innerHTML =
        escuro
            ? "☀️ Modo claro"
            : "🌙 Modo escuro";

}


// =====================================================
// EXPORTAR CSV
// =====================================================

function exportarCSV() {

    if (fretes.length === 0) {

        alert(
            "Não existem fretes para exportar."
        );

        return;

    }


    let csv =

        "Data;Cliente;Origem;Destino;KM;" +
        "Receita;Combustível;Pedágio;" +
        "Ajudantes;Alimentação;" +
        "Outras Despesas;Custo Total;" +
        "Lucro;Margem\n";


    fretes.forEach(frete => {

        csv += [

            frete.data,

            limparCSV(frete.cliente),

            limparCSV(frete.origem),

            limparCSV(frete.destino),

            frete.km,

            frete.valorFrete,

            frete.combustivel,

            frete.pedagio,

            frete.ajudantes,

            frete.alimentacao,

            frete.outrasDespesas,

            frete.custoTotal,

            frete.lucro,

            Number(
                frete.margem
            ).toFixed(2)

        ].join(";") + "\n";

    });


    const blob =
        new Blob(
            [
                "\ufeff" + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;


    link.download =
        "historico-caminhao.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// =====================================================
// LIMPAR CSV
// =====================================================

function limparCSV(valor) {

    return String(valor || "")
        .replace(/;/g, ",")
        .replace(/\n/g, " ");

}

// =====================================================
// BACKUP DOS DADOS
// =====================================================

function fazerBackup() {

    const backup = {

        versao: "1.0",

        dataBackup:
            new Date().toISOString(),

        configuracao:
            configuracao,

        fretes:
            fretes,

        despesas:
            despesas

    };


    const dados =
        JSON.stringify(
            backup,
            null,
            2
        );


    const blob =
        new Blob(
            [dados],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    const hoje =
        new Date();


    const ano =
        hoje.getFullYear();


    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            hoje.getDate()
        ).padStart(
            2,
            "0"
        );


    link.href =
        url;


    link.download =
        `backup-caminhao-${ano}-${mes}-${dia}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    alert(
        "✅ Backup realizado com sucesso!"
    );

}


// =====================================================
// RESTAURAR BACKUP
// =====================================================

function restaurarBackup(event) {

    const arquivo =
        event.target.files[0];


    if (!arquivo)
        return;


    if (
        !confirm(
            "⚠️ Restaurar este backup irá substituir os dados atuais. Deseja continuar?"
        )
    ) {

        event.target.value = "";

        return;

    }


    const leitor =
        new FileReader();


    leitor.onload =
        function(e) {

            try {

                const backup =
                    JSON.parse(
                        e.target.result
                    );


                // =====================================
                // VALIDAÇÃO
                // =====================================

                if (
                    !backup ||
                    !Array.isArray(
                        backup.fretes
                    ) ||
                    !Array.isArray(
                        backup.despesas
                    ) ||
                    !backup.configuracao
                ) {

                    throw new Error(
                        "Arquivo de backup inválido."
                    );

                }


                // =====================================
                // RESTAURAR DADOS
                // =====================================

                configuracao =
                    backup.configuracao;


                fretes =
                    backup.fretes;


                despesas =
                    backup.despesas;


                // =====================================
                // SALVAR NO LOCALSTORAGE
                // =====================================

                localStorage.setItem(

                    "configuracaoCaminhao",

                    JSON.stringify(
                        configuracao
                    )

                );


                localStorage.setItem(

                    "fretesCaminhao",

                    JSON.stringify(
                        fretes
                    )

                );


                localStorage.setItem(

                    "despesasCaminhao",

                    JSON.stringify(
                        despesas
                    )

                );


                // =====================================
                // ATUALIZAR TELA
                // =====================================

                carregarConfiguracao();

                atualizarTudo();


                alert(
                    "✅ Backup restaurado com sucesso!"
                );


            }

            catch(error) {

                console.error(
                    "Erro ao restaurar backup:",
                    error
                );


                alert(
                    "❌ Não foi possível restaurar o backup. Verifique se o arquivo é válido."
                );

            }


            event.target.value = "";

        };


    leitor.readAsText(
        arquivo
    );

}

// Ativa o filtro mensal dos históricos.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        atualizarHistoricosAoTrocarMes
    );
} else {
    atualizarHistoricosAoTrocarMes();
}
