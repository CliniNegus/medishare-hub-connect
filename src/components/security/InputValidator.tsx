
import React from 'react';

// Input validation and sanitization utilities
export class InputValidator {
  // Email validation
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  // Password validation
  static validatePassword(password: string): { isValid: boolean; error?: string; strength?: string } {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    if (password.length > 128) {
      return { isValid: false, error: 'Password is too long' };
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strengthScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (strengthScore < 3) {
      return { 
        isValid: false, 
        error: 'Password must contain at least 3 of: uppercase, lowercase, number, special character',
        strength: 'weak'
      };
    }
    
    return { 
      isValid: true, 
      strength: strengthScore === 4 ? 'strong' : 'medium' 
    };
  }

  // Name validation
  static validateName(name: string): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: 'Name is required' };
    }
    
    if (name.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }
    
    if (name.length > 100) {
      return { isValid: false, error: 'Name is too long' };
    }
    
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: 'Name contains invalid characters' };
    }
    
    return { isValid: true };
  }

  // Phone validation
  static validatePhone(phone: string): { isValid: boolean; error?: string } {
    if (!phone) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
    
    return { isValid: true };
  }

  // URL validation
  static validateURL(url: string): { isValid: boolean; error?: string } {
    if (!url) {
      return { isValid: true }; // URL is optional in most cases
    }
    
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
  }

  // Text sanitization
  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  // HTML sanitization for rich text
  static sanitizeHTML(html: string): string {
    // This is a basic implementation - in production, use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  // File validation
  static validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): { isValid: boolean; error?: string } {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    } = options;

    if (!file) {
      return { isValid: false, error: 'File is required' };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return { isValid: false, error: 'File extension not allowed' };
    }

    return { isValid: true };
  }

  // Number validation
  static validateNumber(value: string | number, options: {
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}): { isValid: boolean; error?: string } {
    const { min, max, integer = false } = options;
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return { isValid: false, error: 'Please enter a valid number' };
    }
    
    if (integer && !Number.isInteger(num)) {
      return { isValid: false, error: 'Please enter a whole number' };
    }
    
    if (min !== undefined && num < min) {
      return { isValid: false, error: `Value must be at least ${min}` };
    }
    
    if (max !== undefined && num > max) {
      return { isValid: false, error: `Value must be at most ${max}` };
    }
    
    return { isValid: true };
  }
}

// React hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (field: string, value: any, validationType: string, options?: any) => {
    let result: { isValid: boolean; error?: string } = { isValid: true };

    switch (validationType) {
      case 'email':
        result = InputValidator.validateEmail(value);
        break;
      case 'password':
        result = InputValidator.validatePassword(value);
        break;
      case 'name':
        result = InputValidator.validateName(value);
        break;
      case 'phone':
        result = InputValidator.validatePhone(value);
        break;
      case 'url':
        result = InputValidator.validateURL(value);
        break;
      case 'number':
        result = InputValidator.validateNumber(value, options);
        break;
      case 'file':
        result = InputValidator.validateFile(value, options);
        break;
      default:
        result = { isValid: true };
    }

    setErrors(prev => ({
      ...prev,
      [field]: result.error || ''
    }));

    return result.isValid;
  };

  const clearError = (field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors: Object.values(errors).some(error => error !== '')
  };
};

export default InputValidator;
