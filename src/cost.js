export function estimateCost(request, { creditsPerMinute = 1, wordsPerSecond = 2.5 } = {}) {
  const words = request.segments.reduce((total, segment) => total + segment.script.trim().split(/\s+/).filter(Boolean).length, 0);
  const estimatedSeconds = Math.max(1, Math.ceil(words / wordsPerSecond));
  const estimatedCredits = Number((estimatedSeconds / 60 * creditsPerMinute).toFixed(3));
  return { estimatedSeconds, estimatedCredits, words, assumption: { wordsPerSecond, creditsPerMinute } };
}

export function assertWithinBudget(estimate, config) {
  if (estimate.estimatedCredits > config.maxEstimatedCreditsPerJob) {
    throw new Error(`estimated cost ${estimate.estimatedCredits} exceeds local ceiling ${config.maxEstimatedCreditsPerJob}`);
  }
  return true;
}
