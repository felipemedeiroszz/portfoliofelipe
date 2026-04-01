document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initAnimations();
  
  // Initialize smooth scrolling
  initSmoothScrolling();

  initTopNav();
  initScrollTopButton();
  

  

  
  // Initialize code typing effect
  initCodeTypingEffect();
  
  // Initialize section title code comments
  initSectionCodeComments();
  
  // Initialize matrix background
  initMatrixBackground();
  
  // Initialize programming hover effects
  initProgrammingEffects();
  
  // Initialize project effects
  initProjectEffects();
  
  // Inicializar sistema de filtros
  initProjectFilters();
  
  // Inicializar animações da empresa
  initCompanyAnimations();
  
  // Initialize tech hover effects
  initTechHoverEffects();
  
  // Inicializar animações da seção sobre mim
  initAboutMeAnimations();
  
  // Inicializar animações da seção de avaliações
  initReviewsAnimations();
  initGoogleReviews();
  

  

});

/**
 * Initialize animations for elements when they come into view
 */
function initAnimations() {
  const animatedElements = [
    '.section-header',
    '.tech-grid',
    '.contact-grid',
    '.company-grid',
    '.projects-grid',
    '.projects-grid-unified'
  ];
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  
  animatedElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.add('opacity-0');
      observer.observe(element);
    });
  });
  
  // Add necessary CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .opacity-0 {
      opacity: 0;
    }
    
    .animate-fade-in {
      animation: fadeIn 1s forwards;
    }
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    
    .code-typing {
      border-right: 3px solid var(--primary);
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
      position: relative;
    }
    
    .animate-typing {
      animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
    }
    
    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
    
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: var(--primary) }
    }
    
    .matrix-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.05;
    }
    
    .code-highlight {
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      background-size: 200% 100%;
      animation: highlight 2s linear infinite;
    }
    
    @keyframes highlight {
      0% { background-position: -100% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}

function initReviewsAnimations() {
  const reviewCards = document.querySelectorAll('.reviews-section .review-card');
  if (reviewCards.length === 0) return;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reviewCards.forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });
  reviewCards.forEach(card => {
    if (!card.classList.contains('placeholder')) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(18px)';
    }
    observer.observe(card);
  });
}

function initGoogleReviews() {
  const section = document.querySelector('.reviews-section');
  if (!section) return;
  const shareUrl = section.getAttribute('data-share-url') || '';
  const placeIdAttr = section.getAttribute('data-place-id') || '';
  const placeQuery = section.getAttribute('data-place-query') || '';
  const key = window.GOOGLE_MAPS_API_KEY || '';
  const btn = document.querySelector('.google-reviews-btn');
  if (btn && shareUrl) btn.setAttribute('href', shareUrl);
  if (!key) return;
  loadPlacesAPI(key).then(() => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const onReady = (pid) => {
      if (!pid) return;
      service.getDetails({ placeId: pid, fields: ['name','rating','user_ratings_total','reviews'] }, (res, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !res) return;
        const scoreEl = document.querySelector('.score-number');
        const countEl = document.querySelector('.score-count');
        if (scoreEl && typeof res.rating === 'number') scoreEl.textContent = res.rating.toFixed(1);
        if (countEl && typeof res.user_ratings_total === 'number') countEl.textContent = `com base em ${res.user_ratings_total} avaliações no Google`;
        const list = document.querySelector('.reviews-list');
        if (!list) return;
        list.innerHTML = '';
        const reviews = Array.isArray(res.reviews) ? res.reviews.slice(0, 6) : [];
        reviews.forEach(r => {
          const card = document.createElement('div');
          card.className = 'review-card';
          const header = document.createElement('div');
          header.className = 'review-header';
          const avatar = document.createElement('div');
          avatar.className = 'reviewer-avatar';
          avatar.setAttribute('aria-hidden','true');
          avatar.textContent = (r.author_name || '?').charAt(0).toUpperCase();
          const info = document.createElement('div');
          info.className = 'reviewer-info';
          const name = document.createElement('div');
          name.className = 'reviewer-name';
          name.textContent = r.author_name || '';
          const date = document.createElement('div');
          date.className = 'review-date';
          date.textContent = r.relative_time_description || '';
          info.appendChild(name);
          info.appendChild(date);
          header.appendChild(avatar);
          header.appendChild(info);
          const stars = document.createElement('div');
          stars.className = 'review-stars';
          stars.textContent = '★★★★★'.slice(0, Math.max(0, Math.min(5, Math.round(r.rating || 0)))) + '☆☆☆☆☆'.slice(Math.max(0, Math.min(5, Math.round(r.rating || 0))));
          const text = document.createElement('p');
          text.className = 'review-text';
          text.textContent = r.text || '';
          card.appendChild(header);
          card.appendChild(stars);
          card.appendChild(text);
          list.appendChild(card);
        });
        initReviewsAnimations();
      });
    };
    if (placeIdAttr) {
      onReady(placeIdAttr);
    } else if (placeQuery) {
      service.findPlaceFromQuery({ query: placeQuery, fields: ['place_id'] }, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || !results[0]) return;
        onReady(results[0].place_id);
      });
    }
  });
}

