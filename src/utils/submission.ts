// This simulates an API call with a 1500ms delay
// The first attempt after app load or a new quote MUST fail (for testing)
// The second attempt MUST succeed

let attemptCount = 0;

export function resetAttemptCount() {
  attemptCount = 0;
}

export function incrementAttemptCount() {
  attemptCount++;
}

export function getAttemptCount() {
  return attemptCount;
}

export interface SubmissionResult {
  success: boolean;
  reference?: string;
  error?: string;
}

export async function simulateSubmission(): Promise<SubmissionResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  incrementAttemptCount();
  
  // First attempt always fails (for testing purposes)
  if (attemptCount === 1) {
    return {
      success: false,
      error: 'We could not send your request. Please try again.'
    };
  }
  
  // Second and subsequent attempts succeed
  const reference = `ONGO-DEMO-${String(attemptCount).padStart(3, '0')}`;
  return {
    success: true,
    reference
  };
}