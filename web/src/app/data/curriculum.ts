export type CurriculumId = 'CAPS' | 'IEB' | 'Cambridge';
export type PaperId = 'paper1' | 'paper2';
export type TopicDifficulty = 'easy' | 'medium' | 'hard';

export interface CurriculumTrack {
  id: CurriculumId;
  name: string;
  description: string;
  focus: string;
}

export interface CurriculumTopic {
  id: string;
  grade: number;
  paper: PaperId;
  title: string;
  description: string;
  difficulty: TopicDifficulty;
  lessonCount: number;
  duration: string;
}

export interface PastPaper {
  id: string;
  year: number;
  grade: 12;
  curriculum: CurriculumId;
  paper: PaperId;
  title: string;
  memoTitle: string;
  paperLink: string;
  memoLink: string;
}

export const gradeNumbers = [4, 5, 6, 7, 8, 9, 10, 11, 12];

export const gradeOptions = gradeNumbers.map((grade) =>
  grade === 12 ? 'Grade 12 (Matric)' : `Grade ${grade}`
);

export const curriculumTracks: CurriculumTrack[] = [
  {
    id: 'CAPS',
    name: 'CAPS',
    description: 'South Africa national curriculum with annual assessment standards and matric exam alignment.',
    focus: 'Core school pathway'
  },
  {
    id: 'IEB',
    name: 'IEB',
    description: 'Independent Examinations Board pathway with deeper problem solving and investigation style questions.',
    focus: 'Independent school pathway'
  },
  {
    id: 'Cambridge',
    name: 'Cambridge',
    description: 'International pathway mapped to South African grade levels for IGCSE, AS, and A Level preparation.',
    focus: 'International pathway'
  }
];

export const paperDefinitions: Record<PaperId, {
  id: PaperId;
  label: string;
  shortLabel: string;
  subtitle: string;
  description: string;
}> = {
  paper1: {
    id: 'paper1',
    label: 'Paper 1',
    shortLabel: 'P1',
    subtitle: 'Algebra & Analysis',
    description: 'Algebra, Functions, Calculus'
  },
  paper2: {
    id: 'paper2',
    label: 'Paper 2',
    shortLabel: 'P2',
    subtitle: 'Geometry & Statistics',
    description: 'Geometry, Trigonometry, Statistics'
  }
};

type GradeBand = 'grades4to6' | 'grades7to9' | 'grades10to12';

const topicsByBand: Record<GradeBand, Record<PaperId, Array<{
  title: string;
  description: string;
}>>> = {
  grades4to6: {
    paper1: [
      {
        title: 'Whole Numbers',
        description: 'Place value, operations, factors, multiples, and estimation.'
      },
      {
        title: 'Patterns',
        description: 'Number patterns, input-output rules, and early algebraic thinking.'
      },
      {
        title: 'Fractions',
        description: 'Equivalent fractions, comparing fractions, and mixed number operations.'
      }
    ],
    paper2: [
      {
        title: 'Basic Geometry',
        description: 'Lines, angles, 2D shapes, symmetry, and properties of common figures.'
      },
      {
        title: 'Measurement',
        description: 'Length, perimeter, area, volume, time, mass, and conversions.'
      },
      {
        title: 'Data Handling',
        description: 'Collecting data, reading graphs, averages, and simple probability.'
      }
    ]
  },
  grades7to9: {
    paper1: [
      {
        title: 'Integers',
        description: 'Directed numbers, order of operations, exponents, and number properties.'
      },
      {
        title: 'Algebraic Expressions',
        description: 'Simplifying expressions, substitution, factorising, and equations.'
      },
      {
        title: 'Functions',
        description: 'Input-output rules, graphs, linear relationships, and rates of change.'
      }
    ],
    paper2: [
      {
        title: '2D Geometry',
        description: 'Angles, polygons, transformations, construction, and geometric reasoning.'
      },
      {
        title: 'Pythagoras',
        description: 'Right triangles, distance, applications, and multi-step geometry problems.'
      },
      {
        title: 'Statistics',
        description: 'Measures of central tendency, spread, graphs, and probability models.'
      }
    ]
  },
  grades10to12: {
    paper1: [
      {
        title: 'Equations',
        description: 'Linear, quadratic, exponential, simultaneous, and inequality solving.'
      },
      {
        title: 'Sequences & Series',
        description: 'Arithmetic and geometric sequences, sigma notation, and finance applications.'
      },
      {
        title: 'Calculus',
        description: 'Limits, derivatives, cubic graphs, optimization, and rates of change.'
      }
    ],
    paper2: [
      {
        title: 'Trigonometry',
        description: 'Ratios, identities, reduction formulae, equations, and applications.'
      },
      {
        title: 'Analytical Geometry',
        description: 'Coordinate geometry, gradients, distance, midpoint, circles, and tangents.'
      },
      {
        title: 'Euclidean Geometry',
        description: 'Theorems, proof writing, similarity, proportion, and circle geometry.'
      }
    ]
  }
};

function getGradeBand(grade: number): GradeBand {
  if (grade <= 6) return 'grades4to6';
  if (grade <= 9) return 'grades7to9';
  return 'grades10to12';
}

function getDifficulty(grade: number, index: number): TopicDifficulty {
  if (grade <= 6) return index === 2 ? 'medium' : 'easy';
  if (grade <= 9) return index === 0 ? 'easy' : 'medium';
  return index === 0 ? 'medium' : 'hard';
}

export function getGradeNumber(grade?: string): number {
  const match = grade?.match(/\d+/);
  const parsed = match ? Number(match[0]) : 12;

  return gradeNumbers.includes(parsed) ? parsed : 12;
}

export function getTopicsForGradeAndPaper(grade: string | number | undefined, paper: PaperId): CurriculumTopic[] {
  const gradeNumber = typeof grade === 'number' ? grade : getGradeNumber(grade);
  const band = getGradeBand(gradeNumber);

  return topicsByBand[band][paper].map((topic, index) => ({
    ...topic,
    id: `${paper}-grade-${gradeNumber}-${topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    grade: gradeNumber,
    paper,
    difficulty: getDifficulty(gradeNumber, index),
    lessonCount: gradeNumber <= 6 ? 6 + index : gradeNumber <= 9 ? 8 + index : 10 + (index * 2),
    duration: gradeNumber <= 6 ? '15-20 min' : gradeNumber <= 9 ? '20-30 min' : '30-45 min'
  }));
}

export function getTopicsForGrade(grade: string | number | undefined): CurriculumTopic[] {
  return [
    ...getTopicsForGradeAndPaper(grade, 'paper1'),
    ...getTopicsForGradeAndPaper(grade, 'paper2')
  ];
}

export const pastPapers: PastPaper[] = [2023, 2022, 2021].flatMap((year) =>
  curriculumTracks.flatMap((curriculum) =>
    (['paper1', 'paper2'] as PaperId[]).map((paper) => ({
      id: `${curriculum.id.toLowerCase()}-${year}-${paper}`,
      year,
      grade: 12 as const,
      curriculum: curriculum.id,
      paper,
      title: `${curriculum.name} Grade 12 Mathematics ${paperDefinitions[paper].label} ${year}`,
      memoTitle: `${curriculum.name} Grade 12 Mathematics ${paperDefinitions[paper].label} Memo ${year}`,
      paperLink: '#',
      memoLink: '#'
    }))
  )
);
