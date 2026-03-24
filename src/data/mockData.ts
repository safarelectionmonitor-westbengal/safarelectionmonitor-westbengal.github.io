import { ElectionData, Party } from "../types";

export const PARTY_COLORS: Record<Party, string> = {
  AITC: "#059669", // Emerald 600 (Sophisticated Green)
  BJP: "#FF9933", // True Saffron
  INC: "#2563eb", // Blue 600 (Royal Blue)
  CPIM: "#e11d48", // Rose 600 (Deep Crimson/Red)
  ISF: "#7c3aed", // Violet 600 (Deep Purple)
  IND: "#64748b", // Slate 500
  OTH: "#94a3b8", // Slate 400
};

export const electionData: ElectionData = {
  years: {
    2026: {
      year: 2026,
      totalSeats: 294,
      majorityMark: 148,
      partyResults: [
        { party: "AITC", seats: 208, voteShare: 49.2, color: PARTY_COLORS.AITC },
        { party: "BJP", seats: 82, voteShare: 39.5, color: PARTY_COLORS.BJP },
        { party: "INC", seats: 2, voteShare: 3.1, color: PARTY_COLORS.INC },
        { party: "CPIM", seats: 1, voteShare: 5.2, color: PARTY_COLORS.CPIM },
        { party: "OTH", seats: 1, voteShare: 3.0, color: PARTY_COLORS.OTH },
      ],
    },
    2021: {
      year: 2021,
      totalSeats: 294,
      majorityMark: 148,
      partyResults: [
        { party: "AITC", seats: 215, voteShare: 47.9, color: PARTY_COLORS.AITC },
        { party: "BJP", seats: 77, voteShare: 38.1, color: PARTY_COLORS.BJP },
        { party: "INC", seats: 0, voteShare: 2.9, color: PARTY_COLORS.INC },
        { party: "CPIM", seats: 0, voteShare: 4.7, color: PARTY_COLORS.CPIM },
        { party: "OTH", seats: 2, voteShare: 6.4, color: PARTY_COLORS.OTH },
      ],
    },
    2016: {
      year: 2016,
      totalSeats: 294,
      majorityMark: 148,
      partyResults: [
        { party: "AITC", seats: 211, voteShare: 44.9, color: PARTY_COLORS.AITC },
        { party: "INC", seats: 44, voteShare: 12.3, color: PARTY_COLORS.INC },
        { party: "CPIM", seats: 26, voteShare: 19.7, color: PARTY_COLORS.CPIM },
        { party: "BJP", seats: 3, voteShare: 10.2, color: PARTY_COLORS.BJP },
        { party: "OTH", seats: 10, voteShare: 12.9, color: PARTY_COLORS.OTH },
      ],
    },
    2011: {
      year: 2011,
      totalSeats: 294,
      majorityMark: 148,
      partyResults: [
        { party: "AITC", seats: 184, voteShare: 38.9, color: PARTY_COLORS.AITC },
        { party: "CPIM", seats: 40, voteShare: 30.1, color: PARTY_COLORS.CPIM },
        { party: "INC", seats: 42, voteShare: 9.1, color: PARTY_COLORS.INC },
        { party: "BJP", seats: 0, voteShare: 4.1, color: PARTY_COLORS.BJP },
        { party: "OTH", seats: 28, voteShare: 17.8, color: PARTY_COLORS.OTH },
      ],
    },
  },
  constituencies: [
    {
      id: 1,
      name: "Nandigram",
      district: "Purba Medinipur",
      history: {
        2026: {
          winner: "Suvendu Adhikari",
          party: "BJP",
          margin: 12450,
          marginPercent: 5.2,
          totalVotes: 238450,
          candidates: [
            { name: "Suvendu Adhikari", party: "BJP", votes: 124500, percentage: 52.2 },
            { name: "Mamata Banerjee", party: "AITC", votes: 112050, percentage: 47.0 },
            { name: "Meenakshi Mukherjee", party: "CPIM", votes: 1900, percentage: 0.8 },
          ],
        },
        2021: {
          winner: "Suvendu Adhikari",
          party: "BJP",
          margin: 1956,
          marginPercent: 0.8,
          totalVotes: 234560,
          candidates: [
            { name: "Suvendu Adhikari", party: "BJP", votes: 110764, percentage: 47.2 },
            { name: "Mamata Banerjee", party: "AITC", votes: 108808, percentage: 46.4 },
            { name: "Meenakshi Mukherjee", party: "CPIM", votes: 6267, percentage: 2.7 },
          ],
        },
        2016: {
          winner: "Suvendu Adhikari",
          party: "AITC",
          margin: 81230,
          marginPercent: 38.5,
          totalVotes: 210450,
          candidates: [
            { name: "Suvendu Adhikari", party: "AITC", votes: 134623, percentage: 64.0 },
            { name: "Abdul Kabir Sekh", party: "CPIM", votes: 53393, percentage: 25.4 },
            { name: "Bijoy Kumar Kundu", party: "BJP", votes: 10717, percentage: 5.1 },
          ],
        },
        2011: {
          winner: "Firoja Bibi",
          party: "AITC",
          margin: 43640,
          marginPercent: 24.2,
          totalVotes: 180450,
          candidates: [
            { name: "Firoja Bibi", party: "AITC", votes: 103300, percentage: 57.2 },
            { name: "Paramananda Bharati", party: "CPIM", votes: 59660, percentage: 33.1 },
            { name: "Shaktipada Nayak", party: "BJP", votes: 17490, percentage: 9.7 },
          ],
        },
      },
    },
    {
      id: 2,
      name: "Bhabanipur",
      district: "Kolkata",
      history: {
        2026: {
          winner: "Mamata Banerjee",
          party: "AITC",
          margin: 62450,
          marginPercent: 42.1,
          totalVotes: 148450,
          candidates: [
            { name: "Mamata Banerjee", party: "AITC", votes: 102450, percentage: 69.0 },
            { name: "Rudranil Ghosh", party: "BJP", votes: 40000, percentage: 26.9 },
            { name: "Shadab Khan", party: "INC", votes: 6000, percentage: 4.1 },
          ],
        },
        2021: {
          winner: "Mamata Banerjee",
          party: "AITC",
          margin: 58835,
          marginPercent: 40.2,
          totalVotes: 146350,
          candidates: [
            { name: "Mamata Banerjee", party: "AITC", votes: 85263, percentage: 58.3 },
            { name: "Priyanka Tibrewal", party: "BJP", votes: 26428, percentage: 18.1 },
            { name: "Srijib Biswas", party: "CPIM", votes: 4201, percentage: 2.9 },
          ],
        },
        2016: {
          winner: "Mamata Banerjee",
          party: "AITC",
          margin: 25301,
          marginPercent: 18.5,
          totalVotes: 136450,
          candidates: [
            { name: "Mamata Banerjee", party: "AITC", votes: 65520, percentage: 48.0 },
            { name: "Deepa Dasmunsi", party: "INC", votes: 40219, percentage: 29.5 },
            { name: "Chandra Kumar Bose", party: "BJP", votes: 26299, percentage: 19.3 },
          ],
        },
        2011: {
          winner: "Mamata Banerjee",
          party: "AITC",
          margin: 54213,
          marginPercent: 45.2,
          totalVotes: 120450,
          candidates: [
            { name: "Mamata Banerjee", party: "AITC", votes: 84360, percentage: 70.0 },
            { name: "Nandini Mukherjee", party: "CPIM", votes: 30147, percentage: 25.0 },
            { name: "Ajit Kumar Ghosh", party: "BJP", votes: 5943, percentage: 5.0 },
          ],
        },
      },
    },
    {
      id: 3,
      name: "Jadavpur",
      district: "South 24 Parganas",
      history: {
        2026: {
          winner: "Debabrata Majumdar",
          party: "AITC",
          margin: 42150,
          marginPercent: 18.2,
          totalVotes: 231450,
          candidates: [
            { name: "Debabrata Majumdar", party: "AITC", votes: 125450, percentage: 54.2 },
            { name: "Sujan Chakraborty", party: "CPIM", votes: 83300, percentage: 36.0 },
            { name: "Ranjan Vaidya", party: "BJP", votes: 22700, percentage: 9.8 },
          ],
        },
        2021: {
          winner: "Debabrata Majumdar",
          party: "AITC",
          margin: 38869,
          marginPercent: 17.1,
          totalVotes: 227450,
          candidates: [
            { name: "Debabrata Majumdar", party: "AITC", votes: 116693, percentage: 51.3 },
            { name: "Sujan Chakraborty", party: "CPIM", votes: 77824, percentage: 34.2 },
            { name: "Ranjan Vaidya", party: "BJP", votes: 32903, percentage: 14.5 },
          ],
        },
        2016: {
          winner: "Sujan Chakraborty",
          party: "CPIM",
          margin: 14942,
          marginPercent: 7.2,
          totalVotes: 207450,
          candidates: [
            { name: "Sujan Chakraborty", party: "CPIM", votes: 98977, percentage: 47.7 },
            { name: "Manish Gupta", party: "AITC", votes: 84035, percentage: 40.5 },
            { name: "Mohit Ray", party: "BJP", votes: 24438, percentage: 11.8 },
          ],
        },
        2011: {
          winner: "Manish Gupta",
          party: "AITC",
          margin: 16684,
          marginPercent: 8.9,
          totalVotes: 187450,
          candidates: [
            { name: "Manish Gupta", party: "AITC", votes: 103972, percentage: 55.5 },
            { name: "Buddhadeb Bhattacharjee", party: "CPIM", votes: 87288, percentage: 46.6 },
          ],
        },
      },
    },
  ],
};

