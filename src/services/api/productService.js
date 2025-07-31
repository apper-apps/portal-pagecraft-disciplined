import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.products = [...productsData];
  }

  async getAll() {
    await delay(300);
    return [...this.products];
  }

  async getById(id) {
    await delay(200);
    const product = this.products.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error(`Product with Id ${id} not found`);
    }
    return { ...product };
  }

  async updateDescription(id, description) {
    await delay(400);
    const index = this.products.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Product with Id ${id} not found`);
    }
    
    this.products[index] = {
      ...this.products[index],
      currentDescription: description,
      lastGenerated: new Date().toISOString()
    };
    
    return { ...this.products[index] };
  }

  async searchProducts(query) {
    await delay(250);
    if (!query) return [...this.products];
    
    const lowercaseQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.sku.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getProductsByCategory(category) {
    await delay(300);
    if (!category || category === "All") return [...this.products];
    
    return this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  getCategories() {
    const categories = [...new Set(this.products.map(p => p.category))];
    return ["All", ...categories.sort()];
  }
}

export default new ProductService();