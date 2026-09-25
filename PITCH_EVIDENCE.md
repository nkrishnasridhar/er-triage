# ER Triage: Pitch Evidence Base

Research compiled 26 September 2026. Covers roughly March–September 2026, with older
foundational statistics labelled as such. Every figure is traceable to a source and date
at the point of use.

Use this to build the "problem" section of the pitch. It is organised so you can pull
single facts, not read top to bottom.

---

## 0. Read this first: the single most important competitive fact

**An AI scribe called Heidi has been live in every emergency department in New Zealand
since 28 February 2026.**

- Rollout to 1,250 ED doctors and frontline staff complete, 250 more than originally
  announced.
- More than 1,000 further licences being progressed, predominantly for mental health
  teams.
- Source: Beehive.govt.nz release, 28 Feb 2026 —
  https://www.beehive.govt.nz/release/ai-scribe-now-every-emergency-department
- Health Informatics NZ, 1 Mar 2026: "An AI-powered scribe is live in every Emergency
  Department (ED) nationwide with 1250 clinicians using it" —
  https://www.hinz.org.nz/news/721241/

**What this means for the pitch.** A generic "AI saves clinicians charting time" story is
already bought and running in NZ EDs. Judge/judge-panel members who follow health tech will
know this. The defensible wedge is not documentation time — it is:

1. **Structured intake quality and escalation safety at the front door** — the triage
   conversation and the triage decision itself, which Heidi does not touch.
2. **The nursing side**, which is explicitly an unmet gap (see §7).
3. **Provenance, auditability and escalation review** — the failure mode that is now
   documented in the press and the safety literature (§6, §8).

There is a second-order opening here too: the NZ rollout is young, and both Health NZ and
clinicians have publicly flagged that accuracy and editing effort are unresolved (§9).
A product that fixes the *triage brief* specifically, rather than the *note*, is a
complementary pitch, not a competing one. Say so explicitly in the pitch.

---

## 1. Christchurch: the local problem, in hard numbers

Source for §1.1: Health New Zealand OIA response **HNZ00204837**, released 14 July 2026,
covering Jan–May 2026.
https://static.info.content.health.nz/docs/publications/christchurch-emergency-department-hnz00204837-oia.pdf

### 1.1 Christchurch Hospital ED performance, Jan–May 2026

| Month | Avg daily patients | % seen within 6h | Avg wait to be seen by a named clinician | Days over capacity | Code red ("critical") events |
|---|---|---|---|---|---|
| Jan 2026 | 384 | 82.2% | 27 min | 2 | 0 |
| Feb 2026 | 402 | 76.9% | 32 min | 10 | 1 |
| Mar 2026 | 397 | 72.0% | 36 min | 21 | 2 |
| Apr 2026 | 407 | 74.8% | 35 min | 17 | 4 |
| May 2026 | 422 | 73.0% | 36 min | 22 | 2 |

Monthly arrivals and admissions:

| Month | Arrivals | Admitted | Non-admitted | Non-admitted % |
|---|---|---|---|---|
| Jan 2026 | 11,915 | 3,563 | 8,352 | 70.1% |
| Feb 2026 | 11,265 | 3,391 | 7,874 | 69.9% |
| Mar 2026 | 12,321 | 3,912 | 8,409 | 68.2% |
| Apr 2026 | 12,207 | 3,701 | 8,506 | 69.7% |
| May 2026 | 13,081 | 4,036 | 9,045 | 69.1% |

Notes and caveats you should know before quoting these:
- Waiting time is defined by Health NZ as "time spent, in minutes, from arrival until seen
  by a named clinician."
- Admission counts **exclude** movements into the ED Observation Unit unless the patient was
  admitted from observation.
- "Exceeded capacity" does not mean code red all day. It means the ED status score hit or
  exceeded 210 ("Overload or Critical Overload") at some point during the day. Christchurch
  uses a description-based scoring system rather than colours; "overload" ≈ Code Orange,
  "critical overload" ≈ Code Red.
- Code red counts are hourly snapshots, so one busy afternoon can produce several counts.

Direct quotes from the OIA response you can use verbatim:

> "Unfortunately, as you will see, wait times within the Christchurch Hospital Emergency
> Department have grown this year, and with the onset of winter continue to do so."
> — Health NZ, HNZ00204837, July 2026

The trend is the story, not any single month. Between January and May 2026, average daily
attendance rose from 384 to 422 (+10%), average wait to a named clinician rose from 27 to
36 minutes (+33%), and 6-hour-target performance fell from 82.2% to 73.0% (9.2 points).

**Useful derived numbers for a slide:**
- 422 patients a day through a 70-bed ED (bed count per Dr Fleischer, NZ Herald, below).
- Roughly 1 in 3 Christchurch ED patients is admitted. The other ~7 in 10 leave without
  admission — every one of them is a front-door triage conversation.
- 13,081 arrivals in May alone — roughly **13,000 arrivals per month** and a large,
  consistent potential intake surface. Do not imply that every arrival represents the same
  triage workflow or is addressable by the product; validate the eligible cohort in a pilot.

### 1.2 Corridor care has tripled in three years

Health NZ figures reported by The Press, 23 September 2026:
https://www.thepress.co.nz/nz-news/361085906/christchurch-hospital-corridor-patients-triple-14000-three-years

- **14,587 patients treated in corridors in 2025–26**, up from **3,911 in 2022–23** — more
  than 3.7×.
- Time patients spent in corridors **went up five-fold**: 6,126 hours → more than 29,000
  hours. That is roughly **40 patients a day, every day, spent in a corridor**.
- **Self-discharges more than doubled**: 2,186 → 5,183 over the same period. At ~14 a day,
  people are giving up and leaving.
- Pegasus 24 Hour Surgery posted it was at capacity and briefly unable to accept patients.
- A new after-hours clinic in Rolleston reached capacity on **all four days of its opening**.

### 1.3 "Three times capacity" — the clinical reality

Dr Dominic Fleischer, emergency medicine specialist, Christchurch Hospital. NZ Herald,
29 July 2026 ("patients treated in corridors as ED overwhelmed"):
https://www.nzherald.co.nz/nz/christchurch/christchurch-hospital-patients-treated-in-corridors-as-ed-overwhelmed-doctor-says/

> "We're stretched to near breaking point for the number of patients we're seeing."

> "It used to be just one or two days a week, but now it seems to be increasingly a common
> thing that occurs on virtually every day of the week." — on code red

> "The 70-bed emergency department was regularly operating at 200% to 300% occupancy... It's
> almost the norm ... to have two to three patients for every bed."

> "You can easily have 20 to 30 patients waiting in the corridors ... for hours."

> "You can't ask them intimate questions, you can't examine them. It's very difficult to do
> tests on them in corridors ... things like ECGs and blood tests are challenging in
> corridors. Patients don't have call bells so they can't call for help. It's a dangerous
> place to treat someone. You certainly can't offer good care. It's substandard care."

Two more quotes from the same article that are directly relevant to your product's value
proposition:

> "He said emergency presentations were increasing by at least 4% each year, while
> Christchurch's population was growing by only about 1%. Our presentation rate is going up
> much faster than Christchurch itself is growing, which is always a concern."

> On the 8:03am text asking off-duty doctors to come in: "That's a really unusual call to get
> at three minutes past eight in the morning because that should be the quietest time for the
> department."

Also from the same piece: staff began placing corridor beds **at an angle, and then
perpendicular to the wall**, to fit more patients in. "I've never seen that being done
before." Fleischer attributes this to the fact that ED patients who clearly need admission
cannot be moved onto wards because the hospital is full — while patients keep arriving at the
front door.

### 1.4 A 20-year veteran nurse quitting over triage conditions

NZNO delegate Kez Jones resigned after more than 20 years in Christchurch Hospital's ED.
The Press, 10 August 2026:
https://www.thepress.co.nz/nz-news/361059734/waiting-room-roulette-why-veteran-ed-nurse-walking-away-christchurch-hospital

This is the most on-point quote in the whole file for a triage product:

> "One issue for her was when senior nurses in charge of triaging patients who arrived by
> ambulance had to park them in corridors if the department was at capacity – overseeing up
> to 10 while continuing to triage others. **That's a high-risk situation, and I'm not
> prepared to take that risk any more.**"

> "It's just not what I came to emergency nursing to do, and I can't do my core job."

> On the triage allocation itself: it created a "waiting room roulette" situation "where
> staff had to make tough calls about which patient got a bed. **You're just spinning the
> wheel and hoping that you've chosen the right patient to go through.**"

> "Jones said every single bed in the hospital needed to be staffed to capacity, so patients
> could be moved on from ED."

Other detail from the same weekend: a patient presented Saturday night and was "eventually
seen and discharged at 7.10am on Sunday morning", and reported "patients were waiting three
hours after being admitted to be moved to wards." Hato Hone St John said that Saturday was
its busiest day on record.

### 1.5 Christchurch in the national pattern

- Christchurch ED **recorded code reds on nearly a third of days last winter** (OIA data
  reported by Joanne Naish, The Press, and Nikki Macdonald, The Post). The Spinoff, 3 Feb
  2026: https://thespinoff.co.nz/the-bulletin/03-02-2026/how-violence-and-code-red-alerts-are-stretching-eds-to-breaking-point
- For comparison in the same reporting: Wellington Hospital ED hit code red **575 times
  between January and October last year** — almost twice a day — versus **zero times in
  2024**. Hawke's Bay recorded **162 days of critical overload in 2024**, almost half the
  year.
- Important context for honesty in the pitch: in 2024 Health NZ scrapped "code black" and
  **raised the thresholds for code red**. One emergency doctor told RNZ it was "just moving
  the goalposts" — making overcrowding look better on paper while the frontline is unchanged.
  So rising code-red counts partly reflect a tightened definition, and part real deterioration.

