#!/usr/bin/env node

/**
 * ExecPlan Generator
 * 
 * Quickly create a new ExecPlan from template
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('\n🚀 ExecPlan Generator\n');
  console.log('Answer a few questions to create your ExecPlan...\n');

  const title = await question('Title (brief description): ');
  if (!title) {
    console.log('❌ Title is required');
    process.exit(1);
  }

  const what = await question('What (one sentence summary): ');
  const why = await question('Why (motivation/problem): ');
  const author = await question('Author (or press Enter for "Agent"): ') || 'Agent';
  const issueNum = await question('Related issue # (or press Enter to skip): ');

  rl.close();

  const today = getTodayDate();
  const filename = slugify(title) + '.md';
  const planPath = path.join(process.cwd(), '.agent', 'plans', filename);

  // Check if file exists
  if (fs.existsSync(planPath)) {
    console.log(`\n❌ File already exists: ${filename}`);
    console.log('   Choose a different title or delete the existing file.\n');
    process.exit(1);
  }

  // Read template
  const templatePath = path.join(process.cwd(), '.agent', 'templates', 'execplan-template.md');
  let content = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders
  content = content.replace('[Brief Descriptive Title]', title);
  content = content.replace('YYYY-MM-DD', today);
  content = content.replace('YYYY-MM-DD', today);
  content = content.replace('[Your Name or "Agent"]', author);
  
  if (issueNum) {
    content = content.replace('#XXX', `#${issueNum}`);
  } else {
    content = content.replace('**Related Issues**: #XXX', '**Related Issues**: N/A');
  }

  if (what) {
    content = content.replace(
      '**What**: [2-3 sentence summary of what this accomplishes]',
      `**What**: ${what}`
    );
  }

  if (why) {
    content = content.replace(
      '**Why**: [Business/technical motivation - what problem does this solve?]',
      `**Why**: ${why}`
    );
  }

  // Ensure plans directory exists
  const plansDir = path.join(process.cwd(), '.agent', 'plans');
  if (!fs.existsSync(plansDir)) {
    fs.mkdirSync(plansDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(planPath, content);

  console.log('\n✅ ExecPlan created successfully!\n');
  console.log(`   File: .agent/plans/${filename}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Open the file and complete the remaining sections');
  console.log('   2. Define 2-4 milestones with clear validation steps');
  console.log('   3. Start coding and update Progress as you go');
  console.log('\n💡 Tip: See .agent/QUICKSTART.md for guidance\n');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
