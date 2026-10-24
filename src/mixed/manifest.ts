import { curriculumMixedGroups } from './curriculum-groups';
// Explicit usage eligibility; does not promote or modify editorial content.
// Reassess each entry when its authored version changes. Rationale and gaps: A1_MIXED_PRACTICE_IMPLEMENTATION.md.
export interface MixedGroup {
  id: string;
  conceptIds: string[];
  prerequisiteIds?: string[];
  items: { id: string; version: string; conceptId: string }[];
}
export const mixedGroups: MixedGroup[] = [
  {
    id: 'intentions',
    conceptIds: ['it-a1-c02-01', 'it-a1-c02-02', 'it-a1-c02-03'],
    items: [
      {
        id: 'it-a1-c02-01-hotel-mattina',
        version: '1',
        conceptId: 'it-a1-c02-01',
      },
      {
        id: 'it-a1-c02-01-notte',
        version: '1',
        conceptId: 'it-a1-c02-01',
      },
      {
        id: 'it-a1-c02-01-ciao-contesto',
        version: '1',
        conceptId: 'it-a1-c02-01',
      },
      {
        id: 'it-a1-c02-02-grazie',
        version: '1',
        conceptId: 'it-a1-c02-02',
      },
      {
        id: 'it-a1-c02-02-dialogo',
        version: '1',
        conceptId: 'it-a1-c02-02',
      },
      {
        id: 'it-a1-c02-03-intenzione',
        version: '2',
        conceptId: 'it-a1-c02-03',
      },
      {
        id: 'it-a1-c02-03-velocita',
        version: '1',
        conceptId: 'it-a1-c02-03',
      },
    ],
  },
  {
    id: 'states-needs',
    conceptIds: ['it-a1-c04-05', 'it-a1-c05-04'],
    items: [
      {
        id: 'it-a1-c04-05-stanco',
        version: '1',
        conceptId: 'it-a1-c04-05',
      },
      {
        id: 'it-a1-c04-05-contenta',
        version: '1',
        conceptId: 'it-a1-c04-05',
      },
      {
        id: 'it-a1-c04-05-pronto',
        version: '1',
        conceptId: 'it-a1-c04-05',
      },
      {
        id: 'it-a1-c05-04-fame',
        version: '1',
        conceptId: 'it-a1-c05-04',
      },
      {
        id: 'it-a1-c05-04-sete',
        version: '1',
        conceptId: 'it-a1-c05-04',
      },
      {
        id: 'it-a1-c05-04-freddo',
        version: '1',
        conceptId: 'it-a1-c05-04',
      },
      {
        id: 'it-a1-c05-04-paura',
        version: '1',
        conceptId: 'it-a1-c05-04',
      },
      {
        id: 'it-a1-c05-04-contrasto',
        version: '1',
        conceptId: 'it-a1-c05-04',
      },
    ],
  },
  {
    id: 'places-relations',
    prerequisiteIds: ['it-a1-c16-04', 'it-a1-c14-01', 'it-a1-c15-01'],
    conceptIds: ['it-a1-c20-01', 'it-a1-c20-02', 'it-a1-c20-03'],
    items: [
      {
        id: 'it-a1-c20-01-origine',
        version: '2',
        conceptId: 'it-a1-c20-01',
      },
      {
        id: 'it-a1-c20-01-provenienza',
        version: '1',
        conceptId: 'it-a1-c20-01',
      },
      {
        id: 'it-a1-c20-01-materia',
        version: '1',
        conceptId: 'it-a1-c20-01',
      },
      {
        id: 'it-a1-c20-01-camera',
        version: '1',
        conceptId: 'it-a1-c20-01',
      },
      {
        id: 'it-a1-c20-01-traduci',
        version: '2',
        conceptId: 'it-a1-c20-01',
      },
      {
        id: 'it-a1-c20-02-citta',
        version: '1',
        conceptId: 'it-a1-c20-02',
      },
      {
        id: 'it-a1-c20-02-paese',
        version: '1',
        conceptId: 'it-a1-c20-02',
      },
      {
        id: 'it-a1-c20-02-superficie',
        version: '1',
        conceptId: 'it-a1-c20-02',
      },
      {
        id: 'it-a1-c20-02-tra',
        version: '1',
        conceptId: 'it-a1-c20-02',
      },
      {
        id: 'it-a1-c20-03-meta',
        version: '1',
        conceptId: 'it-a1-c20-03',
      },
      {
        id: 'it-a1-c20-03-italia',
        version: '1',
        conceptId: 'it-a1-c20-03',
      },
      {
        id: 'it-a1-c20-03-anna',
        version: '1',
        conceptId: 'it-a1-c20-03',
      },
      {
        id: 'it-a1-c20-03-treno',
        version: '1',
        conceptId: 'it-a1-c20-03',
      },
      {
        id: 'it-a1-c20-03-direzione',
        version: '2',
        conceptId: 'it-a1-c20-03',
      },
    ],
  },
  ...curriculumMixedGroups,
];