function loadPlacesAPI(key) {
  return new Promise((resolve) => {
    if (window.google && window.google.maps && window.google.maps.places) { resolve(); return; }
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  // Add click event listeners to navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: scrollBehavior, block: 'start' });

        const shouldMoveFocus = this.classList.contains('skip-link');
        if (shouldMoveFocus) {
          const previousTabIndex = targetElement.getAttribute('tabindex');
          if (previousTabIndex === null) targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
          if (previousTabIndex === null) targetElement.removeAttribute('tabindex');
        }
      }
    });
  });
  
  // Add click event listeners to WhatsApp links
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '_blank');
    });
  });
}

function initTopNav() {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;

  const toggle = nav.querySelector('.nav-toggle');
  const links = nav.querySelector('.top-nav-links');
  const overlay = nav.querySelector('[data-nav-overlay]');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.documentElement.classList.toggle('nav-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  links.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  if (overlay) overlay.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(e.target)) return;
    setOpen(false);
  });
}

/**
 * Initialize tech hover effects and animations
 */
function initTechHoverEffects() {
  const techItems = document.querySelectorAll('.tech-icon-bg');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  techItems.forEach((item, index) => {
    // Enhanced hover effects
    item.addEventListener('mouseenter', () => {
      if (prefersReducedMotion) return;
      item.style.transform = 'translateY(-6px) scale(1.03)';
      item.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.55), 0 0 0 6px rgba(0, 255, 65, 0.10)';
      item.style.borderColor = 'rgba(0, 255, 65, 0.55)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.boxShadow = '';
      item.style.borderColor = '';
    });
  });
  
  // Intersection Observer for re-triggering animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const techItems = entry.target.querySelectorAll('.tech-item');
        techItems.forEach((item, index) => {
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = `slideInUp 0.8s ease forwards`;
          item.style.animationDelay = `${index * 0.1}s`;
        });
      }
    });
  }, {
    threshold: 0.3
  });
  
  const techSection = document.querySelector('.technologies-section');
  if (techSection) {
    observer.observe(techSection);
  }
}

/**
 * Função removida: initFormValidation
 * A função de validação do formulário foi removida pois a seção de contato
 * foi substituída por uma seção de redes sociais sem formulário.
 */

/**
 * Initialize hover effects for technology items
 */





function initScrollTopButton() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
  
  if (scrollTopBtn) {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      scrollTopBtn.classList.toggle('is-visible', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: scrollBehavior
      });
    });
  }
}



// A função initScrollTopButton já é chamada no DOMContentLoaded

/**
 * Adiciona comentários de código aos títulos das seções
 */
function initSectionCodeComments() {
  const sectionHeaders = document.querySelectorAll('.section-header');
  
  sectionHeaders.forEach(header => {
    const headerBox = header.querySelector('.section-header-box');
    const headerText = headerBox?.querySelector('.section-header-text')?.textContent || '';
    
    // Criar o comentário de código
    const codeComment = document.createElement('div');
    codeComment.className = 'section-code-comment';
    
    // Gerar comentários diferentes baseados no texto do título
    let commentText = '';
    
    if (headerText.includes('TECNOLOGIAS')) {
      commentText = '/* Stack tecnológico utilizado nos projetos */'; 
    } else if (headerText.includes('PROJETOS')) {
      commentText = '/* Portfólio de trabalhos realizados */'; 
    } else if (headerText.includes('CONTATO')) {
      commentText = '/* Informações para contato e formulário */'; 
    } else if (headerText.includes('EMPRESA')) {
      commentText = '/* Detalhes sobre a empresa */'; 
    } else {
      commentText = '/* Seção importante */'; 
    }
    
    codeComment.textContent = commentText;
    
    // Estilizar o comentário
    codeComment.style.fontFamily = '"Fira Code", monospace';
    codeComment.style.color = 'var(--secondary)';
    codeComment.style.fontSize = '0.9rem';
    codeComment.style.position = 'absolute';
    codeComment.style.bottom = '-1.8rem';
    codeComment.style.left = '50%';
    codeComment.style.transform = 'translateX(-50%)';
    codeComment.style.opacity = '0';
    codeComment.style.transition = 'opacity 0.3s ease';
    codeComment.style.whiteSpace = 'nowrap';
    codeComment.style.textShadow = '0 0 5px rgba(16, 185, 129, 0.3)';
    
    // Adicionar o comentário ao header
    if (headerBox) {
      headerBox.style.position = 'relative';
      headerBox.appendChild(codeComment);
      
      // Mostrar/esconder o comentário no hover
      headerBox.addEventListener('mouseenter', () => {
        codeComment.style.opacity = '0.9';
      });
      
      headerBox.addEventListener('mouseleave', () => {
        codeComment.style.opacity = '0';
      });
    }
  });
}

