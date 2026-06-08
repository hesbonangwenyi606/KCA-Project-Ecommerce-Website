import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const contentMap: Record<string, { title: string; intro: string; bullets: string[] }> = {
  'shipping-info': {
    title: 'Shipping Information',
    intro: 'We offer fast, reliable delivery for every order placed on LUMA.',
    bullets: [
      'Standard delivery: 3–5 business days.',
      'Express delivery: 1–2 business days for eligible locations.',
      'Free shipping applies to all orders over $0 in this storefront.',
      'Tracking details are sent by email as soon as your order ships.',
    ],
  },
  returns: {
    title: 'Returns & Exchanges',
    intro: 'We want you to love every purchase. If something is not right, you can return it within 30 days.',
    bullets: [
      'Items must be unused and in original condition.',
      'Returns are processed within 5 business days after arrival.',
      'Exchanges are available for size or color issues when stock allows.',
      'Please keep your receipt or order confirmation for reference.',
    ],
  },
  faq: {
    title: 'FAQ',
    intro: 'These are the most common questions our customers ask before and after checkout.',
    bullets: [
      'Can I change my order after checkout? Contact support as soon as possible.',
      'Do you ship internationally? Not yet, but we are expanding soon.',
      'How do I track my order? Use the tracking link in your confirmation email.',
      'Can I use multiple discounts? Only one discount code can be applied at a time.',
    ],
  },
  'contact-us': {
    title: 'Contact Us',
    intro: 'Our support team is ready to help with orders, shipping, and product questions.',
    bullets: [
      'Email: support@luma.example',
      'Phone: +1 (800) 555-0199',
      'Hours: Monday to Friday, 8am–6pm PST',
      'Live chat is available on the storefront during business hours.',
    ],
  },
  about: {
    title: 'About LUMA',
    intro: 'LUMA is a modern e-commerce storefront built to make browsing, purchasing, and support simple.',
    bullets: [
      'Curated collections across fashion, electronics, home, and lifestyle.',
      'Clean design and fast browsing for desktop and mobile.',
      'Built with React, TypeScript, Tailwind, and Supabase.',
    ],
  },
  careers: {
    title: 'Careers',
    intro: 'We are always looking for curious, creative people to help us build great shopping experiences.',
    bullets: [
      'Frontend engineer',
      'Product designer',
      'Customer support specialist',
      'Growth and merchandising analyst',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'We respect your privacy and only use your data to improve your shopping experience.',
    bullets: [
      'We collect account, order, and contact details to process purchases.',
      'Payment details are handled securely by our payment partners.',
      'You can request access to or deletion of your account data at any time.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'These terms govern your use of the LUMA storefront and services.',
    bullets: [
      'You agree to use the site for lawful purposes only.',
      'Prices, promotions, and inventory may change without notice.',
      'All content on the site is owned by LUMA or our partners.',
    ],
  },
};

const InfoPage: React.FC = () => {
  const { slug = 'shipping-info' } = useParams();
  const page = contentMap[slug || 'shipping-info'] || contentMap['shipping-info'];

  return (
    <div className="min-h-screen bg-white text-[#2C2C2C] flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="text-sm text-[#FF6B6B] hover:underline">← Back to home</Link>
        <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-[#FF6B6B]">Store information</p>
          <h1 className="mt-3 text-3xl font-bold">{page.title}</h1>
          <p className="mt-4 text-gray-600">{page.intro}</p>
          <ul className="mt-6 space-y-3 text-gray-700">
            {page.bullets.map((item) => (
              <li key={item} className="rounded-lg border border-gray-100 bg-gray-50 p-3">{item}</li>
            ))}
          </ul>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default InfoPage;
