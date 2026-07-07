# Meu 2FA — Site

Interface web do **Meu 2FA**: cadastro, login, configuração de autenticação TOTP (QR code) e verificação step-up após login. Desenvolvido com Vue 3, Vuetify 4 e Vite.

O app mobile (Flutter) escaneia o QR e gera códigos offline; **este site** é responsável por registrar usuários, iniciar/confirmar o setup 2FA e validar códigos na sessão web.

## Stack

- Vue 3 + Vite
- Vuetify 4
- Vue Router
- qrcode.vue

## Fluxo

1. **Cadastro / Login** — `POST /auth/register`, `POST /auth/login`
2. **Dashboard** — `GET /users/me` (status 2FA: `none`, `pending`, `active`)
3. **Habilitar 2FA** — `POST /totp/setup` → exibe QR com `otpauth_uri`
4. **Confirmar setup** — usuário digita código do app → `POST /totp/verify-setup`
5. **Recovery codes** — exibidos uma única vez após confirmação
6. **Login com 2FA ativo** — após senha, tela step-up → `POST /totp/verify` (exige `valid: true`)
7. **Desabilitar 2FA** — `POST /totp/disable` com código TOTP

## Estrutura

```
src/
├── components/     # UI (Login, Register, Dashboard, TotpSetup, TotpVerify)
├── controllers/    # Lógica e chamadas HTTP
│   ├── apiClient.js
│   ├── tokenStore.js
│   ├── authController.js
│   └── totpController.js
├── router/         # Rotas e guards de autenticação/TOTP
└── config.js       # URL da API
```

## API

Produção (Render):

```
https://totp-server-gqoo.onrender.com
```

Para alterar, edite `src/config.js`.

## Setup

```sh
npm install
npm run dev
```

Build de produção:

```sh
npm run build
npm run preview
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/login` | Entrar |
| `/register` | Cadastro |
| `/dashboard` | Painel e status 2FA |
| `/totp/setup` | QR code + confirmação + recovery codes |
| `/totp/verify` | Step-up TOTP após login |
