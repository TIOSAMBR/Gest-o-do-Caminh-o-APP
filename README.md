# 🚚 Gestão do Caminhão

<p align="center">
  <strong>Sistema completo para gestão financeira e operacional de caminhão, fretes e despesas.</strong>
</p>

<p align="center">
  <img src="icons/icon-192.png" alt="Ícone Gestão do Caminhão" width="120">
</p>

<p align="center">
  <strong>Gestão de Fretes • Controle de Despesas • Custos • Lucro • Firebase • PWA</strong>
</p>

---

## 📌 Sobre o projeto

O **Gestão do Caminhão** é uma aplicação web desenvolvida para facilitar o controle financeiro e operacional de um caminhão de fretes e mudanças.

O sistema foi pensado para uso diário, permitindo registrar os fretes realizados, controlar despesas, acompanhar custos operacionais, analisar o resultado de cada mês e comparar períodos.

Além de funcionar diretamente no navegador, o projeto possui estrutura de **PWA (Progressive Web App)**, podendo ser instalado na tela inicial de dispositivos como iPhone e utilizado com aparência de aplicativo.

A aplicação também possui integração com **Firebase**, permitindo:

- 🔐 autenticação individual por usuário;
- ☁️ armazenamento dos dados na nuvem;
- 🔄 sincronização em tempo real entre dispositivos;
- 👥 separação dos dados por conta;
- 💾 funcionamento com dados locais através do `localStorage`;
- 📱 instalação como aplicativo no celular.

---

## ✨ Funcionalidades

### 📊 Resumo mensal

O dashboard apresenta os principais indicadores do mês selecionado:

- 💰 faturamento;
- ⛽ gastos relacionados aos fretes;
- 💸 despesas;
- 📈 lucro;
- 📋 quantidade de fretes;
- 📊 resultado mensal.

O mês pode ser alterado pelo seletor disponível no sistema, permitindo consultar períodos diferentes sem apagar os dados anteriores.

---

### 🚚 Registro de fretes

É possível cadastrar cada frete realizado com informações como:

- 📅 data;
- 👤 cliente;
- 📍 origem;
- 📍 destino;
- 🛣️ quilometragem;
- 💰 valor cobrado;
- ⛽ consumo estimado;
- 💵 custo de combustível;
- 📈 lucro estimado.

O sistema utiliza a configuração de consumo e preço do diesel para calcular automaticamente os custos relacionados à viagem.

---

### ⚙️ Configuração do caminhão

A aplicação permite configurar os principais parâmetros utilizados nos cálculos:

- ⛽ consumo médio do caminhão em km/L;
- 🛢️ preço do diesel;
- 🔧 manutenção;
- 🛡️ seguro;
- 📄 IPVA;
- 🛞 pneus.

Essas informações são utilizadas como base para os cálculos financeiros e análises do sistema.

---

### 💰 Registro de despesas

O usuário pode registrar despesas do caminhão, mantendo um histórico organizado.

As despesas podem ser consultadas de acordo com o mês selecionado, permitindo acompanhar os gastos operacionais e entender melhor o resultado financeiro do período.

---

### 📈 Análise mensal

O sistema possui uma área dedicada à análise do desempenho mensal.

São apresentados dados como:

- faturamento;
- custos;
- despesas;
- lucro;
- quantidade de fretes;
- desempenho do período;
- melhores fretes.

---

### ⚖️ Comparação entre meses

É possível selecionar períodos diferentes para comparar o desempenho financeiro.

Essa funcionalidade ajuda a acompanhar a evolução da operação e identificar mudanças no faturamento, custos, despesas e lucro.

---

### 📋 Histórico de fretes

Todos os fretes cadastrados ficam armazenados no sistema.

O histórico permite consultar os registros de acordo com o mês selecionado, mantendo os dados dos meses anteriores.

---

### 💸 Histórico de despesas

Da mesma forma, todas as despesas permanecem armazenadas e podem ser filtradas por mês.

Isso evita a necessidade de apagar os dados ao iniciar um novo período.

---

## ☁️ Firebase

O projeto possui integração com **Firebase Authentication** e **Cloud Firestore**.

### 🔐 Autenticação

Cada usuário possui sua própria conta.

O acesso é feito através de:

- e-mail;
- senha.

Cada conta recebe um `UID` exclusivo pelo Firebase Authentication.

---

### 👥 Dados separados por usuário

Os dados são organizados no Firestore utilizando o `UID` da conta.

Estrutura utilizada:

```text
usuarios/
└── UID_DO_USUARIO/
    └── gestaoCaminhao/
        └── dados
```

Dentro do documento `dados` ficam armazenadas as informações principais do sistema:

```text
configuracaoCaminhao
fretesCaminhao
despesasCaminhao
atualizadoEm
```

Dessa forma, diferentes pessoas podem utilizar o mesmo aplicativo sem compartilhar os dados entre suas contas.

---

## 🔄 Sincronização em tempo real

O projeto utiliza o listener `onSnapshot()` do Firestore.

Isso permite que alterações feitas em um dispositivo sejam recebidas automaticamente pelos outros dispositivos conectados à mesma conta.

