# 🚚 Gestão do Caminhão

<p align="center">
  <strong>Controle financeiro e operacional para fretes e mudanças.</strong>
</p>

<p align="center">
  <img src="icons/icon-192.png" alt="Ícone do Gestão do Caminhão" width="120">
</p>

<p align="center">
  <strong>Fretes · Despesas · Custos · Lucro · Análise financeira · Firebase · PWA</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versão-2.1.0-2563eb" alt="Versão 2.0.0">
  <img src="https://img.shields.io/badge/feito%20com-JavaScript-f7df1e" alt="JavaScript">
  <img src="https://img.shields.io/badge/PWA-sim-5a3" alt="PWA">
</p>

---

## 📌 Sobre o projeto

O **Gestão do Caminhão** é uma aplicação web criada para ajudar no controle financeiro e operacional de caminhões utilizados em fretes e mudanças. A proposta é reunir em um só lugar os registros de serviços, custos e despesas, facilitando o acompanhamento dos resultados do negócio.

O sistema funciona em navegadores modernos, pode ser instalado como um aplicativo por meio da tecnologia **PWA** e conta com integração opcional ao **Firebase** para autenticação e sincronização dos dados entre dispositivos.

## ✨ Funcionalidades

### 🚚 Cadastro e histórico de fretes

- Registro de fretes com data, cliente, origem, destino e quilometragem.
- Registro do valor cobrado e dos custos associados ao serviço.
- Consulta dos fretes cadastrados e atualização dos registros.
- Histórico organizado por período.

### 💸 Controle de despesas

- Cadastro de despesas relacionadas à operação do caminhão.
- Registro de data, descrição/categoria e valor, conforme os campos disponíveis no formulário.
- Consulta e gerenciamento do histórico de despesas.
- Consideração das despesas nos cálculos financeiros do período.
- Registro de despesas à vista ou parceladas, com geração automática de uma parcela por mês.
- Divisão automática do valor total em centavos, mantendo a soma das parcelas igual ao valor informado.
- Identificação de cada parcela no histórico e opção de excluir somente uma parcela ou todo o parcelamento.

### ⚙️ Configurações do caminhão

Permite informar parâmetros operacionais utilizados nos cálculos, como consumo médio e preço do diesel, além dos custos configuráveis disponíveis no aplicativo.

### 📊 Dashboard e análise mensal

Acompanhe os indicadores do mês selecionado:

- Faturamento;
- Custos dos fretes;
- Despesas gerais;
- Lucro;
- Margem de lucro;
- Quilometragem;
- Quantidade de fretes;
- Lucro por quilômetro.

A análise também apresenta um gráfico comparativo de receita, custos, despesas e lucro, além de um ranking dos melhores fretes do mês.

### 📅 Resultado financeiro acumulado e histórico anual — v2.0.0

A versão 2.0.0 amplia a área de **Análise mensal**, aproveitando a mesma seção do aplicativo para apresentar também os resultados de longo prazo:

- **Resultado acumulado:** consolida os registros de todos os períodos disponíveis.
- **Faturamento total:** soma dos valores dos fretes registrados.
- **Custos dos fretes:** total dos custos associados aos fretes.
- **Despesas gerais:** soma das despesas cadastradas.
- **Gastos totais:** custos dos fretes somados às despesas gerais.
- **Lucro acumulado:** faturamento menos os gastos totais.
- **Margem, quilometragem e quantidade de fretes:** indicadores consolidados.
- **Histórico por ano:** tabela com faturamento, custos, despesas, gastos totais, lucro, margem, KM e quantidade de fretes de cada ano com registros.

Os resultados são calculados a partir dos fretes e despesas registrados no aplicativo. Portanto, a precisão do histórico depende do preenchimento correto das datas e dos valores lançados.

### ⚖️ Comparação entre meses

Permite selecionar dois meses e comparar seus indicadores financeiros, facilitando a visualização das diferenças de faturamento, custos, despesas, lucro e demais métricas apresentadas.

### 💾 Backup e armazenamento

O aplicativo mantém os dados no armazenamento local do navegador (`localStorage`) e disponibiliza recursos de backup e restauração na própria interface. Recomenda-se exportar backups regularmente e guardá-los em local seguro.

Principais chaves locais utilizadas:

```javascript
configuracaoCaminhao
fretesCaminhao
despesasCaminhao
```

### ☁️ Integração com Firebase

Quando configurado, o projeto utiliza:

- **Firebase Authentication** para autenticação por e-mail e senha;
- **Cloud Firestore** para armazenar os dados na nuvem;
- Listener do Firestore para receber atualizações dos dados sincronizados.

Os dados são organizados por UID de usuário, conforme a estrutura implementada no `firebase-sync.js`:

```text
usuarios/
└── UID_DO_USUARIO/
    └── gestaoCaminhao/
        └── dados
```

A integração depende da configuração correta do projeto Firebase e das regras de segurança do Firestore. Sem essa configuração, o aplicativo pode ser utilizado com o armazenamento local do navegador.

