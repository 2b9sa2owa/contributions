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

## Usage

You can run the script with default values:

```bash
node index.js
```

Or override the number of commits and offsets via command-line arguments:

```bash
node index.js [dayCommits] [monthCommits] [yearCommits] [dayOffset] [weekOffset]
```

**Example:**

```bash
node index.js 5 2 10 100 20
# 5 day commits, 2 month commits, 10 year commits, dayOffset=100, weekOffset=20
```

If you omit arguments, defaults will be used.

## How It Works

- **Daily commits:** Generates a configurable number of commits on a specific day, each at a random hour, minute, and second.
- **Monthly/weekly commits:** Generates commits in a specific week (month-like), each at a random time.
- **Yearly commits:** Spreads commits randomly throughout the year, picking random weeks and days.
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

## Other links

- [YouTube Video](https://www.youtube.com/watch?v=LlkcvvGbs9I)
- [goGreen GitHub Repository](https://github.com/fenrir2608/goGreen)