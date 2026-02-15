# GitHub Contribution Tool

This Node.js script makes automated, backdated commits with custom messages and timestamps to simulate GitHub activity over time. It's useful for generating a visually appealing contribution graph.

## Features

- Generates backdated commits over the past year
- Randomizes commit times down to the second for realism
- Supports daily, weekly (month-like), and yearly commit patterns
- Automatically stages, commits (with custom messages and dates), and pushes to your GitHub repository
- Customizable number of commits and offsets for each pattern via command-line arguments
- Generates realistic commit messages using the [casual](https://www.npmjs.com/package/casual) library
- Displays commit statistics at the end showing total commits and date range

## Requirements

- Node.js (v14 or later recommended)
- A GitHub repository with proper remote origin set
- **Git installed and authenticated locally**
- npm and nvm (optional) installed

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:2b9sa2owa/contributions.git
   cd contributions
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Configure defaults via `.env` file:

   A `.env.example` file is included showing all available configuration options. Copy it to create your own `.env` file:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` to set default values that will be used if not provided via command line:

   ```bash
   DAY_COMMITS=7
   MONTH_COMMITS=14
   YEAR_COMMITS=21
   DAY_OFFSET=100
   WEEK_OFFSET=10
   START_DATE=2025-01-01
   TESTMODE=false
   ```

   Leave any variable empty to use the built-in defaults or let command-line arguments override them. The `.env` file is git-ignored, so your local configuration won't be committed.

   **Test Mode:** Set `TESTMODE=true` to simulate commits without actually running git operations. This is useful for previewing what commits would be created before committing them to your repository.

## Usage

### Using the `contrib` wrapper script (Easiest)

A `contrib` wrapper script is included in the repository. Make it executable and use it from anywhere:

```bash
# Make the script executable (one time only)
# From the repository directory:
chmod +x contrib

# Or using the full path:
chmod +x ~/git/contributions/contrib

# Run with defaults
./contrib

# Preview commits (test mode)
./contrib preview

# View help
./contrib help

# Pass arguments
./contrib 5 2 10 100 20 2025-01-01
```

**For system-wide access**, add the script to your PATH or create an alias (see below).

### Setup shell aliases (Optional)

Add one or more of these aliases to your `.bashrc`, `.zshrc`, or shell config file:

```bash
# First, make the script executable (one time only):
chmod +x ~/git/contributions/contrib

# Then add the alias:
alias contrib="~/git/contributions/contrib"

# Or if you prefer npm commands:
alias contrib="npm --prefix ~/git/contributions start"
alias contrib:preview="npm --prefix ~/git/contributions run preview"
alias contrib:help="npm --prefix ~/git/contributions run help"
```

Then reload your shell:
```bash
source ~/.bashrc  # or source ~/.zshrc for zsh
```

Now you can use:
```bash
contrib
contrib preview
contrib 5 2 10 100 20 2025-01-01
```

### Using npm scripts

```bash
# Run with default configuration
npm start

# Preview commits without making changes (test mode)
npm run preview

# View this README
npm run help
```

You can also pass additional arguments to override defaults:

```bash
npm start -- 5 2 10 100 20 2025-01-01
# npm start -- [dayCommits] [monthCommits] [yearCommits] [dayOffset] [weekOffset] [startDate]
```

### Using node directly

```bash
# Run with default values
node index.js

# Override values via command-line arguments
node index.js [dayCommits] [monthCommits] [yearCommits] [dayOffset] [weekOffset] [startDate]

# Example
node index.js 5 2 10 100 20 2025-01-01
# 5 day commits, 2 month commits, 10 year commits, dayOffset=100, weekOffset=20, starting from 2025-01-01
```

**Precedence order:** Command-line arguments > `.env` file > Built-in defaults

**Defaults:** If you omit arguments, the following defaults will be used:
- `dayCommits`: 7 (7 commits all on the same day, each at a different random time)
- `monthCommits`: 14 (14 commits all within the same week, each at a different random time of day)
- `yearCommits`: 21 (21 commits randomly across the entire past year, each at a random time of day)
- `dayOffset`: random (0-364)
- `weekOffset`: random (0-51)
- `startDate`: 5 years ago from today (commits placed relative to 5 years ago)

## How It Works

- **Daily commits:** Generates a configurable number of commits on a specific day (determined by `dayOffset` from `startDate`), each at a random hour, minute, and second.
- **Monthly/weekly commits:** Generates commits in a specific week (determined by `weekOffset` from `startDate`), each at a random time.
- **Yearly commits:** Spreads commits randomly throughout the period from `startDate` to today, each at a random time.
- **Commit messages:** Each commit message is generated using the `casual` library, combining random names, actions, and ticket numbers for realism.
- **Commit process:** For each commit, the script writes a timestamp to `data.json`, stages the file, commits with a custom message and `--date`, and pushes to the repository.
- **Error handling:** Each git operation is wrapped in try/catch blocks for robust error reporting.

## Safety & Validation

The script includes several safety features to prevent accidental misuse:

1. **Git Repository Validation** - Checks that you're in a valid git repository with a configured remote origin before proceeding
2. **Configuration Summary** - Displays a summary of what will be created including:
   - Start and end dates
   - Total days spanned
   - Breakdown of commits (daily, monthly, yearly)
   - Test mode status
3. **Confirmation Prompt** - Asks you to confirm before creating commits (skipped in test mode)
4. **Start Date Validation** - Prevents start dates in the future
5. **Test Mode** - Preview your commits without actually modifying the repository

When you run the script in production mode, you'll see output like:

```
============================================================
CONFIGURATION SUMMARY
============================================================
Start Date:        2021-02-15
End Date:          2026-02-15
Days Spanned:      1826 days (~5 years)

Commit Breakdown:
  • Daily commits:   7 commits on day 2021-02-15 + 100 days
  • Monthly commits: 14 commits in week 2021-02-15 + 10 weeks
  • Yearly commits:  21 commits spread across the date range

Total Commits:     42
Test Mode:         Disabled
============================================================

? Proceed with creating commits? (y/n) y

============================================================
COMMIT STATISTICS
============================================================
Total Commits Created: 42
Date Range:           2021-02-15 to 2026-02-15
Days Spanned:         1826 days (~5 years)
Average per Day:      0.02
============================================================

Commit generation completed successfully!
```

## Local Backup with Post-Commit Hook

This repository includes a `post-commit` git hook that automatically backs up changed files to a remote server after each commit. This is useful for maintaining a distributed backup of your work.

### Setup

1. **Configure git to use the hooks directory:**

   ```bash
   git config core.hooksPath .githooks
   chmod +x .githooks/post-commit
   ```

2. **Add backup configuration to `.env`:**

   The hook requires the following environment variables in your `.env` file:

   ```bash
   BACKUP_USER="your-ssh-username"
   BACKUP_SERVER="backup-server-ip-or-domain"
   BACKUP_PATH="/path/to/backup/destination"
   BACKUP_PASSWORD="your-ssh-password"
   ```

   These credentials are not committed to the repository (`.env` is git-ignored), so they remain secure.

3. **Install `sshpass` (if not already installed):**

   The hook uses `sshpass` to enable non-interactive SSH authentication. Install it on your system:

   ```bash
   # macOS
   brew install sshpass

   # Ubuntu/Debian
   sudo apt-get install sshpass

   # CentOS/RHEL
   sudo yum install sshpass
   ```

### How It Works

After each commit, the hook:
1. Loads environment variables from `.env`
2. Gets the list of files changed in the last commit
3. Backs up each changed file to the remote server using SCP

**Important:** This hook runs **only locally** on your machine. GitHub and other remote repositories do not execute client-side hooks. It's safe to commit this hook to your repository.

### Disabling the Hook

If you want to make commits without backing up, you can temporarily skip the hook:

```bash
git commit --no-verify
```

Or permanently disable it:

```bash
git config core.hooksPath ""
```

## File Overview

- **`data.json`** – Temporary file used for commits
- **`index.js`** – Main script that:
  - Parses command-line arguments for commit counts and offsets
  - Generates random dates and times
  - Generates realistic commit messages
  - Writes to `data.json`
  - Commits with `--date` and pushes to the repository

## Example Commit Message

```
TICKET: 123 - revising function, Alice Smith during Monday, July 8, 2024
```

## Disclaimer

> This tool is meant for educational, fun, or aesthetic purposes only.  
> Avoid using it to misrepresent your actual contributions.

## Credits & License

- Code inspiration and logic adapted from **Harsh Mehta** [fenrir2608/goGreen](https://github.com/fenrir2608/goGreen/tree/main)
- Feel free to use my code and ask me any questions, just drop any suugestions or merge requests etc to this branch and I will look at it when I have a moment.

## Other links

- [YouTube Video](https://www.youtube.com/watch?v=LlkcvvGbs9I)
- [goGreen GitHub Repository](https://github.com/fenrir2608/goGreen)