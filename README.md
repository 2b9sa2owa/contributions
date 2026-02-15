# GitHub Contribution Tool

This Node.js script makes automated, backdated commits with custom messages and timestamps to simulate GitHub activity over time. It's useful for generating a visually appealing contribution graph.

## Features

- Generates backdated commits over the past year
- Randomizes commit times down to the second for realism
- Supports daily, weekly (month-like), and yearly commit patterns
- Automatically stages, commits (with custom messages and dates), and pushes to your GitHub repository
- Customizable number of commits and offsets for each pattern via command-line arguments
- Generates realistic commit messages using the [casual](https://www.npmjs.com/package/casual) library

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

You can run the script with default values:

```bash
node index.js
```

Or override the number of commits and offsets via command-line arguments (takes precedence over `.env`):

```bash
node index.js [dayCommits] [monthCommits] [yearCommits] [dayOffset] [weekOffset] [startDate]
```

**Precedence order:** Command-line arguments > `.env` file > Built-in defaults

**Example:**

```bash
node index.js 5 2 10 100 20 2025-01-01
# 5 day commits, 2 month commits, 10 year commits, dayOffset=100, weekOffset=20, starting from 2025-01-01
```

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