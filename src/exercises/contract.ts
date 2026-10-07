export type ExerciseFamily = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7';
export type Judgment =
  'correct' | 'verifiable-error' | 'not-evaluable' | 'no-opportunity';
export interface ExerciseDefinition {
  id: string;
  version: string;
  family: ExerciseFamily;
  conceptIds: readonly string[];
  evaluatorVersion: string;
}
export interface OpportunityEvaluation {
  opportunityId: string;
  conceptId: string;
  judgment: Judgment;
  criterionVersion: string;
}
export interface ExerciseEngine {
  evaluate(
    activity: ExerciseDefinition,
    response: unknown,
  ): Promise<readonly OpportunityEvaluation[]>;
}
