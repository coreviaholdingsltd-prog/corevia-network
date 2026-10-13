export type AcademyLesson = {
  id: string;
  title: string;
  minutes: number;
  content: string[];
};

export type AcademyQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type AcademyCourse = {
  id: string;
  title: string;
  category: string;
  description: string;
  level: string;
  priceKsh: number;
  published: boolean;
  lessons: AcademyLesson[];
  questions: AcademyQuestion[];
};

// All launch courses are FREE until Corevia approves course-specific prices.
// For a paid course, set that course's priceKsh to the approved KES amount.
// Academy checkout is separate from the KES 1,000 Network activation payment.
export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: "digital-foundations",
    title: "Digital Foundations",
    category: "Digital & ICT Skills",
    description: "Build safe, practical confidence using computers, the internet, and everyday digital tools.",
    level: "Beginner",
    priceKsh: 0,
    published: true,
    lessons: [
      { id: "digital-devices", title: "Understanding digital devices", minutes: 8, content: [
        "A digital device accepts input, processes information, stores data, and produces output. A smartphone, laptop, tablet, and desktop computer can all help you communicate, learn, create documents, and manage work.",
        "Keep devices updated, use a screen lock, install apps from trusted stores, and back up important files. Avoid using unknown USB drives or installing software from suspicious pop-ups.",
        "Practice: identify one device you use, three tasks it helps you complete, and one action you can take to protect the information stored on it."
      ]},
      { id: "internet-search", title: "Using the internet and searching well", minutes: 10, content: [
        "A web browser opens websites; a search engine helps discover pages. Use specific keywords, compare more than one trustworthy source, check publication dates, and distinguish advertisements from independent information.",
        "Before entering personal details, check the website address and connection. A padlock does not prove that a business is honest, so still confirm the organisation and the purpose of the page.",
        "Practice: search for a topic, open two relevant sources, and write down which source is more reliable and why."
      ]},
      { id: "online-safety", title: "Passwords, privacy and scams", minutes: 10, content: [
        "Use a long, unique password or passphrase for each important account. A password manager can help you keep them safely. Enable multi-factor authentication when available, especially for email and financial accounts.",
        "Phishing messages often create urgency, promise unexpected rewards, or ask you to reveal a password or one-time code. Do not click suspicious links. Open the official app or type the known address yourself and confirm through a trusted channel.",
        "Never share a one-time password, PIN, or recovery code with a caller or message sender. Report suspicious messages through the service's official reporting tools.",
        "Practice: list three warning signs of a suspicious message and what you would do before responding."
      ]}
    ],
    questions: [
      { id: "df-q1", prompt: "What is a good way to protect important accounts?", options: ["Use one short password everywhere", "Use unique long passwords and multi-factor authentication", "Send your password to a friend", "Turn off every security update"], answerIndex: 1, explanation: "Unique strong passwords and multi-factor authentication make account takeover harder." },
      { id: "df-q2", prompt: "A message says your account will close in five minutes unless you share a code. What should you do?", options: ["Reply with the code", "Forward it to everyone", "Do not share the code; verify through the official service", "Click every link in the message"], answerIndex: 2, explanation: "Urgency and requests for one-time codes are common scam warning signs." },
      { id: "df-q3", prompt: "How should you assess information found online?", options: ["Trust the first result automatically", "Compare credible sources and check dates", "Trust any page with colourful graphics", "Ignore who published it"], answerIndex: 1, explanation: "Comparing reliable sources and checking dates helps assess accuracy and relevance." },
      { id: "df-q4", prompt: "What is a sensible way to protect files?", options: ["Back up important files and keep devices updated", "Disable all updates forever", "Use unknown USB drives", "Share every file publicly"], answerIndex: 0, explanation: "Updates and backups reduce security risks and help recover information." }
    ]
  },
  {
    id: "business-essentials",
    title: "Business Essentials",
    category: "Business & Entrepreneurship",
    description: "Learn to identify a customer problem, estimate costs, set a basic price, and track cash flow.",
    level: "Beginner",
    priceKsh: 0,
    published: true,
    lessons: [
      { id: "customer-problem", title: "Start with a real customer need", minutes: 9, content: [
        "A business creates value by helping a specific group solve a problem or meet a need. Start by identifying the customer, the difficulty they face, how they currently solve it, and why your offer may be useful.",
        "Speak with potential customers before investing heavily. Ask open questions and listen for patterns. Interest is helpful feedback, but actual purchases provide stronger evidence of demand.",
        "Practice: write a one-sentence customer problem statement: 'For [customer], who needs [need], we offer [solution] that helps them [benefit].'"
      ]},
      { id: "cost-pricing", title: "Costs, prices and margin", minutes: 10, content: [
        "Separate one-time setup costs from ongoing costs. Variable costs increase as you make or deliver more units; fixed costs are more stable over a period. Include transport, packaging, transaction charges, labour, and wastage where relevant.",
        "Sales revenue is the amount earned from sales. Gross profit is usually revenue minus the direct cost of the goods or services sold. A markup and a profit margin are not the same calculation; know which one you are using before setting a price.",
        "Practice: if a product sells for KES 800 and its direct cost is KES 500, the gross amount left before other expenses is KES 300. This is not necessarily the final net profit."
      ]},
      { id: "cash-records", title: "Cash flow and simple records", minutes: 9, content: [
        "Profit and cash flow are different. A sale made on credit may count as revenue before the money arrives. A business can appear profitable and still struggle to pay bills if cash arrives late.",
        "Record each transaction with a date, description, amount, payment method, and supporting receipt. Reconcile records with cash and account statements regularly, and keep business funds separate from personal spending where possible.",
        "Practice: prepare a simple daily log of opening cash, receipts, payments, and closing cash. Do not treat uncollected money as cash already available."
      ]}
    ],
    questions: [
      { id: "be-q1", prompt: "What is a sensible first step for a new business idea?", options: ["Buy large quantities immediately", "Understand a specific customer's need", "Set a price without estimating costs", "Ignore existing alternatives"], answerIndex: 1, explanation: "A business should understand the customer need before committing significant resources." },
      { id: "be-q2", prompt: "A product sells for KES 800 and direct cost is KES 500. What remains before other expenses?", options: ["KES 1,300", "KES 800", "KES 300", "KES 500"], answerIndex: 2, explanation: "KES 800 minus KES 500 equals KES 300 before other expenses." },
      { id: "be-q3", prompt: "Why keep transaction records?", options: ["To hide spending", "To understand income, costs, and cash", "To avoid issuing receipts", "To guarantee every sale is profitable"], answerIndex: 1, explanation: "Good records support decisions, accountability, and cash management." },
      { id: "be-q4", prompt: "Why can a business with sales still have cash problems?", options: ["All sales arrive instantly", "Customers may pay later while bills are due now", "Records are never useful", "Costs do not need payment"], answerIndex: 1, explanation: "Cash can be delayed while expenses remain due, creating a timing gap." }
    ]
  },
  {
    id: "ai-literacy-basics",
    title: "AI Literacy Basics",
    category: "AI & Programming",
    description: "Understand generative AI, write clearer prompts, and check outputs responsibly.",
    level: "Beginner",
    priceKsh: 0,
    published: true,
    lessons: [
      { id: "what-is-ai", title: "What AI can and cannot do", minutes: 9, content: [
        "Artificial intelligence refers to computer systems that perform tasks such as recognising patterns, making predictions, or generating text and images. Generative AI produces new content based on patterns learned during training and the context supplied to it.",
        "An AI system can produce fluent but incorrect answers. It may omit context, rely on outdated information, or make up sources. Treat generated content as a draft or aid, not automatic proof.",
        "Practice: name one task where AI could help you save time and one important fact you would independently verify."
      ]},
      { id: "better-prompts", title: "Write useful prompts", minutes: 10, content: [
        "A useful prompt states the goal, the relevant context, the intended audience, the format, and any constraints. Instead of 'help with business', try 'draft a one-page checklist for a small shop to record daily sales and expenses'.",
        "Provide examples or criteria when appropriate. Ask for a structured answer, then iterate: point out what is missing, request revisions, and check that the result meets your need.",
        "Do not paste passwords, payment details, private customer information, or confidential company documents into an AI service unless the service and your organisation's rules permit it.",
        "Practice: rewrite a vague request into a specific task with an audience and output format."
      ]},
      { id: "verify-ai", title: "Verify output and use AI responsibly", minutes: 10, content: [
        "Check factual claims against credible sources, especially legal, financial, medical, and safety-related information. For code, run tests and review what the code can access before using it with real data.",
        "Respect privacy, intellectual property, and the rights of people represented in content. Disclose AI assistance when required by your school, employer, client, or publisher.",
        "Practice: take one AI-generated claim and list a trustworthy source or test that could confirm or challenge it."
      ]}
    ],
    questions: [
      { id: "ai-q1", prompt: "What is a responsible way to use generative AI?", options: ["Assume every answer is correct", "Use it as assistance and verify important claims", "Share private passwords with it", "Ignore the final result"], answerIndex: 1, explanation: "AI can help but can also produce incorrect or incomplete outputs." },
      { id: "ai-q2", prompt: "Which prompt is more useful?", options: ["Do something", "Business", "Create a daily sales-record checklist for a small shop", "Write anything you want"], answerIndex: 2, explanation: "A clear goal and context guide the response toward a useful output." },
      { id: "ai-q3", prompt: "What should you do before using important AI-generated factual information?", options: ["Verify it against credible sources", "Delete every source", "Assume it is current", "Publish it without review"], answerIndex: 0, explanation: "Important claims should be checked, especially in high-impact contexts." },
      { id: "ai-q4", prompt: "Which information should generally not be pasted into an AI prompt?", options: ["A fictional example", "A public topic", "A generic formatting request", "Passwords and confidential personal data"], answerIndex: 3, explanation: "Avoid exposing sensitive or confidential information to services unless authorised." }
    ]
  }
];

export function findAcademyCourse(courseId: string) {
  return ACADEMY_COURSES.find((course) => course.id === courseId && course.published) ?? null;
}
