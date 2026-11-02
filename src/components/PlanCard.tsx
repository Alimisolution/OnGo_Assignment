import React from 'react';

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
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col">
      <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
      <span className="text-sm text-blue-600 font-semibold mb-2">{plan.category}</span>
      <p className="text-2xl font-bold text-gray-900 mb-4">
        NGN {plan.monthlyPrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ month</span>
      </p>
      
      <ul className="mb-4 grow">
        {plan.benefits.map((benefit, index) => (
          <li key={index} className="text-sm text-gray-600 mb-1 flex items-start">
            <span className="mr-2">✓</span> {benefit}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => onAddToCompare(plan.id)}
          disabled={isCompared}
          className={`w-full py-2 px-4 rounded font-medium transition ${
            isCompared 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isCompared ? 'In Comparison' : 'Add to Comparison'}
        </button>
        
        <button
          onClick={() => onSelectPlan(plan.id)}
          className="w-full py-2 px-4 rounded font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Choose Plan
        </button>
      </div>
    </div>
  );
};