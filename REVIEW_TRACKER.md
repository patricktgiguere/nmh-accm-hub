# Clinical review tracker

Generated from the case files on 2026-10-26. Every case is `draft` until its checklist is cleared and its status set to `released` (admin page or index.json). Regenerate this file after edits with `python3 tools/build_review_tracker.py`.
Total checklist items across 11 cases: 182.

## Day 3 on VA ECMO: a falling saturation
File: `public/content/cases/va-ecmo-day-3.json`  ·  Topic: North-South syndrome: differential hypoxemia on peripheral VA ECMO

Flags in text: 1 VERIFY, 5 NMH protocol inserts, 25 REVIEW. References: 8 total, 5 unconfirmed.

References to confirm:
- Lorusso R, Shekar K, MacLaren G, et al. ELSO Interim Guidelines for Venoarterial Extracorporeal Membrane Oxygenation in Adult Cardiac Patients. ASAIO J. 2021;67(8):827-844. (I am confident this guideline exists. Confirm volume, pages, and DOI, and confirm it contains the right radial monitoring recommendation attributed to it.)
- Stevens MC, Callaghan FM, Forrest P, Bannon PG, Grieve SM. A computational framework for adjusting flow during peripheral extracorporeal membrane oxygenation to reduce differential hypoxia. J Cardiovasc Transl Res (or J Biomech). 2021. (A computational study of coronary versus cerebral hypoxia in North-South syndrome appeared in a 2021 Springer journal (doi:10.1007/s12265-021-10110-2 surfaced in search). Author list and exact title must be confirmed before citing.)
- Hoeper MM, Tudorache I, Kühn C, et al. Extracorporeal membrane oxygenation watershed. Circulation. 2014;130:864-865. (Classic imaging description of the watershed. Citation from memory.)
- Combes A, Price S, Slutsky AS, Brodie D. Temporary circulatory support for cardiogenic shock. Lancet. 2020;396:199-212. (Overview of configurations including VAV. Citation from memory.)
- Rao P, Khalpey Z, Smith R, Burkhoff D, Kociol RD. Venoarterial extracorporeal membrane oxygenation for cardiogenic shock and cardiac arrest: cardinal considerations for initiation and management. Circ Heart Fail. 2018;11:e004905. (Review covering monitoring and differential hypoxemia. Citation from memory.)

Checklist:
- [ ] Stage 1 vignette: cannula configuration, inotrope status, ventilator description, and pulse oximetry values are synthetic and marked [REVIEW]. Confirm they are internally consistent with NMH practice.
- [ ] Stage 1 model answer: the statement that ELSO recommends right radial arterial access on peripheral VA ECMO. Confirm against the Lorusso 2021 ELSO guideline text.
- [ ] Stage 1 model answer: bilateral cerebral NIRS as standard monitoring. Supported by Rosenberg 2025 but confirm you agree with how it is framed (trend, not threshold).
- [ ] Stage 1 SBA explanation: the claim that modeling shows coronary hypoxia precedes cerebral hypoxia. Confirm the Stevens (or correct author) 2021 paper says this.
- [ ] Stage 2 blood gas and NIRS values are invented. Confirm the right radial PaO2 of 52 on FiO2 0.5 and post-oxygenator PaO2 above 400 are the illustrative numbers you want.
- [ ] Stage 3 SBA: the claim that ECPELLA can worsen differential hypoxemia. Rosenberg 2025 describes North-South physiology in ECPELLA. Confirm you endorse the mechanistic framing and whether you want it softened.
- [ ] Stage 3 SBA explanation and controversies: the management sequence (lungs, then VAV, then proximal arterial return). Insert NMH's actual escalation pathway where marked.
- [ ] Stage 3 model answer: VAV configuration description (IJ return cannula, Y-connector, restrictor, per-limb flow probes). Confirm this matches NMH equipment and perfusion practice.
- [ ] Stage 3 model answer: anticoagulation targets and flow split left as [NMH protocol, insert].
- [ ] Stage 4: the complication narrative and interpretation are expert reasoning, not guideline. Mark as such or edit.
- [ ] Controversies section: all four items are stated as unsettled. Confirm you agree and that no item is actually settled at NMH.
- [ ] References marked VERIFY: Lorusso 2021, Stevens 2021 (author list uncertain), Hoeper 2014, Combes 2020, Rao 2018. Confirm each exists with the stated details before release.
- [ ] No numeric thresholds for saturation, NIRS, flow, or anticoagulation were asserted as recommendations. If you add any, source them.

## Suction alarms at 03:10
File: `public/content/cases/device-alarms-0310.json`  ·  Topic: Impella positioning, hemolysis, and unmasked RV failure

Flags in text: 10 VERIFY, 13 NMH protocol inserts, 15 REVIEW. References: 8 total, 6 unconfirmed.

References to confirm:
- Abiomed. Impella CP with SmartAssist Instructions for Use and Clinical Reference Manual. Current version as supplied with devices at NMH. (Faculty should attach the current IFU edition and confirm the placement signal and motor current interpretations, target inlet depth, and suction alarm guidance quoted in this case against it. [NMH protocol, insert])
- Møller JE, Engstrøm T, Jensen LO, et al. Microaxial flow pump or standard care in infarct-related cardiogenic shock (DanGer Shock). N Engl J Med. 2024;390:1382-1393. (I am confident this trial and citation exist. Confirm pages and DOI.)
- Thiele H, Zeymer U, Akin I, et al. Extracorporeal life support in infarct-related cardiogenic shock (ECLS-SHOCK). N Engl J Med. 2023;389:1286-1297. (I am confident this trial exists. Confirm pages and DOI.)
- Crowley J, Cronin B, Essandoh M, D'Alessandro D, Shelton K, Dalia AA. Transesophageal echocardiography for Impella placement and management. J Cardiothorac Vasc Anesth. 2019;33:2663-2668. (Citation from memory, including author order. Confirm before release.)
- Geller BJ, Sinha SS, Kapur NK, et al. Escalating and de-escalating temporary mechanical circulatory support in cardiogenic shock: a scientific statement from the American Heart Association. Circulation. 2022;146:e50-e68. (Citation from memory. Confirm pages.)
- Balthazar T, Vandenbriele C, Verbrugge FH, et al. Managing patients with short-term mechanical circulatory support: JACC review topic of the week. J Am Coll Cardiol. 2021;77:1243-1256. (Citation from memory. Confirm.)

