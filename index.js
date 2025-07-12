// ===================================================
// GitHub Contribution Automation Script
// ===================================================

// -----------------------------
// Imports and Dependencies
// -----------------------------
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import casual from "casual";

// -----------------------------
// Parse Command-Line Arguments
// -----------------------------
const args = process.argv.slice(2);

function getArg(index, fallback) {
  const val = args[index];
  return val !== undefined && !isNaN(Number(val)) ? Number(val) : fallback;
}

// Allow user to override these via CLI: node index.js [dayCommits] [monthCommits] [yearCommits] [dayOffset] [weekOffset]
const numberOfDayCommits = getArg(0, 3);
const numberOfMonthCommits = getArg(1, 3);
const numberOfYearCommits = getArg(2, 3);
const dayOffset = getArg(3, random.int(0, 364));
const weekOffset = getArg(4, random.int(0, 51));

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
 * @param {number} dayOffset - Days offset from today
 */
async function makeCommitsDay(n, dayOffset) {
  for (let i = 0; i < n; i++) {
    try {
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const date = moment()
        .subtract(dayOffset, "d")
        .set({ hour, minute, second, millisecond: 0 })
        .format();
      const data = { date };
      const message = generateMessage(date);
      console.log(
        `Adding commit for specific (d): ${moment(date).format(
          "YYYY-MM-DD HH:mm:ss"
        )} ${message}`
      );
      await jsonfile.writeFile(path, data);
      await git.add([path]);
      await git.commit(message, { "--date": date });
    } catch (err) {
      console.error(`Error during commit #${i + 1} (day):`, err);
    }
  }
  try {
    await git.push();
  } catch (err) {
    console.error("Error during git push (day):", err);
  }
}

/**
 * Generate n commits in a specific week, each on a random day.
 * @param {number} n - Number of commits
 * @param {number} weekOffset - Week offset from the start of the year
 */
async function makeCommitsMonth(n, weekOffset) {
  for (let i = 0; i < n; i++) {
    try {
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const date = moment()
        .subtract(weekOffset, "w")
        .set({ hour, minute, second, millisecond: 0 })
        .format();
      const data = { date };
      const message = generateMessage(date);
      console.log(
        `Adding commit for specific (m): ${moment(date).format(
          "YYYY-MM-DD HH:mm:ss"
        )} ${message}`
      );
      await jsonfile.writeFile(path, data);
      await git.add([path]);
      await git.commit(message, { "--date": date });
    } catch (err) {
      console.error(`Error during commit #${i + 1} (month):`, err);
    }
  }
  try {
    await git.push();
  } catch (err) {
    console.error("Error during git push (month):", err);
  }
}

/**
 * Generate n commits spread randomly throughout the year.
 * @param {number} n - Number of commits
 */
async function makeCommitsYear(n) {
  for (let i = 0; i < n; i++) {
    try {
      const hour = random.int(0, 23);
      const minute = random.int(0, 59);
      const second = random.int(0, 59);
      const weekOffset = random.int(0, 54); // x on GitHub graph is 53 weeks
      const dayOffset = random.int(0, 6); // y on GitHub graph is 7 days
      const date = moment()
        .subtract(weekOffset, "w")
        .add(dayOffset, "d")
        .set({ hour, minute, second, millisecond: 0 })
        .format();
      const data = { date };
      const message = generateMessage(date);
      console.log(
        `Adding commit for specific (y): ${moment(date).format(
          "YYYY-MM-DD HH:mm:ss"
        )} ${message}`
      );
      await jsonfile.writeFile(path, data);
      await git.add([path]);
      await git.commit(message, { "--date": date });
    } catch (err) {
      console.error(`Error during commit #${i + 1} (year):`, err);
    }
  }
  try {
    await git.push();
  } catch (err) {
    console.error("Error during git push (year):", err);
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
    await makeCommitsDay(numberOfDayCommits, dayOffset);
    await makeCommitsMonth(numberOfMonthCommits, weekOffset);
    await makeCommitsYear(numberOfYearCommits);
  } catch (err) {
    console.error("Error during commit process:", err);
  }
}

main();
