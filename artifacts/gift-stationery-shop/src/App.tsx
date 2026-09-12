import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Router as WouterRouter, Switch, useLocation, useParams } from 'wouter';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  Gift,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Store,
  Truck,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  tag?: string;
  desc: string;
  image: string;
  colors: string[];
  rating: number;
  reviews: number;
  stock: number;
};

type CartItem = { product: Product; quantity: number; variant: string };
type DeliveryMode = 'pickup' | 'delivery';

const image = (_query: string, index = 1) => {
  const imageIds = [
    'photo-1544816155-12df9643f363',
    'photo-1452860606245-08befc0ff44b',
    'photo-1513519245088-0e12902e5a38',
    'photo-1517841905240-472988babdf9',
    'photo-1512428559087-560fa5ceab42',
    'photo-1526047932273-0218a1a1d8b9',
    'photo-1484101403633-562f891dc89a',
    'photo-1517248135467-4c7edcad34c4',
    'photo-1495446815901-a7297e633e8d',
    'photo-1511108690759-009c4e38c3d6',
  ];
  return `https://images.unsplash.com/${imageIds[(index - 1) % imageIds.length]}?auto=format&fit=crop&w=1200&q=85`;
};

const products: Product[] = [
  {
    id: 'sunlit-set',
    slug: 'sunlit-set',
    name: 'The Sunlit Desk Set',
    category: 'Stationery',
    price: 34,
    tag: 'Bestseller',
    desc: 'A small ritual for big thoughts: a linen-bound notebook, brass pencil, and page flags in a warm little belly band.',
    image: image('linen notebook stationery desk', 11),
    colors: ['Saffron', 'Rosewood', 'Moss'],
    rating: 4.9,
    reviews: 84,
    stock: 12,
  },
  {
    id: 'moss-mug',
    slug: 'moss-mug',
    name: 'Moss & Milk Mug',
    category: 'Home goods',
    price: 28,
    tag: 'New in',
    desc: 'Hand-thrown stoneware with a thumb-sized dimple made for slow mornings and second cups.',
    image: image('ceramic mug table still life', 22),
    colors: ['Moss', 'Oat', 'Cherry'],
    rating: 4.8,
    reviews: 31,
    stock: 8,
  },
  {
    id: 'tiny-joys',
    slug: 'tiny-joys',
    name: 'Tiny Joys Matchbook',
    category: 'Little treats',
    price: 12,
    tag: 'Under $15',
    desc: 'A pocket-sized stack of 24 prompts for noticing the good stuff, one ordinary day at a time.',
    image: image('colorful matchbook paper art', 31),
    colors: ['Tomato', 'Butter'],
    rating: 4.7,
    reviews: 19,
    stock: 22,
  },
  {
    id: 'weekday-bouquet',
    slug: 'weekday-bouquet',
    name: 'The Weekday Bouquet',
    category: 'Paper goods',
    price: 19,
    oldPrice: 24,
    desc: 'A cheerful bundle of illustrated cards, gift tags, and one very good envelope for no particular reason.',
    image: image('colorful paper cards flowers', 42),
    colors: ['Mixed'],
    rating: 4.9,
    reviews: 57,
    stock: 15,
  },
  {
    id: 'quiet-hours',
    slug: 'quiet-hours',
    name: 'Quiet Hours Candle',
    category: 'Home goods',
    price: 32,
    tag: 'Staff pick',
    desc: 'Cedar, black tea, and a soft trace of citrus. A candle for when the group chat is too loud.',
    image: image('amber candle interior still life', 53),
    colors: ['Tea & Cedar'],
    rating: 4.8,
    reviews: 43,
    stock: 6,
  },
  {
    id: 'soft-landing',
    slug: 'soft-landing',
    name: 'Soft Landing Socks',
    category: 'Little treats',
    price: 16,
    tag: 'Giftable',
    desc: 'Ridiculously soft cotton socks in our signature cinnamon stripe. They fit in every kind of care package.',
    image: image('colorful socks cozy gift', 64),
    colors: ['Cinnamon', 'Poppy'],
    rating: 4.6,
    reviews: 28,
    stock: 18,
  },
  {
    id: 'good-words',
    slug: 'good-words',
    name: 'Good Words Letterpress Set',
    category: 'Stationery',
    price: 26,
    tag: 'Made nearby',
    desc: 'Eight heavyweight note cards with enough breathing room for the things that matter.',
    image: image('letterpress cards paper texture', 75),
    colors: ['Parchment', 'Blush'],
    rating: 5,
    reviews: 61,
    stock: 10,
  },
  {
    id: 'neighbor-box',
    slug: 'neighbor-box',
    name: 'The New Neighbor Box',
    category: 'Curated bundles',
    price: 58,
    oldPrice: 67,
    tag: 'Bundle & save',
    desc: 'A welcome-home trio: candle, matchbook, and letterpress cards, tied up ready to walk next door.',
    image: image('gift box ribbon stationery', 86),
    colors: ['As shown'],
    rating: 4.9,
    reviews: 22,
    stock: 7,
  },
];

