# 02 — Competitive landscape

Sources are public pages read for this package. If a capability is absent from those pages, it is **not verified**, not "they cannot do it". Vendor performance numbers stay vendor-reported. No prices are stated, because none were verified as current public list prices we should repeat.

ERgency does not win by having a better language model. It wins only if triage nurses prefer a provenance brief to the tools they already have. That preference is unvalidated.

## Positioning

```text
                        Assigns or recommends acuity
                        ↑
        KATE            |         TriageGO
        ERTRIAGE        |         (risk-based level)
                        |
   scribe / note  ←-----+-----→  information before the decision
                        |
        Heidi           |         ERgency
        generic scribes |         (no acuity, provenance,
        Epic (ED EHR)   |          gaps, clinician approval)
                        |
                        ↓
                        Does not assign acuity
```

ERgency sits in the bottom-right cell on purpose. Moving up that axis (a suggested ATS, a risk score, a ranked queue) is out of scope.

## Matrix

| Product | Public job | Assigns acuity? | Provenance of each utterance? | NZ ED presence we could verify | What we must not claim |
| --- | --- | --- | --- | --- | --- |
| **ERgency** | Triage evidence brief before the nurse decides | No. Empty clinician control only | Yes. That is the product | None. Hackathon only | Any clinical outcome |
| **Heidi** | Ambient scribe / "AI care partner": transcript, note, letters, templates | Not described as an ATS assigner on the pages read | "Evidence" is marketed for citation-backed support. Per-statement EXPLICIT/NEGATED triage provenance was **not verified** | Vendor says a Health NZ ED rollout, 1,000 + 100 licences, NAIAEAG endorsement. HiNZ covered it | That we saw a Head-to-head study |
| **CareFlow Ambient AI Emergency Care** (System C) | UK EPR-embedded ambient capture into triage and clerking forms, ECDS, discharge | Not verified as ATS. It completes configured forms | "Contemporaneous record" claimed. Field-level epistemic status **not verified** | No NZ deployment found | That it is live in NZ |
| **KATE (Mednition)** | Real-time triage decision support for ED nurses; ESI accuracy, high-risk alerts, sepsis | Yes. It notifies on under/over-triage and recommends ESI-oriented guidance | Uses EHR including free text. Utterance provenance **not verified** | No NZ page found | Their accuracy percentages as our benchmarks |
| **TriageGO** (Beckman Coulter; acquired StoCastic, Oct 2022) | EHR-embedded risk model recommending a 1–5 severity level from arrival data | Yes. Recommends a level. Nurse decides | Explanations of model logic are described. Conversation provenance **not verified** | No NZ page found | US time-savings as NZ facts |
| **Mediktor** | Patient-facing symptom assessment and care navigation | Digital triage / level-of-care guidance is the marketed job | **Not verified** | No NZ ED embedded-triage page found | That it is a nurse copilot |
| **Epic** | Enterprise EHR. Emergency workflows exist in Epic's hospital suite | The EHR stores the triage category a clinician enters. An Epic AI that assigns ATS was **not verified** on an Epic product page in this pass | Standard chart audit, not this brief's model | Used by some health systems internationally. NZ ED share **not verified** | A feature list we did not open |
| **Generic ambient scribes** (category: Nuance DAX, Abridge, Nabla, and others) | Draft the clinical note from audio | Generally no | Some show a transcript. Triage epistemic labels **not verified** as a class | Do not assert NZ ED share | That "scribes" are one product |
| **ERTRIAGE (CAREPOI)** | Device-based AI triage and decision support | Vendor claims real-time triage classification and risk stratification | Vendor claims explainability. Independent evaluation **not retrieved** | Greek company pages. No NZ use found | Their "98%" / "97%" accuracy lines. They are marketing |

## Notes by competitor

### Heidi

