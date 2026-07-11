document.addEventListener("DOMContentLoaded", () => {
  // --- Header Scroll & Progress Bar ---
  const topbar = document.querySelector(".topbar");
  const scrollProgress = document.getElementById("scrollProgress");

  window.addEventListener("scroll", () => {
    // Topbar scrolled style
    if (window.scrollY > 20) {
      topbar?.classList.add("scrolled");
    } else {
      topbar?.classList.remove("scrolled");
    }

    // Scroll progress calculation
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + "%";
    }
  });

  // --- Mobile Menu Toggle ---
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-nav-links a");

  function toggleMobileMenu() {
    const isOpen = hamburgerBtn?.classList.contains("active");
    if (isOpen) {
      hamburgerBtn?.classList.remove("active");
      mobileMenu?.classList.remove("active");
      hamburgerBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = ""; // Enable scroll
    } else {
      hamburgerBtn?.classList.add("active");
      mobileMenu?.classList.add("active");
      hamburgerBtn?.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden"; // Disable scroll
    }
  }

  hamburgerBtn?.addEventListener("click", toggleMobileMenu);

  mobileMenuLinks.forEach(link => {
    link.addEventListener("click", () => {
      // Close menu on link click
      hamburgerBtn?.classList.remove("active");
      mobileMenu?.classList.remove("active");
      hamburgerBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    });
  });

  // --- Interactive Spotlight Hover Glow & 3D Tilt Effect ---
  const cards = document.querySelectorAll(".service-card, .project-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse x position within card
      const y = e.clientY - rect.top;  // Mouse y position within card

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // 3D Tilt Calculation
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      const angleX = (yc - y) / 16; // Max rotation angle
      const angleY = (x - xc) / 16;

      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });

  // --- Magnetic Buttons Effect ---
  const magneticButtons = document.querySelectorAll(".nav-cta, .primary-btn, #whatsappButton");
  magneticButtons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.03)`;
      btn.style.transition = "transform 0.08s ease-out";
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0) scale(1)";
      btn.style.transition = "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
    });
  });

  // --- WhatsApp Form Handler with Validation ---
  const whatsappButton = document.getElementById("whatsappButton");
  const formStatus = document.getElementById("formStatus");

  whatsappButton?.addEventListener("click", () => {
    const form = whatsappButton.closest("form");
    if (!form) return;

    // Check built-in HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      if (formStatus) {
        formStatus.textContent = "Por favor, preencha todos os campos obrigatórios.";
        formStatus.className = "form-status error";
      }
      return;
    }

    const data = new FormData(form);
    const nome = data.get("nome")?.toString().trim() || "Cliente";
    const projeto = data.get("projeto")?.toString().trim() || "projeto digital";
    const mensagem = data.get("mensagem")?.toString().trim() || "Quero conversar sobre um projeto para minha empresa.";

    const texto = [
      `Olá, meu nome é ${nome}.`,
      `Tenho interesse em: ${projeto}.`,
      mensagem,
    ].join("\n");

    // Dynamic UI feedback
    const btnText = whatsappButton.querySelector(".btn-text");
    const originalText = btnText ? btnText.textContent : "Enviar e falar no WhatsApp";
    
    if (btnText) btnText.textContent = "Redirecionando...";
    whatsappButton.style.pointerEvents = "none";
    whatsappButton.style.opacity = "0.75";

    if (formStatus) {
      formStatus.textContent = "Abrindo o WhatsApp...";
      formStatus.className = "form-status success";
    }

    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
      
      // Reset button state
      if (btnText) btnText.textContent = originalText;
      whatsappButton.style.pointerEvents = "all";
      whatsappButton.style.opacity = "1";
      if (formStatus) formStatus.textContent = "";
    }, 1200);
  });

  // --- Staggered Scroll Animation (IntersectionObserver) ---
  const grids = document.querySelectorAll(".service-grid, .project-grid, .timeline, .metrics, .testimonial-grid, .impact-strip");
  
  grids.forEach((grid) => {
    const children = grid.children;
    Array.from(children).forEach((child, index) => {
      // Apply stagger animation delay using item index
      child.style.transitionDelay = `${index * 80}ms`;
    });
  });

  const revealTargets = document.querySelectorAll(
    ".service-card, .project-card, .metrics div, .testimonial-grid blockquote, .timeline article, .impact-strip div, .showcase-copy, .device-preview"
  );

  const maskRevealTargets = document.querySelectorAll("h1, h2, .section-heading h2, .section-heading.compact h2");

  // Fallback for older browsers
  if (!window.IntersectionObserver) {
    revealTargets.forEach(target => target.classList.add("is-visible"));
    maskRevealTargets.forEach(target => target.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
  });

  // --- Split Text / Mask Reveal for Headings ---
  maskRevealTargets.forEach(target => {
    target.classList.add("reveal-mask");
    revealObserver.observe(target);
  });
});
