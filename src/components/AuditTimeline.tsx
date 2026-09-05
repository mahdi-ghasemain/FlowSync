import React from 'react';
import { AuditEvent } from '../types';

interface AuditTimelineProps {
  events: AuditEvent[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'created': return '📝';
      case 'approved': return '✅';
      case 'rejected': return '❌';
      case 'commented': return '💬';
      case 'forwarded': return '➡️';
      default: return '📌';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'created': return 'border-blue-500 bg-blue-50';
      case 'approved': return 'border-green-500 bg-green-50';
      case 'rejected': return 'border-red-500 bg-red-50';
      case 'commented': return 'border-yellow-500 bg-yellow-50';
      case 'forwarded': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-gray-600 mb-4">📜 تاریخچه رویدادها</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute right-5 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-4">
          {[...events].reverse().map((event, index) => (
            <div key={event.id} className="relative flex items-start gap-4 pr-12">
              {/* Node */}
              <div className={`absolute right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 ${getEventColor(event.type)} z-10`}>
                {getEventIcon(event.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800">{event.actorName}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(event.timestamp).toLocaleDateString('fa-IR')} {new Date(event.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{event.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditTimeline;