Checklist:
- [ ] All vignette values (performance level descriptions, lab trends, hemodynamics) are synthetic and intentionally non-numeric where a number would imply a threshold. Confirm you want them left qualitative or supply NMH-sourced numbers.
- [ ] Stage 1 model answer and SBA: every statement about placement signal, motor current, console alarms, and target inlet depth must be checked against the current Abiomed IFU for the CP (and 5.5 if you want it included). Sensor behavior differs between device generations.
- [ ] Stage 1 model answer: the Crowley 2019 TEE reference, author order, and journal details.
- [ ] Stage 1 model answer: purge and systemic anticoagulation left as [NMH protocol, insert].
- [ ] Stage 2 model answer: the statement that the IFU suggests volume and performance-level reduction as first responses to suction alarms. Confirm wording against the IFU.
- [ ] Stage 2 and 3: who repositions, where, and when the structural or surgical team is called. All left as [NMH protocol, insert].
- [ ] Stage 3 model answer: the mechanistic account of RV failure after LV unloading. This is expert reasoning drawn from reviews, not a guideline statement. Edit to your satisfaction.
- [ ] Stage 3 model answer: the escalation options and the framing attributed to the 2022 AHA statement and EAPCI/ACVC consensus. Confirm those documents say what is attributed.
- [ ] Pitfalls: the claim that purge failure can disable the motor. Confirm against the IFU and reword if too strong.
- [ ] Controversies: the DanGer Shock and ECLS-SHOCK summaries. Confirm the inclusion criteria and the complication findings are stated accurately.
- [ ] References marked VERIFY: Abiomed IFU edition, DanGer Shock, ECLS-SHOCK, Crowley 2019, Geller 2022, Balthazar 2021.
- [ ] No LDH, plasma free hemoglobin, performance level, or inlet depth numbers were asserted. If you add any, source them to the IFU or NMH protocol.

## Breathless on awake VA ECMO
File: `public/content/cases/breathless-awake-ecmo.json`  ·  Topic: East-West (RIDDLER) syndrome: differential hypocapnia on awake peripheral VA ECMO

Flags in text: 0 VERIFY, 5 NMH protocol inserts, 24 REVIEW. References: 6 total, 0 unconfirmed.

Checklist:
- [ ] Framing: the case follows the Circulation paper's mechanism (differential decarboxylation driven by native hyperventilation and an iatrogenic sweep reduction). Your initial description emphasized lateral flow variation between brachiocephalic and left carotid. The case uses that anatomy as the substrate and the loop as the mechanism. Confirm this is the framing you want, and edit the 'Why East-West' passage in Stage 2 if not.
- [ ] All gas values are synthetic and set per Dr. Giguere's direction: right radial PaO2 normal for the inspired oxygen throughout the East-West phase (94 then 97 mmHg on 2 L), PaCO2 in the 25 to 30 range (29 then 25), respiratory rate high 20s rising to mid-30s, post-oxygenator PaCO2 61 and pH 7.24. The PaO2 stays normal throughout. Morning-after paired gases (right radial PaCO2 38, post-oxygenator 40) are synthetic. Confirm they are the illustrative numbers you want.
- [ ] Stage 1 vignette: Impella 5.5 via right axillary artery, extubation on day 4 for mobilization. Confirm this matches an NMH awake ECMO pathway or mark it explicitly as another center's practice.
- [ ] Stage 3 model answer: the 1:1 sweep-to-flow starting point is attributed to Rosenberg 2025 and labeled expert opinion. Confirm you want it included at all, and insert NMH's sweep titration practice.
- [ ] Stage 3 model answer: the statement that end-tidal CO2 is unhelpful here is my reasoning, not from the paper. Confirm or delete.
- [ ] Stage 4 is now the recovery day: paired gases, a mobilization plan, and a counterfactual contrast with North-South posed as a thought experiment. The earlier draft introduced aspiration to force the contrast and was removed at Dr. Giguere's direction because her lungs are normal throughout. Confirm the mobilization plan matches NMH awake ECMO practice.
- [ ] Controversies: the vertebrobasilar point (respiratory centers supplied via subclavians rather than the left carotid) is my anatomical observation, not from any cited source. Decide whether to keep, soften, or remove it.
- [ ] Controversies: the characterization of the syndrome as newly named, single-source, and without a series is accurate as of October 2026 to my knowledge. Re-check the literature before release in case a series has since appeared.
- [ ] Reference list: all six entries were confirmed this session, five via the Rosenberg 2025 reference list and one via the AACN site. None are marked VERIFY. Confirm you are satisfied with that provenance.
- [ ] No sweep, flow, or gas targets are asserted as recommendations. If you add any, source them.

## A right ventricle that will not cooperate
File: `public/content/cases/rv-after-lvad-implant.json`  ·  Topic: Dual-lumen RA-to-PA cannula (ProtekDuo) for RV support after LVAD, and its use as a single-cannula VV configuration

Flags in text: 7 VERIFY, 12 NMH protocol inserts, 31 REVIEW. References: 9 total, 1 unconfirmed.

References to confirm:
- LivaNova. ProtekDuo (and ProtekDuo+) dual-lumen cannula Instructions for Use. Current version as supplied at NMH. (The LivaNova product page confirms 29 Fr and 31 Fr sizes and right IJ insertion. Flow ranges, positioning criteria, PA tip position, and the indication language (the US page describes VV ECMO and does not list RV support as a labeled indication) must be checked against the IFU edition in use. [NMH protocol, insert])

