const fs = require('fs');
const path = require('path');

// Answer indices provided by user (1-4, where 1 = first option, 4 = fourth option)
const answerIndices = [1,2,4,3,2,2,1,1,2,3,2,4,3,3,2,3,4,1,3,4,1,1,2,2,1,1,3,3,2,1,4,2,3,4,4,3,1,1,2,3,3,1,3,2,3,4,1,3,1,2];

const questionsPath = path.join(__dirname, '..', 'src', 'questions.ts');

// Read the questions file
const content = fs.readFileSync(questionsPath, 'utf8');

// Extract the questions array using regex
const questionsMatch = content.match(/export const questions: Question\[\] = (\[[\s\S]*\]);/);
if (!questionsMatch) {
  console.error('Could not find questions array in file');
  process.exit(1);
}

// Parse the JSON array
const questions = JSON.parse(questionsMatch[1]);

if (questions.length !== answerIndices.length) {
  console.error(`Mismatch: ${questions.length} questions but ${answerIndices.length} answer indices`);
  process.exit(1);
}

// Update each question's answer
questions.forEach((question, index) => {
  const answerIndex = answerIndices[index] - 1; // Convert 1-4 to 0-3
  if (answerIndex < 0 || answerIndex >= question.options.length) {
    console.error(`Invalid answer index ${answerIndices[index]} for question ${index + 1}`);
    return;
  }
  question.answer = question.options[answerIndex];
});

// Generate new TypeScript content
const newContent = `// Auto-generated from spreadsheet
// Run: node scripts/convert-questions.js

export type Question = {
  title: string;
  options: string[];
  answer: string;
  topic: string;
}

export const questions: Question[] = ${JSON.stringify(questions, null, 2)};
`;

// Write the updated file
fs.writeFileSync(questionsPath, newContent, 'utf8');

console.log(`✅ Successfully updated ${questions.length} questions with correct answers`);