---

## 2. New Zealand, national

### 2.1 The six-hour target is not moving

- **Jan–Mar 2026 quarter: 74.4%** of ED patients were admitted, discharged or transferred
  within six hours — up only **0.2 percentage points** year on year. 333,100 people were
  treated in EDs that quarter. RNZ, 23 June 2026.
- **Apr–Jun 2026 quarter: 76.3%** — up from 73.9% a year earlier. B2B News, 23 Sep 2026.
  https://b2bnews.co.nz/news/nz-health-targets-improve-but-ed-waits-stay-stuck/
- Baseline when targets were reintroduced in September 2023 was **68%**. The target is
  **95% by 2030**. So the system has clawed back roughly 8 points in three years against a
  target that needs nearly 19 more.

**The most defensible national fact:** the DPMC target factsheet classifies achieving the 95%
target by 2030 as **"feasible"**, rather than on track. It reports a December 2025 result of
74.2% against a 68.0% September 2023 baseline. Do **not** attribute “most EDs are over
capacity most of the time” to this factsheet: add the primary ministerial briefing before using
that wording in a deck. Same day, Stuff reported Tauranga Hospital's ED had run at up to **200%
capacity** with staff declaring a state of emergency.

**The contrast that makes your argument:** elective treatment improved sharply — 72.6% of
patients waiting under four months, up from 63.9%, a 41% reduction in the number waiting
longer than four months, with 21,000 procedures bought through private providers under the
Elective Boost programme. Minister Simeon Brown announced it as "the biggest elective surgery
gain in years." The ED number barely moved.

> "Emergency departments absorb whatever walks or is wheeled through the door, and their
> throughput depends on the entire hospital behind them... The gap between elective and ED
> performance is structural, not bad luck." — B2B News, 23 Sep 2026

This is a strong framing for your pitch: **schedulable work can be bought and planned. The
front door cannot.** Extra beds, staffing and better hospital flow remain necessary, but they
do not by themselves validate or replace a front-door information and escalation workflow. A
software wedge is therefore a complementary, testable lever — not the only solution.

Health Minister Simeon Brown, DPMC factsheet on Target 1, March 2026:
> "Improvements across the whole system of care are needed to reduce the unacceptable wait
times at emergency departments."
https://www.dpmc.govt.nz/sites/default/files/2026-06/gt-factsheet-target-1-mar26.pdf

Winter response: a **$25 million winter package** adding up to **378 staff and 71 extra
beds**. Dr Dale Bramley, Health NZ CEO, pointed in June 2026 to strong improvements in CT
and MRI access — again the schedulable end. The acute end remains stuck.

### 2.2 Auckland: what "over capacity most of the time" looks like in numbers

RNZ, 21 August 2026 (Health NZ figures released to the Labour Party under the OIA):
https://www.rnz.co.nz/news/health/1068573/auckland-hospital-s-near-constant-overcrowding-putting-patients-at-risk-doctor-says

Auckland Hospital's "escalation pathway" triggers when more than 30 people are waiting for
sign-on, when the ED is at 120% capacity, or when four or more ambulances cannot hand over a
patient within 15 minutes. In 2025 it:

- Met the >30-waiting-for-sign-on threshold at least once on **281 of 365 days (77%)**.
- Met the ambulance escalation trigger on **286 days (79%)**.
- Was **more than 120% over capacity on 117 days (32%)**.

Winter months were far worse: **94% / 93% / 93%** of days in January, February and June
respectively.

Patient Voice Aotearoa chair Malcolm Mulholland: the data shows emergency departments are in
a **"state of failure"** — "patients aren't being seen quickly enough, that there clearly are
not enough beds and that ambulance ramping is becoming standard practice around the country."

ASMS executive director Sarah Dalton:
> "Whether you call it a code red, a code black, an escalation point, a breach, what all of
> the data tells us and what our members who are senior doctors working in emergency
> departments tell us is that they are not appropriately resourced to cope with the level of
> need. ... This isn't just people going there instead of a GP. This is people who are sick
> enough that they should be seen at a hospital."

Dr Mike Nicholls, Auckland ED:
> "Overcrowding in emergency departments is associated with increased harm for patients,
> including increased death."

Health NZ's counter-argument, which you should expect a health-system audience to raise
before you do: the thresholds are "operational management tools" that "may have only been met
for a short period of time" and are "incorrect to characterise... as 'breaches'." Handle it
by agreeing with it — your pitch does not depend on beating this framing.

Dr Nicholls also makes the point that is your opening:
> "The 95% target was one way to look at a very complex system, but in an effort to simplify
> that information so it can be understood by a lot of people you lose something... Even when
> EDs were making improvements on the target, that didn't change the fact we're still having
> a lot of problems with overcrowding. **Both things can be true.**"

### 2.3 Workforce violence and attrition

- Reported assaults on Auckland hospital workers more than tripled in two years: **371 in
  2022 → 1,170 in 2024**. Incidents requiring time off work also climbing sharply. Health NZ
  attributes the rise mainly to improved reporting; nurses say it reflects overcrowding.
  The Spinoff, 3 Feb 2026.
- A Waikato ED nurse recalled being punched through a gap in the glass by a patient who had
  waited hours with a broken bone, with security failing to intervene. NZNO's Tracey Morgan
  said the abuse felt "uncontrollable."
- A code red can mean delayed medication, patients sleeping on trolleys, postponed
  procedures, and **increased risk of death if patients wait longer than five hours**.

### 2.4 The 2026 winter surge

- St John declared a **major incident response and activated its emergency operations centre
  for the first time since the Covid-19 pandemic** (week of 10 Aug 2026).
- **2,562 calls through 111 on Saturday 8 August 2026** — a 34% increase on a typical day and
  a new all-time record. The daily record was broken three times in the preceding week.
  1News, 15 Aug 2026:
  https://www.1news.co.nz/2026/08/15/people-urged-to-stay-home-if-sick-amid-flu-surge-eds-over-capacity/
- RNZCGP: "**Emergency departments remain over capacity in many parts of the country.**"
- Auckland flu-related hospitalisations doubled in a week to **3.781 per 100,000 people**.
- Emergency physician Dr Mike Nicholls, RNZ 21 Aug 2026: he had **not** observed the same
  corridor treatment as Christchurch, "but there were absolutely patients waiting in spaces
  that aren't designed for high quality health care."

---

## 3. The documented failure case: a real triage error in NZ

This is your single most persuasive story, because it is a real patient, a real regulator
finding, and it happened in a crowded NZ ED.

Source: Ben Gray (associate professor, University of Otago), "When an overloaded ED gets it
wrong, who should be accountable?", republished in 1News, 20 August 2026:
https://www.1news.co.nz/2026/08/20/when-an-overloaded-ed-gets-it-wrong-who-should-be-accountable/

The case:

- A **55-year-old man** presented to an ED with **burning central chest pain**.
- The ED was **operating at 200% occupancy and ten nurses short**.
- The **triage nurse assessed the pain as non-cardiac** and assigned a triage score requiring
  assessment within 30 minutes.
- **An ECG was not performed until four and a half hours later**, when it confirmed he was
  having a heart attack. He was then urgently referred to the cardiac team.
- Health NZ's own adverse event review concluded the patient **should have been assigned a
  more urgent triage category**. Its recommendations included more education for triage
  nurses, **escalation procedures for when ED capacity becomes critical**, increased
  staffing, and a waiting-room nurse.
- The **Health and Disability Commission found Health NZ had breached the Code of Health and
  Disability Services Consumers' Rights.**
- The HDC's investigation reached a different emphasis than Health NZ's review — while
  acknowledging hindsight bias and nursing resource pressure, it focused on the failure to
  recognise the symptoms as cardiac, assign the correct triage score, and ensure timely
  assessment.

Two further points from the same article that directly support a triage-support product:

> "On the basis of a patient's history alone, it can be difficult to distinguish cardiac pain
> from less serious conditions such as indigestion. **Patients may also describe their
> symptoms differently** – some emphasising their severity in the hope of being seen sooner,
> others downplaying them in the hope they are not seriously ill."

> "The consequences are magnified when an ED is overcrowded. Had the patient been assessed
> within the 30-minute timeframe attached to his original triage category, the misclassification
> would not have resulted in such lengthy delay... **But requiring nurses to spend longer on
> every triage assessment could further slow an already overwhelmed ED.**"

That last sentence is the problem statement for your entire product. Note also: NZNO is
campaigning for enforceable safe staffing levels, and a Health NZ business case on nurse-to-
patient ratios was reported on 23 Sep 2026 — so **more staff is not a fast fix, and the
buyer's constraint is now explicit**.

---

## 4. The triage job itself is more than triage

Considine J, Oldland E, Currey J, et al., "Characterising the clinical practice of
emergency department triage nurses", *Journal of Clinical Nursing* Vol 35(9):3942–3958,
Sept 2026. https://doi.org/10.1111/jocn.70368

Direct observation study: 15 ED triage nurses across three Melbourne EDs, 33 hours observed
(2–2.5 hours each), 237 interactions with 169 different patients, **1,183 tasks coded**.

Task distribution:

| Task | Count |
|---|---|
| Taking a history | 475 |
| Post-triage communication with patients, carers and other clinicians | 288 |
| Patient assessment (vital signs, focused assessments) | 165 |
| Interventions (medication, psychological care) | 134 |

Verbatim conclusions:

> "Triage nurse practice is complex, multifaceted and **extends beyond triage category
> allocation**."

> "History, red flags and assessment were more likely during the triage process than
> post-triage, but interventions, diagnostics and communication **spanned both triage and
> post-triage care**."

> "**The traditional perspective that triage and post-triage care are linear and clearly
> divided is not fit for purpose in contemporary triage practice.**"

