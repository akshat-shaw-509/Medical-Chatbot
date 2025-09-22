class LoginFormValidator {
    constructor() {
        this.form = document.querySelector('form');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.querySelector('input[name="rememberMe"]');
        this.submitButton = document.querySelector('button[type="submit"]');

        this.isFormValid = false;
        this.validationRules = {
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                minLength: 5,
                errorMessage: 'Please enter a valid email address'
            },
            password: {
                minLength: 8,
                errorMessage: 'Password must be at least 8 characters long'
            }
        };

        this.init();
    }

    init() {
        this.createErrorElements();
        this.createSuccessMessage();
        this.setupPasswordToggle();
        this.loadRememberedEmail();
        this.attachEventListeners();
        this.updateSubmitButtonState();
        this.emailInput.focus();
        console.log('Login form validator initialized successfully');
    }

    createErrorElements() {
        [this.emailInput, this.passwordInput].forEach(input => {
            if (!input.nextElementSibling?.classList.contains('error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.setAttribute('role', 'alert');
                errorDiv.setAttribute('aria-live', 'polite');
                input.parentNode.insertBefore(errorDiv, input.nextSibling);
            }
        });
    }

    createSuccessMessage() {
        if (!document.querySelector('.success-message')) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.setAttribute('role', 'alert');
            successDiv.setAttribute('aria-live', 'polite');
            this.form.insertBefore(successDiv, this.form.firstChild);
        }
    }

    setupPasswordToggle() {
        const passwordWrapper = document.createElement('div');
        passwordWrapper.className = 'password-wrapper';
        this.passwordInput.parentNode.insertBefore(passwordWrapper, this.passwordInput);
        passwordWrapper.appendChild(this.passwordInput);

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'password-toggle';
        toggleButton.innerHTML = '👁️';
        toggleButton.setAttribute('aria-label', 'Toggle password visibility');
        toggleButton.title = 'Show/Hide Password';
        passwordWrapper.appendChild(toggleButton);

        toggleButton.addEventListener('click', () => {
            const isPassword = this.passwordInput.type === 'password';
            this.passwordInput.type = isPassword ? 'text' : 'password';
            toggleButton.innerHTML = isPassword ? '🙈' : '👁️';
            toggleButton.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            this.passwordInput.focus();
        });
    }

    loadRememberedEmail() {
        try {
            const rememberedEmail = localStorage.getItem('aiMedicalChatbot_rememberedEmail');
            if (rememberedEmail) {
                this.emailInput.value = rememberedEmail;
                this.rememberMeCheckbox.checked = true;
                this.validateField(this.emailInput, true);
                this.passwordInput.focus();
            }
        } catch (error) {
            console.warn('Could not load remembered email:', error.message);
        }
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateField(this.emailInput));
        this.passwordInput.addEventListener('blur', () => this.validateField(this.passwordInput));
        this.emailInput.addEventListener('input', this.debounce(() => this.validateField(this.emailInput, true), 300));
        this.passwordInput.addEventListener('input', this.debounce(() => this.validateField(this.passwordInput, true), 300));
        this.rememberMeCheckbox.addEventListener('change', () => this.handleRememberMe());
        this.form.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    validateField(field, isRealTime = false) {
        const fieldName = field.id;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        const errorElement = field.nextElementSibling;

        let isValid = true;
        let errorMessage = '';

        if (isRealTime && !value) {
            this.clearFieldValidation(field);
            this.updateSubmitButtonState();
            return true;
        }

        if (!value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        } else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.errorMessage;
        } else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.errorMessage;
        }

        this.updateFieldUI(field, isValid, errorMessage, errorElement);
        this.updateSubmitButtonState();
        return isValid;
    }

    updateFieldUI(field, isValid, errorMessage, errorElement) {
        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.setAttribute('aria-describedby', '');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            if (!errorElement.id) errorElement.id = `${field.id}-error`;
            field.setAttribute('aria-describedby', errorElement.id);
        }
    }

    clearFieldValidation(field) {
        field.classList.remove('valid', 'invalid');
        const errorElement = field.nextElementSibling;
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    validateForm() {
        const emailValid = this.validateField(this.emailInput);
        const passwordValid = this.validateField(this.passwordInput);
        this.isFormValid = emailValid && passwordValid;
        return this.isFormValid;
    }

    updateSubmitButtonState() {
        const emailValue = this.emailInput.value.trim();
        const passwordValue = this.passwordInput.value.trim();
        const shouldEnable = emailValue && passwordValue &&
            !this.emailInput.classList.contains('invalid') &&
            !this.passwordInput.classList.contains('invalid');
        this.submitButton.disabled = !shouldEnable;
        this.submitButton.style.opacity = shouldEnable ? '1' : '0.7';
        this.submitButton.style.cursor = shouldEnable ? 'pointer' : 'not-allowed';
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.hideSuccessMessage();

        if (!this.validateForm()) {
            this.focusFirstInvalidField();
            return;
        }

        this.setLoadingState(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.handleRememberMe();
            this.showSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => console.log('Redirecting to dashboard...'), 2000);
        } catch (error) {
            console.error('Login error:', error);
            this.showErrorMessage('Login failed. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    handleRememberMe() {
        try {
            if (this.rememberMeCheckbox.checked) {
                localStorage.setItem('aiMedicalChatbot_rememberedEmail', this.emailInput.value.trim());
            } else {
                localStorage.removeItem('aiMedicalChatbot_rememberedEmail');
            }
        } catch (error) {
            console.warn('Could not save remember me preference:', error.message);
        }
    }

    focusFirstInvalidField() {
        const invalidField = this.form.querySelector('.invalid');
        if (invalidField) {
            invalidField.focus();
            invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showSuccessMessage(message) {
        const successElement = document.querySelector('.success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show');
            successElement.setAttribute('aria-live', 'assertive');
            this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    hideSuccessMessage() {
        const successElement = document.querySelector('.success-message');
        if (successElement) {
            successElement.classList.remove('show');
            successElement.setAttribute('aria-live', 'polite');
        }
    }

    showErrorMessage(message) {
        const successElement = document.querySelector('.success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
            successElement.style.color = '#b91c1c';
            successElement.classList.add('show');
            successElement.setAttribute('aria-live', 'assertive');
            this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                successElement.style.background = '';
                successElement.style.color = '';
            }, 4000);
        }
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Logging in...';
        } else {
            this.updateSubmitButtonState();
            this.submitButton.textContent = 'Login';
        }
    }

    handleKeyboardNavigation(e) {
        if (e.key === 'Enter' && document.activeElement === this.submitButton) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }
}