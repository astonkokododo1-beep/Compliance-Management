import { z } from 'zod'

const AIResponseSchema = z.object({
  content: z.string(),
  tokensUsed: z.number().optional(),
})

export class AIService {
  private groqApiKey: string
  private geminiApiKey: string

  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || ''
    this.geminiApiKey = process.env.GEMINI_API_KEY || ''

    if (!this.groqApiKey || !this.geminiApiKey) {
      throw new Error('AI API keys not configured')
    }
  }

  async generatePolicy(context: {
    type: string
    industry: string
    companyType: string
    jurisdictions: string[]
    riskLevel: string
    regulations?: string[]
  }) {
    const prompt = `You are a senior compliance officer and legal expert. Generate a comprehensive, legally compliant ${context.type} for a ${context.industry} company operating in ${context.jurisdictions.join(', ')}.

Company Profile:
- Type: ${context.companyType}
- Risk Level: ${context.riskLevel}
- Applicable Regulations: ${context.regulations?.join(', ') || 'Standard regulations'}

Requirements:
1. Include clear definitions and scope
2. Outline prohibited and permitted activities
3. Detail reporting procedures
4. Specify consequences of violations
5. Include references to relevant laws and regulations
6. Use professional, clear language suitable for employees
7. Format using Markdown with proper headings

Generate a complete, ready-to-implement policy document.`

    return this.callGroq(prompt)
  }

  async assessGiftRisk(context: {
    value: number
    source: string
    recipientRole: string
    timing: string
    frequency: number
    jurisdiction: string
  }): Promise<{
    riskScore: number
    riskLevel: string
    redFlags: string[]
    recommendation: string
    requiredApprovers: string[]
  }> {
    const prompt = `Analyze the compliance risk of this gift/hospitality scenario:

Gift Details:
- Value: $${context.value}
- Source: ${context.source}
- Recipient Role: ${context.recipientRole}
- Timing: ${context.timing}
- Historical Frequency: ${context.frequency} gifts from this source
- Jurisdiction: ${context.jurisdiction}

Provide:
1. Risk score (0-100)
2. Risk level (Low/Medium/High/Critical)
3. Key red flags identified
4. Recommendation (Auto-approve/Review/Reject)
5. Required approvals

Return as JSON with fields: riskScore, riskLevel, redFlags[], recommendation, requiredApprovers[]`

    const response = await this.callGemini(prompt)
    try {
      return JSON.parse(response.content)
    } catch (e) {
      console.error("Failed to parse AI response", e)
      return {
        riskScore: 0,
        riskLevel: "Unknown",
        redFlags: ["AI Analysis Failed"],
        recommendation: "Manual Review",
        requiredApprovers: []
      }
    }
  }

  async analyzeCOI(data: {
    declarations: any[]
    vendorDatabase: any[]
    relationships: any[]
  }) {
    const prompt = `Analyze these conflict of interest declarations for potential conflicts:

Declarations: ${JSON.stringify(data.declarations)}
Vendor Database: ${JSON.stringify(data.vendorDatabase)}
Relationships: ${JSON.stringify(data.relationships)}

Identify:
1. Direct conflicts
2. Potential conflicts requiring mitigation
3. Relationship patterns
4. Recommended mitigation actions

Return detailed analysis with conflict scores.`

    return this.callGemini(prompt)
  }

  async triageComplaint(description: string): Promise<{
    category: string
    severity: string
    suggestedInvestigation: string
    priority: number
    requiredExpertise: string[]
  }> {
    const prompt = `Categorize and assess this whistleblowing complaint:

"${description}"

Provide:
1. Category (Harassment/Fraud/Safety/Ethics/Other)
2. Severity (Low/Medium/High/Critical)
3. Suggested investigation approach
4. Priority level (1-5)
5. Required expertise

Return as JSON with fields: category, severity, suggestedInvestigation, priority, requiredExpertise`

    const response = await this.callGroq(prompt)
    try {
      return JSON.parse(response.content)
    } catch (e) {
      console.error("Failed to parse AI response", e)
      return {
        category: "Other",
        severity: "Medium",
        suggestedInvestigation: "Manual Review Required",
        priority: 3,
        requiredExpertise: ["Compliance"]
      }
    }
  }

  async detectFraudPatterns(transactions: any[]) {
    const prompt = `Analyze these transactions for fraud patterns:

${JSON.stringify(transactions)}

Identify:
1. Unusual patterns
2. Potential fraud indicators
3. Risk scores
4. Recommended actions

Return structured analysis.`

    return this.callGemini(prompt)
  }

  private async callGroq(prompt: string): Promise<z.infer<typeof AIResponseSchema>> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens,
    }
  }

  private async callGemini(prompt: string): Promise<z.infer<typeof AIResponseSchema>> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4000,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      content: data.candidates[0].content.parts[0].text,
    }
  }
}

export const aiService = new AIService()
