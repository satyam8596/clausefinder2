import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI
// NOTE: API key is defined in .env.local
// Don't use a hardcoded key here - will be loaded from API route
const genAI = new GoogleGenerativeAI('');

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export interface Clause {
  id: string;
  title: string;
  content: string;
  category: string;
  risk: 'high' | 'medium' | 'low' | 'none';
}

export interface ContractSection {
  id: string;
  title: string;
  content: string;
}

export interface AnalysisResult {
  id: string;
  filename: string;
  timestamp: string;
  executiveSummary: string;
  keyClauses: Clause[];
  parties: ContractSection;
  obligations: ContractSection;
  rights: ContractSection;
  paymentTerms: ContractSection;
  termination: ContractSection;
  risks: Clause[];
  dates: ContractSection;
  suggestions: ContractSection;
  markdownContent: string; // Full markdown response for rendering
}

// Mock data for testing or fallback
const MOCK_MARKDOWN = `
# Contract Analysis

## 1. Executive Summary
This is a Consulting Agreement between ABC Company, Inc. and XYZ Consulting, LLC dated January 1, 2023. The agreement establishes a one-year consulting relationship with services including strategic business consulting and market analysis at a rate of $200/hour up to $10,000 per month.

## 2. Key Clauses
- Limitation of Liability: Restricts both parties from being liable for indirect, incidental, or consequential damages.
  - This is a mutual limitation that protects both parties
  - No cap on direct damages is specified

- Termination: Either party may terminate with 30 days' notice, or Company may terminate immediately for material breach.
  - No cure period for material breach is defined
  - Immediate termination right only granted to Company

- Confidentiality: Consultant must maintain confidentiality of Company information.
  - No specified time limit for confidentiality obligations
  - No defined penalties for breach

- Intellectual Property: All deliverables created by Consultant belong to the Company.
  - Complete assignment of rights
  - No exceptions for pre-existing materials

## 3. Parties Involved
- ABC Company, Inc.: A Delaware corporation (referred to as "Company")
- XYZ Consulting, LLC: A California limited liability company (referred to as "Consultant")

## 4. Obligations
- Consultant's Obligations:
  - Provide services described in Exhibit A
  - Perform services professionally
  - Maintain confidentiality
  - Invoice Company monthly
  - Pay own taxes as independent contractor

- Company's Obligations:
  - Pay Consultant's fees
  - Pay invoices within 30 days

## 5. Rights and Benefits
- Company's Rights:
  - Ownership of all deliverables
  - Right to terminate for Consultant's material breach
  - 30-day termination right

- Consultant's Rights:
  - Payment for services
  - 30-day termination right
  - Independent contractor status

## 6. Payment Terms
- Rate: $200 per hour
- Monthly cap: $10,000 (without prior approval)
- Invoicing: Monthly
- Payment due: Within 30 days
- No late payment penalties specified

## 7. Termination Conditions
- Either party may terminate with 30 days' written notice
- Company may terminate immediately for Consultant's material breach
- Contract automatically expires after one year unless extended

## 8. Risks & Red Flags
- No definition of "material breach" for immediate termination
- No cure period for breaches
- No specific confidentiality period (potentially perpetual)
- No liability insurance requirements
- No dispute resolution process
- No process for approving work exceeding the monthly cap
- No clarity on pre-existing intellectual property

## 9. Important Dates & Durations
- Effective Date: January 1, 2023
- Term: One year (ending December 31, 2023)
- Termination Notice: 30 days
- Payment Due: 30 days from invoice

## 10. Suggestions
- Define "material breach" with specific examples
- Add cure period (e.g., 15 days) for breaches
- Specify confidentiality period (e.g., 3 years)
- Include dispute resolution process
- Add liability insurance requirements
- Clarify ownership of pre-existing intellectual property
- Establish process for approving work beyond monthly cap
`;

