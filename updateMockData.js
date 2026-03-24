import fs from 'fs';

const filePath = 'src/data/mockData.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace { name: "...", party: "...", votes: ..., percentage: ... }
// with the new structure.

content = content.replace(/\{\s*name:\s*([^,]+),\s*party:\s*([^,]+),\s*votes:\s*([^,]+),\s*percentage:\s*([^}]+)\}/g, (match, name, party, votes, percentage) => {
  const totalVotes = parseInt(votes.trim());
  const postalVotes = Math.floor(totalVotes * 0.01);
  const generalVotes = totalVotes - postalVotes;
  const gender = name.includes('Mamata') || name.includes('Meenakshi') || name.includes('Firoja') || name.includes('Deepa') || name.includes('Nandini') || name.includes('Priyanka') ? '"F"' : '"M"';
  const category = '"GEN"';
  // We'll assign a random 'no' later, or just 1 for now. We can map over them in App.tsx to get the index.
  // Wait, the interface requires `no`.
  return `{ no: 1, name: ${name}, gender: ${gender}, category: ${category}, party: ${party}, generalVotes: ${generalVotes}, postalVotes: ${postalVotes}, totalVotes: ${votes}, percentage: ${percentage} }`;
});

// Also need to update the generator loop at the bottom
content = content.replace(/candidates:\s*\[\s*\{\s*name:\s*([^,]+),\s*party:\s*([^,]+),\s*votes:\s*([^,]+),\s*percentage:\s*([^}]+)\},\s*\{\s*name:\s*([^,]+),\s*party:\s*([^,]+),\s*votes:\s*([^,]+),\s*percentage:\s*([^}]+)\},\s*\]/g, (match, n1, p1, v1, perc1, n2, p2, v2, perc2) => {
  return `candidates: [
        { no: 1, name: ${n1}, gender: "M", category: "GEN", party: ${p1}, generalVotes: Math.floor(${v1} * 0.99), postalVotes: Math.floor(${v1} * 0.01), totalVotes: ${v1}, percentage: ${perc1} },
        { no: 2, name: ${n2}, gender: "M", category: "GEN", party: ${p2}, generalVotes: Math.floor(${v2} * 0.99), postalVotes: Math.floor(${v2} * 0.01), totalVotes: ${v2}, percentage: ${perc2} },
      ]`;
});

fs.writeFileSync(filePath, content);
console.log("Updated mockData.ts");
