'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle, Loader2, FileText } from 'lucide-react';
import UploadBox from '@/components/common/UploadBox';
import { analyzeContract } from '@/utils/gemini';
import { Clause } from '@/utils/gemini';

// Helper function to extract plain text from DOCX files
// This is a simple approach that treats DOCX XML as text and extracts content
const extractTextFromDocx = (content: string): string => {
  try {
    // Look for text content between XML tags
    const textMatches = content.match(/>([^<>]+)</g) || [];
    const extractedText = textMatches
      .map(match => match.replace(/^>|<$/g, ''))
      .join(' ')
      .replace(/\s+/g, ' ');
    
    return extractedText || 'Failed to extract content from DOCX file';
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    return 'Error processing DOCX file';
  }
};

// Analysis stages and their respective percentages
const ANALYSIS_STAGES = {
  EXTRACTING: { name: 'extracting', percentage: 20, text: 'Extracting document content...' },
  ANALYZING: { name: 'analyzing', percentage: 50, text: 'Analyzing legal clauses...' },
  PROCESSING: { name: 'processing', percentage: 70, text: 'Processing risk assessments...' },
  FINALIZING: { name: 'finalizing', percentage: 90, text: 'Finalizing analysis results...' },
  COMPLETE: { name: 'complete', percentage: 100, text: 'Analysis complete!' },
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState(ANALYSIS_STAGES.EXTRACTING);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [clausesFound, setClausesFound] = useState<Clause[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const router = useRouter();

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const simulateProgress = () => {
    // Start with extracting stage
    setAnalysisStage(ANALYSIS_STAGES.EXTRACTING);
    setAnalysisProgress(ANALYSIS_STAGES.EXTRACTING.percentage);
    
    // Simulate analyzing stage
    setTimeout(() => {
      setAnalysisStage(ANALYSIS_STAGES.ANALYZING);
      setAnalysisProgress(ANALYSIS_STAGES.ANALYZING.percentage);
    }, 2000);
    
    // Simulate processing stage
    setTimeout(() => {
      setAnalysisStage(ANALYSIS_STAGES.PROCESSING);
      setAnalysisProgress(ANALYSIS_STAGES.PROCESSING.percentage);
    }, 4000);
    
    // Simulate finalizing stage
    setTimeout(() => {
      setAnalysisStage(ANALYSIS_STAGES.FINALIZING);
      setAnalysisProgress(ANALYSIS_STAGES.FINALIZING.percentage);
    }, 6000);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select a file to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setStep(2);
    setClausesFound([]);
    
    // Create a new AbortController for this analysis
    const controller = new AbortController();
    setAbortController(controller);

    try {
      console.log('Starting analysis for file:', file.name);
      
      // Simulate progress while we wait for the analysis
      simulateProgress();
      
      // Get file content based on type
      let fileContent;
      let isTextFile = file.type === 'text/plain';
      let isDocxFile = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      // Only for plain text files, use direct text extraction
      if (isTextFile) {
        fileContent = await file.text();
        console.log('File text loaded, length:', fileContent.length);
      } else if (isDocxFile) {
        // For DOCX files, try a basic text extraction from the raw data
        console.log('DOCX file detected, using basic text extraction');
        // Get raw text content
        const rawContent = await file.text();
        // Extract readable text
        fileContent = extractTextFromDocx(rawContent);
        console.log('DOCX text extracted, length:', fileContent.length);
      } else {
        // For other binary files (PDFs, images), read as base64
        const reader = new FileReader();
        fileContent = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        console.log('Binary file loaded as base64');
      }
      
      // Call the API to analyze the contract
      const analysis = await analyzeContract(fileContent, file.name);
      console.log('Analysis completed:', analysis);
      
      // Show preview of clauses found
      if (analysis.keyClauses.length > 0) {
        setClausesFound(analysis.keyClauses.slice(0, 3)); // Show top 3 clauses
      }
      
      // Set to complete stage
      setAnalysisStage(ANALYSIS_STAGES.COMPLETE);
      setAnalysisProgress(ANALYSIS_STAGES.COMPLETE.percentage);
      
      // Store the analysis result in localStorage (browser-only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('clauseAnalysis', JSON.stringify(analysis));
        console.log('Analysis saved to localStorage');
      }
      
      setStep(3);
      setTimeout(() => {
        setIsAnalyzing(false);
        console.log('Redirecting to:', `/clauses/${analysis.id}`);
        router.push(`/clauses/${analysis.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || "Failed to analyze document. Please try again.");
      setIsAnalyzing(false);
      setStep(1);
    } finally {
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsAnalyzing(false);
    setStep(1);
    setError(null);
  };

  const renderStepIcon = (stepNumber: number) => {
    if (step > stepNumber) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    } else if (step === stepNumber && isAnalyzing) {
      return <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />;
    }
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
        step === stepNumber 
          ? 'bg-primary-500 text-white' 
          : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300'
      }`}>
        {stepNumber}
      </div>
    );
  };

  const renderProgressStage = () => {
    return (
      <div className="mt-6 mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{analysisStage.text}</span>
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{analysisProgress}%</span>
        </div>
        <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2.5">
          <div 
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${analysisProgress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderClausePreview = () => {
    if (clausesFound.length === 0) return null;
    
    return (
      <div className="mt-6 border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
        <div className="bg-secondary-100 dark:bg-secondary-800 px-4 py-2 border-b border-secondary-200 dark:border-secondary-700">
          <h4 className="font-medium text-secondary-900 dark:text-white">Clauses identified ({clausesFound.length})</h4>
        </div>
        <div className="p-4 max-h-60 overflow-y-auto">
          {clausesFound.map((clause, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-start">
                <FileText className="w-4 h-4 mt-1 mr-2 text-primary-500" />
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">{clause.title}</p>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1 line-clamp-2">
                    {clause.content}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-secondary-500 dark:text-secondary-400 mr-2">{clause.category}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      clause.risk === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                      clause.risk === 'medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                      clause.risk === 'low' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                      {clause.risk === 'none' ? 'Safe' : `${clause.risk} risk`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-secondary-900 dark:text-white mb-3">
            Analyze Your Legal Documents
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Upload a contract or legal document to get an AI-powered analysis of key clauses, risks, and important terms.
          </p>
        </div>
        
        {/* Step Progression */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            {renderStepIcon(1)}
            <span className={`ml-2 text-sm font-medium ${
              step >= 1 ? 'text-secondary-900 dark:text-white' : 'text-secondary-500 dark:text-secondary-400'
            }`}>
              Upload Document
            </span>
          </div>
          <div className={`w-16 h-1 mx-2 ${
            step > 1 ? 'bg-primary-500' : 'bg-secondary-200 dark:bg-secondary-700'
          }`}></div>
          <div className="flex items-center">
            {renderStepIcon(2)}
            <span className={`ml-2 text-sm font-medium ${
              step >= 2 ? 'text-secondary-900 dark:text-white' : 'text-secondary-500 dark:text-secondary-400'
            }`}>
              Analyze
            </span>
          </div>
          <div className={`w-16 h-1 mx-2 ${
            step > 2 ? 'bg-primary-500' : 'bg-secondary-200 dark:bg-secondary-700'
          }`}></div>
          <div className="flex items-center">
            {renderStepIcon(3)}
            <span className={`ml-2 text-sm font-medium ${
              step >= 3 ? 'text-secondary-900 dark:text-white' : 'text-secondary-500 dark:text-secondary-400'
            }`}>
              Results
            </span>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}
        
        {/* Upload Box */}
        {step === 1 && (
          <div>
            <UploadBox onFileSelect={handleFileSelect} selectedFile={file} />
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={!file}
                className={`inline-flex items-center px-6 py-3 rounded-md shadow-sm text-white ${
                  !file 
                    ? 'bg-secondary-300 dark:bg-secondary-700 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                Analyze Document
              </button>
            </div>
            
            <div className="mt-8 border-t border-secondary-200 dark:border-secondary-700 pt-6">
              <h3 className="text-lg font-medium mb-4 text-secondary-900 dark:text-white">Supported File Types</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                  <p className="font-medium text-secondary-900 dark:text-white">.PDF</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Adobe PDF documents</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                  <p className="font-medium text-secondary-900 dark:text-white">.DOCX</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Microsoft Word</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700">
                  <p className="font-medium text-secondary-900 dark:text-white">.TXT</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">Plain text files</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-secondary-500 dark:text-secondary-400">Maximum file size: 10MB</p>
            </div>
          </div>
        )}
        
        {/* Analysis in Progress */}
        {step === 2 && (
          <div className="text-center p-8 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-sm">
            <div className="mb-4">
              <Loader2 className="w-12 h-12 text-primary-500 mx-auto animate-spin" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-secondary-900 dark:text-white">Analyzing Your Document</h3>
            <p className="text-secondary-600 dark:text-secondary-300 mb-4">
              Our AI is currently analyzing your document. This may take a minute.
            </p>
            
            {renderProgressStage()}
            {renderClausePreview()}
            
            <button
              onClick={handleCancel}
              className="mt-6 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        )}
        
        {/* Analysis Complete */}
        {step === 3 && (
          <div className="text-center p-8 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 shadow-sm">
            <div className="mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-secondary-900 dark:text-white">Analysis Complete!</h3>
            <p className="text-secondary-600 dark:text-secondary-300 mb-4">
              We have successfully analyzed your document. Redirecting you to the results page...
            </p>
            <div className="mt-4 flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 text-primary-500 animate-spin" />
              <span className="text-sm text-secondary-600 dark:text-secondary-300">Redirecting...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 