Exemplo:

```text
📱 iPhone
   │
   │ Novo frete
   ▼
☁️ Firebase
   │
   │ atualização em tempo real
   ▼
💻 Computador
```

Não é necessário:

- atualizar a página;
- fechar o aplicativo;
- entrar novamente na conta;
- clicar manualmente em sincronizar.

---

## 💾 Armazenamento local

Além da nuvem, o sistema utiliza `localStorage` do navegador.

Principais chaves utilizadas:

```javascript
configuracaoCaminhao
fretesCaminhao
despesasCaminhao
```

Isso permite que os dados permaneçam disponíveis localmente e que o sistema continue trabalhando mesmo quando houver uma interrupção temporária da conexão.

Quando o Firebase está configurado e o usuário está autenticado, os dados podem ser sincronizados com a nuvem.

---

## 📱 PWA — Aplicativo para celular

O projeto possui estrutura de **Progressive Web App**.

Isso permite instalar o sistema no celular sem precisar criar um aplicativo nativo separado para a App Store.

### iPhone

No Safari:

1. Abra o site do projeto.
2. Toque em **Compartilhar**.
3. Escolha **Adicionar à Tela de Início**.
4. Confirme a instalação.

Depois disso, o sistema poderá ser aberto pelo ícone como um aplicativo.

### Android

No navegador compatível:

1. Abra o site.
2. Utilize a opção **Instalar aplicativo** ou **Adicionar à tela inicial**.

---

## 🎨 Interface

A interface foi desenvolvida com foco em:

- simplicidade;
- visual limpo;
- responsividade;
- uso em computadores;
- uso em celulares;
- leitura rápida dos indicadores;
- formulários objetivos;
- modo claro e escuro.

O sistema também possui botão para alternar entre os temas.

---

## 🗂️ Estrutura do projeto

```text
Gest-o-do-Caminh-o-APP/
│
├── index.html
├── style.css
├── script.js
│
├── firebase-config.js
├── firebase-sync.js
│
├── manifest.json
├── service-worker.js
│
├── icons/
│   ├── apple-touch-icon.png
│   ├── icon-180.png
│   ├── icon-192.png
│   └── icon-512.png
│
├── FIREBASE-LEIA-ME.md
└── README.md
```

### 📄 `index.html`

Responsável pela estrutura da interface:

- dashboard;
- formulários;
- histórico;
- análise;
- comparação;
- configuração;
- área de autenticação e nuvem.

### 🎨 `style.css`

Responsável pelo design da aplicação:

- layout;
- cards;
- formulários;
- tabelas;
- botões;
- responsividade;
- modo claro/escuro;
- área de sincronização.

### ⚙️ `script.js`

Contém a lógica principal do sistema:

- cadastro de fretes;
- cadastro de despesas;
- cálculos;
- filtros mensais;
- dashboard;
- análise;
- comparação;
- armazenamento local;
- atualização da interface.

### ☁️ `firebase-sync.js`

Responsável pela integração do aplicativo com o Firebase:

- login;
- criação de conta;
- logout;
- leitura do Firestore;
- envio dos dados;
- sincronização;
- listener em tempo real;
- separação dos dados por usuário.

### 🔑 `firebase-config.js`

Contém a configuração pública do aplicativo Firebase Web.

> ⚠️ Nunca coloque nesse arquivo credenciais administrativas, Service Account, senha ou chave privada.

### 📱 `manifest.json`

Define as características do PWA:

- nome do aplicativo;
- nome curto;
- ícones;
- cor do tema;
- tela inicial;
- modo `standalone`.

### 🔄 `service-worker.js`

Responsável pelo cache e pelo funcionamento do PWA.

Ele armazena os principais arquivos da aplicação e permite carregar o sistema mesmo quando a conexão está indisponível.

---

## 🔐 Regras de segurança do Firestore

A segurança dos dados é feita através do Firebase Authentication e das regras do Cloud Firestore.

Exemplo de regra utilizada:

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /usuarios/{userId}/{document=**} {
      allow read, write:
        if request.auth != null
        && request.auth.uid == userId;
    }

  }
}
```

Essa regra garante que um usuário autenticado só possa acessar os documentos vinculados ao próprio `UID`.

### ⚠️ Importante

Nunca utilize regras abertas como:

```text
allow read, write: if true;
```

em um projeto que armazena dados reais.

---

## 🔧 Como configurar o Firebase

### 1. Criar o projeto

Acesse o Firebase Console e crie um novo projeto.

### 2. Criar o aplicativo Web

No projeto Firebase:

```text
Project Settings
→ Your apps
→ Web app
```

Registre o aplicativo e copie o objeto `firebaseConfig`.

Depois coloque os dados no arquivo:

```text
firebase-config.js
```

---

### 3. Ativar autenticação

No Firebase:

```text
Authentication
→ Sign-in method
→ Email/Password
→ Ativar
```

---

### 4. Criar o Firestore

No Firebase:

```text
Firestore Database
→ Create database
```

Depois configure as regras de segurança.

---

### 5. Criar usuários

Os usuários podem ser cadastrados pelo próprio sistema ou pelo Firebase Authentication, dependendo da versão/configuração utilizada.

Cada usuário terá seu próprio `UID`.

---

## 🌐 Publicação no GitHub Pages

O projeto pode ser publicado gratuitamente utilizando o GitHub Pages.

Estrutura básica:

```text
GitHub Repository
        │
        ├── index.html
        ├── style.css
        ├── script.js
        ├── firebase-config.js
        ├── firebase-sync.js
        ├── manifest.json
        ├── service-worker.js
        └── icons/
