/**
 * AI Medical Chatbot - Signup Form Enhancement Script
 * Provides form validation, real-time feedback, and accessibility features
 */

class SignupFormValidator {
    constructor() {
        this.form = document.querySelector('form');
        this.fields = {
            firstName: document.getElementById('firstName'),
            lastName: document.getElementById('lastName'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword'),
            terms: document.querySelector('input[name="terms"]')
        };
        this.submitButton = document.querySelector('.submit-btn');
        
        this.validationRules = {
            firstName: {
                required: true,
                pattern: /^[a-zA-Z\s'-]{2,30}$/,
                message: 'First name must contain only letters, spaces, hyphens, or apostrophes (2-30 characters)'
            },
            lastName: {
                required: true,
                pattern: /^[a-zA-Z\s'-]{2,30}$/,
                message: 'Last name must contain only letters, spaces, hyphens, or apostrophes (2-30 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            password: {
                required: true,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
                message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
            },
            confirmPassword: {
                required: true,
                matchField: 'password',
                message: 'Passwords do not match'
            },
            terms: {
                required: true,
                message: 'You must agree to the Terms of Service and Privacy Policy'
            }
        };

        this.init();
    }

    init() {
        this.addPasswordToggleButtons();
        this.attachEventListeners();
        this.updateSubmitButtonState();
    }

    /**
     * Add show/hide password toggle buttons
     */
    addPasswordToggleButtons() {
        const passwordFields = [this.fields.password, this.fields.confirmPassword];
        
        passwordFields.forEach(field => {
            if (!field) return;
            
            const fieldGroup = field.parentElement;
            const toggleButton = document.createElement('button');
            toggleButton.type = 'button';
            toggleButton.className = 'password-toggle';
            toggleButton.innerHTML = '👁️';
            toggleButton.setAttribute('aria-label', 'Toggle password visibility');
            toggleButton.style.cssText = `
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                opacity: 0.6;
                transition: opacity 0.3s ease;
            `;
            
            // Position the field group relatively
            fieldGroup.style.position = 'relative';
            field.style.paddingRight = '45px';
            
            toggleButton.addEventListener('click', () => {
                const isPassword = field.type === 'password';
                field.type = isPassword ? 'text' : 'password';
                toggleButton.innerHTML = isPassword ? '🙈' : '👁️';
                toggleButton.setAttribute('aria-label', 
                    isPassword ? 'Hide password' : 'Show password'
                );
            });
            
            toggleButton.addEventListener('mouseenter', () => {
                toggleButton.style.opacity = '1';
            });
            
            toggleButton.addEventListener('mouseleave', () => {
                toggleButton.style.opacity = '0.6';
            });
            
            fieldGroup.appendChild(toggleButton);
        });
    }

    /**
     * Attach event listeners to form elements
     */
    attachEventListeners() {
        // Real-time validation on input
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (!field) return;

            if (field.type === 'checkbox') {
                field.addEventListener('change', () => {
                    this.validateField(fieldName);
                    this.updateSubmitButtonState();
                });
            } else {
                field.addEventListener('input', () => {
                    this.validateField(fieldName);
                    this.updateSubmitButtonState();
                });
                
                field.addEventListener('blur', () => {
                    this.validateField(fieldName);
                });
            }
        });

        // Form submission handler
        this.form.addEventListener('submit', (e) => {
            this.handleFormSubmission(e);
        });

        // Social signup buttons (placeholder functionality)
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.textContent.trim().split(' ').pop();
                this.showTemporaryMessage(`${provider} signup integration coming soon!`, 'info');
            });
        });
    }

    /**
     * Validate individual field
     * @param {string} fieldName - Name of the field to validate
     * @returns {boolean} - Whether the field is valid
     */
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const rule = this.validationRules[fieldName];
        
        if (!field || !rule) return true;

        let isValid = true;
        let errorMessage = '';

        // Check if field is required and empty
        if (rule.required && !this.getFieldValue(field)) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        // Check pattern validation
        else if (rule.pattern && this.getFieldValue(field) && !rule.pattern.test(this.getFieldValue(field))) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Check field matching (for confirm password)
        else if (rule.matchField) {
            const matchField = this.fields[rule.matchField];
            if (this.getFieldValue(field) !== this.getFieldValue(matchField)) {
                isValid = false;
                errorMessage = rule.message;
            }
        }

        this.displayFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    /**
     * Get field value based on field type
     * @param {HTMLElement} field - The form field element
     * @returns {string|boolean} - Field value
     */
    getFieldValue(field) {
        if (field.type === 'checkbox') {
            return field.checked;
        }
        return field.value.trim();
    }

    /**
     * Get human-readable field label
     * @param {string} fieldName - Name of the field
     * @returns {string} - Human-readable label
     */
    getFieldLabel(fieldName) {
        const labels = {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email Address',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            terms: 'Terms acceptance'
        };
        return labels[fieldName] || fieldName;
    }

    /**
     * Display validation feedback for a field
     * @param {HTMLElement} field - The form field element
     * @param {boolean} isValid - Whether the field is valid
     * @param {string} errorMessage - Error message to display
     */
    displayFieldValidation(field, isValid, errorMessage) {
        const fieldGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        if (!fieldGroup) return;

        // Remove existing error message
        const existingError = fieldGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Update field styling
        if (field.type === 'checkbox') {
            const checkmark = fieldGroup.querySelector('.checkmark');
            if (checkmark) {
                checkmark.style.borderColor = isValid ? '#28a745' : '#dc3545';
                checkmark.style.boxShadow = isValid ? '0 0 0 2px rgba(40, 167, 69, 0.2)' : '0 0 0 2px rgba(220, 53, 69, 0.2)';
            }
        } else {
            field.style.borderColor = isValid ? '#28a745' : '#dc3545';
            field.style.boxShadow = isValid ? '0 0 0 3px rgba(40, 167, 69, 0.1)' : '0 0 0 3px rgba(220, 53, 69, 0.1)';
        }

        // Add error message if invalid
        if (!isValid && errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = errorMessage;
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            errorElement.style.cssText = `
                color: #dc3545;
                font-size: 0.85rem;
                margin-top: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideDown 0.3s ease-out;
            `;
            
            // Add error icon
            const errorIcon = document.createElement('span');
            errorIcon.innerHTML = '⚠️';
            errorIcon.style.fontSize = '0.8rem';
            errorElement.insertBefore(errorIcon, errorElement.firstChild);
            
            fieldGroup.appendChild(errorElement);
        }
    }

    /**
     * Validate all form fields
     * @returns {boolean} - Whether all fields are valid
     */
    validateAllFields() {
        let allValid = true;
        let firstInvalidField = null;

        Object.keys(this.fields).forEach(fieldName => {
            const isValid = this.validateField(fieldName);
            if (!isValid && !firstInvalidField) {
                firstInvalidField = this.fields[fieldName];
            }
            allValid = allValid && isValid;
        });

        return { allValid, firstInvalidField };
    }

    /**
     * Update submit button state based on validation
     */
    updateSubmitButtonState() {
        if (!this.submitButton) return;

        const { allValid } = this.validateAllFields();
        
        this.submitButton.disabled = !allValid;
        this.submitButton.style.opacity = allValid ? '1' : '0.6';
        this.submitButton.style.cursor = allValid ? 'pointer' : 'not-allowed';
        
        if (allValid) {
            this.submitButton.removeAttribute('title');
        } else {
            this.submitButton.setAttribute('title', 'Please complete all required fields correctly');
        }
    }

    /**
     * Handle form submission
     * @param {Event} event - Submit event
     */
    handleFormSubmission(event) {
        event.preventDefault();
        
        const { allValid, firstInvalidField } = this.validateAllFields();
        
        if (!allValid) {
            // Focus on first invalid field
            if (firstInvalidField) {
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
            
            this.showTemporaryMessage('Please correct the errors above before submitting.', 'error');
            return;
        }

        // Simulate successful account creation
        this.simulateAccountCreation();
    }

    /**
     * Simulate account creation process
     */
    async simulateAccountCreation() {
        const originalButtonText = this.submitButton.textContent;
        
        // Show loading state
        this.submitButton.textContent = 'Creating Account...';
        this.submitButton.disabled = true;
        this.submitButton.style.cursor = 'wait';
        
        // Add loading animation
        const loadingSpinner = document.createElement('div');
        loadingSpinner.innerHTML = '⏳';
        loadingSpinner.style.cssText = `
            display: inline-block;
            margin-right: 8px;
            animation: spin 1s linear infinite;
        `;
        this.submitButton.insertBefore(loadingSpinner, this.submitButton.firstChild);
        
        // Add CSS animation for spinner
        if (!document.getElementById('spinner-animation')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showTemporaryMessage('Account created successfully! 🎉', 'success');
            
            // Reset form after success
            setTimeout(() => {
                this.resetForm();
            }, 2000);
            
        } catch (error) {
            this.showTemporaryMessage('Something went wrong. Please try again.', 'error');
        } finally {
            // Restore button state
            loadingSpinner.remove();
            this.submitButton.textContent = originalButtonText;
            this.submitButton.disabled = false;
            this.submitButton.style.cursor = 'pointer';
        }
    }

    /**
     * Show temporary message to user
     * @param {string} message - Message to display
     * @param {string} type - Message type (success, error, info)
     */
    showTemporaryMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.temp-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'temp-message';
        messageElement.textContent = message;
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'polite');
        
        const colors = {
            success: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
            error: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
            info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
        };
        
        const color = colors[type] || colors.info;
        
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color.bg};
            color: ${color.text};
            border: 1px solid ${color.border};
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-weight: 600;
            animation: slideDown 0.3s ease-out;
            max-width: 90vw;
            text-align: center;
        `;
        
        document.body.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideUp 0.3s ease-in forwards';
                messageElement.addEventListener('animationend', () => {
                    messageElement.remove();
                });
            }
        }, 5000);
        
        // Add slideUp animation
        if (!document.getElementById('slideup-animation')) {
            const style = document.createElement('style');
            style.id = 'slideup-animation';
            style.textContent = `
                @keyframes slideUp {
                    from { opacity: 1; transform: translateX(-50%) translateY(0); }
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        this.form.reset();
        
        // Clear all validation styling and messages
        Object.values(this.fields).forEach(field => {
            if (!field) return;
            
            if (field.type === 'checkbox') {
                const checkmark = field.parentElement.querySelector('.checkmark');
                if (checkmark) {
                    checkmark.style.borderColor = '';
                    checkmark.style.boxShadow = '';
                }
            } else {
                field.style.borderColor = '';
                field.style.boxShadow = '';
            }
        });
        
        // Remove error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
        this.updateSubmitButtonState();
    }
}

// Initialize the form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupFormValidator();
    
    // Add some additional accessibility enhancements
    addAccessibilityEnhancements();
});

/**
 * Additional accessibility enhancements
 */
function addAccessibilityEnhancements() {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 1001;
        font-weight: bold;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main';
    }
    
    // Improve form labels association
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        const input = label.nextElementSibling;
        if (input && input.tagName === 'INPUT' && input.id) {
            label.setAttribute('for', input.id);
        }
    });
    
    // Add ARIA attributes to password strength indicator
    const passwordHint = document.querySelector('.password-hint');
    if (passwordHint) {
        passwordHint.id = 'password-help';
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.setAttribute('aria-describedby', 'password-help');
        }
    }
}

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignupFormValidator;
}