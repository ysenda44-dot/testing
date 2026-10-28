# Award-winning and visually outstanding luxury brand web experiences (fashion, jewelry, watches, beauty, lifestyle), 2018–2026: references for a multi-brand airport boutique LP

Research method note (applies to all sections): this is based on WebSearch result snippets only. WebFetch could not reach awwwards.com, immersive-g.com, 14islands.com or domusweb.it (DNS blocked in this session), and the shared web-search budget ran out partway through. So award tiers and dates come from Awwwards, Webby, Cannes Lions (lovethework.com) and studio listing pages as the search snippets reported them. Visual descriptions are limited to what those listings and articles state. Treat each entry's "LP borrow" line as an inference, not as a sourced fact.

## Q1. Which luxury brand digital projects (≈2018–2026) won major awards or are widely cited benchmarks?

### Takeaway
Cartier is the most-awarded luxury house on Awwwards by a wide margin. It has an Awwwards Site of the Day (SOTD) almost every year: the Watches & Wonders microsites for 2023, 2024 and 2026, "365, A Year of Cartier", "The Fabulous Cartier Journey", "Cartier In Time" and "Le Chœur des Pierres" (Oct 2026). Gucci, Chanel, Dior, Louis Vuitton, Hermès, Bulgari and Rimowa also have SOTD or Honorable Mention (HM) wins. Almost all of these winners are **campaign microsites, product-launch landing pages or games**, not the brands' main e-commerce sites. Hard business results are documented for only a few: Gucci Town on Roblox, Jacquemus "Bags on Wheels" and Gucci Vault Art Space.

### Cited Findings

#### A. Cartier (jewelry/watches): the strongest benchmark set

