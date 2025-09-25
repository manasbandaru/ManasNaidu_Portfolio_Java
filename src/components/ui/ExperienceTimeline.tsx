import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Experience } from '../../types/portfolio';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCompanyLogo = (company: string): string => {
    // Map company names to logo URLs or use placeholder
    const logoMap: Record<string, string> = {
      'JPMorgan Chase & Co.': '/images/companies/JPMC.png',
      'Atrium Health': '/images/companies/Atrium.png',
      'Flipkart': '/images/companies/Flipkart.png',
      'TechCorp Solutions': '/images/companies/techcorp-logo.svg',
      'InnovateSoft Inc.': '/images/companies/innovatesoft-logo.svg',
      'StartupTech': '/images/companies/startuptech-logo.svg'
    };

    return logoMap[company] || `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=6366f1&color=fff&size=64`;
  };

  const calculateDuration = (startDate: string, endDate?: string, current?: boolean): string => {
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate || new Date());
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }

    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 opacity-30"></div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-gray-800 z-10"></div>

            {/* Experience card */}
            <div className="ml-16">
              <motion.div
                className="bg-gray-700 rounded-xl p-6 cursor-pointer hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-purple-500/50"
                onClick={() => toggleExpanded(exp.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* Company logo */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600 flex-shrink-0">
                      <img
                        src={getCompanyLogo(exp.company)}
                        alt={`${exp.company} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.company)}&background=6366f1&color=fff&size=48`;
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white">{exp.position}</h3>
                      <p className="text-purple-400 font-medium">{exp.company}</p>
                      <p className="text-gray-400 text-sm flex items-center">
                        <span className="mr-2">📍</span>
                        {exp.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="inline-flex items-center bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm mb-2">
                      {exp.current ? (
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          Current
                        </span>
                      ) : (
                        <span>{exp.startDate} - {exp.endDate}</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {calculateDuration(exp.startDate, exp.endDate, exp.current)}
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>

                {/* Technology tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.technologies.slice(0, 6).map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-xs hover:bg-purple-500/20 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {exp.technologies.length > 6 && (
                    <span className="text-gray-400 text-xs px-2 py-1">
                      +{exp.technologies.length - 6} more
                    </span>
                  )}
                </div>

                {/* Expand indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-sm font-medium">
                    {exp.achievements.length} key achievement{exp.achievements.length !== 1 ? 's' : ''}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-purple-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {/* Expanded content */}
              <AnimatePresence>
                {expandedId === exp.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-800 rounded-xl p-6 mt-4 border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                        Key Achievements
                      </h4>

                      <div className="space-y-3">
                        {exp.achievements.map((achievement, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* All technologies */}
                      <div className="mt-6">
                        <h5 className="text-sm font-semibold text-gray-200 mb-3">Technologies Used</h5>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs hover:bg-purple-500/30 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};