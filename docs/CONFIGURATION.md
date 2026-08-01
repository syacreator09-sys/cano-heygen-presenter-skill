# Configuración

## Asistente

```bash
cano-heygen init
```

Define nombres de variables, locale, velocidad, cálculo de costo, techo por trabajo, polling y descarga. La configuración se escribe en `config/heygen.local.json`, ignorado por Git.

## Repetir en otro equipo

```bash
cano-heygen init --seed config/heygen.example.json
```

## Variables

macOS/zsh:

```bash
export HEYGEN_API_KEY='...'
export HEYGEN_AVATAR_ID='...'
export HEYGEN_VOICE_ID='...'
```

Windows PowerShell, solo para la sesión actual:

```powershell
$env:HEYGEN_API_KEY='...'
$env:HEYGEN_AVATAR_ID='...'
$env:HEYGEN_VOICE_ID='...'
```

Prefiere Keychain o Credential Manager para persistencia. No uses `setx` en equipos compartidos sin revisar exposición local.

## Perfil

```json
{
  "version":"1.0",
  "id":"cano-presenter",
  "provider":"heygen",
  "avatarIdEnv":"HEYGEN_AVATAR_ID",
  "voiceIdEnv":"HEYGEN_VOICE_ID",
  "locale":"es-MX",
  "speed":1,
  "defaultLook":"neutral",
  "looks":{"neutral":{"avatarIdEnv":"HEYGEN_AVATAR_ID"}}
}
```

Guárdalo como `profiles/cano.local.json`.

## Control de costo

`creditsPerMinute` es una aproximación local configurable y no sustituye la facturación del proveedor. `maxEstimatedCreditsPerJob` bloquea el trabajo antes de la solicitud cuando el estimado lo supera. El modo live también exige `--approve-spend`.

## Descarga

El proveedor devuelve una URL temporal. El skill la descarga inmediatamente cuando `downloadCompletedVideos` está activo y conserva `presenter-manifest.json` con estado, video ID, archivo y metadatos.
