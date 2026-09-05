import { create } from 'zustand';
import { ApprovalRequest, RequestDetail } from '../types';

interface RequestState {
  requests: ApprovalRequest[];
  pendingApprovals: ApprovalRequest[];
  currentRequest: RequestDetail | null;
  loading: boolean;
  error: string | null;
  setRequests: (requests: ApprovalRequest[]) => void;
  setPendingApprovals: (approvals: ApprovalRequest[]) => void;
  setCurrentRequest: (request: RequestDetail | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRequestStore = create<RequestState>((set) => ({
  requests: [],
  pendingApprovals: [],
  currentRequest: null,
  loading: false,
  error: null,
  setRequests: (requests) => set({ requests }),
  setPendingApprovals: (approvals) => set({ pendingApprovals: approvals }),
  setCurrentRequest: (request) => set({ currentRequest: request }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
