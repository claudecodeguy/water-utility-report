// ─── Types ───────────────────────────────────────────────────────────────────

export type Block =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "h3"; c: string }
  | { t: "ul"; items: string[] }
  | { t: "table"; headers: string[]; rows: string[][] }
  | { t: "callout"; c: string };

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishDate: string;
  lastUpdated: string;
  category: "filtration" | "contaminants" | "testing" | "understanding";
  categoryLabel: string;
  intro: string;
  blocks: Block[];
  faqs: { question: string; answer: string }[];
  nextSteps: string[];
  relatedGuides: string[];
}

// ─── Guide Data ───────────────────────────────────────────────────────────────

const guides: Guide[] = [
  // ── 1. Best filter for lead ──────────────────────────────────────────────
  {
    slug: "best-filter-for-lead-in-tap-water",
    title: "Best Filter for Lead in Tap Water",
    metaTitle: "Best Filter for Lead in Tap Water | What Actually Works",
    metaDescription:
      "Not all water filters remove lead. Learn when reverse osmosis, certified carbon filters, or testing make the most sense for lead at your tap.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "If the concern is lead at the tap, the best filter is usually a **point-of-use system specifically certified for lead reduction**. In practice, that usually means one of two things: a reverse osmosis system installed where you drink the water, or a certified under-sink or pitcher-style carbon filter that clearly states lead reduction. A whole-house system is usually not the first answer for drinking-water lead exposure.",
    blocks: [
      { t: "callout", c: "Lead problems often happen **after** the water has already left the utility. The issue is often the home's own plumbing, solder, fixtures, or service line — which makes drinking-water treatment at the kitchen tap far more rational than treating every gallon used for showers and laundry." },
      { t: "h2", c: "Who This Page Is For" },
      { t: "p", c: "This page is for households deciding what to install because of an older home, a child or infant in the household, a first-draw lead result, news about lead service lines, or general concern after reading a water quality report." },
      { t: "h2", c: "The Key Distinction People Miss" },
      { t: "p", c: "The best lead filter is not necessarily the biggest or most expensive system. It is the one that treats the **water you actually drink** and is verified for **lead reduction** — not just taste improvement. Lead is different because: the utility can be compliant and you can still have lead at your own tap; the highest exposure often comes from water that sat in plumbing; and drinking and cooking water are usually the priority, not whole-home treatment." },
      { t: "h2", c: "Why Lead Is Different from Many Other Contaminants" },
      { t: "p", c: "Lead more often enters water from older service lines, older interior plumbing, solder, brass fixtures, and water sitting in pipes between uses. A city-wide water report tells you about the utility system — it does **not** tell you exactly what happened inside your own plumbing overnight." },
      { t: "p", c: "This is also why first-draw water matters. The water that sat in contact with plumbing can have a different lead level than water after flushing." },
      { t: "h2", c: "What Actually Removes Lead" },
      { t: "h3", c: "1. Reverse Osmosis" },
      { t: "p", c: "Reverse osmosis is one of the strongest point-of-use choices for lead reduction. It is often the best fit when you want the highest reduction margin, you are mixing infant formula, you have a confirmed lead result, or you are comfortable with under-sink installation and maintenance. Read more in the site's [reverse osmosis guide](/treatment/reverse-osmosis)." },
      { t: "h3", c: "2. Certified Lead-Reduction Carbon Filtration" },
      { t: "p", c: "A certified carbon-based under-sink filter, faucet filter, or even some pitcher filters can be a strong option **if** the product is specifically certified for lead reduction. This is often the best fit when you rent, want simpler installation, or need a temporary step while arranging testing or plumbing work. Read more in the [activated carbon guide](/treatment/activated-carbon)." },
      { t: "h2", c: "Reverse Osmosis vs Certified Lead-Reduction Carbon Filters" },
      {
        t: "table",
        headers: ["Question", "Reverse osmosis", "Certified lead-reduction carbon filter"],
        rows: [
          ["Lead reduction strength", "Usually strongest", "Can be very good when properly certified"],
          ["Installation", "More involved", "Usually easier"],
          ["Cost", "Higher upfront", "Lower to moderate"],
          ["Maintenance", "Membrane plus pre/post filters", "Cartridge changes matter"],
          ["Renter-friendly", "Sometimes", "Often yes"],
          ["Good for infant-formula households", "Often yes", "Can be, if certification is clear"],
          ["Good as a quick first step", "Sometimes", "Often yes"],
        ],
      },
      { t: "h2", c: "Why Whole-House Filters Are Usually Not the First Choice" },
      { t: "p", c: "If your main concern is what goes into a glass, coffee maker, or pot, a whole-house system is usually overkill. You do not need to filter bath water, toilet water, or laundry water if the exposure concern is drinking and cooking. This is one of the biggest buying mistakes in this category: people spend thousands treating the entire home when the real problem is exposure at the point of use." },
      { t: "h2", c: "What Certifications and Label Language to Look For" },
      { t: "p", c: "Avoid vague language like 'advanced filtration,' 'cleaner water,' or 'premium purification.' Look for language that clearly states **lead reduction**, third-party certification, and that the certification applies to the full system at the flow rate and cartridge life you will actually use. Do not assume a filter removes lead because it looks serious or has good reviews." },
      { t: "h2", c: "Mistakes People Make When Shopping for a Lead Filter" },
      {
        t: "ul",
        items: [
          "**Buying for taste, not for lead** — a filter that improves taste may still be the wrong filter for lead",
          "**Assuming boiling helps** — boiling does not remove lead and can make concentration worse",
          "**Filtering hot water** — use only cold tap water for drinking and cooking",
          "**Ignoring cartridge replacement** — a good filter that is not maintained becomes a bad plan",
          "**Skipping testing when the stakes are high** — if you are making infant formula or managing a confirmed result, guessing is weaker than testing",
        ],
      },
      { t: "h2", c: "Best Filter Choice by Household Type" },
      { t: "h3", c: "Renter" },
      { t: "p", c: "A certified faucet, pitcher, or under-sink lead-reduction filter is often the most practical choice. Prioritize certification and easy cartridge replacement." },
      { t: "h3", c: "Older-Home Owner" },
      { t: "p", c: "Start with testing if possible. If urgency is high, install a point-of-use certified lead filter immediately, then decide whether plumbing work or a stronger RO system is warranted." },
      { t: "h3", c: "Family Mixing Infant Formula" },
      { t: "p", c: "Do not optimize for convenience first. Optimize for clarity and reduction strength. Reverse osmosis or a clearly certified lead-reduction point-of-use system is usually the right lane." },
      { t: "h3", c: "Someone with a Confirmed Lead Result" },
      { t: "p", c: "Treat the result seriously. Use a point-of-use system at the kitchen or dedicated drinking-water tap, then decide whether plumbing remediation, retesting, or both are needed." },
      { t: "h2", c: "Decision Framework" },
      {
        t: "table",
        headers: ["Situation", "First move", "Likely best filter path"],
        rows: [
          ["General concern, no test yet", "Check utility context and home age", "Certified lead-reduction point-of-use filter"],
          ["Older home, high concern", "Test and protect drinking water now", "RO or certified lead-reduction under-sink system"],
          ["Infant formula household", "Do not rely on general taste filters", "Strong point-of-use lead-reduction system, often RO"],
          ["Confirmed tap result", "Treat immediately, then retest", "RO or certified lead-reduction under-sink system"],
          ["Renter, limited install options", "Use a verified portable option", "Certified faucet or pitcher filter with lead claim"],
        ],
      },
    ],
    faqs: [
      { question: "Does boiling water remove lead?", answer: "No. Boiling does not remove lead. It can make concentration worse because water evaporates but the lead does not." },
      { question: "Do pitcher filters remove lead?", answer: "Some do, some do not. The deciding factor is whether the specific product is certified for lead reduction, not whether it is a pitcher." },
      { question: "Is reverse osmosis better than a standard under-sink filter for lead?", answer: "Often yes, especially when reduction strength is the top priority. But a certified lead-reduction under-sink carbon filter can still be a strong choice in many homes." },
      { question: "Do I need a whole-house filter for lead?", answer: "Usually not as a first move. If the concern is drinking and cooking water, point-of-use treatment is usually more direct and more cost-efficient." },
      { question: "Should I test my water before buying a filter?", answer: "Testing is strongly worth it when the household is high risk, the home is older, or the result will determine how much you spend." },
    ],
    nextSteps: [
      "Check your utility context with [ZIP lookup](/search).",
      "Read the broader [lead contaminant guide](/contaminants/lead).",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) with [activated carbon](/treatment/activated-carbon).",
      "Use [certified labs](/labs) if your home, household, or test result raises the stakes.",
      "Review [methodology](/methodology) to understand the difference between utility-wide data and your own tap.",
    ],
    relatedGuides: [
      "what-does-lead-in-tap-water-actually-mean",
      "reverse-osmosis-vs-carbon-filter",
      "home-water-test-kits-vs-certified-labs",
      "whole-house-filter-vs-under-sink-filter",
    ],
  },

  // ── 2. Best filter for PFAS ──────────────────────────────────────────────
  {
    slug: "best-filter-for-pfas-in-drinking-water",
    title: "Best Filter for PFAS in Drinking Water",
    metaTitle: "Best Filter for PFAS in Drinking Water | RO vs Carbon",
    metaDescription:
      "Learn which home filtration options are most credible for PFAS, when reverse osmosis wins, when carbon can help, and what to verify before buying.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "If PFAS is the concern, the best filter is usually a **point-of-use system with verified PFAS reduction** — most often reverse osmosis or a properly certified activated carbon system. Reverse osmosis usually offers the strongest reduction profile. Activated carbon can still be a good choice when the certification is clear, the cartridge is maintained properly, and the household wants a simpler setup.",
    blocks: [
      { t: "callout", c: "The mistake is treating PFAS as a marketing problem instead of a verification problem. A label that says 'advanced carbon' or 'cleaner water' is weak. A label or certification that specifically supports PFAS reduction is what matters." },
      { t: "h2", c: "Why PFAS Filter Shopping Gets Confusing" },
      { t: "p", c: "PFAS is not one chemical — it is a family of chemicals. Buyers then run into a second layer of confusion: not every filter is tested the same way; not every product claim is third-party verified; maintenance matters more than many product pages admit; and a system can be decent for taste and still be the wrong tool for PFAS." },
      { t: "p", c: "The real question is not 'RO or carbon?' in the abstract. It is: **which verified technology fits this household, this budget, and this risk level?**" },
      { t: "h2", c: "Which Technologies Have Evidence for PFAS Reduction" },
      { t: "h3", c: "Reverse Osmosis" },
      { t: "p", c: "Reverse osmosis is often the strongest point-of-use option for PFAS reduction. It is usually the best fit when maximum reduction is the priority, the household has a confirmed PFAS concern, there is low tolerance for ambiguity, and the budget and installation burden are acceptable. See [reverse osmosis](/treatment/reverse-osmosis)." },
      { t: "h3", c: "Activated Carbon" },
      { t: "p", c: "Activated carbon can also reduce PFAS, but results depend heavily on the system design, certification, and maintenance discipline. Carbon is often the better fit when the household wants simpler installation, the budget is lower, and the product has specific verified PFAS reduction claims. See [activated carbon](/treatment/activated-carbon)." },
      { t: "h3", c: "What Not to Rely On" },
      { t: "p", c: "Do not assume a refrigerator filter, faucet add-on, or generic pitcher filter handles PFAS unless the product specifically supports that claim. Convenience and PFAS performance are not the same thing." },
      { t: "h2", c: "Reverse Osmosis vs Activated Carbon for PFAS" },
      {
        t: "table",
        headers: ["Question", "Reverse osmosis", "Activated carbon"],
        rows: [
          ["PFAS reduction strength", "Usually strongest", "Can be strong, but depends on system and maintenance"],
          ["Installation", "More involved", "Usually easier"],
          ["Cost", "Higher upfront", "Lower to moderate"],
          ["Maintenance risk", "Real, but predictable", "Very dependent on timely cartridge replacement"],
          ["Good for renter", "Sometimes", "Often yes"],
          ["Good for confirmed PFAS concern", "Often yes", "Sometimes yes, if verification is strong"],
          ["Added taste/odor improvement", "Possible", "Often strong"],
        ],
      },
      { t: "h2", c: "Why 'PFAS Capable' Is Weaker Than Verified Certification" },
      { t: "p", c: "PFAS buyers should be suspicious of soft language: 'may reduce contaminants,' 'supports cleaner water,' 'designed for emerging contaminants.' The more important questions: Does the product clearly state PFAS reduction? Is that claim third-party verified? What is the cartridge life under the PFAS claim? Is the rated performance realistic for your household's actual use?" },
      { t: "h2", c: "Maintenance Matters More Than Most Buyers Realize" },
      { t: "p", c: "PFAS filtration is not a one-time purchase. It is a maintenance commitment. A strong system becomes weak when cartridges are changed late, filters are used beyond rated capacity, the household assumes taste is a reliable indicator of filter performance, or the system was chosen for convenience instead of verified fit." },
      { t: "h2", c: "Decision Framework by Household Type" },
      {
        t: "table",
        headers: ["Household type", "Better fit"],
        rows: [
          ["Maximum reduction priority", "Usually reverse osmosis"],
          ["Lower budget with maintenance discipline", "Properly verified carbon system"],
          ["Renter", "Verified point-of-use with PFAS reduction claim"],
          ["Confirmed PFAS contamination", "Highest-verified option, prioritize maintenance and retesting"],
          ["Taste and odor plus PFAS concern", "Carbon if PFAS claim is real and cartridge schedule is realistic"],
          ["Uncertainty, want to test first", "Review utility context, then use certified labs"],
        ],
      },
    ],
    faqs: [
      { question: "What kind of water filter removes PFAS best?", answer: "Reverse osmosis is usually the strongest point-of-use option. Activated carbon can also help when the product has verified PFAS reduction and is maintained correctly." },
      { question: "Does activated carbon remove PFAS?", answer: "It can, but not every carbon filter should be assumed to do so. The specific reduction claim and third-party verification matter." },
      { question: "Is reverse osmosis better for PFAS?", answer: "Often yes when maximum reduction is the priority. It is not always the simplest or cheapest option, but it is often the strongest." },
      { question: "Do refrigerator filters remove PFAS?", answer: "Some may, many do not. Never assume PFAS reduction unless the product specifically says so and the claim is verified." },
      { question: "Should I test for PFAS before installing a filter?", answer: "Testing is worth it when the household needs certainty, the system purchase is expensive, or the local situation is unclear." },
    ],
    nextSteps: [
      "Check your area in [ZIP lookup](/search).",
      "Read the site's [PFAS guide](/contaminants/pfas).",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) with [activated carbon](/treatment/activated-carbon).",
      "Use [certified labs](/labs) if confirmation matters.",
      "Review [methodology](/methodology) to understand how Water Utility Report separates public data from household-specific questions.",
    ],
    relatedGuides: [
      "best-filter-for-lead-in-tap-water",
      "reverse-osmosis-vs-carbon-filter",
      "home-water-test-kits-vs-certified-labs",
      "what-type-of-water-filter-do-you-need",
    ],
  },

  // ── 3. Reverse osmosis vs carbon filter ──────────────────────────────────
  {
    slug: "reverse-osmosis-vs-carbon-filter",
    title: "Reverse Osmosis vs Carbon Filter: Which Is Better for Tap Water?",
    metaTitle: "Reverse Osmosis vs Carbon Filter | Which Is Better?",
    metaDescription:
      "Reverse osmosis and activated carbon solve different water problems. Compare contaminant removal, cost, maintenance, and home fit before you choose.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "Neither filter is better in general. **Reverse osmosis is usually better for dissolved contaminants such as PFAS, nitrates, arsenic, and lead. Activated carbon is usually better for chlorine, taste, odor, simplicity, and lower-cost everyday filtration.** The right choice depends on the problem you are trying to solve.",
    blocks: [
      { t: "callout", c: "Start with the contaminant or symptom, not the filter category. If you do not yet know what the problem is, begin with [ZIP lookup](/search)." },
      { t: "h2", c: "The Short Version" },
      { t: "h3", c: "Choose reverse osmosis when:" },
      { t: "ul", items: ["You are dealing with PFAS", "Nitrates are the concern", "Arsenic is part of the question", "You want the strongest point-of-use reduction profile", "You accept higher cost and a more involved install"] },
      { t: "h3", c: "Choose carbon when:" },
      { t: "ul", items: ["The main problem is chlorine taste or odor", "The water is technically safe but unpleasant", "You want easier installation and lower upfront cost", "You need a simpler household maintenance routine"] },
      { t: "h3", c: "Choose both when:" },
      { t: "ul", items: ["You want stronger reduction and better taste", "You are using an RO system that already includes carbon pre/post treatment", "You want layered protection at a drinking-water tap"] },
      { t: "h2", c: "Full Comparison" },
      {
        t: "table",
        headers: ["Factor", "Reverse osmosis", "Activated carbon"],
        rows: [
          ["Best fit", "Dissolved contaminants", "Taste, odor, chlorine, some organic compounds"],
          ["PFAS", "Usually strong", "Can help if specifically verified"],
          ["Lead", "Usually strong at point of use", "Can be strong if specifically certified for lead"],
          ["Nitrates", "Often appropriate", "Usually not the main answer"],
          ["Chlorine taste/odor", "Helps, but often secondary", "Often excellent"],
          ["Cost", "Higher", "Lower to moderate"],
          ["Installation burden", "Higher", "Lower"],
          ["Flow rate", "Lower", "Usually better"],
          ["Waste water", "Yes, with most systems", "No reject stream"],
          ["Best for renter", "Sometimes", "Often"],
          ["Whole-home suitability", "Limited for most use cases", "Often useful for chlorine or odor"],
        ],
      },
      { t: "h2", c: "Which Contaminants Each Technology Handles Best" },
      { t: "h3", c: "PFAS" },
      { t: "p", c: "Reverse osmosis is often the stronger default. Carbon can still be a credible option when the system specifically supports PFAS reduction. Read [PFAS guide](/contaminants/pfas)." },
      { t: "h3", c: "Lead" },
      { t: "p", c: "Both can work well when the product is specifically suited for lead reduction. The key is point-of-use protection at the tap, not generic whole-home treatment. Read [lead guide](/contaminants/lead)." },
      { t: "h3", c: "Nitrates" },
      { t: "p", c: "Reverse osmosis is usually the more relevant household technology. Carbon is not the usual answer. Read [nitrates guide](/contaminants/nitrates)." },
      { t: "h3", c: "Chlorine, Taste, and Odor" },
      { t: "p", c: "Carbon is usually the cleaner and simpler answer. If your complaint is bad taste and municipal disinfectant smell, RO is often unnecessary." },
      { t: "h2", c: "What Each Technology Does Poorly" },
      { t: "h3", c: "Reverse osmosis drawbacks" },
      { t: "ul", items: ["Higher upfront cost", "More complicated installation", "Slower flow and reject water", "May be excessive if the real issue is only taste or chlorine"] },
      { t: "h3", c: "Activated carbon drawbacks" },
      { t: "ul", items: ["Highly variable performance across products", "Weaker fit for some dissolved contaminants", "Easy for buyers to confuse 'better taste' with broad contaminant protection", "Can be undermined by late cartridge changes"] },
      { t: "h2", c: "Best Choice by Scenario" },
      {
        t: "table",
        headers: ["Scenario", "Better first fit"],
        rows: [
          ["Chlorine taste and odor", "Activated carbon"],
          ["PFAS concern", "Reverse osmosis or verified PFAS carbon system"],
          ["Nitrates in water", "Reverse osmosis"],
          ["Older-home lead concern", "Point-of-use RO or certified lead-reduction carbon"],
          ["Renter who needs simple install", "Activated carbon"],
          ["Family that wants strongest drinking-water protection", "Often reverse osmosis"],
          ["Whole-home chlorine smell", "Activated carbon at point of entry"],
        ],
      },
      { t: "h2", c: "When You May Need Both" },
      { t: "p", c: "In real homes, 'both' is common. A household might use a whole-home carbon system for chlorine and odor plus an under-sink RO system for drinking water. That is not overcomplication — it is matching the technology to the problem." },
    ],
    faqs: [
      { question: "Is reverse osmosis better than carbon filtration?", answer: "Not in general. It is usually better for some dissolved contaminants. Carbon is usually better for chlorine, taste, odor, simplicity, and lower cost." },
      { question: "Does carbon remove lead and PFAS?", answer: "Some carbon systems can, but only when the product has the right verified reduction claims. Generic carbon should not be assumed to solve either problem." },
      { question: "Why do people choose carbon over RO?", answer: "It is simpler, cheaper, easier to install, and often fully adequate for taste and odor complaints." },
      { question: "Does RO waste water?", answer: "Most systems do produce reject water. That is part of the tradeoff." },
      { question: "Can I use both carbon and RO together?", answer: "Yes. Many strong point-of-use systems already do." },
    ],
    nextSteps: [
      "Use [ZIP lookup](/search) if you are still defining the problem.",
      "Read the site guides for [PFAS](/contaminants/pfas), [lead](/contaminants/lead), and [nitrates](/contaminants/nitrates).",
      "Compare the detailed treatment pages for [reverse osmosis](/treatment/reverse-osmosis) and [activated carbon](/treatment/activated-carbon).",
      "Review [methodology](/methodology) if you want to understand how utility data and household decisions are separated.",
    ],
    relatedGuides: [
      "best-filter-for-lead-in-tap-water",
      "best-filter-for-pfas-in-drinking-water",
      "whole-house-filter-vs-under-sink-filter",
      "what-type-of-water-filter-do-you-need",
    ],
  },

  // ── 4. What does lead in tap water actually mean ─────────────────────────
  {
    slug: "what-does-lead-in-tap-water-actually-mean",
    title: "What Does Lead in Tap Water Actually Mean?",
    metaTitle: "What Does Lead in Tap Water Actually Mean? | Plain English",
    metaDescription:
      "Lead in tap water usually comes from plumbing, not the source water. Learn what action levels, first-draw samples, and household exposure really mean.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "understanding",
    categoryLabel: "Understanding Guide",
    intro:
      "For most homes, lead in tap water does **not** mean the river, reservoir, or treatment plant water itself is full of lead. It usually means lead entered the water somewhere between the utility system and your glass — often from older plumbing, solder, fixtures, or service lines.",
    blocks: [
      { t: "callout", c: "A utility can be compliant and a household can still have a lead problem at the tap. The two statements are not contradictory — they describe different parts of the system." },
      { t: "h2", c: "Where Lead in Water Usually Comes From" },
      { t: "ul", items: ["Lead service lines", "Lead-containing plumbing materials", "Older solder", "Brass fixtures", "Water sitting in pipes for long periods"] },
      { t: "p", c: "That is why the same city can have homes with very different lead exposure. Plumbing differences matter." },
      { t: "h2", c: "The Key Distinction People Miss" },
      { t: "p", c: "**A compliant utility is not the same thing as zero lead at your own tap.** A utility report reflects the public system and the regulatory framework the utility is judged under. Your kitchen tap reflects all of that **plus** the plumbing in your own home or building." },
      { t: "h2", c: "What the 15 ppb Action Level Means — and Doesn't Mean" },
      { t: "p", c: "The action level is a regulatory trigger used in lead compliance programs. It is not the same thing as saying below this number means perfect, above this number means the same risk everywhere, or household variation does not matter." },
      { t: "p", c: "The more useful plain-English framing: the action level is part of how the system is regulated. It is not the same thing as saying your own tap has zero concern." },
      { t: "h2", c: "Why No Amount of Lead Is Considered Ideal for Children" },
      { t: "p", c: "Lead is one of the clearest examples where legal compliance and ideal household exposure are not the same concept. For families with infants and young children, the practical question is not just 'Is my utility compliant?' It is: what is happening at my tap, does water sit in old plumbing, am I mixing infant formula with this water, should I test or filter?" },
      { t: "h2", c: "First-Draw vs Flushed Samples" },
      { t: "h3", c: "First-draw sample" },
      { t: "p", c: "Water collected after it has sat in plumbing. It often reflects the highest chance of lead pickup from the home's own plumbing components." },
      { t: "h3", c: "Flushed sample" },
      { t: "p", c: "Water taken after running the tap for a period of time. It can show a different picture because some of the water that sat in contact with plumbing has been cleared. If the goal is to understand exposure from water that sat overnight, first-draw matters." },
      { t: "h2", c: "Immediate Steps Households Can Take" },
      { t: "ul", items: ["Use only cold tap water for drinking and cooking", "Flush stagnant water when appropriate for the household's situation", "Install a point-of-use filter that is specifically suitable for lead reduction", "Consider household testing if the home is older or the stakes are high"] },
      { t: "h2", c: "When to Test and When to Filter" },
      { t: "h3", c: "Testing is especially worth it when:" },
      { t: "ul", items: ["The home is older", "There is a child or infant in the household", "You are making infant formula", "A real estate or landlord decision depends on clarity", "You want to know whether first-draw water is the main issue"] },
      { t: "h3", c: "Filtering is especially worth it when:" },
      { t: "ul", items: ["You want immediate exposure reduction", "You do not want to wait for a plumbing project", "The household is higher risk", "You already have reason to suspect lead at the tap"] },
      { t: "h2", c: "Decision Framework" },
      {
        t: "table",
        headers: ["Situation", "Most likely interpretation", "Best next move"],
        rows: [
          ["Utility is compliant but home is old", "Plumbing may still matter", "Test and use point-of-use filtration"],
          ["First-draw sample is elevated", "Water is likely picking up lead while sitting", "Reduce exposure and retest as needed"],
          ["No known issue, newer home", "Lower probability, not zero", "Check utility context first"],
          ["Infant formula household", "Low tolerance for uncertainty", "Filter now, test if needed"],
        ],
      },
    ],
    faqs: [
      { question: "Is any lead in tap water safe?", answer: "For practical household decision-making, especially with children, the better mindset is not to treat detectable lead casually. Compliance language and ideal exposure are not the same thing." },
      { question: "Does lead come from the city's source water?", answer: "Usually not. In many homes it comes from plumbing, service lines, fixtures, or solder." },
      { question: "Why does lead show up more in older homes?", answer: "Older plumbing materials and service lines increase the chance that water picks up lead before it reaches the glass." },
      { question: "Should I flush my tap before drinking?", answer: "Sometimes yes, especially when water has been sitting for a long time. But flushing is not the entire solution if lead is a persistent household concern." },
      { question: "Should I test my own tap even if my utility is compliant?", answer: "Yes, when the home is older, the household is higher risk, or the answer would change how you manage exposure." },
    ],
    nextSteps: [
      "Check your area in [ZIP lookup](/search).",
      "Read the broader [lead guide](/contaminants/lead).",
      "Use [certified labs](/labs) if you need a household-level answer.",
      "Compare filter options in [Best Filter for Lead in Tap Water](/guides/best-filter-for-lead-in-tap-water).",
      "Review [methodology](/methodology) to see how Water Utility Report separates public-system data from tap-specific interpretation.",
    ],
    relatedGuides: [
      "best-filter-for-lead-in-tap-water",
      "home-water-test-kits-vs-certified-labs",
      "does-boiling-water-remove-lead-pfas-or-nitrates",
      "how-to-read-a-water-quality-report",
    ],
  },

  // ── 5. What are nitrates in water ────────────────────────────────────────
  {
    slug: "what-are-nitrates-in-water",
    title: "What Are Nitrates in Water and Who Is Most at Risk?",
    metaTitle: "What Are Nitrates in Water? Who Is Most at Risk?",
    metaDescription:
      "Nitrates in water matter most for infants and some higher-risk households. Learn where nitrates come from, why boiling does not help, and what to do next.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "contaminants",
    categoryLabel: "Contaminant Guide",
    intro:
      "Nitrates are dissolved compounds that can get into water from fertilizer, agricultural runoff, septic influence, manure, and other environmental sources. They matter most when the household includes an **infant under 6 months** — because nitrate risk is not evenly distributed. The same water that creates low urgency for one household can create high urgency for another.",
    blocks: [
      { t: "callout", c: "This is not just a chemistry topic. It is a risk-tier topic." },
      { t: "h2", c: "What Nitrates Are" },
      { t: "p", c: "Nitrates are a form of nitrogen that dissolves easily in water. Because they move readily through soil and groundwater, they can show up in both public water and private wells. 'Nitrates detected' does not mean every household faces the same level of urgency." },
      { t: "h2", c: "Where Nitrates Usually Come From" },
      { t: "ul", items: ["Fertilizer runoff", "Agricultural areas", "Manure or livestock influence", "Septic systems", "Groundwater movement through affected land"] },
      { t: "h2", c: "Who Is Most at Risk" },
      { t: "h3", c: "Formula-fed infants under 6 months" },
      { t: "p", c: "This is the highest-risk group and the one that should shape most nitrate guidance. If a household is mixing infant formula with water and nitrates are a possibility, do not treat the question casually." },
      { t: "h3", c: "Private well users" },
      { t: "p", c: "Well owners carry more responsibility because they are not backed by a utility monitoring program in the same way public-water customers are." },
      { t: "h3", c: "Homes near agriculture or septic influence" },
      { t: "p", c: "These households should be more alert to nitrate possibility, especially if they rely on a private well." },
      { t: "h2", c: "Why Boiling Does Not Solve Nitrate Contamination" },
      { t: "callout", c: "Boiling does **not** remove nitrates. It can make concentration worse because some of the water evaporates while the nitrate remains. People often reach for boiling because it sounds like a general water-safety fix. It is not." },
      { t: "h2", c: "What Treatment Can Help" },
      { t: "p", c: "For household treatment, [reverse osmosis](/treatment/reverse-osmosis) is one of the main options people consider for nitrate reduction. The important point: nitrate treatment usually needs a technology designed for dissolved contaminants. A generic taste-and-odor filter is not the right assumption." },
      { t: "h2", c: "Public Water vs Private Well Context" },
      { t: "h3", c: "Public water" },
      { t: "p", c: "If you are on municipal water, the first step is to understand the utility context. Use [ZIP lookup](/search) and the site's [methodology](/methodology) to understand what public data can and cannot tell you." },
      { t: "h3", c: "Private well" },
      { t: "p", c: "If you are on a private well, the household carries the testing burden more directly. Nitrate concern is more likely to become a home-specific testing question rather than a utility-interpretation question." },
      { t: "h2", c: "Risk Framework by Household Type" },
      {
        t: "table",
        headers: ["Household type", "Nitrate concern level", "Best next move"],
        rows: [
          ["Infant formula household", "Highest", "Treat as time-sensitive, test and use appropriate treatment"],
          ["Private well household", "Higher", "Test routinely and do not rely on assumptions"],
          ["Healthy adult household on public water", "Moderate to lower", "Check utility context first"],
          ["Home near agriculture or septic influence", "Higher", "Test rather than guess"],
          ["Pregnancy concern", "Context-dependent", "Review source and consider testing"],
        ],
      },
    ],
    faqs: [
      { question: "Are nitrates in water dangerous?", answer: "They can be, especially for infants. The key point is that risk is not evenly distributed across all households." },
      { question: "Who is most at risk from nitrates?", answer: "Infants under 6 months, especially formula-fed infants, are the clearest high-risk group." },
      { question: "Does boiling water remove nitrates?", answer: "No. It can make concentration worse." },
      { question: "What filter removes nitrates?", answer: "Reverse osmosis is one of the most common household treatment paths for nitrate reduction." },
      { question: "Are nitrates more common in well water?", answer: "They are often a bigger household-level concern in private well settings because wells can be influenced by local land use and require owner-led testing." },
    ],
    nextSteps: [
      "If you are on public water, start with [ZIP lookup](/search).",
      "Read the broader [nitrates guide](/contaminants/nitrates).",
      "Review [reverse osmosis](/treatment/reverse-osmosis) if treatment is becoming likely.",
      "Use [certified labs](/labs) when the household includes an infant, uses a private well, or needs clarity.",
      "Review [methodology](/methodology) to understand the limits of utility-wide interpretation.",
    ],
    relatedGuides: [
      "does-boiling-water-remove-lead-pfas-or-nitrates",
      "reverse-osmosis-vs-carbon-filter",
      "home-water-test-kits-vs-certified-labs",
      "what-type-of-water-filter-do-you-need",
    ],
  },

  // ── 6. How to read a water quality report ────────────────────────────────
  {
    slug: "how-to-read-a-water-quality-report",
    title: "How to Read a Water Quality Report Without Getting Lost",
    metaTitle: "How to Read a Water Quality Report | CCR Explained",
    metaDescription:
      "Confused by your annual water quality report? Learn what the numbers, acronyms, and contaminant tables actually mean in plain English.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "understanding",
    categoryLabel: "Understanding Guide",
    intro:
      "Most people do not need more water data. They need translation. A water quality report — often called a Consumer Confidence Report or CCR — is not saying 'your water is perfect' or 'your water is dangerous' in one line. It is a document that needs to be read in pieces: what was detected, what the limit is, whether a violation occurred, and whether the issue is really utility-wide or could still be specific to your own tap.",
    blocks: [
      { t: "h2", c: "What a Consumer Confidence Report Is" },
      { t: "p", c: "A Consumer Confidence Report is the annual public report many water utilities provide to explain where the water came from, what contaminants were detected, how those results compare with regulatory limits, whether any violations occurred, and what treatment or compliance issues matter for the system. It is a utility-wide document — useful, but not always able to answer tap-specific questions about older plumbing, building conditions, or first-draw lead." },
      { t: "h2", c: "The Seven Things to Look at First" },
      { t: "ul", items: [
        "**Water source** — surface water, groundwater, purchased water, or a blend",
        "**Detected contaminants** — detected does not automatically mean unsafe",
        "**Highest result or range** — this tells you more than just seeing a contaminant name",
        "**MCL or regulatory benchmark** — this is the comparison line in the table",
        "**Violation language** — a detection and a violation are not the same thing",
        "**Lead language and plumbing notes** — these often signal where household-specific follow-up may matter",
        "**Dates and report period** — reports are not always real-time snapshots",
      ]},
      { t: "h2", c: "What the Common Acronyms Mean in Plain English" },
      {
        t: "table",
        headers: ["Acronym", "Stands for", "What it means"],
        rows: [
          ["MCL", "Maximum Contaminant Level", "The enforceable regulatory limit for a contaminant in public water"],
          ["MCLG", "Maximum Contaminant Level Goal", "A health-based goal, not always the same as the enforceable limit"],
          ["AL", "Action Level", "A compliance trigger (used for lead). Not the same thing as saying every tap is equally affected"],
          ["TT", "Treatment Technique", "System is judged by required treatment performance, not just a single concentration"],
          ["Violation", "Regulatory exceedance", "The utility crossed a regulatory requirement — deserves attention but doesn't always mean an immediate household emergency"],
        ],
      },
      { t: "h2", c: "Detected vs Above Limit vs Health Concern" },
      { t: "h3", c: "Detected" },
      { t: "p", c: "A contaminant was measured. That alone does not tell you whether the level was high, low, routine, or concerning." },
      { t: "h3", c: "Above limit" },
      { t: "p", c: "The measured level exceeded a regulatory line. This deserves more attention." },
      { t: "h3", c: "Health concern" },
      { t: "p", c: "A report may show something legal but still worth understanding more deeply, especially for a sensitive household or a contaminant like lead where plumbing conditions matter." },
      { t: "callout", c: "'Detected' is not a synonym for 'unsafe,' and 'legal' is not always a synonym for 'I know everything I need to know.'" },
      { t: "h2", c: "Why Your Report Can Show Contaminants Even if the Water Is Legal" },
      { t: "p", c: "Modern water reporting often shows detectable levels of various substances because detection methods are sensitive, trace detection is not the same as rule exceedance, and the system is reporting measured reality, not perfection. The better question is not 'Was anything detected?' It is 'What was detected, at what level, compared with what benchmark, and does it change what I should do?'" },
      { t: "h2", c: "When Utility-Wide Data Is Enough, and When Your Own Tap Still Needs Testing" },
      {
        t: "table",
        headers: ["What you see in the report", "What it usually means", "Best next move"],
        rows: [
          ["A contaminant is detected", "Something was measured", "Compare it to benchmark and context"],
          ["A contaminant is below the limit", "Usually compliant system result", "Understand sensitivity and household context"],
          ["A violation is listed", "Regulatory issue occurred", "Read utility explanation and decide whether follow-up matters"],
          ["Lead notes appear", "Plumbing-specific questions may still matter", "Review lead guide and consider testing"],
          ["Report looks clean but home is old", "Utility may be fine, plumbing may still matter", "Consider household-level testing"],
        ],
      },
    ],
    faqs: [
      { question: "What is a Consumer Confidence Report?", answer: "It is the annual public water-quality report many utilities publish to explain source water, detected contaminants, regulatory comparisons, and violations." },
      { question: "If something is detected, is my water unsafe?", answer: "Not automatically. Detection is not the same thing as exceeding a limit or having a household-level problem." },
      { question: "What does MCL mean?", answer: "It means Maximum Contaminant Level, the enforceable regulatory limit used in many public-water contaminant tables." },
      { question: "Why does my report show contaminants if the water is legal to drink?", answer: "Because modern testing can detect substances at levels below regulatory limits. Detection is not the same as noncompliance." },
      { question: "Should I test my own tap anyway?", answer: "Yes when the home is older, lead is a concern, the household is high sensitivity, or the decision is about your faucet rather than the whole utility." },
    ],
    nextSteps: [
      "Find your utility through [ZIP lookup](/search).",
      "Read relevant contaminant guides such as [PFAS](/contaminants/pfas), [lead](/contaminants/lead), or [nitrates](/contaminants/nitrates).",
      "Use [certified labs](/labs) if the question is actually about your own tap.",
      "Review [methodology](/methodology) if you want to understand how Water Utility Report interprets public data without overstating certainty.",
    ],
    relatedGuides: [
      "what-does-lead-in-tap-water-actually-mean",
      "what-are-nitrates-in-water",
      "home-water-test-kits-vs-certified-labs",
      "best-filter-for-lead-in-tap-water",
    ],
  },

  // ── 7. Home water test kits vs certified labs ─────────────────────────────
  {
    slug: "home-water-test-kits-vs-certified-labs",
    title: "Home Water Test Kits vs Certified Labs: Which Can You Trust?",
    metaTitle: "Home Water Test Kits vs Certified Labs | Which to Trust",
    metaDescription:
      "Home kits are not useless, but they are not the same as certified lab testing. Learn which option fits lead, PFAS, nitrate, well water, and real-life decisions.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "testing",
    categoryLabel: "Testing Guide",
    intro:
      "Home water test kits can be useful for quick screening, basic curiosity, and some simple troubleshooting. Certified labs are the stronger choice when the result will drive an expensive decision, a health-sensitive decision, a real-estate decision, or a contaminant-specific decision such as PFAS or lead confirmation.",
    blocks: [
      { t: "callout", c: "The better question is not 'Which one is accurate?' The better question is **'How high are the stakes?'**" },
      { t: "h2", c: "What Home Kits Are Good For" },
      { t: "ul", items: ["A basic first screen", "A rough sense of whether something may be off", "A starting point for taste, odor, or general troubleshooting", "A low-cost first step before deciding whether a lab is worth it"] },
      { t: "h2", c: "What Home Kits Are Bad At" },
      { t: "ul", items: [
        "The result needs to be defensible",
        "The contaminant is specific and harder to test reliably",
        "The household includes an infant or other higher-risk condition",
        "The answer will determine a major equipment purchase",
        "A landlord, buyer, seller, or contractor may rely on the result",
        "The contaminant of concern is PFAS",
        "The question is whether lead is truly present at a meaningful level",
      ]},
      { t: "h2", c: "The Stakes-Based Framework" },
      {
        t: "table",
        headers: ["Situation", "Better first move"],
        rows: [
          ["Curiosity about general water condition", "Home kit"],
          ["Bad taste or odor troubleshooting", "Home kit, then lab if unresolved"],
          ["PFAS concern", "Certified lab"],
          ["Lead concern in older home", "Usually certified lab"],
          ["Infant formula household", "Certified lab when clarity matters"],
          ["Private well routine check", "Often certified lab"],
          ["Home sale, landlord, or contractor documentation", "Certified lab"],
        ],
      },
      { t: "h2", c: "How to Choose a Lab" },
      { t: "p", c: "Look for a lab that is appropriately certified for the testing you need, clearly explains sample handling, lists the contaminants covered, provides understandable reporting, and has a process that fits your state or local context if applicable. A mail-in kit can still be legitimate **if the sample is being analyzed by a certified lab**." },
      { t: "h2", c: "When a Lab Is Worth the Cost" },
      { t: "p", c: "A lab is worth the cost when the answer changes something meaningful: whether you buy a treatment system, whether you trust the water for infant use, whether the issue appears utility-wide or home-specific, whether a real estate transaction or repair plan moves forward, or whether you need to confirm a contaminant with more confidence." },
      { t: "h2", c: "The Key Distinction People Miss" },
      { t: "p", c: "A home kit answers: 'Do I want a quick first look?' A certified lab answers: 'Am I willing to make a real decision based on this result?'" },
    ],
    faqs: [
      { question: "Are home water test kits accurate?", answer: "Some are useful for screening, but they are not equivalent to certified lab testing for higher-stakes decisions." },
      { question: "When should I use a certified lab instead?", answer: "When the result affects health-sensitive decisions, a major purchase, a property decision, or a contaminant-specific question such as PFAS or lead." },
      { question: "Can a home kit test for PFAS?", answer: "For meaningful certainty, PFAS is better handled through certified lab testing." },
      { question: "Do I need a lab for lead testing?", answer: "When the result will guide household exposure decisions or confirm a real concern, a certified lab is the stronger choice." },
      { question: "Are mail-in kits legitimate?", answer: "They can be, if the actual analysis is done by a certified lab and the process is transparent." },
    ],
    nextSteps: [
      "Use [certified labs](/labs) when the stakes are high.",
      "Check [ZIP lookup](/search) if you need public-water context first.",
      "Read the contaminant guides for [lead](/contaminants/lead), [PFAS](/contaminants/pfas), or [nitrates](/contaminants/nitrates).",
      "Review [methodology](/methodology) to understand how Water Utility Report handles system-level vs household-level evidence.",
    ],
    relatedGuides: [
      "best-filter-for-lead-in-tap-water",
      "best-filter-for-pfas-in-drinking-water",
      "what-are-nitrates-in-water",
      "how-to-read-a-water-quality-report",
    ],
  },

  // ── 8. Does boiling water remove lead, PFAS, or nitrates ─────────────────
  {
    slug: "does-boiling-water-remove-lead-pfas-or-nitrates",
    title: "Does Boiling Water Remove Lead, PFAS, or Nitrates?",
    metaTitle: "Does Boiling Water Remove Lead, PFAS, or Nitrates?",
    metaDescription:
      "Boiling helps with microbes, not most chemical contaminants. Learn why boiling does not remove lead, PFAS, or nitrates and what to do instead.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "understanding",
    categoryLabel: "Understanding Guide",
    intro:
      "No. Boiling does **not** remove lead, PFAS, or nitrates. Boiling is mainly useful for microbial concerns such as bacteria or other pathogens. In some cases — especially nitrates and lead — boiling can make concentration worse because water evaporates while the contaminant remains.",
    blocks: [
      { t: "callout", c: "This is one of the most common water-quality mistakes. People hear 'boil your water' and start to treat boiling as a universal safety upgrade. It is not." },
      { t: "h2", c: "What Boiling Actually Does to Water" },
      { t: "p", c: "Boiling is mainly used to reduce microbial risk. It is useful when the concern is bacteria, pathogens, or certain short-term contamination events that trigger a boil-water advisory. Boiling changes biological risk. It does not reliably remove many dissolved chemicals or metals." },
      { t: "h2", c: "Why Boiling Does Not Remove Lead" },
      { t: "p", c: "Lead is a metal. It does not disappear when the water is heated. If you boil water containing lead, the water volume can decrease while the lead remains behind — which can leave the remaining water more concentrated. The better path is point-of-use filtration, cold-water use for drinking and cooking, and household testing when the stakes are high." },
      { t: "h2", c: "Why Boiling Does Not Remove PFAS" },
      { t: "p", c: "PFAS are persistent chemicals. Boiling does not function as a household treatment method for PFAS. If PFAS is the concern, the discussion should shift to verified treatment options such as [reverse osmosis](/treatment/reverse-osmosis) or some properly verified carbon systems." },
      { t: "h2", c: "Why Boiling Does Not Remove Nitrates" },
      { t: "p", c: "Nitrates are one of the clearest examples of why boiling can backfire. Boiling does not remove them — it can concentrate them. That matters most for infant households. If nitrates are the concern and the water may be used for formula, do not rely on boiling." },
      { t: "h2", c: "The Mental Error Behind This Question" },
      { t: "h3", c: "Boil-water advisory" },
      { t: "p", c: "This usually points to a possible **microbial** problem. Boiling is the correct response." },
      { t: "h3", c: "Chemical or metal contamination concern" },
      { t: "p", c: "This points to dissolved compounds or metals that boiling does not fix. Those are not the same emergency and do not require the same response." },
      { t: "h2", c: "Boil-Water Advisory vs Contamination Advisory" },
      {
        t: "table",
        headers: ["Situation", "Does boiling help?", "Better next move"],
        rows: [
          ["Possible bacteria or pathogen event", "Often yes", "Follow official boil advisory instructions"],
          ["Lead concern", "No — may worsen concentration", "Filter, test, reduce exposure at tap"],
          ["PFAS concern", "No", "Verified treatment and testing"],
          ["Nitrate concern", "No — may worsen concentration", "Test and use appropriate treatment"],
          ["Unclear taste or odor issue", "Not necessarily", "Define the problem before acting"],
        ],
      },
      { t: "h2", c: "What to Do Instead for Each Contaminant" },
      { t: "h3", c: "Lead" },
      { t: "p", c: "Use a point-of-use filter suited for lead reduction, especially at the kitchen cold-water tap. Read [lead guide](/contaminants/lead)." },
      { t: "h3", c: "PFAS" },
      { t: "p", c: "Focus on verified PFAS-reduction treatment and certified testing when the answer matters. Read [PFAS guide](/contaminants/pfas)." },
      { t: "h3", c: "Nitrates" },
      { t: "p", c: "Do not boil. Treat the issue as a dissolved contaminant problem. [Reverse osmosis](/treatment/reverse-osmosis) and certified testing are usually more relevant. Read [nitrates guide](/contaminants/nitrates)." },
    ],
    faqs: [
      { question: "Does boiling water remove lead?", answer: "No. It can make concentration worse." },
      { question: "Does boiling water remove PFAS?", answer: "No." },
      { question: "Does boiling water remove nitrates?", answer: "No. It can make concentration worse." },
      { question: "Why do boil-water advisories exist if boiling does not fix chemicals?", answer: "Because boil-water advisories are usually about microbial risk, not dissolved chemical or metal contamination." },
      { question: "What should I do instead of boiling?", answer: "Identify the actual contaminant or risk type, then use the right path: testing, verified filtration, or both." },
    ],
    nextSteps: [
      "Stop treating boiling as a general answer to chemical contamination.",
      "Identify the actual problem through [ZIP lookup](/search), public reporting, or household testing.",
      "Read the specific contaminant guide for [lead](/contaminants/lead), [PFAS](/contaminants/pfas), or [nitrates](/contaminants/nitrates).",
      "Review [reverse osmosis](/treatment/reverse-osmosis) if treatment is becoming likely.",
      "Use [certified labs](/labs) when the decision depends on a stronger answer.",
    ],
    relatedGuides: [
      "what-does-lead-in-tap-water-actually-mean",
      "what-are-nitrates-in-water",
      "best-filter-for-lead-in-tap-water",
      "home-water-test-kits-vs-certified-labs",
    ],
  },

  // ── 9. Whole-house filter vs under-sink filter ───────────────────────────
  {
    slug: "whole-house-filter-vs-under-sink-filter",
    title: "Whole-House Filter vs Under-Sink Filter: Which One Do You Need?",
    metaTitle: "Whole-House Filter vs Under-Sink Filter | Which Do You Need?",
    metaDescription:
      "Whole-house and under-sink filters solve different problems. Learn when each setup makes sense for drinking water, chlorine, lead, PFAS, and home-wide issues.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "The right placement depends on the problem. Use an **under-sink or other point-of-use filter** when the concern is what you drink. Use a **whole-house system** when the issue affects most or all household water — such as chlorine odor, sediment, hardness, or some well-water conditions.",
    blocks: [
      { t: "callout", c: "The most common buying mistake is not choosing the wrong brand — it is choosing the wrong **location** for the treatment." },
      { t: "h2", c: "Point-of-Use vs Point-of-Entry Explained" },
      { t: "h3", c: "Point-of-use" },
      { t: "p", c: "A point-of-use system treats water where it is consumed — usually the kitchen sink or a dedicated drinking-water tap. This is the core logic for drinking-water problems." },
      { t: "h3", c: "Point-of-entry" },
      { t: "p", c: "A point-of-entry system treats water as it enters the home, before it reaches showers, appliances, laundry, and sinks. This is the core logic for whole-home water problems." },
      { t: "h2", c: "When Under-Sink Treatment Is the Smarter Choice" },
      { t: "ul", items: ["Lead is the concern", "PFAS is the concern", "Nitrates are the concern", "Cost efficiency matters", "The main goal is drinking and cooking water quality"] },
      { t: "h2", c: "When Whole-House Treatment Is the Smarter Choice" },
      { t: "ul", items: ["Chlorine odor affects showers and sinks throughout the house", "Sediment is showing up broadly", "Hard water is affecting appliances, scale, and soap performance", "The home has a broader well-water issue that touches many fixtures"] },
      { t: "h2", c: "Which Problems Fit Each Setup" },
      {
        t: "table",
        headers: ["Problem", "Better fit"],
        rows: [
          ["Lead at the tap", "Under-sink / point-of-use"],
          ["PFAS in drinking water", "Under-sink / point-of-use"],
          ["Nitrates", "Under-sink / point-of-use"],
          ["Chlorine smell in showers", "Whole-house"],
          ["Sediment across fixtures", "Whole-house"],
          ["Hard water scale", "Whole-house"],
          ["Bad drinking-water taste only", "Usually under-sink"],
          ["Whole-home odor issue", "Usually whole-house"],
        ],
      },
      { t: "h2", c: "Why People Buy the Wrong System" },
      { t: "h3", c: "Whole-house for a kitchen-only problem" },
      { t: "p", c: "This happens with lead and PFAS. The household buys a large system when the exposure concern is mainly what is consumed." },
      { t: "h3", c: "Under-sink for a whole-home problem" },
      { t: "p", c: "This happens with chlorine odor, hardness, or sediment. The drinking water improves, but the showers, fixtures, and appliances still have the same problem." },
      { t: "h2", c: "Best Setup by Scenario" },
      {
        t: "table",
        headers: ["Scenario", "Better first fit"],
        rows: [
          ["Older-home lead concern", "Under-sink point-of-use"],
          ["PFAS concern for drinking water", "Under-sink point-of-use"],
          ["Chlorine smell throughout house", "Whole-house"],
          ["White scale on fixtures", "Whole-house softening/treatment path"],
          ["Sediment clogging fixtures", "Whole-house"],
          ["Renter with drinking-water concern", "Under-sink or renter-friendly point-of-use"],
          ["All-around premium setup", "Hybrid — both may make sense"],
        ],
      },
      { t: "h2", c: "When a Hybrid Setup Makes Sense" },
      { t: "p", c: "A hybrid setup is often the smartest option when a home has both whole-home chlorine or sediment issues **plus** a drinking-water contaminant concern such as PFAS or lead. Whole-house carbon or sediment treatment plus under-sink RO is not overkill when the problems live at different points in the system." },
    ],
    faqs: [
      { question: "Is a whole-house filter better than an under-sink filter?", answer: "Not in general. Each fits a different problem." },
      { question: "Do I need whole-house treatment for lead?", answer: "Usually not as a first move. Lead is often best handled at the drinking-water tap." },
      { question: "Do I need whole-house treatment for chlorine?", answer: "Often yes when chlorine odor affects showers and the whole household experience." },
      { question: "Can I combine whole-house and under-sink systems?", answer: "Yes. Hybrid setups are often the cleanest answer when the home has both whole-home and drinking-water problems." },
      { question: "Which is cheaper long term?", answer: "That depends on what problem you are solving. Under-sink treatment is often cheaper for drinking-water contaminants. Whole-house treatment can be more efficient for house-wide issues." },
    ],
    nextSteps: [
      "Identify the problem through [ZIP lookup](/search), existing reports, or testing.",
      "Read the main [treatment overview](/treatment).",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) and [activated carbon](/treatment/activated-carbon).",
      "Read contaminant guides such as [lead](/contaminants/lead) and [PFAS](/contaminants/pfas) if the issue is exposure at the tap.",
      "Review [methodology](/methodology) to understand the line between public data and household-specific treatment decisions.",
    ],
    relatedGuides: [
      "reverse-osmosis-vs-carbon-filter",
      "best-filter-for-lead-in-tap-water",
      "best-filter-for-pfas-in-drinking-water",
      "what-type-of-water-filter-do-you-need",
    ],
  },

  // ── 10. What type of water filter do you need ────────────────────────────
  {
    slug: "what-type-of-water-filter-do-you-need",
    title: "What Type of Water Filter Do You Need for Your Problem?",
    metaTitle: "What Type of Water Filter Do You Need? | Problem-Based Guide",
    metaDescription:
      "Start with the water problem, not the product category. Match lead, PFAS, nitrates, chlorine, hard water, and more to the right kind of filtration.",
    publishDate: "2026-04-14",
    lastUpdated: "2026-04-14",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "The right filter starts with the problem, not the product category. A household worried about lead should not shop the same way as a household dealing with chlorine taste, PFAS, nitrates, hard water, sediment, or a private-well microbial concern. The filter category only makes sense **after** the water problem is defined.",
    blocks: [
      { t: "h2", c: "Start with the Problem, Not the Filter Brand" },
      { t: "p", c: "Most water-filter shopping goes wrong in one of two ways: people buy a product category they recognize instead of one that fits the contaminant, or people buy based on fear, not problem definition." },
      { t: "ul", items: ["Define the problem", "Decide whether it is utility-wide, plumbing-specific, or household-specific", "Match the treatment type to the problem", "Test when the stakes justify it"] },
      { t: "h2", c: "Problem-to-Filter Matrix" },
      {
        t: "table",
        headers: ["Problem", "Usually best filter/treatment path", "Notes"],
        rows: [
          ["Lead", "Point-of-use RO or certified lead-reduction filter", "Focus on the drinking-water tap"],
          ["PFAS", "Verified RO or verified PFAS-capable point-of-use carbon system", "Certification matters"],
          ["Nitrates", "Reverse osmosis or other nitrate-suited treatment", "Do not rely on boiling"],
          ["Chlorine taste or odor", "Activated carbon", "Often no need for RO"],
          ["Hard water", "Water softener", "Not the same as purification"],
          ["Sediment", "Sediment prefiltration", "Solve the particle problem first"],
          ["Microbial well-water concern", "Testing first, then possible UV/disinfection path", "Do not guess from taste"],
          ["General uncertainty", "Testing or utility-context review first", "Do not buy blind"],
        ],
      },
      { t: "h2", c: "Symptom-Based Chooser" },
      { t: "h3", c: "Bad taste" },
      { t: "p", c: "Often points toward chlorine, organic compounds, or general aesthetic issues. Carbon is often the first technology people consider." },
      { t: "h3", c: "Rotten egg smell" },
      { t: "p", c: "Often suggests a sulfur-related issue or another source problem that may need diagnosis before simple filter shopping." },
      { t: "h3", c: "White scale on fixtures" },
      { t: "p", c: "Usually points toward hardness. That pushes the household toward softening, not generic drinking-water filtration." },
      { t: "h3", c: "Infant safety concern" },
      { t: "p", c: "This is a risk-level upgrade. Nitrates, lead, and uncertainty all become more important. See [what are nitrates in water](/guides/what-are-nitrates-in-water) and [best filter for lead](/guides/best-filter-for-lead-in-tap-water)." },
      { t: "h3", c: "Older-home plumbing concern" },
      { t: "p", c: "That should push lead higher on the list, especially for first-draw exposure. See [what does lead in tap water actually mean](/guides/what-does-lead-in-tap-water-actually-mean)." },
      { t: "h2", c: "When Not to Buy a Filter Yet" },
      { t: "ul", items: [
        "You do not know whether the issue is real",
        "The symptom points to a plumbing or appliance issue, not a treatment issue",
        "The household is considering an expensive system based only on fear",
        "The problem may be private-well related and needs real testing first",
        "The result will affect an infant household or major property decision",
      ]},
      { t: "h2", c: "Best First Move by Scenario" },
      {
        t: "table",
        headers: ["Scenario", "Best first move"],
        rows: [
          ["You only know the water tastes bad", "Start with symptom matching, likely carbon"],
          ["Worried about PFAS from local news", "Check ZIP lookup, then compare verified treatment"],
          ["Live in an older home", "Review lead guide, then test or protect point of use"],
          ["Use private well water", "Test before buying major equipment"],
          ["Mixing infant formula", "Elevate nitrate and lead questions immediately"],
          ["See white scale everywhere", "Hardness path, not generic filtration"],
        ],
      },
      { t: "h2", c: "The Key Distinction People Miss" },
      { t: "p", c: "There is no universal 'best water filter.' There is only a best filter for a **defined problem**. That is why answer-engine and search content in this space often fails — it tries to recommend a product class before establishing what the household is actually solving for." },
    ],
    faqs: [
      { question: "How do I know what type of water filter I need?", answer: "Define the problem first. The right filter depends on whether the issue is lead, PFAS, nitrates, chlorine taste, hardness, sediment, or a well-water question." },
      { question: "Is reverse osmosis the best option for everything?", answer: "No. It is strong for some dissolved contaminants, but it is not the best default for every taste, odor, hardness, or whole-home issue." },
      { question: "What filter helps with chlorine taste?", answer: "Activated carbon is often the first treatment category people consider." },
      { question: "What filter helps with lead or PFAS?", answer: "Usually a verified point-of-use system, often reverse osmosis or another specifically verified treatment path." },
      { question: "When should I test my water before buying a system?", answer: "When the problem is uncertain, the household is higher risk, the purchase is expensive, or the answer will affect a property or health-sensitive decision." },
    ],
    nextSteps: [
      "Use [ZIP lookup](/search) if you are still defining the problem.",
      "Use [certified labs](/labs) when the stakes justify testing first.",
      "Read [lead](/contaminants/lead), [PFAS](/contaminants/pfas), or [nitrates](/contaminants/nitrates) if the issue is contaminant-specific.",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) and [activated carbon](/treatment/activated-carbon).",
      "Review [treatment overview](/treatment) and [methodology](/methodology) for the full logic.",
    ],
    relatedGuides: [
      "reverse-osmosis-vs-carbon-filter",
      "whole-house-filter-vs-under-sink-filter",
      "best-filter-for-lead-in-tap-water",
      "best-filter-for-pfas-in-drinking-water",
    ],
  },

  // ── 11. Is Tap Water Safe to Drink ───────────────────────────────────────
  {
    slug: "is-tap-water-safe-to-drink",
    title: "Is Tap Water Safe to Drink?",
    metaTitle: "Is Tap Water Safe to Drink? | What the Data Actually Shows",
    metaDescription:
      "For most Americans, tap water is safe — but 'safe' has real limits. Learn what regulated utilities guarantee, what they don't, and when filtering makes sense.",
    publishDate: "2026-04-30",
    lastUpdated: "2026-04-30",
    category: "understanding",
    categoryLabel: "Understanding Your Water",
    intro:
      "For most Americans served by a regulated public water utility, tap water is safe to drink by legal standards. It is tested far more frequently than bottled water, subject to federal Maximum Contaminant Levels (MCLs), and must be reported publicly each year. That said, 'meets the legal standard' and 'poses zero health risk' are not the same thing — and the gaps between those two statements are exactly where the real questions about tap water safety live.",
    blocks: [
      {
        t: "callout",
        c: "The fastest way to know your specific water: enter your ZIP at [waterutilityreport.com/search](/search) to see your utility's EPA violation history and risk level.",
      },
      { t: "h2", c: "Is Tap Water Safe to Drink in the United States?" },
      {
        t: "p",
        c: "Yes — for the vast majority of Americans, municipal tap water is safe to drink day to day. The EPA regulates over 90 contaminants in public water systems, requires regular testing, and mandates public reporting through annual Consumer Confidence Reports (CCRs). The U.S. has one of the most regulated drinking water systems in the world. Most utilities meet federal standards consistently.",
      },
      { t: "h2", c: "What Does 'Safe' Actually Mean?" },
      {
        t: "p",
        c: "Safe means the water meets EPA Maximum Contaminant Levels (MCLs) — legally enforceable limits set at concentrations where the population-wide health risk is considered acceptable. It does not mean zero contaminants, zero risk, or that every individual in every circumstance faces no harm. The EPA's MCLGs (Maximum Contaminant Level Goals) are often more protective than the enforceable MCLs — for lead and several other contaminants, the MCLG is zero, meaning no level is technically without risk.",
      },
      { t: "h2", c: "What the Regulations Do Guarantee" },
      {
        t: "ul",
        items: [
          "Regular testing for over 90 regulated contaminants — including bacteria, nitrates, disinfection byproducts, lead, and others",
          "Public reporting: utilities must publish an annual Consumer Confidence Report (CCR) with test results",
          "Violation notices: customers must be notified promptly if a health-based standard is exceeded",
          "Corrective action requirements when violations occur",
        ],
      },
      { t: "h2", c: "What the Regulations Do Not Guarantee" },
      {
        t: "ul",
        items: [
          "Zero lead at your specific tap — lead enters water from service lines and plumbing inside your home, which the utility does not control",
          "Safety for all populations equally — the elderly, infants, pregnant women, and immunocompromised individuals face higher risk at levels that are legal for the general population",
          "Protection from unregulated contaminants — PFAS was unregulated until 2024; many other chemicals are not yet regulated",
          "Clean water from private wells — roughly 43 million Americans on private wells receive no federal regulatory protection and no required testing",
        ],
      },
      { t: "h2", c: "The Biggest Real-World Gaps in Tap Water Safety" },
      { t: "h3", c: "Lead at the Tap" },
      {
        t: "p",
        c: "Lead is the most common gap between a utility's clean report and what actually comes out of your faucet. An estimated 9.2 million lead service lines still connect homes to water mains across the U.S. Utilities test their system — not your specific tap — so a utility can be fully compliant while your home still has elevated lead. Homes built before 1986 carry the highest risk. See the full [lead in drinking water guide](/contaminants/lead) and the [best filter for lead](/guides/best-filter-for-lead-in-tap-water).",
      },
      { t: "h3", c: "PFAS ('Forever Chemicals')" },
      {
        t: "p",
        c: "PFAS were present in U.S. drinking water for decades before the EPA set its first limits in April 2024. An estimated 45% of U.S. tap water samples contain at least one detectable PFAS compound. Utilities have until 2029 to comply with the new 4 parts per trillion limit for PFOA and PFOS. Until then, your water may legally contain PFAS above levels now considered concerning. See the [PFAS contaminant guide](/contaminants/pfas).",
      },
      { t: "h3", c: "Nitrates in Agricultural Areas" },
      {
        t: "p",
        c: "Nitrate contamination from agricultural runoff is the most widespread agricultural contaminant in U.S. groundwater. The current EPA limit of 10 mg/L was set in 1991 to protect infants — not based on cancer risk data. Emerging research suggests cancer risk may begin at 3–5 mg/L. Rural residents and private well owners in farming regions face the highest exposure. See the [nitrates guide](/contaminants/nitrates).",
      },
      { t: "h3", c: "Disinfection Byproducts" },
      {
        t: "p",
        c: "Chlorine — used to kill bacteria — reacts with organic matter in source water to form disinfection byproducts (DBPs) including trihalomethanes. Long-term high-level DBP exposure is associated with increased bladder cancer risk. DBPs are regulated, but individual samples can spike while annual averages stay within limits. See the [disinfection byproducts guide](/contaminants/disinfection-byproducts).",
      },
      { t: "h2", c: "How to Check Your Specific Water Safety" },
      {
        t: "p",
        c: "The most direct way to assess your tap water is to look up your utility's violation history and risk profile. [Search by ZIP code](/search) to find your utility, see EPA violations over the past decade, and understand whether any health-based standards have been exceeded. Your utility's annual Consumer Confidence Report (CCR) contains the specific test results for your water system — it must be published each year and is usually available on your utility's website.",
      },
      { t: "h2", c: "Is Tap Water Safe for Infants and Babies?" },
      {
        t: "p",
        c: "Tap water is generally considered acceptable for healthy, full-term infants when prepared formula is mixed with water that meets EPA standards and has no known lead contamination. However, infants face a higher risk from both nitrates (blue baby syndrome) and lead (no safe exposure threshold). If your home is pre-1986 construction, has a known lead service line, or your utility has a history of nitrate violations, using filtered or bottled water for formula preparation is prudent. A [reverse osmosis system](/treatment/reverse-osmosis) eliminates both risks at the kitchen tap.",
      },
      { t: "h2", c: "Is Tap Water Safe During Pregnancy?" },
      {
        t: "p",
        c: "For most pregnant people on regulated public water systems, tap water is safe. Specific concerns include lead (crosses the placental barrier), nitrates (associated with adverse birth outcomes at higher levels), and PFAS (associated with developmental effects). If you are pregnant and your home has pre-1986 plumbing, near-limit nitrate levels, or known PFAS contamination, filtering your drinking water is a reasonable precaution.",
      },
      { t: "h2", c: "Is Tap Water Safer Than Bottled Water?" },
      {
        t: "p",
        c: "In the United States, tap water from a regulated utility is generally more stringently regulated than bottled water. Municipal water is tested hundreds to thousands of times per year and results are publicly disclosed. Bottled water is regulated by the FDA, which requires it to meet EPA-equivalent standards — but testing is less frequent and results are not public. Bottled water also has a significant environmental footprint. The exception is areas with known contamination, lead service lines, or private well situations where tap water may genuinely be the less safe option.",
      },
      { t: "h2", c: "When a Filter Is Worth It" },
      {
        t: "table",
        headers: ["Situation", "Recommendation"],
        rows: [
          ["Pre-1986 home, unknown service line material", "Test for lead; install certified lead-reduction filter while waiting"],
          ["Infant or formula preparation in household", "Use RO or NSF/ANSI 53 lead-certified filter for drinking/cooking water"],
          ["Agricultural area or rural well", "Annual nitrate testing; RO if above 5 mg/L"],
          ["Near military base, airport, or industrial site", "Test for PFAS; RO if detected"],
          ["Chlorine taste or odor concern", "Activated carbon filter handles taste and DBPs"],
          ["Private well, no recent test", "Full baseline lab test before drawing any conclusions"],
          ["Utility with recent health-based violation", "Check the specific contaminant; act accordingly"],
        ],
      },
      { t: "h2", c: "When Tap Water Is Fine Without Any Filtering" },
      {
        t: "p",
        c: "If your utility has a clean violation history, your home was built after 1986, you are not in an agricultural or known PFAS-contaminated area, and you are not in a high-risk population group, your tap water is very likely safe to drink without additional filtration. Most Americans fall into this category. Filtering for taste or peace of mind is always reasonable — but it is not required for safety in most cases.",
      },
    ],
    faqs: [
      {
        question: "Is tap water safe to drink in the United States?",
        answer: "Yes, for most Americans. Public water utilities are regulated by the EPA, required to test for over 90 contaminants, and must report results publicly. However, 'meets legal standards' is not the same as 'zero risk' — lead at the tap, PFAS, and nitrates are real gaps that affect specific populations and locations.",
      },
      {
        question: "How do I know if my tap water is safe?",
        answer: "Search by ZIP code to find your utility's EPA violation history. Your utility's annual Consumer Confidence Report (CCR) contains the actual test results for your water system. For lead specifically, testing your own tap is more informative than the utility's system-wide report.",
      },
      {
        question: "Is tap water safe for babies?",
        answer: "Generally yes, when the water meets EPA standards and there is no lead contamination. Infants face higher risk from both nitrates and lead. If your home is pre-1986, use filtered or bottled water for formula preparation until you confirm there is no lead issue.",
      },
      {
        question: "Is bottled water safer than tap water?",
        answer: "Usually not. U.S. tap water from regulated utilities is tested far more frequently than bottled water, and results are public. Bottled water must meet EPA-equivalent standards but is tested less often. The exception is situations involving known tap water contamination, lead service lines, or private wells.",
      },
      {
        question: "What contaminants are most commonly found in tap water?",
        answer: "The most widespread concerns are lead (from aging infrastructure, not source water), PFAS (present in about 45% of sampled systems), nitrates (particularly in agricultural areas), and disinfection byproducts from chlorine treatment. All are regulated, but the gaps between regulation and individual exposure are real.",
      },
      {
        question: "Does a Brita filter make tap water safe?",
        answer: "A Brita pitcher filter improves taste by reducing chlorine and some sediment. It does NOT reliably remove lead, PFAS, or nitrates unless the specific model is certified for those contaminants (most standard Brita models are not). For health-based concerns, look for NSF/ANSI 53 certification for lead or choose a reverse osmosis system.",
      },
    ],
    nextSteps: [
      "Check your utility's violation history with [ZIP lookup](/search).",
      "Read your utility's annual Consumer Confidence Report — look it up on your utility's website.",
      "See [lead](/contaminants/lead), [PFAS](/contaminants/pfas), [nitrates](/contaminants/nitrates), or [disinfection byproducts](/contaminants/disinfection-byproducts) for contaminant-specific detail.",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) and [activated carbon](/treatment/activated-carbon) if filtering makes sense for your situation.",
      "Private well owner? See [how to test well water](/guides/how-to-test-well-water).",
    ],
    relatedGuides: [
      "how-to-read-a-water-quality-report",
      "home-water-test-kits-vs-certified-labs",
      "best-filter-for-lead-in-tap-water",
      "what-type-of-water-filter-do-you-need",
    ],
  },

  // ── 12. Best filter for nitrates ─────────────────────────────────────────
  {
    slug: "best-filter-for-nitrates-in-drinking-water",
    title: "Best Filter for Nitrates in Drinking Water",
    metaTitle: "Best Filter for Nitrates in Drinking Water | What Actually Works",
    metaDescription:
      "Only two technologies reliably remove nitrates from drinking water: reverse osmosis and ion exchange. Learn which one fits your situation — and what to avoid.",
    publishDate: "2026-04-30",
    lastUpdated: "2026-04-30",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "Only two in-home filtration technologies reliably remove nitrates from drinking water: **reverse osmosis (RO)** and **anion exchange (ion exchange)**. Activated carbon filters, pitcher filters, water softeners, UV purifiers, and boiling do not remove nitrates — and boiling actually makes the problem worse by concentrating them as water evaporates. If nitrate is your specific concern, the filter choice is narrower than most categories.",
    blocks: [
      {
        t: "callout",
        c: "Boiling water does NOT remove nitrates. It concentrates them. Never use boiling as a treatment for nitrate-contaminated water, especially for infant formula.",
      },
      { t: "h2", c: "Why Nitrate Removal Is Different from Most Filtration" },
      {
        t: "p",
        c: "Nitrate (NO₃⁻) is a dissolved ionic compound — not a particle, heavy metal, or organic chemical. This means it passes straight through most filtration media that work well for contaminants like lead, chlorine, or sediment. Most filters are designed and certified for entirely different mechanisms. When shopping for a nitrate filter, the relevant certifications are NSF/ANSI Standard 58 (for RO systems) and NSF/ANSI Standard 62 (for distillation). See the full [nitrates contaminant guide](/contaminants/nitrates) for health background.",
      },
      { t: "h2", c: "The Two Technologies That Actually Work" },
      { t: "h3", c: "1. Reverse Osmosis (RO)" },
      {
        t: "p",
        c: "Reverse osmosis removes 85–95% of nitrate by forcing water through a semi-permeable membrane that blocks dissolved ions, including nitrate. It is the most widely available and easiest-to-install point-of-use solution for nitrates. A countertop or under-sink RO system costs $150–$400 and handles nitrate alongside lead, PFAS, arsenic, and most other dissolved contaminants simultaneously. This makes RO particularly valuable if you have multiple concerns or live in an agricultural area where several contaminants may be present. See the full [reverse osmosis guide](/treatment/reverse-osmosis).",
      },
      { t: "h3", c: "2. Anion Exchange (Ion Exchange for Nitrate)" },
      {
        t: "p",
        c: "Anion exchange resins are specifically designed to remove nitrate ions by swapping them for chloride ions. When properly sized and maintained, anion exchange systems can remove over 90% of nitrate. They are more commonly used in whole-house or point-of-entry applications — making them the better choice when you want nitrate removed from all household water, not just drinking water. Anion exchange does not remove other contaminants like lead or PFAS. Note: standard water softeners use cation exchange and do NOT remove nitrate.",
      },
      { t: "h2", c: "What Does NOT Remove Nitrate" },
      {
        t: "ul",
        items: [
          "**Activated carbon filters** (pitcher, faucet, under-sink, whole-house) — no mechanism for ionic nitrate removal",
          "**Water softeners** — use cation exchange, which targets calcium and magnesium, not nitrate anions",
          "**UV purification** — kills bacteria but has no effect on dissolved chemicals",
          "**Sediment filters** — remove particles only",
          "**Boiling** — concentrates nitrate as water evaporates; makes it worse",
          "**Refrigerator filters** — typically certified only for taste/odor and chlorine reduction",
        ],
      },
      { t: "h2", c: "Reverse Osmosis vs Anion Exchange for Nitrates" },
      {
        t: "table",
        headers: ["Factor", "Reverse Osmosis", "Anion Exchange"],
        rows: [
          ["Nitrate removal rate", "85–95%", "90%+ when properly maintained"],
          ["Handles multiple contaminants?", "Yes — lead, PFAS, arsenic, and more", "No — nitrate-specific"],
          ["Point-of-use or whole-house?", "Point-of-use (drinking/cooking tap)", "Both; common whole-house"],
          ["Cost (unit)", "$150–$400", "$400–$1,500+"],
          ["Maintenance", "Membrane + filter cartridge changes", "Resin recharge with salt/chloride"],
          ["Produces wastewater?", "Yes — 3–4 gallons per gallon filtered", "Minimal during normal use"],
          ["Renter-friendly?", "Countertop models available", "Typically requires installation"],
          ["Best when", "Multiple concerns; drinking/cooking only", "Nitrate-only concern; whole-house needed"],
        ],
      },
      { t: "h2", c: "Who Most Needs a Nitrate Filter" },
      { t: "h3", c: "Households with Infants Under 6 Months" },
      {
        t: "p",
        c: "Infants are the highest-risk group for nitrate toxicity — their digestive systems convert more nitrate to nitrite, which binds to hemoglobin and causes methemoglobinemia ('blue baby syndrome'). The EPA and CDC both recommend against using water above 10 mg/L for infant formula. If your water tests above 5 mg/L and you have or are expecting an infant, installing an RO system before the baby arrives is the most protective action you can take.",
      },
      { t: "h3", c: "Pregnant Women in Agricultural Areas" },
      {
        t: "p",
        c: "Nitrate exposure during pregnancy is associated with adverse birth outcomes at higher levels. If you are pregnant and your water tests above 5 mg/L — even within the legal 10 mg/L limit — filtering your drinking and cooking water is a reasonable precaution.",
      },
      { t: "h3", c: "Private Well Owners in Farming Regions" },
      {
        t: "p",
        c: "Agricultural nitrate contamination is the dominant risk for private wells in the Midwest Corn Belt (Iowa, Nebraska, Kansas, Indiana, Illinois) and California's Central Valley. The USGS estimates over 20% of tested wells in some farming counties exceed the EPA limit. Private well owners receive no regulatory protection and no automatic notification. Annual testing plus an RO system is the standard recommendation for high-risk agricultural areas. See [how to test well water](/guides/how-to-test-well-water) for testing guidance.",
      },
      { t: "h3", c: "Long-Term Cancer Risk Concern at Sub-MCL Levels" },
      {
        t: "p",
        c: "Emerging research links long-term nitrate exposure above 3–5 mg/L to increased colorectal and bladder cancer risk — levels that are legal under the current 10 mg/L standard. If your water regularly tests at 5 mg/L or above, an RO system for drinking and cooking water is an inexpensive hedge against a risk that may not fully appear in current regulation.",
      },
      { t: "h2", c: "Decision Framework: Which Filter Is Right for You" },
      {
        t: "table",
        headers: ["Your situation", "Best option"],
        rows: [
          ["Infant or pregnancy in household", "Under-sink or countertop RO immediately"],
          ["Agricultural area well, multiple unknowns", "RO — handles nitrate plus other potential contaminants"],
          ["Nitrate is the only confirmed concern", "Anion exchange or RO — compare whole-house vs point-of-use needs"],
          ["Renter, limited installation options", "Countertop RO system"],
          ["Want to protect all household uses", "Whole-house anion exchange"],
          ["Don't know your nitrate level yet", "Test first (certified lab, $25–$40), then decide"],
        ],
      },
      { t: "h2", c: "What to Check Before Buying" },
      {
        t: "ul",
        items: [
          "**NSF/ANSI 58 certification** on the full RO system — not just the membrane",
          "**Rated for nitrate reduction** explicitly — not just TDS or general mineral reduction",
          "**Maintenance schedule** — RO membranes typically need replacement every 2–3 years; pre-filters every 6–12 months",
          "**Water waste ratio** — standard RO wastes 3–4 gallons per gallon filtered; newer models are more efficient",
          "**Anion exchange resin type** — must be type II strong base anion resin for nitrate; not all ion exchange removes nitrate",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best filter for nitrates in drinking water?",
        answer: "Reverse osmosis is the most widely available and effective option for most households, removing 85–95% of nitrate. Anion exchange systems are an alternative, particularly for whole-house treatment. Both are effective when properly maintained. Activated carbon filters, water softeners, and pitcher filters do not remove nitrate.",
      },
      {
        question: "Does boiling water remove nitrates?",
        answer: "No — boiling makes nitrate concentration worse, not better. As water evaporates during boiling, the nitrate remains and becomes more concentrated in the remaining water. Never use boiling to treat nitrate-contaminated water, especially for infant formula.",
      },
      {
        question: "Does a water softener remove nitrates?",
        answer: "No. Standard water softeners use cation exchange to remove calcium and magnesium (the minerals that cause hardness). Nitrate is an anion and passes through a standard softener unchanged. You need a reverse osmosis system or an anion exchange system specifically designed for nitrate.",
      },
      {
        question: "Does Brita or a carbon filter remove nitrates?",
        answer: "No. Activated carbon filters — including Brita, PUR, and similar pitcher or faucet filters — do not remove nitrate. Nitrate is an ionic compound that passes through carbon media without being captured. Only reverse osmosis and anion exchange reliably remove nitrate.",
      },
      {
        question: "What nitrate level requires a filter?",
        answer: "The EPA limit is 10 mg/L. For infants under 6 months, any level above 10 mg/L is a medical concern — use filtered or bottled water for formula. For healthy adults, 10 mg/L is the legal threshold. Emerging cancer risk research suggests filtering is prudent at levels above 5 mg/L with long-term exposure, even though those levels are technically legal.",
      },
      {
        question: "How much does a nitrate filter cost?",
        answer: "A countertop or under-sink reverse osmosis system costs $150–$400 upfront, with ongoing filter replacement costs of roughly $50–$100 per year. A whole-house anion exchange system runs $400–$1,500 installed. Certified lab nitrate testing runs $25–$40 — testing before buying ensures you're treating a confirmed problem.",
      },
    ],
    nextSteps: [
      "Read the [nitrates contaminant guide](/contaminants/nitrates) for the health background.",
      "Check if your utility has nitrate violations with [ZIP lookup](/search).",
      "Private well? See [how to test well water](/guides/how-to-test-well-water) before choosing a filter.",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) in depth for the full technology overview.",
      "Use [certified labs](/labs) to get an accurate nitrate reading — test strips are not accurate enough near the MCL.",
    ],
    relatedGuides: [
      "what-are-nitrates-in-water",
      "reverse-osmosis-vs-carbon-filter",
      "how-to-test-well-water",
      "does-boiling-water-remove-lead-pfas-or-nitrates",
    ],
  },

  // ── 13. How to Test Well Water ────────────────────────────────────────────
  {
    slug: "how-to-test-well-water",
    title: "How to Test Well Water: A Step-by-Step Guide",
    metaTitle: "How to Test Well Water: Step-by-Step | What to Test & When",
    metaDescription:
      "Private well owners have no regulatory safety net. Here's exactly how to test your well water, what to test for, how often, and how to read the results.",
    publishDate: "2026-04-30",
    lastUpdated: "2026-04-30",
    category: "testing",
    categoryLabel: "Testing Guide",
    intro:
      "Private well owners receive no regulatory protection and no required testing — the entire responsibility for knowing what is in your water falls on you. Unlike tap water from a regulated utility, your well is not monitored by the EPA, state environmental agencies, or your county unless you initiate it. This guide covers exactly what to test for, how to collect a proper sample, where to send it, and how to interpret the results.",
    blocks: [
      {
        t: "callout",
        c: "An estimated 43 million Americans rely on private wells. None of them receive routine federal water quality monitoring. If you have a well and have never tested your water, testing should be your first action.",
      },
      { t: "h2", c: "Why Well Water Testing Is Different from Utility Water" },
      {
        t: "p",
        c: "Municipal water systems are tested hundreds to thousands of times per year by the utility and reported publicly. Private wells are tested only when the owner initiates it. Your neighbor's well can test clean while yours tests positive for nitrates — groundwater contamination is highly localized, and what's true for your county or region is not necessarily true for your specific well. Annual testing is the minimum; twice-yearly is better in high-risk agricultural or karst areas.",
      },
      { t: "h2", c: "What to Test Your Well Water For" },
      { t: "h3", c: "The Annual Minimum — Test Every Year" },
      {
        t: "ul",
        items: [
          "**Total coliform bacteria** — the most critical annual test; coliform presence indicates fecal contamination pathway",
          "**E. coli** — a subset of coliform; direct indicator of fecal contamination and immediate health risk",
          "**Nitrates** — the most widespread agricultural contaminant in groundwater; critical for households with infants",
          "**pH** — acidic water (below 7.0) leaches lead and copper from plumbing; affects treatment decisions",
        ],
      },
      { t: "h3", c: "Every 3–5 Years — Comprehensive Panel" },
      {
        t: "ul",
        items: [
          "**Arsenic** — naturally occurring in many geological formations; colorless, tasteless, and carcinogenic at long-term exposure",
          "**Lead** — from well casing, pump components, or household plumbing; particularly important for pre-1986 homes",
          "**Hardness (calcium, magnesium)** — affects water treatment and appliance life",
          "**Iron and manganese** — common aesthetic problems that also indicate oxidizing conditions",
          "**Total dissolved solids (TDS)** — overall mineral load; baseline for well chemistry",
          "**Fluoride** — naturally elevated in some geological formations in western U.S.",
        ],
      },
      { t: "h3", c: "Location-Specific Tests — Add Based on Your Area" },
      {
        t: "ul",
        items: [
          "**PFAS** — if within 2 miles of a military base, airport, industrial site, or if you're in a known PFAS contamination area",
          "**Radon** — Pennsylvania, New England, and granite-heavy geological regions; radon in well water off-gasses indoors",
          "**Uranium** — wells in the western U.S., particularly New Mexico, Nevada, Wyoming, and Colorado",
          "**Volatile organic compounds (VOCs)** — near gas stations, dry cleaners, landfills, or industrial facilities",
          "**Pesticides and herbicides (atrazine)** — agricultural regions; particularly the Midwest Corn Belt",
          "**Selenium** — near coal mining areas, particularly eastern Kentucky, West Virginia, and Wyoming",
          "**Methane** — within 1 mile of active oil or gas wells",
          "**Coliform more frequently** — after flooding, heavy rainfall, nearby construction, or any visible change in water appearance or odor",
        ],
      },
      { t: "h2", c: "Step 1: Choose a Certified Lab" },
      {
        t: "p",
        c: "Use a state-certified drinking water lab — not a home test kit for health-based testing. Your state environmental or health agency maintains a list of certified labs. Many labs offer mail-in kits for rural well owners. [Find a certified lab in your area](/labs). Expect to pay $25–$60 for a basic bacteria and nitrate panel; $100–$250 for a comprehensive metals and minerals panel; $200–$400+ for PFAS.",
      },
      { t: "h2", c: "Step 2: Order the Right Test Package" },
      {
        t: "p",
        c: "Labs offer different packages. For a first-ever test on an untested well, order a comprehensive baseline panel that includes bacteria, nitrates, pH, hardness, arsenic, lead, iron, manganese, and TDS — even if you don't suspect a specific problem. For annual re-testing of a known-clean well, bacteria and nitrates are the minimum. Add location-specific tests based on proximity to contamination sources in your area. Many university extension programs (Penn State Extension, K-State Extension, OSU Extension) offer guidance on what to order by state.",
      },
      { t: "h2", c: "Step 3: Collect the Sample Correctly" },
      {
        t: "p",
        c: "Sample collection is where most people make mistakes that invalidate results. The lab will send collection instructions with the sample container — follow them exactly. Key rules for accurate results:",
      },
      {
        t: "ul",
        items: [
          "**For bacteria testing**: do not run the tap before sampling (or follow the lab's specific flushing instructions). Do not touch the inside of the container or cap. Keep samples cold during transport.",
          "**For lead testing**: use 'first draw' water — water that has sat in contact with plumbing for at least 6 hours. Do not flush the tap first.",
          "**For nitrates and metals**: flush the tap for 2–5 minutes to clear stagnant water and pull a representative aquifer sample (unless lead is included, in which case see above).",
          "**Submit samples within the time window** — bacteria samples typically must reach the lab within 24–30 hours of collection. Ship overnight or drop off in person.",
          "**Test at the kitchen tap** — this is your primary drinking and cooking source. Do not sample from an outdoor spigot or hose bib.",
        ],
      },
      { t: "h2", c: "Step 4: Understand Your Results" },
      { t: "h3", c: "Bacteria" },
      {
        t: "p",
        c: "Any detection of total coliform or E. coli is a health concern requiring action — there is no 'acceptable' level. If coliform is detected, re-test immediately, shock-chlorinate the well, and re-test again after shock chlorination. Repeat coliform detection may indicate a structural well problem requiring professional evaluation.",
      },
      { t: "h3", c: "Nitrates" },
      {
        t: "p",
        c: "The EPA MCL is 10 mg/L. Any result above 10 mg/L requires action, especially with infants or pregnant women in the household. Results between 5–10 mg/L are legal but worth monitoring and filtering if you have long-term exposure concerns. A [reverse osmosis system](/treatment/reverse-osmosis) is the most effective point-of-use treatment. See [best filter for nitrates](/guides/best-filter-for-nitrates-in-drinking-water) for a full comparison.",
      },
      { t: "h3", c: "Arsenic" },
      {
        t: "p",
        c: "The EPA MCL is 10 ppb. At exactly 10 ppb over a lifetime, epidemiological models suggest meaningful cancer risk. If your result is above 5 ppb, a point-of-use RO system or adsorptive media filter is a prudent addition. See the [arsenic contaminant guide](/contaminants/arsenic) and [best filter for arsenic](/guides/best-filter-for-arsenic-in-well-water).",
      },
      { t: "h3", c: "Lead" },
      {
        t: "p",
        c: "The EPA action level is 15 ppb, but the MCLG is zero — no level is without risk. Lead at any detectable level in well water is almost always coming from pump components, well casing, pressure tank, or household plumbing — not the aquifer itself. A certified lead-reduction filter at the kitchen tap addresses the drinking and cooking exposure. See [best filter for lead](/guides/best-filter-for-lead-in-tap-water).",
      },
      { t: "h2", c: "When to Test More Often Than Once a Year" },
      {
        t: "ul",
        items: [
          "**After significant flooding** — floodwater can overwhelm well seals and introduce surface contamination",
          "**After nearby construction** — soil disturbance can affect groundwater",
          "**After a new oil or gas well is drilled within a mile** — potential methane migration and casing failure",
          "**Any time water appearance, taste, or odor changes noticeably** — a change in cloudiness, color, smell, or taste is an indicator",
          "**When a new baby joins the household** — reassess for nitrates and lead before the infant begins formula",
          "**After purchasing a property with a well** — always do a fresh baseline test; prior owner's history is not your baseline",
        ],
      },
      { t: "h2", c: "State-Specific Well Water Resources" },
      {
        t: "p",
        c: "Groundwater contamination is highly regional. See the state-specific well water guides for your location: [California](/well-water/california), [Texas](/well-water/texas), [Florida](/well-water/florida), [Pennsylvania](/well-water/pennsylvania), [Ohio](/well-water/ohio), [Arizona](/well-water/arizona), [Oregon](/well-water/oregon), [Washington](/well-water/washington), [Nevada](/well-water/nevada), [Kansas](/well-water/kansas), [Kentucky](/well-water/kentucky), [Alabama](/well-water/alabama), and [New Mexico](/well-water/new-mexico).",
      },
    ],
    faqs: [
      {
        question: "How often should I test my well water?",
        answer: "At minimum, test for bacteria and nitrates annually. Do a comprehensive panel (including arsenic, lead, metals, and TDS) every 3–5 years, or whenever you are on a new well for the first time. Test more often after flooding, nearby construction, or any change in water appearance, taste, or odor.",
      },
      {
        question: "Where do I send well water for testing?",
        answer: "Use a state-certified drinking water laboratory. Your state's environmental or health agency maintains a list of certified labs. Many offer mail-in kits. University extension programs in your state (Penn State Extension, K-State Extension, etc.) can also provide referrals and guidance on what to order.",
      },
      {
        question: "How much does well water testing cost?",
        answer: "A basic bacteria and nitrate panel runs $25–$60. A comprehensive metals and minerals panel costs $100–$250. PFAS testing adds $200–$400. A full first-time baseline panel covering bacteria, nitrates, arsenic, lead, metals, and basic chemistry typically runs $150–$300 depending on the lab and your state.",
      },
      {
        question: "Can I use a home test kit for well water?",
        answer: "Home test kits are useful for quick screening but are not accurate enough for health-based decisions, especially for arsenic and nitrates near the MCL. A result near the legal limit — either above or below — can easily be misread with strips. Use a certified lab for any result you plan to act on. See the full [home test kits vs certified labs guide](/guides/home-water-test-kits-vs-certified-labs).",
      },
      {
        question: "What does coliform bacteria in well water mean?",
        answer: "Coliform detection means there is a contamination pathway from surface sources into your well. It does not necessarily mean you have been drinking actively harmful water, but it requires immediate action: re-test to confirm, shock-chlorinate the well, and re-test after treatment. Repeated coliform detection after treatment suggests a structural well problem requiring professional evaluation.",
      },
      {
        question: "Does my well water need a filter?",
        answer: "It depends entirely on what your test results show. A well that tests clean for all relevant contaminants may not need treatment. A well with nitrates above 5 mg/L, detectable arsenic, or bacterial contamination does need treatment. Test first — then decide on filtration based on confirmed results rather than guessing.",
      },
    ],
    nextSteps: [
      "Find [certified labs in your area](/labs) to order a test.",
      "Browse [well water guides by state](/well-water) for location-specific contamination risks.",
      "If nitrates are found, read [best filter for nitrates](/guides/best-filter-for-nitrates-in-drinking-water).",
      "If arsenic is found, read [best filter for arsenic](/guides/best-filter-for-arsenic-in-well-water).",
      "If lead is found, read [best filter for lead](/guides/best-filter-for-lead-in-tap-water).",
      "Compare [home test kits vs certified labs](/guides/home-water-test-kits-vs-certified-labs) before buying a quick test.",
    ],
    relatedGuides: [
      "home-water-test-kits-vs-certified-labs",
      "best-filter-for-nitrates-in-drinking-water",
      "best-filter-for-arsenic-in-well-water",
      "what-type-of-water-filter-do-you-need",
    ],
  },

  // ── 14. Best filter for arsenic ───────────────────────────────────────────
  {
    slug: "best-filter-for-arsenic-in-well-water",
    title: "Best Filter for Arsenic in Well Water",
    metaTitle: "Best Filter for Arsenic in Well Water | What Actually Works",
    metaDescription:
      "Arsenic affects millions of private well users in the U.S. Learn which filters remove arsenic, which certifications matter, and how to pick the right system for your result.",
    publishDate: "2026-04-30",
    lastUpdated: "2026-04-30",
    category: "filtration",
    categoryLabel: "Filtration Guide",
    intro:
      "The best filter for arsenic in well water is a **reverse osmosis system** or **certified adsorptive media filter** — both can remove 90–95% of dissolved inorganic arsenic when properly maintained. Standard activated carbon filters provide minimal arsenic removal. The right choice depends on whether you want point-of-use treatment (drinking and cooking water only) or whole-house removal, your confirmed arsenic level, and your budget.",
    blocks: [
      {
        t: "callout",
        c: "Arsenic is colorless, tasteless, and odorless. You cannot detect it without testing. An estimated 2.1 million Americans drink private well water with arsenic above the EPA limit — most without knowing it.",
      },
      { t: "h2", c: "Why Arsenic in Well Water Is a Serious Concern" },
      {
        t: "p",
        c: "Arsenic is a Group 1 human carcinogen — the highest evidence tier. Long-term exposure is strongly linked to bladder, lung, and skin cancer. The EPA MCL is 10 ppb (parts per billion), but even at the legal limit, lifetime exposure carries meaningful cancer risk — some epidemiological models put bladder cancer risk at roughly 1 in 500 at exactly 10 ppb. Arsenic is tasteless and colorless, so you will not detect it without a lab test. See the full [arsenic contaminant guide](/contaminants/arsenic) for the health and geographic context.",
      },
      { t: "h2", c: "The Three Technologies That Actually Remove Arsenic" },
      { t: "h3", c: "1. Reverse Osmosis" },
      {
        t: "p",
        c: "Reverse osmosis removes 90–95% of dissolved inorganic arsenic (As(V) and As(III) in oxidized form) by forcing water through a semi-permeable membrane. RO is the most accessible point-of-use solution for private well owners — under-sink systems are available for $150–$400, require no whole-house plumbing modification, and simultaneously address lead, nitrates, PFAS, and most other dissolved contaminants. This makes RO the default recommendation for well owners with arsenic plus other concerns. See the full [reverse osmosis guide](/treatment/reverse-osmosis).",
      },
      { t: "h3", c: "2. Adsorptive Media (Activated Alumina / Iron-Based Media)" },
      {
        t: "p",
        c: "Adsorptive media filters use alumina or iron-based granular media that arsenic bonds to as water passes through. They are highly effective for arsenic specifically — often exceeding 95% removal — and are commonly used in whole-house point-of-entry systems. Activated alumina is the most established; iron-based media (such as GFO — granular ferric oxide) is increasingly common. These systems require periodic media replacement. They do not remove nitrates, PFAS, or lead, so they work best when arsenic is the isolated concern.",
      },
      { t: "h3", c: "3. Distillation" },
      {
        t: "p",
        c: "Distillation removes virtually all arsenic by boiling water and collecting the steam — arsenic and other dissolved solids stay behind. It is highly effective but slow (typically 1 gallon per hour), expensive to run (uses significant electricity), and impractical as a whole-house solution. Distillation is rarely the first choice compared to RO or adsorptive media, but is an option for households without access to RO installation.",
      },
      { t: "h2", c: "What Does NOT Remove Arsenic" },
      {
        t: "ul",
        items: [
          "**Standard activated carbon filters** (pitcher, faucet, under-sink) — minimal arsenic removal; not the right mechanism",
          "**Water softeners** — remove calcium and magnesium; not arsenic",
          "**UV purification** — kills bacteria and viruses; no effect on dissolved chemicals",
          "**Sediment filters** — remove particles; arsenic is dissolved, not particulate",
          "**Boiling** — concentrates arsenic as water evaporates; never use for arsenic treatment",
        ],
      },
      { t: "h2", c: "Reverse Osmosis vs Adsorptive Media for Arsenic" },
      {
        t: "table",
        headers: ["Factor", "Reverse Osmosis", "Adsorptive Media"],
        rows: [
          ["Arsenic removal rate", "90–95%", "95%+ when properly maintained"],
          ["Arsenic species handled", "As(V) best; oxidize As(III) first for optimal results", "Both As(V) and As(III)"],
          ["Other contaminants removed?", "Yes — lead, nitrates, PFAS, and more", "No — arsenic-specific"],
          ["Point-of-use or whole-house?", "Point-of-use (kitchen tap)", "Whole-house point-of-entry common"],
          ["Cost (unit)", "$150–$400", "$500–$2,000 installed"],
          ["Maintenance", "Membrane + filter cartridge changes", "Media replacement every 1–3 years"],
          ["Water waste?", "Yes — 3–4 gallons per filtered gallon", "Minimal"],
          ["Best when", "Multiple concerns; drinking/cooking focus", "Arsenic only; whole-house treatment desired"],
        ],
      },
      { t: "h2", c: "An Important Note About Arsenic Chemistry" },
      {
        t: "p",
        c: "Arsenic exists in groundwater in two oxidation states: arsenate As(V) and arsenite As(III). Most filters perform best on As(V). If your well water is low in dissolved oxygen (common in deep wells), As(III) may dominate and some filters will perform less effectively. Pre-oxidation — injecting a small amount of air or using a chlorine contact tank — converts As(III) to As(V) before filtration. If your lab test reports a high proportion of As(III) or if your well is anaerobic (low oxygen), discuss pre-oxidation with a water treatment professional.",
      },
      { t: "h2", c: "Certifications to Look For" },
      {
        t: "ul",
        items: [
          "**NSF/ANSI Standard 58** — for RO systems; look for arsenic reduction specifically in the system's certified claims",
          "**NSF/ANSI Standard 53** — for carbon filters claiming arsenic reduction (limited options; verify explicitly)",
          "**NSF/ANSI Standard 62** — for distillation units",
          "**WQA Gold Seal** — alternative third-party certification recognized for adsorptive media systems",
          "Verify that certification covers the **full system** at the rated flow rate — not just the media or membrane in isolation",
        ],
      },
      { t: "h2", c: "Decision Framework by Arsenic Level and Situation" },
      {
        t: "table",
        headers: ["Arsenic result", "Situation", "Recommended action"],
        rows: [
          ["Below 5 ppb", "Well owner, no other concerns", "Monitor annually; no immediate treatment required"],
          ["5–10 ppb", "Long-term residence, health-conscious", "Point-of-use RO for drinking/cooking water"],
          ["Above 10 ppb (over MCL)", "Any household", "Immediate point-of-use RO; evaluate whole-house if budget allows"],
          ["Above 10 ppb + infants", "Highest priority", "Do not use well water for drinking or formula until RO is installed"],
          ["Any level + other contaminants present", "Multiple concerns", "RO — addresses arsenic, nitrates, lead, PFAS simultaneously"],
          ["Arsenic only, whole-house desired", "Single concern", "Adsorptive media point-of-entry system"],
        ],
      },
      { t: "h2", c: "How to Know Your Arsenic Level" },
      {
        t: "p",
        c: "Testing is the only way to know your well's arsenic level — it is tasteless, colorless, and odorless. Use a state-certified laboratory, not home test strips. Home strips for arsenic are not accurate at concentrations near the 10 ppb EPA limit. A certified arsenic test typically costs $15–$40 as a standalone or is included in a comprehensive well water panel. See the full [well water testing guide](/guides/how-to-test-well-water) for step-by-step collection instructions and lab selection.",
      },
      { t: "h2", c: "Geographic Areas with the Highest Arsenic Risk" },
      {
        t: "p",
        c: "Arsenic in well water is a nationwide concern, but risk is highest in specific geological formations. Well owners in the following areas should prioritize arsenic testing: the western United States (Arizona, Nevada, California's Central Valley), New England (Maine, New Hampshire, Vermont), the Midwest (Minnesota, Wisconsin, Michigan), and parts of the Great Plains (South Dakota, Wyoming). See the [arsenic contaminant guide](/contaminants/arsenic) for state-level detail.",
      },
    ],
    faqs: [
      {
        question: "What is the best filter for arsenic in well water?",
        answer: "Reverse osmosis is the most practical and widely available option for point-of-use arsenic removal, achieving 90–95% reduction. Adsorptive media systems (activated alumina or iron-based media) are highly effective for whole-house or point-of-entry treatment. Standard carbon filters and water softeners do not remove arsenic.",
      },
      {
        question: "Does reverse osmosis remove arsenic?",
        answer: "Yes. Reverse osmosis removes 90–95% of dissolved inorganic arsenic. It performs best on arsenate (As(V)). If your well water contains predominantly As(III) — common in low-oxygen deep wells — pre-oxidation before the RO membrane improves removal efficiency.",
      },
      {
        question: "Does a Brita or carbon filter remove arsenic?",
        answer: "No. Standard activated carbon pitcher and faucet filters do not reliably remove arsenic. Arsenic is a dissolved ionic compound that passes through activated carbon media with minimal reduction. Do not use a Brita or similar carbon filter as your primary arsenic treatment.",
      },
      {
        question: "What is the EPA limit for arsenic in drinking water?",
        answer: "The EPA MCL for arsenic is 10 parts per billion (ppb), effective since 2006. The Maximum Contaminant Level Goal (MCLG) is zero — no level is considered without cancer risk. At exactly 10 ppb with lifetime exposure, some epidemiological models estimate approximately 1 in 500 lifetime bladder cancer risk.",
      },
      {
        question: "How much arsenic in well water is dangerous?",
        answer: "The EPA MCL is 10 ppb. Above 10 ppb, health risk is well-established and filtration is important. At 5–10 ppb, long-term cancer risk is present though smaller. Even below 5 ppb, some lifetime cancer risk accumulates with long-term exposure. Arsenic has no truly safe threshold — the MCL reflects a regulatory balance between risk and treatment feasibility, not zero risk.",
      },
      {
        question: "How do I test my well for arsenic?",
        answer: "Use a state-certified drinking water laboratory — home test strips are not accurate at concentrations near the EPA limit. Order a sample kit, follow the lab's collection instructions exactly, and ship overnight. Standalone arsenic tests cost $15–$40; comprehensive panels including arsenic typically run $100–$200. See the [well water testing guide](/guides/how-to-test-well-water) for step-by-step instructions.",
      },
    ],
    nextSteps: [
      "Test your well first — [find certified labs](/labs) in your area.",
      "Read the [arsenic contaminant guide](/contaminants/arsenic) for the full health and geographic context.",
      "Compare [reverse osmosis](/treatment/reverse-osmosis) in depth for technology details.",
      "Not sure if you have other contaminants? See [how to test well water](/guides/how-to-test-well-water) for a full testing protocol.",
      "Browse your [state's well water guide](/well-water) for regional contamination context.",
    ],
    relatedGuides: [
      "how-to-test-well-water",
      "reverse-osmosis-vs-carbon-filter",
      "best-filter-for-nitrates-in-drinking-water",
      "home-water-test-kits-vs-certified-labs",
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const guidesByCategory = (cat: Guide["category"]) =>
  guides.filter((g) => g.category === cat);

export default guides;
