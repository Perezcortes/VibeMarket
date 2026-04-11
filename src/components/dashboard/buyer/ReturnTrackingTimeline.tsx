"use client";
import React from 'react';

export const ReturnTrackingTimeline = ({ history }: { history: any[] }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Estado de tu Devolución</h2>
      <div className="relative">
        {history.map((step, index) => (
          <div key={index} className="flex mb-8 last:mb-0">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-4 h-4 rounded-full border-2 ${step.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} />
              {index !== history.length - 1 && <div className="w-0.5 h-full bg-gray-200" />}
            </div>
            <div>
              <p className={`font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
              <p className="text-xs text-gray-500">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};