import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { extractMarkdownSections } from '@/utils/markdownUtils';

// Maximum allowed text length
const MAX_TEXT_LENGTH = 100000;

// Initialize Google Generative AI with API key
// Use environment variable or fallback to hardcoded key (not ideal for production)
const FALLBACK_API_KEY = 'AIzaSyDAslcbQFWW5q70artyj5XEv8FW7D3nr_4';
const apiKey = process.env.GOOGLE_AI_API_KEY || FALLBACK_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Set safety settings
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

export async function POST(request: NextRequest) {
  console.log('API: Received analysis request');
  
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.text) {
      console.log('API: Missing text field');
      return NextResponse.json({ message: 'Missing text field' }, { status: 400 });
    }
    
    if (!body.filename) {
      console.log('API: Missing filename field');
      return NextResponse.json({ message: 'Missing filename field' }, { status: 400 });
    }
    
    let { text, filename } = body;
    
    // Validate text content
    if (typeof text !== 'string') {
      console.log('API: Invalid text format, expected string');
      return NextResponse.json({ message: 'Invalid text format, expected string' }, { status: 400 });
    }
    
    // Check if input is base64 data URI (for images and binary files)
    let isBase64 = text.startsWith('data:');
    let fileType = 'text';
    
    if (isBase64) {
      fileType = text.split(';')[0].split(':')[1] || 'unknown';
      console.log(`API: Detected binary data of type: ${fileType}`);
      
      // DOCX files should now be handled client-side, so we don't need special handling here
    }
    
    // Validate filename format
    if (typeof filename !== 'string') {
      console.log('API: Invalid filename format, expected string');
      return NextResponse.json({ message: 'Invalid filename format, expected string' }, { status: 400 });
    }
    
    console.log(`API: Processing document "${filename}" (length: ${text.length} chars)`);
    
    // For text files, perform validation checks
    if (!isBase64) {
      // Check if text is empty or just whitespace
      if (text.trim().length === 0) {
        console.log('API: Empty document');
        return NextResponse.json({ message: 'Empty document content' }, { status: 400 });
      }
      
      // Check if text is too short - likely invalid document
      if (text.length < 50) {
        console.log('API: Document content too short');
        return NextResponse.json({ message: 'Document content too short for analysis' }, { status: 400 });
      }
      
      // Check if text is too long and truncate if necessary
      if (text.length > MAX_TEXT_LENGTH) {
        console.log(`API: Text exceeds maximum length (${text.length} > ${MAX_TEXT_LENGTH}), truncating`);
        text = text.substring(0, MAX_TEXT_LENGTH);
      }
    }
    
    // Create prompt for the analysis - different for text vs binary
    let prompt;
    
    if (isBase64) {
      prompt = `
You are a legal document analyzer. Analyze the following contract image or PDF and provide a detailed report.
${fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? 'NOTE: This is a DOCX file being sent with a PDF MIME type for compatibility. Please analyze the content as a DOCX file.' : ''}
Your analysis should be well-structured in markdown format with the following sections:

# Contract Analysis

## 1. Executive Summary
Provide a concise summary of the contract including type, parties, purpose, and key terms.

## 2. Key Clauses
List and analyze the most important clauses in bullet points. Include:
- What the clause covers
- Any notable provisions, limitations, or exceptions
- For each key clause, include 2-3 sub-bullet points with analysis 

## 3. Parties Involved
List all parties to the contract with relevant details about each.

## 4. Obligations
Detail the main obligations of each party in the contract.

## 5. Rights and Benefits
Outline the rights and benefits granted to each party.

## 6. Payment Terms
Describe all payment terms including amounts, schedules, and conditions.

## 7. Termination Conditions
Explain how the contract can be terminated and any consequences of termination.

## 8. Risks & Red Flags
Identify potential issues or concerns in bullet points that might:
- Create legal liability
- Benefit one party significantly more than others
- Contain vague or ambiguous language
- Have missing elements that are typically included

## 9. Important Dates & Durations
List key dates, deadlines, and time periods in the contract.

## 10. Suggestions
Provide recommendations to improve the contract or address the identified risks.

If there are parts of the document that you cannot read or interpret, please note this clearly in your analysis.
`;
    } else {
      prompt = `
You are a legal document analyzer. Analyze the following contract and provide a detailed report.
Your analysis should be well-structured in markdown format with the following sections:

# Contract Analysis

## 1. Executive Summary
Provide a concise summary of the contract including type, parties, purpose, and key terms.

## 2. Key Clauses
List and analyze the most important clauses in bullet points. Include:
- What the clause covers
- Any notable provisions, limitations, or exceptions
- For each key clause, include 2-3 sub-bullet points with analysis 

## 3. Parties Involved
List all parties to the contract with relevant details about each.

## 4. Obligations
Detail the main obligations of each party in the contract.

## 5. Rights and Benefits
Outline the rights and benefits granted to each party.

## 6. Payment Terms
Describe all payment terms including amounts, schedules, and conditions.

## 7. Termination Conditions
Explain how the contract can be terminated and any consequences of termination.

## 8. Risks & Red Flags
Identify potential issues or concerns in bullet points that might:
- Create legal liability
- Benefit one party significantly more than others
- Contain vague or ambiguous language
- Have missing elements that are typically included

## 9. Important Dates & Durations
List key dates, deadlines, and time periods in the contract.

## 10. Suggestions
Provide recommendations to improve the contract or address the identified risks.

Here is the contract to analyze:

${text}
`;
    }

    // Generate API not configured error if no API key
    if (!apiKey) {
      console.error('API: Google AI API key not configured');
      return NextResponse.json(
        { 
          message: 'Google AI API key not configured. Please set the GOOGLE_AI_API_KEY environment variable.'
        }, 
        { status: 500 }
      );
    }

    console.log('API: Calling Gemini model');
    const startTime = Date.now();
    
    try {
      // Call generative model
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        safetySettings,
      });
      
      let result;
      
      if (isBase64) {
        // For base64 encoded files (images, PDFs)
        // We need to parse the base64 data
        const base64Data = text.split(',')[1]; // Remove the data URI prefix
        
        const fileData = {
          inlineData: {
            data: base64Data,
            mimeType: fileType
          }
        };
        
        // For images/PDFs, use the fileData for content generation
        result = await model.generateContent([prompt, fileData]);
      } else {
        // For plain text, use the text directly
        result = await model.generateContent(prompt);
      }
      
      const response = await result.response;
      const responseText = response.text();
      
      const endTime = Date.now();
      console.log(`API: Gemini model response received in ${(endTime - startTime) / 1000} seconds`);
      
      // Check if we got a meaningful response
      if (!responseText || responseText.trim().length < 100) {
        console.error('API: Received too short or empty response from Gemini API');
        return NextResponse.json(
          { message: 'The AI service returned an incomplete response. Please try again.' },
          { status: 500 }
        );
      }
      
      // Log a preview of the response for debugging
      console.log('API: Gemini response preview:', responseText.substring(0, 500) + '...');
      
      // Extract sections from markdown
      console.log('API: Extracting sections from markdown');
      const sections = extractMarkdownSections(responseText);
      
      // Validate that we have a minimum viable response
      if (!sections.executiveSummary || (sections.keyClauses.length === 0 && sections.risks.length === 0)) {
        console.error('API: Failed to extract meaningful sections from Gemini response');
        return NextResponse.json(
          { message: 'Failed to extract meaningful analysis from the document. Please try again.' },
          { status: 500 }
        );
      }
      
      // Log extracted sections lengths for debugging
      console.log('API: Sections extracted:', {
        executiveSummaryLength: sections.executiveSummary?.length || 0,
        keyClausesCount: sections.keyClauses?.length || 0,
        risksCount: sections.risks?.length || 0
      });
      
      // Format response with extracted data
      const analysisResult = {
        id: Math.random().toString(36).substring(2, 9),
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
        markdownContent: responseText,
      };
      
      console.log('API: Analysis complete, returning result');
      return NextResponse.json(analysisResult);
    } catch (error: any) {
      console.error('API: Error calling Gemini API:', error);
      
      // Handle different types of Gemini API errors
      let status = 500;
      let message = 'Error calling generative AI service';
      
      // Check for different error types
      if (error.message?.includes('RESOURCE_EXHAUSTED')) {
        status = 429;
        message = 'AI service quota exceeded. Please try again later.';
      } else if (error.message?.includes('INVALID_ARGUMENT')) {
        status = 400;
        message = 'Invalid input provided to AI service.';
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        status = 403;
        message = 'Permission denied by AI service. Check API key configuration.';
      } else if (error.message?.includes('FAILED_PRECONDITION')) {
        status = 412;
        message = 'Precondition failed for AI service request.';
      } else if (error.message?.includes('mimeType') && error.message?.includes('not supported') && 
                 fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        status = 400;
        message = 'DOCX file format could not be processed. Try converting to PDF and uploading again.';
      }
      
      return NextResponse.json({ message }, { status });
    }
  } catch (error: any) {
    console.error('API: Unexpected error in route handler:', error);
    return NextResponse.json({ message: 'Internal server error: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
} 