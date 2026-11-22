import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, Check, ChevronDown, ChevronLeft, CircleUserRound, Clock3,
  Leaf, LockKeyhole, MapPin, Menu, Minus, PackageCheck, Plus, Search, ShoppingBag, Sparkles, Star, Truck, X,
} from 'lucide-react';

type Product = {
  id: number; name: string; category: string; price: number; compareAt?: number;
  description: string; note: string; accent: string; label?: string; bestseller?: boolean; newArrival?: boolean;
};
type CartItem = { product: Product; quantity: number };
type CheckoutDetails = {
  contact: string; firstName: string; lastName: string; address: string;
  apartment: string; city: string; state: string; postalCode: string;
};
type DemoOrder = {
  id: string; createdAt: string; contact: string; customerName: string;
  address: string; items: CartItem[]; total: number;
};

const emptyCheckoutDetails: CheckoutDetails = {
  contact: '', firstName: '', lastName: '', address: '',
  apartment: '', city: '', state: '', postalCode: '',
};

function readDemoOrders(): DemoOrder[] {
  try {
    const savedOrders: unknown = JSON.parse(localStorage.getItem('kaar-demo-orders') || '[]');
    return Array.isArray(savedOrders) ? savedOrders as DemoOrder[] : [];
  } catch {
    return [];
  }
}

const products: Product[] = [
  { id: 1, name: 'Nourish Abhyanga Oil', category: 'Ritual Oils', price: 1290, compareAt: 1490, description: 'A grounding sesame and ashwagandha body oil for a slower, more rooted ritual.', note: 'Warm · Ground · Restore', accent: 'clay', label: 'Bestseller', bestseller: true },
  { id: 2, name: 'Soma Sleep Elixir', category: 'Daily Rituals', price: 980, description: 'A calming botanical blend with brahmi, chamomile and cardamom for evening stillness.', note: 'Unwind · Soften · Sleep', accent: 'sage', label: 'New arrival', newArrival: true },
  { id: 3, name: 'Prana Breath Mist', category: 'Aromatherapy', price: 760, description: 'Rose, tulsi and vetiver distilled into a bright, clarifying daily mist.', note: 'Clear · Open · Breathe', accent: 'cream', bestseller: true },
  { id: 4, name: 'Agni Digestive Chai', category: 'Herbal Blends', price: 690, description: 'A gentle warming infusion of ginger, fennel and cumin to accompany mindful meals.', note: 'Warm · Balance · Move', accent: 'ochre', label: 'Bestseller', bestseller: true },
  { id: 5, name: 'Chandra Face Masque', category: 'Skin Rituals', price: 1150, description: 'Moonlit clay, manjistha and rose for a softly luminous complexion.', note: 'Purify · Soothe · Glow', accent: 'rose', newArrival: true, label: 'New arrival' },
  { id: 6, name: 'Dhyana Incense Cones', category: 'Home Rituals', price: 540, description: 'Hand-rolled sandalwood and frankincense for a quiet, considered space.', note: 'Settle · Focus · Receive', accent: 'forest' },
];

const categories = [
  { name: 'Daily Rituals', subtitle: 'Small practices, lasting shifts', accent: 'sage', icon: '01' },
  { name: 'Skin & Glow', subtitle: 'Botanicals for your outer radiance', accent: 'rose', icon: '02' },
  { name: 'Mind & Sleep', subtitle: 'Return to a gentler rhythm', accent: 'night', icon: '03' },
  { name: 'Home Energy', subtitle: 'Make space for what matters', accent: 'ochre', icon: '04' },
];

