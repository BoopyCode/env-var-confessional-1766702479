#!/usr/bin/env node

// ENV Var Confessional - Where your environment variables come to confess their sins
// Usage: node env-confessional.js <path-to-env-example>

const fs = require('fs');
const path = require('path');

// The Great Inquisition begins
function interrogateEnvVars(examplePath) {
    try {
        // Read the holy scripture (the .env.example file)
        const exampleContent = fs.readFileSync(examplePath, 'utf8');
        const envContent = fs.existsSync('.env') 
            ? fs.readFileSync('.env', 'utf8') 
            : '';
        
        // Parse the commandments
        const expectedVars = new Set();
        const actualVars = new Map();
        
        // Extract expected variables (skip comments and empty lines)
        exampleContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const varName = trimmed.split('=')[0];
                expectedVars.add(varName);
            }
        });
        
        // Extract actual variables from .env
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [varName, ...valueParts] = trimmed.split('=');
                actualVars.set(varName, valueParts.join('='));
            }
        });
        
        console.log('\n🔍 ENVIRONMENT VARIABLE INQUISITION 🔍');
        console.log('=' .repeat(40));
        
        let sinsFound = 0;
        
        // Check for missing variables (the cardinal sin)
        for (const expected of expectedVars) {
            if (!actualVars.has(expected)) {
                console.log(`❌ MISSING: "${expected}" - This variable is playing hide and seek`);
                sinsFound++;
            }
        }
        
        // Check for empty values (the sin of omission)
        for (const [varName, value] of actualVars) {
            if (!value || value.trim() === '') {
                console.log(`⚠️  EMPTY: "${varName}" - Present but worthless, like a decaf coffee`);
                sinsFound++;
            }
        }
        
        // Check for extra variables (the sin of pride)
        for (const actual of actualVars.keys()) {
            if (!expectedVars.has(actual)) {
                console.log(`🤔 EXTRA: "${actual}" - Who invited you to this party?`);
                sinsFound++;
            }
        }
        
        console.log('=' .repeat(40));
        
        if (sinsFound === 0) {
            console.log('✅ All environment variables have confessed and are in a state of grace!');
            process.exit(0);
        } else {
            console.log(`💀 Found ${sinsFound} environmental sins. Go forth and repent!`);
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`🔥 Inquisition failed: ${error.message}`);
        process.exit(1);
    }
}

// Main execution - no forgiveness, only truth
const examplePath = process.argv[2] || '.env.example';
if (!fs.existsSync(examplePath)) {
    console.error(`🔥 Cannot find confession manual: ${examplePath}`);
    console.log('Usage: node env-confessional.js <path-to-env-example>');
    process.exit(1);
}

interrogateEnvVars(examplePath);
