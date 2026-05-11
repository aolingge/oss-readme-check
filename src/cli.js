#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { auditReadme, formatAnnotations, formatMarkdownReport, formatSarif, formatTextReport } from './readme-audit.js'

const VERSION = '0.1.0'

function parseArgs(argv) {
  const args = {
    readmePath: 'README.md',
    minScore: 70,
    profile: 'core',
    markdown: false,
    json: false,
    sarif: false,
    annotations: false,
    version: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (item === '--path') {
      args.readmePath = argv[++index]
    } else if (item === '--min-score') {
      args.minScore = Number(argv[++index])
    } else if (item === '--profile') {
      args.profile = argv[++index]
    } else if (item === '--markdown') {
      args.markdown = true
    } else if (item === '--json') {
      args.json = true
    } else if (item === '--sarif') {
      args.sarif = true
    } else if (item === '--annotations') {
      args.annotations = true
    } else if (item === '--version') {
      args.version = true
    } else if (item === '-h' || item === '--help') {
      args.help = true
    } else {
      throw new Error(`Unknown option: ${item}`)
    }
  }

  return args
}

function printHelp() {
  console.log(`oss-readme-check v${VERSION}

Usage:
  oss-readme-check --path README.md --min-score 80
  oss-readme-check --markdown > readme-report.md
  oss-readme-check --json

Options:
  --path FILE       README file to audit, default: README.md
  --min-score N    fail when score is below N, default: 70
  --profile NAME   extra profile: core, demo-links, install-replay
  --markdown       print a markdown report
  --json           print raw JSON
  --sarif          print SARIF 2.1.0 report
  --annotations    print GitHub Actions warnings
  --version        print version
`)
}

try {
  const args = parseArgs(process.argv.slice(2))
  if (args.version) {
    console.log(VERSION)
    process.exit(0)
  }
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  const absolutePath = path.resolve(args.readmePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`README file not found: ${absolutePath}`)
  }

  const content = fs.readFileSync(absolutePath, 'utf8')
  const report = auditReadme(content, { file: args.readmePath, profile: args.profile })

  if (args.json) {
    console.log(JSON.stringify(report, null, 2))
  } else if (args.markdown) {
    console.log(formatMarkdownReport(report))
  } else if (args.sarif) {
    console.log(JSON.stringify(formatSarif(report), null, 2))
  } else if (args.annotations) {
    console.log(formatAnnotations(report))
  } else {
    console.log(formatTextReport(report))
  }

  process.exit(report.score >= args.minScore ? 0 : 1)
} catch (error) {
  console.error(`oss-readme-check: ${error.message}`)
  process.exit(2)
}
