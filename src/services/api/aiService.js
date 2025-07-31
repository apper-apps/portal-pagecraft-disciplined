import generatedDescriptionsData from "@/services/mockData/generatedDescriptions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AIService {
  constructor() {
    this.generatedDescriptions = [...generatedDescriptionsData];
    this.generationInProgress = new Set();
  }

  async generateDescription({ productName, features, tone, templateId = null }) {
    // Prevent duplicate generations for the same product
    const generationKey = `${productName}-${Date.now()}`;
    
    if (this.generationInProgress.has(productName)) {
      throw new Error("Generation already in progress for this product");
    }

    this.generationInProgress.add(productName);
    
    try {
      // Simulate AI processing time
      await delay(2000);
      
      const toneStyles = {
        "Professional": {
          phrases: ["deliver exceptional", "advanced technology", "professional-grade", "industry-leading", "optimal performance"],
          structure: "technical and benefit-focused"
        },
        "Casual": {
          phrases: ["you'll love", "perfect for everyday", "makes life easier", "great for", "enjoy the convenience"],
          structure: "conversational and lifestyle-focused"
        },
        "Luxury": {
          phrases: ["exquisite craftsmanship", "sophisticated design", "exclusive experience", "premium materials", "unparalleled quality"],
          structure: "elegant and exclusive"
        }
      };

      const style = toneStyles[tone] || toneStyles["Professional"];
      const randomPhrase = style.phrases[Math.floor(Math.random() * style.phrases.length)];
      
      // Generate description based on tone
      let generatedContent = "";
      const featuresList = Array.isArray(features) ? features : features.split(",").map(f => f.trim());
      
      switch (tone) {
        case "Professional":
          generatedContent = `${productName} ${randomPhrase} with its innovative design and superior functionality. This premium product features ${featuresList.join(", ")}, ensuring optimal performance and reliability. Engineered for professionals who demand excellence, it delivers consistent results while maintaining the highest standards of quality and durability.`;
          break;
          
        case "Casual":
          generatedContent = `Meet your new favorite ${productName}! This amazing product ${randomPhrase} with features like ${featuresList.join(", ")}. Whether you're at home, work, or on-the-go, it's designed to make your life easier and more enjoyable. You'll wonder how you ever lived without it!`;
          break;
          
        case "Luxury":
          generatedContent = `Experience the ${randomPhrase} of ${productName}. This exclusive piece showcases ${featuresList.join(", ")}, representing the pinnacle of sophisticated design and premium craftsmanship. Reserved for those who appreciate the finer things in life, it transforms everyday moments into extraordinary experiences.`;
          break;
          
        default:
          generatedContent = `${productName} combines quality and innovation with features including ${featuresList.join(", ")}. Designed to meet your needs with reliability and style.`;
      }

      // Create new generated description record
      const maxId = Math.max(...this.generatedDescriptions.map(d => d.Id), 0);
      const newDescription = {
        Id: maxId + 1,
        productId: generationKey,
        content: generatedContent,
        tone: tone,
        features: featuresList,
        wordCount: generatedContent.split(" ").length,
        createdAt: new Date().toISOString()
      };

      this.generatedDescriptions.push(newDescription);
      
      return {
        ...newDescription,
        generationTime: 2000,
        confidence: 0.95,
        suggestions: [
          "Consider adding emotional benefits",
          "Include specific use cases",
          "Mention warranty or guarantee"
        ]
      };
      
    } finally {
      this.generationInProgress.delete(productName);
    }
  }

  async regenerateDescription(previousDescriptionId, options = {}) {
    await delay(1800);
    
    const previous = this.generatedDescriptions.find(d => d.Id === parseInt(previousDescriptionId));
    if (!previous) {
      throw new Error("Previous description not found");
    }

    // Generate a variation
    return this.generateDescription({
      productName: options.productName || "Product",
      features: previous.features,
      tone: options.tone || previous.tone
    });
  }

  async getGenerationHistory(productId) {
    await delay(200);
    return this.generatedDescriptions
      .filter(d => d.productId === productId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async analyzeDescription(content) {
    await delay(500);
    
    const wordCount = content.split(" ").length;
    const characterCount = content.length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    return {
      wordCount,
      characterCount,
      sentenceCount: sentences,
      readabilityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      seoScore: Math.floor(Math.random() * 30) + 70, // 70-100
      suggestions: [
        wordCount < 50 ? "Consider adding more detail" : null,
        wordCount > 150 ? "Consider shortening for better readability" : null,
        sentences < 3 ? "Add more sentences for better flow" : null
      ].filter(Boolean)
    };
  }

  isGenerating(productName) {
    return this.generationInProgress.has(productName);
  }

  cancelGeneration(productName) {
    this.generationInProgress.delete(productName);
  }
}

export default new AIService();