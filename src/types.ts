/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Party = 'AITC' | 'BJP' | 'INC' | 'CPIM' | 'ISF' | 'IND' | 'OTH';

export interface PartyResult {
  party: Party;
  seats: number;
  voteShare: number;
  color: string;
}

export interface CandidateResult {
  no: number;
  name: string;
  gender: string;
  category: string;
  party: Party;
  generalVotes: number;
  postalVotes: number;
  totalVotes: number;
  percentage: number;
}

export interface ConstituencyYearData {
  winner: string;
  party: Party;
  margin: number;
  marginPercent: number;
  totalVotes: number;
  candidates: CandidateResult[];
}

export interface Constituency {
  id: number;
  name: string;
  district: string;
  history: {
    [year: number]: ConstituencyYearData;
  };
}

export interface ElectionYearSummary {
  year: number;
  totalSeats: number;
  majorityMark: number;
  partyResults: PartyResult[];
}

export interface ElectionData {
  years: {
    [year: number]: ElectionYearSummary;
  };
  constituencies: Constituency[];
}
