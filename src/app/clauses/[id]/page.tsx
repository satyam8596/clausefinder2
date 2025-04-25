'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnalysisResult, Clause, ContractSection } from '@/utils/gemini';
import { 
  FileText, 
  DownloadCloud, 
  AlertTriangle, 
  Clock, 
  Printer, 
  Share2 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import RiskFilter from '@/components/common/RiskFilter';
import ClauseAccordion from '@/components/common/ClauseAccordion';
import ContractMetrics from '@/components/common/ContractMetrics';
import AnalysisComparison from '@/components/common/AnalysisComparison';

// Instead of dynamic import, use script injection
const loadHtml2PdfScript = () => {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Cannot load script in server environment'));
      return;
    }

    // Check if script is already loaded
    if (window.hasOwnProperty('html2pdf')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.integrity = 'sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load html2pdf script'));
    
    document.head.appendChild(script);
  });
};

// Risk Meter Component
const RiskMeter = ({ highCount, mediumCount, lowCount }: { highCount: number, mediumCount: number, lowCount: number }) => {
  const total = highCount + mediumCount + lowCount || 1; // Avoid division by zero
  const highPercentage = (highCount / total) * 100;
  const mediumPercentage = (mediumCount / total) * 100;
  const lowPercentage = (lowCount / total) * 100;
  
  let riskLevel = 'Low';
  let riskColor = 'text-green-500';
  
  if (highCount > 0) {
    riskLevel = 'High';
    riskColor = 'text-red-500';
  } else if (mediumCount > 0) {
    riskLevel = 'Medium';
    riskColor = 'text-amber-500';
  }
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Overall Risk Level</span>
        <span className={`font-bold ${riskColor}`}>{riskLevel}</span>
      </div>
      <div className="h-4 w-full bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div 
            className="bg-red-500 h-full" 
            style={{ width: `${highPercentage}%` }}
            title={`${highCount} high risk clauses`}
          />
          <div 
            className="bg-amber-500 h-full" 
            style={{ width: `${mediumPercentage}%` }}
            title={`${mediumCount} medium risk clauses`}
          />
          <div 
            className="bg-yellow-400 h-full" 
            style={{ width: `${lowPercentage}%` }}
            title={`${lowCount} low risk clauses`}
          />
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-secondary-500 dark:text-secondary-400">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  );
};

