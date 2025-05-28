// Simple test to check if mobile CSS is working
console.log('Testing mobile layout...');

// Function to test mobile layout
function testMobileLayout() {
    // Check if we're in a mobile viewport
    const isMobile = window.innerWidth <= 768;
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile viewport:', isMobile);
    
    // Check homeContainer layout
    const homeContainer = document.querySelector('[class*="homeContainer"]');
    if (homeContainer) {
        const styles = window.getComputedStyle(homeContainer);
        console.log('homeContainer display:', styles.display);
        console.log('homeContainer flex-direction:', styles.flexDirection);
        console.log('homeContainer grid-template-columns:', styles.gridTemplateColumns);
    }
    
    // Check stepCard layout
    const stepCards = document.querySelectorAll('[class*="stepCard"]');
    if (stepCards.length > 0) {
        const firstCard = stepCards[0];
        const styles = window.getComputedStyle(firstCard);
        console.log('stepCard min-height:', styles.minHeight);
        console.log('stepCard overflow:', styles.overflow);
        console.log('stepCard height:', styles.height);
    }
    
    // Check stepsContainer layout
    const stepsContainer = document.querySelector('[class*="stepsContainer"]');
    if (stepsContainer) {
        const styles = window.getComputedStyle(stepsContainer);
        console.log('stepsContainer display:', styles.display);
        console.log('stepsContainer grid-template-columns:', styles.gridTemplateColumns);
    }
}

// Test on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testMobileLayout);
} else {
    testMobileLayout();
}

// Test on resize
window.addEventListener('resize', testMobileLayout);

console.log('Mobile test script loaded. Open browser console and resize window to test.'); 