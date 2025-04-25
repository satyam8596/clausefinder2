// Simple script to test API endpoints
// For Node.js < 18, we need to use node-fetch explicitly
// For Node.js >= 18, fetch is built-in
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  // If node-fetch is not available or we're on Node.js 18+, use global fetch
  fetch = global.fetch;
}

// If neither is available, we'll provide an error
if (!fetch) {
  console.error("Fetch API is not available. Please upgrade to Node.js 18+ or install node-fetch.");
  process.exit(1);
}

async function testAPIEndpoints() {
  console.log('Testing API endpoints...');
  
  try {
    // Test the test endpoint
    console.log('\n1. Testing /api/test GET endpoint:');
    const testResponse = await fetch('http://localhost:3000/api/test');
    const testData = await testResponse.json();
    console.log('Status:', testResponse.status);
    console.log('Response:', testData);
    
    // Test the test POST endpoint
    console.log('\n2. Testing /api/test POST endpoint:');
    const testPostResponse = await fetch('http://localhost:3000/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' }),
    });
    const testPostData = await testPostResponse.json();
    console.log('Status:', testPostResponse.status);
    console.log('Response:', testPostData);
    
    // Test the analyze endpoint with a small sample
    console.log('\n3. Testing /api/analyze endpoint with small sample:');
    const sampleContract = `
    THIS AGREEMENT is made on January 15, 2023
    
    BETWEEN:
    
    ABC Corporation, a company registered in Delaware with its principal place of business at 123 Main Street, San Francisco, CA ("Company")
    
    AND:
    
    John Smith, an individual residing at 456 Oak Avenue, New York, NY ("Consultant")
    
    1. SERVICES
    The Consultant shall provide the following services to the Company: strategic business consulting.
    
    2. TERM
    This Agreement shall commence on January 15, 2023 and continue for a period of 12 months unless terminated earlier.
    
    3. PAYMENT
    The Company shall pay the Consultant $5,000 per month, payable within 15 days of receipt of an invoice.
    `;
    
    const analyzeResponse = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: sampleContract,
        filename: 'test-contract.txt',
      }),
    });
    
    console.log('Status:', analyzeResponse.status);
    
    if (analyzeResponse.ok) {
      console.log('Analysis request successful!');
      const analyzeData = await analyzeResponse.json();
      console.log('Analysis ID:', analyzeData.id);
      console.log('Executive Summary Length:', analyzeData.executiveSummary?.length || 0);
      console.log('Key Clauses Count:', analyzeData.keyClauses?.length || 0);
      console.log('Risks Count:', analyzeData.risks?.length || 0);
    } else {
      const errorData = await analyzeResponse.json();
      console.log('Analysis request failed:', errorData);
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the tests
testAPIEndpoints(); 