# Metadatos recomendados para GitHub

## Descripción

```text
Reusable HeyGen presenter skill for segmented Digital Twin videos with local profiles, cost gates, polling, downloads and Mac/Windows setup.
```

## Topics

```text
heygen
digital-twin
avatar-video
ai-video
tutorial-generator
claude-code
codex
javascript
```

## Propósito

Este repositorio genera segmentos reemplazables de presentador. No captura navegador, no crea escenas VideoVox y no compone el video final.

## Tecnologías

- Node.js 20+
- HeyGen REST API
- `fetch` nativo
- polling y descarga de archivos
- perfiles locales ignorados por Git

## Entrada

Request JSON con perfil autorizado, formato, resolución, segmentos y presupuesto máximo estimado.

## Salida

- MP4 por segmento;
- manifiesto de generación;
- IDs de proveedor;
- duración y costo estimados;
- estado y errores por segmento.

## Relación con la Suite

`cano-tutorial-suite` ejecuta este skill en la etapa `presenter`. `cano-hybrid-composer-skill` integra después los MP4 obtenidos.
