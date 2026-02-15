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
const numberOfDayCommits = getArg(0, parseInt(process.env.DAY_COMMITS) || 7);
const numberOfMonthCommits = getArg(1, parseInt(process.env.MONTH_COMMITS) || 14);
const numberOfYearCommits = getArg(2, parseInt(process.env.YEAR_COMMITS) || 21);
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
// Helper Functions
// -----------------------------

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
  if (testMode) {
    console.log("TEST MODE ENABLED - No git operations will be performed");
  }
  try {
    await makeCommitsDay(numberOfDayCommits, dayOffset, startDate);
    await makeCommitsMonth(numberOfMonthCommits, weekOffset, startDate);
    await makeCommitsYear(numberOfYearCommits, startDate);
  } catch (err) {
    console.error("Error during commit process:", err);
  }
}

main();