const categories = [
  { name: 'Stationery', eyebrow: 'For the next chapter', query: 'stationery desk paper', color: 'category-rose' },
  { name: 'Little treats', eyebrow: 'Tiny, excellent things', query: 'small gift colorful', color: 'category-yellow' },
  { name: 'Home goods', eyebrow: 'Make room for lovely', query: 'ceramic home object', color: 'category-green' },
  { name: 'Curated bundles', eyebrow: 'A gift, already thought through', query: 'gift wrapping bundle', color: 'category-orange' },
];

const money = (value: number) => `$${value.toFixed(2)}`;

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('pickup');
  const [toast, setToast] = useState('');

  useEffect(() => {
    document.title = 'Paper & Parcel — thoughtful things, close to home';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'Paper & Parcel is a neighborhood gift and stationery shop for sending a little more love.');
    const existingJsonLd = document.getElementById('product-json-ld');
    if (!existingJsonLd) {
      const script = document.createElement('script');
      script.id = 'product-json-ld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Paper & Parcel',
        description: 'Neighborhood gifts, stationery, and tiny reasons to celebrate.',
        url: window.location.origin,
        priceRange: '$$',
      });
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = (product: Product, variant = product.colors[0]) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.variant === variant);
      if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { product, variant, quantity: 1 }];
    });
    setToast(`${product.name} is in your parcel.`);
    setCartOpen(true);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.product.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    setToast(wishlist.includes(id) ? 'Removed from your wish list.' : 'Saved for a thoughtful moment.');
  };

  return (
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary>
            <StoreShell
              cart={cart}
              cartCount={cartCount}
              cartTotal={cartTotal}
              cartOpen={cartOpen}
              setCartOpen={setCartOpen}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              addToCart={addToCart}
              changeQuantity={changeQuantity}
              deliveryMode={deliveryMode}
              setDeliveryMode={setDeliveryMode}
              toast={toast}
              setToast={setToast}
            />
          </ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

type ShellProps = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  addToCart: (product: Product, variant?: string) => void;
  changeQuantity: (id: string, delta: number) => void;
  deliveryMode: DeliveryMode;
  setDeliveryMode: (mode: DeliveryMode) => void;
  toast: string;
  setToast: (toast: string) => void;
};

function StoreShell(props: ShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="storefront">
      <div className="announcement" role="status">
        <Sparkles size={15} aria-hidden="true" />
        <span>Free local delivery over $45</span>
        <span className="announcement-dot" />
        <span>Open until 7 tonight</span>
      </div>
      <Header
        cartCount={props.cartCount}
        wishlistCount={props.wishlist.length}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        setCartOpen={props.setCartOpen}
      />
      <main>
        <Switch>
          <Route path="/" component={() => <HomePage {...props} />} />
          <Route path="/shop" component={() => <ShopPage {...props} />} />
          <Route path="/product/:slug" component={() => <ProductPage {...props} />} />
          <Route path="/wishlist" component={() => <WishlistPage {...props} />} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={() => <ContactPage setToast={props.setToast} />} />
          <Route path="/return-gifts" component={() => <ReturnGiftsPage setToast={props.setToast} />} />
          <Route path="/checkout" component={() => <CheckoutPage {...props} />} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <CartDrawer {...props} />
      <a className="whatsapp-fab" href="https://wa.me/15550147863" target="_blank" rel="noreferrer" aria-label="Chat with Paper and Parcel on WhatsApp" data-testid="link-whatsapp">
        <MessageCircle size={21} aria-hidden="true" />
        <span>Need a hand?</span>
      </a>
      {props.toast && <div className="toast" role="status" data-testid="status-toast"><Check size={16} /> {props.toast}</div>}
    </div>
  );
}

