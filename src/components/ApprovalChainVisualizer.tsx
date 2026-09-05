import React from 'react';
import { ApprovalStep } from '../types';

interface ApprovalChainVisualizerProps {
  steps: ApprovalStep[];
  currentStep: number;
}

const ApprovalChainVisualizer: React.FC<ApprovalChainVisualizerProps> = ({ steps, currentStep }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return '✅';
      case 'rejected': return '❌';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string, index: number) => {
    if (status === 'approved') return 'border-green-500 bg-green-50';
    if (status === 'rejected') return 'border-red-500 bg-red-50';
    if (index === currentStep) return 'border-primary-500 bg-primary-50 ring-2 ring-primary-200';
    return 'border-gray-300 bg-gray-50';
  };

  const getLineColor = (status: string) => {
    if (status === 'approved') return 'bg-green-500';
    return 'bg-gray-300';
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-gray-600 mb-4">📋 زنجیره تأیید</h3>
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 ${getStatusColor(step.status, index)} transition-all`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-white border-2 border-current shrink-0">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-800">{step.approverName}</div>
                <div className="text-xs text-gray-500">{step.approverRole}</div>
              </div>
              <div className="text-xs text-gray-500 shrink-0">
                {step.status === 'approved' && step.timestamp
                  ? new Date(step.timestamp).toLocaleDateString('fa-IR')
                  : step.status === 'pending' ? 'در انتظار' : ''}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-0.5 h-6 ${getLineColor(step.status)} transition-all`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ApprovalChainVisualizer;
