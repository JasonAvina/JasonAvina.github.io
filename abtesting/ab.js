
// Global variables to store simulation data
let populationParams = null;
let sampleData = null;
let testResults = null;

// Box-Muller transform for generating normal random numbers
function generateNormal(mean, std) {
  let u1 = Math.random();
  let u2 = Math.random();
  let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * std + mean;
}

// Generate random samples from two populations
function generateSamples() {
  // True population parameters (inspired by Kaiser Permanente study)
  populationParams = {
    trueMean1: 8.2,  // ACE inhibitors mean BP reduction
    trueMean2: 6.5,  // Beta blockers mean BP reduction  
    trueStd1: 4.0,   // Standard deviation group 1
    trueStd2: 4.24,  // Standard deviation group 2
    n1: 50,          // Sample size group 1
    n2: 48           // Sample size group 2
  };

  const { trueMean1, trueMean2, trueStd1, trueStd2, n1, n2 } = populationParams;

  // Generate samples
  const sample1 = Array.from({length: n1}, () => generateNormal(trueMean1, trueStd1));
  const sample2 = Array.from({length: n2}, () => generateNormal(trueMean2, trueStd2));

  // Calculate sample statistics
  const mean1 = sample1.reduce((a, b) => a + b) / n1;
  const mean2 = sample2.reduce((a, b) => a + b) / n2;
  
  const variance1 = sample1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (n1 - 1);
  const variance2 = sample2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (n2 - 1);
  
  const std1 = Math.sqrt(variance1);
  const std2 = Math.sqrt(variance2);

  sampleData = {
    n1, n2, mean1, mean2, std1, std2, variance1, variance2, sample1, sample2
  };

  // Display sample results
  displaySampleResults();
  
  // Enable t-test button
  document.getElementById('testBtn').disabled = false;
  document.getElementById('resultsDisplay').style.display = 'block';
  document.getElementById('resultsDisplay').classList.add('fade-in');
}

function displaySampleResults() {
  const { n1, n2, mean1, mean2, std1, std2 } = sampleData;
  
  const statsGrid = document.getElementById('sampleStatsGrid');
  statsGrid.innerHTML = `
    <div class="stat-item">
      <span class="stat-value">${n1}</span>
      <div class="stat-label">ACE Inhibitors<br>Sample Size</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${mean1.toFixed(2)}</span>
      <div class="stat-label">ACE Mean BP<br>Reduction (mmHg)</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${std1.toFixed(2)}</span>
      <div class="stat-label">ACE Standard<br>Deviation</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${n2}</span>
      <div class="stat-label">Beta Blockers<br>Sample Size</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${mean2.toFixed(2)}</span>
      <div class="stat-label">Beta Mean BP<br>Reduction (mmHg)</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${std2.toFixed(2)}</span>
      <div class="stat-label">Beta Standard<br>Deviation</div>
    </div>
  `;
}

function performTTest() {
  const { n1, n2, mean1, mean2, variance1, variance2 } = sampleData;

  // Calculate Welch's t-statistic
  const standardError = Math.sqrt(variance1/n1 + variance2/n2);
  const tStatistic = (mean1 - mean2) / standardError;

  // Calculate degrees of freedom using Welch-Satterthwaite equation
  const df = Math.pow(variance1/n1 + variance2/n2, 2) / 
             (Math.pow(variance1/n1, 2)/(n1-1) + Math.pow(variance2/n2, 2)/(n2-1));

  // Calculate approximate p-value
  const absTStat = Math.abs(tStatistic);
  let pValue;
  
  if (absTStat > 4) pValue = 0.0001;
  else if (absTStat > 3) pValue = 0.002;
  else if (absTStat > 2.5) pValue = 0.02;
  else if (absTStat > 2) pValue = 0.05;
  else if (absTStat > 1.96) pValue = 0.052;
  else if (absTStat > 1.5) pValue = 0.15;
  else pValue = 0.25;

  const criticalValue = 1.985; // Approximate for large df
  const reject = Math.abs(tStatistic) > criticalValue;

  testResults = {
    tStatistic, df, pValue, standardError, reject, criticalValue
  };

  displayTestResults();
  
  // Enable reveal button
  document.getElementById('revealBtn').disabled = false;
}

