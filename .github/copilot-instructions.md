# GitHub Contribution Tool - Development Instructions

## Project Overview
This is a Node.js script that generates backdated commits to simulate GitHub activity over time. It creates realistic commit messages with customizable patterns and validates all inputs before executing git operations.

## Architecture & Libraries

### Core Dependencies
- **moment.js** - All date/time handling (never use native Date for calculations)
- **simple-git** - All git operations (staging, committing, pushing)
- **dotenv** - Environment variable loading
- **jsonfile** - Temporary file writing for commit data
- **casual** - Realistic commit message generation
- **readline** - User input and confirmation prompts
- **fs** - File system operations

### Key Files
- `index.js` - Main script with validation, commit generation, and execution
- `.env` - Configuration file (git-ignored, user-specific)
- `.env.example` - Template for .env with default values
- `contrib` - Bash wrapper script for system-wide access
- `package.json` - Dependencies and npm scripts

## Code Patterns & Conventions

### Configuration Flow
Configuration precedence (highest to lowest):
1. Command-line arguments (positional: dayCommits, monthCommits, yearCommits, dayOffset, weekOffset, startDate)
2. Environment variables from .env file
3. Built-in defaults (7, 14, 21, random, random, 5-years-ago)

### Validation Pattern
- Use a dedicated validation function for each concern
- Accumulate errors in an array
- Throw once with all errors (never throw on first error)
- Provide multi-line, actionable error messages with examples

Example:
```javascript
function validateConfigurationValues() {
  const errors = [];
  if (numberOfDayCommits < 0) errors.push("DAY_COMMITS cannot be negative");
  if (numberOfMonthCommits < 0) errors.push("MONTH_COMMITS cannot be negative");
  
  if (errors.length > 0) {
    throw new Error(
      "Invalid configuration values:\n" +
      errors.map(e => `  - ${e}`).join("\n") +
      "\n\nPlease check your .env file or command-line arguments."
    );
  }
}
```

### Date Handling
- Always use moment.js
- Use `.startOf('day')` for day-level comparisons
- Format dates as YYYY-MM-DD (ISO 8601) for user display
- When calculating offsets, use moment.diff() to get days/weeks

Example:
```javascript
const today = moment().startOf('day');
const daysSpanned = Math.floor(today.diff(startDate, "days"));
```

### Error Messages
All error messages must:
1. Clearly state the problem
2. Explain why it's a problem
3. Provide actionable steps to fix it
4. Include examples when applicable

Example:
```javascript
throw new Error(
  "No git remote origin configured for this repository.\n" +
  "Please add a remote origin:\n" +
  "  git remote add origin <repository-url>\n" +
  "Example: git remote add origin git@github.com:username/repo.git"
);
```

### Test Mode (`testMode`)
When `testMode` is true:
- Skip git repository validation (allow testing without a repo)
- Skip git staging, committing, and pushing
- Still validate configuration and dates
- Still display all summaries and statistics
- Log "[TEST MODE]" messages where git operations would occur
- Users can see exactly what would be committed

## Function Signatures & Behavior

### Commit Generation Functions
All three follow the same pattern:
- Accept: count, offset, baseDate
- Calculate safe offset (min of requested offset, max available time remaining)
- Loop n times generating commits
- In test mode: skip git operations but log messages
- After loop: push to remote (unless test mode)

Example structure:
```javascript
async function makeCommitsDay(n, dayOffset, baseDate) {
  const maxDaysFromBase = Math.floor(moment().diff(baseDate, "days"));
  const safeDayOffset = Math.min(dayOffset, maxDaysFromBase);
  
  for (let i = 0; i < n; i++) {
    // ... generate commit date ...
    // ... log commit details ...
    if (!testMode) {
      // perform git operations
    }
  }
  if (!testMode) {
    // push to remote
  }
}
```

### Generation Logic
- **Daily commits** - All commits on same day + dayOffset, random times
- **Monthly commits** - All commits in same week + weekOffset, random times
- **Yearly commits** - Commits spread randomly between startDate and today

### Time Generation
For all commits:
```javascript
const hour = random.int(0, 23);
const minute = random.int(0, 59);
const second = random.int(0, 59);
const date = moment(baseDate)
  .add(offset, "unit")
  .set({ hour, minute, second, millisecond: 0 })
  .format();
```

## Main Execution Flow

The `main()` function executes in this order:

1. **Validate configuration values** - Check all numbers are non-negative
2. **Validate start date** - Check not in future, warn if very old
3. **Validate git repository** - Check .git exists and remote configured (skip in test mode)
4. **Display configuration summary** - Show user what will happen
5. **Ask for confirmation** - User must confirm (skipped in test mode)
6. **Run commit generators** - Execute day, month, year functions in sequence
7. **Display commit statistics** - Show what was created
8. **Success message** - Confirmation of completion

## Error Handling
Wrap main() in try-catch:
- Console prompt: "Error: [detailed message]"
- Helpful suggestions for common issues
- Exit with code 1 on error
- Exit with code 0 on success

## Console Output Standards
- Configuration summary uses "=" separators (60 chars wide)
- Statistics summary uses same format
- All user messages are clear and actionable
- Test mode is indicated in configuration summary
- Commit log format: `Adding commit for specific (d/m/y): YYYY-MM-DD HH:mm:ss [message]`

## Security & Safety
- Never assume git directory exists (validate first)
- Never assume remote is configured (validate first)
- All date calculations check for edge cases (0 days, past dates)
- Test mode allows full preview without destructive operations
- Confirmation prompt prevents accidental commits (unless test mode)

## npm Scripts
- `npm start` - Run with configuration from .env or defaults
- `npm run preview` - Run in test mode (TESTMODE=true)
- `npm run help` - Display README

## Addition Guidelines

When adding new features:
1. Add validation before execution
2. Include helpful error messages
3. Update .env.example with any new env vars
4. Update README with new functionality
5. Test in test mode first
6. Update commit statistics if adding new commit types
7. Maintain date arithmetic with moment.js (no native Date)