Why this matters for the pitch: the work being done at the front door is a rich,
multidimensional clinical conversation plus a communication act, not a form-filling and a
number. A product that models it as "structured intake → brief → human review" is
describing the actual job. A product that models it as "text box → urgency score" is not.

---

## 5. Global: overcrowding now has a mortality number

### 5.1 The headline study (released 25 September 2026)

EUSEM press release, 25 September 2026, for presentation at the European Emergency Medicine
Congress, 26 September 2026:
https://eusem.org/news/1162-press-release-study-shows-how-risk-of-death-rises-with-rate-of-overcrowding-and-corridor-care-in-hospital-emergency-department

Study OA068, led by Dr Ryan McHenry (University of Glasgow), **funded by the UK Royal
College of Emergency Medicine**. 19,034 patients across ~134 EDs in England, Wales and
Northern Ireland, 2025.

> "The risk of death for patients treated in the emergency department increases by one per
> cent for every ten per cent increase in occupancy."

> "On average, emergency departments were operating at 175% occupancy."

> "Emergency department crowding could have contributed to 554 deaths a week during the study
> period, as compared to a situation where departments had one space for every patient... we
> estimate anywhere between 33 and 1,083 excess deaths are plausible."

**Corridor care was also linked to increased death risk**, in line with occupancy. A public
risk calculator is at `www.uncorkedcalculator.com`.

Dr McHenry:
> "There is less evidence around how crowding itself might be associated with mortality. Our
> traditional measures of emergency department crowding were developed in a time where
> crowding was less of an issue, and these simply aren't sufficient to describe the crisis
> that currently exists in emergency care."

Use the headline carefully: the study's own uncertainty range is 33–1,083 excess deaths per
week, and the 554 figure is a modelled central estimate. Say "modelled" out loud. It is still
an enormously powerful slide if you present it honestly.

### 5.2 Overcrowding as a violence driver

EUSEM Emergency Medicine Day international survey, May–June 2026: **1,306 healthcare
providers across 81 countries**.
https://eusem.org/news/1160-press-release-violence-against-emergency-workers-is-increasing-hospital-overcrowding-is-a-major-contributor-emergency-medical-services-are-better-prepared-for-a-mass-casualty-incident-than-for-everyday-violence

- **75.5%** had witnessed violence in the previous year.
- **68.8%** reported psychological harm; **40.3%** physical harm.
- **48.3%** believe workplace violence has worsened over five years.
- Only **51.1%** have received formal violence-prevention training.
- Prof. Luis Garcia-Castrillo: while patients and relatives were the main perpetrators,
  "**overcrowding in emergency medical departments was an equally important contributor to
  the violence**."
- Peer-reviewed in *European Journal of Emergency Medicine*, DOI 10.1097/MEJ.0000000000001375.

### 5.3 United States: boarding declared a public health crisis

KFF Health News / The Atlantic, 24 April 2026:
https://kffhealthnews.org/health-industry/emergency-room-ed-boarding-hospital-beds-long-waits-crisis/

- AHRQ: "**Emergency department (ED) boarding is a public health crisis in the United
  States.** Patients who are sick enough to require inpatient care can wait in the ED for
  hours, days, or even weeks." And: "Boarding contributes to increased mortality, medical
  errors, prolonged hospital stays, and greater dissatisfaction with care."
- Adrian Haimovich (Beth Israel Deaconess): "Everyone knows about this problem, and no one
  cares enough to do anything about it... It's barbaric."
- Gabe Kelen (Johns Hopkins) describes a moral hazard — ED staff forced to care for boarders
  *in addition* to new arrivals. "Some EDs now routinely hold more boarders — many of them
  quite ill — than patients being actively evaluated."
- **Regulatory teeth:** CMS finalised a boarding-time data-collection rule in Nov 2025; the
  2026 CMS programme adds **voluntary** boarding-time reporting in 2027 and **mandatory in
  2028**, with reimbursement consequences. The Joint Commission called boarding a "serious
  public health crisis."

### 5.4 Australia: ambulance ramping erodes whole fleets

ABC News, 17 September 2026:
https://www.abc.net.au/news/2026-09-17/17000-triple-zero-calls-told-no-ambulance-available/107163578

Tasmania: Triple Zero callers were told no ambulance was immediately available **nearly 17,000
times in 2025–26 — about 46 times per day**. "Delayed activations" (≥3 min to dispatch) rose
**30%** year on year. Total Triple Zero calls 115,735 (+6%). HCSU state secretary Robbie Moore:
"We see ambulances unavailable for people in a life-or-death situation — that happens
regularly," attributing it to "bed block in hospitals."

Dr Fleischer, Christchurch, on ramping (The Press, Sept 2026): ambulance ramping — "where
people wait in ambulances or ambulance bays to be triaged" — is **routine across every New
Zealand emergency department.**

---

## 6. Current evidence does not support autonomous AI triage — the case for a human decision-maker

This section is your strongest defence. It supports supervised decision support and local
prospective validation; it does **not** prove that no future AI system could ever assist with
triage. Use it to show you understand the risk, not to attack competitors.

### 6.1 LLMs do not reach clinical agreement on urgency

**39,375 real ED cases.** Seven frontier LLMs triaged in real time against Emergency Severity
Index decisions made by 25 emergency physicians. AHEPA University General Hospital,
Thessaloniki, June 2024–July 2025. *Journal of Clinical Medicine*, 14 February 2026,
DOI 10.3390/jcm15041512

- Best models (DeepSeek, Claude Sonnet 4): quadratic-weighted kappa ≈ **0.467**, raw accuracy
  **61.7%**.
- GPT-5 Instant: κw = **0.176** (95% CI 0.167–0.186).
- **None reached strong agreement** (κ > 0.80).

> "Current LLMs demonstrate promising but inconsistent capability in triage. While selected
> models achieved moderate alignment with physician ESI decisions, none achieved strong
> agreement... **LLMs are most suitable as supervised decision support tools, particularly in
> anatomically well-defined clinical scenarios, rather than as autonomous systems.**"

> "LLMs also showed tendencies toward over- or under-triage."

### 6.2 Nurses beat general-purpose AI, and the AI under-triages the sickest

Prospective observational study, 378 paediatric ED patients. *Journal of Pediatric Nursing*,
10 June 2026, DOI 10.1016/j.pedn.2026.06.004

| Assessor | Accuracy |
|---|---|
| Experienced nurses | **92%** |
| ChatGPT Plus | 65% |
| Gemini Pro | 63% |

κw: physician–nurse **0.892**; ChatGPT Plus 0.586; Gemini Pro 0.544.

> "AI tools showed a tendency toward **under-triage of emergent patients** and over-triage of
> both urgent and non-urgent patients."

> "General AI tools are not yet sufficiently accurate to classify pediatric cases and cannot
> replace experienced nurses."

### 6.3 A fine-tuned LLM lost to a plain structured-data model

74,170 real paediatric ED encounters, Korea, Jan 2020–Apr 2025. *PLOS One*, 4 June 2026,
DOI 10.1371/journal.pone.0350770

| Model | Accuracy | Macro-F1 | QWK | Strict under-triage |
|---|---|---|---|---|
| Qwen3-8B fine-tuned (LLM) | 58.60% | 0.417 | 0.535 | 0.65% |
| XGBoost on structured triage variables | **69.40%** | 0.618 | 0.651 | — |

> "The fine-tuned language model did not surpass the structured-data comparator in overall
> performance... These findings support its potential role as a **decision-support aid for
> human triage review rather than an autonomous triage system**."

### 6.4 The systematic review position

*Clinical and Experimental Emergency Medicine*, 27 July 2026, DOI 10.15441/ceem.26.283.
Scoping review, 27 studies from 1,865 records:

> "Evidence on LLMs remains preliminary, with concerns about **undertriage, inconsistency,
> hallucination, local adaptability, and the need for supervised use**."

Conclusion calls for "supervised human-AI collaboration, prospective validation... and
continuous monitoring."

### 6.5 A physician-facing tool still under-triages a quarter of emergencies

OpenEvidence, 960 prompts from 60 clinician-authored vignettes. *International Journal of
Medical Informatics*, 29 August 2026, DOI 10.1016/j.ijmedinf.2026.106687

> "OpenEvidence under-triaged 12.5% of emergency presentations versus 51.6% in the
> previously reported ChatGPT Health benchmark."

Accuracy 71.3% on 449 clear-case recommendations; over-triage of non-urgent Home
presentations 68.0%; declined to assign a level in 6.8% of responses.

### 6.6 The professional bodies have already written your product's safety section

**ACEP-led consensus statement, approved 18 March 2026** (updated 31 July 2026), convened with
SAEM, CORD, ACOEP, ABEM, AAEM, EMRA, AACEM and AOBEM.
https://www.acep.org/news/acep-newsroom-articles/3-18-26-leading-em-organizations-issue-consensus-statement-on-artificial-intelligence-in-em

> "The consensus statement asserts that **emergency physicians retain authority for patient
> care decisions, that AI should enhance, not replace, clinical judgement, and that any AI
> approach must preserve the physician-patient relationship**."

ACEP's Emergency Medicine Informatics Section, 22 May 2026, draws hard red lines:
https://www.acep.org/informatics/newsroom/may-2026/the-em-physicians-ai-stack

> "**Do not let an AI output decide disposition**"

> "Do not use a public model as a medical consultant for a real patient"

> "Do not use a model's explanation as proof that the model is correct."

It stratifies AI into five risk layers and places anything that "influences triage,
diagnosis, testing, treatment, disposition, or follow-up" into clinical decision support
requiring sensitivity/specificity/PPV/NPV and subgroup performance reporting.

