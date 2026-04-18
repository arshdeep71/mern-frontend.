import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-32 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Nixon Style Brand Logo in Footer */}
        <div className="mb-12">
          <span className="text-2xl font-bold tracking-[0.25em] uppercase text-slate-900 leading-none">
            MYSTORE
          </span>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 border-b-2 border-slate-900 inline-block pb-1">Company</h4>
            <div className="flex flex-col gap-4 text-slate-500 font-medium">
              <Link to="/">About Us</Link>
              <Link to="/">Responsibility</Link>
              <Link to="/">Team</Link>
              <Link to="/">Blog</Link>
              <Link to="/">Collaborations</Link>
              <Link to="/">Work Here</Link>
              <Link to="/">Affiliate</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 border-b-2 border-slate-900 inline-block pb-1">Customer Support</h4>
            <div className="flex flex-col gap-4 text-slate-500 font-medium">
              <Link to="/">Customer Service</Link>
              <Link to="/">Need a Repair</Link>
              <Link to="/">Repair Order Status</Link>
              <Link to="/">FAQs</Link>
              <Link to="/">Warranty</Link>
              <Link to="/">Watch Size Guide</Link>
              <Link to="/">Contact Us</Link>
              <Link to="/">Accessibility</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 border-b-2 border-slate-900 inline-block pb-1">Orders & Returns</h4>
            <div className="flex flex-col gap-4 text-slate-500 font-medium">
              <Link to="/">Shipping</Link>
              <Link to="/">Returns</Link>
              <Link to="/orders">Track Your Order</Link>
              <Link to="/">Check Gift Card Balance</Link>
              <Link to="/">Promotions</Link>
            </div>
          </div>

          {/* Nixon Style Email Signup Block */}
          <div className="col-span-2 md:col-span-1 space-y-6 p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none">
            <h4 className="text-center md:text-left text-lg font-bold text-slate-900 leading-tight">
              Save 10% on Your First Order When You Sign Up For Email & SMS
            </h4>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full h-12 px-4 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-black"
              />
              <button className="w-full h-12 bg-black text-white font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
                Submit & continue
              </button>
            </div>
            
            <div className="flex items-start gap-3 pt-4">
              <input type="checkbox" id="terms" className="mt-1" />
              <label htmlFor="terms" className="text-[10px] text-slate-500 leading-tight">
                *I've read the <Link to="/" className="underline text-slate-800">terms and conditions</Link>
                <br /><br />
                By submitting this form, you agree to MyStore processing your data and receiving automated email and text messages...
              </label>
            </div>
          </div>
        </div>

        {/* Global Nav-Link Footer (Final Strip) */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
             <Link to="/">Privacy Policy</Link>
             <Link to="/">Cookie Policy</Link>
             <Link to="/">Sitemap</Link>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             © 2026 MyStore Inc. All Rights Reserved.
           </p>
        </div>
      </div>
    </footer>
  );
}