import React, { useState, useEffect, useRef } from 'react';
import { type Plan, PlanCard } from './PlanCard';
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
  const [appliedSearch, setAppliedSearch] = useState(''); // The debounced value
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('lowToHigh');
  
  // useRef holds the timer ID. It persists across renders without causing re-renders.
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // useEffect handles the 400ms debounce logic
  useEffect(() => {
    // 1. Clear any existing timer if the user types again
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 2. Set a new timer to update appliedSearch after 400ms of inactivity
    searchTimeoutRef.current = setTimeout(() => {
      setAppliedSearch(search);
    }, 400);

    // 3. Cleanup function: runs when the component unmounts or before the effect runs again
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]); // Only re-run this effect when 'search' changes

  // Filter using appliedSearch (the debounced value)
  const filteredPlans = plans
    .filter(plan => {
      const matchesSearch = plan.name.toLowerCase().includes(appliedSearch.toLowerCase().trim());
      const matchesCategory = category === 'All' || plan.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return sort === 'lowToHigh' ? a.monthlyPrice - b.monthlyPrice : b.monthlyPrice - a.monthlyPrice;
    });

  const comparedPlans = plans.filter(p => comparedPlanIds.includes(p.id));

  const handleClearFilters = () => {
    setSearch('');
    setAppliedSearch(''); // Immediately clear the applied search
    setCategory('All');
    setSort('lowToHigh');
    
    // Clear the timeout to prevent any pending search from applying after clearing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

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
          <p className="text-lg font-semibold mb-2">No plans match your search</p>
          <button 
            onClick={handleClearFilters}
            className="text-blue-600 hover:underline font-medium"
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