Checklist:
- [ ] Stage 1 vignette: INTERMACS profile, preoperative hemodynamics, intraoperative management, and all overnight trends are synthetic and qualitative. Confirm internal consistency with NMH implant practice.
- [ ] Stage 1 model answer: the three-part RV-LVAD interaction (preload, septal contribution, transient PVR rise) is drawn from reviews, not a guideline. Edit to your satisfaction.
- [ ] Stage 1 model answer: the claim that raising speed worsens septal shift and RV geometry. Confirm you endorse the mechanistic framing.
- [ ] Stage 1 SBA: pulsatility index as the earliest LVAD-side signal. This is expert reasoning. Confirm against the Abbott HeartMate 3 documentation and your own practice. The statement that flow is an estimate is from Abbott's pump parameters document and is marked [VERIFY].
- [ ] Stage 2 model answer: cannula sizes (29 and 31 Fr), right IJ insertion, flows up to roughly 4 L/min, and fluoroscopy plus TEE positioning. Sizes confirmed from the LivaNova page, flows from the Oliveros series. All marked [VERIFY] against the IFU per the brief.
- [ ] Stage 2 model answer: the Coromilas 2019 finding that percutaneous RVAD after LVAD was feasible with outcomes comparable to surgical RVAD. Confirm the abstract supports that summary.
- [ ] Stage 2 model answer: the physiologic argument against VA ECMO with an LVAD in place (outflow graft competition, loss of antegrade pulmonary flow, LV and root stasis). This is reasoning, not evidence. Confirm or soften.
- [ ] Stage 2: who places the cannula and the escalation pathway are left as [NMH protocol, insert].
- [ ] Stage 3 model answer: the recirculation claim (two valves between drainage and return) is attributed to Capoccia 2024 and Maybauer 2023. Confirm. The statement that pre-oxygenator saturation is a trustworthy mixed venous value on this circuit is my inference from that claim.
- [ ] Stage 3 model answer: PA catheter placement alongside the cannula and the caution about tip position relative to the return jet. Confirm NMH practice.
- [ ] Stage 3 model answer: the RV rest controversy is framed as unsettled. Confirm you agree.
- [ ] Stage 4 model answer: the weaning structure (flow reduction increments, hold times on the order of ten to fifteen minutes, minimum flow for stasis) is a template with no consensus source. All specifics left as [NMH protocol, insert] and [VERIFY].
- [ ] Stage 4 model answer: the claim that the LVAD maintains MAP while the LV empties during a failing wean, so pump parameters and echo are the first signals. This is my reasoning. Confirm.
- [ ] Controversies: planned RVAD at implant and timing of RVAD are stated as unsettled with observational support only. Confirm.
- [ ] References: Coromilas 2019 lacks page numbers. Kapur 2017 lacks a DOI. The LivaNova IFU is marked VERIFY. All other references were confirmed this session by web search.
- [ ] No numeric thresholds for CVP, PA pressure, flow increments, inotrope dosing, or anticoagulation were asserted as recommendations. If you add any, source them.

## Low-flow alarms on a durable LVAD
File: `public/content/cases/lvad-low-flow-alarms.json`  ·  Topic: Suction (suck-down) events on a durable LVAD

Flags in text: 9 VERIFY, 9 NMH protocol inserts, 34 REVIEW. References: 9 total, 0 unconfirmed.

Checklist:
- [ ] Stage 1 vignette: implant indication, timing, medications, and the controller readings are synthetic and qualitative. Confirm consistency with NMH VAD program practice.
- [ ] Stage 1 model answer: every statement about HeartMate 3 parameters (flow as an estimate, PI range and PI event behavior, power behavior, low-flow alarm) is drawn from the Abbott clinician document and marked [VERIFY]. Confirm against the current IFU. Decide whether to state the low-flow alarm threshold at all.
- [ ] Stage 1 model answer: Doppler opening pressure as a MAP surrogate and the caveat about native pulsatility. This is standard teaching but confirm wording.
- [ ] Stage 1 model answer: the suction differential and the claim that GI bleeding is common because of acquired von Willebrand deficiency. Standard but unreferenced in this case. Add a citation or accept.
- [ ] Stage 2 model answer: speed reduction as the first move with a leftward septum and dilated RV, and the statement that speed changes are made on the system monitor by the VAD team. Confirm both against NMH practice and the IFU.
- [ ] Stage 2 model answer: the claim that inflow cannula contact with the septum triggers ventricular ectopy. Standard teaching, confirm.
- [ ] Stage 3 model answer: the AHA statement's framing of rate versus rhythm control, cardioversion safety and pad placement, and the suggestion of TEE for appendage and cannula thrombus. Confirm against the statement's text.
- [ ] Stage 3 model answer: amiodarone as the usual choice, avoidance of calcium channel blockers, digoxin as adjunct, and the caution about vasodilators. All marked [REVIEW] and agent choice left as [NMH protocol, insert].
- [ ] Stage 3 model answer: the statement that atrial fibrillation is associated with worse RV function and outcomes on LVAD. From observational series I did not cite individually. Add a source or soften.
- [ ] Stage 4 model answer: the MCS-ARC late RV failure definition is paraphrased. Confirm against Kormos 2020.
- [ ] Stage 4 model answer: the ramp study description and the statement that there is no outcomes trial for ramp-guided speed selection. Confirm.
- [ ] Stage 4 model answer: the options for late RV failure (PDE-5 inhibitor with observational evidence, home inotropes, temporary versus durable RVAD, transplant re-evaluation) and the statement that medical outcomes are poor. Expert reasoning drawn from Rame 2021 and reviews. Edit to your satisfaction.
- [ ] Controversies: the MAP target discussion. Insert NMH's target and decide whether the HeartMate 3 versus earlier device distinction is worth keeping.
- [ ] References: Cavalcante 2024 lacks volume, pages, and DOI. Gopinathannair 2019 volume and pages are from memory. Mehra 2019 pages are from memory. The Abbott low-flow threshold is marked VERIFY. All references were confirmed to exist this session by web search.
- [ ] No numeric MAP, speed, INR, flow threshold, or dose values were asserted as recommendations. If you add any, source them.

## The third shock this hour
File: `public/content/cases/third-shock-this-hour.json`  ·  Topic: Electrical storm (VT storm) in the cardiothoracic ICU

