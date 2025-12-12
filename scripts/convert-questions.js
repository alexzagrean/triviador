const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Convert spreadsheet to Question array
 * 
 * Expected spreadsheet format:
 * - Column A: Question title
 * - Column B-E: Options (4 options)
 * - The correct answer has a green background on one of B-E
 * - Column F: Topic
 * 
 * Usage:
 * 1. Place your spreadsheet in the root directory as 'questions.xlsx'
 * 2. Run: node scripts/convert-questions.js
 * 3. Output will be in src/questions.ts
 */

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function isWhiteColor(color) {
  if (!color) return true; // No color means default (white)
  
  // Handle different color formats
  let rgb;
  if (typeof color === 'string') {
    // If it's already a hex color
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      rgb = {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    } else {
      return true; // Unknown format, assume white
    }
  } else if (color.rgb) {
    rgb = color.rgb;
  } else if (color.r !== undefined) {
    rgb = color;
  } else {
    return true; // No color info, assume white
  }
  
  // Check if it's white or very light (close to white)
  // White is typically RGB(255, 255, 255) or very close to it
  // Consider colors with all components > 240 as white/very light
  const isWhite = rgb.r > 240 && rgb.g > 240 && rgb.b > 240;
  
  return isWhite;
}

function isNonWhiteColor(color) {
  return !isWhiteColor(color);
}

function convertSpreadsheetToQuestions(filePath) {
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath, { cellStyles: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with cell styles
    const data = XLSX.utils.sheet_to_json(worksheet, { 
      header: 1,
      defval: '',
      raw: false
    });
    
    const questions = [];
    let skippedRows = [];
    let totalRows = data.length;
    
    console.log(`Total rows in spreadsheet: ${totalRows}`);
    
    // Process each row - start from 0 (first row might be a question, not a header)
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Skip empty rows - check column A (index 0) for question title
      if (!row[0] || row[0].toString().trim() === '') {
        skippedRows.push({ row: i + 1, reason: 'Empty title in column A' });
        continue;
      }
      
      // Column A (index 0): Question title
      const title = row[0].toString().trim();
      
      // Columns B-E (indices 1-4): Options
      const options = [
        row[1]?.toString().trim() || '',
        row[2]?.toString().trim() || '',
        row[3]?.toString().trim() || '',
        row[4]?.toString().trim() || ''
      ].filter(opt => opt !== '');
      
      // Find the answer by checking cell background colors on columns B-E
      let answer = '';
      
      // Get cell references for options (B, C, D, E columns)
      const optionColumns = ['B', 'C', 'D', 'E'];
      
      for (let j = 0; j < optionColumns.length; j++) {
        const cellAddress = optionColumns[j] + (i + 1);
        const cell = worksheet[cellAddress];
        
        if (cell) {
          let bgColor = null;
          
          // Check if cell has style information
          if (cell.s) {
            const style = cell.s;
            
            // Check fill (background color)
            if (style.fill) {
              const fill = style.fill;
              if (fill.fgColor) {
                bgColor = fill.fgColor;
              } else if (fill.bgColor) {
                bgColor = fill.bgColor;
              }
            }
            
            // Also check patternFill
            if (!bgColor && style.patternFill) {
              const patternFill = style.patternFill;
              if (patternFill.fgColor) {
                bgColor = patternFill.fgColor;
              } else if (patternFill.bgColor) {
                bgColor = patternFill.bgColor;
              }
            }
            
            // Check if fill type indicates a colored background
            if (style.fill && style.fill.patternType && style.fill.patternType !== 'none') {
              // Has a fill pattern, check for color
              if (!bgColor && style.fill.fgColor) {
                bgColor = style.fill.fgColor;
              }
            }
          }
          
          // Check cell's z (format) property for background color
          if (!bgColor && cell.z) {
            // Sometimes color info is in the format string
            // This is a fallback - xlsx might not expose it easily
          }
          
          // If we found a color and it's not white, this is the answer
          if (bgColor && isNonWhiteColor(bgColor)) {
            answer = options[j];
            break;
          }
          
          // If cell has style but no color detected, it might still have a colored background
          // that's not being read properly. Check if style.fill exists at all
          if (cell.s && cell.s.fill && !bgColor) {
            // Has fill but no color extracted - might be a default fill
            // In Excel, if fill exists, it usually means it's not default white
            // Let's be more lenient and check if fill type is set
            if (cell.s.fill.patternType && cell.s.fill.patternType !== 'none') {
              // Has a pattern fill - likely not white
              answer = options[j];
              break;
            }
          }
        }
      }
      
      // If no green background found, check if there's an answer column (column G, index 6)
      if (!answer && row[6]) {
        answer = row[6].toString().trim();
      }
      
      // Column F (index 5): Topic
      const topic = row[5] ? row[5].toString().trim() : '';
      
      // More lenient validation - allow questions with at least 2 options
      if (!title) {
        skippedRows.push({ row: i + 1, reason: 'Missing title' });
        continue;
      }
      
      if (options.length < 2) {
        skippedRows.push({ row: i + 1, reason: `Only ${options.length} option(s) found, need at least 2` });
        continue;
      }
      
      // If no colored background detected, check if there's an answer column (column G, index 6)
      if (!answer && row[6]) {
        answer = row[6].toString().trim();
      }
      
      // If still no answer detected, use first option as fallback
      // This allows us to generate all questions, but answers will need manual verification
      if (!answer) {
        if (options.length > 0) {
          answer = options[0];
          skippedRows.push({ row: i + 1, reason: 'No colored background detected, using first option as fallback - VERIFY ANSWER' });
        } else {
          skippedRows.push({ row: i + 1, reason: 'No answer detected and no options available' });
          continue;
        }
      }
      
      // Pad options to 4 if needed
      while (options.length < 4) {
        options.push('');
      }
      
      questions.push({
        title,
        options: options.slice(0, 4), // Ensure exactly 4 options
        answer,
        topic: topic || 'General'
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
  const tsContent = `// Auto-generated from spreadsheet
// Run: node scripts/convert-questions.js

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
const spreadsheetPath = path.join(__dirname, '..', 'questions.xlsx');
const outputPath = path.join(__dirname, '..', 'src', 'questions.ts');

if (!fs.existsSync(spreadsheetPath)) {
  console.error(`Error: Spreadsheet not found at ${spreadsheetPath}`);
  console.log('\nPlease:');
  console.log('1. Place your spreadsheet in the root directory');
  console.log('2. Rename it to "questions.xlsx"');
  process.exit(1);
}

console.log('Reading spreadsheet...');
const questions = convertSpreadsheetToQuestions(spreadsheetPath);

console.log(`Found ${questions.length} questions`);

if (questions.length === 0) {
  console.error('No questions found! Please check your spreadsheet format.');
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

