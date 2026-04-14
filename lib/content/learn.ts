export type LearnBlock =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "h3"; c: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "table"; headers: string[]; rows: string[][] }
  | { t: "callout"; c: string; variant?: "highlight" | "warning" | "info" };

export interface LearnSource {
  label: string;
  url: string;
}

export interface LearnArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishDate: string;
  lastUpdated: string;
  category: "ai-water" | "contaminants" | "treatment" | "policy" | "utilities";
  categoryLabel: string;
  tags: string[];
  readingTimeMin: number;
  keyTakeaways: string[];
  intro: string;
  blocks: LearnBlock[];
  faqs: { question: string; answer: string }[];
  sources: LearnSource[];
  relatedArticles: string[];
  relatedGuides: string[];
}

export function getArticleBySlug(slug: string): LearnArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

export function articlesByCategory(category: LearnArticle["category"]): LearnArticle[] {
  return articles.filter((a) => a.category === category);
}

const articles: LearnArticle[] = [
  // ── ARTICLE 1 ──────────────────────────────────────────────────────────────
  {
    slug: "is-ai-making-your-water-worse",
    title: "Is AI making your water worse? What's proven, what's overstated, and what to watch",
    metaTitle: "Is AI Making Your Water Worse? What's Proven, What's Hype, and What to Watch",
    metaDescription:
      "AI data centers are increasing water demand, but the bigger question is whether they can affect water quality. Here's what is proven, what is overstated, and what local communities should watch.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "ai-water",
    categoryLabel: "AI & Water",
    tags: ["data-centers", "water-quality", "ai", "pfas", "semiconductor", "water-demand"],
    readingTimeMin: 7,
    keyTakeaways: [
      "Over two-thirds of U.S. data centers built since 2022 are in areas of high water stress — the AI-water problem is about where scale lands, not just how large it is.",
      "North American data centers used an estimated 1 trillion liters of water in 2025.",
      "Water-quality risks are real but narrower than headlines suggest: cooling blowdown and semiconductor wastewater are the documented pathways.",
      "The transparency gap — weak site-level public disclosure — is now the central issue, not a proven nationwide water crisis.",
      "The smartest consumer question is whether a data center or chip plant is proposed in your basin, not whether AI is broadly bad for water.",
    ],
    intro:
      "When people ask whether AI is making water quality worse, they are usually asking two different questions. The first is about water quantity. The second is about water quality. Those two questions overlap, but they are not the same — and collapsing them leads to claims that are too broad to be useful.",
    blocks: [
      {
        t: "callout",
        c: "Yes, AI growth is increasing water demand. Yes, there are plausible and documented water-quality risks. But the strongest current evidence is on rising water use, water-stress siting, and transparency gaps — not on a simple nationwide story that AI is already ruining drinking water everywhere.",
        variant: "highlight",
      },
      { t: "p", c: "That distinction matters." },
      { t: "h2", c: "What is already proven" },
      {
        t: "p",
        c: "There is no serious dispute that data centers use a lot of water. A February 2026 technology-sector water case study from the Taskforce on Nature-related Financial Disclosures (TNFD) says U.S. data centers consumed an estimated **66 billion liters of water for operations in 2023**. Reuters reported in April 2026 that **North American data centers used nearly 1 trillion liters of water in 2025**.",
      },
      {
        t: "p",
        c: "TNFD also says **over two-thirds of data centers built in the U.S. since 2022 are in areas of high water stress**, with **72% concentrated in a few states**. That matters because a gallon used in a water-rich area is not the same local story as a gallon used in a drought-prone basin with heavy competition for supply.",
      },
      {
        t: "callout",
        c: "The AI-water problem is not just about scale. It is about where the scale lands.",
        variant: "info",
      },
      { t: "h2", c: "Where water quality enters the picture" },
      {
        t: "p",
        c: "Most public coverage focuses on water consumption, but the water-quality side is real enough that it should not be dismissed.",
      },
      {
        t: "p",
        c: "TNFD explicitly says the tech sector's water impacts include **chemical effluents from microchip manufacturing** and **wastewater from evaporative cooling in data centers**. TNFD notes that wastewater from evaporative cooling can leave behind **high concentrations of salts, heavy metals, and other pollutants** if it is mismanaged.",
      },
      { t: "p", c: "That does not mean every data center is polluting nearby drinking water. It means the risk pathway is real:" },
      {
        t: "ul",
        items: [
          "Water is brought in for cooling",
          "Some of it evaporates",
          "Dissolved solids and treatment chemicals become more concentrated in what remains",
          "That concentrated wastewater must be managed correctly",
        ],
      },
      { t: "p", c: "If it is not, local wastewater systems and receiving waters can carry the burden." },
      { t: "h2", c: "The chip boom may matter more than many people realize" },
      {
        t: "p",
        c: "If you stop at data centers, you miss a large part of the AI water story. The upstream semiconductor industry is deeply water dependent. TNFD says the global semiconductor industry consumes around **210 trillion liters of water**.",
      },
      {
        t: "p",
        c: "A University of Illinois summary of a February 2026 review on semiconductor PFAS waste says a **single large semiconductor factory can produce thousands of cubic meters of wastewater per day**, containing a complex mix of PFAS, solvents, metals, and salts.",
      },
      {
        t: "p",
        c: "That means AI's water footprint is not just the water used to cool the servers that answer a prompt. It also includes the water required to make the chips those systems run on — and the wastewater generated in that process. For water-quality watchers, that is one of the biggest blind spots in the conversation.",
      },
      { t: "h2", c: "What is overstated" },
      {
        t: "p",
        c: 'The broad claim that "AI is poisoning your tap water" goes too far. Current evidence does **not** support a blanket statement like that. In most places, the immediate issue is more likely to be:',
      },
      {
        t: "ul",
        items: [
          "Rising local water demand",
          "Drought-period competition between users",
          "Inadequate public disclosure about site-level water use",
          "Unclear handling of wastewater or reclaimed-water systems",
          "Uneven regulation of cooling technologies and industrial discharges",
        ],
      },
      {
        t: "p",
        c: "There are real risks. But risk is not the same as proven widespread drinking-water degradation. The best public-interest position is neither complacency nor panic. It is **specificity**.",
      },
      { t: "h2", c: "The transparency problem is becoming the story" },
      {
        t: "p",
        c: "One reason this issue feels murky is that company-level disclosure often lags behind the actual buildout. Reuters reported in April 2026 that investors were pushing Amazon, Microsoft, and Google for more detailed information on water and power use at U.S. data centers.",
      },
      {
        t: "p",
        c: "The same reporting said Meta's total water use rose **51%**, from 3,726 megaliters in 2020 to 5,637 megaliters in 2024. The issue is not just how much water is used — it is how little local communities can often verify about:",
      },
      {
        t: "ul",
        items: [
          "Site-level withdrawals",
          "Cooling design",
          "Use of potable vs recycled water",
          "Discharge handling",
          "Replenishment claims",
        ],
      },
      {
        t: "p",
        c: "A UK government-commissioned report on AI and data-center water use recommended **mandatory, location-based reporting** and stronger integration of water planning into AI infrastructure development.",
      },
      { t: "h2", c: "So, is AI making your water worse?" },
      {
        t: "p",
        c: "Sometimes the answer may be yes — but only in a narrower, more local, and more technical sense than most headlines suggest. The highest-confidence answer today is:",
      },
      {
        t: "ol",
        items: [
          "AI is increasing water demand.",
          "That demand is often landing in already stressed places.",
          "There are documented water-quality risk pathways tied to cooling wastewater and semiconductor wastewater.",
          "Public disclosure is still too weak to make community-level assessment easy.",
        ],
      },
      {
        t: "p",
        c: "That means the smartest consumer question is not \"Is AI bad for water?\" It is: Is a large data center or chip plant being proposed in my basin? What kind of cooling system will it use? Will it rely on potable water or reclaimed water? How will blowdown or industrial wastewater be handled? What site-level water data will be public?",
      },
      { t: "h2", c: "Why this matters for Water Utility Report readers" },
      {
        t: "p",
        c: "For most households, the immediate action is not to panic about AI. It is to understand which contaminants matter in your own water, whether you are on a public system or a private well, what your utility reports already show, and which treatment technologies address real risks.",
      },
      {
        t: "p",
        c: "If AI-related infrastructure expands in your region, that context becomes even more important. A utility report is not the whole story. But it is still the place to start.",
      },
    ],
    faqs: [
      {
        question: "Are data centers the same as semiconductor factories when it comes to water risk?",
        answer:
          "No. Data centers and chip fabs both depend heavily on water, but semiconductor manufacturing generally involves more chemically complex wastewater, including PFAS, solvents, metals, and salts.",
      },
      {
        question: "Does every AI data center use lots of water?",
        answer:
          "No. Water use depends heavily on cooling design, climate, workload, and whether the site can rely on outside-air cooling or reclaimed water.",
      },
      {
        question: "Should I assume my local drinking water is unsafe if a new data center is announced nearby?",
        answer:
          "No. But you should ask what water source it will use, how wastewater will be managed, and what public reporting will be available.",
      },
      {
        question: "Is the AI water problem mainly a problem in dry states?",
        answer:
          "It is more concentrated in stressed basins, but not limited to them. Over two-thirds of data centers built in the U.S. since 2022 are in high water-stress areas, and the transparency gap applies everywhere.",
      },
    ],
    sources: [
      {
        label: "TNFD — Nature-related issues in the technology sector: Water dependency of semiconductor and data centre industries (February 2026)",
        url: "https://tnfd.global/wp-content/uploads/2026/02/Case-study_Water-dependency-of-the-tech-sector_DIGITAL.pdf",
      },
      {
        label: "Reuters — Investors press Amazon, Microsoft and Google on water, power use in US data centers (April 2026)",
        url: "https://www.reuters.com/sustainability/boards-policy-regulation/investors-press-amazon-microsoft-google-water-power-use-us-data-centers-2026-04-06/",
      },
      {
        label: "University of Illinois CHBE — New review identifies pathways for managing PFAS waste in semiconductor manufacturing (February 2026)",
        url: "https://chbe.illinois.edu/news/stories/new-review-identifies-pathways-for-managing-pfas-waste-in-semiconductor-manufacturing",
      },
      {
        label: "UK Government / Government Digital Sustainability Alliance — Water use in data centre and AI report",
        url: "https://assets.publishing.service.gov.uk/media/688cb407dc6688ed50878367/Water_use_in_data_centre_and_AI_report.pdf",
      },
    ],
    relatedArticles: [
      "ai-data-centers-cooling-tower-blowdown",
      "ai-chip-boom-water-quality-story",
      "water-positive-data-centers-local-verification",
    ],
    relatedGuides: [
      "best-filter-for-pfas-in-drinking-water",
      "reverse-osmosis-vs-carbon-filter",
      "how-to-read-a-water-quality-report",
    ],
  },

  // ── ARTICLE 2 ──────────────────────────────────────────────────────────────
  {
    slug: "ai-data-centers-cooling-tower-blowdown",
    title: "The hidden wastewater problem of AI data centers: what cooling-tower blowdown actually is",
    metaTitle: "Cooling-Tower Blowdown Explained: The Hidden Water-Quality Issue in AI Data Centers",
    metaDescription:
      "The water story around AI data centers is not just about how much water they use. It is also about what gets concentrated and discharged. Here's what cooling-tower blowdown is and why it matters.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "ai-water",
    categoryLabel: "AI & Water",
    tags: ["cooling-tower", "blowdown", "wastewater", "data-centers", "ai", "water-quality"],
    readingTimeMin: 6,
    keyTakeaways: [
      "Cooling-tower blowdown is the concentrated wastewater left behind when cooling systems evaporate water — dissolved solids and treatment chemicals do not evaporate with it.",
      "Blowdown can contain elevated salts, heavy metals, biocides, corrosion inhibitors, and altered pH depending on source water and chemical treatment program.",
      "Recycled water can reduce pressure on drinking-water supplies, but it does not eliminate water-quality management — it changes the chemistry challenge.",
      "The right question is not just how much water a data center uses, but where that water goes and what is in it when it leaves.",
      "Communities should ask about discharge volumes, expected chemistry, pretreatment requirements, and whether local wastewater systems have assessed cumulative load.",
    ],
    intro:
      "When most people hear that AI data centers use water, they picture one problem: a building pulling huge volumes of freshwater out of a local utility system. That is part of the story. But the water-quality side usually hides in a more technical phrase: cooling-tower blowdown.",
    blocks: [
      { t: "h2", c: "What blowdown is, in plain English" },
      {
        t: "p",
        c: "Many data centers reject heat by circulating water through cooling systems. In systems that rely on evaporative cooling, some of that water evaporates into the air. The water that evaporates is relatively pure. What stays behind is a more concentrated mix of whatever was dissolved in the water to begin with, plus whatever treatment chemicals were added to keep the system operating safely.",
      },
      {
        t: "p",
        c: "That remaining concentrated water must be discharged, treated, or reused. The intentional removal of that concentrated water is called **blowdown**.",
      },
      {
        t: "p",
        c: "Think of boiling salty water in a pot. As steam leaves, the salts do not. The remaining water gets more concentrated. Cooling systems face a similar concentration problem, just in an industrial setting and with tighter operational controls.",
      },
      { t: "h2", c: "Why blowdown matters" },
      {
        t: "p",
        c: "The basic engineering goal of blowdown is reasonable: prevent minerals, salts, corrosion, scale, and biological growth from damaging the cooling system. The water-quality question begins when that concentrated stream leaves the cooling system.",
      },
      {
        t: "p",
        c: "A February 2026 TNFD case study says data centers can affect water quality when **wastewater from evaporative cooling** is mismanaged and notes that this stream can contain **high concentrations of salts, heavy metals, and other pollutants**.",
      },
      {
        t: "p",
        c: "That does not automatically mean a data center is violating permits or dumping toxic water into a river. It means the quality of the discharge matters, the treatment approach matters, and the local receiving system matters. A small, well-managed discharge going to a system designed to handle it is one thing. Multiple facilities in one basin, all producing concentrated discharges and relying on the same wastewater infrastructure, is another.",
      },
      { t: "h2", c: "What can be in blowdown?" },
      {
        t: "p",
        c: "The answer depends on source water, chemistry, treatment program, and how many cycles of concentration the operator is running. In broad terms, blowdown can contain:",
      },
      {
        t: "ul",
        items: [
          "Elevated total dissolved solids (TDS)",
          "Salts and hardness minerals",
          "Treatment residuals such as chlorine-related compounds or biocides",
          "Corrosion inhibitors",
          "Altered pH",
          "Metals that accumulate through system contact and concentration",
        ],
      },
      {
        t: "p",
        c: "This is why water reuse and cooling-water literature spends so much time on scaling, corrosion, microbial control, and pretreatment.",
      },
      {
        t: "table",
        headers: ["Cooling system stage", "Main water-quality concern"],
        rows: [
          ["Intake", "Potable vs reclaimed source type"],
          ["Cooling loop", "Scaling, corrosion, microbial growth"],
          ["Chemical treatment", "Biocides, inhibitors, pH adjustment"],
          ["Blowdown", "Concentrated TDS, metals, residual treatment chemicals"],
          ["Disposal or reuse", "Treatment capacity and compliance burden"],
        ],
      },
      { t: "h2", c: "Why AI may make this more visible" },
      {
        t: "p",
        c: "AI workloads increase heat density. More heat generally means more cooling demand. The Environmental and Energy Study Institute notes that data-center water use closely parallels energy use and that larger data centers can consume very large quantities of water when water-based cooling is used.",
      },
      {
        t: "p",
        c: "The more AI pushes operators toward higher-density compute, the more closely communities will examine what kind of cooling system is being used, whether the site uses potable or reclaimed water, how much blowdown is generated, where that blowdown goes, and whether local wastewater plants have the capacity to handle it.",
      },
      {
        t: "callout",
        c: 'This is one reason the public conversation is shifting from "How many gallons?" to "What happens to the water after use?"',
        variant: "info",
      },
      { t: "h2", c: "Recycled water helps — but it does not erase the quality question" },
      {
        t: "p",
        c: "A common response from the industry is to use more recycled or reclaimed water instead of drinking water. That is often a good idea. Amazon says AWS is expanding recycled-water use from 24 to more than 120 U.S. locations and expects the shift to preserve over 530 million gallons of drinking water annually.",
      },
      {
        t: "p",
        c: "But recycled water does not eliminate water-quality management. It changes it. Reclaimed water may already carry a different chemistry than potable water. That can increase the need for pretreatment, corrosion control, scaling control, or more advanced monitoring before the water enters a cooling loop.",
      },
      {
        t: "callout",
        c: "Recycled water can reduce pressure on drinking-water supplies, but it still requires strong operational control to avoid creating downstream water-quality problems.",
        variant: "info",
      },
      { t: "h2", c: "Why local wastewater systems matter" },
      {
        t: "p",
        c: "A frequent blind spot in data-center debates is the role of the local wastewater utility. Cooling-tower blowdown is not simply a private on-site issue if it is discharged to a municipal treatment plant or another shared system.",
      },
      {
        t: "p",
        c: "A 2026 PLOS Water paper on datacenter-driven water insecurity argues that local governments and utilities do not always readily provide water-use data tied to data-center operations and calls for public records to be requested and shared so communities can evaluate the tradeoffs.",
      },
      { t: "p", c: "If a region is adding multiple high-density data centers, a useful public checklist includes:" },
      {
        t: "ul",
        items: [
          "Total expected discharge volumes",
          "Expected TDS and chemistry ranges",
          "Pretreatment requirements",
          "Discharge destination",
          "Whether reclaimed water is part of the system",
          "Whether the receiving utility has evaluated cumulative load",
        ],
      },
      { t: "h2", c: "What communities should ask" },
      {
        t: "p",
        c: "If a data-center project is being proposed nearby, these are the right water-quality questions:",
      },
      {
        t: "ol",
        items: [
          "Will the site use evaporative cooling, closed-loop cooling, or mainly air cooling?",
          "Will it use potable water, reclaimed water, or both?",
          "What chemicals are used to manage scaling, corrosion, and microbial growth?",
          "How much blowdown will be produced under average and peak conditions?",
          "Where will that blowdown go?",
          "What pretreatment is required before discharge or reuse?",
          "What public monitoring and reporting will be available?",
        ],
      },
      { t: "h2", c: "What this means for households" },
      {
        t: "p",
        c: "Most households do not need to become cooling-system experts. But understanding blowdown helps people ask better questions when they hear claims that a facility is 'water efficient' or 'using recycled water.' Those claims may be true — and still leave unanswered questions about wastewater management.",
      },
      {
        t: "ul",
        items: [
          "Know your utility",
          "Read your local reports",
          "Understand which contaminants already matter in your area",
          "Watch how major industrial water users in your basin are permitted and monitored",
        ],
      },
      {
        t: "p",
        c: "A stronger local water system is not only about what comes out of your tap. It is also about what enters your watershed, your wastewater system, and your source waters upstream.",
      },
    ],
    faqs: [
      {
        question: "Is cooling-tower blowdown always hazardous waste?",
        answer:
          "No. But it can contain concentrated dissolved solids and treatment chemicals that require proper handling and permitting depending on the chemistry and volume.",
      },
      {
        question: "Do all data centers create blowdown?",
        answer:
          "No. It depends on the cooling design. Facilities that rely mainly on outside-air cooling or certain closed-loop approaches may use much less water and produce less blowdown.",
      },
      {
        question: "Can blowdown be treated and reused?",
        answer:
          "Sometimes yes. Water-reuse technologies can reduce discharge and improve resilience, but they add cost and operational complexity.",
      },
      {
        question: "Is cooling-tower blowdown regulated?",
        answer:
          "Yes, in most jurisdictions. Discharge to municipal systems or receiving waters requires permits, but standards vary significantly by state and municipality.",
      },
    ],
    sources: [
      {
        label: "TNFD — Nature-related issues in the technology sector: Water dependency of semiconductor and data centre industries (February 2026)",
        url: "https://tnfd.global/wp-content/uploads/2026/02/Case-study_Water-dependency-of-the-tech-sector_DIGITAL.pdf",
      },
      {
        label: "Pacific Northwest National Laboratory — Water Reuse Systems for Cooling Tower Applications (2024)",
        url: "https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-34788.pdf",
      },
      {
        label: "EESI — Data Centers and Water Consumption (June 2025)",
        url: "https://www.eesi.org/articles/view/data-centers-and-water-consumption",
      },
      {
        label: "Amazon Sustainability — How AWS uses recycled water in data centers (November 2025)",
        url: "https://sustainability.aboutamazon.com/stories/how-aws-uses-recycled-water-in-data-centers",
      },
      {
        label: "Shah et al. — Four water insecurity concerns about datacenters driving the AI revolution (PLOS Water, 2026)",
        url: "https://journals.plos.org/water/article/file?id=10.1371%2Fjournal.pwat.0000500&type=printable",
      },
    ],
    relatedArticles: [
      "is-ai-making-your-water-worse",
      "ai-chip-boom-water-quality-story",
      "questions-before-approving-ai-data-center-water-risk",
    ],
    relatedGuides: [
      "best-filter-for-pfas-in-drinking-water",
      "reverse-osmosis-vs-carbon-filter",
      "whole-house-filter-vs-under-sink-filter",
    ],
  },

  // ── ARTICLE 3 ──────────────────────────────────────────────────────────────
  {
    slug: "ai-chip-boom-water-quality-story",
    title: "The AI chip boom may be a bigger water-quality story than the data centers themselves",
    metaTitle: "Why the AI Chip Boom May Matter More Than Data Centers for Water Quality",
    metaDescription:
      "AI's water footprint does not begin and end at the data center. Semiconductor manufacturing may be the bigger long-term water-quality story.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "ai-water",
    categoryLabel: "AI & Water",
    tags: ["semiconductor", "pfas", "chip-manufacturing", "ultrapure-water", "ai", "water-quality"],
    readingTimeMin: 6,
    keyTakeaways: [
      "Global semiconductor manufacturing uses an estimated 210 trillion liters of water — compared to 66 billion liters for U.S. data centers in 2023.",
      "A single large chip factory can produce thousands of cubic meters of wastewater daily, containing PFAS, solvents, metals, and salts.",
      "PFAS are used in semiconductor manufacturing for their functional properties in photolithography and etching — making wastewater management complex.",
      "The AI water story extends from the chip fab to the data center. Focusing only on cooling towers misses the larger upstream footprint.",
      "Households mostly experience this indirectly, but the treatment challenges at the industrial level overlap with the same contaminants of concern at the household level.",
    ],
    intro:
      "If you only look at data centers, you are looking at the visible part of AI's water footprint. Data centers are local, tangible, and politically visible. But if your real concern is water quality, the more important question may be upstream: what happens before the server ever reaches the data center? That question leads to semiconductors.",
    blocks: [
      { t: "h2", c: "The bigger water dependency sits upstream" },
      {
        t: "p",
        c: "A February 2026 TNFD case study says the global semiconductor industry consumes around **210 trillion liters of water**. That figure is so large that it changes how you think about AI's water story.",
      },
      {
        t: "p",
        c: "It means the water used to make the chips that train and run AI systems is not a side note. It is part of the core system. Semiconductor manufacturing depends on extremely clean process water, often called **ultrapure water (UPW)**. The more advanced and contamination-sensitive the process, the more important water purity becomes.",
      },
      {
        t: "table",
        headers: ["Metric", "Value", "Source"],
        rows: [
          ["Estimated U.S. data center operational water use in 2023", "66 billion liters", "TNFD"],
          ["Global semiconductor industry water consumption", "~210 trillion liters", "TNFD"],
          [
            "Typical large fab wastewater output",
            "Thousands of cubic meters per day",
            "Univ. of Illinois / 2026 review",
          ],
        ],
      },
      { t: "h2", c: "Why semiconductor wastewater is harder to simplify" },
      {
        t: "p",
        c: "A February 2026 University of Illinois summary of a new review on PFAS waste in semiconductor manufacturing quotes one researcher saying that a **single large factory can produce thousands of cubic meters of wastewater per day**, containing a 'soup' of PFAS mixed with solvents, metals, and salts.",
      },
      {
        t: "p",
        c: "That phrase matters because it captures the real challenge: complexity. A typical fab does not produce one neat wastewater stream with one contaminant and one treatment solution. It produces a mixture of streams tied to hundreds or even thousands of manufacturing steps, each with its own chemistry.",
      },
      {
        t: "p",
        c: "That is much harder to explain — and much harder to regulate and treat — than a generic headline about data centers using a lot of water.",
      },
      { t: "h2", c: "PFAS are part of the chip conversation" },
      {
        t: "p",
        c: "PFAS are already familiar to many Water Utility Report readers as a drinking-water issue. What is less familiar is their connection to semiconductor manufacturing. The Illinois summary says PFAS play a central role in modern chipmaking because of their functional properties in complex chemical processes like photolithography and etching.",
      },
      {
        t: "p",
        c: "That does not mean every semiconductor wastewater discharge is loading drinking water with PFAS. It does mean PFAS management in the semiconductor supply chain is now part of the AI water discussion. And because PFAS are persistent and technically challenging to remove, the burden of proving good management is high.",
      },
      { t: "h2", c: "Why this may matter more than data-center cooling in the long run" },
      { t: "p", c: "The data-center water story is easier for the public to understand: a site opens, cooling demand rises, local withdrawals increase, local communities worry. The semiconductor story is less visible but potentially deeper." },
      { t: "p", c: "It combines:" },
      {
        t: "ul",
        items: [
          "Very high water demand",
          "Tightly controlled water-purity requirements",
          "Chemically complex wastewater",
          "Global supply-chain concentration",
          "Recurring concern over emerging contaminants like PFAS",
        ],
      },
      {
        t: "p",
        c: "In short, it is the kind of industrial water story that can be very consequential even when it is not obvious to the average household.",
      },
      { t: "h2", c: "But households still experience this indirectly" },
      { t: "p", c: "Most households do not live next to a semiconductor fab. So why should they care? There are three reasons." },
      { t: "h3", c: "1. AI's true water footprint is broader than the data center in your county" },
      {
        t: "p",
        c: "If you only count local cooling water, you miss a large chunk of the environmental system that supports AI. That matters for anyone trying to think clearly about AI's environmental claims.",
      },
      { t: "h3", c: "2. Semiconductor pollution management affects downstream watersheds" },
      {
        t: "p",
        c: "Industrial discharges, treatment performance, and waste-management practices can affect rivers, basins, and groundwater systems well beyond the immediate site — including in regions without semiconductor manufacturing.",
      },
      { t: "h3", c: "3. The treatment technologies overlap with household water concerns" },
      {
        t: "p",
        c: "The Illinois summary notes that many technologies being studied for PFAS management in semiconductor waste have roots in the broader water-treatment field but need significant adaptation for complex industrial streams. The same broad categories of contamination challenge — PFAS, metals, dissolved salts, advanced treatment — show up again at the household level, just in a very different context.",
      },
      { t: "h2", c: "Why the current public debate is incomplete" },
      {
        t: "callout",
        c: "Data centers are the visible local water-demand issue. Chip manufacturing may be the less visible but more chemically complex water-quality issue. Once you see that split, many of the headlines start to look too narrow.",
        variant: "highlight",
      },
      { t: "h2", c: "What would better accountability look like?" },
      { t: "p", c: "If policymakers and communities want a fuller picture of AI's water impact, they should ask for disclosure and governance on both sides of the chain." },
      { t: "h3", c: "For data centers:" },
      {
        t: "ul",
        items: [
          "Site-level withdrawals",
          "Cooling design",
          "Discharge handling",
          "Reclaimed-water use",
        ],
      },
      { t: "h3", c: "For semiconductor supply chains:" },
      {
        t: "ul",
        items: [
          "Water intensity disclosure",
          "Wastewater characterization and treatment standards",
          "PFAS management plans",
          "Basin-level risk assessment where fabs cluster with data centers",
        ],
      },
      {
        t: "p",
        c: "TNFD's case study is useful because it puts data centers and semiconductor manufacturing in the same water-risk frame rather than treating them as separate stories. That is the right direction.",
      },
      { t: "h2", c: "The household takeaway" },
      {
        t: "p",
        c: "For Water Utility Report readers, the main practical lesson is not that every household needs to study fabs. It is that the AI-water story is bigger than local demand headlines.",
      },
      {
        t: "p",
        c: "If your concern is drinking water, you still need to start with your own utility or well situation, your local contaminant profile, credible treatment guidance, and trusted monitoring and reporting. But if you want to understand where AI may matter most for water quality over the next decade, do not stop at the server farm. Follow the chips.",
      },
    ],
    faqs: [
      {
        question: "What is ultrapure water?",
        answer:
          "Ultrapure water is highly purified water used in semiconductor manufacturing where even tiny impurities can damage production processes. It requires extensive treatment to produce and generates wastewater during that process.",
      },
      {
        question: "Are PFAS definitely used in chipmaking?",
        answer:
          "Yes. PFAS are used in parts of semiconductor manufacturing for their chemical properties in processes like photolithography and etching. PFAS waste management in this industry is now an active area of research and policy attention.",
      },
      {
        question: "Is this only a problem in Asia?",
        answer:
          "No. Semiconductor water dependency is global, and fabs in the U.S. and other regions also matter — especially where water stress is already high.",
      },
      {
        question: "How does semiconductor wastewater differ from data center wastewater?",
        answer:
          "Semiconductor wastewater is generally far more chemically complex — a mixture of PFAS, solvents, metals, and salts from hundreds of different process steps. Data center blowdown is simpler chemically but can still contain concentrated minerals and treatment chemicals.",
      },
    ],
    sources: [
      {
        label: "TNFD — Nature-related issues in the technology sector: Water dependency of semiconductor and data centre industries (February 2026)",
        url: "https://tnfd.global/wp-content/uploads/2026/02/Case-study_Water-dependency-of-the-tech-sector_DIGITAL.pdf",
      },
      {
        label: "University of Illinois CHBE — New review identifies pathways for managing PFAS waste in semiconductor manufacturing (February 2026)",
        url: "https://chbe.illinois.edu/news/stories/new-review-identifies-pathways-for-managing-pfas-waste-in-semiconductor-manufacturing",
      },
    ],
    relatedArticles: [
      "is-ai-making-your-water-worse",
      "ai-data-centers-cooling-tower-blowdown",
      "water-positive-data-centers-local-verification",
    ],
    relatedGuides: [
      "best-filter-for-pfas-in-drinking-water",
      "best-filter-for-lead-in-tap-water",
      "what-does-lead-in-tap-water-actually-mean",
    ],
  },

  // ── ARTICLE 4 ──────────────────────────────────────────────────────────────
  {
    slug: "water-positive-data-centers-local-verification",
    title: "Big Tech says it's 'water positive.' Can anyone verify that locally?",
    metaTitle: "Big Tech Says It's Water Positive. Can Anyone Verify That Locally?",
    metaDescription:
      "Water-positive claims sound reassuring, but local communities need site-level data, not just broad sustainability language. Here's what to verify and why it matters.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "ai-water",
    categoryLabel: "AI & Water",
    tags: ["water-positive", "transparency", "data-centers", "sustainability", "policy", "ai"],
    readingTimeMin: 5,
    keyTakeaways: [
      "'Water positive' is a corporate sustainability target — not a verified local water-risk assessment.",
      "Meta's total water use rose 51% from 2020 to 2024, even as sustainability commitments grew.",
      "Recycled water can reduce potable demand, but it does not answer all local water questions.",
      "The most useful claims are verifiable at the regional or site level — not company-wide averages.",
      "Communities should require five specific things in writing: demand data, source breakdown, cooling design, discharge handling, and replenishment geography.",
    ],
    intro:
      "'Water positive' sounds like the kind of phrase that should settle a debate. If a company says it will replenish more water than it consumes, many people assume the local water question has been answered. It has not.",
    blocks: [
      {
        t: "p",
        c: "That does not mean the commitment is meaningless. It means the phrase is often doing two jobs at once: describing a broad sustainability goal, and standing in for local details that communities still need in order to assess risk.",
      },
      { t: "h2", c: "What 'water positive' usually means" },
      {
        t: "p",
        c: "At a high level, water-positive commitments usually refer to a company's intention to return, replenish, restore, or save more water than it directly consumes over time. That can include:",
      },
      {
        t: "ul",
        items: [
          "Recycled-water adoption",
          "Watershed restoration",
          "Leak reduction programs",
          "Habitat projects",
          "Utility partnerships",
          "Infrastructure investments",
        ],
      },
      {
        t: "p",
        c: "Those efforts may be worthwhile. But they do not automatically tell a local resident how much potable water a site will withdraw this summer, whether the facility sits in a stressed basin, what cooling system it uses, what kind of wastewater it generates, or whether the local utility or wastewater system is comfortable with the added burden.",
      },
      {
        t: "callout",
        c: "This is the gap between a sustainability claim and a local water-risk assessment.",
        variant: "highlight",
      },
      { t: "h2", c: "Why this issue is getting more scrutiny" },
      {
        t: "p",
        c: "Reuters reported in April 2026 that shareholders were pressing Amazon, Microsoft, and Google for more detailed data on water and power use at U.S. data centers. According to the same report, **North American data centers used nearly 1 trillion liters of water in 2025**.",
      },
      {
        t: "p",
        c: "Reuters also reported that Meta's total water use rose **51%**, from 3,726 megaliters in 2020 to 5,637 megaliters in 2024. That does not mean every company is hiding something. It does mean local stakeholders increasingly want more than high-level corporate sustainability language.",
      },
      {
        t: "table",
        headers: ["Company / Measure", "Figure", "Source"],
        rows: [
          ["Meta water use 2020", "3,726 megaliters", "Reuters"],
          ["Meta water use 2024", "5,637 megaliters", "Reuters"],
          ["Increase", "51%", "Reuters"],
          ["AWS recycled-water locations", "24 → 120+", "Amazon"],
          ["AWS drinking water preserved annually", "530+ million gallons", "Amazon"],
          ["North American data center water use in 2025", "~1 trillion liters", "Reuters"],
        ],
      },
      { t: "h2", c: "The recycled-water example is useful — but incomplete" },
      {
        t: "p",
        c: "Amazon offers a good example of both progress and limitation. AWS says it is expanding the use of recycled water from 24 to more than 120 U.S. locations and expects that move to preserve more than 530 million gallons of drinking water annually. That is meaningful.",
      },
      { t: "p", c: "But even a strong recycled-water story does not answer all local questions. Communities still need to know:" },
      {
        t: "ul",
        items: [
          "Will the site use recycled water year-round or only seasonally?",
          "What treatment is required before use?",
          "What happens to the concentrated blowdown afterward?",
          "What does peak summer demand look like?",
          "What is the backup water source if recycled-water supply is interrupted?",
        ],
      },
      {
        t: "p",
        c: "In other words, recycled water is part of the answer. It is not the whole answer.",
      },
      { t: "h2", c: "Microsoft's new reporting move points in the right direction" },
      {
        t: "p",
        c: "In January 2026, Reuters reported that Microsoft pledged to start publishing **water-use information for each U.S. data center region**, along with progress on replenishment. That is a step toward the kind of reporting communities actually need.",
      },
      {
        t: "p",
        c: "Microsoft's public explainer says many of its datacenters can cool using outside air for much of the year and that the company works with local utilities to avoid straining supplies when water is needed. Those are positive signals. But they also highlight a broader point: **the most useful claims are the ones that become verifiable at the regional or site level**.",
      },
      { t: "h2", c: "Why local verification matters more than ever" },
      {
        t: "p",
        c: "A broad replenishment claim can mask local mismatch. A company may replenish water in one place while increasing stress in another. A company may improve water efficiency overall while still becoming a major new user in a basin facing drought or infrastructure constraints.",
      },
      { t: "p", c: "That is why the UK government-linked report on AI and data-center water use recommends **mandatory, location-based reporting** and says it is both feasible and necessary." },
      { t: "p", c: "A company can be serious about stewardship and still need to prove:" },
      {
        t: "ul",
        items: [
          "Where water is withdrawn",
          "What type of water is used",
          "How much is consumed, not just withdrawn",
          "How much is returned and in what quality",
          "Where replenishment projects occur",
          "Whether the geography of replenishment matches the geography of risk",
        ],
      },
      { t: "h2", c: "What a local community should ask for" },
      {
        t: "p",
        c: "If a tech company says a project is 'water positive,' a city or utility should ask for five concrete things:",
      },
      {
        t: "ol",
        items: [
          "Annual and peak-season water demand by site or region",
          "Breakdown of potable, recycled, and other source-water use",
          "Cooling technology description",
          "Discharge, pretreatment, and wastewater handling plan",
          "Location of replenishment projects relative to the stressed basin in question",
        ],
      },
      {
        t: "callout",
        c: "Without those five items, 'water positive' is mostly a brand statement. With those, it starts to become operationally meaningful.",
        variant: "highlight",
      },
      { t: "h2", c: "What this means for households" },
      {
        t: "p",
        c: "Most households do not need to audit a hyperscaler's ESG report. But the phrase 'water positive' should not end your curiosity if a large project is being discussed nearby. For residents, the practical move is to ask whether local water utilities and wastewater agencies have the same confidence in the project that the company's sustainability language implies.",
      },
      {
        t: "p",
        c: "Water Utility Report's role in that conversation is different from a corporate sustainability page. Our job is to help readers connect broad water claims to local water systems, local contaminants, and local decision-making — looking past the slogan and asking where the gallons actually move.",
      },
    ],
    faqs: [
      {
        question: "Is water positive the same as low water use?",
        answer:
          "No. A company can pursue replenishment projects and still use a large amount of water locally.",
      },
      {
        question: "Does recycled water automatically make a site water positive?",
        answer:
          "No. Recycled water can reduce potable-water demand, but water-positive claims usually involve a broader accounting framework across multiple sites and project types.",
      },
      {
        question: "Can a company replenish water somewhere else and still say it is water positive?",
        answer:
          "Sometimes yes, under certain accounting frameworks — which is exactly why location-based reporting matters for local communities.",
      },
      {
        question: "What should communities ask for instead of taking sustainability claims at face value?",
        answer:
          "Annual and peak-season demand by site, source-water type breakdown, cooling technology description, wastewater handling plan, and the location of replenishment projects relative to the affected basin.",
      },
    ],
    sources: [
      {
        label: "Reuters — Investors press Amazon, Microsoft and Google on water, power use in US data centers (April 2026)",
        url: "https://www.reuters.com/sustainability/boards-policy-regulation/investors-press-amazon-microsoft-google-water-power-use-us-data-centers-2026-04-06/",
      },
      {
        label: "Amazon Sustainability — How AWS uses recycled water in data centers (November 2025)",
        url: "https://sustainability.aboutamazon.com/stories/how-aws-uses-recycled-water-in-data-centers",
      },
      {
        label: "Reuters — Microsoft rolls out initiative to limit data-center power costs, water use impact (January 2026)",
        url: "https://www.reuters.com/business/microsoft-launches-data-center-initiative-limit-power-costs-water-use-2026-01-13/",
      },
      {
        label: "Microsoft Local — Understanding water use at Microsoft datacenters (2026)",
        url: "https://local.microsoft.com/blog/understanding-water-use-at-microsoft-datacenters/",
      },
      {
        label: "UK Government / Government Digital Sustainability Alliance — Water use in data centre and AI report",
        url: "https://assets.publishing.service.gov.uk/media/688cb407dc6688ed50878367/Water_use_in_data_centre_and_AI_report.pdf",
      },
    ],
    relatedArticles: [
      "is-ai-making-your-water-worse",
      "ai-chip-boom-water-quality-story",
      "questions-before-approving-ai-data-center-water-risk",
    ],
    relatedGuides: ["how-to-read-a-water-quality-report", "best-filter-for-pfas-in-drinking-water"],
  },

  // ── ARTICLE 5 ──────────────────────────────────────────────────────────────
  {
    slug: "questions-before-approving-ai-data-center-water-risk",
    title: "What should communities ask before approving a new AI data center? A water-risk checklist",
    metaTitle: "Before Approving a New AI Data Center, Ask These Water Questions",
    metaDescription:
      "Water demand is only the start. Communities should ask where the water comes from, how cooling works, what wastewater is generated, and what local data will be public.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "ai-water",
    categoryLabel: "AI & Water",
    tags: ["community", "policy", "data-centers", "water-risk", "checklist", "permitting", "ai"],
    readingTimeMin: 5,
    keyTakeaways: [
      "Texas data centers could use 29 to 161 billion gallons of water by 2030, while over 80% of the state was in drought in April 2025.",
      "Peak-season demand is often more important than annual averages for utility planning.",
      "Cooling system type determines most of the water, energy, and wastewater profile of a data center project.",
      "A basin-level cumulative impact assessment matters as much as a single-site permit review.",
      "Communities need public reporting commitments in writing — not just pre-approval promises.",
    ],
    intro:
      "By the time a community is arguing about whether an AI data center should be approved, the public debate is often already distorted. One side says economic engine. The other says drain the town dry. Neither position is specific enough to be useful. The real question is whether the local water system can absorb the project without pushing risk onto residents — and that requires better questions.",
    blocks: [
      { t: "h2", c: "The 10-question checklist" },
      { t: "h3", c: "1. How much water will the project use on an average day?" },
      {
        t: "p",
        c: "Start with the basic number, but do not stop there. Average-day demand is the baseline for utility planning, but it can hide the times of year when the system is actually under stress.",
      },
      { t: "h3", c: "2. What will peak-day or peak-season water demand be?" },
      {
        t: "p",
        c: "This may be the more important number. A facility that looks manageable on an annual average can still create major strain during heat waves, drought restrictions, or summer demand peaks. If the operator cannot provide a credible peak-demand estimate, the review process is incomplete.",
      },
      { t: "h3", c: "3. Will the site use potable water, reclaimed water, or both?" },
      {
        t: "p",
        c: "This is one of the fastest ways to distinguish between a weak and a serious proposal. If reclaimed water is available and technically viable, the public should know whether the developer evaluated it and why it was or was not chosen. Amazon's recycled-water expansion shows that this is technically and operationally plausible at scale in at least some markets.",
      },
      { t: "h3", c: "4. What type of cooling system will be used?" },
      {
        t: "p",
        c: "This question shapes almost everything else. Communities should ask whether the site will rely primarily on:",
      },
      {
        t: "ul",
        items: [
          "Outside-air cooling",
          "Evaporative cooling",
          "Closed-loop systems",
          "Hybrid systems",
          "Chilled-water systems",
        ],
      },
      {
        t: "p",
        c: "The water, energy, and wastewater profile can look very different depending on that choice.",
      },
      { t: "h3", c: "5. What happens during drought or utility restrictions?" },
      {
        t: "p",
        c: "This is where many project reviews get vague. The community should ask for a written drought and curtailment plan that answers:",
      },
      {
        t: "ul",
        items: [
          "Will the facility reduce load?",
          "Switch water sources?",
          "Draw on stored water?",
          "Compete with residential demand?",
          "Trigger emergency utility upgrades?",
        ],
      },
      {
        t: "p",
        c: "A January 2026 HARC white paper estimates Texas data centers will consume **25 billion gallons** of water in 2025 and could rise to **29 to 161 billion gallons by 2030**, while noting that **over 80% of Texas was in drought in April 2025** and **17% was in exceptional drought**.",
      },
      {
        t: "table",
        headers: ["Texas data center metric", "Value", "Source"],
        rows: [
          ["Water use in 2025", "25 billion gallons", "HARC"],
          ["Water use in 2030 (projection)", "29–161 billion gallons", "HARC"],
          ["Share of state annual water use in 2030", "0.5%–2.7%", "HARC"],
          ["Texas in drought, April 2025", "Over 80%", "HARC"],
          ["Texas in exceptional drought, April 2025", "17%", "HARC"],
        ],
      },
      { t: "h3", c: "6. What wastewater will the facility generate, and where will it go?" },
      {
        t: "p",
        c: "Do not let the conversation stop at withdrawals. A data center that uses evaporative cooling may generate concentrated blowdown that needs to be managed through pretreatment, discharge, reuse, or other pathways. TNFD explicitly warns that wastewater from evaporative cooling can leave behind **high concentrations of salts, heavy metals, and other pollutants** when mismanaged.",
      },
      {
        t: "ul",
        items: [
          "What is the expected discharge chemistry?",
          "What pretreatment is required?",
          "Which utility or receiving water body will take it?",
          "Has the receiving system assessed cumulative load if more facilities are coming?",
        ],
      },
      { t: "h3", c: "7. What local data will be public after approval?" },
      {
        t: "p",
        c: "This is one of the most important questions, because it determines whether the community can verify what was promised. A UK government-linked AI and water report recommends **mandatory, location-based reporting** and more explicit integration of water planning into data-center and AI infrastructure development.",
      },
      { t: "p", c: "At minimum, public reporting should include:" },
      {
        t: "ul",
        items: [
          "Annual and peak water demand",
          "Source-water type",
          "Cooling type",
          "Discharge volumes",
          "Major changes to operations",
          "Drought-response measures",
        ],
      },
      { t: "h3", c: "8. Has the project been evaluated at the basin level, not just the parcel level?" },
      {
        t: "p",
        c: "A single project may appear manageable in isolation. A cluster of projects in the same basin can be a different story. A 2026 PLOS Water paper warns that data-center development can undermine water governance, contribute to unsustainable water use, reduce flexibility in water decision-making, and increase water use across scales through electricity demand.",
      },
      {
        t: "p",
        c: "That means a permit review should ask not only 'Can this site work?' but also 'What happens if five more sites are approved nearby?'",
      },
      { t: "h3", c: "9. Is the company's local story consistent with its public sustainability story?" },
      {
        t: "p",
        c: "If the company says it is water positive, using recycled water, or minimizing strain on utilities, the permit process should ask for evidence that those claims apply to this specific site. Broad ESG language is not enough. The local utility agreement, engineering documents, and reporting commitments are what matter.",
      },
      { t: "h3", c: "10. What is the fallback if assumptions fail?" },
      { t: "p", c: "Every review process should ask what happens if:" },
      {
        t: "ul",
        items: [
          "Recycled-water supply is interrupted",
          "Demand runs higher than modeled",
          "Wastewater treatment is more difficult than expected",
          "Drought restrictions tighten",
          "Neighboring projects move forward sooner than expected",
        ],
      },
      { t: "p", c: "If there is no clear fallback plan, the water-risk review is not complete." },
      { t: "h2", c: "The short version: ten things to ask for in writing" },
      {
        t: "ol",
        items: [
          "Average daily water demand",
          "Peak-day or peak-season water demand",
          "Potable vs reclaimed-water split",
          "Cooling system description",
          "Drought contingency plan",
          "Wastewater and blowdown handling plan",
          "Pretreatment and discharge details",
          "Public reporting commitments",
          "Basin-level cumulative impact assessment",
          "Evidence that local operations match public sustainability claims",
        ],
      },
      {
        t: "callout",
        c: "That is enough to separate serious proposals from vague ones.",
        variant: "highlight",
      },
      { t: "h2", c: "Why this matters for Water Utility Report" },
      {
        t: "p",
        c: "Water Utility Report is not a permitting website. But it is a water-intelligence website. That means when readers hear that a major AI project is coming to their region, they should leave with sharper questions — not just stronger opinions.",
      },
      {
        t: "p",
        c: "The most useful water reporting is not the reporting that says 'be worried' or 'don't worry.' It is the reporting that tells people what to verify. That is what this checklist is for.",
      },
    ],
    faqs: [
      {
        question: "Should every community oppose data centers on water grounds?",
        answer:
          "No. Some projects may be well-designed and manageable. The point is to require enough data to know the difference.",
      },
      {
        question: "Is reclaimed water always better?",
        answer:
          "Often, but not automatically. It can reduce potable-water demand, but it still requires careful treatment, monitoring, and contingency planning.",
      },
      {
        question: "Why ask for public reporting after approval?",
        answer:
          "Because promises made during permitting are only useful if the public can later verify whether the site operated as described. Without post-approval reporting, communities have no way to hold operators accountable.",
      },
      {
        question: "What if a data center claims it uses no water at all?",
        answer:
          "Some facilities do rely primarily on outside-air cooling and use minimal water. Ask for documentation of the cooling design and confirmation that water use data will still be publicly reported.",
      },
    ],
    sources: [
      {
        label: "Amazon Sustainability — How AWS uses recycled water in data centers (November 2025)",
        url: "https://sustainability.aboutamazon.com/stories/how-aws-uses-recycled-water-in-data-centers",
      },
      {
        label: "HARC — Thirsty Data and the Lone Star State: The Impact of Data Center Growth on Texas's Water Supply (January 2026)",
        url: "https://harcresearch.org/wp-content/uploads/2026/01/Thirsty-Data-Water-Use-and-The-Projected-Data-Center-Boom-in-Texas.pdf",
      },
      {
        label: "TNFD — Nature-related issues in the technology sector: Water dependency of semiconductor and data centre industries (February 2026)",
        url: "https://tnfd.global/wp-content/uploads/2026/02/Case-study_Water-dependency-of-the-tech-sector_DIGITAL.pdf",
      },
      {
        label: "UK Government / Government Digital Sustainability Alliance — Water use in data centre and AI report",
        url: "https://assets.publishing.service.gov.uk/media/688cb407dc6688ed50878367/Water_use_in_data_centre_and_AI_report.pdf",
      },
      {
        label: "Shah et al. — Four water insecurity concerns about datacenters driving the AI revolution (PLOS Water, 2026)",
        url: "https://journals.plos.org/water/article/file?id=10.1371%2Fjournal.pwat.0000500&type=printable",
      },
    ],
    relatedArticles: [
      "is-ai-making-your-water-worse",
      "ai-data-centers-cooling-tower-blowdown",
      "water-positive-data-centers-local-verification",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
      "best-filter-for-pfas-in-drinking-water",
      "reverse-osmosis-vs-carbon-filter",
    ],
  },
];

export default articles;
