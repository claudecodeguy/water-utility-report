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
        label: "EPA — PFAS Strategic Roadmap: EPA's Commitments to Action",
        url: "https://www.epa.gov/pfas/pfas-strategic-roadmap-epas-commitments-action-2021-2024",
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
        label: "EPA — PFAS Strategic Roadmap: EPA's Commitments to Action",
        url: "https://www.epa.gov/pfas/pfas-strategic-roadmap-epas-commitments-action-2021-2024",
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
  {
    slug: "ucmr5-pfas-water-sampling-explained",
    title: "UCMR 5 PFAS Sampling: What the Records Actually Show",
    metaTitle: "UCMR 5 PFAS Sampling Explained | Water Utility Report",
    metaDescription: "UCMR 5 requires utilities to test for 29 PFAS compounds. Learn what sampling records mean, how to read them, and why a detection is not a violation.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "contaminants",
    categoryLabel: "Contaminants & Records",
    tags: ["PFAS", "UCMR 5", "sampling records", "monitoring"],
    readingTimeMin: 6,
    keyTakeaways: [
      "UCMR 5 requires utilities serving 3,300+ people to test for 29 PFAS compounds through 2025.",
      "A UCMR 5 detection means a compound was measured above the minimum reporting level — it is a monitoring record, not a violation.",
      "EPA uses UCMR 5 data to inform future rulemaking, not to trigger immediate compliance action.",
      "Your utility's sampling records are public and searchable through EPA and Water Utility Report.",
    ],
    intro: "Since 2023, EPA's Unregulated Contaminant Monitoring Rule 5 (UCMR 5) has required thousands of water utilities to test for 29 PFAS compounds. The results are now appearing in public databases — but the records can be confusing. Here is what they actually mean.",
    blocks: [
      { t: "h2", c: "What is UCMR 5?" },
      { t: "p", c: "UCMR 5 is EPA's fifth round of the Unregulated Contaminant Monitoring Rule, running from 2023 through 2025. It requires public water systems serving 3,300 or more people — plus a representative sample of smaller systems — to sample for 29 PFAS compounds and report results to EPA." },
      { t: "h2", c: "What a detection means in the records" },
      { t: "p", c: "Each UCMR 5 result lists whether a compound was detected above the Minimum Reporting Level (MRL). An MRL is the lowest concentration a lab can reliably measure. Detection means the compound was present above that threshold — it does not automatically mean a regulatory limit was exceeded." },
      { t: "callout", variant: "info", c: "UCMR 5 detections are monitoring records. Because PFAS Maximum Contaminant Levels (MCLs) were finalized in April 2024, a utility may have UCMR 5 detections on record while still being in a compliance grace period. Water Utility Report displays these as sampling records, not violations." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "A UCMR 5 detection is not a violation of current drinking water standards.",
        "Water Utility Report does not determine whether any water supply is safe or unsafe to drink.",
        "These records reflect official testing data — they are not emergency alerts.",
        "UCMR 5 results do not tell you about treatment currently in place at your utility.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Search your utility's UCMR 5 sampling records on Water Utility Report.",
        "Review your utility's most recent Consumer Confidence Report for treatment and compliance context.",
        "Check EPA's UCMR 5 data dashboard for national context and compound-level summaries.",
        "If you have questions about a specific detection, contact your utility directly.",
      ]},
    ],
    faqs: [
      { question: "Which utilities had to participate in UCMR 5?", answer: "All community water systems and non-transient non-community systems serving 3,300 or more people were required to participate. EPA also selected a random sample of smaller systems." },
      { question: "Which PFAS compounds does UCMR 5 cover?", answer: "UCMR 5 covers 29 PFAS compounds, including PFOA, PFOS, PFNA, PFHxS, HFPO-DA (GenX), and several PFAS mixtures." },
      { question: "Where can I find my utility's UCMR 5 results?", answer: "Results are publicly available through EPA's UCMR 5 data page and searchable by state and system on Water Utility Report." },
      { question: "Does a UCMR 5 detection mean my utility is out of compliance?", answer: "Not necessarily. UCMR 5 is a monitoring program. EPA finalized PFAS MCLs in April 2024 with a five-year compliance window. A UCMR 5 detection is a monitoring record, not a compliance determination." },
      { question: "What is the Minimum Reporting Level?", answer: "The MRL is the lowest concentration a certified laboratory can reliably measure for a given compound. A detection at or above the MRL is reported; results below are recorded as non-detects." },
    ],
    sources: [
      { label: "EPA — UCMR 5 Overview", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
      { label: "EPA — PFAS National Primary Drinking Water Regulation (April 2024)", url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas" },
    ],
    relatedArticles: [
      "2026-pfas-drinking-water-rule-changes",
      "pfas-detected-but-no-violation",
      "mrl-vs-mcl-drinking-water-results",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
      "best-filter-for-pfas-in-drinking-water",
    ],
  },
  {
    slug: "2026-pfas-drinking-water-rule-changes",
    title: "PFAS Drinking Water Rules in 2026: What Has Changed",
    metaTitle: "PFAS Drinking Water Rule Changes 2026 | Water Utility Report",
    metaDescription: "EPA finalized PFAS MCLs in 2024. Understand the compliance timeline, which compounds are regulated, and how to read your utility's records.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "policy",
    categoryLabel: "Policy & Records",
    tags: ["PFAS", "MCL", "EPA rule", "compliance"],
    readingTimeMin: 5,
    keyTakeaways: [
      "EPA finalized Maximum Contaminant Levels for six PFAS compounds in April 2024.",
      "Utilities have until 2029 to comply — the rule is in effect, but systems are not yet required to meet limits.",
      "PFOA and PFOS limits are set at 4 parts per trillion individually.",
      "Utilities must begin monitoring and public notification under the new rule.",
    ],
    intro: "EPA's April 2024 PFAS drinking water rule established the first-ever federal limits for PFAS in public water supplies. As of 2026, utilities are in the monitoring and transition phase. Here is what the rule requires and what it means for records you may see on Water Utility Report.",
    blocks: [
      { t: "h2", c: "What the 2024 rule established" },
      { t: "p", c: "The National Primary Drinking Water Regulation for PFAS set MCLs for six compounds: PFOA (4 ppt), PFOS (4 ppt), PFNA, PFHxS, HFPO-DA (GenX), and a hazard index for mixtures of PFNA, PFHxS, HFPO-DA, and PFBS." },
      { t: "h2", c: "The compliance timeline" },
      { t: "p", c: "Utilities had until April 2026 to complete initial monitoring. They have until April 2029 to install treatment or make operational changes needed to meet the MCLs. During this window, utilities may have monitoring records showing PFAS detections without being in formal violation." },
      { t: "callout", variant: "info", c: "Monitoring records from 2024–2029 reflect the transition period. A utility with PFAS detections on record may be actively planning compliance actions. Water Utility Report displays official monitoring records — not compliance determinations." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "A monitoring record showing PFAS above 4 ppt does not automatically mean a utility is violating its permit during the compliance transition period.",
        "Water Utility Report does not assess whether a water supply meets current standards.",
        "These records do not describe treatment currently in use at your utility.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Check your utility's PFAS monitoring records on Water Utility Report.",
        "Look for public notice records — utilities must notify customers if PFAS exceed certain levels.",
        "Review your utility's Consumer Confidence Report for information on treatment and compliance plans.",
        "Contact your utility for information on their PFAS compliance timeline.",
      ]},
    ],
    faqs: [
      { question: "When do utilities have to comply with PFAS MCLs?", answer: "Utilities must complete initial monitoring by April 2026 and achieve compliance with MCLs by April 2029." },
      { question: "Which PFAS compounds now have federal limits?", answer: "PFOA and PFOS each have an MCL of 4 parts per trillion. PFNA, PFHxS, and HFPO-DA (GenX) have individual MCLs. There is also a hazard index limit for mixtures of PFNA, PFHxS, HFPO-DA, and PFBS." },
      { question: "What happens if a utility exceeds the MCL during the compliance window?", answer: "Utilities must notify customers and begin planning compliance actions. Formal enforcement actions typically follow after the 2029 compliance deadline." },
      { question: "Are smaller utilities covered by the PFAS rule?", answer: "Yes. The rule applies to all community water systems and non-transient non-community systems, regardless of size." },
      { question: "Where can I find my utility's PFAS monitoring data?", answer: "EPA's UCMR 5 database contains monitoring data collected since 2023. Your utility's CCR and Water Utility Report also display official records." },
    ],
    sources: [
      { label: "EPA — PFAS National Primary Drinking Water Regulation (April 2024)", url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas" },
      { label: "EPA — UCMR 5 Overview", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
    ],
    relatedArticles: [
      "ucmr5-pfas-water-sampling-explained",
      "pfas-detected-but-no-violation",
      "mrl-vs-mcl-drinking-water-results",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
      "best-filter-for-pfas-in-drinking-water",
    ],
  },
  {
    slug: "pfas-detected-but-no-violation",
    title: "PFAS Detected But No Violation Listed: Why That Happens",
    metaTitle: "PFAS Detected But No Violation | Water Utility Report",
    metaDescription: "Your utility may have PFAS in its monitoring records with no violation listed. Here is why that is possible and what the records actually mean.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "contaminants",
    categoryLabel: "Contaminants & Records",
    tags: ["PFAS", "violations", "monitoring records", "UCMR 5"],
    readingTimeMin: 5,
    keyTakeaways: [
      "PFAS can appear in monitoring records without triggering a violation if the detection is below the MCL or within the compliance transition period.",
      "UCMR 5 is a monitoring program — its data does not generate violations.",
      "Utilities have until 2029 to comply with PFAS MCLs finalized in 2024.",
      "Water Utility Report distinguishes between monitoring records and violation records.",
    ],
    intro: "You searched your utility and found PFAS sampling records — but no violation is listed. This is not a data error. It reflects how drinking water regulation actually works. Here is why a detection and a violation are different things.",
    blocks: [
      { t: "h2", c: "Monitoring records vs. violation records" },
      { t: "p", c: "A monitoring record documents that a compound was detected at a measurable level. A violation record documents that a utility exceeded a regulatory limit or failed a compliance requirement. These are distinct record types — a detection only becomes a violation when it exceeds an enforceable limit and the compliance deadline has passed." },
      { t: "h2", c: "Why UCMR 5 detections don't generate violations" },
      { t: "p", c: "UCMR 5 is a data-collection program. It has no MCLs of its own. Its purpose is to give EPA the information needed to set future standards. A UCMR 5 detection — even at a high level — does not constitute a violation under the Safe Drinking Water Act." },
      { t: "callout", variant: "info", c: "EPA finalized PFAS MCLs in April 2024, with a compliance deadline of April 2029. During this window, a utility may have PFAS monitoring records showing detections above future limits without being in formal violation. Water Utility Report shows both record types clearly labeled." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "The absence of a violation record does not confirm that PFAS levels are within the final MCLs.",
        "Water Utility Report does not determine whether water is safe or unsafe to drink.",
        "Monitoring records are official data — they are not emergency alerts or clearances.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Review both PFAS sampling records and violation records for your utility on Water Utility Report.",
        "Check your utility's Consumer Confidence Report for treatment and monitoring context.",
        "Contact your utility for information on their PFAS compliance plans.",
      ]},
    ],
    faqs: [
      { question: "Can a utility have PFAS in its water and still pass inspection?", answer: "During the compliance transition period (through 2029), a utility with PFAS detections above MCLs is not automatically in violation. Regulatory status depends on whether enforceable deadlines have passed." },
      { question: "What is the difference between a detection and a violation?", answer: "A detection means a compound was measured above the minimum reporting level. A violation means a regulatory limit was exceeded and the compliance deadline has passed." },
      { question: "Does Water Utility Report show both monitoring records and violations?", answer: "Yes. UCMR 5 sampling records are displayed as monitoring data, separate from formal violation records." },
      { question: "When will PFAS violations start appearing in utility records?", answer: "Formal PFAS violations are expected to appear in records after the April 2029 compliance deadline for utilities that have not achieved MCL compliance." },
      { question: "Where does Water Utility Report get its PFAS data?", answer: "From EPA's UCMR 5 database and the Safe Drinking Water Information System (SDWIS), both public federal databases." },
    ],
    sources: [
      { label: "EPA — PFAS National Primary Drinking Water Regulation (April 2024)", url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas" },
      { label: "EPA — UCMR 5 Overview", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
      { label: "EPA — Safe Drinking Water Information System (SDWIS)", url: "https://www.epa.gov/enviro/sdwis-search" },
    ],
    relatedArticles: [
      "ucmr5-pfas-water-sampling-explained",
      "2026-pfas-drinking-water-rule-changes",
      "mrl-vs-mcl-drinking-water-results",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
      "best-filter-for-pfas-in-drinking-water",
    ],
  },
  {
    slug: "mrl-vs-mcl-drinking-water-results",
    title: "MRL vs. MCL: What Those Numbers in Water Records Actually Mean",
    metaTitle: "MRL vs MCL in Drinking Water Records | Water Utility Report",
    metaDescription: "Water records reference MRLs and MCLs. Learn the difference between a minimum reporting level and a maximum contaminant level, and why it matters.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "contaminants",
    categoryLabel: "Contaminants & Records",
    tags: ["MRL", "MCL", "water records", "PFAS", "testing"],
    readingTimeMin: 4,
    keyTakeaways: [
      "MRL (Minimum Reporting Level) is the lowest concentration a lab can reliably measure.",
      "MCL (Maximum Contaminant Level) is the enforceable regulatory limit set by EPA.",
      "A detection above the MRL does not mean the MCL was exceeded.",
      "Records showing 'ND' (non-detect) mean the compound was below the MRL, not necessarily absent.",
    ],
    intro: "Water quality records are full of abbreviations. Two of the most commonly confused are MRL and MCL. They sound similar but measure very different things. Understanding the difference helps you read monitoring records accurately.",
    blocks: [
      { t: "h2", c: "What is an MRL?" },
      { t: "p", c: "The Minimum Reporting Level (MRL) is the lowest concentration at which a certified laboratory can reliably detect and quantify a compound. Results at or above the MRL are reported as detections. Results below the MRL are reported as non-detects (ND) — this does not mean the compound is completely absent, only that it was below the measurement threshold." },
      { t: "h2", c: "What is an MCL?" },
      { t: "p", c: "The Maximum Contaminant Level (MCL) is an enforceable limit set by EPA under the Safe Drinking Water Act. If a utility's water exceeds an MCL and the compliance deadline has passed, it constitutes a violation. MCLs are set based on health effects research and treatment feasibility." },
      { t: "h2", c: "How they relate" },
      { t: "p", c: "For PFAS, EPA set MCLs of 4 parts per trillion for PFOA and PFOS. Some MRLs used in UCMR 5 testing are at or near 4 ppt — meaning a detection could be right at the edge of the regulatory limit. For other compounds with higher MCLs, a detection well above the MRL might still be below the MCL." },
      { t: "callout", variant: "info", c: "When reading records: look at both the reported concentration and the applicable MCL. A detection above the MRL is a data point — a violation only occurs when the concentration exceeds the MCL and the compliance period has ended. Water Utility Report labels record types clearly to help you distinguish them." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "A non-detect does not guarantee a compound is absent — it means it was below the lab's measurement threshold.",
        "A detection above the MRL is not automatically a regulatory violation.",
        "Water Utility Report does not determine whether a water supply is safe or unsafe to drink.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Review your utility's monitoring records and compare reported values to applicable MCLs.",
        "Check the UCMR 5 data tables for MRL values by compound.",
        "Contact your utility or state drinking water program for context on specific results.",
      ]},
    ],
    faqs: [
      { question: "Why does EPA use MRLs instead of just reporting any detectable amount?", answer: "Lab measurements have uncertainty at very low concentrations. MRLs represent a threshold below which results are not reliably distinguishable from background noise or lab interference." },
      { question: "Can the MRL be higher than the MCL?", answer: "In some cases, yes. When the MRL is higher than the MCL, a utility technically cannot confirm compliance through standard monitoring alone, which is why EPA sometimes requires more sensitive testing methods." },
      { question: "What does 'ND' mean in a water quality record?", answer: "ND stands for non-detect. It means the compound was not detected at or above the MRL. It does not mean the compound is definitely absent at all concentrations." },
      { question: "How do I find the MCL for a specific compound?", answer: "EPA publishes a full table of current MCLs on its drinking water contaminants page. Water Utility Report links to relevant MCL information alongside monitoring records." },
      { question: "Are MRLs the same for all labs?", answer: "MRLs can vary slightly by lab and analytical method. EPA specifies approved methods for UCMR 5 to ensure comparability across utilities." },
    ],
    sources: [
      { label: "EPA — National Primary Drinking Water Regulations", url: "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations" },
      { label: "EPA — UCMR 5 Overview", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
    ],
    relatedArticles: [
      "ucmr5-pfas-water-sampling-explained",
      "pfas-detected-but-no-violation",
      "2026-pfas-drinking-water-rule-changes",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
      "best-filter-for-pfas-in-drinking-water",
    ],
  },
  {
    slug: "lead-service-line-inventory-unknown-service-line",
    title: "Lead Service Line Inventories: What 'Unknown' Means in the Records",
    metaTitle: "Lead Service Line Inventory Unknown Status | Water Utility Report",
    metaDescription: "EPA requires utilities to publish lead service line inventories. Many lines are listed as 'unknown.' Learn what that means and how to check your address.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "contaminants",
    categoryLabel: "Contaminants & Records",
    tags: ["lead", "service lines", "LSL inventory", "Lead and Copper Rule"],
    readingTimeMin: 5,
    keyTakeaways: [
      "EPA's Lead and Copper Rule Improvements (LCRI) require utilities to publish service line inventories by October 2024.",
      "Many service lines are classified as 'unknown' because historical records are incomplete.",
      "Utilities are required to replace lead and unknown service lines within 10 years.",
      "Your home's service line status may differ from the utility's main distribution lines.",
    ],
    intro: "Under EPA's updated Lead and Copper Rule, water utilities must now publish inventories identifying whether each service line in their system is lead, non-lead, or unknown. Many people searching these records find their address listed as 'unknown.' Here is what that classification means and what utilities are required to do about it.",
    blocks: [
      { t: "h2", c: "Why inventories exist" },
      { t: "p", c: "The Lead and Copper Rule Improvements (LCRI), finalized in 2024, require all community water systems to submit a service line inventory to their state by October 16, 2024. The inventory must categorize every service line as lead, non-lead, or unknown material." },
      { t: "h2", c: "What 'unknown' means" },
      { t: "p", c: "An 'unknown' classification means the utility does not have sufficient historical records to confirm the material of that line. Older neighborhoods built before the 1986 federal lead solder ban are most likely to have unknown or lead service lines. 'Unknown' is not a clearance — it is a data gap." },
      { t: "callout", variant: "info", c: "Under the LCRI, utilities must treat 'unknown' service lines the same as lead service lines for replacement purposes. Systems must replace all lead and unknown lines within 10 years. Water Utility Report displays official inventory records as submitted to state agencies." },
      { t: "h2", c: "The utility's portion vs. your portion" },
      { t: "p", c: "A service line has two segments: the utility-owned portion (from the water main to the property line) and the customer-owned portion (from the property line to the home). Lead may be present in either or both segments. Utility inventories cover both, but homeowners are often responsible for replacing their own portion." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "A non-lead classification for the utility portion does not confirm the customer-owned portion is free of lead.",
        "Water Utility Report does not determine whether your tap water is safe or unsafe to drink.",
        "Inventory records reflect official submissions — they may not reflect recent replacements not yet logged.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Search your utility's service line inventory records on Water Utility Report.",
        "Contact your utility to ask about your specific address classification.",
        "If your line is lead or unknown, ask your utility about their replacement timeline and interim steps.",
        "Consider a certified lead test of your tap water for additional information.",
      ]},
    ],
    faqs: [
      { question: "Are utilities required to replace unknown service lines?", answer: "Yes. Under the LCRI, utilities must replace both lead and unknown service lines on the same 10-year timeline as confirmed lead lines." },
      { question: "Who pays for service line replacement?", answer: "Utility-owned segments are replaced at the utility's cost (often with state or federal funding support). Customer-owned segments may require homeowner contribution, though many utilities offer assistance programs." },
      { question: "How do I find out if my address has a lead service line?", answer: "Check your utility's published inventory (searchable on Water Utility Report), or contact your utility directly. Some utilities offer free on-site inspections." },
      { question: "When did utilities have to publish their inventories?", answer: "The LCRI required initial inventories to be submitted to state drinking water agencies by October 16, 2024." },
      { question: "Can I filter lead out of my tap water?", answer: "NSF/ANSI 53-certified filters can reduce lead at the tap. Water Utility Report does not recommend specific products; consult NSF International's certified product listings." },
    ],
    sources: [
      { label: "EPA — Lead and Copper Rule Improvements (LCRI)", url: "https://www.epa.gov/ground-water-and-drinking-water/lead-and-copper-rule-improvements" },
      { label: "EPA — Lead in Drinking Water", url: "https://www.epa.gov/ground-water-and-drinking-water/basic-information-about-lead-drinking-water" },
    ],
    relatedArticles: [
      "utility-records-vs-home-tap-water",
      "mrl-vs-mcl-drinking-water-results",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
    ],
  },
  {
    slug: "utility-records-vs-home-tap-water",
    title: "Utility Records vs. Your Home's Tap Water: Why They Can Differ",
    metaTitle: "Utility Records vs Home Tap Water | Water Utility Report",
    metaDescription: "A utility's official monitoring records reflect water at the point of sampling — not necessarily at your tap. Learn why and what to do.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "utilities",
    categoryLabel: "Utilities & Records",
    tags: ["tap water", "monitoring", "service lines", "home testing"],
    readingTimeMin: 5,
    keyTakeaways: [
      "Utilities monitor water quality at specific sampling points — entry points, distribution sites, and customer taps — not at every address.",
      "Water chemistry can change between the treatment plant and your tap, especially for lead and disinfection byproducts.",
      "Your home's plumbing, age, and service line material can affect what comes out of your tap.",
      "Official records are a starting point — they describe the utility's water, not necessarily your individual tap.",
    ],
    intro: "Water utility records are public, official, and important. But they describe water quality at specific sampling locations — not at your kitchen faucet. Understanding the gap between utility-level data and tap-level water helps you use these records more accurately.",
    blocks: [
      { t: "h2", c: "Where utilities collect samples" },
      { t: "p", c: "Utilities are required to collect samples at entry points to the distribution system, at specific distribution system sites, and (for lead and copper) at customer taps selected under federal protocols. These sampling points are designed to be representative — they are not samples from every address." },
      { t: "h2", c: "What can change between the plant and your tap" },
      { t: "p", c: "Several factors can affect water quality at the tap compared to what is measured at official sampling points: the age and material of service lines and home plumbing, residence time in pipes, and localized chemical reactions. Lead, for example, leaches from lead solder and service lines — and is not present in the water as it leaves the treatment plant." },
      { t: "callout", variant: "info", c: "Utility monitoring records reflect the system's compliance monitoring program. They are official data — but they describe conditions at specific sample points, not at every tap in the service area. Water Utility Report displays these records as official data, not as a determination of conditions at your home." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "Compliant utility records do not confirm that every tap in the service area has the same water quality.",
        "Water Utility Report does not determine whether tap water at any specific address is safe or unsafe to drink.",
        "Official records are not emergency alerts or all-clears for individual households.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Review your utility's violation history and PFAS sampling records on Water Utility Report.",
        "Look up your address in your utility's lead service line inventory.",
        "If you want information about your specific tap, consider a certified third-party water test.",
        "Review your Consumer Confidence Report for information on your utility's treatment process.",
      ]},
    ],
    faqs: [
      { question: "Can my tap water differ from the utility's official test results?", answer: "Yes. Official monitoring reflects sampling at specific locations in the distribution system. Your home's plumbing, service line material, and age can all affect what comes out of your tap." },
      { question: "How do utilities choose where to sample?", answer: "EPA regulations specify sampling location types and numbers based on system size and source water. Lead and copper sampling uses a tiered site-selection protocol focused on high-risk locations." },
      { question: "What is a certified water test?", answer: "A test performed by a state-certified laboratory using EPA-approved methods. Many state health departments maintain lists of certified labs." },
      { question: "Does Water Utility Report provide home testing recommendations?", answer: "No. Water Utility Report displays official monitoring records. For information on home testing options, contact your state drinking water program or state health department." },
      { question: "Why does lead not show up in treatment plant samples but might be at my tap?", answer: "Lead enters water through contact with lead service lines and household plumbing — it is not present in treated water at the plant. This is why lead monitoring uses tap samples, not plant effluent." },
    ],
    sources: [
      { label: "EPA — Lead and Copper Rule Improvements (LCRI)", url: "https://www.epa.gov/ground-water-and-drinking-water/lead-and-copper-rule-improvements" },
      { label: "EPA — Drinking Water Regulations", url: "https://www.epa.gov/sdwa/drinking-water-regulations-and-contaminants" },
    ],
    relatedArticles: [
      "lead-service-line-inventory-unknown-service-line",
      "mrl-vs-mcl-drinking-water-results",
      "ucmr5-pfas-water-sampling-explained",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
    ],
  },
  {
    slug: "water-utility-cybersecurity-drinking-water-records",
    title: "Cyberattacks on Water Utilities: What It Means for Official Records",
    metaTitle: "Water Utility Cybersecurity and Records | Water Utility Report",
    metaDescription: "Cyberattacks on water utilities are increasing. Learn how incidents can affect official monitoring records and what utilities are required to report.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "utilities",
    categoryLabel: "Utilities & Records",
    tags: ["cybersecurity", "utility incidents", "records", "EPA reporting"],
    readingTimeMin: 5,
    keyTakeaways: [
      "EPA and CISA have both flagged increasing cybersecurity threats to drinking water infrastructure.",
      "A cyberattack does not automatically affect water quality — but it can disrupt monitoring and recordkeeping systems.",
      "Utilities are required to report significant incidents to EPA and to notify customers under certain conditions.",
      "Water Utility Report displays official records as submitted — it cannot independently verify real-time operational status.",
    ],
    intro: "Over the past several years, federal agencies have documented a growing number of cybersecurity incidents targeting water and wastewater utilities. These incidents raise questions about operational continuity and recordkeeping integrity. Here is what the official record landscape looks like.",
    blocks: [
      { t: "h2", c: "What federal agencies have reported" },
      { t: "p", c: "EPA and CISA have issued multiple advisories since 2021 documenting cyberattacks on water sector systems, including intrusions into operational technology (OT) networks that control treatment processes. The America's Water Infrastructure Act (AWIA) of 2018 requires utilities serving more than 3,300 people to conduct risk and resilience assessments and certify emergency response plans." },
      { t: "h2", c: "How incidents affect records" },
      { t: "p", c: "A cyberattack on a utility's business systems (billing, communications) is generally separate from operational technology that controls treatment. However, incidents affecting SCADA systems or monitoring networks can disrupt automated data collection. If monitoring is interrupted, utilities may have gaps in their official sampling records during the incident period." },
      { t: "callout", variant: "info", c: "Water Utility Report displays official monitoring records as submitted to EPA and state agencies. Records reflect what utilities have reported through normal compliance channels — not real-time operational status. If a utility experiences an incident affecting recordkeeping, gaps may appear in historical data." },
      { t: "h2", c: "Reporting requirements" },
      { t: "p", c: "The Cyber Incident Reporting for Critical Infrastructure Act (CIRCIA) of 2022 established new federal incident reporting requirements. Utilities must notify EPA and CISA of significant cyber incidents. Customer notification obligations depend on whether the incident affected water quality or service delivery." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "A cyberattack on a utility does not necessarily mean water quality was affected.",
        "Water Utility Report cannot verify real-time operational status of any utility.",
        "Official records are compliance data — not a real-time security status dashboard.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Monitor your utility's official communications and local news for incident notifications.",
        "Check your utility's violation and monitoring records on Water Utility Report for any reporting gaps.",
        "Review EPA and CISA advisories for sector-wide guidance.",
      ]},
    ],
    faqs: [
      { question: "Have there been confirmed cyberattacks on US water utilities?", answer: "Yes. EPA and CISA have documented multiple confirmed incidents, including intrusions targeting operational technology systems. Specific cases have been publicly reported involving utilities in several states." },
      { question: "Can a cyberattack change what comes out of my tap?", answer: "A successful attack on operational technology systems could theoretically affect treatment processes. However, most documented incidents have targeted business systems rather than OT networks. Physical safeguards and manual overrides provide additional layers of protection." },
      { question: "Are utilities required to tell customers about cyberattacks?", answer: "Customer notification requirements depend on whether the incident affected water quality or service. Incidents that trigger public health concerns require notification; IT-only incidents may not." },
      { question: "What is SCADA?", answer: "SCADA (Supervisory Control and Data Acquisition) refers to computer systems that monitor and control industrial processes, including water treatment and distribution. These systems are a primary target in water sector cyberattacks." },
      { question: "Where can I find official advisories about water utility cybersecurity?", answer: "CISA and EPA both publish water sector cybersecurity advisories on their official websites." },
    ],
    sources: [
      { label: "EPA — Cybersecurity for the Water Sector", url: "https://www.epa.gov/waterresilience/cybersecurity-water-sector" },
      { label: "CISA — Water and Wastewater Systems Sector", url: "https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience/critical-infrastructure-sectors/water-and-wastewater-systems-sector" },
      { label: "Cyber Incident Reporting for Critical Infrastructure Act (CIRCIA)", url: "https://www.cisa.gov/circia" },
    ],
    relatedArticles: [
      "utility-records-vs-home-tap-water",
      "water-reuse-ai-growth-public-water-systems",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
    ],
  },
  {
    slug: "water-reuse-ai-growth-public-water-systems",
    title: "Water Reuse and AI Growth: How Demand Pressures Show Up in Utility Records",
    metaTitle: "Water Reuse and AI Growth in Utility Records | Water Utility Report",
    metaDescription: "AI data center expansion is increasing demand on local water supplies. Learn how water reuse programs and capacity constraints appear in utility records.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "utilities",
    categoryLabel: "Utilities & Records",
    tags: ["water reuse", "AI", "data centers", "capacity", "utility records"],
    readingTimeMin: 5,
    keyTakeaways: [
      "AI data centers are among the fastest-growing sources of industrial water demand in the US.",
      "Some utilities are expanding water reuse programs to offset increased industrial demand.",
      "Water reuse systems have their own monitoring and reporting requirements under state regulations.",
      "Capacity and demand pressures may appear indirectly in utility records through infrastructure filings and compliance plans.",
    ],
    intro: "The rapid expansion of AI infrastructure has placed new pressure on water supplies near data center clusters. Utilities in affected areas are responding with water reuse programs, new supply agreements, and infrastructure investments. Here is how this trend intersects with official utility records.",
    blocks: [
      { t: "h2", c: "Why data centers use significant water" },
      { t: "p", c: "Large-scale data centers use water in cooling towers to dissipate heat from servers. AI workloads, which require sustained high-density computing, consume more cooling water per unit of power than traditional data center operations. Research published in 2025 and 2026 estimates that AI inference and training workloads contribute meaningfully to regional water stress in areas with concentrated data center development." },
      { t: "h2", c: "Water reuse as a supply response" },
      { t: "p", c: "Several utilities in data center corridors — including areas of Virginia, Texas, Arizona, and the Pacific Northwest — have expanded or are planning water reuse programs. Reclaimed water (treated wastewater reused for industrial cooling or irrigation) is separately monitored under state-specific regulations distinct from drinking water rules." },
      { t: "callout", variant: "info", c: "Water reuse systems are subject to state-level monitoring and reporting requirements that vary significantly by jurisdiction. Water Utility Report focuses on federal Safe Drinking Water Act records. Reclaimed water monitoring data is generally held by state environmental agencies and may not appear in federal databases." },
      { t: "h2", c: "How capacity pressures appear in records" },
      { t: "p", c: "Capacity and demand pressures do not directly generate monitoring violations. However, they may appear indirectly in utility records through: infrastructure project filings, capacity assessments submitted to state agencies, new interconnection or water purchase agreements, and compliance schedules for new treatment facilities." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "The presence of data centers in a utility's service area does not predict monitoring violations.",
        "Water Utility Report cannot assess a utility's current supply capacity or long-term demand trajectory.",
        "Official monitoring records do not reflect industrial water use agreements or reuse program volumes.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Review your utility's monitoring records and CCR for context on source water and treatment capacity.",
        "Check state environmental agency records for water reuse program filings in your area.",
        "Follow EPA and USGS publications on regional water stress and demand trends.",
      ]},
    ],
    faqs: [
      { question: "Do data centers use drinking water or reclaimed water?", answer: "Both. Many use municipal drinking water for cooling, though some have shifted to reclaimed water. The mix depends on utility agreements and state regulations." },
      { question: "Does my utility have to disclose water sales to data centers?", answer: "Industrial water supply agreements are typically filed with state utilities commissions or water agencies, not with EPA drinking water programs. They generally do not appear in federal SDWIS records." },
      { question: "Can increased demand affect my utility's monitoring records?", answer: "Capacity stress can affect treatment processes and infrastructure — which may ultimately appear in compliance records. However, monitoring violations are driven by measured contaminant levels, not demand volumes alone." },
      { question: "What is water reuse?", answer: "Water reuse (also called reclaimed water) refers to treating wastewater to a level suitable for non-potable uses such as industrial cooling, irrigation, or groundwater recharge. Some jurisdictions also permit potable reuse after advanced treatment." },
      { question: "Where can I find data on water reuse programs in my state?", answer: "State environmental and water quality agencies maintain records on water reuse permits and programs. EPA's WaterSense and Water Reuse Action Plan pages provide federal-level context." },
    ],
    sources: [
      { label: "EPA — Water Reuse Action Plan", url: "https://www.epa.gov/waterreuse" },
      { label: "Shah et al. — Four water insecurity concerns about datacenters driving the AI revolution (PLOS Water, 2026)", url: "https://journals.plos.org/water/article/file?id=10.1371%2Fjournal.pwat.0000500&type=printable" },
      { label: "USGS — Water Use in the United States", url: "https://www.usgs.gov/mission-areas/water-resources/science/water-use-united-states" },
    ],
    relatedArticles: [
      "data-center-water-capacity-local-utility-records",
      "water-utility-cybersecurity-drinking-water-records",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
    ],
  },
  {
    slug: "data-center-water-capacity-local-utility-records",
    title: "Data Center Water Use and Local Utility Capacity: What Records Show",
    metaTitle: "Data Center Water Use Local Utility Records | Water Utility Report",
    metaDescription: "Data centers are major water users. Learn how to research a local utility's capacity situation using official records and public filings.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "ai-water",
    categoryLabel: "AI & Water",
    tags: ["data centers", "AI", "capacity", "utility records", "water stress"],
    readingTimeMin: 5,
    keyTakeaways: [
      "Data centers in some regions consume billions of gallons of water annually for cooling.",
      "Utilities must report supply and capacity information through annual reporting and Consumer Confidence Reports.",
      "Infrastructure stress from industrial demand may appear in compliance schedules and infrastructure filings.",
      "Official federal records do not directly capture industrial water volume agreements.",
    ],
    intro: "Research published in 2025 and 2026 documents significant water consumption by AI-related data centers. For residents and researchers trying to understand how this affects local utilities, official records are the best public starting point — though they capture this indirectly.",
    blocks: [
      { t: "h2", c: "How large is data center water demand?" },
      { t: "p", c: "A hyperscale data center can consume one to five million gallons of water per day depending on cooling system design, local climate, and load. The TNFD's February 2026 sector analysis and the UK Government's data center water report both estimate that the technology sector's water dependency will increase materially as AI workloads scale." },
      { t: "h2", c: "What official records do and don't show" },
      { t: "p", c: "Safe Drinking Water Act records — the primary data displayed on Water Utility Report — focus on contaminant monitoring and compliance. They do not directly track volumes sold to industrial customers. However, utilities serving high-demand industrial customers may show relevant information in: Consumer Confidence Reports (source water descriptions, treatment capacity), infrastructure compliance schedules (when a system needs capacity upgrades), and state water right or withdrawal filings." },
      { t: "callout", variant: "info", c: "Water Utility Report displays EPA and state drinking water compliance records. For industrial water volume data, state environmental agencies and water rights databases are more informative sources. Official records remain the most reliable window into regulatory compliance and source water status." },
      { t: "h2", c: "Researching local utility capacity" },
      { t: "p", c: "To build a picture of a local utility's capacity situation: start with the CCR for source water type and treatment capacity; check violation history for any compliance schedule entries; search state environmental agency databases for water withdrawal permits; and review local planning documents for service area growth projections." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "The presence of data centers in a service area does not predict compliance violations.",
        "Water Utility Report cannot assess a utility's remaining supply capacity.",
        "Monitoring records do not reflect industrial water purchase volumes or future demand agreements.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Search your utility's Consumer Confidence Report and violation records on Water Utility Report.",
        "Check your state's environmental agency for water withdrawal permits and industrial use data.",
        "Review EPA and USGS publications on regional water stress.",
        "Follow local planning commission filings for utility service area expansion plans.",
      ]},
    ],
    faqs: [
      { question: "Can I find out how much water a data center in my area uses?", answer: "Some companies voluntarily disclose water use in sustainability reports. State water rights filings and withdrawal permits (where applicable) may also contain volume data. This information does not appear in federal drinking water records." },
      { question: "Does increased industrial demand affect drinking water compliance?", answer: "High demand can stress source water availability and distribution infrastructure, which can indirectly affect compliance. However, compliance violations are driven by measured contaminant levels and operational requirements, not demand volumes alone." },
      { question: "What is a Consumer Confidence Report?", answer: "An annual report that community water systems must provide to customers describing their source water, treatment processes, and monitoring results. CCRs are a key public document for understanding a utility's operational context." },
      { question: "Are there federal standards for how much water an industry can take from a public utility?", answer: "Allocation of public water supply to industrial customers is governed by state law and local utility policy, not federal drinking water regulations." },
      { question: "Where can I learn more about AI and water use research?", answer: "Academic journals including Nature, Environmental Science & Technology, and PLOS Water have published peer-reviewed research on this topic since 2023. TNFD and USGS also publish relevant sector analyses." },
    ],
    sources: [
      { label: "TNFD — Water dependency of semiconductor and data centre industries (February 2026)", url: "https://tnfd.global/wp-content/uploads/2026/02/Case-study_Water-dependency-of-the-tech-sector_DIGITAL.pdf" },
      { label: "UK Government — Water use in data centre and AI report", url: "https://assets.publishing.service.gov.uk/media/688cb407dc6688ed50878367/Water_use_in_data_centre_and_AI_report.pdf" },
      { label: "Shah et al. — Four water insecurity concerns about datacenters (PLOS Water, 2026)", url: "https://journals.plos.org/water/article/file?id=10.1371%2Fjournal.pwat.0000500&type=printable" },
    ],
    relatedArticles: [
      "water-reuse-ai-growth-public-water-systems",
      "water-utility-cybersecurity-drinking-water-records",
      "is-ai-making-your-water-worse",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
    ],
  },
  {
    slug: "harmful-algal-blooms-drinking-water-records",
    title: "Harmful Algal Blooms and Drinking Water: What Shows Up in Official Records",
    metaTitle: "Harmful Algal Blooms Drinking Water Records | Water Utility Report",
    metaDescription: "Harmful algal blooms can affect source water. Learn how HAB-related events appear in official utility monitoring records and what to look for.",
    publishDate: "2026-05-01",
    lastUpdated: "2026-05-01",
    category: "contaminants",
    categoryLabel: "Contaminants & Records",
    tags: ["harmful algal blooms", "HABs", "cyanotoxins", "source water", "monitoring"],
    readingTimeMin: 5,
    keyTakeaways: [
      "Harmful algal blooms (HABs) can produce cyanotoxins that affect source water quality.",
      "EPA does not currently have federal MCLs for cyanotoxins in finished drinking water.",
      "Some states have established their own advisory or action levels for cyanotoxins.",
      "HAB-related monitoring data may appear in utility records as special monitoring events or source water assessments.",
    ],
    intro: "Harmful algal blooms — growths of cyanobacteria in lakes, reservoirs, and rivers — are increasing in frequency and geographic range. For utilities that draw source water from affected waterbodies, HABs represent a monitoring and treatment challenge. Here is what official records show about HAB-related events.",
    blocks: [
      { t: "h2", c: "What makes a bloom 'harmful'" },
      { t: "p", c: "Some cyanobacteria (blue-green algae) produce toxins — called cyanotoxins — including microcystins, cylindrospermopsin, and anatoxins. These compounds can affect liver and nervous system function at sufficient concentrations. Not all algal blooms produce toxins; laboratory analysis is required to confirm cyanotoxin presence." },
      { t: "h2", c: "Federal standards and the gap" },
      { t: "p", c: "EPA has not established federal MCLs for cyanotoxins in finished drinking water. In 2015, EPA issued health advisories for microcystin-LR and cylindrospermopsin. Some states — including Ohio, Minnesota, and Oregon — have established their own advisory or action levels. Without federal MCLs, cyanotoxin detections do not generate federal violation records." },
      { t: "callout", variant: "info", c: "Because there are no federal cyanotoxin MCLs, HAB-related events rarely generate entries in EPA's Safe Drinking Water Information System (SDWIS). Official records from HAB events are more likely to appear in state environmental agency databases, source water assessments, and utility-issued public notices. Water Utility Report displays federal compliance records and will note source water context where available." },
      { t: "h2", c: "How HAB events appear in records" },
      { t: "p", c: "HAB-related data may appear in: state-issued public notices or do-not-use advisories (separate from SDWIS); source water assessment reports submitted to state agencies; special monitoring records if a state requires cyanotoxin testing; and Consumer Confidence Reports that describe source water quality challenges." },
      { t: "h2", c: "What this does not mean" },
      { t: "ul", items: [
        "The absence of a cyanotoxin record in federal databases does not mean HABs have not affected a utility's source water.",
        "Water Utility Report does not determine whether a water supply is safe or unsafe to drink.",
        "State advisories may apply even when no federal violation record exists.",
      ]},
      { t: "h2", c: "What to check next" },
      { t: "ul", items: [
        "Search your utility's source water type and recent monitoring records on Water Utility Report.",
        "Check your state environmental agency's HAB monitoring and advisory pages.",
        "Review your utility's Consumer Confidence Report for source water quality descriptions.",
        "If you receive a public notice or advisory from your utility, follow its guidance.",
      ]},
    ],
    faqs: [
      { question: "Do harmful algal blooms affect tap water?", answer: "Utilities are required to treat source water to meet finished water standards. Most conventional treatment can remove or reduce cyanotoxins, though effectiveness varies by treatment type and toxin concentration. Monitoring programs track both source water and finished water quality." },
      { question: "Why doesn't EPA have MCLs for cyanotoxins?", answer: "EPA has been studying the issue and issued health advisories in 2015. Rulemaking is a lengthy process requiring health effects analysis, treatment feasibility assessment, and economic analysis. As of 2026, a proposed rule has not been finalized." },
      { question: "Where can I find HAB advisories for my state?", answer: "Most state environmental agencies maintain HAB monitoring maps and advisory lists updated seasonally. EPA's CyanoHABs website also aggregates national data." },
      { question: "Are HABs getting more frequent?", answer: "Research published in multiple peer-reviewed journals documents increasing HAB frequency, duration, and geographic range in the US since the 1990s, associated with warming water temperatures and nutrient loading." },
      { question: "What is a do-not-use advisory?", answer: "A do-not-use advisory is a public notice issued by a state or local health agency advising that water from a specific source (usually a lake or reservoir) should not be used for drinking, cooking, or recreation due to cyanotoxin levels. These are separate from EPA drinking water violation records." },
    ],
    sources: [
      { label: "EPA — Cyanobacterial Harmful Algal Blooms (CyanoHABs)", url: "https://www.epa.gov/cyanohabs" },
      { label: "EPA — Health Advisories for Cyanotoxins in Drinking Water (2015)", url: "https://www.epa.gov/ground-water-and-drinking-water/cyanotoxins-drinking-water-health-advisories" },
      { label: "USGS — Harmful Algal Blooms", url: "https://www.usgs.gov/special-topics/water-science-school/science/harmful-algal-blooms" },
    ],
    relatedArticles: [
      "ucmr5-pfas-water-sampling-explained",
      "mrl-vs-mcl-drinking-water-results",
      "utility-records-vs-home-tap-water",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
    ],
  },
];

export default articles;