**This is your fastest route to credibility.** Your `PRODUCT_GOAL.md` principles
("Human decision-maker, always", "Clear provenance and accountability", "Safety before
speed") map almost line-for-line onto the ACEP consensus position. Quote it in the pitch. It
converts your safety caveats from defensive hand-waving into alignment with the specialty's
own published position.

### 6.7 Regulation

- **FDA, 6 January 2026:** revised CDS guidance applying enforcement discretion to "single
  recommendation" CDS where the clinician can independently review the logic, data sources
  and guidelines — "a requirement often described as a 'glass box,' not a black one."
  Critically, it is not a wholesale deregulation: FDA "continues to assert authority over
  opaque models, time-critical decision tools, and software that substitutes for clinical
  judgment." ⚠️ Read via clinician commentary (KevinMD, 18 Jan 2026) — pull the FDA primary
  document (`fda.gov/media/109618/download`) before citing in a deck.
- **MHRA has decided not to classify AI scribes as medical devices in England**, "which means
  there will be no England-wide oversight." (Healthwatch England via The Guardian,
  31 Aug 2026.)
- Australia's **TGA has acknowledged some scribes may have been in breach of the law; none
  are TGA-approved.** (ABC News, 14 Aug 2026.)
- AMA policy explicitly uses the term **"augmented intelligence"** to signal the assistive,
  not replacing, role: https://www.ama-assn.org/practice-management/digital-health/augmented-intelligence-medicine

---

## 7. AI documentation in the ED: what it actually saves, and what it does not

This section is your differentiation material. Heidi is already in NZ EDs. Here is what the
published evidence says about that category, so you can position precisely.

### 7.1 Best large-scale result

**1.03 million scribe-assisted ED consultations across 48 hospitals** (Quirónsalud Healthcare
Network, Spain). Alcázar-Peral JM et al., *International Journal of Medical Informatics*
Vol 220:106584, e-published 2 July 2026. DOI 10.1016/j.ijmedinf.2026.106584

- Scribe used in 1,032,558 consultations = **45.3% of ~2.27M emergency visits**.
- Monthly adoption rose **7.7% → 57.8%**.
- "Scribe-assisted consultations were significantly shorter (p < 0.001), with a mean relative
  time savings of **21.8%**."
- Transcription accuracy averaged **93.9%**.
- "Audits of clinical reports showed **higher documentation quality scores for Scribe-generated
  reports, with a large effect size**."
- Patient experience (NPS) and clinician experience both higher.

### 7.2 The most credible causal estimate is much smaller

Preiksaitis C, Alvarez A, Winkel M, et al., *Annals of Emergency Medicine* 87(5):569–574,
May 2026. 10,344 encounters, 100 attendings, 4 ED care settings, Feb 2025–Mar 2026.

> "Ambient AI scribe use was associated with a **72.6-second reduction in on-shift
> documentation time per encounter** (95% CI 63.8–81.4; P<.001)."

**≈24 minutes saved per 8-hour shift.** And the counterintuitive caveat that belongs in your
deck as a credibility signal:

> "after-shift documentation time **increased modestly by 9.1 seconds** (95% CI 2.9–15.3;
> P=.004)."

Separate Stanford EHR audit-log analysis: median on-shift documentation **2:45 min with ambient
vs 3:50 without (−28%)**; total EHR time 8:39 vs 10:21 (−16%). But only **35 of 92 attendings
(38%)** used the tool — a small group of high-frequency users drove nearly all use. Use
clustered in **low-acuity, non-interpreter** patients.

### 7.3 AI scribes underperform human scribes

Mass General Brigham, 198,178 encounters. Dutta S, Guan-Ting You J, Dunham L, et al., *Annals
of Emergency Medicine*, e-published 11 June 2026. DOI 10.1016/j.annemergmed.2026.04.022

| Group | Share | Change in adjusted median attending documentation time |
|---|---|---|
| No scribe | 87.7% | baseline |
| Ambient AI | 4.3% | **−1.6 min** |
| Human scribe | 8.0% | **−3.3 min** |

> "**Total wRVUs per shift hour did not differ among groups.**"

### 7.4 The evidence base is genuinely thin

Gancz L, Duffy EI, Mathies I, et al., *Journal of Emergency Medicine* 88:235–243, Sept 2026.
DOI 10.1016/j.jemermed.2026.05.043 — scoping review of ambient AI scribes in the ED.

- 521 records screened, **only six studies met inclusion criteria, with ED physician sample
  sizes ranging from 6 to 24**.
- Outcomes reported: improved cognitive workload, shorter time to first note, increased
  patient throughput.
- "**One study reported longer charting time with AI scribes compared to human scribes.**"
- Challenges: fragmented ED workflows, environmental noise, note accuracy, EHR integration,
  clinician distrust.

### 7.5 The trust gap is the number to build a slide on

Marquis T, Kopp M, Anderson JS, et al., *JMIR Formative Research* 10:e80401, 3 March 2026.
https://pmc.ncbi.nlm.nih.gov/articles/PMC12996897/

- Only **42.9% (6/14)** of emergency physicians **trusted the accuracy of ambient
  scribe-generated notes**, versus **75% (6/8)** who trusted in-person scribes.
- Only **23.1% (3/13)** found it helpful for the **physical exam**; 35.7% (5/14) for medical
  decision-making. By contrast, 75% of scribe users found scribes helpful for physical exam.
- **Negative workflow themes (6) outnumbered positive ones (4).**
- 64.3% satisfied or very satisfied; 50% preferred the ambient scribe, 28.5% preferred in-person
  scribes, and **none preferred independent documentation**.

Verbatim, from an emergency physician:

> "DAX has been inaccurate, has weird wording and often takes me more time because I have to
> explain my use of it to patients to consent them and then heavily edit my notes. **I do not
> trust Dax.**"

### 7.6 Independent audit: AI notes scored worse on every quality domain

VHA-funded, vendor-neutral. 11 AI scribe tools, 18 human note takers, 30 blinded raters, 5
standardised primary care cases, modified PDQI-9. *Annals of Internal Medicine*, 17 April
2026. DOI 10.7326/annals-25-02772, PMID 41996184

**Human notes won every case, on all 10 quality domains.** Low back pain case: human **43.8**
(95% CI 37.4–50.3) vs AI **20.3** (15.4–25.2) — a difference of **−23.5**.

> "Notes generated by AI had lower-quality scores than human-generated notes across 5
> standardized care cases. Although ambient AI scribes hold promise for reducing clinician
> burden, **independent, vendor-neutral evaluations of note quality are essential before
> large-scale clinical deployment**."

### 7.7 Real patient harm from AI scribe output

**England — Healthwatch England, via The Guardian, 31 August 2026:**
https://www.theguardian.com/society/2026/aug/31/doctors-ai-scribes-get-names-of-drugs-and-diagnoses-wrong-nhs-watchdog-warns

- A woman was left badly shaken when an AI scribe's summary wrongly said she had
  **demyelination**. It was only when the patient — herself an NHS health professional —
  queried the record that the hospital corrected it to "null demyelination."
- An AI scribe **confused a prescribed drug with a different one of a similar name** — again
  caught by the patient, not the doctor.
- An AI summary letter **omitted the consultant's instruction to seek a repeat prescription**.
- Verbatim from Healthwatch: "These inaccuracies may persist in their records if the patient
  doesn't catch them."
- **27 different AI scribes in use in England.** MHRA decided not to classify them as medical
  devices, "which means there will be no England-wide oversight."
- Clinician: "the need for doctors to review all transcripts in order to check for errors meant
  that AI tools are not yet proving time-saving."
- Counterpoint, in fairness: more than half of the 1,003 UK GPs in one survey believed their
  ambient AI records were **more accurate** than those they produced themselves.

**Australia — patient trust "splintered" (ABC News, 14 August 2026):**
https://www.abc.net.au/news/2026-08-14/ai-medical-scribe-error-leaves-patient-devastated/107031672

- Rebecca Green consented to AI transcription, then "**the AI scribe making up the serious
  but false claim that Ms Green was taking illegal drugs**."
> "I was gobsmacked and in tears ... it made up that I take [psychedelic] mushrooms. I have
> never done mushrooms in my life."

- The error surfaced only when she read the post-operative letter to her GP.
- "**Ms Green's trust in AI has been splintered**... now would only give consent for AI if she
> had an established relationship with the doctor. 'I love AI … but the essential ingredient
> is the human.'"
- Digital Rights Watch found consent obtained via a waiting-room sign only in some practices,
  with "**some patients even being refused appointments if they do not consent**," and
  patients under-reporting sensitive issues such as family violence when they know AI is
  listening.

### 7.8 Omissions beat hallucinations — and omissions are the dangerous kind

Biro J, Handley JL, Cobb NK, Kottamasu V, Collins J, Krevat S, Ratwani RM, *Journal of Medical
Internet Research* 27:e64993, 27 January 2025. *(Older than six months — label as
foundational, but it remains the most-cited accuracy instrument and is the study the 2026 ED
literature cites.)* https://pmc.ncbi.nlm.nih.gov/articles/PMC11811668/

Two commercial products tested against 11 real outpatient encounter scripts:

> "There were **127 errors (mean 2.9, SD 2.7 errors per draft note) in 31 of 44 (70%) draft
> notes**."

- **Omission errors were the most frequent across products** — 83% and 54% respectively.
- Only 3–7 *additions* (hallucinations) per product. Hallucination is real but less common
  than omission.
- The critical insight for a triage product:

> omission "may be the most difficult for clinicians to identify since the identification
> process requires memory recall of details from the patient encounter. **If clinicians review
> their documentation after several patient encounters, recalling omitted details may be
> challenging.**"

The study calls for "a robust, standardized and repeatable ADS evaluation framework," noting
that absent one "health care facilities currently bear the burden of testing and reporting
these results." That is a genuine product opportunity.

### 7.9 Patient consent: 62% reluctant

