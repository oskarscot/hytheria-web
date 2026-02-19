"use client"

import * as React from "react"
import { PageLayout } from "@/components/layout/PageLayout"

export default function ServerRulesPage() {
  return (
    <PageLayout hideNavbar>
      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg mb-4">
              Server <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Rules</span>
            </h1>
            <p className="text-slate-500">By playing on Hytheria, you agree to follow all rules listed below. Ignorance of the rules is not an excuse. Rules are subject to change at any time.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">1. General Conduct</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">1.1</strong> Treat all players and staff with respect. Harassment, bullying, and toxic behaviour will not be tolerated.</li>
                <li><strong className="text-white">1.2</strong> Do not impersonate staff members or other players.</li>
                <li><strong className="text-white">1.3</strong> Follow staff instructions at all times. Arguing with a ruling publicly is not permitted — use the appeals process instead.</li>
                <li><strong className="text-white">1.4</strong> Do not share or threaten to share another player's personal information (doxxing). This is a permanent ban.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">2. Chat and Communication</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">2.1</strong> No excessive spam, caps abuse, or character flooding in any chat channel.</li>
                <li><strong className="text-white">2.2</strong> Hate speech, slurs, discriminatory language, and sexually explicit content are strictly prohibited.</li>
                <li><strong className="text-white">2.3</strong> Keep advertisements for other servers, Discord communities, or external services out of chat.</li>
                <li><strong className="text-white">2.4</strong> English is the primary language in global chat. Other languages are welcome in private messages, party chat, or island chat.</li>
                <li><strong className="text-white">2.5</strong> Discussions of politics, religion, or other divisive topics should be kept out of global chat.</li>
                <li><strong className="text-white">2.6</strong> Do not engage in scam baiting or misleading other players in trade chat.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">3. Exploiting and Unfair Advantages</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">3.1</strong> Use of hacked clients, cheat mods, disallowed modifications, or any software that provides an unfair advantage is prohibited.</li>
                <li><strong className="text-white">3.2</strong> Exploiting bugs, glitches, duplication methods, or unintended game mechanics is a bannable offence. All bugs must be reported immediately via the appropriate channel.</li>
                <li><strong className="text-white">3.3</strong> Use of macros, auto-clickers, or scripts that automate gameplay beyond standard AFK mechanics is not allowed.</li>
                <li><strong className="text-white">3.4</strong> Intentionally causing server lag or instability through any means is prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">4. Real-World Trading (RMT)</h2>
              <p className="leading-relaxed font-light mb-4">
                RMT is taken extremely seriously on Hytheria. All RMT offences result in an immediate permanent ban.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">4.1</strong> Selling, buying, or trading in-game items, currency, accounts, or services for real-world money or external value is strictly prohibited.</li>
                <li><strong className="text-white">4.2</strong> Advertising or soliciting RMT transactions in-game, on Discord, or on any platform associated or used by Hytheria will result in an immediate permanent ban.</li>
                <li><strong className="text-white">4.3</strong> This includes trading in-game items or currency for assets on other servers or games (cross-server trading).</li>
                <li><strong className="text-white">4.4</strong> Charge-backing or disputing legitimate store purchases will result in a permanent ban and potential blacklist. For example, purchasing a rank and then disputing the payment at the end of the month.</li>
                <li><strong className="text-white">4.5</strong> Gifting store items is permitted, but any arrangement that constitutes a disguised RMT transaction is bannable at staff discretion.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">5. Account and Island Responsibility</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">5.1</strong> You are responsible for your account at all times. "My brother was on my account" is not a valid appeal.</li>
                <li><strong className="text-white">5.2</strong> Account sharing is discouraged and done at your own risk — any violations committed on your account are your responsibility.</li>
                <li><strong className="text-white">5.3</strong> Alternate accounts (alts) may be limited. Using alts to circumvent bans, abuse referral systems, or farm resources beyond intended limits is prohibited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">6. Enforcement and Appeals</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">6.1</strong> Punishments scale with severity and repeat offences: Warning, Mute, Temporary Ban, Ban, Permanent Ban.</li>
                <li><strong className="text-white">6.2</strong> All bans may be appealed through the official appeals process. False or spam appeals may result in appeal privileges being revoked.</li>
                <li><strong className="text-white">6.3</strong> These rules are subject to change. Continued play on Hytheria constitutes acceptance of the current ruleset.</li>
              </ul>
            </section>

            <p className="text-slate-500 text-sm mt-8">Last updated: February 2026 — Hytheria Staff Team</p>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
