# Steps to Convert Spreadsheet to Question Array

## Option 1: Using Excel with Color Detection (Recommended)

### Step 1: Prepare Your Spreadsheet
Ensure your spreadsheet has this structure:
- Column A: Question title
- Column B: Option 1
- Column C: Option 2
- Column D: Option 3
- Column E: Option 4
- The correct answer has a green background

### Step 2: Install Required Packages
```bash
npm install xlsx
npm install --save-dev @types/xlsx
```

### Step 3: Create a Conversion Script
Create `scripts/convert-questions.js` to parse Excel and detect green backgrounds.

### Step 4: Run the Script
```bash
node scripts/convert-questions.js
```

This will generate `src/questions.ts` with your Question array.

---

## Option 2: Manual Marking (Simpler, No Colors)

### Step 1: Add an "Answer" Column
Add a column (e.g., Column F) that contains the answer text or option number.

### Step 2: Export to CSV
Export your spreadsheet as CSV.

### Step 3: Use CSV Parser Script
Create a script to parse CSV and generate the array.

---

## Option 3: Google Sheets API (If using Google Sheets)

### Step 1: Export to Excel
Download as .xlsx

### Step 2: Use Excel Parser
Same as Option 1, Step 3-4

