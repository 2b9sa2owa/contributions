// ===================================================
// GitHub Contribution Automation Script
// ===================================================

// -----------------------------
// Imports and Dependencies
// -----------------------------
import dotenv from "dotenv";
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import casual from "casual";
import readline from "readline";
import fs from "fs";

// Load environment variables from .env file
dotenv.config();

// -----------------------------
// Parse Command-Line Arguments
// -----------------------------
const args = process.argv.slice(2);

function getArg(index, fallback) {
  const val = args[index];
  return val !== undefined && !isNaN(Number(val)) ? Number(val) : fallback;
}

// Allow user to override these via CLI: node index.js [dayCommits] [monthCommits] [yearCommits] [dayOffset] [weekOffset] [startDate]
const numberOfDayCommits = getArg(0, process.env.DAY_COMMITS !== undefined && !isNaN(parseInt(process.env.DAY_COMMITS)) ? parseInt(process.env.DAY_COMMITS) : 7);
const numberOfMonthCommits = getArg(1, process.env.MONTH_COMMITS !== undefined && !isNaN(parseInt(process.env.MONTH_COMMITS)) ? parseInt(process.env.MONTH_COMMITS) : 14);
const numberOfYearCommits = getArg(2, process.env.YEAR_COMMITS !== undefined && !isNaN(parseInt(process.env.YEAR_COMMITS)) ? parseInt(process.env.YEAR_COMMITS) : 21);
const dayOffset = args[3] !== undefined && !isNaN(Number(args[3])) 
  ? Number(args[3]) 
  : (process.env.DAY_OFFSET ? parseInt(process.env.DAY_OFFSET) : random.int(0, 364));
const weekOffset = args[4] !== undefined && !isNaN(Number(args[4])) 
  ? Number(args[4]) 
  : (process.env.WEEK_OFFSET ? parseInt(process.env.WEEK_OFFSET) : random.int(0, 51));
const startDate = args[5] 
  ? (moment(args[5]).isValid() ? moment(args[5]) : moment().subtract(5, 'y')) 
  : (process.env.START_DATE && moment(process.env.START_DATE).isValid() 
      ? moment(process.env.START_DATE) 
      : moment().subtract(5, 'y'));
const testMode = process.env.TESTMODE === 'true' || process.env.TESTMODE === '1';

// -----------------------------
// Configuration and Constants
// -----------------------------

// Path to the temporary file used for each commit
const path = "./data.json";

// Initialize simple-git
const git = simpleGit();

// Arrays for generating random commit messages
const doing = [
  "refreshing",
  "upgrading",
  "revising",
  "modifying",
  "improving",
  "renewing",
  "altering",
  "amending",
  "enhancing",
  "modernizing",
  "adjusting",
  "reworking",
  "refining",
  "overhauling",
];
const what = [
  "program",
  "script",
  "markup",
  "software",
  "application",
  "algorithm",
  "routine",
  "function",
  "command",
  "syntax",
  "procedure",
  "module",
  "block",
  "formula",
];
const when = [
  "upon",
  "onto",
  "over",
  "atop",
  "against",
  "about",
  "concerning",
  "on",
  "during",
  "throughout",
];

// -----------------------------
// Validation and Safety Functions
// -----------------------------

/**
 * Validates that this is a valid git repository with a remote origin.
 * @throws {Error} If .git directory doesn't exist or no remote origin is configured
 */
async function validateGitRepository() {
  if (!fs.existsSync(".git")) {
    throw new Error("Not a git repository. .git directory not found.")
  }

  try {
    const remotes = await git.getRemotes(true);
    if (!remotes || remotes.length === 0) {
      throw new Error("No git remote origin configured. Please set up a remote: git remote add origin <url>");
    }
  } catch (err) {
    throw new Error(`Error checking git remote: ${err.message}`);
  }
}

/**
 * Validates the start date is not in the future.
 * @throws {Error} If start date is after today
 */
function validateStartDate() {
  const today = moment().startOf('day');
  
  if (startDate.isAfter(today)) {
    throw new Error("Start date cannot be in the future. Please use a date on or before today.");
  }
}

/**
 * Displays a summary of what will be created.
 */