1. **Cartier – Watches & Wonders 2024** (campaign microsite / immersive scroll experience)
   - URL: https://www.awwwards.com/sites/cartier-watches-wonders-2024 ; studio case: https://immersive-g.com/projects/cartier-watches-and-wonders-24
   - Studio: Immersive Garden (Paris). Awards: Awwwards SOTD (Jun 12, 2024), plus FWA SOTD and CSSDA SOTD according to the studio page — [Immersive Garden](https://immersive-g.com/projects/cartier-watches-and-wonders-24); [Awwwards SOTD listing](https://www.awwwards.com/sites/cartier-watches-wonders-2024)
   - Visual/UX: "A dynamic scroll-based journey revealing Cartier's iconic timepieces in immersive universes"; described elsewhere as a scrolling showcase of Cartier watches — [Immersive Garden](https://immersive-g.com/projects/cartier-watches-and-wonders-24); [Awwwards](https://www.awwwards.com/websites/sites_of_the_day/)
   - LP borrow (inference): one scroll journey that moves through several self-contained "universes". This maps directly onto a "one brand = one universe" scroll for each boutique.

2. **Cartier – Watches & Wonders 2025** (immersive experience)
   - URL: https://www.awwwards.com/watches-wonders-immersive-experience-for-cartier.html (Awwwards feature, Oct 8, 2025)
   - Visual/UX: "a succession of immersive alcoves, each one a self-contained world inspired by a Cartier timepiece" — [Awwwards](https://www.awwwards.com/watches-wonders-immersive-experience-for-cartier.html)
   - LP borrow (inference): the "alcove" pattern is a good model for a multi-brand page. Each boutique gets its own alcove or niche, with its own palette and motion, inside one shared frame.

3. **Cartier – Watches & Wonders 2026** — Awwwards SOTD, May 25, 2026, described as an "immersive garden highlighting iconic timepieces". The studio is not confirmed in the snippet. — [Awwwards](https://www.awwwards.com/sites/cartier-watches-wonders-2026)
   - **Cartier – Watches and Wonders 2023** — also an Awwwards SOTD — [Awwwards](https://www.awwwards.com/sites/cartier-watches-and-wonders)

4. **Cartier – Le Chœur des Pierres** (high-jewelry immersive microsite, 2026)
   - URL: https://www.awwwards.com/sites/cartier-le-choeur-des-pierres
   - Credits: makemepulse, alexandre-saad, Alexis Demachy. Award: Awwwards SOTD, Oct 20, 2026 — [Awwwards](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres)
   - Visual/UX: "an immersive journey into Cartier High Jewellery, where gemstones reveal the inspiration and craftsmanship behind each piece" — [Awwwards](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres)
   - LP borrow (inference): use the gemstone or material as the entry point to each story. This is the most "きらびやか" reference in the set.

5. **365, A Year of Cartier** (annual digital yearbook, WebGL; editions from 2022 on)
   - URLs: https://www.awwwards.com/sites/365-a-year-of-cartier (SOTD, Mar 4, 2022) ; later edition https://www.awwwards.com/sites/365-a-year-of-cartier-5 (SOTD) ; case https://www.14islands.com/work/cartier365 ; making-of https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html
   - Studio: 14islands (Sweden/Iceland), with Alexis Demachy also credited. Another Awwwards entry (HM) credits Hervé Studio for an earlier or alternate edition, so the credits conflict between listings. — [Awwwards SOTD](https://www.awwwards.com/sites/365-a-year-of-cartier); [Awwwards HM (Hervé Studio)](https://www.awwwards.com/sites/365-a-year-of-cartier-3)
   - Awards: Awwwards SOTD, FWA SOTD, and silver at the Lovie Awards — [14islands](https://www.14islands.com/work/cartier365)
   - Visual/UX/tech: an "infinite scroll WebGL immersive experience" looking back at the year's imagery and events — [Awwwards inspiration](https://www.awwwards.com/inspiration/365-a-year-of-cartier-infinite-scroll-webgl-immersive-experience)
     - All content sits in plain HTML/CSS, with a WebGL layer on top for image distortion and 3D jewellery. This keeps the site accessible while still delivering high-end motion.
     - Stack: React, Next.js, Framer Motion, React Three Fiber and three.js. WebGL textures were converted to KTX2 so pages load faster.
     - The site ran in EN/FR/CN. The team re-composed all 32 articles by hand in Figma, adapting line breaks and layout for each language, for 105 pages in total.
     - Source for the three points above: [Awwwards making-of](https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html)
   - LP borrow (inference): the HTML-first + WebGL-overlay approach and the KTX2 textures suit airport visitors on mobile data or terminal Wi-Fi. Hand-typesetting each language is the right standard for a JP/EN/ZH/KO airport page.

6. **The Fabulous Cartier Journey** (browser game / holiday experience, 2023)
   - URL: https://www.awwwards.com/sites/the-fabulous-cartier-journey ; case study: https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html
   - Studio: Merci-Michel (Paris), with Rogue Studio credited as designer. Award: Awwwards SOTD, Dec 6, 2023 — [Awwwards](https://www.awwwards.com/sites/the-fabulous-cartier-journey); [case study](https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html)
   - Visual/UX: the visitor flies an imaginary airship over a starry night, through 3 levels, collecting jewels — [Awwwards](https://www.awwwards.com/sites/the-fabulous-cartier-journey)
     - Controls use one input only: hold click, tap or spacebar to rise, release to fall.
     - The brief balanced Merci-Michel's playfulness with Cartier's themes of travel, magical moments and imagination. The piece is structured as triptychs, "between dream and reality".
     - Source for the two points above: [case study](https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html)
   - LP borrow (inference): this is a ready-made **travel / flight metaphor** from a luxury house. A one-tap "flight" over the terminal could collect brand icons or coupons.

7. **Cartier In Time** (film showcase microsite)
   - URL: https://www.awwwards.com/sites/cartier-in-time ; case: https://immersive-g.com/projects/cartier-in-time
   - Studio: Immersive Garden + 60fps + Mooders. Awards: Awwwards SOTD, FWA SOTD, CSSDA SOTD — [Immersive Garden](https://immersive-g.com/projects/cartier-in-time); [Awwwards](https://www.awwwards.com/sites/cartier-in-time)
   - Visual/UX: "an innovative scrolling carousel… inspired by clock hands, to present 12 abstract films starring Jake Gyllenhaal" — [Immersive Garden](https://immersive-g.com/projects/cartier-in-time)
   - LP borrow (inference): a circular, clock-hand carousel works as a brand selector. It could also be themed as a departure clock or flight-time dial.

8. **Cartier "Love Is All"** (video-led web feature) — listed in the 2022 Webby gallery under Websites & Mobile Sites › Features & Design › Best Use of Video or Moving Image. The exact tier (Winner, People's Voice or Honoree) was not verified. — [Webby gallery](https://winners.webbyawards.com/2022/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image/215832/cartier-love-is-all)

#### B. Louis Vuitton

9. **Louis Vuitton Collectibles / VIA** (immersive product microsite, "the Maison's first digital trunk")
   - URL: https://www.awwwards.com/sites/louis-vuitton-collectibles ; interaction details: https://www.awwwards.com/inspiration/different-universe-louis-vuitton-collectibles , https://www.awwwards.com/inspiration/interaction-click-and-hold-function-louis-vuitton-collectibles
   - Credits: Immersive Garden + Reflet Communication. Awards: Awwwards SOTD (Feb 20, 2024, score 7.79/10) + Developer Award — [Awwwards](https://www.awwwards.com/sites/louis-vuitton-collectibles)
   - Visual/UX: Awwwards highlights a "different universe" switch and a "click and hold" interaction — [Awwwards inspiration](https://www.awwwards.com/inspiration/interaction-click-and-hold-function-louis-vuitton-collectibles)
   - LP borrow (inference): the "trunk" or suitcase is a natural travel motif for an airport. "Click-and-hold to reveal" fits a premium product or boutique reveal.

10. **Louis Vuitton – "The Maison of All Victories"** — Awwwards inspiration entries (interaction and full experience) credited to Cosmic Shelter. The award tier was not confirmed. — [Awwwards](https://www.awwwards.com/inspiration/full-experience-the-maison-of-all-victories); [Awwwards](https://www.awwwards.com/inspiration/interaction-the-maison-of-all-victories)

11. **Louis Vuitton × Yayoi Kusama (2023)** (integrated campaign: 3D anamorphic OOH, AR, animatronics, facades)
   - Cannes Lions entry: https://lovethework.com/work-awards/campaigns/yayoi-kusama-x-louis-vuitton-1527856 — "windows and facades worldwide become a canvas". A win or shortlist was **not** confirmed. — [Love The Work / Cannes Lions](https://lovethework.com/work-awards/campaigns/yayoi-kusama-x-louis-vuitton-1527856)
   - Tokyo: a 3D anamorphic billboard on Cross Shinjuku Vision in early Dec 2022. A polka-dotted Damier trunk opens to reveal Kusama pumpkins. — [Stylus](https://stylus.com/retail-brand-comms/louis-vuitton-x-yayoi-kusama-ar-ultra-architecture-animatronic-ooh); [Sixteen:Nine](https://www.sixteen-nine.net/?p=36219)
   - London: Piccadilly Lights takeover with 3D suitcases, plus a projection on the Harrods facade; agency Closer — [Marketing Beat](https://www.marketing-beat.co.uk/2023/01/19/louis-vuitton-yayoi-kusama/); [LBB](https://www.lbbonline.com/news/louis-vuitton-takes-over-harrods-facade-to-celebrate-launch-of-yayoi-kusama-collaboration)
   - CG production: [Method Studios](https://www.methodstudios.com/en/advertising/louis-vuitton-yayoi-kusama-collection)
   - LP borrow (inference): the "trunk opens to reveal the world" storyboard works as an LP hero animation. Airport gate screens could reuse it as OOH tie-ins.

12. **Fondation Louis Vuitton** (cultural site) — studio AREA 17; Awwwards HM, Nov 4, 2020 — [Awwwards](https://www.awwwards.com/sites/fondation-louis-vuitton)
13. Older classic: **LV "Countless Journeys"** microsite — D&AD Wood Pencil, Websites/Microsites, 2008. This is pre-2018 but is the canonical "LV = journey" web reference. — [D&AD](https://www.dandad.org/awards/professional/2008/websites/16972/countless-journeys/). LV "Journeys" was also entered at Cannes Lions in Websites & Microsites — [Love The Work](https://www.lovethework.com/work-awards/entries/louis-vuitton-journeys-318797)

#### C. Hermès

14. **Hermès – Tutti Twilly** (fragrance-launch mobile game on hermes.com, 2023)
   - URL: https://www.awwwards.com/sites/hermes-tutti-twilly ; brand page: https://www.hermes.cn/cn/en/content/321531-tutti-twilly-fragrance
   - Credits: Merci-Michel + Publicis et Nous. Awards: Awwwards HM (Sep 26, 2023) — [Awwwards](https://www.awwwards.com/sites/hermes-tutti-twilly). Merci-Michel's Awwwards profile also lists it as **Site of the Month, Dec 2023**. The two listings show different tiers. — [Awwwards Merci-Michel profile](https://www.awwwards.com/Merci-Michel/)
   - Visual/UX: "a frantic race through the streets of New York, starting from the Madison Avenue Hermès boutique", playable on smartphone or tablet from the official site — [Journal du Luxe](https://www.journalduluxe.fr/fr/beaute/hermes-jeu-nouveau-parfum-tutti-twilly)
   - Awwwards' font-filter page lists Tutti Twilly among sites using the **Jost** typeface — [Awwwards Jost listing](https://www.awwwards.com/websites/Jost/)
   - LP borrow (inference): this is **the only found luxury reference whose interaction starts from a physical boutique**. A playful "race to your gate / to the boutique" mini-game fits an airport.

15. **Hermès H24 interactive website** (fragrance) — Superbien. Urban architecture and natural elements "merge into a sensory universe". No award was stated. — [Superbien](https://www.superbien.studio/projects/hermes-h24-interactive-website)
16. **Hermès site redesign "Venture Beyond" (Jan 2026)** — an illustrated, marine-themed layer added to hermes.com. Domus describes a "narrative and ironic use of its online space". — [Domus](https://domusweb.it/en/news/2026/01/07/herms-new-website.html)
17. **Hermès "A Man's World"** — a Cannes Lions entry described as a "digitally unified brand experience" for Hermès physical events — [Love The Work](https://lovethework.com/work-awards/campaigns/a-mans-world-238210)

#### D. Gucci (most documented business results)

18. **Gucci Vault Art Space** (Web3 art marketplace microsite, 2022–23)
   - URL: https://www.awwwards.com/sites/gucci-vault-art-space
   - Studio: Monks. Awards: Awwwards SOTD + Developer Award (Jan 15, 2023) — [Awwwards](https://www.awwwards.com/sites/gucci-vault-art-space). Also a Cannes Lions entry, "The Next 100 Years of Gucci" (with SuperRare) — [Love The Work](https://lovethework.com/work-awards/campaigns/gucci-and-superrare-present-the-next-100-years-of-gucci-1535189)
   - Function: browse works by 29 artists, connect a crypto wallet, bid and mint — [Awwwards](https://www.awwwards.com/sites/gucci-vault-art-space). Each auction counts down 8 days once bidding starts, and a Times Square digital billboard amplified it — [Love The Work](https://lovethework.com/work-awards/campaigns/gucci-and-superrare-present-the-next-100-years-of-gucci-1535189)
   - Results: per the Cannes entry, it reached both luxury shoppers and an existing digital-art collector community. This is qualitative only. — [Love The Work](https://lovethework.com/work-awards/campaigns/gucci-and-superrare-present-the-next-100-years-of-gucci-1535189)

19. **Gucci Vault** (online concept store, launched Sept 2021) — vintage archive pieces plus emerging designers — [FashionUnited](https://fashionunited.uk/news/retail/behind-gucci-s-new-experimental-online-space-vault/2021092757971)

20. **Gucci Garden (Roblox, May 17–31, 2021) → Gucci Town (2022)** (immersive game world)
   - Gucci Garden is described as Webby Award-winning for its surreal design and sticky UX. It is reported to have drawn over 20M visitors, but that figure comes from a secondary PMI page. — [PMI](https://www.pmi.org/most-influential-projects-2022/50-most-influential-projects-2022/gucci-town); [Dezeen](https://www.dezeen.com/2021/05/20/gucci-garden-roblox-virtual-exhibition/amp/)
   - **Gucci Town results (self-reported Cannes Lions entry):** 30–40K average daily visitors, a 2M daily peak, and 12.5M unique visitors — [Love The Work / Cannes Lions](https://www.lovethework.com/work-awards/campaigns/gucci-town-in-roblox-1535179)

21. **Other Gucci Awwwards SOTDs:**
   - Gucci: Mystery Unfolds — an AI mystery experience built on Google Gemini; SOTD Jun 17, 2026 — [Awwwards](https://www.awwwards.com/sites/gucci-mystery-unfolds)
   - The Art of Silk (May 18, 2025), Gucci Beauty Wishes (Dec 11, 2023), Gucci Osteria and Gucci Off The Grid; Gucci Vault "Pick n Twist" received an HM — [Awwwards Gucci awards page](https://www.awwwards.com/Gucci/awards); [Awwwards](https://www.awwwards.com/sites/gucci-osteria); [Awwwards](https://www.awwwards.com/sites/gucci-off-the-grid); [Awwwards](https://www.awwwards.com/sites/gucci-vault-pick-n-twist)
   - "Welcome to the House of Gucci" (SOTD Apr 13, 2022) is credited to Watson Design Group, a film-marketing studio. It is likely the *House of Gucci* film site, not a Gucci brand site. — [Awwwards](https://www.awwwards.com/sites/welcome-to-the-house-of-gucci)
   - **Gucci Ancora Fashion Show 2024** — Webby Winner, plus a Gucci People's Voice win, as reported by agency BASIC/DEPT (secondary source) — [BASIC/DEPT](https://basicagency.com/blog/new-projects-on-the-podium-for-the-28th-webby-awards)

#### E. Chanel

22. **CHANEL – Les 4 Ombres "Boutons"** (product-launch interactive landing page, 2025)
   - URL: https://www.awwwards.com/sites/chanel-les-4-ombres-boutons
   - Studio: 60fps (Nancy, France). Awards: Awwwards SOTD (Oct 7, 2025) + Developer Award. A category page also lists it as **Site of the Month, Oct 2025**, while one 60fps profile entry shows an HM dated Oct 15, 2025, which conflicts. — [Awwwards](https://www.awwwards.com/sites/chanel-les-4-ombres-boutons); [60fps profile](https://www.awwwards.com/weare60fps/)
   - Visual/UX: an "interactive landing page… merging 3D modeling and WebGL with fluid, high-performance development" — [Awwwards](https://www.awwwards.com/sites/chanel-les-4-ombres-boutons)
   - LP borrow (inference): this is the closest award winner to an actual **LP** format, built around a single product in 3D.

23. **Bleu de CHANEL L'Exclusif** — Awwwards HM, Oct 15, 2025 — [Awwwards](https://www.awwwards.com/sites/bleu-de-chanel-lexclusif)
24. **Chanel × Mazarine** (Paris agency):
   - Chanel Factory 5 (N°5 centenary) is "entirely modeled in real-time 3D thanks to webGL" — [Mazarine](https://www.mazarine.com/en/projects/chanel-factory-5)
   - Chanel Holiday 2022 ran directly on chanel.com in 30+ countries — [Mazarine](https://mazarine.com/en/projects/chanel-holiday)
   - Mazarine also built a Les 4 Ombres Tweed experience — [Mazarine](https://www.mazarine.com/en/projects/chanel-fait-son-numero)
   - The J12 "triple folding buckle" detail page is featured as Awwwards inspiration — [Awwwards](https://www.awwwards.com/inspiration/the-triple-folding-buckle-the-j12-watch)

#### F. Dior

25. **Dioriviera** (immersive virtual journey for the Dioriviera capsule) — Immersive Garden, with 60fps and Aura credited. Awwwards SOTD + FWA + CSSDA per the studio page — [Immersive Garden](https://immersive-g.com/projects/dioriviera-1)
26. **Dior by Starck 2023** (Dior Maison furniture by Philippe Starck) — Awwwards SOTD, May 21, 2023 (7.5/10). Awwwards features its 3D product view and animation. — [Awwwards](https://www.awwwards.com/sites/dior-by-starck-2023); [3D product](https://www.awwwards.com/inspiration/product-3d-dior-by-starck-2023)
27. **Rouge Dior** (lipstick launch) — makemepulse, whose case study lists SOTD. The Awwwards page itself only shows votes, so this conflicts. — [makemepulse](https://makemepulse.com/case-study/christian-dior-parfums-rouge-dior); [Awwwards](https://www.awwwards.com/sites/rouge-dior)
   - Awwwards inspiration also features "The Fabulous World of Dior" scroll and "The Maison Dior" product and mobile pages. No award tier was confirmed. — [Awwwards](https://www.awwwards.com/inspiration/scroll-the-fabulous-world-of-dior-1)

#### G. Bulgari and other jewelry

28. **BVLGARI 130th Anniversary** — Awwwards SOTD. A "digital magazine" covering history, heritage and present, on all devices and **localized in 8 languages**. The studio is not identified in the results. — [Awwwards](https://www.awwwards.com/sites/bvlgari-130th-anniversary)
29. **Bulgari Eclettica** (high-jewelry immersive) — studio stride-it; Awwwards HM, May 1, 2026 — [Awwwards](https://www.awwwards.com/sites/bulgari-eclettica). Also HMs: **Bulgari Tribute to Femininity** — [Awwwards](https://www.awwwards.com/sites/bulgari-tribute-to-femininity); **Bulgari Serpentiform** — [Awwwards](https://www.awwwards.com/sites/bulgari-serpentiform)
30. **Van Cleef & Arpels** — offers web users a 360° virtual tour of its renovated workshops — [Jewellery Focus](https://www.jewelleryfocus.co.uk/8891-the-maison-completes-renovation-of-its-workshops). The brand site also runs in-store appointment booking pages, e.g. https://www.vancleefarpels.com/ch/de/in-store-appointment.html — [VCA](https://www.vancleefarpels.com/ch/de/in-store-appointment.html). No Awwwards or FWA award was found.
31. **Tiffany & Co. "The Landmark" reopening (Apr 28, 2023)** — physical, not web. The ground floor has tall digital screens that "look like windows", playing New York scenes, and nearly 40 artworks appear across the floors (architect Peter Marino). No digital or website award was found. — [JCK](https://www.jckonline.com/editorial-article/tiffany-reopens-new-york-flagship/); [LVMH](https://lvmh.com/en/news-lvmh/tiffany-co.-unveils-the-landmark-a-new-experience-in-new-york-city)

#### H. Watches (non-Cartier)

32. **Audemars Piguet × GQ "The Extraordinary Lab"** — Immersive Garden with Condé Nast/GQ: a real-time interactive experience built around the RD#5 watch (Awwwards feature, Jun 3, 2026). No award was confirmed. — [Awwwards](https://www.awwwards.com/gq-audemars-piguet-the-extraordinary-lab.html)
33. **Longines Spirit Flyback by Immersive Garden** — Awwwards feature — [Awwwards](https://www.awwwards.com/longines-spirit-flyback-by-immersive-garden.html)
34. **Omega – Space Sustainability** microsite — Awwwards HM, Jun 22, 2023 — [Awwwards](https://www.awwwards.com/sites/omega-space-sustainability)
35. **Rolex.com** — refreshed in March 2026 before Watches & Wonders; Coronet called the changes mostly cosmetic. No award was found. A blogger review scored Rolex 36/50 and Omega 33/50 and called Rolex's UX "arguably very strong" (not an award). — [Coronet](https://www.coronet.org/new-1minute-reads/rolex-tidies-up-its-website-and-its-message-in-time-for-the-big-reveal); [KIJO](https://kijo.london/blog/luxury-watch-websites)
36. Older classic: **Raymond Weil "Precision is my Inspiration"** microsite — FWA SOTD + Awwwards SOTD (2013) — [Raymond Weil press](https://www.raymond-weil.com/en/press-news/2013-06-13/)

#### I. Fashion, lifestyle and travel goods

37. **Rimowa Unique** (3D product customization/showcase) — Le Studio Digital BETC Fullsix; Awwwards SOTD, Dec 13, 2019; featured for its "3D product display" — [Awwwards](https://www.awwwards.com/inspiration/3d-product-display-rimowa-unique)
38. **Jacquemus "Bags on Wheels"** (CGI/"FOOH" social video, Apr 2023)
   - Format: giant Le Bambino bags driving through Paris — [FOOH library](https://fooh.com/library/95-jacquemus-hand-bag-on-wheels-in-paris-fooh-ad)
   - **Results (Glossy):** 11.2M views, 1.4M likes, 208K shares and 8.5K comments on TikTok within days. Google searches for "Jacquemus ad campaign" reportedly rose **+900% in 24 h**. — [Glossy](https://www.glossy.co/fashion/fashion-briefing-videos-of-things-that-never-happened-are-dominating-fashion-marketing/)
   - View counts differ by source: Culted cites ~2M — [Culted](https://culted.com/fashion/culted-community-talks-is-jacquemus-a-marketing-genius/); [The Drum](https://www.thedrum.com/news/2024/06/07/jacquemus-15-inside-the-fashion-label-s-surreal-marketing-success)
   - The Jacquemus official site appears as Awwwards inspiration, with no award tier shown — [Awwwards](https://www.awwwards.com/inspiration/jacquemus-official-website-2)
39. **Bottega Veneta "Issue"** (quarterly digital journal, from April 2021, after the brand left social media)
   - An audiovisual experience with voiceovers, music, photography and video instead of long text — [AnOther](https://anothermag.com/fashion-beauty/13221/summer-madness-inside-bottega-veneta-s-new-virtual-diary)
   - Each issue is timed to the **in-store collection launch** — [RetailDetail](https://www.retaildetail.eu/en/news/fashion/bottega-veneta-swaps-social-media-digital-magazine); [L'Officiel](https://www.lofficiel.co.uk/fashion/bottega-veneta-digital-issue)
   - No award was found.
40. **Maison Alaïa** (e-commerce, by AKQA Paris) — Awwwards inspiration, tagged e-commerce/luxury/fashion — [Awwwards](https://www.awwwards.com/inspiration/homepage-maison-alaia)
41. **Aesop**:
   - The Aromatique Candles product page, with a horizontal layout by Studio Regale, is featured as Awwwards inspiration — [Awwwards](https://www.awwwards.com/inspiration/aesop-aromatique-candles-product-page-horizontal-layout)
   - "Aesop – Taxonomy of Design" by Pollen is listed in the 2016 Webby gallery (Best Art Direction). Whether it won or was only nominated is unclear. — [Webby](https://winners.webbyawards.com/2016/advertising-media-pr/craft/best-art-direction/161365/aesop-taxonomy-of-design)

#### J. Japanese brands

42. **POLA "2029 VISION"** (corporate/brand vision site) — Awwwards SOTD, Apr 10, 2019, per an Awwwards collection page. The agency was not identified. — [Awwwards collection](https://www.awwwards.com/mireia_ortega/collections/color-palettes-websites/)
43. **SHISEIDO MAQUILLAGE brand site** — Awwwards HM, Dec 27, 2017 — [Awwwards](https://www.awwwards.com/sites/shiseido-maquillage-brand-site). **Foundation Finder by Shiseido** — Awwwards Nominee only — [Awwwards](https://www.awwwards.com/sites/foundation-finder-by-shiseido)
44. **Clé de Peau Beauté "Global Master Website" (GMW)** — rebuilt with Dentsu Digital. The aim is a globally consistent brand experience with local flexibility. No award was mentioned. — [MarkeZine](https://markezine.jp/article/detail/50011)
45. Older: the **Issey Miyake Parfums** website — Awwwards SOTD, Sep 29, 2012 — [Awwwards search listing](https://www.awwwards.com/inspiration_search/parfum/)

#### K. Documented business/engagement results found (summary)
- Gucci Town (Roblox): 12.5M unique visitors, a 2M daily peak and 30–40K average daily visits. These are self-reported in the Cannes entry. — [Love The Work](https://www.lovethework.com/work-awards/campaigns/gucci-town-in-roblox-1535179)
- Gucci Garden: 20M+ visitors, from a secondary source — [PMI](https://www.pmi.org/most-influential-projects-2022/50-most-influential-projects-2022/gucci-town)
- Jacquemus Bags on Wheels: 11.2M TikTok views and +900% search in 24 h — [Glossy](https://www.glossy.co/fashion/fashion-briefing-videos-of-things-that-never-happened-are-dominating-fashion-marketing/)
- No sales, conversion or traffic figures were found for any of the Awwwards-winning Cartier, Chanel, Dior, Hermès, LV or Bulgari microsites.

### Inferences
- In luxury, design awards go overwhelmingly to **campaign/launch microsites** (Watches & Wonders, fragrance and lipstick launches, holiday games, high-jewelry collections), not to main brand sites or e-commerce. A one-off airport boutique LP is the same format and can realistically aim for Awwwards/FWA-level craft.
- Cartier's yearly series (2022–2026) shows that an "annual edition" can be refreshed and re-awarded every season. An airport LP could do the same with seasonal or holiday editions.
- The few projects with hard numbers (Gucci Town, Jacquemus) are social- or game-driven. Pure-craft microsites rarely publish results. For KPIs, the airport team should plan its own measurement (e.g., store-locator clicks, appointment or reservation taps).

### Gaps
- Not found or not verified, mainly because the search budget ran out and fetches were blocked:
  - Cannes Lions **Luxury Lions** (new category, 2025) Grand Prix and Gold winners
  - Clio Fashion & Beauty, D&AD Pencils, One Show and ADC winners for luxury digital work, 2018–2026
  - Tokyo Interactive Ad Awards and 宣伝会議 coverage of Japanese luxury sites
- No award evidence was found for:
  - Tiffany digital work, Prada, Loewe, Moncler, Montblanc, Byredo or Diptyque
  - Mikimoto, Tasaki, Homme Plissé Issey Miyake, Shiseido main sites or Clé de Peau web
  - Louis Vuitton "Louis: The Game" (downloads or awards)
  - The Hermès e-commerce redesign
- The studio credits for BVLGARI 130th, POLA 2029 VISION and Cartier Watches & Wonders 2023/2026 were not confirmed.
- Typography and colour details (e.g., serif/didone use, gold/black palettes) for most entries could not be verified, because the Awwwards pages could not be opened. Only Jost (Hermès Tutti Twilly) is sourced.

## Q2. Which web studios repeatedly produce award-winning luxury work?

### Takeaway
A small group of Paris-centred studios dominates luxury Awwwards/FWA wins: **Immersive Garden, 60fps, Merci-Michel and makemepulse**, followed by 14islands, Mazarine and Monks. The often-cited big WebGL studios (Active Theory, Lusion, Resn) have strong award records, but no luxury fashion, jewelry or watch projects surfaced for them.

### Cited Findings
- **Immersive Garden (Paris)**
  - Projects: Cartier Watches & Wonders 2024 (SOTD/FWA/CSSDA), Cartier In Time (SOTD/FWA/CSSDA), Dioriviera (SOTD/FWA/CSSDA), Louis Vuitton Collectibles (SOTD + Developer Award, 2024), the Audemars Piguet × GQ Extraordinary Lab (2026) and Longines Spirit Flyback — [Immersive Garden Cartier W&W](https://immersive-g.com/projects/cartier-watches-and-wonders-24); [Cartier In Time](https://immersive-g.com/projects/cartier-in-time); [Dioriviera](https://immersive-g.com/projects/dioriviera-1); [LV Collectibles](https://www.awwwards.com/sites/louis-vuitton-collectibles); [AP](https://www.awwwards.com/gq-audemars-piguet-the-extraordinary-lab.html); [Longines](https://www.awwwards.com/longines-spirit-flyback-by-immersive-garden.html)
  - Lists clients including Louis Vuitton, Cartier, Audemars Piguet and Dior — [DDD Milano speaker bio](https://milano.ddd.live/program/speakers/dilshan-arukatti/)
  - Reported as Awwwards Studio of the Year 2017, 2018 and 2020 (summary of the speaker and conference bios) — [Awwwards interview](https://awwwards.com/interview-immersive-garden-win-studio-and-developer-site-of-the-year.html); [KIKK](https://2022.kikk.be/kikk-for-pro/conferences/immersive-garden)
  - Awwwards profile: https://www.awwwards.com/immersivegarden/
- **60fps (Nancy, France)** — Chanel Les 4 Ombres Boutons (SOTD + Developer Award, 2025), co-credited on Cartier In Time and Dioriviera — [Awwwards 60fps](https://www.awwwards.com/weare60fps/); [Immersive Garden](https://immersive-g.com/projects/cartier-in-time)
- **Merci-Michel (Paris)**
  - A "digital gamification studio" founded in 2012 that has won Awwwards Site of the Year — [Awwwards case study](https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html); [Awwwards interview](https://www.awwwards.com/interview-merci-michel-the-studio-behind-site-of-the-year.html)
  - Luxury work: The Fabulous Cartier Journey (SOTD 2023) and Hermès Tutti Twilly (HM / SOTM Dec 2023) — [Awwwards profile](https://www.awwwards.com/Merci-Michel/)
- **makemepulse (Paris)** — Cartier Le Chœur des Pierres (SOTD Oct 2026) and Rouge Dior (claims SOTD) — [Awwwards](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres); [makemepulse](https://makemepulse.com/case-study/christian-dior-parfums-rouge-dior); profile https://www.awwwards.com/makemepulse/
- **14islands (Sweden/Iceland)** — 365, A Year of Cartier (SOTD, FWA, Lovie silver) — [14islands](https://www.14islands.com/work/cartier365)
- **Mazarine (Paris)** — Chanel Factory 5 (real-time WebGL), Chanel Holiday 2022 and Chanel Les 4 Ombres Tweed — [Mazarine](https://www.mazarine.com/en/projects/chanel-factory-5)
- **Monks (Media.Monks)** — Gucci Vault Art Space (SOTD + Developer Award) — [Awwwards](https://www.awwwards.com/sites/gucci-vault-art-space)
- **Others with one luxury credit:**
  - Superbien — Hermès H24 — [Superbien](https://www.superbien.studio/projects/hermes-h24-interactive-website)
  - Cosmic Shelter — LV Maison of All Victories — [Awwwards](https://www.awwwards.com/inspiration/full-experience-the-maison-of-all-victories)
  - AREA 17 — Fondation LV — [Awwwards](https://www.awwwards.com/sites/fondation-louis-vuitton)
  - stride-it — Bulgari Eclettica — [Awwwards](https://www.awwwards.com/sites/bulgari-eclettica)
  - Le Studio Digital BETC Fullsix — Rimowa Unique — [Awwwards](https://www.awwwards.com/inspiration/3d-product-display-rimowa-unique)
  - AKQA Paris — Maison Alaïa — [Awwwards](https://www.awwwards.com/inspiration/homepage-maison-alaia)
  - Dentsu Digital — Clé de Peau GMW — [MarkeZine](https://markezine.jp/article/detail/50011)
  - Closer — LV × Kusama UK OOH — [Marketing Beat](https://www.marketing-beat.co.uk/2023/01/19/louis-vuitton-yayoi-kusama/)
- **Big-name WebGL studios with no luxury fashion work found:**
  - Active Theory: Awwwards SOTM Jan 2018 (Active Theory v4); 2nd in 2019 Agency of the Year — [Awwwards](https://awwwards.com/active-theory-v4-wins-january-2018-site-of-the-month.html); [Awwwards Annual 2019](https://www.awwwards.com/annual-awards-2019/)
  - Lusion: studio-site SOTM; "Porsche: Dream Machine" CG film for Wallpaper* and Porsche GB — [Awwwards](https://awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html); [Codrops](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)
  - Resn: a search snippet said it won Awwwards Site of the Year for its own "KPR" site, but the primary press release was not identified, so treat this as unverified. No luxury project was found.

### Inferences
- For a "glamorous", jewelry- or watch-grade WebGL feel, the evidence points to the French luxury-specialist cluster (Immersive Garden, 60fps, Merci-Michel, makemepulse, Mazarine). Their portfolios are the most relevant to study frame by frame.
- Merci-Michel's gamified luxury work (Cartier airship, Hermès NYC race) is the closest match for a playful, travel-themed airport idea. Immersive Garden's "universes / alcoves" pattern fits a calm multi-brand showcase.

### Gaps
- The following studios named in the brief were not researched for luxury projects: Locomotive, Dogstudio, Hello Monday, Exo Ape, Obys, Build in Amsterdam, Bonhomme, Unseen Studio and Studio Freight. Locomotive's Awwwards profile surfaced (https://www.awwwards.com/locomotive/), but no luxury project was confirmed.
- No Japanese web studio (e.g., for Shiseido, POLA or Clé de Peau) could be credited from the sources found.

## Q3. What are the recurring visual codes of "luxury" on the web?

### Takeaway
Across the award winners found, the recurring codes are:
- immersive, **scroll-driven WebGL/3D "universes"** with one world per product or collection
- **film-led storytelling**, where video replaces text
- **object-centric 3D product hero** views, especially of jewelry, watches and bags
- **gamified, one-gesture interactions** (hold, tap)
- strict, hand-tuned multilingual typesetting

The sources found did not give enough detail on type and colour to confirm or rule out the "didone serif + gold/black + whitespace" stereotype.

### Cited Findings
- **Scroll journeys through themed worlds:**
  - Cartier W&W 2024: "scroll-based journey… immersive universes" — [Immersive Garden](https://immersive-g.com/projects/cartier-watches-and-wonders-24)
  - Cartier W&W 2025: "immersive alcoves, each one a self-contained world" — [Awwwards](https://www.awwwards.com/watches-wonders-immersive-experience-for-cartier.html)
  - Cartier 365: "infinite scroll WebGL" — [Awwwards](https://www.awwwards.com/inspiration/365-a-year-of-cartier-infinite-scroll-webgl-immersive-experience)
- **3D product as hero:**
  - Chanel Les 4 Ombres: "3D modeling and WebGL" — [Awwwards](https://www.awwwards.com/sites/chanel-les-4-ombres-boutons)
  - Dior by Starck: 3D product — [Awwwards](https://www.awwwards.com/inspiration/product-3d-dior-by-starck-2023)
  - Rimowa Unique: 3D product display — [Awwwards](https://www.awwwards.com/inspiration/3d-product-display-rimowa-unique)
  - Cartier 365: 3D jewellery and image distortion in WebGL — [Awwwards](https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html)
  - Chanel Factory 5: real-time 3D — [Mazarine](https://www.mazarine.com/en/projects/chanel-factory-5)
- **Film/moving image:**
  - Cartier In Time: 12 films in a clock-hand carousel — [Immersive Garden](https://immersive-g.com/projects/cartier-in-time)
  - Cartier "Love Is All": Webby Best Use of Video — [Webby](https://winners.webbyawards.com/2022/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image/215832/cartier-love-is-all)
  - Bottega Veneta Issue: voiceover, music, photo and video instead of long text — [AnOther](https://anothermag.com/fashion-beauty/13221/summer-madness-inside-bottega-veneta-s-new-virtual-diary)
- **Gamification:**
  - Cartier airship with one-input control — [Awwwards case](https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html)
  - Hermès Tutti Twilly NYC race — [Journal du Luxe](https://www.journalduluxe.fr/fr/beaute/hermes-jeu-nouveau-parfum-tutti-twilly)
  - Gucci Garden/Town on Roblox — [Love The Work](https://www.lovethework.com/work-awards/campaigns/gucci-town-in-roblox-1535179)
  - Gucci Mystery Unfolds, an AI (Gemini) mystery — [Awwwards](https://www.awwwards.com/sites/gucci-mystery-unfolds)
- **Tactile micro-interactions:**
  - LV Collectibles "click and hold" and "different universe" switch — [Awwwards](https://www.awwwards.com/inspiration/interaction-click-and-hold-function-louis-vuitton-collectibles)
- **Editorial/magazine format:**
  - BVLGARI 130th as a digital magazine — [Awwwards](https://www.awwwards.com/sites/bvlgari-130th-anniversary)
  - Bottega Veneta Issue — [L'Officiel](https://www.lofficiel.co.uk/fashion/bottega-veneta-digital-issue)
  - Cartier 365 yearbook with 32 articles — [Awwwards](https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html)
- **Illustration/narrative irony:**
  - The Hermès 2026 illustrated marine layer — [Domus](https://domusweb.it/en/news/2026/01/07/herms-new-website.html)
- **Horizontal layouts:**
  - Aesop candles product page — [Awwwards](https://www.awwwards.com/inspiration/aesop-aromatique-candles-product-page-horizontal-layout)
- **Typography (only sourced datapoints):**
  - Hermès Tutti Twilly uses Jost, a geometric sans — [Awwwards](https://www.awwwards.com/websites/Jost/)
  - Gucci has a dedicated font-filter page on Awwwards, implying a proprietary Gucci typeface on its sites — [Awwwards](https://www.awwwards.com/websites/Gucci/)
- **Performance as part of luxury feel:** the "high-end interactive motion" of Cartier 365 relies on KTX2 GPU textures and HTML-first content — [Awwwards](https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html). Chanel's page is praised for "fluid, high-performance development" — [Awwwards](https://www.awwwards.com/sites/chanel-les-4-ombres-boutons)

### Inferences
- For a multi-brand airport LP, the safest code set to borrow is:
  1. a calm overarching frame, with a neutral or editorial palette for the airport's own identity
  2. inside it, per-brand "alcoves", each using that brand's own film or photography and colour
  3. one signature WebGL moment (e.g., a gem, watch or trunk reveal) rather than WebGL everywhere
  4. hand-tuned typesetting per language

  This follows the Cartier W&W "alcove" logic and the Cartier 365 HTML-first logic.
- "きらびやか" sparkle in the winning work comes from **light on materials** (gemstones, metal, lacquer) rendered in 3D or film, not from gold UI chrome. This is suggested by Le Chœur des Pierres ("gemstones reveal…") and the 365 3D jewellery, but it is an inference.
- Brand imagery rights: each maison controls its assets tightly. A multi-brand LP will likely need brand-approved films and photos per boutique, so the frame should be designed to accept heterogeneous assets. This is an inference, not sourced.

### Gaps
- No sourced analysis article on "luxury web visual codes" (e.g., serif/didone display type, whitespace ratios, muted vs. glittering palettes) was retrieved. Searches for trend articles were not run before the budget ran out.
- Colour and type specifics for the Cartier, Chanel, Dior, LV and Bulgari microsites need to be checked visually on the Awwwards pages or live sites.

## Q4. Is there luxury digital work tied to retail store visits or travel/airports?

### Takeaway
Few web projects link directly to store visits, but several useful patterns exist:
- **Hermès Tutti Twilly** starts its game at the Madison Avenue boutique.
- **Bottega Veneta Issue** is timed to in-store collection launches.
- **LV × Kusama** turned store windows, facades and city screens (incl. Shinjuku) into the campaign.
- **Tiffany's Landmark** uses screens as "windows".
- **Van Cleef & Arpels** runs in-store appointment flows and a virtual workshop tour.

Travel motifs (airship, trunk, journeys) recur at Cartier and LV. No travel-retail or airport-exclusive luxury web project was found.

### Cited Findings
- **Hermès Tutti Twilly:** the race through New York starts from the Madison Avenue Hermès boutique — [Journal du Luxe](https://www.journalduluxe.fr/fr/beaute/hermes-jeu-nouveau-parfum-tutti-twilly)
- **Bottega Veneta Issue:** each issue is timed to the in-store collection launch — [RetailDetail](https://www.retaildetail.eu/en/news/fashion/bottega-veneta-swaps-social-media-digital-magazine)
- **LV × Yayoi Kusama:** "windows and facades worldwide become a canvas" — [Love The Work](https://lovethework.com/work-awards/campaigns/yayoi-kusama-x-louis-vuitton-1527856)
  - 3D anamorphic billboard at Cross Shinjuku Vision — [Stylus](https://stylus.com/retail-brand-comms/louis-vuitton-x-yayoi-kusama-ar-ultra-architecture-animatronic-ooh)
  - Harrods facade projection — [LBB](https://www.lbbonline.com/news/louis-vuitton-takes-over-harrods-facade-to-celebrate-launch-of-yayoi-kusama-collaboration)
  - Monumental installations at Paris stores — [Boing Boing](https://boingboing.net/2023/04/12/check-out-these-monumental-kusama-installations-at-two-parisian-louis-vuitton-stores.html)
- **Tiffany Landmark:** ground-floor screens that "look like windows" play New York scenes — [JCK](https://www.jckonline.com/editorial-article/tiffany-reopens-new-york-flagship/)
- **Van Cleef & Arpels:**
  - in-store appointment pages — [VCA](https://www.vancleefarpels.com/ch/de/in-store-appointment.html)
  - 360° virtual workshop tour — [Jewellery Focus](https://www.jewelleryfocus.co.uk/8891-the-maison-completes-renovation-of-its-workshops)
- **Gucci Vault Art Space:** amplified by a Times Square digital billboard — [Love The Work](https://lovethework.com/work-awards/campaigns/gucci-and-superrare-present-the-next-100-years-of-gucci-1535189)
- **Hermès "A Man's World":** digital layer unifying physical events — [Love The Work](https://lovethework.com/work-awards/campaigns/a-mans-world-238210)
- **Travel metaphors:**
  - Cartier airship journey "travel, magical moments and imagination" — [Awwwards case](https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html)
  - LV Collectibles "digital trunk" — [Awwwards](https://www.awwwards.com/sites/louis-vuitton-collectibles)
  - LV "Countless Journeys" (D&AD 2008) — [D&AD](https://www.dandad.org/awards/professional/2008/websites/16972/countless-journeys/)
- **Multilingual reach:**
  - BVLGARI 130th in 8 languages — [Awwwards](https://www.awwwards.com/sites/bvlgari-130th-anniversary)
  - Cartier 365 in EN/FR/CN, typeset by hand (105 pages) — [Awwwards](https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html)
  - Chanel Holiday in 30+ countries — [Mazarine](https://mazarine.com/en/projects/chanel-holiday)
  - Clé de Peau global master site with local flexibility — [MarkeZine](https://markezine.jp/article/detail/50011)

### Inferences
Patterns to adapt for the airport LP (inferences):
1. **"Boutique-as-start-point" mini-game or route**, modelled on Tutti Twilly: e.g., a quick tap game or animated route from the gate to the boutique cluster.
2. **Journey/trunk/flight metaphors**, modelled on the Cartier airship and the LV trunk. These fit an airport naturally and echo codes the houses already use.
3. **Screen-as-window hero**, modelled on Tiffany Landmark: a full-bleed film "window" onto the destination city or each maison's world.
4. **Appointment/reservation CTA per boutique**, modelled on VCA in-store appointments, combined with opening hours and terminal or gate location.
5. **Content drops timed to in-store launches**, modelled on Bottega Issue: seasonal LP editions for airport-exclusive releases.
6. **Multilingual typesetting**, modelled on Cartier 365 and Bvlgari 130th: JP/EN/简/繁/KO compositions adjusted by hand, not machine-flowed.
7. **OOH/gate-screen tie-ins with anamorphic or 3D video**, modelled on LV × Kusama Shinjuku: reuse the LP's hero 3D asset on terminal screens.

### Gaps
- No luxury travel-retail-exclusive web campaign (e.g., duty-free-only editions from Dior, Chanel or Bulgari) and no store-locator UX benchmark with an award was found. Searches on these were not run before the search budget ran out.
- No data was found linking any luxury microsite to measured store-visit uplift.
