import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { Heart, ShoppingBag, Star, Truck, RefreshCw, ShieldCheck, Minus, Plus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!handle) return;
      setSelectedVariant(null); setSelectedSize(''); setQuantity(1); setAdded(false);

      try {
        const response = await apiFetch<{ product: any }>('/api/products/' + encodeURIComponent(handle));
        const data = response.product;
        if (!data) return;

        const variants = [...(data.variants || [])].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        data.variants = variants;
        setProduct(data);

        if (variants.length) {
          const first = variants.find((v: any) => v.inventory_qty == null || v.inventory_qty > 0) || variants[0];
          setSelectedVariant(first);
          setSelectedSize(first?.option1 || '');
        }

        const allProducts = await apiFetch<{ products: any[] }>('/api/products');
        setRelated((allProducts.products || []).filter((item) => item.product_type === data.product_type && item.id !== data.id).slice(0, 4));
      } catch (error) {
        console.error('Failed to load product details', error);
      }
    };

    run();
  }, [handle]);

  if (!product) return (
    <div className="min-h-screen bg-white"><Header /><div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div><Footer /></div>
  );

  const hasVariants = product.has_variants && product.variants?.length > 0;
  const sizes = [...new Set(product.variants?.map((v: any) => v.option1).filter(Boolean) || [])] as string[];

  const getInStock = () => {
    if (selectedVariant) return selectedVariant.inventory_qty == null || selectedVariant.inventory_qty > 0;
    if (product.variants?.length) return product.variants.some((v: any) => v.inventory_qty == null || v.inventory_qty > 0);
    if (product.has_variants) return true;
    if (product.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  };
  const inStock = getInStock();
  const currentPrice = selectedVariant?.price || product.price;

  const handleSize = (size: string) => {
    setSelectedSize(size);
    const v = product.variants?.find((x: any) => x.option1 === size);
    if (v) setSelectedVariant(v);
  };

  const handleAdd = () => {
    if (hasVariants && !selectedSize) return;
    if (!inStock) return;
    addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id || undefined,
      name: product.name,
      variant_title: selectedVariant?.title || selectedSize || undefined,
      sku: selectedVariant?.sku || product.sku || product.handle,
      price: currentPrice,
      image: product.images?.[0]
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link> / <Link to="/products" className="hover:text-gray-700">Products</Link> / <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square">
            <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide">{product.product_type}</p>
            <h1 className="text-3xl font-bold mt-1 mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}</div>
              <span className="text-sm text-gray-500">(128 reviews)</span>
            </div>
            <p className="text-3xl font-bold mb-5">{formatPrice(currentPrice)}</p>
            <p className="text-gray-600 mb-6">{product.description}</p>

            {hasVariants && (
              <div className="mb-6">
                <label className="block font-semibold mb-2">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => {
                    const v = product.variants?.find((x: any) => x.option1 === size);
                    const sizeIn = v ? (v.inventory_qty == null || v.inventory_qty > 0) : true;
                    return (
                      <button key={size} onClick={() => sizeIn && handleSize(size)} disabled={!sizeIn}
                        className={`px-4 py-2 border rounded-lg font-medium transition-all ${selectedSize === size ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : sizeIn ? 'border-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={16} /></button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus size={16} /></button>
              </div>
              <button onClick={() => toggleWishlist(product.id)} className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart size={20} className={isWishlisted(product.id) ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-gray-600'} />
              </button>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={handleAdd} disabled={(hasVariants && !selectedSize) || !inStock}
                className="flex-1 bg-[#FF6B6B] text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#ff5252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag size={18} /> {!inStock ? 'Out of Stock' : added ? 'Added!' : hasVariants && !selectedSize ? 'Select a Size' : 'Add to Cart'}
              </button>
              <button onClick={() => { handleAdd(); navigate('/cart'); }} disabled={(hasVariants && !selectedSize) || !inStock}
                className="flex-1 bg-[#2C2C2C] text-white py-4 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50">
                Buy Now
              </button>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600"><Truck size={18} className="text-[#FF6B6B]" /> Free shipping on all orders</div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><RefreshCw size={18} className="text-[#FF6B6B]" /> 30-day easy returns</div>
              <div className="flex items-center gap-3 text-sm text-gray-600"><ShieldCheck size={18} className="text-[#FF6B6B]" /> Secure encrypted checkout</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
