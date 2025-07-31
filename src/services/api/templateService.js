import templatesData from "@/services/mockData/templates.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TemplateService {
  constructor() {
    this.templates = [...templatesData];
  }

async getAll() {
    await delay(300);
    return [...this.templates];
  }

  async getById(id) {
    await delay(200);
    const template = this.templates.find(t => t.Id === parseInt(id));
    if (!template) {
      throw new Error(`Template with Id ${id} not found`);
    }
    return { ...template };
  }

async create(templateData) {
    await delay(400);
    const maxId = Math.max(...this.templates.map(t => t.Id), 0);
    const newTemplate = {
      Id: maxId + 1,
      ...templateData,
      createdAt: new Date().toISOString()
    };
    
    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async update(id, templateData) {
    await delay(400);
    const index = this.templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Template with Id ${id} not found`);
    }
    
    this.templates[index] = {
      ...this.templates[index],
      ...templateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.templates[index] };
  }

  async delete(id) {
    await delay(400);
    const index = this.templates.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Template with Id ${id} not found`);
    }
    
    this.templates.splice(index, 1);
    return true;
  }

  async getByIndustry(industry) {
    await delay(300);
    return this.templates.filter(t => t.industry === industry).map(t => ({ ...t }));
  }

  async getByPageType(pageType) {
    await delay(300);
    return this.templates.filter(t => t.pageType === pageType).map(t => ({ ...t }));
  }

  async getByIndustryAndPageType(industry, pageType) {
    await delay(300);
    return this.templates.filter(t => t.industry === industry && t.pageType === pageType).map(t => ({ ...t }));
  }

  async getByTone(tone) {
    await delay(250);
    if (!tone || tone === "All") return [...this.templates];
    
    return this.templates.filter(template => 
      template.tone.toLowerCase() === tone.toLowerCase()
    );
  }

getTones() {
    const tones = [...new Set(this.templates.map(t => t.tone))];
    return ["All", ...tones.sort()];
  }

  getIndustries() {
    const industries = [...new Set(this.templates.map(t => t.industry))];
    return ["All", ...industries.sort()];
  }

  getPageTypes() {
    const pageTypes = [...new Set(this.templates.map(t => t.pageType))];
    return ["All", ...pageTypes.sort()];
  }
}

export default new TemplateService();