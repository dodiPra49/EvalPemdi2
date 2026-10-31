<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>EVAL-PEMDI API Documentation (OpenAPI / Swagger)</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
    <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.18.2/favicon-32x32.png" sizes="32x32" />
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin:0;
            background: #fafafa;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .topbar {
            background-color: #0c2340 !important;
            padding: 12px 20px;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .topbar-brand {
            font-weight: 700;
            font-size: 1.15rem;
            color: #38bdf8;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .topbar-link {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.9rem;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #334155;
            transition: all 0.2s;
        }
        .topbar-link:hover {
            color: #ffffff;
            border-color: #38bdf8;
        }
    </style>
</head>
<body>
    <div class="topbar">
        <a href="/" class="topbar-brand">
            🏛️ EVAL-PEMDI 2026 — OpenAPI / Swagger UI
        </a>
        <a href="/" class="topbar-link">← Kembali ke Portal Aplikasi</a>
    </div>

    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js" charset="UTF-8"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
    <script>
    window.onload = function() {
        window.ui = SwaggerUIBundle({
            url: "/api/v1/openapi.json",
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout",
            displayRequestDuration: true,
            docExpansion: "list",
            filter: true
        });
    };
    </script>
</body>
</html>
