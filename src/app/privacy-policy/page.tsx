"use client"

import * as React from "react"
import { PageLayout } from "@/components/layout/PageLayout"

export default function PrivacyPolicyPage() {
  return (
    <PageLayout hideNavbar>
      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg mb-4">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Policy</span>
            </h1>
            <p className="text-slate-500 text-sm">Effective Date: 19 February 2026</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">1. Introduction</h2>
              <p className="leading-relaxed font-light">
                This Privacy Policy explains how Hytheria ("we", "us", "our") collects, uses, stores, and protects your personal data when you use our website, Hytale Skyblock game server, and Discord community (collectively, the "Service"). We are committed to protecting your privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">2. Data Controller</h2>
              <p className="leading-relaxed font-light">
                Hytheria is the data controller responsible for your personal data. If you have any questions about how we handle your data, please contact us through our website or community channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">3. What Data We Collect</h2>
              <p className="leading-relaxed font-light mb-4">We collect the following personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Account Information:</strong> Email address, Discord username, and Discord user ID.</li>
                <li><strong className="text-white">Payment Information:</strong> When you make a purchase, payment is processed by Stripe. We do not store your card details. Stripe may collect payment information in accordance with their own privacy policy, available at <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">stripe.com/privacy</a>.</li>
                <li><strong className="text-white">Session Data:</strong> We use session tokens to keep you logged in and maintain your browsing session. These are essential for the website to function.</li>
                <li><strong className="text-white">Transaction Records:</strong> We store records of your purchases, including what was purchased, the amount paid, and the date of transaction.</li>
                <li><strong className="text-white">Server Data:</strong> In-game data such as your username, gameplay statistics, and rank information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">4. How We Use Your Data</h2>
              <p className="leading-relaxed font-light mb-4">We use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To create and manage your account.</li>
                <li>To process purchases and deliver virtual items and ranks.</li>
                <li>To maintain session authentication on the website.</li>
                <li>To communicate with you regarding your account, purchases, or service updates.</li>
                <li>To enforce our <a href="/tos" className="text-yellow-500 hover:underline">Terms of Service</a> and Code of Conduct.</li>
                <li>To detect and prevent fraud or abuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">5. Lawful Basis for Processing</h2>
              <p className="leading-relaxed font-light mb-4">We process your data under the following lawful bases:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Contract:</strong> Processing necessary to fulfil purchases and provide the Service to you.</li>
                <li><strong className="text-white">Legitimate Interests:</strong> Processing necessary to operate, secure, and improve the Service, and to enforce our rules.</li>
                <li><strong className="text-white">Consent:</strong> Where applicable, such as for optional communications. You may withdraw consent at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">6. Cookies and Session Tokens</h2>
              <p className="leading-relaxed font-light">
                Our website uses session tokens, which are small pieces of data stored on your device to keep you logged in. These are strictly necessary for the operation of the website and do not require consent under UK cookie regulations. We do not use advertising or third-party tracking cookies.
              </p>
              <p className="leading-relaxed font-light mt-4">
                If we introduce analytics or non-essential cookies in the future, we will update this policy and provide you with the option to consent before they are set.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">7. Data Sharing</h2>
              <p className="leading-relaxed font-light mb-4">We do not sell your personal data to third parties. We may share your data with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Stripe:</strong> For payment processing. Stripe acts as an independent data controller for payment data.</li>
                <li><strong className="text-white">Discord:</strong> Your Discord username and user ID are used to link your Discord account to our Service. Discord's privacy policy applies to data held by Discord.</li>
                <li><strong className="text-white">Legal Obligations:</strong> We may disclose data if required by law, regulation, or legal process.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">8. Data Retention</h2>
              <p className="leading-relaxed font-light">
                We retain your personal data for as long as your account remains active or as needed to provide the Service. Transaction records are retained for a minimum of 6 years to comply with UK tax and accounting obligations. If you request deletion of your account, we will delete your personal data within 30 days, except where retention is required by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">9. Your Rights</h2>
              <p className="leading-relaxed font-light mb-4">Under UK GDPR, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-white">Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-white">Erasure:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
                <li><strong className="text-white">Restriction:</strong> Request that we limit how we use your data.</li>
                <li><strong className="text-white">Portability:</strong> Request your data in a structured, commonly used format.</li>
                <li><strong className="text-white">Objection:</strong> Object to processing based on legitimate interests.</li>
              </ul>
              <p className="leading-relaxed font-light mt-4">
                To exercise any of these rights, please contact us through our website or community channels. We will respond within 30 days.
              </p>
              <p className="leading-relaxed font-light mt-4">
                If you are not satisfied with how we handle your request, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">ico.org.uk</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">10. Data Security</h2>
              <p className="leading-relaxed font-light">
                We take reasonable technical and organisational measures to protect your personal data against unauthorised access, loss, or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">11. Children's Privacy</h2>
              <p className="leading-relaxed font-light">
                Our Service is not directed at children under the age of 13. We do not knowingly collect personal data from children under 13. If you are aged 13 to 17, you must have permission from a parent or legal guardian to use the Service. If we become aware that we have collected data from a child under 13 without appropriate consent, we will take steps to delete that data promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">12. International Transfers</h2>
              <p className="leading-relaxed font-light">
                Some of our service providers (such as Stripe and Discord) may process data outside of the UK. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses or adequacy decisions, to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">13. Changes to This Policy</h2>
              <p className="leading-relaxed font-light">
                We may update this Privacy Policy from time to time. Changes will be posted on our website with an updated effective date. Your continued use of the Service following any changes constitutes your acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">14. Contact</h2>
              <p className="leading-relaxed font-light">
                If you have any questions about this Privacy Policy or your personal data, please contact us through our website or community channels.
              </p>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
