document.addEventListener('DOMContentLoaded', function () {

  /* --------- Menu móvel (botão toggle) --------- */
  const menuToggle = document.getElementById('menu-toggle');
  const topNav = document.getElementById('top-nav');

  if (menuToggle && topNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      topNav.classList.toggle('open');
      menuToggle.textContent = expanded ? '☰' : '✕';
    });
    
    // Fechar menu ao clicar fora dele  
    document.addEventListener('click', (e) => {
      if (topNav.classList.contains('open') &&
          !topNav.contains(e.target) &&
          e.target !== menuToggle) {
        topNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });
  }
/* --------- Scroll suave para âncoras --------- */
   document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar links vazios
      if (href === '#' || href === '#!') {
        e.preventDefault();
        return;
      }
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Fechar menu mobile se aberto
        if (topNav && topNav.classList.contains('open')) {
          topNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.textContent = '☰';
        }
        
        // Scroll suave para o elemento
        window.scrollTo({
          top: targetElement.offsetTop - 80, 
          behavior: 'smooth'
        });
        
        // Atualizar URL sem recarregar
        history.pushState(null, null, href);
      }
    });
  });

  /* --------------- TEMA CLARO/ESCURO --------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const THEME_KEY = 'portfolio-theme';

  // Função para aplicar tema
  function setTheme(theme) {
    if (theme === 'light') {
      html.classList.add('light-theme');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
    } else {
      html.classList.remove('light-theme');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  // Inicializar tema
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Verificar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Evento do botão tema
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.classList.contains('light-theme') ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }

  /* --------- FORMULÁRIO COM VALIDAÇÃO --------- */
  const form = document.getElementById('contact-form');

  // Regex melhorada para validação de email
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  // Modal personalizado para mensagens
  function showMessage(message, isError = false) {
    // Criar ou reusar modal
    let modal = document.getElementById('custom-modal');
    // Se não existir, criar
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'custom-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        backdrop-filter: blur(3px);
      `;
      // Conteúdo do modal
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background: var(--panel);
        padding: 30px;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.1);
        color: var(--cream);
      `;
      // Mensagem
      const messageEl = document.createElement('p');
      messageEl.id = 'modal-message';
      messageEl.style.marginBottom = '20px';
      // Botão fechar
      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Fechar';
      closeBtn.style.cssText = `
        background: var(--pink);
        color: var(--brown);
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
      `;
      // Evento fechar
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      // Montar modal
      modalContent.appendChild(messageEl);
      modalContent.appendChild(closeBtn);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Fechar ao clicar fora
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }
    // Atualizar mensagem
    const messageEl = document.getElementById('modal-message');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.style.color = isError ? '#ff6b6b' : 'var(--cream)';
    }
    // Exibir modal
    modal.style.display = 'flex';
  }
  // Evento submit do formulário
  if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Validação em tempo real
    emailInput.addEventListener('blur', function() {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });
    
    // Validação no submit
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Obter valores
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      // Resetar erros
      [nameInput, emailInput, messageInput].forEach(input => {
        input.classList.remove('error');
      });
      
      // Validações
      let hasError = false;
      
      if (!name) {// Validar nome
        nameInput.classList.add('error');
        showMessage('Por favor, preencha seu nome.', true);
        nameInput.focus();
        hasError = true;
        return;
      }
      
      if (!email) {// Validar e-mail
        emailInput.classList.add('error');
        showMessage('Por favor, preencha seu e-mail.', true);
        emailInput.focus();
        hasError = true;
        return;
      }
      
      if (!validateEmail(email)) {//  Validar formato do e-mail
        emailInput.classList.add('error');
        showMessage('Por favor, insira um e-mail válido.\nExemplo: nome@exemplo.com', true);
        emailInput.focus();
        hasError = true;
        return;
      }
      
      if (!message) {// Validar mensagem
        messageInput.classList.add('error');
        showMessage('Por favor, escreva sua mensagem.', true);
        messageInput.focus();
        hasError = true;
        return;
      }
      
      // Se todas as validações passarem
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Mostrar loading
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      // Simular envio
      setTimeout(() => {
        // Limpar formulário
        form.reset();
        
        // Mostrar sucesso
        showMessage('✅ Mensagem enviada com sucesso!\nObrigada pelo contato.');
        
        // Restaurar botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  /* --------- BOTÕES DOS PROJETOS  --------- */
   document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-project')) {
      e.preventDefault();
      
      // Encontrar o título do projeto
      const card = e.target.closest('.card');
      if (card) {
        const titleElement = card.querySelector('h3');
        if (titleElement) {
          const projectTitle = titleElement.textContent;
          showMessage(`🚧 O projeto "${projectTitle}" ainda está em desenvolvimento.\nEm breve estará disponível para visualização!`);
        }
      }
    }
  });

  /* --------- HEADER COM SCROLL --------- */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* --------- PREVENIR COMPORTAMENTOS INDESEJADOS --------- */
  // Prevenir links de fazer reload
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

});