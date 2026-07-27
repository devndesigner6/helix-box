import React, { useState } from 'react';
import { X, Check, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

export const DemoModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    interest: 'Mobile IDE & PTY Terminal'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#ffffff] text-[#232323] w-full max-w-lg rounded-3xl border border-[#c3c2b2] shadow-2xl p-8 relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f0efe3] border border-[#c3c2b2] flex items-center justify-center text-[#555555] hover:text-[#232323] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-cabinet font-black text-2xl text-[#232323] mb-2">Request Received!</h3>
            <p className="text-sm text-[#555555]">Our team will reach out within 24 hours to schedule your personalized Helix Box demo.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0b4fff]" />
              <span className="font-mono text-xs font-bold text-[#0b4fff] uppercase tracking-wider">HELIX BOX DEMO</span>
            </div>
            
            <h3 className="font-cabinet font-black text-3xl text-[#232323] mb-2">Request a Demo</h3>
            <p className="text-xs text-[#555555] mb-6">See how Helix Box gives your engineering team 1:1 mobile command over local workstations.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-[#555555] mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c3c2b2] bg-[#f0efe3]/50 text-xs focus:outline-none focus:border-[#0b4fff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-[#555555] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Alex"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c3c2b2] bg-[#f0efe3]/50 text-xs focus:outline-none focus:border-[#0b4fff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-[#555555] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Chen"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c3c2b2] bg-[#f0efe3]/50 text-xs focus:outline-none focus:border-[#0b4fff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-[#555555] mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c3c2b2] bg-[#f0efe3]/50 text-xs focus:outline-none focus:border-[#0b4fff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-[#555555] mb-1">Primary Interest</label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c3c2b2] bg-[#f0efe3]/50 text-xs focus:outline-none focus:border-[#0b4fff]"
                >
                  <option>Mobile IDE & PTY Terminal</option>
                  <option>Zero-Trust Proxy Architecture</option>
                  <option>Algorand x402 Micropayments</option>
                  <option>Custom Cloud Container Sandboxes</option>
                </select>
              </div>

              <button
                type="submit"
                className="auxia-btn-primary w-full py-3 text-xs flex items-center justify-center gap-2 mt-4"
              >
                <span>Submit Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
