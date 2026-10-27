"""Regenerates REVIEW_TRACKER.md from the case files. Run from the project root: python3 tools/build_review_tracker.py"""
import json
out = ["# Clinical review tracker", "", "Generated from the case files. Every case is draft until its checklist is cleared and its status set to released.", ""]
total = 0
for e in json.load(open('public/content/cases/index.json'))['cases']:
    c = json.load(open(f"public/content/cases/{e['id']}.json"))
    txt = json.dumps(c, ensure_ascii=False)
    refs = c['references']; unv = [r for r in refs if r['status'] != 'verified']
    out += [f"## {c['title']}", f"File: public/content/cases/{c['id']}.json  ·  Topic: {c.get('topic','')}", "",
            f"Flags: {txt.count('[VERIFY]')} VERIFY, {txt.count('[NMH protocol, insert]')} NMH inserts, {txt.count('[REVIEW]')} REVIEW. References: {len(refs)}, {len(unv)} unconfirmed.", ""]
    if unv: out += ["References to confirm:"] + [f"- {r['citation']}" for r in unv] + [""]
    out += ["Checklist:"] + [f"- [ ] {i}" for i in c['reviewChecklist']] + [""]
    total += len(c['reviewChecklist'])
out.insert(3, f"Total checklist items: {total}.")
open('REVIEW_TRACKER.md','w').write("\n".join(out))
print("wrote REVIEW_TRACKER.md")