const quizQuestions = [
  { title: 'What is asking for your attention today?', answers: ['My energy feels scattered', 'My body needs deep rest', 'I want to feel more radiant', 'I am ready for a fresh beginning'] },
  { title: 'Choose the rhythm you are craving.', answers: ['Slow and grounding', 'Quiet and restorative', 'Bright and expansive', 'Warm and energising'] },
  { title: 'Where do you want to begin?', answers: ['A morning ritual', 'An evening ritual', 'A skin ritual', 'A ritual for my space'] },
  { title: 'Which element feels like home?', answers: ['Earth', 'Water', 'Fire', 'Air'] },
  { title: 'What would feel like a gift right now?', answers: ['A moment to arrive', 'Permission to exhale', 'A little glow', 'A clear new path'] },
];

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function ProductArtwork({ product, large = false }: { product: Product; large?: boolean }) {
  return <div className={`product-art art-${product.accent} ${large ? 'product-art-large' : ''}`} aria-label={`${product.name} product image`}>
    <div className="art-orb" /><div className="art-bottle"><span>KAAR</span><small>AYURVEDA</small></div><div className="art-leaf leaf-one"><Leaf size={large ? 52 : 36} /></div><div className="art-leaf leaf-two"><Leaf size={large ? 40 : 26} /></div>
  </div>;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className={`brand-lockup ${compact ? 'compact' : ''}`}><img src="/kaar-ayurveda-logo-transparent.png" alt="Kaar Ayurveda — Rooted in Energy" /></div>;
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem('kaar-cart') || '[]') as CartItem[]; } catch { return []; } });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>(emptyCheckoutDetails);
  const [checkoutError, setCheckoutError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<DemoOrder | null>(null);
  const [orders, setOrders] = useState<DemoOrder[]>(readDemoOrders);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountContact, setAccountContact] = useState('');
  const [accountSearched, setAccountSearched] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<Product | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => { localStorage.setItem('kaar-cart', JSON.stringify(cart)); }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const filteredProducts = useMemo(() => products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function addToCart(product: Product) { setCart((current) => { const existing = current.find((item) => item.product.id === product.id); return existing ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]; }); setCartOpen(true); }
  function changeQuantity(id: number, delta: number) { setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0)); }
  function startCheckout() {
    setCartOpen(false);
    setCheckoutStep(1);
    setCheckoutError('');
    setPlacedOrder(null);
    setCheckoutOpen(true);
  }
  function placeDemoOrder() {
    if (!cart.length) return;
    const shipping = subtotal >= 1500 ? 0 : 99;
    const order: DemoOrder = {
      id: `KAAR-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      contact: checkoutDetails.contact.trim(),
      customerName: `${checkoutDetails.firstName} ${checkoutDetails.lastName}`.trim(),
      address: [checkoutDetails.address, checkoutDetails.apartment, checkoutDetails.city, checkoutDetails.state, checkoutDetails.postalCode].filter(Boolean).join(', '),
      items: cart,
      total: subtotal + shipping,
    };
    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('kaar-demo-orders', JSON.stringify(nextOrders));
    setPlacedOrder(order);
    setCart([]);
    setCheckoutError('');
  }
  function openOrderLookup(contact = '') {
    setCheckoutOpen(false);
    setAccountContact(contact);
    setAccountSearched(Boolean(contact));
    setAccountOpen(true);
  }
  function findOrders() {
    setAccountSearched(true);
  }
  const matchingOrders = accountSearched
    ? orders.filter((order) => order.contact.toLowerCase() === accountContact.trim().toLowerCase())
    : [];
  function updateCheckoutField(field: keyof CheckoutDetails, value: string) {
    setCheckoutDetails((current) => ({ ...current, [field]: value }));
  }
  function closeQuiz() { setQuizOpen(false); setQuizIndex(0); setQuizAnswers([]); setQuizResult(null); }
  function answerQuiz(answer: number) { const next = [...quizAnswers]; next[quizIndex] = answer; setQuizAnswers(next); }
  function nextQuiz() { if (quizAnswers[quizIndex] === undefined) return; if (quizIndex < quizQuestions.length - 1) setQuizIndex((index) => index + 1); else { setQuizLoading(true); window.setTimeout(() => { setQuizLoading(false); setQuizResult(products[quizAnswers.reduce((sum, answer) => sum + answer, 0) % products.length]); }, 900); } }
  function restartQuiz() { setQuizIndex(0); setQuizAnswers([]); setQuizResult(null); setQuizLoading(false); }
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }

  return <div className="app-shell">
    <div className="announcement"><span>Discover the power of natural wellness.</span><span className="announcement-detail">Complimentary shipping across India on orders over ₹1,500</span><button onClick={() => scrollTo('shop')}>Explore collection <ArrowRight size={13} /></button></div>
    <header className="site-header"><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={21} /></button><button className="mobile-search" onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={20} /></button><button className="logo-button" onClick={() => scrollTo('top')}><Logo /></button><nav className={menuOpen ? 'nav-open' : ''}><button onClick={() => scrollTo('shop')}>Shop</button><button onClick={() => scrollTo('intention')}>Collections</button><button onClick={() => scrollTo('philosophy')}>Our philosophy</button><button onClick={() => setQuizOpen(true)} className="quiz-nav"><Sparkles size={14} />Daily wellness quiz</button><button onClick={() => scrollTo('journal')}>Journal</button></nav><div className="header-actions"><button onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={19} /></button><button onClick={() => openOrderLookup()} aria-label="Sign in or track an order"><CircleUserRound size={19} /></button><button onClick={() => setCartOpen(true)} className="bag-button" aria-label="Open cart"><ShoppingBag size={19} /><span>{cartCount}</span></button></div></header>

    {searchOpen && <div className="search-panel"><div className="search-inner"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search rituals, botanicals, intentions..." /><button onClick={() => { setSearchOpen(false); setQuery(''); }} aria-label="Close search"><X size={20} /></button></div>{query && <div className="search-results">{filteredProducts.length ? filteredProducts.map((product) => <button key={product.id} onClick={() => { setSelectedProduct(product); setSearchOpen(false); }}><ProductArtwork product={product} /><span>{product.name}<small>{money(product.price)}</small></span><ArrowRight size={16} /></button>) : <p>No rituals found. Try a different intention.</p>}</div>}</div>}

    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> ROOTED IN ENERGY</div><h1>Return to your <em>natural</em> rhythm.</h1><p>Ayurvedic rituals for the way you want to feel — consciously sourced, beautifully made, and designed for everyday living.</p><div className="hero-actions"><button className="button button-dark" onClick={() => scrollTo('shop')}>Shop rituals <ArrowRight size={16} /></button><button className="text-button" onClick={() => scrollTo('philosophy')}>Why Kaar <ArrowRight size={15} /></button></div></div><div className="hero-visual"><div className="hero-card hero-card-main"><div className="sun-disc" /><div className="hero-vessel"><span>KAAR</span><small>ABHYANGA OIL</small></div><div className="botanical botanical-left"><Leaf size={74} /><Leaf size={45} /></div><div className="botanical botanical-right"><Leaf size={84} /><Leaf size={36} /></div></div><div className="hero-caption"><span>01 / 03</span><span>A ritual for coming home to yourself.</span></div></div></section>

      <section className="marquee"><div>CARE, CONSCIOUSLY <span>✦</span> BOTANICAL INTELLIGENCE <span>✦</span> ROOTED IN TRADITION <span>✦</span> CARE, CONSCIOUSLY <span>✦</span></div></section>
      <section className="shopping-journey" aria-label="How shopping works"><div><span>01</span><strong>Find your ritual</strong><small>Explore thoughtful essentials</small></div><ArrowRight size={17} /><div><span>02</span><strong>Add to your bag</strong><small>Choose what feels right</small></div><ArrowRight size={17} /><div><span>03</span><strong>Checkout as a guest</strong><small>Just an email or phone number</small></div></section>
      <section className="section intention" id="intention"><div className="section-heading"><div><div className="eyebrow">EXPLORE WITH INTENTION</div><h2>Begin where you are.</h2></div><p>There is no right way to wellness. Follow what feels like you, today.</p></div><div className="category-grid">{categories.map((category) => <button key={category.name} className={`category-card category-${category.accent}`} onClick={() => { setQuery(category.name.split(' ')[0]); setSearchOpen(true); }}><span className="category-number">{category.icon}</span><div><h3>{category.name}</h3><p>{category.subtitle}</p></div><ArrowRight size={17} /></button>)}</div></section>

      <section className="section product-section" id="shop"><div className="section-heading"><div><div className="eyebrow">THE EVERYDAY EDIT</div><h2>Made for your rituals.</h2></div><button className="text-button" onClick={() => setSearchOpen(true)}>View all products <ArrowRight size={15} /></button></div><div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onView={setSelectedProduct} />)}</div></section>

      <section className="philosophy" id="philosophy"><div className="philosophy-art"><div className="philosophy-ring" /><div className="philosophy-stone" /><div className="philosophy-leaves"><Leaf size={110} /><Leaf size={70} /></div></div><div className="philosophy-copy"><div className="eyebrow">A MODERN AYURVEDA</div><h2>Wellness is not a destination. It is a relationship.</h2><p>Kaar Ayurveda brings the wisdom of everyday rituals into the present. Our formulations honour time-tested botanicals, considered sourcing, and the small moments that help you feel more like yourself.</p><button className="button button-outline" onClick={() => scrollTo('about')}>Meet Kaar Ayurveda <ArrowRight size={16} /></button></div></section>

      <section className="section product-section arrivals"><div className="section-heading"><div><div className="eyebrow">JUST IN</div><h2>New rituals to meet you there.</h2></div><button className="text-button" onClick={() => setQuery('')}>View new arrivals <ArrowRight size={15} /></button></div><div className="product-grid">{products.slice(2, 6).map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} onView={setSelectedProduct} />)}</div></section>

      <section className="feature-band"><div className="feature-band-art"><div className="feature-jar"><span>KAAR</span><small>DHYANA</small></div><div className="feature-leaf"><Leaf size={120} /></div></div><div className="feature-copy"><div className="eyebrow">THE RITUAL EDIT</div><h2>Make space for stillness.</h2><p>A considered collection for quiet mornings, slow evenings and everything in between.</p><button className="button button-light" onClick={() => setSelectedProduct(products[5])}>Shop the edit <ArrowRight size={16} /></button></div></section>

      <section className="trust-strip"><span>Carefully selected botanicals</span><i>✦</i><span>Small-batch rituals</span><i>✦</i><span>Made with intention</span><i>✦</i><span>Rooted in tradition</span></section>
      <section className="about section" id="about"><div><div className="eyebrow">THE KAAR WAY</div><h2>Rooted in energy.<br /><em>Made for now.</em></h2></div><div className="about-copy"><p>We believe the everyday can hold the extraordinary. Kaar is a growing library of sensory rituals inspired by Ayurveda and made with a deep respect for the plants, people and practices behind them.</p><button className="text-button" onClick={() => scrollTo('journal')}>Read our journal <ArrowRight size={15} /></button></div></section>
      <section className="testimonials"><div className="eyebrow">WORDS FROM THE COMMUNITY</div><div className="quote-mark">“</div><blockquote>It has become my favourite part of the evening — a small, beautiful reminder to slow down.</blockquote><div className="quote-meta"><span>Placeholder review</span><span>Early Kaar community</span></div><div className="dots"><span className="active" /><span /><span /></div></section>
      <section className="section journal" id="journal"><div className="section-heading"><div><div className="eyebrow">FROM THE JOURNAL</div><h2>Notes for a more intentional life.</h2></div><button className="text-button">View all stories <ArrowRight size={15} /></button></div><div className="journal-grid"><article className="journal-feature"><div className="journal-art journal-sage"><Leaf size={100} /></div><div className="journal-text"><span>RITUALS</span><h3>The art of doing less, with more presence.</h3><button className="text-button">Read story <ArrowRight size={14} /></button></div></article><article><div className="journal-art journal-sun"><div className="sun-disc small" /></div><div className="journal-text"><span>AYURVEDA 101</span><h3>Meet the botanicals in your daily ritual.</h3><button className="text-button">Read story <ArrowRight size={14} /></button></div></article><article><div className="journal-art journal-earth"><div className="earth-oval" /></div><div className="journal-text"><span>WELLBEING</span><h3>A softer morning starts the night before.</h3><button className="text-button">Read story <ArrowRight size={14} /></button></div></article></div></section>
      <FAQ />
      <section className="newsletter"><div className="eyebrow">A NOTE FROM KAAR</div><h2>Bring a little more intention<br /><em>to your inbox.</em></h2><p>Notes on rituals, botanicals and the art of feeling well.</p>{newsletterDone ? <div className="newsletter-success">You are on the list. Thank you for being here.</div> : <form onSubmit={(event) => { event.preventDefault(); if (email) setNewsletterDone(true); }}><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" required /><button className="button button-dark">Subscribe <ArrowRight size={15} /></button></form>}</section>
    </main>

    <footer><div className="footer-main"><div><Logo compact /><p>Ayurvedic rituals for a life<br />rooted in energy.</p></div><div><h4>Explore</h4><button onClick={() => scrollTo('shop')}>Shop all</button><button onClick={() => scrollTo('intention')}>Collections</button><button onClick={() => setQuizOpen(true)}>Daily quiz</button><button onClick={() => scrollTo('journal')}>Journal</button></div><div><h4>Care</h4><button>Shipping & delivery</button><button>Returns & exchanges</button><button>FAQs</button><button>Contact us</button></div><div><h4>Stay connected</h4><p className="footer-muted">Instagram · Pinterest · YouTube</p><p className="footer-muted">hello@kaarayurveda.com<br />Demo contact details</p></div></div><div className="footer-bottom"><span>© 2026 Kaar Ayurveda</span><span>Privacy · Terms · Accessibility</span><span>Made with intention</span></div></footer>

    {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">YOUR RITUAL BAG</span><h2>{cartCount ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'}` : 'Your bag is quiet'}</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={21} /></button></div>{cart.length ? <><div className="cart-list">{cart.map((item) => <div className="cart-item" key={item.product.id}><ProductArtwork product={item.product} /><div className="cart-item-info"><h3>{item.product.name}</h3><span>{money(item.product.price)}</span><div className="quantity"><button onClick={() => changeQuantity(item.product.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.product.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-footer"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>{subtotal >= 1500 ? 'Complimentary shipping unlocked.' : `${money(1500 - subtotal)} away from complimentary shipping.`}</p><button className="button button-dark full" onClick={startCheckout}>Continue to checkout <ArrowRight size={16} /></button><span className="checkout-assurance"><LockKeyhole size={13} /> Guest checkout · No account required</span></div></> : <div className="empty-cart"><ShoppingBag size={32} /><p>Not sure where to start?</p><button className="text-button" onClick={() => { setCartOpen(false); scrollTo('shop'); }}>Explore the rituals <ArrowRight size={15} /></button></div>}</aside></div>}
    {checkoutOpen && <CheckoutModal
      step={checkoutStep}
      details={checkoutDetails}
      error={checkoutError}
      cart={cart}
      subtotal={subtotal}
      order={placedOrder}
      onClose={() => setCheckoutOpen(false)}
      onFieldChange={updateCheckoutField}
      onContinue={() => {
        if (checkoutStep === 1) {
          const contact = checkoutDetails.contact.trim();
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
          const isPhone = /^\+?[\d\s()-]+$/.test(contact) && contact.replace(/\D/g, '').length >= 10;
          if (!isEmail && !isPhone) {
            setCheckoutError('Enter a valid email address or phone number to continue.');
            return;
          }
        }
        setCheckoutError('');
        setCheckoutStep((step) => Math.min(3, step + 1));
      }}
      onBack={() => { setCheckoutError(''); setCheckoutStep((step) => Math.max(1, step - 1)); }}
      onPlaceOrder={placeDemoOrder}
      onTrackOrder={() => openOrderLookup(placedOrder?.contact || '')}
      onSignIn={() => openOrderLookup(checkoutDetails.contact)}
    />}
    {accountOpen && <AccountModal
      contact={accountContact}
      orders={matchingOrders}
      searched={accountSearched}
      onContactChange={(value) => { setAccountContact(value); setAccountSearched(false); }}
      onSearch={findOrders}
      onClose={() => setAccountOpen(false)}
    />}
    {selectedProduct && <div className="overlay" onClick={() => setSelectedProduct(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProduct(null)}><X size={20} /></button><ProductArtwork product={selectedProduct} large /><div className="product-modal-copy"><span className="eyebrow">{selectedProduct.category}</span><h2>{selectedProduct.name}</h2><div className="modal-price">{money(selectedProduct.price)} {selectedProduct.compareAt && <del>{money(selectedProduct.compareAt)}</del>}</div><div className="rating"><Star size={14} fill="currentColor" /> 4.9 <span>Demo review placeholder</span></div><p>{selectedProduct.description}</p><div className="detail-list"><span><Leaf size={15} /> Thoughtfully sourced botanicals</span><span><Clock3 size={15} /> A ritual for every day</span></div><button className="button button-dark full" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Add to ritual bag <ShoppingBag size={16} /></button></div></div></div>}
    {quizOpen && <QuizModal index={quizIndex} answers={quizAnswers} result={quizResult} loading={quizLoading} onClose={closeQuiz} onAnswer={answerQuiz} onNext={nextQuiz} onBack={() => setQuizIndex((index) => Math.max(0, index - 1))} onRestart={restartQuiz} onShop={(product) => { closeQuiz(); setSelectedProduct(product); }} />}
  </div>;
}

function CheckoutModal({
  step, details, error, cart, subtotal, order, onClose, onFieldChange,
  onContinue, onBack, onPlaceOrder, onTrackOrder, onSignIn,
}: {
  step: number; details: CheckoutDetails; error: string; cart: CartItem[];
  subtotal: number; order: DemoOrder | null; onClose: () => void;
  onFieldChange: (field: keyof CheckoutDetails, value: string) => void;
  onContinue: () => void; onBack: () => void; onPlaceOrder: () => void;
  onTrackOrder: () => void; onSignIn: () => void;
}) {
  const shipping = subtotal >= 1500 ? 0 : 99;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const fullName = `${details.firstName} ${details.lastName}`.trim();
  const address = [details.address, details.apartment, details.city, details.state, details.postalCode].filter(Boolean).join(', ');

  return <div className="overlay checkout-overlay" onClick={onClose}>
    <section className="checkout-modal" onClick={(event) => event.stopPropagation()}>
      <header className="checkout-header"><Logo compact /><button onClick={onClose} aria-label="Close checkout"><X size={21} /></button></header>
      {order ? <div className="order-confirmation">
        <div className="confirmation-icon"><PackageCheck size={34} /></div>
        <span className="eyebrow">ORDER RECEIVED</span>
        <h1>Your order is confirmed.</h1>
        <p className="confirmation-copy">Your demo order has been saved in this browser. No payment has been processed.</p>
        <div className="confirmation-order"><span>Order reference</span><strong>{order.id}</strong></div>
        <div className="confirmation-order"><span>Order total</span><strong>{money(order.total)}</strong></div>
        <div className="confirmation-order"><span>Confirmation sent to</span><strong>{order.contact}</strong></div>
        <div className="confirmation-actions">
          <button className="button button-dark" onClick={onTrackOrder}>Track this order <ArrowRight size={16} /></button>
          <button className="text-button" onClick={onClose}>Continue shopping</button>
        </div>
      </div> : <div className="checkout-content">
        <div className="checkout-main">
          <div className="checkout-title-row"><div><span className="eyebrow">KAAR AYURVEDA · GUEST CHECKOUT</span><h1>Complete your order.</h1></div><button className="checkout-signin" onClick={onSignIn}>Sign in <ArrowRight size={14} /></button></div>
          <div className="checkout-steps">{['Contact', 'Delivery', 'Review'].map((label, index) => <div className={step >= index + 1 ? 'checkout-step current' : 'checkout-step'} key={label}><span>{step > index + 1 ? <Check size={13} /> : `0${index + 1}`}</span>{label}</div>)}</div>
          {step === 1 && <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); onContinue(); }}>
            <div className="checkout-section-title"><div><h2>Contact details</h2><p>We’ll use this for your order confirmation.</p></div></div>
            <label>Email or mobile number<input autoComplete="email" type="text" required value={details.contact} onChange={(event) => onFieldChange('contact', event.target.value)} placeholder="you@example.com or 98765 43210" /></label>
            <div className="form-two-col"><label>First name<input autoComplete="given-name" required value={details.firstName} onChange={(event) => onFieldChange('firstName', event.target.value)} /></label><label>Last name<input autoComplete="family-name" required value={details.lastName} onChange={(event) => onFieldChange('lastName', event.target.value)} /></label></div>
            <p className="guest-note">Shopping as a guest is always an option. No account needed.</p>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button className="button button-dark checkout-next" type="submit">Continue to delivery <ArrowRight size={16} /></button>
          </form>}
          {step === 2 && <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); onContinue(); }}>
            <div className="checkout-section-title"><div><h2>Delivery address</h2><p>Where should we send your order?</p></div></div>
            <label>Address<input autoComplete="street-address" required value={details.address} onChange={(event) => onFieldChange('address', event.target.value)} placeholder="House number and street" /></label>
            <label>Apartment, suite, etc. <span className="optional-label">Optional</span><input autoComplete="address-line2" value={details.apartment} onChange={(event) => onFieldChange('apartment', event.target.value)} /></label>
            <div className="form-two-col"><label>City<input autoComplete="address-level2" required value={details.city} onChange={(event) => onFieldChange('city', event.target.value)} /></label><label>State<input autoComplete="address-level1" required value={details.state} onChange={(event) => onFieldChange('state', event.target.value)} /></label></div>
            <div className="form-two-col"><label>PIN code<input autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={details.postalCode} onChange={(event) => onFieldChange('postalCode', event.target.value)} placeholder="6-digit PIN code" /></label><label>Country<input value="India" readOnly /></label></div>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <div className="checkout-form-actions"><button type="button" className="text-button" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="button button-dark" type="submit">Review order <ArrowRight size={16} /></button></div>
          </form>}
          {step === 3 && <div className="checkout-form">
            <div className="checkout-section-title"><div><h2>Review & place order</h2><p>Check your details before confirming.</p></div></div>
            <div className="review-block"><div><span className="review-label">CONTACT</span><strong>{details.contact}</strong></div><button onClick={() => { onBack(); onBack(); }}>Edit</button></div>
            <div className="review-block"><div><span className="review-label">DELIVER TO</span><strong>{fullName}<br />{address}</strong></div><button onClick={onBack}>Edit</button></div>
            <div className="payment-choice"><span className="payment-radio" /><div><strong>Prepaid payment</strong><small>Required for every order</small></div><span className="prepaid-label">PREPAID ONLY</span></div>
            <div className="payment-coming-soon"><LockKeyhole size={15} /><span>Razorpay is coming soon. This demo does not collect or confirm payment.</span></div>
            <p className="checkout-disclaimer">Demo checkout: order details are saved only in this browser. No payment is processed and no order is sent.</p>
            {error && <p className="checkout-error" role="alert">{error}</p>}
            <div className="checkout-form-actions"><button type="button" className="text-button" onClick={onBack}><ChevronLeft size={16} /> Back</button><button className="button button-dark" onClick={onPlaceOrder}>Place demo order · {money(total)} <ArrowRight size={16} /></button></div>
          </div>}
        </div>
        <aside className="checkout-summary"><div className="checkout-section-title"><div><h2>Your order</h2><p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p></div></div>
          <div className="checkout-items">{cart.map(({ product, quantity }) => <div className="checkout-item" key={product.id}><ProductArtwork product={product} /><div><strong>{product.name}</strong><span>Qty {quantity}</span></div><b>{money(product.price * quantity)}</b></div>)}</div>
          <div className="checkout-totals"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Shipping</span><span>{shipping ? money(shipping) : 'Complimentary'}</span></div><div className="checkout-grand-total"><strong>Total</strong><strong>{money(total)}</strong></div></div>
          <p className="summary-shipping"><Truck size={15} /> Complimentary shipping on orders of {money(1500)} or more</p>
        </aside>
      </div>}
    </section>
  </div>;
}

