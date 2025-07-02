window.addEventListener('DOMContentLoaded', () => {
    gsap.from(".title", {
        duration: 1,
        y: 20,
        opacity: 0,
        scale: 0.95,
        ease: "power3.out",
        delay: 0.3
    });
});
