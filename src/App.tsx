import { useState, useEffect, useMemo, useRef } from 'react';
import { PlanCatalogue } from './components/PlanCatalogue';
import { type Plan } from './components/PlanCard';
import { CoverStep } from './components/CoverStep';
import { CustomerDetailsStep } from './components/CustomerDetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { SuccessScreen } from './components/SuccessScreen';
import { HeroSection } from './components/HeroSection';
import { Footer } from './components/Footer';
import { addons } from './data/addons';
import plansData from './data/plans.json';
import { loadDraft, saveDraft, clearDraft, type Draft } from './utils/draft';
import { simulateSubmission, resetAttemptCount } from './utils/submission';

const plans: Plan[] = plansData as Plan[];

type Step = 'browse' | 'cover' | 'details' | 'review' | 'success';

function App() {
  const initialLoad = useMemo(() => loadDraft(), []);
  const [storageWarning, setStorageWarning] = useState(initialLoad.warning);

  const [comparedPlanIds, setComparedPlanIds] = useState<string[]>(initialLoad.draft.comparedPlanIds);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  const [currentStep, setCurrentStep] = useState<Step>(initialLoad.draft.step);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(initialLoad.draft.selectedPlanId);
  const [quantity, setQuantity] = useState(initialLoad.draft.quantity);
  const [addonIds, setAddonIds] = useState<string[]>(initialLoad.draft.addonIds);
  const [customer, setCustomer] = useState(initialLoad.draft.customer);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  
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

  useEffect(() => {
    if (currentStep === 'success') return;

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
    if (isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await simulateSubmission();
      
      if (result.success && result.reference) {
        setSuccessReference(result.reference);
        clearDraft();
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
    resetAttemptCount();
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear all your selections and saved progress.')) {
      handleStartNewQuote();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="shadow-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Picture1.png" alt="OnGo Logo" className="h-16 w-auto" />
          </div>
          {currentStep !== 'success' && (
            <button
              onClick={handleStartOver}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-ongo-navy border border-ongo-navy rounded hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Warnings */}
        {storageWarning && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-800 p-4 rounded shadow-sm" role="alert">
              <p className="font-bold">Storage Warning</p>
              <p className="text-sm">{storageWarning}</p>
            </div>
          </div>
        )}

        {showLimitWarning && (
          <div className="max-w-6xl mx-auto px-4 pt-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm" role="alert">
              <p className="font-bold">Comparison Limit Reached</p>
              <p className="text-sm">You can only compare up to 3 plans at a time.</p>
            </div>
          </div>
        )}

        {/* Steps */}
        {currentStep === 'browse' && (
          <>
            <HeroSection />
            <div className="bg-gray-50 py-12">
              <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-ongo-navy mb-8 text-center">Choose Your Plan</h2>
                <PlanCatalogue 
                  key={catalogueKey}
                  plans={plans}
                  comparedPlanIds={comparedPlanIds}
                  onAddToCompare={handleAddToCompare}
                  onRemoveFromCompare={handleRemoveFromCompare}
                  onSelectPlan={handleSelectPlan}
                />
              </div>
            </div>
          </>
        )}

        {currentStep === 'cover' && selectedPlan && (
          <div className="py-12">
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
          </div>
        )}

        {currentStep === 'details' && (
          <div className="py-12">
            <CustomerDetailsStep
              customer={customer}
              onUpdateCustomer={setCustomer}
              onBack={handleBackToCover}
              onContinue={handleContinueToReview}
            />
          </div>
        )}

        {currentStep === 'review' && selectedPlan && (
          <div className="py-12">
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
          </div>
        )}

        {currentStep === 'success' && selectedPlan && successReference && (
          <div className="py-12">
            <SuccessScreen
              reference={successReference}
              selectedPlan={selectedPlan}
              quantity={quantity}
              monthlyTotal={monthlyTotal}
              customerName={customer.name}
              onStartNewQuote={handleStartNewQuote}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;