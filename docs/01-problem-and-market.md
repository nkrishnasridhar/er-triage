# 01 — Problem and market

Labels used below:

- **Verified** — a public source was opened for this package and the sentence matches it.
- **Stated in the product brief** — supplied by the brief and not confirmed against a primary source here.
- **Assumption** — a planning assumption, not a measured fact.
- **Vendor-reported** — the vendor's own page or blog. Not independently audited.

Nothing here is a claim that ERgency improves waiting times, safety, or cost.

## The job

A triage nurse has a short first conversation and must leave a record another clinician can trust. ACEM's policy says the triage assessment generally should take no more than two to five minutes, and that the assessment and the ATS category allocated must be recorded. The same policy says the ATS describes clinical urgency, not severity, complexity, or staffing. Source: [ACEM, Triage](https://acem.org.au/Content-Sources/Advancing-Emergency-Medicine/Better-Outcomes-for-Patients/Triage) and [P06 Policy on the Australasian Triage Scale](https://acem.org.au/getmedia/484b39f1-7c99-427b-b46e-005b0cd6ac64/P06_Policy_Australasian_Triage_Scale). **Verified** as the published policy text. It is not evidence about how long New Zealand nurses actually take.

G24 says the triage assessment is not intended to make a diagnosis, and that documentation should include at least date and time, chief presenting problem, limited relevant history, relevant assessment findings, the initial triage category, any re-triage, the area allocated, and measures initiated. Source: [ACEM G24](https://acem.org.au/getmedia/51dc74f7-9ff0-42ce-872a-0437f3db640a/Guidelines_on_the_Implementation_of_the_ATS_in_EDs). **Verified** as guideline text. ERgency aims at the information part of that list. It does not allocate the category.

The failure mode this product is for: the story is messy, a negation or a hedge is flattened, a clinician's question is written up as a symptom, and the next person cannot see what was never asked. That mechanism is a **product hypothesis**, not a measured NZ error rate.

## New Zealand demand

| Figure | Label | What we can say |
| --- | --- | --- |
| About 1.47 million ED presentations in 2025 | Stated in the product brief | Not confirmed. Do not put it on a slide as fact |
| About 5.3% year-on-year increase | Stated in the product brief | Not confirmed |
| About 5.7% left before being seen | Stated in the product brief | Not confirmed. No national DNW percentage was found in the sources opened |
| 95% of patients admitted, discharged, or transferred within six hours | Verified target | [DPMC health-target factsheet, file dated in the March 2026 path](https://www.dpmc.govt.nz/sites/default/files/2026-03/gt-factsheet-target-1-dec25.pdf); also the government report card reproduced by Scoop |
| 73.9% within six hours in 2024/25 Q4 | Verified for that quarter | [NZ Doctor, undoctored, reporting the target result](https://www.nzdoctor.co.nz/article/undoctored/health-targets-reducing-wait-times-and-putting-patients-first): 73.9% admitted, treated, or discharged within six hours, compared with 71.2% the prior year. The Scoop PDF of the report card shows 73.90% on the Q4 2024/25 point of the national series |
| Later quarters are not 73.9% | Verified as a different period | The same DPMC factsheet says that in the quarter ending September 2025, 68.9% were admitted, treated, or discharged within six hours, versus 67.5% in the same quarter a year earlier. The factsheet header also refers to quarter ending December 2025. Do not collapse these into one number |
| Average attendance 3,150/day in 2021 and 3,700/day in 2025 | Reported by the Minister, via news | [The Post](https://www.thepost.co.nz/politics/360838764/government-celebrates-latest-health-target-results) and [The Press](https://www.thepress.co.nz/nz-news/360858007/eds-are-busier-ever-non-urgent-patients-arent-problem). This is not an official annual total. 3,700 × 365 is about 1.35 million; that arithmetic is ours and is **not** a published annual count |
| ATS is in use | Verified as the Australasian tool | ACEM states the ATS has been used in Australia and Aotearoa New Zealand. Local charting practice still **requires specialist confirmation** per hospital |
| About 1,250 NZ ED doctors or frontline staff in a national AI scribe rollout | Stated in the product brief | Not confirmed. Heidi's own announcement says 1,000 licences for clinicians and 100 for mental health crisis teams in EDs. See below |

Do not tell judges that ERgency will move the six-hour target. Access block, beds, and staffing dominate public explanations of that target. Peter Jones, quoted in The Press, describes bed-block as the crowding mechanism. That article is journalism, not a ERgency study.

## Australia, as context only

The first buyer conversation is New Zealand because the team is at a Christchurch event and Heidi's public ED rollout is a New Zealand fact. Australia is the obvious later market, not this weekend's build.

| Figure | Label |
| --- | --- |
| About 9.1 million presentations to Australian public-hospital EDs in 2024–25 | Supported by secondary write-ups of AIHW data: [Health Services Daily](https://www.healthservicesdaily.com.au/national-ed-wait-times-blow-out/38128) and an [Evening Report](https://eveningreport.nz/2025/12/19/just-2-in-3-patients-are-treated-on-time-in-emergency-departments-check-how-your-public-hospital-performs-270683/) piece that also uses 9.1 million. The primary AIHW table was not re-extracted in this pass. Cite as **secondary report of AIHW**, not as our calculation |
| About 293 Australian public EDs | **Verified for 2023–24, different definition.** AIHW *Hospitals at a glance 2023–24* says 293 public hospitals had purpose-built emergency departments staffed 24 hours. The same period's ED-care appendix says 286 public hospital EDs reported presentations. The brief's "~293" matches the 24-hour purpose-built count for 2023–24, not a confirmed 2024–25 census |

## Heidi's rollout, because it defines the wedge

**Vendor-reported**, Heidi blog, 20 November 2025, [Heidi's AI Scribe to be rolled out across New Zealand's emergency departments](https://www.heidihealth.com/en-nz/blog/nz-ed-roll-out):

- Rollout across Health New Zealand emergency departments, tied by Heidi to the six-hour target.
- Hawke's Bay ED pilot: average documentation time "from around 17 minutes to just over four minutes", an extra patient per shift on average, after-shift admin "by up to 81%".
- 1,000 clinician licences and 100 for mental health crisis teams.
- Heidi says Health New Zealand's National Artificial Intelligence and Algorithm Expert Advisory Group (NAIAEAG) endorsed it after privacy, cybersecurity, and data-sovereignty review.

[Health Informatics New Zealand](https://www.hinz.org.nz/news/713303/AI-scribe-rolled-out-to-EDs-nationwide.htm) reported the same rollout and quoted clinicians on documentation time. Treat overlapping numbers as press coverage of the vendor and the minister, not as an independent trial publication retrieved here.

Implication for the pitch: a scribe is already the incumbent story in NZ EDs. A second scribe is a weak SaaSathon idea and a weak sale. ERgency has to be obviously about the triage brief, not the note.

## Who hurts, how often

**Assumption, unvalidated:** the triage nurse repeats the same clarifying questions, retypes a story that is already partly in a scribe or on paper, and hands over a note that hides whether "no chest pain" was said. Frequency is unknown. [23-validation-plan.md](23-validation-plan.md) exists to attack this assumption.

**Assumption:** patients are harmed indirectly when the record is wrong or thin. This package does not quantify that harm and must not invent a death or delay statistic.

## Willingness to pay

No hospital price was found that we are willing to treat as a comparable. Do not invent a Heidi, Epic, or Mednition price. The commercial hypothesis is a health-system subscription per ED or per site, paid by the operator, not by the nurse. Experiments are in [22-business-model.md](22-business-model.md).

## What we will not claim on stage

- That 1.47 million, 5.3%, 5.7%, or 1,250 are official.
- That 73.9% is the latest six-hour result. It is the Q4 2024/25 figure. Later published quarters differ.
- That ERgency has an ROI, a minute saved, or a safety outcome.
- That ACEM's two-to-five minutes is a New Zealand staffing standard we measured.