function Header({ cartCount, wishlistCount, menuOpen, setMenuOpen, setCartOpen }: {
  cartCount: number;
  wishlistCount: number;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
}) {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState('');
  const suggestions = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())).slice(0, 3);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(search.trim() ? `/shop?search=${encodeURIComponent(search.trim())}` : '/shop');
    setSearch('');
  };
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" data-testid="button-toggle-navigation">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link href="/" className="wordmark" data-testid="link-home">
          <span className="wordmark-mark"><span /><span /><span /></span>
          <span>Paper <i>&</i> Parcel</span>
        </Link>
        <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <Link href="/shop" data-testid="link-shop">Shop all</Link>
          <Link href="/shop?category=Stationery" data-testid="link-stationery">Stationery</Link>
          <Link href="/shop?category=Little%20treats" data-testid="link-treats">Little treats</Link>
          <Link href="/return-gifts" data-testid="link-return-gifts">Return gifts</Link>
          <Link href="/about" data-testid="link-about">Our story</Link>
        </nav>
        <div className="header-actions">
          <form className="search-form" onSubmit={submitSearch} role="search">
            <Search size={18} aria-hidden="true" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a good thing" aria-label="Search products" data-testid="input-search-products" />
            {search && suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => <Link key={product.id} href={`/product/${product.slug}`} onClick={() => setSearch('')} data-testid={`link-search-suggestion-${product.id}`}>{product.name}<span>{money(product.price)}</span></Link>)}
                <button type="submit" data-testid="button-search-all">See all results <ArrowRight size={14} /></button>
              </div>
            )}
          </form>
          <Link href="/wishlist" className="header-icon-link" aria-label={`Wish list, ${wishlistCount} saved`} data-testid="link-wishlist">
            <Heart size={20} strokeWidth={1.7} /><span className="header-count">{wishlistCount}</span>
          </Link>
          <button className="header-icon-link" onClick={() => setCartOpen(true)} aria-label={`Open parcel, ${cartCount} items`} data-testid="button-open-cart">
            <ShoppingBag size={20} strokeWidth={1.7} /><span className="header-count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function HomePage({ addToCart, wishlist, toggleWishlist, setDeliveryMode, deliveryMode }: ShellProps) {
  const [promo, setPromo] = useState(0);
  const promos = [
    { kicker: 'THE GIFT EDIT', title: 'For the friend who makes ordinary days better.', copy: 'Small, beautiful ways to say: I saw this and thought of you.', cta: 'Shop thoughtful gifts', image: image('woman wrapping gift paper warm', 101), tone: 'promo-coral' },
    { kicker: 'A LITTLE EXTRA', title: 'Your desk called. It wants better paper.', copy: 'Notebooks, cards, and tiny rituals for the next good idea.', cta: 'Browse stationery', image: image('colorful desk stationery flatlay', 102), tone: 'promo-yellow' },
    { kicker: 'RIGHT AROUND THE CORNER', title: 'Pick up something lovely on your way home.', copy: 'Order by 5pm for same-day pickup at our Franklin Street shop.', cta: 'Find the shop', image: image('neighborhood shop storefront flowers', 103), tone: 'promo-green' },
  ];
  const current = promos[promo];
  return (
    <>
      <section className={`hero ${current.tone}`}>
        <div className="hero-copy">
          <p className="eyebrow">{current.kicker}</p>
          <h1>{current.title}</h1>
          <p className="hero-lede">{current.copy}</p>
          <Link href={promo === 2 ? '/about' : `/shop?category=${promo === 1 ? 'Stationery' : 'Curated bundles'}`} className="button button-dark" data-testid="link-hero-cta">{current.cta}<ArrowRight size={17} /></Link>
          <div className="hero-notes"><span><BadgeCheck size={16} /> Wrapped with care</span><span><Store size={16} /> Local pickup</span></div>
        </div>
        <div className="hero-image-wrap">
          <img src={current.image} alt="A warmly wrapped Paper and Parcel gift on a shop counter" />
          <span className="hero-sticker">good<br />things<br /><i>inside</i></span>
        </div>
        <div className="promo-controls">
          <button onClick={() => setPromo((promo + promos.length - 1) % promos.length)} aria-label="Previous promotion" data-testid="button-promo-previous"><ChevronLeft size={18} /></button>
          <span>{String(promo + 1).padStart(2, '0')} / 03</span>
          <button onClick={() => setPromo((promo + 1) % promos.length)} aria-label="Next promotion" data-testid="button-promo-next"><ChevronRight size={18} /></button>
        </div>
      </section>

      <section className="section intro-section">
        <div className="section-kicker"><span className="rule" /> A neighborhood habit <span className="rule" /></div>
        <h2>Come in for one card.<br /><em>Leave with a little story.</em></h2>
        <p className="section-intro">Paper & Parcel is a corner shop for the in-between moments: new homes, old friends, desk days, dinner parties, and the just-because of it all.</p>
      </section>

      <section className="category-section section-wide">
        <div className="section-heading">
          <div><p className="eyebrow">WANDER AROUND</p><h2>What are you celebrating?</h2></div>
          <Link href="/shop" className="text-link" data-testid="link-browse-everything">Browse everything <ArrowRight size={16} /></Link>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link href={`/shop?category=${encodeURIComponent(category.name)}`} className={`category-card ${category.color}`} key={category.name} data-testid={`card-category-${index}`}>
              <img src={image(category.query, 120 + index)} alt="" loading="lazy" />
              <div className="category-overlay"><p>{category.eyebrow}</p><h3>{category.name}</h3><span>Explore <ArrowRight size={15} /></span></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section featured-section">
        <div className="section-heading"><div><p className="eyebrow">THE NICE LIST</p><h2>Things that make people smile</h2></div><Link href="/shop" className="text-link" data-testid="link-shop-nice-list">See all finds <ArrowRight size={16} /></Link></div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} isWishlisted={wishlist.includes(product.id)} toggleWishlist={toggleWishlist} />)}
        </div>
      </section>

      <section className="pickup-band">
        <div className="pickup-content"><div className="pickup-icon"><Store size={24} /></div><div><p className="eyebrow">YOUR NEIGHBORHOOD, YOUR WAY</p><h2>In a hurry or making a day of it?</h2><p>Reserve online for free pickup, or let us bring the good stuff to your door.</p></div></div>
        <div className="mode-toggle" role="group" aria-label="Choose pickup or delivery">
          <button className={deliveryMode === 'pickup' ? 'is-active' : ''} onClick={() => setDeliveryMode('pickup')} data-testid="button-mode-pickup"><Store size={16} /> Pick up</button>
          <button className={deliveryMode === 'delivery' ? 'is-active' : ''} onClick={() => setDeliveryMode('delivery')} data-testid="button-mode-delivery"><Truck size={16} /> Deliver</button>
        </div>
      </section>

      <section className="section journal-section">
        <div className="journal-copy"><p className="eyebrow">FROM THE COUNTER</p><h2>Gifts for people who say “don’t get me anything.”</h2><p>Start with a good card. Add something useful. Finish with a ribbon that makes them suspicious.</p><Link href="/shop?category=Curated%20bundles" className="button button-outline" data-testid="link-gift-guide">Open the gift guide <ArrowRight size={17} /></Link></div>
        <div className="journal-image"><img src={image('hands wrapping colorful present', 145)} alt="Hands wrapping a colorful present with ribbon" loading="lazy" /><span>001<br /><b>the<br />gift<br />guide</b></span></div>
      </section>

      <Newsletter />
    </>
  );
}

