'use strict'
const crypto = require('node:crypto')
const fs = require('node:fs')
for (const name of ['EXPECTED_HEAD_SHA', 'HEAD_REPOSITORY', 'BASE_REPOSITORY', 'PR_NUMBER', 'EVENT_ACTION', 'EVIDENCE_PATH']) {
  if (!process.env[name]) throw new Error(`Missing bounded input ${name}`)
}
const evidence = {
  payload_id: 'fork-environment-hash-only-v1',
  secret_present: Boolean(process.env.ENV_SECRET),
  head_sha: process.env.EXPECTED_HEAD_SHA.toLowerCase(),
  head_repository: process.env.HEAD_REPOSITORY,
  base_repository: process.env.BASE_REPOSITORY,
  pr_number: Number(process.env.PR_NUMBER),
  event_action: process.env.EVENT_ACTION
}
if (evidence.secret_present) {
  evidence.secret_sha256 = crypto.createHash('sha256').update(process.env.ENV_SECRET).digest('hex')
}
fs.writeFileSync(process.env.EVIDENCE_PATH, JSON.stringify(evidence) + '\n', {flag: 'wx'})
console.log(`FORK_ENV_PAYLOAD_EXECUTED head=${evidence.head_sha}`)
console.log(`ENV_SECRET_PRESENT=${evidence.secret_present}`)
if (evidence.secret_sha256) console.log(`SYNTHETIC_ENV_SECRET_SHA256=${evidence.secret_sha256}`)
