export type LearningMode = 'focus' | 'mixed' | 'review' | 'reading' | 'writing';
export interface LearningRequest {
  mode: LearningMode;
  conceptIds: readonly string[];
  languagePackId: string;
}
export type LearningDecision =
  | { status: 'unavailable'; reason: string }
  | { status: 'ready'; activityId: string; reason: string };
export interface LearningEngine {
  select(request: LearningRequest): Promise<LearningDecision>;
}
