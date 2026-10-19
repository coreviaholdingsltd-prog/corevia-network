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

// Academy course prices are separate from the one-time KES 1,000 Network activation fee.
// Prices are configurable per course; paid enrollment must be verified before lessons unlock.
export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: "digital-foundations",
    title: "Digital Foundations",
    category: "Digital & ICT Skills",
    description: "Build safe, practical confidence using computers, the internet, and everyday digital tools.",
    level: "Beginner",
    priceKsh: 300,
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
    priceKsh: 500,
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
    priceKsh: 500,
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
  },
  {
    id: "digital-marketing-social-media",
    title: "Digital Marketing & Social Media",
    category: "Digital Marketing & Office Tools",
    description: "Plan useful content, understand audiences, and measure the performance of digital campaigns.",
    level: "Beginner",
    priceKsh: 700,
    published: true,
    lessons: [
      { id: "marketing-goals", title: "Set goals and understand your audience", minutes: 9, content: [
        "Digital marketing uses online channels to reach and serve customers. Begin with a clear goal such as enquiries, store visits, sign-ups, or sales rather than posting without a purpose.",
        "Describe your audience by their needs, questions, location, and preferred channels. Use customer feedback and lawful, privacy-respecting insights instead of assumptions.",
        "Practice: choose one product, describe its likely audience, and write one measurable campaign goal."
      ]},
      { id: "content-planning", title: "Create a simple content plan", minutes: 10, content: [
        "Useful content answers customer questions, demonstrates value, or helps people make an informed decision. Mix educational posts, demonstrations, testimonials used with permission, and clear offers.",
        "Use a calendar to plan the topic, format, publishing date, call to action, and person responsible. Check spelling, prices, links, and permissions before publishing.",
        "Practice: plan three posts for one week, each with a different purpose and a clear next step."
      ]},
      { id: "measure-campaigns", title: "Measure and improve results", minutes: 9, content: [
        "Reach counts how many people were shown content; engagement records interactions; clicks show visits to a destination; conversions record a desired action. Choose metrics that match the campaign goal.",
        "Compare results over similar periods and test one change at a time when possible. Do not buy fake followers or misrepresent results to customers.",
        "Practice: decide which metric best measures a campaign designed to generate product enquiries."
      ]}
    ],
    questions: [
      { id: "digital-marketing-social-media-q1", prompt: "What should guide a digital marketing campaign?", options: ["A clear goal and audience", "Posting at random", "Follower count alone", "Copying every competitor"], answerIndex: 0, explanation: "A clear goal and audience help shape relevant content and useful measurement." },
      { id: "digital-marketing-social-media-q2", prompt: "What is a content calendar for?", options: ["Planning topics and publishing dates", "Storing customer passwords", "Guaranteeing sales", "Replacing customer service"], answerIndex: 0, explanation: "A calendar helps coordinate topics, dates, formats, and responsibilities." },
      { id: "digital-marketing-social-media-q3", prompt: "Which metric best fits a campaign seeking enquiries?", options: ["Number of relevant enquiries", "Colour of the logo", "Number of unrelated posts", "Personal opinions only"], answerIndex: 0, explanation: "Measure the action that matches the campaign objective." },
      { id: "digital-marketing-social-media-q4", prompt: "What is a responsible way to use a testimonial?", options: ["Use it with permission and represent it honestly", "Invent a customer quote", "Change its meaning", "Claim every customer had the same result"], answerIndex: 0, explanation: "Testimonials should be authorised and presented accurately." }
    ]
  },
  {
    id: "computer-office-skills",
    title: "Computer Applications & Office Skills",
    category: "Digital Marketing & Office Tools",
    description: "Build practical skills for documents, spreadsheets, presentations, and organised digital files.",
    level: "Beginner",
    priceKsh: 700,
    published: true,
    lessons: [
      { id: "organise-files", title: "Manage files and folders", minutes: 8, content: [
        "Use clear file names that describe the content and, when useful, include a date or version. Store related documents in folders and avoid confusing names such as final-final-new.",
        "Keep a backup of important work and check sharing permissions before sending a link. Use common file formats requested by the recipient.",
        "Practice: design a folder structure for invoices, customer records, reports, and presentations."
      ]},
      { id: "documents-presentations", title: "Create clear documents and presentations", minutes: 10, content: [
        "Use headings, consistent fonts, readable spacing, and descriptive titles. Proofread names, dates, amounts, and contact details before sharing a document.",
        "Slides should support a speaker or communicate one main idea at a time. Prefer concise text, legible visuals, and accurate source notes over crowded slides.",
        "Practice: outline a one-page business report and a five-slide presentation for the same topic."
      ]},
      { id: "spreadsheet-basics", title: "Use spreadsheets for simple records", minutes: 12, content: [
        "A spreadsheet organises information in rows and columns. Use one clear header row, consistent date and currency formats, and one record per row.",
        "Formulas can calculate totals and averages. Check cell references and test results against a small manual calculation before relying on a spreadsheet for decisions.",
        "Practice: create a sample sales table with date, item, quantity, unit price, and total."
      ]}
    ],
    questions: [
      { id: "computer-office-skills-q1", prompt: "What makes a file name useful?", options: ["It clearly describes the file", "It is always blank", "It uses random symbols only", "It hides the document's purpose"], answerIndex: 0, explanation: "Descriptive names make files easier to find and distinguish." },
      { id: "computer-office-skills-q2", prompt: "What should a presentation slide usually do?", options: ["Communicate one main idea clearly", "Contain every sentence in a report", "Use the smallest possible text", "Avoid titles"], answerIndex: 0, explanation: "Focused slides are easier to read and explain." },
      { id: "computer-office-skills-q3", prompt: "In a spreadsheet, what is a row commonly used for?", options: ["One record or entry", "A password for all users", "A folder on the computer", "A slide transition"], answerIndex: 0, explanation: "Rows commonly represent individual records, with columns describing their fields." },
      { id: "computer-office-skills-q4", prompt: "What should you do before relying on a spreadsheet total?", options: ["Check formulas and test sample results", "Assume formulas cannot fail", "Delete the source data", "Share it publicly"], answerIndex: 0, explanation: "Checking formulas and sample results helps catch errors." }
    ]
  },
  {
    id: "cybersecurity-online-safety",
    title: "Cybersecurity & Online Safety",
    category: "Digital & ICT Skills",
    description: "Recognise common online threats and protect accounts, devices, and personal information.",
    level: "Beginner",
    priceKsh: 500,
    published: true,
    lessons: [
      { id: "recognise-threats", title: "Recognise common online threats", minutes: 9, content: [
        "Phishing attempts may arrive through email, text messages, calls, social media, or fake websites. Watch for unexpected requests, pressure, unusual sender details, and links that do not match the claimed organisation.",
        "Malware can steal information, spy on activity, or disrupt devices. Keep software updated and install applications only from trusted sources.",
        "Practice: identify warning signs in a fictional message asking you to urgently confirm a payment."
      ]},
      { id: "secure-accounts", title: "Secure accounts and devices", minutes: 10, content: [
        "Use unique passwords, a password manager where appropriate, and multi-factor authentication. Protect the email account used to reset other passwords.",
        "Lock devices when unattended, review app permissions, install updates, and back up important information. Use a trusted network for sensitive tasks when possible.",
        "Practice: make a checklist for securing your email and mobile phone."
      ]},
      { id: "respond-safely", title: "Respond to a suspected incident", minutes: 9, content: [
        "Do not respond to suspicious messages or share passwords, PINs, or one-time codes. Contact the organisation through a known official channel.",
        "If an account may be compromised, use a trusted device to change the password, end unfamiliar sessions, enable additional security, and contact the provider or financial institution when relevant.",
        "Practice: list the first three steps you would take after noticing an unfamiliar sign-in alert."
      ]}
    ],
    questions: [
      { id: "cybersecurity-online-safety-q1", prompt: "What is a phishing warning sign?", options: ["An unexpected urgent request for a code", "A routine update from a verified app you opened yourself", "A document you created", "A saved offline note"], answerIndex: 0, explanation: "Unexpected urgency and requests for authentication codes are common warning signs." },
      { id: "cybersecurity-online-safety-q2", prompt: "Why use unique passwords?", options: ["A leaked password is less likely to unlock other accounts", "It makes every account public", "It removes the need for updates", "It guarantees no attacks"], answerIndex: 0, explanation: "Unique passwords limit the damage if one service is breached." },
      { id: "cybersecurity-online-safety-q3", prompt: "What should you do with a suspicious payment message?", options: ["Verify through an official known channel", "Reply with your PIN", "Click its shortened link immediately", "Forward your one-time code"], answerIndex: 0, explanation: "Independent verification helps avoid impersonation scams." },
      { id: "cybersecurity-online-safety-q4", prompt: "What is a useful first response to a compromised account?", options: ["Secure it from a trusted device and contact the provider", "Ignore all alerts", "Post the password publicly", "Disable every security feature"], answerIndex: 0, explanation: "Secure access promptly and follow the provider's incident guidance." }
    ]
  },
  {
    id: "web-development-programming",
    title: "Web Development & Programming",
    category: "AI & Programming",
    description: "Learn how websites are structured, styled, and made interactive, with a beginner-friendly project workflow.",
    level: "Beginner",
    priceKsh: 1000,
    published: true,
    lessons: [
      { id: "web-structure", title: "Understand how websites work", minutes: 10, content: [
        "HTML describes page structure and meaning, CSS controls presentation, and JavaScript adds behaviour. A browser interprets these resources to display a website.",
        "A website may also rely on a server, database, and APIs. Never place private keys or secret credentials in code sent to the browser.",
        "Practice: sketch a simple page with a heading, paragraph, navigation, and contact section."
      ]},
      { id: "build-accessible-pages", title: "Build readable and accessible pages", minutes: 12, content: [
        "Use semantic headings, descriptive links, labels for form fields, and meaningful alternative text for informative images. A clear structure helps people and assistive technologies understand the page.",
        "Use CSS for consistent spacing, colour, and responsive layouts. Check the page on a narrow screen and ensure text contrast and keyboard navigation are usable.",
        "Practice: create a page outline and list two ways to make it easier to use on a phone."
      ]},
      { id: "test-and-improve", title: "Test and improve a small project", minutes: 12, content: [
        "Break a project into small tasks and test each change. Check links, forms, error states, and different screen sizes rather than testing only the ideal path.",
        "Use version control to track changes and keep a recoverable history. Review dependencies and never commit secrets or personal data to a repository.",
        "Practice: write five test cases for a registration form, including missing and invalid input."
      ]}
    ],
    questions: [
      { id: "web-development-programming-q1", prompt: "Which technology describes the structure of a web page?", options: ["HTML", "CSS", "A spreadsheet", "A password manager"], answerIndex: 0, explanation: "HTML provides the structure and meaning of page content." },
      { id: "web-development-programming-q2", prompt: "What is CSS mainly used for?", options: ["Styling and layout", "Storing secret API keys", "Replacing all testing", "Sending private keys to users"], answerIndex: 0, explanation: "CSS controls presentation and layout." },
      { id: "web-development-programming-q3", prompt: "Where should a private server secret be kept?", options: ["In protected server-side configuration", "In public browser code", "In a public image", "In a page heading"], answerIndex: 0, explanation: "Secrets must not be exposed in client-side code or public repositories." },
      { id: "web-development-programming-q4", prompt: "Why test invalid form input?", options: ["To check error handling and protect data quality", "To guarantee unlimited traffic", "To remove the need for security", "To make forms harder to use"], answerIndex: 0, explanation: "Testing invalid input checks whether the form responds safely and clearly." }
    ]
  },
  {
    id: "financial-literacy-record-keeping",
    title: "Financial Literacy & Record Keeping",
    category: "Business & Entrepreneurship",
    description: "Understand budgeting, basic financial records, saving, and responsible money decisions.",
    level: "Beginner",
    priceKsh: 500,
    published: true,
    lessons: [
      { id: "budgeting", title: "Prepare a practical budget", minutes: 9, content: [
        "A budget estimates money coming in and money going out over a defined period. Separate essential expenses, flexible spending, savings goals, and irregular costs.",
        "Use realistic figures and review the budget against actual spending. If income varies, plan around conservative estimates and protect essential obligations first.",
        "Practice: create a monthly budget with income, essential expenses, flexible expenses, and a savings target."
      ]},
      { id: "records-and-reconciliation", title: "Keep accurate financial records", minutes: 10, content: [
        "Record the date, description, amount, payment method, and supporting evidence for each transaction. Store receipts and statements securely.",
        "Reconcile your records with cash and account statements regularly. Correct mistakes transparently and keep personal and business transactions separate where possible.",
        "Practice: compare a sample transaction log with a statement and identify any missing entry."
      ]},
      { id: "saving-and-risk", title: "Save and assess financial risk", minutes: 9, content: [
        "Saving helps prepare for planned expenses and unexpected events. A realistic emergency fund goal depends on income stability, essential costs, and personal circumstances.",
        "Before accepting a financial offer, check fees, conditions, provider identity, and whether promised returns sound implausibly high. Do not borrow or invest based only on pressure or referral promises.",
        "Practice: list three questions to ask before committing money to a financial product."
      ]}
    ],
    questions: [
      { id: "financial-literacy-record-keeping-q1", prompt: "What is a budget used for?", options: ["Planning income and spending", "Guaranteeing income", "Hiding transactions", "Replacing all receipts"], answerIndex: 0, explanation: "A budget helps plan and monitor money over a defined period." },
      { id: "financial-literacy-record-keeping-q2", prompt: "Why reconcile records with statements?", options: ["To identify missing or incorrect transactions", "To make records less accurate", "To remove evidence", "To guarantee profit"], answerIndex: 0, explanation: "Reconciliation helps spot differences and correct errors." },
      { id: "financial-literacy-record-keeping-q3", prompt: "What is a sensible response to a guaranteed unusually high return?", options: ["Check the provider, risks, and terms carefully", "Send money immediately", "Ignore all fees", "Borrow as much as possible"], answerIndex: 0, explanation: "Unusually high guaranteed returns can be a warning sign; verify before committing." },
      { id: "financial-literacy-record-keeping-q4", prompt: "Why separate business and personal spending?", options: ["It improves clarity and record keeping", "It guarantees no losses", "It removes tax obligations", "It makes receipts unnecessary"], answerIndex: 0, explanation: "Separate records make it easier to understand business performance." }
    ]
  },
  {
    id: "entrepreneurship-business-planning",
    title: "Entrepreneurship & Business Planning",
    category: "Business & Entrepreneurship",
    description: "Turn a business idea into a simple plan with customer research, operations, costs, and milestones.",
    level: "Beginner",
    priceKsh: 700,
    published: true,
    lessons: [
      { id: "validate-idea", title: "Test a business idea", minutes: 9, content: [
        "A business idea should address a real customer need. Identify who experiences the problem, how they solve it today, and what could make your offer useful or different.",
        "Interview potential customers and test a small version of the offer before investing heavily. Positive comments are useful, but actual behaviour and purchases provide stronger evidence.",
        "Practice: write three questions you could ask potential customers without leading them toward a preferred answer."
      ]},
      { id: "simple-business-plan", title: "Write a simple business plan", minutes: 11, content: [
        "A practical plan describes the customer, product or service, value offered, pricing, sales channels, costs, operations, and risks. Keep assumptions visible so they can be tested.",
        "Set measurable milestones such as completing customer interviews, making a first sale, or reaching a target repeat-purchase rate. Assign a date and resource estimate to each milestone.",
        "Practice: outline a one-page plan for a small business idea."
      ]},
      { id: "customer-service-growth", title: "Serve customers and improve", minutes: 9, content: [
        "Explain the offer accurately, set clear expectations, respond respectfully, and provide a practical way for customers to ask questions or raise concerns.",
        "Track complaints, repeat purchases, and common questions. Use feedback to improve the product or process rather than making promises you cannot keep.",
        "Practice: draft a respectful response to a customer who received an order later than expected."
      ]}
    ],
    questions: [
      { id: "entrepreneurship-business-planning-q1", prompt: "What is a good way to validate a business idea?", options: ["Talk to likely customers and test a small offer", "Assume everyone will buy", "Spend the full budget immediately", "Avoid feedback"], answerIndex: 0, explanation: "Customer research and small tests help check demand before larger commitments." },
      { id: "entrepreneurship-business-planning-q2", prompt: "What belongs in a simple business plan?", options: ["Customers, offer, costs, channels, and risks", "Only a business name", "Only a logo colour", "Unverified promises of income"], answerIndex: 0, explanation: "A plan describes how the business will serve customers and operate." },
      { id: "entrepreneurship-business-planning-q3", prompt: "Why set milestones?", options: ["To track progress toward specific goals", "To guarantee success", "To avoid measuring results", "To hide delays"], answerIndex: 0, explanation: "Milestones make progress and next steps easier to assess." },
      { id: "entrepreneurship-business-planning-q4", prompt: "How should a business handle a customer complaint?", options: ["Listen, respond respectfully, and seek a practical resolution", "Blame the customer immediately", "Delete all feedback", "Promise anything regardless of ability"], answerIndex: 0, explanation: "A fair, honest response helps resolve issues and build trust." }
    ]
  },
  {
    id: "ecommerce-online-selling",
    title: "E-commerce & Online Selling",
    category: "Business & Entrepreneurship",
    description: "Learn the basics of presenting products online, managing orders, and building buyer trust.",
    level: "Beginner",
    priceKsh: 700,
    published: true,
    lessons: [
      { id: "product-listings", title: "Create clear product listings", minutes: 9, content: [
        "A useful listing includes an accurate title, clear photos, key features, condition, price, availability, and delivery or collection terms. Do not hide important limitations.",
        "Use photos you have permission to use and avoid misleading edits. Make sure the price and product description match what you can actually supply.",
        "Practice: draft a listing for a sample product with five useful details a buyer would need."
      ]},
      { id: "orders-and-delivery", title: "Manage orders and delivery", minutes: 10, content: [
        "Keep a clear record of order number, product, quantity, customer contact details, payment status, and fulfilment status. Limit access to personal data and retain it only as needed.",
        "Communicate expected delivery times and what happens if an item is unavailable. Use a reliable process for confirming payment rather than trusting screenshots alone.",
        "Practice: design a simple order-status checklist from order received to delivered."
      ]},
      { id: "trust-and-disputes", title: "Build trust and handle disputes", minutes: 9, content: [
        "Publish clear return, refund, delivery, and contact information appropriate to your business and applicable rules. Respond to questions honestly and avoid fake reviews.",
        "Keep records of orders and customer communication. If a dispute occurs, review the evidence, explain the next step, and follow the agreed policy and provider procedures.",
        "Practice: write a short, calm message explaining a verified delivery delay and the available options."
      ]}
    ],
    questions: [
      { id: "ecommerce-online-selling-q1", prompt: "What makes an online product listing trustworthy?", options: ["Accurate details and clear terms", "Hidden extra charges", "Copied photos used without permission", "Unrealistic claims"], answerIndex: 0, explanation: "Accurate listings help customers make informed decisions." },
      { id: "ecommerce-online-selling-q2", prompt: "Why keep order records?", options: ["To track payment and fulfilment accurately", "To publish customer details publicly", "To replace all customer communication", "To guarantee every delivery is instant"], answerIndex: 0, explanation: "Order records help coordinate payment, stock, and delivery." },
      { id: "ecommerce-online-selling-q3", prompt: "What is a sound way to confirm a payment?", options: ["Check the official provider or account records", "Rely only on a screenshot", "Trust any forwarded message", "Ship before checking any required payment"], answerIndex: 0, explanation: "Independent confirmation reduces the risk of forged payment evidence." },
      { id: "ecommerce-online-selling-q4", prompt: "How should a seller respond to a dispute?", options: ["Review records and follow clear policies", "Invent a new charge", "Ignore the buyer forever", "Publish private customer information"], answerIndex: 0, explanation: "Fair handling relies on evidence, clear communication, and appropriate policies." }
    ]
  },
  {
    id: "leadership-communication",
    title: "Leadership & Communication",
    category: "Professional & Technical Skills",
    description: "Practice clear workplace communication, teamwork, goal setting, and constructive feedback.",
    level: "Beginner",
    priceKsh: 500,
    published: true,
    lessons: [
      { id: "clear-communication", title: "Communicate clearly", minutes: 8, content: [
        "Clear communication states the purpose, relevant facts, requested action, and deadline when needed. Adapt the level of detail and language to the audience.",
        "Listen without interrupting, ask clarifying questions, and summarise important agreements. Written messages should make the next step easy to understand.",
        "Practice: rewrite a vague work message so it states the task, owner, and due date."
      ]},
      { id: "teamwork-conflict", title: "Work through disagreement", minutes: 10, content: [
        "Focus on the issue and observable facts rather than personal attacks. Ask each person to explain their concern and identify the shared outcome.",
        "Agree on practical actions, responsibilities, and a follow-up time. Escalate serious safety, harassment, or misconduct concerns through the appropriate channels.",
        "Practice: outline a respectful response when two team members disagree about a deadline."
      ]},
      { id: "goals-and-feedback", title: "Set goals and use feedback", minutes: 9, content: [
        "Useful goals are specific and time-bound, with a clear way to measure progress. Break a large task into smaller actions and review progress regularly.",
        "Give feedback about specific behaviour and its impact, then discuss a constructive next step. Receive feedback by asking questions and deciding what can be applied.",
        "Practice: set one measurable learning goal for the next four weeks."
      ]}
    ],
    questions: [
      { id: "leadership-communication-q1", prompt: "What makes a work message clear?", options: ["Purpose, action, and relevant deadline", "Unexplained abbreviations only", "No context at all", "Several unrelated requests mixed together"], answerIndex: 0, explanation: "A clear message helps the reader understand what is needed and when." },
      { id: "leadership-communication-q2", prompt: "What is a constructive way to handle disagreement?", options: ["Discuss facts and shared outcomes respectfully", "Attack the other person", "Spread rumours", "Avoid every decision"], answerIndex: 0, explanation: "Respectful discussion helps identify options and agree on actions." },
      { id: "leadership-communication-q3", prompt: "What is a measurable goal?", options: ["A goal with a clear indicator and timeframe", "A wish with no next step", "A task no one owns", "A promise of guaranteed success"], answerIndex: 0, explanation: "Measures and timeframes make progress easier to evaluate." },
      { id: "leadership-communication-q4", prompt: "How should feedback be given?", options: ["Describe specific behaviour and a constructive next step", "Use personal insults", "Make claims without examples", "Avoid explaining the impact"], answerIndex: 0, explanation: "Specific, respectful feedback is easier to understand and act on." }
    ]
  },
  {
    id: "freelancing-digital-careers",
    title: "Freelancing & Digital Careers",
    category: "Learning Pathways",
    description: "Explore digital career options, prepare a portfolio, and approach clients professionally.",
    level: "Beginner",
    priceKsh: 700,
    published: true,
    lessons: [
      { id: "choose-a-service", title: "Choose a realistic service", minutes: 9, content: [
        "Digital services may include writing, design, data entry, web work, customer support, or marketing. Match the service to your skills, equipment, available time, and the needs of a defined client group.",
        "Study examples of real job requirements and practise the tasks before promising delivery. Be honest about your experience and the results you can reasonably provide.",
        "Practice: choose one service and list three skills or sample tasks that demonstrate readiness."
      ]},
      { id: "portfolio-and-proposals", title: "Build a portfolio and proposal", minutes: 10, content: [
        "A portfolio can include original practice projects, volunteer work, or authorised examples. Clearly label practice work and never claim another person's work as your own.",
        "A proposal should summarise the client's need, the deliverable, scope, timeline, price, assumptions, and revision process. Confirm terms before starting work.",
        "Practice: draft a short proposal for a clearly defined sample task."
      ]},
      { id: "avoid-work-scams", title: "Find work safely and manage clients", minutes: 9, content: [
        "Be cautious when a supposed employer asks for upfront fees to unlock a job, requests sensitive codes, or promises unusually high pay for little work. Verify the client and platform independently.",
        "Keep agreed scope and payment terms in writing. Protect client information, meet realistic deadlines, and communicate early if a task is at risk.",
        "Practice: list questions to verify a client and agree on a task before beginning."
      ]}
    ],
    questions: [
      { id: "freelancing-digital-careers-q1", prompt: "What is a good first step toward freelancing?", options: ["Choose a service you can demonstrate and research client needs", "Claim skills you do not have", "Pay anyone who promises guaranteed work", "Send passwords to clients"], answerIndex: 0, explanation: "A realistic service and demonstrable skills help set honest expectations." },
      { id: "freelancing-digital-careers-q2", prompt: "What should a proposal include?", options: ["Scope, deliverables, timeline, and price", "Only a vague promise", "A client's private password", "Unrelated personal details"], answerIndex: 0, explanation: "Clear proposals reduce misunderstandings about work and payment." },
      { id: "freelancing-digital-careers-q3", prompt: "What can indicate a job scam?", options: ["Upfront fee pressure and unrealistic promises", "A clear task description", "A written scope of work", "A verifiable client history"], answerIndex: 0, explanation: "Upfront fee demands and unrealistic promises warrant careful verification." },
      { id: "freelancing-digital-careers-q4", prompt: "How should practice work be presented in a portfolio?", options: ["Label it honestly and use work you have rights to share", "Claim it was paid client work", "Copy another freelancer's work", "Publish confidential client files"], answerIndex: 0, explanation: "Honest attribution and permission protect trust and intellectual property." }
    ]
  }
];

export function findAcademyCourse(courseId: string) {
  return ACADEMY_COURSES.find((course) => course.id === courseId && course.published) ?? null;
}
