import { Clause, ContractSection } from './gemini';

// Helper function to safely parse markdown sections
export function extractMarkdownSections(text: string): any {
  console.log('Starting markdown extraction');
  
  try {
    // Clean the markdown text to ensure consistency
    const cleanedText = text
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .trim();
    
    console.log('Cleaned text length:', cleanedText.length);
    
    // More flexible regex patterns that can handle variations in formatting
    const executiveSummaryMatch = cleanedText.match(/#+\s*(?:1\.?\s*)?Executive\s*Summary\s*([\s\S]*?)(?=#+\s*(?:2\.?\s*)?|$)/i);
    const keyClausesMatch = cleanedText.match(/#+\s*(?:2\.?\s*)?Key\s*Clauses\s*([\s\S]*?)(?=#+\s*(?:3\.?\s*)?|$)/i);
    const partiesMatch = cleanedText.match(/#+\s*(?:3\.?\s*)?Parties\s*Involved\s*([\s\S]*?)(?=#+\s*(?:4\.?\s*)?|$)/i);
    const obligationsMatch = cleanedText.match(/#+\s*(?:4\.?\s*)?Obligations\s*([\s\S]*?)(?=#+\s*(?:5\.?\s*)?|$)/i);
    const rightsMatch = cleanedText.match(/#+\s*(?:5\.?\s*)?Rights\s*and\s*Benefits\s*([\s\S]*?)(?=#+\s*(?:6\.?\s*)?|$)/i);
    const paymentMatch = cleanedText.match(/#+\s*(?:6\.?\s*)?Payment\s*Terms\s*([\s\S]*?)(?=#+\s*(?:7\.?\s*)?|$)/i);
    const terminationMatch = cleanedText.match(/#+\s*(?:7\.?\s*)?Termination\s*Conditions\s*([\s\S]*?)(?=#+\s*(?:8\.?\s*)?|$)/i);
    const risksMatch = cleanedText.match(/#+\s*(?:8\.?\s*)?Risks\s*(?:&|and)\s*Red\s*Flags\s*([\s\S]*?)(?=#+\s*(?:9\.?\s*)?|$)/i);
    const datesMatch = cleanedText.match(/#+\s*(?:9\.?\s*)?Important\s*Dates\s*(?:&|and)\s*Durations\s*([\s\S]*?)(?=#+\s*(?:10\.?\s*)?|$)/i);
    const suggestionsMatch = cleanedText.match(/#+\s*(?:10\.?\s*)?Suggestions\s*([\s\S]*?)(?=#+|$)/i);
    
    // Log which sections were found
    console.log('Sections found:', {
      executiveSummary: !!executiveSummaryMatch,
      keyClauses: !!keyClausesMatch,
      parties: !!partiesMatch,
      obligations: !!obligationsMatch,
      rights: !!rightsMatch,
      payment: !!paymentMatch,
      termination: !!terminationMatch,
      risks: !!risksMatch,
      dates: !!datesMatch,
      suggestions: !!suggestionsMatch,
    });
    
    const executiveSummary = executiveSummaryMatch ? executiveSummaryMatch[1].trim() : '';
    const keyClausesText = keyClausesMatch ? keyClausesMatch[1].trim() : '';
    const partiesText = partiesMatch ? partiesMatch[1].trim() : '';
    const obligationsText = obligationsMatch ? obligationsMatch[1].trim() : '';
    const rightsText = rightsMatch ? rightsMatch[1].trim() : '';
    const paymentText = paymentMatch ? paymentMatch[1].trim() : '';
    const terminationText = terminationMatch ? terminationMatch[1].trim() : '';
    const risksText = risksMatch ? risksMatch[1].trim() : '';
    const datesText = datesMatch ? datesMatch[1].trim() : '';
    const suggestionsText = suggestionsMatch ? suggestionsMatch[1].trim() : '';
    
    // Process clauses from key clauses section (convert bullet points to clauses)
    const keyClauses: Clause[] = [];
    
    // More robust extraction of clauses using different bullet point styles
    // This handles - * • and numbered lists
    const clausePattern = /(?:^|\n)(?:[*•-]|\d+\.)\s+(.*?)(?=(?:\n\s*[*•-]|\n\s*\d+\.|\n\n|$))/gs;
    const clauseMatches = keyClausesText.match(clausePattern);
    
    if (clauseMatches) {
      console.log(`Found ${clauseMatches.length} key clauses`);
      
      clauseMatches.forEach((match, index) => {
        // Extract the title - it could be after the bullet or before a colon
        const titleMatch = match.match(/(?:[*•-]|\d+\.)\s+([^:]+):/);
        const title = titleMatch 
          ? titleMatch[1].trim() 
          : `Clause ${index+1}`;
        
        // Extract content - everything after the title
        let content = match;
        if (titleMatch) {
          // Remove the bullet and title
          content = match.substring(titleMatch[0].length).trim();
        } else {
          // Remove just the bullet
          content = match.replace(/^(?:[*•-]|\d+\.)\s+/, '').trim();
        }
        
        keyClauses.push({
          id: (index + 1).toString(),
          title: title,
          content: content,
          category: 'Key Clause',
          risk: determineRiskLevel(title, content)
        });
      });
    } else {
      console.log('No key clauses matched with regex');
      
      // Fallback: split by double newlines if no bullet points found
      if (keyClausesText.length > 0) {
        const clauseParagraphs = keyClausesText.split(/\n\n+/);
        clauseParagraphs.forEach((paragraph, index) => {
          if (paragraph.trim().length > 0) {
            keyClauses.push({
              id: (index + 1).toString(),
              title: `Key Clause ${index + 1}`,
              content: paragraph.trim(),
              category: 'Key Clause',
              risk: determineRiskLevel('', paragraph)
            });
          }
        });
        console.log(`Added ${keyClauses.length} clauses from fallback method`);
      }
    }
    
    // Process risks from risks section
    const risks: Clause[] = [];
    const riskPattern = /(?:^|\n)(?:[*•-]|\d+\.)\s+(.*?)(?=(?:\n\s*[*•-]|\n\s*\d+\.|\n\n|$))/gs;
    const riskMatches = risksText.match(riskPattern);
    
    if (riskMatches) {
      console.log(`Found ${riskMatches.length} risks`);
      
      riskMatches.forEach((match, index) => {
        risks.push({
          id: `risk-${index + 1}`,
          title: `Risk ${index + 1}`,
          content: match.replace(/^(?:[*•-]|\d+\.)\s+/, '').trim(),
          category: 'Risk',
          risk: 'high'
        });
      });
    } else {
      console.log('No risks matched with regex');
      
      // Fallback: split by double newlines if no bullet points found
      if (risksText.length > 0) {
        const riskParagraphs = risksText.split(/\n\n+/);
        riskParagraphs.forEach((paragraph, index) => {
          if (paragraph.trim().length > 0) {
            risks.push({
              id: `risk-${index + 1}`,
              title: `Risk ${index + 1}`,
              content: paragraph.trim(),
              category: 'Risk',
              risk: 'high'
            });
          }
        });
        console.log(`Added ${risks.length} risks from fallback method`);
      }
    }
    
    // If we still have no clauses or risks but we have markdown content,
    // create at least one default item to show something
    if (keyClauses.length === 0 && cleanedText.length > 100) {
      keyClauses.push({
        id: "1",
        title: "Contract Overview",
        content: "The document has been analyzed, but specific clauses could not be extracted. Please see the full report tab for complete details.",
        category: "General",
        risk: "medium"
      });
      console.log('Added default clause due to extraction failure');
    }
    
    if (risks.length === 0 && cleanedText.length > 100) {
      risks.push({
        id: "risk-1",
        title: "Potential Risk",
        content: "The document has been analyzed, but specific risks could not be extracted. Please see the full report tab for complete details.",
        category: "Risk",
        risk: "medium"
      });
      console.log('Added default risk due to extraction failure');
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
    
    // Create default section with error information
    return {
      executiveSummary: 'Error parsing the analysis.',
      keyClauses: [{
        id: "1",
        title: "Error in Analysis",
        content: "There was an error processing the document. Please try again with a different document.",
        category: "Error",
        risk: "high"
      }],
      parties: { id: 'parties', title: 'Parties Involved', content: '' },
      obligations: { id: 'obligations', title: 'Obligations', content: '' },
      rights: { id: 'rights', title: 'Rights and Benefits', content: '' },
      paymentTerms: { id: 'payment', title: 'Payment Terms', content: '' },
      termination: { id: 'termination', title: 'Termination Conditions', content: '' },
      risks: [{
        id: "risk-1",
        title: "Analysis Error",
        content: "There was an error analyzing risks in this document.",
        category: "Error",
        risk: "high"
      }],
      dates: { id: 'dates', title: 'Important Dates & Durations', content: '' },
      suggestions: { id: 'suggestions', title: 'Suggestions', content: '' },
    };
  }
}

// Helper function to determine risk level based on clause content
function determineRiskLevel(title: string, content: string): 'high' | 'medium' | 'low' | 'none' {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // High risk terms
  const highRiskTerms = [
    'termination', 'liability', 'indemnification', 'confidentiality', 'non-compete',
    'intellectual property', 'warranty', 'limitation of liability', 'damages', 'breach'
  ];
  
  // Medium risk terms
  const mediumRiskTerms = [
    'payment', 'fees', 'penalty', 'duration', 'notice period', 'renewal', 'modification',
    'amendment', 'assignment', 'governing law', 'jurisdiction'
  ];
  
  // Check for high risk first
  for (const term of highRiskTerms) {
    if (titleLower.includes(term) || contentLower.includes(term)) {
      return 'high';
    }
  }
  
  // Then check for medium risk
  for (const term of mediumRiskTerms) {
    if (titleLower.includes(term) || contentLower.includes(term)) {
      return 'medium';
    }
  }
  
  // Default to low risk
  return 'low';
} 