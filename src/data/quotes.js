export const quotesList = [
  // Action & Getting Started (1-10)
  {
    id: '1',
    text: "The secret to getting ahead is getting started.",
    author: "Mark Twain",
    category: "action"
  },
  {
    id: '2',
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "action"
  },
  {
    id: '3',
    text: "A year from now you may wish you had started today.",
    author: "Karen Lamb",
    category: "action"
  },
  {
    id: '4',
    text: "Action eliminates doubt.",
    author: "Nashid Sharrief",
    category: "action"
  },
  {
    id: '5',
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    category: "action"
  },
  {
    id: '6',
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    category: "action"
  },
  {
    id: '7',
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "action"
  },
  {
    id: '8',
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "action"
  },
  {
    id: '9',
    text: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    category: "action"
  },
  {
    id: '10',
    text: "What you do today can improve all your tomorrows.",
    author: "Ralph Marston",
    category: "action"
  },

  // Hard Times & Resilience (11-21)
  {
    id: '11',
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "resilience"
  },
  {
    id: '12',
    text: "Success is not final; failure is never fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "resilience"
  },
  {
    id: '13',
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    author: "Confucius",
    category: "resilience"
  },
  {
    id: '14',
    text: "Hardships often prepare ordinary people for an extraordinary destiny.",
    author: "C.S. Lewis",
    category: "resilience"
  },
  {
    id: '15',
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "resilience"
  },
  {
    id: '16',
    text: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
    category: "resilience"
  },
  {
    id: '17',
    text: "Tough times never last, but tough people do.",
    author: "Robert H. Schuller",
    category: "resilience"
  },
  {
    id: '18',
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "resilience"
  },
  {
    id: '19',
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb",
    category: "resilience"
  },
  {
    id: '20',
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "resilience"
  },
  {
    id: '21',
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    category: "resilience"
  },

  // Productivity & Focus (22-31)
  {
    id: '22',
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    category: "productivity"
  },
  {
    id: '23',
    text: "Perfection is the enemy of progress.",
    author: "Winston Churchill",
    category: "productivity"
  },
  {
    id: '24',
    text: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "productivity"
  },
  {
    id: '25',
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
    category: "productivity"
  },
  {
    id: '26',
    text: "You can do anything, but not everything.",
    author: "David Allen",
    category: "productivity"
  },
  {
    id: '27',
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "productivity"
  },
  {
    id: '28',
    text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    author: "Stephen King",
    category: "productivity"
  },
  {
    id: '29',
    text: "It's not that I'm so smart, it's just that I stay with problems longer.",
    author: "Albert Einstein",
    category: "productivity"
  },
  {
    id: '30',
    text: "Yesterday is history, tomorrow is a mystery, today is a gift.",
    author: "Eleanor Roosevelt",
    category: "productivity"
  },
  {
    id: '31',
    text: "There is no traffic jam along the extra mile.",
    author: "Roger Staubach",
    category: "productivity"
  }
];

// Helper function to get a completely random quote
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotesList.length);
  return quotesList[randomIndex];
};
