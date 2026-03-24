import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Importing your existing constituencies
import { WEST_BENGAL_CONSTITUENCIES } from './src/data/constituencies.ts';

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PARTIES = ['AITC', 'BJP', 'INC', 'CPIM', 'OTH'];
const CANDIDATE_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Saanvi', 'Aanya', 'Priya', 'Riya'];

// Helper to get random number between min and max
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to pick a random item from an array
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateMockCSV(year) {
  const header = ['Constituency', 'No', 'Name', 'Gender', 'Category', 'Party', 'General Vote', 'Postal Vote', 'Total', 'PctVotes'];
  const lines = [header.join(',')];

  WEST_BENGAL_CONSTITUENCIES.forEach(constituency => {
    // Generate 3 to 5 candidates per constituency
    const numCandidates = getRandomInt(3, 5);
    const totalVoters = getRandomInt(150000, 250000);
    
    let votesRemaining = totalVoters;
    const candidatesData = [];

    for (let i = 1; i <= numCandidates; i++) {
      // For the last candidate, give them whatever votes are left. Otherwise, give a random chunk.
      let votes = i === numCandidates ? votesRemaining : getRandomInt(1000, Math.floor(votesRemaining / 2));
      votesRemaining -= votes;

      const postal = getRandomInt(100, 1000);
      const general = votes - postal > 0 ? votes - postal : votes;

      candidatesData.push({
        Constituency: constituency.name,
        No: i,
        Name: `${getRandomItem(CANDIDATE_NAMES)} Chatterjee`,
        Gender: getRandomItem(['M', 'F']),
        Category: getRandomItem(['GEN', 'SC', 'ST']),
        Party: i === 1 ? PARTIES[0] : i === 2 ? PARTIES[1] : getRandomItem(PARTIES), // Ensure major parties are represented
        GeneralVote: general,
        PostalVote: postal,
        Total: votes
      });
    }

    // Calculate percentages
    candidatesData.forEach(c => {
      const pct = ((c.Total / totalVoters) * 100).toFixed(2);
      lines.push(`${c.Constituency},${c.No},${c.Name},${c.Gender},${c.Category},${c.Party},${c.GeneralVote},${c.PostalVote},${c.Total},${pct}`);
    });
  });

  // Ensure directory exists
  const dataDir = path.join(__dirname, 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write to CSV
  const filePath = path.join(dataDir, `${year}.csv`);
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`Successfully generated mock data for ${year} at ${filePath}`);
}

// Generate mock data for the years your app uses
generateMockCSV(2021);
generateMockCSV(2016);