export default function ClauseReport() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'raw'>('summary');
  const [filteredKeyClauses, setFilteredKeyClauses] = useState<Clause[]>([]);
  const [filteredRisks, setFilteredRisks] = useState<Clause[]>([]);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // In a real app, this would fetch from an API based on the ID
    const fetchAnalysis = () => {
      try {
        setLoading(true);
        // Mock fetching data from localStorage (would be API in real app)
        let storedAnalysis;
        
        // Safely access localStorage (only in browser)
        if (typeof window !== 'undefined') {
          storedAnalysis = localStorage.getItem('clauseAnalysis');
        }
        
        console.log('Stored analysis from localStorage:', storedAnalysis);
        
        if (storedAnalysis) {
          const parsedAnalysis = JSON.parse(storedAnalysis);
          console.log('Parsed analysis:', parsedAnalysis);
          setAnalysis(parsedAnalysis);
        } else {
          console.log('No analysis found in localStorage, using fallback data');
          // Left empty as we now have proper error handling
        }
      } catch (error) {
        console.error('Error loading analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  useEffect(() => {
    if (analysis) {
      // Initialize filtered clauses with all clauses
      setFilteredKeyClauses(analysis.keyClauses);
      setFilteredRisks(analysis.risks);
    }
  }, [analysis]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getRiskCount = (risk: Clause['risk']) => {
    if (!analysis) return 0;
    return [...(analysis.keyClauses || []), ...(analysis.risks || [])]
      .filter(clause => clause.risk === risk).length;
  };

  const totalHighRisks = getRiskCount('high');
  const totalMediumRisks = getRiskCount('medium');
  const totalLowRisks = getRiskCount('low');

  const renderSectionContent = (section: ContractSection) => {
    if (!section.content) return <p className="text-secondary-500 dark:text-secondary-400">No information available.</p>;
    
    return (
      <div className="text-secondary-600 dark:text-secondary-300 whitespace-pre-wrap markdown-content">
        <ReactMarkdown>
          {section.content}
        </ReactMarkdown>
      </div>
    );
  };

  const handlePrint = () => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    window.print();
  };
  
  const handleExport = async () => {
    if (!analysis || isExporting) return;
    
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    try {
      setIsExporting(true);
      
      // Load the html2pdf script if not already loaded
      await loadHtml2PdfScript();
      
      // Get the content element to export
      const contentElement = document.getElementById('export-content');
      if (!contentElement) {
        console.error("Content element not found");
        setIsExporting(false);
        return;
      }
      
      // Create a simplified, clean version of the content for export
      const exportContent = document.createElement('div');
      exportContent.style.padding = '20px';
      exportContent.style.fontFamily = 'Arial, sans-serif';
      exportContent.style.color = '#000';
      exportContent.style.backgroundColor = '#fff';
      
      // Add a header with logo and title
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.marginBottom = '20px';
      header.style.borderBottom = '1px solid #333';
      header.style.paddingBottom = '10px';
      
      header.innerHTML = `
        <div style="display:flex; align-items:center;">
          <span style="color:#3B82F6; font-weight:bold; font-size:24px; margin-right:5px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
            </svg>
          </span>
          <span style="font-weight:bold; font-size:24px; color:#1E293B;">ClauseFinder</span>
        </div>
        <div style="font-size:12px; color:#64748B;">${new Date().toLocaleDateString()}</div>
      `;
      
      exportContent.appendChild(header);
      
      // Add document title
      const title = document.createElement('h1');
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '20px';
      title.textContent = `Contract Analysis: ${analysis.filename}`;
      exportContent.appendChild(title);
      
      // Add Contract Metrics
      const metrics = document.createElement('div');
      metrics.style.display = 'grid';
      metrics.style.gridTemplateColumns = 'repeat(2, 1fr)';
      metrics.style.gap = '10px';
      metrics.style.marginBottom = '20px';
      metrics.style.padding = '15px';
      metrics.style.backgroundColor = '#f9f9f9';
      metrics.style.border = '1px solid #e5e5e5';
      metrics.style.borderRadius = '8px';
      
      metrics.innerHTML = `
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight:bold; font-size:14px;">Document</span>
          <span style="font-size:14px;">${analysis.filename}</span>
        </div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight:bold; font-size:14px;">Analyzed</span>
          <span style="font-size:14px;">${new Date(analysis.timestamp).toLocaleString()}</span>
        </div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight:bold; font-size:14px;">Total Clauses</span>
          <span style="font-size:14px;">${analysis.keyClauses.length + analysis.risks.length}</span>
        </div>
        <div style="display:flex; flex-direction:column;">
          <span style="font-weight:bold; font-size:14px;">Risk Breakdown</span>
          <span style="font-size:14px;">High: ${getRiskCount('high')} | Medium: ${getRiskCount('medium')} | Low: ${getRiskCount('low')}</span>
        </div>
      `;
      
      exportContent.appendChild(metrics);
      
      // Risk Summary
      const riskSummary = document.createElement('div');
      riskSummary.style.marginBottom = '20px';
      riskSummary.style.padding = '15px';
      riskSummary.style.backgroundColor = '#fff';
      riskSummary.style.border = '1px solid #e5e5e5';
      riskSummary.style.borderRadius = '8px';
      
      const riskSummaryTitle = document.createElement('h2');
      riskSummaryTitle.style.fontSize = '18px';
      riskSummaryTitle.style.fontWeight = 'bold';
      riskSummaryTitle.style.marginBottom = '10px';
      riskSummaryTitle.textContent = 'Risk Summary';
      riskSummary.appendChild(riskSummaryTitle);
      
      // Risk Meter
      const highCount = getRiskCount('high');
      const mediumCount = getRiskCount('medium');
      const lowCount = getRiskCount('low');
      const total = highCount + mediumCount + lowCount || 1;
      
      let riskLevel = 'Low';
      let riskColor = '#388E3C';
      
      if (highCount > 0) {
        riskLevel = 'High';
        riskColor = '#D32F2F';
      } else if (mediumCount > 0) {
        riskLevel = 'Medium';
        riskColor = '#F57C00';
      }
      
      const riskMeter = document.createElement('div');
      riskMeter.style.marginBottom = '15px';
      
      riskMeter.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:14px; color:#666;">Overall Risk Level</span>
          <span style="font-weight:bold; color:${riskColor};">${riskLevel}</span>
        </div>
        <div style="height:16px; width:100%; background-color:#f0f0f0; border-radius:8px; overflow:hidden; margin-bottom:5px;">
          <div style="display:flex; height:100%;">
            <div style="background-color:#D32F2F; height:100%; width:${(highCount / total) * 100}%"></div>
            <div style="background-color:#F57C00; height:100%; width:${(mediumCount / total) * 100}%"></div>
            <div style="background-color:#FFC107; height:100%; width:${(lowCount / total) * 100}%"></div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; color:#666;">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      `;
      
      riskSummary.appendChild(riskMeter);
      
      // Risk categories
      const riskCategories = document.createElement('div');
      riskCategories.style.display = 'grid';
      riskCategories.style.gridTemplateColumns = 'repeat(3, 1fr)';
      riskCategories.style.gap = '10px';
      
      riskCategories.innerHTML = `
        <div style="background-color:#FFEBEE; border:1px solid #FFCDD2; border-radius:8px; padding:10px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-weight:500; color:#333;">High Risk</span>
            <span style="font-weight:bold; color:#D32F2F;">${highCount}</span>
          </div>
          <p style="font-size:12px; color:#666; margin:0;">Critical issues that require immediate attention</p>
        </div>
        
        <div style="background-color:#FFF8E1; border:1px solid #FFECB3; border-radius:8px; padding:10px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-weight:500; color:#333;">Medium Risk</span>
            <span style="font-weight:bold; color:#F57C00;">${mediumCount}</span>
          </div>
          <p style="font-size:12px; color:#666; margin:0;">Potential issues that should be reviewed</p>
        </div>
        
        <div style="background-color:#F1F8E9; border:1px solid #DCEDC8; border-radius:8px; padding:10px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-weight:500; color:#333;">Low Risk</span>
            <span style="font-weight:bold; color:#689F38;">${lowCount}</span>
          </div>
          <p style="font-size:12px; color:#666; margin:0;">Minor concerns worth noting but not critical</p>
        </div>
      `;
      
      riskSummary.appendChild(riskCategories);
      exportContent.appendChild(riskSummary);
      
      // Add executive summary
      if (analysis.executiveSummary) {
        const summarySection = document.createElement('div');
        summarySection.style.marginBottom = '20px';
        summarySection.style.padding = '15px';
        summarySection.style.backgroundColor = '#fff';
        summarySection.style.border = '1px solid #e5e5e5';
        summarySection.style.borderRadius = '8px';
        
        const summaryTitle = document.createElement('h2');
        summaryTitle.style.fontSize = '18px';
        summaryTitle.style.fontWeight = 'bold';
        summaryTitle.style.marginBottom = '10px';
        summaryTitle.textContent = 'Executive Summary';
        summarySection.appendChild(summaryTitle);
        
        const summaryContent = document.createElement('div');
        summaryContent.style.fontSize = '14px';
        summaryContent.style.lineHeight = '1.5';
        summaryContent.style.whiteSpace = 'pre-wrap';
        summaryContent.textContent = analysis.executiveSummary;
        summarySection.appendChild(summaryContent);
        
        exportContent.appendChild(summarySection);
      }
      
      // Create a function to add section content
      const addSection = (title, content) => {
        if (!content) return;
        
        const section = document.createElement('div');
        section.style.marginBottom = '20px';
        section.style.padding = '15px';
        section.style.backgroundColor = '#fff';
        section.style.border = '1px solid #e5e5e5';
        section.style.borderRadius = '8px';
        
        const sectionTitle = document.createElement('h2');
        sectionTitle.style.fontSize = '18px';
        sectionTitle.style.fontWeight = 'bold';
        sectionTitle.style.marginBottom = '10px';
        sectionTitle.textContent = title;
        section.appendChild(sectionTitle);
        
        const sectionContent = document.createElement('div');
        sectionContent.style.fontSize = '14px';
        sectionContent.style.lineHeight = '1.5';
        sectionContent.style.whiteSpace = 'pre-wrap';
        sectionContent.innerHTML = content;
        section.appendChild(sectionContent);
        
        exportContent.appendChild(section);
      };
      
      // Add all contract sections
      if (analysis.parties && analysis.parties.content) {
        addSection(analysis.parties.title || 'Parties Involved', analysis.parties.content);
      }
      
      if (analysis.obligations && analysis.obligations.content) {
        addSection(analysis.obligations.title || 'Obligations', analysis.obligations.content);
      }
      
      if (analysis.rights && analysis.rights.content) {
        addSection(analysis.rights.title || 'Rights and Benefits', analysis.rights.content);
      }
      
      if (analysis.paymentTerms && analysis.paymentTerms.content) {
        addSection(analysis.paymentTerms.title || 'Payment Terms', analysis.paymentTerms.content);
      }
      
      if (analysis.termination && analysis.termination.content) {
        addSection(analysis.termination.title || 'Termination Clauses', analysis.termination.content);
      }
      
      if (analysis.dates && analysis.dates.content) {
        addSection(analysis.dates.title || 'Key Dates', analysis.dates.content);
      }
      
      if (analysis.suggestions && analysis.suggestions.content) {
        addSection(analysis.suggestions.title || 'Recommendations', analysis.suggestions.content);
      }
      
      // Add key clauses section
      if (analysis.keyClauses && analysis.keyClauses.length > 0) {
        const clausesSection = document.createElement('div');
        clausesSection.style.marginBottom = '20px';
        clausesSection.style.padding = '15px';
        clausesSection.style.backgroundColor = '#fff';
        clausesSection.style.border = '1px solid #e5e5e5';
        clausesSection.style.borderRadius = '8px';
        
        const clausesTitle = document.createElement('h2');
        clausesTitle.style.fontSize = '18px';
        clausesTitle.style.fontWeight = 'bold';
        clausesTitle.style.marginBottom = '10px';
        clausesTitle.textContent = 'Key Clauses';
        
        const clausesIcon = document.createElement('div');
        clausesIcon.style.display = 'flex';
        clausesIcon.style.alignItems = 'center';
        clausesIcon.style.marginBottom = '15px';
        clausesIcon.innerHTML = `
          <div style="width:32px; height:32px; background-color:#EBF5FF; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-right:10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <h2 style="font-size:18px; font-weight:bold; margin:0;">Key Clauses</h2>
            <div style="background-color:#EBF5FF; color:#3B82F6; font-size:12px; font-weight:bold; padding:3px 8px; border-radius:12px;">
              ${analysis.keyClauses.length} clauses
            </div>
          </div>
        `;
        
        clausesSection.appendChild(clausesIcon);
        
        analysis.keyClauses.forEach((clause, index) => {
          const clauseItem = document.createElement('div');
          clauseItem.style.marginBottom = '15px';
          clauseItem.style.padding = '10px';
          clauseItem.style.border = '1px solid #e5e5e5';
          clauseItem.style.borderRadius = '8px';
          
          // Risk badge color
          let riskColor = '#388E3C';
          let riskBgColor = '#E8F5E9';
          let riskLabel = 'Low Risk';
          
          if (clause.risk === 'high') {
            riskColor = '#D32F2F';
            riskBgColor = '#FFEBEE';
            riskLabel = 'High Risk';
          } else if (clause.risk === 'medium') {
            riskColor = '#F57C00';
            riskBgColor = '#FFF8E1';
            riskLabel = 'Medium Risk';
          } else if (clause.risk === 'none') {
            riskLabel = 'Safe';
          }
          
          clauseItem.innerHTML = `
            <div style="font-weight:bold; font-size:16px; margin-bottom:5px;">${clause.title.replace(/^\*\*/g, '')}</div>
            <div style="display:inline-block; background-color:${riskBgColor}; color:${riskColor}; font-size:12px; font-weight:bold; padding:3px 8px; border-radius:4px; margin-bottom:8px;">${riskLabel}</div>
            <div style="font-size:14px; white-space:pre-wrap; line-height:1.5;">${clause.content}</div>
          `;
          
          clausesSection.appendChild(clauseItem);
        });
        
        exportContent.appendChild(clausesSection);
      }
      
      // Add risks section
      if (analysis.risks && analysis.risks.length > 0) {
        const risksSection = document.createElement('div');
        risksSection.style.marginBottom = '20px';
        risksSection.style.padding = '15px';
        risksSection.style.backgroundColor = '#fff';
        risksSection.style.border = '1px solid #e5e5e5';
        risksSection.style.borderRadius = '8px';
        
        const risksIcon = document.createElement('div');
        risksIcon.style.display = 'flex';
        risksIcon.style.alignItems = 'center';
        risksIcon.style.marginBottom = '15px';
        risksIcon.innerHTML = `
          <div style="width:32px; height:32px; background-color:#FFEBEE; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-right:10px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <h2 style="font-size:18px; font-weight:bold; margin:0;">Risks & Red Flags</h2>
            <div style="background-color:#FFEBEE; color:#D32F2F; font-size:12px; font-weight:bold; padding:3px 8px; border-radius:12px;">
              ${analysis.risks.length} risks
            </div>
          </div>
        `;
        
        risksSection.appendChild(risksIcon);
        
        analysis.risks.forEach((risk, index) => {
          const riskItem = document.createElement('div');
          riskItem.style.marginBottom = '15px';
          riskItem.style.padding = '10px';
          riskItem.style.border = '1px solid #e5e5e5';
          riskItem.style.borderRadius = '8px';
          
          // All risks are shown as high
          const riskColor = '#D32F2F';
          const riskBgColor = '#FFEBEE';
          
          riskItem.innerHTML = `
            <div style="font-weight:bold; font-size:16px; margin-bottom:5px;">${risk.title.replace(/^\*\*/g, '')}</div>
            <div style="display:inline-block; background-color:${riskBgColor}; color:${riskColor}; font-size:12px; font-weight:bold; padding:3px 8px; border-radius:4px; margin-bottom:8px;">High Risk</div>
            <div style="font-size:14px; white-space:pre-wrap; line-height:1.5;">${risk.content}</div>
          `;
          
          risksSection.appendChild(riskItem);
        });
        
        exportContent.appendChild(risksSection);
      }
      
      // Add footer
      const footer = document.createElement('div');
      footer.style.marginTop = '30px';
      footer.style.textAlign = 'center';
      footer.style.color = '#64748B';
      footer.style.fontSize = '10px';
      footer.style.borderTop = '1px solid #ddd';
      footer.style.paddingTop = '10px';
      footer.textContent = 'Generated by ClauseFinder - AI-Powered Contract Analysis';
      
      exportContent.appendChild(footer);
      
      // Configure pdf options
      const options = {
        margin: 10,
        filename: `${analysis.filename.replace(/\.[^/.]+$/, '')}-analysis.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Temporarily append the export content to the document
      document.body.appendChild(exportContent);
      
      // Create and download the PDF
      const html2pdf = (window as any).html2pdf;
      if (!html2pdf) {
        throw new Error('html2pdf library not loaded');
      }
      
      await html2pdf().from(exportContent).set(options).save();
      
      // Remove the temporary element
      document.body.removeChild(exportContent);
      
      console.log('PDF export complete');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getClauseCounts = (clauses: Clause[]) => {
    return {
      high: clauses.filter(clause => clause.risk === 'high').length,
      medium: clauses.filter(clause => clause.risk === 'medium').length,
      low: clauses.filter(clause => clause.risk === 'low').length,
      none: clauses.filter(clause => clause.risk === 'none').length,
    };
  };

  const handleKeyClauseFilter = (selectedRisks: Array<'high' | 'medium' | 'low' | 'none' | 'all'>) => {
    if (!analysis) return;
    
    if (selectedRisks.includes('all')) {
      setFilteredKeyClauses(analysis.keyClauses);
    } else {
      setFilteredKeyClauses(
        analysis.keyClauses.filter(clause => selectedRisks.includes(clause.risk))
      );
    }
  };

  const handleRiskFilter = (selectedRisks: Array<'high' | 'medium' | 'low' | 'none' | 'all'>) => {
    if (!analysis) return;
    
    if (selectedRisks.includes('all')) {
      setFilteredRisks(analysis.risks);
    } else {
      setFilteredRisks(
        analysis.risks.filter(clause => selectedRisks.includes(clause.risk))
      );
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Clock className="w-8 h-8 text-primary-500 animate-spin mb-4" />
          <p className="text-secondary-600 dark:text-secondary-400">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">Analysis Not Found</h1>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          We couldn't find the analysis you're looking for. It may have been deleted or never existed.
        </p>
        <button 
          onClick={() => router.push('/upload')}
          className="button-primary"
        >
          Analyze a New Document
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-secondary-900 dark:text-white mb-2">
              Contract Analysis
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400">
              {analysis.filename} · Analyzed {formatDate(analysis.timestamp)}
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <button onClick={handlePrint} className="inline-flex items-center px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button 
              onClick={handleExport} 
              disabled={isExporting}
              className="inline-flex items-center px-3 py-2 border border-secondary-300 dark:border-secondary-700 rounded-md shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </button>
          </div>
        </div>
        
        <div id="export-content">
          <h1 className="text-3xl font-serif font-bold text-secondary-900 dark:text-white mb-2 print:block hidden">
            Contract Analysis: {analysis.filename}
          </h1>
          
          <ContractMetrics 
            filename={analysis.filename}
            timestamp={analysis.timestamp}
            totalClauses={analysis.keyClauses.length + analysis.risks.length}
            highRisks={getRiskCount('high')}
            mediumRisks={getRiskCount('medium')}
            lowRisks={getRiskCount('low')}
            safeCount={getRiskCount('none')}
          />
          
          <div className="mb-6 flex space-x-4 border-b border-secondary-200 dark:border-secondary-700">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
              }`}
            >
              Structured Analysis
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'raw'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
              }`}
            >
              Full Report
            </button>
          </div>
          
          <div className="print:block">
            {activeTab === 'summary' ? (
              <>
                {/* Risk summary */}
                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">Risk Summary</h2>
                  
                  <RiskMeter highCount={totalHighRisks} mediumCount={totalMediumRisks} lowCount={totalLowRisks} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-secondary-900 dark:text-white">High Risk</h3>
                        <span className="text-red-600 dark:text-red-400 font-bold text-lg">{totalHighRisks}</span>
                      </div>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">Critical issues that require immediate attention</p>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-secondary-900 dark:text-white">Medium Risk</h3>
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">{totalMediumRisks}</span>
                      </div>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">Potential issues that should be reviewed</p>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-secondary-900 dark:text-white">Low Risk</h3>
                        <span className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">{totalLowRisks}</span>
                      </div>
                      <p className="text-secondary-600 dark:text-secondary-400 text-sm">Minor concerns worth noting but not critical</p>
                    </div>
                  </div>
                </div>
                
                {/* Executive Summary */}
                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">Executive Summary</h2>
                  <div className="text-secondary-600 dark:text-secondary-300 whitespace-pre-wrap">
                    {analysis.executiveSummary || "No executive summary available."}
                  </div>
                </div>
                
                {/* Key Clauses */}
                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                        <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white">Key Clauses</h2>
                    </div>
                    <div className="px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium flex items-center">
                      <span className="mr-1">{analysis.keyClauses.length}</span>
                      <span className="hidden sm:inline">clauses</span>
                    </div>
                  </div>
                  
                  {analysis.keyClauses.length > 0 && (
                    <RiskFilter 
                      onChange={handleKeyClauseFilter} 
                      counts={getClauseCounts(analysis.keyClauses)} 
                    />
                  )}
                  
                  {filteredKeyClauses.length > 0 ? (
                    <ClauseAccordion clauses={filteredKeyClauses} />
                  ) : (
                    <div className="text-center py-10 border border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg bg-secondary-50 dark:bg-secondary-800/50">
                      <AlertTriangle className="w-10 h-10 text-secondary-400 dark:text-secondary-600 mx-auto mb-2" />
                      <p className="text-secondary-500 dark:text-secondary-400">
                        No clauses match the selected filters.
                      </p>
                    </div>
                  )}
                </div>

                {/* Risks & Red Flags */}
                <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white">Risks & Red Flags</h2>
                    </div>
                    <div className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium flex items-center">
                      <span className="mr-1">{analysis.risks.length}</span>
                      <span className="hidden sm:inline">risks</span>
                    </div>
                  </div>
                  
                  {analysis.risks.length > 0 && (
                    <RiskFilter 
                      onChange={handleRiskFilter} 
                      counts={getClauseCounts(analysis.risks)} 
                    />
                  )}
                  
                  {filteredRisks.length > 0 ? (
                    <ClauseAccordion clauses={filteredRisks} />
                  ) : (
                    <div className="text-center py-10 border border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg bg-secondary-50 dark:bg-secondary-800/50">
                      <AlertTriangle className="w-10 h-10 text-secondary-400 dark:text-secondary-600 mx-auto mb-2" />
                      <p className="text-secondary-500 dark:text-secondary-400">
                        No risks match the selected filters.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Contract Details Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Parties */}
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.parties.title}</h2>
                    {renderSectionContent(analysis.parties)}
                  </div>
                  
                  {/* Obligations */}
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.obligations.title}</h2>
                    {renderSectionContent(analysis.obligations)}
                  </div>
                  
                  {/* Rights and Benefits */}
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.rights.title}</h2>
                    {renderSectionContent(analysis.rights)}
                  </div>
                  
                  {/* Payment Terms */}
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.paymentTerms.title}</h2>
                    {renderSectionContent(analysis.paymentTerms)}
                  </div>
                  
                  {/* Termination Conditions */}
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.termination.title}</h2>
                    {renderSectionContent(analysis.termination)}
                  </div>
                  
                  {/* Important Dates & Durations */}
                  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.dates.title}</h2>
                    {renderSectionContent(analysis.dates)}
                  </div>
                </div>
                
                {/* Suggestions */}
                <div className="mt-8 bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-serif font-bold text-secondary-900 dark:text-white mb-4">{analysis.suggestions.title}</h2>
                  {renderSectionContent(analysis.suggestions)}
                </div>
              </>
            ) : (
              // Raw Markdown Content
              <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-md p-6 markdown-content">
                <ReactMarkdown>
                  {analysis.markdownContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 