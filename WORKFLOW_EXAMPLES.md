# Workflow Examples

This document provides example workflows for common HR processes.

## 1. Employee Onboarding

**Purpose**: Streamline the onboarding process for new hires

**Workflow Steps**:
1. Start → Initialize onboarding with employee details
2. Task → IT prepares workspace and equipment
3. Automated → Create email account and system access
4. Automated → Send welcome email with first-day information
5. Task → Employee completes HR paperwork
6. Automated → Generate employment contract
7. Approval → Manager reviews and approves onboarding
8. Automated → Schedule orientation meeting
9. Automated → Notify team via Slack
10. Task → Assign onboarding buddy
11. End → Onboarding complete

**Key Features**:
- Automated email and document generation
- Manager approval checkpoint
- Team notifications
- Buddy system assignment

**Example JSON**: See `examples/employee-onboarding.json`

---

## 2. Leave Request Approval

**Purpose**: Manage employee leave requests with multi-level approval

**Workflow Steps**:
1. Start → Employee submits leave request
2. Task → Employee provides leave details (dates, reason, type)
3. Approval → Direct manager reviews request
4. Approval → HR reviews for policy compliance (if > 5 days)
5. Automated → Update HRMS with approved leave
6. Automated → Send calendar invite to block dates
7. Automated → Notify team about absence
8. End → Leave request processed

**Conditional Logic**:
- Short leaves (< 5 days): Single manager approval
- Long leaves (≥ 5 days): Manager + HR approval
- Emergency leaves: Auto-approve with post-notification

---

## 3. Document Verification

**Purpose**: Verify and process employee documents

**Workflow Steps**:
1. Start → Document submission initiated
2. Task → Employee uploads required documents
3. Automated → Run document validation checks
4. Approval → HR verifies document authenticity
5. Automated → Store documents in secure repository
6. Automated → Update employee record status
7. Automated → Send confirmation email
8. End → Document verification complete

