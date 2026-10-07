export interface ReviewNeed {
  conceptId: string;
  reason: string;
  policyVersion: string;
  sourceFactIds: readonly string[];
}
export interface ReviewScheduler {
  suggest(now: Date, budget: number): Promise<readonly ReviewNeed[]>;
}
