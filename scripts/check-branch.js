const branch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim()

// Allowed pattern:
// type/scope-subject
const pattern = /^[a-z]{2,10}\/[a-z0-9]{1,10}-[a-z0-9-]{1,30}$/

if (!pattern.test(branch)) {
  console.log('\n❌ Invalid branch name:', branch)
  console.log('\n✅ Expected format:')
  console.log('  <type>/<scope>-<subject>')
  console.log('\nExamples:')
  console.log('  feat/auth-login')
  console.log('  fix/ui-button')
  console.log('  chore/ci-eslint\n')

  process.exit(1)
}

console.log('✅ Branch name OK:', branch)