// Helper function to safely parse markdown sections
// DEPRECATED: Use the more robust implementation from markdownUtils.ts instead
function extractMarkdownSections(text: string): any {
  try {
    // Get executive summary
    const executiveSummaryMatch = text.match(/## 1\. Executive Summary\s+([\s\S]*?)(?=##|\s*$)/);
    const executiveSummary = executiveSummaryMatch ? executiveSummaryMatch[1].trim() : '';
    
    // Get key clauses
    const keyClausesMatch = text.match(/## 2\. Key Clauses\s+([\s\S]*?)(?=##|\s*$)/);
    const keyClausesText = keyClausesMatch ? keyClausesMatch[1].trim() : '';
    
    // Get parties involved
    const partiesMatch = text.match(/## 3\. Parties Involved\s+([\s\S]*?)(?=##|\s*$)/);
    const partiesText = partiesMatch ? partiesMatch[1].trim() : '';
    
    // Get obligations
    const obligationsMatch = text.match(/## 4\. Obligations\s+([\s\S]*?)(?=##|\s*$)/);
    const obligationsText = obligationsMatch ? obligationsMatch[1].trim() : '';
    
    // Get rights and benefits
    const rightsMatch = text.match(/## 5\. Rights and Benefits\s+([\s\S]*?)(?=##|\s*$)/);
    const rightsText = rightsMatch ? rightsMatch[1].trim() : '';
    
    // Get payment terms
    const paymentMatch = text.match(/## 6\. Payment Terms[^#]*([\s\S]*?)(?=##|\s*$)/);
    const paymentText = paymentMatch ? paymentMatch[1].trim() : '';
    
    // Get termination conditions
    const terminationMatch = text.match(/## 7\. Termination Conditions\s+([\s\S]*?)(?=##|\s*$)/);
    const terminationText = terminationMatch ? terminationMatch[1].trim() : '';
    
    // Get risks and red flags
    const risksMatch = text.match(/## 8\. Risks & Red Flags\s+([\s\S]*?)(?=##|\s*$)/);
    const risksText = risksMatch ? risksMatch[1].trim() : '';
    
    // Get important dates
    const datesMatch = text.match(/## 9\. Important Dates & Durations\s+([\s\S]*?)(?=##|\s*$)/);
    const datesText = datesMatch ? datesMatch[1].trim() : '';
    
    // Get suggestions
    const suggestionsMatch = text.match(/## 10\. Suggestions[^#]*([\s\S]*?)(?=##|\s*$)/);
    const suggestionsText = suggestionsMatch ? suggestionsMatch[1].trim() : '';
    
    // Process clauses from key clauses section (convert bullet points to clauses)
    const keyClauses: Clause[] = [];
    const clauseMatches = keyClausesText.match(/- (.*?)(?=\n- |\n\n|$)/gs);
    
    if (clauseMatches) {
      clauseMatches.forEach((match, index) => {
        const titleMatch = match.match(/- ([^:]+):/);
        const title = titleMatch ? titleMatch[1].trim() : `Clause ${index+1}`;
        
        // Filter out the title line and get the rest as content
        const contentLines = match.split('\n').slice(1).join('\n').trim();
        
        keyClauses.push({
          id: (index + 1).toString(),
          title: title,
          content: contentLines || match.replace(/- [^:]+:/, '').trim(),
          category: 'Key Clause',
          risk: 'medium'
        });
      });
    }
    
    // Process risks from risks section
    const risks: Clause[] = [];
    const riskMatches = risksText.match(/- (.*?)(?=\n- |\n\n|$)/gs);
    
    if (riskMatches) {
      riskMatches.forEach((match, index) => {
        risks.push({
          id: `risk-${index + 1}`,
          title: `Risk ${index + 1}`,
          content: match.replace(/^- /, '').trim(),
          category: 'Risk',
          risk: 'high'
        });
      });
    }
    
    return {
      executiveSummary,
      keyClauses,
      parties: {
        id: 'parties',
        title: 'Parties Involved',
        content: partiesText
      },
      obligations: {
        id: 'obligations',
        title: 'Obligations',
        content: obligationsText
      },
      rights: {
        id: 'rights',
        title: 'Rights and Benefits',
        content: rightsText
      },
      paymentTerms: {
        id: 'payment',
        title: 'Payment Terms',
        content: paymentText
      },
      termination: {
        id: 'termination',
        title: 'Termination Conditions',
        content: terminationText
      },
      risks,
      dates: {
        id: 'dates',
        title: 'Important Dates & Durations',
        content: datesText
      },
      suggestions: {
        id: 'suggestions',
        title: 'Suggestions',
        content: suggestionsText
      },
    };
  } catch (e) {
    console.error('Error parsing markdown sections:', e);
    return {
      executiveSummary: 'Error parsing the analysis.',
      keyClauses: [],
      parties: { id: 'parties', title: 'Parties Involved', content: '' },
      obligations: { id: 'obligations', title: 'Obligations', content: '' },
      rights: { id: 'rights', title: 'Rights and Benefits', content: '' },
      paymentTerms: { id: 'payment', title: 'Payment Terms', content: '' },
      termination: { id: 'termination', title: 'Termination Conditions', content: '' },
      risks: [],
      dates: { id: 'dates', title: 'Important Dates & Durations', content: '' },
      suggestions: { id: 'suggestions', title: 'Suggestions', content: '' },
    };
  }
}

// Analyze contract using API endpoint
export async function analyzeContract(text: string, filename: string): Promise<AnalysisResult> {
  try {
    // For testing/debugging with mock data - set to false by default
    // Set to true ONLY for local development without API
    const useMockData = false;
    
    if (useMockData) {
      console.log('Using mock data instead of calling API');
      
      // Import dynamically to avoid circular dependencies
      const { extractMarkdownSections } = await import('./markdownUtils');
      const sections = extractMarkdownSections(MOCK_MARKDOWN);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        filename,
        timestamp: new Date().toISOString(),
        executiveSummary: sections.executiveSummary,
        keyClauses: sections.keyClauses,
        parties: sections.parties,
        obligations: sections.obligations,
        rights: sections.rights,
        paymentTerms: sections.paymentTerms,
        termination: sections.termination,
        risks: sections.risks,
        dates: sections.dates,
        suggestions: sections.suggestions,
        markdownContent: MOCK_MARKDOWN
      };
    }
    
    console.log('Sending document to API for analysis...');
    
    // Send request to API endpoint with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, filename }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `API error: ${response.status} ${response.statusText}`;
        console.error('API error:', errorMessage);
        
        // Handle specific error codes
        if (response.status === 429) {
          throw new Error('The AI service is currently busy. Please try again in a few minutes.');
        } else if (response.status === 413 || response.status === 400) {
          throw new Error('The document is too large or contains unsupported content. Please try a smaller document.');
        } else if (response.status >= 500) {
          throw new Error('Server error while analyzing document. Please try again later.');
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Analysis completed successfully');
      return data as AnalysisResult;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Analysis request timed out. Please try again with a shorter document.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error('Error analyzing contract:', error);
    
    // Import dynamically to avoid circular dependencies
    const { extractMarkdownSections } = await import('./markdownUtils');
    
    // Use mock data as fallback on error
    console.log('Using fallback data due to error');
    const sections = extractMarkdownSections(`
      # Analysis Error
      
      ## 1. Executive Summary
      There was an error analyzing your document: ${error.message || 'Unknown error'}
      
      ## 2. Key Clauses
      - Error: ${error.message || 'Unknown error'}
      
      ## 3. Parties Involved
      Unable to extract parties due to analysis error.
      
      ## 4. Obligations
      Unable to extract obligations due to analysis error.
      
      ## 5. Rights and Benefits
      Unable to extract rights and benefits due to analysis error.
      
      ## 6. Payment Terms
      Unable to extract payment terms due to analysis error.
      
      ## 7. Termination Conditions
      Unable to extract termination conditions due to analysis error.
      
      ## 8. Risks & Red Flags
      - Analysis failed: There might be issues with the document format or content.
      - Please try again or contact support if the issue persists.
      
      ## 9. Important Dates & Durations
      Unable to extract dates due to analysis error.
      
      ## 10. Suggestions
      Please try uploading the document again or try a different document format.
    `);
    
    // Create a fallback result with error information
    return {
      id: Math.random().toString(36).substr(2, 9),
      filename,
      timestamp: new Date().toISOString(),
      executiveSummary: `Error analyzing document: ${error.message || 'Unknown error'}`,
      keyClauses: sections.keyClauses.length > 0 ? sections.keyClauses : [
        {
          id: "1",
          title: "Analysis Error",
          content: `There was an error analyzing this document: ${error.message || 'Unknown error'}. Please try again or use a different document.`,
          category: "Error",
          risk: "high"
        }
      ],
      parties: sections.parties,
      obligations: sections.obligations,
      rights: sections.rights,
      paymentTerms: sections.paymentTerms,
      termination: sections.termination,
      risks: sections.risks.length > 0 ? sections.risks : [
        {
          id: "risk-1",
          title: "Analysis Failed",
          content: "The document analysis failed. This could be due to document format issues or system limitations.",
          category: "Error",
          risk: "high"
        }
      ],
      dates: sections.dates,
      suggestions: { 
        id: 'suggestions', 
        title: 'Suggestions', 
        content: 'Try uploading a different document or converting to a different format (e.g., PDF or plain text).' 
      },
      markdownContent: `# Analysis Error\n\nThere was an error analyzing this document: ${error.message || 'Unknown error'}. Please try again or use a different document.`
    };
  }
} 