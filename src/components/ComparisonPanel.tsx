import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { type Plan } from './PlanCard';

interface ComparisonPanelProps {
  comparedPlans: Plan[];
  onRemoveFromCompare: (id: string) => void;
  onSelectPlan: (id: string) => void;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ comparedPlans, onRemoveFromCompare, onSelectPlan }) => {
  if (comparedPlans.length === 0) {
    return (
      <div className="bg-ongo-navy-light/50 border-2 border-dashed border-ongo-navy/20 rounded-lg p-6 text-center">
        <p className="text-ongo-navy font-semibold mb-1">No plans selected for comparison</p>
        <p className="text-sm text-gray-600">Add up to 3 plans to compare their benefits side by side</p>
      </div>
    );
  }

  return (
    <div className="bg-ongo-navy border border-ongo-yellow/30 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-ongo-yellow" />
          Comparison ({comparedPlans.length} of 3 selected)
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparedPlans.map(plan => (
          <div key={plan.id} className="bg-white p-4 rounded border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-ongo-navy">{plan.name}</h4>
              <button 
                onClick={() => onRemoveFromCompare(plan.id)}
                className="text-red-500 hover:text-red-700 transition"
                aria-label={`Remove ${plan.name} from comparison`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">NGN {plan.monthlyPrice.toLocaleString()} / month</p>
            <ul className="space-y-1 mb-3">
              {plan.benefits.map((benefit, idx) => (
                <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 text-ongo-yellow flex-shrink-0 mt-0.5" />
                  {benefit}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onSelectPlan(plan.id)}
              className="w-full text-xs bg-ongo-yellow text-ongo-navy px-3 py-2 rounded font-semibold hover:bg-ongo-yellow-light transition"
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};