Bruno CLI - generating API documentation

This repository includes an OpenAPI v3 specification at `docs/openapi.yaml` which describes the available endpoints.

If you have the Bruno CLI installed and it accepts OpenAPI input, you can point Bruno at this file to generate human-friendly documentation. Example commands (adjust depending on your Bruno installation):

- Install Bruno (if required):

  npm install -g bruno

- Generate docs (example - replace with your Bruno subcommand if different):

  npx bruno generate --input docs/openapi.yaml --output docs/bruno

If Bruno uses a different CLI signature, substitute the `--input`/`--output` flags accordingly. Alternatively, you can use other tools such as `redoc-cli` or `swagger-ui`:

- Using redoc-cli (quick local HTML):

  npm install -g redoc-cli
  redoc-cli bundle docs/openapi.yaml -o docs/bruno/index.html

Notes:
- The `docs/openapi.yaml` file was generated from the repository routes and controllers. Verify and refine request/response schemas and security details before publishing.
- After generating docs, commit the generated artifacts under `docs/bruno/` if you wish to host them (e.g., on GitHub Pages).