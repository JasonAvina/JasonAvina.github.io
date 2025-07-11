// Sample data for different topics
const topicData = {
  'artificial intelligence': {
    positive: 58,
    negative: 22,
    neutral: 20,
    totalPosts: 127,
    platform: 'Reddit r/technology',
    timeframe: 'Last 48 hours',
    keyThemes: ['innovation', 'job impact', 'efficiency', 'future potential'],
    sampleComments: {
      positive: [
        "AI is revolutionizing how we approach complex problems. The efficiency gains are incredible!",
        "ChatGPT has saved me hours of coding work. This technology is a game-changer.",
        "The potential for AI in healthcare and research is absolutely mind-blowing."
      ],
      negative: [
        "Worried about AI replacing too many jobs too quickly without proper transition support.",
        "The hype around AI is getting out of control. Most applications are still pretty limited.",
        "Privacy concerns with AI data collection are really starting to worry me."
      ],
      neutral: [
        "AI is a tool like any other - depends entirely on how humans choose to use it.",
        "The technology is impressive but we need better regulation and ethical guidelines."
      ]
    },
    insights: [
      "Strong optimism about productivity and innovation benefits",
      "Primary concerns center around job displacement and privacy",
      "Healthcare and education applications generate most excitement",
      "Regulation and ethical AI development are emerging priorities"
    ],
    businessApps: [
      "Monitor AI product launch sentiment and feature requests",
      "Track competitive positioning in AI market",
      "Identify customer concerns for proactive communication",
      "Guide product development based on user feedback themes"
    ]
  },
  
  'remote work': {
    positive: 45,
    negative: 35,
    neutral: 20,
    totalPosts: 203,
    platform: 'Reddit r/jobs, r/remotework',
    timeframe: 'Last 3 days',
    keyThemes: ['work-life balance', 'productivity', 'isolation', 'flexibility'],
    sampleComments: {
      positive: [
        "Remote work has completely transformed my work-life balance. Never going back to office!",
        "My productivity has actually increased working from home. Fewer distractions.",
        "Being able to work from anywhere has opened up so many job opportunities."
      ],
      negative: [
        "The isolation is really getting to me. Miss the casual conversations with colleagues.",
        "Harder to collaborate on complex projects when everyone is remote.",
        "My company is pushing return-to-office and I'm dreading losing this flexibility."
      ],
      neutral: [
        "Remote work works for some roles but not others. Really depends on the job.",
        "Hybrid seems like the best compromise - some days remote, some in office."
      ]
    },
    insights: [
      "Work-life balance remains the top benefit of remote work",
      "Social isolation and collaboration challenges are main drawbacks",
      "Return-to-office policies creating significant employee anxiety",
      "Hybrid work models gaining traction as compromise solution"
    ],
    businessApps: [
      "Track employee sentiment around return-to-office policies",
      "Monitor competitive advantage in remote work offerings",
      "Identify pain points in remote work tools and processes",
      "Guide HR policy decisions based on employee feedback"
    ]
  },
  
  'cryptocurrency': {
    positive: 28,
    negative: 52,
    neutral: 20,
    totalPosts: 189,
    platform: 'Reddit r/cryptocurrency, r/Bitcoin',
    timeframe: 'Last 24 hours',
    keyThemes: ['market volatility', 'regulation', 'institutional adoption', 'technology potential'],
    sampleComments: {
      positive: [
        "Long-term, blockchain technology will revolutionize finance. Still bullish despite volatility.",
        "Major institutions adopting crypto shows this isn't going anywhere.",
        "DeFi is creating financial opportunities that never existed before."
      ],
      negative: [
        "Lost way too much money in this market. Feels like gambling at this point.",
        "Regulatory uncertainty is killing confidence. Need clearer government guidance.",
        "Energy consumption of Bitcoin mining is environmentally irresponsible."
      ],
      neutral: [
        "Crypto is still experimental technology. High risk, high reward.",
        "Waiting for more regulatory clarity before making significant investments."
      ]
    },
    insights: [
      "Market sentiment heavily influenced by recent price volatility",
      "Regulatory uncertainty creating significant investor anxiety",
      "Environmental concerns about energy usage growing",
      "Institutional adoption viewed as key legitimacy factor"
    ],
    businessApps: [
      "Monitor sentiment before major crypto product announcements",
      "Track regulatory sentiment to guide compliance strategy",
      "Identify emerging concerns to address in marketing",
      "Guide investment timing based on market mood"
    ]
  },
  
  'climate change': {
    positive: 35,
    negative: 45,
    neutral: 20,
    totalPosts: 156,
    platform: 'Reddit r/environment, r/climatechange',
    timeframe: 'Last 72 hours',
    keyThemes: ['urgency', 'policy action', 'renewable energy', 'corporate responsibility'],
    sampleComments: {
      positive: [
        "Renewable energy costs dropping faster than expected. There's real hope for the future.",
        "Seeing more companies commit to carbon neutrality. Corporate momentum is building.",
        "Young people are driving real political change on climate issues."
      ],
      negative: [
        "We're not moving fast enough. The latest climate reports are absolutely terrifying.",
        "Corporate greenwashing is everywhere. Need real action, not just PR statements.",
        "Political inaction is frustrating. Climate change shouldn't be a partisan issue."
      ],
      neutral: [
        "Climate change is real but solutions require balanced economic and environmental thinking.",
        "Technology will play a key role but we also need behavior and policy changes."
      ]
    },
    insights: [
      "Urgency and frustration with pace of change dominate discussions",
      "Renewable energy progress provides some optimism",
      "Corporate greenwashing criticism increasingly common",
      "Youth activism and political engagement seen as key drivers"
    ],
    businessApps: [
      "Monitor sentiment around corporate sustainability initiatives",
      "Track public opinion on environmental policies",
      "Identify greenwashing concerns to avoid in marketing",
      "Guide CSR strategy based on public priorities"
    ]
  }
};

