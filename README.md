# GitHub Contribution Tool

This Node.js script makes automated commits with custom dates to simulate GitHub activity over time. It's useful for generating a visually appealing contribution graph.

## Features

- Generates backdated commits over the past year
- Uses random distribution for realistic commit spread
- Automatically pushes to your GitHub repository
- Customizable number of commits

## Requirements

- Node.js (v14 or later recommended)
- A GitHub repository with proper remote origin set
- **Git installed and authenticated locally**
- npm and nvm (optional) installed

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:2b9sa2owa/contributions.git
   cd your-repo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

3. Run the script with:

    ```bash
    node index.js
    ```

## File Overview

- **`data.json`** – Temporary file used for commits
- **`index.js`** – Main script that:
  - Generates random dates
  - Writes to `data.json`
  - Commits with `--date`
  - Pushes to the repository

## How It Works

- Random week (`x`) and day (`y`) are chosen from the past year
- A formatted date string is generated with `moment`
- That date is written to `data.json`

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