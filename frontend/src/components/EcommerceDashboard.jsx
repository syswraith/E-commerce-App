import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Heart,
  LogOut,
  Sparkles,
  Star,
  Eye,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  ShieldCheck,
  Package,
  CreditCard,
  Award,
  SlidersHorizontal,
  ArrowRight,
  Tag,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Audio', 'Smartwatches', 'Fashion', 'Electronics', 'Home Living'];

export default function EcommerceDashboard({ user, onLogout }) {
  const [products] = useState(MOCK_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const [cart, setCart] = useState([{ ...MOCK_PRODUCTS[0], quantity: 1 }]);
  const [wishlist, setWishlist] = useState(['prod-2']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  const showToast = (message) => toast.success(message);

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Removed from your wishlist.');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Added to your wishlist!');
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 24)}..." to cart.`);
  };

  const updateQuantity = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
    showToast('Item removed from cart.');
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'AETHER20' || clean === 'WELCOME20') {
      setDiscountPercent(20);
      setPromoMessage('20% VIP promotional discount applied!');
      showToast('Promo code applied: 20% OFF!');
    } else if (clean === 'SAVE10') {
      setDiscountPercent(10);
      setPromoMessage('10% discount applied!');
      showToast('Promo code applied: 10% OFF!');
    } else {
      setPromoMessage('Invalid promo code. Try AETHER20');
    }
  };

  const filteredProducts = useMemo(() => {
    const result = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'low-high') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'high-low') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLastOrderDetails({
      orderId: `AET-${Math.floor(100000 + Math.random() * 900000)}`,
      total: grandTotal,
      itemCount: totalCartCount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutSuccessOpen(true);
  };

  const metrics = [
    { icon: CreditCard, label: 'Member Balance', value: '$1,450.00' },
    { icon: Package, label: 'Active Orders', value: '2 In Transit' },
    { icon: Award, label: 'Reward Points', value: '1,850 pts' },
    { icon: ShieldCheck, label: 'Consent Status', value: 'Active & Verified' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="border-b border-white/8 bg-white/[0.03] px-6 py-[0.45rem] text-center text-[0.8rem] text-zinc-400">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="rounded bg-foreground px-2 py-px text-[0.68rem] font-extrabold tracking-wider text-background">
            VIP EXCLUSIVE
          </span>
          <span>
            Complimentary Express Delivery on orders over $150 • Use coupon <strong className="text-foreground">AETHER20</strong> for 20% off
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-6 py-[0.85rem]">

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-foreground">
              <ShoppingBag size={22} className="text-background" />
            </div>
            <div>
              <span className="text-[1.2rem] leading-none font-extrabold tracking-tight text-foreground">
                AETHER<span className="text-muted-foreground">IA</span>
              </span>
              <span className="mt-0.5 block text-[0.62rem] font-bold tracking-[0.12em] text-muted-foreground">
                PREMIUM COMMERCE
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex max-w-[480px] flex-1 items-center">
            <Search size={18} className="pointer-events-none absolute left-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search audio, watches, fashion, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-auto rounded-xl py-[0.65rem] pr-10 pl-11 text-[0.88rem]"
            />
            {searchQuery && (
              <button
                className="absolute right-3.5 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Action Icons & Profile */}
          <div className="flex items-center gap-4">

            {/* Wishlist Button */}
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-[10px]"
              title="Saved Wishlist"
              onClick={() => showToast(`You have ${wishlist.length} items in your wishlist.`)}
            >
              <Heart
                size={20}
                className={wishlist.length > 0 ? 'text-foreground' : 'text-muted-foreground'}
                fill={wishlist.length > 0 ? 'currentColor' : 'none'}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-[18px] items-center justify-center rounded-full bg-foreground text-[0.65rem] font-extrabold text-background">
                  {wishlist.length}
                </span>
              )}
            </Button>

            {/* Cart Trigger */}
            <Button
              onClick={() => setIsCartOpen(true)}
              className="gap-[0.6rem] rounded-xl px-[1.1rem] py-[0.55rem]"
              aria-label="View shopping cart"
            >
              <ShoppingBag size={20} />
              <span className="font-bold">Cart</span>
              <span className="rounded-lg bg-background/15 px-[7px] py-px text-[0.78rem] font-extrabold">
                {totalCartCount}
              </span>
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex cursor-pointer items-center gap-[0.6rem] rounded-xl outline-none">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-[0.82rem] font-semibold text-foreground">{user?.name || 'Guest User'}</span>
                    <span className="text-[0.7rem] text-muted-foreground">{user?.role || 'VIP Member'}</span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="flex flex-col gap-1 px-2 py-2">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.7rem] font-semibold text-zinc-300">
                    <ShieldCheck size={13} /> Consent Verified & Accepted
                  </span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-[0.82rem]">
                  <Award size={16} className="text-muted-foreground" />
                  <span>Tier: <strong>{user?.role || 'VIP Member'}</strong></span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-[0.82rem]">
                  <CreditCard size={16} className="text-muted-foreground" />
                  <span>Store Credit: <strong>$150.00</strong></span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-[0.82rem] cursor-pointer"
                  onSelect={() => onLogout()}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </header>

      {/* 3. WELCOME & QUICK METRICS BANNER */}
      <section className="mx-auto w-full max-w-[1360px] px-6 pt-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">

          {/* Welcome Card */}
          <Card className="justify-center gap-4 border-white/10 bg-card p-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-bold tracking-wide text-zinc-300">
              <Sparkles size={16} className="text-foreground" />
              AUTHENTICATED MEMBER SESSION
            </span>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back,{' '}
              <span className="text-muted-foreground">{user?.name || 'Valued Member'}</span>
            </h2>
            <p className="text-[0.88rem] leading-relaxed text-muted-foreground">
              Your statutory consent is on file. Explore bespoke collections, apply exclusive coupons, and enjoy same-day priority dispatch.
            </p>
          </Card>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {metrics.map(({ icon: Icon, label, value }) => (
              <Card
                key={label}
                className="flex-row items-center gap-4 border-white/10 bg-card p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03]">
                  <Icon size={20} className="text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.75rem] text-muted-foreground">{label}</span>
                  <p className="text-lg font-bold text-foreground">{value}</p>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </section>

      {/* 4. HERO PROMOTIONAL BANNER */}
      <section className="mx-auto w-full max-w-[1360px] px-6 pt-6">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-8 shadow-card">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.7rem] font-bold tracking-wider text-zinc-300">
              SPRING LUXURY DROPS
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-foreground">
              Precision Engineering Meets Timeless Luxury
            </h2>
            <p className="mt-3 text-[0.92rem] text-muted-foreground">
              Discover flagship audio instruments, biometric titanium watches, and handcrafted Tuscan leather essentials.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button
                variant="gradient"
                className="h-auto rounded-xl px-5 py-[0.65rem]"
                onClick={() => {
                  setSelectedCategory('Audio');
                  showToast('Filtered by Audio collection.');
                }}
              >
                <span>Shop Audio Flagships</span>
                <ArrowRight size={18} />
              </Button>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-[0.8rem] text-zinc-300">
                <span>Use Code:</span>
                <code className="font-mono font-bold text-foreground">AETHER20</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FILTER & SORT CONTROLS */}
      <section className="mx-auto w-full max-w-[1360px] flex-1 px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="h-auto rounded-full px-4 py-[0.45rem] text-[0.8rem]"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Sort & Counter */}
          <div className="flex items-center gap-4">
            <span className="text-[0.8rem] text-muted-foreground">
              Showing <strong className="text-foreground">{filteredProducts.length}</strong> products
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[230px] rounded-xl">
                <SlidersHorizontal size={15} className="text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured Curations</SelectItem>
                <SelectItem value="low-high">Price: Low to High</SelectItem>
                <SelectItem value="high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Customer Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* 6. PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] py-20 text-center">
            <p className="text-lg font-semibold text-foreground">No matching products found</p>
            <p className="text-[0.85rem] text-muted-foreground">Try adjusting your search query or reset category filter.</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(product => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <Card
                  key={product.id}
                  className="animate-fade-in group gap-0 overflow-hidden border-white/10 bg-card p-0 transition-all hover:border-white/20"
                >
                  {/* Image Container */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge variant="indigo" className="absolute top-3 left-3 font-bold">
                      {product.tag}
                    </Badge>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Toggle wishlist"
                      className={cn(
                        'absolute top-3 right-3 size-9 rounded-full border backdrop-blur-md',
                        isWishlisted
                          ? 'border-white/20 bg-white/20 text-foreground hover:bg-white/30'
                          : 'border-white/15 bg-black/40 text-foreground hover:bg-black/60'
                      )}
                    >
                      <Heart
                        size={18}
                        fill={isWishlisted ? 'currentColor' : 'none'}
                      />
                    </Button>

                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-3 left-1/2 h-auto -translate-x-1/2 rounded-lg px-4 py-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Eye size={16} />
                      <span>Quick View</span>
                    </Button>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[0.68rem]">{product.category}</Badge>
                      <div className="flex items-center gap-1 text-[0.78rem] text-zinc-300">
                        <Star size={13} className="text-foreground" fill="currentColor" />
                        <span className="font-semibold">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="line-clamp-2 text-[1rem] leading-snug font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-muted-foreground">
                      {product.description.slice(0, 85)}...
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-foreground">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-[0.85rem] text-zinc-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                        className="gap-1.5 rounded-lg px-3 py-[0.45rem]"
                      >
                        <Plus size={16} />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. SLIDE-OUT CART DRAWER */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full gap-0 border-white/10 bg-surface p-0 sm:max-w-md">
          {/* Drawer Header */}
          <div className="flex items-center gap-2.5 border-b border-white/8 px-6 py-5 pr-14">
            <ShoppingBag size={22} className="text-foreground" />
            <SheetTitle className="text-lg">Your Cart ({totalCartCount})</SheetTitle>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag size={48} className="mb-4 text-muted-foreground" />
                <p className="font-semibold text-foreground">Your shopping cart is empty</p>
                <p className="mt-1 text-[0.82rem] text-muted-foreground">
                  Browse our luxury collections and add your favorite items.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
                    <img src={item.image} alt={item.name} className="size-20 shrink-0 rounded-lg object-cover grayscale" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h4 className="line-clamp-2 text-[0.85rem] font-semibold text-foreground">{item.name}</h4>
                      <span className="mt-1 text-[0.9rem] font-bold text-foreground">${item.price}</span>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-0.5">
                          <Button size="icon" variant="ghost" className="size-7" onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">
                            <Minus size={14} />
                          </Button>
                          <span className="w-7 text-center text-[0.85rem] font-bold text-foreground">{item.quantity}</span>
                          <Button size="icon" variant="ghost" className="size-7" onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-white/8 bg-black/40 px-6 py-5">
              {/* Promo */}
              <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
                <div className="relative flex flex-1 items-center">
                  <Tag size={16} className="pointer-events-none absolute left-3.5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Promo code (try AETHER20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-auto rounded-lg py-[0.55rem] pl-10 text-[0.82rem]"
                  />
                </div>
                <Button type="submit" size="sm" className="h-auto rounded-lg py-[0.6rem]">Apply</Button>
              </form>

              {promoMessage && (
                <p className="mt-2 text-[0.78rem] text-muted-foreground">
                  {promoMessage}
                </p>
              )}

              {/* Totals */}
              <div className="mt-4 flex flex-col gap-2 text-[0.85rem] text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-foreground">
                    <span>VIP Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-[0.95rem] font-bold text-foreground">
                  <span>Total Due</span>
                  <span className="text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="gradient"
                onClick={handleCheckout}
                className="mt-4 h-auto w-full rounded-xl py-[0.8rem]"
              >
                <span>Proceed to Instant Checkout</span>
                <ArrowRight size={18} />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* 8. QUICK VIEW PRODUCT MODAL */}
      <Dialog open={quickViewProduct !== null} onOpenChange={(open) => { if (!open) setQuickViewProduct(null); }}>
        <DialogContent className="max-w-4xl gap-0 p-0">
          {quickViewProduct && (
            <div className="grid gap-0 md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-t-lg md:h-full md:rounded-l-lg md:rounded-tr-none">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} className="size-full object-cover grayscale" />
                <Badge variant="indigo" className="absolute top-4 left-4 font-bold">{quickViewProduct.tag}</Badge>
              </div>

              <div className="flex flex-col gap-4 p-6 pr-12">
                <Badge variant="secondary" className="w-fit">{quickViewProduct.category}</Badge>
                <DialogTitle className="text-xl font-bold">{quickViewProduct.name}</DialogTitle>

                <div className="flex items-center gap-1.5 text-[0.82rem] text-zinc-300">
                  <Star size={14} className="text-foreground" fill="currentColor" />
                  <span className="font-semibold">{quickViewProduct.rating}</span>
                  <span className="text-muted-foreground">({quickViewProduct.reviewsCount} verified customer reviews)</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-extrabold text-foreground">${quickViewProduct.price}</span>
                  {quickViewProduct.originalPrice && (
                    <span className="text-[0.95rem] text-zinc-500 line-through">${quickViewProduct.originalPrice}</span>
                  )}
                  <Badge variant="success" className="font-semibold">In Stock & Ready to Ship</Badge>
                </div>

                <p className="text-[0.85rem] leading-relaxed text-muted-foreground">{quickViewProduct.description}</p>

                {quickViewProduct.features && (
                  <div className="flex flex-col gap-2">
                    {quickViewProduct.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[0.82rem] text-zinc-200">
                        <Check size={14} className="shrink-0 text-foreground" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="gradient"
                  className="mt-2 h-auto rounded-xl py-[0.7rem]"
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Shopping Cart</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 9. ORDER CONFIRMATION MODAL */}
      <Dialog open={isCheckoutSuccessOpen} onOpenChange={setIsCheckoutSuccessOpen}>
        <DialogContent className="max-w-md text-center">
          {lastOrderDetails && (
            <>
              <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <CheckCircle2 size={44} className="text-foreground" />
              </div>

              <DialogTitle className="text-xl">Order Successfully Placed!</DialogTitle>
              <p className="text-[0.85rem] text-muted-foreground">
                Thank you for shopping at AETHERIA. Your simulated order has been registered and is being processed.
              </p>

              <div className="flex flex-col gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] p-4 text-left text-[0.83rem]">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Order Reference:</span>
                  <strong className="text-foreground">{lastOrderDetails.orderId}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Settled:</span>
                  <strong className="text-foreground">${lastOrderDetails.total.toFixed(2)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Items Count:</span>
                  <span className="text-zinc-200">{lastOrderDetails.itemCount} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="text-zinc-200">{lastOrderDetails.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Consent Record:</span>
                  <span className="flex items-center gap-1 text-foreground">
                    <ShieldCheck size={14} /> Stored on File
                  </span>
                </div>
              </div>

              <Button variant="gradient" className="h-auto w-full rounded-xl py-[0.7rem]" onClick={() => setIsCheckoutSuccessOpen(false)}>
                Continue Shopping
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
