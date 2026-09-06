export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'supervisor' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type RequestType = 'purchase' | 'leave' | 'expense' | 'travel';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'final_approved';

export interface ApprovalRequest {
  id: string;
  code?: string;
  title: string;
  type: RequestType;
  description: string;
  status: RequestStatus;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  formData: Record<string, any>;
  currentStep: number;
}

export interface ApprovalStep {
  id: string;
  stepIndex: number;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  signature?: string;
  timestamp?: string;
}

export interface AuditEvent {
  id: string;
  type: 'created' | 'approved' | 'rejected' | 'commented' | 'forwarded';
  actorName: string;
  timestamp: string;
  details: string;
}

export interface RequestDetail extends ApprovalRequest {
  approvalChain: ApprovalStep[];
  auditLog: AuditEvent[];
}
