# CANO HeyGen Presenter Skill

Genera segmentos reemplazables con un avatar autorizado de HeyGen: hook, introducción, explicación, tip, transición, conclusión y CTA. La versión 0.2 incluye configuración guiada, control local de costo, consulta de estado y descarga de MP4.

## Instalación

```bash
git clone https://github.com/syacreator09-sys/cano-heygen-presenter-skill.git
cd cano-heygen-presenter-skill
npm install
npm run init
npm run verify
```

La configuración guarda solamente nombres de variables y límites; nunca guarda la API key ni IDs reales.

## Variables locales

```text
HEYGEN_API_KEY
HEYGEN_AVATAR_ID
HEYGEN_VOICE_ID
```

Cárgalas desde tu shell, Keychain, Credential Manager o un archivo `.env` ignorado. No las escribas en solicitudes ni en GitHub.

## Primera prueba sin costo

```bash
node bin/cano-heygen.js doctor
node bin/cano-heygen.js validate examples/cano-presenter.request.json
node bin/cano-heygen.js estimate examples/cano-presenter.request.json
node bin/cano-heygen.js render examples/cano-presenter.request.json --mock
```

## Descubrir recursos de tu cuenta

```bash
node bin/cano-heygen.js avatars
node bin/cano-heygen.js voices
```

Copia `profiles/example.profile.json` a `profiles/cano.local.json` y ajusta únicamente los nombres de variables, locale, look y preferencias. El archivo `*.local.json` está ignorado por Git.

## Generación real

```bash
node bin/cano-heygen.js estimate request.json
node bin/cano-heygen.js render request.json --live --approve-spend
```

El skill valida el techo local de costo, genera cada segmento secuencialmente, consulta el estado hasta completar y descarga los MP4 a `.runtime/jobs/<project-id>/presenter/`.

## Comandos

```text
cano-heygen --help
cano-heygen --version
cano-heygen init
cano-heygen doctor
cano-heygen avatars
cano-heygen voices
cano-heygen validate <request.json>
cano-heygen estimate <request.json>
cano-heygen render <request.json> --mock|--live --approve-spend
```

## Documentación

- [Configuración](docs/CONFIGURATION.md)
- [Opciones](docs/OPTIONS.md)
- [Solución de problemas](docs/TROUBLESHOOTING.md)
- [Seguridad](SECURITY.md)
- [Privacidad](PRIVACY.md)
- [Uso responsable](USAGE_POLICY.md)
- [Marca e identidad](BRAND_AND_IDENTITY.md)
- [Avisos de terceros](THIRD_PARTY_NOTICES.md)
- [Cambios](CHANGELOG.md)
- [MIT License](LICENSE)

El repositorio no contiene GitHub Actions, telemetría, llaves, IDs privados, voz de entrenamiento ni videos personales.
