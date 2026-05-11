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

test('demo-links profile adds demo and visual checks', () => {
  const readme = `# Demo Tool

Copy-ready project preview.

![preview](assets/preview.png)

## Quick Start

\`\`\`bash
npm test
\`\`\`

Live demo: https://example.com
Source: https://github.com/aolingge/demo-tool

## Verification

Tests pass.

## License

MIT
`
  const report = auditReadme(readme, { profile: 'demo-links' })
  assert.equal(report.profile, 'demo-links')
  assert.ok(report.results.some((result) => result.id === 'demo_link' && result.passed))
  assert.ok(report.score >= 70)
})

test('install-replay profile adds prerequisite and troubleshooting checks', () => {
  const readme = `# Install Tool

Requires Node.js 20.

![ci](https://img.shields.io/badge/ci-pass-green)
![preview](assets/preview.png)

## Quick Start

\`\`\`bash
npm install
npm test
\`\`\`

Expected output: tests pass.

## Troubleshooting

If install fails, clear node_modules and rerun.

## Recipes

| I want to | Start here |
| --- | --- |
| Install it | docs/install.md |

## Contributing

Good first issue welcome.

## Security

Do not paste tokens.

## License

MIT
`
  const report = auditReadme(readme, { profile: 'install-replay' })
  assert.equal(report.profile, 'install-replay')
  assert.ok(report.results.some((result) => result.id === 'install_prereq' && result.passed))
  assert.ok(report.score >= 70)
})
