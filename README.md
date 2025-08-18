<img src="https://api.swedka121.com/assets/Logo.png"
     alt="Logo" width="64" align="left" />
     
# PetCare API

![Version](https://img.shields.io/badge/version-0.0.3--dev-blue) ![Frontend](https://img.shields.io/badge/Frontend-https://github.com/KryaKryaTeam/PetCareFrontend-purple?link=https://github.com/KryaKryaTeam/PetCareFrontend)

### This is documentation for PetCare API

For start you need docker (Docker desktop on windows)

**1 Way**
 - Add `.env` file to root of the project and configure project using this [table](#env-config-variables)
 - In the console, run: `docker compose --env-file .env up --build`

**2 Way**
 - Run `start.bat` on Windows.

### Swagger docs

To view the Swagger docs, start the project and open http://localhost:3000/docs in your browser.

### Env config variables

| Variable              | Description                                                                 | Example                        |
|-----------------------|-----------------------------------------------------------------------------|--------------------------------|
| **DEV_MODE**          | If `true`, the server runs with `nodemon` for development auto-restart.     | false                          |
| **GOOGLE_CLIENT_ID**  | Your Google OAuth client ID.                                                | `xxxx.apps.googleusercontent.com` |
| **JWT_SECRET_ACCESS** | Random string used to sign access tokens.                                   | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| **JWT_SECRET_REFRESH**| Random string used to sign refresh tokens.                                  | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| **SESSION_EXP_TIME**  | Session expiration time in milliseconds.                                    | 25920000                       |
| **JWT_ACCESS_EXP**    | Access token expiration (use time string like `3h`, `3d`, etc.).             | 3h                             |
| **JWT_REFRESH_EXP**   | Refresh token expiration (use time string like `3h`, `3d`, etc.).            | 3d                             |
| **FRONTEND_URL**      | Used to set the allowed CORS origin.                                        | http://localhost:5173          |
| **COOKIE_DOMAIN**     | Domain parameter for setting cookies.                                       | localhost                      |