Flags in text: 7 VERIFY, 11 NMH protocol inserts, 53 REVIEW. References: 11 total, 2 unconfirmed.

References to confirm:
- Nademanee K, Taylor R, Bailey WE, Rieders DE, Kosar EM. Treating electrical storm: sympathetic blockade versus advanced cardiac life support-guided therapy. Circulation. 2000;102:742-747. (Citation from memory. The study exists and is widely cited as the foundational sympatholysis data. Confirm pages and DOI, and confirm the mortality figures before quoting any number.)
- Chatzidou S, Kontogiannis C, Tsilimigras DI, et al. Propranolol versus metoprolol for treatment of electrical storm in patients with implantable cardioverter-defibrillator. J Am Coll Cardiol. 2018;71:1897-1906. (Citation from memory. Confirm before release. Source for the non-selective versus selective beta blocker claim.)

Checklist:
- [ ] Stage 1 vignette: device history, ED interrogation findings, hemodynamics, labs, and the antibiotic are synthetic and marked [REVIEW]. Confirm they are internally consistent.
- [ ] Stage 1 model answer: the storm definition (three or more episodes in 24 hours, separated by five minutes) is attributed to the 2017 AHA/ACC/HRS and 2022 ESC guidelines from memory. Confirm the exact wording in each.
- [ ] Stage 1 model answer: magnet behavior (suspends tachytherapy, leaves pacing) is stated generically. Confirm it matches the device manufacturers in use at NMH and whether any device requires a different approach. [NMH protocol, insert]
- [ ] Stage 1 model answer: the potassium and magnesium targets are left qualitative. If you want numbers, source them.
- [ ] Stage 1 model answer and SBA: the sympatholysis evidence (Nademanee 2000, Chatzidou 2018) is cited from memory and marked VERIFY. Confirm the studies and their findings before release.
- [ ] Stage 1 model answer: all drug doses deliberately omitted. Insert NMH dosing for amiodarone, lidocaine, esmolol, propranolol, and procainamide and source each to the guideline tables. [VERIFY]
- [ ] Stage 2 model answer: the anesthetic agent discussion (propofol, dexmedetomidine, ketamine) is expert reasoning from case series, not guideline. Edit to NMH practice. [NMH protocol, insert]
- [ ] Stage 2 model answer: the device comparison (IABP, Impella, VA ECMO) and the commitment to VA ECMO are expert reasoning. Confirm you agree and insert NMH's default MCS strategy for storm.
- [ ] Stage 3 model answer: the ablation-on-ECMO plan (transport, inducibility, LV distension, anticoagulation ownership, access planning) is expert reasoning. Confirm it matches NMH EP lab and perfusion workflow.
- [ ] Stage 3 model answer: the STAR study figures (131 patients, more than 90% response, bolus plus infusion longer than bolus alone) were confirmed this session via the ACC journal scan. Confirm against the paper.
- [ ] Stage 3 model answer: the thoracic epidural statement (generally not acceptable on therapeutic heparin) is my reasoning. Confirm against NMH regional anesthesia and anticoagulation guidance.
- [ ] Stage 3 model answer: the Vaseghi 2017 claim that bilateral denervation outperformed left-only. Confirm against the paper.
- [ ] Stage 4 model answer: the weaning and ICD reprogramming plan is expert reasoning. Confirm with EP that the described storm programming and reversal match NMH practice.
- [ ] Stage 4 model answer: the statement that some centers take storm patients directly from ECMO to durable LVAD is expert opinion. Confirm you want it kept.
- [ ] Controversies: the PROCAMIO, PARTITA, and VANISH2 summaries. Confirm inclusion criteria and primary results are stated accurately.
- [ ] References marked VERIFY: Nademanee 2000, Chatzidou 2018. Partially verified (volume and pages from memory): VANISH2, PARTITA, PROCAMIO DOI. Confirm each before release.
- [ ] No numeric thresholds for electrolytes, drug doses, ECMO flow, or ACT were asserted as recommendations. If you add any, source them.

## Tearing chest pain and a wide mediastinum
File: `public/content/cases/chest-pain-wide-mediastinum.json`  ·  Topic: Acute aortic dissection: diagnosis, anti-impulse therapy, and perioperative critical care

Flags in text: 17 VERIFY, 15 NMH protocol inserts, 39 REVIEW. References: 8 total, 3 unconfirmed.

References to confirm:
- Isselbacher EM, Cigarroa JE, Eagle KA. Cardiac tamponade complicating proximal aortic dissection: is pericardiocentesis harmful? Circulation. 1994;90:2375-2378. (Citation from memory. The study is described in secondary sources confirmed this session (most drained patients died after the procedure) but the primary citation details were not confirmed.)
- Malaisrie SC, Szeto WY, Halas M, et al. 2021 The American Association for Thoracic Surgery expert consensus document: surgical treatment of acute type A aortic dissection. J Thorac Cardiovasc Surg. 2021;162:735-758.e2. (Existence of the document confirmed this session via CTSNet. Author list, volume, and pages from memory. Source for the arch extent and malperfusion framing.)
- Evangelista A, Isselbacher EM, Bossone E, et al. Insights from the International Registry of Acute Aortic Dissection: a 20-year experience of collaborative clinical research. Circulation. 2018;137:1846-1860. (Citation from memory. Context for IRAD outcomes and malperfusion.)

