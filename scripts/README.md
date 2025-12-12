# Converting Spreadsheet to Questions Array

This guide will help you convert your spreadsheet with questions into a TypeScript array.

## 📋 Prerequisites

Your spreadsheet should have this structure:
- **Column A**: Question title
- **Column B-E**: 4 answer options
- **Green background**: Marks the correct answer (for Excel method)

## 🎯 Method 1: Excel with Green Background Detection (Recommended)

This method preserves the green background color to identify correct answers.

### Step 1: Prepare Your Spreadsheet
1. Ensure your spreadsheet follows the format above
2. Make sure the correct answer has a **green background**
3. Save as `.xlsx` format

### Step 2: Install Dependencies
```bash
npm install xlsx
```

### Step 3: Place Your Spreadsheet
1. Place your Excel file in the **root directory** of the project
2. Rename it to `questions.xlsx`

### Step 4: Run the Conversion Script
```bash
node scripts/convert-questions.js
```

### Step 5: Use the Generated File
The script will create `src/questions.ts`. Then update `Question.tsx`:

```typescript
import { questions } from './questions';
// Remove the hardcoded questions array
```

---

## 🎯 Method 2: CSV with Answer Column (Simpler)

This method is simpler but requires adding an answer column to your spreadsheet.

### Step 1: Add Answer Column
1. Add a new column (Column F) called "Answer"
2. In this column, put the correct answer text for each question

### Step 2: Export to CSV
1. Export your spreadsheet as CSV
2. Place it in the **root directory**
3. Rename it to `questions.csv`

### Step 3: Run the Conversion Script
```bash
node scripts/convert-questions-csv.js
```

### Step 4: Use the Generated File
Same as Method 1, Step 5.

---

## 📝 CSV Format Example

```csv
Question,Option1,Option2,Option3,Option4,Answer
What is the capital of France?,Paris,London,Berlin,Madrid,Paris
What is 2+2?,3,4,5,6,4
```

---

## 🔧 Troubleshooting

### "Spreadsheet not found"
- Make sure the file is in the root directory (same level as `package.json`)
- Check the filename is exactly `questions.xlsx` or `questions.csv`

### "No questions found"
- Check your spreadsheet format matches the expected structure
- Make sure there are no empty rows at the top
- Verify all columns have data

### Green background not detected
- Try Method 2 (CSV with answer column) instead
- Or manually check the green color RGB values in the script

---

## 📦 Generated Output

The script generates `src/questions.ts` with:
- TypeScript type definition
- Array of Question objects
- Ready to import and use

