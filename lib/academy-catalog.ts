export type AcademyLesson = {
  id: string;
  title: string;
  minutes: number;
  content: string[];
};

type AcademyQuestion = {
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
    level: "Foundation",
    priceKsh: 300,
    published: true,
    lessons: [
      { id: "digital-devices", title: "Understanding digital devices", minutes: 8, content: [
          "A digital device accepts input, processes information, stores data, and produces output. A smartphone, laptop, tablet, and desktop computer can all help you communicate, learn, create documents, and manage work.",
          "Keep devices updated, use a screen lock, install apps from trusted stores, and back up important files. Avoid using unknown USB drives or installing software from suspicious pop-ups.",
          "Practice: identify one device you use, three tasks it helps you complete, and one action you can take to protect the information stored on it.",
          "LEARNING TARGETS — In “Understanding digital devices”, learn the central idea in Digital Foundations, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — A digital device accepts input, processes information, stores data and produces output. The physical parts are hardware; the instructions and applications are software. Understanding this cycle helps you choose a device, organise files and avoid common online mistakes.",
          "KEY WORDS — input — information supplied to a system; processing — work the device performs on information; output — the result shown or produced; storage — keeping information for later use; browser — an application used to open websites. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Name the task and choose a suitable device or app. 2) Enter information carefully and give files meaningful names. 3) Save the work in a known folder and reopen it to confirm it is there. 4) Check a website address and source before trusting or sharing information. 5) On a shared device, sign out and never save passwords for the next person.",
          "WORKED EXAMPLE — To submit an assignment, open a word processor, type the work, save it in a named folder, reopen it to verify the file and upload that exact file. The keyboard is input, the app processes the text, the screen displays output and the drive stores the file.",
          "GUIDED PRACTICE — Create a folder called Practice. Save a one-paragraph document, reopen it, rename it clearly and list the input, processing, output and storage involved.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Reopen the saved file, check the full filename and location, and independently verify the address of any website used.",
          "COMMON MISTAKES — assuming a file is saved because it is visible on screen; confusing a browser with the internet connection; clicking urgent links without checking the domain; sharing passwords or verification codes. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "internet-search", title: "Using the internet and searching well", minutes: 10, content: [
          "A web browser opens websites; a search engine helps discover pages. Use specific keywords, compare more than one trustworthy source, check publication dates, and distinguish advertisements from independent information.",
          "Before entering personal details, check the website address and connection. A padlock does not prove that a business is honest, so still confirm the organisation and the purpose of the page.",
          "Practice: search for a topic, open two relevant sources, and write down which source is more reliable and why.",
          "TODAY’S SKILL — Use Using the internet and searching well to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Name the task and choose a suitable device or app. 2) Enter information carefully and give files meaningful names. 3) Save the work in a known folder and reopen it to confirm it is there. 4) Check a website address and source before trusting or sharing information. 5) On a shared device, sign out and never save passwords for the next person.",
          "WATCH A MODEL — To submit an assignment, open a word processor, type the work, save it in a named folder, reopen it to verify the file and upload that exact file. The keyboard is input, the app processes the text, the screen displays output and the drive stores the file.",
          "TRY IT YOURSELF — Create a folder called Practice. Save a one-paragraph document, reopen it, rename it clearly and list the input, processing, output and storage involved. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Reopen the saved file, check the full filename and location, and independently verify the address of any website used.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "online-safety", title: "Passwords, privacy and scams", minutes: 10, content: [
          "Use a long, unique password or passphrase for each important account. A password manager can help you keep them safely. Enable multi-factor authentication when available, especially for email and financial accounts.",
          "Phishing messages often create urgency, promise unexpected rewards, or ask you to reveal a password or one-time code. Do not click suspicious links. Open the official app or type the known address yourself and confirm through a trusted channel.",
          "Never share a one-time password, PIN, or recovery code with a caller or message sender. Report suspicious messages through the service's official reporting tools.",
          "Practice: list three warning signs of a suspicious message and what you would do before responding.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Digital Foundations in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: input — information supplied to a system; processing — work the device performs on information; output — the result shown or produced; storage — keeping information for later use; browser — an application used to open websites. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Create a folder called Practice. Save a one-paragraph document, reopen it, rename it clearly and list the input, processing, output and storage involved.",
          "EXPLAIN YOUR REASONING — To submit an assignment, open a word processor, type the work, save it in a named folder, reopen it to verify the file and upload that exact file. The keyboard is input, the app processes the text, the screen displays output and the drive stores the file. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Reopen the saved file, check the full filename and location, and independently verify the address of any website used.",
          "ERROR SPOTTING — Look for these common mistakes: assuming a file is saved because it is visible on screen; confusing a browser with the internet connection; clicking urgent links without checking the domain; sharing passwords or verification codes. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Create a three-folder filing system and write down where one document, one image and one downloaded PDF belong."
        ]}
    ,
        {
          "id": "digital-foundations-lesson-4",
          "title": "Planning and setting goals in Digital Foundations",
          "minutes": 8,
          "content": [
              "Start by identifying what you need to learn and what you should be able to do after studying Digital Foundations.",
              "Break the learning goal into small tasks. Put the most important task first and set a realistic time for completing it.",
              "Write down your starting point, the resources you need, and a simple way to measure progress.",
              "Practice: write one clear learning goal and three steps you can take to achieve it.",
              "LESSON FOCUS — Files, folders and search. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Use folders to group related work, descriptive names to identify versions, and search terms that match the information you need. Check file extensions and the save location before deleting or moving files.",
              "FOLLOW THE METHOD — 1) Name the task and choose a suitable device or app. 2) Enter information carefully and give files meaningful names. 3) Save the work in a known folder and reopen it to confirm it is there. 4) Check a website address and source before trusting or sharing information. 5) On a shared device, sign out and never save passwords for the next person.",
              "WORKED EXAMPLE — Save a résumé as Maxwell_Okeri_CV_2026.docx in a CV folder, then reopen that copy rather than editing an unknown duplicate.",
              "PRACTICE TASK — Create a three-folder filing system and write down where one document, one image and one downloaded PDF belong.",
              "COMMON MISTAKES TO AVOID — assuming a file is saved because it is visible on screen; confusing a browser with the internet connection; clicking urgent links without checking the domain; sharing passwords or verification codes. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Reopen the saved file, check the full filename and location, and independently verify the address of any website used. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "digital-foundations-lesson-5",
          "title": "Practical application of Digital Foundations",
          "minutes": 10,
          "content": [
              "Use the concepts from Digital Foundations to solve a small, realistic problem rather than only memorising definitions.",
              "Gather the information you need, check that it is reliable, and choose a method that fits the task.",
              "Work through the task carefully. Check the result, correct mistakes, and record what you learned.",
              "Practice: describe a real situation where you could apply this subject and explain the steps you would follow.",
              "LESSON FOCUS — Computer input, processing, output and storage. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A system receives input through devices such as a keyboard or microphone, processes instructions through its processor and software, provides output through a screen or speaker, and stores information in memory or a drive. These functions work together but are not interchangeable.",
              "FOLLOW THE METHOD — 1) Name the task and choose a suitable device or app. 2) Enter information carefully and give files meaningful names. 3) Save the work in a known folder and reopen it to confirm it is there. 4) Check a website address and source before trusting or sharing information. 5) On a shared device, sign out and never save passwords for the next person.",
              "WORKED EXAMPLE — Typing a calculation is input; the calculator app processes it; the screen shows the answer; saving the result stores it for later.",
              "PRACTICE TASK — Label the four functions on a simple computer drawing and give one everyday example of each.",
              "COMMON MISTAKES TO AVOID — assuming a file is saved because it is visible on screen; confusing a browser with the internet connection; clicking urgent links without checking the domain; sharing passwords or verification codes. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Reopen the saved file, check the full filename and location, and independently verify the address of any website used. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "digital-foundations-lesson-6",
          "title": "Review, improvement and responsible practice",
          "minutes": 8,
          "content": [
              "Review the key ideas you have learned about Digital Foundations and identify anything that remains unclear.",
              "Use feedback and evidence to improve your work. Do not treat an assumption as a verified fact.",
              "Respect privacy, follow relevant rules, and consider how your decisions affect other people.",
              "Practice: summarise three things you learned, one skill you need to practise, and one action you will take next.",
              "LESSON FOCUS — Safe browsing and account protection. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Treat unexpected links, attachments and requests for codes with caution. Check the domain independently, update software, use unique passwords and sign out of public devices.",
              "FOLLOW THE METHOD — 1) Name the task and choose a suitable device or app. 2) Enter information carefully and give files meaningful names. 3) Save the work in a known folder and reopen it to confirm it is there. 4) Check a website address and source before trusting or sharing information. 5) On a shared device, sign out and never save passwords for the next person.",
              "WORKED EXAMPLE — A message asks you to confirm an account urgently. Open the official service through a known address instead of using the message link.",
              "PRACTICE TASK — Make a five-item safe-browsing checklist and explain why each item matters.",
              "COMMON MISTAKES TO AVOID — assuming a file is saved because it is visible on screen; confusing a browser with the internet connection; clicking urgent links without checking the domain; sharing passwords or verification codes. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Reopen the saved file, check the full filename and location, and independently verify the address of any website used. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "df-q1", prompt: "What is a good way to protect important accounts?", options: ["Use one short password everywhere", "Use unique long passwords and multi-factor authentication", "Send your password to a friend", "Turn off every security update"], answerIndex: 1, explanation: "Unique strong passwords and multi-factor authentication make account takeover harder." },
      { id: "df-q2", prompt: "A message says your account will close in five minutes unless you share a code. What should you do?", options: ["Reply with the code", "Forward it to everyone", "Do not share the code; verify through the official service", "Click every link in the message"], answerIndex: 2, explanation: "Urgency and requests for one-time codes are common scam warning signs." },
      { id: "df-q3", prompt: "How should you assess information found online?", options: ["Trust the first result automatically", "Compare credible sources and check dates", "Trust any page with colourful graphics", "Ignore who published it"], answerIndex: 1, explanation: "Comparing reliable sources and checking dates helps assess accuracy and relevance." },
      { id: "df-q4", prompt: "What is a sensible way to protect files?", options: ["Back up important files and keep devices updated", "Disable all updates forever", "Use unknown USB drives", "Share every file publicly"], answerIndex: 0, explanation: "Updates and backups reduce security risks and help recover information." }
    ,
        {
          "id": "digital-foundations-q5",
          "prompt": "What is the best first step when beginning a task related to Digital Foundations?",
          "options": [
            "Start immediately without understanding the task",
            "Identify the goal and the information or resources needed",
            "Copy someone else's work without checking it",
            "Ignore the expected result"
          ],
          "answerIndex": 1,
          "explanation": "Clarifying the goal and required resources helps you plan and complete the task effectively."
        },
{
          "id": "digital-foundations-q6",
          "prompt": "How should you check information used in Digital Foundations?",
          "options": [
            "Accept the first claim you see",
            "Rely only on popularity",
            "Compare credible sources and check the evidence",
            "Ignore the date and context"
          ],
          "answerIndex": 2,
          "explanation": "Checking credible sources and evidence helps reduce errors and unsupported conclusions."
        },
{
          "id": "digital-foundations-q7",
          "prompt": "What is a useful way to improve a practical skill in Digital Foundations?",
          "options": [
            "Practise, review the result and learn from mistakes",
            "Avoid feedback",
            "Repeat errors without reviewing them",
            "Stop after the first attempt"
          ],
          "answerIndex": 0,
          "explanation": "Practice and review help learners identify weaknesses and improve their performance."
        },
{
          "id": "digital-foundations-q8",
          "prompt": "If a task in Digital Foundations does not produce the expected result, what should you do?",
          "options": [
            "Hide the result",
            "Blame others without checking the process",
            "Continue using the same method without review",
            "Check the steps, identify the cause and make a correction"
          ],
          "answerIndex": 3,
          "explanation": "Reviewing the process helps identify the cause of a problem and supports a better solution."
        },
{
          "id": "digital-foundations-q9",
          "prompt": "Which approach supports responsible work in Digital Foundations?",
          "options": [
            "Share private information freely",
            "Respect privacy, follow applicable rules and consider the impact",
            "Ignore safety concerns",
            "Present guesses as proven facts"
          ],
          "answerIndex": 1,
          "explanation": "Responsible practice includes protecting privacy, following relevant rules and communicating honestly."
        },
{
          "id": "digital-foundations-q10",
          "prompt": "How can you measure progress in Digital Foundations?",
          "options": [
            "Avoid checking your work",
            "Depend entirely on memory",
            "Compare your results with a clear goal or checklist",
            "Change the goal whenever work becomes difficult"
          ],
          "answerIndex": 2,
          "explanation": "A clear goal or checklist makes progress easier to review and areas for improvement easier to identify."
        }
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
          "Practice: write a one-sentence customer problem statement: 'For [customer], who needs [need], we offer [solution] that helps them [benefit].'",
          "LEARNING TARGETS — In “Start with a real customer need”, learn the central idea in Business Essentials, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — A business creates value by solving a customer problem and delivering a product or service reliably. Sales revenue is not the same as profit, and profit is not the same as cash available today. Good decisions connect customer demand, price, direct costs, overheads and cash timing.",
          "KEY WORDS — customer need — a problem worth solving; revenue — money earned from sales; direct cost — cost linked to providing a unit; overhead — business cost not tied to one unit; gross margin — selling price minus direct cost. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Describe the customer and the problem in plain language. 2) List alternatives and check whether people actually need the offer. 3) Calculate direct costs and list overheads separately. 4) Set a price and explain what it includes. 5) Record sales, expenses, payments due and cash received.",
          "WORKED EXAMPLE — A product costs KES 600 and sells for KES 900. The KES 300 difference is the amount left before transport, packaging, fees, rent and other overheads; it is not automatically net profit.",
          "GUIDED PRACTICE — Choose a familiar product. Write the customer need, price, at least three costs and the difference between price and direct cost. Add a note about which costs still need to be covered.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Recalculate every total, label each estimate, separate cash received from sales recorded, and check whether all costs have been included.",
          "COMMON MISTAKES — calling revenue profit; setting price without calculating costs; ignoring unpaid invoices or stock losses; assuming compliments prove demand. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "cost-pricing", title: "Costs, prices and margin", minutes: 10, content: [
          "Separate one-time setup costs from ongoing costs. Variable costs increase as you make or deliver more units; fixed costs are more stable over a period. Include transport, packaging, transaction charges, labour, and wastage where relevant.",
          "Sales revenue is the amount earned from sales. Gross profit is usually revenue minus the direct cost of the goods or services sold. A markup and a profit margin are not the same calculation; know which one you are using before setting a price.",
          "Practice: if a product sells for KES 800 and its direct cost is KES 500, the gross amount left before other expenses is KES 300. This is not necessarily the final net profit.",
          "TODAY’S SKILL — Use Costs, prices and margin to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Describe the customer and the problem in plain language. 2) List alternatives and check whether people actually need the offer. 3) Calculate direct costs and list overheads separately. 4) Set a price and explain what it includes. 5) Record sales, expenses, payments due and cash received.",
          "WATCH A MODEL — A product costs KES 600 and sells for KES 900. The KES 300 difference is the amount left before transport, packaging, fees, rent and other overheads; it is not automatically net profit.",
          "TRY IT YOURSELF — Choose a familiar product. Write the customer need, price, at least three costs and the difference between price and direct cost. Add a note about which costs still need to be covered. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Recalculate every total, label each estimate, separate cash received from sales recorded, and check whether all costs have been included.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "cash-records", title: "Cash flow and simple records", minutes: 9, content: [
          "Profit and cash flow are different. A sale made on credit may count as revenue before the money arrives. A business can appear profitable and still struggle to pay bills if cash arrives late.",
          "Record each transaction with a date, description, amount, payment method, and supporting receipt. Reconcile records with cash and account statements regularly, and keep business funds separate from personal spending where possible.",
          "Practice: prepare a simple daily log of opening cash, receipts, payments, and closing cash. Do not treat uncollected money as cash already available.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Business Essentials in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: customer need — a problem worth solving; revenue — money earned from sales; direct cost — cost linked to providing a unit; overhead — business cost not tied to one unit; gross margin — selling price minus direct cost. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Choose a familiar product. Write the customer need, price, at least three costs and the difference between price and direct cost. Add a note about which costs still need to be covered.",
          "EXPLAIN YOUR REASONING — A product costs KES 600 and sells for KES 900. The KES 300 difference is the amount left before transport, packaging, fees, rent and other overheads; it is not automatically net profit. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Recalculate every total, label each estimate, separate cash received from sales recorded, and check whether all costs have been included.",
          "ERROR SPOTTING — Look for these common mistakes: calling revenue profit; setting price without calculating costs; ignoring unpaid invoices or stock losses; assuming compliments prove demand. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Describe one customer, their problem, the current alternative and the benefit your offer would deliver."
        ]}
    ,
        {
          "id": "business-essentials-lesson-4",
          "title": "Planning and setting goals in Business Essentials",
          "minutes": 8,
          "content": [
              "Start by identifying what you need to learn and what you should be able to do after studying Business Essentials.",
              "Break the learning goal into small tasks. Put the most important task first and set a realistic time for completing it.",
              "Write down your starting point, the resources you need, and a simple way to measure progress.",
              "Practice: write one clear learning goal and three steps you can take to achieve it.",
              "LESSON FOCUS — Customer needs and value proposition. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A useful offer connects one customer group, one specific problem and a benefit the customer can recognise. Ask about existing behaviour and alternatives; do not rely only on people saying that an idea sounds good.",
              "FOLLOW THE METHOD — 1) Describe the customer and the problem in plain language. 2) List alternatives and check whether people actually need the offer. 3) Calculate direct costs and list overheads separately. 4) Set a price and explain what it includes. 5) Record sales, expenses, payments due and cash received.",
              "WORKED EXAMPLE — A commuter may need breakfast that is affordable, safe to eat on the way and ready before work. That need is more specific than “people like food.”",
              "PRACTICE TASK — Describe one customer, their problem, the current alternative and the benefit your offer would deliver.",
              "COMMON MISTAKES TO AVOID — calling revenue profit; setting price without calculating costs; ignoring unpaid invoices or stock losses; assuming compliments prove demand. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Recalculate every total, label each estimate, separate cash received from sales recorded, and check whether all costs have been included. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "business-essentials-lesson-5",
          "title": "Practical application of Business Essentials",
          "minutes": 10,
          "content": [
              "Use the concepts from Business Essentials to solve a small, realistic problem rather than only memorising definitions.",
              "Gather the information you need, check that it is reliable, and choose a method that fits the task.",
              "Work through the task carefully. Check the result, correct mistakes, and record what you learned.",
              "Practice: describe a real situation where you could apply this subject and explain the steps you would follow.",
              "LESSON FOCUS — Costs, price and break-even thinking. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Separate variable costs that change with units from fixed or period costs. The selling price must cover unit costs and contribute towards overheads. Break-even analysis depends on assumptions about price, cost and volume, so state those assumptions.",
              "FOLLOW THE METHOD — 1) Describe the customer and the problem in plain language. 2) List alternatives and check whether people actually need the offer. 3) Calculate direct costs and list overheads separately. 4) Set a price and explain what it includes. 5) Record sales, expenses, payments due and cash received.",
              "WORKED EXAMPLE — At a KES 900 price and KES 600 direct cost, KES 300 remains per unit before overheads. If monthly overheads were KES 6,000, the simplified break-even point would be 20 units, assuming the margin and costs stay constant.",
              "PRACTICE TASK — Create a small table for 1, 10 and 20 sales. Show revenue, direct costs and the amount left before overheads.",
              "COMMON MISTAKES TO AVOID — calling revenue profit; setting price without calculating costs; ignoring unpaid invoices or stock losses; assuming compliments prove demand. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Recalculate every total, label each estimate, separate cash received from sales recorded, and check whether all costs have been included. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "business-essentials-lesson-6",
          "title": "Review, improvement and responsible practice",
          "minutes": 8,
          "content": [
              "Review the key ideas you have learned about Business Essentials and identify anything that remains unclear.",
              "Use feedback and evidence to improve your work. Do not treat an assumption as a verified fact.",
              "Respect privacy, follow relevant rules, and consider how your decisions affect other people.",
              "Practice: summarise three things you learned, one skill you need to practise, and one action you will take next.",
              "LESSON FOCUS — Cash flow and simple business records. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A cash record shows when money actually moves. An invoice may create a sale today but cash might arrive later; rent or stock may require payment now. A dated cashbook makes shortages and overdue payments visible early.",
              "FOLLOW THE METHOD — 1) Describe the customer and the problem in plain language. 2) List alternatives and check whether people actually need the offer. 3) Calculate direct costs and list overheads separately. 4) Set a price and explain what it includes. 5) Record sales, expenses, payments due and cash received.",
              "WORKED EXAMPLE — Selling KES 5,000 on credit improves recorded sales but does not put KES 5,000 into the till until the customer pays.",
              "PRACTICE TASK — Use fictional weekly figures to list opening cash, receipts, payments and closing cash. Verify the closing balance with arithmetic.",
              "COMMON MISTAKES TO AVOID — calling revenue profit; setting price without calculating costs; ignoring unpaid invoices or stock losses; assuming compliments prove demand. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Recalculate every total, label each estimate, separate cash received from sales recorded, and check whether all costs have been included. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "be-q1", prompt: "What is a sensible first step for a new business idea?", options: ["Buy large quantities immediately", "Understand a specific customer's need", "Set a price without estimating costs", "Ignore existing alternatives"], answerIndex: 1, explanation: "A business should understand the customer need before committing significant resources." },
      { id: "be-q2", prompt: "A product sells for KES 800 and direct cost is KES 500. What remains before other expenses?", options: ["KES 1,300", "KES 800", "KES 300", "KES 500"], answerIndex: 2, explanation: "KES 800 minus KES 500 equals KES 300 before other expenses." },
      { id: "be-q3", prompt: "Why keep transaction records?", options: ["To hide spending", "To understand income, costs, and cash", "To avoid issuing receipts", "To guarantee every sale is profitable"], answerIndex: 1, explanation: "Good records support decisions, accountability, and cash management." },
      { id: "be-q4", prompt: "Why can a business with sales still have cash problems?", options: ["All sales arrive instantly", "Customers may pay later while bills are due now", "Records are never useful", "Costs do not need payment"], answerIndex: 1, explanation: "Cash can be delayed while expenses remain due, creating a timing gap." }
    ,
        {
          "id": "business-essentials-q5",
          "prompt": "What is the best first step when beginning a task related to Business Essentials?",
          "options": [
            "Start immediately without understanding the task",
            "Identify the goal and the information or resources needed",
            "Copy someone else's work without checking it",
            "Ignore the expected result"
          ],
          "answerIndex": 1,
          "explanation": "Clarifying the goal and required resources helps you plan and complete the task effectively."
        },
{
          "id": "business-essentials-q6",
          "prompt": "How should you check information used in Business Essentials?",
          "options": [
            "Accept the first claim you see",
            "Rely only on popularity",
            "Compare credible sources and check the evidence",
            "Ignore the date and context"
          ],
          "answerIndex": 2,
          "explanation": "Checking credible sources and evidence helps reduce errors and unsupported conclusions."
        },
{
          "id": "business-essentials-q7",
          "prompt": "What is a useful way to improve a practical skill in Business Essentials?",
          "options": [
            "Practise, review the result and learn from mistakes",
            "Avoid feedback",
            "Repeat errors without reviewing them",
            "Stop after the first attempt"
          ],
          "answerIndex": 0,
          "explanation": "Practice and review help learners identify weaknesses and improve their performance."
        },
{
          "id": "business-essentials-q8",
          "prompt": "If a task in Business Essentials does not produce the expected result, what should you do?",
          "options": [
            "Hide the result",
            "Blame others without checking the process",
            "Continue using the same method without review",
            "Check the steps, identify the cause and make a correction"
          ],
          "answerIndex": 3,
          "explanation": "Reviewing the process helps identify the cause of a problem and supports a better solution."
        },
{
          "id": "business-essentials-q9",
          "prompt": "Which approach supports responsible work in Business Essentials?",
          "options": [
            "Share private information freely",
            "Respect privacy, follow applicable rules and consider the impact",
            "Ignore safety concerns",
            "Present guesses as proven facts"
          ],
          "answerIndex": 1,
          "explanation": "Responsible practice includes protecting privacy, following relevant rules and communicating honestly."
        },
{
          "id": "business-essentials-q10",
          "prompt": "How can you measure progress in Business Essentials?",
          "options": [
            "Avoid checking your work",
            "Depend entirely on memory",
            "Compare your results with a clear goal or checklist",
            "Change the goal whenever work becomes difficult"
          ],
          "answerIndex": 2,
          "explanation": "A clear goal or checklist makes progress easier to review and areas for improvement easier to identify."
        }
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
          "Practice: name one task where AI could help you save time and one important fact you would independently verify.",
          "LEARNING TARGETS — In “What AI can and cannot do”, learn the central idea in AI Literacy Basics, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — AI systems learn patterns from data and generate predictions or content. A fluent answer may still contain false facts, made-up references or outdated details. AI is most useful when the task is clear and the person checks the output against reliable evidence.",
          "KEY WORDS — model — a system trained to produce outputs; prompt — instructions and context given to a model; hallucination — output presented as fact without reliable support; training data — examples used in model development; verification — checking a claim independently. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Define the task, audience and output format. 2) Give useful context and constraints without sharing secrets. 3) Ask for a structured draft or explanation. 4) Verify important facts, calculations and references. 5) Edit the response and take responsibility for the final result.",
          "WORKED EXAMPLE — Ask an AI tool to prepare a study timetable. Check that all subjects are included, the time adds up, dates are correct and the plan fits real commitments before using it.",
          "GUIDED PRACTICE — Write a vague prompt and then a clearer prompt naming the audience, purpose, format and limits. Compare the answers and verify three factual claims.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Trace important facts to dependable sources, redo calculations and compare the output with the original instructions.",
          "COMMON MISTAKES — trusting confident wording as proof; assuming a generated reference exists; pasting private data into an unapproved tool; submitting generated work against learning rules. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "better-prompts", title: "Write useful prompts", minutes: 10, content: [
          "A useful prompt states the goal, the relevant context, the intended audience, the format, and any constraints. Instead of 'help with business', try 'draft a one-page checklist for a small shop to record daily sales and expenses'.",
          "Provide examples or criteria when appropriate. Ask for a structured answer, then iterate: point out what is missing, request revisions, and check that the result meets your need.",
          "Do not paste passwords, payment details, private customer information, or confidential company documents into an AI service unless the service and your organisation's rules permit it.",
          "Practice: rewrite a vague request into a specific task with an audience and output format.",
          "TODAY’S SKILL — Use Write useful prompts to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Define the task, audience and output format. 2) Give useful context and constraints without sharing secrets. 3) Ask for a structured draft or explanation. 4) Verify important facts, calculations and references. 5) Edit the response and take responsibility for the final result.",
          "WATCH A MODEL — Ask an AI tool to prepare a study timetable. Check that all subjects are included, the time adds up, dates are correct and the plan fits real commitments before using it.",
          "TRY IT YOURSELF — Write a vague prompt and then a clearer prompt naming the audience, purpose, format and limits. Compare the answers and verify three factual claims. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Trace important facts to dependable sources, redo calculations and compare the output with the original instructions.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "verify-ai", title: "Verify output and use AI responsibly", minutes: 10, content: [
          "Check factual claims against credible sources, especially legal, financial, medical, and safety-related information. For code, run tests and review what the code can access before using it with real data.",
          "Respect privacy, intellectual property, and the rights of people represented in content. Disclose AI assistance when required by your school, employer, client, or publisher.",
          "Practice: take one AI-generated claim and list a trustworthy source or test that could confirm or challenge it.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain AI Literacy Basics in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: model — a system trained to produce outputs; prompt — instructions and context given to a model; hallucination — output presented as fact without reliable support; training data — examples used in model development; verification — checking a claim independently. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Write a vague prompt and then a clearer prompt naming the audience, purpose, format and limits. Compare the answers and verify three factual claims.",
          "EXPLAIN YOUR REASONING — Ask an AI tool to prepare a study timetable. Check that all subjects are included, the time adds up, dates are correct and the plan fits real commitments before using it. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Trace important facts to dependable sources, redo calculations and compare the output with the original instructions.",
          "ERROR SPOTTING — Look for these common mistakes: trusting confident wording as proof; assuming a generated reference exists; pasting private data into an unapproved tool; submitting generated work against learning rules. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — List two tasks where AI may help and two decisions that need independent human judgement."
        ]}
    ,
        {
          "id": "ai-literacy-basics-lesson-4",
          "title": "Planning and setting goals in AI Literacy Basics",
          "minutes": 8,
          "content": [
              "Start by identifying what you need to learn and what you should be able to do after studying AI Literacy Basics.",
              "Break the learning goal into small tasks. Put the most important task first and set a realistic time for completing it.",
              "Write down your starting point, the resources you need, and a simple way to measure progress.",
              "Practice: write one clear learning goal and three steps you can take to achieve it.",
              "LESSON FOCUS — What AI can and cannot do. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Pattern recognition can help summarise, classify, draft or brainstorm, but a model may not know whether a generated detail is true. Performance depends on the task, prompt, available context and model limitations.",
              "FOLLOW THE METHOD — 1) Define the task, audience and output format. 2) Give useful context and constraints without sharing secrets. 3) Ask for a structured draft or explanation. 4) Verify important facts, calculations and references. 5) Edit the response and take responsibility for the final result.",
              "WORKED EXAMPLE — An AI can draft an explanation of photosynthesis, but the learner should check the scientific terms against the course text and correct mistakes.",
              "PRACTICE TASK — List two tasks where AI may help and two decisions that need independent human judgement.",
              "COMMON MISTAKES TO AVOID — trusting confident wording as proof; assuming a generated reference exists; pasting private data into an unapproved tool; submitting generated work against learning rules. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Trace important facts to dependable sources, redo calculations and compare the output with the original instructions. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "ai-literacy-basics-lesson-5",
          "title": "Practical application of AI Literacy Basics",
          "minutes": 10,
          "content": [
              "Use the concepts from AI Literacy Basics to solve a small, realistic problem rather than only memorising definitions.",
              "Gather the information you need, check that it is reliable, and choose a method that fits the task.",
              "Work through the task carefully. Check the result, correct mistakes, and record what you learned.",
              "Practice: describe a real situation where you could apply this subject and explain the steps you would follow.",
              "LESSON FOCUS — Writing precise prompts. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A strong prompt specifies the role or audience, goal, available context, required structure and constraints. Break a complex task into stages and request uncertainty or assumptions where relevant.",
              "FOLLOW THE METHOD — 1) Define the task, audience and output format. 2) Give useful context and constraints without sharing secrets. 3) Ask for a structured draft or explanation. 4) Verify important facts, calculations and references. 5) Edit the response and take responsibility for the final result.",
              "WORKED EXAMPLE — Instead of “help with business,” ask for a one-page cost checklist for a small bakery, in plain language, without inventing local prices.",
              "PRACTICE TASK — Improve a prompt by stating audience, objective, output format and three constraints.",
              "COMMON MISTAKES TO AVOID — trusting confident wording as proof; assuming a generated reference exists; pasting private data into an unapproved tool; submitting generated work against learning rules. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Trace important facts to dependable sources, redo calculations and compare the output with the original instructions. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "ai-literacy-basics-lesson-6",
          "title": "Review, improvement and responsible practice",
          "minutes": 8,
          "content": [
              "Review the key ideas you have learned about AI Literacy Basics and identify anything that remains unclear.",
              "Use feedback and evidence to improve your work. Do not treat an assumption as a verified fact.",
              "Respect privacy, follow relevant rules, and consider how your decisions affect other people.",
              "Practice: summarise three things you learned, one skill you need to practise, and one action you will take next.",
              "LESSON FOCUS — Verifying output responsibly. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Check sources, dates, calculations, bias, privacy and whether the tool has invented specifics. Treat the answer as a draft; high-impact medical, legal, financial or safety decisions require appropriate qualified advice.",
              "FOLLOW THE METHOD — 1) Define the task, audience and output format. 2) Give useful context and constraints without sharing secrets. 3) Ask for a structured draft or explanation. 4) Verify important facts, calculations and references. 5) Edit the response and take responsibility for the final result.",
              "WORKED EXAMPLE — If an answer quotes a statistic, locate the original publication and check the date, sample and definition before repeating it.",
              "PRACTICE TASK — Review a fictional AI answer and mark one claim to verify, one possible bias and one private detail that should not be entered.",
              "COMMON MISTAKES TO AVOID — trusting confident wording as proof; assuming a generated reference exists; pasting private data into an unapproved tool; submitting generated work against learning rules. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Trace important facts to dependable sources, redo calculations and compare the output with the original instructions. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "ai-q1", prompt: "What is a responsible way to use generative AI?", options: ["Assume every answer is correct", "Use it as assistance and verify important claims", "Share private passwords with it", "Ignore the final result"], answerIndex: 1, explanation: "AI can help but can also produce incorrect or incomplete outputs." },
      { id: "ai-q2", prompt: "Which prompt is more useful?", options: ["Do something", "Business", "Create a daily sales-record checklist for a small shop", "Write anything you want"], answerIndex: 2, explanation: "A clear goal and context guide the response toward a useful output." },
      { id: "ai-q3", prompt: "What should you do before using important AI-generated factual information?", options: ["Verify it against credible sources", "Delete every source", "Assume it is current", "Publish it without review"], answerIndex: 0, explanation: "Important claims should be checked, especially in high-impact contexts." },
      { id: "ai-q4", prompt: "Which information should generally not be pasted into an AI prompt?", options: ["A fictional example", "A public topic", "A generic formatting request", "Passwords and confidential personal data"], answerIndex: 3, explanation: "Avoid exposing sensitive or confidential information to services unless authorised." }
    ,
        {
          "id": "ai-literacy-basics-q5",
          "prompt": "What is the best first step when beginning a task related to AI Literacy Basics?",
          "options": [
            "Start immediately without understanding the task",
            "Identify the goal and the information or resources needed",
            "Copy someone else's work without checking it",
            "Ignore the expected result"
          ],
          "answerIndex": 1,
          "explanation": "Clarifying the goal and required resources helps you plan and complete the task effectively."
        },
{
          "id": "ai-literacy-basics-q6",
          "prompt": "How should you check information used in AI Literacy Basics?",
          "options": [
            "Accept the first claim you see",
            "Rely only on popularity",
            "Compare credible sources and check the evidence",
            "Ignore the date and context"
          ],
          "answerIndex": 2,
          "explanation": "Checking credible sources and evidence helps reduce errors and unsupported conclusions."
        },
{
          "id": "ai-literacy-basics-q7",
          "prompt": "What is a useful way to improve a practical skill in AI Literacy Basics?",
          "options": [
            "Practise, review the result and learn from mistakes",
            "Avoid feedback",
            "Repeat errors without reviewing them",
            "Stop after the first attempt"
          ],
          "answerIndex": 0,
          "explanation": "Practice and review help learners identify weaknesses and improve their performance."
        },
{
          "id": "ai-literacy-basics-q8",
          "prompt": "If a task in AI Literacy Basics does not produce the expected result, what should you do?",
          "options": [
            "Hide the result",
            "Blame others without checking the process",
            "Continue using the same method without review",
            "Check the steps, identify the cause and make a correction"
          ],
          "answerIndex": 3,
          "explanation": "Reviewing the process helps identify the cause of a problem and supports a better solution."
        },
{
          "id": "ai-literacy-basics-q9",
          "prompt": "Which approach supports responsible work in AI Literacy Basics?",
          "options": [
            "Share private information freely",
            "Respect privacy, follow applicable rules and consider the impact",
            "Ignore safety concerns",
            "Present guesses as proven facts"
          ],
          "answerIndex": 1,
          "explanation": "Responsible practice includes protecting privacy, following relevant rules and communicating honestly."
        },
{
          "id": "ai-literacy-basics-q10",
          "prompt": "How can you measure progress in AI Literacy Basics?",
          "options": [
            "Avoid checking your work",
            "Depend entirely on memory",
            "Compare your results with a clear goal or checklist",
            "Change the goal whenever work becomes difficult"
          ],
          "answerIndex": 2,
          "explanation": "A clear goal or checklist makes progress easier to review and areas for improvement easier to identify."
        }
      ]
  },
    {
    id: "digital-marketing-social-media",
    title: "Digital Marketing & Social Media",
    category: "Digital Marketing & Office Tools",
    description: "Plan useful content, understand audiences, and measure the performance of digital campaigns.",
    level: "Intermediate",
    priceKsh: 750,
    published: true,
    lessons: [
      { id: "marketing-goals", title: "Set goals and understand your audience", minutes: 9, content: [
          "Digital marketing uses online channels to reach and serve customers. Begin with a clear goal such as enquiries, store visits, sign-ups, or sales rather than posting without a purpose.",
          "Describe your audience by their needs, questions, location, and preferred channels. Use customer feedback and lawful, privacy-respecting insights instead of assumptions.",
          "Practice: choose one product, describe its likely audience, and write one measurable campaign goal.",
          "LEARNING TARGETS — In “Set goals and understand your audience”, learn the central idea in Digital Marketing & Social Media, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Marketing matches an offer to an audience with a real need. A campaign works best when it has one objective, one clear message, a suitable channel and a measure connected to that objective. Views and likes are signals, not automatic proof of sales.",
          "KEY WORDS — audience — people a message is intended to reach; value proposition — the benefit offered; call to action — what the viewer is invited to do; conversion — a desired action completed; reach — distinct people who saw a message. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Choose a target audience and one measurable objective. 2) Write a truthful benefit and supporting detail. 3) Choose a channel used by the intended audience. 4) Plan content, timing, budget and a single call to action. 5) Measure useful results and improve the next campaign.",
          "WORKED EXAMPLE — A bakery wants more birthday-cake enquiries. A post showing the cake, serving size, starting price and ordering method can be measured by qualified enquiries rather than likes alone.",
          "GUIDED PRACTICE — Draft three posts for one product: awareness, useful information and action. Give each one call to action and choose a meaningful success measure.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Verify prices, stock, spelling and links. Compare results with the campaign objective and respect consent and platform rules.",
          "COMMON MISTAKES — targeting everyone with one message; using likes as a substitute for business results; making unsupported claims; posting customer details without permission. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "content-planning", title: "Create a simple content plan", minutes: 10, content: [
          "Useful content answers customer questions, demonstrates value, or helps people make an informed decision. Mix educational posts, demonstrations, testimonials used with permission, and clear offers.",
          "Use a calendar to plan the topic, format, publishing date, call to action, and person responsible. Check spelling, prices, links, and permissions before publishing.",
          "Practice: plan three posts for one week, each with a different purpose and a clear next step.",
          "TODAY’S SKILL — Use Create a simple content plan to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Choose a target audience and one measurable objective. 2) Write a truthful benefit and supporting detail. 3) Choose a channel used by the intended audience. 4) Plan content, timing, budget and a single call to action. 5) Measure useful results and improve the next campaign.",
          "WATCH A MODEL — A bakery wants more birthday-cake enquiries. A post showing the cake, serving size, starting price and ordering method can be measured by qualified enquiries rather than likes alone.",
          "TRY IT YOURSELF — Draft three posts for one product: awareness, useful information and action. Give each one call to action and choose a meaningful success measure. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Verify prices, stock, spelling and links. Compare results with the campaign objective and respect consent and platform rules.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "measure-campaigns", title: "Measure and improve results", minutes: 9, content: [
          "Reach counts how many people were shown content; engagement records interactions; clicks show visits to a destination; conversions record a desired action. Choose metrics that match the campaign goal.",
          "Compare results over similar periods and test one change at a time when possible. Do not buy fake followers or misrepresent results to customers.",
          "Practice: decide which metric best measures a campaign designed to generate product enquiries.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Digital Marketing & Social Media in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: audience — people a message is intended to reach; value proposition — the benefit offered; call to action — what the viewer is invited to do; conversion — a desired action completed; reach — distinct people who saw a message. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Draft three posts for one product: awareness, useful information and action. Give each one call to action and choose a meaningful success measure.",
          "EXPLAIN YOUR REASONING — A bakery wants more birthday-cake enquiries. A post showing the cake, serving size, starting price and ordering method can be measured by qualified enquiries rather than likes alone. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Verify prices, stock, spelling and links. Compare results with the campaign objective and respect consent and platform rules.",
          "ERROR SPOTTING — Look for these common mistakes: targeting everyone with one message; using likes as a substitute for business results; making unsupported claims; posting customer details without permission. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Define one audience, one customer problem and a measurable campaign objective."
        ]}
    ,
        {
          "id": "digital-marketing-social-media-lesson-4",
          "title": "Planning and setting goals in Digital Marketing & Social Media",
          "minutes": 8,
          "content": [
              "Start by identifying what you need to learn and what you should be able to do after studying Digital Marketing & Social Media.",
              "Break the learning goal into small tasks. Put the most important task first and set a realistic time for completing it.",
              "Write down your starting point, the resources you need, and a simple way to measure progress.",
              "Practice: write one clear learning goal and three steps you can take to achieve it.",
              "LESSON FOCUS — Audience and campaign objectives. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A measurable objective describes an action and time period. Audience choices should be based on a real need and relevant behaviour rather than unsupported stereotypes.",
              "FOLLOW THE METHOD — 1) Choose a target audience and one measurable objective. 2) Write a truthful benefit and supporting detail. 3) Choose a channel used by the intended audience. 4) Plan content, timing, budget and a single call to action. 5) Measure useful results and improve the next campaign.",
              "WORKED EXAMPLE — “Receive 15 qualified quotation requests this month” is more useful than “get popular.”",
              "PRACTICE TASK — Define one audience, one customer problem and a measurable campaign objective.",
              "COMMON MISTAKES TO AVOID — targeting everyone with one message; using likes as a substitute for business results; making unsupported claims; posting customer details without permission. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Verify prices, stock, spelling and links. Compare results with the campaign objective and respect consent and platform rules. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "digital-marketing-social-media-lesson-5",
          "title": "Practical application of Digital Marketing & Social Media",
          "minutes": 10,
          "content": [
              "Use the concepts from Digital Marketing & Social Media to solve a small, realistic problem rather than only memorising definitions.",
              "Gather the information you need, check that it is reliable, and choose a method that fits the task.",
              "Work through the task carefully. Check the result, correct mistakes, and record what you learned.",
              "Practice: describe a real situation where you could apply this subject and explain the steps you would follow.",
              "LESSON FOCUS — Planning useful content. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Plan different posts for awareness, consideration and action. A strong post gives the audience a reason to care, enough detail to understand the offer and a next step that is easy to follow.",
              "FOLLOW THE METHOD — 1) Choose a target audience and one measurable objective. 2) Write a truthful benefit and supporting detail. 3) Choose a channel used by the intended audience. 4) Plan content, timing, budget and a single call to action. 5) Measure useful results and improve the next campaign.",
              "WORKED EXAMPLE — A tailor can show a finished item, explain fabric and sizing, then share a clear way to request a quote.",
              "PRACTICE TASK — Prepare a one-week content calendar with post purpose, message, visual and call to action.",
              "COMMON MISTAKES TO AVOID — targeting everyone with one message; using likes as a substitute for business results; making unsupported claims; posting customer details without permission. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Verify prices, stock, spelling and links. Compare results with the campaign objective and respect consent and platform rules. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "digital-marketing-social-media-lesson-6",
          "title": "Review, improvement and responsible practice",
          "minutes": 8,
          "content": [
              "Review the key ideas you have learned about Digital Marketing & Social Media and identify anything that remains unclear.",
              "Use feedback and evidence to improve your work. Do not treat an assumption as a verified fact.",
              "Respect privacy, follow relevant rules, and consider how your decisions affect other people.",
              "Practice: summarise three things you learned, one skill you need to practise, and one action you will take next.",
              "LESSON FOCUS — Measuring and improving campaigns. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Track metrics that match the objective: qualified enquiries, conversions or cost per result may matter more than impressions. Compare periods carefully and avoid causal claims from very small samples.",
              "FOLLOW THE METHOD — 1) Choose a target audience and one measurable objective. 2) Write a truthful benefit and supporting detail. 3) Choose a channel used by the intended audience. 4) Plan content, timing, budget and a single call to action. 5) Measure useful results and improve the next campaign.",
              "WORKED EXAMPLE — If two posts receive similar reach but one generates more relevant enquiries, review the message, audience and offer before deciding why.",
              "PRACTICE TASK — Build a small results table for reach, enquiries and orders, then suggest one change supported by the data.",
              "COMMON MISTAKES TO AVOID — targeting everyone with one message; using likes as a substitute for business results; making unsupported claims; posting customer details without permission. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Verify prices, stock, spelling and links. Compare results with the campaign objective and respect consent and platform rules. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "digital-marketing-social-media-q1", prompt: "What should guide a digital marketing campaign?", options: ["A clear goal and audience", "Posting at random", "Follower count alone", "Copying every competitor"], answerIndex: 0, explanation: "A clear goal and audience help shape relevant content and useful measurement." },
      { id: "digital-marketing-social-media-q2", prompt: "What is a content calendar for?", options: ["Planning topics and publishing dates", "Storing customer passwords", "Guaranteeing sales", "Replacing customer service"], answerIndex: 0, explanation: "A calendar helps coordinate topics, dates, formats, and responsibilities." },
      { id: "digital-marketing-social-media-q3", prompt: "Which metric best fits a campaign seeking enquiries?", options: ["Number of relevant enquiries", "Colour of the logo", "Number of unrelated posts", "Personal opinions only"], answerIndex: 0, explanation: "Measure the action that matches the campaign objective." },
      { id: "digital-marketing-social-media-q4", prompt: "What is a responsible way to use a testimonial?", options: ["Use it with permission and represent it honestly", "Invent a customer quote", "Change its meaning", "Claim every customer had the same result"], answerIndex: 0, explanation: "Testimonials should be authorised and presented accurately." }
    ,
        {
          "id": "digital-marketing-social-media-q5",
          "prompt": "What is the best first step when beginning a task related to Digital Marketing & Social Media?",
          "options": [
            "Start immediately without understanding the task",
            "Identify the goal and the information or resources needed",
            "Copy someone else's work without checking it",
            "Ignore the expected result"
          ],
          "answerIndex": 1,
          "explanation": "Clarifying the goal and required resources helps you plan and complete the task effectively."
        },
{
          "id": "digital-marketing-social-media-q6",
          "prompt": "How should you check information used in Digital Marketing & Social Media?",
          "options": [
            "Accept the first claim you see",
            "Rely only on popularity",
            "Compare credible sources and check the evidence",
            "Ignore the date and context"
          ],
          "answerIndex": 2,
          "explanation": "Checking credible sources and evidence helps reduce errors and unsupported conclusions."
        },
{
          "id": "digital-marketing-social-media-q7",
          "prompt": "What is a useful way to improve a practical skill in Digital Marketing & Social Media?",
          "options": [
            "Practise, review the result and learn from mistakes",
            "Avoid feedback",
            "Repeat errors without reviewing them",
            "Stop after the first attempt"
          ],
          "answerIndex": 0,
          "explanation": "Practice and review help learners identify weaknesses and improve their performance."
        },
{
          "id": "digital-marketing-social-media-q8",
          "prompt": "If a task in Digital Marketing & Social Media does not produce the expected result, what should you do?",
          "options": [
            "Hide the result",
            "Blame others without checking the process",
            "Continue using the same method without review",
            "Check the steps, identify the cause and make a correction"
          ],
          "answerIndex": 3,
          "explanation": "Reviewing the process helps identify the cause of a problem and supports a better solution."
        },
{
          "id": "digital-marketing-social-media-q9",
          "prompt": "Which approach supports responsible work in Digital Marketing & Social Media?",
          "options": [
            "Share private information freely",
            "Respect privacy, follow applicable rules and consider the impact",
            "Ignore safety concerns",
            "Present guesses as proven facts"
          ],
          "answerIndex": 1,
          "explanation": "Responsible practice includes protecting privacy, following relevant rules and communicating honestly."
        },
{
          "id": "digital-marketing-social-media-q10",
          "prompt": "How can you measure progress in Digital Marketing & Social Media?",
          "options": [
            "Avoid checking your work",
            "Depend entirely on memory",
            "Compare your results with a clear goal or checklist",
            "Change the goal whenever work becomes difficult"
          ],
          "answerIndex": 2,
          "explanation": "A clear goal or checklist makes progress easier to review and areas for improvement easier to identify."
        }
      ]
  },
    {
    id: "computer-office-skills",
    title: "Computer Applications & Office Skills",
    category: "Digital Marketing & Office Tools",
    description: "Build practical skills for documents, spreadsheets, presentations, and organised digital files.",
    level: "Foundation",
    priceKsh: 300,
    published: true,
    lessons: [
      { id: "organise-files", title: "Manage files and folders", minutes: 8, content: [
          "Use clear file names that describe the content and, when useful, include a date or version. Store related documents in folders and avoid confusing names such as final-final-new.",
          "Keep a backup of important work and check sharing permissions before sending a link. Use common file formats requested by the recipient.",
          "Practice: design a folder structure for invoices, customer records, reports, and presentations.",
          "LEARNING TARGETS — In “Manage files and folders”, learn the central idea in Computer Applications & Office Skills, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Office tools help people create documents, communicate information and calculate totals. Choose a word processor for structured text, presentation software for a visual explanation and a spreadsheet for tables and calculations. Consistent formatting, clear names and checking in the exported format reduce mistakes.",
          "KEY WORDS — document style — reusable heading or text formatting; worksheet — grid used to organise data; formula — expression that calculates a result; file format — structure used to save a file; accessibility — making content usable by different people. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Decide who will use the file and what they must find. 2) Organise content with headings, labels and meaningful order. 3) Use consistent styles and readable contrast. 4) Check spelling, totals, links and page layout. 5) Save the right version and reopen the exported file.",
          "WORKED EXAMPLE — A meeting report should show the date, decisions, action owners and deadlines. Built-in heading styles keep the structure clear when edits are made.",
          "GUIDED PRACTICE — Create a one-page meeting summary with headings and an action table. Export it, reopen the copy and check the layout and text.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Inspect the file in its exported format, recalculate important totals and check filename, destination and readability.",
          "COMMON MISTAKES — using spaces to align a table; typing totals that should be formulas; using colour alone to communicate meaning; sending the wrong file version. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "documents-presentations", title: "Create clear documents and presentations", minutes: 10, content: [
          "Use headings, consistent fonts, readable spacing, and descriptive titles. Proofread names, dates, amounts, and contact details before sharing a document.",
          "Slides should support a speaker or communicate one main idea at a time. Prefer concise text, legible visuals, and accurate source notes over crowded slides.",
          "Practice: outline a one-page business report and a five-slide presentation for the same topic.",
          "TODAY’S SKILL — Use Create clear documents and presentations to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Decide who will use the file and what they must find. 2) Organise content with headings, labels and meaningful order. 3) Use consistent styles and readable contrast. 4) Check spelling, totals, links and page layout. 5) Save the right version and reopen the exported file.",
          "WATCH A MODEL — A meeting report should show the date, decisions, action owners and deadlines. Built-in heading styles keep the structure clear when edits are made.",
          "TRY IT YOURSELF — Create a one-page meeting summary with headings and an action table. Export it, reopen the copy and check the layout and text. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Inspect the file in its exported format, recalculate important totals and check filename, destination and readability.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "spreadsheet-basics", title: "Use spreadsheets for simple records", minutes: 12, content: [
          "A spreadsheet organises information in rows and columns. Use one clear header row, consistent date and currency formats, and one record per row.",
          "Formulas can calculate totals and averages. Check cell references and test results against a small manual calculation before relying on a spreadsheet for decisions.",
          "Practice: create a sample sales table with date, item, quantity, unit price, and total.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Computer Applications & Office Skills in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: document style — reusable heading or text formatting; worksheet — grid used to organise data; formula — expression that calculates a result; file format — structure used to save a file; accessibility — making content usable by different people. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Create a one-page meeting summary with headings and an action table. Export it, reopen the copy and check the layout and text.",
          "EXPLAIN YOUR REASONING — A meeting report should show the date, decisions, action owners and deadlines. Built-in heading styles keep the structure clear when edits are made. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Inspect the file in its exported format, recalculate important totals and check filename, destination and readability.",
          "ERROR SPOTTING — Look for these common mistakes: using spaces to align a table; typing totals that should be formulas; using colour alone to communicate meaning; sending the wrong file version. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Design a folder tree for a small project and choose clear names for draft, final and exported files."
        ]}
    ,
        {
          "id": "computer-office-skills-lesson-4",
          "title": "Planning and setting goals in Computer Applications & Office Skills",
          "minutes": 8,
          "content": [
              "Start by identifying what you need to learn and what you should be able to do after studying Computer Applications & Office Skills.",
              "Break the learning goal into small tasks. Put the most important task first and set a realistic time for completing it.",
              "Write down your starting point, the resources you need, and a simple way to measure progress.",
              "Practice: write one clear learning goal and three steps you can take to achieve it.",
              "LESSON FOCUS — Files and folders. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A predictable folder structure and descriptive filenames make work easier to find and maintain. Save versions deliberately and understand the difference between moving a file and creating a shortcut.",
              "FOLLOW THE METHOD — 1) Decide who will use the file and what they must find. 2) Organise content with headings, labels and meaningful order. 3) Use consistent styles and readable contrast. 4) Check spelling, totals, links and page layout. 5) Save the right version and reopen the exported file.",
              "WORKED EXAMPLE — Use Projects/Training/Agenda_2026-10-27.docx rather than leaving five files named “New Document”.",
              "PRACTICE TASK — Design a folder tree for a small project and choose clear names for draft, final and exported files.",
              "COMMON MISTAKES TO AVOID — using spaces to align a table; typing totals that should be formulas; using colour alone to communicate meaning; sending the wrong file version. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Inspect the file in its exported format, recalculate important totals and check filename, destination and readability. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "computer-office-skills-lesson-5",
          "title": "Practical application of Computer Applications & Office Skills",
          "minutes": 10,
          "content": [
              "Use the concepts from Computer Applications & Office Skills to solve a small, realistic problem rather than only memorising definitions.",
              "Gather the information you need, check that it is reliable, and choose a method that fits the task.",
              "Work through the task carefully. Check the result, correct mistakes, and record what you learned.",
              "Practice: describe a real situation where you could apply this subject and explain the steps you would follow.",
              "LESSON FOCUS — Documents and presentations. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Use headings to show information hierarchy. A slide should support one idea, with readable text and a chart or diagram only where it clarifies meaning. Avoid crowded layouts and explain what a visual shows.",
              "FOLLOW THE METHOD — 1) Decide who will use the file and what they must find. 2) Organise content with headings, labels and meaningful order. 3) Use consistent styles and readable contrast. 4) Check spelling, totals, links and page layout. 5) Save the right version and reopen the exported file.",
              "WORKED EXAMPLE — A presentation about monthly sales can show one labelled chart and a headline describing the observed change rather than a paragraph in tiny text.",
              "PRACTICE TASK — Turn a long paragraph into a titled document with subheadings, then make a three-slide outline with one main idea per slide.",
              "COMMON MISTAKES TO AVOID — using spaces to align a table; typing totals that should be formulas; using colour alone to communicate meaning; sending the wrong file version. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Inspect the file in its exported format, recalculate important totals and check filename, destination and readability. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
{
          "id": "computer-office-skills-lesson-6",
          "title": "Review, improvement and responsible practice",
          "minutes": 8,
          "content": [
              "Review the key ideas you have learned about Computer Applications & Office Skills and identify anything that remains unclear.",
              "Use feedback and evidence to improve your work. Do not treat an assumption as a verified fact.",
              "Respect privacy, follow relevant rules, and consider how your decisions affect other people.",
              "Practice: summarise three things you learned, one skill you need to practise, and one action you will take next.",
              "LESSON FOCUS — Spreadsheet basics. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Keep one observation per row and one variable per column. Use formulas for repeatable calculations, labels for units and a deliberate check for blanks and duplicates.",
              "FOLLOW THE METHOD — 1) Decide who will use the file and what they must find. 2) Organise content with headings, labels and meaningful order. 3) Use consistent styles and readable contrast. 4) Check spelling, totals, links and page layout. 5) Save the right version and reopen the exported file.",
              "WORKED EXAMPLE — If quantities are in B2:B6 and unit prices are in C2:C6, calculate line totals in D and sum D to find total value instead of typing a guessed total.",
              "PRACTICE TASK — Build a small expense sheet using SUM and check the result by adding two sample lines manually.",
              "COMMON MISTAKES TO AVOID — using spaces to align a table; typing totals that should be formulas; using colour alone to communicate meaning; sending the wrong file version. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Inspect the file in its exported format, recalculate important totals and check filename, destination and readability. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "computer-office-skills-q1", prompt: "What makes a file name useful?", options: ["It clearly describes the file", "It is always blank", "It uses random symbols only", "It hides the document's purpose"], answerIndex: 0, explanation: "Descriptive names make files easier to find and distinguish." },
      { id: "computer-office-skills-q2", prompt: "What should a presentation slide usually do?", options: ["Communicate one main idea clearly", "Contain every sentence in a report", "Use the smallest possible text", "Avoid titles"], answerIndex: 0, explanation: "Focused slides are easier to read and explain." },
      { id: "computer-office-skills-q3", prompt: "In a spreadsheet, what is a row commonly used for?", options: ["One record or entry", "A password for all users", "A folder on the computer", "A slide transition"], answerIndex: 0, explanation: "Rows commonly represent individual records, with columns describing their fields." },
      { id: "computer-office-skills-q4", prompt: "What should you do before relying on a spreadsheet total?", options: ["Check formulas and test sample results", "Assume formulas cannot fail", "Delete the source data", "Share it publicly"], answerIndex: 0, explanation: "Checking formulas and sample results helps catch errors." }
    ,
        {
          "id": "computer-office-skills-q5",
          "prompt": "What is the best first step when beginning a task related to Computer Applications & Office Skills?",
          "options": [
            "Start immediately without understanding the task",
            "Identify the goal and the information or resources needed",
            "Copy someone else's work without checking it",
            "Ignore the expected result"
          ],
          "answerIndex": 1,
          "explanation": "Clarifying the goal and required resources helps you plan and complete the task effectively."
        },
{
          "id": "computer-office-skills-q6",
          "prompt": "How should you check information used in Computer Applications & Office Skills?",
          "options": [
            "Accept the first claim you see",
            "Rely only on popularity",
            "Compare credible sources and check the evidence",
            "Ignore the date and context"
          ],
          "answerIndex": 2,
          "explanation": "Checking credible sources and evidence helps reduce errors and unsupported conclusions."
        },
{
          "id": "computer-office-skills-q7",
          "prompt": "What is a useful way to improve a practical skill in Computer Applications & Office Skills?",
          "options": [
            "Practise, review the result and learn from mistakes",
            "Avoid feedback",
            "Repeat errors without reviewing them",
            "Stop after the first attempt"
          ],
          "answerIndex": 0,
          "explanation": "Practice and review help learners identify weaknesses and improve their performance."
        },
{
          "id": "computer-office-skills-q8",
          "prompt": "If a task in Computer Applications & Office Skills does not produce the expected result, what should you do?",
          "options": [
            "Hide the result",
            "Blame others without checking the process",
            "Continue using the same method without review",
            "Check the steps, identify the cause and make a correction"
          ],
          "answerIndex": 3,
          "explanation": "Reviewing the process helps identify the cause of a problem and supports a better solution."
        },
{
          "id": "computer-office-skills-q9",
          "prompt": "Which approach supports responsible work in Computer Applications & Office Skills?",
          "options": [
            "Share private information freely",
            "Respect privacy, follow applicable rules and consider the impact",
            "Ignore safety concerns",
            "Present guesses as proven facts"
          ],
          "answerIndex": 1,
          "explanation": "Responsible practice includes protecting privacy, following relevant rules and communicating honestly."
        },
{
          "id": "computer-office-skills-q10",
          "prompt": "How can you measure progress in Computer Applications & Office Skills?",
          "options": [
            "Avoid checking your work",
            "Depend entirely on memory",
            "Compare your results with a clear goal or checklist",
            "Change the goal whenever work becomes difficult"
          ],
          "answerIndex": 2,
          "explanation": "A clear goal or checklist makes progress easier to review and areas for improvement easier to identify."
        }
      ]
  },
    {
    id: "cybersecurity-online-safety",
    title: "Cybersecurity & Online Safety",
    category: "Digital & ICT Skills",
    description: "Recognise common online threats and protect accounts, devices, and personal information.",
    level: "Foundation",
    priceKsh: 300,
    published: true,
    lessons: [
      { id: "recognise-threats", title: "Recognise common online threats", minutes: 9, content: [
          "Phishing attempts may arrive through email, text messages, calls, social media, or fake websites. Watch for unexpected requests, pressure, unusual sender details, and links that do not match the claimed organisation.",
          "Malware can steal information, spy on activity, or disrupt devices. Keep software updated and install applications only from trusted sources.",
          "Practice: identify warning signs in a fictional message asking you to urgently confirm a payment.",
          "LEARNING TARGETS — In “Recognise common online threats”, learn the central idea in Cybersecurity & Online Safety, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Online safety combines technical controls and careful choices. Attackers often use urgency, familiar logos and requests for private codes to exploit trust. Unique passwords, multi-factor authentication, updates, backups and fast reporting create layers of protection; no single control guarantees safety.",
          "KEY WORDS — phishing — deceptive message trying to obtain data or action; multi-factor authentication — a second proof of identity; malware — software intended to cause harm or unauthorised access; backup — separate copy used for recovery; least privilege — allowing only the access needed. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Pause when a message creates unexpected urgency. 2) Verify requests through a separate trusted channel. 3) Use unique passwords and multi-factor authentication. 4) Update devices and keep protected backups. 5) Report suspected incidents promptly and preserve relevant evidence.",
          "WORKED EXAMPLE — A text says an account will be closed unless you sign in. Do not use its link; open the official app or type a known website address and check account notices there.",
          "GUIDED PRACTICE — Inspect a fictional suspicious message. Mark the sender, link, urgency, requested information and safe reporting step.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Confirm account changes in official settings and follow the organisation’s approved reporting route.",
          "COMMON MISTAKES — sharing a one-time code; reusing passwords; assuming a logo proves identity; deleting evidence before reporting an incident. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "secure-accounts", title: "Secure accounts and devices", minutes: 10, content: [
          "Use unique passwords, a password manager where appropriate, and multi-factor authentication. Protect the email account used to reset other passwords.",
          "Lock devices when unattended, review app permissions, install updates, and back up important information. Use a trusted network for sensitive tasks when possible.",
          "Practice: make a checklist for securing your email and mobile phone.",
          "TODAY’S SKILL — Use Secure accounts and devices to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Pause when a message creates unexpected urgency. 2) Verify requests through a separate trusted channel. 3) Use unique passwords and multi-factor authentication. 4) Update devices and keep protected backups. 5) Report suspected incidents promptly and preserve relevant evidence.",
          "WATCH A MODEL — A text says an account will be closed unless you sign in. Do not use its link; open the official app or type a known website address and check account notices there.",
          "TRY IT YOURSELF — Inspect a fictional suspicious message. Mark the sender, link, urgency, requested information and safe reporting step. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Confirm account changes in official settings and follow the organisation’s approved reporting route.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "respond-safely", title: "Respond to a suspected incident", minutes: 9, content: [
          "Do not respond to suspicious messages or share passwords, PINs, or one-time codes. Contact the organisation through a known official channel.",
          "If an account may be compromised, use a trusted device to change the password, end unfamiliar sessions, enable additional security, and contact the provider or financial institution when relevant.",
          "Practice: list the first three steps you would take after noticing an unfamiliar sign-in alert.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Cybersecurity & Online Safety in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: phishing — deceptive message trying to obtain data or action; multi-factor authentication — a second proof of identity; malware — software intended to cause harm or unauthorised access; backup — separate copy used for recovery; least privilege — allowing only the access needed. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Inspect a fictional suspicious message. Mark the sender, link, urgency, requested information and safe reporting step.",
          "EXPLAIN YOUR REASONING — A text says an account will be closed unless you sign in. Do not use its link; open the official app or type a known website address and check account notices there. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Confirm account changes in official settings and follow the organisation’s approved reporting route.",
          "ERROR SPOTTING — Look for these common mistakes: sharing a one-time code; reusing passwords; assuming a logo proves identity; deleting evidence before reporting an incident. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Annotate a fictional phishing message and explain why each warning sign matters."
        ]}
    ,
        {
          "id": "cybersecurity-online-safety-lesson-4",
          "title": "Recognising online threats",
          "minutes": 8,
          "content": [
              "Phishing messages try to trick people into revealing passwords, payment details or other private information. They may imitate trusted organisations or create a false sense of urgency.",
              "Check the sender, inspect links carefully and be suspicious of unexpected attachments, prize claims and requests for confidential information.",
              "Use a separate trusted route to contact an organisation if a message asks you to act urgently. Do not rely on contact details supplied in a suspicious message.",
              "Practice: identify three warning signs in a suspicious email or text message.",
              "LESSON FOCUS — Spotting threats. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Look for unusual sender addresses, misleading domains, unexpected attachments, pressure, requests for secrecy and payment or code instructions. A message can be polished and still be fraudulent.",
              "FOLLOW THE METHOD — 1) Pause when a message creates unexpected urgency. 2) Verify requests through a separate trusted channel. 3) Use unique passwords and multi-factor authentication. 4) Update devices and keep protected backups. 5) Report suspected incidents promptly and preserve relevant evidence.",
              "WORKED EXAMPLE — A bank-like message links to “example-bank.security-check.invalid”; the unusual domain is a reason not to sign in through it.",
              "PRACTICE TASK — Annotate a fictional phishing message and explain why each warning sign matters.",
              "COMMON MISTAKES TO AVOID — sharing a one-time code; reusing passwords; assuming a logo proves identity; deleting evidence before reporting an incident. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Confirm account changes in official settings and follow the organisation’s approved reporting route. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "cybersecurity-online-safety-lesson-5",
          "title": "Passwords and account protection",
          "minutes": 9,
          "content": [
              "Use long, unique passwords for important accounts. Reusing one password means a breach on one service may put other accounts at risk.",
              "A reputable password manager can help you create and store unique passwords. Protect the manager itself with a strong master password and available security features.",
              "Enable multifactor authentication wherever possible. Never share verification codes with someone who contacts you unexpectedly.",
              "Practice: review the security settings on one account you own and identify one improvement.",
              "LESSON FOCUS — Protecting accounts and devices. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Use a unique password for each account, multi-factor authentication, automatic updates and screen locks. Keep recovery information current and restrict apps to the permissions they need.",
              "FOLLOW THE METHOD — 1) Pause when a message creates unexpected urgency. 2) Verify requests through a separate trusted channel. 3) Use unique passwords and multi-factor authentication. 4) Update devices and keep protected backups. 5) Report suspected incidents promptly and preserve relevant evidence.",
              "WORKED EXAMPLE — If one reused password is leaked, attackers may try it on email and payment services; unique passwords limit that spread.",
              "PRACTICE TASK — Make a defensive checklist for one fictional account without writing down any real password or code.",
              "COMMON MISTAKES TO AVOID — sharing a one-time code; reusing passwords; assuming a logo proves identity; deleting evidence before reporting an incident. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Confirm account changes in official settings and follow the organisation’s approved reporting route. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "cybersecurity-online-safety-lesson-6",
          "title": "Privacy, devices and safe browsing",
          "minutes": 9,
          "content": [
              "Share only the personal information needed for a legitimate purpose. Review privacy settings and consider who may see posts, photographs, location information and documents.",
              "Keep your operating system, browser and applications updated. Download software from trusted sources and use a screen lock on devices.",
              "Back up important files and avoid entering sensitive information on untrusted networks or unfamiliar websites. Report online abuse and preserve relevant evidence safely.",
              "Practice: create a short checklist for protecting a device and its personal data.",
              "LESSON FOCUS — Responding to a suspected incident. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Stop risky interaction, use a trusted device or official channel to secure the account, report the event, preserve relevant details and follow local response guidance. Do not investigate malware by opening it.",
              "FOLLOW THE METHOD — 1) Pause when a message creates unexpected urgency. 2) Verify requests through a separate trusted channel. 3) Use unique passwords and multi-factor authentication. 4) Update devices and keep protected backups. 5) Report suspected incidents promptly and preserve relevant evidence.",
              "WORKED EXAMPLE — If you entered a password on a suspicious page, use the official service to change it, revoke suspicious sessions and notify support.",
              "PRACTICE TASK — Write a numbered response plan for a suspected compromised account and identify who should be contacted.",
              "COMMON MISTAKES TO AVOID — sharing a one-time code; reusing passwords; assuming a logo proves identity; deleting evidence before reporting an incident. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Confirm account changes in official settings and follow the organisation’s approved reporting route. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "cybersecurity-online-safety-q1", prompt: "What is a phishing warning sign?", options: ["An unexpected urgent request for a code", "A routine update from a verified app you opened yourself", "A document you created", "A saved offline note"], answerIndex: 0, explanation: "Unexpected urgency and requests for authentication codes are common warning signs." },
      { id: "cybersecurity-online-safety-q2", prompt: "Why use unique passwords?", options: ["A leaked password is less likely to unlock other accounts", "It makes every account public", "It removes the need for updates", "It guarantees no attacks"], answerIndex: 0, explanation: "Unique passwords limit the damage if one service is breached." },
      { id: "cybersecurity-online-safety-q3", prompt: "What should you do with a suspicious payment message?", options: ["Verify through an official known channel", "Reply with your PIN", "Click its shortened link immediately", "Forward your one-time code"], answerIndex: 0, explanation: "Independent verification helps avoid impersonation scams." },
      { id: "cybersecurity-online-safety-q4", prompt: "What is a useful first response to a compromised account?", options: ["Secure it from a trusted device and contact the provider", "Ignore all alerts", "Post the password publicly", "Disable every security feature"], answerIndex: 0, explanation: "Secure access promptly and follow the provider's incident guidance." }
    ,
        {
          "id": "cybersecurity-online-safety-q5",
          "prompt": "A message asks you to verify your password immediately using an unfamiliar link. What should you do?",
          "options": [
            "Open the link quickly",
            "Forward it to all contacts",
            "Avoid the link and verify the request through an official channel",
            "Reply with your password"
          ],
          "answerIndex": 2,
          "explanation": "Independent verification helps prevent phishing and credential theft."
        },
        {
          "id": "cybersecurity-online-safety-q6",
          "prompt": "Why should important accounts have unique passwords?",
          "options": [
            "It makes every password public",
            "It limits the damage if one service suffers a breach",
            "It removes the need for updates",
            "It guarantees that no attack is possible"
          ],
          "answerIndex": 1,
          "explanation": "Unique passwords reduce the risk of one compromised account exposing others."
        },
        {
          "id": "cybersecurity-online-safety-q7",
          "prompt": "What is a key benefit of multifactor authentication?",
          "options": [
            "It makes passwords unnecessary in every situation",
            "It shares codes with other users",
            "It disables account monitoring",
            "It adds another verification step to sign-in"
          ],
          "answerIndex": 3,
          "explanation": "A second verification factor can help protect an account if a password is stolen."
        },
        {
          "id": "cybersecurity-online-safety-q8",
          "prompt": "What is the safest response to an unexpected request for a verification code?",
          "options": [
            "Keep the code private and verify the request independently",
            "Send it to the caller",
            "Post it in a group chat",
            "Store it in a public document"
          ],
          "answerIndex": 0,
          "explanation": "Verification codes can grant account access and should not be disclosed to unexpected contacts."
        },
        {
          "id": "cybersecurity-online-safety-q9",
          "prompt": "Why should you install software updates?",
          "options": [
            "Updates always remove personal files",
            "Updates make passwords public",
            "Updates can fix security weaknesses and software problems",
            "Updates eliminate every possible threat"
          ],
          "answerIndex": 2,
          "explanation": "Security updates often repair weaknesses that attackers could otherwise exploit."
        },
        {
          "id": "cybersecurity-online-safety-q10",
          "prompt": "What is a responsible way to protect personal information online?",
          "options": [
            "Publish identification documents publicly",
            "Limit sharing and review privacy settings",
            "Use the same password everywhere",
            "Ignore unexpected account alerts"
          ],
          "answerIndex": 1,
          "explanation": "Limiting unnecessary sharing reduces exposure of sensitive information."
        }
      ]
  },
    {
    id: "web-development-programming",
    title: "Web Development & Programming",
    category: "AI & Programming",
    description: "Learn how websites are structured, styled, and made interactive, with a beginner-friendly project workflow.",
    level: "Advanced",
    priceKsh: 1000,
    published: true,
    lessons: [
      { id: "web-structure", title: "Understand how websites work", minutes: 10, content: [
          "HTML describes page structure and meaning, CSS controls presentation, and JavaScript adds behaviour. A browser interprets these resources to display a website.",
          "A website may also rely on a server, database, and APIs. Never place private keys or secret credentials in code sent to the browser.",
          "Practice: sketch a simple page with a heading, paragraph, navigation, and contact section.",
          "LEARNING TARGETS — In “Understand how websites work”, learn the central idea in Web Development & Programming, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — A web page combines structure, appearance and behaviour. HTML describes content and meaning, CSS controls presentation, and JavaScript adds interaction. Development improves through small changes, clear tests and attention to accessibility rather than only making a page look attractive.",
          "KEY WORDS — HTML — semantic structure and content; CSS — styling and layout rules; JavaScript — programming language for behaviour; responsive layout — adapts to screen size; debugging — finding and correcting a defect. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Break the page into clearly named content sections. 2) Use semantic HTML elements and form labels. 3) Apply CSS consistently and test narrow screens. 4) Add the smallest useful JavaScript interaction. 5) Test keyboard use, invalid input, links and error states.",
          "WORKED EXAMPLE — A contact form needs labelled fields, clear validation, keyboard access and a helpful success or error message. Appearance alone does not prove that it works.",
          "GUIDED PRACTICE — Create a small page with a heading, paragraph, list and link. Test it at a narrow viewport and with keyboard-only navigation.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Run the page, inspect console errors, test keyboard navigation and verify links and form messages.",
          "COMMON MISTAKES — using a clickable div instead of a proper button; ignoring keyboard focus; testing only the successful input; changing code without rerunning tests. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "build-accessible-pages", title: "Build readable and accessible pages", minutes: 12, content: [
          "Use semantic headings, descriptive links, labels for form fields, and meaningful alternative text for informative images. A clear structure helps people and assistive technologies understand the page.",
          "Use CSS for consistent spacing, colour, and responsive layouts. Check the page on a narrow screen and ensure text contrast and keyboard navigation are usable.",
          "Practice: create a page outline and list two ways to make it easier to use on a phone.",
          "TODAY’S SKILL — Use Build readable and accessible pages to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Break the page into clearly named content sections. 2) Use semantic HTML elements and form labels. 3) Apply CSS consistently and test narrow screens. 4) Add the smallest useful JavaScript interaction. 5) Test keyboard use, invalid input, links and error states.",
          "WATCH A MODEL — A contact form needs labelled fields, clear validation, keyboard access and a helpful success or error message. Appearance alone does not prove that it works.",
          "TRY IT YOURSELF — Create a small page with a heading, paragraph, list and link. Test it at a narrow viewport and with keyboard-only navigation. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Run the page, inspect console errors, test keyboard navigation and verify links and form messages.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "test-and-improve", title: "Test and improve a small project", minutes: 12, content: [
          "Break a project into small tasks and test each change. Check links, forms, error states, and different screen sizes rather than testing only the ideal path.",
          "Use version control to track changes and keep a recoverable history. Review dependencies and never commit secrets or personal data to a repository.",
          "Practice: write five test cases for a registration form, including missing and invalid input.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Web Development & Programming in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: HTML — semantic structure and content; CSS — styling and layout rules; JavaScript — programming language for behaviour; responsive layout — adapts to screen size; debugging — finding and correcting a defect. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Create a small page with a heading, paragraph, list and link. Test it at a narrow viewport and with keyboard-only navigation.",
          "EXPLAIN YOUR REASONING — A contact form needs labelled fields, clear validation, keyboard access and a helpful success or error message. Appearance alone does not prove that it works. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Run the page, inspect console errors, test keyboard navigation and verify links and form messages.",
          "ERROR SPOTTING — Look for these common mistakes: using a clickable div instead of a proper button; ignoring keyboard focus; testing only the successful input; changing code without rerunning tests. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Sketch a page hierarchy and choose an appropriate HTML element for each item."
        ]}
    ,
        {
          "id": "web-development-programming-lesson-4",
          "title": "Understanding HTML page structure",
          "minutes": 9,
          "content": [
              "HTML describes the structure and meaning of web content. Common elements include headings, paragraphs, links, images, lists and forms.",
              "Use semantic elements appropriately so that the structure is understandable to people, browsers and assistive technologies.",
              "Provide meaningful link text and alternative text for informative images. Keep the document structure logical and validate your markup when possible.",
              "Practice: outline a simple webpage containing a heading, an introduction, a list and a useful link.",
              "LESSON FOCUS — HTML structure. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — HTML gives information its meaning. Headings should form a logical hierarchy; buttons trigger actions; links navigate; labels explain form fields. Semantic structure helps assistive technology and makes maintenance easier.",
              "FOLLOW THE METHOD — 1) Break the page into clearly named content sections. 2) Use semantic HTML elements and form labels. 3) Apply CSS consistently and test narrow screens. 4) Add the smallest useful JavaScript interaction. 5) Test keyboard use, invalid input, links and error states.",
              "WORKED EXAMPLE — Use a button for “Save”, an anchor for “Open course”, and a label connected to an email input.",
              "PRACTICE TASK — Sketch a page hierarchy and choose an appropriate HTML element for each item.",
              "COMMON MISTAKES TO AVOID — using a clickable div instead of a proper button; ignoring keyboard focus; testing only the successful input; changing code without rerunning tests. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Run the page, inspect console errors, test keyboard navigation and verify links and form messages. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "web-development-programming-lesson-5",
          "title": "CSS styling and responsive layouts",
          "minutes": 10,
          "content": [
              "CSS controls presentation, including colours, typography, spacing, borders and layout. Separating content from styling makes websites easier to maintain.",
              "Flexbox and Grid can help arrange content. Relative units and responsive techniques help layouts adapt to different screen sizes.",
              "Check contrast, text readability, keyboard access and layout behaviour on both narrow and wide screens. Avoid relying on colour alone to communicate meaning.",
              "Practice: plan a responsive page with a header, content area and footer.",
              "LESSON FOCUS — CSS and accessible layout. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — CSS controls spacing, typography, responsive layout and states such as focus or hover. Readable contrast, flexible widths and visible keyboard focus make content easier for more people to use.",
              "FOLLOW THE METHOD — 1) Break the page into clearly named content sections. 2) Use semantic HTML elements and form labels. 3) Apply CSS consistently and test narrow screens. 4) Add the smallest useful JavaScript interaction. 5) Test keyboard use, invalid input, links and error states.",
              "WORKED EXAMPLE — A grid with flexible columns can stack on a phone instead of forcing readers to scroll horizontally.",
              "PRACTICE TASK — Describe how your page should change from desktop to phone and check contrast and keyboard focus.",
              "COMMON MISTAKES TO AVOID — using a clickable div instead of a proper button; ignoring keyboard focus; testing only the successful input; changing code without rerunning tests. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Run the page, inspect console errors, test keyboard navigation and verify links and form messages. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "web-development-programming-lesson-6",
          "title": "JavaScript, testing and debugging",
          "minutes": 10,
          "content": [
              "JavaScript adds behaviour to webpages. Variables store values, conditions make decisions, and functions organise reusable operations.",
              "Read error messages carefully and isolate the smallest part of a program that reproduces a problem. Test normal inputs as well as empty, unexpected or invalid inputs.",
              "Do not trust browser input automatically. Validate data on the server when an operation affects accounts, permissions, payments or stored information.",
              "Practice: write pseudocode for a form that checks whether a required field has been completed.",
              "LESSON FOCUS — JavaScript and testing. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — JavaScript responds to events and changes state. Validate inputs, handle failure paths and avoid announcing success before the server confirms it.",
              "FOLLOW THE METHOD — 1) Break the page into clearly named content sections. 2) Use semantic HTML elements and form labels. 3) Apply CSS consistently and test narrow screens. 4) Add the smallest useful JavaScript interaction. 5) Test keyboard use, invalid input, links and error states.",
              "WORKED EXAMPLE — After a save request, show “Saved” only after a successful response; show a useful error and allow retry when it fails.",
              "PRACTICE TASK — Write a test checklist for valid input, invalid input, slow response and server failure.",
              "COMMON MISTAKES TO AVOID — using a clickable div instead of a proper button; ignoring keyboard focus; testing only the successful input; changing code without rerunning tests. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Run the page, inspect console errors, test keyboard navigation and verify links and form messages. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "web-development-programming-q1", prompt: "Which technology describes the structure of a web page?", options: ["HTML", "CSS", "A spreadsheet", "A password manager"], answerIndex: 0, explanation: "HTML provides the structure and meaning of page content." },
      { id: "web-development-programming-q2", prompt: "What is CSS mainly used for?", options: ["Styling and layout", "Storing secret API keys", "Replacing all testing", "Sending private keys to users"], answerIndex: 0, explanation: "CSS controls presentation and layout." },
      { id: "web-development-programming-q3", prompt: "Where should a private server secret be kept?", options: ["In protected server-side configuration", "In public browser code", "In a public image", "In a page heading"], answerIndex: 0, explanation: "Secrets must not be exposed in client-side code or public repositories." },
      { id: "web-development-programming-q4", prompt: "Why test invalid form input?", options: ["To check error handling and protect data quality", "To guarantee unlimited traffic", "To remove the need for security", "To make forms harder to use"], answerIndex: 0, explanation: "Testing invalid input checks whether the form responds safely and clearly." }
    ,
        {
          "id": "web-development-programming-q5",
          "prompt": "What is the primary role of HTML?",
          "options": [
            "To structure and describe webpage content",
            "To store every website password",
            "To replace all server databases",
            "To guarantee website security"
          ],
          "answerIndex": 0,
          "explanation": "HTML provides the structure and meaning of webpage content."
        },
        {
          "id": "web-development-programming-q6",
          "prompt": "Which technology is mainly used to style a webpage?",
          "options": [
            "SQL",
            "CSS",
            "DNS",
            "SMTP"
          ],
          "answerIndex": 1,
          "explanation": "CSS controls visual presentation and layout."
        },
        {
          "id": "web-development-programming-q7",
          "prompt": "What is a JavaScript function useful for?",
          "options": [
            "Replacing every HTML element automatically",
            "Guaranteeing that code has no bugs",
            "Grouping reusable instructions",
            "Registering a domain name"
          ],
          "answerIndex": 2,
          "explanation": "Functions organise reusable behaviour and make code easier to maintain."
        },
        {
          "id": "web-development-programming-q8",
          "prompt": "What should you do first when debugging an error?",
          "options": [
            "Delete the whole project",
            "Ignore the error",
            "Change unrelated files",
            "Read the error and isolate the problem"
          ],
          "answerIndex": 3,
          "explanation": "Understanding and reproducing the error helps identify its cause."
        },
        {
          "id": "web-development-programming-q9",
          "prompt": "Why should a website be tested on different screen sizes?",
          "options": [
            "To make all content invisible",
            "To check that its layout adapts and remains usable",
            "To remove all navigation",
            "To disable accessibility features"
          ],
          "answerIndex": 1,
          "explanation": "Responsive testing helps ensure the site remains usable on different devices."
        },
        {
          "id": "web-development-programming-q10",
          "prompt": "Where should sensitive operations such as payment verification be validated?",
          "options": [
            "Only in a button's colour",
            "Only in a user-editable browser field",
            "On the trusted server side as well as through appropriate checks",
            "Nowhere if the page looks correct"
          ],
          "answerIndex": 2,
          "explanation": "Server-side checks are essential because browser-side inputs can be manipulated."
        }
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
          "Practice: create a monthly budget with income, essential expenses, flexible expenses, and a savings target.",
          "LEARNING TARGETS — In “Prepare a practical budget”, learn the central idea in Financial Literacy & Record Keeping, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — A budget is a plan; financial records show actual events. Compare expected and actual income and spending to find differences early. Understand fees, obligations and risk before committing funds, and protect PINs, passwords and one-time codes.",
          "KEY WORDS — budget — planned income and spending; cash balance — cash available at a point in time; expense — cost incurred or paid; reconciliation — comparison with an independent record; emergency savings — money reserved for unexpected needs. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Record dates, amounts and categories. 2) Separate essential costs, commitments and optional spending. 3) Plan income, spending and savings with realistic assumptions. 4) Compare the plan with receipts, statements and actual outcomes. 5) Investigate differences and adjust the next budget.",
          "WORKED EXAMPLE — A weekly transport budget is KES 1,000, but receipts total KES 1,150. Record the KES 150 difference and investigate the cause instead of silently changing the budget.",
          "GUIDED PRACTICE — Use fictional amounts to prepare a weekly budget with income, needs, optional spending and savings. Add totals and propose an adjustment if spending exceeds income.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Re-add the categories, compare with source receipts and statements, check the date range and investigate unexplained differences.",
          "COMMON MISTAKES — mixing business and personal records without labelling; ignoring repeated small fees; treating borrowed money as income; sharing PINs or verification codes. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "records-and-reconciliation", title: "Keep accurate financial records", minutes: 10, content: [
          "Record the date, description, amount, payment method, and supporting evidence for each transaction. Store receipts and statements securely.",
          "Reconcile your records with cash and account statements regularly. Correct mistakes transparently and keep personal and business transactions separate where possible.",
          "Practice: compare a sample transaction log with a statement and identify any missing entry.",
          "TODAY’S SKILL — Use Keep accurate financial records to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Record dates, amounts and categories. 2) Separate essential costs, commitments and optional spending. 3) Plan income, spending and savings with realistic assumptions. 4) Compare the plan with receipts, statements and actual outcomes. 5) Investigate differences and adjust the next budget.",
          "WATCH A MODEL — A weekly transport budget is KES 1,000, but receipts total KES 1,150. Record the KES 150 difference and investigate the cause instead of silently changing the budget.",
          "TRY IT YOURSELF — Use fictional amounts to prepare a weekly budget with income, needs, optional spending and savings. Add totals and propose an adjustment if spending exceeds income. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Re-add the categories, compare with source receipts and statements, check the date range and investigate unexplained differences.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "saving-and-risk", title: "Save and assess financial risk", minutes: 9, content: [
          "Saving helps prepare for planned expenses and unexpected events. A realistic emergency fund goal depends on income stability, essential costs, and personal circumstances.",
          "Before accepting a financial offer, check fees, conditions, provider identity, and whether promised returns sound implausibly high. Do not borrow or invest based only on pressure or referral promises.",
          "Practice: list three questions to ask before committing money to a financial product.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Financial Literacy & Record Keeping in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: budget — planned income and spending; cash balance — cash available at a point in time; expense — cost incurred or paid; reconciliation — comparison with an independent record; emergency savings — money reserved for unexpected needs. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Use fictional amounts to prepare a weekly budget with income, needs, optional spending and savings. Add totals and propose an adjustment if spending exceeds income.",
          "EXPLAIN YOUR REASONING — A weekly transport budget is KES 1,000, but receipts total KES 1,150. Record the KES 150 difference and investigate the cause instead of silently changing the budget. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Re-add the categories, compare with source receipts and statements, check the date range and investigate unexplained differences.",
          "ERROR SPOTTING — Look for these common mistakes: mixing business and personal records without labelling; ignoring repeated small fees; treating borrowed money as income; sharing PINs or verification codes. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Make a fictional weekly budget and highlight two costs that can vary."
        ]}
    ,
        {
          "id": "financial-literacy-record-keeping-lesson-4",
          "title": "Building a realistic budget",
          "minutes": 9,
          "content": [
              "A budget compares expected income with planned spending over a defined period. Include essential expenses, irregular costs, savings goals and existing obligations.",
              "Separate needs from wants without ignoring important long-term goals. Use realistic estimates and update the budget when income or circumstances change.",
              "If planned expenses exceed income, review flexible spending, consider realistic ways to improve income and prioritise essential commitments.",
              "Practice: draft a weekly budget with income, three expense categories and a savings target.",
              "LESSON FOCUS — Budgeting and priorities. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — List expected income first, then commitments and essential costs. Plan discretionary spending and saving from the amount that remains, and include irregular costs rather than pretending they do not exist.",
              "FOLLOW THE METHOD — 1) Record dates, amounts and categories. 2) Separate essential costs, commitments and optional spending. 3) Plan income, spending and savings with realistic assumptions. 4) Compare the plan with receipts, statements and actual outcomes. 5) Investigate differences and adjust the next budget.",
              "WORKED EXAMPLE — A learner receiving KES 5,000 for the week might allocate transport, meals, required fees and savings before optional purchases.",
              "PRACTICE TASK — Make a fictional weekly budget and highlight two costs that can vary.",
              "COMMON MISTAKES TO AVOID — mixing business and personal records without labelling; ignoring repeated small fees; treating borrowed money as income; sharing PINs or verification codes. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Re-add the categories, compare with source receipts and statements, check the date range and investigate unexplained differences. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "financial-literacy-record-keeping-lesson-5",
          "title": "Cash flow and basic records",
          "minutes": 10,
          "content": [
              "Cash flow records when money enters and leaves a business or household. A business can appear profitable but still struggle if customers pay after bills fall due.",
              "Record each transaction with its date, description, amount, category and supporting evidence. Keep business and personal transactions distinguishable.",
              "Reconcile records against bank or mobile-money statements and investigate differences. Protect financial records and restrict access to authorised people.",
              "Practice: prepare a simple cashbook showing opening balance, receipts, payments and closing balance.",
              "LESSON FOCUS — Records and reconciliation. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A transaction record needs a date, description, amount and category. Reconciliation compares the record with a receipt, statement or cash count and follows differences back to evidence.",
              "FOLLOW THE METHOD — 1) Record dates, amounts and categories. 2) Separate essential costs, commitments and optional spending. 3) Plan income, spending and savings with realistic assumptions. 4) Compare the plan with receipts, statements and actual outcomes. 5) Investigate differences and adjust the next budget.",
              "WORKED EXAMPLE — Your cashbook shows KES 2,400 but the counted cash is KES 2,200. Check each receipt and payment in date order; do not invent a balancing transaction.",
              "PRACTICE TASK — Reconcile five fictional entries and mark the one item that needs investigation.",
              "COMMON MISTAKES TO AVOID — mixing business and personal records without labelling; ignoring repeated small fees; treating borrowed money as income; sharing PINs or verification codes. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Re-add the categories, compare with source receipts and statements, check the date range and investigate unexplained differences. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "financial-literacy-record-keeping-lesson-6",
          "title": "Saving, borrowing and financial decisions",
          "minutes": 9,
          "content": [
              "An emergency fund can help cover unexpected costs. Choose a savings target that suits your income, responsibilities and access to safe financial services.",
              "Before borrowing, compare the total repayment amount, interest, fees, repayment dates and consequences of missed payments. A low advertised rate does not always mean the lowest total cost.",
              "Be cautious of guaranteed high returns, pressure to send money quickly and unclear investment terms. Verify providers and understand the risks before committing funds.",
              "Practice: compare two hypothetical borrowing offers by calculating the total amount repayable under each offer's stated terms.",
              "LESSON FOCUS — Saving and evaluating risk. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A suitable financial choice depends on purpose, time horizon, access to money, fees, risk and the terms of the provider. A promised high return is not proof of safety.",
              "FOLLOW THE METHOD — 1) Record dates, amounts and categories. 2) Separate essential costs, commitments and optional spending. 3) Plan income, spending and savings with realistic assumptions. 4) Compare the plan with receipts, statements and actual outcomes. 5) Investigate differences and adjust the next budget.",
              "WORKED EXAMPLE — Emergency savings need dependable access; money intended for a longer goal may have different constraints, but the learner must understand terms first.",
              "PRACTICE TASK — Compare two fictional savings options by fees, access and risks. Do not use real account credentials or assume future returns.",
              "COMMON MISTAKES TO AVOID — mixing business and personal records without labelling; ignoring repeated small fees; treating borrowed money as income; sharing PINs or verification codes. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Re-add the categories, compare with source receipts and statements, check the date range and investigate unexplained differences. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "financial-literacy-record-keeping-q1", prompt: "What is a budget used for?", options: ["Planning income and spending", "Guaranteeing income", "Hiding transactions", "Replacing all receipts"], answerIndex: 0, explanation: "A budget helps plan and monitor money over a defined period." },
      { id: "financial-literacy-record-keeping-q2", prompt: "Why reconcile records with statements?", options: ["To identify missing or incorrect transactions", "To make records less accurate", "To remove evidence", "To guarantee profit"], answerIndex: 0, explanation: "Reconciliation helps spot differences and correct errors." },
      { id: "financial-literacy-record-keeping-q3", prompt: "What is a sensible response to a guaranteed unusually high return?", options: ["Check the provider, risks, and terms carefully", "Send money immediately", "Ignore all fees", "Borrow as much as possible"], answerIndex: 0, explanation: "Unusually high guaranteed returns can be a warning sign; verify before committing." },
      { id: "financial-literacy-record-keeping-q4", prompt: "Why separate business and personal spending?", options: ["It improves clarity and record keeping", "It guarantees no losses", "It removes tax obligations", "It makes receipts unnecessary"], answerIndex: 0, explanation: "Separate records make it easier to understand business performance." }
    ,
        {
          "id": "financial-literacy-record-keeping-q5",
          "prompt": "What is the main purpose of a budget?",
          "options": [
            "To guarantee unlimited income",
            "To plan income and spending against financial goals",
            "To avoid recording expenses",
            "To remove every unexpected cost"
          ],
          "answerIndex": 1,
          "explanation": "A budget helps organise spending and guide financial decisions."
        },
        {
          "id": "financial-literacy-record-keeping-q6",
          "prompt": "What information is useful in a transaction record?",
          "options": [
            "Only the name of the person involved",
            "Only an estimated monthly total",
            "Date, description, amount and supporting evidence",
            "A password written beside each payment"
          ],
          "answerIndex": 2,
          "explanation": "Complete records make transactions easier to trace and verify."
        },
        {
          "id": "financial-literacy-record-keeping-q7",
          "prompt": "What does cash flow describe?",
          "options": [
            "Money moving into and out of an account or business",
            "The colour of accounting documents",
            "The value of a logo",
            "Only the profit shown on paper"
          ],
          "answerIndex": 0,
          "explanation": "Cash flow tracks receipts and payments over time."
        },
        {
          "id": "financial-literacy-record-keeping-q8",
          "prompt": "Why reconcile records against a bank or mobile-money statement?",
          "options": [
            "To delete all transactions",
            "To avoid noticing mistakes",
            "To increase income automatically",
            "To identify differences, missing entries or errors"
          ],
          "answerIndex": 3,
          "explanation": "Reconciliation helps confirm that records agree with actual transactions."
        },
        {
          "id": "financial-literacy-record-keeping-q9",
          "prompt": "What should you compare before accepting a loan?",
          "options": [
            "Only the advertisement",
            "The total repayment, interest, fees and repayment terms",
            "Only the lender's logo",
            "Only the first instalment"
          ],
          "answerIndex": 1,
          "explanation": "The full cost and repayment terms determine the actual borrowing commitment."
        },
        {
          "id": "financial-literacy-record-keeping-q10",
          "prompt": "Which is a warning sign of a potentially fraudulent investment?",
          "options": [
            "Clear written terms and disclosed risks",
            "Time to verify the provider",
            "Pressure to pay immediately for supposedly guaranteed high returns",
            "An explanation of possible losses"
          ],
          "answerIndex": 2,
          "explanation": "Pressure and unrealistic guarantees are important warning signs to investigate."
        }
      ]
  },
    {
    id: "entrepreneurship-business-planning",
    title: "Entrepreneurship & Business Planning",
    category: "Business & Entrepreneurship",
    description: "Turn a business idea into a simple plan with customer research, operations, costs, and milestones.",
    level: "Intermediate",
    priceKsh: 750,
    published: true,
    lessons: [
      { id: "validate-idea", title: "Test a business idea", minutes: 9, content: [
          "A business idea should address a real customer need. Identify who experiences the problem, how they solve it today, and what could make your offer useful or different.",
          "Interview potential customers and test a small version of the offer before investing heavily. Positive comments are useful, but actual behaviour and purchases provide stronger evidence.",
          "Practice: write three questions you could ask potential customers without leading them toward a preferred answer.",
          "LEARNING TARGETS — In “Test a business idea”, learn the central idea in Entrepreneurship & Business Planning, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Entrepreneurship tests whether a real customer problem can be solved with an offer that can be delivered sustainably. Treat an idea as a hypothesis and gather evidence before spending heavily. A simple plan links the customer, value, price, operations, cash and risks.",
          "KEY WORDS — value proposition — why an offer helps a customer; validation — testing an assumption with evidence; revenue model — how the business earns; break-even — point where revenue equals costs; milestone — measurable progress checkpoint. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Describe one customer and one problem. 2) Compare current alternatives and state the distinct benefit. 3) Test demand with a small, ethical experiment. 4) Estimate price, costs, capacity and cash timing. 5) Set milestones and review the evidence before scaling.",
          "WORKED EXAMPLE — Before renting a shop, a seller tries a small pre-order test with clear prices and delivery terms. Serious orders provide better evidence than general compliments.",
          "GUIDED PRACTICE — Write a one-page plan with target customer, problem, offer, price, three costs, first sales channel and smallest safe test.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Mark estimates clearly, check calculations and confirm that the promised offer can actually be delivered.",
          "COMMON MISTAKES — confusing enthusiasm with demand; forgetting cash required before payment arrives; ignoring permits or delivery constraints; forecasting sales without assumptions. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "simple-business-plan", title: "Write a simple business plan", minutes: 11, content: [
          "A practical plan describes the customer, product or service, value offered, pricing, sales channels, costs, operations, and risks. Keep assumptions visible so they can be tested.",
          "Set measurable milestones such as completing customer interviews, making a first sale, or reaching a target repeat-purchase rate. Assign a date and resource estimate to each milestone.",
          "Practice: outline a one-page plan for a small business idea.",
          "TODAY’S SKILL — Use Write a simple business plan to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Describe one customer and one problem. 2) Compare current alternatives and state the distinct benefit. 3) Test demand with a small, ethical experiment. 4) Estimate price, costs, capacity and cash timing. 5) Set milestones and review the evidence before scaling.",
          "WATCH A MODEL — Before renting a shop, a seller tries a small pre-order test with clear prices and delivery terms. Serious orders provide better evidence than general compliments.",
          "TRY IT YOURSELF — Write a one-page plan with target customer, problem, offer, price, three costs, first sales channel and smallest safe test. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Mark estimates clearly, check calculations and confirm that the promised offer can actually be delivered.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "customer-service-growth", title: "Serve customers and improve", minutes: 9, content: [
          "Explain the offer accurately, set clear expectations, respond respectfully, and provide a practical way for customers to ask questions or raise concerns.",
          "Track complaints, repeat purchases, and common questions. Use feedback to improve the product or process rather than making promises you cannot keep.",
          "Practice: draft a respectful response to a customer who received an order later than expected.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Entrepreneurship & Business Planning in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: value proposition — why an offer helps a customer; validation — testing an assumption with evidence; revenue model — how the business earns; break-even — point where revenue equals costs; milestone — measurable progress checkpoint. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Write a one-page plan with target customer, problem, offer, price, three costs, first sales channel and smallest safe test.",
          "EXPLAIN YOUR REASONING — Before renting a shop, a seller tries a small pre-order test with clear prices and delivery terms. Serious orders provide better evidence than general compliments. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Mark estimates clearly, check calculations and confirm that the promised offer can actually be delivered.",
          "ERROR SPOTTING — Look for these common mistakes: confusing enthusiasm with demand; forgetting cash required before payment arrives; ignoring permits or delivery constraints; forecasting sales without assumptions. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Write five neutral questions to learn about a customer problem and identify one assumption to test."
        ]}
    ,
        {
          "id": "entrepreneurship-business-planning-lesson-4",
          "title": "Identifying customers and validating an idea",
          "minutes": 9,
          "content": [
              "A business idea should address a real customer need. Define the problem, the people affected and the outcome they would value.",
              "Speak with potential customers, observe existing alternatives and compare competitor offers. Treat positive comments as early evidence, not proof that customers will pay.",
              "Test a small version of the offer before committing significant money. Record feedback and use it to improve the product or service.",
              "Practice: describe a customer problem, identify the intended customer and propose one low-cost way to test demand.",
              "LESSON FOCUS — Testing a business idea. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Start with the problem customers face and observe how they solve it now. Use interviews, small trials or pre-orders responsibly, and define in advance what evidence would count as a positive signal.",
              "FOLLOW THE METHOD — 1) Describe one customer and one problem. 2) Compare current alternatives and state the distinct benefit. 3) Test demand with a small, ethical experiment. 4) Estimate price, costs, capacity and cash timing. 5) Set milestones and review the evidence before scaling.",
              "WORKED EXAMPLE — Ask target customers what they currently spend time or money on before asking whether they like a proposed app.",
              "PRACTICE TASK — Write five neutral questions to learn about a customer problem and identify one assumption to test.",
              "COMMON MISTAKES TO AVOID — confusing enthusiasm with demand; forgetting cash required before payment arrives; ignoring permits or delivery constraints; forecasting sales without assumptions. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Mark estimates clearly, check calculations and confirm that the promised offer can actually be delivered. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "entrepreneurship-business-planning-lesson-5",
          "title": "Pricing, costs and basic profitability",
          "minutes": 10,
          "content": [
              "Separate fixed costs, which do not change directly with each unit sold, from variable costs, which generally change with sales or production.",
              "Revenue is the money earned from sales. Profit is what remains after the relevant costs are deducted. Cash received and accounting profit are not always the same.",
              "A sustainable price should consider costs, customer value, competitor alternatives and the amount customers are willing to pay. Revisit estimates as real data becomes available.",
              "Practice: calculate the gross difference between a selling price of KES 500 and a direct unit cost of KES 320.",
              "LESSON FOCUS — Writing a practical business plan. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A plan should show target market, value proposition, competitors, pricing, operations, costs, cash requirements, risks and next milestones. The numbers should match the operational story.",
              "FOLLOW THE METHOD — 1) Describe one customer and one problem. 2) Compare current alternatives and state the distinct benefit. 3) Test demand with a small, ethical experiment. 4) Estimate price, costs, capacity and cash timing. 5) Set milestones and review the evidence before scaling.",
              "WORKED EXAMPLE — A delivery business forecast must include transport, packaging, failed deliveries, payment fees and capacity—not just the sale price.",
              "PRACTICE TASK — Create a one-page plan and label each number as a quote, measured value or estimate.",
              "COMMON MISTAKES TO AVOID — confusing enthusiasm with demand; forgetting cash required before payment arrives; ignoring permits or delivery constraints; forecasting sales without assumptions. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Mark estimates clearly, check calculations and confirm that the promised offer can actually be delivered. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "entrepreneurship-business-planning-lesson-6",
          "title": "Operations, customer service and business planning",
          "minutes": 10,
          "content": [
              "A business plan describes the customer, offer, market, operations, marketing approach, resources, risks and financial assumptions.",
              "Set measurable objectives with a deadline. Track practical indicators such as enquiries, conversion rate, repeat purchases, customer complaints and cash available.",
              "Keep accurate records, communicate honestly, fulfil promises and follow applicable registration, tax, licensing and consumer-protection requirements.",
              "Practice: write one measurable business goal and list the resources, actions and records needed to achieve it.",
              "LESSON FOCUS — Customer service and growth. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Growth should follow reliable delivery and repeat customer value. Track complaints, repeat orders, lead times and cost per order; investigate recurring failures before promoting more volume.",
              "FOLLOW THE METHOD — 1) Describe one customer and one problem. 2) Compare current alternatives and state the distinct benefit. 3) Test demand with a small, ethical experiment. 4) Estimate price, costs, capacity and cash timing. 5) Set milestones and review the evidence before scaling.",
              "WORKED EXAMPLE — If late deliveries cause refunds, improve stock and dispatch processes before paying for a larger advertising campaign.",
              "PRACTICE TASK — Design a simple weekly dashboard with three customer measures and one action for each poor result.",
              "COMMON MISTAKES TO AVOID — confusing enthusiasm with demand; forgetting cash required before payment arrives; ignoring permits or delivery constraints; forecasting sales without assumptions. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Mark estimates clearly, check calculations and confirm that the promised offer can actually be delivered. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "entrepreneurship-business-planning-q1", prompt: "What is a good way to validate a business idea?", options: ["Talk to likely customers and test a small offer", "Assume everyone will buy", "Spend the full budget immediately", "Avoid feedback"], answerIndex: 0, explanation: "Customer research and small tests help check demand before larger commitments." },
      { id: "entrepreneurship-business-planning-q2", prompt: "What belongs in a simple business plan?", options: ["Customers, offer, costs, channels, and risks", "Only a business name", "Only a logo colour", "Unverified promises of income"], answerIndex: 0, explanation: "A plan describes how the business will serve customers and operate." },
      { id: "entrepreneurship-business-planning-q3", prompt: "Why set milestones?", options: ["To track progress toward specific goals", "To guarantee success", "To avoid measuring results", "To hide delays"], answerIndex: 0, explanation: "Milestones make progress and next steps easier to assess." },
      { id: "entrepreneurship-business-planning-q4", prompt: "How should a business handle a customer complaint?", options: ["Listen, respond respectfully, and seek a practical resolution", "Blame the customer immediately", "Delete all feedback", "Promise anything regardless of ability"], answerIndex: 0, explanation: "A fair, honest response helps resolve issues and build trust." }
    ,
        {
          "id": "entrepreneurship-business-planning-q5",
          "prompt": "What is a useful first step when evaluating a business idea?",
          "options": [
            "Rent the largest available premises",
            "Buy stock before researching",
            "Identify a customer problem and investigate demand",
            "Assume every person will buy"
          ],
          "answerIndex": 2,
          "explanation": "Customer research helps establish whether the idea addresses a genuine need."
        },
        {
          "id": "entrepreneurship-business-planning-q6",
          "prompt": "What is revenue?",
          "options": [
            "Money earned from sales before subtracting costs",
            "The same thing as net profit in every case",
            "Only the value of equipment owned",
            "Money borrowed from a lender"
          ],
          "answerIndex": 0,
          "explanation": "Revenue is sales income; profit is calculated after relevant costs."
        },
        {
          "id": "entrepreneurship-business-planning-q7",
          "prompt": "Which is an example of a fixed cost in a typical short-term business budget?",
          "options": [
            "Packaging for each unit sold",
            "A per-unit delivery charge",
            "Raw materials used for every product",
            "A monthly rent payment under a fixed lease"
          ],
          "answerIndex": 3,
          "explanation": "Fixed costs generally do not vary directly with each additional unit sold during the period."
        },
        {
          "id": "entrepreneurship-business-planning-q8",
          "prompt": "Why test an offer with potential customers before investing heavily?",
          "options": [
            "To avoid receiving feedback",
            "To gather evidence about demand and improve the offer",
            "To guarantee immediate success",
            "To eliminate the need for records"
          ],
          "answerIndex": 1,
          "explanation": "Small tests can reveal customer needs and reduce the risk of costly assumptions."
        },
        {
          "id": "entrepreneurship-business-planning-q9",
          "prompt": "What makes a business objective measurable?",
          "options": [
            "It has no deadline",
            "It uses only vague words",
            "It defines an observable result or indicator",
            "It changes whenever progress is slow"
          ],
          "answerIndex": 2,
          "explanation": "Measurable objectives allow progress to be assessed against a clear result."
        },
        {
          "id": "entrepreneurship-business-planning-q10",
          "prompt": "Why should a business keep accurate financial records?",
          "options": [
            "To track transactions and support decisions and obligations",
            "To conceal all spending",
            "To guarantee profit without customers",
            "To avoid checking cash flow"
          ],
          "answerIndex": 0,
          "explanation": "Reliable records support planning, accountability and applicable compliance requirements."
        }
      ]
  },
    {
    id: "ecommerce-online-selling",
    title: "E-commerce & Online Selling",
    category: "Business & Entrepreneurship",
    description: "Learn the basics of presenting products online, managing orders, and building buyer trust.",
    level: "Intermediate",
    priceKsh: 750,
    published: true,
    lessons: [
      { id: "product-listings", title: "Create clear product listings", minutes: 9, content: [
          "A useful listing includes an accurate title, clear photos, key features, condition, price, availability, and delivery or collection terms. Do not hide important limitations.",
          "Use photos you have permission to use and avoid misleading edits. Make sure the price and product description match what you can actually supply.",
          "Practice: draft a listing for a sample product with five useful details a buyer would need.",
          "LEARNING TARGETS — In “Create clear product listings”, learn the central idea in E-commerce & Online Selling, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Online selling depends on accurate listings, clear total prices, dependable fulfilment and trust. Buyers cannot always inspect goods before purchase, so descriptions, stock status, delivery times and return terms must be honest. Confirm payment through the official payment channel rather than trusting a screenshot alone.",
          "KEY WORDS — listing — information that presents a product; fulfilment — picking, packing and delivering an order; conversion — visitor completing a desired action; refund — money returned under agreed or required terms; chargeback — payment reversal through a provider. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Confirm item, condition, stock and delivery ability. 2) Write accurate title, description, price and product details. 3) Publish payment, dispatch and return conditions. 4) Verify the payment and match it to the order. 5) Track dispatch, communicate delays and preserve permitted records.",
          "WORKED EXAMPLE — A buyer orders a medium blue shirt. Check the SKU, size, colour, payment status and delivery address before packing to prevent a paid order being fulfilled incorrectly.",
          "GUIDED PRACTICE — Make a fictional product listing with size, condition, total price and delivery estimate, then simulate an out-of-stock order and draft a fair customer message.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Match the order with verified payment and available stock, confirm the address securely, and keep necessary dispatch records.",
          "COMMON MISTAKES — misleading photographs; hidden fees or delivery delays; trusting payment screenshots; ignoring a dispute. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "orders-and-delivery", title: "Manage orders and delivery", minutes: 10, content: [
          "Keep a clear record of order number, product, quantity, customer contact details, payment status, and fulfilment status. Limit access to personal data and retain it only as needed.",
          "Communicate expected delivery times and what happens if an item is unavailable. Use a reliable process for confirming payment rather than trusting screenshots alone.",
          "Practice: design a simple order-status checklist from order received to delivered.",
          "TODAY’S SKILL — Use Manage orders and delivery to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Confirm item, condition, stock and delivery ability. 2) Write accurate title, description, price and product details. 3) Publish payment, dispatch and return conditions. 4) Verify the payment and match it to the order. 5) Track dispatch, communicate delays and preserve permitted records.",
          "WATCH A MODEL — A buyer orders a medium blue shirt. Check the SKU, size, colour, payment status and delivery address before packing to prevent a paid order being fulfilled incorrectly.",
          "TRY IT YOURSELF — Make a fictional product listing with size, condition, total price and delivery estimate, then simulate an out-of-stock order and draft a fair customer message. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Match the order with verified payment and available stock, confirm the address securely, and keep necessary dispatch records.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "trust-and-disputes", title: "Build trust and handle disputes", minutes: 9, content: [
          "Publish clear return, refund, delivery, and contact information appropriate to your business and applicable rules. Respond to questions honestly and avoid fake reviews.",
          "Keep records of orders and customer communication. If a dispute occurs, review the evidence, explain the next step, and follow the agreed policy and provider procedures.",
          "Practice: write a short, calm message explaining a verified delivery delay and the available options.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain E-commerce & Online Selling in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: listing — information that presents a product; fulfilment — picking, packing and delivering an order; conversion — visitor completing a desired action; refund — money returned under agreed or required terms; chargeback — payment reversal through a provider. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Make a fictional product listing with size, condition, total price and delivery estimate, then simulate an out-of-stock order and draft a fair customer message.",
          "EXPLAIN YOUR REASONING — A buyer orders a medium blue shirt. Check the SKU, size, colour, payment status and delivery address before packing to prevent a paid order being fulfilled incorrectly. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Match the order with verified payment and available stock, confirm the address securely, and keep necessary dispatch records.",
          "ERROR SPOTTING — Look for these common mistakes: misleading photographs; hidden fees or delivery delays; trusting payment screenshots; ignoring a dispute. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Write a listing for a fictional item and ask a reader what information is still missing."
        ]}
    ,
        {
          "id": "ecommerce-online-selling-lesson-4",
          "title": "Setting up a trustworthy online product listing",
          "minutes": 9,
          "content": [
              "A useful product listing gives a clear name, accurate description, price, available options and relevant specifications. Explain what the customer will actually receive.",
              "Use clear photographs that represent the real product. State important limitations, condition, delivery coverage and any extra charges before the customer pays.",
              "Keep stock and prices updated. Avoid misleading claims, copied images used without permission and promises that cannot be fulfilled.",
              "Practice: draft a product listing that includes a description, price, delivery information and return terms.",
              "LESSON FOCUS — Accurate product listings. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Use a precise title, current photographs, measurements, condition, included items, availability and full price. A customer should understand what will arrive and what is not included.",
              "FOLLOW THE METHOD — 1) Confirm item, condition, stock and delivery ability. 2) Write accurate title, description, price and product details. 3) Publish payment, dispatch and return conditions. 4) Verify the payment and match it to the order. 5) Track dispatch, communicate delays and preserve permitted records.",
              "WORKED EXAMPLE — For a used laptop, state model, memory, storage, battery condition, included charger and known defects instead of writing “excellent laptop.”",
              "PRACTICE TASK — Write a listing for a fictional item and ask a reader what information is still missing.",
              "COMMON MISTAKES TO AVOID — misleading photographs; hidden fees or delivery delays; trusting payment screenshots; ignoring a dispute. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Match the order with verified payment and available stock, confirm the address securely, and keep necessary dispatch records. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "ecommerce-online-selling-lesson-5",
          "title": "Orders, payments and delivery",
          "minutes": 10,
          "content": [
              "Create a consistent process for receiving orders, confirming availability, checking payment status, packing goods and communicating delivery arrangements.",
              "Do not treat a screenshot or a customer's claim as definitive proof of payment. Confirm transactions through the authorised payment provider or trusted merchant records.",
              "Protect customer contact and address information. Share it only with authorised people who need it to fulfil the order and follow applicable data-protection requirements.",
              "Practice: map the steps from customer order to payment confirmation, dispatch and delivery confirmation.",
              "LESSON FOCUS — Orders, stock and delivery. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Each order needs a reference, payment status, items, quantity, dispatch state and delivery details. Stock counts should change consistently and unexpected delays should be communicated promptly.",
              "FOLLOW THE METHOD — 1) Confirm item, condition, stock and delivery ability. 2) Write accurate title, description, price and product details. 3) Publish payment, dispatch and return conditions. 4) Verify the payment and match it to the order. 5) Track dispatch, communicate delays and preserve permitted records.",
              "WORKED EXAMPLE — When two customers order the last unit, a clear stock reservation prevents accidental overselling.",
              "PRACTICE TASK — Draw an order-status flow from received to delivered and show what evidence moves it to the next status.",
              "COMMON MISTAKES TO AVOID — misleading photographs; hidden fees or delivery delays; trusting payment screenshots; ignoring a dispute. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Match the order with verified payment and available stock, confirm the address securely, and keep necessary dispatch records. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "ecommerce-online-selling-lesson-6",
          "title": "Customer service, returns and online growth",
          "minutes": 9,
          "content": [
              "Respond politely and accurately to customer questions. Provide realistic delivery estimates and explain what happens if an item is unavailable or delayed.",
              "Publish clear return, refund and complaint-handling procedures that comply with applicable law and the terms of the sales platform and payment provider.",
              "Measure enquiries, completed orders, cancellations, returns and repeat purchases. Use the results to improve product information and service rather than relying on follower counts alone.",
              "Practice: design a simple procedure for resolving an order that arrives damaged or differs from its description.",
              "LESSON FOCUS — Trust, returns and disputes. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Clear policies and consistent records help resolve complaints. Verify payments through official systems, describe goods honestly and follow the applicable consumer and payment-provider rules.",
              "FOLLOW THE METHOD — 1) Confirm item, condition, stock and delivery ability. 2) Write accurate title, description, price and product details. 3) Publish payment, dispatch and return conditions. 4) Verify the payment and match it to the order. 5) Track dispatch, communicate delays and preserve permitted records.",
              "WORKED EXAMPLE — If a parcel arrives damaged, ask for relevant order evidence through the approved channel and apply the stated fair resolution process.",
              "PRACTICE TASK — Draft a calm response to a fictional delivery complaint and list the records needed to investigate it.",
              "COMMON MISTAKES TO AVOID — misleading photographs; hidden fees or delivery delays; trusting payment screenshots; ignoring a dispute. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Match the order with verified payment and available stock, confirm the address securely, and keep necessary dispatch records. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "ecommerce-online-selling-q1", prompt: "What makes an online product listing trustworthy?", options: ["Accurate details and clear terms", "Hidden extra charges", "Copied photos used without permission", "Unrealistic claims"], answerIndex: 0, explanation: "Accurate listings help customers make informed decisions." },
      { id: "ecommerce-online-selling-q2", prompt: "Why keep order records?", options: ["To track payment and fulfilment accurately", "To publish customer details publicly", "To replace all customer communication", "To guarantee every delivery is instant"], answerIndex: 0, explanation: "Order records help coordinate payment, stock, and delivery." },
      { id: "ecommerce-online-selling-q3", prompt: "What is a sound way to confirm a payment?", options: ["Check the official provider or account records", "Rely only on a screenshot", "Trust any forwarded message", "Ship before checking any required payment"], answerIndex: 0, explanation: "Independent confirmation reduces the risk of forged payment evidence." },
      { id: "ecommerce-online-selling-q4", prompt: "How should a seller respond to a dispute?", options: ["Review records and follow clear policies", "Invent a new charge", "Ignore the buyer forever", "Publish private customer information"], answerIndex: 0, explanation: "Fair handling relies on evidence, clear communication, and appropriate policies." }
    ,
        {
          "id": "ecommerce-online-selling-q5",
          "prompt": "What should an accurate online product listing include?",
          "options": [
            "A misleading photo only",
            "A description with no price",
            "An unsupported guarantee",
            "Clear details, accurate price and relevant delivery terms"
          ],
          "answerIndex": 3,
          "explanation": "Accurate product information helps customers make informed purchase decisions."
        },
        {
          "id": "ecommerce-online-selling-q6",
          "prompt": "How should a seller confirm an electronic payment?",
          "options": [
            "Rely only on a screenshot",
            "Check the transaction through the authorised provider or trusted records",
            "Assume every message is genuine",
            "Dispatch every order before checking"
          ],
          "answerIndex": 1,
          "explanation": "Independent transaction verification helps prevent payment fraud."
        },
        {
          "id": "ecommerce-online-selling-q7",
          "prompt": "How should customer delivery details be handled?",
          "options": [
            "Post them publicly",
            "Send them to unrelated businesses",
            "Limit access to authorised people who need the information",
            "Keep them forever without a purpose"
          ],
          "answerIndex": 2,
          "explanation": "Limiting access helps protect customer privacy and personal information."
        },
        {
          "id": "ecommerce-online-selling-q8",
          "prompt": "What is a sensible response when an ordered item is unavailable?",
          "options": [
            "Inform the customer promptly and explain available options",
            "Silently substitute a different item",
            "Ignore all messages",
            "Mark it delivered without dispatch"
          ],
          "answerIndex": 0,
          "explanation": "Prompt, honest communication helps customers choose an appropriate next step."
        },
        {
          "id": "ecommerce-online-selling-q9",
          "prompt": "Which measure helps assess online sales performance?",
          "options": [
            "The colour of the website",
            "The number of unrelated messages",
            "The length of the product title alone",
            "Completed orders compared with enquiries"
          ],
          "answerIndex": 3,
          "explanation": "Conversion from enquiries to completed orders is one useful performance indicator."
        },
        {
          "id": "ecommerce-online-selling-q10",
          "prompt": "Why publish clear return and refund procedures?",
          "options": [
            "To hide customer rights",
            "To explain how problems are handled and set clear expectations",
            "To promise refunds in every possible situation regardless of law",
            "To avoid documenting complaints"
          ],
          "answerIndex": 1,
          "explanation": "Clear policies help customers understand the process and should comply with applicable requirements."
        }
      ]
  },
    {
    id: "leadership-communication",
    title: "Leadership & Communication",
    category: "Professional & Technical Skills",
    description: "Practice clear workplace communication, teamwork, goal setting, and constructive feedback.",
    level: "Intermediate",
    priceKsh: 750,
    published: true,
    lessons: [
      { id: "clear-communication", title: "Communicate clearly", minutes: 8, content: [
          "Clear communication states the purpose, relevant facts, requested action, and deadline when needed. Adapt the level of detail and language to the audience.",
          "Listen without interrupting, ask clarifying questions, and summarise important agreements. Written messages should make the next step easy to understand.",
          "Practice: rewrite a vague work message so it states the task, owner, and due date.",
          "LEARNING TARGETS — In “Communicate clearly”, learn the central idea in Leadership & Communication, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Effective leadership makes goals, responsibilities and decisions clear while allowing people to ask questions and disagree respectfully. Listening and checking understanding are as important as speaking. Useful feedback describes observable behaviour and agrees on a realistic next step.",
          "KEY WORDS — active listening — attending and checking understanding; delegation — assigning responsibility and authority; feedback — information used to improve work; accountability — owning agreed responsibilities; conflict of interest — a competing interest that may affect judgement. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) State the goal and why it matters. 2) Invite relevant views and listen before deciding. 3) Clarify roles, decisions, deadlines and resources. 4) Address disagreement using facts and a shared objective. 5) Review commitments and offer specific feedback.",
          "WORKED EXAMPLE — Two colleagues disagree about a deadline. List remaining tasks, ask for realistic estimates, identify dependencies and agree a plan rather than blaming one person.",
          "GUIDED PRACTICE — Write a briefing containing goal, owner, deadline and success measure. Ask a reader to repeat the next action without looking at the text.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Ask the listener to restate the action, record the owner and date, and check whether the commitment was realistic.",
          "COMMON MISTAKES — giving vague instructions; assuming silence means agreement; attacking personality in feedback; changing decisions without explaining why. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "teamwork-conflict", title: "Work through disagreement", minutes: 10, content: [
          "Focus on the issue and observable facts rather than personal attacks. Ask each person to explain their concern and identify the shared outcome.",
          "Agree on practical actions, responsibilities, and a follow-up time. Escalate serious safety, harassment, or misconduct concerns through the appropriate channels.",
          "Practice: outline a respectful response when two team members disagree about a deadline.",
          "TODAY’S SKILL — Use Work through disagreement to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) State the goal and why it matters. 2) Invite relevant views and listen before deciding. 3) Clarify roles, decisions, deadlines and resources. 4) Address disagreement using facts and a shared objective. 5) Review commitments and offer specific feedback.",
          "WATCH A MODEL — Two colleagues disagree about a deadline. List remaining tasks, ask for realistic estimates, identify dependencies and agree a plan rather than blaming one person.",
          "TRY IT YOURSELF — Write a briefing containing goal, owner, deadline and success measure. Ask a reader to repeat the next action without looking at the text. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Ask the listener to restate the action, record the owner and date, and check whether the commitment was realistic.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "goals-and-feedback", title: "Set goals and use feedback", minutes: 9, content: [
          "Useful goals are specific and time-bound, with a clear way to measure progress. Break a large task into smaller actions and review progress regularly.",
          "Give feedback about specific behaviour and its impact, then discuss a constructive next step. Receive feedback by asking questions and deciding what can be applied.",
          "Practice: set one measurable learning goal for the next four weeks.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Leadership & Communication in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: active listening — attending and checking understanding; delegation — assigning responsibility and authority; feedback — information used to improve work; accountability — owning agreed responsibilities; conflict of interest — a competing interest that may affect judgement. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Write a briefing containing goal, owner, deadline and success measure. Ask a reader to repeat the next action without looking at the text.",
          "EXPLAIN YOUR REASONING — Two colleagues disagree about a deadline. List remaining tasks, ask for realistic estimates, identify dependencies and agree a plan rather than blaming one person. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Ask the listener to restate the action, record the owner and date, and check whether the commitment was realistic.",
          "ERROR SPOTTING — Look for these common mistakes: giving vague instructions; assuming silence means agreement; attacking personality in feedback; changing decisions without explaining why. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Rewrite three vague workplace requests so each has an action, owner or recipient, and deadline."
        ]}
    ,
        {
          "id": "leadership-communication-lesson-4",
          "title": "Leadership styles and responsibility",
          "minutes": 9,
          "content": [
              "Leadership involves helping people work toward a shared goal. Effective leaders clarify responsibilities, communicate expectations and support their teams.",
              "Different situations require different approaches. A team learning a new task may need clear guidance, while an experienced team may benefit from greater independence.",
              "Responsible leaders consider evidence, fairness, safety and the effects of decisions on others. They accept accountability and correct mistakes.",
              "Practice: describe a team situation and explain which leadership approach could help the team succeed.",
              "LESSON FOCUS — Clear communication. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A message should identify the purpose, audience, action required, deadline and relevant context. Adjust vocabulary and detail to the listener without changing the facts.",
              "FOLLOW THE METHOD — 1) State the goal and why it matters. 2) Invite relevant views and listen before deciding. 3) Clarify roles, decisions, deadlines and resources. 4) Address disagreement using facts and a shared objective. 5) Review commitments and offer specific feedback.",
              "WORKED EXAMPLE — “Send it soon” becomes “Please send the signed form by Thursday at 3 p.m. so the application can be submitted.”",
              "PRACTICE TASK — Rewrite three vague workplace requests so each has an action, owner or recipient, and deadline.",
              "COMMON MISTAKES TO AVOID — giving vague instructions; assuming silence means agreement; attacking personality in feedback; changing decisions without explaining why. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Ask the listener to restate the action, record the owner and date, and check whether the commitment was realistic. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "leadership-communication-lesson-5",
          "title": "Clear communication and active listening",
          "minutes": 9,
          "content": [
              "Clear communication uses language suited to the audience, a well-defined purpose and an appropriate channel. Important instructions should be specific and easy to verify.",
              "Active listening means paying attention, asking relevant questions and summarising what you heard before responding. It helps reduce misunderstandings.",
              "Non-verbal signals and cultural expectations can affect communication. When meaning is unclear, ask respectfully rather than making assumptions.",
              "Practice: summarise a colleague's request in your own words and ask whether you understood it correctly.",
              "LESSON FOCUS — Teamwork and disagreement. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Separate the person from the issue. Ask questions, agree on the shared goal, compare facts and develop options. Escalate safety, harassment or serious policy issues through appropriate channels.",
              "FOLLOW THE METHOD — 1) State the goal and why it matters. 2) Invite relevant views and listen before deciding. 3) Clarify roles, decisions, deadlines and resources. 4) Address disagreement using facts and a shared objective. 5) Review commitments and offer specific feedback.",
              "WORKED EXAMPLE — When two team members propose different plans, compare cost, time, evidence and risk using the same criteria for each.",
              "PRACTICE TASK — Create a comparison table for two solutions and identify one question that would reduce uncertainty.",
              "COMMON MISTAKES TO AVOID — giving vague instructions; assuming silence means agreement; attacking personality in feedback; changing decisions without explaining why. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Ask the listener to restate the action, record the owner and date, and check whether the commitment was realistic. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "leadership-communication-lesson-6",
          "title": "Teamwork, conflict and feedback",
          "minutes": 10,
          "content": [
              "Healthy teams agree on goals, roles, deadlines and ways to share progress. Reliability means following through or communicating early when a commitment may not be met.",
              "When conflict occurs, focus on observable facts, the impact of the issue and possible solutions rather than personal attacks.",
              "Useful feedback is specific, respectful and actionable. Invite the other person's perspective and agree on a practical next step.",
              "Practice: write a respectful response to a missed deadline that identifies the impact and proposes a solution.",
              "LESSON FOCUS — Goals and feedback. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A useful goal has an observable outcome and a review date. Feedback should describe what happened, its effect and the next behaviour or support needed.",
              "FOLLOW THE METHOD — 1) State the goal and why it matters. 2) Invite relevant views and listen before deciding. 3) Clarify roles, decisions, deadlines and resources. 4) Address disagreement using facts and a shared objective. 5) Review commitments and offer specific feedback.",
              "WORKED EXAMPLE — Instead of “You are careless,” say “Two reports lacked dates, which delayed review; use the date checklist on the next report.”",
              "PRACTICE TASK — Write one specific feedback statement and one measurable goal with a review date.",
              "COMMON MISTAKES TO AVOID — giving vague instructions; assuming silence means agreement; attacking personality in feedback; changing decisions without explaining why. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Ask the listener to restate the action, record the owner and date, and check whether the commitment was realistic. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "leadership-communication-q1", prompt: "What makes a work message clear?", options: ["Purpose, action, and relevant deadline", "Unexplained abbreviations only", "No context at all", "Several unrelated requests mixed together"], answerIndex: 0, explanation: "A clear message helps the reader understand what is needed and when." },
      { id: "leadership-communication-q2", prompt: "What is a constructive way to handle disagreement?", options: ["Discuss facts and shared outcomes respectfully", "Attack the other person", "Spread rumours", "Avoid every decision"], answerIndex: 0, explanation: "Respectful discussion helps identify options and agree on actions." },
      { id: "leadership-communication-q3", prompt: "What is a measurable goal?", options: ["A goal with a clear indicator and timeframe", "A wish with no next step", "A task no one owns", "A promise of guaranteed success"], answerIndex: 0, explanation: "Measures and timeframes make progress easier to evaluate." },
      { id: "leadership-communication-q4", prompt: "How should feedback be given?", options: ["Describe specific behaviour and a constructive next step", "Use personal insults", "Make claims without examples", "Avoid explaining the impact"], answerIndex: 0, explanation: "Specific, respectful feedback is easier to understand and act on." }
    ,
        {
          "id": "leadership-communication-q5",
          "prompt": "What is an important responsibility of a leader?",
          "options": [
            "Avoid all decisions",
            "Clarify goals and help the team work responsibly",
            "Take credit for every team member's work",
            "Hide important instructions"
          ],
          "answerIndex": 1,
          "explanation": "Leaders help teams understand their goals, responsibilities and standards."
        },
        {
          "id": "leadership-communication-q6",
          "prompt": "What does active listening involve?",
          "options": [
            "Planning a reply while ignoring the speaker",
            "Interrupting frequently",
            "Paying attention and checking your understanding",
            "Assuming you already know the answer"
          ],
          "answerIndex": 2,
          "explanation": "Active listening includes attention, relevant questions and checking meaning."
        },
        {
          "id": "leadership-communication-q7",
          "prompt": "How should a team handle a disagreement?",
          "options": [
            "Discuss facts and possible solutions respectfully",
            "Use personal insults",
            "Hide the issue indefinitely",
            "Blame a person before checking the facts"
          ],
          "answerIndex": 0,
          "explanation": "A constructive discussion focuses on the issue and practical solutions."
        },
        {
          "id": "leadership-communication-q8",
          "prompt": "Which is an example of useful feedback?",
          "options": [
            "You are always bad at this",
            "Nothing needs to change, even when errors continue",
            "A vague complaint with no example",
            "A specific observation with a practical improvement suggestion"
          ],
          "answerIndex": 3,
          "explanation": "Specific, actionable feedback gives a person something concrete to improve."
        },
        {
          "id": "leadership-communication-q9",
          "prompt": "Why should team members communicate delays early?",
          "options": [
            "To avoid all responsibility",
            "So the team can adjust plans and manage risks",
            "To guarantee that every deadline changes",
            "To stop sharing progress"
          ],
          "answerIndex": 1,
          "explanation": "Early communication gives the team time to adjust responsibilities and deadlines."
        },
        {
          "id": "leadership-communication-q10",
          "prompt": "What supports fair leadership?",
          "options": [
            "Making decisions based only on personal favour",
            "Ignoring safety concerns",
            "Considering evidence, consistency and the impact on people",
            "Refusing to correct mistakes"
          ],
          "answerIndex": 2,
          "explanation": "Fair leadership considers relevant evidence and applies appropriate standards consistently."
        }
      ]
  },
    {
    id: "freelancing-digital-careers",
    title: "Freelancing & Digital Careers",
    category: "Learning Pathways",
    description: "Explore digital career options, prepare a portfolio, and approach clients professionally.",
    level: "Intermediate",
    priceKsh: 750,
    published: true,
    lessons: [
      { id: "choose-a-service", title: "Choose a realistic service", minutes: 9, content: [
          "Digital services may include writing, design, data entry, web work, customer support, or marketing. Match the service to your skills, equipment, available time, and the needs of a defined client group.",
          "Study examples of real job requirements and practise the tasks before promising delivery. Be honest about your experience and the results you can reasonably provide.",
          "Practice: choose one service and list three skills or sample tasks that demonstrate readiness.",
          "LEARNING TARGETS — In “Choose a realistic service”, learn the central idea in Freelancing & Digital Careers, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
          "CORE IDEA — Freelancing is a service business. Clients need a defined result, reliable delivery and understandable terms. A portfolio should show genuine ability; a proposal defines scope, schedule, price, assumptions and revisions. Verify opportunities and avoid suspicious upfront fees or requests to misuse accounts.",
          "KEY WORDS — portfolio — evidence of relevant capability; scope — work included in the agreement; deliverable — item or result handed to the client; milestone — checkpoint tied to progress; client due diligence — checking legitimacy before work. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
          "STEP-BY-STEP MODEL — 1) Choose a service that matches current skills and resources. 2) Create a sample using fictional or permitted material. 3) Define deliverables, exclusions, schedule and revisions. 4) Agree price and payment terms in writing. 5) Deliver professionally, gather feedback and record results truthfully.",
          "WORKED EXAMPLE — A client requests ten social posts. Clarify formats, copy length, revisions, due dates, brand assets and what will count as additional work before agreeing a price.",
          "GUIDED PRACTICE — Draft a one-page proposal with service, sample, deliverables, timeline, payment terms, client responsibilities and a safe contact route.",
          "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Confirm scope in writing, keep deliverable versions and payment records, and make every portfolio claim truthful.",
          "COMMON MISTAKES — paying to unlock a supposed job; accepting vague scope; claiming another person’s work as your own; following suspicious account or payment instructions. If you make one of these mistakes, write the correction beside it and try a similar task again."
        ]},
      { id: "portfolio-and-proposals", title: "Build a portfolio and proposal", minutes: 10, content: [
          "A portfolio can include original practice projects, volunteer work, or authorised examples. Clearly label practice work and never claim another person's work as your own.",
          "A proposal should summarise the client's need, the deliverable, scope, timeline, price, assumptions, and revision process. Confirm terms before starting work.",
          "Practice: draft a short proposal for a clearly defined sample task.",
          "TODAY’S SKILL — Use Build a portfolio and proposal to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
          "FOLLOW THESE STEPS — 1) Choose a service that matches current skills and resources. 2) Create a sample using fictional or permitted material. 3) Define deliverables, exclusions, schedule and revisions. 4) Agree price and payment terms in writing. 5) Deliver professionally, gather feedback and record results truthfully.",
          "WATCH A MODEL — A client requests ten social posts. Clarify formats, copy length, revisions, due dates, brand assets and what will count as additional work before agreeing a price.",
          "TRY IT YOURSELF — Draft a one-page proposal with service, sample, deliverables, timeline, payment terms, client responsibilities and a safe contact route. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
          "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
          "QUALITY CHECK — Confirm scope in writing, keep deliverable versions and payment records, and make every portfolio claim truthful.",
          "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
          "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
        ]},
      { id: "avoid-work-scams", title: "Find work safely and manage clients", minutes: 9, content: [
          "Be cautious when a supposed employer asks for upfront fees to unlock a job, requests sensitive codes, or promises unusually high pay for little work. Verify the client and platform independently.",
          "Keep agreed scope and payment terms in writing. Protect client information, meet realistic deadlines, and communicate early if a task is at risk.",
          "Practice: list questions to verify a client and agree on a task before beginning.",
          "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Freelancing & Digital Careers in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
          "CONCEPT CONNECTIONS — Connect these terms to your own example: portfolio — evidence of relevant capability; scope — work included in the agreement; deliverable — item or result handed to the client; milestone — checkpoint tied to progress; client due diligence — checking legitimacy before work. Draw arrows or make a small table if it helps you see how the terms relate.",
          "MINI-CHALLENGE — Draft a one-page proposal with service, sample, deliverables, timeline, payment terms, client responsibilities and a safe contact route.",
          "EXPLAIN YOUR REASONING — A client requests ten social posts. Clarify formats, copy length, revisions, due dates, brand assets and what will count as additional work before agreeing a price. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
          "CHECK THE ANSWER — Confirm scope in writing, keep deliverable versions and payment records, and make every portfolio claim truthful.",
          "ERROR SPOTTING — Look for these common mistakes: paying to unlock a supposed job; accepting vague scope; claiming another person’s work as your own; following suspicious account or payment instructions. Pick one and write the correction in a full sentence.",
          "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
          "SMALL NEXT STEP — Describe one service, the client problem it solves, required tools and one skill you still need to practise."
        ]}
    ,
        {
          "id": "freelancing-digital-careers-lesson-4",
          "title": "Choosing a service and building a portfolio",
          "minutes": 9,
          "content": [
              "Freelancers offer services to clients on an independent basis. Examples include writing, design, programming, virtual assistance, research and digital marketing.",
              "Choose a service that matches your current skills and the needs of potential clients. Identify specific tasks you can deliver reliably and areas where you need more practice.",
              "A portfolio demonstrates ability through relevant examples. Use original work or obtain permission before sharing client work, and never invent qualifications or results.",
              "Practice: choose one service and outline three portfolio examples that could demonstrate your ability.",
              "LESSON FOCUS — Choosing a realistic service. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Start with a service you can deliver with your present skills, tools and time. A narrow, specific offer is easier to demonstrate and estimate than a promise to do everything.",
              "FOLLOW THE METHOD — 1) Choose a service that matches current skills and resources. 2) Create a sample using fictional or permitted material. 3) Define deliverables, exclusions, schedule and revisions. 4) Agree price and payment terms in writing. 5) Deliver professionally, gather feedback and record results truthfully.",
              "WORKED EXAMPLE — “Format a five-page report in Word with consistent headings and tables” is more measurable than “I can do office work.”",
              "PRACTICE TASK — Describe one service, the client problem it solves, required tools and one skill you still need to practise.",
              "COMMON MISTAKES TO AVOID — paying to unlock a supposed job; accepting vague scope; claiming another person’s work as your own; following suspicious account or payment instructions. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Confirm scope in writing, keep deliverable versions and payment records, and make every portfolio claim truthful. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "freelancing-digital-careers-lesson-5",
          "title": "Proposals, pricing and client agreements",
          "minutes": 10,
          "content": [
              "A good proposal summarises the client's need, the proposed solution, deliverables, schedule, price and any assumptions. Ask questions when the scope is unclear.",
              "Estimate the time, tools, revisions and other costs needed to complete a project. Set a price that accounts for these costs and the value of the service.",
              "Confirm payment terms, ownership of deliverables, confidentiality, revision limits and cancellation arrangements in writing. Be cautious of clients who request unnecessary upfront payments or sensitive account credentials.",
              "Practice: draft a short proposal for a clearly defined service with a deadline and deliverables.",
              "LESSON FOCUS — Portfolio and proposals. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Use original or permission-cleared samples. A proposal should define the goal, deliverables, schedule, assumptions, revisions, payment plan and acceptance criteria.",
              "FOLLOW THE METHOD — 1) Choose a service that matches current skills and resources. 2) Create a sample using fictional or permitted material. 3) Define deliverables, exclusions, schedule and revisions. 4) Agree price and payment terms in writing. 5) Deliver professionally, gather feedback and record results truthfully.",
              "WORKED EXAMPLE — A logo proposal lists file formats, colour variants, number of concepts and how many rounds of revision are included.",
              "PRACTICE TASK — Prepare a fictional proposal and mark which details must be confirmed with the client before work begins.",
              "COMMON MISTAKES TO AVOID — paying to unlock a supposed job; accepting vague scope; claiming another person’s work as your own; following suspicious account or payment instructions. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Confirm scope in writing, keep deliverable versions and payment records, and make every portfolio claim truthful. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "freelancing-digital-careers-lesson-6",
          "title": "Managing work, reputation and income",
          "minutes": 9,
          "content": [
              "Break projects into milestones and track deadlines, hours and outstanding tasks. Provide progress updates before the client has to ask.",
              "Keep records of proposals, agreements, invoices, payments and business expenses. Plan for periods with fewer projects and remember that gross receipts are not the same as profit.",
              "Protect client information, deliver work honestly and request permission before publishing testimonials or confidential examples. Follow relevant tax and legal obligations.",
              "Practice: create a simple weekly work plan with deadlines, client updates and time reserved for finding future work.",
              "LESSON FOCUS — Finding work safely. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Check the client, platform, terms and actual scope before investing unpaid time. Be suspicious of fees to unlock jobs, requests to receive or forward money, and demands for account passwords.",
              "FOLLOW THE METHOD — 1) Choose a service that matches current skills and resources. 2) Create a sample using fictional or permitted material. 3) Define deliverables, exclusions, schedule and revisions. 4) Agree price and payment terms in writing. 5) Deliver professionally, gather feedback and record results truthfully.",
              "WORKED EXAMPLE — A recruiter asks for a “registration payment” before revealing the job. Verify the company independently and do not pay simply to access a promised role.",
              "PRACTICE TASK — Evaluate two fictional job offers and highlight evidence of legitimacy, warning signs and questions to ask.",
              "COMMON MISTAKES TO AVOID — paying to unlock a supposed job; accepting vague scope; claiming another person’s work as your own; following suspicious account or payment instructions. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Confirm scope in writing, keep deliverable versions and payment records, and make every portfolio claim truthful. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      { id: "freelancing-digital-careers-q1", prompt: "What is a good first step toward freelancing?", options: ["Choose a service you can demonstrate and research client needs", "Claim skills you do not have", "Pay anyone who promises guaranteed work", "Send passwords to clients"], answerIndex: 0, explanation: "A realistic service and demonstrable skills help set honest expectations." },
      { id: "freelancing-digital-careers-q2", prompt: "What should a proposal include?", options: ["Scope, deliverables, timeline, and price", "Only a vague promise", "A client's private password", "Unrelated personal details"], answerIndex: 0, explanation: "Clear proposals reduce misunderstandings about work and payment." },
      { id: "freelancing-digital-careers-q3", prompt: "What can indicate a job scam?", options: ["Upfront fee pressure and unrealistic promises", "A clear task description", "A written scope of work", "A verifiable client history"], answerIndex: 0, explanation: "Upfront fee demands and unrealistic promises warrant careful verification." },
      { id: "freelancing-digital-careers-q4", prompt: "How should practice work be presented in a portfolio?", options: ["Label it honestly and use work you have rights to share", "Claim it was paid client work", "Copy another freelancer's work", "Publish confidential client files"], answerIndex: 0, explanation: "Honest attribution and permission protect trust and intellectual property." }
    ,
        {
          "id": "freelancing-digital-careers-q5",
          "prompt": "What is the main purpose of a freelancer's portfolio?",
          "options": [
            "To prove every client will be satisfied",
            "To display account passwords",
            "To demonstrate skills through relevant work examples",
            "To replace all written agreements"
          ],
          "answerIndex": 2,
          "explanation": "A portfolio gives prospective clients evidence of the freelancer's skills."
        },
        {
          "id": "freelancing-digital-careers-q6",
          "prompt": "What should a clear freelance proposal include?",
          "options": [
            "Scope, deliverables, schedule and price",
            "Only a greeting",
            "A guarantee of results outside the freelancer's control",
            "The client's private passwords"
          ],
          "answerIndex": 0,
          "explanation": "A clear proposal sets expectations about the work, timing and cost."
        },
        {
          "id": "freelancing-digital-careers-q7",
          "prompt": "Why confirm project terms in writing?",
          "options": [
            "To make the project impossible to change",
            "To avoid telling the client what is included",
            "To remove the need for communication",
            "To document responsibilities, payment and deliverables"
          ],
          "answerIndex": 3,
          "explanation": "Written terms reduce ambiguity about the agreed work and obligations."
        },
        {
          "id": "freelancing-digital-careers-q8",
          "prompt": "How should a freelancer estimate a project's price?",
          "options": [
            "Ignore all costs",
            "Consider time, costs, scope and service value",
            "Copy any price without checking the project",
            "Promise unlimited revisions automatically"
          ],
          "answerIndex": 1,
          "explanation": "Pricing should reflect the work involved, relevant costs and the value provided."
        },
        {
          "id": "freelancing-digital-careers-q9",
          "prompt": "What is a good way to manage a deadline?",
          "options": [
            "Wait until the last minute to start",
            "Avoid progress updates",
            "Break work into milestones and track progress",
            "Hide delays from the client"
          ],
          "answerIndex": 2,
          "explanation": "Milestones make progress visible and help identify delays early."
        },
        {
          "id": "freelancing-digital-careers-q10",
          "prompt": "Which practice helps protect a freelancer's reputation?",
          "options": [
            "Deliver honestly and protect confidential information",
            "Invent testimonials",
            "Publish client files without permission",
            "Claim skills that the freelancer does not have"
          ],
          "answerIndex": 0,
          "explanation": "Honesty, reliability and confidentiality support long-term professional trust."
        }
      ]
  },
    {
    id: "basic-literacy-reading",
    title: "Basic Literacy & Reading",
    category: "Foundational Learning",
    level: "Foundation",
    description: "Develop foundational reading, vocabulary, comprehension, and writing skills.",
    priceKsh: 300,
    published: true,
    lessons: [
  {
    "id": "literacy-1",
    "title": "Letters, sounds and decoding words",
    "minutes": 20,
    "content": [
        "Reading begins by connecting written symbols with the sounds used in spoken language. Practise recognising letters, distinguishing their sounds, and blending sounds into words. English spelling is not always predictable, so learners should notice common patterns as well as exceptions.",
        "A phoneme is a distinct sound in a word; a grapheme is the letter or group of letters used to represent a sound. For example, the word ship contains three main sounds, even though it has four letters. Understanding this difference helps learners decode unfamiliar words.",
        "Break longer words into syllables or meaningful parts. A word such as unhappy can be examined as un-, happy; a word such as helpful can be examined as help, -ful. Prefixes and suffixes often change a word's meaning or grammatical role.",
        "Practice: read a short paragraph aloud, identify five unfamiliar words, divide each into manageable parts, and check its pronunciation and meaning using a reliable dictionary or teacher.",
        "LEARNING TARGETS — In “Letters, sounds and decoding words”, learn the central idea in Basic Literacy & Reading, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
        "CORE IDEA — Reading involves recognising written words and understanding the message. Use letter-sound patterns, sentence clues and text structure, but verify a guess against the actual words. Comprehension improves when a learner identifies the main idea, finds supporting details and explains the passage in their own words.",
        "KEY WORDS — decoding — matching written letters with spoken words; fluency — reading accurately at a suitable pace; main idea — central point of a passage; detail — information supporting the main idea; inference — conclusion drawn from clues. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
        "STEP-BY-STEP MODEL — 1) Preview the title and predict the topic. 2) Read carefully and sound out unfamiliar words. 3) Use the sentence to guess meaning, then check the guess. 4) Identify the main idea and two supporting details. 5) Retell the message in your own words.",
        "WORKED EXAMPLE — In “The farmer stored seeds before the rains,” the word “stored” suggests keeping something for later. Check how it is used in another sentence or a dictionary rather than relying only on the first guess.",
        "GUIDED PRACTICE — Read a short paragraph twice. Circle three unfamiliar words, check their meanings, underline the main idea and write a two-sentence summary.",
        "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Explain the passage without copying it and point to a phrase supporting your interpretation.",
        "COMMON MISTAKES — guessing from only the first letter; reading fast without understanding; copying instead of explaining; treating an inference as a directly stated fact. If you make one of these mistakes, write the correction beside it and try a similar task again."
      ]
  },
  {
    "id": "literacy-2",
    "title": "Fluency, punctuation and sentence meaning",
    "minutes": 20,
    "content": [
        "Fluent reading combines accuracy, a suitable pace and expression. Reading too quickly can hide mistakes, while stopping at every word can make the meaning difficult to follow. Read a passage more than once and aim to improve accuracy before increasing speed.",
        "Punctuation guides the reader. A full stop usually ends a statement, a question mark ends a direct question, and an exclamation mark can express strong feeling. Commas separate items in a list and can mark pauses within some sentences.",
        "Sentence structure affects meaning. Compare “The child chased the dog” with “The dog chased the child”: the words are similar, but their roles differ. Identify who or what performs the action and what receives it to understand a sentence correctly.",
        "Practice: copy a short paragraph, add missing capital letters and punctuation, read it aloud, and explain how punctuation changes the way the paragraph should sound.",
        "TODAY’S SKILL — Use Fluency, punctuation and sentence meaning to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
        "FOLLOW THESE STEPS — 1) Preview the title and predict the topic. 2) Read carefully and sound out unfamiliar words. 3) Use the sentence to guess meaning, then check the guess. 4) Identify the main idea and two supporting details. 5) Retell the message in your own words.",
        "WATCH A MODEL — In “The farmer stored seeds before the rains,” the word “stored” suggests keeping something for later. Check how it is used in another sentence or a dictionary rather than relying only on the first guess.",
        "TRY IT YOURSELF — Read a short paragraph twice. Circle three unfamiliar words, check their meanings, underline the main idea and write a two-sentence summary. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
        "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
        "QUALITY CHECK — Explain the passage without copying it and point to a phrase supporting your interpretation.",
        "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
        "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
      ]
  },
  {
    "id": "literacy-3",
    "title": "Finding main ideas and supporting details",
    "minutes": 20,
    "content": [
        "The main idea is the central point a passage communicates. Supporting details explain, illustrate or provide evidence for that point. A heading can offer a clue, but readers must still examine the actual paragraph rather than assuming the heading tells the whole story.",
        "Ask who, what, when, where, why and how while reading. Some answers are stated directly; others require an inference, which is a conclusion drawn from clues in the text and reasonable background knowledge.",
        "Distinguish a fact that can be checked from an opinion that expresses a judgement or belief. A passage may contain both. Reliable comprehension involves identifying what the author states and considering whether evidence supports the claims.",
        "Practice: read a news report or community notice. Write its main idea in one sentence, list three supporting details, and identify one claim that would need independent verification.",
        "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Basic Literacy & Reading in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
        "CONCEPT CONNECTIONS — Connect these terms to your own example: decoding — matching written letters with spoken words; fluency — reading accurately at a suitable pace; main idea — central point of a passage; detail — information supporting the main idea; inference — conclusion drawn from clues. Draw arrows or make a small table if it helps you see how the terms relate.",
        "MINI-CHALLENGE — Read a short paragraph twice. Circle three unfamiliar words, check their meanings, underline the main idea and write a two-sentence summary.",
        "EXPLAIN YOUR REASONING — In “The farmer stored seeds before the rains,” the word “stored” suggests keeping something for later. Check how it is used in another sentence or a dictionary rather than relying only on the first guess. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
        "CHECK THE ANSWER — Explain the passage without copying it and point to a phrase supporting your interpretation.",
        "ERROR SPOTTING — Look for these common mistakes: guessing from only the first letter; reading fast without understanding; copying instead of explaining; treating an inference as a directly stated fact. Pick one and write the correction in a full sentence.",
        "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
        "SMALL NEXT STEP — Select five suitable practice words, divide them into parts and write one sentence using each."
      ]
  },
  {
    "id": "literacy-4",
    "title": "Vocabulary and meaning from context",
    "minutes": 20,
    "content": [
        "Context clues are hints around an unfamiliar word. A definition, example, contrast or explanation elsewhere in the sentence may help reveal the intended meaning. Test your guess by rereading the complete sentence and checking whether it makes sense.",
        "A dictionary gives meanings, pronunciation and often information about word forms. A word may have several meanings, so choose the meaning that fits the passage. Notice whether it functions as a noun, verb, adjective or another part of speech.",
        "Synonyms have similar meanings, while antonyms have contrasting meanings. They are not always interchangeable: the best choice depends on the sentence, tone and exact meaning. New vocabulary is easier to retain when used in meaningful sentences.",
        "Practice: select five new words from a passage. Record each word, its meaning in context, a synonym where appropriate, and an original sentence using the word correctly.",
        "LESSON FOCUS — Sounding out and recognising words. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Break an unfamiliar word into manageable sound parts, read it aloud and then reread the full sentence. Meaning and pronunciation both matter; a guess should be checked.",
        "FOLLOW THE METHOD — 1) Preview the title and predict the topic. 2) Read carefully and sound out unfamiliar words. 3) Use the sentence to guess meaning, then check the guess. 4) Identify the main idea and two supporting details. 5) Retell the message in your own words.",
        "WORKED EXAMPLE — Read “sunlight” as “sun” + “light”, then use the sentence to check whether the word makes sense.",
        "PRACTICE TASK — Select five suitable practice words, divide them into parts and write one sentence using each.",
        "COMMON MISTAKES TO AVOID — guessing from only the first letter; reading fast without understanding; copying instead of explaining; treating an inference as a directly stated fact. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Explain the passage without copying it and point to a phrase supporting your interpretation. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "literacy-5",
    "title": "Reading practical texts and instructions",
    "minutes": 20,
    "content": [
        "Practical texts include forms, notices, timetables, labels, recipes and instructions. Each has a purpose and a layout. A timetable requires attention to dates and times; a form requires accurate entries; instructions require steps to be followed in the correct order.",
        "Scan a text when searching for a particular detail, such as a venue or deadline. Read carefully when the exact wording affects what you must do. Never guess at a number, date, dosage or safety instruction that is unclear.",
        "Official-looking design does not automatically make a notice trustworthy. Check who issued it, whether contact details can be verified, and whether the requested action is sensible. Be especially careful with requests for passwords, PINs or one-time verification codes.",
        "Practice: examine a sample event notice. Record the organiser, purpose, date, time, venue and action required. List any missing information you would ask the organiser to clarify.",
        "LESSON FOCUS — Finding main ideas and details. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — The main idea explains what the passage is mostly about. Details provide examples, reasons or facts that support it. A heading can help, but the whole paragraph must be read.",
        "FOLLOW THE METHOD — 1) Preview the title and predict the topic. 2) Read carefully and sound out unfamiliar words. 3) Use the sentence to guess meaning, then check the guess. 4) Identify the main idea and two supporting details. 5) Retell the message in your own words.",
        "WORKED EXAMPLE — If a paragraph describes saving water by repairing taps, collecting rainwater and using a basin, its main idea is ways to conserve water.",
        "PRACTICE TASK — Underline one main idea and three supporting details in a short passage.",
        "COMMON MISTAKES TO AVOID — guessing from only the first letter; reading fast without understanding; copying instead of explaining; treating an inference as a directly stated fact. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Explain the passage without copying it and point to a phrase supporting your interpretation. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "literacy-6",
    "title": "Summarising, note-taking and independent reading",
    "minutes": 20,
    "content": [
        "A summary gives the most important ideas in fewer words. Identify the main point, select essential supporting details, and remove repetition or unrelated examples. A summary should preserve the original meaning without copying entire passages.",
        "Notes are most useful when organised under headings and written in language you understand. Short phrases, numbered steps and diagrams can help, but abbreviations should remain clear enough to review later.",
        "Choose reading material that matches your goal and gradually increase its difficulty. Stories build experience with narrative and language; informational texts develop subject knowledge; practical documents help with daily decisions. Discussing a text can reveal misunderstandings.",
        "Practice: read a one-page article, write a five-sentence summary in your own words, list three things you learned, and create two questions that another learner could answer from the text.",
        "LESSON FOCUS — Vocabulary and comprehension. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Use nearby words, prefixes, suffixes and familiar examples to infer a word’s meaning; then confirm with a dictionary or trusted reader. Rereading often clarifies pronouns and sequence.",
        "FOLLOW THE METHOD — 1) Preview the title and predict the topic. 2) Read carefully and sound out unfamiliar words. 3) Use the sentence to guess meaning, then check the guess. 4) Identify the main idea and two supporting details. 5) Retell the message in your own words.",
        "WORKED EXAMPLE — “Mina was exhausted after the long walk” suggests “exhausted” means very tired, but check a dictionary and another sentence.",
        "PRACTICE TASK — Create a vocabulary card with the word, meaning, example, synonym and a question.",
        "COMMON MISTAKES TO AVOID — guessing from only the first letter; reading fast without understanding; copying instead of explaining; treating an inference as a directly stated fact. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Explain the passage without copying it and point to a phrase supporting your interpretation. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  }
],
    questions: [
  {
    "id": "lit-q1",
    "prompt": "What is a grapheme?",
    "options": [
      "A paragraph's main idea",
      "A written letter or group of letters representing a sound",
      "A punctuation mark only",
      "A type of summary"
    ],
    "answerIndex": 1,
    "explanation": "A grapheme is the written representation of a sound."
  },
  {
    "id": "lit-q2",
    "prompt": "Why can dividing a long word into parts help?",
    "options": [
      "It removes the need to understand the word",
      "It changes every word's meaning",
      "It makes the word easier to decode and recognise",
      "It guarantees the first guess is correct"
    ],
    "answerIndex": 2,
    "explanation": "Breaking words into syllables or meaningful parts makes decoding more manageable."
  },
  {
    "id": "lit-q3",
    "prompt": "What does a question mark normally indicate?",
    "options": [
      "The end of a direct question",
      "The beginning of every paragraph",
      "A word's syllable",
      "A heading must follow"
    ],
    "answerIndex": 0,
    "explanation": "A question mark marks the end of a direct question."
  },
  {
    "id": "lit-q4",
    "prompt": "What is the main idea of a passage?",
    "options": [
      "Its longest word",
      "An unrelated personal opinion",
      "The final punctuation mark",
      "Its central message"
    ],
    "answerIndex": 3,
    "explanation": "The main idea is the central point communicated by the passage."
  },
  {
    "id": "lit-q5",
    "prompt": "What is an inference?",
    "options": [
      "A copied title",
      "A conclusion drawn from clues and knowledge",
      "A list of every word",
      "A spelling mistake"
    ],
    "answerIndex": 1,
    "explanation": "An inference combines textual clues with reasonable background knowledge."
  },
  {
    "id": "lit-q6",
    "prompt": "Which is the best way to check an unfamiliar word's meaning?",
    "options": [
      "Always choose the first possible meaning",
      "Ignore the sentence",
      "Use context and verify with a reliable reference",
      "Replace it with any short word"
    ],
    "answerIndex": 2,
    "explanation": "Context and reference sources help identify the meaning that fits."
  },
  {
    "id": "lit-q7",
    "prompt": "When reading a timetable, which detail is especially important?",
    "options": [
      "The paper's colour",
      "The author's favourite book",
      "An unrelated story",
      "The correct date and time"
    ],
    "answerIndex": 3,
    "explanation": "Dates and times determine when an event or service is scheduled."
  },
  {
    "id": "lit-q8",
    "prompt": "What should you do if a safety instruction is unclear?",
    "options": [
      "Ask a qualified person or consult the authoritative source",
      "Guess and continue",
      "Ignore the warning",
      "Follow an unrelated instruction"
    ],
    "answerIndex": 0,
    "explanation": "Unclear safety information should be clarified, not guessed."
  },
  {
    "id": "lit-q9",
    "prompt": "What is a good summary?",
    "options": [
      "Every sentence copied exactly",
      "A shorter account of the main ideas in your own words",
      "Only a list of difficult words",
      "A new story unrelated to the passage"
    ],
    "answerIndex": 1,
    "explanation": "A summary condenses essential ideas while preserving their meaning."
  },
  {
    "id": "lit-q10",
    "prompt": "Which activity supports independent reading?",
    "options": [
      "Reading only headings forever",
      "Avoiding unfamiliar material",
      "Summarising a text and asking questions about it",
      "Skipping all comprehension checks"
    ],
    "answerIndex": 2,
    "explanation": "Summaries and questions help learners monitor understanding."
  }
],
  },
    {
    id: "basic-numeracy-mathematics",
    title: "Basic Numeracy & Mathematics",
    category: "Foundational Learning",
    level: "Foundation",
    description: "Learn numbers, arithmetic, fractions, percentages, and everyday calculations.",
    priceKsh: 300,
    published: true,
    lessons: [
  {
    "id": "num-1",
    "title": "Place value, ordering and rounding",
    "minutes": 20,
    "content": [
        "Our number system uses base ten. Each position represents ten times the value of the position immediately to its right. In 6,482, the digits represent six thousands, four hundreds, eight tens and two ones. A zero can mark an empty place, as in 6,042.",
        "To compare whole numbers, begin at the leftmost digit and compare place values in order. If those digits match, move right until a difference appears. This method avoids relying on how long or familiar a number looks.",
        "Rounding replaces a number with a nearby value at a chosen place. When rounding to the nearest ten, inspect the ones digit: digits 0–4 round down and digits 5–9 round up. Rounding is useful for estimates, but exact calculations may still be needed.",
        "Practice: state the value of each digit in 7,305. Order 3,405, 3,450 and 3,045 from smallest to largest, then round 6,748 to the nearest hundred and explain each decision.",
        "LEARNING TARGETS — In “Place value, ordering and rounding”, learn the central idea in Basic Numeracy & Mathematics, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
        "CORE IDEA — Numeracy uses numbers to compare quantities and solve everyday problems. Place value tells what a digit contributes, operations follow clear rules and estimates help detect unreasonable results. Writing steps and units helps another person follow and check the reasoning.",
        "KEY WORDS — place value — value based on digit position; estimate — approximate value used to check; fraction — part of a whole or ratio; percentage — quantity per hundred; inverse operation — operation that reverses another. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
        "STEP-BY-STEP MODEL — 1) Read the question and identify what is being asked. 2) Write known numbers and units. 3) Choose an operation that matches the situation. 4) Show the steps and calculate. 5) Estimate and check with an inverse operation.",
        "WORKED EXAMPLE — Three exercise books cost KES 45 each. Calculate 3 × 45 = KES 135. An estimate of about KES 150 makes the answer plausible, and the unit is Kenyan shillings.",
        "GUIDED PRACTICE — Create three shopping problems about totals, change and a simple percentage. For each, show the operation, units, estimate and final check.",
        "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Reread the question, verify units and signs, and use an inverse operation to confirm the calculation.",
        "COMMON MISTAKES — mixing incompatible units; choosing an operation before understanding the question; moving decimal places without reason; accepting an answer that fails the estimate. If you make one of these mistakes, write the correction beside it and try a similar task again."
      ]
  },
  {
    "id": "num-2",
    "title": "Addition, subtraction and checking answers",
    "minutes": 20,
    "content": [
        "Addition combines quantities, while subtraction finds a difference or the amount remaining. Align place values when working vertically, especially when regrouping. Estimate the answer first so you have a reasonable range for checking your calculation.",
        "Regrouping in subtraction exchanges one unit of a place value for ten units of the next smaller place. For example, one hundred can be exchanged for ten tens. Keep each digit aligned with its correct place to avoid calculation errors.",
        "Addition and subtraction can check one another. If 725 − 268 = 457, then 457 + 268 should equal 725. If the check fails, revisit the calculation rather than simply changing a digit at random.",
        "Practice: a shop starts with 850 notebooks and sells 276. Calculate the remaining number, estimate the answer first, and verify it by adding the sold and remaining quantities.",
        "TODAY’S SKILL — Use Addition, subtraction and checking answers to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
        "FOLLOW THESE STEPS — 1) Read the question and identify what is being asked. 2) Write known numbers and units. 3) Choose an operation that matches the situation. 4) Show the steps and calculate. 5) Estimate and check with an inverse operation.",
        "WATCH A MODEL — Three exercise books cost KES 45 each. Calculate 3 × 45 = KES 135. An estimate of about KES 150 makes the answer plausible, and the unit is Kenyan shillings.",
        "TRY IT YOURSELF — Create three shopping problems about totals, change and a simple percentage. For each, show the operation, units, estimate and final check. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
        "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
        "QUALITY CHECK — Reread the question, verify units and signs, and use an inverse operation to confirm the calculation.",
        "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
        "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
      ]
  },
  {
    "id": "num-3",
    "title": "Multiplication, division and equal groups",
    "minutes": 20,
    "content": [
        "Multiplication represents equal groups, arrays and repeated addition. If six boxes each contain 24 pencils, the total is 6 × 24. Break a calculation into easier parts, such as 6 × 20 plus 6 × 4, to understand why the answer is 144.",
        "Division shares a quantity equally or determines how many groups fit into a quantity. Dividing 144 pencils among six equal boxes gives 24 per box. If the quantity cannot be shared evenly in whole units, a remainder or fraction may be needed.",
        "Multiplication and division are inverse operations. To check 144 ÷ 6 = 24, multiply 24 by 6 and confirm the result is 144. Always consider what the answer's unit should be: items, boxes, people or shillings.",
        "Practice: 168 seedlings are planted in rows of 12. Calculate the number of rows and check your answer with multiplication. Then explain how the method changes if there are only 160 seedlings.",
        "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Basic Numeracy & Mathematics in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
        "CONCEPT CONNECTIONS — Connect these terms to your own example: place value — value based on digit position; estimate — approximate value used to check; fraction — part of a whole or ratio; percentage — quantity per hundred; inverse operation — operation that reverses another. Draw arrows or make a small table if it helps you see how the terms relate.",
        "MINI-CHALLENGE — Create three shopping problems about totals, change and a simple percentage. For each, show the operation, units, estimate and final check.",
        "EXPLAIN YOUR REASONING — Three exercise books cost KES 45 each. Calculate 3 × 45 = KES 135. An estimate of about KES 150 makes the answer plausible, and the unit is Kenyan shillings. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
        "CHECK THE ANSWER — Reread the question, verify units and signs, and use an inverse operation to confirm the calculation.",
        "ERROR SPOTTING — Look for these common mistakes: mixing incompatible units; choosing an operation before understanding the question; moving decimal places without reason; accepting an answer that fails the estimate. Pick one and write the correction in a full sentence.",
        "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
        "SMALL NEXT STEP — Expand five numbers into thousands, hundreds, tens and ones, and compare each with a nearby number."
      ]
  },
  {
    "id": "num-4",
    "title": "Fractions, decimals and percentages",
    "minutes": 20,
    "content": [
        "A fraction describes part of a whole or a ratio. The numerator counts the parts being considered and the denominator describes the number of equal parts in the whole. Equivalent fractions represent the same amount, such as 1/2 and 2/4.",
        "A decimal uses place value to show parts of a whole. The first digit after the decimal point represents tenths, the second represents hundredths, and the third represents thousandths. Align decimal points when adding or subtracting decimals.",
        "Percent means per hundred. To find 10% of KES 800, calculate 800 ÷ 10 = KES 80. To find 25%, one useful method is to calculate one-quarter of the amount. Check whether a percentage is being added, deducted or used for comparison.",
        "Practice: calculate 3/4 of 200, write 0.25 as a percentage, and find a 10% discount on an item priced at KES 1,500. Show the calculation for each answer.",
        "LESSON FOCUS — Place value and number sense. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Each digit has a value based on its position. In 3,482 the 3 represents three thousands, the 4 represents four hundreds, the 8 represents eight tens and the 2 represents two ones.",
        "FOLLOW THE METHOD — 1) Read the question and identify what is being asked. 2) Write known numbers and units. 3) Choose an operation that matches the situation. 4) Show the steps and calculate. 5) Estimate and check with an inverse operation.",
        "WORKED EXAMPLE — The number 3,482 can be expanded as 3,000 + 400 + 80 + 2.",
        "PRACTICE TASK — Expand five numbers into thousands, hundreds, tens and ones, and compare each with a nearby number.",
        "COMMON MISTAKES TO AVOID — mixing incompatible units; choosing an operation before understanding the question; moving decimal places without reason; accepting an answer that fails the estimate. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Reread the question, verify units and signs, and use an inverse operation to confirm the calculation. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "num-5",
    "title": "Money, budgets and unit prices",
    "minutes": 20,
    "content": [
        "A budget compares expected income with planned spending. Separate essential expenses, optional spending and savings where possible. Total each category and compare the planned amount with the money available before committing to a purchase.",
        "Unit price helps compare products sold in different package sizes. Divide the price by the quantity to find the cost per item, kilogram or litre. The cheapest package is not always the best choice if quality, expiry dates, transport or waste differ.",
        "Change is the amount returned after a payment. Subtract the total cost from the amount paid and check that the result is sensible. Keep receipts and written records when tracking business or household spending.",
        "Practice: compare a 2 kg bag of flour costing KES 300 with a 5 kg bag costing KES 700. Find each price per kilogram, decide which is cheaper per kilogram, and identify one other factor to consider.",
        "LESSON FOCUS — Operations, fractions and percentages. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Addition combines quantities, subtraction finds a difference, multiplication scales equal groups and division shares or measures groups. Fractions and percentages describe parts in relation to a whole.",
        "FOLLOW THE METHOD — 1) Read the question and identify what is being asked. 2) Write known numbers and units. 3) Choose an operation that matches the situation. 4) Show the steps and calculate. 5) Estimate and check with an inverse operation.",
        "WORKED EXAMPLE — 25% of KES 800 is one quarter of 800, which is KES 200. The remaining amount after a 25% discount is KES 600.",
        "PRACTICE TASK — Solve a sharing problem and a discount problem, showing why the operation matches the situation.",
        "COMMON MISTAKES TO AVOID — mixing incompatible units; choosing an operation before understanding the question; moving decimal places without reason; accepting an answer that fails the estimate. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Reread the question, verify units and signs, and use an inverse operation to confirm the calculation. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "num-6",
    "title": "Measurement, data and solving word problems",
    "minutes": 20,
    "content": [
        "Measurements use agreed units. Length may be measured in millimetres, centimetres, metres or kilometres; mass in grams or kilograms; and liquid volume in millilitres or litres. Convert units carefully before combining measurements.",
        "Tables and charts organise data so that comparisons are easier. Read the title, labels, units and scale before interpreting a chart. A bar twice as high as another represents twice the value only when the scale is consistent and starts from a suitable baseline.",
        "For a word problem, identify the known information, the unknown quantity and the relationship between them. Choose an operation, write the calculation, include the correct unit and check whether the result answers the actual question.",
        "Practice: a water tank contains 450 litres and receives another 175 litres, then supplies 220 litres. Calculate the final volume, state the unit and explain one way to check your answer.",
        "LESSON FOCUS — Checking word problems. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Underline important numbers, name what is being asked, decide which information is useful and estimate before calculating. A mathematically correct number can still be wrong for the question if its unit or meaning is wrong.",
        "FOLLOW THE METHOD — 1) Read the question and identify what is being asked. 2) Write known numbers and units. 3) Choose an operation that matches the situation. 4) Show the steps and calculate. 5) Estimate and check with an inverse operation.",
        "WORKED EXAMPLE — If a trip is 12 km each way, the round trip is 24 km, not 12 km. Draw the outward and return journey to make the meaning visible.",
        "PRACTICE TASK — Write one word problem with a distractor number and explain which information should be used.",
        "COMMON MISTAKES TO AVOID — mixing incompatible units; choosing an operation before understanding the question; moving decimal places without reason; accepting an answer that fails the estimate. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Reread the question, verify units and signs, and use an inverse operation to confirm the calculation. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  }
],
    questions: [
  {
    "id": "num-q1",
    "prompt": "What is the value of 3 in 5,342?",
    "options": [
      "Three ones",
      "Three hundreds",
      "Three thousands",
      "Three tens"
    ],
    "answerIndex": 1,
    "explanation": "The digit 3 is in the hundreds place, so it represents 300."
  },
  {
    "id": "num-q2",
    "prompt": "What is 850 − 276?",
    "options": [
      "574",
      "584",
      "626",
      "674"
    ],
    "answerIndex": 0,
    "explanation": "850 − 276 = 574; adding 276 back gives 850."
  },
  {
    "id": "num-q3",
    "prompt": "Six boxes contain 24 pencils each. How many pencils are there?",
    "options": [
      "30",
      "120",
      "144",
      "164"
    ],
    "answerIndex": 2,
    "explanation": "6 × 24 = 6 × 20 + 6 × 4 = 120 + 24 = 144."
  },
  {
    "id": "num-q4",
    "prompt": "What is 168 ÷ 12?",
    "options": [
      "12",
      "13",
      "14",
      "16"
    ],
    "answerIndex": 2,
    "explanation": "Twelve groups of fourteen make 168."
  },
  {
    "id": "num-q5",
    "prompt": "Which fraction is equivalent to 1/2?",
    "options": [
      "1/3",
      "2/4",
      "3/5",
      "1/4"
    ],
    "answerIndex": 1,
    "explanation": "Multiplying the numerator and denominator of 1/2 by two gives 2/4."
  },
  {
    "id": "num-q6",
    "prompt": "What is 25% of 200?",
    "options": [
      "25",
      "40",
      "50",
      "75"
    ],
    "answerIndex": 2,
    "explanation": "Twenty-five percent is one-quarter, and 200 ÷ 4 = 50."
  },
  {
    "id": "num-q7",
    "prompt": "What is a 10% discount on KES 1,500?",
    "options": [
      "KES 15",
      "KES 100",
      "KES 125",
      "KES 150"
    ],
    "answerIndex": 3,
    "explanation": "Ten percent of 1,500 is 150."
  },
  {
    "id": "num-q8",
    "prompt": "A 5 kg bag costs KES 700. What is its price per kilogram?",
    "options": [
      "KES 140",
      "KES 150",
      "KES 350",
      "KES 695"
    ],
    "answerIndex": 0,
    "explanation": "Divide KES 700 by 5 kg to get KES 140 per kilogram."
  },
  {
    "id": "num-q9",
    "prompt": "What is the best first step in a word problem?",
    "options": [
      "Choose an operation randomly",
      "Identify the known values and what must be found",
      "Ignore the units",
      "Write an answer before reading"
    ],
    "answerIndex": 1,
    "explanation": "Understanding the known and unknown quantities helps select the correct method."
  },
  {
    "id": "num-q10",
    "prompt": "A tank has 450 L, receives 175 L and supplies 220 L. What remains?",
    "options": [
      "405 L",
      "395 L",
      "625 L",
      "845 L"
    ],
    "answerIndex": 0,
    "explanation": "450 + 175 − 220 = 405 litres."
  }
],
  },
    {
    id: "foundational-english-communication",
    title: "Foundational English Communication",
    category: "Communication",
    level: "Foundation",
    description: "Build confidence in everyday English speaking, listening, reading, and writing.",
    priceKsh: 300,
    published: true,
    lessons: [
  {
    "id": "eng-1",
    "title": "Building complete and clear sentences",
    "minutes": 20,
    "content": [
        "A sentence communicates a complete idea. Many simple sentences contain a subject and a verb: “The learner reads.” The subject identifies who or what the sentence concerns, and the verb expresses an action or state. Other words can add details about time, place or manner.",
        "Word order influences meaning. “The driver helped the passenger” differs from “The passenger helped the driver.” When writing, place information in an order that makes the intended relationship clear to the reader.",
        "Use capital letters at the beginning of sentences, for the pronoun I, and for proper names. End statements with full stops and direct questions with question marks. Punctuation should help the reader follow the meaning rather than be added randomly.",
        "Practice: write five sentences about a normal working day. Underline each subject and verb, check capital letters and punctuation, and revise any sentence that does not express a complete thought.",
        "LEARNING TARGETS — In “Building complete and clear sentences”, learn the central idea in Foundational English Communication, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
        "CORE IDEA — Clear English communication matches words, sentence structure and tone to a purpose. A useful message has one main point and enough detail for the reader to act. Speaking also requires listening, asking questions and checking that the listener understood.",
        "KEY WORDS — subject — who or what a sentence is about; verb — a word for action or state; paragraph — related sentences developing one idea; tone — attitude conveyed by wording; paraphrase — restating meaning in new words. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
        "STEP-BY-STEP MODEL — 1) Identify audience and purpose. 2) Write the main message in one sentence. 3) Arrange details in a sensible order. 4) Check grammar, spelling and respectful tone. 5) Read aloud or ask a reader to check the meaning.",
        "WORKED EXAMPLE — “Please send the signed form by 3 p.m. Thursday so we can submit the application” gives a clear action, deadline and reason, unlike “Send it soon.”",
        "GUIDED PRACTICE — Write a polite request, a reply and a paragraph describing a familiar process. Check complete sentences, punctuation, order and tone.",
        "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Ask a reader to state the action and deadline. Revise if the message leaves them guessing.",
        "COMMON MISTAKES — using unclear pronouns; joining too many ideas in one sentence; choosing words the audience cannot understand; assuming a spelling is correct without checking. If you make one of these mistakes, write the correction beside it and try a similar task again."
      ]
  },
  {
    "id": "eng-2",
    "title": "Nouns, pronouns, verbs and descriptive words",
    "minutes": 20,
    "content": [
        "A noun names a person, place, thing or idea. A pronoun can replace a noun when the reference is clear. For example, “Amina submitted the form. She kept a copy.” The pronoun she clearly refers to Amina.",
        "Verbs describe actions or states. Adjectives describe nouns, while adverbs can modify verbs, adjectives or other adverbs. Precise words often communicate more effectively than a sentence filled with vague descriptions.",
        "Subject–verb agreement is important in standard English: “The learner works” but “The learners work.” When revising a sentence, identify the true subject and make sure the verb matches it, even when other words appear between them.",
        "Practice: revise “The students writes a careful report and they submits it.” Correct the agreement and explain why each verb changes.",
        "TODAY’S SKILL — Use Nouns, pronouns, verbs and descriptive words to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
        "FOLLOW THESE STEPS — 1) Identify audience and purpose. 2) Write the main message in one sentence. 3) Arrange details in a sensible order. 4) Check grammar, spelling and respectful tone. 5) Read aloud or ask a reader to check the meaning.",
        "WATCH A MODEL — “Please send the signed form by 3 p.m. Thursday so we can submit the application” gives a clear action, deadline and reason, unlike “Send it soon.”",
        "TRY IT YOURSELF — Write a polite request, a reply and a paragraph describing a familiar process. Check complete sentences, punctuation, order and tone. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
        "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
        "QUALITY CHECK — Ask a reader to state the action and deadline. Revise if the message leaves them guessing.",
        "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
        "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
      ]
  },
  {
    "id": "eng-3",
    "title": "Tense and time relationships",
    "minutes": 20,
    "content": [
        "Verb tense helps locate an action in time. “I study” can describe a habit or present situation, “I studied” describes a past action, and “I will study” describes a future action. Choose a tense that matches the time you mean.",
        "Past-tense forms are not all created by adding -ed. “Walked” is regular, while “went” is the past form of “go.” Learn common irregular verbs in meaningful sentences and consult a dictionary when unsure.",
        "Keep the time sequence clear in a paragraph. A report of yesterday's activities will normally use past tense, while instructions may use the imperative form, such as “Open the document.” Changing tense can be correct when the time meaning changes.",
        "Practice: correct this sentence: “Yesterday, she go to the market, buys vegetables and return home.” Rewrite it in standard past tense and explain each correction.",
        "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Foundational English Communication in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
        "CONCEPT CONNECTIONS — Connect these terms to your own example: subject — who or what a sentence is about; verb — a word for action or state; paragraph — related sentences developing one idea; tone — attitude conveyed by wording; paraphrase — restating meaning in new words. Draw arrows or make a small table if it helps you see how the terms relate.",
        "MINI-CHALLENGE — Write a polite request, a reply and a paragraph describing a familiar process. Check complete sentences, punctuation, order and tone.",
        "EXPLAIN YOUR REASONING — “Please send the signed form by 3 p.m. Thursday so we can submit the application” gives a clear action, deadline and reason, unlike “Send it soon.” In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
        "CHECK THE ANSWER — Ask a reader to state the action and deadline. Revise if the message leaves them guessing.",
        "ERROR SPOTTING — Look for these common mistakes: using unclear pronouns; joining too many ideas in one sentence; choosing words the audience cannot understand; assuming a spelling is correct without checking. Pick one and write the correction in a full sentence.",
        "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
        "SMALL NEXT STEP — Rewrite five incomplete or confusing sentences and explain one change for each."
      ]
  },
  {
    "id": "eng-4",
    "title": "Vocabulary, spelling and paragraph writing",
    "minutes": 20,
    "content": [
        "A strong paragraph develops one main point. Begin with a topic sentence, add supporting details or examples, and finish with a sentence that closes or links the idea. Arrange information logically so the reader can follow your reasoning.",
        "Connectors such as because, however, therefore, first and finally show relationships between ideas. Choose a connector that accurately represents the relationship; for example, however signals contrast, while therefore introduces a consequence or conclusion.",
        "Build vocabulary by reading, recording unfamiliar words and using them in original sentences. Spelling patterns help, but English includes exceptions. Check important writing with a reliable dictionary or spelling tool, and review suggestions rather than accepting every automatic correction.",
        "Practice: write a paragraph explaining why keeping accurate records is useful. Include a topic sentence, three supporting details and a concluding sentence. Check spelling, connectors and paragraph structure.",
        "LESSON FOCUS — Building clear sentences. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — A complete sentence usually communicates a subject and a predicate. Punctuation helps readers see where one idea ends. Short sentences are often helpful when a learner is beginning.",
        "FOLLOW THE METHOD — 1) Identify audience and purpose. 2) Write the main message in one sentence. 3) Arrange details in a sensible order. 4) Check grammar, spelling and respectful tone. 5) Read aloud or ask a reader to check the meaning.",
        "WORKED EXAMPLE — “The customer paid. The seller issued a receipt.” is clearer than a long sentence that mixes several events.",
        "PRACTICE TASK — Rewrite five incomplete or confusing sentences and explain one change for each.",
        "COMMON MISTAKES TO AVOID — using unclear pronouns; joining too many ideas in one sentence; choosing words the audience cannot understand; assuming a spelling is correct without checking. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Ask a reader to state the action and deadline. Revise if the message leaves them guessing. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "eng-5",
    "title": "Listening, speaking and asking questions",
    "minutes": 20,
    "content": [
        "Good listening requires attention to both words and context. Avoid interrupting, notice the speaker's main point, and ask a clarifying question when instructions are incomplete. Briefly repeating key information can confirm that you understood correctly.",
        "Effective speaking is organised around the listener's needs. State your main point, provide relevant details, use a suitable volume and pace, and avoid unnecessary jargon. For unfamiliar audiences, explain technical terms in everyday language.",
        "Questions can request facts, clarification, reasons or suggestions. Open questions often encourage fuller answers, while closed questions can confirm a specific detail. Select the question type that suits the information you need.",
        "Practice: explain a familiar task in one minute. Ask a partner to repeat the main steps, listen to any misunderstanding, and revise your explanation to make it clearer.",
        "LESSON FOCUS — Organising a paragraph. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — A paragraph should develop one main point. A topic sentence introduces it; supporting sentences explain or illustrate it; a final sentence can sum up or link to the next idea.",
        "FOLLOW THE METHOD — 1) Identify audience and purpose. 2) Write the main message in one sentence. 3) Arrange details in a sensible order. 4) Check grammar, spelling and respectful tone. 5) Read aloud or ask a reader to check the meaning.",
        "WORKED EXAMPLE — A paragraph about handwashing may begin with why it matters, describe the steps and explain when it is needed.",
        "PRACTICE TASK — Write a paragraph with one topic sentence, two supporting details and a concluding sentence.",
        "COMMON MISTAKES TO AVOID — using unclear pronouns; joining too many ideas in one sentence; choosing words the audience cannot understand; assuming a spelling is correct without checking. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Ask a reader to state the action and deadline. Revise if the message leaves them guessing. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "eng-6",
    "title": "Formal emails, messages and workplace communication",
    "minutes": 20,
    "content": [
        "A formal email should have a useful subject line, a respectful greeting, a clear purpose, relevant details and a polite closing. Keep paragraphs focused and make any requested action or deadline explicit.",
        "Adapt your tone to the audience and purpose. A message to a friend may be informal, while an application to a training centre or a request to a supplier should use respectful, precise language. Avoid writing in all capitals, which can appear aggressive.",
        "Before sending a message, verify names, dates, attachments and contact details. Remove unnecessary personal information and never send passwords, PINs or one-time verification codes through an ordinary message. Keep a copy of important work communications.",
        "Practice: write a formal email asking a training centre about its timetable and entry requirements. Include a meaningful subject, greeting, two clear questions and a courteous closing.",
        "LESSON FOCUS — Listening and practical messages. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Communication is two-way. Listen without interrupting, ask a clarifying question and summarise the agreement. Written messages should identify the recipient, action, deadline and relevant context.",
        "FOLLOW THE METHOD — 1) Identify audience and purpose. 2) Write the main message in one sentence. 3) Arrange details in a sensible order. 4) Check grammar, spelling and respectful tone. 5) Read aloud or ask a reader to check the meaning.",
        "WORKED EXAMPLE — Repeat “So you need the form by Thursday morning, and I should email a scanned copy?” to confirm what was agreed.",
        "PRACTICE TASK — Write the same request for a friend, a teacher and a workplace contact while preserving the facts.",
        "COMMON MISTAKES TO AVOID — using unclear pronouns; joining too many ideas in one sentence; choosing words the audience cannot understand; assuming a spelling is correct without checking. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Ask a reader to state the action and deadline. Revise if the message leaves them guessing. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  }
],
    questions: [
  {
    "id": "eng-q1",
    "prompt": "Which is a complete sentence?",
    "options": [
      "Because the office was closed",
      "The learner completed the form.",
      "Although it was raining",
      "When the meeting ended"
    ],
    "answerIndex": 1,
    "explanation": "The learner completed the form expresses a complete idea."
  },
  {
    "id": "eng-q2",
    "prompt": "Which sentence has correct subject–verb agreement?",
    "options": [
      "The learners works carefully.",
      "The learner work carefully.",
      "The learners work carefully.",
      "The learners working carefully."
    ],
    "answerIndex": 2,
    "explanation": "The plural subject learners takes the verb work."
  },
  {
    "id": "eng-q3",
    "prompt": "Which is the correct past-tense sentence?",
    "options": [
      "Yesterday she went to the market.",
      "Yesterday she go to the market.",
      "Yesterday she going to the market.",
      "Yesterday she goes to the market."
    ],
    "answerIndex": 0,
    "explanation": "Went is the simple past form of go."
  },
  {
    "id": "eng-q4",
    "prompt": "Which connector usually signals contrast?",
    "options": [
      "Therefore",
      "Because",
      "First",
      "However"
    ],
    "answerIndex": 3,
    "explanation": "However introduces a contrast between ideas."
  },
  {
    "id": "eng-q5",
    "prompt": "What is the main purpose of a topic sentence?",
    "options": [
      "To list every spelling rule",
      "To introduce the paragraph's main point",
      "To replace the whole paragraph",
      "To provide an unrelated conclusion"
    ],
    "answerIndex": 1,
    "explanation": "A topic sentence tells the reader what the paragraph mainly discusses."
  },
  {
    "id": "eng-q6",
    "prompt": "What should a listener do when instructions are unclear?",
    "options": [
      "Pretend to understand",
      "Interrupt with an unrelated story",
      "Ask a relevant clarifying question",
      "Ignore the instructions"
    ],
    "answerIndex": 2,
    "explanation": "Clarifying questions help prevent errors caused by misunderstanding."
  },
  {
    "id": "eng-q7",
    "prompt": "Which is most suitable for a formal email?",
    "options": [
      "A clear subject and respectful wording",
      "Only slang and emojis",
      "No explanation of the purpose",
      "An insulting greeting"
    ],
    "answerIndex": 0,
    "explanation": "A clear subject and respectful language help the recipient understand the request."
  },
  {
    "id": "eng-q8",
    "prompt": "What should you check before sending an important email?",
    "options": [
      "Only the font colour",
      "Whether it is as long as possible",
      "Whether every sentence uses slang",
      "Names, dates, attachments and recipient"
    ],
    "answerIndex": 3,
    "explanation": "Checking these details helps prevent avoidable communication mistakes."
  },
  {
    "id": "eng-q9",
    "prompt": "Which pronoun sentence has a clear reference?",
    "options": [
      "Amina spoke to Wanjiku because she was there, without further context.",
      "Amina submitted the form. She kept a copy.",
      "They gave it to them.",
      "He told him about it."
    ],
    "answerIndex": 1,
    "explanation": "She clearly refers to Amina in the two-sentence example."
  },
  {
    "id": "eng-q10",
    "prompt": "What is a useful way to improve a paragraph?",
    "options": [
      "Add unrelated sentences",
      "Remove the main idea",
      "Organise one main point with supporting details",
      "Avoid checking spelling"
    ],
    "answerIndex": 2,
    "explanation": "A focused paragraph develops one central point with relevant support."
  }
],
  },
    {
    id: "study-skills-learning-confidence",
    title: "Study Skills & Learning Confidence",
    category: "Personal Development",
    level: "Foundation",
    description: "Develop effective study habits, goal setting, revision, and time management.",
    priceKsh: 300,
    published: true,
    lessons: [
  {
    "id": "study-1",
    "title": "Setting goals and planning study time",
    "minutes": 20,
    "content": [
        "A useful learning goal describes an observable outcome. “Understand science” is difficult to measure, while “explain the water cycle and answer eight practice questions” gives you a clear target. Goals should be challenging enough to encourage progress but realistic for the time available.",
        "Break a large goal into smaller tasks. Estimate the time needed, schedule study periods around work and family responsibilities, and prepare materials before beginning. A written plan helps reveal when a task is too large or a deadline is unrealistic.",
        "Prioritise work by urgency and importance. Begin long assignments early, and divide them into research, drafting, review and submission stages. Leave time for unexpected interruptions instead of planning every minute without a buffer.",
        "Practice: choose one course goal for the next seven days. Write three tasks, estimate the time for each, schedule them, and identify one likely obstacle with a practical response.",
        "LEARNING TARGETS — In “Setting goals and planning study time”, learn the central idea in Study Skills & Learning Confidence, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
        "CORE IDEA — Learning improves when practice includes recalling information, using feedback and revisiting material after a gap. Break large goals into small tasks, attempt answers from memory and correct mistakes. Confidence grows from evidence of progress, not from avoiding difficult work.",
        "KEY WORDS — active recall — retrieving without looking at notes; spaced practice — revisiting over time; interleaving — mixing related problem types; metacognition — checking your understanding; specific goal — clear result that can be checked. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
        "STEP-BY-STEP MODEL — 1) Set one goal small enough for a single session. 2) Recall what you know before reopening the notes. 3) Practise with questions, examples or a worked problem. 4) Check feedback and record the exact mistake. 5) Schedule a new attempt after a gap.",
        "WORKED EXAMPLE — Rather than rereading for an hour, study a section, close the book, explain the idea, answer two questions and revisit missed items tomorrow.",
        "GUIDED PRACTICE — Create a three-day plan with one measurable goal each day, a short recall quiz, a correction note and a scheduled review.",
        "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Answer a fresh question without notes after a delay and compare it with clear success criteria.",
        "COMMON MISTAKES — counting time as proof of learning; highlighting without testing recall; avoiding every difficult question; repeating an error without noting why. If you make one of these mistakes, write the correction beside it and try a similar task again."
      ]
  },
  {
    "id": "study-2",
    "title": "Active recall and spaced practice",
    "minutes": 20,
    "content": [
        "Active recall means retrieving information from memory instead of only rereading it. After a lesson, close your notes and explain the main ideas aloud or write them down. Then compare your answer with the lesson and correct omissions.",
        "Spaced practice means reviewing material over several sessions separated by time. A learner might review a concept today, tomorrow, several days later and again the following week. The exact schedule can vary, but repeated retrieval is more informative than a single last-minute review.",
        "Mix question types and examples when practising. For a mathematics topic, solve several kinds of problems rather than repeating only one familiar example. For reading, answer comprehension questions and write a summary. Check the reasoning, not only whether the final answer is right.",
        "Practice: study a short lesson, write five questions about it, answer without notes, mark your responses, and schedule a second attempt for the questions you missed.",
        "TODAY’S SKILL — Use Active recall and spaced practice to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
        "FOLLOW THESE STEPS — 1) Set one goal small enough for a single session. 2) Recall what you know before reopening the notes. 3) Practise with questions, examples or a worked problem. 4) Check feedback and record the exact mistake. 5) Schedule a new attempt after a gap.",
        "WATCH A MODEL — Rather than rereading for an hour, study a section, close the book, explain the idea, answer two questions and revisit missed items tomorrow.",
        "TRY IT YOURSELF — Create a three-day plan with one measurable goal each day, a short recall quiz, a correction note and a scheduled review. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
        "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
        "QUALITY CHECK — Answer a fresh question without notes after a delay and compare it with clear success criteria.",
        "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
        "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
      ]
  },
  {
    "id": "study-3",
    "title": "Note-taking and organising information",
    "minutes": 20,
    "content": [
        "Good notes capture key ideas, definitions, examples and questions rather than every spoken word. Use headings and subheadings to show relationships. Leave space to add clarifications after class or after reading a lesson.",
        "A comparison table is useful when studying related concepts; a flow chart can show a process; and a labelled diagram can explain structure. Choose the format that matches the information instead of using one method for every subject.",
        "Rewrite notes in your own words to check understanding. Copying can preserve details, but it may hide gaps in comprehension. If you cannot explain an idea simply, return to the source and identify exactly what remains unclear.",
        "Practice: turn one page of notes into a one-page revision sheet containing a title, five key points, two examples and three questions you should be able to answer.",
        "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Study Skills & Learning Confidence in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
        "CONCEPT CONNECTIONS — Connect these terms to your own example: active recall — retrieving without looking at notes; spaced practice — revisiting over time; interleaving — mixing related problem types; metacognition — checking your understanding; specific goal — clear result that can be checked. Draw arrows or make a small table if it helps you see how the terms relate.",
        "MINI-CHALLENGE — Create a three-day plan with one measurable goal each day, a short recall quiz, a correction note and a scheduled review.",
        "EXPLAIN YOUR REASONING — Rather than rereading for an hour, study a section, close the book, explain the idea, answer two questions and revisit missed items tomorrow. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
        "CHECK THE ANSWER — Answer a fresh question without notes after a delay and compare it with clear success criteria.",
        "ERROR SPOTTING — Look for these common mistakes: counting time as proof of learning; highlighting without testing recall; avoiding every difficult question; repeating an error without noting why. Pick one and write the correction in a full sentence.",
        "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
        "SMALL NEXT STEP — Break one large learning goal into three small sessions with a testable outcome each."
      ]
  },
  {
    "id": "study-4",
    "title": "Reading assignments and solving difficult tasks",
    "minutes": 20,
    "content": [
        "Start an assignment by identifying its instructions and expected output. Words such as compare, explain, calculate, justify and evaluate require different responses. Underline the action word and list the evidence or steps needed to complete the task.",
        "When a task feels difficult, identify the smallest unresolved step. Review a worked example, define unfamiliar terms, and try a similar problem. If you remain stuck, ask a focused question that explains what you attempted and where your reasoning stopped.",
        "Use credible sources and keep track of where information came from. Notes, quotations and paraphrases should be distinguishable so that you can acknowledge sources accurately and avoid presenting someone else's work as your own.",
        "Practice: take a sample assignment question. Rewrite it as a checklist of actions, list two sources or materials you need, and identify the first small task you can complete.",
        "LESSON FOCUS — Set goals and build routines. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Choose goals that describe an action and result, not a vague wish. Short sessions with a clear finish point are easier to start and evaluate.",
        "FOLLOW THE METHOD — 1) Set one goal small enough for a single session. 2) Recall what you know before reopening the notes. 3) Practise with questions, examples or a worked problem. 4) Check feedback and record the exact mistake. 5) Schedule a new attempt after a gap.",
        "WORKED EXAMPLE — “Solve five fraction questions and correct errors” is more measurable than “study maths.”",
        "PRACTICE TASK — Break one large learning goal into three small sessions with a testable outcome each.",
        "COMMON MISTAKES TO AVOID — counting time as proof of learning; highlighting without testing recall; avoiding every difficult question; repeating an error without noting why. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Answer a fresh question without notes after a delay and compare it with clear success criteria. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "study-5",
    "title": "Managing distractions, energy and stress",
    "minutes": 20,
    "content": [
        "Choose a study location with enough light, suitable seating and the materials you need. Silence unnecessary notifications and keep unrelated tabs closed. If the environment is noisy, use a realistic alternative such as a quieter time or a library when available.",
        "Work in focused periods with short breaks. The best session length depends on the task and learner, so experiment and observe when attention begins to fall. Breaks should help you return refreshed rather than become an unplanned interruption that consumes the study period.",
        "Sleep, hydration, movement and regular meals can affect concentration. When stress rises, break work into manageable steps and focus on the next action. If distress is persistent or overwhelming, seek support from a trusted person or appropriate professional service.",
        "Practice: record your study time and distractions for two days. Identify the biggest source of interruption and test one change, then compare whether your focus improves.",
        "LESSON FOCUS — Active recall and spaced practice. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Trying to remember before looking at notes exposes gaps. Revisiting across time strengthens access to information better than doing all repetitions at once.",
        "FOLLOW THE METHOD — 1) Set one goal small enough for a single session. 2) Recall what you know before reopening the notes. 3) Practise with questions, examples or a worked problem. 4) Check feedback and record the exact mistake. 5) Schedule a new attempt after a gap.",
        "WORKED EXAMPLE — Answer ten vocabulary questions today, retest missed items tomorrow and try again several days later.",
        "PRACTICE TASK — Build a review calendar for a lesson using same-day recall, next-day review and a later check.",
        "COMMON MISTAKES TO AVOID — counting time as proof of learning; highlighting without testing recall; avoiding every difficult question; repeating an error without noting why. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Answer a fresh question without notes after a delay and compare it with clear success criteria. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "study-6",
    "title": "Feedback, self-assessment and learning confidence",
    "minutes": 20,
    "content": [
        "Feedback is most useful when it identifies what worked, what needs improvement and what to do next. Separate comments about a particular task from judgements about your ability. One weak result identifies a skill to practise; it does not define your potential.",
        "Use self-assessment before submitting work. Check instructions, accuracy, completeness and presentation. For a calculation, verify the method and units; for a written assignment, check structure, evidence, grammar and source acknowledgement.",
        "Track progress using specific evidence such as completed exercises, fewer repeated errors or an improved explanation. Compare current work with earlier work to see changes. Celebrate progress while keeping the next learning goal realistic and specific.",
        "Practice: choose one recent mistake or piece of feedback. Write what it shows, the correction needed, how you will practise it, and how you will check improvement next time.",
        "LESSON FOCUS — Use mistakes as feedback. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Record what went wrong, why it happened and what check would prevent it. A wrong answer can reveal whether the gap is vocabulary, method, attention or transfer to a new problem.",
        "FOLLOW THE METHOD — 1) Set one goal small enough for a single session. 2) Recall what you know before reopening the notes. 3) Practise with questions, examples or a worked problem. 4) Check feedback and record the exact mistake. 5) Schedule a new attempt after a gap.",
        "WORKED EXAMPLE — A learner repeatedly forgets units. The correction is to write units at each step and add a final unit check, not just repeat the answer.",
        "PRACTICE TASK — Make an error log with columns: question, mistake, reason, correction and next practice.",
        "COMMON MISTAKES TO AVOID — counting time as proof of learning; highlighting without testing recall; avoiding every difficult question; repeating an error without noting why. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Answer a fresh question without notes after a delay and compare it with clear success criteria. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  }
],
    questions: [
  {
    "id": "study-q1",
    "prompt": "Which is the most measurable goal?",
    "options": [
      "Become brilliant immediately",
      "Study whenever possible",
      "Complete eight practice questions and review mistakes",
      "Never make an error"
    ],
    "answerIndex": 2,
    "explanation": "The goal identifies a specific task and a way to review performance."
  },
  {
    "id": "study-q2",
    "prompt": "What is active recall?",
    "options": [
      "Trying to retrieve information from memory before checking notes",
      "Copying notes without reviewing meaning",
      "Reading only headings",
      "Avoiding practice questions"
    ],
    "answerIndex": 0,
    "explanation": "Active recall tests whether information can be retrieved without looking at the source."
  },
  {
    "id": "study-q3",
    "prompt": "What is spaced practice?",
    "options": [
      "Studying only the night before",
      "Never revisiting a topic",
      "Repeating one easy question continuously",
      "Reviewing material across separate sessions"
    ],
    "answerIndex": 3,
    "explanation": "Spaced practice revisits material over time rather than concentrating all review in one session."
  },
  {
    "id": "study-q4",
    "prompt": "What should useful notes contain?",
    "options": [
      "Every word with no structure",
      "Key ideas, examples and questions organised clearly",
      "Only page numbers",
      "Unrelated quotations"
    ],
    "answerIndex": 1,
    "explanation": "Structured notes make key ideas easier to understand and revise."
  },
  {
    "id": "study-q5",
    "prompt": "What should you do first with a complex assignment?",
    "options": [
      "Ignore the instructions",
      "Write the conclusion immediately",
      "Identify the required actions and expected output",
      "Copy a classmate's work"
    ],
    "answerIndex": 2,
    "explanation": "Understanding the instructions helps plan the work required."
  },
  {
    "id": "study-q6",
    "prompt": "How should you seek help when stuck?",
    "options": [
      "Explain what you tried and ask a specific question",
      "Say nothing and submit a guess",
      "Ask an unrelated question",
      "Copy an answer without understanding"
    ],
    "answerIndex": 0,
    "explanation": "Specific questions let a teacher or peer address the actual difficulty."
  },
  {
    "id": "study-q7",
    "prompt": "Which strategy can reduce digital distractions?",
    "options": [
      "Keep every notification active",
      "Open unrelated tabs",
      "Study without a plan",
      "Silence unnecessary notifications and close unrelated tabs"
    ],
    "answerIndex": 3,
    "explanation": "Reducing interruptions can make focused study periods more productive."
  },
  {
    "id": "study-q8",
    "prompt": "What is a constructive response to a poor result?",
    "options": [
      "Decide that learning is impossible",
      "Identify errors and practise the weak skills",
      "Hide all feedback",
      "Repeat the same method without checking"
    ],
    "answerIndex": 1,
    "explanation": "Analysing errors identifies the next useful learning action."
  },
  {
    "id": "study-q9",
    "prompt": "Why should you track progress?",
    "options": [
      "To compare yourself unfairly with everyone",
      "To avoid setting new goals",
      "To identify improvement and choose the next goal",
      "To guarantee every future answer is correct"
    ],
    "answerIndex": 2,
    "explanation": "Evidence of progress helps guide realistic next steps."
  },
  {
    "id": "study-q10",
    "prompt": "What should you do before submitting an assignment?",
    "options": [
      "Check the instructions, accuracy and completeness",
      "Assume it is correct without reviewing",
      "Remove all supporting evidence",
      "Ignore required sources"
    ],
    "answerIndex": 0,
    "explanation": "A final review catches missing requirements and avoidable mistakes."
  }
],
  },
    {
    id: "primary-science-environment",
    title: "Primary Science & Environment",
    category: "Science",
    level: "Foundation",
    description: "Explore basic scientific ideas, living things, health, and the environment.",
    priceKsh: 300,
    published: true,
    lessons: [
  {
    "id": "science-1",
    "title": "Observation, questions and fair tests",
    "minutes": 20,
    "content": [
        "Science investigates the natural world through questions, observations, measurements and explanations. An observation records what is detected, while an inference is an explanation based on observations. Keeping them distinct helps prevent assumptions from being mistaken for facts.",
        "A fair test changes a factor being investigated while keeping other relevant conditions as similar as possible. To compare plant growth in sunlight and shade, use similar seedlings, comparable containers and soil, and the same watering schedule.",
        "Measurements are more useful when recorded consistently with units. Record dates, quantities and conditions in a table. Repeat observations when possible and report unexpected results honestly instead of changing data to fit a prediction.",
        "Practice: plan a safe plant-growth investigation. State the question, prediction, factor you will change, outcome you will measure, conditions you will keep similar, and how you will record results.",
        "LEARNING TARGETS — In “Observation, questions and fair tests”, learn the central idea in Primary Science & Environment, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
        "CORE IDEA — Science explains the world through observations, questions, predictions and tests. A fair investigation changes one factor when possible, records results carefully and compares evidence with the prediction. Environmental problems often involve living things, water, soil, air and human activity together.",
        "KEY WORDS — observation — information noticed or measured; prediction — reasoned expectation; variable — factor that can change; habitat — place where an organism lives; evidence — observations supporting an explanation. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
        "STEP-BY-STEP MODEL — 1) Ask a question that can be investigated safely. 2) Predict what may happen and explain why. 3) Keep the comparison fair by controlling other factors. 4) Record observations with dates, units or drawings. 5) Explain what the evidence shows and what it cannot prove.",
        "WORKED EXAMPLE — Compare seed germination using similar seeds and containers while changing only the water condition. Record daily results; one seed alone cannot prove a universal rule.",
        "GUIDED PRACTICE — Plan a safe observation about shadows, plant growth or household waste. State the question, what will change, what stays the same and what will be recorded.",
        "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Repeat the observation when possible, keep dated records and explain differences or limitations.",
        "COMMON MISTAKES — changing several factors at once; treating a prediction as a result; drawing a broad conclusion from one observation; handling unsafe materials or disturbing wildlife. If you make one of these mistakes, write the correction beside it and try a similar task again."
      ]
  },
  {
    "id": "science-2",
    "title": "Living things, needs and classification",
    "minutes": 20,
    "content": [
        "Living organisms carry out life processes such as obtaining resources, growing and reproducing. Plants generally use light energy to make sugars from carbon dioxide and water, while animals obtain energy by eating plants or other organisms. Living things also respond to changes in their surroundings.",
        "Organisms can be grouped by shared characteristics. For example, flowering plants produce flowers, while mammals are animals that feed their young with milk. Classification helps scientists organise observations and compare organisms systematically.",
        "Habitats provide resources and conditions needed for survival. A pond, grassland, forest or farm may contain different organisms adapted to the available water, food, shelter and climate. Organisms can also affect their habitats through feeding, pollination and decomposition.",
        "Practice: observe a familiar outdoor area without disturbing wildlife. Record three plants or animals, describe visible characteristics, and explain one resource each may need to survive.",
        "TODAY’S SKILL — Use Living things, needs and classification to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
        "FOLLOW THESE STEPS — 1) Ask a question that can be investigated safely. 2) Predict what may happen and explain why. 3) Keep the comparison fair by controlling other factors. 4) Record observations with dates, units or drawings. 5) Explain what the evidence shows and what it cannot prove.",
        "WATCH A MODEL — Compare seed germination using similar seeds and containers while changing only the water condition. Record daily results; one seed alone cannot prove a universal rule.",
        "TRY IT YOURSELF — Plan a safe observation about shadows, plant growth or household waste. State the question, what will change, what stays the same and what will be recorded. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
        "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
        "QUALITY CHECK — Repeat the observation when possible, keep dated records and explain differences or limitations.",
        "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
        "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
      ]
  },
  {
    "id": "science-3",
    "title": "Food chains, ecosystems and interdependence",
    "minutes": 20,
    "content": [
        "An ecosystem includes living organisms and the non-living parts of their environment. Organisms interact through feeding, competition, cooperation and other relationships. Changes in water, temperature, habitat or food availability can affect several species at once.",
        "A food chain shows one pathway of energy transfer. Grass may be eaten by a grasshopper, which may be eaten by a bird. Arrows point from the food source towards the organism receiving energy. Real ecosystems usually contain many connected food chains, forming a food web.",
        "Producers, such as green plants, make organic food using an external energy source. Consumers obtain energy by eating other organisms, while decomposers break down dead material and return nutrients to the environment. These roles help explain why organisms depend on one another.",
        "Practice: draw a food chain from a Kenyan farm or grassland. Label the producer and consumers, add arrows in the correct direction, and predict one possible effect if one population decreases.",
        "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Primary Science & Environment in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
        "CONCEPT CONNECTIONS — Connect these terms to your own example: observation — information noticed or measured; prediction — reasoned expectation; variable — factor that can change; habitat — place where an organism lives; evidence — observations supporting an explanation. Draw arrows or make a small table if it helps you see how the terms relate.",
        "MINI-CHALLENGE — Plan a safe observation about shadows, plant growth or household waste. State the question, what will change, what stays the same and what will be recorded.",
        "EXPLAIN YOUR REASONING — Compare seed germination using similar seeds and containers while changing only the water condition. Record daily results; one seed alone cannot prove a universal rule. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
        "CHECK THE ANSWER — Repeat the observation when possible, keep dated records and explain differences or limitations.",
        "ERROR SPOTTING — Look for these common mistakes: changing several factors at once; treating a prediction as a result; drawing a broad conclusion from one observation; handling unsafe materials or disturbing wildlife. Pick one and write the correction in a full sentence.",
        "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
        "SMALL NEXT STEP — Turn three everyday curiosities into questions that can be observed safely."
      ]
  },
  {
    "id": "science-4",
    "title": "Matter, materials and changes",
    "minutes": 20,
    "content": [
        "Matter has mass and occupies space. Common states include solids, liquids and gases. A solid generally keeps its shape, a liquid flows and takes the shape of its container, and a gas spreads to fill available space.",
        "Heating and cooling can change a material's state. Ice melts into liquid water, and water can evaporate into vapour. Cooling water vapour can produce liquid droplets. These changes do not necessarily create a new substance; they change its physical state.",
        "Materials have properties such as hardness, flexibility, absorbency and conductivity. These properties influence their uses. A waterproof material may be useful for a raincoat, while a good electrical conductor requires special precautions when used in electrical equipment.",
        "Practice: select three safe household materials. Describe observable properties, suggest a practical use for each, and explain which property makes it suitable. Do not heat, taste or mix unknown substances.",
        "LESSON FOCUS — Observe and ask a scientific question. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Use specific, observable descriptions rather than a guess about causes. A measurable question identifies what will be compared or counted.",
        "FOLLOW THE METHOD — 1) Ask a question that can be investigated safely. 2) Predict what may happen and explain why. 3) Keep the comparison fair by controlling other factors. 4) Record observations with dates, units or drawings. 5) Explain what the evidence shows and what it cannot prove.",
        "WORKED EXAMPLE — “Does a plant near a window grow taller over two weeks than a similar plant farther away?” is testable if the conditions are recorded.",
        "PRACTICE TASK — Turn three everyday curiosities into questions that can be observed safely.",
        "COMMON MISTAKES TO AVOID — changing several factors at once; treating a prediction as a result; drawing a broad conclusion from one observation; handling unsafe materials or disturbing wildlife. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Repeat the observation when possible, keep dated records and explain differences or limitations. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "science-5",
    "title": "Water, weather and the environment",
    "minutes": 20,
    "content": [
        "The water cycle moves water between the Earth's surface and atmosphere. Evaporation changes liquid water into vapour, condensation forms droplets, precipitation returns water to the surface, and runoff or infiltration moves water across or into the ground.",
        "Weather describes atmospheric conditions over a short period, including temperature, rainfall, wind and cloud cover. Climate describes longer-term patterns. Recording daily weather over time can reveal local patterns, but a few days do not establish a climate trend.",
        "Clean water, healthy soil and suitable habitats support people and other organisms. Poor waste disposal can contaminate waterways and block drains. Soil erosion can remove fertile topsoil, while planting suitable vegetation and protecting ground cover can help reduce erosion.",
        "Practice: keep a simple weather record for one week. Note rainfall, cloud cover and temperature if a suitable instrument is available. Identify one local environmental concern and propose a realistic action to address it.",
        "LESSON FOCUS — Fair tests and recording data. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — A fair comparison keeps important conditions similar and changes the factor being investigated. Use a table with clear labels and repeated observations where practical.",
        "FOLLOW THE METHOD — 1) Ask a question that can be investigated safely. 2) Predict what may happen and explain why. 3) Keep the comparison fair by controlling other factors. 4) Record observations with dates, units or drawings. 5) Explain what the evidence shows and what it cannot prove.",
        "WORKED EXAMPLE — For a shadow investigation, record time and shadow length while using the same object and measurement method.",
        "PRACTICE TASK — Design a fair comparison and label the factor changed, measured result and factors held similar.",
        "COMMON MISTAKES TO AVOID — changing several factors at once; treating a prediction as a result; drawing a broad conclusion from one observation; handling unsafe materials or disturbing wildlife. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Repeat the observation when possible, keep dated records and explain differences or limitations. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  },
  {
    "id": "science-6",
    "title": "Energy, forces and safe scientific practice",
    "minutes": 20,
    "content": [
        "Energy can be transferred or transformed. A lamp converts electrical energy into light and heat, while a moving bicycle has kinetic energy. Energy descriptions help explain how devices work and why energy is needed for everyday activities.",
        "A force is a push or pull that can change an object's motion or shape. Friction acts between surfaces and can slow motion, but it can also provide grip for walking and braking. The effect of a force depends on its size, direction and the situation.",
        "Scientific safety means using equipment appropriately, following instructions and avoiding unnecessary risks. Never taste unknown materials, look directly at the Sun, touch exposed electrical wiring or conduct experiments involving hazardous substances without qualified supervision.",
        "Practice: identify three devices that transfer or transform energy. For each, describe the energy input, useful output and any unwanted output, such as heat or sound. Explain one safety precaution for using the device.",
        "LESSON FOCUS — Environment and evidence. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
        "EXPLAINED CLEARLY — Environmental explanations should match the scale of the evidence. A local observation may reveal a problem but may not show every cause or prove that the same pattern occurs everywhere.",
        "FOLLOW THE METHOD — 1) Ask a question that can be investigated safely. 2) Predict what may happen and explain why. 3) Keep the comparison fair by controlling other factors. 4) Record observations with dates, units or drawings. 5) Explain what the evidence shows and what it cannot prove.",
        "WORKED EXAMPLE — A littered stream bank suggests a waste problem; checking after rainfall, upstream and downstream may reveal more than one cause.",
        "PRACTICE TASK — Observe a local environmental issue from a safe place and propose one action supported by evidence.",
        "COMMON MISTAKES TO AVOID — changing several factors at once; treating a prediction as a result; drawing a broad conclusion from one observation; handling unsafe materials or disturbing wildlife. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
        "CHECK YOUR UNDERSTANDING — Repeat the observation when possible, keep dated records and explain differences or limitations. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
        "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
      ]
  }
],
    questions: [
  {
    "id": "sci-q1",
    "prompt": "What is an observation?",
    "options": [
      "A record of something detected or measured",
      "A conclusion with no evidence",
      "A prediction that must be true",
      "A personal preference only"
    ],
    "answerIndex": 0,
    "explanation": "An observation records information gathered through the senses or instruments."
  },
  {
    "id": "sci-q2",
    "prompt": "In a fair test, why keep other relevant conditions similar?",
    "options": [
      "To make the results secret",
      "To prevent measurements",
      "To help identify the effect of the factor being changed",
      "To guarantee a preferred result"
    ],
    "answerIndex": 2,
    "explanation": "Controlling other conditions makes the comparison more meaningful."
  },
  {
    "id": "sci-q3",
    "prompt": "Which statement about plants is generally correct?",
    "options": [
      "All plants obtain food by eating animals",
      "Green plants can use light energy to make sugars",
      "Plants do not need water",
      "Plants cannot respond to their environment"
    ],
    "answerIndex": 1,
    "explanation": "Green plants generally use light energy in photosynthesis to produce sugars."
  },
  {
    "id": "sci-q4",
    "prompt": "What is the role of a producer in a food chain?",
    "options": [
      "It eats every consumer",
      "It breaks all rocks into soil",
      "It receives no energy",
      "It makes organic food, commonly using light energy"
    ],
    "answerIndex": 3,
    "explanation": "Producers such as green plants form the base of many food chains."
  },
  {
    "id": "sci-q5",
    "prompt": "What do arrows in a food chain usually represent?",
    "options": [
      "The direction of energy transfer",
      "The age of each organism",
      "The size of the habitat",
      "The distance animals travel every day"
    ],
    "answerIndex": 0,
    "explanation": "Arrows point from the food source to the organism receiving energy."
  },
  {
    "id": "sci-q6",
    "prompt": "Which is an example of a physical change?",
    "options": [
      "Iron reacting to form rust",
      "Wood burning into ash",
      "Ice melting into liquid water",
      "Food decomposing"
    ],
    "answerIndex": 2,
    "explanation": "Melting changes the state of water without creating a different substance."
  },
  {
    "id": "sci-q7",
    "prompt": "What happens during condensation?",
    "options": [
      "Liquid water becomes ice only",
      "Water vapour cools and forms liquid droplets",
      "Soil becomes a gas",
      "Water disappears permanently"
    ],
    "answerIndex": 1,
    "explanation": "Condensation changes water vapour into liquid droplets."
  },
  {
    "id": "sci-q8",
    "prompt": "What is the difference between weather and climate?",
    "options": [
      "They always mean exactly the same thing",
      "Climate changes every minute only",
      "Weather describes centuries only",
      "Weather is short-term conditions; climate describes longer-term patterns"
    ],
    "answerIndex": 3,
    "explanation": "Weather refers to short-term atmospheric conditions, while climate reflects longer-term patterns."
  },
  {
    "id": "sci-q9",
    "prompt": "Which action helps reduce soil erosion?",
    "options": [
      "Removing all ground cover",
      "Leaving soil exposed on every slope",
      "Maintaining suitable vegetation and ground cover",
      "Directing every drain onto bare soil"
    ],
    "answerIndex": 2,
    "explanation": "Vegetation and ground cover can reduce the impact of rain and flowing water on soil."
  },
  {
    "id": "sci-q10",
    "prompt": "Which is a safe science practice?",
    "options": [
      "Follow instructions and use suitable protective measures",
      "Taste an unknown chemical",
      "Touch exposed wiring",
      "Look directly at the Sun"
    ],
    "answerIndex": 0,
    "explanation": "Following instructions and suitable safety precautions helps prevent injury."
  }
],
  },
    {
    id: "primary-social-studies-citizenship",
    title: "Social Studies & Citizenship",
    category: "Social Studies",
    level: "Foundation",
    description: "Understand communities, citizenship, responsibility, culture, and society.",
    priceKsh: 300,
    published: true,
    lessons: [
  {
    "id": "social-1",
    "title": "Maps, direction and local geography",
    "minutes": 15,
    "content": [
        "A map represents a place using symbols and a smaller scale. The title explains what the map shows, a key explains symbols, and a scale relates map distance to real distance. Many maps use a north arrow or compass directions to help users orient themselves.",
        "Physical features include rivers, hills and plains. Human features include roads, schools, markets and settlements. Geography affects how people travel, grow food, trade and access services, while people's activities can also change the environment.",
        "Practice: sketch a simple map of a familiar route. Include a title, a direction marker and at least four labelled features. Do not include private information that could compromise someone's safety.",
        "LEARNING TARGETS — In “Maps, direction and local geography”, learn the central idea in Social Studies & Citizenship, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
        "CORE IDEA — Social studies examines how people, places, events and shared rules shape community life. Maps use symbols, keys, direction and scale; timelines place events in sequence. Responsible citizenship includes rights, responsibilities and participation without relying on stereotypes.",
        "KEY WORDS — community — people connected by place or shared life; citizenship — participation and responsibilities; map key — explanation of map symbols; timeline — events in time order; source — origin of an account or information. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
        "STEP-BY-STEP MODEL — 1) Identify the place, people or event studied. 2) Use the map key, scale, direction or timeline labels. 3) Compare accounts and ask who created them and why. 4) Separate verified facts from opinions or assumptions. 5) Explain how the topic affects people and shared responsibilities.",
        "WORKED EXAMPLE — A symbol for a health centre only makes sense if the map key defines it. Check the map date and scale before judging distance or assuming the service is still available.",
        "GUIDED PRACTICE — Draw a simple map of a familiar public area with title, north arrow, key and a safe route. Add one note on a community service.",
        "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Check the key and date, compare important claims with another source and state what is still uncertain.",
        "COMMON MISTAKES — ignoring map scale or direction; treating a timeline as proof of cause; repeating stereotypes; confusing opinion with evidence. If you make one of these mistakes, write the correction beside it and try a similar task again."
      ]
  },
  {
    "id": "social-2",
    "title": "Community, culture and shared responsibilities",
    "minutes": 15,
    "content": [
        "A community consists of people connected by place, interests or shared activities. Communities may include different languages, traditions, beliefs and experiences. Respectful citizenship means listening to others, avoiding discrimination and resolving disagreements peacefully.",
        "Community services such as schools, health facilities, roads and sanitation support people's well-being. Public resources need responsible use and maintenance. Residents can contribute by following reasonable rules, protecting shared property and reporting problems through appropriate channels.",
        "Practice: identify one shared facility in your community. Explain who uses it, why it matters, and two practical ways residents can help keep it safe and useful.",
        "TODAY’S SKILL — Use Community, culture and shared responsibilities to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
        "FOLLOW THESE STEPS — 1) Identify the place, people or event studied. 2) Use the map key, scale, direction or timeline labels. 3) Compare accounts and ask who created them and why. 4) Separate verified facts from opinions or assumptions. 5) Explain how the topic affects people and shared responsibilities.",
        "WATCH A MODEL — A symbol for a health centre only makes sense if the map key defines it. Check the map date and scale before judging distance or assuming the service is still available.",
        "TRY IT YOURSELF — Draw a simple map of a familiar public area with title, north arrow, key and a safe route. Add one note on a community service. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
        "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
        "QUALITY CHECK — Check the key and date, compare important claims with another source and state what is still uncertain.",
        "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
        "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
      ]
  },
  {
    "id": "social-3",
    "title": "Citizenship, rights and responsibilities",
    "minutes": 15,
    "content": [
        "Citizenship includes participation in community life and respect for the rights of others. Rights and responsibilities go together: people should be treated fairly while also respecting lawful rules, public safety and the freedoms of other people.",
        "In Kenya, national and county governments have different responsibilities. County governments provide and manage various local services, while the national government handles functions assigned to it by the Constitution. Citizens can seek information from official sources and use lawful ways to raise concerns.",
        "Practice: choose a local public-service issue, such as waste collection or road maintenance. Identify the relevant public office using an official source and draft a respectful, factual request for information or action.",
        "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Social Studies & Citizenship in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
        "CONCEPT CONNECTIONS — Connect these terms to your own example: community — people connected by place or shared life; citizenship — participation and responsibilities; map key — explanation of map symbols; timeline — events in time order; source — origin of an account or information. Draw arrows or make a small table if it helps you see how the terms relate.",
        "MINI-CHALLENGE — Draw a simple map of a familiar public area with title, north arrow, key and a safe route. Add one note on a community service.",
        "EXPLAIN YOUR REASONING — A symbol for a health centre only makes sense if the map key defines it. Check the map date and scale before judging distance or assuming the service is still available. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
        "CHECK THE ANSWER — Check the key and date, compare important claims with another source and state what is still uncertain.",
        "ERROR SPOTTING — Look for these common mistakes: ignoring map scale or direction; treating a timeline as proof of cause; repeating stereotypes; confusing opinion with evidence. Pick one and write the correction in a full sentence.",
        "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
        "SMALL NEXT STEP — Draw a map of a classroom or safe nearby area and include title, labels, key and direction."
      ]
  }
,
        {
          "id": "primary-social-studies-citizenship-lesson-4",
          "title": "Communities, culture and cooperation",
          "minutes": 8,
          "content": [
              "A community is made up of people connected by place, interests, relationships or shared activities. Communities may include families, schools, neighbourhoods and cultural groups.",
              "People in a community may have different languages, customs, beliefs and experiences. Respectful curiosity helps people learn from one another without stereotyping.",
              "Cooperation includes sharing responsibilities, helping others and solving common problems peacefully. Community members can contribute in different ways.",
              "Practice: identify three ways learners can cooperate to keep their school or neighbourhood safe and welcoming.",
              "LESSON FOCUS — Maps, directions and places. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A map simplifies a real place using symbols. The title names the purpose, the key explains symbols, direction helps orient the reader and scale relates map distance to ground distance.",
              "FOLLOW THE METHOD — 1) Identify the place, people or event studied. 2) Use the map key, scale, direction or timeline labels. 3) Compare accounts and ask who created them and why. 4) Separate verified facts from opinions or assumptions. 5) Explain how the topic affects people and shared responsibilities.",
              "WORKED EXAMPLE — A short line on a small-scale map may represent several kilometres, so the line cannot be read as a real-world ruler distance without the scale.",
              "PRACTICE TASK — Draw a map of a classroom or safe nearby area and include title, labels, key and direction.",
              "COMMON MISTAKES TO AVOID — ignoring map scale or direction; treating a timeline as proof of cause; repeating stereotypes; confusing opinion with evidence. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Check the key and date, compare important claims with another source and state what is still uncertain. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "primary-social-studies-citizenship-lesson-5",
          "title": "Rights, responsibilities and citizenship",
          "minutes": 9,
          "content": [
              "Citizenship includes participation in community life and respect for the rights and dignity of other people. Rights and responsibilities help communities function fairly.",
              "Responsibilities may include following legitimate rules, respecting others, caring for shared spaces and seeking help when someone is at risk.",
              "Public decisions should be understood through reliable information and appropriate civic processes. In Kenya, learners can study the Constitution and age-appropriate civic education materials to understand these ideas.",
              "Practice: give an example of a community right and a related responsibility, and explain why both matter.",
              "LESSON FOCUS — People, history and evidence. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A timeline shows order, but order alone does not prove that one event caused another. Compare who recorded an event, how close the source was to it and which perspectives may be missing.",
              "FOLLOW THE METHOD — 1) Identify the place, people or event studied. 2) Use the map key, scale, direction or timeline labels. 3) Compare accounts and ask who created them and why. 4) Separate verified facts from opinions or assumptions. 5) Explain how the topic affects people and shared responsibilities.",
              "WORKED EXAMPLE — Two accounts of a community event may agree on the date but differ on the reason; compare their evidence before drawing a conclusion.",
              "PRACTICE TASK — Create a short timeline from a fictional story and distinguish facts stated in the story from inferences.",
              "COMMON MISTAKES TO AVOID — ignoring map scale or direction; treating a timeline as proof of cause; repeating stereotypes; confusing opinion with evidence. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Check the key and date, compare important claims with another source and state what is still uncertain. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "primary-social-studies-citizenship-lesson-6",
          "title": "The environment and local problem-solving",
          "minutes": 9,
          "content": [
              "Local environments include land, water, plants, animals and the places where people live and work. Human activities can protect or damage these shared resources.",
              "Littering, unsafe waste disposal and wasting water can create health and environmental problems. Practical responses include proper disposal, conservation and reporting hazards to responsible adults or authorities.",
              "A community project should identify the problem, consult affected people, agree on safe actions and review the result.",
              "Practice: plan a small environmental improvement activity and list the people, materials and safety steps required.",
              "LESSON FOCUS — Rights, responsibilities and community. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Rights and responsibilities work together in community life. Decisions should respect others, use reliable information and consider how public services and shared spaces affect different people.",
              "FOLLOW THE METHOD — 1) Identify the place, people or event studied. 2) Use the map key, scale, direction or timeline labels. 3) Compare accounts and ask who created them and why. 4) Separate verified facts from opinions or assumptions. 5) Explain how the topic affects people and shared responsibilities.",
              "WORKED EXAMPLE — Keeping a shared water point clean protects access for others; reporting a safety hazard is a practical form of participation.",
              "PRACTICE TASK — Identify one community service, the people it helps, one right associated with it and one shared responsibility.",
              "COMMON MISTAKES TO AVOID — ignoring map scale or direction; treating a timeline as proof of cause; repeating stereotypes; confusing opinion with evidence. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Check the key and date, compare important claims with another source and state what is still uncertain. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
  {
    "id": "social-q1",
    "prompt": "What is the purpose of a map key?",
    "options": [
      "To show the map's price",
      "To replace all labels",
      "To explain the symbols used on the map",
      "To list every resident's name"
    ],
    "answerIndex": 2,
    "explanation": "A map key explains what its symbols and markings represent."
  },
  {
    "id": "social-q2",
    "prompt": "Which action shows respect in a diverse community?",
    "options": [
      "Listening to others and resolving disagreements peacefully",
      "Rejecting everyone with a different background",
      "Damaging shared property",
      "Spreading unverified accusations"
    ],
    "answerIndex": 0,
    "explanation": "Respectful listening and peaceful problem-solving help people live and work together."
  },
  {
    "id": "social-q3",
    "prompt": "Why should community facilities be maintained?",
    "options": [
      "Only visitors use them",
      "They should never be shared",
      "Maintenance is always unnecessary",
      "They support services and the well-being of residents"
    ],
    "answerIndex": 3,
    "explanation": "Maintained shared facilities remain safer and more useful to the community."
  },
  {
    "id": "social-q4",
    "prompt": "What is a responsible first step when raising a local public-service concern?",
    "options": [
      "Publish an unverified accusation",
      "Check the responsible office and communicate facts respectfully",
      "Damage public property",
      "Share private details about other residents"
    ],
    "answerIndex": 1,
    "explanation": "Verifying the responsible office and presenting facts supports constructive action."
  }
,
        {
          "id": "primary-social-studies-citizenship-q5",
          "prompt": "What is one characteristic of a community?",
          "options": [
            "Everyone must have identical interests",
            "People are connected by place, relationships or shared activities",
            "No one cooperates",
            "People never share responsibilities"
          ],
          "answerIndex": 1,
          "explanation": "Communities connect people through shared places, relationships or activities."
        },
        {
          "id": "primary-social-studies-citizenship-q6",
          "prompt": "How can learners show respect for cultural differences?",
          "options": [
            "Mock unfamiliar customs",
            "Assume everyone has the same experiences",
            "Listen respectfully and avoid stereotypes",
            "Exclude people who speak another language"
          ],
          "answerIndex": 2,
          "explanation": "Respectful listening helps people learn about differences without unfair assumptions."
        },
        {
          "id": "primary-social-studies-citizenship-q7",
          "prompt": "Which action demonstrates responsible citizenship?",
          "options": [
            "Respecting others and caring for shared spaces",
            "Damaging public property",
            "Spreading unverified rumours",
            "Ignoring every community concern"
          ],
          "answerIndex": 0,
          "explanation": "Responsible citizenship includes respecting people and contributing to community wellbeing."
        },
        {
          "id": "primary-social-studies-citizenship-q8",
          "prompt": "Why do communities establish legitimate rules?",
          "options": [
            "To remove every personal choice",
            "To prevent all discussion",
            "To make cooperation impossible",
            "To help organise shared life and protect people's rights"
          ],
          "answerIndex": 3,
          "explanation": "Appropriate rules can help communities coordinate activities and protect rights."
        },
        {
          "id": "primary-social-studies-citizenship-q9",
          "prompt": "What is a responsible response to a local environmental problem?",
          "options": [
            "Ignore the people affected",
            "Identify the problem and plan safe, practical action",
            "Dump more waste nearby",
            "Make claims without checking facts"
          ],
          "answerIndex": 1,
          "explanation": "Good problem-solving starts with understanding the issue and choosing safe actions."
        },
        {
          "id": "primary-social-studies-citizenship-q10",
          "prompt": "Why should a community project review its results?",
          "options": [
            "To hide mistakes",
            "To avoid learning",
            "To understand what worked and what could improve",
            "To guarantee that no future problems occur"
          ],
          "answerIndex": 2,
          "explanation": "Reviewing results helps the community learn and improve future activities."
        }
      ],
  },
    {
    id: "secondary-mathematics",
    title: "Secondary Mathematics",
    category: "Mathematics",
    level: "Intermediate",
    description: "Practise algebra, geometry, statistics, equations, and mathematical reasoning.",
    priceKsh: 750,
    published: true,
    lessons: [
      {
        id: "secondary-mathematics-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nPractise algebra, geometry, statistics, equations, and mathematical reasoning.\n\nLearning objectives\n\n- Identify the main ideas in Secondary Mathematics.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Secondary Mathematics, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Secondary mathematics represents relationships with symbols, diagrams, equations and functions. A solution must follow valid steps and satisfy the original problem. Multiple representations can show structure that is hard to see from symbols alone.",
            "KEY WORDS — variable — symbol representing a value; expression — numbers and operations without an equality claim; equation — statement that two expressions are equal; function — rule mapping inputs to outputs; domain — allowed input values. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Translate the wording into symbols or a diagram. 2) List known values, unknowns and restrictions. 3) Choose a method and show every transformation. 4) Substitute the answer back or check in another way. 5) State units and what the result means in context.",
            "WORKED EXAMPLE — For 3x + 5 = 20, subtract 5 from both sides to get 3x = 15, then divide both sides by 3 to get x = 5. Substitution gives 3(5) + 5 = 20.",
            "GUIDED PRACTICE — Solve five equations and write why each operation preserves equality. Check every answer by substitution.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Substitute into the original equation, estimate when suitable and check all restrictions.",
            "COMMON MISTAKES — changing only one side of an equation; cancelling terms that are not common factors; ignoring domain restrictions; dropping units in an applied question. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "secondary-mathematics-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Secondary Mathematics can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Translate the wording into symbols or a diagram. 2) List known values, unknowns and restrictions. 3) Choose a method and show every transformation. 4) Substitute the answer back or check in another way. 5) State units and what the result means in context.",
            "WATCH A MODEL — For 3x + 5 = 20, subtract 5 from both sides to get 3x = 15, then divide both sides by 3 to get x = 5. Substitution gives 3(5) + 5 = 20.",
            "TRY IT YOURSELF — Solve five equations and write why each operation preserves equality. Check every answer by substitution. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Substitute into the original equation, estimate when suitable and check all restrictions.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "secondary-mathematics-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Secondary Mathematics.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Secondary Mathematics in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: variable — symbol representing a value; expression — numbers and operations without an equality claim; equation — statement that two expressions are equal; function — rule mapping inputs to outputs; domain — allowed input values. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Solve five equations and write why each operation preserves equality. Check every answer by substitution.",
            "EXPLAIN YOUR REASONING — For 3x + 5 = 20, subtract 5 from both sides to get 3x = 15, then divide both sides by 3 to get x = 5. Substitution gives 3(5) + 5 = 20. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Substitute into the original equation, estimate when suitable and check all restrictions.",
            "ERROR SPOTTING — Look for these common mistakes: changing only one side of an equation; cancelling terms that are not common factors; ignoring domain restrictions; dropping units in an applied question. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Write an expression for “five more than twice a number” and calculate it for two different values."
          ],
      }
    ,
        {
          "id": "secondary-mathematics-lesson-4",
          "title": "Algebraic expressions and equations",
          "minutes": 10,
          "content": [
              "An algebraic expression combines numbers, variables and operations. Like terms have the same variable parts and can be combined by adding or subtracting their coefficients.",
              "An equation states that two expressions are equal. To solve a linear equation, perform equivalent operations on both sides while preserving equality.",
              "Check a proposed solution by substituting it into the original equation. This can reveal arithmetic mistakes or incorrect transformations.",
              "Practice: solve 3x + 5 = 20 and check your answer by substitution.",
              "LESSON FOCUS — Variables and expressions. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A variable represents a value; an expression combines values and operations. Substitute a known value carefully and use operation order to calculate.",
              "FOLLOW THE METHOD — 1) Translate the wording into symbols or a diagram. 2) List known values, unknowns and restrictions. 3) Choose a method and show every transformation. 4) Substitute the answer back or check in another way. 5) State units and what the result means in context.",
              "WORKED EXAMPLE — If x = 4, then 2x + 3 = 2(4) + 3 = 11.",
              "PRACTICE TASK — Write an expression for “five more than twice a number” and calculate it for two different values.",
              "COMMON MISTAKES TO AVOID — changing only one side of an equation; cancelling terms that are not common factors; ignoring domain restrictions; dropping units in an applied question. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Substitute into the original equation, estimate when suitable and check all restrictions. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "secondary-mathematics-lesson-5",
          "title": "Ratios, percentages and proportional reasoning",
          "minutes": 9,
          "content": [
              "A ratio compares quantities. Simplify a ratio by dividing its terms by a common factor, while keeping the quantities in the correct order.",
              "A percentage expresses a quantity per hundred. To calculate a percentage of a number, convert the percentage to a fraction or decimal and multiply.",
              "Proportional reasoning helps compare prices, rates, scales and quantities. Check units and whether the relationship is directly or inversely proportional.",
              "Practice: calculate 15% of 800 and explain the steps used.",
              "LESSON FOCUS — Solving equations. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — An equation remains balanced when the same valid operation is applied to both sides. Work backwards from addition or subtraction and then undo multiplication or division.",
              "FOLLOW THE METHOD — 1) Translate the wording into symbols or a diagram. 2) List known values, unknowns and restrictions. 3) Choose a method and show every transformation. 4) Substitute the answer back or check in another way. 5) State units and what the result means in context.",
              "WORKED EXAMPLE — 2x − 7 = 9 → 2x = 16 → x = 8. Check: 2(8) − 7 = 9.",
              "PRACTICE TASK — Solve three two-step equations and verify each by substituting the result.",
              "COMMON MISTAKES TO AVOID — changing only one side of an equation; cancelling terms that are not common factors; ignoring domain restrictions; dropping units in an applied question. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Substitute into the original equation, estimate when suitable and check all restrictions. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "secondary-mathematics-lesson-6",
          "title": "Graphs, data and checking solutions",
          "minutes": 10,
          "content": [
              "Graphs represent relationships between quantities. Read axis labels, scales and units carefully before interpreting a point or trend.",
              "A coordinate is written as an ordered pair (x, y). In a straight-line graph, changes in y relative to changes in x can help describe the gradient.",
              "When solving a problem, show the important steps, check units and assess whether the answer is reasonable in context. A graph can support an answer but should not be read beyond the evidence it displays.",
              "Practice: plot the points (1, 2), (2, 4) and (3, 6), then describe the pattern.",
              "LESSON FOCUS — Graphs and checking solutions. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — A graph represents how values relate. Axes require labels and scale; intercepts, slope and shape can suggest patterns, but interpretation must match the equation and context.",
              "FOLLOW THE METHOD — 1) Translate the wording into symbols or a diagram. 2) List known values, unknowns and restrictions. 3) Choose a method and show every transformation. 4) Substitute the answer back or check in another way. 5) State units and what the result means in context.",
              "WORKED EXAMPLE — For y = 2x + 1, inputs 0, 1 and 2 give outputs 1, 3 and 5, forming a straight-line pattern.",
              "PRACTICE TASK — Create a small input-output table, sketch the points and explain what changes when x increases by one.",
              "COMMON MISTAKES TO AVOID — changing only one side of an equation; cancelling terms that are not common factors; ignoring domain restrictions; dropping units in an applied question. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Substitute into the original equation, estimate when suitable and check all restrictions. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      {
        id: "secondary-mathematics-question-1",
        prompt: "What is a useful first step when learning Secondary Mathematics?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "secondary-mathematics-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "secondary-mathematics-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "secondary-mathematics-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
        {
          "id": "secondary-mathematics-q5",
          "prompt": "Solve the equation 3x + 5 = 20.",
          "options": [
            "x = 3",
            "x = 5",
            "x = 10",
            "x = 15"
          ],
          "answerIndex": 1,
          "explanation": "Subtract 5 from both sides to get 3x = 15, then divide by 3 to obtain x = 5."
        },
        {
          "id": "secondary-mathematics-q6",
          "prompt": "What is 15% of 800?",
          "options": [
            "80",
            "100",
            "120",
            "150"
          ],
          "answerIndex": 2,
          "explanation": "15% of 800 is 0.15 multiplied by 800, which equals 120."
        },
        {
          "id": "secondary-mathematics-q7",
          "prompt": "Simplify the ratio 12:18.",
          "options": [
            "2:3",
            "3:2",
            "6:9",
            "4:9"
          ],
          "answerIndex": 0,
          "explanation": "Divide both terms by their greatest common factor, 6, to obtain 2:3."
        },
        {
          "id": "secondary-mathematics-q8",
          "prompt": "Which ordered pair represents a point with x = 2 and y = 4?",
          "options": [
            "(4, 2)",
            "(2, 2)",
            "(4, 4)",
            "(2, 4)"
          ],
          "answerIndex": 3,
          "explanation": "Coordinates are written in the order (x, y), so the point is (2, 4)."
        },
        {
          "id": "secondary-mathematics-q9",
          "prompt": "Why substitute a solution into the original equation?",
          "options": [
            "To make the equation longer",
            "To check whether the proposed value satisfies the equation",
            "To remove the variable without calculation",
            "To change the original question"
          ],
          "answerIndex": 1,
          "explanation": "Substitution verifies whether the proposed value makes both sides equal."
        },
        {
          "id": "secondary-mathematics-q10",
          "prompt": "What should you check when interpreting a graph?",
          "options": [
            "Only the line colour",
            "Only the title font",
            "Axis labels, scale and units",
            "Whether the graph contains decorative shapes"
          ],
          "answerIndex": 2,
          "explanation": "Labels, scales and units are essential for interpreting graph values accurately."
        }
      ],
  },
    {
    id: "biology-life-sciences",
    title: "Biology & Life Sciences",
    category: "Science",
    level: "Intermediate",
    description: "Study cells, organisms, body systems, ecosystems, and life processes.",
    priceKsh: 750,
    published: true,
    lessons: [
      {
        id: "biology-life-sciences-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nStudy cells, organisms, body systems, ecosystems, and life processes.\n\nLearning objectives\n\n- Identify the main ideas in Biology & Life Sciences.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Biology & Life Sciences, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Biology studies life at levels from cells to organisms, populations and ecosystems. Structure and function are connected: ask how a feature supports a process. A scientific explanation should distinguish observations from hypotheses and note how conditions affect living systems.",
            "KEY WORDS — cell — basic structural unit of life; tissue — group of similar cells working together; organ — structure made of tissues with a function; ecosystem — organisms interacting with environment; adaptation — inherited feature affecting survival or reproduction. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Name the organism or process being studied. 2) Identify the structures and their roles. 3) Describe the process in the correct sequence. 4) Link observations to a biological explanation. 5) Consider variation, conditions and missing evidence.",
            "WORKED EXAMPLE — Leaves capture light for photosynthesis while roots take up water and minerals. A wilted plant may lack water, but root damage, disease or temperature may also contribute.",
            "GUIDED PRACTICE — Draw and label a biological structure or process, explain each label’s function and identify one condition that could affect it.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Verify terms against a trusted text, label clearly and explain how evidence supports the stated function.",
            "COMMON MISTAKES — assuming a diagram is to scale; confusing correlation and cause; generalising from one organism; handling biological samples unsafely. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "biology-life-sciences-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Biology & Life Sciences can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Name the organism or process being studied. 2) Identify the structures and their roles. 3) Describe the process in the correct sequence. 4) Link observations to a biological explanation. 5) Consider variation, conditions and missing evidence.",
            "WATCH A MODEL — Leaves capture light for photosynthesis while roots take up water and minerals. A wilted plant may lack water, but root damage, disease or temperature may also contribute.",
            "TRY IT YOURSELF — Draw and label a biological structure or process, explain each label’s function and identify one condition that could affect it. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Verify terms against a trusted text, label clearly and explain how evidence supports the stated function.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "biology-life-sciences-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Biology & Life Sciences.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Biology & Life Sciences in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: cell — basic structural unit of life; tissue — group of similar cells working together; organ — structure made of tissues with a function; ecosystem — organisms interacting with environment; adaptation — inherited feature affecting survival or reproduction. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Draw and label a biological structure or process, explain each label’s function and identify one condition that could affect it.",
            "EXPLAIN YOUR REASONING — Leaves capture light for photosynthesis while roots take up water and minerals. A wilted plant may lack water, but root damage, disease or temperature may also contribute. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Verify terms against a trusted text, label clearly and explain how evidence supports the stated function.",
            "ERROR SPOTTING — Look for these common mistakes: assuming a diagram is to scale; confusing correlation and cause; generalising from one organism; handling biological samples unsafely. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Draw the sequence cell → tissue → organ → organ system → organism and give one example."
          ],
      }
    ,
        {
          "id": "biology-life-sciences-lesson-4",
          "title": "Cells and organisation in living things",
          "minutes": 10,
          "content": [
              "Cells are the basic structural and functional units of living organisms. Many organisms are made of one cell, while multicellular organisms contain many specialised cells.",
              "Cell structures perform different roles. For example, the cell membrane regulates movement of substances, and the nucleus of typical plant and animal cells contains genetic material.",
              "In multicellular organisms, cells form tissues, tissues form organs, and organs work together in organ systems. Specialisation allows different tasks to be carried out efficiently.",
              "Practice: draw and label a simple plant or animal cell, then describe two structures and their functions.",
              "LESSON FOCUS — Cells and organisation. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Cells are the basic units of living things. Similar cells can form tissues; tissues form organs; organs work together in systems. Each level depends on interactions among the levels before it.",
              "FOLLOW THE METHOD — 1) Name the organism or process being studied. 2) Identify the structures and their roles. 3) Describe the process in the correct sequence. 4) Link observations to a biological explanation. 5) Consider variation, conditions and missing evidence.",
              "WORKED EXAMPLE — Muscle cells form muscle tissue; muscle tissue contributes to the heart, which works with blood vessels as part of circulation.",
              "PRACTICE TASK — Draw the sequence cell → tissue → organ → organ system → organism and give one example.",
              "COMMON MISTAKES TO AVOID — assuming a diagram is to scale; confusing correlation and cause; generalising from one organism; handling biological samples unsafely. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Verify terms against a trusted text, label clearly and explain how evidence supports the stated function. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "biology-life-sciences-lesson-5",
          "title": "Nutrition, respiration and energy",
          "minutes": 10,
          "content": [
              "Living organisms need energy to carry out life processes. Nutrition provides materials used for growth, repair and energy-related activities.",
              "Photosynthesis allows green plants to use light energy to produce glucose from carbon dioxide and water, releasing oxygen under typical conditions.",
              "Cellular respiration releases usable energy from food molecules. It is not the same process as breathing, although breathing helps animals exchange gases needed for aerobic respiration.",
              "Practice: compare photosynthesis and aerobic respiration by identifying their main inputs and outputs.",
              "LESSON FOCUS — Processes and adaptations. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Biological processes depend on structures and environmental conditions. Adaptations are inherited features across generations, not changes a single organism deliberately chooses because it needs them.",
              "FOLLOW THE METHOD — 1) Name the organism or process being studied. 2) Identify the structures and their roles. 3) Describe the process in the correct sequence. 4) Link observations to a biological explanation. 5) Consider variation, conditions and missing evidence.",
              "WORKED EXAMPLE — A broad leaf can help capture light, while a waxy surface can reduce water loss in some environments.",
              "PRACTICE TASK — Choose an organism, name two features and explain how each may affect survival or reproduction.",
              "COMMON MISTAKES TO AVOID — assuming a diagram is to scale; confusing correlation and cause; generalising from one organism; handling biological samples unsafely. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Verify terms against a trusted text, label clearly and explain how evidence supports the stated function. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        },
        {
          "id": "biology-life-sciences-lesson-6",
          "title": "Ecosystems, variation and scientific investigation",
          "minutes": 10,
          "content": [
              "An ecosystem includes organisms and their physical environment. Organisms interact through feeding relationships, competition, cooperation and changes to habitat.",
              "Biodiversity describes the variety of living things. Habitat protection, responsible resource use and reducing pollution can help support ecosystem health.",
              "Scientific investigations begin with a question and a method for collecting evidence. Change one factor at a time when appropriate, record observations accurately and avoid claiming more than the evidence supports.",
              "Practice: propose a simple investigation comparing plant growth under two light conditions, while keeping other important conditions similar.",
              "LESSON FOCUS — Evidence and ecosystems. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
              "EXPLAINED CLEARLY — Organisms interact with other organisms and with water, soil, light and temperature. Ecosystem explanations should consider food relationships, resource changes and the time and location of observations.",
              "FOLLOW THE METHOD — 1) Name the organism or process being studied. 2) Identify the structures and their roles. 3) Describe the process in the correct sequence. 4) Link observations to a biological explanation. 5) Consider variation, conditions and missing evidence.",
              "WORKED EXAMPLE — Fewer pollinators may coincide with reduced fruit production, but crop type, weather and other factors also need investigation.",
              "PRACTICE TASK — Draw a simple food web and predict two possible effects if one population changed.",
              "COMMON MISTAKES TO AVOID — assuming a diagram is to scale; confusing correlation and cause; generalising from one organism; handling biological samples unsafely. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
              "CHECK YOUR UNDERSTANDING — Verify terms against a trusted text, label clearly and explain how evidence supports the stated function. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
              "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
            ]
        }
      ],
    questions: [
      {
        id: "biology-life-sciences-question-1",
        prompt: "What is a useful first step when learning Biology & Life Sciences?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "biology-life-sciences-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "biology-life-sciences-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "biology-life-sciences-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
        {
          "id": "biology-life-sciences-q5",
          "prompt": "What is a cell?",
          "options": [
            "A type of weather",
            "The basic structural and functional unit of living organisms",
            "A complete ecosystem in every case",
            "A non-living mineral"
          ],
          "answerIndex": 1,
          "explanation": "Cells are the basic units from which living organisms are organised."
        },
        {
          "id": "biology-life-sciences-q6",
          "prompt": "What is a main function of the cell membrane?",
          "options": [
            "To make every organism multicellular",
            "To replace all genetic material",
            "To regulate movement of substances into and out of the cell",
            "To perform every cellular function alone"
          ],
          "answerIndex": 2,
          "explanation": "The cell membrane helps regulate the movement of substances."
        },
        {
          "id": "biology-life-sciences-q7",
          "prompt": "What is needed for photosynthesis in green plants?",
          "options": [
            "Light, water and carbon dioxide",
            "Only oxygen and darkness",
            "Only soil with no water",
            "Only glucose from animals"
          ],
          "answerIndex": 0,
          "explanation": "Photosynthesis uses light energy, water and carbon dioxide to produce glucose."
        },
        {
          "id": "biology-life-sciences-q8",
          "prompt": "What is the role of cellular respiration?",
          "options": [
            "To turn every cell into a tissue",
            "To eliminate the need for nutrients",
            "To create sunlight",
            "To release usable energy from food molecules"
          ],
          "answerIndex": 3,
          "explanation": "Cellular respiration releases usable energy from food molecules."
        },
        {
          "id": "biology-life-sciences-q9",
          "prompt": "What does biodiversity refer to?",
          "options": [
            "The number of rocks in one sample only",
            "The variety of living things",
            "Only the weather on one day",
            "The size of a single cell"
          ],
          "answerIndex": 1,
          "explanation": "Biodiversity describes the variety of life in an area or across the planet."
        },
        {
          "id": "biology-life-sciences-q10",
          "prompt": "Why should a scientific investigation record observations carefully?",
          "options": [
            "To guarantee the preferred result",
            "To avoid comparing evidence",
            "To support conclusions with reliable evidence",
            "To remove the need for a method"
          ],
          "answerIndex": 2,
          "explanation": "Accurate observations allow others to evaluate the evidence and conclusions."
        }
      ],
  },
    {
    id: "chemistry-fundamentals",
    title: "Chemistry Fundamentals",
    category: "Science",
    level: "Intermediate",
    description: "Explore matter, elements, compounds, chemical reactions, and laboratory safety.",
    priceKsh: 750,
    published: true,
    lessons: [
      {
        id: "chemistry-fundamentals-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nExplore matter, elements, compounds, chemical reactions, and laboratory safety.\n\nLearning objectives\n\n- Identify the main ideas in Chemistry Fundamentals.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Chemistry Fundamentals, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Chemistry studies matter, its properties and how it changes. During a chemical reaction, atoms are rearranged and conserved; an equation represents those ratios. Observations such as bubbles or colour changes can be clues, but safe measurements and controlled comparisons provide stronger evidence.",
            "KEY WORDS — atom — basic unit of an element; molecule — two or more bonded atoms; element — substance made from one type of atom; compound — elements chemically combined; conservation of mass — atoms and total mass are conserved in a closed reaction system. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Identify and label substances before a change. 2) Record observable properties before and after. 3) Use particle models or formulas where appropriate. 4) Balance equations by counting each type of atom. 5) Follow approved safety instructions and record data.",
            "WORKED EXAMPLE — When balancing a chemical equation, change coefficients to adjust the number of particles represented. Do not change subscripts, because that changes the identity of a chemical substance.",
            "GUIDED PRACTICE — Use a teacher-approved simulation to compare particle models before and after a reaction. Count atoms and explain what is conserved.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Count each atom on both sides and make sure the evidence supports the claim. Never improvise chemical handling.",
            "COMMON MISTAKES — calling one observation definitive proof; confusing mixtures and compounds; changing subscripts to balance an equation; mixing unknown substances. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "chemistry-fundamentals-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Chemistry Fundamentals can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Identify and label substances before a change. 2) Record observable properties before and after. 3) Use particle models or formulas where appropriate. 4) Balance equations by counting each type of atom. 5) Follow approved safety instructions and record data.",
            "WATCH A MODEL — When balancing a chemical equation, change coefficients to adjust the number of particles represented. Do not change subscripts, because that changes the identity of a chemical substance.",
            "TRY IT YOURSELF — Use a teacher-approved simulation to compare particle models before and after a reaction. Count atoms and explain what is conserved. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Count each atom on both sides and make sure the evidence supports the claim. Never improvise chemical handling.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "chemistry-fundamentals-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Chemistry Fundamentals.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Chemistry Fundamentals in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: atom — basic unit of an element; molecule — two or more bonded atoms; element — substance made from one type of atom; compound — elements chemically combined; conservation of mass — atoms and total mass are conserved in a closed reaction system. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Use a teacher-approved simulation to compare particle models before and after a reaction. Count atoms and explain what is conserved.",
            "EXPLAIN YOUR REASONING — When balancing a chemical equation, change coefficients to adjust the number of particles represented. Do not change subscripts, because that changes the identity of a chemical substance. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Count each atom on both sides and make sure the evidence supports the claim. Never improvise chemical handling.",
            "ERROR SPOTTING — Look for these common mistakes: calling one observation definitive proof; confusing mixtures and compounds; changing subscripts to balance an equation; mixing unknown substances. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Use particle drawings to distinguish an element, a compound and a mixture."
          ],
      }
    ,
{
  "id": "chemistry-fundamentals-lesson-4",
  "title": "Atoms, Elements and Compounds",
  "minutes": 15,
  "content": [
      "Matter is anything that has mass and occupies space. Common states of matter include solids, liquids and gases.",
      "An atom is a basic unit of an element. Elements contain one type of atom, while compounds contain two or more elements chemically combined in fixed proportions.",
      "A molecule consists of two or more atoms chemically bonded. Mixtures contain substances physically combined and can often be separated using physical methods.",
      "The periodic table organizes elements by atomic number and recurring chemical properties. Chemical symbols provide a standard way to represent elements.",
      "Classifying matter helps explain its properties and predict how substances may interact.",
      "LESSON FOCUS — Atoms, elements and compounds. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Elements contain one type of atom; compounds contain atoms of different elements chemically combined in fixed ratios. Formulas communicate composition.",
      "FOLLOW THE METHOD — 1) Identify and label substances before a change. 2) Record observable properties before and after. 3) Use particle models or formulas where appropriate. 4) Balance equations by counting each type of atom. 5) Follow approved safety instructions and record data.",
      "WORKED EXAMPLE — H₂O represents two hydrogen atoms for each oxygen atom in one water molecule; the small subscript changes the composition.",
      "PRACTICE TASK — Use particle drawings to distinguish an element, a compound and a mixture.",
      "COMMON MISTAKES TO AVOID — calling one observation definitive proof; confusing mixtures and compounds; changing subscripts to balance an equation; mixing unknown substances. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Count each atom on both sides and make sure the evidence supports the claim. Never improvise chemical handling. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "chemistry-fundamentals-lesson-5",
  "title": "Chemical Reactions and Equations",
  "minutes": 18,
  "content": [
      "A chemical reaction transforms reactants into products. Evidence may include a colour change, gas production, a temperature change or formation of a precipitate.",
      "Chemical equations represent reactions using symbols and formulas. Reactants appear on the left and products on the right.",
      "A balanced equation has the same number of atoms of each element on both sides. Coefficients balance equations without changing chemical formulas.",
      "Mass is conserved in a closed chemical system. Atoms are rearranged during a reaction rather than created or destroyed.",
      "Observe reactions only under appropriate supervision and follow laboratory instructions. Never mix unknown chemicals.",
      "LESSON FOCUS — Physical and chemical changes. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A physical change alters form or state without making a new substance; a chemical reaction rearranges atoms into new combinations. Use multiple observations and controlled evidence where possible.",
      "FOLLOW THE METHOD — 1) Identify and label substances before a change. 2) Record observable properties before and after. 3) Use particle models or formulas where appropriate. 4) Balance equations by counting each type of atom. 5) Follow approved safety instructions and record data.",
      "WORKED EXAMPLE — Melting ice changes state while remaining water; rusting iron forms different substances through a chemical process.",
      "PRACTICE TASK — Classify several familiar changes and state what evidence would help support each classification.",
      "COMMON MISTAKES TO AVOID — calling one observation definitive proof; confusing mixtures and compounds; changing subscripts to balance an equation; mixing unknown substances. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Count each atom on both sides and make sure the evidence supports the claim. Never improvise chemical handling. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "chemistry-fundamentals-lesson-6",
  "title": "Acids, Bases and Laboratory Safety",
  "minutes": 16,
  "content": [
      "Acids and bases have different chemical properties. The pH scale commonly ranges from 0 to 14, with values below 7 acidic, 7 neutral and above 7 basic at ordinary conditions.",
      "Indicators, such as litmus, change colour depending on whether a solution is acidic or basic. Use approved indicators according to instructions.",
      "Neutralization is a reaction between an acid and a base that commonly produces a salt and water.",
      "Wear appropriate protective equipment, read labels and keep chemicals away from food and drink. Never taste laboratory substances.",
      "If a spill or exposure occurs, alert the supervisor and follow the established emergency procedure. Do not handle hazardous substances without training.",
      "LESSON FOCUS — Equations and conservation. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A balanced equation has the same count of each type of atom on both sides. Coefficients express ratios of particles, so equations can describe quantitative relationships.",
      "FOLLOW THE METHOD — 1) Identify and label substances before a change. 2) Record observable properties before and after. 3) Use particle models or formulas where appropriate. 4) Balance equations by counting each type of atom. 5) Follow approved safety instructions and record data.",
      "WORKED EXAMPLE — 2H₂ + O₂ → 2H₂O has four hydrogen atoms and two oxygen atoms on each side.",
      "PRACTICE TASK — Count atoms in a sample equation, balance it using coefficients and check the final count.",
      "COMMON MISTAKES TO AVOID — calling one observation definitive proof; confusing mixtures and compounds; changing subscripts to balance an equation; mixing unknown substances. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Count each atom on both sides and make sure the evidence supports the claim. Never improvise chemical handling. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "chemistry-fundamentals-question-1",
        prompt: "What is a useful first step when learning Chemistry Fundamentals?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "chemistry-fundamentals-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "chemistry-fundamentals-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "chemistry-fundamentals-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "chemistry-fundamentals-q5",
  "prompt": "What is an element?",
  "options": [
    "A substance containing one type of atom",
    "Any physical mixture",
    "A tool used in a laboratory",
    "A substance that must contain water"
  ],
  "answerIndex": 0,
  "explanation": "An element is made of one type of atom."
},
{
  "id": "chemistry-fundamentals-q6",
  "prompt": "How does a compound differ from a mixture?",
  "options": [
    "A compound has chemically combined elements in fixed proportions",
    "A mixture always contains only one substance",
    "A compound can never contain atoms",
    "A mixture must be a gas"
  ],
  "answerIndex": 0,
  "explanation": "Compounds have chemically bonded components in defined proportions; mixtures are physically combined."
},
{
  "id": "chemistry-fundamentals-q7",
  "prompt": "Where are reactants normally written in a chemical equation?",
  "options": [
    "To the left of the arrow",
    "Only above the arrow",
    "To the right of the arrow",
    "Outside the equation"
  ],
  "answerIndex": 0,
  "explanation": "Reactants are written on the left and products on the right."
},
{
  "id": "chemistry-fundamentals-q8",
  "prompt": "What does balancing a chemical equation ensure?",
  "options": [
    "Equal numbers of atoms of each element on both sides",
    "Every substance has the same colour",
    "The reaction always happens instantly",
    "All coefficients must be one"
  ],
  "answerIndex": 0,
  "explanation": "Balancing reflects conservation of atoms in a chemical reaction."
},
{
  "id": "chemistry-fundamentals-q9",
  "prompt": "A solution with a pH of 3 is generally classified as what?",
  "options": [
    "Acidic",
    "Neutral",
    "Basic",
    "A pure element"
  ],
  "answerIndex": 0,
  "explanation": "A pH below 7 is generally acidic."
},
{
  "id": "chemistry-fundamentals-q10",
  "prompt": "What should you do before handling a laboratory chemical?",
  "options": [
    "Read the label and follow safety instructions",
    "Smell it closely",
    "Mix it with another chemical",
    "Taste a small amount"
  ],
  "answerIndex": 0,
  "explanation": "Read labels, use appropriate protection and follow approved procedures."
}
],
  },
    {
    id: "physics-fundamentals",
    title: "Physics Fundamentals",
    category: "Science",
    level: "Intermediate",
    description: "Learn the basics of forces, motion, energy, electricity, and waves.",
    priceKsh: 750,
    published: true,
    lessons: [
      {
        id: "physics-fundamentals-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nLearn the basics of forces, motion, energy, electricity, and waves.\n\nLearning objectives\n\n- Identify the main ideas in Physics Fundamentals.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Physics Fundamentals, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Physics uses measurements and models to describe motion, forces, energy, waves and electricity. Equations depend on units and assumptions. Drawings show directions and relationships; repeated measurements reveal uncertainty and help test whether a result is plausible.",
            "KEY WORDS — force — interaction that can change motion; speed — distance per unit time; energy — quantity transferred or transformed; current — rate of electric charge flow; measurement uncertainty — limit on precision. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Draw the situation and identify relevant quantities. 2) Write known values with units and convert if needed. 3) Choose a formula that fits the situation. 4) Substitute values and calculate with units. 5) Check magnitude, direction and assumptions.",
            "WORKED EXAMPLE — A learner walks 120 metres in 60 seconds. Average speed = distance ÷ time = 120 m ÷ 60 s = 2 m/s. This is an average, not the speed at every moment.",
            "GUIDED PRACTICE — Use a safe motion example. Measure distance and time, calculate average speed, repeat the measurement and explain possible differences.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Check units, estimate the answer and compare repeat measurements. Electrical demonstrations require approved low-voltage equipment and supervision.",
            "COMMON MISTAKES — mixing metres and kilometres; confusing speed and velocity; using a formula outside its conditions; experimenting with mains electricity. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "physics-fundamentals-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Physics Fundamentals can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Draw the situation and identify relevant quantities. 2) Write known values with units and convert if needed. 3) Choose a formula that fits the situation. 4) Substitute values and calculate with units. 5) Check magnitude, direction and assumptions.",
            "WATCH A MODEL — A learner walks 120 metres in 60 seconds. Average speed = distance ÷ time = 120 m ÷ 60 s = 2 m/s. This is an average, not the speed at every moment.",
            "TRY IT YOURSELF — Use a safe motion example. Measure distance and time, calculate average speed, repeat the measurement and explain possible differences. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Check units, estimate the answer and compare repeat measurements. Electrical demonstrations require approved low-voltage equipment and supervision.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "physics-fundamentals-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Physics Fundamentals.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Physics Fundamentals in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: force — interaction that can change motion; speed — distance per unit time; energy — quantity transferred or transformed; current — rate of electric charge flow; measurement uncertainty — limit on precision. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Use a safe motion example. Measure distance and time, calculate average speed, repeat the measurement and explain possible differences.",
            "EXPLAIN YOUR REASONING — A learner walks 120 metres in 60 seconds. Average speed = distance ÷ time = 120 m ÷ 60 s = 2 m/s. This is an average, not the speed at every moment. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Check units, estimate the answer and compare repeat measurements. Electrical demonstrations require approved low-voltage equipment and supervision.",
            "ERROR SPOTTING — Look for these common mistakes: mixing metres and kilometres; confusing speed and velocity; using a formula outside its conditions; experimenting with mains electricity. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Draw a route and compare distance with displacement."
          ],
      }
    ,
{
  "id": "physics-fundamentals-lesson-4",
  "title": "Motion, Forces and Measurement",
  "minutes": 18,
  "content": [
      "Physics studies matter, energy, motion and the interactions between them. Measurements make observations quantitative and comparable.",
      "Distance describes how much ground an object covers. Displacement describes the change in position in a specified direction.",
      "Average speed is distance divided by time. Acceleration describes the rate at which velocity changes.",
      "A force is a push or pull. Forces can change an object's motion or shape. Balanced forces produce no change in motion, while an unbalanced net force causes acceleration.",
      "Use suitable units, calibrated instruments and repeated measurements where practical. Record results clearly and include units.",
      "LESSON FOCUS — Measuring motion. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Distance describes the path travelled; displacement describes change in position and direction. Speed is distance divided by time; velocity includes direction.",
      "FOLLOW THE METHOD — 1) Draw the situation and identify relevant quantities. 2) Write known values with units and convert if needed. 3) Choose a formula that fits the situation. 4) Substitute values and calculate with units. 5) Check magnitude, direction and assumptions.",
      "WORKED EXAMPLE — Walking 5 m east and 5 m west covers 10 m of distance but ends at the starting position, so displacement is zero.",
      "PRACTICE TASK — Draw a route and compare distance with displacement.",
      "COMMON MISTAKES TO AVOID — mixing metres and kilometres; confusing speed and velocity; using a formula outside its conditions; experimenting with mains electricity. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Check units, estimate the answer and compare repeat measurements. Electrical demonstrations require approved low-voltage equipment and supervision. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "physics-fundamentals-lesson-5",
  "title": "Energy, Work and Electricity",
  "minutes": 18,
  "content": [
      "Energy is the capacity to cause change or do work. Forms include kinetic, gravitational potential, thermal, chemical and electrical energy.",
      "Energy can be transferred or transformed. In a closed system, total energy is conserved, although some may spread into less useful forms such as heat.",
      "Work is done when a force transfers energy through displacement in the direction of the force.",
      "An electric circuit needs a complete conducting path for sustained current. A cell or other source can provide a potential difference.",
      "Electrical safety is essential. Never touch exposed conductors, open live equipment or perform electrical repairs without suitable training and isolation procedures.",
      "LESSON FOCUS — Forces and energy. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Forces can change an object’s speed or direction. Energy can be transferred or transformed; the account should identify the system and relevant inputs and outputs.",
      "FOLLOW THE METHOD — 1) Draw the situation and identify relevant quantities. 2) Write known values with units and convert if needed. 3) Choose a formula that fits the situation. 4) Substitute values and calculate with units. 5) Check magnitude, direction and assumptions.",
      "WORKED EXAMPLE — A raised book has gravitational potential energy relative to the floor; when dropped, energy is transferred into motion, sound and heating.",
      "PRACTICE TASK — Choose a safe everyday movement and draw a force diagram or energy-transfer chain.",
      "COMMON MISTAKES TO AVOID — mixing metres and kilometres; confusing speed and velocity; using a formula outside its conditions; experimenting with mains electricity. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Check units, estimate the answer and compare repeat measurements. Electrical demonstrations require approved low-voltage equipment and supervision. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "physics-fundamentals-lesson-6",
  "title": "Waves, Light and Practical Safety",
  "minutes": 16,
  "content": [
      "Waves transfer energy without requiring the bulk movement of matter from one place to another. Examples include sound and electromagnetic waves.",
      "Frequency is the number of complete wave cycles per second and is measured in hertz. Wavelength is the distance between corresponding points on consecutive waves.",
      "Sound requires a medium to travel through, while electromagnetic waves can travel through a vacuum.",
      "Light can be reflected and refracted. Reflection changes the direction of light at a surface; refraction occurs when light changes speed between materials.",
      "During practical activities, use equipment only as instructed, keep work areas clear and report damaged instruments. Never look directly at intense light sources.",
      "LESSON FOCUS — Electricity and safe models. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Simple circuit models identify a source, conducting path and load. Current requires a complete path, but real electrical work can be hazardous and must use only approved training equipment and supervision.",
      "FOLLOW THE METHOD — 1) Draw the situation and identify relevant quantities. 2) Write known values with units and convert if needed. 3) Choose a formula that fits the situation. 4) Substitute values and calculate with units. 5) Check magnitude, direction and assumptions.",
      "WORKED EXAMPLE — In a low-voltage learning circuit, opening the switch breaks the path and the lamp goes out.",
      "PRACTICE TASK — Label a circuit diagram and identify what changes when the switch opens. Do not work with mains electricity.",
      "COMMON MISTAKES TO AVOID — mixing metres and kilometres; confusing speed and velocity; using a formula outside its conditions; experimenting with mains electricity. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Check units, estimate the answer and compare repeat measurements. Electrical demonstrations require approved low-voltage equipment and supervision. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "physics-fundamentals-question-1",
        prompt: "What is a useful first step when learning Physics Fundamentals?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "physics-fundamentals-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "physics-fundamentals-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "physics-fundamentals-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "physics-fundamentals-q5",
  "prompt": "How is average speed calculated?",
  "options": [
    "Distance divided by time",
    "Time divided by distance",
    "Mass multiplied by volume",
    "Force divided by temperature"
  ],
  "answerIndex": 0,
  "explanation": "Average speed equals the total distance travelled divided by the time taken."
},
{
  "id": "physics-fundamentals-q6",
  "prompt": "What can an unbalanced net force do to an object?",
  "options": [
    "Cause its velocity to change",
    "Guarantee that it stops immediately",
    "Remove its mass",
    "Prevent all motion in every case"
  ],
  "answerIndex": 0,
  "explanation": "A non-zero net force causes acceleration, which changes velocity."
},
{
  "id": "physics-fundamentals-q7",
  "prompt": "Which statement describes energy conservation?",
  "options": [
    "Energy is transferred or transformed, not created or destroyed in a closed system",
    "Energy always disappears",
    "Every energy transfer is perfectly efficient",
    "Only moving objects contain energy"
  ],
  "answerIndex": 0,
  "explanation": "Energy conservation states that total energy remains constant in a closed system."
},
{
  "id": "physics-fundamentals-q8",
  "prompt": "What is required for a simple circuit to carry sustained current?",
  "options": [
    "A complete conducting path and a source of potential difference",
    "A permanently broken wire",
    "An open switch in every circuit",
    "Only an insulating material"
  ],
  "answerIndex": 0,
  "explanation": "A complete conducting path and an electrical source are needed in a simple circuit."
},
{
  "id": "physics-fundamentals-q9",
  "prompt": "What is frequency measured in?",
  "options": [
    "Hertz",
    "Kilograms",
    "Litres",
    "Degrees Celsius"
  ],
  "answerIndex": 0,
  "explanation": "Frequency is measured in hertz, or cycles per second."
},
{
  "id": "physics-fundamentals-q10",
  "prompt": "Which is the safest response to damaged electrical equipment?",
  "options": [
    "Stop using it and report it to a qualified person",
    "Touch the exposed wire to test it",
    "Repair it while it is live",
    "Cover the damage with paper and continue"
  ],
  "answerIndex": 0,
  "explanation": "Damaged equipment should be taken out of use and assessed by a qualified person."
}
],
  },
    {
    id: "business-studies-accounting-basics",
    title: "Business Studies & Accounting Basics",
    category: "Business",
    level: "Foundation",
    description: "Understand business operations, transactions, budgets, and basic bookkeeping.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "business-studies-accounting-basics-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nUnderstand business operations, transactions, budgets, and basic bookkeeping.\n\nLearning objectives\n\n- Identify the main ideas in Business Studies & Accounting Basics.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Business Studies & Accounting Basics, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Accounting records transactions so that people can understand performance and financial position. Every entry needs a date, amount, description and supporting evidence. Profit is measured over a period; assets and liabilities describe a position at a point in time. Reconciliation helps catch errors.",
            "KEY WORDS — transaction — event recorded in accounts; asset — resource controlled by an entity; liability — obligation owed; revenue — income from ordinary activities; expense — cost incurred. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Collect a receipt, invoice or other source document. 2) Identify the accounts and period affected. 3) Record the event consistently. 4) Total the relevant accounts and reconcile them. 5) Investigate differences instead of forcing records to match.",
            "WORKED EXAMPLE — Buying supplies for cash increases the relevant supplies or expense account and decreases cash. The receipt provides evidence of date and amount.",
            "GUIDED PRACTICE — Use five fictional transactions to create a cashbook with date, description, money in, money out and balance. Reconcile the ending balance.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Match entries to documents, verify the accounting method and reconcile totals with the cashbook or statement.",
            "COMMON MISTAKES — recording a loan as sales revenue; entering a transaction twice; mixing personal and business transactions without classification; altering a record to hide a difference. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "business-studies-accounting-basics-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Business Studies & Accounting Basics can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Collect a receipt, invoice or other source document. 2) Identify the accounts and period affected. 3) Record the event consistently. 4) Total the relevant accounts and reconcile them. 5) Investigate differences instead of forcing records to match.",
            "WATCH A MODEL — Buying supplies for cash increases the relevant supplies or expense account and decreases cash. The receipt provides evidence of date and amount.",
            "TRY IT YOURSELF — Use five fictional transactions to create a cashbook with date, description, money in, money out and balance. Reconcile the ending balance. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Match entries to documents, verify the accounting method and reconcile totals with the cashbook or statement.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "business-studies-accounting-basics-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Business Studies & Accounting Basics.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Business Studies & Accounting Basics in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: transaction — event recorded in accounts; asset — resource controlled by an entity; liability — obligation owed; revenue — income from ordinary activities; expense — cost incurred. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Use five fictional transactions to create a cashbook with date, description, money in, money out and balance. Reconcile the ending balance.",
            "EXPLAIN YOUR REASONING — Buying supplies for cash increases the relevant supplies or expense account and decreases cash. The receipt provides evidence of date and amount. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Match entries to documents, verify the accounting method and reconcile totals with the cashbook or statement.",
            "ERROR SPOTTING — Look for these common mistakes: recording a loan as sales revenue; entering a transaction twice; mixing personal and business transactions without classification; altering a record to hide a difference. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Label which source document would support five fictional transactions."
          ],
      }
    ,
{
  "id": "business-studies-accounting-basics-lesson-4",
  "title": "Business Types, Customers and Operations",
  "minutes": 16,
  "content": [
      "A business provides goods or services to meet customer needs. It may operate as a sole proprietorship, partnership, company or another legally recognized form.",
      "Business owners should understand their legal obligations, registration requirements, licences and tax responsibilities.",
      "A value proposition explains the benefit a business offers its customers and why they might choose it over alternatives.",
      "Core activities include purchasing, production or service delivery, marketing, sales, customer support and record keeping.",
      "Ethical businesses communicate honestly, respect customers, protect personal information and avoid misleading claims.",
      "LESSON FOCUS — Transactions and source documents. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Source documents—receipts, invoices and approved payment records—provide evidence for entries. Match each entry to an actual event and avoid duplicates.",
      "FOLLOW THE METHOD — 1) Collect a receipt, invoice or other source document. 2) Identify the accounts and period affected. 3) Record the event consistently. 4) Total the relevant accounts and reconcile them. 5) Investigate differences instead of forcing records to match.",
      "WORKED EXAMPLE — A purchase invoice is evidence of a supplier charge, while a payment confirmation records that money left the account.",
      "PRACTICE TASK — Label which source document would support five fictional transactions.",
      "COMMON MISTAKES TO AVOID — recording a loan as sales revenue; entering a transaction twice; mixing personal and business transactions without classification; altering a record to hide a difference. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Match entries to documents, verify the accounting method and reconcile totals with the cashbook or statement. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "business-studies-accounting-basics-lesson-5",
  "title": "Source Documents and Basic Accounting",
  "minutes": 18,
  "content": [
      "Accounting records summarize financial transactions and help owners understand business performance and financial position.",
      "Source documents provide evidence of transactions. Examples include receipts, invoices, purchase orders, payment confirmations and bank statements.",
      "Record each transaction promptly with its date, description, amount and supporting document. Keep personal and business transactions separate.",
      "In double-entry accounting, each transaction affects at least two accounts, with total debits equal to total credits. The appropriate accounts depend on the transaction.",
      "Reconcile records against bank statements regularly and correct discrepancies using a documented process rather than deleting evidence.",
      "LESSON FOCUS — Cashbook and financial statements. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A cashbook records cash received and paid. Income and expense summaries measure activity during a period; a statement of financial position lists assets, liabilities and equity at a date.",
      "FOLLOW THE METHOD — 1) Collect a receipt, invoice or other source document. 2) Identify the accounts and period affected. 3) Record the event consistently. 4) Total the relevant accounts and reconcile them. 5) Investigate differences instead of forcing records to match.",
      "WORKED EXAMPLE — A business can report a sale on credit while the customer still owes the money. Profit and cash balance may therefore differ.",
      "PRACTICE TASK — Classify fictional items as income, expense, asset, liability or cash movement.",
      "COMMON MISTAKES TO AVOID — recording a loan as sales revenue; entering a transaction twice; mixing personal and business transactions without classification; altering a record to hide a difference. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Match entries to documents, verify the accounting method and reconcile totals with the cashbook or statement. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "business-studies-accounting-basics-lesson-6",
  "title": "Budgets, Cash Flow and Business Ethics",
  "minutes": 17,
  "content": [
      "A budget estimates expected income and spending over a period. Comparing actual results with the budget helps identify differences and improve planning.",
      "Cash flow tracks money entering and leaving the business. A business may report a profit but still face cash shortages if customers pay late or bills fall due earlier.",
      "Revenue is income earned from selling goods or services. Profit is what remains after relevant expenses are deducted from revenue.",
      "Plan for operating costs, taxes, supplier payments, savings and unexpected expenses. Review prices and costs using reliable records.",
      "Protect financial information, obtain approval for payments, maintain accurate records and disclose conflicts of interest. Follow applicable accounting and tax requirements.",
      "LESSON FOCUS — Accuracy and reconciliation. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Reconciliation compares an internal record with an independent record. Differences may come from timing, errors, fees or missing transactions and should be explained with evidence.",
      "FOLLOW THE METHOD — 1) Collect a receipt, invoice or other source document. 2) Identify the accounts and period affected. 3) Record the event consistently. 4) Total the relevant accounts and reconcile them. 5) Investigate differences instead of forcing records to match.",
      "WORKED EXAMPLE — A statement includes a bank fee missing from the cashbook. Record the fee with its date and supporting statement instead of changing an unrelated figure.",
      "PRACTICE TASK — Compare a small fictional cashbook with a statement and identify each unmatched item.",
      "COMMON MISTAKES TO AVOID — recording a loan as sales revenue; entering a transaction twice; mixing personal and business transactions without classification; altering a record to hide a difference. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Match entries to documents, verify the accounting method and reconcile totals with the cashbook or statement. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "business-studies-accounting-basics-question-1",
        prompt: "What is a useful first step when learning Business Studies & Accounting Basics?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "business-studies-accounting-basics-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "business-studies-accounting-basics-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "business-studies-accounting-basics-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "business-studies-accounting-basics-q5",
  "prompt": "What is a value proposition?",
  "options": [
    "A clear explanation of the value offered to customers",
    "A list of personal hobbies",
    "A bank account password",
    "A record of staff holidays only"
  ],
  "answerIndex": 0,
  "explanation": "A value proposition explains the benefit customers receive and what makes an offer useful."
},
{
  "id": "business-studies-accounting-basics-q6",
  "prompt": "Which is an example of a source document?",
  "options": [
    "A supplier invoice",
    "An unsupported guess",
    "A verbal rumour",
    "An unlabelled calculation with no records"
  ],
  "answerIndex": 0,
  "explanation": "An invoice provides evidence of a transaction and supports accounting records."
},
{
  "id": "business-studies-accounting-basics-q7",
  "prompt": "What is the basic rule of double-entry accounting?",
  "options": [
    "Total debits equal total credits",
    "Every transaction has only one entry",
    "Income is never recorded",
    "Expenses must always equal revenue"
  ],
  "answerIndex": 0,
  "explanation": "Double-entry accounting records corresponding effects so total debits equal total credits."
},
{
  "id": "business-studies-accounting-basics-q8",
  "prompt": "What does a cash-flow record help a business monitor?",
  "options": [
    "Money coming in and going out",
    "Only the number of employees",
    "Customer birthdays only",
    "The colour of products"
  ],
  "answerIndex": 0,
  "explanation": "Cash flow tracks cash inflows and outflows over time."
},
{
  "id": "business-studies-accounting-basics-q9",
  "prompt": "How is profit generally calculated?",
  "options": [
    "Revenue minus expenses",
    "Expenses plus personal savings",
    "Cash balance multiplied by staff numbers",
    "Revenue plus all unpaid bills"
  ],
  "answerIndex": 0,
  "explanation": "Profit is generally revenue remaining after relevant expenses are deducted."
},
{
  "id": "business-studies-accounting-basics-q10",
  "prompt": "Why should business and personal transactions be kept separate?",
  "options": [
    "To improve accurate records and accountability",
    "To avoid keeping any records",
    "To make reconciliation impossible",
    "To conceal all business expenses"
  ],
  "answerIndex": 0,
  "explanation": "Separate records make it easier to monitor business performance and support compliance."
}
],
  },
    {
    id: "agriculture-agribusiness",
    title: "Agriculture & Agribusiness",
    category: "Agriculture",
    level: "Foundation",
    description: "Explore farming practices, farm planning, markets, and agricultural enterprise.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "agriculture-agribusiness-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nExplore farming practices, farm planning, markets, and agricultural enterprise.\n\nLearning objectives\n\n- Identify the main ideas in Agriculture & Agribusiness.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Agriculture & Agribusiness, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Agriculture combines biological processes with decisions about land, inputs, timing, labour and markets. Soil, water, weather, pest pressure and safe handling influence production. Agribusiness also records costs, quality, yield and price so that a good harvest is not mistaken automatically for a profitable enterprise.",
            "KEY WORDS — soil fertility — soil’s ability to supply plant nutrients; germination — a seed beginning to grow; yield — harvest amount per defined area or unit; biosecurity — practices limiting pests and disease; gross margin — sales less specified direct costs. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Identify crop or livestock and its needs. 2) Check local conditions, soil, water and feed requirements. 3) Plan timing, approved inputs, labour and monitoring. 4) Record growth, costs, losses and output. 5) Compare yield, quality, costs and market price.",
            "WORKED EXAMPLE — Two plots may have different yields because of seed, spacing, soil, water or pests. Compare measurements by area and record inputs instead of comparing only total bags harvested.",
            "GUIDED PRACTICE — Prepare a fictional crop calendar and cost table. Include planting, observations, input costs and expected yield, clearly labelling estimates.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Record units and dates, follow product labels and local extension guidance, and calculate yield per comparable area.",
            "COMMON MISTAKES — using unlabelled chemicals; ignoring storage and transport losses; comparing unequal plot sizes; buying inputs without checking suitability. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "agriculture-agribusiness-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Agriculture & Agribusiness can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Identify crop or livestock and its needs. 2) Check local conditions, soil, water and feed requirements. 3) Plan timing, approved inputs, labour and monitoring. 4) Record growth, costs, losses and output. 5) Compare yield, quality, costs and market price.",
            "WATCH A MODEL — Two plots may have different yields because of seed, spacing, soil, water or pests. Compare measurements by area and record inputs instead of comparing only total bags harvested.",
            "TRY IT YOURSELF — Prepare a fictional crop calendar and cost table. Include planting, observations, input costs and expected yield, clearly labelling estimates. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Record units and dates, follow product labels and local extension guidance, and calculate yield per comparable area.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "agriculture-agribusiness-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Agriculture & Agribusiness.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Agriculture & Agribusiness in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: soil fertility — soil’s ability to supply plant nutrients; germination — a seed beginning to grow; yield — harvest amount per defined area or unit; biosecurity — practices limiting pests and disease; gross margin — sales less specified direct costs. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Prepare a fictional crop calendar and cost table. Include planting, observations, input costs and expected yield, clearly labelling estimates.",
            "EXPLAIN YOUR REASONING — Two plots may have different yields because of seed, spacing, soil, water or pests. Compare measurements by area and record inputs instead of comparing only total bags harvested. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Record units and dates, follow product labels and local extension guidance, and calculate yield per comparable area.",
            "ERROR SPOTTING — Look for these common mistakes: using unlabelled chemicals; ignoring storage and transport losses; comparing unequal plot sizes; buying inputs without checking suitability. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — List the conditions a fictional crop needs and explain how each could be observed safely."
          ],
      }
    ,
{
  "id": "agriculture-agribusiness-lesson-4",
  "title": "Soil Health, Crops and Farm Planning",
  "minutes": 18,
  "content": [
      "Agriculture includes crop production, livestock management and related activities that supply food and raw materials. Farm decisions depend on climate, soil, water and available resources.",
      "Healthy soil provides nutrients, water and support for plant roots. Soil texture, drainage, organic matter and pH influence crop growth.",
      "Soil conservation practices include mulching, appropriate crop rotation, ground cover and erosion control suited to local conditions.",
      "Choose crops according to local growing conditions, market demand, seed quality and the resources available. Plan planting, weeding, irrigation and harvesting activities.",
      "Monitor crop health and seek locally appropriate agricultural advice when identifying pests, diseases or nutrient problems.",
      "LESSON FOCUS — Soil, seed and growing conditions. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Plant growth depends on seed quality, moisture, light, nutrients, temperature and pests. The right intervention depends on the crop and local conditions; observe and seek reliable local advice.",
      "FOLLOW THE METHOD — 1) Identify crop or livestock and its needs. 2) Check local conditions, soil, water and feed requirements. 3) Plan timing, approved inputs, labour and monitoring. 4) Record growth, costs, losses and output. 5) Compare yield, quality, costs and market price.",
      "WORKED EXAMPLE — Poor germination may result from seed quality, depth, moisture or temperature, so examine conditions before blaming one factor.",
      "PRACTICE TASK — List the conditions a fictional crop needs and explain how each could be observed safely.",
      "COMMON MISTAKES TO AVOID — using unlabelled chemicals; ignoring storage and transport losses; comparing unequal plot sizes; buying inputs without checking suitability. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Record units and dates, follow product labels and local extension guidance, and calculate yield per comparable area. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "agriculture-agribusiness-lesson-5",
  "title": "Livestock Care and Farm Biosecurity",
  "minutes": 17,
  "content": [
      "Responsible livestock production provides suitable feed, clean water, shelter, space and routine observation for animal health.",
      "A feeding plan should reflect the species, age, production stage and nutritional needs of the animals. Sudden feed changes may cause problems.",
      "Biosecurity reduces the risk of introducing or spreading disease. Measures include clean equipment, controlled animal movement and appropriate isolation of sick animals.",
      "Keep records of animal identification, breeding, feed, treatments, mortality and sales. Use veterinary guidance for diagnosis, vaccinations and medication.",
      "Follow animal-welfare standards and applicable public-health rules. Observe medicine withdrawal periods and never sell products that are unsafe for consumption.",
      "LESSON FOCUS — Farm planning and biosecurity. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A production plan records timing, inputs, labour and expected risks. Biosecurity reduces the movement of pests and disease through clean tools, careful sourcing and approved management practices.",
      "FOLLOW THE METHOD — 1) Identify crop or livestock and its needs. 2) Check local conditions, soil, water and feed requirements. 3) Plan timing, approved inputs, labour and monitoring. 4) Record growth, costs, losses and output. 5) Compare yield, quality, costs and market price.",
      "WORKED EXAMPLE — Separating new livestock from existing animals according to qualified local guidance can reduce disease introduction risk.",
      "PRACTICE TASK — Create a simple farm calendar with three checkpoints and one safe biosecurity action.",
      "COMMON MISTAKES TO AVOID — using unlabelled chemicals; ignoring storage and transport losses; comparing unequal plot sizes; buying inputs without checking suitability. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Record units and dates, follow product labels and local extension guidance, and calculate yield per comparable area. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "agriculture-agribusiness-lesson-6",
  "title": "Agribusiness Costs, Markets and Sustainability",
  "minutes": 18,
  "content": [
      "Agribusiness connects farm production with inputs, processing, storage, transport, marketing and customers. Value can be added through grading, packaging or processing where appropriate.",
      "Calculate production costs such as seeds, feed, labour, water, transport, packaging and equipment maintenance before setting prices.",
      "A simple farm budget compares expected income with expected costs. Cash-flow planning helps cover expenses between planting and selling or between livestock production cycles.",
      "Research market prices, quality requirements, seasonal demand and potential buyers before committing to a production plan. Consider storage losses and transport costs.",
      "Sustainable practices conserve soil and water, reduce avoidable waste and use inputs responsibly. Track results and adapt plans using records and local expertise.",
      "LESSON FOCUS — Agribusiness costs and markets. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Profitability depends on grade, quantity, price, costs, spoilage, transport and payment timing. A harvest estimate is uncertain and should be compared with actual records.",
      "FOLLOW THE METHOD — 1) Identify crop or livestock and its needs. 2) Check local conditions, soil, water and feed requirements. 3) Plan timing, approved inputs, labour and monitoring. 4) Record growth, costs, losses and output. 5) Compare yield, quality, costs and market price.",
      "WORKED EXAMPLE — Selling 50 kg at KES 80/kg yields KES 4,000 before transport, packaging, losses and other costs.",
      "PRACTICE TASK — Build a fictional produce sales table showing quantity, price, gross sales and at least three costs.",
      "COMMON MISTAKES TO AVOID — using unlabelled chemicals; ignoring storage and transport losses; comparing unequal plot sizes; buying inputs without checking suitability. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Record units and dates, follow product labels and local extension guidance, and calculate yield per comparable area. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "agriculture-agribusiness-question-1",
        prompt: "What is a useful first step when learning Agriculture & Agribusiness?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "agriculture-agribusiness-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "agriculture-agribusiness-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "agriculture-agribusiness-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "agriculture-agribusiness-q5",
  "prompt": "Which factor is important when selecting a crop?",
  "options": [
    "Local growing conditions and market demand",
    "The colour of the farmer's notebook",
    "Ignoring soil and rainfall",
    "Choosing without checking seed quality"
  ],
  "answerIndex": 0,
  "explanation": "Crop selection should reflect local conditions, resources and likely demand."
},
{
  "id": "agriculture-agribusiness-q6",
  "prompt": "Which practice can help reduce soil erosion?",
  "options": [
    "Maintaining ground cover and using suitable conservation practices",
    "Removing all vegetation from slopes",
    "Leaving soil bare during heavy rain",
    "Allowing runoff to cut channels"
  ],
  "answerIndex": 0,
  "explanation": "Ground cover and appropriate conservation practices help protect soil from erosion."
},
{
  "id": "agriculture-agribusiness-q7",
  "prompt": "What is a key purpose of farm biosecurity?",
  "options": [
    "Reduce the introduction and spread of disease",
    "Eliminate the need for clean water",
    "Replace all veterinary advice",
    "Increase uncontrolled animal movement"
  ],
  "answerIndex": 0,
  "explanation": "Biosecurity uses practical measures to reduce disease risks on farms."
},
{
  "id": "agriculture-agribusiness-q8",
  "prompt": "Why should livestock treatment records be maintained?",
  "options": [
    "To track care, treatments and relevant withdrawal periods",
    "To avoid identifying animals",
    "To replace all feeding records with guesses",
    "To make animal health harder to monitor"
  ],
  "answerIndex": 0,
  "explanation": "Accurate records support animal health management and food-safety compliance."
},
{
  "id": "agriculture-agribusiness-q9",
  "prompt": "Which item should be included when calculating farm production costs?",
  "options": [
    "Feed, labour and transport",
    "Only the farmer's favourite crop",
    "Unrelated household purchases",
    "Unverified future profits only"
  ],
  "answerIndex": 0,
  "explanation": "Feed, labour, transport and other production expenses help determine total costs."
},
{
  "id": "agriculture-agribusiness-q10",
  "prompt": "What is one benefit of researching buyers before production?",
  "options": [
    "It helps assess demand, quality requirements and likely prices",
    "It guarantees profit in every season",
    "It removes all weather risks",
    "It makes financial records unnecessary"
  ],
  "answerIndex": 0,
  "explanation": "Market research helps producers plan for demand, buyer requirements and costs."
}
],
  },
    {
    id: "electrical-technical-skills-awareness",
    title: "Electrical & Technical Skills Awareness",
    category: "Technical Skills",
    level: "Foundation",
    description: "Learn basic electrical concepts, tool awareness, and essential safety principles.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "electrical-technical-skills-awareness-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nLearn basic electrical concepts, tool awareness, and essential safety principles.\n\nLearning objectives\n\n- Identify the main ideas in Electrical & Technical Skills Awareness.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Electrical & Technical Skills Awareness, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Electricity can cause severe injury and fire. Awareness training should help learners recognise hazards, understand basic terms and know when to stop and contact a qualified person. Use only approved isolated low-voltage training equipment under suitable supervision; never test, open or repair live mains equipment as a learner task.",
            "KEY WORDS — voltage — electrical potential difference; current — rate of charge flow; resistance — opposition to current; insulation — material limiting unwanted current flow; isolation — approved disconnection from an energy source. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Recognise damaged cables, exposed parts, sparks, heat or wet conditions. 2) Do not touch suspect equipment or attempt a repair. 3) Keep others away and alert a responsible qualified person. 4) Only trained and authorised people isolate and test equipment. 5) Record the hazard and follow the site reporting process.",
            "WORKED EXAMPLE — If a cable is damaged, stop using the device, keep others away and report it. Tape or an improvised repair is not a safe substitute for qualified inspection.",
            "GUIDED PRACTICE — Use a picture-only hazard worksheet to identify risks and write a safe response. Do not handle real mains equipment for this exercise.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Compare your response with approved guidance. Practical electrical work requires appropriate training, protective equipment and qualified supervision.",
            "COMMON MISTAKES — assuming switch-off means safe isolation; touching exposed conductors; using damaged leads; attempting repairs without authorisation. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "electrical-technical-skills-awareness-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Electrical & Technical Skills Awareness can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Recognise damaged cables, exposed parts, sparks, heat or wet conditions. 2) Do not touch suspect equipment or attempt a repair. 3) Keep others away and alert a responsible qualified person. 4) Only trained and authorised people isolate and test equipment. 5) Record the hazard and follow the site reporting process.",
            "WATCH A MODEL — If a cable is damaged, stop using the device, keep others away and report it. Tape or an improvised repair is not a safe substitute for qualified inspection.",
            "TRY IT YOURSELF — Use a picture-only hazard worksheet to identify risks and write a safe response. Do not handle real mains equipment for this exercise. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Compare your response with approved guidance. Practical electrical work requires appropriate training, protective equipment and qualified supervision.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "electrical-technical-skills-awareness-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Electrical & Technical Skills Awareness.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Electrical & Technical Skills Awareness in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: voltage — electrical potential difference; current — rate of charge flow; resistance — opposition to current; insulation — material limiting unwanted current flow; isolation — approved disconnection from an energy source. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Use a picture-only hazard worksheet to identify risks and write a safe response. Do not handle real mains equipment for this exercise.",
            "EXPLAIN YOUR REASONING — If a cable is damaged, stop using the device, keep others away and report it. Tape or an improvised repair is not a safe substitute for qualified inspection. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Compare your response with approved guidance. Practical electrical work requires appropriate training, protective equipment and qualified supervision.",
            "ERROR SPOTTING — Look for these common mistakes: assuming switch-off means safe isolation; touching exposed conductors; using damaged leads; attempting repairs without authorisation. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Rank fictional hazard pictures by urgency and state the safe first action."
          ],
      }
    ,
{
  "id": "electrical-technical-skills-awareness-lesson-4",
  "title": "Electrical Principles and Circuit Awareness",
  "minutes": 18,
  "content": [
      "Electrical systems use voltage, current and resistance. Voltage is electrical potential difference, current is the flow of electric charge, and resistance opposes current.",
      "In a simple circuit, a source, conductors and a load form a complete path. A switch controls whether the path is open or closed.",
      "Conductors such as copper allow current to flow readily. Insulators such as suitable plastics help prevent unwanted current flow when correctly rated and undamaged.",
      "Electrical devices must be used within their rated voltage, current and power limits. Overloading can cause overheating, equipment damage or fire.",
      "This lesson is for awareness, not authorization to work on electrical installations. Installation, testing and repairs must be carried out by appropriately qualified people.",
      "LESSON FOCUS — Recognising electrical hazards. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Look for damaged insulation, exposed conductors, unusual heat, burning smells, sparks or equipment near water. Do not touch the hazard or attempt to investigate it while energised.",
      "FOLLOW THE METHOD — 1) Recognise damaged cables, exposed parts, sparks, heat or wet conditions. 2) Do not touch suspect equipment or attempt a repair. 3) Keep others away and alert a responsible qualified person. 4) Only trained and authorised people isolate and test equipment. 5) Record the hazard and follow the site reporting process.",
      "WORKED EXAMPLE — A frayed extension lead should be taken out of use through the approved process and reported, not covered with improvised tape.",
      "PRACTICE TASK — Rank fictional hazard pictures by urgency and state the safe first action.",
      "COMMON MISTAKES TO AVOID — assuming switch-off means safe isolation; touching exposed conductors; using damaged leads; attempting repairs without authorisation. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Compare your response with approved guidance. Practical electrical work requires appropriate training, protective equipment and qualified supervision. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "electrical-technical-skills-awareness-lesson-5",
  "title": "Tools, Hazards and Safe Work Practices",
  "minutes": 18,
  "content": [
      "Common technical tools include measuring tapes, rulers, insulated hand tools and purpose-built testing instruments. Use each tool only for its intended task.",
      "Inspect tools before use. Do not use damaged insulation, cracked handles, exposed conductors or instruments with uncertain ratings.",
      "Electrical hazards include electric shock, burns, arc flash and fire. Wet conditions, damaged cables and unsuitable equipment can increase risk.",
      "Only trained and authorized people should isolate, verify and work on electrical systems using approved procedures and suitable protective equipment. Never assume a circuit is safe merely because a switch is off.",
      "Keep work areas dry and orderly, follow warning labels, report hazards and stop work when conditions are unsafe. Do not touch a person in contact with a live electrical source; call emergency services and follow trained emergency guidance.",
      "LESSON FOCUS — Basic circuit concepts. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A simple circuit includes a source, a conductive path and a load. Voltage, current and resistance describe different properties; they should be learned using diagrams and approved low-voltage equipment.",
      "FOLLOW THE METHOD — 1) Recognise damaged cables, exposed parts, sparks, heat or wet conditions. 2) Do not touch suspect equipment or attempt a repair. 3) Keep others away and alert a responsible qualified person. 4) Only trained and authorised people isolate and test equipment. 5) Record the hazard and follow the site reporting process.",
      "WORKED EXAMPLE — If a low-voltage training switch opens, the path is broken and the lamp goes out.",
      "PRACTICE TASK — Label a simulated circuit with source, path, switch and load; explain what an open switch means.",
      "COMMON MISTAKES TO AVOID — assuming switch-off means safe isolation; touching exposed conductors; using damaged leads; attempting repairs without authorisation. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Compare your response with approved guidance. Practical electrical work requires appropriate training, protective equipment and qualified supervision. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "electrical-technical-skills-awareness-lesson-6",
  "title": "Technical Drawings, Measurement and Maintenance",
  "minutes": 17,
  "content": [
      "Technical drawings communicate the shape, size, layout and arrangement of components. Symbols, labels, dimensions and legends help readers interpret a drawing.",
      "Use the correct measuring instrument for the task. Read scales carefully, include units and check measurements when accuracy matters.",
      "A planned maintenance schedule helps identify wear, damage and performance problems before they cause failures.",
      "Record equipment identification, inspection dates, observations and actions taken. Clear records help technicians understand the equipment's history.",
      "Do not open, adjust or repair electrical equipment unless qualified and authorized. Refer uncertain drawings, test results or faults to a competent technician.",
      "LESSON FOCUS — Safe reporting and qualified work. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Electrical work must follow applicable standards and approved isolation and verification procedures. Learners should know their limits and refer practical work to authorised people.",
      "FOLLOW THE METHOD — 1) Recognise damaged cables, exposed parts, sparks, heat or wet conditions. 2) Do not touch suspect equipment or attempt a repair. 3) Keep others away and alert a responsible qualified person. 4) Only trained and authorised people isolate and test equipment. 5) Record the hazard and follow the site reporting process.",
      "WORKED EXAMPLE — A worker who notices repeated breaker trips reports the pattern and affected equipment instead of repeatedly resetting the breaker without investigation.",
      "PRACTICE TASK — Write a hazard report with location, observed signs, immediate safe action and the person to notify.",
      "COMMON MISTAKES TO AVOID — assuming switch-off means safe isolation; touching exposed conductors; using damaged leads; attempting repairs without authorisation. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Compare your response with approved guidance. Practical electrical work requires appropriate training, protective equipment and qualified supervision. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "electrical-technical-skills-awareness-question-1",
        prompt: "What is a useful first step when learning Electrical & Technical Skills Awareness?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "electrical-technical-skills-awareness-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "electrical-technical-skills-awareness-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "electrical-technical-skills-awareness-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "electrical-technical-skills-awareness-q5",
  "prompt": "What does voltage describe in a circuit?",
  "options": [
    "Electrical potential difference",
    "The physical length of a cable",
    "The weight of a tool",
    "The temperature of every component"
  ],
  "answerIndex": 0,
  "explanation": "Voltage is the electrical potential difference between two points."
},
{
  "id": "electrical-technical-skills-awareness-q6",
  "prompt": "What is the role of a switch in a simple circuit?",
  "options": [
    "Open or close the conducting path",
    "Create unlimited energy",
    "Replace all insulation",
    "Measure cable length"
  ],
  "answerIndex": 0,
  "explanation": "A switch controls continuity by opening or closing the circuit path."
},
{
  "id": "electrical-technical-skills-awareness-q7",
  "prompt": "What should you do if a tool has damaged electrical insulation?",
  "options": [
    "Stop using it and report it for proper assessment",
    "Continue using it with wet hands",
    "Hide the damage",
    "Test it by touching exposed parts"
  ],
  "answerIndex": 0,
  "explanation": "Damaged insulation can expose users to serious electrical hazards."
},
{
  "id": "electrical-technical-skills-awareness-q8",
  "prompt": "Who should perform electrical installation or repair work?",
  "options": [
    "An appropriately qualified and authorized person",
    "Anyone who has seen a video",
    "An untrained person working on a live circuit",
    "A person chosen at random"
  ],
  "answerIndex": 0,
  "explanation": "Electrical installation and repair require appropriate competence and authorization."
},
{
  "id": "electrical-technical-skills-awareness-q9",
  "prompt": "Why are technical drawings useful?",
  "options": [
    "They communicate component layouts, dimensions and symbols",
    "They remove the need for measurements",
    "They guarantee equipment cannot fail",
    "They replace every safety procedure"
  ],
  "answerIndex": 0,
  "explanation": "Technical drawings communicate how components are arranged and specified."
},
{
  "id": "electrical-technical-skills-awareness-q10",
  "prompt": "What should maintenance records include?",
  "options": [
    "Inspection dates, observations and actions taken",
    "Only the technician's favourite tool",
    "Passwords written in public",
    "Unverified claims with no dates"
  ],
  "answerIndex": 0,
  "explanation": "Clear maintenance records help track equipment condition and repair history."
}
],
  },
    {
    id: "project-management-fundamentals",
    title: "Project Management Fundamentals",
    category: "Business",
    level: "Foundation",
    description: "Learn project planning, task scheduling, budgeting, teamwork, and monitoring.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "project-management-fundamentals-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nLearn project planning, task scheduling, budgeting, teamwork, and monitoring.\n\nLearning objectives\n\n- Identify the main ideas in Project Management Fundamentals.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Project Management Fundamentals, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Project management organises temporary work to deliver an agreed result within scope, time, cost and quality. Tasks depend on each other, and a realistic schedule reflects capacity. Progress reporting should identify risks and decisions needed, not simply say everything is on track.",
            "KEY WORDS — scope — agreed work and boundaries; deliverable — a verifiable output; milestone — significant checkpoint; dependency — task or condition another task relies on; risk — uncertain event that may affect objectives. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Define the outcome and acceptance criteria. 2) Break work into tasks, owners and estimates. 3) Map dependencies and set milestones. 4) Track progress, decisions, changes and risks. 5) Check deliverables against acceptance criteria.",
            "WORKED EXAMPLE — A training event cannot be advertised with a confirmed venue until it is booked. Treat booking as a dependency and flag the risk if confirmation is delayed.",
            "GUIDED PRACTICE — Plan a small event with deliverables, owners, durations, dependencies, one milestone, one risk and evidence of completion.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Compare each deliverable with the agreed criteria, update dates with actual progress and record unresolved risks.",
            "COMMON MISTAKES — planning only the start and end dates; ignoring dependencies; expanding scope without reviewing cost or time; marking work done before checking its output. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "project-management-fundamentals-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Project Management Fundamentals can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Define the outcome and acceptance criteria. 2) Break work into tasks, owners and estimates. 3) Map dependencies and set milestones. 4) Track progress, decisions, changes and risks. 5) Check deliverables against acceptance criteria.",
            "WATCH A MODEL — A training event cannot be advertised with a confirmed venue until it is booked. Treat booking as a dependency and flag the risk if confirmation is delayed.",
            "TRY IT YOURSELF — Plan a small event with deliverables, owners, durations, dependencies, one milestone, one risk and evidence of completion. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Compare each deliverable with the agreed criteria, update dates with actual progress and record unresolved risks.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "project-management-fundamentals-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Project Management Fundamentals.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Project Management Fundamentals in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: scope — agreed work and boundaries; deliverable — a verifiable output; milestone — significant checkpoint; dependency — task or condition another task relies on; risk — uncertain event that may affect objectives. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Plan a small event with deliverables, owners, durations, dependencies, one milestone, one risk and evidence of completion.",
            "EXPLAIN YOUR REASONING — A training event cannot be advertised with a confirmed venue until it is booked. Treat booking as a dependency and flag the risk if confirmation is delayed. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Compare each deliverable with the agreed criteria, update dates with actual progress and record unresolved risks.",
            "ERROR SPOTTING — Look for these common mistakes: planning only the start and end dates; ignoring dependencies; expanding scope without reviewing cost or time; marking work done before checking its output. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Write three deliverables with clear acceptance criteria and exclusions."
          ],
      }
    ,
{
  "id": "project-management-fundamentals-lesson-4",
  "title": "Project Goals, Scope and Planning",
  "minutes": 18,
  "content": [
      "A project is a temporary effort undertaken to deliver a defined product, service or result. Projects have objectives, constraints and an intended completion point.",
      "A project objective should be clear and measurable. Define what success looks like, who benefits and how results will be assessed.",
      "Scope describes the work included in a project and helps prevent uncontrolled expansion. Record key deliverables, exclusions, assumptions and constraints.",
      "Break deliverables into manageable activities. Estimate the time, people, materials and budget needed for each activity.",
      "Consult stakeholders early, document decisions and obtain agreement on the plan before substantial work begins.",
      "LESSON FOCUS — Scope and deliverables. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Scope states what is included and excluded. Each deliverable needs an acceptance criterion so that “finished” has a shared meaning.",
      "FOLLOW THE METHOD — 1) Define the outcome and acceptance criteria. 2) Break work into tasks, owners and estimates. 3) Map dependencies and set milestones. 4) Track progress, decisions, changes and risks. 5) Check deliverables against acceptance criteria.",
      "WORKED EXAMPLE — “Prepare event materials” is vague; “approved agenda PDF and 50 printed programmes by Friday” is testable.",
      "PRACTICE TASK — Write three deliverables with clear acceptance criteria and exclusions.",
      "COMMON MISTAKES TO AVOID — planning only the start and end dates; ignoring dependencies; expanding scope without reviewing cost or time; marking work done before checking its output. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Compare each deliverable with the agreed criteria, update dates with actual progress and record unresolved risks. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "project-management-fundamentals-lesson-5",
  "title": "Schedules, Budgets and Risk Management",
  "minutes": 18,
  "content": [
      "A project schedule lists activities, their durations, dependencies and target dates. A milestone marks an important event or achievement.",
      "A budget estimates project costs, including labour, supplies, transport, services and contingency. Track actual spending against the approved budget.",
      "A risk is an uncertain event that could affect project objectives. Identify its likelihood, potential impact and practical response.",
      "Responses may include avoiding a risk, reducing its likelihood or impact, transferring part of its impact, or accepting it with a plan.",
      "Review schedules, costs and risks regularly. Escalate significant changes early and obtain appropriate approval before changing the baseline plan.",
      "LESSON FOCUS — Schedule, tasks and dependencies. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Estimate effort, note which tasks must precede others and include review time. A task on the critical path can affect the final date if it slips.",
      "FOLLOW THE METHOD — 1) Define the outcome and acceptance criteria. 2) Break work into tasks, owners and estimates. 3) Map dependencies and set milestones. 4) Track progress, decisions, changes and risks. 5) Check deliverables against acceptance criteria.",
      "WORKED EXAMPLE — Printing depends on final approval, so the schedule should not place printing before the agenda is approved.",
      "PRACTICE TASK — Draw a five-task timeline with dependencies and identify which delay could move the final date.",
      "COMMON MISTAKES TO AVOID — planning only the start and end dates; ignoring dependencies; expanding scope without reviewing cost or time; marking work done before checking its output. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Compare each deliverable with the agreed criteria, update dates with actual progress and record unresolved risks. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "project-management-fundamentals-lesson-6",
  "title": "Teamwork, Monitoring and Project Closure",
  "minutes": 17,
  "content": [
      "Assign responsibilities clearly so each team member understands expected outputs, deadlines and reporting arrangements.",
      "Use regular updates to compare completed work with the plan. Track milestones, quality, expenditure, issues and decisions.",
      "When delays occur, identify the cause, assess the effect on dependent activities and agree on a realistic corrective action.",
      "Project communication should be timely, accurate and appropriate for each audience. Record decisions, changes and actions with owners and due dates.",
      "At closure, confirm deliverables have been accepted, settle outstanding obligations, document lessons learned and store records securely.",
      "LESSON FOCUS — Risks and change control. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A risk register records likelihood, impact, owner, response and review date. When a change is requested, assess its effect on scope, time, cost and quality before accepting it.",
      "FOLLOW THE METHOD — 1) Define the outcome and acceptance criteria. 2) Break work into tasks, owners and estimates. 3) Map dependencies and set milestones. 4) Track progress, decisions, changes and risks. 5) Check deliverables against acceptance criteria.",
      "WORKED EXAMPLE — A speaker cancels: identify backup speakers, decide the owner and deadline, and communicate the change to the team.",
      "PRACTICE TASK — Create a small risk register with three risks and one response for each.",
      "COMMON MISTAKES TO AVOID — planning only the start and end dates; ignoring dependencies; expanding scope without reviewing cost or time; marking work done before checking its output. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Compare each deliverable with the agreed criteria, update dates with actual progress and record unresolved risks. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "project-management-fundamentals-question-1",
        prompt: "What is a useful first step when learning Project Management Fundamentals?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "project-management-fundamentals-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "project-management-fundamentals-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "project-management-fundamentals-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "project-management-fundamentals-q5",
  "prompt": "What does project scope define?",
  "options": [
    "The work and deliverables included in the project",
    "Only the names of project staff",
    "The weather during the project",
    "An unlimited promise to complete every possible task"
  ],
  "answerIndex": 0,
  "explanation": "Scope establishes what is included and helps manage expectations and changes."
},
{
  "id": "project-management-fundamentals-q6",
  "prompt": "What is a project milestone?",
  "options": [
    "An important event or achievement in the schedule",
    "An unrecorded expense",
    "A list of unrelated ideas",
    "A replacement for every project objective"
  ],
  "answerIndex": 0,
  "explanation": "Milestones mark significant points or achievements in a project."
},
{
  "id": "project-management-fundamentals-q7",
  "prompt": "What should a project budget contain?",
  "options": [
    "Estimated project costs and appropriate contingency",
    "Only expected profits with no expenses",
    "Personal passwords",
    "Costs unrelated to the project only"
  ],
  "answerIndex": 0,
  "explanation": "A budget estimates the resources and costs needed to deliver the project."
},
{
  "id": "project-management-fundamentals-q8",
  "prompt": "How should a project team assess a risk?",
  "options": [
    "Consider its likelihood, impact and possible responses",
    "Ignore it until the project ends",
    "Assume every risk will occur",
    "Remove it from records without review"
  ],
  "answerIndex": 0,
  "explanation": "Risk assessment considers probability, impact and suitable responses."
},
{
  "id": "project-management-fundamentals-q9",
  "prompt": "What is a useful response when a project falls behind schedule?",
  "options": [
    "Identify the cause and agree on corrective action",
    "Hide the delay from stakeholders",
    "Delete the schedule",
    "Change the deadline without consulting anyone"
  ],
  "answerIndex": 0,
  "explanation": "Understanding the cause supports a realistic recovery plan and clear communication."
},
{
  "id": "project-management-fundamentals-q10",
  "prompt": "Which activity belongs in project closure?",
  "options": [
    "Confirming acceptance and documenting lessons learned",
    "Starting work without approval",
    "Ignoring outstanding obligations",
    "Discarding all project records immediately"
  ],
  "answerIndex": 0,
  "explanation": "Closure confirms delivery, resolves outstanding matters and captures lessons."
}
],
  },
    {
    id: "data-analysis-spreadsheet-skills",
    title: "Data Analysis & Spreadsheet Skills",
    category: "Digital Skills",
    level: "Foundation",
    description: "Practise spreadsheet organisation, formulas, tables, charts, and basic analysis.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "data-analysis-spreadsheet-skills-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nPractise spreadsheet organisation, formulas, tables, charts, and basic analysis.\n\nLearning objectives\n\n- Identify the main ideas in Data Analysis & Spreadsheet Skills.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Data Analysis & Spreadsheet Skills, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — A spreadsheet stores observations in rows and variables in columns. Analysis depends on clear definitions, consistent units and checks for missing, duplicated or unusual values. Formulas make calculations traceable; charts show patterns but do not by themselves explain why those patterns occurred.",
            "KEY WORDS — observation — one recorded case; variable — characteristic measured for a case; formula — spreadsheet calculation; mean — arithmetic average; median — middle value after sorting. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Write the question and define each row, column and unit. 2) Check blanks, duplicates and inconsistent categories. 3) Use appropriate formulas and label results. 4) Recalculate a sample manually or use a known check. 5) Choose a clearly labelled chart and explain its limits.",
            "WORKED EXAMPLE — For values 10, 12, 12, 16 and 20, the sum is 70, mean is 14 and median is 12. They describe different aspects, so choose the statistic that fits the question.",
            "GUIDED PRACTICE — Create a fictional table with at least five rows. Calculate a total and average, make a labelled chart and explain one pattern and one limitation.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Inspect formula ranges, recalculate a sample by hand, label units and confirm the chart uses the intended data.",
            "COMMON MISTAKES — including header cells in formula ranges; mixing currencies or units; deleting unusual values without investigation; treating correlation as proof of cause. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "data-analysis-spreadsheet-skills-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Data Analysis & Spreadsheet Skills can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Write the question and define each row, column and unit. 2) Check blanks, duplicates and inconsistent categories. 3) Use appropriate formulas and label results. 4) Recalculate a sample manually or use a known check. 5) Choose a clearly labelled chart and explain its limits.",
            "WATCH A MODEL — For values 10, 12, 12, 16 and 20, the sum is 70, mean is 14 and median is 12. They describe different aspects, so choose the statistic that fits the question.",
            "TRY IT YOURSELF — Create a fictional table with at least five rows. Calculate a total and average, make a labelled chart and explain one pattern and one limitation. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Inspect formula ranges, recalculate a sample by hand, label units and confirm the chart uses the intended data.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "data-analysis-spreadsheet-skills-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Data Analysis & Spreadsheet Skills.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Data Analysis & Spreadsheet Skills in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: observation — one recorded case; variable — characteristic measured for a case; formula — spreadsheet calculation; mean — arithmetic average; median — middle value after sorting. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Create a fictional table with at least five rows. Calculate a total and average, make a labelled chart and explain one pattern and one limitation.",
            "EXPLAIN YOUR REASONING — For values 10, 12, 12, 16 and 20, the sum is 70, mean is 14 and median is 12. They describe different aspects, so choose the statistic that fits the question. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Inspect formula ranges, recalculate a sample by hand, label units and confirm the chart uses the intended data.",
            "ERROR SPOTTING — Look for these common mistakes: including header cells in formula ranges; mixing currencies or units; deleting unusual values without investigation; treating correlation as proof of cause. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Create a five-row dataset and identify at least two data-quality checks."
          ],
      }
    ,
{
  "id": "data-analysis-spreadsheet-skills-lesson-4",
  "title": "Organizing Data in Spreadsheets",
  "minutes": 17,
  "content": [
      "Data analysis begins with a clear question. Decide what information is needed, where it comes from and what decision the analysis should support.",
      "In a spreadsheet, columns usually represent fields and rows represent individual records. Use clear headings and keep each column consistent in meaning and format.",
      "Use consistent date, currency and number formats. Avoid merging cells inside data tables because it can interfere with sorting and analysis.",
      "Check for missing values, duplicate records, inconsistent spelling and impossible values. Correct issues using documented rules rather than guessing.",
      "Keep a clean original copy of important data and protect sensitive information. Collect and use only information that is appropriate for the task.",
      "LESSON FOCUS — Organising clean data. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Use one row per observation and one column per variable, with consistent labels and units. Decide how blanks and duplicates will be treated before analysis and preserve the original data.",
      "FOLLOW THE METHOD — 1) Write the question and define each row, column and unit. 2) Check blanks, duplicates and inconsistent categories. 3) Use appropriate formulas and label results. 4) Recalculate a sample manually or use a known check. 5) Choose a clearly labelled chart and explain its limits.",
      "WORKED EXAMPLE — Do not record “Nairobi”, “NBO” and “Nairobi city” as different categories unless those distinctions are intended.",
      "PRACTICE TASK — Create a five-row dataset and identify at least two data-quality checks.",
      "COMMON MISTAKES TO AVOID — including header cells in formula ranges; mixing currencies or units; deleting unusual values without investigation; treating correlation as proof of cause. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Inspect formula ranges, recalculate a sample by hand, label units and confirm the chart uses the intended data. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "data-analysis-spreadsheet-skills-lesson-5",
  "title": "Formulas, Functions and Data Summaries",
  "minutes": 18,
  "content": [
      "Spreadsheet formulas commonly begin with an equals sign. Arithmetic operators can calculate totals, differences, products and ratios.",
      "Functions such as SUM, AVERAGE, MIN and MAX summarize numerical values. COUNT and related functions help assess how much data is available.",
      "Cell references identify values used in formulas. Relative references change when formulas are copied, while absolute references lock a row or column using dollar signs in common spreadsheet software.",
      "Sorting arranges records by a chosen field. Filters display records that match criteria without necessarily deleting other records.",
      "Check formulas with a small example, review unusual outputs and confirm that the selected range includes the intended records.",
      "LESSON FOCUS — Formulas and summary measures. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Functions such as SUM, COUNT, AVERAGE and MEDIAN answer different questions. Confirm the selected range and understand how missing or extreme values affect a result.",
      "FOLLOW THE METHOD — 1) Write the question and define each row, column and unit. 2) Check blanks, duplicates and inconsistent categories. 3) Use appropriate formulas and label results. 4) Recalculate a sample manually or use a known check. 5) Choose a clearly labelled chart and explain its limits.",
      "WORKED EXAMPLE — The values 10, 12, 12, 16 and 100 have mean 30 but median 12; the extreme value strongly affects the mean.",
      "PRACTICE TASK — Calculate mean and median for a small fictional dataset and explain why they differ.",
      "COMMON MISTAKES TO AVOID — including header cells in formula ranges; mixing currencies or units; deleting unusual values without investigation; treating correlation as proof of cause. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Inspect formula ranges, recalculate a sample by hand, label units and confirm the chart uses the intended data. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "data-analysis-spreadsheet-skills-lesson-6",
  "title": "Charts, Interpretation and Responsible Reporting",
  "minutes": 17,
  "content": [
      "Choose a chart that matches the question. Bar charts compare categories, line charts show change over time, and scatter plots explore relationships between numerical variables.",
      "Label axes, state units and give charts descriptive titles. Avoid misleading scales, unnecessary decoration and missing context.",
      "A pattern or correlation does not by itself prove that one variable causes another. Consider other explanations and limitations in the data.",
      "Summaries should separate observed facts from interpretations. Report sample size, relevant time period and important uncertainty where appropriate.",
      "Before sharing results, verify calculations, remove unnecessary personal information and make the report understandable to its intended audience.",
      "LESSON FOCUS — Charts and interpretation. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Select a chart to match the comparison: bars compare categories, lines show change over time, and scatter plots compare two numeric variables. Label axes and avoid implying causation from a pattern alone.",
      "FOLLOW THE METHOD — 1) Write the question and define each row, column and unit. 2) Check blanks, duplicates and inconsistent categories. 3) Use appropriate formulas and label results. 4) Recalculate a sample manually or use a known check. 5) Choose a clearly labelled chart and explain its limits.",
      "WORKED EXAMPLE — A monthly sales line chart needs a month axis and sales units. A rising line shows sales increased, not why they increased.",
      "PRACTICE TASK — Choose a chart for categories or time, title its axes and write one supported conclusion and one question the chart cannot answer.",
      "COMMON MISTAKES TO AVOID — including header cells in formula ranges; mixing currencies or units; deleting unusual values without investigation; treating correlation as proof of cause. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Inspect formula ranges, recalculate a sample by hand, label units and confirm the chart uses the intended data. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "data-analysis-spreadsheet-skills-question-1",
        prompt: "What is a useful first step when learning Data Analysis & Spreadsheet Skills?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "data-analysis-spreadsheet-skills-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "data-analysis-spreadsheet-skills-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "data-analysis-spreadsheet-skills-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "data-analysis-spreadsheet-skills-q5",
  "prompt": "How should a well-organized spreadsheet table normally be structured?",
  "options": [
    "Consistent fields in columns and records in rows",
    "A different meaning in every cell of one column",
    "No headings and random formats",
    "Merged cells throughout the data table"
  ],
  "answerIndex": 0,
  "explanation": "Consistent columns and rows make records easier to sort, filter and analyze."
},
{
  "id": "data-analysis-spreadsheet-skills-q6",
  "prompt": "Which spreadsheet function adds a group of numbers?",
  "options": [
    "SUM",
    "AVERAGE",
    "MAX",
    "MIN"
  ],
  "answerIndex": 0,
  "explanation": "SUM adds the selected numerical values."
},
{
  "id": "data-analysis-spreadsheet-skills-q7",
  "prompt": "What is the purpose of a filter?",
  "options": [
    "Display records that meet selected criteria",
    "Permanently delete every record",
    "Guarantee all data is correct",
    "Replace the need for headings"
  ],
  "answerIndex": 0,
  "explanation": "Filtering displays records that match conditions while leaving other records in the dataset."
},
{
  "id": "data-analysis-spreadsheet-skills-q8",
  "prompt": "Which chart is commonly useful for showing change over time?",
  "options": [
    "Line chart",
    "A decorative picture with no axes",
    "An unlabeled text block",
    "A random list of numbers"
  ],
  "answerIndex": 0,
  "explanation": "A line chart commonly shows how values change across time."
},
{
  "id": "data-analysis-spreadsheet-skills-q9",
  "prompt": "Does correlation alone prove causation?",
  "options": [
    "No, other explanations may exist",
    "Yes, in every case",
    "Only if the chart has colours",
    "Yes, if the dataset has headings"
  ],
  "answerIndex": 0,
  "explanation": "Correlation shows an association but does not establish that one variable causes another."
},
{
  "id": "data-analysis-spreadsheet-skills-q10",
  "prompt": "What should you do before sharing a data report?",
  "options": [
    "Verify calculations and protect unnecessary personal information",
    "Publish private details without checking",
    "Remove all units and labels",
    "Ignore unusual values"
  ],
  "answerIndex": 0,
  "explanation": "Verification and responsible handling of personal data improve accuracy and privacy."
}
],
  },
    {
    id: "procurement-supply-chain-fundamentals",
    title: "Procurement & Supply Chain Fundamentals",
    category: "Business",
    level: "Foundation",
    description: "Understand purchasing, supplier selection, inventory, logistics, and records.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "procurement-supply-chain-fundamentals-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nUnderstand purchasing, supplier selection, inventory, logistics, and records.\n\nLearning objectives\n\n- Identify the main ideas in Procurement & Supply Chain Fundamentals.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Procurement & Supply Chain Fundamentals, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Procurement obtains goods and services that meet a need at an acceptable total cost, quality, risk and delivery time. A low quote may be poor value when shipping, defects, warranty or delays are included. Clear specifications and a fair, documented comparison protect the organisation and suppliers.",
            "KEY WORDS — specification — description of a requirement; quotation — supplier price and terms; purchase order — approved order; lead time — time from order to delivery; total cost of ownership — purchase and relevant lifecycle costs. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Define a need and measurable specification. 2) Invite comparable quotes from suitable suppliers. 3) Check price, taxes, quality, delivery, warranty and eligibility. 4) Document evaluation and obtain approval before commitment. 5) Inspect receipt and reconcile the order with documents.",
            "WORKED EXAMPLE — Supplier A has the lowest unit price but a high delivery fee and long lead time. Compare the total delivered cost and operational risk, not only the headline price.",
            "GUIDED PRACTICE — Compare three fictional quotes against a specification. Create a table for price, quality, delivery and warranty, then explain the decision.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Keep specification, quotes, approval, order and receipt linked. Recheck the totals and follow the applicable procurement policy.",
            "COMMON MISTAKES — comparing different specifications; splitting purchases to avoid approval rules; accepting a gift that creates conflict; paying without confirming receipt. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "procurement-supply-chain-fundamentals-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Procurement & Supply Chain Fundamentals can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Define a need and measurable specification. 2) Invite comparable quotes from suitable suppliers. 3) Check price, taxes, quality, delivery, warranty and eligibility. 4) Document evaluation and obtain approval before commitment. 5) Inspect receipt and reconcile the order with documents.",
            "WATCH A MODEL — Supplier A has the lowest unit price but a high delivery fee and long lead time. Compare the total delivered cost and operational risk, not only the headline price.",
            "TRY IT YOURSELF — Compare three fictional quotes against a specification. Create a table for price, quality, delivery and warranty, then explain the decision. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Keep specification, quotes, approval, order and receipt linked. Recheck the totals and follow the applicable procurement policy.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "procurement-supply-chain-fundamentals-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Procurement & Supply Chain Fundamentals.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Procurement & Supply Chain Fundamentals in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: specification — description of a requirement; quotation — supplier price and terms; purchase order — approved order; lead time — time from order to delivery; total cost of ownership — purchase and relevant lifecycle costs. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Compare three fictional quotes against a specification. Create a table for price, quality, delivery and warranty, then explain the decision.",
            "EXPLAIN YOUR REASONING — Supplier A has the lowest unit price but a high delivery fee and long lead time. Compare the total delivered cost and operational risk, not only the headline price. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Keep specification, quotes, approval, order and receipt linked. Recheck the totals and follow the applicable procurement policy.",
            "ERROR SPOTTING — Look for these common mistakes: comparing different specifications; splitting purchases to avoid approval rules; accepting a gift that creates conflict; paying without confirming receipt. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Write a measurable specification for a fictional purchase."
          ],
      }
    ,
{
  "id": "procurement-supply-chain-fundamentals-lesson-4",
  "title": "Procurement Planning and Supplier Selection",
  "minutes": 18,
  "content": [
      "Procurement is the process of identifying needs, obtaining goods or services and managing supplier relationships. Good procurement supports value, quality and accountability.",
      "Start by defining the requirement, quantity, specifications, delivery location, required date and available budget.",
      "Compare suppliers using relevant criteria such as total cost, quality, delivery reliability, capacity, compliance and after-sales support.",
      "A quotation describes a supplier's proposed price and terms. Compare like-for-like specifications and consider transport, taxes, warranties and other relevant costs.",
      "Follow the organization's approval process, declare conflicts of interest and keep records of supplier selection and purchasing decisions.",
      "LESSON FOCUS — Need and specifications. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A specification states the function, quantity, quality, compatibility and delivery requirement. Neutral requirements allow suppliers to be compared fairly.",
      "FOLLOW THE METHOD — 1) Define a need and measurable specification. 2) Invite comparable quotes from suitable suppliers. 3) Check price, taxes, quality, delivery, warranty and eligibility. 4) Document evaluation and obtain approval before commitment. 5) Inspect receipt and reconcile the order with documents.",
      "WORKED EXAMPLE — Request a laptop with stated performance, memory, warranty and delivery needs rather than a vague “good laptop.”",
      "PRACTICE TASK — Write a measurable specification for a fictional purchase.",
      "COMMON MISTAKES TO AVOID — comparing different specifications; splitting purchases to avoid approval rules; accepting a gift that creates conflict; paying without confirming receipt. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Keep specification, quotes, approval, order and receipt linked. Recheck the totals and follow the applicable procurement policy. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "procurement-supply-chain-fundamentals-lesson-5",
  "title": "Purchase Orders, Inventory and Logistics",
  "minutes": 18,
  "content": [
      "A purchase order documents an authorized purchase and commonly identifies items, quantities, prices, delivery terms and the parties involved.",
      "When goods arrive, check quantities and condition against the purchase order and delivery documentation. Record shortages, damage and discrepancies promptly.",
      "Inventory records track stock received, issued, stored and remaining. Accurate records help prevent shortages, over-ordering and unexplained losses.",
      "Supply chains connect suppliers, producers, storage, transport and end users. Delays at one stage may affect other stages.",
      "Plan storage and transport around product requirements, delivery schedules, security and applicable handling rules. Keep important documents traceable.",
      "LESSON FOCUS — Comparing suppliers fairly. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Compare offers against the same criteria. Consider total landed cost, compliance, capacity, quality, lead time, after-sales service and relevant risk; document any scoring method.",
      "FOLLOW THE METHOD — 1) Define a need and measurable specification. 2) Invite comparable quotes from suitable suppliers. 3) Check price, taxes, quality, delivery, warranty and eligibility. 4) Document evaluation and obtain approval before commitment. 5) Inspect receipt and reconcile the order with documents.",
      "WORKED EXAMPLE — A slightly higher priced supplier may provide a longer warranty and reliable delivery that reduces the total operational risk.",
      "PRACTICE TASK — Score three fictional offers and show how the criteria led to your selection.",
      "COMMON MISTAKES TO AVOID — comparing different specifications; splitting purchases to avoid approval rules; accepting a gift that creates conflict; paying without confirming receipt. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Keep specification, quotes, approval, order and receipt linked. Recheck the totals and follow the applicable procurement policy. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "procurement-supply-chain-fundamentals-lesson-6",
  "title": "Supplier Performance, Ethics and Risk",
  "minutes": 17,
  "content": [
      "Supplier performance can be monitored through quality, delivery timeliness, completeness, responsiveness and compliance with agreed terms.",
      "Document performance issues with dates and evidence. Agree on corrective actions and monitor whether problems are resolved.",
      "Supply-chain risks may include delays, price changes, stock shortages, quality failures, fraud and dependence on a single supplier.",
      "Reduce risk through appropriate supplier checks, clear contracts, sensible stock planning, contingency arrangements and regular communication.",
      "Ethical procurement requires fair treatment, transparent decisions, confidentiality and compliance with applicable laws and policies. Do not accept improper gifts or payments that could influence decisions.",
      "LESSON FOCUS — Receiving goods and managing supply. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Match what arrives to the approved order and delivery record. Report shortages, damage or substitutions promptly and keep traceable records for payment and supplier evaluation.",
      "FOLLOW THE METHOD — 1) Define a need and measurable specification. 2) Invite comparable quotes from suitable suppliers. 3) Check price, taxes, quality, delivery, warranty and eligibility. 4) Document evaluation and obtain approval before commitment. 5) Inspect receipt and reconcile the order with documents.",
      "WORKED EXAMPLE — If an order expects 20 items but only 18 arrive, record the discrepancy and obtain the agreed resolution before approving a full receipt.",
      "PRACTICE TASK — Draw a purchase-to-receipt flow and mark the checks required at each step.",
      "COMMON MISTAKES TO AVOID — comparing different specifications; splitting purchases to avoid approval rules; accepting a gift that creates conflict; paying without confirming receipt. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Keep specification, quotes, approval, order and receipt linked. Recheck the totals and follow the applicable procurement policy. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "procurement-supply-chain-fundamentals-question-1",
        prompt: "What is a useful first step when learning Procurement & Supply Chain Fundamentals?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "procurement-supply-chain-fundamentals-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "procurement-supply-chain-fundamentals-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "procurement-supply-chain-fundamentals-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "procurement-supply-chain-fundamentals-q5",
  "prompt": "What should be defined before requesting supplier quotations?",
  "options": [
    "The requirement, specifications, quantities and delivery needs",
    "Only the preferred supplier's name",
    "A payment password",
    "An unlimited budget with no details"
  ],
  "answerIndex": 0,
  "explanation": "Clear requirements make supplier quotations comparable and relevant."
},
{
  "id": "procurement-supply-chain-fundamentals-q6",
  "prompt": "Why should suppliers be compared using total cost and quality?",
  "options": [
    "To assess overall value rather than price alone",
    "To guarantee the cheapest offer is always best",
    "To avoid checking delivery terms",
    "To remove accountability from purchasing"
  ],
  "answerIndex": 0,
  "explanation": "Total cost, quality, reliability and other terms affect the overall value of an offer."
},
{
  "id": "procurement-supply-chain-fundamentals-q7",
  "prompt": "What is a purchase order used for?",
  "options": [
    "Documenting an authorized purchase and its terms",
    "Replacing all inventory records",
    "Guaranteeing goods never arrive damaged",
    "Recording employee holidays only"
  ],
  "answerIndex": 0,
  "explanation": "A purchase order records the authorized items and conditions of a purchase."
},
{
  "id": "procurement-supply-chain-fundamentals-q8",
  "prompt": "What should happen when delivered goods do not match the order?",
  "options": [
    "Record the discrepancy and report it promptly",
    "Ignore the difference",
    "Change the records without evidence",
    "Automatically approve the full delivery"
  ],
  "answerIndex": 0,
  "explanation": "Prompt documentation helps resolve shortages, damage and other receiving problems."
},
{
  "id": "procurement-supply-chain-fundamentals-q9",
  "prompt": "Which measure can help reduce supply-chain risk?",
  "options": [
    "Assessing suppliers and planning appropriate contingencies",
    "Depending on one supplier without assessment",
    "Keeping no stock records",
    "Ignoring delivery delays"
  ],
  "answerIndex": 0,
  "explanation": "Supplier assessment and contingency planning help an organization respond to disruption."
},
{
  "id": "procurement-supply-chain-fundamentals-q10",
  "prompt": "What is an example of ethical procurement?",
  "options": [
    "Declaring conflicts of interest and making transparent decisions",
    "Accepting secret payments for supplier selection",
    "Sharing confidential bids unfairly",
    "Ignoring applicable purchasing rules"
  ],
  "answerIndex": 0,
  "explanation": "Transparency, fairness and conflict-of-interest controls support ethical procurement."
}
],
  },
    {
    id: "ai-literacy-responsible-use",
    title: "AI Literacy & Responsible Use",
    category: "Digital Skills",
    level: "Foundation",
    description: "Understand artificial intelligence, practical applications, limitations, and responsible use.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "ai-literacy-responsible-use-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nUnderstand artificial intelligence, practical applications, limitations, and responsible use.\n\nLearning objectives\n\n- Identify the main ideas in AI Literacy & Responsible Use.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in AI Literacy & Responsible Use, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Responsible AI use combines human judgement with checks for accuracy, privacy, fairness and accountability. A model can reproduce bias, invent a source or expose sensitive information. The person using the tool remains responsible for consequential decisions and must follow organisational and professional rules.",
            "KEY WORDS — bias — systematic distortion that can disadvantage or misrepresent; privacy — control over personal or sensitive information; transparency — explaining relevant use and limits; human oversight — accountable person reviewing output; provenance — information about where content came from. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Check whether AI is permitted for the task. 2) Remove personal or confidential data unless an approved process permits its use. 3) Use AI for a suitable assistive task, not unsupported final authority. 4) Verify claims, sources, calculations and possible bias. 5) Document material use and have an accountable person approve the result.",
            "WORKED EXAMPLE — An AI-generated hiring summary could omit context or use biased language. A human reviewer checks the original permitted records against consistent criteria instead of letting unverified output decide the result.",
            "GUIDED PRACTICE — Review a fictional AI answer with one factual error and one biased assumption. Identify both and rewrite it with evidence and limitations.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Trace important claims, check privacy rules, test assumptions and document who reviewed the final output.",
            "COMMON MISTAKES — pasting customer or learner records into an unapproved tool; assuming outputs are automatically fair; using AI as the sole basis for a consequential decision; hiding assistance where disclosure is required. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "ai-literacy-responsible-use-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how AI Literacy & Responsible Use can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Check whether AI is permitted for the task. 2) Remove personal or confidential data unless an approved process permits its use. 3) Use AI for a suitable assistive task, not unsupported final authority. 4) Verify claims, sources, calculations and possible bias. 5) Document material use and have an accountable person approve the result.",
            "WATCH A MODEL — An AI-generated hiring summary could omit context or use biased language. A human reviewer checks the original permitted records against consistent criteria instead of letting unverified output decide the result.",
            "TRY IT YOURSELF — Review a fictional AI answer with one factual error and one biased assumption. Identify both and rewrite it with evidence and limitations. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Trace important claims, check privacy rules, test assumptions and document who reviewed the final output.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "ai-literacy-responsible-use-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in AI Literacy & Responsible Use.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain AI Literacy & Responsible Use in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: bias — systematic distortion that can disadvantage or misrepresent; privacy — control over personal or sensitive information; transparency — explaining relevant use and limits; human oversight — accountable person reviewing output; provenance — information about where content came from. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Review a fictional AI answer with one factual error and one biased assumption. Identify both and rewrite it with evidence and limitations.",
            "EXPLAIN YOUR REASONING — An AI-generated hiring summary could omit context or use biased language. A human reviewer checks the original permitted records against consistent criteria instead of letting unverified output decide the result. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Trace important claims, check privacy rules, test assumptions and document who reviewed the final output.",
            "ERROR SPOTTING — Look for these common mistakes: pasting customer or learner records into an unapproved tool; assuming outputs are automatically fair; using AI as the sole basis for a consequential decision; hiding assistance where disclosure is required. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Mark possible bias in a fictional model response and state what additional evidence is needed."
          ],
      }
    ,
{
  "id": "ai-literacy-responsible-use-lesson-4",
  "title": "Understanding AI Systems and Their Limits",
  "minutes": 18,
  "content": [
      "Artificial intelligence refers to computer systems designed to perform tasks associated with capabilities such as prediction, language processing, pattern recognition and content generation.",
      "Different AI systems use different methods and data. Generative AI can produce text, images or other content based on patterns learned during training and information provided in a prompt.",
      "AI outputs may be incorrect, incomplete, outdated or misleading. Fluent language does not guarantee factual accuracy or sound reasoning.",
      "Performance depends on the task, available information, system design and evaluation method. Test tools against the actual needs of the intended use.",
      "Treat AI as an aid to human judgement rather than an unquestionable authority, especially when decisions have important consequences.",
      "LESSON FOCUS — Bias, fairness and limitations. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — AI outputs can reflect gaps or distortions in the data and design. Fair use asks who might be underrepresented, who could be harmed and whether the same standard is applied consistently.",
      "FOLLOW THE METHOD — 1) Check whether AI is permitted for the task. 2) Remove personal or confidential data unless an approved process permits its use. 3) Use AI for a suitable assistive task, not unsupported final authority. 4) Verify claims, sources, calculations and possible bias. 5) Document material use and have an accountable person approve the result.",
      "WORKED EXAMPLE — A fictional hiring tool that favours one writing style may miss qualified applicants. Review the criteria and underlying evidence before using its output.",
      "PRACTICE TASK — Mark possible bias in a fictional model response and state what additional evidence is needed.",
      "COMMON MISTAKES TO AVOID — pasting customer or learner records into an unapproved tool; assuming outputs are automatically fair; using AI as the sole basis for a consequential decision; hiding assistance where disclosure is required. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Trace important claims, check privacy rules, test assumptions and document who reviewed the final output. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "ai-literacy-responsible-use-lesson-5",
  "title": "Privacy, Fairness and Human Oversight",
  "minutes": 18,
  "content": [
      "AI systems can reflect limitations or biases in their data, design and deployment. Results may perform differently across people, languages and situations.",
      "Do not enter confidential business information, passwords, sensitive personal data or private records into a tool unless its approved protections and policies permit that use.",
      "Collect and use personal information lawfully, fairly and only for an appropriate purpose. Follow applicable privacy requirements and organizational policies.",
      "Human oversight means checking important outputs, questioning assumptions, correcting errors and providing a way to challenge consequential decisions.",
      "Use AI in ways that respect dignity, accessibility, intellectual property and the rights of others. Do not use it to deceive, harass or discriminate.",
      "LESSON FOCUS — Privacy and data handling. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Data entered into tools may be stored or processed under different terms. Use approved services, minimise identifying information and follow consent, retention and access rules.",
      "FOLLOW THE METHOD — 1) Check whether AI is permitted for the task. 2) Remove personal or confidential data unless an approved process permits its use. 3) Use AI for a suitable assistive task, not unsupported final authority. 4) Verify claims, sources, calculations and possible bias. 5) Document material use and have an accountable person approve the result.",
      "WORKED EXAMPLE — Use a fictional case rather than pasting an identifiable learner record into an unapproved chatbot.",
      "PRACTICE TASK — Rewrite a sample prompt to remove names, phone numbers and unnecessary private details.",
      "COMMON MISTAKES TO AVOID — pasting customer or learner records into an unapproved tool; assuming outputs are automatically fair; using AI as the sole basis for a consequential decision; hiding assistance where disclosure is required. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Trace important claims, check privacy rules, test assumptions and document who reviewed the final output. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "ai-literacy-responsible-use-lesson-6",
  "title": "Verification, Transparency and Responsible Practice",
  "minutes": 17,
  "content": [
      "Verify factual claims against reliable sources, especially names, dates, statistics, legal requirements and health or financial information.",
      "Ask clear questions, provide relevant context and specify the desired format. Avoid sharing sensitive details merely to improve a prompt.",
      "Check generated code, calculations, summaries and recommendations before using them. Test outputs in a safe environment when appropriate.",
      "Be transparent about material AI assistance when required by workplace, educational, legal or professional rules. Never claim that unverified AI-generated work is fully validated.",
      "Maintain human responsibility for decisions and outcomes. Record important checks and report harmful or unreliable results through appropriate channels.",
      "LESSON FOCUS — Human review and transparency. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — For material decisions, a responsible person verifies important facts, records limitations and remains accountable. Explain AI assistance when rules, users or the context require it.",
      "FOLLOW THE METHOD — 1) Check whether AI is permitted for the task. 2) Remove personal or confidential data unless an approved process permits its use. 3) Use AI for a suitable assistive task, not unsupported final authority. 4) Verify claims, sources, calculations and possible bias. 5) Document material use and have an accountable person approve the result.",
      "WORKED EXAMPLE — A report draft can be AI-assisted, but the author still checks every factual claim and takes responsibility for the submitted version.",
      "PRACTICE TASK — Prepare a short AI-use checklist covering permission, privacy, verification, disclosure and approval.",
      "COMMON MISTAKES TO AVOID — pasting customer or learner records into an unapproved tool; assuming outputs are automatically fair; using AI as the sole basis for a consequential decision; hiding assistance where disclosure is required. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Trace important claims, check privacy rules, test assumptions and document who reviewed the final output. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "ai-literacy-responsible-use-question-1",
        prompt: "What is a useful first step when learning AI Literacy & Responsible Use?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "ai-literacy-responsible-use-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "ai-literacy-responsible-use-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "ai-literacy-responsible-use-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "ai-literacy-responsible-use-q5",
  "prompt": "What does generative AI commonly do?",
  "options": [
    "Creates content such as text or images based on learned patterns and prompts",
    "Guarantees every answer is true",
    "Removes the need for human judgement",
    "Works only without any input"
  ],
  "answerIndex": 0,
  "explanation": "Generative AI produces content in response to inputs using patterns learned by the system."
},
{
  "id": "ai-literacy-responsible-use-q6",
  "prompt": "Why should AI-generated factual claims be checked?",
  "options": [
    "AI can produce inaccurate or misleading information",
    "AI outputs are always verified automatically",
    "Checking makes information less reliable",
    "AI cannot generate sentences"
  ],
  "answerIndex": 0,
  "explanation": "AI can make factual errors, so important claims should be verified with reliable sources."
},
{
  "id": "ai-literacy-responsible-use-q7",
  "prompt": "What is a responsible approach to sensitive information?",
  "options": [
    "Use only approved tools and avoid unnecessary disclosure",
    "Paste passwords into any public tool",
    "Share private records for convenience",
    "Ignore privacy policies"
  ],
  "answerIndex": 0,
  "explanation": "Sensitive information should be protected and handled only through approved, appropriate processes."
},
{
  "id": "ai-literacy-responsible-use-q8",
  "prompt": "What does human oversight involve?",
  "options": [
    "Reviewing outputs and correcting errors before important use",
    "Accepting every AI result without review",
    "Allowing software to hide every decision",
    "Avoiding accountability"
  ],
  "answerIndex": 0,
  "explanation": "Human oversight includes checking, questioning and taking responsibility for important outputs."
},
{
  "id": "ai-literacy-responsible-use-q9",
  "prompt": "What is one reason AI outputs may be biased?",
  "options": [
    "Limitations or biases in data, design or deployment",
    "Every dataset is automatically fair",
    "AI systems never use data",
    "Bias can occur only in printed documents"
  ],
  "answerIndex": 0,
  "explanation": "Bias can enter through training data, system design and how a system is used."
},
{
  "id": "ai-literacy-responsible-use-q10",
  "prompt": "What should a user do before relying on AI-generated code or calculations?",
  "options": [
    "Review and test the result as appropriate",
    "Assume it is correct because it looks convincing",
    "Disable all checks",
    "Publish it without understanding its purpose"
  ],
  "answerIndex": 0,
  "explanation": "Review and testing help detect errors before generated material is used."
}
],
  },
    {
    id: "research-methods-critical-thinking",
    title: "Research Methods & Critical Thinking",
    category: "Personal Development",
    level: "Foundation",
    description: "Develop research questions, evaluate evidence, identify bias, and communicate findings.",
    priceKsh: 300,
    published: true,
    lessons: [
      {
        id: "research-methods-critical-thinking-lesson-1",
        title: "Introduction and Key Concepts",
        minutes: 20,
        content: [
            "Introduction\n\nDevelop research questions, evaluate evidence, identify bias, and communicate findings.\n\nLearning objectives\n\n- Identify the main ideas in Research Methods & Critical Thinking.\n- Explain important terms and concepts.\n- Connect the topic to everyday situations.\n\nStudy notes\n\nBegin by identifying what you already know about this topic. Record unfamiliar terms, read the course material carefully, and write a short summary in your own words.\n\nPractice\n\nWrite down three things you learned and one question you would like to explore further.",
            "LEARNING TARGETS — In “Introduction and Key Concepts”, learn the central idea in Research Methods & Critical Thinking, explain the key terms and connect them to a familiar example. Work through one section at a time; understanding the steps matters more than memorising a paragraph.",
            "CORE IDEA — Research is a transparent process for answering a focused question with evidence. Define the context and key concepts, decide what would count as an answer, and select sources and methods that fit the question. Critical thinking checks source credibility, sampling, measurement, alternative explanations and uncertainty. A conclusion must never claim more than its evidence supports.",
            "KEY WORDS — research question — focused, answerable issue; population — full group a study concerns; sample — cases actually observed; operational definition — how a concept is measured or recognised; bias — systematic influence that distorts evidence; limitation — condition restricting interpretation. Read one term, cover the definition and explain it in your own words. Add a drawing or everyday example beside any term that is hard to remember.",
            "STEP-BY-STEP MODEL — 1) Write one focused question and define key terms. 2) Choose credible sources and a method suited to the question. 3) Explain how cases are selected and data recorded. 4) Compare evidence and check alternative explanations. 5) State findings, uncertainty, limits and further information needed.",
            "WORKED EXAMPLE — To examine whether a short daily revision session is associated with improved quiz scores, define a revision session and a comparable score. Record observations over multiple days and note other factors such as sleep or prior knowledge; do not claim revision alone caused a change.",
            "GUIDED PRACTICE — Investigate a low-risk question using two credible sources or a small fictional dataset. State the question, source quality, method, possible bias, evidence, conclusion and one limitation.",
            "CHECK YOURSELF — Explain the main idea without looking, name two useful terms and describe one check that could catch a mistake. Trace claims to sources or records, recalculate values, check whether the sample supports the conclusion and actively look for contrary evidence.",
            "COMMON MISTAKES — cherry-picking supportive evidence; using an unrepresentative sample; confusing correlation with causation; treating one person’s experience as universal; reporting a guess as a measured finding. If you make one of these mistakes, write the correction beside it and try a similar task again."
          ],
      },
      {
        id: "research-methods-critical-thinking-lesson-2",
        title: "Practical Applications",
        minutes: 20,
        content: [
            "Practical applications\n\nThis lesson explores how Research Methods & Critical Thinking can be applied in everyday life, education, or work.\n\nLearning activities\n\n- Identify a real-life situation related to the topic.\n- Describe the problem or task involved.\n- Explain which concepts or skills could help.\n- Outline the steps you would take and why.\n\nReflection\n\nConsider how planning, careful observation, and checking your work can improve your results. Record an example of how you could use this knowledge.",
            "TODAY’S SKILL — Use Practical Applications to solve a small realistic task. Begin by saying what a successful result would look like; this gives you something specific to check at the end.",
            "FOLLOW THESE STEPS — 1) Write one focused question and define key terms. 2) Choose credible sources and a method suited to the question. 3) Explain how cases are selected and data recorded. 4) Compare evidence and check alternative explanations. 5) State findings, uncertainty, limits and further information needed.",
            "WATCH A MODEL — To examine whether a short daily revision session is associated with improved quiz scores, define a revision session and a comparable score. Record observations over multiple days and note other factors such as sleep or prior knowledge; do not claim revision alone caused a change.",
            "TRY IT YOURSELF — Investigate a low-risk question using two credible sources or a small fictional dataset. State the question, source quality, method, possible bias, evidence, conclusion and one limitation. Do not worry if the first attempt is not perfect: keep the work, identify the step that caused trouble and correct that step.",
            "VISUAL THINKING — Picture the process as a sequence: START → CHOOSE THE METHOD → DO THE WORK → CHECK THE RESULT. Stop after each step and explain why you are ready to continue.",
            "QUALITY CHECK — Trace claims to sources or records, recalculate values, check whether the sample supports the conclusion and actively look for contrary evidence.",
            "IF YOU GET STUCK — Return to the first step, underline the information you know and circle the part you do not understand yet. Ask a specific question or use a worked example before trying again.",
            "REFLECTION — Which step was easiest? Which took the most effort? Write one small change that would make your next attempt clearer or more accurate."
          ],
      },
      {
        id: "research-methods-critical-thinking-lesson-3",
        title: "Review and Knowledge Check",
        minutes: 20,
        content: [
            "Review and knowledge check\n\nReview the key concepts covered in Research Methods & Critical Thinking.\n\nBefore the assessment\n\n- Revisit the introduction and key terms.\n- Review the practical examples.\n- Summarise the main ideas without copying the lesson.\n- Identify any areas that need more practice.\n\nReflection questions\n\n1. What are the most important concepts in this course?\n2. How could you apply one of these concepts in a real situation?\n3. What additional information or practice would help you improve?\n\nComplete the course assessment when you are ready.",
            "RETRIEVE FROM MEMORY — Close the notes for a moment. Explain Research Methods & Critical Thinking in three sentences: what the topic is, when it is useful and how you check the result. Then reopen the notes to correct anything you missed.",
            "CONCEPT CONNECTIONS — Connect these terms to your own example: research question — focused, answerable issue; population — full group a study concerns; sample — cases actually observed; operational definition — how a concept is measured or recognised; bias — systematic influence that distorts evidence; limitation — condition restricting interpretation. Draw arrows or make a small table if it helps you see how the terms relate.",
            "MINI-CHALLENGE — Investigate a low-risk question using two credible sources or a small fictional dataset. State the question, source quality, method, possible bias, evidence, conclusion and one limitation.",
            "EXPLAIN YOUR REASONING — To examine whether a short daily revision session is associated with improved quiz scores, define a revision session and a comparable score. Record observations over multiple days and note other factors such as sleep or prior knowledge; do not claim revision alone caused a change. In your own answer, include the important step and explain why that step is suitable rather than only copying the final result.",
            "CHECK THE ANSWER — Trace claims to sources or records, recalculate values, check whether the sample supports the conclusion and actively look for contrary evidence.",
            "ERROR SPOTTING — Look for these common mistakes: cherry-picking supportive evidence; using an unrepresentative sample; confusing correlation with causation; treating one person’s experience as universal; reporting a guess as a measured finding. Pick one and write the correction in a full sentence.",
            "READY TO MOVE ON? — Can you define the key idea, demonstrate it, check your result and state one limitation? Mark each as “yes”, “nearly” or “not yet”. Repeat only the part marked “nearly” or “not yet”.",
            "SMALL NEXT STEP — Narrow a broad topic into one researchable question. Find two sources, note who produced them and record one strength and one limitation for each."
          ],
      }
    ,
{
  "id": "research-methods-critical-thinking-lesson-4",
  "title": "Research Questions, Evidence and Sources",
  "minutes": 18,
  "content": [
      "Research is a systematic process of asking questions, gathering relevant information and evaluating evidence to reach a reasoned conclusion.",
      "A good research question is clear, focused and answerable with the available time and resources. Define the topic, population or context and key terms.",
      "Primary sources provide original information, such as interviews or direct measurements. Secondary sources interpret, summarize or analyze information from other sources.",
      "Evaluate sources by checking the author's expertise, publication date, supporting evidence, purpose and potential conflicts of interest.",
      "Keep accurate notes and record source details as you work. Distinguish direct quotations, paraphrases, personal observations and your own interpretations.",
      "LESSON FOCUS — Research questions, evidence and sources. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — A strong research question defines the issue and context and can be answered with the available time and ethical methods. Primary sources provide original data or accounts; secondary sources analyse or summarise other evidence. Check authorship, date, purpose, evidence and possible conflicts before relying on a source.",
      "FOLLOW THE METHOD — 1) Write one focused question and define key terms. 2) Choose credible sources and a method suited to the question. 3) Explain how cases are selected and data recorded. 4) Compare evidence and check alternative explanations. 5) State findings, uncertainty, limits and further information needed.",
      "WORKED EXAMPLE — “Does using a ten-minute revision quiz help this class remember key terms after one week?” is more answerable than “Is studying good?” It specifies a group, action, outcome and period.",
      "PRACTICE TASK — Narrow a broad topic into one researchable question. Find two sources, note who produced them and record one strength and one limitation for each.",
      "COMMON MISTAKES TO AVOID — cherry-picking supportive evidence; using an unrepresentative sample; confusing correlation with causation; treating one person’s experience as universal; reporting a guess as a measured finding. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Trace claims to sources or records, recalculate values, check whether the sample supports the conclusion and actively look for contrary evidence. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "research-methods-critical-thinking-lesson-5",
  "title": "Research Design, Data and Ethics",
  "minutes": 18,
  "content": [
      "Research methods should fit the question. Quantitative methods work with numerical data, while qualitative methods explore experiences, meanings and descriptions.",
      "Surveys, interviews, observations and experiments each have strengths and limitations. Consider how participants or measurements are selected and recorded.",
      "A sample may not represent the wider population. Selection bias, small sample sizes, unclear questions and measurement errors can affect results.",
      "Respect participants, obtain appropriate consent, protect confidential information and follow relevant ethical and legal requirements.",
      "Describe methods honestly and keep records that allow appropriate review. Never fabricate results, alter evidence deceptively or claim to have performed work that was not done.",
      "LESSON FOCUS — Research design, data and ethics. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Choose the method that can answer the question: a survey can measure reported views, interviews can explore meaning, observations record behaviour, and experiments test controlled changes. Define the sample and measurements before collecting data. Protect privacy, seek appropriate consent and report procedures honestly.",
      "FOLLOW THE METHOD — 1) Write one focused question and define key terms. 2) Choose credible sources and a method suited to the question. 3) Explain how cases are selected and data recorded. 4) Compare evidence and check alternative explanations. 5) State findings, uncertainty, limits and further information needed.",
      "WORKED EXAMPLE — To compare two study methods, keep the quiz and time interval similar, describe how learners were assigned and note that prior knowledge or sleep may influence the result.",
      "PRACTICE TASK — Draft a mini research plan showing question, participants or sample, method, data to record, consent/privacy safeguards and one limitation.",
      "COMMON MISTAKES TO AVOID — cherry-picking supportive evidence; using an unrepresentative sample; confusing correlation with causation; treating one person’s experience as universal; reporting a guess as a measured finding. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Trace claims to sources or records, recalculate values, check whether the sample supports the conclusion and actively look for contrary evidence. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
},
{
  "id": "research-methods-critical-thinking-lesson-6",
  "title": "Critical Thinking and Evidence-Based Conclusions",
  "minutes": 17,
  "content": [
      "Critical thinking involves examining claims, checking assumptions, comparing explanations and deciding whether evidence supports a conclusion.",
      "Separate facts that can be verified from opinions, predictions and interpretations. Ask what evidence would support or challenge a claim.",
      "Correlation does not necessarily show causation. Consider confounding factors, alternative explanations and whether the research design supports causal conclusions.",
      "A strong argument links claims to relevant evidence and explains the reasoning. Acknowledge uncertainty, limitations and credible opposing evidence.",
      "Present findings clearly and fairly. Cite sources, avoid plagiarism and revise conclusions when stronger evidence becomes available.",
      "LESSON FOCUS — Critical thinking and evidence-based conclusions. By the end, you should be able to describe this skill and show it on a fresh example, not only recognise the wording.",
      "EXPLAINED CLEARLY — Separate observations from interpretations and conclusions. Correlation means two things vary together; it does not by itself show that one caused the other. Build an argument from a clear claim, specific evidence, reasoning that connects them, counter-evidence and limitations.",
      "FOLLOW THE METHOD — 1) Write one focused question and define key terms. 2) Choose credible sources and a method suited to the question. 3) Explain how cases are selected and data recorded. 4) Compare evidence and check alternative explanations. 5) State findings, uncertainty, limits and further information needed.",
      "WORKED EXAMPLE — If students who revise more earn higher scores, motivation or prior achievement may explain part of the association. More careful comparisons are needed before claiming revision caused the difference.",
      "PRACTICE TASK — Write a claim-evidence-reasoning paragraph about a small finding, then add one alternative explanation and state what evidence would help distinguish it.",
      "COMMON MISTAKES TO AVOID — cherry-picking supportive evidence; using an unrepresentative sample; confusing correlation with causation; treating one person’s experience as universal; reporting a guess as a measured finding. Treat an unexpected result as a reason to inspect the method and evidence, not as a reason to guess.",
      "CHECK YOUR UNDERSTANDING — Trace claims to sources or records, recalculate values, check whether the sample supports the conclusion and actively look for contrary evidence. Then explain the idea to someone else in plain language, or record yourself explaining it if you are studying alone.",
      "TRANSFER THE SKILL — Change one condition in the example and predict what should change. Check your prediction and note one limitation or new question."
    ]
}
],
    questions: [
      {
        id: "research-methods-critical-thinking-question-1",
        prompt: "What is a useful first step when learning Research Methods & Critical Thinking?",
        options: ["Identify the learning objectives and key concepts","Ignore unfamiliar terms","Skip all examples","Avoid reviewing the material"],
        answerIndex: 0,
        explanation: "Identifying objectives and key concepts helps organise learning and establish what the course covers.",
      },
      {
        id: "research-methods-critical-thinking-question-2",
        prompt: "Why should learners practise applying what they study?",
        options: ["Practice makes explanations unnecessary","Application helps connect knowledge with real situations","Practice guarantees that mistakes never happen","Application replaces all further learning"],
        answerIndex: 1,
        explanation: "Applying ideas helps learners understand how knowledge can be used in practical situations.",
      },
      {
        id: "research-methods-critical-thinking-question-3",
        prompt: "What is a good way to review a lesson?",
        options: ["Memorise the title only","Avoid checking understanding","Summarise the key ideas and revisit difficult areas","Skip the learning activities"],
        answerIndex: 2,
        explanation: "Summarising and revisiting difficult areas helps identify gaps in understanding.",
      },
      {
        id: "research-methods-critical-thinking-question-4",
        prompt: "What should a learner do when a concept is unclear?",
        options: ["Guess and never check","Stop asking questions","Ignore the topic completely","Review the material, seek clarification, and practise"],
        answerIndex: 3,
        explanation: "Reviewing, asking questions, and practising are useful ways to improve understanding.",
      }
    ,
{
  "id": "research-methods-critical-thinking-q5",
  "prompt": "What makes a research question useful?",
  "options": [
    "It is clear, focused and answerable with available resources",
    "It contains no identifiable topic",
    "It cannot be investigated",
    "It requires guessing without evidence"
  ],
  "answerIndex": 0,
  "explanation": "A focused, answerable question helps guide the research process."
},
{
  "id": "research-methods-critical-thinking-q6",
  "prompt": "What is a primary source?",
  "options": [
    "Original information such as direct measurements or an interview",
    "Only an anonymous summary with no source",
    "A fictional claim presented as fact",
    "A conclusion with no supporting information"
  ],
  "answerIndex": 0,
  "explanation": "Primary sources provide original information or direct evidence."
},
{
  "id": "research-methods-critical-thinking-q7",
  "prompt": "Which is a reason to evaluate a source carefully?",
  "options": [
    "To assess its reliability, evidence and potential bias",
    "To ensure every source agrees with you",
    "To avoid checking the author's expertise",
    "To make citations unnecessary"
  ],
  "answerIndex": 0,
  "explanation": "Source evaluation helps determine credibility, relevance and possible bias."
},
{
  "id": "research-methods-critical-thinking-q8",
  "prompt": "What is selection bias?",
  "options": [
    "A sampling problem that can make a sample unrepresentative",
    "A guaranteed sign of perfect research",
    "A method for making every participant identical",
    "A requirement to remove all data"
  ],
  "answerIndex": 0,
  "explanation": "Selection bias can occur when the way participants or records are chosen skews the sample."
},
{
  "id": "research-methods-critical-thinking-q9",
  "prompt": "Does correlation automatically prove that one factor causes another?",
  "options": [
    "No, other explanations or confounding factors may exist",
    "Yes, in all studies",
    "Only when the results are surprising",
    "Yes, if the sample has a title"
  ],
  "answerIndex": 0,
  "explanation": "An observed association alone does not establish a causal relationship."
},
{
  "id": "research-methods-critical-thinking-q10",
  "prompt": "Which is an example of research integrity?",
  "options": [
    "Citing sources and reporting methods and results honestly",
    "Inventing measurements to support a preferred conclusion",
    "Copying another person's work without acknowledgement",
    "Hiding limitations that affect the findings"
  ],
  "answerIndex": 0,
  "explanation": "Research integrity requires honest reporting, proper attribution and transparent treatment of evidence."
}
],
  }
];
export function findAcademyCourse(courseId: string) {
  return ACADEMY_COURSES.find((course) => course.id === courseId && course.published) ?? null;
}