### 📱 PWA — instalação no celular ou computador

O projeto inclui `manifest.json`, ícones e `service-worker.js`, permitindo a instalação como aplicativo em navegadores compatíveis.

**iPhone/iPad (Safari):**

1. Abra o endereço publicado do aplicativo no Safari.
2. Toque em **Compartilhar**.
3. Selecione **Adicionar à Tela de Início**.
4. Confirme.

**Android e desktop:**

1. Abra o endereço do aplicativo em um navegador compatível.
2. Utilize a opção **Instalar aplicativo** ou **Adicionar à tela inicial**, quando disponível.

---

## 🧰 Tecnologias utilizadas

- **HTML5** — estrutura da aplicação.
- **CSS3** — layout, responsividade e temas.
- **JavaScript** — regras de negócio, cálculos e interações.
- **Firebase Authentication** — autenticação de usuários.
- **Cloud Firestore** — persistência e sincronização na nuvem.
- **PWA / Service Worker** — instalação e cache dos arquivos.
- **GitHub Pages** — opção de hospedagem estática.

## 🗂️ Estrutura do projeto

```text
Gestao-do-Caminhao/
├── index.html             # Estrutura da interface
├── style.css              # Estilos e responsividade
├── script.js              # Lógica, cálculos e funcionalidades
├── firebase-config.js     # Configuração do Firebase Web
├── firebase-sync.js       # Autenticação e sincronização
├── manifest.json          # Configuração do PWA
├── service-worker.js      # Cache e suporte offline
├── FIREBASE-LEIA-ME.md    # Orientações específicas do Firebase
├── README.md              # Documentação do projeto
└── icons/                 # Ícones do aplicativo
```

## 🚀 Como executar localmente

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto no Visual Studio Code ou editor de sua preferência.
3. Execute o projeto por um servidor local, por exemplo, com a extensão **Live Server** do VS Code.
4. Abra o endereço local fornecido pelo servidor.

> Para testar corretamente o Service Worker e a instalação PWA, utilize um endereço servido por HTTP ou HTTPS. Abrir o `index.html` diretamente pelo protocolo `file://` não reproduz todos os recursos do aplicativo.

## ☁️ Configuração do Firebase (opcional)

Para habilitar login e sincronização na nuvem:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Registre um aplicativo Web nas configurações do projeto.
3. Copie a configuração do Firebase Web para `firebase-config.js`, respeitando o formato esperado pelo arquivo.
4. Ative **Authentication → Sign-in method → Email/Password**.
5. Crie o banco **Cloud Firestore**.
6. Configure as regras de segurança para que cada usuário autenticado acesse somente os próprios dados.

Exemplo de regra compatível com a estrutura de usuários descrita acima (confira o caminho utilizado no seu projeto antes de publicar):

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

**Segurança:** nunca publique chaves privadas, credenciais de Service Account ou segredos administrativos no repositório. A configuração do Firebase para aplicações Web não substitui as regras de segurança do Firestore.

Consulte também [`FIREBASE-LEIA-ME.md`](FIREBASE-LEIA-ME.md) para as instruções específicas incluídas no projeto.

## 🌐 Publicação no GitHub Pages

1. Envie os arquivos do projeto para a branch que será publicada (por exemplo, `main`).
2. No repositório, acesse **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch `main` e a pasta `/ (root)`.
5. Salve e aguarde a publicação do GitHub Pages.

Depois da publicação, o endereço do site ficará disponível na própria página **Settings → Pages** do repositório.

## 🏷️ Histórico de versões

### v2.1.0 — Despesas parceladas

- Inclusão da opção de registrar despesas à vista ou parceladas.
- Geração automática das parcelas nos meses seguintes, a partir da data informada para a primeira parcela.
- Distribuição de eventuais centavos restantes para garantir que a soma corresponda ao valor total.
- Identificação das parcelas no histórico e exclusão individual ou de todo o parcelamento.

### v2.0.0 — Análise financeira ampliada

- Inclusão do resultado financeiro acumulado de todos os períodos.
- Inclusão do histórico financeiro separado por ano.
- Exibição consolidada de faturamento, custos dos fretes, despesas, gastos totais, lucro, margem, quilometragem e quantidade de fretes.
- Manutenção da análise mensal existente na mesma seção.

### v1.0.0 — Versão inicial

- Controle de fretes e despesas.
- Configurações operacionais do caminhão.
- Dashboard e análise mensal.
- Comparação entre meses.
- Estrutura PWA e integração com Firebase.

---

## 👨‍💻 Desenvolvedor

**Samuel Toledo**

Projeto desenvolvido para apoiar o controle financeiro e operacional de fretes e mudanças.

## ⭐ Objetivo

Facilitar o acompanhamento da operação, reunindo em um só aplicativo os registros de fretes, custos, despesas e resultados financeiros — do acompanhamento mensal ao histórico acumulado por ano.

<p align="center">
  🚚 <strong>Gestão do Caminhão</strong><br>
  Organização e controle para quem vive na estrada.
</p>
