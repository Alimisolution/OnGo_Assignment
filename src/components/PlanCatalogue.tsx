import React, { useState } from 'react';
import {type Plan, PlanCard } from './PlanCard';
import { ComparisonPanel } from './ComparisonPanel';

interface PlanCatalogueProps {
  plans: Plan[];
  comparedPlanIds: string[];
  onAddToCompare: (id: string) => void;
  onRemoveFromCompare: (id: string) => void;
  onSelectPlan: (id: string) => void;
}

export const PlanCatalogue: React.FC<PlanCatalogueProps> = ({ 
  plans, comparedPlanIds, onAddToCompare, onRemoveFromCompare, onSelectPlan 
}) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('lowToHigh');

  // Filter and sort logic
  const filteredPlans = plans
    .filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory = category === 'All' || plan.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return sort === 'lowToHigh' ? a.monthlyPrice - b.monthlyPrice : b.monthlyPrice - a.monthlyPrice;
    });

  const comparedPlans = plans.filter(p => comparedPlanIds.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search plans..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          <option value="Motor">Motor</option>
          <option value="Health">Health</option>
          <option value="Travel">Travel</option>
        </select>
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Comparison Panel */}
      <ComparisonPanel 
        comparedPlans={comparedPlans} 
        onRemoveFromCompare={onRemoveFromCompare} 
        onSelectPlan={onSelectPlan} 
      />

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
      </p>

      {/* Plan Grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-lg font-semibold">No plans match your search</p>
          <button 
            onClick={() => { setSearch(''); setCategory('All'); setSort('lowToHigh'); }}
            className="mt-2 text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCompared={comparedPlanIds.includes(plan.id)}
              onAddToCompare={onAddToCompare}
              onSelectPlan={onSelectPlan}
            />
          ))}
        </div>
      )}
    </div>
  );
};