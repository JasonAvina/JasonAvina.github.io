// Add smooth scroll behavior for better UX
document.addEventListener('DOMContentLoaded', function() {
  // Add hover effects for project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.borderTopColor = '#4CAF50';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.borderTopColor = 'transparent';
    });
  });
});

