/**
 * Utility functions for contact form handling
 */

export interface ContactConfig {
  apiEndpoint: string;
  recipientEmail: string;
  enableRealSubmission: boolean;
  maxMessageLength: number;
  rateLimitDelay: number;
}

/**
 * Get contact configuration from environment variables
 */
export const getContactConfig = (): ContactConfig => {
  return {
    apiEndpoint: import.meta.env.VITE_CONTACT_API_ENDPOINT || '/api/contact',
    recipientEmail: import.meta.env.VITE_CONTACT_RECIPIENT_EMAIL || 'manasnaidu.jsd@gmail.com',
    enableRealSubmission: import.meta.env.VITE_ENABLE_REAL_CONTACT_SUBMISSION === 'true',
    maxMessageLength: parseInt(import.meta.env.VITE_MAX_MESSAGE_LENGTH || '2000'),
    rateLimitDelay: parseInt(import.meta.env.VITE_CONTACT_RATE_LIMIT_DELAY || '5000')
  };
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX for international numbers starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if format is not recognized
  return phone;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Check if the user has exceeded rate limit
 */
export const checkRateLimit = (lastSubmissionTime: number, rateLimitDelay: number): boolean => {
  const now = Date.now();
  return (now - lastSubmissionTime) >= rateLimitDelay;
};

/**
 * Store last submission time in localStorage
 */
export const setLastSubmissionTime = (): void => {
  localStorage.setItem('lastContactSubmission', Date.now().toString());
};

/**
 * Get last submission time from localStorage
 */
export const getLastSubmissionTime = (): number => {
  const stored = localStorage.getItem('lastContactSubmission');
  return stored ? parseInt(stored) : 0;
};

/**
 * Generate a unique submission ID
 */
export const generateSubmissionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `contact_${timestamp}_${random}`;
};

/**
 * Validate email format with more comprehensive regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Check for common spam patterns
 */
export const detectSpam = (message: string, name: string, email: string): boolean => {
  const spamPatterns = [
    /viagra|cialis|pharmacy/i,
    /casino|gambling|lottery|winner/i,
    /click here|visit now|act now/i,
    /free money|make money|earn \$\d+/i,
    /congratulations.*won/i,
    /urgent.*reply/i,
    /\b(seo|backlinks?|link building)\b/i,
    /\b(bitcoin|cryptocurrency|crypto)\b.*\b(investment|trading)\b/i
  ];

  const suspiciousPatterns = [
    // Multiple consecutive capital letters
    /[A-Z]{5,}/,
    // Excessive punctuation
    /[!?]{3,}/,
    // Multiple URLs
    /(https?:\/\/[^\s]+.*){2,}/i,
    // Email addresses in message (suspicious for contact forms)
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  ];

  const text = `${name} ${email} ${message}`.toLowerCase();
  
  return spamPatterns.some(pattern => pattern.test(text)) ||
         suspiciousPatterns.some(pattern => pattern.test(message));
};

/**
 * Clean and validate form data
 */
export const cleanFormData = (formData: any): any => {
  return {
    name: sanitizeInput(formData.name?.trim() || ''),
    email: sanitizeInput(formData.email?.trim() || ''),
    subject: sanitizeInput(formData.subject?.trim() || ''),
    message: sanitizeInput(formData.message?.trim() || '')
  };
};