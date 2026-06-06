export const assessmentQuestions = [
  // Easy Questions (Elementary)
  {
    question: 'What is 7 + 5?',
    options: ['10', '11', '12', '13'],
    correctAnswer: 2,
    explanation: '7 + 5 = 12',
    difficulty: 'easy' as const
  },
  {
    question: 'Which number is larger: 15 or 9?',
    options: ['15', '9', 'They are equal', 'Cannot determine'],
    correctAnswer: 0,
    explanation: '15 is greater than 9',
    difficulty: 'easy' as const
  },
  {
    question: 'What is 10 - 6?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    explanation: '10 - 6 = 4',
    difficulty: 'easy' as const
  },

  // Medium Questions (Middle School)
  {
    question: 'Solve for x: 2x + 4 = 12',
    options: ['2', '4', '6', '8'],
    correctAnswer: 1,
    explanation: 'Subtract 4 from both sides: 2x = 8, then divide by 2: x = 4',
    difficulty: 'medium' as const
  },
  {
    question: 'What is 15% of 200?',
    options: ['20', '25', '30', '35'],
    correctAnswer: 2,
    explanation: '15% of 200 = 0.15 × 200 = 30',
    difficulty: 'medium' as const
  },
  {
    question: 'What is the area of a rectangle with length 8 and width 5?',
    options: ['13', '26', '40', '80'],
    correctAnswer: 2,
    explanation: 'Area = length × width = 8 × 5 = 40',
    difficulty: 'medium' as const
  },
  {
    question: 'If x = 3, what is 4x - 5?',
    options: ['7', '12', '17', '22'],
    correctAnswer: 0,
    explanation: '4(3) - 5 = 12 - 5 = 7',
    difficulty: 'medium' as const
  },

  // Hard Questions (High School)
  {
    question: 'Solve: x² - 5x + 6 = 0',
    options: ['x = 1 or x = 6', 'x = 2 or x = 3', 'x = -2 or x = -3', 'x = 0 or x = 5'],
    correctAnswer: 1,
    explanation: 'Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3',
    difficulty: 'hard' as const
  },
  {
    question: 'What is the slope of the line passing through (2, 3) and (6, 11)?',
    options: ['1/2', '2', '4', '8'],
    correctAnswer: 1,
    explanation: 'Slope = (y₂ - y₁)/(x₂ - x₁) = (11 - 3)/(6 - 2) = 8/4 = 2',
    difficulty: 'hard' as const
  },
  {
    question: 'Simplify: (x³)² ÷ x⁴',
    options: ['x', 'x²', 'x³', 'x⁴'],
    correctAnswer: 1,
    explanation: '(x³)² = x⁶, then x⁶ ÷ x⁴ = x² (subtract exponents)',
    difficulty: 'hard' as const
  }
];
