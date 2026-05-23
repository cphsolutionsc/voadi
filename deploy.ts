#!/usr/bin/env npx tsx
/**
 * Deploy VOADI to production VPS.
 * Usage: npx tsx deploy.ts
 *
 * All commands are hardcoded constants — no user input, no injection risk.
 */

import { execFileSync } from 'child_process'

const VPS = 'cph-vps'
const REMOTE_DIR = '/opt/voadi'

function remote(label: string, ...args: string[]) {
  console.log(`\n→ ${label}`)
  execFileSync('ssh', [VPS, `cd ${REMOTE_DIR} && ${args.join(' ')}`], { stdio: 'inherit' })
}

console.log('Deploying VOADI to voadi.org...\n')

remote('Pull latest code', 'git pull origin main')

remote(
  'Build and restart container',
  'docker compose -f docker/docker-compose.prod.yml --env-file .env up -d --build',
)

remote(
  'Check container status',
  'docker ps --filter name=voadi-web --format "{{.Names}} — {{.Status}}"',
)

console.log('\nDeploy complete. Site live at https://voadi.org')
