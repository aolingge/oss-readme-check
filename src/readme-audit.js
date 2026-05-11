const baseChecks = [
  {
    id: 'one_liner',
    weight: 10,
    title: 'Clear one-line value proposition',
    test: (text) => /^.{0,12}# .+[\s\S]{0,500}\n\n.{20,180}/m.test(text),
    fix: 'Put one concise sentence directly under the title that says what the project does and who it helps.',
  },
  {
    id: 'quick_start',
    weight: 15,
    title: 'Quick start path',
    test: (text) => /quick start|getting started|install|usage|快速开始/i.test(text) && /```/.test(text),
    fix: 'Add a copy-pasteable install/run/verify block near the top.',
  },
  {
    id: 'verification',
    weight: 10,
    title: 'First success verification',
    test: (text) => /verify|validation|test|expected|you know it worked|验证|成功/i.test(text),
    fix: 'Tell users how to know the first run succeeded.',
  },
  {
    id: 'badges',
    weight: 8,
    title: 'Trust badges',
    test: (text) => /img\.shields\.io|badge|actions\/workflows/i.test(text),
    fix: 'Add a few useful badges: CI, license, release, package/version.',
  },
  {
    id: 'visual_anchor',
    weight: 8,
    title: 'Visual anchor',
    test: (text) => /!\[.*\]\(.+\)|<img\s/i.test(text),
    fix: 'Add one banner, screenshot, terminal output, or architecture diagram that proves value.',
  },
  {
    id: 'recipes',
    weight: 10,
    title: 'Scenario-based entry points',
    test: (text) => /recipe|i want to|use case|scenario|按场景|我想/i.test(text),
    fix: 'Add a table that maps user goals to files or docs.',
  },
  {
    id: 'multilingual',
    weight: 8,
    title: 'Multilingual entry',
    test: (text) => /README\.zh-CN\.md|简体中文|English/i.test(text),
    fix: 'Add language links, for example README.md and README.zh-CN.md.',
  },
  {
    id: 'contributing',
    weight: 8,
    title: 'Contribution path',
    test: (text) => /contribut|good first issue|pull request|参与贡献/i.test(text),
    fix: 'Link to CONTRIBUTING.md and list small contribution ideas.',
  },
  {
    id: 'security',
    weight: 6,
    title: 'Security boundary',
    test: (text) => /security|token|secret|credential|安全|密钥/i.test(text),
    fix: 'Explain how to report security issues and what not to paste publicly.',
  },
  {
    id: 'license',
    weight: 7,
    title: 'License visible',
    test: (text) => /license|MIT|Apache|GPL|BSD/i.test(text),
    fix: 'Add a license section and a LICENSE file.',
  },
  {
    id: 'not_too_long_before_usage',
    weight: 10,
    title: 'Usage appears before deep docs',
    test: (text) => {
      const lower = text.toLowerCase()
      const usage = Math.min(
        ...['quick start', 'getting started', 'usage', '快速开始'].map((term) => {
          const found = lower.indexOf(term)
          return found === -1 ? Number.POSITIVE_INFINITY : found
        }),
      )
      return usage < 2500
    },
    fix: 'Move the first runnable command above long background sections.',
  },
]

const profileChecks = {
  core: [],
  'demo-links': [
    {
      id: 'demo_quick_start',
      weight: 10,
      title: 'Demo profile: quick start or usage',
      test: (text) => /quick start|usage|install|快速开始|用法|安装/i.test(text),
      fix: 'Add a quick start or usage section near the top.',
    },
    {
      id: 'demo_visual',
      weight: 10,
      title: 'Demo profile: visual proof',
      test: (text) => /img|image|screenshot|banner|preview|截图|预览/i.test(text),
      fix: 'Add a screenshot, banner, preview image, or terminal capture.',
    },
    {
      id: 'demo_link',
      weight: 10,
      title: 'Demo profile: demo or example link',
      test: (text) => /demo|live|example|pages|演示|示例/i.test(text),
      fix: 'Link a live demo, example, GitHub Pages preview, or sample output.',
    },
    {
      id: 'demo_source',
      weight: 10,
      title: 'Demo profile: source or mirror link',
      test: (text) => /gitee|github|mirror|source|repository|镜像|源码/i.test(text),
      fix: 'Add source, repository, or mirror links so visitors can verify the project surface.',
    },
  ],
  'install-replay': [
    {
      id: 'install_prereq',
      weight: 10,
      title: 'Install profile: prerequisites',
      test: (text) => /prerequisite|requires|node|python|jdk|前置|依赖/i.test(text),
      fix: 'List runtime or tool prerequisites before install commands.',
    },
    {
      id: 'install_command',
      weight: 10,
      title: 'Install profile: copy-ready command',
      test: (text) => /```|npm|pnpm|pip|docker|命令/i.test(text),
      fix: 'Add copy-ready install or run commands.',
    },
    {
      id: 'install_verify',
      weight: 10,
      title: 'Install profile: verification step',
      test: (text) => /verify|test|expected|output|验证|输出/i.test(text),
      fix: 'Show the command or output that proves installation worked.',
    },
    {
      id: 'install_troubleshooting',
      weight: 10,
      title: 'Install profile: troubleshooting path',
      test: (text) => /troubleshoot|error|faq|debug|排障|错误|常见问题/i.test(text),
      fix: 'Add a troubleshooting, FAQ, or common errors section.',
    },
  ],
}

