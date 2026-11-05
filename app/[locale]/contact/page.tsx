"use client";

import { use } from "react";
import { T, type Locale } from "@/lib/i18n";

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params) as { locale: Locale };
  const t = T[locale];
  const tx = (k: string, fb: string) => t[k] ?? fb;

  return (
    <div className="page active" id="page-contact">
      <div className="contact-inner">
        <div className="contact-grid">
          <div>
            <div className="sec-ey inv" style={{ marginBottom: 10 }} id="t-cey">
              {tx("t-cey", "Get In Touch")}
            </div>
            <h2 className="cti" id="t-ch">
              {tx("t-ch", "Let's Build This Together")}
            </h2>
            <p className="ctp" id="t-cp">
              {tx(
                "t-cp",
                "Reach out to partner, volunteer, or share your community's work. We respond in both English and Kiswahili.",
              )}
            </p>
            <div className="csoc-row">
              <a className="csoc" href="#" title="X">𝕏</a>
              <a className="csoc" href="#" title="LinkedIn">in</a>
              <a className="csoc" href="#" title="Facebook">f</a>
              <a className="csoc" href="#" title="Instagram">📸</a>
              <a className="csoc" href="#" title="YouTube">▶</a>
            </div>
            <div className="nl-box">
              <h4 id="t-nlh">{tx("t-nlh", "Stay in the Loop")}</h4>
              <p id="t-nlp">{tx("t-nlp", "Monthly digest of tools, events, and stories. No spam.")}</p>
              <div className="nl-row">
                <input className="nl-in" type="email" placeholder="your@email.com" id="nl-inp" />
                <button className="nl-sub" id="t-nlb">
                  {tx("t-nlb", "Subscribe")}
                </button>
              </div>
            </div>
          </div>
          <div className="cform">
            <h3 id="t-cfh">{tx("t-cfh", "Send a Message")}</h3>
            <label className="cf-l" id="t-cfl1">
              {tx("t-cfl1", "Your Name")}
            </label>
            <input className="cf-in" type="text" placeholder="Full name" />
            <label className="cf-l" id="t-cfl2">
              {tx("t-cfl2", "Email")}
            </label>
            <input className="cf-in" type="email" placeholder="you@email.com" />
            <label className="cf-l" id="t-cfl3">
              {tx("t-cfl3", "Subject")}
            </label>
            <input className="cf-in" type="text" placeholder="What's this about?" />
            <label className="cf-l" id="t-cfl4">
              {tx("t-cfl4", "Message")}
            </label>
            <textarea className="cf-ta" placeholder="Your message..."></textarea>
            <button className="cf-sub" id="t-cfb">
              {tx("t-cfb", "Send Message →")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