// Generate more constituencies to reach 294
for (let i = 4; i <= 294; i++) {
  const name = `Constituency ${i}`;
  const district = ["North 24 Parganas", "South 24 Parganas", "Nadia", "Murshidabad", "Malda", "Howrah", "Hooghly"][i % 7];
  
  const history: Record<number, any> = {};
  [2011, 2016, 2021, 2026].forEach(year => {
    const parties: Party[] = ["AITC", "BJP", "CPIM", "INC"];
    const winnerParty = parties[Math.floor(Math.random() * parties.length)];
    const totalVotes = 150000 + Math.floor(Math.random() * 100000);
    const winnerVotes = Math.floor(totalVotes * (0.4 + Math.random() * 0.2));
    const runnerUpVotes = Math.floor(totalVotes * (0.3 + Math.random() * 0.1));
    
    history[year] = {
      winner: `Candidate ${i}-${year}`,
      party: winnerParty,
      margin: winnerVotes - runnerUpVotes,
      marginPercent: ((winnerVotes - runnerUpVotes) / totalVotes) * 100,
      totalVotes,
      candidates: [
        { name: `Candidate ${i}-${year}`, party: winnerParty, votes: winnerVotes, percentage: (winnerVotes / totalVotes) * 100 },
        { name: `Runner Up ${i}-${year}`, party: parties.find(p => p !== winnerParty) || "OTH", votes: runnerUpVotes, percentage: (runnerUpVotes / totalVotes) * 100 },
      ]
    };
  });

  electionData.constituencies.push({
    id: i,
    name,
    district,
    history
  });
}