function ProductCard({ product, addToCart, isWishlisted, toggleWishlist }: { product: Product; addToCart: (product: Product) => void; isWishlisted: boolean; toggleWishlist: (id: string) => void }) {
  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      <div className="product-image-wrap">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <Link href={`/product/${product.slug}`} data-testid={`link-product-${product.id}`}><img src={product.image} alt={product.name} loading="lazy" /></Link>
        <button className={`wish-button ${isWishlisted ? 'is-saved' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label={isWishlisted ? `Remove ${product.name} from wish list` : `Save ${product.name} to wish list`} data-testid={`button-wishlist-${product.id}`}><Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} /></button>
        <button className="quick-add" onClick={() => addToCart(product)} data-testid={`button-quick-add-${product.id}`}>Add to parcel <Plus size={15} /></button>
      </div>
      <div className="product-card-copy"><div><p className="product-category">{product.category}</p><Link href={`/product/${product.slug}`} className="product-name" data-testid={`link-product-name-${product.id}`}>{product.name}</Link></div><span className="product-price">{money(product.price)}</span></div>
      <div className="rating"><Star size={13} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div>
    </article>
  );
}

function ShopPage({ addToCart, wishlist, toggleWishlist }: ShellProps) {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1] || '');
  const initialCategory = params.get('category') || 'All';
  const initialSearch = params.get('search') || '';
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('Featured');
  const [query, setQuery] = useState(initialSearch);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  useEffect(() => {
    setCategory(initialCategory);
    setQuery(initialSearch);
  }, [location, initialCategory, initialSearch]);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => (category === 'All' || product.category === category) && (!query || `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())) && (!onlyInStock || product.stock > 0));
    if (sort === 'Price: low to high') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, query, onlyInStock, sort]);
  return (
    <div className="shop-page section-wide">
      <div className="shop-hero"><div><p className="eyebrow">THE WHOLE LITTLE SHOP</p><h1>Find something<br /><em>worth giving.</em></h1></div><p>Take your time. Everything here was chosen because it earns its spot on a shelf, desk, or doorstep.</p></div>
      <div className="shop-toolbar"><div className="category-pills">{['All', ...categories.map((item) => item.name)].map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} data-testid={`button-filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div><button className="filter-toggle" onClick={() => setFilterOpen(!filterOpen)} data-testid="button-toggle-filters"><SlidersHorizontal size={16} /> Filters <ChevronDown size={15} /></button></div>
      {filterOpen && <div className="filter-panel"><label htmlFor="shop-search">Search the shelves<input id="shop-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “candle” or “stationery”" data-testid="input-shop-search" /></label><label className="checkbox-label"><input type="checkbox" checked={onlyInStock} onChange={(event) => setOnlyInStock(event.target.checked)} data-testid="checkbox-in-stock" /> In stock only <span><Check size={14} /></span></label></div>}
      <div className="shop-result-row"><p><strong>{visibleProducts.length}</strong> lovely things {query && <>for “{query}”</>}</p><label className="sort-label">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" data-testid="select-sort-products"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></label></div>
      {visibleProducts.length > 0 ? <div className="product-grid shop-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} isWishlisted={wishlist.includes(product.id)} toggleWishlist={toggleWishlist} />)}</div> : <div className="empty-state"><Search size={30} /><h2>That one is hiding.</h2><p>Try another word or browse everything at once.</p><button className="button button-dark" onClick={() => { setQuery(''); setCategory('All'); }} data-testid="button-clear-filters">Clear filters</button></div>}
    </div>
  );
}

function ProductPage({ addToCart, wishlist, toggleWishlist }: ShellProps) {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((item) => item.slug === slug) || products[0];
  const [selectedImage, setSelectedImage] = useState(0);
  const [variant, setVariant] = useState(product.colors[0]);
  const gallery = [product.image, image('stationery gift detail warm light', 301), image('gift wrapping ribbon closeup', 302)];
  return (
    <div className="product-page section-wide">
      <div className="breadcrumbs"><Link href="/shop" data-testid="link-breadcrumb-shop">Shop</Link><ChevronRight size={14} /><span>{product.name}</span></div>
      <div className="product-detail">
        <div className="gallery"><div className="gallery-main"><img src={gallery[selectedImage]} alt={`${product.name}, view ${selectedImage + 1}`} /></div><div className="gallery-thumbs">{gallery.map((source, index) => <button className={selectedImage === index ? 'is-selected' : ''} onClick={() => setSelectedImage(index)} key={source} aria-label={`View image ${index + 1}`} data-testid={`button-gallery-${index}`}><img src={source} alt="" /></button>)}</div></div>
        <div className="product-detail-copy"><p className="eyebrow">{product.category} / {product.tag || 'A good find'}</p><h1>{product.name}</h1><div className="detail-rating"><span><Star size={15} fill="currentColor" /> {product.rating}</span><a href="#reviews" data-testid="link-product-reviews">{product.reviews} notes from happy people</a></div><p className="detail-price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</p><p className="detail-desc">{product.desc}</p><div className="detail-divider" /><div className="variant-label"><span>Choose a color</span><b>{variant}</b></div><div className="variant-options">{product.colors.map((color) => <button key={color} className={variant === color ? 'is-selected' : ''} onClick={() => setVariant(color)} data-testid={`button-variant-${color.toLowerCase().replaceAll(' ', '-')}`}>{color}</button>)}</div><button className="button button-dark purchase-button" onClick={() => addToCart(product, variant)} data-testid="button-add-to-cart">Add to parcel <ShoppingBag size={17} /></button><button className={`save-product ${wishlist.includes(product.id) ? 'is-saved' : ''}`} onClick={() => toggleWishlist(product.id)} data-testid="button-save-product"><Heart size={17} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /> {wishlist.includes(product.id) ? 'Saved to your wish list' : 'Save for later'}</button><div className="product-promises"><span><PackageCheck size={17} /><b>Ready to gift</b><small>We wrap every order</small></span><span><RotateCcw size={17} /><b>Easy returns</b><small>30 days, no fuss</small></span><span><Truck size={17} /><b>Local delivery</b><small>Same day in the neighborhood</small></span></div></div>
      </div>
      <section className="bundle-block"><div><p className="eyebrow">MAKE IT A MOMENT</p><h2>Complete the thought.</h2><p>Pair it with a little something extra and save 8% on the bundle.</p></div><div className="bundle-items">{[product, products[(products.findIndex((item) => item.id === product.id) + 1) % products.length]].map((item) => <div className="bundle-item" key={item.id}><img src={item.image} alt="" /><span>{item.name}<small>{money(item.price)}</small></span></div>)}<Plus size={18} /><div className="bundle-total"><span><del>{money(product.price + products[(products.findIndex((item) => item.id === product.id) + 1) % products.length].price)}</del><strong>{money((product.price + products[(products.findIndex((item) => item.id === product.id) + 1) % products.length].price) * .92)}</strong></span><button className="button button-light" onClick={() => { addToCart(product, variant); addToCart(products[(products.findIndex((item) => item.id === product.id) + 1) % products.length]); }} data-testid="button-add-bundle">Add both <ArrowRight size={16} /></button></div></div></section>
      <section className="review-section" id="reviews"><div><p className="eyebrow">KIND WORDS</p><h2>Good things, said by people.</h2></div><div className="review-feature"><div className="big-stars">★★★★★</div><blockquote>“The kind of gift that makes someone pause before they open it. Beautiful, useful, and not trying too hard.”</blockquote><p>— Margot, verified neighbor</p></div></section>
    </div>
  );
}

function WishlistPage({ addToCart, wishlist, toggleWishlist }: ShellProps) {
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <div className="section-wide simple-page"><div className="page-heading"><p className="eyebrow">KEPT FOR LATER</p><h1>Your wish list<span>.</span></h1><p>A soft landing place for things you want to remember.</p></div>{saved.length ? <div className="product-grid">{saved.map((product) => <ProductCard key={product.id} product={product} addToCart={addToCart} isWishlisted toggleWishlist={toggleWishlist} />)}</div> : <div className="empty-state"><Heart size={32} /><h2>Nothing saved yet.</h2><p>When something makes you think of someone, tap the heart.</p><Link href="/shop" className="button button-dark" data-testid="link-wishlist-shop">Find a good thing <ArrowRight size={16} /></Link></div>}</div>;
}

function AboutPage() {
  return <div className="simple-page"><section className="about-hero section-wide"><div><p className="eyebrow">SINCE 2018 / FRANKLIN STREET</p><h1>A small shop<br />with a <em>big soft spot</em><br />for people.</h1></div><img src={image('cozy independent gift shop interior', 410)} alt="The sunny interior of the Paper and Parcel shop" /></section><section className="section about-copy"><div><p className="eyebrow">WHY WE'RE HERE</p><h2>We believe a good gift is a tiny act of attention.</h2></div><div><p>Paper & Parcel started with a folding table, a box of cards, and a belief that the best shops feel a little like a friend’s kitchen. We find useful, beautiful, sometimes funny things made by people who care about the details.</p><p>Come by the shop in the afternoon for a browse, a wrapping lesson, or an opinion on whether your sister already owns too many mugs. (She doesn’t.)</p><Link href="/contact" className="text-link" data-testid="link-about-contact">Come say hello <ArrowRight size={16} /></Link></div></section><section className="locator-section section-wide"><div className="locator-card"><p className="eyebrow">COME FIND US</p><h2>Franklin Street, just past the good bakery.</h2><p>18 Franklin Street<br />Brooklyn, NY 11222</p><div className="store-hours"><span><Clock size={16} /> Mon–Sat, 10–7</span><span><Clock size={16} /> Sun, 11–5</span></div><a className="button button-light" href="https://maps.google.com/?q=18+Franklin+Street+Brooklyn" target="_blank" rel="noreferrer" data-testid="link-open-map">Open in maps <MapPin size={16} /></a></div><div className="map-art"><div className="map-pin"><MapPin size={22} /></div><span>FRANKLIN ST.</span><span>CARROLL GARDENS</span><span>THE BAKERY →</span></div></section></div>;
}

function ContactPage({ setToast }: { setToast: (message: string) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setToast('Message received — we’ll write back soon.'); (event.currentTarget as HTMLFormElement).reset(); };
  return <div className="section-wide simple-page contact-page"><div className="page-heading"><p className="eyebrow">WE'RE ALL EARS</p><h1>Talk to a real<br /><em>nice person.</em></h1><p>Questions about a gift, a pickup, or whether that card is too much? (It probably isn’t.)</p></div><div className="contact-layout"><form className="contact-form" onSubmit={submit}><label>Your name<input required name="name" placeholder="The person behind the message" data-testid="input-contact-name" /></label><label>Email address<input required type="email" name="email" placeholder="you@example.com" data-testid="input-contact-email" /></label><label>What can we help with?<textarea required name="message" rows={5} placeholder="Tell us the good stuff..." data-testid="input-contact-message" /></label><button className="button button-dark" type="submit" data-testid="button-contact-submit">Send the note <Send size={16} /></button></form><div className="contact-details"><div><Phone size={19} /><span><b>Call the shop</b><a href="tel:+15550147863" data-testid="link-phone">(555) 014-7863</a></span></div><div><Mail size={19} /><span><b>Email us</b><a href="mailto:hello@paperandparcel.shop" data-testid="link-email">hello@paperandparcel.shop</a></span></div><div><MessageCircle size={19} /><span><b>WhatsApp</b><a href="https://wa.me/15550147863" target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp">Start a chat</a></span></div><div><CircleHelp size={19} /><span><b>Usually asked</b><Link href="/return-gifts" data-testid="link-contact-returns">Return-gift information</Link></span></div></div></div></div>;
}

function ReturnGiftsPage({ setToast }: { setToast: (message: string) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setToast('We’ll put together a thoughtful quote and be in touch.'); (event.currentTarget as HTMLFormElement).reset(); };
  return <div className="return-page"><section className="return-hero section-wide"><div><p className="eyebrow">FOR THE WHOLE TEAM</p><h1>Return gifts<br /><em>with a little soul.</em></h1><p>Thoughtful, useful, and ready to hand out. Tell us who you’re celebrating and we’ll build a bundle that feels like you.</p></div><img src={image('many small gifts table colorful', 502)} alt="A table filled with colorful small gifts ready to be shared" /></section><section className="section return-info"><div><span className="number">01</span><h2>Choose a feeling.</h2><p>Welcome, thank you, nice work, we’re glad you’re here. We’ll help shape the right mix.</p></div><div><span className="number">02</span><h2>We make it easy.</h2><p>Personal notes, individual names, delivery to one address, or a tidy box for each person.</p></div><div><span className="number">03</span><h2>Everyone gets delighted.</h2><p>Starting at $18 per person, with local makers and plenty of good paper.</p></div></section><section className="section-wide return-form-section"><div><p className="eyebrow">LET'S PLAN IT</p><h2>Tell us the shape of it.</h2><p>We’ll reply within one business day with ideas and a clear, human quote.</p></div><form className="return-form" onSubmit={submit}><label>Your name / company<input required placeholder="Who are we making happy?" data-testid="input-return-name" /></label><div className="form-two"><label>How many people?<input required type="number" min="5" placeholder="25" data-testid="input-return-count" /></label><label>When do you need them?<input required type="date" data-testid="input-return-date" /></label></div><label>Anything we should know?<textarea rows={4} placeholder="Budget, colors, a theme, dietary notes..." data-testid="input-return-message" /></label><button className="button button-dark" type="submit" data-testid="button-return-submit">Start the conversation <ArrowRight size={16} /></button></form></section></div>;
}

function CheckoutPage({ cart, cartTotal, deliveryMode, setDeliveryMode, setToast }: ShellProps) {
  const [complete, setComplete] = useState(false);
  const [step, setStep] = useState(1);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (step === 1) setStep(2); else setComplete(true); };
  if (complete) return <div className="checkout-complete"><div className="complete-mark"><Check size={30} /></div><p className="eyebrow">ON ITS WAY</p><h1>That was a lovely thing to do.</h1><p>Your parcel is being prepared with extra care. We’ll send the details to your inbox shortly.</p><Link href="/" className="button button-dark" data-testid="link-checkout-home">Back to the shop <ArrowRight size={16} /></Link></div>;
  return <div className="checkout-page section-wide"><div className="checkout-main"><div className="checkout-progress"><span className={step >= 1 ? 'is-active' : ''}>01 <b>Your details</b></span><i /><span className={step >= 2 ? 'is-active' : ''}>02 <b>Review & pay</b></span></div><form onSubmit={submit}>{step === 1 ? <div className="checkout-form"><p className="eyebrow">A FEW DETAILS</p><h1>Where should we send<br /><em>the good stuff?</em></h1><div className="delivery-choice"><button type="button" className={deliveryMode === 'pickup' ? 'is-active' : ''} onClick={() => setDeliveryMode('pickup')} data-testid="button-checkout-pickup"><Store size={19} /><b>Pick up in store</b><small>Ready today at Franklin Street</small></button><button type="button" className={deliveryMode === 'delivery' ? 'is-active' : ''} onClick={() => setDeliveryMode('delivery')} data-testid="button-checkout-delivery"><Truck size={19} /><b>Local delivery</b><small>Same-day from $5</small></button></div><div className="form-two"><label>First name<input required placeholder="Maya" data-testid="input-checkout-first" /></label><label>Last name<input required placeholder="Chen" data-testid="input-checkout-last" /></label></div><label>Email<input required type="email" placeholder="you@example.com" data-testid="input-checkout-email" /></label>{deliveryMode === 'delivery' && <label>Delivery address<input required placeholder="123 Somewhere Street" data-testid="input-checkout-address" /></label>}<label>Gift note <span className="optional">optional</span><textarea rows={3} placeholder="A little note from you..." data-testid="input-checkout-note" /></label><button className="button button-dark checkout-next" type="submit" data-testid="button-checkout-next">Continue to review <ArrowRight size={16} /></button></div> : <div className="checkout-form"><p className="eyebrow">LAST LOOK</p><h1>Ready to send<br /><em>some love?</em></h1><div className="payment-placeholder"><BadgeCheck size={21} /><div><b>Secure demo checkout</b><p>No payment is collected in this frontend preview.</p></div></div><label>Card number<input required inputMode="numeric" placeholder="4242 4242 4242 4242" data-testid="input-card-number" /></label><div className="form-two"><label>Expiry<input required placeholder="09 / 28" data-testid="input-card-expiry" /></label><label>Security code<input required placeholder="123" data-testid="input-card-cvc" /></label></div><button className="button button-dark checkout-next" type="submit" data-testid="button-place-order">Place the order <Check size={16} /></button><button type="button" className="back-button" onClick={() => setStep(1)} data-testid="button-checkout-back"><ChevronLeft size={15} /> Back to details</button></div>}</form></div><aside className="order-summary"><p className="eyebrow">YOUR PARCEL</p><h2>{cart.length ? `${cart.length} thoughtful ${cart.length === 1 ? 'thing' : 'things'}` : 'A quiet little parcel'}</h2>{cart.length ? cart.map((item) => <div className="summary-item" key={item.product.id}><img src={item.product.image} alt="" /><span>{item.product.name}<small>{item.quantity} × {money(item.product.price)}</small></span><b>{money(item.quantity * item.product.price)}</b></div>) : <p className="summary-empty">Your bag is waiting for something lovely.</p>}<div className="summary-total"><span>Subtotal</span><b>{money(cartTotal)}</b></div><div className="summary-total muted"><span>{deliveryMode === 'pickup' ? 'Pickup' : 'Local delivery'}</span><b>{deliveryMode === 'pickup' ? 'Free' : cartTotal > 45 ? 'Free' : '$5.00'}</b></div><div className="summary-total grand"><span>Total</span><b>{money(cartTotal + (deliveryMode === 'delivery' && cartTotal <= 45 ? 5 : 0))}</b></div></aside></div>;
}

function Newsletter() {
  const [joined, setJoined] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setJoined(true); };
  return <section className="newsletter section-wide"><div><p className="eyebrow">A NOTE FROM THE SHOP</p><h2>Good things, once in a while.</h2><p>New finds, local makers, and the occasional very good excuse to send a card.</p></div>{joined ? <div className="joined-message"><Check size={20} /><b>You're on the list.</b><span>We'll keep it worth opening.</span></div> : <form onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" required type="email" placeholder="Your email address" data-testid="input-newsletter-email" /><button className="button button-dark" type="submit" data-testid="button-newsletter-submit">Join us <ArrowRight size={16} /></button></form>}</section>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top section-wide"><div className="footer-brand"><Link href="/" className="wordmark" data-testid="link-footer-home"><span className="wordmark-mark"><span /><span /><span /></span><span>Paper <i>&</i> Parcel</span></Link><p>A neighborhood gift shop for the people you love, the places you’re going, and the little things worth noticing.</p><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Paper and Parcel on Instagram" data-testid="link-instagram"><Instagram size={19} /> @paperandparcel</a></div><div className="footer-links"><div><p className="eyebrow">Explore</p><Link href="/shop" data-testid="link-footer-shop">Shop all</Link><Link href="/about" data-testid="link-footer-about">Our story</Link><Link href="/return-gifts" data-testid="link-footer-return-gifts">Return gifts</Link></div><div><p className="eyebrow">Need us?</p><Link href="/contact" data-testid="link-footer-contact">Contact</Link><a href="mailto:hello@paperandparcel.shop" data-testid="link-footer-email">Email the shop</a><a href="https://wa.me/15550147863" target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp">WhatsApp</a></div><div><p className="eyebrow">Visit</p><p>18 Franklin Street<br />Brooklyn, NY 11222</p><p>Mon–Sat 10–7<br />Sun 11–5</p></div></div></div><div className="footer-bottom section-wide"><span>© 2025 Paper & Parcel</span><span>Made for sending more love around.</span><span>Pickup · Delivery · Good advice</span></div></footer>;
}

function CartDrawer({ cart, cartCount, cartTotal, cartOpen, setCartOpen, changeQuantity, deliveryMode }: ShellProps) {
  if (!cartOpen) return null;
  return <div className="drawer-layer" role="dialog" aria-modal="true" aria-label="Your parcel"><button className="drawer-scrim" onClick={() => setCartOpen(false)} aria-label="Close parcel" data-testid="button-close-cart-scrim" /><aside className="cart-drawer"><div className="drawer-head"><div><p className="eyebrow">YOUR PARCEL</p><h2>{cartCount ? `${cartCount} ${cartCount === 1 ? 'thing' : 'things'} inside` : 'It’s looking light'}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close parcel" data-testid="button-close-cart"><X size={21} /></button></div>{cart.length ? <><div className="drawer-items">{cart.map((item) => <div className="drawer-item" key={`${item.product.id}-${item.variant}`}><img src={item.product.image} alt="" /><div><Link href={`/product/${item.product.slug}`} onClick={() => setCartOpen(false)} data-testid={`link-cart-item-${item.product.id}`}>{item.product.name}</Link><small>{item.variant} / {money(item.product.price)}</small><div className="quantity"><button onClick={() => changeQuantity(item.product.id, -1)} aria-label={`Decrease ${item.product.name}`} data-testid={`button-decrease-${item.product.id}`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.product.id, 1)} aria-label={`Increase ${item.product.name}`} data-testid={`button-increase-${item.product.id}`}><Plus size={13} /></button></div></div><b>{money(item.product.price * item.quantity)}</b></div>)}</div><div className="drawer-bottom"><div className="drawer-note"><Gift size={17} /> Every parcel is wrapped by hand.</div><div className="drawer-total"><span>Subtotal</span><b>{money(cartTotal)}</b></div><Link href="/checkout" className="button button-dark full-button" onClick={() => setCartOpen(false)} data-testid="link-checkout">Go to checkout <ArrowRight size={17} /></Link><p className="drawer-delivery">{deliveryMode === 'pickup' ? 'Free pickup from Franklin Street' : 'Local delivery from $5'}</p></div></> : <div className="drawer-empty"><ShoppingBag size={33} /><h3>Room for one good thing.</h3><p>We’ll keep your parcel here while you browse.</p><Link href="/shop" className="button button-dark" onClick={() => setCartOpen(false)} data-testid="link-drawer-shop">Find something lovely</Link></div>}</aside></div>;
}

export default App;