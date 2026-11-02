import { useState } from 'react';
import plansData from './data/plans.json';
import { PlanCatalogue } from './components/PlanCatalogue';
import { type Plan } from './components/PlanCard';

const plans: Plan[] = plansData as Plan[];

function App() {
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>([]);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const handleAddToCompare = (id: string) => {
    // Enforce the 3-plan limit
    if (comparedPlanIds.length >= 3 && !comparedPlanIds.includes(id)) {
      setShowLimitWarning(true);
      // Auto-hide the warning after 3 seconds
      setTimeout(() => setShowLimitWarning(false), 3000);
      return;
    }
    
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-3">
          <img src="/Picture1.png" alt="OnGo Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">OnGo Insurance</h1>
        </div>
      </header>

      <main className="py-8">
        {/* Limit Warning Banner */}
        {showLimitWarning && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm" role="alert">
              <p className="font-bold">Comparison Limit Reached</p>
              <p className="text-sm">You can only compare up to 3 plans at a time. Please remove a plan to add another.</p>
            </div>
          </div>
        )}

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