function displayTestResults() {
  const { tStatistic, df, pValue, standardError, reject, criticalValue } = testResults;
  const { mean1, mean2 } = sampleData;
  
  const testStatsDiv = document.getElementById('testStatistics');
  testStatsDiv.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${tStatistic.toFixed(3)}</span>
        <div class="stat-label">t-statistic</div>
      </div>
      <div class="stat-item">
        <span class="stat-value">${df.toFixed(1)}</span>
        <div class="stat-label">Degrees of Freedom</div>
      </div>
      <div class="stat-item">
        <span class="stat-value">${pValue.toFixed(3)}</span>
        <div class="stat-label">p-value</div>
      </div>
      <div class="stat-item">
        <span class="stat-value">±${criticalValue}</span>
        <div class="stat-label">Critical Value</div>
      </div>
    </div>
    
    <div class="conclusion ${reject ? 'reject' : ''}">
      <h4>${reject ? '🚫 Reject H₀' : '✅ Fail to Reject H₀'}</h4>
      <p><strong>Decision:</strong> ${reject ? 
        `There IS a statistically significant difference between treatments (p = ${pValue.toFixed(3)} < 0.05)` :
        `There is NO statistically significant difference between treatments (p = ${pValue.toFixed(3)} ≥ 0.05)`
      }</p>
      <p><strong>Effect Size:</strong> ACE inhibitors reduced BP by ${(mean1 - mean2).toFixed(2)} mmHg more than beta blockers on average.</p>
    </div>
  `;

  document.getElementById('testResults').style.display = 'block';
}

function revealTrueParams() {
  const { trueMean1, trueMean2, trueStd1, trueStd2 } = populationParams;
  const { mean1, mean2 } = sampleData;
  const { reject } = testResults;
  
  const trueParamsDiv = document.getElementById('trueParamsContent');
  trueParamsDiv.innerHTML = `
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-value">${trueMean1}</span>
        <div class="stat-label">True ACE Mean</div>
      </div>
      <div class="stat-item">
        <span class="stat-value">${trueMean2}</span>
        <div class="stat-label">True Beta Mean</div>
      </div>
      <div class="stat-item">
        <span class="stat-value">${(trueMean1 - trueMean2).toFixed(1)}</span>
        <div class="stat-label">True Difference</div>
      </div>
      <div class="stat-item">
        <span class="stat-value">${(mean1 - mean2).toFixed(2)}</span>
        <div class="stat-label">Sample Difference</div>
      </div>
    </div>
  `;

  // Assess test accuracy
  const trueDifference = trueMean1 - trueMean2;
  const correctDecision = (trueDifference !== 0 && reject) || (trueDifference === 0 && !reject);
  
  const accuracyDiv = document.getElementById('accuracyContent');
  accuracyDiv.innerHTML = `
    <p><strong>True Population Difference:</strong> ${trueDifference.toFixed(1)} mmHg</p>
    <p><strong>Statistical Decision:</strong> ${reject ? 'Significant difference detected' : 'No significant difference detected'}</p>
    <p><strong>Test Accuracy:</strong> <span class="highlight">${correctDecision ? 'CORRECT' : 'INCORRECT'}</span> - 
    ${correctDecision ? 
      'The statistical test correctly identified the true relationship!' : 
      'The statistical test made an error (this happens due to random sampling)'
    }</p>
    <p><em>Note: With repeated sampling, the test would be correct about 95% of the time when α = 0.05</em></p>
  `;

  document.getElementById('trueParams').style.display = 'block';
  document.getElementById('accuracyCheck').style.display = 'block';
}

// Add scroll animation for skill cards
document.addEventListener('DOMContentLoaded', function() {
  const skillCards = document.querySelectorAll('.skill-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  });

  skillCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
});