Pages: [NZ ED rollout blog](https://www.heidihealth.com/en-nz/blog/nz-ed-roll-out), [medical scribe software](https://www.heidihealth.com/en-nz/solutions/medical-scribe-software), Hendrix Health's partner page, Best Practice integration page.

Public capabilities we are willing to repeat: listens to a visit, drafts notes in the clinician's template, many languages (the scribe page says 110+; the Best Practice page says a higher document-language count — do not reconcile by guessing), clinician review before sign-off, template library, EHR connectivity on higher plans, regional data residency claimed, NZ English and te reo Māori mentioned on the partner page. An "Evidence" feature is described by the partner page as citation-backed support. We did **not** verify that Evidence performs gap detection for ATS triage or separates NEGATED from EXPLICIT.

Hawke's Bay time figures are **vendor-reported**.

Wedge sentence, allowed: "Heidi writes the note. ERgency shows whether the triage story is complete, and who changed it, before anyone relies on it."

### CareFlow Ambient AI Emergency Care

Pages: [System C Ambient AI](https://www.systemc.com/ai-at-system-c/careflow-ambient-ai/) and the [emergency care factsheet landing page](https://www.systemc.com/product-resources/careflow-ambient-ai-emergency-care-factsheet/). The PDF itself was not downloaded.

Willing to repeat: embedded in CareFlow EPR; captures the bedside conversation; generates structured assessment content; completes organisation-configured triage and clerking forms; discharge summaries; ECDS fields verified by the clinician; writes into CareFlow. UK-oriented (MESH, ECDS). Not an NZ product.

Closest conceptual neighbour, because it mentions triage forms rather than only a prose note. Still a documentation writer inside one EPR. ERgency's difference is the epistemic model and the refusal to score acuity. Unverified: whether CareFlow already shows contradictions and negations as first-class fields.

### KATE / Mednition

Pages: [KATE overview](https://mednition.com/kate-artificial-intelligence-designed-for-clinicians-by-clinicians/), [products](https://mednition.com/products/), [2019 introduction](https://mednition.com/mednition-introduces-kate/).

Willing to repeat: marketed as real-time decision support for emergency nurses; reads EHR including free text; flags possible under- and over-triage; sepsis and other high-risk presentations are part of the product line; nurse remains in the loop on the pages read. ESI, not ATS. US-centric.

This is the opposite product decision. KATE exists to influence the acuity decision. ERgency refuses that influence. Do not cite Mednition's study percentages in the pitch; the 2019 release said findings were in peer review, and we did not retrieve the paper.

### TriageGO

Pages: [Beckman Coulter acquisition release, 11 Oct 2022](https://news.beckmancoulter.com/2022-10-11-Beckman-Coulter-Acquires-Artificial-Intelligence-Company-Providing-Evidence-Based-Clinical-Decision-Support-for-Emergency-Departments), [Johns Hopkins Medicine](https://www.hopkinsmedicine.org/news/articles/2022/11/tool-developed-to-assist-with-triage-in-the-emergency-department), Beckman Coulter product PDFs surfaced in search.

Willing to repeat: machine-learning recommendation of a five-level acuity from arrival variables (age, sex, vitals, chief complaint, arrival mode, comorbidities are described in the Annals abstract's public record); embedded in the EHR; nurse can disagree; originally StoCastic / Johns Hopkins, acquired by Beckman Coulter. It recommends a level. ERgency will not.

Time savings in the press release (door-to-decision, ICU, surgery) are **vendor-reported**.

### Mediktor

Public positioning from the company description: a white-label, patient-facing AI assistant for symptom assessment and routing to a level of care, used by payers, hospitals, and telehealth. It is pre-arrival navigation, not a nurse's evidence brief. We did not complete a line-by-line review of mediktor.com feature claims. Say "patient-facing digital triage" and stop.

### Epic and the emergency EHR

Epic is the system of record in many hospitals. Triage categories, vitals, and nursing assessments already have fields. ERgency's production future is export or side-by-side use, not a replacement EHR. Exact Epic ASAP or ambient-AI feature names were **not verified** against a current Epic page in this pass. Do not list them.

### Generic ambient scribes

The category risk is real: SaaSathon's own docs call "another AI meeting recorder" a weak fit. If the demo audio-transcribes and shows a pretty note, judges will hear "Heidi". The demo script forbids that shape.

### ERTRIAGE by CAREPOI

Pages: [carepoi.com/ertriage](https://carepoi.com/ertriage/), [ertriage.com](https://ertriage.com/).

Vendor describes a device (DH-600 and a clinical stand), vital signs, protocol bundles (ESI, NEWS, PEWS, HEART, ROSIER are named on the marketing pages), and a triage classification with claimed accuracy "98%" on one page and about "97%" on another. Those percentages are **not independent** and disagree with each other across their own pages. Treat them as unverified marketing.

Naming: our repo is `er-triage` and `PRODUCT_GOAL.md` says "ER Triage". The pitched name is **ERgency** so a judge who searches ERTRIAGE does not land on CAREPOI and so we do not sit next to a trademark. See ADR-001.

## What "compatible with the scribe" means

MVP: the nurse can paste text that a scribe, a typist, or a colleague already produced. ERgency does not call Heidi's API. There is no integration to build.

Post-hackathon: a "bring your own transcript" import remains the contract. A Heidi or EHR integration is a partnership, not a weekend ticket.

## Competitive risks to say out loud

1. Heidi's distribution inside Health NZ EDs may make any new front-door tool look like duplication.
2. If nurses trust the scribe note, a second screen loses.
3. KATE and TriageGO have the budget and the clinical claim we are refusing. A buyer who wants automated acuity will not buy ERgency. That is acceptable. Say so in Q&A.
