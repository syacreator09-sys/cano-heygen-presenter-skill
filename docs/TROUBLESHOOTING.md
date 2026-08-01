# Solución de problemas

## Falta `HEYGEN_API_KEY`

Ejecuta `cano-heygen doctor` y carga la variable en la terminal o gestor de credenciales. No la escribas en `config/heygen.local.json`.

## No conozco el avatar o la voz

```bash
cano-heygen avatars
cano-heygen voices
```

Selecciona únicamente una identidad y una voz autorizadas.

## El estimado excede el techo

Reduce el guion, divide el trabajo en segmentos o cambia conscientemente `maxEstimatedCreditsPerJob` mediante `cano-heygen init`. No aumentes el límite sin revisar la estimación y el plan del proveedor.

## Estado `processing` durante mucho tiempo

El skill espera hasta `polling.timeoutMs`. El manifiesto conserva los segmentos completados. Revisa el panel del proveedor antes de reintentar para evitar duplicar gasto.

## El proveedor devuelve `failed`

Revisa el mensaje del manifiesto, consentimiento, texto, duración y restricciones de la cuenta. Corrige solamente el segmento fallido.

## No se descargó el MP4

Comprueba `downloadCompletedVideos`, conectividad y que el estado completado incluya `video_url`. Las URLs del proveedor pueden ser temporales; vuelve a descargar desde el panel si expiraron.

## Pronunciación incorrecta

Ajusta el guion fonéticamente o usa otra voz autorizada. Revisa siempre marca, nombres, URLs, cifras y siglas antes de publicar.

## Identidad o consentimiento inciertos

No ejecutes live. El skill no autoriza por sí mismo el uso de una cara o voz.