export function auditReadme(content, options = {}) {
  const profile = options.profile ?? 'core'
  const checks = [...baseChecks, ...(profileChecks[profile] ?? [])]
  const results = checks.map((check) => {
    const passed = check.test(content)
    return {
      id: check.id,
      title: check.title,
      passed,
      weight: check.weight,
      fix: passed ? null : check.fix,
    }
  })

  const maxScore = checks.reduce((total, check) => total + check.weight, 0)
  const score = Math.round(
    (results.filter((result) => result.passed).reduce((total, result) => total + result.weight, 0) / maxScore) * 100,
  )

  return {
    file: options.file ?? 'README.md',
    profile,
    score,
    maxScore: 100,
    passed: results.filter((result) => result.passed).length,
    total: results.length,
    results,
  }
}

export function formatTextReport(report) {
  const lines = [
    `README score: ${report.score}/100 (${report.passed}/${report.total} checks passed)`,
    `File: ${report.file}`,
    `Profile: ${report.profile}`,
    '',
  ]

  for (const result of report.results) {
    lines.push(`${result.passed ? 'PASS' : 'FAIL'} ${result.title}`)
    if (!result.passed) {
      lines.push(`  Fix: ${result.fix}`)
    }
  }

  return lines.join('\n')
}

export function formatMarkdownReport(report) {
  const rows = report.results
    .map((result) => `| ${result.passed ? 'PASS' : 'FAIL'} | ${result.title} | ${result.fix ?? ''} |`)
    .join('\n')

  return `# README Audit Report

Score: **${report.score}/100**

File: \`${report.file}\`
Profile: \`${report.profile}\`

| Status | Check | Fix |
| --- | --- | --- |
${rows}
`
}

export function formatAnnotations(report) {
  return report.results
    .filter((result) => !result.passed)
    .map((result) => `::warning file=${report.file},title=${result.title}::${result.fix}`)
    .join('\n')
}

export function formatSarif(report) {
  return {
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [
      {
        tool: { driver: { name: 'oss-readme-check', informationUri: 'https://github.com/aolingge/oss-readme-check' } },
        results: report.results
          .filter((result) => !result.passed)
          .map((result) => ({
            ruleId: result.id,
            level: 'warning',
            message: { text: result.fix },
            locations: [{ physicalLocation: { artifactLocation: { uri: report.file } } }],
          })),
      },
    ],
  }
}
