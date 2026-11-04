import { useState, useEffect, useMemo, useRef } from 'react';
import { PlanCatalogue } from './components/PlanCatalogue';
import { type Plan } from './components/PlanCard';
import { CoverStep } from './components/CoverStep';
import { CustomerDetailsStep } from './components/CustomerDetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { SuccessScreen } from './components/SuccessScreen';
import { addons } from './data/addons';
import plansData from './data/plans.json';
import { loadDraft, saveDraft, clearDraft, type Draft } from './utils/draft';
import { simulateSubmission, resetAttemptCount } from './utils/submission';

const plans: Plan[] = plansData as Plan[];

type Step = 'browse' | 'cover' | 'details' | 'review' | 'success';

interface Customer {
  name: string;
  email: string;
  phone: string;
}

// Submission Failed

// We could not send your request. Please try again.

function App() {
  // Load initial draft ONCE on mount
  const initialLoad = useMemo(() => loadDraft(), []);
  const [storageWarning, setStorageWarning] = useState(initialLoad.warning);

  // Initialize state from the validated draft
  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>(initialLoad.draft.comparedPlanIds);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<Step>(initialLoad.draft.step);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialLoad.draft.selectedPlanId);
  const [quantity, setQuantity] = useState(initialLoad.draft.quantity);
  const [addonIds, setAddonIds] = useState<string[]>(initialLoad.draft.addonIds);
  const [customer, setCustomer] = useState(initialLoad.draft.customer);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  
  // Ref to prevent double-clicks
  const isSubmittingRef = useRef(false);

  const [catalogueKey, setCatalogueKey] = useState(0);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || null;

  const monthlyTotal = useMemo(() => {
    if (!selectedPlan) return 0;
    const selectedAddons = addons.filter(a => addonIds.includes(a.id));
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const unitSubtotal = selectedPlan.monthlyPrice + addonsTotal;
    return unitSubtotal * quantity;
  }, [selectedPlan, addonIds, quantity]);

  // Auto-save effect (only when not in success state)
  useEffect(() => {
    if (currentStep === 'success') return; // Don't save after success

    const draftToSave: Draft = {
      version: 1, comparedPlanIds, selectedPlanId, quantity, addonIds, customer, step: currentStep,
    };
    
    const isDefault = 
      comparedPlanIds.length === 0 && selectedPlanId === null && quantity === 1 &&
      addonIds.length === 0 && customer.name === '' && customer.email === '' && customer.phone === '' &&
      currentStep === 'browse';

    if (isDefault) {
      clearDraft();
      return;
    }

    const error = saveDraft(draftToSave);
    if (error) {
      setStorageWarning(error);
      const timer = setTimeout(() => setStorageWarning(null), 5000);
      return () => clearTimeout(timer);
    } else {
      setStorageWarning(null);
    }
  }, [comparedPlanIds, selectedPlanId, quantity, addonIds, customer, currentStep]);

  // --- Handlers ---
  const handleAddToCompare = (id: string) => {
    if (comparedPlanIds.length >= 3 && !comparedPlanIds.includes(id)) {
      setShowLimitWarning(true);
      setTimeout(() => setShowLimitWarning(false), 3000);
      return;
    }
    if (!comparedPlanIds.includes(id)) setComparedPlanIds([...comparedPlanIds, id]);
  };

  const handleRemoveFromCompare = (id: string) => setComparedPlanIds(comparedPlanIds.filter(planId => planId !== id));
  const handleSelectPlan = (id: string) => { setSelectedPlanId(id); setCurrentStep('cover'); };
  const handleChangePlan = () => setCurrentStep('browse');
  const handleUpdateQuantity = (newQty: number) => { if (newQty >= 1 && newQty <= 5) setQuantity(newQty); };
  
  const handleToggleAddon = (addonId: string) => {
    setAddonIds(prev => prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]);
  };

  const handleResetCover = () => { setQuantity(1); setAddonIds([]); };
  const handleContinueToDetails = () => setCurrentStep('details');
  const handleBackToCover = () => setCurrentStep('cover');
  const handleContinueToReview = () => setCurrentStep('review');
  const handleEditDetails = () => setCurrentStep('details');

  const handleSubmitQuote = async () => {
    // Guard against double-clicks
    if (isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await simulateSubmission();
      
      if (result.success && result.reference) {
        setSuccessReference(result.reference);
        clearDraft(); // Clear the draft on success
        setCurrentStep('success');
      } else {
        setSubmissionError(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleStartNewQuote = () => {
    setComparedPlanIds([]);
    setSelectedPlanId(null);
    setQuantity(1);
    setAddonIds([]);
    setCustomer({ name: '', email: '', phone: '' });
    setCurrentStep('browse');
    setSuccessReference(null);
    setSubmissionError(null);
    setCatalogueKey(prev => prev + 1);
    clearDraft();
    resetAttemptCount(); // Reset for next submission cycle
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear all your selections and saved progress.')) {
      handleStartNewQuote();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Picture1.png" alt="OnGo Logo" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-gray-800">OnGo Insurance</h1>
          </div>
          {currentStep !== 'success' && (
            <button
              onClick={handleStartOver}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      <main className="py-8">
        {/* Warnings */}
        {storageWarning && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-4 rounded shadow-sm" role="alert">
              <p className="font-bold">Storage Warning</p>
              <p className="text-sm">{storageWarning}</p>
            </div>
          </div>
        )}

        {showLimitWarning && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm" role="alert">
              <p className="font-bold">Comparison Limit Reached</p>
              <p className="text-sm">You can only compare up to 3 plans at a time.</p>
            </div>
          </div>
        )}

        {/* Steps */}
        {currentStep === 'browse' && (
          <PlanCatalogue 
            key={catalogueKey}
            plans={plans}
            comparedPlanIds={comparedPlanIds}
            onAddToCompare={handleAddToCompare}
            onRemoveFromCompare={handleRemoveFromCompare}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentStep === 'cover' && selectedPlan && (
          <CoverStep
            selectedPlan={selectedPlan}
            quantity={quantity}
            addonIds={addonIds}
            onChangePlan={handleChangePlan}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleAddon={handleToggleAddon}
            onResetCover={handleResetCover}
            onContinue={handleContinueToDetails}
          />
        )}

        {currentStep === 'details' && (
          <CustomerDetailsStep
            customer={customer}
            onUpdateCustomer={setCustomer}
            onBack={handleBackToCover}
            onContinue={handleContinueToReview}
          />
        )}

        {currentStep === 'review' && selectedPlan && (
          <ReviewStep
            selectedPlan={selectedPlan}
            quantity={quantity}
            addonIds={addonIds}
            customer={customer}
            monthlyTotal={monthlyTotal}
            onEditCover={handleChangePlan}
            onEditDetails={handleEditDetails}
            onSubmit={handleSubmitQuote}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        )}

        {currentStep === 'success' && selectedPlan && successReference && (
          <SuccessScreen
            reference={successReference}
            selectedPlan={selectedPlan}
            quantity={quantity}
            monthlyTotal={monthlyTotal}
            customerName={customer.name}
            onStartNewQuote={handleStartNewQuote}
          />
        )}
      </main>
    </div>
  );
}

export default App;