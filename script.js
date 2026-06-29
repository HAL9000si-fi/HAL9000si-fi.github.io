document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  /* ------------------------------------------------------------------------
     Portfolio Scout / single clean typewriter interaction
  ------------------------------------------------------------------------ */

  const scoutPanel = document.querySelector('.guide-panel--compact[data-role-guide]');
  const scoutData = {
    saas: {
      status: 'Best match for enterprise SaaS evaluation.',
      title: 'ScriptRunner Connect / Stitch-It',
      cardTitle: 'Start with ScriptRunner Connect / Stitch-It.',
      summary: 'Enterprise SaaS, workflow automation, technical UX, onboarding and system visibility.',
      href: 'case_studies/stitch-it.html'
    },
    ai: {
      status: 'Best match for AI and workflow product evaluation.',
      title: 'ScriptRunner Connect / Stitch-It',
      cardTitle: 'Use Stitch-It as the AI-systems lens.',
      summary: 'The strongest signal is the ability to sequence complexity, expose dependencies and design human oversight into automated or agentic product workflows.',
      href: 'case_studies/stitch-it.html'
    },
    mobile: {
      status: 'Best match for mobile product design evaluation.',
      title: 'Oodle Finance App',
      cardTitle: 'Start with Oodle Finance App.',
      summary: 'Mobile trust-building, decision-heavy journeys, finance-product clarity and consumer-grade UX.',
      href: 'case_studies/oodle-finance.html'
    },
    consulting: {
      status: 'Best match for product consulting evaluation.',
      title: 'ScriptRunner Connect / Stitch-It',
      cardTitle: 'Start with ScriptRunner Connect / Stitch-It.',
      summary: 'Discovery, framing, enterprise UX, stakeholder alignment and implementation-ready product thinking.',
      href: 'case_studies/stitch-it.html'
    }
  };

  let scoutRunId = 0;
  let scoutTimers = [];

  function clearScoutTimers() {
    scoutTimers.forEach((timer) => window.clearTimeout(timer));
    scoutTimers = [];
  }

  function delay(callback, ms) {
    const timer = window.setTimeout(callback, ms);
    scoutTimers.push(timer);
    return timer;
  }

  function typewriter(element, text, speed, runId) {
    return new Promise((resolve) => {
      if (!element) {
        resolve();
        return;
      }

      element.textContent = '';

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = text;
        resolve();
        return;
      }

      let index = 0;
      element.classList.add('is-typewriter-active');

      function tick() {
        if (runId !== scoutRunId) {
          element.classList.remove('is-typewriter-active');
          resolve();
          return;
        }

        element.textContent += text.charAt(index);
        index += 1;

        if (index < text.length) {
          delay(tick, speed);
        } else {
          element.classList.remove('is-typewriter-active');
          resolve();
        }
      }

      tick();
    });
  }

  async function updateScout(role) {
    if (!scoutPanel || !scoutData[role]) return;

    clearScoutTimers();
    scoutRunId += 1;

    const runId = scoutRunId;
    const recommendation = scoutData[role];

    const status = scoutPanel.querySelector('[data-guide-status]');
    const title = scoutPanel.querySelector('[data-guide-title]');
    const result = scoutPanel.querySelector('[data-guide-result]');

    scoutPanel.querySelectorAll('[data-role]').forEach((button) => {
      const selected = button.dataset.role === role;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    if (status) status.textContent = 'Analysing portfolio evidence…';
    if (title) title.textContent = recommendation.title;

    if (!result) return;

    result.classList.remove('guide-result--empty');
    result.classList.add('guide-result--typing');

    result.innerHTML = `
      <div class="guide-generated" data-guide-generated>
        <p class="guide-result__label">Recommended case study</p>
        <h4 data-guide-card-title></h4>
        <p data-guide-summary></p>
      </div>
      <a class="guide-result__link guide-result__link--delayed" data-guide-link href="${recommendation.href}" hidden>Explore case study</a>
    `;

    const cardTitle = result.querySelector('[data-guide-card-title]');
    const summary = result.querySelector('[data-guide-summary]');
    const link = result.querySelector('[data-guide-link]');

    if (cardTitle) {
      cardTitle.classList.add('is-typewriter-ready');
    }

    delay(async () => {
      if (runId !== scoutRunId) return;

      if (cardTitle) {
        cardTitle.classList.remove('is-typewriter-ready');
      }

      if (status) status.textContent = recommendation.status;

      await typewriter(cardTitle, recommendation.cardTitle, 32, runId);

      if (runId !== scoutRunId) return;

      await new Promise((resolve) => delay(resolve, 250));

      await typewriter(summary, recommendation.summary, 18, runId);

      if (runId !== scoutRunId) return;

      result.classList.remove('guide-result--typing');

      delay(() => {
        if (runId !== scoutRunId || !link) return;

        link.hidden = false;
        link.removeAttribute('hidden');

        window.requestAnimationFrame(() => {
          link.classList.add('is-visible');
        });
      }, 650);
    }, 1000);
  }

  if (scoutPanel) {
    scoutPanel.querySelectorAll('[data-role]').forEach((button) => {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');

      button.addEventListener('click', () => {
        updateScout(button.dataset.role);
      });
    });
  }


  /* ------------------------------------------------------------------------
     Contact form / custom select
  ------------------------------------------------------------------------ */

  document.querySelectorAll('[data-custom-select]').forEach((select) => {
    if (!(select instanceof HTMLSelectElement)) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';

    const button = document.createElement('button');
    button.className = 'custom-select__button';
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');

    const buttonLabel = document.createElement('span');
    buttonLabel.textContent = select.options[select.selectedIndex]?.textContent || '';

    button.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
    button.prepend(buttonLabel);

    const menu = document.createElement('div');
    menu.className = 'custom-select__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;

    Array.from(select.options).forEach((option) => {
      const item = document.createElement('button');
      item.className = 'custom-select__option';
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.dataset.value = option.value;
      item.textContent = option.textContent;

      if (option.selected) {
        item.classList.add('is-selected');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.setAttribute('aria-selected', 'false');
      }

      item.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));

        buttonLabel.textContent = option.textContent;

        menu.querySelectorAll('.custom-select__option').forEach((other) => {
          const selected = other === item;
          other.classList.toggle('is-selected', selected);
          other.setAttribute('aria-selected', String(selected));
        });

        wrapper.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        button.focus();
      });

      menu.appendChild(item);
    });

    select.parentNode.insertBefore(wrapper, select.nextSibling);
    wrapper.appendChild(button);
    wrapper.appendChild(menu);

    button.addEventListener('click', () => {
      const isOpen = wrapper.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
      menu.hidden = !isOpen;
    });

    document.addEventListener('click', (event) => {
      if (wrapper.contains(event.target)) return;

      wrapper.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    });

    wrapper.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;

      wrapper.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      button.focus();
    });
  });

  /* ------------------------------------------------------------------------
     Contact form
  ------------------------------------------------------------------------ */

  const feedback = document.getElementById('feedback');
  const toast = document.querySelector('[data-toast]');
  const toastTitle = document.querySelector('[data-toast-title]');
  const toastMessage = document.querySelector('[data-toast-message]');

  function showToast(type, title, message) {
    if (!toast || !toastTitle || !toastMessage) {
      window.alert(`${title}\n\n${message}`);
      return;
    }

    toast.classList.remove('site-toast--success', 'site-toast--error');
    toast.classList.add(type === 'success' ? 'site-toast--success' : 'site-toast--error');
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.hidden = false;

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.hidden = true;
    }, 5200);
  }

  document.addEventListener('submit', async (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || form.id !== 'contactForm') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    if (feedback) feedback.textContent = 'Sending your enquiry…';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`FormSubmit returned ${response.status}`);
      }

      form.reset();
      if (feedback) feedback.textContent = '';

      showToast(
        'success',
        'Message sent',
        'Thanks — your enquiry has been sent. I’ll get back to you as soon as I can.'
      );
    } catch (error) {
      if (feedback) feedback.textContent = '';

      showToast(
        'error',
        'Message not sent',
        'Something went wrong. Please try again, or email skootinteractive@gmail.com directly.'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Send';
      }
    }
  }, true);
});
