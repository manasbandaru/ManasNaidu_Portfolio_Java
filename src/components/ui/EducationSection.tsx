import React from 'react';
import { motion } from 'framer-motion';
import type { Education } from '../../types/portfolio';

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  const getInstitutionLogo = (institution: string): string => {
    // Map institution names to logo URLs or use placeholder
    const logoMap: Record<string, string> = {
      'University of Cincinnati': '/images/companies/UC.png',
      'University of California, Berkeley': '/images/education/uc-berkeley-logo.svg',
      'Stanford University': '/images/education/stanford-logo.svg',
      'San Jose State University': '/images/education/sjsu-logo.svg'
    };

    return logoMap[institution] || `https://ui-avatars.com/api/?name=${encodeURIComponent(institution)}&background=3b82f6&color=fff&size=64`;
  };

  const formatGPA = (gpa?: number): string => {
    if (!gpa) return '';
    return `GPA: ${gpa.toFixed(2)}/4.0`;
  };

  if (education.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <motion.div
          key={edu.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-blue-500/50"
        >
          <div className="flex items-start space-x-4">
            {/* Institution logo */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
              <img
                src={getInstitutionLogo(edu.institution)}
                alt={`${edu.institution} logo`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(edu.institution)}&background=3b82f6&color=fff&size=64`;
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                  <p className="text-blue-400 font-medium">{edu.field}</p>
                  <p className="text-gray-400">{edu.institution}</p>
                </div>

                <div className="mt-2 md:mt-0 text-right">
                  <span className="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                  {edu.gpa && (
                    <div className="text-gray-400 text-sm mt-1">
                      {formatGPA(edu.gpa)}
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements/Coursework */}
              {edu.achievements && edu.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-200 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Relevant Coursework & Achievements
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {edu.achievements.map((achievement, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2 text-gray-300 text-sm"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};