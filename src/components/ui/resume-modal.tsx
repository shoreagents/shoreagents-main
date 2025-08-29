'use client';

import { useState, useEffect } from 'react';
import { ResumeGenerated } from '@/types/api';
import { Button } from './button';
import { X, FileText, Download, ExternalLink } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface ResumeModalProps {
  resume: ResumeGenerated | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ resume, isOpen, onClose }: ResumeModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !resume) return null;

  const handleDownload = () => {
    const resumeData = resume.generation_metadata.originalResumeData;
    
    if (resumeData.files && resumeData.files.length > 0) {
      // If we have file data, create a download link
      const file = resumeData.files[0];
      if (file.data && file.data.trim() !== '') {
        try {
          // Convert base64 to blob and download
          const byteCharacters = atob(file.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: file.fileType });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.fileName || 'resume.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          // Show success toast
          showToast('Resume downloaded successfully!', 'success');
        } catch (error) {
          console.warn('Failed to decode file data, falling back to text resume:', error);
          downloadResumeAsText();
        }
      } else {
        // If no file data, create a text-based resume
        downloadResumeAsText();
      }
    } else {
      // If no files, create a text-based resume
      downloadResumeAsText();
    }
  };

  const downloadResumeAsText = () => {
    const resumeData = resume.generation_metadata.originalResumeData;
    let content = '';
    
    if (resumeData.name) content += `Name: ${resumeData.name}\n`;
    if (resumeData.email) content += `Email: ${resumeData.email}\n`;
    if (resumeData.phone) content += `Phone: ${resumeData.phone}\n`;
    if (resumeData.location) content += `Location: ${resumeData.location}\n\n`;
    
    if (resumeData.summary) content += `SUMMARY\n${resumeData.summary}\n\n`;
    
    if (resumeData.skills) {
      content += `SKILLS\n`;
      if (Array.isArray(resumeData.skills)) {
        content += resumeData.skills.join(', ');
      } else {
        Object.entries(resumeData.skills).forEach(([key, value]) => {
          if (value) content += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
        });
      }
      content += '\n';
    }
    
    if (resumeData.experience && resumeData.experience.length > 0) {
      content += `EXPERIENCE\n`;
      resumeData.experience.forEach((exp: Record<string, unknown>) => {
        content += `${exp.position || exp.title || 'Position'} at ${exp.company}\n`;
        if (exp.duration) content += `${exp.duration}\n`;
        content += '\n';
      });
    }
    
    if (resumeData.education && resumeData.education.length > 0) {
      content += `EDUCATION\n`;
      resumeData.education.forEach((edu: Record<string, unknown>) => {
        content += `${edu.degree} - ${edu.institution}\n`;
        if (edu.year) content += `${edu.year}\n`;
        content += '\n';
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.name || 'resume'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show success toast
    showToast('Resume downloaded successfully!', 'success');
  };

  const handleViewOnline = () => {
    const resumeData = resume.generation_metadata.originalResumeData;
    
    if (resumeData.files && resumeData.files.length > 0) {
      const file = resumeData.files[0];
      if (file.data && file.data.trim() !== '') {
        try {
          // Convert base64 to blob and open in new tab
          const byteCharacters = atob(file.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: file.fileType });
          
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Clean up the URL after a delay
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          
          // Show success toast
          showToast('Resume opened in new tab!', 'success');
        } catch (error) {
          console.warn('Failed to decode file data, falling back to HTML resume:', error);
          showResumeContentInNewTab();
        }
      } else {
        // If no file data, show the resume content in a new tab
        showResumeContentInNewTab();
      }
    } else {
      // If no files, show the resume content in a new tab
      showResumeContentInNewTab();
    }
  };

  const showResumeContentInNewTab = () => {
    const resumeData = resume.generation_metadata.originalResumeData;
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resumeData.name || 'Resume'}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
          h1, h2 { color: #333; }
          .section { margin-bottom: 20px; }
          .contact-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .skills { display: flex; flex-wrap: wrap; gap: 10px; }
          .skill { background: #e3f2fd; padding: 5px 10px; border-radius: 15px; font-size: 14px; }
          .experience-item, .education-item { margin-bottom: 15px; }
          .company { font-weight: bold; color: #2196f3; }
          .duration { color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
    `;
    
    if (resumeData.name) htmlContent += `<h1>${resumeData.name}</h1>`;
    
    htmlContent += '<div class="contact-info">';
    if (resumeData.email) htmlContent += `<div>Email: ${resumeData.email}</div>`;
    if (resumeData.phone) htmlContent += `<div>Phone: ${resumeData.phone}</div>`;
    if (resumeData.location) htmlContent += `<div>Location: ${resumeData.location}</div>`;
    htmlContent += '</div>';
    
    if (resumeData.summary) {
      htmlContent += `<div class="section"><h2>Summary</h2><p>${resumeData.summary}</p></div>`;
    }
    
    if (resumeData.skills) {
      htmlContent += '<div class="section"><h2>Skills</h2><div class="skills">';
      if (Array.isArray(resumeData.skills)) {
        resumeData.skills.forEach(skill => {
          htmlContent += `<span class="skill">${skill}</span>`;
        });
      } else {
        Object.entries(resumeData.skills).forEach(([key, value]) => {
          if (value) {
            htmlContent += `<span class="skill">${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</span>`;
          }
        });
      }
      htmlContent += '</div></div>';
    }
    
    if (resumeData.experience && resumeData.experience.length > 0) {
      htmlContent += '<div class="section"><h2>Experience</h2>';
             resumeData.experience.forEach((exp: Record<string, unknown>) => {
        htmlContent += `
          <div class="experience-item">
            <div class="company">${exp.position || exp.title || 'Position'}</div>
            <div>${exp.company}</div>
            ${exp.duration ? `<div class="duration">${exp.duration}</div>` : ''}
          </div>
        `;
      });
      htmlContent += '</div>';
    }
    
    if (resumeData.education && resumeData.education.length > 0) {
      htmlContent += '<div class="section"><h2>Education</h2>';
             resumeData.education.forEach((edu: Record<string, unknown>) => {
        htmlContent += `
          <div class="education-item">
            <div class="company">${edu.degree}</div>
            <div>${edu.institution}</div>
            ${edu.year ? `<div class="duration">${edu.year}</div>` : ''}
          </div>
        `;
      });
      htmlContent += '</div>';
    }
    
    htmlContent += '</body></html>';
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    
    // Show success toast
    showToast('Resume opened in new tab!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resume Details</h2>
              <p className="text-sm text-gray-600">Generated on {new Date(resume.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Resume Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Resume Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resume ID:</span>
                  <span className="font-mono text-gray-900">{resume.id}</span>
                </div>
                                 <div className="flex justify-between">
                   <span className="text-gray-600">Template:</span>
                   <span className="font-mono text-gray-900">{resume.template_used}</span>
                 </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{new Date(resume.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

                         {/* Resume Content Preview */}
             {resume.generation_metadata.originalResumeData && (
               <div className="bg-gray-50 rounded-lg p-4">
                 <h3 className="font-medium text-gray-900 mb-2">Resume Content Preview</h3>
                 <div className="bg-white rounded border p-3 text-sm text-gray-700 max-h-60 overflow-y-auto">
                   {(() => {
                     const data = resume.generation_metadata.originalResumeData;
                     return (
                       <div className="space-y-3">
                         {data.name && (
                           <div>
                             <strong>Name:</strong> {data.name}
                           </div>
                         )}
                         {data.email && (
                           <div>
                             <strong>Email:</strong> {data.email}
                           </div>
                         )}
                         {data.phone && (
                           <div>
                             <strong>Phone:</strong> {data.phone}
                           </div>
                         )}
                         {data.location && (
                           <div>
                             <strong>Location:</strong> {data.location}
                           </div>
                         )}
                         {data.summary && (
                           <div>
                             <strong>Summary:</strong>
                             <p className="mt-1 text-gray-600">{data.summary}</p>
                           </div>
                         )}
                         {data.skills && (
                           <div>
                             <strong>Skills:</strong>
                             <div className="mt-1 flex flex-wrap gap-1">
                               {Array.isArray(data.skills) ? (
                                 data.skills.map((skill: string, index: number) => (
                                   <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                     {skill}
                                   </span>
                                 ))
                               ) : (
                                 Object.entries(data.skills).map(([key, value]) => 
                                   value ? (
                                     <span key={key} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                       {key}: {value}
                                     </span>
                                   ) : null
                                 )
                               )}
                             </div>
                           </div>
                         )}
                         {data.files && data.files.length > 0 && (
                           <div>
                             <strong>Original Files:</strong>
                             <div className="mt-1">
                               {data.files.map((file: Record<string, unknown>, index: number) => (
                                 <div key={index} className="text-gray-600">
                                   📎 {file.fileName} ({file.fileType})
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                     );
                   })()}
                 </div>
               </div>
             )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleViewOnline}
                className="flex items-center space-x-2 flex-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Online</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center space-x-2 flex-1"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </Button>
            </div>

                         {/* Note */}
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
               <p className="text-sm text-blue-800">
                 <strong>Note:</strong> The "View Online" button will open the resume in a new tab, and the "Download PDF" 
                 button will download the resume file. Since the original PDF files are not available in the API, 
                 both buttons will create formatted versions from the resume data.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