Checklist:
- [ ] Stage 1 vignette: the hemodynamics, the ED management, and the pathway routing suspected dissection to the CTICU are synthetic and marked [REVIEW] or [NMH protocol, insert].
- [ ] Stage 1 model answer: the heart rate (60 to 80) and systolic (below 120 mmHg or lowest perfusing) targets are attributed to the 2022 ACC/AHA guideline and were confirmed via the ACC Ten Points summary, not the full text. Confirm the exact wording and class of recommendation in the guideline.
- [ ] Stage 1 model answer: the beta blocker first, vasodilator second sequence is attributed to the guideline and confirmed via the summary. Confirm.
- [ ] Stage 1 model answer: agent choice (esmolol, labetalol, nicardipine, clevidipine, nitroprusside) is stated without doses. Insert NMH dosing. [NMH protocol, insert]
- [ ] Stage 1 model answer: the statement that aggressive rate control may be poorly tolerated with acute severe AR is physiologic reasoning. Confirm you agree.
- [ ] Stage 2 vignette: the CT findings and the hemodynamic collapse are synthetic. Confirm the combination (tamponade, AR, RCA from the false lumen, left renal from the false lumen) is the teaching scenario you want.
- [ ] Stage 2 model answer: the Isselbacher 1994 series is described from secondary sources. Confirm the primary paper and the patient numbers before quoting.
- [ ] Stage 2 model answer: the Hayashi 2012 figures (18 patients, systolic about 90 mmHg, 16.7% mortality) were confirmed this session. Confirm against the paper.
- [ ] Stage 2 model answer and controversies: the ESC 2014 class IIa claim for controlled drainage is contradicted by a 2025 review. Resolve against the ESC text. The 2022 ACC/AHA and 2024 ESC positions on pericardiocentesis in type A are unconfirmed. [VERIFY]
- [ ] Stage 2 model answer: the controlled drainage technique (pigtail, tens of milliliters, stopcock closed, target of a pressure not a normal pressure) and who performs it. [NMH protocol, insert]
- [ ] Stage 2 SBA: the statement that PCI before surgery is a rescue only when surgery is unavailable is expert reasoning with case report support. Confirm you agree.
- [ ] Stage 3 vignette: the operative details (axillary cannulation, moderate hypothermia, unilateral ACP, hemiarch, resuspension, RCA vein graft) are synthetic. Confirm they match NMH surgical practice.
- [ ] Stage 3 model answer: the postoperative blood pressure target is left as a normal-range mean and explicitly institutional. Insert NMH's number. [NMH protocol, insert]
- [ ] Stage 3 model answer: spinal cord ischemia management (raise MAP, lumbar drain) is extrapolated from the TEVAR and thoracoabdominal literature. Confirm the framing.
- [ ] Stage 3 model answer: coagulopathy management (viscoelastic-guided, antifibrinolytic standard, rFVIIa and PCC as rescue) and re-exploration thresholds. [NMH protocol, insert]
- [ ] Stage 4 model answer: the endovascular options (TEVAR for dynamic, fenestration or branch stenting for static) are framed from the guideline's complicated type B recommendations applied to a residual dissection. Confirm the extrapolation is acceptable. The team structure for endovascular aortic emergencies at NMH. [NMH protocol, insert]
- [ ] Controversies: the AATS 2021 consensus and 2022 ACC/AHA framing of arch extent is attributed from memory. Confirm against the documents.
- [ ] References marked VERIFY: Isselbacher 1994, Malaisrie 2021 (author list, volume, pages), Evangelista 2018. Partially verified (volume and pages from memory): Mazzolai 2024. Confirm each before release.
- [ ] All blood pressure and heart rate targets in the case are either cited to the 2022 ACC/AHA guideline and marked [VERIFY], or left qualitative and marked institutional. If you add any, source them.

## ST changes six hours after CABG
File: `public/content/cases/st-changes-after-cabg.json`  ·  Topic: Early graft failure after CABG: recognition, differential, and the decision to re-image or re-explore

Flags in text: 16 VERIFY, 10 NMH protocol inserts, 43 REVIEW. References: 9 total, 3 unconfirmed.

References to confirm:
- Moussa ID, Klein LW, Shah B, et al. Consideration of a new definition of clinically relevant myocardial infarction after coronary revascularization: an expert consensus document from the Society for Cardiovascular Angiography and Interventions (SCAI). J Am Coll Cardiol. 2013;62:1563-1570. doi:10.1016/j.jacc.2013.08.720 (Existence and author list confirmed this session on the SCAI website, which links the paper under DOI 10.1002/ccd.25135 (the Catheter Cardiovasc Interv co-publication). The JACC volume, pages, and DOI above are from memory. The CK-MB and troponin thresholds quoted in the case (10 times and 70 times ULN without ancillary criteria, 5 times and 35 times with new Q waves or LBBB) are from memory and must be checked.)
- Thielmann M, Massoudy P, Jaeger BR, et al. Emergency re-revascularization with percutaneous coronary intervention, reoperation, or conservative treatment in patients with acute perioperative graft failure following coronary artery bypass surgery. Eur J Cardiothorac Surg. 2006;30:117-125. (Citation from memory. A search this session surfaced only the appended conference discussion (Eur J Cardiothorac Surg 2006;30:125), which supports the title and journal but not the author list or page range of the main paper. Confirm before release.)
- Kapur NK, Esposito ML, Bader Y, et al. Mechanical circulatory support devices for acute right ventricular failure. Circulation. 2017;136:314-326. (Citation from memory. Review of percutaneous and surgical RV support options. Not searched this session.)

