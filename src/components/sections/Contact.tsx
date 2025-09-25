import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Download, Github, Linkedin, ExternalLink, Phone } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { contactService } from '../../services/contactService';
import type { ContactSubmissionResult } from '../../services/contactService';
import { formatPhoneNumber } from '../../utils/contactUtils';
// Removed unused imports

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SubmissionState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
    message: ''
  });

  const { personalInfo, socialLinks } = portfolioData;

  const socialIcons = {
    github: Github,
    linkedin: Linkedin
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmission({ status: 'submitting', message: '' });

    try {
      const result: ContactSubmissionResult = await contactService.submitContactForm(formData);
      
      if (result.success) {
        setSubmission({ 
          status: 'success', 
          message: result.message 
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      } else {
        setSubmission({ 
          status: 'error', 
          message: result.message 
        });
      }
    } catch {
      setSubmission({ 
        status: 'error', 
        message: 'An unexpected error occurred. Please try again later.' 
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Get In Touch</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Ready to discuss your next Java project or explore collaboration opportunities? Let's connect!
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              
              {/* Email */}
              <motion.a
                href={`mailto:${personalInfo.email}`}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300 group mb-4"
              >
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg group-hover:shadow-lg transition-shadow">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-200">Email</p>
                  <p className="text-gray-400 group-hover:text-blue-400 transition-colors">{personalInfo.email}</p>
                </div>
                <ExternalLink className="text-gray-500 group-hover:text-blue-400 transition-colors ml-auto" size={16} />
              </motion.a>

              {/* Phone */}
              {personalInfo.phone && (
                <motion.a
                  href={`tel:${personalInfo.phone}`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300 group mb-4"
                >
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg group-hover:shadow-lg transition-shadow">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">Phone</p>
                    <p className="text-gray-400 group-hover:text-green-400 transition-colors">{formatPhoneNumber(personalInfo.phone)}</p>
                  </div>
                  <ExternalLink className="text-gray-500 group-hover:text-green-400 transition-colors ml-auto" size={16} />
                </motion.a>
              )}
              
              {/* Location */}
              <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <MapPin className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-200">Location</p>
                  <p className="text-gray-400">{personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Connect With Me</h4>
              <div className="space-y-3">
                {socialLinks.map((social) => {
                  const IconComponent = socialIcons[social.icon as keyof typeof socialIcons];
                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                    >
                      <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all">
                        {IconComponent && <IconComponent className="text-gray-400 group-hover:text-white" size={18} />}
                      </div>
                      <span className="text-gray-300 group-hover:text-blue-400 transition-colors">{social.platform}</span>
                      <ExternalLink className="text-gray-500 group-hover:text-blue-400 transition-colors ml-auto" size={14} />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Resume Download */}
            <motion.a
              href="/resume/Manas_Resume_Java.pdf"
              download="Manas_Resume_Java.pdf"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-3 w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group"
            >
              <Download className="group-hover:animate-bounce" size={20} />
              <span>Download Resume</span>
            </motion.a>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm"
          >
            <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
            
            {submission.status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{submission.message}</span>
                </div>
              </motion.div>
            )}

            {submission.status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{submission.message}</span>
                </div>
              </motion.div>
            )}

            {submission.status === 'submitting' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <span>Sending your message...</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name *"
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email *"
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Subject *"
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.subject 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                  }`}
                />
                {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Your Message *"
                    maxLength={2000}
                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:ring-red-500/50' 
                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                    }`}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {formData.message.length}/2000
                  </div>
                </div>
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
                {!errors.message && formData.message.length > 0 && formData.message.length < 10 && (
                  <p className="mt-1 text-sm text-yellow-400">
                    Message should be at least 10 characters long
                  </p>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: submission.status === 'submitting' ? 1 : 1.02 }}
                whileTap={{ scale: submission.status === 'submitting' ? 1 : 0.98 }}
                type="submit"
                disabled={submission.status === 'submitting'}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {submission.status === 'submitting' && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>
                  {submission.status === 'submitting' ? 'Sending...' : 'Send Message'}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};