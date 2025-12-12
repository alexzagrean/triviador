const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Convert spreadsheet to Numeric Question array
 * 
 * Expected spreadsheet format (Sheet: "Numere"):
 * - Column A: (Number/ID, optional)
 * - Column B: Question title
 * - Column C: Answer
 * 
 * Usage:
 * 1. Place your spreadsheet in the root directory as 'questions.xlsx'
 * 2. Run: node scripts/convert-numeric-questions.js
 * 3. Output will be in src/numericQuestions.ts
 */

function convertSpreadsheetToNumericQuestions(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    
    // Check if "Numere" sheet exists
    if (!workbook.SheetNames.includes('Numere')) {
      console.error('Error: Sheet "Numere" not found in spreadsheet');
      console.log('Available sheets:', workbook.SheetNames.join(', '));
      throw new Error('Sheet "Numere" not found');
    }
    
    const worksheet = workbook.Sheets['Numere'];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '',
      raw: false
    });
    
    const questions = [];
    let skippedRows = [];
    let totalRows = data.length;
    
    console.log(`Total rows in "Numere" sheet: ${totalRows}`);
    
    // Process each row (skip header row if it exists)
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip header row (check if first row looks like a header)
      if (i === 0 && (row[0]?.toString().trim().toLowerCase() === 'numar' || 
                      row[0]?.toString().trim().toLowerCase() === 'number' ||
                      row[1]?.toString().trim().toLowerCase() === 'intrebare' ||
                      row[1]?.toString().trim().toLowerCase() === 'question')) {
        console.log('Skipping header row');
        continue;
      }
      
      // Column B (index 1): Question title
      const title = row[1] ? row[1].toString().trim() : '';
      
      // Column C (index 2): Answer
      const answer = row[2] ? row[2].toString().trim() : '';
      
      // Skip empty rows
      if (!title) {
        skippedRows.push({ row: i + 1, reason: 'Empty question in column B' });
        continue;
      }
      
      if (!answer) {
        skippedRows.push({ row: i + 1, reason: 'Missing answer in column C' });
        continue;
      }
      
      questions.push({
        title,
        answer
      });
    }
    
    if (skippedRows.length > 0) {
      console.log(`\n⚠️  Skipped ${skippedRows.length} rows:`);
      skippedRows.slice(0, 10).forEach(({ row, reason }) => {
        console.log(`   Row ${row}: ${reason}`);
      });
      if (skippedRows.length > 10) {
        console.log(`   ... and ${skippedRows.length - 10} more`);
      }
    }
    
    return questions;
  } catch (error) {
    console.error('Error reading spreadsheet:', error);
    throw error;
  }
}

function generateTypeScriptFile(questions) {
  const tsContent = `// Auto-generated from spreadsheet (Sheet: "Numere")
// Run: node scripts/convert-numeric-questions.js

export type NumericQuestion = {
  title: string;
  answer: string;
}

export const numericQuestions: NumericQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  
  return tsContent;
}

// Main execution
const spreadsheetPath = path.join(__dirname, '..', 'questions.xlsx');
const outputPath = path.join(__dirname, '..', 'src', 'numericQuestions.ts');

if (!fs.existsSync(spreadsheetPath)) {
  console.error(`Error: Spreadsheet not found at ${spreadsheetPath}`);
  console.log('\nPlease:');
  console.log('1. Place your spreadsheet in the root directory');
  console.log('2. Rename it to "questions.xlsx"');
  process.exit(1);
}

console.log('Reading "Numere" sheet from spreadsheet...');
const questions = convertSpreadsheetToNumericQuestions(spreadsheetPath);

console.log(`Found ${questions.length} numeric questions`);

if (questions.length === 0) {
  console.error('No questions found! Please check your spreadsheet format.');
  process.exit(1);
}

console.log('Generating TypeScript file...');
const tsContent = generateTypeScriptFile(questions);

fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`✅ Successfully generated ${questions.length} numeric questions in ${outputPath}`);

