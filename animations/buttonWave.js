document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-wave');
    if (!btn) return;

    const text = btn.textContent.trim();
    btn.textContent = '';

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.display = 'inline-block';
        fragment.appendChild(span);
    }

    btn.appendChild(fragment);

    const spans = btn.querySelectorAll('span');

    const timeline = gsap.timeline({ repeat: -1 });

    spans.forEach((span, i) => {
        timeline.to(span, {
            y: -4,
            duration: 0.15,
            ease: "power1.inOut",
            yoyo: true,
            repeat: 1,
            repeatDelay: 0,
            delay: i * 0.03
        }, 0);
    });

    const animDuration = (spans.length - 1) * 0.04 + 0.4;

    timeline.repeatDelay(4 - animDuration);
});
