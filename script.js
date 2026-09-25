document.addEventListener("DOMContentLoaded", function() {
    const splashScreen = document.querySelector('.splash-screen');
    const seeds = document.querySelectorAll('.seed');
    const mainContent = document.querySelector('.main-content');
    const centerCircle = document.querySelector('.center-circle');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 100; // Radius of the circular pattern around the center circle

    seeds.forEach((seed, index) => {
        const angle = (index / seeds.length) * 2 * Math.PI;
        const initialX = centerX + 1500 * Math.cos(angle);
        const initialY = centerY + 1500 * Math.sin(angle);
        const finalX = centerX + radius * Math.cos(angle);
        const finalY = centerY + radius * Math.sin(angle);
        const rotation = angle + Math.PI / 2; // Calculate rotation angle to face the center

        seed.style.top = `${initialY}px`;
        seed.style.left = `${initialX}px`;
        seed.style.transform = `translate(-50%, -50%) scale(0) rotate(${rotation}rad)`; // Use radians for rotation

        setTimeout(() => {
            seed.style.transition = 'top 2s ease, left 2s ease, transform 2s ease';
            seed.style.top = `${finalY - seed.clientHeight / 2}px`;
            seed.style.left = `${finalX - seed.clientWidth / 2}px`;
            seed.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotation}rad)`; // Use radians for rotation
        }, 0);
    });

    // Delay before circle expansion
    setTimeout(() => {
        // Expand center circle after seeds animation completes
        centerCircle.style.transition = 'width 2s ease, height 2s ease, top 2s ease, left 2s ease';
        centerCircle.style.width = `${Math.max(window.innerWidth, window.innerHeight) * 2}px`;
        centerCircle.style.height = `${Math.max(window.innerWidth, window.innerHeight) * 2}px`;
        centerCircle.style.top = '50%';
        centerCircle.style.left = '50%';
        centerCircle.style.transform = 'translate(-50%, -50%)';

        // Hide seeds after circle has fully expanded
        setTimeout(() => {
            seeds.forEach(seed => {
                seed.style.opacity = '0'; // Fade out seeds
            });
        }, 2000); // Adjust this delay to match the circle expansion duration

        // Slide in main content after circle expansion completes
        setTimeout(() => {
            mainContent.style.transition = 'opacity 1s ease, transform 1s ease'; // Add transition for opacity and transform
            mainContent.style.opacity = '1'; // Fade in main content
            mainContent.style.transform = 'translateY(0)'; // Slide in main content from bottom

            // Fade out splash screen after main content shows
            setTimeout(() => {
                splashScreen.style.transition = 'opacity 1s ease'; // Add transition for opacity
                splashScreen.style.opacity = '0'; // Fade out splash screen
                setTimeout(() => {
                    splashScreen.style.display = 'none'; // Hide splash screen after fade out
                    window.scrollTo(0, 0); // Scroll to the top
                }, 1000); // Adjust timing to match opacity transition duration
            }, 1000); // Adjust timing to start splash screen fade out after main content shows
        }, 2200); // Adjust this delay to start showing main content
    }, 2000); // Adjust this delay to start expanding after seed animation completes

    // Restore scroll functionality after splash screen
    setTimeout(() => {
        document.body.style.overflow = 'auto'; // Restore scroll functionality after splash screen
    }, 4000); // Adjust as per total animation duration
});
