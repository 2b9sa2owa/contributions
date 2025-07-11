# GitHub Contribution Tool

This Node.js script makes automated commits with custom dates to simulate GitHub activity over time. It's useful for generating a visually appealing contribution graph.

## Features

- Generates backdated commits over the past year
- Randomizes commit times down to the second for realism
- Supports daily, weekly, and yearly commit patterns
- Automatically pushes to your GitHub repository
- Customizable number of commits for each pattern

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

Run the script with:

```bash
node index.js
```

The script will:
- Generate a configurable number of commits for a random day, week, and year in the past
- Randomize the hour, minute, and second for each commit
- Write a timestamp to `data.json`
- Stage, commit (with a custom `--date`), and push to your repository

## File Overview

- **`data.json`** – Temporary file used for commits
- **`index.js`** – Main script that:
  - Generates random dates and times
  - Writes to `data.json`
  - Commits with `--date`
  - Pushes to the repository

## How It Works

- For daily commits: Random hour, minute, and second are chosen for each commit on a specific day
- For monthly/weekly commits: Random week and day are chosen from the past year
- For yearly commits: Random week and day are chosen, spread throughout the year
- Dates are formatted using `moment`
- Each commit is made with a custom timestamp for realistic contribution graphs

Git is then used to:

- Stage the file  
- Commit it with a custom `--date`  
- Push it to the remote repo

## Disclaimer

> This tool is meant for educational, fun, or aesthetic purposes only.  
> Avoid using it to misrepresent your actual contributions.

## Other links

- [YouTube Video](https://www.youtube.com/watch?v=LlkcvvGbs9I)
- [goGreen GitHub Repository](https://github.com/fenrir2608/goGreen)