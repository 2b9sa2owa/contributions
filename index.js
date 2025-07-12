// -----------------------------
// Imports and Dependencies
// -----------------------------
import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import casual from 'casual';

// -----------------------------
// Configuration and Constants
// -----------------------------
const path = "./data.json";

const numberOfDayCommits = 3;    // Number of days to generate commits for
const numberOfMonthCommits = 3; // Number of months to generate commits for
const numberOfYearCommits = 3;  // Number of years to generate commits for

const dayOffset = random.int(0, 364); // Random offset for day commits, Days in a year - 1
const weekOffset = random.int(0, 51); // Random offset for week commits, Weeks in a year - 1

const git = simpleGit();

const doing = [
  'refreshing', 'upgrading', 'revising', 'modifying', 'improving', 'renewing',
  'altering', 'amending', 'enhancing', 'modernizing', 'adjusting', 'reworking', 'refining', 'overhauling'
];
const what = [
  'program', 'script', 'markup', 'software', 'application', 'algorithm', 'routine', 'function',
  'command', 'syntax', 'procedure', 'module', 'block', 'formula'
];
const when = [
  'upon', 'onto', 'over', 'atop', 'against', 'about', 'concerning', 'on', 'during', 'throughout'
];

// Returns a new random message string each time it's called
function generateMessage(commitDate) {
  const date = new Date(commitDate).toLocaleString('en-us', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return (
    'TICKET: ' + casual.building_number + ' - ' +
    casual.random_element(doing) + ' ' +
    casual.random_element(what) + ', ' +
    casual.first_name + ' ' +
    casual.last_name + ' ' +
    casual.random_element(when) + ' ' +
    date + ' ' 
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
      `Adding commit for specific (d): ${moment(date).format("YYYY-MM-DD HH:mm:ss")} ${message}`
    );
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(message, { "--date": date });
  }
  await git.push();
}

/**
 * Generate n commits in a specific week, each on a random day.
 * @param {number} n - Number of commits
 * @param {number} w - Week offset from the start of the year
 */
async function makeCommitsMonth(n, weekOffset) {
  for (let i = 0; i < n; i++) {
    const hour = random.int(0, 23);
    const minute = random.int(0, 59);
    const second = random.int(0, 59);
    const y = random.int(0, 6);
    const date = moment()
      .subtract(weekOffset, "w")
      .set({ hour, minute, second, millisecond: 0 })
      .format();
    const data = { date };
    const message = generateMessage(date);
    console.log(
      `Adding commit for specific (m): ${moment(date).format("YYYY-MM-DD HH:mm:ss")} ${message}`
    );
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(message, { "--date": date });
  }
  await git.push();
}

/**
 * Generate n commits spread randomly throughout the year.
 * @param {number} n - Number of commits
 */
async function makeCommitsYear(n) {
  for (let i = 0; i < n; i++) {
    const hour = random.int(0, 23);
    const minute = random.int(0, 59);
    const second = random.int(0, 59);
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const date = moment()
      .subtract(x, "w")
      .add(y, "d")
      .set({ hour, minute, second, millisecond: 0 })
      .format();
    const data = { date };
    const message = generateMessage(date);
    console.log(
      `Adding commit for specific (y): ${moment(date).format("YYYY-MM-DD HH:mm:ss")} ${message}`
    );
    await jsonfile.writeFile(path, data);
    await git.add([path]);
    await git.commit(message, { "--date": date });
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
    await makeCommitsDay(numberOfDayCommits, dayOffset);
    await makeCommitsMonth(numberOfMonthCommits, weekOffset);
    await makeCommitsYear(numberOfYearCommits);
  } catch (err) {
    console.error("Error during commit process:", err);
  }
}

main();
