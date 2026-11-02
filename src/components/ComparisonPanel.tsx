import React from 'react';
import {type Plan } from './PlanCard';

interface ComparisonPanelProps {
  comparedPlans: Plan[];
  onRemoveFromCompare: (id: string) => void;
  onSelectPlan: (id: string) => void;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ comparedPlans, onRemoveFromCompare, onSelectPlan }) => {
  if (comparedPlans.length === 0) {
    return (
      <div className="bg-gray-50 border rounded-lg p-4 text-center text-gray-500">
        <p>No plans selected for comparison.</p>
        <p className="text-sm mt-1">Add up to 3 plans to compare their benefits.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-bold text-lg mb-3 text-blue-800">
        Comparison ({comparedPlans.length} of 3 selected)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparedPlans.map(plan => (
          <div key={plan.id} className="bg-white p-3 rounded border border-blue-100">
            <h4 className="font-bold">{plan.name}</h4>
            <p className="text-sm text-gray-600 mb-2">NGN {plan.monthlyPrice.toLocaleString()} / month</p>
            <div className="flex gap-2 mt-2">
              <button 
                onClick={() => onRemoveFromCompare(plan.id)}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
              >
                Remove
              </button>
              <button 
                onClick={() => onSelectPlan(plan.id)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Choose
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};