/**
 * Adiciona efeito de digitação de código em elementos selecionados
 */
function initCodeTypingEffect() {
  // Seleciona o subtítulo para aplicar o efeito de digitação
  const subtitle = document.querySelector('.subtitle-light');
  if (subtitle) {
    subtitle.classList.add('code-typing');
    
    // Cria um wrapper para o efeito de digitação
    const text = subtitle.textContent;
    subtitle.innerHTML = '';
    
    // Simula digitação de código
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        subtitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
      } else {
        // Adiciona cursor piscante no final
        subtitle.classList.add('animate-typing');
      }
    };
    
    // Inicia a animação após um pequeno delay
    setTimeout(typeWriter, 1000);
  }
}

/**
 * Cria um efeito de fundo estilo 'Matrix' para a seção de cabeçalho
 */
function initMatrixBackground() {
  const header = document.querySelector('.header-section');
  if (!header) return;
  
  // Cria o canvas para o efeito matrix
  const canvas = document.createElement('canvas');
  canvas.classList.add('matrix-bg');
  header.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = header.offsetWidth;
  canvas.height = header.offsetHeight;
  
  // Caracteres para o efeito matrix
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const charArray = chars.split('');
  
  const fontSize = 10;
  const columns = canvas.width / fontSize;
  
  // Array para posição Y de cada coluna
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }
  
  // Desenha o efeito matrix
  function draw() {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#3b82f6';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      drops[i]++;
    }
  }
  
  // Atualiza o canvas quando a janela é redimensionada
  window.addEventListener('resize', () => {
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;
  });
  
  // Inicia a animação
  setInterval(draw, 35);
}

/**
 * Adiciona efeitos de hover e destaque em elementos relacionados a programação
 */
function initProgrammingEffects() {
  // Adiciona efeitos de código aos cards de tecnologia
  const techCards = document.querySelectorAll('.tech-card');
  techCards.forEach(card => {
    const title = card.querySelector('.tech-title');
    if (!title) return;
    
    // Cria um comentário de código
    const comment = document.createElement('span');
    comment.className = 'code-comment-hover';
    comment.textContent = '// hover me';
    comment.style.position = 'absolute';
    comment.style.right = '10px';
    comment.style.top = '5px';
    comment.style.fontSize = '0.7rem';
    comment.style.fontFamily = '"Fira Code", monospace';
    comment.style.color = 'var(--accent)';
    comment.style.opacity = '0';
    comment.style.transition = 'opacity 0.3s ease';
    
    // Adiciona números de linha como em um editor de código
    const lineNumbers = document.createElement('div');
    lineNumbers.classList.add('line-numbers');
    lineNumbers.style.position = 'absolute';
    lineNumbers.style.left = '5px';
    lineNumbers.style.top = '5px';
    lineNumbers.style.fontSize = '0.7rem';
    lineNumbers.style.color = 'var(--primary)';
    lineNumbers.style.opacity = '0';
    lineNumbers.style.transition = 'opacity 0.3s ease';
    lineNumbers.style.fontFamily = '"Fira Code", monospace';
    
    // Cria 5 linhas de código
    for (let i = 1; i <= 5; i++) {
      const lineNumber = document.createElement('div');
      lineNumber.className = 'line-number';
      lineNumber.textContent = i;
      lineNumbers.appendChild(lineNumber);
    }
    
    card.appendChild(lineNumbers);
    
    // Mostra números de linha no hover
    card.addEventListener('mouseenter', () => {
      lineNumbers.style.opacity = '0.7';
      card.classList.add('code-highlight');
    });
    
    card.addEventListener('mouseleave', () => {
      lineNumbers.style.opacity = '0';
      card.classList.remove('code-highlight');
    });
    
    // Adiciona efeito de cursor piscante
    const cursor = document.createElement('span');
    cursor.className = 'terminal-cursor';
    cursor.innerHTML = '█';
    card.appendChild(cursor);
    title.style.position = 'relative';
    title.appendChild(comment);
    
    title.addEventListener('mouseenter', () => {
      comment.style.opacity = '1';
    });
    
    title.addEventListener('mouseleave', () => {
      comment.style.opacity = '0';
    });
  });
}

