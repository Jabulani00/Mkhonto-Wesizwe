
  // ward.interface.ts
export interface VotingStation {
  name: string;
  voterRoll: number;
}

export interface Ward {
  ward: string;
  votingStations: VotingStation[];
}
