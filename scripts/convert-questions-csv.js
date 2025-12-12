const fs = require('fs');
const path = require('path');

/**
 * Convert CSV to Question array (Simpler alternative)
 * 
 * Expected CSV format:
 * Question,Option1,Option2,Option3,Option4,Answer,Topic
 * What is the capital of France?,Paris,London,Berlin,Madrid,Paris,Geography
 * 
 * Usage:
 * 1. Export your spreadsheet as CSV
 * 2. Place it in root directory as 'questions.csv'
 * 3. Run: node scripts/convert-questions-csv.js
 * 4. Output will be in src/questions.ts
 */

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  const questions = [];
  
  // Skip header row (assuming first row is headers)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handles quoted values)
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Add last value
    
    if (values.length >= 6) {
      const [title, opt1, opt2, opt3, opt4, answer, topic] = values;
      
      if (title && opt1 && opt2 && opt3 && opt4 && answer) {
        questions.push({
          title: title.replace(/^"|"$/g, ''),
          options: [
            opt1.replace(/^"|"$/g, ''),
            opt2.replace(/^"|"$/g, ''),
            opt3.replace(/^"|"$/g, ''),
            opt4.replace(/^"|"$/g, '')
          ],
          answer: answer.replace(/^"|"$/g, ''),
          topic: topic ? topic.replace(/^"|"$/g, '') : 'General'
        });
      }
    }
  }
  
  return questions;
}

function generateTypeScriptFile(questions) {
  const tsContent = `// Auto-generated from CSV
// Run: node scripts/convert-questions-csv.js

export type Question = {
  title: string;
  options: string[];
  answer: string;
  topic: string;
}

export const questions: Question[] = ${JSON.stringify(questions, null, 2)};
`;
  
  return tsContent;
}

// Main execution
const csvPath = path.join(__dirname, '..', 'questions.csv');
const outputPath = path.join(__dirname, '..', 'src', 'questions.ts');

if (!fs.existsSync(csvPath)) {
  console.error(`Error: CSV file not found at ${csvPath}`);
  console.log('\nPlease:');
  console.log('1. Export your spreadsheet as CSV');
  console.log('2. Place it in the root directory');
  console.log('3. Rename it to "questions.csv"');
  console.log('\nCSV Format:');
  console.log('Question,Option1,Option2,Option3,Option4,Answer,Topic');
  process.exit(1);
}

console.log('Reading CSV file...');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const questions = parseCSV(csvContent);

console.log(`Found ${questions.length} questions`);

if (questions.length === 0) {
  console.error('No questions found! Please check your CSV format.');
  process.exit(1);
}

console.log('Generating TypeScript file...');
const tsContent = generateTypeScriptFile(questions);

fs.writeFileSync(outputPath, tsContent, 'utf8');

console.log(`✅ Successfully generated ${questions.length} questions in ${outputPath}`);
console.log('\nNext steps:');
console.log('1. Import questions in Question.tsx:');
console.log('   import { questions } from "./questions";');
console.log('2. Remove the hardcoded questions array');

