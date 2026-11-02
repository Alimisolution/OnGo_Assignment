import { useState } from 'react';
import plansData from './data/plans.json';
import { PlanCatalogue } from './components/PlanCatalogue';
import {type Plan } from './components/PlanCard';


const plans: Plan[] = plansData as Plan[];

function App() {
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);

  const handleAddToCompare = (id: string) => {
    if (!comparedPlanIds.includes(id)) {
      setComparedPlanIds([...comparedPlanIds, id]);
    }
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparedPlanIds(comparedPlanIds.filter(planId => planId !== id));
  };

  const handleSelectPlan = (id: string) => {
    alert(`You chose plan: ${id}. We will build the Quote steps next!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-3">
          <img src="/Picture1.png" alt="OnGo Logo" className="h-10 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <PlanCatalogue 
          plans={plans}
          comparedPlanIds={comparedPlanIds}
          onAddToCompare={handleAddToCompare}
          onRemoveFromCompare={handleRemoveFromCompare}
          onSelectPlan={handleSelectPlan}
        />
      </main>
    </div>
  );
}

export default App;