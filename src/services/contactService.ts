import type { ContactForm } from '../types/portfolio';
import { 
  getContactConfig, 
  cleanFormData, 
  isValidEmail, 
  detectSpam, 
  generateSubmissionId,
  checkRateLimit,
  getLastSubmissionTime,
  setLastSubmissionTime
} from '../utils/contactUtils';

export interface ContactSubmissionResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

class ContactService {
  private readonly config = getContactConfig();

  /**
   * Generate email template for contact form submission
   */
  generateEmailTemplate(formData: ContactForm): EmailTemplate {
    const { name, email, subject, message } = formData;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #4a5568; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #3b82f6; }
            .message-content { white-space: pre-wrap; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
              <p>You have received a new message from your portfolio website.</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${name} &lt;${email}&gt;</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value message-content">${message}</div>
              </div>
              <div class="footer">
                <p>This message was sent from your portfolio contact form at ${new Date().toLocaleString()}.</p>
                <p>Reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
New Contact Form Submission

From: ${name} <${email}>
Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio contact form at ${new Date().toLocaleString()}.
Reply directly to this email to respond to ${name}.
    `;

    return {
      to: this.config.recipientEmail,
      subject: `Portfolio Contact: ${subject}`,
      html,
      text
    };
  }

  /**
   * Submit contact form data
   */
  async submitContactForm(formData: ContactForm): Promise<ContactSubmissionResult> {
    try {
      // Check rate limiting
      const lastSubmission = getLastSubmissionTime();
      if (!checkRateLimit(lastSubmission, this.config.rateLimitDelay)) {
        const remainingTime = Math.ceil((this.config.rateLimitDelay - (Date.now() - lastSubmission)) / 1000);
        return {
          success: false,
          message: `Please wait ${remainingTime} seconds before sending another message.`
        };
      }

      // Clean and validate form data
      const cleanedData = cleanFormData(formData);
      const validation = this.validateFormData(cleanedData);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      // Generate submission ID
      const submissionId = generateSubmissionId();

      // Generate email template
      const emailTemplate = this.generateEmailTemplate(cleanedData);

      // Submit the form
      let response;
      if (this.config.enableRealSubmission) {
        response = await this.submitToAPI(cleanedData, emailTemplate, submissionId);
      } else {
        response = await this.simulateFormSubmission(cleanedData, emailTemplate);
      }

      if (response.success) {
        // Update rate limiting
        setLastSubmissionTime();
        
        return {
          success: true,
          message: 'Thank you for your message! I\'ll get back to you within 24 hours.',
          data: { ...response.data, submissionId }
        };
      } else {
        return {
          success: false,
          message: 'Sorry, there was an error sending your message. Please try again or contact me directly via email.'
        };
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
      };
    }
  }

  /**
   * Validate form data
   */
  private validateFormData(formData: ContactForm): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name?.trim()) {
      errors.push('Name is required');
    } else if (formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.subject?.trim()) {
      errors.push('Subject is required');
    } else if (formData.subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters long');
    }

    if (!formData.message?.trim()) {
      errors.push('Message is required');
    } else if (formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    } else if (formData.message.trim().length > this.config.maxMessageLength) {
      errors.push(`Message must be less than ${this.config.maxMessageLength} characters`);
    }

    // Check for potential spam
    if (detectSpam(formData.message, formData.name, formData.email)) {
      errors.push('Message appears to be spam and cannot be sent');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Submit to real API endpoint
   */
  private async submitToAPI(
    formData: ContactForm, 
    emailTemplate: EmailTemplate, 
    submissionId: string
  ): Promise<{ success: boolean; data?: any }> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        emailTemplate,
        submissionId,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: result.success || false,
      data: result.data
    };
  }

  /**
   * Simulate form submission (for development/demo purposes)
   */
  private async simulateFormSubmission(
    formData: ContactForm, 
    emailTemplate: EmailTemplate
  ): Promise<{ success: boolean; data?: any }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simulate occasional failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }

    // Log the email template (in production, this would be sent via email service)
    console.log('📧 Email Template Generated:', emailTemplate);
    console.log('📝 Form Data Submitted:', formData);

    return {
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        emailTemplate,
        message: 'Form submitted successfully (simulated)'
      }
    };
  }

  /**
   * Send to actual email service (placeholder for real implementation)
   */
  async sendEmail(emailTemplate: EmailTemplate): Promise<boolean> {
    // This would integrate with services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP
    
    try {
      // Example API call structure:
      // const response = await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailTemplate)
      // });
      // return response.ok;

      console.log('Email would be sent:', emailTemplate);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}

export const contactService = new ContactService();