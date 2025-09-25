import React from 'react';
import { motion } from 'framer-motion';
import type { Certification } from '../../types/portfolio';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certifications }) => {
  const getIssuerLogo = (issuer: string): string => {
    // Map issuer names to logo URLs or use placeholder
    const logoMap: Record<string, string> = {
      'Oracle': '/images/certifications/oracle-logo.svg',
      'AWS': '/images/certifications/aws-logo.svg',
      'Spring': '/images/certifications/spring-logo.svg',
      'Docker': '/images/certifications/docker-logo.svg',
      'Kubernetes': '/images/certifications/kubernetes-logo.svg'
    };
    
    return logoMap[issuer] || `https://ui-avatars.com/api/?name=${encodeURIComponent(issuer)}&background=10b981&color=fff&size=64`;
  };

  const isExpired = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  if (certifications.length === 0) {
    return null;
  }

  return (
    <div className={`grid gap-6 ${certifications.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-2'}`}>
      {certifications.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-green-500/50 group"
        >
          <div className="flex items-start space-x-4">
            {/* Issuer logo */}
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <img
                src={getIssuerLogo(cert.issuer)}
                alt={`${cert.issuer} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cert.issuer)}&background=10b981&color=fff&size=48`;
                }}
              />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                {cert.name}
              </h3>
              <p className="text-green-400 font-medium text-sm mb-2">{cert.issuer}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">
                  Issued: {formatDate(cert.issueDate)}
                </span>
                
                {cert.expiryDate && (
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    isExpired(cert.expiryDate)
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {isExpired(cert.expiryDate) 
                      ? `Expired ${formatDate(cert.expiryDate)}`
                      : `Valid until ${formatDate(cert.expiryDate)}`
                    }
                  </span>
                )}
              </div>
              
              {/* Credential info */}
              <div className="space-y-2">
                {cert.credentialId && (
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Credential ID:</span> {cert.credentialId}
                  </div>
                )}
                
                {cert.credentialUrl && (
                  <motion.a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Verify Credential</span>
                  </motion.a>
                )}
              </div>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                cert.expiryDate && isExpired(cert.expiryDate)
                  ? 'bg-red-400'
                  : 'bg-green-400'
              }`}></div>
              <span className="text-xs text-gray-400">
                {cert.expiryDate && isExpired(cert.expiryDate) ? 'Expired' : 'Active'}
              </span>
            </div>
            
            {cert.credentialUrl && (
              <div className="text-xs text-gray-500">
                Click to verify
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};