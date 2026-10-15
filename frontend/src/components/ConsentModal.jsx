import { ShieldCheck, FileText, CheckCircle2, Lock, Eye, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SECTIONS = [
  {
    icon: Lock,
    title: '1. Account Security & Verification',
    text: 'By creating an AETHERIA member account, you agree to safeguard your credentials and accept sole responsibility for all transactional activities originating under your authenticated identity. Multi-factor verification tokens are cryptographically secured.',
  },
  {
    icon: Eye,
    title: '2. Algorithmic Personalization & Cookie Consent',
    text: 'You consent to the processing of navigational telemetry, catalog dwell times, and shopping preferences to provide bespoke product recommendations, dynamic pricing discounts, and personalized curated drops.',
  },
  {
    icon: FileText,
    title: '3. E-Commerce Transactions & Buyer Shield',
    text: 'All mock credit line settlements, instant checkout tokens, and digital delivery confirmations adhere to international e-commerce standards. Returns are authorized within 30 days of shipment receipt with prepaid courier tracking.',
  },
  {
    icon: CheckCircle2,
    title: '4. Member Rights & Opt-Out Guarantee',
    text: 'You retain full statutory rights to export your profile telemetry or revoke optional promotional dispatch tokens anytime from your member security dashboard.',
  },
];

export default function ConsentModal({ isOpen, onClose, onAccept }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[620px] gap-0 p-0">
        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-white/8 bg-white/[0.02] px-6 py-5">
          <div className="flex size-[42px] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <ShieldCheck size={22} className="text-foreground" />
          </div>
          <div className="pr-8">
            <DialogTitle className="text-[1.15rem]">Consent & User Terms Agreement</DialogTitle>
            <DialogDescription className="mt-0.5 text-[0.8rem]">
              Mandatory statutory consent for digital account creation
            </DialogDescription>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mx-6 mt-4 flex items-center gap-3 rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.82rem] text-zinc-300">
          <AlertCircle size={18} className="shrink-0 text-muted-foreground" />
          <span>
            Please review the following consent terms regarding account privileges, data usage, and e-commerce compliance.
          </span>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex flex-col gap-[1.1rem] overflow-y-auto px-6 py-4 leading-relaxed">
          {SECTIONS.map(({ icon: Icon, title, text }) => (
            <section key={title} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <Icon size={16} className="text-muted-foreground" />
                <h4 className="text-[0.92rem] font-semibold text-zinc-200">{title}</h4>
              </div>
              <p className="text-[0.82rem] text-muted-foreground">{text}</p>
            </section>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/8 bg-black/40 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={() => {
              onAccept();
              onClose();
            }}
          >
            <CheckCircle2 size={18} />
            <span>I Have Read & Accept Consent</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
