# ☁️ Configurar o Firebase — Gestão do Caminhão

## 1. Criar o projeto
1. Acesse https://console.firebase.google.com/
2. Clique em **Criar um projeto**.
3. Nome sugerido: `Gestao-do-Caminhao`.
4. O Google Analytics pode ficar desativado para este projeto, se você não precisar dele.

## 2. Criar o aplicativo Web
1. Abra o projeto no Firebase.
2. Clique no ícone `</>` para adicionar um app Web.
3. Nome: `Gestão do Caminhão Web`.
4. Registre o app.
5. O Firebase mostrará um objeto `firebaseConfig`.
6. Abra `firebase-config.js` neste projeto e substitua os valores de exemplo pelos valores mostrados pelo Firebase.

## 3. Ativar login por e-mail
No Firebase:
**Authentication > Sign-in method > Email/Password > Ativar > Salvar**.

## 4. Criar o Firestore
No Firebase:
**Firestore Database > Criar banco de dados**.

Para começar, escolha o modo de produção.

Depois, em **Rules**, use as regras abaixo:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Clique em **Publicar**.

## 5. Publicar no GitHub Pages
Envie estes arquivos para o seu repositório:
- `index.html`
- `style.css`
- `script.js`
- `manifest.json`
- `service-worker.js`
- `firebase-config.js`
- `firebase-sync.js`
- pasta `icons/`

## 6. Primeiro acesso
Abra seu site pelo Safari no iPhone.
Na seção **☁️ Backup na nuvem**:
- digite seu e-mail;
- crie uma senha com pelo menos 6 caracteres;
- toque em **Criar conta**.

A partir daí, os dados de `configuracaoCaminhao`, `fretesCaminhao` e `despesasCaminhao` serão sincronizados com a conta.

## Importante
A configuração do Firebase para Web é pública por natureza. A segurança dos dados é feita pelas **Firestore Security Rules** e pelo **Authentication**. Nunca coloque neste arquivo chaves privadas, service account ou credenciais administrativas.