/**
 * Inicializa os comentários de código nas seções
 */
function initSectionCodeComments() {
  const codeComments = document.querySelectorAll('.code-comment');
  
  codeComments.forEach(comment => {
    // Adiciona efeito de digitação aos comentários de código
    const text = comment.textContent;
    comment.textContent = '';
    
    let i = 0;
    const typeSpeed = 50; // velocidade de digitação em ms
    
    function typeWriter() {
      if (i < text.length) {
        comment.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, typeSpeed);
      }
    }
    
    // Inicia a digitação quando o elemento entra no viewport
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            typeWriter();
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(comment);
  });
}



// Initialize project effects
function initProjectEffects() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Add hover effect for project features
    const features = card.querySelectorAll('.project-feature');
    features.forEach(feature => {
      feature.addEventListener('mouseenter', () => {
         feature.style.transform = 'scale(1.05)';
         feature.style.background = 'rgba(0, 255, 65, 0.2)';
       });
       
       feature.addEventListener('mouseleave', () => {
         feature.style.transform = 'scale(1)';
         feature.style.background = 'rgba(0, 255, 65, 0.1)';
       });
    });
    
    // Add staggered animation for features
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const features = entry.target.querySelectorAll('.project-feature');
          features.forEach((feature, index) => {
            setTimeout(() => {
              feature.style.opacity = '1';
              feature.style.transform = 'translateY(0)';
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(card);
    
    // Initialize features as hidden for animation
    const features2 = card.querySelectorAll('.project-feature');
    features2.forEach(feature => {
      feature.style.opacity = '0';
      feature.style.transform = 'translateY(20px)';
      feature.style.transition = 'all 0.3s ease';
    });
  });
  
  // Add typing effect to project titles
  const projectTitles = document.querySelectorAll('.project-title');
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const title = entry.target;
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid var(--accent)';
        
        let i = 0;
        const typeWriter = () => {
          if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
          } else {
            setTimeout(() => {
              title.style.borderRight = 'none';
            }, 500);
          }
        };
        
        setTimeout(typeWriter, 200);
        titleObserver.unobserve(title);
      }
    });
  }, { threshold: 0.5 });
  
  projectTitles.forEach(title => {
    titleObserver.observe(title);
  });
}

// Função para sistema de filtros de projetos
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class de todos os botões
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      // Adiciona active class ao botão clicado
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      
      const filterValue = button.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterValue === 'all' || cardCategory === filterValue) {
          // Mostrar card
          card.classList.remove('hidden');
          card.style.display = 'block';
          
          // Animação de entrada
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Esconder card
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          
          // Esconder completamente após animação
          setTimeout(() => {
            card.classList.add('hidden');
            card.style.display = 'none';
          }, 300);
        }
      });
      
      // Reorganizar grid após filtro
      setTimeout(() => {
        const grid = document.querySelector('.projects-grid-unified');
        if (grid) {
          grid.style.display = 'none';
          grid.offsetHeight; // Força reflow
          grid.style.display = 'grid';
        }
      }, 350);
    });
  });
}

