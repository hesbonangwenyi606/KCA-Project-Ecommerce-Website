import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';

const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const hasVariants = product.has_variants;
  const price = hasVariants && product.variants?.length ? product.variants[0].price : product.price;
  const onSale = (product.tags || []).includes('sale');
  const rating = 4 + ((product.name.length % 10) / 10);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      product_id: product.id,
      variant_id: hasVariants ? product.variants?.[0]?.id : undefined,
      name: product.name,
      variant_title: hasVariants ? product.variants?.[0]?.title : undefined,
      sku: product.sku || product.handle,
      price,
      image: product.images?.[0]
    }, 1);
  };

  return (
    <Link to={`/product/${product.handle}`} className="group block">
      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square mb-3">
        <img src={product.images?.[0]} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {onSale && <span className="absolute top-3 left-3 bg-[#FF6B6B] text-white text-xs font-bold px-2 py-1 rounded">SALE</span>}
        <button onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white">
          <Heart size={16} className={isWishlisted(product.id) ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-gray-600'} />
        </button>
        {!hasVariants && (
          <button onClick={quickAdd}
            className="absolute bottom-3 left-3 right-3 bg-[#2C2C2C] text-white py-2.5 rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <ShoppingBag size={16} /> Add to Cart
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{product.product_type}</p>
      <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
      <div className="flex items-center gap-1 mt-1">
        <Star size={12} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs text-gray-500">{rating.toFixed(1)}</span>
      </div>
      <p className="font-bold text-gray-900 mt-1">{formatPrice(price)}</p>
    </Link>
  );
};

export default ProductCard;
