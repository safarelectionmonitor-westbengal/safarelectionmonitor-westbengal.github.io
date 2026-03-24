const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  if (lines.length === 0) return;
  
  const header = lines[0].split(',');
  if (header.includes('Constituency')) {
    console.log(`File ${file} already updated.`);
    return;
  }
  
  // Old header: year,constituency_id,constituency_name,district,candidate_name,party,votes,total_votes,no,gender,category,general_votes,postal_votes
  // New header: Constituency,No,Name,Gender,Category,Party,General Vote,Postal Vote,Total,PctVotes
  const newHeader = ['Constituency', 'No', 'Name', 'Gender', 'Category', 'Party', 'General Vote', 'Postal Vote', 'Total', 'PctVotes'];
  const newLines = [newHeader.join(',')];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < header.length) continue;
    
    const constituency = cols[2];
    const no = cols[8];
    const name = cols[4];
    const gender = cols[9];
    const category = cols[10];
    const party = cols[5];
    const generalVote = cols[11];
    const postalVote = cols[12];
    const total = cols[6];
    const totalVotes = parseInt(cols[7]);
    const pctVotes = ((parseInt(total) / totalVotes) * 100).toFixed(2);
    
    const newCols = [constituency, no, name, gender, category, party, generalVote, postalVote, total, pctVotes];
    newLines.push(newCols.join(','));
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log(`Updated ${file}`);
});