// Função para animações da seção da empresa
function initCompanyAnimations() {
  const companyItems = document.querySelectorAll('.company-item');
  
  if (companyItems.length === 0) return;
  
  // Adicionar animações aleatórias de flutuação
  function addRandomFloating() {
    companyItems.forEach((item, index) => {
      // Remover classes anteriores
      item.classList.remove('floating', 'pulse');
      
      // Adicionar animação aleatória após um delay
      setTimeout(() => {
        const randomAnimation = Math.random() > 0.5 ? 'floating' : 'pulse';
        item.classList.add(randomAnimation);
        
        // Remover animação após um tempo
        setTimeout(() => {
          item.classList.remove(randomAnimation);
        }, 3000 + Math.random() * 2000);
      }, index * 200 + Math.random() * 1000);
    });
  }
  
  // Iniciar animações aleatórias
  addRandomFloating();
  
  // Repetir animações a cada 8 segundos
  setInterval(addRandomFloating, 8000);
  
  // Adicionar efeito de hover interativo
  companyItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Parar animações atuais
      item.classList.remove('floating', 'pulse');
      
      // Adicionar efeito de destaque
      item.style.transform = 'translateX(15px) scale(1.05)';
      item.style.background = 'linear-gradient(135deg, #3a3a3a, #2a2a2a)';
      item.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
    });
    
    item.addEventListener('mouseleave', () => {
      // Resetar estilos
      item.style.transform = '';
      item.style.background = '';
      item.style.boxShadow = '';
      
      // Reativar animações aleatórias após um delay
      setTimeout(() => {
        const randomAnimation = Math.random() > 0.5 ? 'floating' : 'pulse';
        item.classList.add(randomAnimation);
        
        setTimeout(() => {
          item.classList.remove(randomAnimation);
        }, 2000);
      }, 500);
    });
  });
  
  // Observer para reativar animações quando a seção entra na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reativar animações quando a seção é visível
        setTimeout(() => {
          addRandomFloating();
        }, 500);
      }
    });
  }, {
    threshold: 0.3
  });
  
  const companySection = document.querySelector('.company-section');
  if (companySection) {
    observer.observe(companySection);
  }
}

// Função para inicializar animações da seção sobre mim
function initAboutMeAnimations() {
  // Intersection Observer para re-trigger das animações
  const aboutSection = document.querySelector('.about-me-section');
  const aboutParagraphs = document.querySelectorAll('.about-me-paragraph');
  const highlightItems = document.querySelectorAll('.highlight-item');
  const codeComments = document.querySelectorAll('.code-comment');
  
  if (!aboutSection) return;
  
  // Observer para detectar quando a seção entra na viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Re-trigger das animações dos parágrafos
        aboutParagraphs.forEach((paragraph, index) => {
          paragraph.style.animation = 'none';
          paragraph.offsetHeight; // Trigger reflow
          paragraph.style.animation = `slideInUp 0.6s ease-out ${0.2 * index}s forwards`;
        });
        
        // Re-trigger das animações dos comentários
        codeComments.forEach((comment, index) => {
          comment.style.animation = 'none';
          comment.offsetHeight; // Trigger reflow
          comment.style.animation = `fadeInLeft 0.6s ease-out ${0.1 + 0.2 * index}s forwards`;
        });
        
        // Re-trigger das animações dos highlights
        const highlightsContainer = document.querySelector('.about-me-highlights');
        if (highlightsContainer) {
          highlightsContainer.style.animation = 'none';
          highlightsContainer.offsetHeight; // Trigger reflow
          highlightsContainer.style.animation = 'fadeInLeft 0.8s ease-out 0.8s forwards';
        }
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
  });
  
  observer.observe(aboutSection);
  
  // Efeito de hover melhorado para os highlights
  highlightItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-15px) scale(1.1)';
      item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      const icon = item.querySelector('.highlight-icon');
      if (icon) {
        icon.style.transform = 'rotate(360deg) scale(1.2)';
        icon.style.color = '#ffd700';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'all 0.3s ease';
      
      const icon = item.querySelector('.highlight-icon');
      if (icon) {
        icon.style.transform = '';
        icon.style.color = '';
      }
    });
  });
  
  // Efeito de typing para os parágrafos
  aboutParagraphs.forEach((paragraph, index) => {
    paragraph.addEventListener('mouseenter', () => {
      paragraph.style.transform = 'translateY(-8px) scale(1.02)';
      paragraph.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
      paragraph.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    paragraph.addEventListener('mouseleave', () => {
      paragraph.style.transform = '';
      paragraph.style.boxShadow = '';
      paragraph.style.background = 'rgba(255, 255, 255, 0.1)';
    });
  });
  
  // Animação de counter para os números dos highlights
  const counters = document.querySelectorAll('.highlight-number.counter');
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.textContent.replace('+', ''));
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = target + '+';
        clearInterval(timer);
      } else {
        counter.textContent = Math.ceil(current) + '+';
      }
    }, 30);
  };
  
  // Observer para animar os counters quando visíveis
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}
