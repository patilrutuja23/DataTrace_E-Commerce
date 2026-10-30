import { Router, Request, Response } from 'express';
import { getAllProducts, getProductById } from '../db/database.js';

export const productsRouter = Router();

// GET /api/products
productsRouter.get('/', (req: Request, res: Response) => {
  try {
    let products = getAllProducts();
    const { category, search, minPrice, maxPrice, sort } = req.query;

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      const min = parseFloat(String(minPrice));
      if (!isNaN(min)) products = products.filter(p => p.price >= min);
    }

    if (maxPrice) {
      const max = parseFloat(String(maxPrice));
      if (!isNaN(max)) products = products.filter(p => p.price <= max);
    }

    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating_desc') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/categories
productsRouter.get('/categories', (_req: Request, res: Response) => {
  try {
    const products = getAllProducts();
    const categoryMap: Record<string, number> = {};
    for (const p of products) {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    }

    const categories = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count
    }));

    return res.json({ success: true, categories });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:id
productsRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