Checklist:
- [ ] Stage 1 vignette: graft configuration (LITA-LAD, SVG-OM, SVG-RCA), the description of the RCA target, PA catheter use, and the ECG description are synthetic and marked [REVIEW]. Confirm they reflect NMH practice and are internally consistent.
- [ ] Stage 1 model answer: the claim that pericarditis does not produce reciprocal ST depression outside aVR and V1. Confirm you endorse this as the discriminator.
- [ ] Stage 1 model answer: the statement that air embolism usually declares itself at separation from bypass rather than hours later. Expert reasoning, not sourced.
- [ ] Stage 1 SBA: the Fourth Universal Definition type 5 MI criteria (troponin above 10 times the 99th percentile URL within 48 hours plus one of new Q waves or LBBB, angiographic occlusion, or imaging loss of viable myocardium). Confirm against Thygesen 2018 full text. [VERIFY]
- [ ] Stage 1 SBA: the SCAI thresholds (CK-MB 10 times or troponin 70 times ULN without ancillary criteria, 5 times and 35 times with new Q waves or LBBB). From memory. Confirm against Moussa 2013. [VERIFY]
- [ ] Stage 1 SBA: the ARC-2 CABG thresholds (troponin at or above 35 times URL or CK-MB at or above 10 times with an ancillary criterion). From memory. Confirm against Garcia-Garcia 2018. [VERIFY]
- [ ] Stage 1 SBA: the VISION Cardiac Surgery threshold of roughly 218 times URL for hs-TnI after CABG or AVR. Confirmed from a news summary this session, confirm against the NEJM paper and note it applies to the specific Abbott hs-TnI assay used.
- [ ] Stage 1 SBA: the characterization of the Thielmann 2017 ESC position paper as stating that no biomarker threshold alone defines perioperative MI. From memory, confirm.
- [ ] Stage 1: the assay-specific 99th percentile and the post-CABG troponin schedule are left as [NMH protocol, insert].
- [ ] Stage 2 narrative: hemodynamic and echo findings are synthetic and marked [REVIEW].
- [ ] Stage 2 model answer: the Biancari 2018 figures (62 percent graft failure on early angiography, roughly half PCI and half reoperation among those revascularized, no significant early mortality difference). Confirmed this session from the publisher page.
- [ ] Stage 2 model answer: the claim that calcium channel blockers are most useful for radial conduits and that nitroglycerin trial should not delay imaging. Expert reasoning.
- [ ] Stage 2 model answer: the characterization of the ESC working group and subsequent literature as favoring angiography first in the stable patient. Confirm against Thielmann 2017.
- [ ] Stage 2 model answer: the four factors determining angiography versus re-exploration and the local availability facts are marked [NMH protocol, insert].
- [ ] Stage 3 SBA: the preference for native-vessel PCI over graft PCI and the attribution to the ESC working group paper and the 2021 ACC/AHA/SCAI guideline. Confirm both documents discuss PCI for early graft failure in the way described. [VERIFY]
- [ ] Stage 3 SBA: the antiplatelet reasoning (aspirin within hours after CABG, clopidogrel loading with deferral of more potent agents in the fresh chest, prasugrel generally avoided after CABG). Confirm the guideline basis and insert NMH practice.
- [ ] Stage 3 SBA: the statements about protamine reversal after PCI and about glycoprotein IIb/IIIa inhibitors in patients with mediastinal drains are expert opinion.
- [ ] Stage 4 narrative: the RV failure picture is synthetic and marked [REVIEW].
- [ ] Stage 4 model answer: the volume, pacing, afterload, coronary perfusion pressure, and inotrope reasoning for RV failure is expert reasoning without a single guideline source. Confirm you endorse the framing, particularly the advice to remove rather than add preload when the septum is flattened.
- [ ] Stage 4 model answer: the description of percutaneous RA-to-PA RVAD, microaxial RV pump, surgical RVAD, and VA ECMO and the choice of percutaneous RVAD as the committed answer. Confirm this matches NMH device availability and practice. [NMH protocol, insert]
- [ ] Controversies: the graft spasm prophylaxis paragraph's characterization of randomized and registry data on calcium channel blockers after radial grafting and of the 2021 guideline's position. From memory. [VERIFY]
- [ ] Controversies: the routine troponin paragraph is expert characterization of practice variation.
- [ ] References marked VERIFY: Moussa 2013 (JACC details), Thielmann 2006 (author list and pages), Kapur 2017 (not searched). References marked verified but with details from memory: Thygesen 2018 (volume, pages, DOI), Devereaux 2022 (volume, pages, DOI), Lawton 2022 (full guideline pagination and DOI).
- [ ] No numeric dose, device setting, or hemodynamic target was asserted as a recommendation. The only numeric thresholds in the case are the published MI definitions, each marked [VERIFY].

## The first night after pulmonary thromboendarterectomy
File: `public/content/cases/first-night-after-pte.json`  ·  Topic: Postoperative critical care after pulmonary thromboendarterectomy for CTEPH: reperfusion lung injury, residual pulmonary hypertension, and RV failure

Flags in text: 24 VERIFY, 14 NMH protocol inserts, 49 REVIEW. References: 9 total, 3 unconfirmed.

References to confirm:
- Fedullo P, Kerr KM, Kim NH, Auger WR. Chronic thromboembolic pulmonary hypertension. Am J Respir Crit Care Med. 2011;183:1605-1613. doi:10.1164/rccm.201011-1854CI (Citation from memory. Search this session surfaced other Fedullo and Auger reviews (Clin Chest Med 2001;22:561-581 and Semin Respir Crit Care Med 2009;30:471-483, both confirmed) but not this specific AJRCCM paper. Confirm or substitute one of the confirmed reviews. Source for the UCSD postoperative management approach including fluid restriction and selective use of pulmonary vasodilators.)
- Kramm T, Eberle B, Guth S, Mayer E. Inhaled iloprost to control residual pulmonary hypertension following pulmonary endarterectomy. Eur J Cardiothorac Surg. 2005;28:882-888. (Citation from memory. A randomized comparison of inhaled prostacyclin versus iNO after PTE surfaced in search this session (PMC5331109, authors and details not retrieved). Confirm which trial the case should cite for the inhaled iloprost versus iNO comparison and correct the citation.)
- Levinson RM, Shure D, Moser KM. Reperfusion pulmonary edema after pulmonary artery thromboendarterectomy. Am Rev Respir Dis. 1986;134:1241-1245. (Citation from memory. Original description of reperfusion pulmonary edema after PTE from the UCSD group. Not confirmed this session.)

