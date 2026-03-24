const fs = require('fs');
const path = require('path');

// Ensure the path points to the correct public/data directory
const dataDir = path.join(__dirname, 'public', 'data');

// Check if directory exists before reading
if (!fs.existsSync(dataDir)) {
  console.error(`Directory not found: ${dataDir}`);
  process.exit(1);
}

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  
  if (lines.length === 0) return;
  
  // Check existing header to avoid double-processing
  const currentHeader = lines[0].split(',');
  if (currentHeader.includes('Constituency')) {
    console.log(`File ${file} already updated or already in new format.`);
    return;
  }
  
  // Define New Header format required by App.tsx
  const newHeader = ['Constituency', 'No', 'Name', 'Gender', 'Category', 'Party', 'General Vote', 'Postal Vote', 'Total', 'PctVotes'];
  const newLines = [newHeader.join(',')];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    // Ensure the row has enough columns based on the old header length
    if (cols.length < 13) continue; 
    
    // Map old columns to new columns based on the mapping in the original script
    const constituency = cols[2];     // constituency_name
    const no           = cols[8];     // no
    const name         = cols[4];     // candidate_name
    const gender       = cols[9];     // gender
    const category     = cols[10];    // category
    const party        = cols[5];     // party
    const generalVote  = cols[11];    // general_votes
    const postalVote   = cols[12];    // postal_votes
    const total        = cols[6];     // votes (used as total for that candidate)
    const totalVotes   = parseInt(cols[7]); // total_votes (denominator for % calculation)
    
    // Calculate PctVotes to ensure compatibility with App.tsx's parseFloat logic
    const pctVotes = totalVotes > 0 
      ? ((parseInt(total) / totalVotes) * 100).toFixed(2) 
      : "0.00";

    const newCols = [constituency, no, name, gender, category, party, generalVote, postalVote, total, pctVotes];
    newLines.push(newCols.join(','));
  }
  
  fs.writeFileSync(filePath, newLines.join('\n'));
  console.log(`Successfully updated ${file}`);
});