Canadian survey of 12,153 adults, *JAMIA* 2026;33(2):263–272, DOI 10.1093/jamia/ocaf218,
PMID 41350107: **62% were reluctant to agree to AI scribe use**, although 57% trusted AI
scribe accuracy with human oversight. Greater willingness was associated with **more frequent
emergency department use**; privacy concerns reduced willingness.

⚠️ Read via the 2026 *Can J Emerg Med* editorial, not the primary paper — verify before
putting it on a slide.

---

## 8. Information gets lost in triage and handover — the core product thesis

### 8.1 The quantified "information loss" number

83 EMS→ED handovers directly observed with a structured checklist, tertiary centre, Israel.
*International Emergency Nursing*, 15 December 2025, DOI 10.1016/j.ienj.2025.101735

- Handovers were **97.6% verbal only**.
- Median duration **40 seconds** (ALS) and **25 seconds** (BLS).
- **Pre-hospital treatment details absent in 36.1%** of handovers (95% CI 26.6–46.9).
- **Allergy details absent in 55.4%.**
- **Demographic details absent in 61.4%.**
- EMS written documentation was available in only **7.2%** of handovers.

> "Because EMS-to-ED handovers rely almost exclusively on brief verbal communication, they
> are vulnerable to information loss. **Critical safety-relevant information (allergies,
> medications) is frequently omitted.**"

If your tool handles intake and ambulance handovers, that is a 61–97% information-loss surface.

### 8.2 What actually goes missing ED → inpatient

*Cureus*, 20 May 2026, DOI 10.7759/cureus.109294

> "Common vulnerabilities include incomplete communication of **illness severity, working
> diagnosis, diagnostic uncertainty, treatment response, pending tests, medication risks, and
> contingency plans**."

On the failure mode:

> "**diagnostic momentum, where a provisional ED label becomes accepted by subsequent teams
> without adequate reassessment**."

And the framing: "The ED-to-inpatient transition should be treated as an active patient-safety
intervention rather than a purely administrative movement of the patient."

### 8.3 Structured handover tools do work

- **ISOBAR, 651 observed handovers**, German university hospital ED, six alternating phases.
  COPTER Trial, *JACEP Open*, 9 Jan 2025 (foundational, ~20 months old). Key information
  retention +18% for physicians and +19% for nurses; questions asked after handover down 29%.
  Honest caveat: "adherence to ISOBAR had **no notable effect on outcome measures**."
- **Paediatric replication (COPTER-PED, 107 handovers, Dec 2025):** key information
  transferred +22%; physicians recalled 16% and nurses 10% more. Again, full adherence had
  no significant effect on outcome measures.
- **I-PASS in a paediatric ED QI study** (240 charts pre / 360 post, *Pediatric Quality &
  Safety*, Jan 2026, DOI 10.1097/pq9.0000000000000870): notes containing all 4 I-PASS
  elements rose **0% → 63.0%**; template use 0% → 82.0%.
- Trauma handover scoping review, *BMC Emergency Medicine*, 27 Jan 2026
  (DOI 10.1186/s12873-026-01480-4): "structured communication tools were associated with
  improvements in handover efficiency, fewer communication errors and omissions, and better
  team coordination; **however, the evidence base was heterogeneous and largely
  observational**." Recurrent barriers: inconsistent adoption, insufficient training,
  infrastructure limits.

### 8.4 AI-generated handover summaries already have RCT evidence

500 patients, 250/250, single centre. *Journal of Pharmacy and Bioallied Sciences*, 12 Jan
2026, DOI 10.4103/jpbs.jpbs_1501_25

| Measure | AI summary | Physician-written | Significance |
|---|---|---|---|
| Handoff completion time | 8.2 ± 1.5 min | 12.7 ± 2.1 min | **P<0.001 (~35% faster)** |
| Documentation accuracy | 92.4% | 94.1% | P=0.07, NS |
| Physician satisfaction | 4.3/5 | 3.7/5 | P<0.01 |
| Adverse events | 2.4% | 2.8% | P=0.62, NS |

This is your proof-of-concept slide if you want to show the mechanism already works. The
authors call for larger studies across settings.

---

## 9. The nursing documentation gap — your clearest opening

### 9.1 Nurses are the primary users of the ED front door, and they are not served

**Documentation burden consumes an average of 31% of a nurse's 12-hour shift** — roughly 3.7
hours of charting per nurse per shift. Trias R, Coleman B, Bowers C, et al., *American
Journal of Nursing* 126(8):48–51, August 2026. DOI 10.1097/ajn.0000000000000349. *(Med-surg
unit, not ED; the 31% is an average from prior research, not measured in that pilot.)* The
same paper cites a range of **up to 40% of a nurse's time**, and notes that reducing
documentation time "can free up 20–30 min per nurse per shift."

**Cedars-Sinai nurse voice-documentation pilot** (90 RNs + 33 CNAs, 6 months, 48-bed
med-surg), same paper: incidental overtime fell from **97 to 48.5 hours per month** — a 50%
reduction. Patient experience improved across all six Press Ganey domains, **7 to 41
percentile points.**

**Nurse manager survey, 118 registered nurse managers, Jan–Apr 2026** (Black Book Research,
"The Nurse Documentation and AI Readiness Gap"; vendor-sponsored — label it):
- **86%** report documentation requirements regularly reduce staff RN time for direct patient
  care.
- **82%** report recurring staff RN complaints about duplicate or overlapping documentation.
- **79%** say bedside RNs are not sufficiently included in AI documentation design, vendor
  selection, pilot testing, governance or rollout decisions.
- **74%** say physician-style ambient documentation tools **will not solve nursing
  documentation burden** unless redesigned for nursing-specific workflows.
- 68% worry AI-generated or prefilled documentation could shift legal, licensure, audit or
  patient-safety risk to nurses without meaningfully reducing workload.
- 77% prefer AI documentation tools start with low-risk, high-volume tasks before moving
  into autonomous assessment or clinical decision support.
> "These registered nurses are not asking technology to document more. They are asking
> technology to remove redundant work, protect professional judgment, and return time to
> patients."

Combine with the Christchurch-specific finding that the triage nurse was "overseeing up to
10 [corridor patients] while continuing to triage others" and calling that "a high-risk
situation." The product you are building is the one 74% of nurse managers say does not yet
exist.

### 9.2 Documentation and the burnout link

**CMA & CFIB, "Losing doctors to desk work", January 2026**, national Canadian survey,
n=1,924:
- **90% agree clinical documentation contributes to burnout** (66% strongly, 24% somewhat).
- 93% agree administrative work disrupts work–life balance; 95% agree unnecessary paperwork
  reduces professional fulfilment; 80%+ say admin workload limits meaningful patient
  interaction.
- Physicians average **9.1 hrs/week on administrative tasks — roughly one-fifth of total
  working time**, totalling 42.7 million hours/year nationally, of which **47% (19.8M hours)
  is deemed unnecessary.** Removing it "could unlock capacity equal to **9,093 full-time
  physicians — about 9% of Canada's active medical workforce**."
- **54% intend to reduce clinical hours within 24 months** because of paperwork; **one in four
  is considering leaving medicine or retiring earlier**; more than a third would discourage
  medical students from entering their specialty.
- Only 15.2% have anyone to help with paperwork. 31.9% complete admin tasks **exclusively
  outside clinical hours**; 53.1% say admin time increased in the past 12 months.
- 45% rank adopting AI (scribes, agents) as a priority; 28% already use an AI scribe and
  another 42% are interested. Of users, 74% rely on it daily. **"Physicians who use AI scribe
  tools report saving an average of 64 minutes per day."** Barriers: medico-legal/privacy
  risk 49%, cost 33%, interoperability 30%, training time 28%.
- Note: the 9% of workforce capacity figure is a **Canada** number. Use it for the
  mechanism, not for a NZ market size.

**The best "after-hours charting → burnout" statistic** is Barr WB, Peterson LE, Fleischer S,
Bazemore A, *Academic Medicine* 101(3):312–318, March 2026, DOI 10.1093/acamed/wvaf092.
Survey of 9,653 US family medicine residents after the 2024 In-Training Examination:

- **3,124 (32.3%) reported high pajama time** (≥3 hours/night on ambulatory EHRs).
- After controlling for clinician characteristics, high pajama time was associated with
  **higher odds of burnout (OR 1.61; 95% CI 1.46–1.78)**, lower examination scores (OR 1.28),
  decreased odds of professional satisfaction (OR 0.61) and training programme satisfaction
  (OR 0.62).

> "Nearly one-third of upper-year US FM residents report spending 3 hours or more per day
> working after hours on ambulatory EHRs."

⚠️ **Do not use the "2.8× burnout odds" figure.** It circulated on vendor blogs in 2026 and
could not be traced to any original source. The verified numbers are OR 1.61 (Barr) and 90%
agreement (CMA/CFIB).

**Health-system ambient AI effect on after-hours work** — Providence St Joseph Health, 1,547
clinicians, 16,149 monthly observations, July 2023–March 2025, interrupted time series.
Husa RA, Haggerty J, Nute AW, et al., *JAMA Network Open* 9(5):e2615762, 29 May 2026.
- Median time-in-notes fell 7.1 → 6.1 min/appointment.
- No immediate decline in after-hours documentation, but a **statistically significant
  sustained decline** in minutes spent documenting after hours (β = −0.38 per month, P=.02).
  Median 22.0 → 20.6 min.
- **No change in clinician efficiency profile score and no change in appointments per day.**
  Only ~8% of system clinicians were active users. Cohort was 65.2% primary care — not ED.

**Foundational, label as older:** up to **40% of every ED shift** is consumed by
documentation — "a significant portion of the EP workday, upward of 40% of every shift, is
consumed by administrative tasks such as the documentation of patient encounters in the
electronic health record" (citing Hill RG Jr et al., '4000 clicks', *Am J Emerg Med*
2013;31(11):1591–4), quoted in Marquis T et al. 2026. EPs "have long been known to experience
higher rates of burnout than physicians of any other specialty."

