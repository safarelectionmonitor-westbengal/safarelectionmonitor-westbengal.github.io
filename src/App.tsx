import React, { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  LayoutDashboard, 
  Search, 
  ChevronLeft, 
  TrendingUp, 
  Users, 
  Award, 
  MapPin, 
  ArrowRight,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Loader2
} from 'lucide-react';
import { PARTY_COLORS } from './data/mockData';
import { Party, Constituency, CandidateResult, ElectionData, ElectionYearSummary, ConstituencyYearData } from './types';
import { SVGLineChart } from './components/SVGLineChart';
import { WEST_BENGAL_CONSTITUENCIES } from './data/constituencies';

const YEARS = [2026, 2021, 2016, 2011];
const PARTIES: Party[] = ['AITC', 'BJP', 'INC', 'CPIM', 'OTH'];

interface CSVRow {
  Constituency: string;
  No: string;
  Name: string;
  Gender: string;
  Category: string;
  Party: string;
  'General Vote': string;
  'Postal Vote': string;
  Total: string;
  PctVotes: string;
}

export default function App() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeParties, setActiveParties] = useState<Party[]>(['AITC', 'BJP', 'INC', 'CPIM']);
  const [view, setView] = useState<'summary' | 'detail'>('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [electionData, setElectionData] = useState<ElectionData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const allData: ElectionData = {
          years: {},
          constituencies: []
        };

        const constituencyMap = new Map<number, Constituency>();

        // Initialize with all 294 constituencies from our master list
        WEST_BENGAL_CONSTITUENCIES.forEach(c => {
          constituencyMap.set(c.id, {
            id: c.id,
            name: c.name,
            district: c.district,
            history: {}
          });
        });

        // We'll try to load CSVs for each year
        const yearsToLoad = [2026, 2021, 2016, 2011];
        
        for (const year of yearsToLoad) {
          try {
            const response = await fetch(`./data/${year}.csv`);
            if (!response.ok) continue;
            
            const csvText = await response.text();
            const parsed = Papa.parse<CSVRow>(csvText, { header: true, skipEmptyLines: true });
            
            const yearSummary: ElectionYearSummary = {
              year,
              totalSeats: 294,
              majorityMark: 148,
              partyResults: []
            };

            const partyVotes: Record<string, number> = {};
            const partySeats: Record<string, number> = {};
            let totalYearVotes = 0;

            // Group by constituency
            const constituencyGroups: Record<string, CSVRow[]> = {};
            parsed.data.forEach(row => {
              const name = row.Constituency;
              if (!name) return;
              if (!constituencyGroups[name]) constituencyGroups[name] = [];
              constituencyGroups[name].push(row);
            });

            Object.entries(constituencyGroups).forEach(([name, rows]) => {
              const matchedConstituency = WEST_BENGAL_CONSTITUENCIES.find(
                c => c.name.toLowerCase() === name.toLowerCase()
              );
              
              if (!matchedConstituency) {
                console.warn(`Constituency ${name} not found in master list`);
                return;
              }
              
              const id = matchedConstituency.id;
              const sortedCandidates = rows.sort((a, b) => parseInt(b.Total) - parseInt(a.Total));
              const winner = sortedCandidates[0];
              const runnerUp = sortedCandidates[1];
              
              const totalVotes = rows.reduce((sum, r) => sum + parseInt(r.Total || '0'), 0);
              
              totalYearVotes += totalVotes;
              
              // Update constituency map
              if (!constituencyMap.has(id)) {
                constituencyMap.set(id, {
                  id,
                  name: matchedConstituency.name,
                  district: matchedConstituency.district,
                  history: {}
                });
              }

              const constituency = constituencyMap.get(id)!;
              constituency.history[year] = {
                winner: winner.Name,
                party: winner.Party as Party,
                margin: parseInt(winner.Total) - (runnerUp ? parseInt(runnerUp.Total) : 0),
                marginPercent: ((parseInt(winner.Total) - (runnerUp ? parseInt(runnerUp.Total) : 0)) / totalVotes) * 100,
                totalVotes,
                candidates: sortedCandidates.map((c, index) => ({
                  no: c.No ? parseInt(c.No) : index + 1,
                  name: c.Name,
                  gender: c.Gender || 'M',
                  category: c.Category || 'GEN',
                  party: c.Party as Party,
                  generalVotes: c['General Vote'] ? parseInt(c['General Vote']) : parseInt(c.Total),
                  postalVotes: c['Postal Vote'] ? parseInt(c['Postal Vote']) : 0,
                  totalVotes: parseInt(c.Total),
                  percentage: parseFloat(c.PctVotes) || ((parseInt(c.Total) / totalVotes) * 100)
                }))
              };

              // Aggregate party stats
              const winnerParty = winner.Party;
              partySeats[winnerParty] = (partySeats[winnerParty] || 0) + 1;
              
              rows.forEach(r => {
                partyVotes[r.Party] = (partyVotes[r.Party] || 0) + parseInt(r.Total);
              });
            });

            // Build year summary
            yearSummary.partyResults = Object.entries(partyVotes).map(([party, votes]) => ({
              party: party as Party,
              seats: partySeats[party] || 0,
              voteShare: (votes / totalYearVotes) * 100,
              color: PARTY_COLORS[party as Party] || PARTY_COLORS.OTH
            })).sort((a, b) => b.seats - a.seats);

            allData.years[year] = yearSummary;
          } catch (e) {
            console.warn(`Failed to load data for year ${year}`, e);
          }
        }

        const loadedYears = Object.keys(allData.years).map(Number).sort((a, b) => b - a);
        if (loadedYears.length > 0 && !loadedYears.includes(selectedYear)) {
          setSelectedYear(loadedYears[0]);
        }

        setElectionData(allData);
      } catch (error) {
        setElectionData(allData);
      } catch (error) {
        console.error("Error loading election data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtered constituencies for the table
  const filteredConstituencies = useMemo(() => {
    if (!electionData) return [];
    return electionData.constituencies.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, electionData]);

  const selectedConstituency = useMemo(() => {
    if (!electionData) return null;
    return electionData.constituencies.find(c => c.id === selectedID);
  }, [selectedID, electionData]);

  const handleRowClick = (id: number) => {
    setSelectedID(id);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleParty = (party: Party) => {
    setActiveParties(prev => 
      prev.includes(party) ? prev.filter(p => p !== party) : [...prev, party]
    );
  };

  // Prepare data for the statewide chart
  const statewideChartData = useMemo(() => {
    if (!electionData) return {} as any;
    const data: Record<Party, { year: number; value: number }[]> = {} as any;
    PARTIES.forEach(party => {
      data[party] = Object.keys(electionData.years).map(yearStr => {
        const year = parseInt(yearStr);
        return {
          year,
          value: electionData.years[year].partyResults.find(r => r.party === party)?.voteShare || 0
        };
      });
    });
    return data;
  }, [electionData]);

  // Prepare data for the local chart
  const localChartData = useMemo(() => {
    if (!selectedConstituency || !electionData) return {} as any;
    const data: Record<Party, { year: number; value: number }[]> = {} as any;
    PARTIES.forEach(party => {
      data[party] = Object.keys(electionData.years).map(yearStr => {
        const year = parseInt(yearStr);
        const yearData = selectedConstituency.history[year];
        const candidate = yearData?.candidates.find(c => c.party === party);
        return {
          year,
          value: candidate?.percentage || 0
        };
      });
    });
    return data;
  }, [selectedConstituency, electionData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Loading Election Data...</p>
        </div>
      </div>
    );
  }

  if (!electionData) return null;

  const currentYearSummary = electionData.years[selectedYear];

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Global Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm shrink-0">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              SAFAR: <span className="text-slate-500 block sm:inline">West Bengal Assembly Election Tracker</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-xl mx-auto md:mx-0 min-w-max">
              {Object.keys(electionData.years).sort((a,b) => parseInt(b) - parseInt(a)).map(yearStr => {
                const year = parseInt(yearStr);
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      selectedYear === year 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-6 md:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {view === 'summary' ? (
          <>
            {/* Summary View - Left Content */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Assembly Summary Box */}
              <section className="modern-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 md:mb-8 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="modern-label mb-1 md:mb-2">Legislative Assembly</h2>
                    <div className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">{selectedYear} Results</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl md:text-4xl font-bold text-slate-900 font-mono">294</div>
                    <div className="modern-label mt-1">Total Seats</div>
                  </div>
                </div>

                {/* Stacked Progress Bar */}
                <div className="relative h-8 md:h-12 w-full bg-slate-100 rounded-full overflow-hidden flex mb-6 md:mb-8 shadow-inner">
                  {currentYearSummary.partyResults
                    .sort((a, b) => b.seats - a.seats)
                    .map(result => (
                      <div 
                        key={result.party}
                        style={{ 
                          width: `${(result.seats / 294) * 100}%`,
                          backgroundColor: result.color
                        }}
                        className="h-full transition-all duration-1000 border-r border-white/20 last:border-0"
                      />
                    ))
                  }
                  {/* Majority Marker */}
                  <div 
                    className="absolute top-0 bottom-0 w-0 border-l-2 border-slate-900 z-10"
                    style={{ left: `${(148 / 294) * 100}%` }}
                  >
                    <div className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-md uppercase tracking-wider whitespace-nowrap shadow-sm">
                      Majority (148)
                    </div>
                  </div>
                </div>

                {/* Party Seat Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                  {currentYearSummary.partyResults
                    .sort((a, b) => b.seats - a.seats)
                    .map(result => (
                      <div key={result.party} className="p-3 md:p-5 rounded-xl border border-slate-100 bg-slate-50 hover:shadow-sm hover:border-slate-200 transition-all duration-200">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: result.color }} />
                          <span className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-wider truncate">{result.party}</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-slate-900">{result.seats}</div>
                      </div>
                    ))
                  }
                </div>
              </section>

              {/* Constituency Explorer */}
              <section className="modern-card !p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
                  <h3 className="text-xl font-bold text-slate-900">Constituency Explorer</h3>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search name or district..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[600px]">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-20">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">S.No</th>
                        <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Constituency & District</th>
                        <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Winner & Party</th>
                        <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Win %</th>
                        <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-right">Win Margin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredConstituencies.map((c, idx) => {
                        const yearData = c.history[selectedYear];
                        const winnerCandidate = yearData?.candidates.find(cand => cand.name === yearData.winner);
                        return (
                          <tr 
                            key={c.id} 
                            onClick={() => handleRowClick(c.id)}
                            className="group hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-slate-400">{idx + 1}</td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900 group-hover:text-slate-600 transition-colors">{c.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{c.district}</div>
                            </td>
                            <td className="px-6 py-4">
                              {yearData ? (
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                                    style={{ backgroundColor: PARTY_COLORS[yearData.party] }}
                                  >
                                    {yearData.party}
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">{yearData.winner}</span>
                                </div>
                              ) : (
                                <span className="text-xs font-medium text-slate-400 italic">Data Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {yearData && winnerCandidate ? (
                                <div className="font-semibold text-slate-900">{winnerCandidate.percentage.toFixed(1)}%</div>
                              ) : (
                                <span className="text-sm text-slate-300">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {yearData ? (
                                <>
                                  <div className="font-semibold text-slate-900">{yearData.margin.toLocaleString()}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">{yearData.marginPercent.toFixed(1)}% Lead</div>
                                </>
                              ) : (
                                <span className="text-sm text-slate-300">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Summary View - Right Sidebar */}
            <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '0.1s' }}>
              <div className="sticky top-24 modern-card">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                  <TrendingUp className="text-slate-900 w-5 h-5" />
                  <h3 className="text-lg font-bold text-slate-900">Vote Trajectory</h3>
                </div>

                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <SVGLineChart 
                    data={statewideChartData} 
                    activeParties={activeParties}
                    width={350}
                    height={220}
                    showLabels={true}
                  />
                </div>

                <div className="space-y-3">
                  <div className="modern-label mb-4">Toggle Parties</div>
                  {PARTIES.map(party => (
                    <button
                      key={party}
                      onClick={() => toggleParty(party)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                        activeParties.includes(party)
                          ? 'bg-white border-slate-200 shadow-sm'
                          : 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: PARTY_COLORS[party] }} />
                        <span className="text-sm font-semibold text-slate-700">{party}</span>
                      </div>
                      {activeParties.includes(party) && <ArrowRight className="text-slate-400 w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Detail View - Left Content */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 border-b border-slate-200 pb-4 sm:pb-6">
                <button 
                  onClick={() => setView('summary')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Dashboard
                </button>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                  {Object.keys(electionData.years).sort((a,b) => parseInt(b) - parseInt(a)).map(yearStr => {
                    const year = parseInt(yearStr);
                    return (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex-1 sm:flex-none text-center ${
                          selectedYear === year 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 shadow-sm border border-slate-200 shrink-0">
                  <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-500 mb-0.5 sm:mb-1">{selectedConstituency?.district}</h2>
                  <div className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">{selectedConstituency?.name}</div>
                </div>
              </div>

              {/* Key Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {selectedConstituency && selectedConstituency.history[selectedYear] ? (
                  <>
                    <div className="modern-card relative overflow-hidden group bg-slate-900 border-slate-800 sm:col-span-2 md:col-span-1">
                      <Award className="absolute -right-4 -bottom-4 w-24 h-24 sm:w-32 sm:h-32 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-4">Winner</div>
                      <div className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight">{selectedConstituency.history[selectedYear].winner}</div>
                      <div 
                        className="inline-block px-2.5 sm:px-3 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-sm"
                        style={{ backgroundColor: PARTY_COLORS[selectedConstituency.history[selectedYear].party || 'OTH'] }}
                      >
                        {selectedConstituency.history[selectedYear].party}
                      </div>
                    </div>

                    <div className="modern-card">
                      <div className="modern-label mb-2 sm:mb-4">Win Margin %</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{selectedConstituency.history[selectedYear].marginPercent.toFixed(2)}%</div>
                      <div className="text-xs sm:text-sm font-medium text-slate-500">+{selectedConstituency.history[selectedYear].margin.toLocaleString()} votes</div>
                    </div>

                    <div className="modern-card">
                      <div className="modern-label mb-2 sm:mb-4">Votes Polled</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{selectedConstituency.history[selectedYear].totalVotes.toLocaleString()}</div>
                      <div className="text-xs sm:text-sm font-medium text-slate-500">Total valid votes</div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-1 sm:col-span-2 md:col-span-3 p-8 sm:p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                    <p className="text-sm font-medium text-slate-500">No data available for {selectedYear}</p>
                  </div>
                )}
              </div>

              {/* Candidate Comparison Table */}
              {selectedConstituency && selectedConstituency.history[selectedYear] && (
                <section className="modern-card !p-0 overflow-hidden mt-8">
                  <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Candidate Comparison</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs sm:text-sm text-slate-500 font-semibold uppercase tracking-wider">
                          <th className="p-3 sm:p-4 whitespace-nowrap">Constituency</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">No</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">Name</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">Gender</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">Category</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap">Party</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap text-right">General Votes</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap text-right">Postal Votes</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap text-right">Total Votes</th>
                          <th className="p-3 sm:p-4 whitespace-nowrap text-right">%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedConstituency.history[selectedYear].candidates
                          .sort((a, b) => b.totalVotes - a.totalVotes)
                          .map((candidate, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 sm:p-4 text-sm text-slate-600">{selectedConstituency.name}</td>
                              <td className="p-3 sm:p-4 text-sm text-slate-600">{candidate.no}</td>
                              <td className="p-3 sm:p-4 text-sm font-bold text-slate-900">{candidate.name}</td>
                              <td className="p-3 sm:p-4 text-sm text-slate-600">{candidate.gender}</td>
                              <td className="p-3 sm:p-4 text-sm text-slate-600">{candidate.category}</td>
                              <td className="p-3 sm:p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: PARTY_COLORS[candidate.party] || PARTY_COLORS.OTH }} />
                                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{candidate.party}</span>
                                </div>
                              </td>
                              <td className="p-3 sm:p-4 text-sm text-slate-600 text-right font-mono">{candidate.generalVotes.toLocaleString()}</td>
                              <td className="p-3 sm:p-4 text-sm text-slate-600 text-right font-mono">{candidate.postalVotes.toLocaleString()}</td>
                              <td className="p-3 sm:p-4 text-sm font-bold text-slate-900 text-right font-mono">{candidate.totalVotes.toLocaleString()}</td>
                              <td className="p-3 sm:p-4 text-sm font-bold text-slate-900 text-right">{candidate.percentage.toFixed(1)}%</td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>

            {/* Detail View - Right Sidebar */}
            <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '0.1s' }}>
              <div className="sticky top-24 modern-card">
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                  <Activity className="text-slate-900 w-5 h-5" />
                  <h3 className="text-lg font-bold text-slate-900">Local Trajectory</h3>
                </div>

                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <SVGLineChart 
                    data={localChartData} 
                    activeParties={activeParties}
                    width={350}
                    height={220}
                    showLabels={true}
                  />
                </div>

                <div className="space-y-3">
                  <div className="modern-label mb-4">Toggle Parties</div>
                  {PARTIES.map(party => (
                    <button
                      key={party}
                      onClick={() => toggleParty(party)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                        activeParties.includes(party)
                          ? 'bg-white border-slate-200 shadow-sm'
                          : 'bg-slate-50 border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: PARTY_COLORS[party] }} />
                        <span className="text-sm font-semibold text-slate-700">{party}</span>
                      </div>
                      {activeParties.includes(party) && <ArrowRight className="text-slate-400 w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
