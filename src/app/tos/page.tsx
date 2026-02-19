"use client"

import * as React from "react"
import { PageLayout } from "@/components/layout/PageLayout"

export default function ToSPage() {
  return (
    <PageLayout hideNavbar>
      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg mb-4">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Service</span>
            </h1>
            <p className="text-slate-500 text-sm">Effective Date: 19 February 2026</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-slate-300">
            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">1. Acceptance of Terms</h2>
              <p className="leading-relaxed font-light">
                By accessing or using the Hytheria website and Hytale Skyblock server (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service.
                If you are under the age of 13, you must have permission from a parent or legal guardian to use the Service. By using the Service, you confirm that you have obtained such permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">2. Description of Service</h2>
              <p className="leading-relaxed font-light">
                Hytheria operates a Hytale Skyblock game server, an associated website, and a community Discord server (collectively, the "Service"). Through the website, users may purchase virtual ranks and other digital items that grant in-game benefits on the Hytheria server.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">3. User Accounts</h2>
              <p className="leading-relaxed font-light">
                You may be required to create or link an account to access certain features of the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorised use of your account.
                We reserve the right to suspend or terminate any account at our sole discretion, including for violations of these Terms or disruptive behaviour on the server.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">4. Purchases and Payments</h2>
              <p className="leading-relaxed font-light">
                Hytheria offers virtual ranks and digital items for purchase through the website. All prices are displayed at the point of sale and are inclusive of any applicable taxes unless otherwise stated.
              </p>
              <p className="leading-relaxed font-light mt-4">
                <strong className="text-white">No Refunds.</strong> All purchases are final. Because digital items and ranks are delivered instantly upon purchase, you acknowledge that you waive any right to a cooling-off period or refund to the extent permitted by applicable law. If you experience a technical issue preventing delivery of your purchase, please contact us and we will work to resolve the matter.
              </p>
              <p className="leading-relaxed font-light mt-4">
                We reserve the right to modify pricing, discontinue items, or change the benefits associated with any rank at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">5. Virtual Items and Ranks</h2>
              <p className="leading-relaxed font-light">
                Virtual ranks and items purchased through the Service are licensed to you and are not your property. They hold no real-world monetary value and cannot be transferred, traded, or exchanged for cash or any other consideration outside of the Service.
              </p>
              <p className="leading-relaxed font-light mt-4">
                We reserve the right to modify, remove, or reset virtual items and ranks at any time, including in the event of server updates, resets, or rebalancing. No compensation will be provided in such circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">6. Code of Conduct</h2>
              <p className="leading-relaxed font-light mb-4">
                When using the Service, you agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use cheats, exploits, hacks, or any form of unauthorised third-party software.</li>
                <li>Engage in harassment, hate speech, threats, or abusive behaviour towards other users.</li>
                <li>Attempt to disrupt the server, website, or any related infrastructure.</li>
                <li>Impersonate staff members or other users.</li>
                <li>Engage in real-money trading of in-game items or accounts.</li>
                <li>Advertise or promote other servers or services without permission.</li>
              </ul>
              <p className="leading-relaxed font-light mt-4">
                These rules apply across all Hytheria platforms, including the game server, website, and Discord community.
                Violation of the Code of Conduct may result in warnings, temporary bans, permanent bans, or removal of purchased items at our discretion, without refund.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">7. Intellectual Property</h2>
              <p className="leading-relaxed font-light">
                All content, branding, and materials associated with Hytheria — including but not limited to logos, website design, server configurations, and custom game content — are the property of Hytheria or its licensors. You may not reproduce, distribute, or create derivative works from any of our content without prior written consent, with the following exception:
              </p>
              <p className="leading-relaxed font-light mt-4">
                You are granted a non-exclusive, revocable licence to use the Hytheria logo in content creation (such as videos, streams, articles, and social media posts) related to Hytheria or the Hytale community. This licence is subject to the following conditions: the logo must not be altered or distorted in a misleading way, it must not be used to imply official endorsement or affiliation with Hytheria staff, and it must not be used in connection with any content that is hateful, illegal, or harmful. We reserve the right to revoke this licence at any time for any reason.
              </p>
              <p className="leading-relaxed font-light mt-4">
                Hytheria is not affiliated with or endorsed by Hypixel Studios or the Hytale development team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">8. Limitation of Liability</h2>
              <p className="leading-relaxed font-light">
                The Service is provided on an "as is" and "as available" basis. We make no warranties, express or implied, regarding the availability, reliability, or suitability of the Service.
              </p>
              <p className="leading-relaxed font-light mt-4">
                To the maximum extent permitted by law, Hytheria and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including but not limited to loss of data, loss of virtual items, or server downtime.
              </p>
              <p className="leading-relaxed font-light mt-4">
                Our total liability to you for any claim arising from these Terms or the Service shall not exceed the amount you have paid to Hytheria in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">9. Privacy</h2>
              <p className="leading-relaxed font-light">
                We collect and process personal data in accordance with applicable data protection laws, including the UK General Data Protection Regulation (UK GDPR). By using the Service, you consent to the collection and use of information as described in our <a href="/privacy-policy" className="text-yellow-500 hover:underline">Privacy Policy</a>. If we do not have a separate Privacy Policy published, the following applies: we collect only the data necessary to operate the Service (such as account details and transaction records), we do not sell your data to third parties, and you may request deletion of your data by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">10. Modifications to the Terms</h2>
              <p className="leading-relaxed font-light">
                We reserve the right to update or modify these Terms at any time. Changes will be posted on the website with an updated effective date. Your continued use of the Service following any changes constitutes your acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">11. Termination</h2>
              <p className="leading-relaxed font-light">
                We may terminate or suspend your access to the Service at any time, with or without cause and with or without notice. Upon termination, your right to use the Service ceases immediately. No refunds will be issued upon termination.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">12. Governing Law</h2>
              <p className="leading-relaxed font-light">
                These Terms shall be governed by and construed in accordance with the laws of Scotland. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the Scottish courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-yellow-400 mb-4">13. Contact</h2>
              <p className="leading-relaxed font-light">
                If you have any questions about these Terms, please contact us through our website or community channels.
              </p>
            </section>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
