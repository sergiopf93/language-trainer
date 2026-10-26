import type { Activity, Judgment, WritingOutcome } from '../../shared/learning';
export type { Judgment } from '../../shared/learning';
export type ExerciseFamily = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7';
// This increment supports one evaluable opportunity per concrete activity.
export type ExerciseDefinition = Activity;
export interface OpportunityEvaluation {
  writingOutcome?: WritingOutcome;
  opportunityId: string;
  conceptId: string;
  judgment: Judgment;
  criterionVersion: string;
  explanation: string;
}
export interface ExerciseEngine {
  evaluate(
    activity: ExerciseDefinition,
    response: string,
  ): Promise<readonly OpportunityEvaluation[]>;
}
