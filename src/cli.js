#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { auditReadme, formatMarkdownReport, formatTextReport } from './readme-audit.js'

function parseArgs(argv) {
  const args = {
    readmePath: 'README.md',
    minScore: 70,
    markdown: false,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index]
    if (item === '--path') {
      args.readmePath = argv[++index]
    } else if (item === '--min-score') {
      args.minScore = Number(argv[++index])
    } else if (item === '--markdown') {
      args.markdown = true
    } else if (item === '--json') {
      args.json = true
    } else if (item === '-h' || item === '--help') {
      args.help = true
    } else {
      throw new Error(`Unknown option: ${item}`)
    }
  }

  return args
}

function printHelp() {
  console.log(`oss-readme-check

Usage:
  oss-readme-check --path README.md --min-score 80
  oss-readme-check --markdown > readme-report.md
  oss-readme-check --json

Options:
  --path FILE       README file to audit, default: README.md
  --min-score N    fail when score is below N, default: 70
  --markdown       print a markdown report
  --json           print raw JSON
`)
}

try {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  const absolutePath = path.resolve(args.readmePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`README file not found: ${absolutePath}`)
  }

  const content = fs.readFileSync(absolutePath, 'utf8')
  const report = auditReadme(content, { file: args.readmePath })

  if (args.json) {
    console.log(JSON.stringify(report, null, 2))
  } else if (args.markdown) {
    console.log(formatMarkdownReport(report))
  } else {
    console.log(formatTextReport(report))
  }

  process.exit(report.score >= args.minScore ? 0 : 1)
} catch (error) {
  console.error(`oss-readme-check: ${error.message}`)
  process.exit(2)
}