```

Depois:

```text
GitHub
→ Settings
→ Pages
→ Deploy from branch
→ main
→ /root
```

Após a publicação, o GitHub fornecerá o endereço do aplicativo.

---

## 🚀 Como executar localmente

Por ser uma aplicação web estática, os arquivos podem ser utilizados em um servidor local.

Uma opção simples é utilizar o **Live Server** no Visual Studio Code.

Estrutura:

```text
1. Clone o repositório
2. Abra a pasta no VS Code
3. Instale/ative o Live Server
4. Abra o index.html com o Live Server
5. Configure o Firebase
```

Para testar corretamente recursos como PWA e Service Worker, é recomendado utilizar um ambiente servido por HTTP/HTTPS em vez de abrir o arquivo diretamente com `file://`.

---

## 🧮 Principais cálculos

O sistema utiliza informações como:

```text
Quilometragem
÷
Consumo médio (km/L)
=
Litros estimados
```

Depois:

```text
Litros estimados
×
Preço do diesel
=
Custo estimado de combustível
```

E, a partir dos valores registrados:

```text
Receita
-
Custos
-
Despesas
=
Resultado/Lucro
```

Os cálculos são atualizados automaticamente na interface.

---

## 🔄 Fluxo de dados

```text
              ┌───────────────────┐
              │     Usuário       │
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │   Aplicação Web   │
              │ HTML/CSS/JS       │
              └─────────┬─────────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      ┌──────────────┐      ┌──────────────┐
      │ localStorage │      │    Firebase  │
      │   Local      │      │   Firestore  │
      └──────────────┘      └───────┬──────┘
                                    │
                                    ▼
                           🔄 Tempo real
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                       📱 iPhone             💻 PC
```

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| **HTML5** | Estrutura da aplicação |
| **CSS3** | Interface e responsividade |
| **JavaScript** | Lógica e funcionalidades |
| **LocalStorage** | Persistência local |
| **Firebase Authentication** | Login e contas |
| **Cloud Firestore** | Banco de dados na nuvem |
| **Firestore Realtime Listener** | Sincronização em tempo real |
| **PWA** | Instalação como aplicativo |
| **Service Worker** | Cache e suporte offline |
| **GitHub Pages** | Hospedagem |

---

## 📱 Compatibilidade

O projeto foi desenvolvido para funcionar em:

- 💻 Windows;
- 💻 macOS;
- 📱 iPhone/iOS;
- 📱 Android;
- 🌐 navegadores modernos.

Para a instalação como aplicativo no iPhone, utilize o **Safari**.

---

## 🔒 Privacidade e segurança

O sistema foi estruturado para que cada conta possua seus próprios dados.

A identificação do usuário é feita pelo:

```text
Firebase Authentication → UID
```

O Firestore utiliza esse UID para limitar o acesso aos documentos.

Ainda assim, recomenda-se:

- manter as regras do Firestore publicadas;
- nunca compartilhar credenciais administrativas;
- utilizar senhas fortes;
- não colocar informações privadas no código-fonte;
- não publicar Service Account ou credenciais de servidor;
- revisar as regras do Firebase antes de colocar o sistema em produção.

---

## 📌 Próximas melhorias possíveis

Algumas funcionalidades que podem ser adicionadas futuramente:

- 📊 gráficos financeiros;
- 📄 geração de relatórios em PDF;
- 📥 exportação para Excel/CSV;
- 📸 anexar comprovantes de despesas;
- 🔔 notificações;
- 👥 usuários com diferentes níveis de acesso;
- 🚚 suporte para múltiplos caminhões;
- 👤 cadastro completo de clientes;
- 📍 integração com mapas e rotas;
- ⛽ controle de abastecimentos;
- 🧾 emissão de recibos;
- 📅 calendário de fretes;
- 📈 relatórios anuais;
- 🔐 recuperação de senha diretamente pelo aplicativo.

---

## 👨‍💻 Desenvolvedor

**Samuel Toledo**

Projeto desenvolvido para controle e gestão de operações de fretes e mudanças.

### Tecnologias

`HTML5` `CSS3` `JavaScript` `Firebase` `Firestore` `PWA` `GitHub Pages`

---

## ⭐ Objetivo do projeto

O objetivo do **Gestão do Caminhão** é transformar o controle diário de um caminhão em um sistema simples, organizado e acessível de qualquer dispositivo.

A aplicação centraliza:

> 🚚 Fretes + ⛽ Custos + 💸 Despesas + 📊 Resultados + ☁️ Nuvem

em um único sistema.

---

<p align="center">
  🚚 <strong>Gestão do Caminhão</strong> • Controle simples para uma operação mais organizada.
</p>
