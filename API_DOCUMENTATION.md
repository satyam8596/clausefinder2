# ClauseFinder API Documentation

This document provides details on the ClauseFinder API endpoints, request/response formats, and usage examples.

## Base URL

When running locally:
```
http://localhost:3000
```

## Endpoints

### 1. Analyze Contract

Analyzes a legal document and extracts key clauses, risks, and other important information.

**URL**: `/api/analyze`
**Method**: `POST`
**Content Type**: `application/json`

#### Request Body

| Field    | Type   | Description                                  | Required |
|----------|--------|----------------------------------------------|----------|
| text     | string | The full text content of the document        | Yes      |
| filename | string | The name of the file being analyzed          | Yes      |

**Example Request:**
```json
{
  "text": "THIS AGREEMENT is made on January 15, 2023\n\nBETWEEN: ABC Corporation...",
  "filename": "contract.pdf"
}
```

#### Response Body

The response includes a JSON object with the following fields:

| Field            | Type   | Description                                             |
|------------------|--------|---------------------------------------------------------|
| id               | string | Unique identifier for the analysis                      |
| filename         | string | Name of the analyzed file                               |
| timestamp        | string | ISO datetime when analysis was completed                |
| executiveSummary | string | Brief summary of the contract                           |
| keyClauses       | array  | Array of important clauses extracted from the document  |
| parties          | object | Information about parties involved in the contract      |
| obligations      | object | Details about obligations of each party                 |
| rights           | object | Rights granted to each party                            |
| paymentTerms     | object | Payment terms and conditions                            |
| termination      | object | How the contract can be terminated                      |
| risks            | array  | Array of identified risks and red flags                 |
| dates            | object | Important dates and deadlines                           |
| suggestions      | object | Recommendations for improving the contract              |
| markdownContent  | string | Full markdown content of the analysis                   |

**Example Response:**
```json
{
  "id": "abc123",
  "filename": "contract.pdf",
  "timestamp": "2023-04-25T10:30:00Z",
  "executiveSummary": "This is a Consulting Agreement between...",
  "keyClauses": [
    {
      "id": "1",
      "title": "Limitation of Liability",
      "content": "Restricts both parties from being liable for indirect damages",
      "category": "Key Clause",
      "risk": "medium"
    }
  ],
  "parties": {
    "id": "parties",
    "title": "Parties Involved",
    "content": "ABC Corporation and John Smith"
  },
  "risks": [
    {
      "id": "risk-1",
      "title": "Risk 1",
      "content": "No definition of 'material breach' for immediate termination",
      "category": "Risk",
      "risk": "high"
    }
  ],
  "markdownContent": "# Contract Analysis\n\n## 1. Executive Summary\n..."
}
```

#### Error Responses

| Status Code | Description                                   |
|-------------|-----------------------------------------------|
| 400         | Bad Request - Missing required fields or invalid input |
| 429         | Too Many Requests - API quota exceeded        |
| 500         | Server Error - Analysis failed                |

**Example Error Response:**
```json
{
  "message": "Document content too short for analysis"
}
```

### 2. Test Endpoint

A simple endpoint to test if the API is functioning.

**URL**: `/api/test`
**Method**: `GET`

#### Response

```json
{
  "status": "ok",
  "message": "API is working",
  "timestamp": "2023-04-25T10:30:00Z"
}
```

## Rate Limits

- Maximum document size: 100,000 characters
- Requests may be throttled if they exceed the Google Gemini API quotas

## Error Handling

All errors will return a JSON object with a `message` field describing the error. 