// Generate realistic random data for custom topics
function generateRandomData(topic) {
  const sentiments = [
    { positive: 45 + Math.random() * 30, negative: 25 + Math.random() * 30, neutral: 15 + Math.random() * 20 },
    { positive: 35 + Math.random() * 25, negative: 35 + Math.random() * 25, neutral: 20 + Math.random() * 20 },
    { positive: 60 + Math.random() * 25, negative: 15 + Math.random() * 20, neutral: 15 + Math.random() * 15 }
  ];
  
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const total = randomSentiment.positive + randomSentiment.negative + randomSentiment.neutral;
  
  return {
    positive: Math.round((randomSentiment.positive / total) * 100),
    negative: Math.round((randomSentiment.negative / total) * 100),
    neutral: Math.round((randomSentiment.neutral / total) * 100),
    totalPosts: 75 + Math.floor(Math.random() * 150),
    platform: 'Reddit r/technology, r/news',
    timeframe: 'Last 48 hours',
    keyThemes: ['discussion trends', 'public opinion', 'social impact', 'emerging topics'],
    sampleComments: {
      positive: [
        `Really excited about the developments in ${topic}. This could be transformative!`,
        `${topic} is showing a lot of promise. Interested to see where this goes.`,
        `The potential impact of ${topic} on society could be huge in a positive way.`
      ],
      negative: [
        `Concerned about the implications of ${topic}. Need more careful consideration.`,
        `Too much hype around ${topic}. We should be more cautious about adoption.`,
        `The risks associated with ${topic} aren't being discussed enough.`
      ],
      neutral: [
        `${topic} is interesting but we need more data to make informed decisions.`,
        `Like any new development, ${topic} has both benefits and drawbacks to consider.`
      ]
    },
    insights: [
      `Public awareness of ${topic} is growing rapidly`,
      `Mixed opinions reflect early-stage technology/concept adoption`,
      `Key concerns focus on implementation and long-term effects`,
      `More research and discussion needed for informed consensus`
    ],
    businessApps: [
      `Monitor brand sentiment around ${topic} initiatives`,
      `Track emerging trends and public opinion shifts`,
      `Identify key concerns to address in communications`,
      `Guide strategy based on public sentiment trends`
    ]
  };
}

function analyzeTopic(topic) {
  // Show loading state
  showLoadingState(topic);
  
  // Get data for this topic
  const data = topicData[topic.toLowerCase()] || generateRandomData(topic);
  
  // Simulate processing time
  setTimeout(() => {
    displayResults(topic, data);
  }, 3000);
}

function analyzeCustomTopic() {
  const input = document.getElementById('customTopic');
  const topic = input.value.trim();
  
  if (!topic) {
    alert('Please enter a topic to analyze!');
    return;
  }
  
  analyzeTopic(topic);
  input.value = ''; // Clear input
}

function showLoadingState(topic) {
  const resultsDisplay = document.getElementById('resultsDisplay');
  const analysisStatus = document.getElementById('analysisStatus');
  
  // Hide all result sections
  document.getElementById('sentimentResults').style.display = 'none';
  document.getElementById('sampleComments').style.display = 'none';
  document.getElementById('insightsResults').style.display = 'none';
  document.getElementById('businessImpact').style.display = 'none';
  
  // Show loading
  resultsDisplay.style.display = 'block';
  analysisStatus.style.display = 'block';
  
  // Update loading text
  analysisStatus.querySelector('h3').textContent = `🔄 Analyzing "${topic}" mentions...`;
  
  // Scroll to results
  resultsDisplay.scrollIntoView({ behavior: 'smooth' });
}

