import { GoogleGenAI, Type } from "@google/genai";
import { SimulationResult, UserStory, ElevatorPitchInput, TeamInfo, Language, InnovationReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateFullReport(
  language: Language,
  teamInfo: TeamInfo,
  userStory: UserStory,
  elevatorPitch: ElevatorPitchInput,
  simulationResult: SimulationResult
): Promise<InnovationReport> {
  const model = "gemini-3.1-pro-preview";

  const prompt = `
    You are a senior executive consultant. Based on all previously entered user inputs and AI-generated outputs, generate a complete Business Model Innovation Report suitable for executive review and investor presentation.

    LANGUAGE: ${language}
    TEAM INFO: ${JSON.stringify(teamInfo)}
    USER STORY: ${JSON.stringify(userStory)}
    ELEVATOR PITCH: ${JSON.stringify(elevatorPitch)}
    SIMULATION RESULT: ${JSON.stringify(simulationResult)}

    The document must be internally consistent, financially realistic, culturally aligned with the selected country, and professionally structured.
    Return the response strictly in JSON format matching the provided schema.
    All text must be in ${language}.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      executiveOverview: {
        type: Type.OBJECT,
        properties: {
          pitch: { type: Type.STRING },
          vision: { type: Type.STRING },
          thesis: { type: Type.STRING },
        },
        required: ["pitch", "vision", "thesis"]
      },
      problemAnalysis: {
        type: Type.OBJECT,
        properties: {
          painPoints: { type: Type.STRING },
          gapAnalysis: { type: Type.STRING },
          opportunityContext: { type: Type.STRING },
        },
        required: ["painPoints", "gapAnalysis", "opportunityContext"]
      },
      businessModelDesign: {
        type: Type.OBJECT,
        properties: {
          bmcSummary: { type: Type.STRING },
          valueCreation: { type: Type.STRING },
          positioning: { type: Type.STRING },
        },
        required: ["bmcSummary", "valueCreation", "positioning"]
      },
      financialSustainability: {
        type: Type.OBJECT,
        properties: {
          ltvCocaAnalysis: { type: Type.STRING },
          projectionsSummary: { type: Type.STRING },
          riskSensitivity: { type: Type.STRING },
        },
        required: ["ltvCocaAnalysis", "projectionsSummary", "riskSensitivity"]
      },
      strategicRisk: {
        type: Type.OBJECT,
        properties: {
          market: { type: Type.STRING },
          regulatory: { type: Type.STRING },
          operational: { type: Type.STRING },
          competitive: { type: Type.STRING },
        },
        required: ["market", "regulatory", "operational", "competitive"]
      },
      growthStrategy: {
        type: Type.OBJECT,
        properties: {
          domesticPath: { type: Type.STRING },
          internationalPotential: { type: Type.STRING },
          partnerships: { type: Type.STRING },
        },
        required: ["domesticPath", "internationalPotential", "partnerships"]
      },
      scorecard: {
        type: Type.OBJECT,
        properties: {
          sustainability: { type: Type.NUMBER },
          scalability: { type: Type.NUMBER },
          innovation: { type: Type.NUMBER },
        },
        required: ["sustainability", "scalability", "innovation"]
      }
    }
  };

  const result = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema as any,
    },
  });

  return JSON.parse(result.text);
}

export async function generateSimulation(
  language: Language,
  teamInfo: TeamInfo,
  userStory: UserStory,
  elevatorPitch: ElevatorPitchInput
): Promise<SimulationResult> {
  const model = "gemini-3.1-pro-preview";

  const prompt = `
    You are an expert business consultant and financial analyst. 
    Generate a complete business model simulation based on the following inputs:
    
    LANGUAGE: ${language}
    TEAM INFO: ${JSON.stringify(teamInfo)}
    USER STORY: ${JSON.stringify(userStory)}
    ELEVATOR PITCH: ${JSON.stringify(elevatorPitch)}

    REQUIREMENTS:
    1. Generate a complete Business Model Canvas (9 blocks).
    2. Explain Value Creation Logic (Create, Deliver, Capture).
    3. Calculate LTV (Customer Lifetime Value) with realistic assumptions.
    4. Define and calculate COCA (Customer Acquisition Cost).
    5. Calculate LTV/COCA Ratio and interpret it.
    6. Generate a 5-year financial projection (Cash Flow, Payback, ROI, NPV).
    7. Synthesize an Investor Pitch and Executive Summary.
    8. Provide gamification scores (Sustainability, Risk, Scalability, AI Feedback).

    All text must be in ${language}.
    Ensure financial realism and alignment with the selected country/city context.
    Return the response strictly in JSON format.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      bmc: {
        type: Type.OBJECT,
        properties: {
          customerSegments: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          channels: { type: Type.STRING },
          customerRelationships: { type: Type.STRING },
          revenueStreams: { type: Type.STRING },
          keyActivities: { type: Type.STRING },
          keyResources: { type: Type.STRING },
          keyPartners: { type: Type.STRING },
          costStructure: { type: Type.STRING },
        },
        required: ["customerSegments", "valueProposition", "channels", "customerRelationships", "revenueStreams", "keyActivities", "keyResources", "keyPartners", "costStructure"]
      },
      valueCreation: {
        type: Type.OBJECT,
        properties: {
          create: { type: Type.STRING },
          deliver: { type: Type.STRING },
          capture: { type: Type.STRING },
        },
        required: ["create", "deliver", "capture"]
      },
      ltv: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          arpu: { type: Type.NUMBER },
          margin: { type: Type.NUMBER },
          lifetime: { type: Type.NUMBER },
          calculation: { type: Type.STRING },
          total: { type: Type.NUMBER },
        },
        required: ["explanation", "arpu", "margin", "lifetime", "calculation", "total"]
      },
      coca: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING },
          assumptions: { type: Type.STRING },
          cost: { type: Type.NUMBER },
        },
        required: ["definition", "assumptions", "cost"]
      },
      ltvCocaRatio: { type: Type.NUMBER },
      financials: {
        type: Type.OBJECT,
        properties: {
          assumptions: {
            type: Type.OBJECT,
            properties: {
              firstYearUsers: { type: Type.NUMBER },
              growthRate: { type: Type.NUMBER },
              arpu: { type: Type.NUMBER },
              coca: { type: Type.NUMBER },
              churnRate: { type: Type.NUMBER },
              infraCost: { type: Type.NUMBER },
              marketingGrowth: { type: Type.NUMBER },
              supportCost: { type: Type.NUMBER },
              opCosts: { type: Type.NUMBER },
              discountRate: { type: Type.NUMBER },
              taxRate: { type: Type.NUMBER },
            }
          },
          table: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.NUMBER },
                revenue: { type: Type.NUMBER },
                costs: { type: Type.NUMBER },
                cashFlow: { type: Type.NUMBER },
              }
            }
          },
          paybackPeriod: { type: Type.NUMBER },
          roi: { type: Type.NUMBER },
          npv: { type: Type.NUMBER },
          risks: {
            type: Type.OBJECT,
            properties: {
              market: { type: Type.STRING },
              regulatory: { type: Type.STRING },
              competitive: { type: Type.STRING },
              sensitivity: { type: Type.STRING },
            }
          }
        },
        required: ["assumptions", "table", "paybackPeriod", "roi", "npv", "risks"]
      },
      investorOutput: {
        type: Type.OBJECT,
        properties: {
          polishedPitch: { type: Type.STRING },
          summary: {
            type: Type.OBJECT,
            properties: {
              problem: { type: Type.STRING },
              solution: { type: Type.STRING },
              market: { type: Type.STRING },
              businessModel: { type: Type.STRING },
              viability: { type: Type.STRING },
              advantage: { type: Type.STRING },
              impact: { type: Type.STRING },
            }
          }
        },
        required: ["polishedPitch", "summary"]
      },
      gamification: {
        type: Type.OBJECT,
        properties: {
          sustainabilityScore: { type: Type.NUMBER },
          riskLevel: { type: Type.NUMBER },
          scalabilityIndex: { type: Type.NUMBER },
          aiFeedback: { type: Type.STRING },
          aiScore: { type: Type.NUMBER },
        },
        required: ["sustainabilityScore", "riskLevel", "scalabilityIndex", "aiFeedback", "aiScore"]
      }
    }
  };

  const result = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema as any,
    },
  });

  return JSON.parse(result.text);
}
