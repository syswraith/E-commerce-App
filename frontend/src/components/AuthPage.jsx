import { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import ConsentModal from './ConsentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Consent States
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentTelemetry, setConsentTelemetry] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [consentShake, setConsentShake] = useState(false);

  // UI status states
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Empty', color: '#71717a' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: '#71717a' };
    if (score <= 3) return { score: 2, text: 'Medium', color: '#a1a1aa' };
    return { score: 3, text: 'Strong', color: '#fafafa' };
  };

  const passwordStrength = getPasswordStrength(password);

  const switchMode = (next) => {
    setMode(next);
    setErrorMsg('');
  };

  // Demo user quick login
  const handleDemoLogin = () => {
    setEmail('demo@store.com');
    setPassword('password123');
    setErrorMsg('');
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please provide both email and password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should contain at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }
      if (!consentAccepted) {
        setConsentShake(true);
        setTimeout(() => setConsentShake(false), 500);
        setErrorMsg('Consent Required: You must accept the statutory terms & privacy agreement to register.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'register' ? 'http://localhost:5000/api/auth/register' : 'http://localhost:5000/api/auth/login';
      const payload = mode === 'register'
        ? { name: name.trim(), email: email.trim().toLowerCase(), password, consentAccepted, consentTelemetry, consentMarketing }
        : { email: email.trim().toLowerCase(), password };

      let authSuccess = false;
      let authenticatedUser = null;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          authSuccess = true;
          authenticatedUser = data.user;
        } else {
          const errData = await response.json();
          if (errData?.error) {
            setErrorMsg(errData.error);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        console.info('Backend unreachable, using local storage authentication mock.');
      }

      if (!authSuccess) {
        const storedUsers = JSON.parse(localStorage.getItem('aetheria_users') || '[]');

        if (mode === 'register') {
          const userExists = storedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (userExists) {
            setErrorMsg('An account with this email already exists.');
            setIsLoading(false);
            return;
          }

          const newUser = {
            id: `usr_${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: 'VIP Member',
            consentAccepted: true,
            consentTimestamp: new Date().toISOString(),
            marketingConsent: consentMarketing,
          };

          storedUsers.push(newUser);
          localStorage.setItem('aetheria_users', JSON.stringify(storedUsers));
          authenticatedUser = { ...newUser };
          delete authenticatedUser.password;
        } else {
          if (email.toLowerCase() === 'demo@store.com' && password === 'password123') {
            authenticatedUser = {
              id: 'usr_demo',
              name: 'Alex Vance',
              email: 'demo@store.com',
              role: 'VIP Gold',
              consentAccepted: true,
              consentTimestamp: new Date().toISOString(),
            };
          } else {
            const found = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
            if (found) {
              authenticatedUser = { ...found };
              delete authenticatedUser.password;
            } else {
              setErrorMsg('Invalid email or password. You can click "Fill Demo Credentials" below.');
              setIsLoading(false);
              return;
            }
          }
        }
      }

      setSuccessMsg(mode === 'register' ? 'Account created & consent registered!' : 'Authenticated successfully!');

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(authenticatedUser);
      }, 900);
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -top-[15%] left-[10%] size-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_70%)] blur-[50px]" />
      <div className="pointer-events-none absolute -bottom-[10%] right-[10%] size-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_70%)] blur-[50px]" />

      {/* Main Auth Card */}
      <div className="animate-fade-in relative z-10 w-full max-w-[480px] rounded-3xl border border-white/10 bg-card p-9 px-9 shadow-card">

        {/* Brand Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex size-[52px] items-center justify-center rounded-2xl bg-foreground">
            <ShoppingBag size={28} className="text-background" />
          </div>
          <div>
            <h1 className="text-[1.45rem] leading-none font-extrabold tracking-tight text-foreground">
              AETHER<span className="text-gradient-gold">IA</span>
            </h1>
            <p className="mt-1 text-[0.8rem] text-muted-foreground">Curated Luxury Tech & Bespoke Lifestyle</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={mode} onValueChange={switchMode} className="mb-7">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-0 rounded-xl border border-white/8 bg-white/[0.03] p-1">
            <TabsTrigger
              value="login"
              className={cn(
                'rounded-[10px] px-4 py-[0.65rem] text-[0.88rem] font-semibold text-muted-foreground transition-all',
                'data-[state=active]:border data-[state=active]:border-white/15 data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-sm'
              )}
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className={cn(
                'rounded-[10px] px-4 py-[0.65rem] text-[0.88rem] font-semibold text-muted-foreground transition-all',
                'data-[state=active]:border data-[state=active]:border-white/15 data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-sm'
              )}
            >
              Create Account
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="animate-fade-in mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-[0.85rem] text-[0.84rem] text-zinc-200">
            <AlertCircle size={18} className="shrink-0 text-muted-foreground" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="animate-fade-in mb-5 flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-[0.85rem] text-[0.84rem] text-foreground">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMsg} Redirecting to store dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.15rem]">

          {/* Register Name Field */}
          {mode === 'register' && (
            <div className="animate-fade-in flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative flex items-center">
                <User size={18} className="pointer-events-none absolute left-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-auto rounded-xl py-[0.78rem] pl-[2.85rem] text-[0.9rem]"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative flex items-center">
              <Mail size={18} className="pointer-events-none absolute left-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-auto rounded-xl py-[0.78rem] pl-[2.85rem] text-[0.9rem]"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-[0.78rem] text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => alert('Password reset link sent to registered email address (Mock Demo).')}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock size={18} className="pointer-events-none absolute left-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-auto rounded-xl py-[0.78rem] pl-[2.85rem] pr-11 text-[0.9rem]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength bar in register mode */}
            {mode === 'register' && password && (
              <div className="animate-fade-in mt-1.5 flex items-center justify-between">
                <div className="mr-3 h-1 flex-1 overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full transition-[width,background-color] duration-300"
                    style={{ width: `${(passwordStrength.score / 3) * 100}%`, backgroundColor: passwordStrength.color }}
                  />
                </div>
                <span className="text-[0.74rem] font-semibold text-muted-foreground">
                  Strength: {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          {/* Register Confirm Password Field */}
          {mode === 'register' && (
            <div className="animate-fade-in flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative flex items-center">
                <Lock size={18} className="pointer-events-none absolute left-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    'h-auto rounded-xl py-[0.78rem] pl-[2.85rem] text-[0.9rem]',
                    confirmPassword && confirmPassword === password && 'border-white/40'
                  )}
                  required
                />
                {confirmPassword && confirmPassword === password && (
                  <Check size={18} className="absolute right-4 text-foreground" />
                )}
              </div>
            </div>
          )}

          {/* Consent (register only) */}
          {mode === 'register' && (
            <div
              className={cn(
                'animate-fade-in mt-1.5 flex flex-col gap-3 rounded-[14px] border p-4 shadow-sm transition-colors',
                consentAccepted
                  ? 'border-white/25 bg-white/[0.04]'
                  : 'border-white/10 bg-white/[0.02]',
                consentShake && 'animate-shake'
              )}
            >
              <div className="flex items-center justify-between border-b border-white/8 pb-2">
                <div className="flex items-center gap-[0.45rem] text-[0.78rem] font-bold text-zinc-300">
                  <ShieldCheck size={16} className="text-foreground" />
                  <span>Mandatory Consent & Agreement</span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-[0.35rem] text-[0.74rem] text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsConsentModalOpen(true)}
                >
                  <span>Review Policy</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* Primary Consent Checkbox (REQUIRED) */}
              <label className="flex cursor-pointer items-start gap-[0.65rem]">
                <Checkbox
                  checked={consentAccepted}
                  onCheckedChange={(v) => setConsentAccepted(v === true)}
                  className="mt-0.5"
                />
                <span className="text-[0.79rem] leading-snug text-zinc-200">
                  <strong>I unconditionally accept</strong> the Terms of Service, Privacy Policy, and E-Commerce End-User Statutory Consent.
                  <span className="ml-1.5 inline-block rounded-md border border-white/15 bg-white/[0.06] px-1.5 py-px text-[0.66rem] font-bold text-zinc-300">
                    Required
                  </span>
                </span>
              </label>

              {/* Telemetry */}
              <label className="mt-[0.4rem] flex cursor-pointer items-start gap-[0.65rem]">
                <Checkbox
                  checked={consentTelemetry}
                  onCheckedChange={(v) => setConsentTelemetry(v === true)}
                  className="mt-0.5"
                />
                <span className="text-[0.74rem] leading-snug text-muted-foreground">
                  Consent to AI product recommendation cookies and shopping session telemetry.
                </span>
              </label>

              {/* Marketing */}
              <label className="mt-[0.4rem] flex cursor-pointer items-start gap-[0.65rem]">
                <Checkbox
                  checked={consentMarketing}
                  onCheckedChange={(v) => setConsentMarketing(v === true)}
                  className="mt-0.5"
                />
                <span className="text-[0.74rem] leading-snug text-muted-foreground">
                  Receive early access to limited luxury drops and seasonal discount codes.
                </span>
              </label>
            </div>
          )}

          {/* Remember Me (login only) */}
          {mode === 'login' && (
            <div className="mt-[-0.25rem] flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-[0.65rem]">
                <Checkbox checked={rememberMe} onCheckedChange={(v) => setRememberMe(v === true)} />
                <span className="text-[0.85rem] text-muted-foreground">Remember my session</span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gradient"
            disabled={isLoading}
            className="mt-2 h-auto rounded-xl py-[0.9rem] text-[0.94rem] font-bold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-[0.65rem]">
                <span className="size-[18px] animate-spin rounded-full border-2 border-background/30 border-t-background" />
                <span>Authenticating Credentials...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>{mode === 'login' ? 'Sign In to Store' : 'Complete Registration'}</span>
                <ArrowRight size={18} />
              </span>
            )}
          </Button>
        </form>

        {/* Demo Credentials Quick-Fill */}
        {mode === 'login' && (
          <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-[0.9rem]">
            <div className="mb-1 flex items-center gap-[0.45rem]">
              <Sparkles size={16} className="text-foreground" />
              <span className="text-[0.8rem] font-bold text-zinc-200">Quick Evaluation Access</span>
            </div>
            <p className="mb-[0.6rem] text-[0.74rem] text-muted-foreground">
              Test with one-click pre-configured credentials:
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full py-2 text-[0.78rem]"
            >
              Fill Demo Credentials (demo@store.com)
            </Button>
          </div>
        )}
      </div>

      <ConsentModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onAccept={() => setConsentAccepted(true)}
      />
    </div>
  );
}