**Only about 50% of problems discussed between patients and nurses are documented**, and
nurses' evaluations are "scarcely documented." Michalowski M, Topaz M, Peltonen LM, *Journal
of Advanced Nursing* 82(1):907–912, Jan 2026 issue. DOI 10.1111/jan.16911. Relevant to your
product: this is under-capture creating clinical risk.

### 9.3 What Health NZ itself is reporting about Heidi — your opening line

RNZ, 17 March 2026:
https://www.rnz.co.nz/news/health/589774/emergency-doctors-estimate-ai-scribe-heidi-saving-up-to-10-minutes-per-patient

- Emergency physician **Dr John Bonning**: normally 15 minutes to see one patient and write
  up notes; a colleague reported writing notes for **three patients in 11 minutes**. Main
  benefit is "speeding up those that are slow typists." Only about **10% decided it was not
  for them**.
- On consent: "We do ask [patients'] consent before every use. **I don't think I've ever had
  anybody say no**, because it helps you do your job."
- On accuracy: "The notes could be quite wordy, and did need to be '**very carefully edited,
  and occasionally it hallucinates and puts in false information, but not too much**'."
- **Health NZ's own director of digital innovation and AI, Sonny Taite**: "with formal
  evaluation work ongoing, Health NZ was **not attributing specific time savings percentages
  or quantified burnout outcomes** at this stage."
- And the gap: feedback from **40 clinicians surveyed** showed a need to "**further improve
  accuracy and reduce editing effort, which would enhance trust and preserve time savings,
  particularly for senior clinicians**." Clinicians also wanted "clearer guidance,
  templates, and training to support safe, confident use while reinforcing clinical reasoning
  and governance."
