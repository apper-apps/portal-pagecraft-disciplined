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
    landing: {
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
    email: {
      subjectLines: [
        "🔥 {discount}% OFF Everything - Limited Time!",
        "Last Chance: {discount}% OFF Sale Ends Soon",
        "Your {discount}% Discount Is Waiting",
        "Don't Miss Out: {discount}% OFF Sitewide",
        "Flash Sale Alert: {discount}% OFF Inside!"
      ],
      bodyTemplates: [
        "Hi there!\n\nWe're excited to offer you an exclusive {discount}% discount on everything! This incredible sale is perfect for {audience} who want to refresh their style without breaking the bank.\n\n✨ What's included:\n• All your favorite items\n• Latest arrivals\n• Best-selling pieces\n• Exclusive collections\n\nDon't wait - this amazing offer won't last long!\n\nShop now and save big!\n\nBest regards,\nThe Team"
      ]
    },
    instagram: {
      captions: [
        "🔥 FLASH SALE ALERT! 🔥\n\nEverything is {discount}% OFF right now! Perfect timing for {audience} to grab those wishlist items you've been eyeing. 👀\n\nFrom statement pieces to everyday essentials - it's all on sale! But hurry, this incredible deal won't last long ⏰\n\nTap the link in bio to shop now! 🛍️\n\n#Sale #Fashion #Shopping #Style #Discount #FlashSale #Trending",
        "✨ MAJOR SALE HAPPENING NOW ✨\n\n{discount}% off EVERYTHING! Yes, you read that right - EVERYTHING! 🙌\n\nCalling all {audience} - this is your chance to score big on all your favorites:\n🛍️ Trending pieces\n🛍️ Timeless classics  \n🛍️ New arrivals\n🛍️ Best sellers\n\nLink in bio - go go go! 💨\n\n#BigSale #ShopNow #Fashion #Savings #Deal #Style"
      ]
    },
    facebook: {
      adCopy: [
        "🔥 MASSIVE {discount}% OFF SALE - LIMITED TIME ONLY! 🔥\n\nAttention {audience}! Your favorite fashion destination is having its biggest sale of the season. Everything you love is now {discount}% off!\n\n✅ All categories included\n✅ No code needed\n✅ Free shipping on all orders\n✅ Limited time only\n\nFrom trending pieces to timeless classics, now is the perfect time to refresh your wardrobe without breaking the bank.\n\nDon't miss out - these deals won't last long!\n\n👆 Shop now with the link above!",
        "🛍️ EXCLUSIVE {discount}% OFF SALE FOR YOU!\n\nHey {audience}! We know you've been waiting for the perfect time to shop, and that time is NOW!\n\nEverything in our store is {discount}% off:\n• Latest arrivals ✨\n• Best-selling favorites 💖\n• Statement pieces 👗\n• Everyday essentials 👕\n\nThis incredible offer is only available for a limited time, so don't wait!\n\nClick above to start shopping and saving! 🛒"
      ]
    },
    twitter: {
      posts: [
        "🔥 FLASH SALE: {discount}% OFF everything! Perfect for {audience} looking to refresh their style. Limited time only! #Sale #Fashion #Shopping",
        "⚡ {discount}% OFF SITEWIDE! Your favorite pieces are waiting. Don't miss out, {audience}! Shop now 🛍️ #FlashSale #Discount",
        "🛍️ MAJOR SALE ALERT! Everything is {discount}% off right now. {audience}, this is your moment! ✨ #BigSale #SaveBig"
      ]
    }
  },
  "New Collection": {
    landing: {
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
    email: {
      subjectLines: [
        "✨ New Collection Just Dropped!",
        "Fresh Styles Are Here - See What's New",
        "Your New Favorites Have Arrived",
        "Introducing Our Latest Collection",
        "New Season, New Styles - Shop Now!"
      ],
      bodyTemplates: [
        "Hello!\n\nWe're thrilled to introduce our brand new collection, specially curated for {audience} like you!\n\n🌟 What's new:\n• Fresh seasonal styles\n• Trending pieces\n• Versatile basics\n• Statement items\n\nEach piece has been carefully selected to bring you the perfect blend of contemporary style and timeless appeal.\n\nBe among the first to discover your new favorites!\n\nHappy shopping!\nThe Team"
      ]
    },
    instagram: {
      captions: [
        "✨ NEW COLLECTION ALERT ✨\n\nFresh styles just dropped and we can't contain our excitement! 🙌 This collection was designed with {audience} in mind - every piece tells a story.\n\nFrom versatile basics to statement pieces that'll turn heads 👀 We've got everything you need to elevate your wardrobe this season.\n\nSwipe to see our favorites ➡️ and tell us which piece speaks to you! 💬\n\nShop the full collection via link in bio 🛍️\n\n#NewCollection #FashionDrop #NewArrivals #Style #Fashion #Shopping #Trending",
        "🆕 COLLECTION DROP 🆕\n\nSay hello to your new wardrobe favorites! These fresh arrivals are everything we've been dreaming of ✨\n\nPerfect for {audience} who appreciate:\n🌟 Quality craftsmanship\n🌟 Contemporary design  \n🌟 Versatile pieces\n🌟 Timeless appeal\n\nWhich piece is calling your name? Let us know below! 👇\n\nLink in bio to shop now 🛒\n\n#NewDrop #Fashion #Style #NewArrivals"
      ]
    },
    facebook: {
      adCopy: [
        "✨ INTRODUCING OUR NEWEST COLLECTION ✨\n\nExciting news for {audience}! Our latest collection has just arrived, and it's everything you've been waiting for.\n\nThis carefully curated selection features:\n🌟 Fresh seasonal styles\n🌟 Versatile pieces that mix and match\n🌟 Quality materials and craftsmanship\n🌟 Designs that transition from day to night\n\nWhether you're looking for the perfect statement piece or versatile basics to build your wardrobe around, this collection has something special for everyone.\n\nBe among the first to discover your new favorites!\n\n👆 Shop the full collection now!",
        "🛍️ NEW ARRIVALS JUST FOR YOU!\n\nAttention {audience}! We've been working hard behind the scenes to bring you the most stunning new collection, and it's finally here!\n\nEvery piece has been thoughtfully designed to offer:\n• Contemporary style with timeless appeal\n• Versatility for your busy lifestyle  \n• Quality that lasts season after season\n• Designs that make you feel confident\n\nDon't miss out on being among the first to shop these fresh new styles.\n\nClick above to explore the full collection! ✨"
      ]
    },
    twitter: {
      posts: [
        "✨ NEW COLLECTION JUST DROPPED! Fresh styles perfect for {audience}. From basics to statement pieces - shop now! #NewCollection #Fashion",
        "🛍️ Your new wardrobe favorites have arrived! Latest collection designed for {audience} is live now ✨ #NewArrivals #Style",
        "🌟 Collection drop alert! Carefully curated pieces for {audience} who love quality & style. Shop the latest! #FashionDrop #NewStyles"
      ]
    }
  },
  Seasonal: {
    landing: {
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
    },
    email: {
      subjectLines: [
        "🍂 Seasonal Favorites Are Here!",
        "Get Season-Ready with Our Latest Picks",
        "Perfect Pieces for the Season Ahead",
        "Seasonal Must-Haves Just Arrived",
        "Embrace the Season in Style"
      ],
      bodyTemplates: [
        "Hi there!\n\nThe season is changing, and we've got everything you need to embrace it in style! Our seasonal collection has been specially curated for {audience} who appreciate both comfort and style.\n\n🍃 Seasonal highlights:\n• Cozy comfort pieces\n• Seasonal statement items\n• Versatile layering essentials\n• Weather-appropriate styles\n\nWhether you're planning cozy nights in or seasonal celebrations, we've got the perfect pieces to keep you looking and feeling your best.\n\nShop the seasonal collection today!\n\nWarmly,\nThe Team"
      ]
    },
    instagram: {
      captions: [
        "🍂 SEASONAL VIBES LOADING... 🍂\n\nOur seasonal collection is here and we're absolutely obsessed! Perfect for {audience} who want to embrace the season in style ✨\n\nFrom cozy comfort pieces to seasonal statement items, every piece has been handpicked to capture the magic of this beautiful season 🌟\n\nWhat's your seasonal style? Cozy chic or statement glam? Tell us below! 👇\n\nSeason-ready styles in bio 🍁\n\n#SeasonalStyle #FashionSeason #CozyVibes #SeasonalFashion #Trending #Style",
        "✨ SEASON READY ✨\n\nTime to update your wardrobe for the season ahead! Our carefully curated collection has everything {audience} need to look and feel amazing 🙌\n\n🍃 What you'll find:\n• Cozy comfort essentials\n• Seasonal color palettes\n• Layering pieces\n• Statement accessories\n\nWhich seasonal trend are you most excited about? Let us know! 💭\n\nLink in bio to shop 🛍️\n\n#SeasonalCollection #Fashion #SeasonReady"
      ]
    },
    facebook: {
      adCopy: [
        "🍂 SEASONAL COLLECTION IS HERE! 🍂\n\nReady to embrace the new season in style? Our specially curated seasonal collection is perfect for {audience} who want to look amazing while staying comfortable.\n\nThis thoughtfully selected collection includes:\n🍃 Cozy comfort pieces for relaxed days\n🍃 Seasonal statement items for special occasions  \n🍃 Versatile layering essentials\n🍃 Weather-appropriate styles that don't compromise on fashion\n\nWhether you're planning cozy gatherings or seasonal celebrations, we have the perfect pieces to keep you looking stylish and feeling confident throughout the season.\n\nDon't miss out on these seasonal favorites!\n\n👆 Shop the collection now!",
        "🌟 GET SEASON-READY WITH OUR LATEST COLLECTION!\n\nAttention {audience}! The seasons are changing, and your wardrobe should too. Our new seasonal collection brings you the perfect blend of style, comfort, and seasonal flair.\n\nWhat makes this collection special:\n• Handpicked seasonal pieces\n• Quality materials for comfort\n• Versatile styles that work anywhere\n• Colors and patterns that celebrate the season\n\nFrom everyday essentials to special occasion pieces, everything you need for a stylish season is right here.\n\nClick above to explore the full seasonal collection! ✨"
      ]
    },
    twitter: {
      posts: [
        "🍂 Seasonal collection is live! Perfect pieces for {audience} to embrace the season in style. Shop now! #SeasonalStyle #Fashion",
        "✨ Season-ready styles just dropped! Cozy comfort meets seasonal chic for {audience}. Get yours! #SeasonalFashion #CozyStyle",
        "🌟 New seasonal favorites! Curated collection for {audience} who love style & comfort. Perfect timing! #SeasonalCollection #Fashion"
      ]
    }
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

    const replaceVariables = (text) => {
      return text
        .replace(/{discount}/g, discountPercentage || 'Special')
        .replace(/{audience}/g, targetAudience.toLowerCase());
    };

    // Generate landing page content
    const landingHeadlines = template.landing.headlines.map(headline => 
      replaceVariables(headline)
    ).slice(0, 3);

    const landingBodyTemplate = template.landing.bodyTemplates[Math.floor(Math.random() * template.landing.bodyTemplates.length)];
    const landingBodyText = replaceVariables(landingBodyTemplate);

    const landingCtaButtons = template.landing.ctaButtons.map(cta => 
      replaceVariables(cta)
    ).slice(0, 4);

    // Generate email content
    const emailSubjectLines = template.email.subjectLines.map(subject => 
      replaceVariables(subject)
    ).slice(0, 4);

    const emailBodyTemplate = template.email.bodyTemplates[Math.floor(Math.random() * template.email.bodyTemplates.length)];
    const emailBodyText = replaceVariables(emailBodyTemplate);

    // Generate Instagram content
    const instagramCaptions = template.instagram.captions.map(caption => 
      replaceVariables(caption)
    ).slice(0, 3);

    // Generate Facebook content
    const facebookAdCopy = template.facebook.adCopy.map(copy => 
      replaceVariables(copy)
    ).slice(0, 3);

    // Generate Twitter content
    const twitterPosts = template.twitter.posts.map(post => 
      replaceVariables(post)
    ).slice(0, 4);

    return {
      landing: {
        headlines: landingHeadlines,
        bodyText: landingBodyText,
        ctaButtons: landingCtaButtons
      },
      email: {
        subjectLines: emailSubjectLines,
        bodyText: emailBodyText
      },
      instagram: {
        captions: instagramCaptions
      },
      facebook: {
        adCopy: facebookAdCopy
      },
      twitter: {
        posts: twitterPosts
      },
      generatedAt: new Date().toISOString()
    };
  }
};