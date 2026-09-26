# 16 — Privacy, governance, and regulatory context

> **Implementation update — 26 September 2026:** The primary tablet uses a live Realtime voice session: microphone audio is processed by the provider to transcribe and speak questions back, while the app itself records no audio and stores only text the person confirms. The written form remains available. This does not settle consent, provider processing, HIPC, retention, overseas transfer, or governance questions for a real deployment; the build remains fictional-data-only.

This chapter is not legal advice. It does not classify ERgency as a medical device or as not a medical device. It records what public sources say and what a specialist must confirm before any real health information is processed. Classifications use three labels:

- **KNOWN** — a public instrument or official page states this, and the sentence is limited to that.
- **LIKELY** — a reasonable reading for planning. Not a determination.
- **REQUIRES SPECIALIST CONFIRMATION** — do not assert it in a pitch as fact.

The MVP processes fictional data only. Fictional data can still be personal information if it is about an identifiable real person. The seed names are invented. The team must not "anonymise" a real case into the demo.

## Privacy Act 2020

**KNOWN:** The Privacy Act 2020 is New Zealand's general framework for privacy of information about individuals. It establishes information privacy principles and the Privacy Commissioner. The Ministry of Health summarises that scope on its [data protection and privacy](https://www.health.govt.nz/monitoring-statistics/access-and-use/data-protection-and-privacy) page.

**REQUIRES SPECIALIST CONFIRMATION:** how the principles apply to a vendor processing emergency-department audio or text for a health agency, including cross-border disclosure and cloud subprocessors.

**KNOWN (narrow):** The Privacy Commissioner has amended codes to reflect a new Information Privacy Principle 3A, with material on the OPC site dated around March 2026. Whether IPP3A changes the notice a hospital must give patients about this kind of tool is **REQUIRES SPECIALIST CONFIRMATION**. Do not brief judges on IPP3A from memory.

## Health Information Privacy Code 2020

**KNOWN:** The HIPC is a code of practice under the Privacy Act. The Office of the Privacy Commissioner says it covers health information about identifiable individuals that is collected, used, held, and disclosed by health agencies, and that it stands in place of the IPPs for that sector. It applies to agencies providing health or disability services and to some agencies in the sector that are not direct care providers. Source: [OPC, Health Information Privacy Code 2020](https://www.privacy.org.nz/privacy-principles/codes-of-practice/hipc2020/).

**KNOWN:** Amendment No 1 (2022) updated the code for the disestablishment of district health boards and related names, including Health New Zealand. Amendment No 2 (March 2026) is described by OPC as reflecting IPP3A. Read the current code before any pilot. This package does not reproduce the rules.

**LIKELY:** a production deployment inside a public hospital that handles identifiable clinical conversations would be argued under the HIPC rather than only the bare IPPs. **REQUIRES SPECIALIST CONFIRMATION.**

**MVP implication:** do not collect identifiable health information. The banner is a product control, not a legal basis.

## Health NZ AI governance

**KNOWN:** Health New Zealand describes the National Artificial Intelligence and Algorithm Expert Advisory Group (NAIAEAG) as guiding and endorsing AI projects and research involving Health NZ, including advice on appropriateness, safety, effectiveness, ethics, and legality, with endorsement going to decision bodies. Source: [Health NZ, NAIAEAG](https://www.healthnz.govt.nz/about-us/who-we-are/expert-groups-and-networks/expert-groups/artificial-intelligence-and-algorithm-expert-advisory-group).

**KNOWN:** Health NZ announced a New Zealand AI Pre-Implementation Evaluation Framework, endorsed by the Health NZ Board as the methodology NAIAEAG will use, and said there is no specific AI legislation in this setting. Source: [Health NZ news](https://www.healthnz.govt.nz/news-and-updates/consistent-approach-to-ai-tools-backed-by-new-national-framework).

**KNOWN:** Heidi's vendor blog says NAIAEAG endorsed Heidi's scribe after privacy, cybersecurity, and data-sovereignty review. That is **vendor-reported** endorsement of a different product. It is not an endorsement of ERgency, and it is not a shortcut through governance.

**REQUIRES SPECIALIST CONFIRMATION:** whether a provenance brief that refuses to assign ATS would be reviewed as an administrative documentation aid, a clinical decision support tool, or something else, and what evidence NAIAEAG would require.

## Transparency, minimisation, security, retention, overseas processing

| Topic | MVP behaviour | Production classification |
| --- | --- | --- |
| Transparency | On-screen disclaimer of what the tool does not do | **REQUIRES SPECIALIST CONFIRMATION** what patients and staff must be told |
| Data minimisation | One conversation, no NHI, no full record | **LIKELY** a relevant principle; the minimum set for a real pilot is not decided here |
| Security | RLS, secrets, no service role in the client | A health-system security review is **REQUIRES SPECIALIST CONFIRMATION** and was not done |
| Retention | Demo data lives until the team deletes the project. No clinical retention schedule | **REQUIRES SPECIALIST CONFIRMATION** |
| Overseas processing | Model API may process text and the live voice provider may process audio outside New Zealand. Unknown for the event key without reading the account | **REQUIRES SPECIALIST CONFIRMATION** before PHI. Do not promise on-shore processing this weekend |
| Clinician accountability | The nurse approves. The software does not become the decision-maker | **LIKELY** consistent with how scribes are being introduced, but accountability arrangements are a local clinical governance question |
| Audit | Append-only events | Whether that audit meets a health-agency record standard is **REQUIRES SPECIALIST CONFIRMATION** |
| Māori data governance | Not designed with Māori partnership in this package | **REQUIRES SPECIALIST CONFIRMATION** and a real relationship, not a checkbox. NAIAEAG's public terms include Māori data sovereignty in its scope |

## Clinical safety and device questions

**KNOWN:** There is no single NZ "AI Act" that Health NZ's own news item relies on; they say the framework exists in a setting without specific AI legislation.

**REQUIRES SPECIALIST CONFIRMATION:**

- Whether any configuration of ERgency is a medical device or software as a medical device under the law that applies at the time of a pilot.
- The status of the Therapeutic Products regime versus the Medicines Act for software. This package does not state a classification, because getting it wrong in a pitch is worse than saying it is open.
- Whether "we do not assign ATS" is sufficient to keep an intended purpose outside decision support. Intended purpose is judged on what the product does and how it is promoted, not only on a disclaimer. Marketing "items warranting attention" as risk detection could pull the purpose toward decision support. The copy rules in [06-ux-specification.md](06-ux-specification.md) exist partly for that reason. They are not a legal conclusion.

Do not tell judges "this is not a medical device" as a fact. Say: "We have kept the intended behaviour away from diagnosis and acuity assignment, and a specialist has not classified it."

## What the team may say

- We did not use real patient information.
- A clinician remains the decision-maker in the product design.
- We have not completed privacy, clinical safety, or device review.
- Public hospitals already have a path for AI tools, and Heidi's rollout shows that path is real and slow. We have not entered it.

## What the team must not say

- That the HIPC "allows" the demo or a pilot.
- That NAIAEAG would endorse this design.
- That on-screen consent in a waiting room is solved.
- That synthetic data makes a later model "clinically validated".
