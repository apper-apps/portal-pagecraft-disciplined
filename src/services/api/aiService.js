import generatedDescriptionsData from "@/services/mockData/generatedDescriptions.json";
import React from "react";
import Error from "@/components/ui/Error";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AIService {
  constructor() {
    this.generatedDescriptions = [...generatedDescriptionsData];
    this.generationInProgress = new Set();
  }

async generateDescription({ productName, features, tone, templateId = null, variations = 1 }) {
    // Prevent duplicate generations for the same product
    const generationKey = `${productName}-${Date.now()}`;
    
    if (this.generationInProgress.has(productName)) {
      throw new Error("Generation already in progress for this product");
    }

    this.generationInProgress.add(productName);
    
    try {
      // Simulate AI processing time
      await delay(variations > 1 ? 3000 : 2000);
      
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
      const featuresList = Array.isArray(features) ? features : features.split(",").map(f => f.trim());
      
      // Generate multiple variations if requested
      if (variations > 1) {
        const generatedVariations = [];
        
        for (let i = 0; i < variations; i++) {
          const randomPhrase = style.phrases[Math.floor(Math.random() * style.phrases.length)];
          let generatedContent = "";
          
          switch (tone) {
            case "Professional":
              const professionalVariations = [
                `${productName} ${randomPhrase} with its innovative design and superior functionality. This premium product features ${featuresList.join(", ")}, ensuring optimal performance and reliability. Engineered for professionals who demand excellence, it delivers consistent results while maintaining the highest standards of quality and durability.`,
                `Discover ${productName}, where ${randomPhrase} meets cutting-edge innovation. Featuring ${featuresList.join(", ")}, this solution provides unmatched reliability and performance. Built for demanding professional environments, it sets new benchmarks in quality and operational excellence.`,
                `${productName} represents the pinnacle of ${randomPhrase} in modern design. With integrated ${featuresList.join(", ")}, it delivers superior functionality and dependability. Crafted for professionals who accept nothing less than perfection, ensuring consistent, high-quality results every time.`
              ];
              generatedContent = professionalVariations[i % professionalVariations.length];
              break;
              
            case "Casual":
              const casualVariations = [
                `Meet your new favorite ${productName}! This amazing product ${randomPhrase} with features like ${featuresList.join(", ")}. Whether you're at home, work, or on-the-go, it's designed to make your life easier and more enjoyable. You'll wonder how you ever lived without it!`,
                `Say hello to ${productName} - it's exactly what ${randomPhrase} in your daily routine! Packed with ${featuresList.join(", ")}, this gem fits seamlessly into your lifestyle. From morning to night, it's there to make everything smoother and more fun!`,
                `Get ready to fall in love with ${productName}! This fantastic creation ${randomPhrase} thanks to its ${featuresList.join(", ")}. It's like having a helpful friend that makes every day a little brighter and a lot more convenient!`
              ];
              generatedContent = casualVariations[i % casualVariations.length];
              break;
              
            case "Luxury":
              const luxuryVariations = [
                `Experience the ${randomPhrase} of ${productName}. This exclusive piece showcases ${featuresList.join(", ")}, representing the pinnacle of sophisticated design and premium craftsmanship. Reserved for those who appreciate the finer things in life, it transforms everyday moments into extraordinary experiences.`,
                `Indulge in the ${randomPhrase} that defines ${productName}. Meticulously crafted with ${featuresList.join(", ")}, this masterpiece epitomizes luxury and refinement. An acquisition for the discerning individual who values extraordinary quality and timeless elegance.`,
                `Embrace the ${randomPhrase} embodied in ${productName}. Featuring ${featuresList.join(", ")}, this distinguished creation represents the apex of luxury craftsmanship. Designed for those who demand nothing but the finest, it elevates every interaction to an art form.`
              ];
              generatedContent = luxuryVariations[i % luxuryVariations.length];
              break;
              
            default:
              generatedContent = `${productName} combines quality and innovation with features including ${featuresList.join(", ")}. Designed to meet your needs with reliability and style.`;
          }

          // Create description record for each variation
// Generate SEO metadata for this variation
          const seoMetadata = await this.generateSEOMetadata(productName, featuresList, tone, generatedContent);
          
          // Create description record for each variation
          const maxId = Math.max(...this.generatedDescriptions.map(d => d.Id), 0);
          const newDescription = {
            Id: maxId + 1 + i,
            productId: `${generationKey}-v${i + 1}`,
            content: generatedContent,
            tone: tone,
            features: featuresList,
            wordCount: generatedContent.split(" ").length,
            createdAt: new Date().toISOString(),
            variation: i + 1,
            seo: seoMetadata
          };

this.generatedDescriptions.push(newDescription);
          generatedVariations.push(newDescription);
        }
        
        return {
          variations: generatedVariations,
          generationTime: 3000,
          confidence: 0.95,
          suggestions: [
            "Consider adding emotional benefits",
            "Include specific use cases",
            "Mention warranty or guarantee"
          ]
        };
      }
      
      // Single variation (original behavior)
      const randomPhrase = style.phrases[Math.floor(Math.random() * style.phrases.length)];
      let generatedContent = "";
      
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
// Generate SEO metadata
      const seoMetadata = await this.generateSEOMetadata(productName, featuresList, tone, generatedContent);
      
      // Create new generated description record
      const maxId = Math.max(...this.generatedDescriptions.map(d => d.Id), 0);
      const newDescription = {
        Id: maxId + 1,
        productId: generationKey,
        content: generatedContent,
        tone: tone,
        features: featuresList,
wordCount: generatedContent.split(" ").length,
        createdAt: new Date().toISOString(),
        seo: seoMetadata
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
    const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
    
    // Enhanced quality scoring
    const readabilityScore = this.calculateReadabilityScore(content, wordCount, sentences, avgWordsPerSentence);
    const seoScore = this.calculateSEOScore(content, wordCount);
    const conversionScore = this.calculateConversionScore(content);
    
    const overallQuality = Math.round((readabilityScore + seoScore + conversionScore) / 3);
    
    return {
      wordCount,
      characterCount,
      sentenceCount: sentences,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      qualityScores: {
        readability: readabilityScore,
        seo: seoScore,
        conversion: conversionScore,
        overall: overallQuality
      },
      suggestions: this.generateQualitySuggestions(content, wordCount, sentences, readabilityScore, seoScore, conversionScore)
    };
  }

  calculateReadabilityScore(content, wordCount, sentences, avgWordsPerSentence) {
    let score = 85; // Base score
    
    // Penalize very long or very short content
    if (wordCount < 30) score -= 15;
    else if (wordCount > 200) score -= 10;
    
    // Penalize long sentences
    if (avgWordsPerSentence > 25) score -= 15;
    else if (avgWordsPerSentence > 20) score -= 8;
    
    // Reward good sentence variety
    if (sentences >= 3 && sentences <= 8) score += 5;
    
    // Check for complex words (simple heuristic)
    const complexWords = content.match(/\b\w{10,}\b/g) || [];
    if (complexWords.length / wordCount > 0.15) score -= 10;
    
    return Math.max(0, Math.min(100, score + Math.floor(Math.random() * 10) - 5));
  }

  calculateSEOScore(content, wordCount) {
    let score = 75; // Base score
    
    // Check for keyword density and variety
    const words = content.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const keywordDensity = uniqueWords.size / wordCount;
    
    if (keywordDensity > 0.7) score += 15;
    else if (keywordDensity > 0.5) score += 8;
    
    // Reward optimal length
    if (wordCount >= 50 && wordCount <= 150) score += 10;
    
    // Check for action words and benefits
    const actionWords = ['enhance', 'improve', 'deliver', 'provide', 'ensure', 'achieve'];
    const actionWordCount = actionWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    if (actionWordCount >= 2) score += 5;
    
    return Math.max(0, Math.min(100, score + Math.floor(Math.random() * 15) - 7));
  }

  calculateConversionScore(content) {
    let score = 70; // Base score
    
    // Check for persuasive elements
    const persuasiveWords = ['premium', 'exclusive', 'limited', 'guarantee', 'proven', 'innovative', 'award-winning'];
    const benefitWords = ['save', 'improve', 'enhance', 'boost', 'increase', 'reduce', 'perfect'];
    const urgencyWords = ['now', 'today', 'immediately', 'instant', 'quick', 'fast'];
    
    const persuasiveCount = persuasiveWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    const benefitCount = benefitWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    const urgencyCount = urgencyWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    // Reward persuasive language
    score += persuasiveCount * 3;
    score += benefitCount * 4;
    score += urgencyCount * 2;
    
    // Check for social proof indicators
    if (content.match(/\b(customers?|users?|people)\b.*\b(love|trust|choose|prefer)\b/i)) {
      score += 8;
    }
    
    // Reward clear value proposition
    if (content.match(/\b(because|since|so that|to help|designed to)\b/i)) {
      score += 5;
    }
    
    return Math.max(0, Math.min(100, score + Math.floor(Math.random() * 10) - 5));
  }

  generateQualitySuggestions(content, wordCount, sentences, readabilityScore, seoScore, conversionScore) {
    const suggestions = [];
    
    // Readability suggestions
    if (readabilityScore < 70) {
      if (wordCount < 30) {
        suggestions.push("Add more detail to improve content depth and readability");
      }
      if (sentences < 3) {
        suggestions.push("Break content into more sentences for better flow");
      }
      const avgWordsPerSentence = wordCount / sentences;
      if (avgWordsPerSentence > 20) {
        suggestions.push("Shorten sentences to improve readability (aim for 15-20 words per sentence)");
      }
    }
    
    // SEO suggestions
    if (seoScore < 75) {
      suggestions.push("Include more relevant keywords naturally throughout the description");
      if (wordCount < 50) {
        suggestions.push("Expand content to 50-150 words for better SEO value");
      }
      suggestions.push("Add specific product benefits and features for better search visibility");
    }
    
    // Conversion suggestions
    if (conversionScore < 75) {
      suggestions.push("Add persuasive words like 'premium', 'exclusive', or 'proven' to increase appeal");
      suggestions.push("Include clear benefits that show value to the customer");
      suggestions.push("Consider adding urgency or scarcity elements");
      if (!content.match(/\b(because|since|so that|to help|designed to)\b/i)) {
        suggestions.push("Explain why customers should choose this product");
      }
    }
    
    // Overall quality suggestions
    if (Math.min(readabilityScore, seoScore, conversionScore) < 60) {
      suggestions.push("Consider regenerating with focus on the lowest-scoring quality dimension");
    }
    
    return suggestions;
  }

  async generateSEOMetadata(productName, features, tone, description) {
    await delay(200);
    
    const featuresList = Array.isArray(features) ? features : features.split(",").map(f => f.trim());
    
    // Generate meta title (50-60 characters optimal)
    let metaTitle = "";
    switch (tone) {
      case "Professional":
        metaTitle = `${productName} - Professional ${featuresList[0] || 'Solution'}`;
        break;
      case "Casual":
        metaTitle = `${productName} - Perfect for ${featuresList[0] || 'Everyday Use'}`;
        break;
      case "Luxury":
        metaTitle = `${productName} - Premium ${featuresList[0] || 'Excellence'}`;
        break;
      default:
        metaTitle = `${productName} - Quality ${featuresList[0] || 'Product'}`;
    }
    
    // Truncate if too long
    if (metaTitle.length > 60) {
      metaTitle = metaTitle.substring(0, 57) + "...";
    }
    
    // Generate meta description (150-160 characters optimal)
    const firstSentence = description.split(/[.!?]/)[0];
    let metaDescription = firstSentence;
    
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + "...";
    } else if (metaDescription.length < 120) {
      // Add more context if too short
      const additionalInfo = ` Features ${featuresList.slice(0, 2).join(", ")}.`;
      if ((metaDescription + additionalInfo).length <= 160) {
        metaDescription += additionalInfo;
      }
    }
    
    // Generate suggested keywords
    const baseKeywords = [productName.toLowerCase()];
    const featureKeywords = featuresList.map(f => f.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim());
    const toneKeywords = {
      "Professional": ["professional", "business", "commercial"],
      "Casual": ["everyday", "home", "personal"],
      "Luxury": ["premium", "luxury", "high-end"]
    };
    
    const suggestedKeywords = [
      ...baseKeywords,
      ...featureKeywords.slice(0, 3),
      ...(toneKeywords[tone] || ["quality", "reliable"]).slice(0, 2)
    ].filter(Boolean).join(", ");
    
    return {
      metaTitle,
      metaDescription,
      suggestedKeywords
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