function AccountModal({
  contact, orders, searched, onContactChange, onSearch, onClose,
}: {
  contact: string; orders: DemoOrder[]; searched: boolean;
  onContactChange: (value: string) => void; onSearch: () => void; onClose: () => void;
}) {
  return <div className="overlay account-overlay" onClick={onClose}>
    <section className="account-modal" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close account panel"><X size={20} /></button>
      <div className="account-icon"><MapPin size={22} /></div>
      <span className="eyebrow">YOUR KAAR ACCOUNT</span>
      <h2>Welcome, whenever you’re ready.</h2>
      <p className="account-intro">Guest checkout never requires an account. Look up an order with the email or phone number you used at checkout.</p>
      <form className="account-lookup" onSubmit={(event) => { event.preventDefault(); onSearch(); }}>
        <label>Email or mobile number<input type="text" required value={contact} onChange={(event) => onContactChange(event.target.value)} placeholder="Enter your checkout contact" /></label>
        <button className="button button-dark full" type="submit">Find my orders <ArrowRight size={15} /></button>
      </form>
      {searched && <div className="account-results">{orders.length ? orders.map((order) => <article className="tracked-order" key={order.id}>
        <div className="tracked-order-heading"><div><span className="eyebrow">ORDER {order.id}</span><strong>Order received</strong></div><PackageCheck size={20} /></div>
        <p>{order.items.map((item) => `${item.quantity} × ${item.product.name}`).join(' · ')}</p>
        <div className="tracked-order-meta"><span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span><strong>{money(order.total)}</strong></div>
        <div className="tracking-progress"><span className="tracking-active" /><span /><span /></div>
        <div className="tracking-labels"><span>Received</span><span>Preparing</span><span>Delivered</span></div>
      </article>) : <p className="no-orders">No order found for that contact on this device. Check the details or place a guest order first.</p>}</div>}
      <p className="account-demo-note">Account sign-in and synced tracking will be connected when authentication and a database are added. This preview stores orders only in this browser.</p>
    </section>
  </div>;
}

