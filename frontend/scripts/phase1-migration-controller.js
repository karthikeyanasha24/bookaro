#!/usr/bin/env node

/**
 * 🚀 Phase 1 Automated Migration Controller
 * Executes Phase 1 migration with detailed reporting
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = '/Users/yvesyotatchoffo/Mon Drive/Anyhomes/01_Product/01_MVP/Code/bookaro_frontend-6_Jan';
const reportDir = path.join(baseDir, 'migration-reports/phase1/execution');

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

class Phase1Controller {
  constructor() {
    this.startTime = new Date();
    this.executionLog = [];
    this.fileReports = [];
    this.statsPerFile = {};
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    this.executionLog.push(logEntry);
    
    if (type === 'error') {
      console.error(`❌ ${message}`);
    } else if (type === 'success') {
      console.log(`✅ ${message}`);
    } else if (type === 'info') {
      console.log(`ℹ️  ${message}`);
    } else if (type === 'warning') {
      console.log(`⚠️  ${message}`);
    }
  }

  analyzeLoginFile() {
    this.log('Starting Login.tsx analysis...', 'info');
    
    const loginPath = path.join(baseDir, 'src/Pages/Login/index.tsx');
    const content = fs.readFileSync(loginPath, 'utf-8');
    
    const issues = [];
    const strings = [];
    
    // Find console.logs
    const consoleLogs = content.match(/console\.(log|error|warn)\([^)]+\)/g) || [];
    consoleLogs.forEach(log => {
      if (!log.includes('t(')) {
        issues.push(`Console without i18n: ${log.substring(0, 80)}`);
        strings.push(log);
      }
    });
    
    // Find hardcoded error messages
    const errorMessages = content.match(/errorMessage['\s]*:['\s]*["'`]([^"'`]+)["'`]/g) || [];
    errorMessages.forEach(msg => {
      if (!msg.includes('t(')) {
        issues.push(`Error message without i18n: ${msg.substring(0, 80)}`);
        strings.push(msg);
      }
    });

    this.statsPerFile['Login'] = {
      total: content.split('\n').length,
      issues: issues.length,
      stringsToMigrate: strings.length,
      affectedLines: [...new Set(issues)].length
    };

    this.log(`Found ${issues.length} migration issues in Login`, 'warning');
    issues.slice(0, 3).forEach(issue => this.log(`  - ${issue}`, 'info'));
    
    return { issues, strings };
  }

  analyzeSignupFile() {
    this.log('Starting Signup.js analysis...', 'info');
    
    const signupPath = path.join(baseDir, 'src/Pages/Signup/index.js');
    if (!fs.existsSync(signupPath)) {
      this.log('Signup file not found, skipping...', 'warning');
      return { issues: [], strings: [] };
    }
    
    const content = fs.readFileSync(signupPath, 'utf-8');
    const issues = [];
    const strings = [];
    
    // Find validation messages
    const validationMsgs = content.match(/validation\.[a-zA-Z]+|["']([a-zA-Z\s]+Error)["']/g) || [];
    validationMsgs.forEach(msg => {
      if (!msg.includes('t(')) {
        issues.push(`Validation without i18n: ${msg}`);
        strings.push(msg);
      }
    });

    this.statsPerFile['Signup'] = {
      total: content.split('\n').length,
      issues: issues.length,
      stringsToMigrate: strings.length
    };

    this.log(`Found ${issues.length} migration issues in Signup`, 'warning');
    
    return { issues, strings };
  }

  generatePreMigrationReport() {
    const report = `# 🚀 PHASE 1 PRE-MIGRATION REPORT

**Generated:** ${new Date().toISOString()}
**Execution Start:** ${this.startTime.toISOString()}

## 📊 ANALYSIS RESULTS

### Login.tsx
- Total Lines: ${this.statsPerFile['Login']?.total || 0}
- Issues Found: ${this.statsPerFile['Login']?.issues || 0}
- Strings to Migrate: ${this.statsPerFile['Login']?.stringsToMigrate || 0}

### Signup.js
- Total Lines: ${this.statsPerFile['Signup']?.total || 0}
- Issues Found: ${this.statsPerFile['Signup']?.issues || 0}
- Strings to Migrate: ${this.statsPerFile['Signup']?.stringsToMigrate || 0}

## 🔄 EXECUTION LOG

\`\`\`
${this.executionLog.join('\n')}
\`\`\`

## ✅ STATUS

**Ready to Proceed:** ${Object.keys(this.statsPerFile).length > 0 ? 'YES' : 'NO'}

---

## 📈 NEXT STEPS

1. Review this pre-migration analysis
2. Confirm all files are ready
3. Proceed with actual file modifications
4. Generate per-file migration reports
5. Test in browser (EN + FR)

`;

    return report;
  }

  execute() {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║ 🚀 PHASE 1 MIGRATION CONTROLLER STARTED                       ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    this.log('Phase 1 Migration Controller initialized', 'success');
    
    // Analyze files
    try {
      this.analyzeLoginFile();
      this.analyzeSignupFile();
    } catch (error) {
      this.log(`Analysis error: ${error.message}`, 'error');
    }

    // Generate report
    const report = this.generatePreMigrationReport();
    const reportFile = path.join(reportDir, `PRE_MIGRATION_${Date.now()}.md`);
    fs.writeFileSync(reportFile, report);
    
    console.log(`\n📊 Pre-migration report saved: ${reportFile}\n`);
    
    // Summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 PHASE 1 PRE-MIGRATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    Object.entries(this.statsPerFile).forEach(([file, stats]) => {
      console.log(`${file}:`);
      console.log(`  • Lines: ${stats.total}`);
      console.log(`  • Issues: ${stats.issues}`);
      console.log(`  • Strings: ${stats.stringsToMigrate}\n`);
    });

    console.log('✅ Phase 1 is ready for migration!\n');

    return {
      success: true,
      reportFile,
      stats: this.statsPerFile
    };
  }
}

// Execute
const controller = new Phase1Controller();
const result = controller.execute();

if (result.success) {
  console.log('🎯 PHASE 1 MIGRATION READY TO BEGIN!');
  console.log('═══════════════════════════════════════════════════════════════');
}
