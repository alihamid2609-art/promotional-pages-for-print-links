(function () {
  'use strict';

  function ensureCheckoutModal() {
    var existing = document.getElementById('checkout-overlay');

    if (existing || !document.querySelector('.purchase-plan')) {
      return existing;
    }

    document.body.insertAdjacentHTML('beforeend',
      '<div class="checkout-overlay" id="checkout-overlay" aria-hidden="true">' +
        '<div class="checkout-dialog" role="dialog" aria-modal="true" aria-labelledby="checkout-title">' +
          '<button type="button" class="checkout-close" id="checkout-close" aria-label="Close checkout">&times;</button>' +
          '<div class="checkout-grid">' +
            '<div class="checkout-summary">' +
              '<div class="checkout-brand"><img src="images/logo-3.png" alt="Print Links"></div>' +
              '<span class="checkout-kicker">Secure checkout</span>' +
              '<h3 id="checkout-title">Start your Print Links subscription</h3>' +
              '<div class="selected-plan-card"><div><span>Selected plan</span><strong id="checkout-plan">Standard</strong></div><div class="selected-price"><strong id="checkout-price">PKR 5,999</strong><span id="checkout-cycle">Monthly</span></div></div>' +
              '<ul class="checkout-benefits"><li><i class="fa fa-check"></i> Instant account setup after payment</li><li><i class="fa fa-check"></i> Encrypted card details ready for Stripe</li><li><i class="fa fa-check"></i> Cancel or change plan anytime</li></ul>' +
              '<div class="checkout-secure-note"><i class="fa fa-lock"></i><span>Payment screen preview. No real card is charged yet.</span></div>' +
            '</div>' +
            '<form class="checkout-form" id="checkout-form" novalidate>' +
              '<div class="checkout-step"><span>1</span><h4>Contact details</h4></div>' +
              '<div class="field-row"><label for="checkout-email">Email address</label><input type="email" id="checkout-email" name="email" placeholder="you@company.com" autocomplete="email" required></div>' +
              '<div class="field-row"><label for="checkout-name">Name on card</label><input type="text" id="checkout-name" name="name" placeholder="Full name" autocomplete="cc-name" required></div>' +
              '<div class="checkout-step payment-step"><span>2</span><h4>Card information</h4><div class="card-icons" aria-label="Supported cards"><i class="fab fa-cc-visa"></i><i class="fab fa-cc-mastercard"></i><i class="fab fa-cc-amex"></i></div></div>' +
              '<div class="field-row card-number-field"><label for="checkout-card">Card number</label><input type="text" id="checkout-card" name="card" placeholder="4242 4242 4242 4242" inputmode="numeric" autocomplete="cc-number" maxlength="19" required></div>' +
              '<div class="checkout-two-col"><div class="field-row"><label for="checkout-expiry">Expiry</label><input type="text" id="checkout-expiry" name="expiry" placeholder="MM / YY" inputmode="numeric" autocomplete="cc-exp" maxlength="7" required></div><div class="field-row"><label for="checkout-cvc">CVC</label><input type="text" id="checkout-cvc" name="cvc" placeholder="123" inputmode="numeric" autocomplete="cc-csc" maxlength="4" required></div></div>' +
              '<div class="field-row"><label for="checkout-company">Company name</label><input type="text" id="checkout-company" name="company" placeholder="Your printing business" autocomplete="organization"></div>' +
              '<label class="checkout-checkbox"><input type="checkbox" id="checkout-terms" required><span>I agree to activate this subscription once live payments are connected.</span></label>' +
              '<button type="submit" class="theme-btn-two checkout-submit"><span>Subscribe Now</span><i class="fa fa-arrow-right"></i></button>' +
              '<div class="checkout-message" role="status" aria-live="polite"></div>' +
            '</form>' +
          '</div>' +
        '</div>' +
      '</div>');

    return document.getElementById('checkout-overlay');
  }

  var overlay = ensureCheckoutModal();
  if (!overlay) return;

  var closeButton = document.getElementById('checkout-close');
  var checkoutForm = document.getElementById('checkout-form');
  var checkoutMessage = checkoutForm ? checkoutForm.querySelector('.checkout-message') : null;
  var planName = document.getElementById('checkout-plan');
  var planPrice = document.getElementById('checkout-price');
  var planCycle = document.getElementById('checkout-cycle');
  var lastFocusedElement = null;

  function showMessage(element, type, text) {
    if (!element) return;
    element.className = element.className.replace(/\bis-success\b|\bis-error\b/g, '').trim();
    element.classList.add(type === 'success' ? 'is-success' : 'is-error');
    element.textContent = text;
  }

  function clearFieldError(input) {
    var field = input.closest('.field-row');
    if (!field) return;
    field.classList.remove('has-error');
    var error = field.querySelector('.field-error');
    if (error) error.remove();
  }

  function setFieldError(input, message) {
    var field = input.closest('.field-row');
    if (!field) return;
    clearFieldError(input);
    field.classList.add('has-error');
    var error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    field.appendChild(error);
  }

  function openCheckout(button) {
    lastFocusedElement = document.activeElement;
    planName.textContent = button.getAttribute('data-plan') || 'Selected';
    planPrice.textContent = button.getAttribute('data-price') || 'PKR 0';
    planCycle.textContent = button.getAttribute('data-cycle') || 'Monthly';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('checkout-locked');
    setTimeout(function () {
      var email = document.getElementById('checkout-email');
      if (email) email.focus();
    }, 60);
  }

  function closeCheckout() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('checkout-locked');
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(value) {
    var digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + ' / ' + digits.slice(2);
    return digits;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.querySelectorAll('.purchase-plan').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      openCheckout(button);
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeCheckout);
  }

  if (overlay) {
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeCheckout();
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
      closeCheckout();
    }
  });

  var cardInput = document.getElementById('checkout-card');
  var expiryInput = document.getElementById('checkout-expiry');
  var cvcInput = document.getElementById('checkout-cvc');

  if (cardInput) {
    cardInput.addEventListener('input', function () {
      cardInput.value = formatCardNumber(cardInput.value);
      clearFieldError(cardInput);
    });
  }

  if (expiryInput) {
    expiryInput.addEventListener('input', function () {
      expiryInput.value = formatExpiry(expiryInput.value);
      clearFieldError(expiryInput);
    });
  }

  if (cvcInput) {
    cvcInput.addEventListener('input', function () {
      cvcInput.value = cvcInput.value.replace(/\D/g, '').slice(0, 4);
      clearFieldError(cvcInput);
    });
  }

  if (checkoutForm) {
    checkoutForm.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldError(input);
      });
    });

    checkoutForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = document.getElementById('checkout-email');
      var name = document.getElementById('checkout-name');
      var card = document.getElementById('checkout-card');
      var expiry = document.getElementById('checkout-expiry');
      var cvc = document.getElementById('checkout-cvc');
      var terms = document.getElementById('checkout-terms');
      var firstInvalid = null;

      [email, name, card, expiry, cvc].forEach(function (input) {
        if (input) clearFieldError(input);
      });

      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        setFieldError(email, 'Enter a valid email address.');
        firstInvalid = firstInvalid || email;
      }
      if (!name.value.trim()) {
        setFieldError(name, 'Enter the cardholder name.');
        firstInvalid = firstInvalid || name;
      }
      if (card.value.replace(/\D/g, '').length < 15) {
        setFieldError(card, 'Enter a valid card number.');
        firstInvalid = firstInvalid || card;
      }
      if (!/^(0[1-9]|1[0-2])\s\/\s\d{2}$/.test(expiry.value)) {
        setFieldError(expiry, 'Use MM / YY format.');
        firstInvalid = firstInvalid || expiry;
      }
      if (cvc.value.replace(/\D/g, '').length < 3) {
        setFieldError(cvc, 'Enter the security code.');
        firstInvalid = firstInvalid || cvc;
      }
      if (!terms.checked) {
        showMessage(checkoutMessage, 'error', 'Please confirm the subscription terms before continuing.');
        firstInvalid = firstInvalid || terms;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      showMessage(checkoutMessage, 'success', 'Subscription details saved for the ' + planName.textContent + ' plan. Stripe can be connected to this step later.');
      checkoutForm.querySelector('.checkout-submit span').textContent = 'Ready for Stripe';
    });
  }

})();