function ProductCard({ product, onAdd, onView }: { product: Product; onAdd: (product: Product) => void; onView: (product: Product) => void }) { return <article className="product-card"><button className="product-image-button" onClick={() => onView(product)}><ProductArtwork product={product} />{product.label && <span className="product-badge">{product.label}</span>}<span className="quick-view">Quick view <ArrowRight size={14} /></span></button><div className="product-info"><div><h3>{product.name}</h3><p>{product.note}</p></div><button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`}><Plus size={18} /></button></div><div className="price-row"><span>{money(product.price)}</span>{product.compareAt && <del>{money(product.compareAt)}</del>}</div></article> }

function FAQ() { const [open, setOpen] = useState(0); const faqs = ['What is Kaar Ayurveda?', 'How do I choose the right ritual?', 'Are the products suitable for everyday use?', 'When will my order arrive?']; return <section className="section faq"><div><div className="eyebrow">QUESTIONS, ANSWERED</div><h2>A little clarity<br /><em>goes a long way.</em></h2><p>We are here to make your rituals feel simple.</p></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-row ${open === index ? 'faq-open' : ''}`} key={faq}><button onClick={() => setOpen(open === index ? -1 : index)}><span>0{index + 1}</span><strong>{faq}</strong><ChevronDown size={18} /></button>{open === index && <p>{index === 0 ? 'Kaar Ayurveda is a demo brand experience rooted in the everyday wisdom of Ayurveda. Product and policy details will be updated when the final catalogue is supplied.' : index === 1 ? 'Begin with how you want to feel. Our Daily Wellness Quiz is a gentle way to discover a starting point.' : index === 2 ? 'Please review the final product label and consult a qualified professional where appropriate. This demo contains placeholder content.' : 'Shipping details are placeholder content until the client confirms timelines and service areas.'}</p>}</div>)}</div></section> }

