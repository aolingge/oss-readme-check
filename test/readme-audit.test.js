import test from 'node:test'
import assert from 'node:assert/strict'
import { auditReadme } from '../src/readme-audit.js'

test('scores a strong README higher than a weak README', () => {
  const strong = `# Great Tool

Copy-ready templates for developers.

![banner](assets/banner.svg)

[简体中文](README.zh-CN.md)

![ci](https://img.shields.io/badge/ci-pass-green)

## Quick Start

\`\`\`bash
npm install
npm test
\`\`\`

You know it worked when tests pass.

## Recipes

| I want to | Start here |
| --- | --- |
| Run it | docs/run.md |

## Contributing

Good first issue welcome.

## Security

Do not paste tokens.

## License

MIT
`

  const weak = '# Thing\n\nSome code.'

  assert.ok(auditReadme(strong).score > auditReadme(weak).score)
})
