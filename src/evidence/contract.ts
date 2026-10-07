export type EvidenceDimension =
  | 'comprehension'
  | 'retrieval'
  | 'contextual-use'
  | 'discrimination'
  | 'retention';
export interface ProjectionCheckpoint {
  policyVersion: string;
  contentVersion: string;
  cursor: number;
}
export interface MasteryProjection {
  conceptId: string;
  dimension: EvidenceDimension;
  supportingFactIds: readonly string[];
  uncertainty: string;
  checkpoint: ProjectionCheckpoint;
}
// Projections are disposable; original observations and their revisions remain facts.
export interface EvidenceProjector {
  rebuild(factIds: readonly string[]): Promise<readonly MasteryProjection[]>;
}
