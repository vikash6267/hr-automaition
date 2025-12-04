# 🔧 Error Guide - Sab Errors Ka Solution

## 📚 Table of Contents
1. [Start Node Errors](#start-node-errors)
2. [End Node Errors](#end-node-errors)
3. [Connection Errors](#connection-errors)
4. [Configuration Errors](#configuration-errors)
5. [Workflow Structure Errors](#workflow-structure-errors)
6. [Save/Export Errors](#saveexport-errors)

---

## 🟢 Start Node Errors

### Error 1: "Start Node Missing"
```
🟢 Start Node Missing: Har workflow ko ek Start node chahiye.
```

**Problem**: Aapke workflow mein Start node nahi hai.

**Solution**:
1. Left panel dekhen
2. Green "Start" node ko drag karein
3. Canvas pe drop karein
4. Phir se validate karein

**Visual**:
```
[Left Panel]  →  →  →  [Canvas]
   🟢 Start           ┌────────┐
   (Drag)             │ START  │
                      └────────┘
```

---

### Error 2: "Multiple Start Nodes"
```
🟢 Multiple Start Nodes: Aapke workflow mein 2 Start nodes hain.
```

**Problem**: Ek se zyada Start nodes hain.

**Solution**:
1. Extra Start nodes ko select karein
2. Right panel mein "Delete Node" button click karein
3. Sirf ek Start node rakhen

**Visual**:
```
❌ Wrong:              ✅ Correct:
┌────────┐            ┌────────┐
│ START  │            │ START  │
└────────┘            └───┬────┘
┌────────┐                │
│ START  │ ← Delete       ▼
└────────┘            ┌────────┐
                      │  TASK  │
                      └────────┘
```

---

### Error 3: "Start Node Has Incoming Connection"
```
🟢 Start Node "Begin Process": Isme incoming connection nahi ho sakta.
```

**Problem**: Kisi node se Start node ko connect kiya gaya hai.

**Solution**:
1. Galat connection ko select karein
2. Delete key press karein
3. Start node hamesha pehla hona chahiye

**Visual**:
```
❌ Wrong:              ✅ Correct:
┌────────┐            ┌────────┐
│  TASK  │            │ START  │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ▼
┌────────┐            ┌────────┐
│ START  │            │  TASK  │
└────────┘            └────────┘
```

---

### Warning: "Start Node Has No Outgoing Connection"
```
⚠️ Start Node "Begin": Isko kisi node se connect karein.
```

**Problem**: Start node kisi se connected nahi hai.

**Solution**:
1. Start node ke neeche wale dot pe click karein
2. Drag karke next node ke upar wale dot tak le jayein
3. Connection ban jayega

---

## 🔴 End Node Errors

### Error 4: "End Node Missing"
```
🔴 End Node Missing: Har workflow ko kam se kam ek End node chahiye.
```

**Problem**: Workflow mein End node nahi hai.

**Solution**:
1. Left panel se red "End" node drag karein
2. Canvas pe last step ke baad drop karein
3. Previous node se connect karein

**Visual**:
```
Before:                After:
┌────────┐            ┌────────┐
│ START  │            │ START  │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ▼
┌────────┐            ┌────────┐
│  TASK  │            │  TASK  │
└────────┘            └───┬────┘
                          │
                          ▼
                      ┌────────┐
                      │  END   │ ← Add this
                      └────────┘
```

---

### Error 5: "End Node Has Outgoing Connection"
```
🔴 End Node "Complete": Isme outgoing connection nahi ho sakta.
```

**Problem**: End node ke baad aur nodes connected hain.

**Solution**:
1. End node ke baad ke connections delete karein
2. End node hamesha last hona chahiye

**Visual**:
```
❌ Wrong:              ✅ Correct:
┌────────┐            ┌────────┐
│  TASK  │            │  TASK  │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ▼
┌────────┐            ┌────────┐
│  END   │            │  END   │
└───┬────┘            └────────┘
    │ ← Remove
    ▼
┌────────┐
│  TASK  │
└────────┘
```

---

## 🔗 Connection Errors

### Warning: "Node Has No Incoming Connection"
```
⚠️ 🔵 "Prepare Docs": Isme incoming connection nahi hai.
```

**Problem**: Node isolated hai, kisi se connected nahi.

**Solution**:
1. Previous node ke neeche wale dot se drag karein
2. Is node ke upar wale dot tak le jayein

**Visual**:
```
Before:                After:
┌────────┐            ┌────────┐
│ START  │            │ START  │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ▼
┌────────┐            ┌────────┐
│  TASK  │            │  TASK  │
└────────┘            └───┬────┘
                          │
┌────────┐                ▼
│  TASK  │ ← Isolated ┌────────┐
└────────┘            │  TASK  │ ← Connected
                      └────────┘
```

---

### Warning: "Node Has No Outgoing Connection"
```
⚠️ 🔵 "Review Docs": Isme outgoing connection nahi hai.
```

**Problem**: Node ke baad kuch nahi hai.

**Solution**:
1. Is node ke neeche wale dot se drag karein
2. Next node (ya End node) ke upar wale dot tak le jayein

---

### Error 6: "Orphaned Node"
```
❌ 🔵 "Send Email": Ye node Start node se connected nahi hai.
```

**Problem**: Node main workflow se alag hai.

**Solution**:
1. Is node ko main workflow se connect karein
2. Ya agar zarurat nahi hai toh delete kar dein

**Visual**:
```
❌ Wrong:              ✅ Correct:
┌────────┐            ┌────────┐
│ START  │            │ START  │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ▼
┌────────┐            ┌────────┐
│  TASK  │            │  TASK  │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ├────────┐
┌────────┐            │           ▼
│  END   │            │       ┌────────┐
└────────┘            │       │ EMAIL  │ ← Connected
                      │       └───┬────┘
┌────────┐            │           │
│ EMAIL  │ ← Orphan   ▼           ▼
└────────┘        ┌────────┐  ┌────────┐
                  │  END   │  │  END   │
                  └────────┘  └────────┘
```

---

### Error 7: "Circular Loop Detected"
```
🔄 Circular Loop: "Task A" → "Task B" → "Task A"
```

**Problem**: Nodes ek circle bana rahe hain (infinite loop).

**Solution**:
1. Circle mein se ek connection remove karein
2. Workflow ko linear banayein

**Visual**:
```
❌ Wrong (Loop):       ✅ Correct (Linear):
┌────────┐            ┌────────┐
│ TASK A │            │ TASK A │
└───┬────┘            └───┬────┘
    │                     │
    ▼                     ▼
┌────────┐            ┌────────┐
│ TASK B │            │ TASK B │
└───┬────┘            └───┬────┘
    │                     │
    └──────┐              ▼
           │          ┌────────┐
           ▼          │ TASK C │
       (Loop)         └────────┘
```

---

## ⚙️ Configuration Errors

### Error 8: "Node Title Missing"
```
❌ 🔵 Node: Title missing hai.
```

**Problem**: Node ka naam nahi diya.

**Solution**:
1. Node pe click karein
2. Right panel mein "Title" field mein naam enter karein
3. Descriptive naam dein (e.g., "Send Welcome Email")

---

### Error 9: "Task Has No Assignee"
```
⚠️ 🔵 Task "Prepare Docs": Assignee missing hai.
```

**Problem**: Task kisko assign karna hai ye nahi bataya.

**Solution**:
1. Task node pe click karein
2. Right panel mein "Assignee" field mein email enter karein
3. Example: `hr@company.com` ya `john.doe@company.com`

**Visual**:
```
Right Panel:
┌─────────────────────┐
│ Task Configuration  │
├─────────────────────┤
│ Title:              │
│ [Prepare Docs]      │
│                     │
│ Assignee: *         │
│ [hr@company.com]    │ ← Enter email here
│                     │
│ Due Date:           │
│ [Select date]       │
└─────────────────────┘
```

---

### Error 10: "Approval Node - Approver Role Missing"
```
❌ 🟠 Approval "Manager Review": Approver Role missing hai.
```

**Problem**: Kaun approve karega ye nahi bataya.

**Solution**:
1. Approval node pe click karein
2. "Approver Role" field mein role enter karein
3. Examples: "Manager", "HR Director", "Team Lead"

---

### Error 11: "Automated Node - Action Not Selected"
```
❌ 🟣 Automated "Send Email": Action select nahi kiya gaya.
```

**Problem**: Kaunsa automated action run karna hai ye nahi bataya.

**Solution**:
1. Automated node pe click karein
2. "Select Action" dropdown se action choose karein
3. Available actions:
   - Send Email
   - Generate Document
   - Create IT Ticket
   - Send Slack Message
   - Update HRMS
   - Schedule Meeting

**Visual**:
```
Right Panel:
┌─────────────────────┐
│ Automated Config    │
├─────────────────────┤
│ Select Action: *    │
│ [▼ Choose action]   │ ← Click here
│                     │
│ Options:            │
│ • Send Email        │
│ • Generate Document │
│ • Create IT Ticket  │
│ • Send Slack Msg    │
│ • Update HRMS       │
│ • Schedule Meeting  │
└─────────────────────┘
```

---

### Warning: "End Node - Completion Message Missing"
```
⚠️ 🔴 End "Complete": Completion message missing hai.
```

**Problem**: Workflow complete hone pe kya message dikhana hai ye nahi bataya.

**Solution**:
1. End node pe click karein
2. "Completion Message" field mein message enter karein
3. Example: "Onboarding successfully completed!"

---

## 💾 Save/Export Errors

### Error 12: "Workflow Name Missing"
```
❌ Workflow Name Missing: Pehle workflow ka naam enter karein.
```

**Problem**: Workflow ka naam nahi diya.

**Solution**:
1. Top left corner mein workflow name field dekhen
2. Meaningful naam enter karein
3. Example: "Employee Onboarding", "Leave Approval"

**Visual**:
```
Top Toolbar:
┌─────────────────────────────────────┐
│ [Workflow Name]  [Validate] [Save] │
│  ↑                                  │
│  Enter name here                    │
└─────────────────────────────────────┘
```

---

### Error 13: "Empty Workflow"
```
❌ Empty Workflow: Pehle kuch nodes add karein.
```

**Problem**: Canvas khali hai, koi node nahi hai.

**Solution**:
1. Left panel se nodes drag karein
2. Kam se kam Start, ek middle node, aur End add karein
3. Sab ko connect karein

---

### Error 14: "Cannot Export - Canvas Empty"
```
❌ Cannot Export: Canvas khali hai!
```

**Problem**: Export karne ke liye kuch hai hi nahi.

**Solution**:
1. Pehle workflow banayein
2. Nodes add karein aur connect karein
3. Phir export karein

---

## 🎯 Common Scenarios & Solutions

### Scenario 1: "Validation mein bahut saare errors aa rahe hain"

**Solution**:
1. Ek ek karke errors fix karein
2. Pehle Start aur End nodes check karein
3. Phir connections check karein
4. Last mein configuration check karein

**Priority Order**:
```
1. Start Node ✓
2. End Node ✓
3. Connections ✓
4. Node Configuration ✓
5. Validate Again ✓
```

---

### Scenario 2: "Nodes connect nahi ho rahe"

**Possible Reasons**:
1. End node se connect karne ki koshish kar rahe ho
2. Start node ko connect karne ki koshish kar rahe ho
3. Dot accurately click nahi kar rahe

**Solution**:
1. Source node ke **neeche wale dot** se start karein
2. Target node ke **upar wale dot** tak drag karein
3. Zoom in karke try karein agar mushkil ho

---

### Scenario 3: "Simulation fail ho raha hai"

**Check These**:
1. ✅ Validation pass ho raha hai?
2. ✅ Sab nodes configured hain?
3. ✅ Connections sahi hain?
4. ✅ Circular loop toh nahi hai?

**Solution**:
1. Pehle "Validate" button click karein
2. Sab errors fix karein
3. Phir "Simulate" button click karein

---

### Scenario 4: "Workflow save nahi ho raha"

**Check These**:
1. ✅ Workflow name diya hai?
2. ✅ Canvas khali toh nahi?
3. ✅ Internet connection hai?

**Solution**:
1. Workflow name enter karein (top left)
2. Kuch nodes add karein
3. Phir se save try karein

---

## 🎨 Visual Error Examples

### Example 1: Complete Invalid Workflow
```
❌ Problems:
┌────────┐  ┌────────┐
│ START  │  │ START  │ ← Multiple starts
└───┬────┘  └────────┘
    │
    ▼
┌────────┐
│  TASK  │ ← No assignee
└────────┘
    │
    └──────┐
           │
           ▼
       (Loop) ← Circular
```

### Example 2: Fixed Valid Workflow
```
✅ Correct:
┌────────┐
│ START  │ ← One start
└───┬────┘
    │
    ▼
┌────────┐
│  TASK  │ ← Has assignee
└───┬────┘
    │
    ▼
┌────────┐
│  END   │ ← Has end
└────────┘
```

---

## 📊 Error Priority Levels

### 🔴 Critical (Must Fix)
- No Start Node
- No End Node
- Multiple Start Nodes
- Circular Loop
- Missing Required Fields

### 🟡 Warning (Should Fix)
- No Assignee
- No Completion Message
- Disconnected Nodes
- No Incoming/Outgoing

### 🟢 Info (Optional)
- Add Description
- Add Metadata
- Add Custom Fields

---

## 🎯 Quick Fix Checklist

Before Validation:
- [ ] Ek Start node hai
- [ ] Kam se kam ek End node hai
- [ ] Sab nodes connected hain
- [ ] Har node ka title hai
- [ ] Required fields filled hain

Before Simulation:
- [ ] Validation pass ho gaya
- [ ] Sab warnings check kiye
- [ ] Configuration complete hai
- [ ] No circular loops

Before Save:
- [ ] Workflow name diya hai
- [ ] Canvas khali nahi hai
- [ ] Validation pass hai
- [ ] Testing ho gayi

---

## 💡 Pro Tips

### Tip 1: Error Messages Dhyan Se Padhein
- Har error message mein exact problem bataya gaya hai
- Node ka naam bhi diya gaya hai
- Solution bhi suggest kiya gaya hai

### Tip 2: Ek Ek Karke Fix Karein
- Sab errors ek saath fix karne ki koshish mat karein
- Pehle critical errors fix karein
- Phir warnings dekhen

### Tip 3: Validate Regularly
- Har kuch changes ke baad validate karein
- Jaldi errors catch ho jayenge
- Fix karna easy hoga

### Tip 4: Toast Notifications Dekhen
- Detailed information milti hai
- Color coding se priority pata chalti hai
- Auto-dismiss hote hain

---

## 🆘 Still Stuck?

### Get Help:
1. **Documentation**: README_HR.md padhein
2. **Visual Guide**: VISUAL_GUIDE.md dekhen
3. **Examples**: WORKFLOW_EXAMPLES.md mein examples hain
4. **Support**: IT team se contact karein

### Common Questions:
- **Q**: Kitne nodes add kar sakte hain?
  **A**: 100 tak recommended hai

- **Q**: Kya ek node se multiple connections ho sakte hain?
  **A**: Haan, ek node se kai nodes ko connect kar sakte hain

- **Q**: Kya workflow edit kar sakte hain baad mein?
  **A**: Haan, save karne ke baad bhi edit kar sakte hain

---

**Remember**: Har error ka solution hai! Dhyan se error message padhein aur step-by-step fix karein. 🎯

---

*Last Updated: December 2024*  
*Version: 1.0.0*  
*For HR Workflow Designer*
