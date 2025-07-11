// -----------------------------
// Imports and Dependencies
// -----------------------------
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

// -----------------------------
// Configuration and Constants
// -----------------------------
const path = "./data.json";
const specificmonth = random.int(0, 53); // Random week number for monthly commits

const numberOfDays = 3;    // Number of days to generate commits for
const numberOfMonths = 13; // Number of months to generate commits for
const numberOfYears = 13;  // Number of years to generate commits for

const git = simpleGit();

// -----------------------------
// Commit Generation Functions
// -----------------------------

//TODO: Test random timestamp for hour, minute, second
//TODO: Test each function separately to ensure they work as expected
//TODO: Test that new data.json file works as expected

/**
 * Generate n commits on a specific day, each at a random hour.
 * @param {number} n - Number of commits
 * @param {number} dayOffset - Days offset from today
 */
async function makeCommitsDay(n, dayOffset = 0) {
  for (let i = 0; i < n; i++) {
    const hour = random.int(0, 23);
    const minute = random.int(0, 59);
    const second = random.int(0, 59);
    const date = moment()
      .subtract(1, "y")
      .add(1, "d")
      .add(dayOffset, "d")
      .set({ hour, minute, second, millisecond: 0 })
      .format();
    const data = { date };
    console.log(
      `Adding commit for day: ${moment(date).format("YYYY-MM-DD HH:mm:ss")}`
    );
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(date, undefined, { "--date": date });
  }
  await git.push();
}

/**
 * Generate n commits in a specific week, each on a random day.
 * @param {number} n - Number of commits
 * @param {number} w - Week offset from the start of the year
 */
async function makeCommitsMonth(n, w) {
  for (let i = 0; i < n; i++) {
    const y = random.int(0, 6);
    const date = moment()
      .subtract(1, "y")
      .add(1, "d")
      .add(w, "w")
      .add(y, "d")
      .format();
    const data = { date };
    console.log(
      `Adding commit for date (month): ${moment(date).format("YYYY-MM-DD HH:mm:ss")}`
    );
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(date, undefined, { "--date": date });
  }
  await git.push();
}

/**
 * Generate n commits spread randomly throughout the year.
 * @param {number} n - Number of commits
 */
async function makeCommitsYear(n) {
  for (let i = 0; i < n; i++) {
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const date = moment()
      .subtract(1, "y")
      .add(1, "d")
      .add(x, "w")
      .add(y, "d")
      .format();
    const data = { date };
    console.log(
      `Adding commit for date (year): ${moment(date).format("YYYY-MM-DD HH:mm:ss")}`
    );
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(date, undefined, { "--date": date });
  }
  await git.push();
}

// -----------------------------
// Main Execution
// -----------------------------

/**
 * Main function to run commit generators.
 */
async function main() {
  try {
    await makeCommitsDay(numberOfDays, 0);
    await makeCommitsMonth(numberOfMonths, specificmonth);
    await makeCommitsYear(numberOfYears);
  } catch (err) {
    console.error("Error during commit process:", err);
  }
}

main();