function displayConfigurationSummary() {
  const today = moment();
  const totalCommits = numberOfDayCommits + numberOfMonthCommits + numberOfYearCommits;
  const daysSpanned = Math.floor(today.diff(startDate, "days"));
  
  console.log("\n" + "=".repeat(60));
  console.log("CONFIGURATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Start Date:        ${startDate.format("YYYY-MM-DD")}`);
  console.log(`End Date:          ${today.format("YYYY-MM-DD")}`);
  console.log(`Days Spanned:      ${daysSpanned} days (~${Math.floor(daysSpanned / 365)} years)`);
  console.log(`\nCommit Breakdown:`);
  console.log(`  • Daily commits:   ${numberOfDayCommits} commits on day ${startDate.format("YYYY-MM-DD")} + ${dayOffset} days`);
  console.log(`  • Monthly commits: ${numberOfMonthCommits} commits in week ${startDate.format("YYYY-MM-DD")} + ${weekOffset} weeks`);
  console.log(`  • Yearly commits:  ${numberOfYearCommits} commits spread across the date range`);
  console.log(`\nTotal Commits:     ${totalCommits}`);
  console.log(`Test Mode:         ${testMode ? "ENABLED" : "Disabled"}`);
  console.log("=".repeat(60) + "\n");
}

/**
 * Prompts user for confirmation before running (unless in test mode).
 * @returns {Promise<boolean>} True if user confirms, false otherwise
 */
async function confirmBeforeRunning() {
  if (testMode) {
    console.log("Test mode enabled - skipping confirmation prompt.\n");
    return true;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question("Proceed with creating commits? (y/n) ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}


/**
 * Generates a random, realistic commit message with a date.
 * @param {string} commitDate - The ISO date string for the commit.
 * @returns {string} - A formatted commit message.
 */
function generateMessage(commitDate) {
  const date = new Date(commitDate).toLocaleString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    "TICKET: " +
    casual.building_number +
    " - " +
    casual.random_element(doing) +
    " " +
    casual.random_element(what) +
    ", " +
    casual.first_name +
    " " +
    casual.last_name +
    " " +
    casual.random_element(when) +
    " " +
    date +
    " "
  );
}

// -----------------------------
// Commit Generation Functions
// -----------------------------

/**
 * Generate n commits on a specific day, each at a random time.
 * @param {number} n - Number of commits
 * @param {number} dayOffset - Days offset from startDate
 * @param {moment.Moment} baseDate - Base date to calculate from
 */
async function makeCommitsDay(n, dayOffset, baseDate) {
  // Ensure dayOffset doesn't result in future dates
  const maxDaysFromBase = Math.floor(moment().diff(baseDate, "days"));
  const safeDayOffset = Math.min(dayOffset, maxDaysFromBase);
  
  for (let i = 0; i < n; i++) {
    try {
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const date = moment(baseDate)
        .add(safeDayOffset, "d")
        .set({ hour, minute, second, millisecond: 0 })
        .format();
      const data = { date };
      const message = generateMessage(date);
      console.log(
        `Adding commit for specific (d): ${moment(date).format(
          "YYYY-MM-DD HH:mm:ss"
        )} ${message}`
      );
      if (!testMode) {
        await jsonfile.writeFile(path, data);
        await git.add([path]);
        await git.commit(message, { "--date": date });
      } 
    } catch (err) {
      console.error(`Error during commit #${i + 1} (day):`, err);
    }
  }
  if (!testMode) {
    try {
      await git.push();
    } catch (err) {
      console.error("Error during git push (day):", err);
    }
  }
}

/**
 * Generate n commits in a specific week, each on a random day.
 * @param {number} n - Number of commits
 * @param {number} weekOffset - Week offset from startDate
 * @param {moment.Moment} baseDate - Base date to calculate from
 */
async function makeCommitsMonth(n, weekOffset, baseDate) {
  // Ensure weekOffset doesn't result in future dates
  const maxWeeksFromBase = Math.floor(moment().diff(baseDate, "weeks"));
  const safeWeekOffset = Math.min(weekOffset, maxWeeksFromBase);
  
  for (let i = 0; i < n; i++) {
    try {
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const date = moment(baseDate)
        .add(safeWeekOffset, "w")
        .set({ hour, minute, second, millisecond: 0 })
        .format();
      const data = { date };
      const message = generateMessage(date);
      console.log(
        `Adding commit for specific (m): ${moment(date).format(
          "YYYY-MM-DD HH:mm:ss"
        )} ${message}`
      );
      if (!testMode) {
        await jsonfile.writeFile(path, data);
        await git.add([path]);
        await git.commit(message, { "--date": date });
      } 
    } catch (err) {
      console.error(`Error during commit #${i + 1} (month):`, err);
    }
  }
  if (!testMode) {
    try {
      await git.push();
    } catch (err) {
      console.error("Error during git push (month):", err);
    }
  }
}

/**
 * Generate n commits spread randomly between startDate and today.
 * @param {number} n - Number of commits
 * @param {moment.Moment} baseDate - Base date to calculate from
 */
async function makeCommitsYear(n, baseDate) {
  for (let i = 0; i < n; i++) {
    try {
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const daysFromBase = Math.floor(moment().diff(baseDate, "days"));
      const randomDays = random.int(0, Math.max(daysFromBase, 1));
      const date = moment(baseDate)
        .add(randomDays, "d")
        .set({ hour, minute, second, millisecond: 0 })
        .format();
      const data = { date };
      const message = generateMessage(date);
      console.log(
        `Adding commit for specific (y): ${moment(date).format(
          "YYYY-MM-DD HH:mm:ss"
        )} ${message}`
      );
      if (!testMode) {
        await jsonfile.writeFile(path, data);
        await git.add([path]);
        await git.commit(message, { "--date": date });
      } 
    } catch (err) {
      console.error(`Error during commit #${i + 1} (year):`, err);
    }
  }
  if (!testMode) {
    try {
      await git.push();
    } catch (err) {
      console.error("Error during git push (year):", err);
    }
  }
}

// -----------------------------
// Main Execution
// -----------------------------

/**
 * Main function to run commit generators sequentially.
 * Each function generates and pushes commits for a different pattern.
 */
async function main() {
  try {
    // Step 1: Validate git repository (unless in test mode)
    if (!testMode) {
      await validateGitRepository();
    }

    // Step 2: Validate start date
    validateStartDate();

    // Step 3: Display configuration summary
    displayConfigurationSummary();

    // Step 4: Ask for confirmation (unless in test mode)
    const confirmed = await confirmBeforeRunning();
    if (!confirmed) {
      console.log("Operation cancelled.");
      process.exit(0);
    }

    // Step 5: Run commit generators
    await makeCommitsDay(numberOfDayCommits, dayOffset, startDate);
    await makeCommitsMonth(numberOfMonthCommits, weekOffset, startDate);
    await makeCommitsYear(numberOfYearCommits, startDate);

    console.log("\nCommit generation completed successfully!");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
