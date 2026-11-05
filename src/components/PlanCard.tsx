import React from 'react';
import { CheckCircle, PlusCircle } from 'lucide-react';

export interface Plan {
  id: string;
  name: string;
  category: string;
  monthlyPrice: number;
  benefits: string[];
}

interface PlanCardProps {
  plan: Plan;
  isCompared: boolean;
  onAddToCompare: (id: string) => void;
  onSelectPlan: (id: string) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isCompared, onAddToCompare, onSelectPlan }) => {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-xl hover:border-ongo-yellow/50 transition-all bg-white flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-ongo-navy">{plan.name}</h3>
        <span className="text-xs font-semibold bg-ongo-navy text-white px-3 py-1 rounded-full">
          {plan.category}
        </span>
      </div>
      
      <p className="text-3xl font-bold text-ongo-navy mb-4">
        NGN {plan.monthlyPrice.toLocaleString()}
        <span className="text-sm font-normal text-gray-500 ml-1">/ month</span>
      </p>
      
      <ul className="mb-6 flex-grow space-y-2">
        {plan.benefits.map((benefit, index) => (
          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-ongo-yellow flex-shrink-0 mt-0.5" />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => onAddToCompare(plan.id)}
          disabled={isCompared}
          className={`w-full py-2 px-4 rounded font-medium transition flex items-center justify-center gap-2 ${
            isCompared 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-ongo-navy text-white hover:bg-ongo-navy-light'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          {isCompared ? 'In Comparison' : 'Add to Comparison'}
        </button>
        
        <button
          onClick={() => onSelectPlan(plan.id)}
          className="w-full py-2 px-4 rounded font-medium bg-ongo-yellow text-ongo-navy hover:bg-ongo-yellow-light transition"
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
};