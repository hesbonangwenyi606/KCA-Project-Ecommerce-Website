-- Performance indexes for storefront catalog queries

CREATE INDEX IF NOT EXISTS idx_ecom_products_status_handle
  ON public.ecom_products (status, handle);

CREATE INDEX IF NOT EXISTS idx_ecom_products_status_product_type
  ON public.ecom_products (status, product_type);

CREATE INDEX IF NOT EXISTS idx_ecom_products_status_created_at
  ON public.ecom_products (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ecom_products_tags_gin
  ON public.ecom_products USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_ecom_product_collections_collection_position
  ON public.ecom_product_collections (collection_id, position);

CREATE INDEX IF NOT EXISTS idx_ecom_product_variants_product_position
  ON public.ecom_product_variants (product_id, position);

CREATE INDEX IF NOT EXISTS idx_ecom_collections_visible_sort_order
  ON public.ecom_collections (is_visible, sort_order);
