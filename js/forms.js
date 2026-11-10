/**
 * HAWK PROPERTY SURVEYS - FORMS & FEE ESTIMATOR
 * Form validation, interactive fee calculator, and feedback messaging
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnquiryForms();
  initFeeEstimator();
});

/* Enquiry Forms Validation & Handling */
function initEnquiryForms() {
  const forms = document.querySelectorAll('.survey-enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const feedback = form.querySelector('.form-feedback') || createFeedbackContainer(form);
      feedback.className = 'form-feedback';
      feedback.style.display = 'none';

      // Required fields check
      const name = form.querySelector('[name="fullName"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');
      const surveyType = form.querySelector('[name="surveyType"]');
      const consent = form.querySelector('[name="privacyConsent"]');

      const errors = [];

      if (!name || !name.value.trim()) {
        errors.push('Please enter your full name.');
      }

      if (!email || !isValidEmail(email.value.trim())) {
        errors.push('Please provide a valid email address.');
      }

      if (!phone || !isValidPhone(phone.value.trim())) {
        errors.push('Please provide a valid UK telephone number.');
      }

      if (surveyType && (!surveyType.value || surveyType.value === '')) {
        errors.push('Please select the required survey type.');
      }

      if (consent && !consent.checked) {
        errors.push('Please accept the privacy policy to proceed.');
      }

      if (errors.length > 0) {
        feedback.className = 'form-feedback error';
        feedback.innerHTML = `<strong>Please correct the following:</strong><br>${errors.join('<br>')}`;
        feedback.style.display = 'block';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }

      // Success State
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Processing Enquiry...';
      }

      setTimeout(() => {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `
          <strong>Thank you, ${escapeHtml(name.value.trim())}!</strong><br>
          Your survey enquiry has been registered. Our senior surveying coordinator will review your property details and contact you at <strong>${escapeHtml(email.value.trim())}</strong> or <strong>${escapeHtml(phone.value.trim())}</strong> within 1 business day with a fixed quotation and available inspection dates.
        `;
        feedback.style.display = 'block';
        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 700);
    });
  });
}

function createFeedbackContainer(form) {
  const div = document.createElement('div');
  div.className = 'form-feedback';
  form.appendChild(div);
  return div;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s\+\(\)\-]{8,20}$/.test(phone);
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* Interactive Survey Fee Estimator */
function initFeeEstimator() {
  const calcForm = document.getElementById('feeEstimatorForm');
  const resultContainer = document.getElementById('feeEstimateResult');
  if (!calcForm || !resultContainer) return;

  const basePrices = {
    'level-2': { flat: 450, terraced: 520, semi: 590, detached: 680 },
    'level-3': { flat: 650, terraced: 780, semi: 890, detached: 1050 },
    'damp-mould': { flat: 380, terraced: 420, semi: 460, detached: 540 },
    'timber': { flat: 350, terraced: 390, semi: 430, detached: 510 },
    'leak': { flat: 420, terraced: 460, semi: 510, detached: 590 },
    'thermography': { flat: 390, terraced: 440, semi: 490, detached: 580 },
    'aerial': { flat: 350, terraced: 390, semi: 440, detached: 520 },
    'party-wall': { flat: 480, terraced: 550, semi: 620, detached: 690 },
  };

  const calculate = () => {
    const surveyType = calcForm.querySelector('[name="calcSurveyType"]').value;
    const propertyType = calcForm.querySelector('[name="calcPropertyType"]').value;
    const bedrooms = parseInt(calcForm.querySelector('[name="calcBedrooms"]').value, 10) || 2;

    if (basePrices[surveyType] && basePrices[surveyType][propertyType]) {
      let fee = basePrices[surveyType][propertyType];
      if (bedrooms > 3) {
        fee += (bedrooms - 3) * 60;
      }

      resultContainer.innerHTML = `
        <div style="background-color: #17191B; color: #FFF; padding: 1.5rem; border-radius: 4px; border-left: 3px solid #D99A43;">
          <div style="font-size: 0.8125rem; text-transform: uppercase; letter-spacing: 0.1em; color: #D99A43; margin-bottom: 0.25rem;">Estimated Survey Fee</div>
          <div style="font-size: 2.25rem; font-weight: 800; color: #FFF; line-height: 1.1; margin-bottom: 0.5rem;">£${fee} <span style="font-size: 0.875rem; font-weight: 400; color: #9CA3AF;">inc. VAT</span></div>
          <p style="font-size: 0.8125rem; color: #9CA3AF; line-height: 1.5; margin-bottom: 1rem;">
            Estimated guide price for a ${bedrooms}-bedroom ${propertyType} property. All reports include complete photographic schedule, independent diagnosis, and RICS / PCA certification.
          </p>
          <a href="#enquirySection" class="btn btn-primary" style="width: 100%;" onclick="prefillEnquiry('${surveyType}')">Book This Survey</a>
        </div>
      `;
    }
  };

  calcForm.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('change', calculate);
  });
  calculate();
}

window.prefillEnquiry = function(type) {
  const surveySelect = document.querySelector('.survey-enquiry-form select[name="surveyType"]');
  if (surveySelect) {
    surveySelect.value = type;
  }
};