Checklist:
- [ ] Stage 1 vignette: the preoperative hemodynamics, the number of circulatory arrest periods, the description of the specimen, the PVR change off bypass, and the TEE findings are synthetic and marked [REVIEW]. Confirm they reflect NMH practice, including whether NMH uses DHCA with the UCSD technique.
- [ ] Stage 1 model answer: the UCSD intraoperative classification of surgical findings as a predictor of hemodynamic outcome. Attributed to Jamieson 2003 and Madani 2012 from memory. [VERIFY]
- [ ] Stage 1 model answer: the claim that total arrest time and number of periods predict neurological injury and in some series reperfusion injury. Expert characterization, not sourced.
- [ ] Stage 1 model answer: the statement that the UCSD program keeps patients ventilated at least overnight and does not use routine pulmonary vasodilators. From memory of the Fedullo and Auger reviews. [VERIFY] [NMH protocol, insert]
- [ ] Stage 1 model answer: the advice that permissive hypercapnia is not acceptable after PTE. Expert reasoning on PVR physiology, confirm you endorse it.
- [ ] Stage 1 model answer: heparin resumption timing is left as [NMH protocol, insert].
- [ ] Stage 2 narrative: radiograph, PA catheter values, secretions, and fluid balance are synthetic and marked [REVIEW].
- [ ] Stage 2 model answer: the characterization of reperfusion lung injury incidence as a substantial minority with definition-dependent variation. Confirm against Madani 2012 and Kerr 2012 and consider inserting the actual range.
- [ ] Stage 2 model answer: the description of pulmonary artery steal after PTE. From memory. [VERIFY]
- [ ] Stage 2 model answer: the Kerr 2012 trial results (41 versus 45 percent). Confirmed this session.
- [ ] Stage 2 model answer: the statement that small studies of iNO after PTE show improved oxygenation and hemodynamics without a mortality signal, and that a randomized trial compared inhaled iloprost with iNO. The trial exists (PMC5331109) but its details were not retrieved. [VERIFY]
- [ ] Stage 2 model answer: prone positioning after sternotomy and the ECMO trigger are expert opinion and marked [NMH protocol, insert].
- [ ] Stage 3 narrative: hemodynamic and echo findings are synthetic and marked [REVIEW].
- [ ] Stage 3 model answer: the claim that residual PH is the leading cause of death after PTE in large series. From memory of Madani 2012 and Jamieson 2003. [VERIFY]
- [ ] Stage 3 model answer: the inotrope and vasopressor reasoning (milrinone, dobutamine, epinephrine, norepinephrine, vasopressin, avoidance of phenylephrine) is expert reasoning without a single guideline source. Confirm you endorse the framing.
- [ ] Stage 3 model answer: the RV coronary perfusion physiology. Standard teaching, confirm the phrasing.
- [ ] Stage 3 model answer: riociguat as the licensed agent for persistent or recurrent CTEPH after PTE. Confirm against the 2022 ESC/ERS guideline. [VERIFY]
- [ ] Stage 3 model answer: VA ECMO criteria and the bridge-to-decision framing are expert opinion and marked [NMH protocol, insert].
- [ ] Stage 4 narrative: the airway hemorrhage is synthetic and marked [REVIEW].
- [ ] Stage 4 model answer: the incidence of airway hemorrhage after PTE (on the order of one to two percent). From memory. [VERIFY]
- [ ] Stage 4 model answer: the isolation options and the statement that most airway hemorrhage after PTE is controlled by isolation and time. Expert reasoning.
- [ ] Stage 4 model answer: the Guth JTCVS series findings. Confirmed this session. Note the series describes intraoperative rather than postoperative bleeding and the case says so.
- [ ] Stage 4 model answer: the statement that operative mortality of PTE in experienced centers is in the low single digits. Confirm against Madani 2012 (UCSD) and the Guth series (2.3 percent in-hospital mortality, confirmed this session).
- [ ] Controversies: the characterization of center practice on routine iNO, ECMO timing, and BPA timing is expert characterization and marked [NMH protocol, insert] where applicable.
- [ ] References marked VERIFY: Fedullo 2011 (not found this session, two alternative confirmed Fedullo/Auger reviews are noted), Kramm 2005 (from memory, the correct iloprost versus iNO trial citation must be identified), Levinson 1986 (from memory). References marked verified but with details from memory: Madani 2012 (coauthors, pages), Jamieson 2003 (coauthors), Delcroix 2021 (article number), Humbert 2022 (volume, pages), Guth 2018 (year, volume, pages).
- [ ] No numeric dose, ventilator setting, hemodynamic target, or ECMO trigger was asserted as a recommendation. The only numbers in the case are synthetic vignette values and published trial results, each marked.

## A young patient after a two-valve operation
File: `public/content/cases/young-patient-two-valves.json`  ·  Topic: The Ross procedure: what the intensivist needs to know about the autograft, the homograft, and the early postoperative risks

Flags in text: 4 VERIFY, 8 NMH protocol inserts, 47 REVIEW. References: 9 total, 2 unconfirmed.

References to confirm:
- Mazine A, David TE, Rao V, et al. Long-term outcomes of the Ross procedure versus mechanical aortic valve replacement: propensity-matched cohort study. Circulation. 2016;134:576-585. (The Toronto propensity-matched series. Citation from memory, including author order, volume, and pages. Confirm before release.)
- Mazine A, El-Hamamsy I, Verma S, et al. Ross procedure in adults for cardiologists and cardiac surgeons: JACC state-of-the-art review. J Am Coll Cardiol. 2018;72:2761-2777. (Existence of the article confirmed by title this session. Author order, volume, and pages are from memory. Source for the description of the three implantation techniques.)