- Pilot result (Hawke's Bay, 10 clinicians, 2 months): doctors "able to see, on average,
  **one additional patient per shift**." Staff-reported burnout fell from **6/10 to 3/10**,
  "particularly beneficial for nursing staff who previously hand wrote their notes."
- Middlemore, after one month: **80%** of surveyed staff said it improved productivity or
  efficiency; **84%** said positive impact on overall experience and wellbeing during a shift.
- Delivered by the **HealthX** programme.

**Openings in that paragraph:** editing effort, accuracy, trust, and the fact that the health
system has no quantified evaluation. Do not claim that Heidi cannot flag red flags or support
clinical reasoning without current, primary product evidence. Its public positioning has expanded
beyond note-writing. The defensible differentiation claim is narrower: this product is designed
to produce a clinician-owned, editable and auditable front-door brief and urgency-decision record;
whether that workflow is unmet must be validated with Canterbury users.

### 9.4 NZ patient trust research — quote this, it is locally specific

Paper "Maintaining patient trust as artificial intelligence's role in healthcare grows" by
Rosie Dobson, Melanie Stowell and Robyn Whittaker, reported in RNZ 17 March 2026. Findings
from interviews with patients and healthcare workers:

- The primary benefit of sharing AI data should be **to the New Zealand public** — not private
  companies or those overseas.
- Strong data protection needed.
- Patients needed **choice, and to give consent** on when to share their data.
- AI should not replace the "human touch" of health professions.
- There should be **Māori representation in work to develop AI tools, and governance over
  their use**.
- **Universities and NZ-based organisations were seen as more trustworthy AI development
  partners than commercial companies or overseas institutions.**
- Trust can be built through transparency and good governance — "**but if broken or lost, it
  will be difficult to repair and will have wider implications**."

**This is a pitch weapon.** It is NZ-specific, it is academic rather than vendor, and it
favours a small NZ team over a US vendor. If your team includes Māori governance or a local
university partnership, say so on this slide.

Also relevant: Heidi's encrypted de-identified data is **currently stored in a cloud server in
Australia**, with a NZ server described as "high in our priority for 2026" but limited by
infrastructure availability. Heidi states "None of the information fed into Heidi was used to
train its AI."

---

## 10. Market size and capital

- **Heidi raised $340M at a $900M valuation**, announced 22 September 2026: $100M Series C
  led by Blackbird plus a $240M growth investment led by General Catalyst's Customer Value
  Fund. ARR grew **$1M → $50M in two years**. Now supports **~2.8 million patient
  interactions per week in 110 languages across 190 countries**. Fierce Healthcare,
  22 Sep 2026: https://www.fiercehealthcare.com/ai-and-machine-learning/heidi-lands-340m-build-ai-care-partner-clinicians
- Heidi CEO Thomas Kelly: "the ambition was always bigger than writing doctor's notes. I
  imagined that AI would sit alongside clinicians and complete real work under their
  supervision... from documenting care to helping clinicians act on it."
- **Ambient clinical intelligence market: USD 7.24B (2025) → USD 56.61B (2035), 22.85% CAGR.**
  US sub-market USD 2.87B → USD 16.25B (18.95% CAGR); North America ~45% of global share;
  hospitals and health systems 57% of end users; clinical documentation and digital scribes
  48% of applications. SNS Insider via GlobeNewswire, 3–4 May 2026.
  ⚠️ Other 2026 estimates differ by up to 6× ($1.15B to $7.24B for overlapping categories).
  Pick one and attribute it, or use a range and say so.
- **Ambience Healthcare raised $243M Series C in July 2025 at a $1.25B valuation**, which STAT
  described as bringing AI-scribe funding to "nearly $1 billion" that year.
  *(July 2025 — outside the six-month window; useful as context only.)*
- **US federal scale:** VA ambient scribes have passed **986,000 primary care appointments**
  with **less than 1% patient refusal** since October 2025. **Abridge** is the only vendor live
  at VA medical centres — "deployed at 70 VA sites and over 300 U.S. health systems." **Knowtex:**
  10 VISNs, 79 VA medical centres in six months, 7,000+ clinician users, "saving over 450,000
  hours of EHR documentation time," 88% adoption, 4.48/5 satisfaction. Nextgov/FCW,
  14 Sep 2026: https://nextgov.com/artificial-intelligence/2026/09/va-gradually-expand-medical-ai-scribe-following-successful-pilots/415971
- **Procurement:** Heidi reportedly selected as **sole supplier for NHS England Midlands**,
  described as "the largest clinical AI procurement in NHS history." Single-sourced to
  Fierce Healthcare citing the company — not confirmed on NHS England's own site.

### The finding that should shape your slide

**In this six-month search, no verified 2026 funding rounds for triage-specific startups were
found.** The visible 2026 capital in this category is overwhelmingly going to ambient
documentation and AI-agent companies. Treat this as a search finding, not proof that nobody is
funding triage. It is a positioning signal and a warning: triage is likely harder to validate and
buy than documentation.

---

## 10.5 Christchurch beachhead: market and buyer hypotheses to validate

This is deliberately a **beachhead model, not a TAM claim**. There is no verified public price,
procurement pathway, or addressable-workflow percentage for a Canterbury triage product. Do not
invent one for the pitch.

### What the local data establishes

- Christchurch Hospital recorded **60,789 ED arrivals from January to May 2026**. Annualising
  that five-month run-rate gives about **145,900 arrivals**, but seasonality and changes in demand
  make this a planning estimate, not a forecast.
- May alone recorded **13,081 arrivals**. The OIA data also shows 69.1% were not admitted; this
  is not a claim about who is eligible for the product, only an indication that front-door
  workflow is high-volume.
- A single successful site is enough to establish workflow fit and a measured baseline before any
  multi-site market claim.

### The people who must say “yes”

Treat these as customer-discovery targets, not assumptions about Health NZ's internal authority:

| Role to interview | Decision to validate | Evidence needed from them |
|---|---|---|
| Triage and charge nurses | Does the brief reduce duplicate capture or missed context without adding clicks? | Observed workflow and edit/rejection reasons |
| ED clinical director / senior emergency physician | Is the output clinically useful and safely bounded? | Agreed escalation and review criteria |
| Nursing leadership | Does it fit nursing documentation and staffing practice? | Acceptance criteria and training constraints |
| Digital, privacy, security and data-governance leads | Can data be processed, retained and audited appropriately? | Architecture, consent and data-residency requirements |
| Māori health / data-governance partners and patient representatives | Does the design uphold trust, consent and governance expectations? | Co-designed consent, governance and equity measures |
| Operational and procurement sponsor | Is there a route from pilot to a paid service if it works? | Pilot owner, evaluation plan and procurement requirements |

### Competitive position: state only what can be proven

| Category | What is established | What must not be assumed |
|---|---|---|
| National ambient-scribe rollout (Heidi) | Health NZ says every NZ ED has access and 1,250 ED doctors/frontline staff were included. | That it solves, or cannot solve, a particular Canterbury triage workflow. |
| Generic ambient scribes | They target clinical documentation and have evidence of mixed workflow/time outcomes. | That any vendor is clinically equivalent, or lacks a feature, without a current product check. |
| This proposed product | Intended: editable structured front-door brief, provenance and a clinician-owned urgency decision record. | Clinical benefit, time saving, willingness to pay, or safety benefit before a prospective pilot. |

### Pitch-safe market statement

> “Christchurch is our beachhead, not a claimed national market. The local ED has roughly
> 13,000 arrivals in a recent month and documented capacity pressure. We will first prove that
> a clinician-owned intake and escalation brief improves a defined workflow. Only then will we
> establish pricing, procurement fit and expansion to comparable sites.”

## 10.6 Pilot: the evidence plan that converts a problem into a buyable product

### Scope and safeguards

- Start with one defined, lower-risk workflow agreed with ED leadership; do not start with an
  autonomous urgency recommendation.
- Keep the nurse or clinician as the recorded decision-maker. Distinguish patient-stated facts,
  clinician observations and system-generated prompts.
- Require visible provenance, editing, rejection and correction; log these for audit.
- Obtain local privacy, security, Māori data-governance and patient-consent guidance before any
  real-patient use. Do not treat a research prototype as clinical decision support clearance.

### Measures to pre-register

| Outcome | Measure | Why it matters |
|---|---|---|
| Workflow burden | Median documentation minutes and number of duplicate fields per eligible encounter | Tests whether the tool reduces, rather than moves, work |
| Information completeness | Checklist-based red-flag/context capture compared with usual workflow | Tests the core information-loss hypothesis |
| Human control | Edit rate, reject rate, reason for edit, and time to final clinician sign-off | Shows whether the output is trustworthy and usable |
| Safety | Missed-context review, escalation-review rate, adverse-event review and a stop rule | Prevents speed from becoming the primary success measure |
| Equity and consent | Consent/refusal, interpreter use, Māori and other priority-group experience where ethically approved | Tests whether benefits and burdens are shared fairly |
| Commercial fit | Sponsor assessment, implementation time, training time and estimated workflow value | Establishes whether a pilot can lead to procurement |

### Minimum evidence gates

1. No deterioration in the agreed safety/completeness measure.
2. Clinicians remain the documented owners of urgency and escalation decisions.
3. Measurable reduction in duplicate capture or documentation burden for the selected workflow.
4. Acceptable privacy, consent, equity and governance review.
5. A named operational sponsor agrees that the result is decision-useful.

---

## 11. The evidence gaps — turn these into your roadmap and your ask

These are places where a rigorous search of the last six months of literature found *nothing*.
Each one is a defensible claim that the problem is under-measured, which is also the reason a
buyer cannot yet justify spending on it.

1. **No quantified study of the time ED nurses spend on intake and triage documentation
   specifically.** The best available is a task-count study (1,183 tasks, §4) and general
   nursing percentages (31%, §9.1). No 2026 measurement of minutes-per-triage-encounter
   attributable to charting was found. Multiple avenues were checked: PubMed/Europe PMC
   title-field searches, a JCN ED triage scope-of-practice paper, an *Australasian Emergency
   Care* review on triage efficiency. **This is a genuine gap, and arguably your best pitch
   hook: do not claim improvement against a metric until the pilot has measured a baseline.**
2. **The entire ambient-AI-scribe-in-ED evidence base is six studies with n=6 to 24**
   (§7.4). There is no large, rigorous, ED-specific trial.
3. **Health NZ has no quantified evaluation of its own national ED scribe rollout** and
   explicitly declines to attribute time savings (§9.3).
4. **No verified 2026 US "left without being seen" (LWBS) rate** was found from ACEP or
   peer-reviewed sources. The only LWBS reference located was ACEP's 2016 crowding policy
   paper.
5. **No comparable national count of NZ "code red" declarations**, because Health NZ states
   "every hospital had different triggers for code reds and the information could not be
   easily compared" (RNZ, 21 Aug 2026).
6. **No standardised, vendor-neutral evaluation framework for AI scribe/AI documentation
   tools** — Biro et al. note that absent one, "health care facilities currently bear the
   burden of testing and reporting these results." Building one is a legitimate product.
7. **No verified 2026 NZ public-sector digital health budget line for AI.** Do not build a
   pitch on government AI money existing.
8. **No 2026 NZ or international AI funding rounds for triage specifically** (§10).

### Claims to avoid entirely

- **"2.8× burnout odds"** — untraceable to any source. Use OR 1.61 (Barr, *Acad Med*, Mar
  2026) or 90% agreement (CMA/CFIB, Jan 2026).
- **"Nurses document 97% / 34% high / 23% considering leaving"** — appears in a search
  snippet but is not in the indexed abstract of Johnson et al., *Nursing Outlook* 2025.
  Full text was paywalled. Do not use.
- **"Nearly 70% of physicians spend too much time documenting after hours"** — vendor blog
  only, no primary source.
- **Chandrasekaran & Moustakas JAMIA figures (62% reluctant, 57% trust)** — read via a
  secondary editorial, not the paper. Verify first.
- **The April 2026 Sutter Health / MemorialCare class action and January 2026 Sharp
  HealthCare suit** over AI scribe recording without consent — Becker's Hospital Review
  returned 403; the primary complaints were never reached. Currently sourced only to vendor
  blogs and one search snippet. Do not present as fact.
- **AMA Australia's "Ambulance Ramping Report Card 2026"** — the site redirects to a login loop
  and the PDF 404s. Do not quote the "2.4 million Australians arriving by ambulance" figure.
- **Any raw "AI scribe reduces documentation time by 76%"** claim that appears on vendor
  case-study aggregators (e.g. usecase.ai). These are marketing numbers with no methodology.
- **Heidi's "sole supplier for NHS England Midlands" and "deployed across every ED in New
   Zealand"** — the New Zealand part is now confirmed by Beehive and HiNZ (§0), but the NHS
   England claim is single-sourced to Fierce Healthcare citing the company.
- **The UK “554 deaths a week” crowding result as a causal fact** — it was released as a
   conference presentation/press release. If used, call it an observational, modelled estimate
   with a wide uncertainty range, not proof that crowding caused that number of deaths.
- **The 55-year-old chest-pain case as a primary regulatory finding** — add the original HDC
   decision before using it as a stand-alone slide. The current citation is secondary reporting.

---

## 12. The pitch argument, assembled

This section is synthesis, not new research. Structure it however you like, but the logic
holds together.

**1. The problem is real, local, and getting worse.**
Christchurch Hospital ED ran at 200–300% occupancy with patients in corridors, on beds
angled and then perpendicular to the wall. 14,587 corridor patients in 2025–26, up from
3,911 three years earlier, with corridor hours up five-fold. A 20-year veteran nurse quit
because senior triage nurses were overseeing up to 10 corridor patients while still triaging,
which she called "a high-risk situation." A secondary report describes a 55-year-old man with
cardiac chest pain who was triaged as non-cardiac in a 200%-occupancy ED, ten nurses short, and
did not get an ECG for four and a half hours. Verify and add the primary HDC decision before
using that case in a deck.

**2. It is not only a resourcing problem.**
Elective surgery improved sharply in the same quarter that ED performance moved 0.2 points,
because elective work can be scheduled, batched and outsourced. The front door cannot. The DPMC
factsheet rates the 95% target as "feasible," and Health NZ is investing in staffing, beds,
urgent care and flow. These are necessary system responses. A clinician-led process and software
pilot is a complementary, testable way to improve information capture and escalation review at
the front door; it is not a substitute for staff or bed capacity.

**3. The mechanism of harm is information, not just time.**
Handover is 97.6% verbal, median 40 seconds, with allergy details missing 55% of the time and
demographics missing 61% of the time. ED→inpatient transitions lose illness severity,
diagnostic uncertainty, pending tests and contingency plans. Triage nurse practice spans triage
*and* post-triage care, so the linear "triage then done" model does not fit how the work is
actually done. Under-capture is the mechanism: only ~50% of what patients tell nurses is
documented.

**4. The time argument is weaker than everyone thinks — including the incumbent's own data.**
The best causal estimate of ambient AI scribe benefit in an ED is 72.6 seconds per encounter,
about 24 minutes per shift. Mass General Brigham found ambient AI delivered half the benefit
of a human scribe, with no difference in wRVUs per shift hour. An independent, VHA-funded audit
found AI notes scored *worse* than human notes on all 10 quality domains. The scoping review of
the whole category rests on six studies with 6 to 24 participants. And Health NZ itself is not
attributing time savings for its own national rollout.

**5. Current evidence does not support autonomous AI triage.**
In 39,375 real ED cases, no tested frontier LLM reached strong agreement with physicians.
Experienced nurses beat general-purpose AI 92% to 65% on paediatric triage, with the AI biased
toward under-triaging the sickest patients. A fine-tuned LLM lost to a plain XGBoost model on
74,170 real paediatric encounters. Nine emergency medicine organisations, led by ACEP, published
a consensus statement on 18 March 2026: emergency physicians retain authority for patient care
decisions, AI should enhance rather than replace clinical judgement, and the physician-patient
relationship must be preserved.

**6. So the product is not "AI triage." It is a structured, reviewable front-door brief with a
clinician who owns the decision.** The clinician keeps authority. The report distinguishes what
was said or observed from what the model inferred. The urgency assignment is a recorded,
attributable human act. Every suggestion is editable and rejectable. This is not a hedge; it is
the product form most clearly aligned with the specialty consensus, safety evidence and
clinician-led validation expectations.

**7. The nursing side and escalation review are a hypothesis worth testing.** 86% of nurse managers say
documentation requirements cut RN time for direct patient care. 74% say physician-style ambient
tools will not solve nursing documentation burden unless redesigned for nursing-specific
workflows. 79% say bedside nurses are not included in AI documentation design at all. New Zealand
patients told researchers that AI must not replace human touch, must have Māori governance, and
that NZ-based and university partners are more trustworthy than commercial or overseas ones. The
national Heidi rollout proves that the incumbent category is real. Do not make unverified claims
about its feature limits. Instead, test whether Canterbury teams value a clinician-owned urgency
decision record, structured intake brief and escalation review beyond their existing tools.

**8. What we would do with your money: measure the thing nobody has measured.** There is no
2026 study of how many minutes an ED nurse spends on intake and triage documentation per
encounter. The ambient-AI evidence base in EDs is six small studies. Health NZ has no
quantified evaluation of its own rollout. A funded pilot that measures time-to-triage-decision,
documentation time per encounter, red-flag recall, and missed-information rate at one
Christchurch ED — with a published, vendor-neutral methodology — would produce the first real
numbers in the country. That is a defensible, modest, honest first ask, and it is the thing
that makes every subsequent conversation easier.

---

## Appendix: source index

**Christchurch / Canterbury**
- Health NZ OIA HNZ00204837, released 14 Jul 2026, data Jan–May 2026 —
  https://static.info.content.health.nz/docs/publications/christchurch-emergency-department-hnz00204837-oia.pdf
- Health NZ OIA HNZ00107405, 3 Mar 2026 (2024–25 provisional data) —
  https://www.healthnz.govt.nz/publications/christchurch-hospital-emergency-department-performance-oia
- The Press, 23 Sep 2026 (corridor data) — https://www.thepress.co.nz/nz-news/361085906/
- The Press, 10 Aug 2026 (Kez Jones) — https://www.thepress.co.nz/nz-news/361059734/
- NZ Herald, 29 Jul 2026 (Dr Fleischer) — https://www.nzherald.co.nz/nz/christchurch/christchurch-hospital-patients-treated-in-corridors-as-ed-overwhelmed-doctor-says/
- The Spinoff, 3 Feb 2026 (code reds, violence) — https://thespinoff.co.nz/the-bulletin/03-02-2026/how-violence-and-code-red-alerts-are-stretching-eds-to-breaking-point

**New Zealand national**
- B2B News, 23 Sep 2026 (health targets) — https://b2bnews.co.nz/news/nz-health-targets-improve-but-ed-waits-stay-stuck/
- 1News, 20 Aug 2026 (HDC triage case / Ben Gray) — https://www.1news.co.nz/2026/08/20/when-an-overloaded-ed-gets-it-wrong-who-should-be-accountable/
- 1News, 15 Aug 2026 (flu surge, St John) — https://www.1news.co.nz/2026/08/15/people-urged-to-stay-home-if-sick-amid-flu-surge-eds-over-capacity/
- RNZ, 21 Aug 2026 (Auckland OIA data) — https://www.rnz.co.nz/news/health/1068573/
- RNZ, 17 Mar 2026 (Heidi in NZ EDs) — https://www.rnz.co.nz/news/health/589774/
- Beehive, 28 Feb 2026 (nationwide ED scribe rollout) — https://www.beehive.govt.nz/release/ai-scribe-now-every-emergency-department
- HiNZ, 1 Mar 2026 (1,250 ED clinicians) — https://www.hinz.org.nz/news/721241/
- DPMC factsheet, Target 1, Mar 2026 — https://www.dpmc.govt.nz/sites/default/files/2026-06/gt-factsheet-target-1-mar26.pdf
- FYI.org.nz OIA requests on Christchurch/Dunedin ED wait times — https://fyi.org.nz/request/23487-waiting-times-at-christchurch-and-dunedin-emergency-departments

**Global crowding and safety**
- EUSEM / RCEM-funded crowding-mortality study, 25 Sep 2026 — https://eusem.org/news/1162-press-release-study-shows-how-risk-of-death-rises-with-rate-of-overcrowding-and-corridor-care-in-hospital-emergency-department
- EUSEM violence survey, 25 Sep 2026 — https://eusem.org/news/1160-press-release-violence-against-emergency-workers-is-increasing-hospital-overcrowding-is-a-major-contributor-emergency-medical-services-are-better-prepared-for-a-mass-casualty-incident-than-for-everyday-violence
- KFF Health News / The Atlantic, 24 Apr 2026 (US boarding) — https://kffhealthnews.org/health-industry/emergency-room-ed-boarding-hospital-beds-long-waits-crisis/
- ABC News Australia, 17 Sep 2026 (Tasmania ramping) — https://www.abc.net.au/news/2026-09-17/17000-triple-zero-calls-told-no-ambulance-available/107163578

**AI triage safety and regulation**
- JCM, 14 Feb 2026, DOI 10.3390/jcm15041512 (39,375 ED cases, 7 LLMs)
- J Pediatr Nurs, 10 Jun 2026, DOI 10.1016/j.pedn.2026.06.004 (nurses vs AI, paediatric)
- PLOS One, 4 Jun 2026, DOI 10.1371/journal.pone.0350770 (74,170 paediatric encounters)
- IJMI, 29 Aug 2026, DOI 10.1016/j.ijmedinf.2026.106687 (OpenEvidence under-triage)
- Clin Exp Emerg Med, 27 Jul 2026, DOI 10.15441/ceem.26.283 (LLM triage scoping review)
- ACEP consensus statement, 18 Mar 2026 — https://www.acep.org/news/acep-newsroom-articles/3-18-26-leading-em-organizations-issue-consensus-statement-on-artificial-intelligence-in-em
- ACEP EM Informatics, 22 May 2026 — https://www.acep.org/informatics/newsroom/may-2026/the-em-physicians-ai-stack
- AMA augmented intelligence — https://www.ama-assn.org/practice-management/digital-health/augmented-intelligence-medicine
- FDA 6 Jan 2026 CDS guidance (via commentary) — https://kevinmd.com/2026/01/fda-loosens-ai-oversight-what-clinicians-need-to-know-about-the-2026-guidance.html
- FDA primary document — https://www.fda.gov/media/109618/download *(not yet retrieved)*

**AI documentation in the ED**
- IJMI 220:106584, 2 Jul 2026, DOI 10.1016/j.ijmedinf.2026.106584 (1.03M ED encounters, Spain)
- Ann Emerg Med 87(5):569–574, May 2026, DOI 10.1016/j.annemergmed.2025.12.017
- JMIR AI 5:e92193, 2 Jul 2026, DOI 10.2196/92193 (−72.6 sec/encounter)
- Ann Emerg Med, 11 Jun 2026, DOI 10.1016/j.annemergmed.2026.04.022 (MGB 198,178 encounters)
- Emerg Med Australas 38(3):e70272, Jun 2026, DOI 10.1111/1742-6723.70272 (Melbourne, 7.1h saved)
- Can J Emerg Med 28(5):431–437, May 2026, DOI 10.1007/s43678-026-01141-2 (Ottawa, 39%)
- J Emerg Med 88:235–243, Sep 2026, DOI 10.1016/j.jemermed.2026.05.043 (scoping review)
- JMIR Form Res 10:e80401, 3 Mar 2026 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12996897/ (trust gap)
- Ann Intern Med, 17 Apr 2026, DOI 10.7326/annals-25-02772 (vendor-neutral note quality)
- JMIR 27:e64993, 27 Jan 2025 — https://pmc.ncbi.nlm.nih.gov/articles/PMC11811668/ (omission errors)
- The Guardian / Healthwatch England, 31 Aug 2026 — https://www.theguardian.com/society/2026/aug/31/doctors-ai-scribes-get-names-of-drugs-and-diagnoses-wrong-nhs-watchdog-warns
- ABC News Australia, 14 Aug 2026 — https://www.abc.net.au/news/2026-08-14/ai-medical-scribe-error-leaves-patient-devastated/107031672
- JAMA Netw Open 9(5):e2615762, 29 May 2026 (Providence) — https://pmc.ncbi.nlm.nih.gov/articles/PMC13221680/
- Acad Med 101(3):312–318, Mar 2026, DOI 10.1093/acamed/wvaf092 (pajama time, burnout OR 1.61)
- Am J Nurs 126(8):48–51, Aug 2026, DOI 10.1097/ajn.0000000000000349 (nurse documentation)
- J Adv Nurs 82(1):907–912, Jan 2026 issue, DOI 10.1111/jan.16911
- CMA/CFIB, Jan 2026, n=1,924 — https://digitallibrary.cma.ca/media/Digital_Library_PDF/2026%20Losing%20doctors%20to%20desk%20work%20EN.pdf
- Black Book Research, Nurse Documentation and AI Readiness Gap, 7 May 2026 *(vendor-sponsored)* — https://www.accessnewswire.com/newsroom/en/healthcare-and-pharmaceutical/nurses-week-report-ai-documentation-must-reduce-charting-burden-not-a-1164285

**Handover and information loss**
- Int Emerg Nurs, 15 Dec 2025, DOI 10.1016/j.ienj.2025.101735 (83 handovers observed)
- Cureus, 20 May 2026, DOI 10.7759/cureus.109294 (ED→inpatient)
- JACEP Open, 9 Jan 2025, DOI 10.1016/j.acepjo.2024.100011 (COPTER / ISOBAR)
- JACEP Open, 6 Dec 2025, DOI 10.1016/j.acepjo.2025.100300 (COPTER-PED)
- BMC Emerg Med, 27 Jan 2026, DOI 10.1186/s12873-026-01480-4
- J Pharm Bioallied Sci, 12 Jan 2026, DOI 10.4103/jpbs.jpbs_1501_25 (AI handover RCT)
- Pediatr Qual Saf, Jan 2026, DOI 10.1097/pq9.0000000000000870 (I-PASS QI)
- J Clin Nurs 35(9):3942–3958, Sep 2026, DOI 10.1111/jocn.70368 (triage nurse task analysis)

**Market and capital**
- Fierce Healthcare, 22 Sep 2026 (Heidi $340M) — https://www.fiercehealthcare.com/ai-and-machine-learning/heidi-lands-340m-build-ai-care-partner-clinicians
- SNS Insider / GlobeNewswire, 3–4 May 2026 (market size) — https://www.globenewswire.com/news-release/2026/05/04/3286388/0/en/ambient-clinical-intelligence-market-size-projected-to-reach-usd-56-61-billion-by-2035-sns-insider.html
- Nextgov/FCW, 14 Sep 2026 (VA ambient scribes) — https://nextgov.com/artificial-intelligence/2026/09/va-gradually-expand-medical-ai-scribe-following-successful-pilots/415971
- STAT, 29 Jul 2025 (Ambience $243M) — https://www.statnews.com/2025/07/29/ambience-healthcare-ai-scribe-new-fundraise/