**Document Types**:
- Identity proof (passport, driver's license)
- Educational certificates
- Previous employment records
- Background check reports

---

## 4. Performance Review Cycle

**Purpose**: Conduct quarterly performance reviews

**Workflow Steps**:
1. Start → Initiate review cycle
2. Task → Employee completes self-assessment
3. Task → Manager completes performance evaluation
4. Automated → Generate performance report
5. Task → Schedule 1-on-1 review meeting
6. Approval → Manager finalizes ratings
7. Approval → Department head reviews and approves
8. Automated → Update performance records
9. Automated → Notify HR for compensation review
10. End → Review cycle complete

---

## 5. Equipment Request

**Purpose**: Request and approve equipment for employees

**Workflow Steps**:
1. Start → Employee submits equipment request
2. Task → Specify equipment details and justification
3. Approval → Manager approves budget
4. Approval → IT reviews technical requirements
5. Automated → Create purchase order
6. Task → IT procures equipment
7. Automated → Update asset inventory
8. Task → IT delivers and sets up equipment
9. End → Equipment request fulfilled

---

## 6. Offboarding Process

**Purpose**: Manage employee exit process

**Workflow Steps**:
1. Start → Employee resignation/termination initiated
2. Task → HR schedules exit interview
3. Task → Employee returns company equipment
4. Automated → Revoke system access and credentials
5. Task → Manager reassigns responsibilities
6. Automated → Process final payroll
7. Automated → Generate exit documents
8. Approval → HR finalizes exit clearance
9. Automated → Update HRMS status to "Inactive"
10. End → Offboarding complete

---

## 7. Training Enrollment

**Purpose**: Enroll employees in training programs

**Workflow Steps**:
1. Start → Training enrollment initiated
2. Task → Employee selects training courses
3. Approval → Manager approves training budget
4. Automated → Check training seat availability
5. Automated → Register employee for training
6. Automated → Send training materials and schedule
7. Task → Employee completes training
8. Automated → Update training records
9. End → Training enrollment complete

---

## 8. Expense Reimbursement

**Purpose**: Process employee expense claims

**Workflow Steps**:
1. Start → Employee submits expense claim
2. Task → Upload receipts and expense details
3. Automated → Validate expense policy compliance
4. Approval → Manager approves expenses
5. Approval → Finance reviews for accuracy (if > $500)
6. Automated → Process reimbursement payment
7. Automated → Update accounting records
8. Automated → Send payment confirmation
9. End → Reimbursement processed

---

## 9. Internal Transfer

**Purpose**: Manage employee department/role transfers

**Workflow Steps**:
1. Start → Transfer request initiated
2. Task → Employee expresses transfer interest
3. Approval → Current manager approves release
4. Approval → New manager approves acceptance
5. Approval → HR reviews transfer terms
6. Automated → Update HRMS records
7. Automated → Adjust system permissions
8. Task → IT updates workspace/equipment
9. Automated → Notify relevant teams
10. End → Transfer complete

---

## 10. Incident Reporting

**Purpose**: Report and track workplace incidents

**Workflow Steps**:
1. Start → Incident reported
2. Task → Reporter provides incident details
3. Automated → Create incident ticket
4. Task → Safety officer investigates
5. Approval → Manager reviews findings
6. Task → Implement corrective actions
7. Automated → Update incident log
8. Automated → Send incident report to stakeholders
9. End → Incident resolved

---

## Creating Custom Workflows

### Best Practices

1. **Start with a clear goal**: Define what the workflow should accomplish
2. **Map the process**: List all steps in sequential order
3. **Identify decision points**: Where approvals or conditions are needed
4. **Automate where possible**: Use automated nodes for repetitive tasks
5. **Add validation**: Ensure data quality at each step
6. **Plan for exceptions**: Handle edge cases and errors
7. **Test thoroughly**: Simulate before deploying

### Workflow Design Tips

- **Keep it simple**: Start with core functionality, add complexity later
- **Use descriptive names**: Clear labels help team understand the flow
- **Add descriptions**: Document what each node does
- **Set realistic deadlines**: Allow adequate time for each task
- **Assign clear ownership**: Every task should have a responsible party
- **Include notifications**: Keep stakeholders informed
- **Plan for escalation**: Handle delayed approvals

### Common Patterns

**Sequential Processing**:
```
Start → Task 1 → Task 2 → Task 3 → End
```

**Approval Chain**:
```
Start → Task → Approval 1 → Approval 2 → Automated → End
```

**Parallel Tasks** (future feature):
```
Start → [Task A, Task B, Task C] → Merge → End
```

**Conditional Routing** (future feature):
```
Start → Decision → [Path A, Path B] → End
```

---

## Workflow Templates

### Quick Start Templates

1. **Simple Approval**: Start → Task → Approval → End
2. **Document Processing**: Start → Upload → Validate → Approve → Store → End
3. **Notification Flow**: Start → Automated Email → Automated Slack → End
4. **Multi-Step Task**: Start → Task 1 → Task 2 → Task 3 → Approval → End

### Industry-Specific Templates

**Tech Companies**:
- Code review workflow
- Release approval process
- Access request management

**Healthcare**:
- Patient onboarding
- Credential verification
- Compliance documentation

**Finance**:
- Loan approval process
- Account opening workflow
- Audit documentation

**Retail**:
- Vendor onboarding
- Inventory request
- Store opening checklist

---

## Integration Examples

### Email Integration
```json
{
  "actionId": "send_email",
  "parameters": {
    "to": "{{recipientEmail}}",
    "subject": "Action Required: {{workflowName}}",
    "body": "Please review and take action on {{taskName}}"
  }
}
```

### Slack Integration
```json
{
  "actionId": "send_slack_notification",
  "parameters": {
    "channel": "hr-notifications",
    "message": "New workflow started: {{workflowName}}",
    "mention": "@here"
  }
}
```

### HRMS Integration
```json
{
  "actionId": "update_hrms",
  "parameters": {
    "employeeId": "{{employeeId}}",
    "field": "status",
    "value": "active"
  }
}
```

---

## Metrics & Analytics

Track these metrics for workflow optimization:

- **Completion Rate**: % of workflows that reach End node
- **Average Duration**: Time from Start to End
- **Bottlenecks**: Nodes with longest wait times
- **Approval Times**: How long approvals take
- **Error Rate**: % of workflows that fail
- **User Satisfaction**: Feedback from workflow participants

---

## Next Steps

1. Review example workflows
2. Identify processes in your organization
3. Map current manual processes
4. Design workflows in the designer
5. Test with simulation
6. Deploy and monitor
7. Iterate based on feedback
