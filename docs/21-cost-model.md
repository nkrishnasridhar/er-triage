# 21 — Cost model

No competitor prices are listed. None were verified as current public list prices safe to repeat. Heidi's site mentions a free trial and paid practice plans without a number we should freeze in this document. Hospital contracts are unpublished. Do not invent a $ per ED.

Figures below are formulas. Plug in the invoice you actually see. Event credits are described by SaaSathon as $100 Codex and $50 OpenAI API credits per participant, provided by OpenAI. That is an event-doc statement, not a balance we queried.

## Hackathon (this weekend)

```text
weekend_cost ≈ vercel_free + supabase_free + model_tokens - event_credits
```

| Term | Treatment |
| --- | --- |
| `vercel_free` | $0 if the team stays on the hobby/free tier the event points at. Confirm in the dashboard. Do not add paid add-ons |
| `supabase_free` | $0 if the new project stays inside the free tier. A weekend of one demo user will. Do not turn on paid compute "to be safe" |
| `model_tokens` | `compose_calls × (input_tokens + output_tokens) × price_per_token` for the model in `OPENAI_MODEL`. Two calls per compose (extract and gaps), plus at most one repair |
| `event_credits` | $50 OpenAI API credits per participant, if the organisers have activated them. Codex credits are for coding, not a second production bill |

Worked **assumption**, labelled as assumption: 8 people × a handful of composes is noise next to $50 × team size. The cost risk is a runaway loop, not the demo. Cap repair at one and disable the button while in flight.

Do not budget a GPU, a second SaaS, or a transcription vendor. Audio is cut.

People cost is time, not a wage we know. The plan in [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md) is the constraint.

## Production hypothesis (not a quote)

```text
annual_cost ≈ hosting + database + model + support + insurance + implementation
model ≈ encounters_per_year × compose_rate × tokens_per_compose × price
encounters_per_year ≈ presentations_per_site × sites × attach_rate
```

| Input | Status |
| --- | --- |
| `presentations_per_site` | Unknown. Do not use 1.47 million as a national denominator for a price. That national figure is unverified, and a product would not be used on every presentation on day one |
| `attach_rate` | Hypothesis: only triage conversations where the nurse opens ERgency. Unvalidated. Could be a small fraction of presentations |
| `tokens_per_compose` | Measure on the demo fixtures. A 1,500-character transcript is the planning size |
| `price` | Read from the provider on the day. Write it down then. Not here |
| `hosting` and `database` | One app and one Postgres. Revisit only if a contract requires a region or a dedicated instance. That step-change dominates the token bill and is **unknown** |
| `support` | Clinical-hours support is a real cost if a hospital expects it. Unscoped |
| `insurance` and legal review | **Requires specialist confirmation.** Do not put $0 |
| Implementation | Training the triage group. Hypothesis: days, not a systems-integration programme, if paste remains the interface |

## Unit cost the team can compute on Sunday

After ten hosted composes, read the provider usage screen:

```text
cost_per_compose = total_usage_dollars / successful_composes
```

Put that number in the speaker notes if it is real. If usage is covered by credits and the screen shows tokens only, report tokens, not a fabricated dollar conversion.

## What would make production expensive

- Audio storage and a speech vendor on every presentation.
- A per-site FHIR integration project.
- On-prem model hosting.
- 24/7 clinical helpdesk.

Those are not in the MVP, which is why the MVP can be demonstrated inside event credits.

## ROI

There is no ROI claim. Heidi's vendor-reported minute savings belong to a scribe, not to this product, and they are not transferable. A buyer who asks "how many minutes?" gets the validation plan, not a number.