Checklist:
- [ ] All vignette details (bicuspid AR, cyclist, full root technique with external support, bypass and clamp times described qualitatively, intraoperative TEE findings, day-1 ECG and echo findings, operative findings at re-exploration) are synthetic and marked [REVIEW].
- [ ] Stage 1 model answer: the description of root replacement versus inclusion versus subcoronary techniques and their risk tradeoffs is attributed to Mazine 2018. Confirm against the review.
- [ ] Stage 1 model answer: the claim that autograft harvest risks the first septal perforator. This is standard surgical teaching but is unsourced here. Confirm or cite.
- [ ] Stage 1 model answer: the El-Hamamsy trial numbers (survival, re-exploration for bleeding, bypass time) were confirmed from a secondary summary. Check against the Lancet paper.
- [ ] Stage 1 SBA: the characterization of the 2020 ACC/AHA and 2021 ESC/EACTS Ross recommendations as cautious and of the 2025 EACTS consensus as more enthusiastic. Confirm the exact class and wording of each.
- [ ] Stage 1 SBA: the Mazine 2016 Circulation and Mazine 2022 JACC results are cited from memory and from a reference list respectively. Confirm.
- [ ] Stage 2 model answer: the list of expected versus concerning echo findings is expert reasoning. Edit to NMH practice and confirm you agree that early moderate AI is a surgical conversation.
- [ ] Stage 2 model answer: the blood pressure physiology (pulmonary root under systemic pressure, dilation accelerated by hypertension) and the preference for beta blockade to reduce dP/dt are mechanistic reasoning and expert consensus, not trial evidence. The attribution of strict blood pressure control to the EACTS consensus statement is marked VERIFY. Insert the surgeon's actual target and agent preference where marked.
- [ ] Stage 3 model answer: the differential and call order for day-1 anterior ischemia are expert reasoning. Insert NMH's practice on catheterization laboratory versus direct return to the operating room.
- [ ] Stage 3 model answer: the statement that ostial stenting of reimplanted buttons has been reported is from memory and unsourced. Confirm or remove.
- [ ] Stage 3 second question: the recommendation to favor re-exploration over stenting for a mechanical kink in a stable patient is expert opinion. Confirm you endorse it.
- [ ] Stage 4 model answer: risk factors for autograft dilation and the surveillance schedule. Registry statements are sourced to Sievers 2021. The surveillance interval is left as [NMH protocol, insert].
- [ ] Stage 4 model answer: the counseling paragraph is a model of tone, not of fact. Edit the durability framing to match what NMH surgeons tell patients.
- [ ] Controversies: the 2026 volume-outcome findings were confirmed from a news summary. Check against the JACC paper.
- [ ] References marked VERIFY: Mazine 2016 Circulation, Mazine 2018 JACC review (volume and pages), and the blood pressure attribution to the 2025 EACTS consensus.
- [ ] No blood pressure targets, drug doses, or echo thresholds were asserted as recommendations. If you add any, source them.

## Hypotension after mitral repair that worsens with inotropes
File: `public/content/cases/hypotension-worse-with-inotropes.json`  ·  Topic: Systolic anterior motion of the mitral valve and dynamic LVOT obstruction after cardiac surgery

Flags in text: 7 VERIFY, 3 NMH protocol inserts, 48 REVIEW. References: 9 total, 2 unconfirmed.

References to confirm:
- Jebara VA, Mihaileanu S, Acar C, et al. Left ventricular outflow tract obstruction after mitral valve repair: results of the sliding leaflet technique. Circulation. 1993;88(5 Pt 2):II30-II34. (Carpentier group description of the sliding leaflet plasty for SAM. Citation from memory. A related 1988 Circulation abstract (Mihaileanu, Carpentier) on LVOT obstruction after Carpentier repair surfaced in search. Confirm the exact citation before release.)
- Hahn RT, Abraham T, Adams MS, et al. Guidelines for performing a comprehensive transesophageal echocardiographic examination: recommendations from the American Society of Echocardiography and the Society of Cardiovascular Anesthesiologists. J Am Soc Echocardiogr. 2013;26:921-964. (Citation from memory. Source for the views used to assess the mitral apparatus and LVOT.)

Checklist:
- [ ] All vignette details (repair technique, ring type, preoperative LV and septal description, inotrope and vasopressor at separation, hemodynamic trends, TEE findings at each stage, surgical findings and revision) are synthetic and marked [REVIEW]. No gradient, CVP, pressure, or dose numbers are given.
- [ ] Stage 1 model answer: the differential and the instruction to hold the epinephrine, give volume, and start phenylephrine before the echo. Confirm you endorse this as the default and that the circumflex injury caveat is framed as you want.
- [ ] Stage 1 second question: the risk factor list and mechanisms are drawn from Lee 1993, Varghese 2014, and Manabe 2018. The statement that complete rigid rings are implicated more than bands is contested and marked [REVIEW]. The Varghese measurement criteria are deliberately not quoted and must be inserted from the paper if you want them.
- [ ] Stage 2 model answer: the medical management sequence is expert consensus. Confirm the agent preferences (phenylephrine or vasopressin, esmolol or landiolol, norepinephrine acceptable) match NMH practice and insert specifics where marked.
- [ ] Stage 2 model answer: the statement that the intra-aortic balloon pump is contraindicated in dynamic LVOT obstruction. Standard teaching, unsourced here. Confirm or cite.
- [ ] Stage 2 model answer: the characterization of the 2024 HCM guideline gradient thresholds and the statement that they were not derived for postoperative SAM. Confirm against the guideline and decide whether to quote the threshold.
- [ ] Stage 3 model answer: the claim that a minority of repairs (a few percent) need surgical revision for SAM is attributed to Loulmet 2014 and Manabe 2018 without a quoted number. Insert the actual proportions from those papers or leave qualitative.
- [ ] Stage 3 model answer: the surgical options list and the preference for sliding plasty first with Alfieri as bailout. Confirm with the mitral surgeons.
- [ ] Stage 3 second question: the attribution to the 2020 ASE/SCA/STS guideline of the physiologic loading conditions requirement and the afterload challenge. Check the mitral repair section for exact wording.
- [ ] Stage 4 model answer: the four generalizations (post-AVR, post-myectomy, sepsis, takotsubo) are expert reasoning with no specific citations. Confirm each and add sources if you want them.
- [ ] Stage 4: the statement that beta blockade in sepsis has a literature with esmolol and landiolol is from memory (Morelli 2013, J-Land 3S) and is not cited. Add or soften.
- [ ] Controversies: all five are framed as unsettled. Confirm none is settled at NMH and insert institutional practice where marked.
- [ ] References marked VERIFY: Jebara 1993 (sliding leaflet), Hahn 2013 (comprehensive TEE exam). The Ommen 2024 and Lee 1993 entries are verified for existence but their volume and page details are from memory.
- [ ] No gradient threshold, drug dose, pressure target, or ring size was asserted as a recommendation. If you add any, source them.