function QuizModal({ index, answers, result, loading, onClose, onAnswer, onNext, onBack, onRestart, onShop }: { index: number; answers: number[]; result: Product | null; loading: boolean; onClose: () => void; onAnswer: (answer: number) => void; onNext: () => void; onBack: () => void; onRestart: () => void; onShop: (product: Product) => void }) { return <div className="overlay quiz-overlay"><div className="quiz-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={20} /></button>{result ? <div className="quiz-result"><div className="eyebrow">YOUR DAILY RITUAL</div><h2>Come back to your centre.</h2><p className="result-intro">Today feels like an invitation to create a little more space for yourself.</p><ProductArtwork product={result} /><h3>{result.name}</h3><p>{result.description}</p><button className="button button-dark" onClick={() => onShop(result)}>Discover this ritual <ArrowRight size={16} /></button><button className="text-button" onClick={onRestart}>Retake quiz</button></div> : loading ? <div className="quiz-loading"><div className="loading-orbit"><Leaf size={27} /></div><div className="eyebrow">READING YOUR ENERGY</div><h2>Finding the ritual<br /><em>that meets you there.</em></h2><p>Take one soft breath.</p></div> : <><div className="quiz-top"><div><div className="eyebrow">DAILY WELLNESS QUIZ</div><h2>Discover your<br /><em>energy of the day.</em></h2></div><span className="quiz-count">0{index + 1} / 05</span></div><p className="quiz-intro">A few gentle questions to help you find a ritual that feels aligned with where you are.</p><div className="progress"><span style={{ width: `${((index + 1) / quizQuestions.length) * 100}%` }} /></div><div className="quiz-question"><span>QUESTION {index + 1}</span><h3>{quizQuestions[index].title}</h3><div className="answer-grid">{quizQuestions[index].answers.map((answer, answerIndex) => <button className={answers[index] === answerIndex ? 'answer selected' : 'answer'} key={answer} onClick={() => onAnswer(answerIndex)}><span>{String.fromCharCode(65 + answerIndex)}</span>{answer}</button>)}</div></div><div className="quiz-actions"><button className="text-button" onClick={onBack} disabled={index === 0}><ChevronLeft size={16} /> Back</button><button className="button button-dark" onClick={onNext} disabled={answers[index] === undefined}>{index === quizQuestions.length - 1 ? 'Reveal my ritual' : 'Continue'} <ArrowRight size={16} /></button></div></>}</div></div> }

export default App;
