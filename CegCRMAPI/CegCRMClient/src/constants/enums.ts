export const CustomerType = {
  Person: 1,
  Business: 2,
} as const;

export const InteractionType = {
  Call: 1,
  Email: 2,
  Meeting: 3,
  Message: 4,
  Other: 5,
};

export const LeadSource = {
  Website: 1,
  Referral: 2,
  Event: 3,
  Email: 4,
  ColdCall: 5,
  Other: 6,
};

export const LeadStatus = {
  New: 1,
  InProgress: 2,
  Contacted: 3,
  Qualified: 4,
  Lost: 5,
  Converted: 6,
} as const;

export const IndustryType = {
  Technology: 1,
  Finance: 2,
  Health: 3,
  Retail: 4,
  Education: 5,
  Other: 6,
};

export const SaleStatus = {
  Proposal: 1,
  Negotiation: 2,
  Accepted: 3,
  Rejected: 4,
  Completed: 5,
};

export const TaskStatus = {
    Todo: 1,
    InProgress: 2,
    Completed: 3,
    Cancelled: 4,
  } as const;

export const TaskPriority =
{
    Low : 1,
    Medium : 2,
    High : 3,
    Critical : 4
}

export const TaskType =
{
    Call : 1,
    Email : 2,
    Meeting : 3,
    FollowUp : 4,
    Other : 5
}

export const TicketStatus = {
    Open: 1,
    ResolvedByAI: 2,
    AssignedToEmployee: 3,
    Closed: 4,
  } as const;