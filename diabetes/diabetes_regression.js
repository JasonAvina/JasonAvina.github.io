
    function showDemo() {
        const demoResult = document.getElementById('demoResult');
        demoResult.style.display = 'block';
        
        // Scroll to the result
        demoResult.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }

    // Add some interactive elements
    document.addEventListener('DOMContentLoaded', function() {
    // Animate skill cards on scroll
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

    // Add hover effects for result items
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        });
    });
    });