function displayResults(topic, data) {
  // Hide loading
  document.getElementById('analysisStatus').style.display = 'none';
  
  // Show and populate sentiment results
  displaySentimentResults(topic, data);
  displaySampleComments(data);
  displayInsights(data);
  displayBusinessImpact(data);
  
  // Show all result sections with animation
  const sections = ['sentimentResults', 'sampleComments', 'insightsResults', 'businessImpact'];
  sections.forEach((sectionId, index) => {
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      section.style.display = 'block';
      section.classList.add('fade-in');
    }, index * 300);
  });
}

function displaySentimentResults(topic, data) {
  const summaryDiv = document.getElementById('analysisSummary');
  const statsGrid = document.getElementById('sentimentStatsGrid');
  
  summaryDiv.innerHTML = `
    <h4>📊 Analyzing "${topic}" from ${data.platform}</h4>
    <p><strong>Timeframe:</strong> ${data.timeframe} • <strong>Posts Analyzed:</strong> ${data.totalPosts}</p>
  `;
  
  statsGrid.innerHTML = `
    <div class="stat-item">
      <span class="stat-value" style="color: #28a745;">${data.positive}%</span>
      <div class="stat-label">Positive Sentiment</div>
    </div>
    <div class="stat-item">
      <span class="stat-value" style="color: #dc3545;">${data.negative}%</span>
      <div class="stat-label">Negative Sentiment</div>
    </div>
    <div class="stat-item">
      <span class="stat-value" style="color: #6c757d;">${data.neutral}%</span>
      <div class="stat-label">Neutral Sentiment</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${data.totalPosts}</span>
      <div class="stat-label">Total Posts</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${data.keyThemes.length}</span>
      <div class="stat-label">Key Themes</div>
    </div>
    <div class="stat-item">
      <span class="stat-value">${Math.round((data.positive / (data.positive + data.negative)) * 100)}%</span>
      <div class="stat-label">Positivity Ratio</div>
    </div>
  `;
}

function displaySampleComments(data) {
  const commentsContainer = document.getElementById('commentsContainer');
  
  let commentsHTML = '';
  
  // Add positive comments
  data.sampleComments.positive.slice(0, 2).forEach(comment => {
    commentsHTML += `
      <div class="comment-item comment-positive">
        <div class="comment-sentiment">😊 POSITIVE</div>
        <p>"${comment}"</p>
      </div>
    `;
  });
  
  // Add negative comments
  data.sampleComments.negative.slice(0, 2).forEach(comment => {
    commentsHTML += `
      <div class="comment-item comment-negative">
        <div class="comment-sentiment">😞 NEGATIVE</div>
        <p>"${comment}"</p>
      </div>
    `;
  });
  
  // Add neutral comments
  data.sampleComments.neutral.slice(0, 1).forEach(comment => {
    commentsHTML += `
      <div class="comment-item comment-neutral">
        <div class="comment-sentiment">😐 NEUTRAL</div>
        <p>"${comment}"</p>
      </div>
    `;
  });
  
  commentsContainer.innerHTML = commentsHTML;
}

function displayInsights(data) {
  const insightsContent = document.getElementById('insightsContent');
  
  let insightsHTML = '<div class="insights-list">';
  data.insights.forEach((insight, index) => {
    insightsHTML += `
      <div class="insight-item">
        <strong>${index + 1}.</strong> ${insight}
      </div>
    `;
  });
  insightsHTML += '</div>';
  
  insightsHTML += `
    <div class="insight-item" style="margin-top: 1rem; background: rgba(255,255,255,0.2);">
      <strong>🎯 Key Themes Identified:</strong> ${data.keyThemes.join(', ')}
    </div>
  `;
  
  insightsContent.innerHTML = insightsHTML;
}

function displayBusinessImpact(data) {
  const businessContent = document.getElementById('businessContent');
  
  let businessHTML = '<div class="business-applications">';
  data.businessApps.forEach((app, index) => {
    businessHTML += `
      <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #457b9d;">
        <strong>${index + 1}.</strong> ${app}
      </div>
    `;
  });
  businessHTML += '</div>';
  
  businessHTML += `
    <div style="margin-top: 1.5rem; padding: 1rem; background: #e7f3ff; border-radius: 8px; text-align: center;">
      <strong>💡 ROI Potential:</strong> Automated sentiment monitoring can save 10+ hours per week of manual social media research while providing real-time insights for strategic decision making.
    </div>
  `;
  
  businessContent.innerHTML = businessHTML;
}

// Add keyboard support for custom input
document.addEventListener('DOMContentLoaded', function() {
  const customInput = document.getElementById('customTopic');
  if (customInput) {
    customInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        analyzeCustomTopic();
      }
    });
  }
  
  // Add animation to skill cards on scroll
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