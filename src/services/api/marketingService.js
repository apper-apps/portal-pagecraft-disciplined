// Mock data for marketing campaigns
const mockCampaigns = [
  {
    Id: 1,
    title: "Summer Sale Extravaganza",
    type: "Sale",
    discountPercentage: "30",
    targetAudience: "Fashion-forward millennials and Gen Z",
    description: "Major summer clearance event",
    status: "Published",
    createdAt: "2024-01-15T10:00:00Z",
    generatedContent: {
      headlines: [
        "🌞 Summer Sale: Up to 30% OFF Everything!",
        "Beat the Heat with Hot Summer Deals",
        "Your Summer Wardrobe Awaits - 30% OFF"
      ],
      bodyText: "Transform your summer style with our biggest sale of the season! Discover trending pieces perfect for beach days, festival nights, and everything in between. From breezy dresses to statement accessories, find everything you need to make this summer unforgettable. Limited time offer - don't let these deals slip away like summer sunsets!",
      ctaButtons: [
        "Shop Summer Sale Now",
        "Get 30% OFF Today",
        "Discover Summer Trends",
        "Start Shopping"
      ]
    }
  },
  {
    Id: 2,
    title: "New Autumn Collection Launch",
    type: "New Collection",
    discountPercentage: "",
    targetAudience: "Professional women aged 25-40",
    description: "Sophisticated autumn pieces for working professionals",
    status: "Draft",
    createdAt: "2024-01-20T14:30:00Z",
    generatedContent: {
      headlines: [
        "Introducing Our New Autumn Collection",
        "Fall into Style: New Arrivals Are Here",
        "Autumn Elegance: Discover Your New Favorites"
      ],
      bodyText: "Step into autumn with confidence wearing our latest collection designed for the modern professional woman. Featuring rich textures, sophisticated silhouettes, and versatile pieces that transition seamlessly from boardroom to evening events. Each piece is crafted with attention to detail and quality that speaks to your refined taste.",
      ctaButtons: [
        "Explore New Collection",
        "Shop Autumn Styles",
        "View Latest Arrivals",
        "Find Your Style"
      ]
    }
  }
];

let nextId = 3;

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock content generation responses
const contentTemplates = {
  Sale: {
    headlines: [
      "🔥 Limited Time: {discount}% OFF Everything!",
      "Massive {discount}% Sale - Don't Miss Out!",
      "Your Favorite Items Are Now {discount}% OFF",
      "Flash Sale Alert: {discount}% OFF Sitewide!"
    ],
    bodyTemplates: [
      "Don't miss out on our incredible {discount}% off sale! Perfect for {audience}, this limited-time offer includes everything you love. From trending pieces to timeless classics, now is the perfect time to refresh your collection. Hurry - these amazing deals won't last long!",
      "Transform your style with our biggest sale event! Enjoy {discount}% off everything and discover why {audience} love shopping with us. Whether you're looking for that perfect statement piece or everyday essentials, we've got you covered at unbeatable prices."
    ],
    ctaButtons: [
      "Shop {discount}% OFF Sale",
      "Get Your Discount Now",
      "Start Shopping Sale",
      "Claim {discount}% OFF",
      "Don't Miss Out - Shop Now"
    ]
  },
  "New Collection": {
    headlines: [
      "Introducing Our Latest Collection",
      "New Arrivals: Fresh Styles Just Dropped",
      "Discover What's New This Season",
      "Your New Favorites Have Arrived"
    ],
    bodyTemplates: [
      "Discover our carefully curated new collection designed specifically for {audience}. Each piece reflects the latest trends while maintaining the quality and style you expect. From versatile basics to statement pieces, find everything you need to elevate your wardrobe this season.",
      "Step into the new season with confidence wearing our latest collection. Thoughtfully designed for {audience}, these fresh arrivals combine contemporary style with timeless appeal. Explore unique pieces that will become your new go-to favorites."
    ],
    ctaButtons: [
      "Explore New Collection",
      "Shop Latest Arrivals",
      "Discover New Styles",
      "View Collection",
      "Find Your New Favorite"
    ]
  },
  Seasonal: {
    headlines: [
      "Seasonal Must-Haves Are Here",
      "Embrace the Season in Style",
      "Seasonal Favorites You'll Love",
      "Perfect Pieces for the Season"
    ],
    bodyTemplates: [
      "Embrace the season with our specially curated seasonal collection perfect for {audience}. Whether you're looking for cozy comfort or seasonal statement pieces, we have everything you need to make the most of the season ahead. Quality meets style in every carefully selected piece.",
      "Make this season memorable with our handpicked seasonal favorites designed for {audience}. From seasonal essentials to special occasion pieces, discover items that capture the spirit of the season while keeping you stylish and comfortable."
    ],
    ctaButtons: [
      "Shop Seasonal Collection",
      "Explore Season Styles",
      "Get Season Ready",
      "Discover Seasonal Picks",
      "Shop Now"
    ]
  }
};

export const marketingService = {
  // Get all campaigns
  async getAll() {
    await delay(300);
    return [...mockCampaigns];
  },

  // Get campaign by ID
  async getById(id) {
    await delay(200);
    const campaign = mockCampaigns.find(c => c.Id === parseInt(id));
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return { ...campaign };
  },

  // Create new campaign
  async create(campaignData) {
    await delay(800); // Simulate content generation time
    
    const newCampaign = {
      Id: nextId++,
      ...campaignData,
      createdAt: new Date().toISOString(),
      status: campaignData.status || 'Draft'
    };
    
    mockCampaigns.push(newCampaign);
    return { ...newCampaign };
  },

  // Update campaign
  async update(id, campaignData) {
    await delay(500);
    
    const index = mockCampaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      ...campaignData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockCampaigns[index] };
  },

  // Delete campaign
  async delete(id) {
    await delay(300);
    
    const index = mockCampaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    
    mockCampaigns.splice(index, 1);
    return true;
  },

  // Generate marketing content
  async generateContent(campaignData) {
    await delay(1500); // Simulate AI generation time
    
    const { type, discountPercentage, targetAudience } = campaignData;
    const template = contentTemplates[type];
    
    if (!template) {
      throw new Error('Invalid campaign type');
    }

    // Generate headlines
    const headlines = template.headlines.map(headline => 
      headline
        .replace('{discount}', discountPercentage || 'Special')
        .replace(/🔥|⚡|🌞/g, discountPercentage ? '🔥' : '✨')
    ).slice(0, 3);

    // Generate body text
    const bodyTemplate = template.bodyTemplates[Math.floor(Math.random() * template.bodyTemplates.length)];
    const bodyText = bodyTemplate
      .replace('{discount}', discountPercentage || 'special')
      .replace('{audience}', targetAudience.toLowerCase());

    // Generate CTA buttons
    const ctaButtons = template.ctaButtons.map(cta => 
      cta.replace('{discount}', discountPercentage || 'Special')
    ).slice(0, 4);

    return {
      headlines,
      bodyText,
      ctaButtons,
      generatedAt: new Date().toISOString()
    };
  }
};