# 世界の受賞作から空港ブティックLPを組み立てる

空港内の複数ブランドブティックを1ページで紹介するLPの「完成形」は、世界のどこにも見つからなかった。空港の高級ブティックLPでAwwwards・Webby・D&ADを取った例は確認できない。Webデザイン賞は、**Cartier・Chanel・Louis Vuittonなどメゾンのキャンペーン用マイクロサイト**に集中している。作り手はImmersive Garden、makemepulse、60fps、Merci-Michel、14islandsといったパリ中心の小規模スタジオである。売上の裏付けは空港と商業施設の側にある。ヒースローはサイト刷新後に**コンバージョン率+38.9%、売上+29.2%**を記録した（制作会社の発表）。パリのExtimeでは、高級店を集めて改装したCDG T1国際線エリアの**旅客1人あたり購買額が€87.60**に達し、Extime全体平均の€32.10を大きく上回った。商業施設が取る賞はWebではなくアイデンティティに集まっていて、代表例はM/M (Paris)によるギャラリー・ラファイエット シャンゼリゼ店（東京TDC賞2020グランプリ）と、原研哉によるGINZA SIXのロゴ「GSIX」である。

したがってLPは、三つの層を重ねて組み立てるのが筋がよい。

1. **土台**：空港の情報設計。ブランド索引、店舗のターミナルと営業時間、事前予約、サービス。
2. **器**：館独自のモチーフで統一した、静かな枠。
3. **主役**：ブランドごとの「小部屋」。WebGLの演出は一か所だけに絞る。

国内には新千歳空港の公式サイト（Webグランプリ2024 優秀賞）のように、使いやすさで評価された空港サイトがある。ただ、華やかな複数メゾン型のLPはまだなく、この空白が今回の制作の勝機になる。なお本書の情報はすべて検索結果から集めたもので、ネットワーク制限により各ページの画面は誰も開けていない。デザインに入る前に、必ず各URLを開いて確認してほしい。

## 画面未確認の前提と、記号の読み方

本書は6本の調査メモを統合したリファレンス集である。メモの主題は、空港リテールのデジタル、ラグジュアリー商業施設、ラグジュアリーブランドのWeb、雑誌・エディトリアル、海外の制作会社、国内の制作会社の六つ。情報源はすべて**Web検索の結果と、そこに出てきた公式ページ・業界紙・制作会社の事例ページ**に限られる。

調査環境のネットワーク制限により、次のサイトは直接開けなかった。

- 空港：heathrow.com、changiairport.com、extime.com、dubaidutyfree.com、narita-airport.jp、tokyo-haneda.com
- 商業施設：ginza6.tokyo、thebicestercollection.com
- 受賞・制作会社：awwwards.com、immersive-g.com、14islands.com、spd.org、dandad.org
- 業界紙：moodiedavittreport.com

そのため、**どのリファレンスも、書体・配色・モーション・ブランド一覧の実装を誰も目で確かめていない**。各カードの「見た目・UX」欄は、受賞サイトの紹介文、スタジオの事例解説、記事の記述を要約したものである。「転用ポイント」欄は、調査者と筆者による推論である。

共有の検索回数上限に途中で達したため、次の対象は調べられていない。

- 空港部門の受賞作（Awwwards・Webby・D&AD）
- 空港・トラベルリテール：チューリッヒのThe Circle、イスタンブール空港、King Power、Heinemann
- 百貨店・商業施設：Le Bon Marché、KaDeWe、Bergdorf Goodman、ION Orchard、表参道ヒルズ、東京ミッドタウンなど

本文では次の記号を使う。

| 記号 | 意味 |
|---|---|
| **〔未検証〕** | 調査者が「未確認」「帰属が不確か」「二次情報が一つだけ」と明記したもの |
| **〔食い違い〕** | 出典どうしで数値や受賞ランクが一致しないもの |
| **〔自己申告〕** | 制作会社・運営会社・スポンサー記事が自ら出した数値 |
| **〔URL未検証〕** | 公式URLが検索結果に出ず、調査者の事前知識に頼ったもの |

## 三つの選定目線それぞれの筆頭候補

依頼の三つの目線（受賞、きらびやかさ、売上の伸び）に沿って、最初に見るべき候補を先に挙げる。詳細は各章のカードを参照してほしい。

| 目線 | 筆頭リファレンス | 根拠 |
|---|---|---|
| Webデザイン賞 | Cartier Watches & Wonders（2023・2024・2026年にAwwwards SOTD）、Cartier「Le Chœur des Pierres」（2026年10月 SOTD）、Chanel「Les 4 Ombres Boutons」（2025年 SOTD） | 第3章 B1・B2・B7 |
| アイデンティティ・空間の賞 | ギャラリー・ラファイエット シャンゼリゼ（東京TDC賞2020 GP）、Selfridges（D&AD 2023 Yellow Pencil）、GINZA SIX共用部（Interior Design 2017 Best of Year） | 第2章 F2・F5・FJ1 |
| 空港リテールの業界賞 | Heathrow（Skytrax 2026 Best Airport Shopping）、Extime（The Moodies 2025）、Qatar Duty Free（Frontier Awards 2026、4年連続のAirport Retailer of the Year） | 第1章 A1・A2・A5 |
| きらびやかさ | Le Chœur des Pierres（宝石が物語の入口）、365 A Year of Cartier（3Dジュエリー）、Louis Vuitton Collectibles（デジタル・トランク） | 第3章 B2・B3・B6 |
| 売上の伸び（空港） | Extime CDG T1の旅客1人あたり€87.60、Heathrowのコンバージョン率+38.9%〔自己申告〕、Changiのコンセッション売上+18%、Dubai Duty Freeの売上US$2.378bn | 第1章 |
| 売上の伸び（商業施設） | 御殿場プレミアム・アウトレット1,409億円、伊勢丹新宿本店3,758億円、Bicester Village（2012年に1平方フィートあたり$3,309）、Harrods £898.4M | 第2章 |
| 国内空港 | 新千歳空港（Webグランプリ2024）、関西国際空港T1リノベーション特設サイト | 第1章 AJ1・AJ2 |

## 1. 空港リテールWebの勝ち筋は「ブランド索引×場所×事前予約」

多ブランド型の空港ラグジュアリーで参照価値が最も高いのは、**ヒースロー、Extime（パリ）、チャンギ**の三つである。業界の賞（Skytrax、The Moodies、Frontier Awards）と売上データの両方がそろっている。共通する情報設計は四つに整理できる。

1. **A–Zのブランド索引**。ブランドごとに個別ページを持ち、ターミナル、ゲートまたはゾーン、営業時間を載せる。
2. **事前予約のCTA**。名称はReserve & Collect、Click & Collect、Luxury Reserveなど。
3. **独立したサービス枠**。パーソナルショッピング、エスコート、コンシェルジュ。
4. **空港限定品などの話題づくり**。

KPIの考え方として、Dubai Duty Freeのオンライン売上は全体の**2.65%**しかない。空港LPの成果は、EC売上ではなく来店、事前予約、会員登録で測るのが現実的である。なお、空港の高級ショッピングサイトがWebデザイン賞を取った例は、今回の調査範囲では見つからなかった（空港部門の受賞作は未調査）。

### 海外の空港・トラベルリテール

#### A1. ロンドン・ヒースロー空港：Shops A–Z／Reserve & Collect

| 項目 | 内容 |
|---|---|
| 媒体 | 空港公式サイトのショッピング部門、A–Zのブランド索引、事前予約EC |
| URL | ブランド個別ページの例：[heathrow.com/at-the-airport/shops-a-z/aspinal-of-london](https://www.heathrow.com/at-the-airport/shops-a-z/aspinal-of-london)<br>[Reserve & Collect](https://www.heathrowairport.com/at-the-airport/shopping/reserve-and-collect)<br>予約プラットフォームboutique.heathrow.comは第三者ガイドの記載のみ〔未検証〕 ([heathrowairport-info.co.uk](https://heathrowairport-info.co.uk/shopping)) |
| クレジット | クライアント：Heathrow Airport Ltd<br>Web：**Publicis Sapient**。コンペで獲得し、複数サイトをwww.heathrow.comに統合した。CMSをOpenTextからAdobe Experience Managerへ移し、約9か月で公開 ([Publicis Sapient](https://www.publicissapient.com/customers/stories/how-heathrow-transformed-the-digital-passenger-experience))<br>リテール広告：St Luke's。「Paradise」（2023年7月）と「Be Spoilt for Choice」（2025年8月） ([Creative Salon](https://creative.salon/articles/work/heathrow-paradise-st-luke-s); [LBB](https://lbbonline.com/news/Heathrow-Be-Spoilt-for-Choice))<br>T2ラグジュアリー区画（1,300㎡、8区画と旗艦店1）の空間：Chapman Taylor ([Chapman Taylor](https://chapmantaylor.com/projects/heathrow-airport-terminal-2-uk)) |
| 受賞 | **Skytrax World Airport Awards 2026「World's Best Airport Shopping」**（2026年3月18日） ([Heathrow](https://mediacentre.heathrow.com/pressrelease/detail/24996))<br>The Moodiesのデジタル部門で「大勝者」の一つとされる。開催年は不明〔未検証〕 ([Moodie Davitt](https://moodiedavittreport.com/the-moodies-digital-mobile-and-social-media-award-winners-named/)) |
| 実績 | サイト刷新後の数値は**売上+29.2%、コンバージョン率+38.9%、平均注文額+1.4%**。「直近1年で£30Mの売上増」とも記載〔自己申告：制作会社〕 ([Publicis Sapient](https://www.publicissapient.com/customers/stories/how-heathrow-transformed-the-digital-passenger-experience); [PS eBook](https://www.publicissapient.com/content/dam/ps-rebrand/solutions/2024/cloud-infrastructure/PS-Cloud-CaseStudy-eBook-May2024.pdf)) |
| 見た目・UX | 画面は未確認。URL構造から、ブランドごとに個別ページを持つA–Z索引であることは確認できる。HeathrowのデジタルVPは、サイトを「乗客を中心に全面的に再構成した」と説明している ([Horizont](https://www.horizont.net/agenturen/nachrichten/heathrow-airport-publicis-sapient-betreut-londoner-flughafen-bei-digitaler-transformation-179963))<br>Reserve & Collectは全旅客向けの無料サービス<br>2026年10月、T5でBottega Veneta、ZEGNA、Prada、Dior、Smythsonが新規出店または改装。**ヒースロー限定のPradaバッグ**も販売する ([Future Travel Experience](https://www.futuretravelexperience.com/2026/10/heathrow-expands-t5-luxury-retail-offer-with-new-stores-and-exclusive-passenger-experiences/)) |
| 転用ポイント | 骨格は「A–Z索引→ブランド個別ページ→予約CTA」。そこにパーソナルショッピングと空港限定品のニュースを加える。多ブランド型の空港LPに最も近い、総合的なベンチマーク |

#### A2. Extime（Groupe ADP、パリ CDG・オルリー）

| 項目 | 内容 |
|---|---|
| 媒体 | 空港運営会社の小売・ホスピタリティブランドのサイト。ブランド索引、ターミナルガイド、Click & Collectを持つ |
| URL | ハブ：[extime.com/en/paris](https://www.extime.com/en/paris)<br>ブランドページの例：[Hermès](https://www.extime.com/en/paris/shopping/brands/hermes-luxe)、[Longchamp](https://www.extime.com/en/paris/shopping/brands/longchamp)<br>ターミナルガイドの例：[CDG 2D](https://www.extime.com/en/paris/guide-and-tips/cdg-airport-terminal-2d) |
| クレジット | クライアント：Groupe ADP（免税事業はLagardère Travel RetailとのJV） ([TRBusiness](https://www.trbusiness.com/regional-news/europe/ready-set-extime-groupe-adp-and-lagardere-brings-jv-to-life-at-paris-cdg-t1/229685))<br>広告・ブランデッドコンテンツ「Quand l'hospitalité s'invite à l'aéroport」（2024）：**W Conran Design** ([La Réclame](https://lareclame.fr/wconrandesign/realisations/quand-lhospitalite-sinvite-a-laeroport))<br>内装：T1はMaxime LiautardとHugo Toro、2GはCHZON（Dorothée Meilichzon） ([Moodie Davitt](https://moodiedavittreport.com/interview-expanding-the-extime-platform-at-paris-airports-and-beyond/))<br>免税店のウォークスルー区画（1,320㎡、コスメのコーナー40超）：Hyphen ([hyphen.archi](https://hyphen.archi/portfolio/societe-de-distribution-aeroportuaire-sda/))<br>**サイトとロゴの制作者は不明** |
| 受賞 | **The Moodies 2025 Winner**（空港・小売・ブランド・OOHメディアのコラボ部門）。受賞作は「Extime Immersive Journey」 ([Moodie Davitt](https://moodiedavittreport.com/a-thrilling-roll-call-of-ideation-imagination-and-innovation-the-moodies-social-digital-media-awards-revealed/))<br>CDG空港はSkytrax 2026「Best Airport in Europe」 ([TravelMole](https://www.travelmole.com/news/singapore-best-airport-skytrax-2026)) |
| 実績 | 2024年（[Moodie Davitt](https://moodiedavittreport.com/retail-performance-outstrips-passenger-traffic-growth-at-paris-airports-in-2024/)）：<br>・Extime Paris全体の**旅客1人あたり購買額（SPP）は€32.10（+4.9%）**<br>・高級店を集めて改装したCDG T1国際線エリアは**€87.60**（前年比約+€10）<br>・2E Hall Kは€73（+4%）<br>・Extime Duty Free Parisの売上は**€819m（+8.3%）**<br>2025年のSPPは€31.70（−1.2%、為替要因） ([Moodie Davitt](https://moodiedavittreport.com/?p=466944))<br>T1の売上の3分の2はラグジュアリー ([Moodie Davitt](https://moodiedavittreport.com/interview-talking-consumers-key-categories-and-the-retail-mix-at-extime-duty-free-paris))<br>€87.60をCDG全体の平均とするブログもある〔食い違い〕 ([PowerCommerce](https://powercommerce.com/blogs/ecommerce-hub/extime-duty-free-paris-shaping-the-future-of-airport-retailing-at-charles-de-gaulle)) |
| 見た目・UX | 画面は未確認。検索結果の抜粋によると、ブランドページには店舗ごとのターミナルと営業時間が並ぶ。例は「Hermès – CDG 1, Opening hours 6:30 am – 10:00 pm」で、2EのGate Kにも別店舗がある<br>Click & Collectは**出発20時間前まで、1万点超**の商品から注文できる ([Extime](https://www.extime.com/en/paris/guide-and-tips/cdg-airport-terminal-2d))<br>名称は「Extra Time」の意味。空港で過ごす時間を、もてなしの時間として描いている ([Hospitality ON](https://hospitality-on.com/fr/gestion-de-la-relation-client/extime-la-nouvelle-marque-dadp)) |
| 転用ポイント | ブランドページの型（ブランド→店舗のターミナル・ゲート・営業時間→事前予約）をそのまま使える。店名を並べるのではなく、館独自の呼び名と「もてなしの時間」という物語で複数のメゾンを包むモデル |

#### A3. シンガポール・チャンギ空港／iShopChangi

| 項目 | 内容 |
|---|---|
| 媒体 | 空港ポータル（Shop & Dine）、空港直営のEC、アプリ |
| URL | [changiairport.com](https://www.changiairport.com)<br>iShopChangi：https://www.ishopchangi.com（公式ドメイン、未読込）<br>刷新の解説記事：[Changi Journeys](https://changiairport.com/corporate/media-centre/changijourneys/the-airport-never-sleeps/tailored-just-for-you-Changi-revamped-digital-platforms.html) |
| クレジット | サイト刷新とデジタルAOR：**Tribal DDB** ([Campaign Asia](https://www.campaignasia.com/article/caas-appoints-tribal-ddb-for-changi-airport-website/q3iskdeq4zgxz2uafez10awx8j))<br>iShopChangiのクリエイティブ・デジタルAOR：**Tribal Worldwide**（2023年5月に再任） ([Campaign Asia](https://www.campaignasia.com/article/tribal-worldwide-retains-changis-digital-and-creative-aor-for-ishopchangi/484909))<br>Changi Airport Groupのクリエイティブ：Ogilvy。ソーシャル：Goodstuph ([Marketing-Interactive](https://www.marketing-interactive.com/changi-hands-ogilvy-creative-duties-retains-goodstuph-for-social)) |
| 受賞 | Skytrax 2026「World's Best Airport」 ([Skytrax](https://skytraxratings.com/2026-world-airport-awards-are-announced)) |
| 実績 | 2024年1〜11月の**コンセッション売上が前年比+18%** ([TRBusiness](https://www.trbusiness.com/regional-news/asia-pacific/changi-sees-18-uplift-in-concession-sales-yoy-from-jan-nov-2024/262119))<br>売上上位3カテゴリーは、ラグジュアリー、酒・たばこ、香水・化粧品 ([Changi factsheet](https://changi-airport.mynewsdesk.com/pressreleases/factsheet-travel-retail-at-changi-continues-to-flourish-3260526.pdf))<br>キャンペーン「Changi Millionaire」を2025年1月にプレミアム旅行パッケージ型へ刷新 ([Moodie Davitt](https://moodiedavittreport.com/changi-airport-rolls-out-revamped-millionaire-experiences-campaign)) |
| 見た目・UX | 刷新後のサイトは、情報を早く出すことを重視している。「Curated for You」「Changi Showcase」などのパーソナライズ枠を加え、アプリiChangiも再設計した ([Changi Journeys](https://changiairport.com/corporate/media-centre/changijourneys/the-airport-never-sleeps/tailored-just-for-you-Changi-revamped-digital-platforms.html)) |
| 転用ポイント | 旅客の属性や出発便に応じた「あなた向け」枠。キャンペーンを軸にしたLP運営。長期のAOR体制で改善を続けるモデル |

#### A4. 香港国際空港：Luxury Reserve／HKairport Shop

| 項目 | 内容 |
|---|---|
| URL | [hkairportshop.com](https://www.hkairportshop.com)<br>隣接する11 SKIES：[11-skies.com](https://www.11-skies.com/location-and-connectivity) |
| クレジット | サイト制作会社は不明<br>11 SKIESはNew Worldが開発し、K11が運営する約380万平方フィートの「リテールテインメント」施設 ([Inside Retail Asia](https://insideretail.asia/2020/11/24/new-world-unveils-11-skies-hong-kongs-largest-retailtainment-space/)) |
| 受賞・実績 | 受賞は確認できない<br>ラグジュアリーブランドを10店追加 ([Moodie Davitt](https://moodiedavittreport.com/?p=369390))<br>売上の数値は見つからない |
| 見た目・UX | 空港の「Luxury Zone」のブランドから出発前にオンラインで選び、空港で受け取る。名称は「Luxury Reserve」で、コンシェルジュ型のサービス ([Moodie Davitt](https://moodiedavittreport.com/hong-kong-international-airport-launches-pre-flight-online-shopping-service)) |
| 転用ポイント | 高級店群に「Luxury Zone」のようなゾーン名を付ける。予約CTAを「コンシェルジュ」として見せる。この二つの命名法 |

#### A5. カタール・デューティーフリー／ハマド国際空港

| 項目 | 内容 |
|---|---|
| URL | https://www.qatardutyfree.com、https://dohahamadairport.com（どちらも未読込〔URL未検証〕） |
| クレジット | 空港のブランドアイデンティティ（2014年の開港前）：**Start Design**（ロンドン）。アラビアの星のモチーフ、飛行機のイメージ、幾何学パターンを組み合わせ、「effortless travel（楽な旅）」というメッセージを表した ([Airport Technology](https://www.airport-technology.com/features/branding-airport-identity-sum-parts/)) |
| 受賞 | **Frontier Awards 2026：Airport Retailer of the Year（4年連続）とBest Speciality Concept** ([Qatar Tribune](https://www.qatar-tribune.com/article/257856/latest-news/qatar-duty-free-wins-airport-retailer-of-the-year-award-for-fourth-consecutive-year/amp))<br>第40回Frontier Awards：**Dior Luxury Beauty Retreat**がBest New Specialty Shop Opening ([Moodie Davitt](https://moodiedavittreport.com/?p=429656))<br>Skytrax「World's Best Airport Shopping」を3年連続で受賞（年は記事を参照） ([GTR](https://www.gtrmag.com/blog/hamad-international-airport-clinches-best-airport-shopping-title-for-third-year-running)) |
| 見た目・UX | Webの受賞は見つからない。Chopard、Burberryなどのブランドブティックを展開している ([Moodie Davitt](https://moodiedavittreport.com/qatar-duty-free-strengthens-hamad-international-airport-luxury-offer-with-branded-boutique-openings)) |
| 転用ポイント | 業界賞で最も評価されている空港ラグジュアリー事業者。Dior Retreatのような単一メゾンのコンセプト店を「注目メゾン」の枠で扱う手本になる |

#### A6. ドバイ・デューティーフリー（DXB）

| 項目 | 内容 |
|---|---|
| URL | https://www.dubaidutyfree.com（未読込） |
| クレジット | サイト制作会社は不明 |
| 受賞 | The Moodies 2025受賞（Fix Dessert Chocolatierとのコラボ） ([Moodie Davitt](https://moodiedavittreport.com/a-thrilling-roll-call-of-ideation-imagination-and-innovation-the-moodies-social-digital-media-awards-revealed/))<br>「Dubai Duty Free Home Delivery」はMENA Effie 2021の事例。渡航停止中に新しいEC収益源を作った ([Effie](https://effie.org/case_studies/case/MN_2021_E-2226-245)) |
| 実績 | 2025年の売上は過去最高の**AED 8.68bn（US$2.378bn）、前年比+9.85%**。12月は単月で過去最高 ([Dubai Media Office](https://mediaoffice.ae/en/news/2026/january/01-01/dubai-duty-free-annual-sales))<br>うち**オンラインはAED 230.06m、全体の2.65%** ([Gulf News](https://gulfnews.com/business/retail/dubai-duty-free-breaks-records-with-dhs868-billion-in-2025-sales-1.500396112))<br>+9.5%とする報道もあるが、公式発表は9.85% |
| 見た目・UX | 画面は未確認。紙の空港誌「Dubai Voyager」に16ページのショッピングディレクトリがある（第4章 E6） |
| 転用ポイント | 事業計画に使える売上の根拠。オンライン比率が約3%にとどまるので、LPの目的は「EC売上」ではなく「発見と来店、事前予約」に置くべき、という主張の裏付けにもなる |

#### A7. 韓国の免税店（ロッテ・新世界・新羅）

| 項目 | 内容 |
|---|---|
| URL | ロッテ免税店：[lottedfs.com](https://www.lottedfs.com)<br>新羅免税店：[shilladfs.com](https://www.shilladfs.com) |
| クレジット | ロッテ免税店：**Magnumvint**。顧客の声をもとにメニューUIを改修した ([DI Today](https://ditoday.com/?p=46244)) |
| 受賞 | ロッテ：**Web Award Korea 2018**、モバイルWebマーケティング部門の統合大賞 ([DI Today](https://ditoday.com/?p=46244))<br>新世界：**Web Award Korea 2021**、PC Webの最高大賞 ([Financial News](https://www.fnnews.com/news/202112200859298343))<br>新羅：**Web Award Korea 2015**、Webグローバルサービス部門とモバイルWebショッピング部門（中国モール）で大賞 ([Aju News](https://www.ajunews.com/view/20151218081312703)) |
| 見た目・UX | 画面は未確認。ラグジュアリーブランドを高密度に並べたカタログ型 |
| 転用ポイント | 国のWebデザイン賞を繰り返し取った多ブランド免税事業者は、今回見つかった範囲ではこの3社だけ。アジアの買い物客向けのブランドグリッドとプロモーションバナーの作法を学べる |

#### A8. ニューヨークJFK空港 第4ターミナル（Base Design）

| 項目 | 内容 |
|---|---|
| URL | 事例：[basedesign.com/work/terminal-4-at-jfk](https://www.basedesign.com/work/terminal-4-at-jfk) |
| クレジット | **Base Design**（ブリュッセル／ニューヨーク／ジュネーブ）。イラスト：Tomi Um |
| 受賞・実績 | 受賞と数値は確認できない。Brand New（UnderConsideration）の「First Round」でケーススタディとして紹介された ([UnderConsideration](https://underconsideration.com/firstround/case-study-jfk-terminal-4)) |
| 見た目・UX | 2016年に刷新。「4」を中心にしたカスタム書体（Terminal Four OpenとTerminal Four Filled）、「4 all」というアイデア、鮮やかな配色を使う。旅の不安を和らげる「Guide & Delight」の姿勢をとり、書体は後のデジタル展開にも引き継がれた ([Typeroom](https://www.typeroom.eu/content/terminal-4-jfk-airport); [AIGA Eye on Design](https://eyeondesign.aiga.org/how-do-you-design-for-one-of-the-worlds-most-famous-airports/)) |
| 転用ポイント | ターミナル独自の書体を、LPの見出しとナビゲーションに使う。空間とWebの体験が一続きになる |

#### その他の海外空港リファレンス

| 名称 | URL・出典 | クレジット | 受賞・実績 | 転用ポイント |
|---|---|---|---|---|
| Jewel Changi Airport | [jewelchangiairport.com](https://www.jewelchangiairport.com)（未読込） | ブランディングと開業時のクリエイティブ：Tribal Worldwide ([Marketing-Interactive](https://www.marketing-interactive.com/cags-project-jewel-appoints-creative-agency))<br>建築：Safdie Architects。リテールと内装：Benoy。サイン：Pico | President's Design Award 2020（Design of the Year） ([Safdie](https://www.safdiearchitects.com/news/award-jewel-changi-airport-wins-presidents-design-award-singapore-2020))<br>SG Mark 2020 Platinum ([SG Mark](https://sgmark.org/winners/jewel-changi-airport-2/))<br>iF Design Award 2020（Picoのサイン） ([Pico](https://www.pico.com/news/pico-s-signage-project-at-jewel-changi-airport-wins-the-if-design-award-2020))<br>いずれも建物と体験への賞で、Webへの賞ではない | 建築を主役にしたヒーロー画像。受賞したサインの語彙を店舗マップに応用する |
| Zayed International（アブダビ）／Avolta「Presentedby」 | [Avolta](https://www.avoltaworld.com/en/node/15196) | 運営：Avolta。設計者は不明 | London Design Awards 2025 Platinum（リテールインテリア部門）<br>Frontier Awards 2025「World's Best Airport for Retail」 ([Gulf News](https://gulfnews.com/business/aviation/zayed-international-airport-wins-worlds-best-airport-for-retail-at-frontier-awards-2025-1.500294553)) | 受賞した空港リテールの空間コンセプト。写真の撮り方の参考になる |
| DFS／T Galleria | https://www.dfs.com（未読込） | ブランド「T is for Traveler」（2013年） ([LVMH](https://www.lvmh.com/news-documents/news/t-is-for-traveler-dfs-unveils-t-galleria/))<br>キャンペーン：AR New York ([LBB](https://lbbonline.com/news/dfs-brings-a-painterly-travel-journal-to-life-in-new-campaign)) | 2024年に単一のDFSブランドへ移行したと報じられた〔未検証〕 | 「絵画のような旅日記」という高級トラベルリテールの表現 |
| Lagardère AWPL 免税サイト | [Overdose](https://overdose.digital/our-work/largadere) | Overdose | 年と成果は不明 | 完全カスタムの免税品事前注文サイト（酒、菓子、化粧品、香水） |
| Abu Dhabi Duty Free（addf.ae、2016年） | [Moodie Davitt](https://moodiedavittreport.com/abu-dhabi-duty-frees-new-e-commerce-website-wins-two-awards) | 不明 | Interactive Media Awards「Best in Class」を2部門（EC、消費財）で受賞。審査では使いやすいUIと洗練されたデザインが評価された。2018年以前の事例 | 空港免税ECがWeb賞を取った数少ない前例 |
| ダブリン／コーク空港の免税店 | [dynamo.ie/duty-free](https://www.dynamo.ie/duty-free) | Dynamo（ダブリン） | 「The Loop」から改称。ブランド戦略、VI、ブランドワールド、店舗内装、キャンペーンまで担当 | 空港名を冠した免税ブランドのVIを一貫させる |
| Heathrow × Avolta「Redefine Your Beauty」 | [Moodie Davitt](https://moodiedavittreport.com/heathrow-and-avolta-team-up-for-landmark-redefine-your-beauty-multi-brand-campaign/) | — | 2025年8〜10月に実施。美容品を3点以上・£200以上買うと、最大£200相当のバッグを進呈。2026年に全4ターミナルで再展開 ([Future Travel Experience](https://www.futuretravelexperience.com/2026/08/heathrow-and-avolta-relaunch-redefine-your-beauty-campaign-with-immersive-passenger-experiences/))。成果は非公開 | ブランドを横断するキャンペーン枠 |
| The Moodies 2025のその他の受賞作 | [Moodie Davitt](https://moodiedavittreport.com/a-thrilling-roll-call-of-ideation-imagination-and-innovation-the-moodies-social-digital-media-awards-revealed/) | — | Bahrain Duty Free「Are You Ready to Bubble?」（Best Airport Digital Advertising Campaign）<br>Lancôme Génifique「Travellers' Repair Clinic」（Best Digital Campaign） | 旅行者向けにブランドを体験させるデジタル施策 |

### 国内の空港：受賞は使いやすさの評価のみ、ラグジュアリーLPは空白

日本の空港サイトは、店舗検索、絞り込み、テナント詳細ページを中心にした**機能優先のポータル**である。華やかなラグジュアリーLPは見つからなかった。受賞例は新千歳空港（第12回Webグランプリ、2024年）と、それ以前の中部国際空港（第1回Webグランプリ）だけで、どちらも使いやすさが評価された。LPに最も近いのは、2026年6月の高級ブティック拡張を告知した関西国際空港のT1リノベーション特設サイトである。高級テナントの層が最も厚いのは羽田T3（日本の空港初のDior免税店、Louis Vuitton、資生堂）だが、専用のラグジュアリーLPはない。

#### AJ1. 新千歳空港 公式サイト（北海道エアポート）

| 項目 | 内容 |
|---|---|
| URL | [hokkaido-airports.com/ja/new-chitose/](https://www.hokkaido-airports.com/ja/new-chitose/about/) |
| クレジット | 企画・デザイン・開発：**電通総研** ([Web担当者Forum／PR TIMES](https://webtan.impress.co.jp/r/prtimes/items/000000312.000043138)) |
| 受賞 | **第12回Webグランプリ（2024年）企業グランプリ部門 企業BtoCサイト賞 優秀賞**。同部門には73社・84サイトが応募 ([JAA リリースPDF](https://award.dmi.jaa.or.jp/pdf/wgp2024_release_20241118.pdf)) |
| 実績 | 数値は公開されていない |
| 見た目・UX | 2024年6月にリニューアル。多様な空港利用者へのインタビューをもとに、構成とビジュアルを作り直した。審査では、顧客体験の分析に基づくすっきりしたデザインで、必要な情報にたどり着きやすい点が評価された |
| 転用ポイント | 国内で直近に受賞した空港サイト。ユーザー調査に基づく明快さは、日本の発注者を説得する材料になる |

#### AJ2. 関西国際空港 T1リノベーション特設サイト

| 項目 | 内容 |
|---|---|
| URL | [kansai-airport.or.jp/t1renovation/](https://www.kansai-airport.or.jp/t1renovation/) |
| クレジット | 関西エアポート。制作会社は不明 |
| 受賞 | 確認できない |
| 実績・トピック | T1は2025年3月27日にグランドオープン。1994年の開港以来の大規模改修 ([Aviation Wire](https://www.aviationwire.jp/?p=320125))<br>国際線出発エリアのフェーズ4は2026年6月2日に開業。Burberry、Loewe、Monclerなどのブティックを南北の「Plaza area」に配置し、新規24店と報じられた ([デイリー](https://www.daily.co.jp/leisure/kansai/2026/06/02/0020428938.shtml); [乗りものニュース](https://trafficnews.jp/post/588837))<br>2023年12月には「ウォークスルー型」の免税店と、事前予約で待たずに受け取れる免税店を打ち出している |
| 見た目・UX | 大きなキービジュアル（メインビュー）から始まる特設サイト。段階的な開業ニュースと店舗リストを持つ |
| 転用ポイント | 国内で、ラグジュアリーブティック群を告知する特設サイトに最も近い例。日本の空港が発注者なら、直接の競合として参照すべき |

#### AJ3. 羽田空港 tokyo-haneda.com／T3のラグジュアリー

| 項目 | 内容 |
|---|---|
| URL | 商品検索：[tokyo-haneda.com/goods/search.html](https://tokyo-haneda.com/goods/search.html)<br>テナント詳細の例：[tenant_00560](https://tokyo-haneda.com/shop_and_dine/detail/tenant_00560.html) |
| クレジット | 運営：日本空港ビルデング、東京国際空港ターミナル。サイト制作会社は不明 |
| 受賞 | 確認できない |
| 実績・トピック | 2020年3月に国内線と国際線のサイトを統合した。**モバイルファースト**で設計し、日本語・英語・中国語（簡体・繁体）・韓国語の5言語に対応 ([Aviation Wire](https://www.aviationwire.jp/?p=197914))<br>EC「HANEDA Shopping」は2024年5月にデザインを刷新 ([Digital PR Platform](https://digitalpr.jp/r/88291))<br>T3の主な高級テナント：<br>・**日本の空港で初のDior免税店**（2022年10月） ([Fashionsnap](https://www.fashionsnap.com/article/2022-10-26/dior-haneda-airport/))<br>・Louis Vuitton ([Louis Vuitton](https://us.louisvuitton.com/eng-us/point-of-sale/japan/louis-vuitton-haneda-airport-t3))<br>・SHISEIDO HANEDA BOUTIQUE（2021年7月） ([資生堂](https://corp.shiseido.com/jp/news/detail.html?n=00000000003164)) |
| 見た目・UX | 「レストラン&ショップ」で飲食・物販・免税店を絞り込み、テナントごとの詳細ページへ進む。商品検索「羽田の人気商品」もある |
| 転用ポイント | 国内で最も厚い高級テナント群を持つ。「絞り込み＋テナント詳細」という現状の型は、新しいLPが超えるべき基準線になる |

#### その他の国内空港リファレンス

| 名称 | URL・出典 | クレジット | 受賞・実績 | 転用ポイント |
|---|---|---|---|---|
| 成田国際空港 | [ショップ詳細の例](https://www.narita-airport.jp/ja/shop/shop-search/t1sw03_t0003k/) | NAA。ブランドロゴは「組紐」がモチーフで、2016年12月発表。日本の藍色、大空の青、地球の水色の3色を結ぶ。デザイナー名は不明 ([乗りものニュース](https://trafficnews.jp/post/62236)) | 2016年12月22日に12年ぶりの全面刷新。トップを「飛行機にのる／空港で過ごす／交通アクセス」の3分類に絞り、PCとスマホを統合、5言語とユニバーサルデザインに対応 ([Aviation Wire](https://www.aviationwire.jp/?p=108216))<br>高級LPは見つからない | 3分類への思い切った単純化。伝統工芸をモチーフにしたロゴ |
| 福岡空港 国際線ターミナル | [乗りものニュース](https://trafficnews.jp/post/534155) | — | 2025年3月28日にグランドオープンし、免税エリアは約4倍に。資生堂のカウンターは5倍の広さで11ブランドを扱う ([資生堂PDF](https://corp.shiseido.com/jp/newsimg/4017_e7c04_jp.pdf))<br>LPと受賞はない | 新規開業を告知するときの素材 |
| 中部国際空港セントレア | [TravelVoice](https://www.travelvoice.jp/20130201-772) | — | 2013年2月に刷新し、**第1回Webグランプリ 企業サイト賞グランプリ** ([AdverTimes](https://www.advertimes.com/?p=134990))。2018年より前の事例 | 「ブランドを傷つけかねない」サイトを利用者の視点で作り直した前例 |
| 羽田「Haneda Eternal」（2021年） | [GIZMODO JAPAN](https://www.gizmodo.jp/2021/01/haneda-eternal-1.html) | 文化庁の事業。クリエイティブディレクション：MUTEK.JP | — | 空港を舞台にしたデジタルアート |
| Peach × nendo（2026年） | [Aviation Wire](https://www.aviationwire.jp/?p=341145) | nendo | 2026年3月31日に新ロゴと機体デザインを発表。4月15日に成田T1国内線カウンターを新デザインにし、「葉っぱ」と「円」のモチーフを配置 ([Aviation Wire](https://www.aviationwire.jp/?p=341799)) | 空港で目にする最新のブランドの語彙 |

## 2. 商業施設の「受賞」はWebではなくロゴと空間に集まる

高級モールや百貨店の**Webサイト**が、Awwwards・FWA・Webby・Webグランプリを取った例は見つからなかった。2014〜2022年のWebグランプリのリリースを確認しても、商業施設の受賞はない ([JAA Webグランプリ2022 PDF](https://interior-i.jp/wp/wp-content/uploads/2022/11/WebGrandPrix2022_award.pdf))。受賞が集まるのは、アイデンティティ・キャンペーン系の賞（東京TDC、D&AD、One Show、グッドデザイン賞）と、不動産・小売系の賞（MAPIC、MIPIM、IGDS、日本SC大賞）である。

売上の裏付けはむしろ厚い。海外ではBicester Village、The Dubai Mall、Harrods、SKP北京。国内ではGINZA SIX、伊勢丹新宿本店、御殿場プレミアム・アウトレット、阪急うめだ本店に数字がある。

デザインの観点で重要な発見は二つある。一つは、**建築をUIに変える**手法である。Rinascenteは店のアーチ、ギャラリー・ラファイエットはサイコロをUIに持ち込み、館固有のモチーフで多数のブランドを束ねている。もう一つは、**サービスがブランド一覧と同じくらい売上を生む**ことである。Bicesterのクライアントサービス売上は+30%だった。

### 海外の商業施設

#### F1. The Bicester Collection／Bicester Village（Value Retail）

| 項目 | 内容 |
|---|---|
| 媒体 | 欧州・アジアにある11のVillage（高級アウトレット）の公式サイト、バーチャル体験、広告 |
| URL | [thebicestercollection.com](https://www.thebicestercollection.com/)<br>航空会社との提携ページの例：[/zh-CN/partner-offers/garuda/](https://www.thebicestercollection.com/zh-CN/partner-offers/garuda/) |
| クレジット | デジタルAOR（2019年〜）：**Huge London**。11 Villageのオンライン体験を、店舗の高級体験とつなぐのが課題 ([The Drum](https://www.thedrum.com/news/bicester-village-owner-picks-huge-london-digital-overhaul))<br>広告「Fresh every day」：Leagas Delaney ([Creativepool](https://creativepool.com/matt-sclarandis/projects/fresh-every-day-for-bicester-village))<br>Virtual Village（2023年11月）：**Emperia** ([Mobile Marketing Magazine](https://mobilemarketingmagazine.com/the-bicester-collection-launches-a-multi-destination-virtual-village-experience/)) |
| 受賞 | 確認できない |
| 実績 | 2012年に**1平方フィートあたり$3,309**を売り上げ、「世界で群を抜いて生産性の高いショッピングセンター」とされた（Value RetailとICSCの統計） ([BoF](https://www.businessoffashion.com/articles/news-analysis/ceo-talk-scott-malkin-chairman-value-retail))<br>2017年のインタビューでは£3,950〔自己申告。年が違うので単純比較はできない〕 ([FashionNetwork](https://fi.fashionnetwork.com/news/Value-Retail-s-Desiree-Bollier-on-what-makes-it-and-Bicester-Village-unique,882709.html))<br>2024年は非EU客の免税売上が+9%。**VIP用セリングスイートやハンズフリーショッピングなど「クライアントサービス」の売上が+30%** ([WWD 2025 PDF](https://media.thebicestercollection.com/3z73vs69pqez/29Tnysrj8UOVrqWDz6VVDc/edd25e8c5965f8acd919d91ad12be45b/2025_WWD_Bicester_Village_Marks_30_Years.pdf)) |
| 見た目・UX | 画面は未確認<br>Virtual Villageでは4つのVillageを自由に歩き回り、その場でハンズフリーショッピングの予約や会員登録ができる<br>航空会社ごとの特典ページを中国語やアラビア語でも用意している。Emirates SkywardsやANAの提携先でもある ([Emirates](https://www.emirates.com/bw/english/skywards/partners/the-bicester-collection/); [ANA](https://www.ana.co.jp/es/mx/amc/partner-shop/the-bicester-collection/))<br>ブランド索引が「A–Z＋カテゴリー絞り込み」という点は、調査者の事前知識だけ〔未検証〕 |
| 転用ポイント | 国際的で、免税と乗り継ぎに強い客層は空港と最も近い。予約、ハンズフリー、VIPなどのサービス枠をブランド一覧と同格に置く根拠になる。航空会社のマイル提携ページも導線として使える |

#### F2. ギャラリー・ラファイエット シャンゼリゼ店（2019年開業）

| 項目 | 内容 |
|---|---|
| URL | 公式URLは調査メモに記載なし。店舗サイトは開業日の2019年3月28日に公開された ([FashionUnited](https://fashionunited.uk/news/retail/galeries-lafayette-unveils-visual-identity-of-its-new-champs-elysees-store/2019031442164)) |
| クレジット | アイデンティティ：**M/M (Paris)**（Michaël Amzalag、Mathias Augustyniak）<br>建築：BIG ([designboom](https://www.designboom.com/architecture/bjarke-ingels-group-big-galeries-lafayette-champs-elysees-paris-04-05-2019/))<br>Web制作会社は不明 |
| 受賞 | **東京TDC賞2020 グランプリ** ([Tokyo TDC](https://tokyotypedirectorsclub.org/en/award/2020_grandprix)) |
| 実績 | 新しい小売モデルとして、**300人のパーソナルスタイリスト**を置いて開業 ([2Luxury2](https://www.2luxury2.com/?p=1285127))。売上の数値はない |
| 見た目・UX | アイデンティティの軸は**2つのサイコロ**。専用書体と空間演出で、店を「一つの世界」として扱った。サイコロのモチーフはファサードからデジタルコミュニケーションまで貫かれている。ロゴは「Galeries Lafayette」と「Champs-Elysées」を未来的な書体でつないでいる |
| 転用ポイント | 館独自のモチーフを一つ決め、見た目のばらばらなメゾンをそれで束ねる。受賞の裏付けがある「アイデンティティ先行」型の代表例 |

#### F3. Rinascente（ミラノ／ローマ）

| 項目 | 内容 |
|---|---|
| URL | [rinascente.it](https://www.rinascente.it/)<br>事例：[AKQA「Digital Renaissance」](https://akqa.com/work/rinascente/digital-reinassance) |
| クレジット | **AKQA**（2021年2月に事例掲載） |
| 受賞 | 確認できない |
| 実績 | 先行したECは**650ブランド・約15,000点**で開始した ([TextilWirtschaft](https://www.textilwirtschaft.de/the-spin/news/15.000-articles-from-650-brands-rinascente-starts-with-e-commerce-225970)) |
| 見た目・UX | 先行ECでは、商品写真を**アーチ形に切り抜き**、ミラノ旗艦店の列柱へのオマージュにした（TextilWirtschaft）<br>AKQA版はトップページに店の象徴的なアーチを使い、「フロアを歩き回る」感覚を狙ったとされる。ただしこの記述はフリーランスの寄稿によるもの〔未検証〕 ([Creativepool](https://creativepool.com/akqa/projects/digital-renaissance-for-rinascente)) |
| 転用ポイント | 建築をUIに変える手法。空港なら、屋根の曲線やゲートの幾何学を画像マスクやグリッドに使える |

#### F4. LANDMARK（香港、Hongkong Land）

| 項目 | 内容 |
|---|---|
| URL | https://www.landmark.hk/〔URL未検証〕 |
| クレジット | アイデンティティ（2011〜12年）：**Pentagram**（Harry Pearce、Naresh Ramchandani）<br>親会社Hongkong Landのブランド刷新：**DNCO** |
| 受賞・実績 | どちらも確認できない |
| 見た目・UX | 25案を検討したうえで、様式化した**Bodoniの「L」**に決めた ([Design Week](https://www.designweek.co.uk/issues/december-2011/pentagrams-pearce-and-ramchandani-brand-hong-kong-retail-development/))<br>2017年は、1年間のイベントと広告をすべて「A Year of Wisdom」という一つのテーマで統一した ([Pentagram](https://www.pentagram.com/work/landmark-a-year-of-wisdom/story))<br>DNCOは、Henry Steinerがデザインした「H」を、**3Dで動くことを前提にしたマーク**に作り直した ([DNCO](https://dnco.com/work/hongkong-land-corporate-branding)) |
| 転用ポイント | 古典的なラグジュアリー書体を「館のマスターブランド」に据える。1年のテーマで催事を束ねる編集方針。動くロゴはそのままLPのヒーローになる |

#### F5. Selfridges（ロンドン）

| 項目 | 内容 |
|---|---|
| URL | [selfridges.com](https://www.selfridges.com/) |
| クレジット | 受賞したキャンペーンの制作者は不明<br>Alexander McQueen × Selfridges：Pentagram ([Pentagram](https://www.pentagram.com/work/alexander-mcqueen-selfridges?setSerializedKey=2)) |
| 受賞 | **D&AD 2023 Yellow Pencil**（Illustration／Environmental部門）。受賞作は「Selfridges Celebrates: 2D Artistry」 ([D&AD](https://dandad.org/awards/professional/2023/236740/selfridges-celebrates-2d-artistry))<br>IGDS「百貨店による世界最優秀マーケティングキャンペーン」2017年（EveryBODY） ([FashionUnited](https://fashionunited.uk/news/retail/selfridges-wins-best-department-store-campaign/2017061224794)) |
| 実績 | 確認できた最新のWeb刷新は2014年で、5年間で£40M超を投資 ([Retail Week](https://www.retail-week.com/sectors/department-stores/selfridges-invests-in-40m-website-revamp-to-future-proof-the-business/5064756.article)) |
| 見た目・UX | 2023年1〜4月、ショーウィンドウと売場の什器に、イラストで描いた「異世界の店構え」を展開した |
| 転用ポイント | 店構えをイラストで描く手法は、ブランドごとに写真素材の質がそろわないときの統一手段になる |

#### F6. Harrods（ロンドン）

| 項目 | 内容 |
|---|---|
| URL | [harrods.com](https://www.harrods.com/) |
| クレジット | デジタル：**Fantasy**。店舗とオンラインをつなぐプロジェクトで、事例ページは掲載日不明 ([Fantasy](https://fantasy.co/work/harrods))<br>リバプールのエージェンシーTokyoもデジタルパートナー（時期は不明） ([Prolific North](https://prolificnorth.co.uk/news/liverpools-tokyo-appointed-digital-partner-harrods))<br>自社ブランドの菓子のアイデンティティ：Smith &+ Village（2021年ごろ） ([Transform](https://www.transformmagazine.net/articles/2021/smith-plus-village-designs-new-identity-for-harrods-own-brand-confectionary/)) |
| 受賞 | 確認できない |
| 実績 | 2024年2月3日に終わった年度に、**過去最高の売上£898.4M（+8%）**、営業利益£162.9M ([Retail Gazette](https://www.retailgazette.co.uk/blog/2024/09/harrods-sales-near-900m/))<br>FY2025のグループ売上は約£1.1bn（+1.2%） ([FashionUnited](https://fashionunited.uk/news/business/harrods-navigates-global-luxury-headwinds-outperforms-market-in-fy25/2026081289740))<br>二つの数字は集計範囲が違う可能性がある〔食い違い〕 |
| 見た目・UX | 2024年10月にEC基盤を刷新し、ヘッドレス構成のフロントエンドとERPの統合を導入した ([Retail Gazette](https://www.retailgazette.co.uk/blog/2024/10/harrods-relaunches-website/))<br>「Brands A–Z」のメガメニューがある点は、調査者の事前知識だけ〔未検証〕 |
| 転用ポイント | 年15誌を超えるハウスマガジン（第4章）と組み合わせた、「編集×EC」型の百貨店モデル |

#### その他の海外商業施設リファレンス

| 名称 | URL・出典 | クレジット | 受賞・実績 | 転用ポイント |
|---|---|---|---|---|
| K11 MUSEA（香港） | [k11musea.com](https://www.k11musea.com/)（未読込） | 「Inside Muses」：Toby Ng Design。建築：KPF | **One Show 2020**（Design部門）。デジタル作品かどうかは不明 ([One Club](https://www.oneclub.org/awards/theoneshow/-award/36272/inside-muses/))<br>建築はSingapore Good Design Award 2024 ([KPF](https://www.kpf.com/news/k11-musea-wins-2024-singapore-good-design-award)) | アートと商業の融合。「文化のシリコンバレー」という打ち出し方 |
| ICONSIAM（バンコク） | https://www.iconsiam.com/〔URL未検証〕 | Siam Piwat | **MAPIC Awards 2019 Best Shopping Centre** ([Bangkok Post](https://bangkokpost.com/thailand/pr/1812034/iconsiam-wins-top-prize-from-cannes-france))<br>**MAPIC 2025で、過去30年で最も影響力のある商業不動産プロジェクトのトップ3**に選出（アジアで唯一） ([Inside Retail Asia](https://insideretail.asia/2025/11/21/siam-piwats-iconsiam-earns-high-recognition-at-mapic-awards-2025/))<br>2018年の開業以来の来館者は1億1,500万人超、タイの高級品小売シェアは約70%〔自己申告：スポンサー記事〕 ([Fortune Brand Studio](https://fortune.com/brandstudio/siampiwat/siam-piwat-the-game-changer-behind-thailands-transformative-iconsiam)) | 「7 Wonders」のように、館内の見どころに名前を付ける |
| The Dubai Mall | https://thedubaimall.com/〔URL未検証〕 | Emaar | 2023年の来館者は**1億500万人**（+19%） ([India Outbound](https://indiaoutbound.info/?p=94289))<br>2024年は1億1,100万人超とする報道があるが、出典は1媒体だけ〔未検証〕 ([CairoScene](https://cairoscene.com/Buzz/Dubai-Mall-Welcomes-Record-Breaking-111-Million-Visitors-in-2024)) | 集客規模を示す根拠 |
| SKP北京 | [BoF](https://www.businessoffashion.com/news/luxury/beijings-top-luxury-department-store-skp-surpasses-harrods-in-sales) | — | 2020年に177億元でハロッズを抜き、売上世界一の百貨店に<br>2023年は過去最高の265億元、2024年は約220億元（−17%） ([界面](https://www.jiemian.com/article/12370908.html))<br>非上場のため、数値はすべて第三者による | ラグジュアリー百貨店の売上規模の基準 |
| La Samaritaine（パリ） | [Yabu Pushelberg](https://yabupushelberg.com/work/la-samaritaine-paris) | ロゴ「S」：Be-pôles（出典は1件のみ） ([CB News](https://www.cbnews.fr/node/47621))<br>内装：Yabu PushelbergとHubert de Malherbe。建築：SANAA<br>サイトはLVMHの社内チームが運用 | 初年度の来館者は約300万人〔自己申告：DFS〕 ([IADS](https://www.iads.org/articles-reports/la-samaritaine-what-to-expect-after-so-many-expectations)) | 一文字のロゴで館を象徴させる |
| Liberty London／Saks Fifth Avenue | [Design Week](https://www.designweek.co.uk/issues/15-21-june-2020/pentagram-liberty-rebrand/); [Pentagram](https://www.pentagram.com/news/shop-saks-campaign) | Pentagram。Libertyは2020年にHarry Pearce、SaksはMichael Bierut | Libertyは新しいロゴタイプ、専用書体、紋章の描き直し。Saksは正方形のロゴと「Shop Saks」キャンペーン | 百貨店の書体システム |

### 国内の商業施設：GINZA SIXとPARCOが華やかさの二大参照点

国内の商業施設は**売上の記録が最も厚い**。2023年度の伊勢丹新宿本店3,758億円、2024年度の御殿場プレミアム・アウトレット1,409億円はいずれも過去最高である。創造面で強い参照先は、GINZA SIX（原研哉のロゴとCuriosityの共用部）と、渋谷PARCO（M/M (Paris)とViviane Sassenによる再開業キャンペーン）。PARCOはギャラリー・ラファイエット シャンゼリゼ店と同じスタジオの仕事である。一方で、施設のWebサイト自体の制作クレジットは一件も特定できなかった。

#### FJ1. GINZA SIX

| 項目 | 内容 |
|---|---|
| URL | [ginza6.tokyo](https://ginza6.tokyo/) |
| クレジット | ロゴ「GSIX」：**原研哉（日本デザインセンター 原デザイン研究所）**<br>建物の基本設計と外観：谷口吉生 ([美術手帖](https://bijutsutecho.com/magazine/news/headline/362))<br>共用部のインテリア：**Curiosity（グエナエル・ニコラ）**<br>開業PR：サニーサイドアップ ([SUNNY SIDE UP](https://www.ssu.co.jp/eng/works/2017/08/03/640/))<br>**Webサイトの制作会社は不明** |
| 受賞 | Curiosityが手がけた共用部が、**Interior Design誌の2017 Best of Year（Large Retail部門）**を受賞 ([Interior Design](https://interiordesign.net/projects/ginza-six-by-curiosity-2017-best-of-year-winner-for-large-retail/)) |
| 実績 | 2017年4月20日に241店舗、約47,000㎡で開業 ([GINZA SIX PDF](https://ginza6.tokyo/wp-content/themes/G6/pdf/pressroom/pressrelease_en_170414.pdf))<br>初年度の目標だった売上600億円と来館2,000万人を達成 ([東洋経済](https://toyokeizai.net/articles/-/217525))<br>2022年は過去最高の売上（2019年比+10%超、金額は非公表） ([WWDJAPAN](https://www.wwdjapan.com/articles/1519642))<br>2023年度は会員数と会員売上が過去最高。**会員売上の約47%が30代以下** ([日経クロストレンド](https://xtrend.nikkei.com/atcl/contents/18/01039/00004/))<br>2024年度の取扱高も過去最高（金額は非公表） ([日本経済新聞](https://www.nikkei.com/article/DGXZQOUC22AJ50S5A420C2000000/)) |
| 見た目・UX | ロゴは「GINZA SIX」を「GSIX」に縮め、**「G」だけを金色**にした。原は銀座の「軸性」を込め、**ハイブランドのロゴと並んでも埋もれず、それらを支える簡潔さ**を重視したという ([GINZA SIX](https://ginza6.tokyo/news/3857))<br>ロゴは建築と一体で設計され、夜は内側から白く光る<br>共用部には、吹き抜け天井の麻の葉模様の和紙と、オーク材パネルに重ねたアルミルーバーを使っている ([Curiosity](https://curiosity.jp/works/ginza-six.html)) |
| 転用ポイント | 多ブランドLPのワードマークの原則がここにある。名前を短く抽象化し、金は一点だけ使い、入居するメゾンの邪魔をしない。和紙、麻の葉、オーク、アルミルーバーという素材の語彙は、テクスチャや罫線に使える。会員層の若さは、デジタル会員への導線を設ける根拠になる |

#### FJ2. 渋谷PARCO（2019年再開業）

| 項目 | 内容 |
|---|---|
| URL | https://shibuya.parco.jp/〔URL未検証〕 |
| クレジット | 再開業キャンペーン：**M/M (Paris)**。写真は**Viviane Sassen**（Miu MiuやLouis Vuittonの広告で知られる） ([PARCO PDF](https://parco.co.jp/pdf/jp/cname_20190820095708.pdf))<br>2019年クリスマスのアートディレクションとデザイン：本田千尋 ([PARCO PDF](https://parco.co.jp/pdf/jp/cname_20191107190229.pdf))<br>PARCO MUSEUM TOKYOとGALLERY Xの空間グラフィック：YOSHIROTTEN／YAR ([PARCO PDF](https://parco.co.jp/pdf/jp/cname_20190919103500.pdf)) |
| 受賞 | 工事中の仮囲い「AKIRA ART WALL」が**グッドデザイン賞2018** ([PARCO PDF](https://parco.co.jp/pdf/jp/cname_20181003110817.pdf))<br>**第9回日本SC大賞（2023年）50周年記念特別賞** ([Walkerplus](https://www.walkerplus.com/article/1137988/)) |
| 実績 | 2019年11月22日に再開業。5カテゴリー・193店で、**全館に94面のデジタルサイネージ**を入れた ([ビジネス+IT](https://www.sbbit.jp/article/cont1/49780))<br>売上への効果を示す数値は見つからない |
| 見た目・UX | 2019年8月20日の「TEASER」から10月1日の「OPENING」まで、3部作の映像で開業を盛り上げた ([PARCO PDF](https://parco.co.jp/pdf/jp/cname_20191001085927.pdf)) |
| 転用ポイント | 国内における「アイデンティティ先行×ファッション写真家」型の代表例。ブランドロゴを並べるのではなく、季節ごとの写真シリーズで館を語る |

#### FJ3. 阪急うめだ本店／HANKYU LUXURY

| 項目 | 内容 |
|---|---|
| URL | https://www.hankyu-dept.co.jp/honten/〔URL未検証〕 |
| クレジット | H2Oリテイリング。制作会社は不明 |
| 受賞 | 確認できない |
| 実績 | 2023年度のインバウンド売上は**638億円**で、国内の単独店でトップ ([FASHIONSNAP](https://www.fashionsnap.com/article/2024-06-23/inbound-customers/))<br>5〜6階の「HANKYU LUXURY」は**2026年3月20日に正式開業し、投資額は約120億円** ([FASHIONSNAP](https://www.fashionsnap.com/article/2026-03-17/hankyu-luxury-open/))<br>開業後、**100万円以上の商品の売上が前年比約30%増**。ただし掲載月の特定に不確かさがある〔未検証〕 ([FASHIONSNAP](https://www.fashionsnap.com/article/2026-08-07/senken-department-store-july/)) |
| 見た目・UX | 未確認 |
| 転用ポイント | 1フロアに名前を付け、専用のサブLPと厳選したブランドで売る「ゾーン」型。空港の高級ブティックの回廊にも同じように名前を付けられる |

#### その他の国内商業施設リファレンス

| 名称 | URL・出典 | クレジット | 受賞・実績 | 転用ポイント |
|---|---|---|---|---|
| MIYASHITA PARK | https://www.miyashita-park.tokyo/〔URL未検証〕 | VI：OMFG Co.（海外のスタジオとみられる） ([OMFG Co.](https://www.omfgco.com/project/miyashita-park)) | **2020年度グッドデザイン賞** ([三井不動産](https://digitalpr.jp/r/42127)) | 媒体に合わせて伸び縮みする「M」のロゴ。季節のイベントやコラボの器として使える |
| 大丸心斎橋店 | https://www.daimaru.co.jp/shinsaibashi/〔URL未検証〕 | 象徴となる「D-WALL」：**Rhizomatiks Design**。店のコンセプトは「Delight the World 世界が憧れる、心斎橋へ。」 ([Impress Watch](https://www.watch.impress.co.jp/docs/news/1189771.html)) | 2019年9月20日に、86年ぶりの建て替えを経て再開業（総工費372億円）<br>2023年度の免税売上は**313億円**で前年の2倍超、売上の約33%を占める ([WWDJAPAN](https://www.wwdjapan.com/articles/1819677)) | 光の演出を店の「顔」にする |
| 伊勢丹新宿本店／三越銀座店 | https://www.mistore.jp/store/shinjuku.html〔URL未検証〕 | — | 2023年度は伊勢丹新宿本店が**3,758億円（+14.7%）**、三越銀座店が**1,047億円（+35.6%）**で、ともに過去最高。記事と数値の対応は推定〔未検証〕 ([WWDJAPAN](https://www.wwdjapan.com/articles/1815863)) | 高額品の顧客イベントの作り方 |
| 御殿場プレミアム・アウトレット | https://www.premiumoutlets.co.jp/gotemba/〔URL未検証〕 | 三菱地所・サイモン | 2024年度は**1,409億円（+13.7%）**で過去最高、国内のSCで売上1位 ([WWDJAPAN](https://www.wwdjapan.com/articles/2109417))<br>2025年度の1,467億円は見出ししか確認できない〔未検証〕 | 増床と訪日客で伸びた代表例 |
| LUMINE | https://www.lumine.ne.jp/〔URL未検証〕 | コピー：尾形真理子。2005年に「わたしらしくをあたらしく」が企業スローガンになり、2007年から広告のCDを務める ([LUMINE](https://digitalpr.jp/r/25627))<br>写真：蜷川実花。2020年春のADは関谷奈々 ([AdverTimes](https://www.advertimes.com/?p=177502)) | 尾形のプロフィールにTCC賞と朝日広告賞グランプリの受賞歴がある。どの作品での受賞かは〔未検証〕 | 写真と短い物語のコピーを連載し、季節ごとに館を語る |

## 3. きらびやかさの源泉はメゾンのキャンペーン用マイクロサイト

ラグジュアリー領域のWebデザイン賞は、ほぼすべてが**キャンペーン用マイクロサイト、新作の発売用LP、ゲーム**に与えられている。ブランドの本体サイトやECではない。時計見本市の特設サイト、香水や口紅の発売、ホリデーのゲーム、ハイジュエリーのコレクションなどである。最も多く受賞しているのは**Cartier**で、2022年から2026年までほぼ毎年Awwwards SOTDを取っている。

空港の多ブランドLPも単発の特設ページなので、まさにこの形式にあたる。Awwwards・FWA級の作り込みを現実的な目標に置ける。一方で、事業の数値が公開されているのは、ゲームやソーシャル系（Gucci Town、Jacquemus）と、AKQAのLoewe ECだけである。純粋な演出系のマイクロサイトは成果を公開しない。

なお「きらびやかさ」は、金色のUI装飾から生まれているわけではない。宝石、金属、漆に当たる光を3Dや映像で描くことから生まれている（受賞作の記述からの推論）。

### Cartierシリーズ：毎年SOTDを取る「小部屋」構成

#### B1. Cartier Watches & Wonders（2023〜2026年）

| 項目 | 内容 |
|---|---|
| 媒体 | 時計見本市に合わせて毎年作られるキャンペーン用マイクロサイト |
| URL | 2023：[awwwards.com/sites/cartier-watches-and-wonders](https://www.awwwards.com/sites/cartier-watches-and-wonders)<br>2024：[cartier-watches-wonders-2024](https://www.awwwards.com/sites/cartier-watches-wonders-2024)<br>2025：[Awwwards特集記事](https://www.awwwards.com/watches-wonders-immersive-experience-for-cartier.html)<br>2026：[cartier-watches-wonders-2026](https://www.awwwards.com/sites/cartier-watches-wonders-2026) |
| クレジット | 2023：**Immersive Garden**、60fps、Mooders ([Immersive Garden](https://immersive-g.com/projects/cartier-watches-and-wonders-23))<br>2024：**Immersive Garden**（パリ） ([Immersive Garden](https://immersive-g.com/projects/cartier-watches-and-wonders-24))<br>2026：スタジオは確定できない〔未検証〕 |
| 受賞 | 2023：Awwwards SOTD<br>**2024：Awwwards SOTD（2024年6月12日）。スタジオの発表ではFWA SOTDとCSSDA SOTDも受賞**<br>2026：Awwwards SOTD（2026年5月25日） |
| 実績 | 公開されていない |
| 見た目・UX | 2024：「象徴的な時計を、没入型の世界の中で見せるスクロール型の旅」<br>2025：「一つひとつが時計に着想を得た独立した世界である、没入型のアルコーヴ（小部屋）の連なり」<br>2026：「象徴的な時計を見せる没入型の庭」 |
| 転用ポイント | **多ブランドLPで最も重要なモデル**。共通の枠の中に、ブランドごとに配色とモーションを変えた「小部屋」を並べ、スクロールで巡らせる。毎年新しい版を作って再受賞している点は、季節版LPの運用モデルにもなる |

#### B2. Cartier「Le Chœur des Pierres」（2026年）

| 項目 | 内容 |
|---|---|
| URL | [awwwards.com/sites/cartier-le-choeur-des-pierres](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres) |
| クレジット | **makemepulse**、Alexandre Saad、Alexis Demachy |
| 受賞 | **Awwwards SOTD（2026年10月20日）** |
| 見た目・UX | 「宝石が、各作品の着想と職人技を明かしていく、Cartierハイジュエリーへの没入型の旅」 |
| 転用ポイント | 素材（宝石）を物語の入口にする。調査範囲で最も「きらびやか」な参照例で、光と素材で輝きを作る方向性の手本 |

#### B3. 365, A Year of Cartier（2022年〜）

| 項目 | 内容 |
|---|---|
| URL | [Awwwards SOTD](https://www.awwwards.com/sites/365-a-year-of-cartier)<br>事例：[14islands](https://www.14islands.com/work/cartier365)<br>制作の舞台裏：[Awwwards](https://www.awwwards.com/behind-the-scenes-designing-and-building-365-a-year-of-cartier.html) |
| クレジット | **14islands**（スウェーデン／アイスランド）とAlexis Demachy<br>別の版のHMはHervé Studioのクレジットになっている〔食い違い〕 ([Awwwards](https://www.awwwards.com/sites/365-a-year-of-cartier-3)) |
| 受賞 | **Awwwards SOTD（2022年3月4日）**。後の版でもSOTD<br>FWA SOTD、**Lovie Awards Silver**、CSSDA SOTD<br>カンヌライオンズにエントリー ([14islands](https://www.14islands.com/work/cartier365); [Cannes Lions](https://www.lovethework.com/work-awards/campaigns/365-a-year-of-cartier-761833)) |
| 見た目・UX | 1年間の画像と出来事を振り返る「無限スクロールのWebGL没入体験」<br>本文はすべて素のHTML/CSSで書き、その上にWebGLの層を重ねて、画像の歪みや3Dのジュエリーを描く<br>使用技術はReact、Next.js、Framer Motion、React Three Fiber、three.js。テクスチャはKTX2形式にして読み込みを速くした<br>英語・フランス語・中国語の3言語。**32本の記事をFigmaで言語ごとに手で組み直し、計105ページ**になった |
| 転用ポイント | 「HTML先行＋WebGLの上乗せ＋KTX2」は、空港のWi-Fiやモバイル回線で見る旅客に向いている。日英中韓のLPでも、言語ごとに改行と組版を手で調整するのが基準になる |

#### B4. The Fabulous Cartier Journey（2023年）

| 項目 | 内容 |
|---|---|
| URL | [Awwwards](https://www.awwwards.com/sites/the-fabulous-cartier-journey)<br>[ケーススタディ](https://www.awwwards.com/the-fabulous-cartier-journey-case-study.html) |
| クレジット | **Merci-Michel**（パリ）。デザイン：Rogue Studio |
| 受賞 | **Awwwards SOTD（2023年12月6日）** |
| 見た目・UX | 想像上の飛行船で星空を飛び、3つのステージで宝石を集めるブラウザゲーム<br>操作は1つだけで、クリック・タップ・スペースキーを押し続けると上昇し、離すと下降する<br>テーマは旅、魔法のような瞬間、想像力 |
| 転用ポイント | メゾン自身が使った**旅と飛行のメタファー**。ワンタップでターミナルの上空を飛び、ブランドのアイコンや特典を集める演出に応用できる |

#### B5. Cartier In Time

| 項目 | 内容 |
|---|---|
| URL | [Awwwards](https://www.awwwards.com/sites/cartier-in-time)<br>[Immersive Garden](https://immersive-g.com/projects/cartier-in-time) |
| クレジット | Immersive Garden、60fps、Mooders |
| 受賞 | Awwwards SOTD、FWA SOTD、CSSDA SOTD（受賞年の記載はない） |
| 見た目・UX | 時計の針に着想した円形のスクロール・カルーセルで、ジェイク・ジレンホールが出演する12本の抽象的な映像を見せる |
| 転用ポイント | 円形のカルーセルをブランドの選択に使う。出発時刻の文字盤や、フライト時間のダイヤルに見立てられる |

### その他のメゾン：3D商品、ゲーム、ギャラリー型EC

#### B6. Louis Vuitton Collectibles／VIA

| 項目 | 内容 |
|---|---|
| URL | [Awwwards](https://www.awwwards.com/sites/louis-vuitton-collectibles) |
| クレジット | Immersive Garden、Reflet Communication |
| 受賞 | **Awwwards SOTD（2024年2月20日、7.79点）とDeveloper Award** |
| 見た目・UX | 「メゾン初のデジタル・トランク」。Awwwardsでは、別の世界に切り替わる「different universe」と、長押しで開くインタラクションが取り上げられた ([Awwwards](https://www.awwwards.com/inspiration/interaction-click-and-hold-function-louis-vuitton-collectibles)) |
| 転用ポイント | トランク（旅行鞄）は空港と相性のよいモチーフ。「長押しで開く」は、限定品やブティックのお披露目に使える |

#### B7. CHANEL Les 4 Ombres「Boutons」（2025年）

| 項目 | 内容 |
|---|---|
| URL | [Awwwards](https://www.awwwards.com/sites/chanel-les-4-ombres-boutons) |
| クレジット | **60fps**（フランス・ナンシー） |
| 受賞 | **Awwwards SOTD（2025年10月7日）とDeveloper Award**<br>カテゴリーページではSite of the Month（2025年10月）、60fpsのプロフィールではHM（10月15日）と表示されている〔食い違い〕 ([60fps](https://www.awwwards.com/weare60fps/)) |
| 見た目・UX | 「3DモデリングとWebGLを、なめらかで高性能な開発と融合させたインタラクティブなランディングページ」 |
| 転用ポイント | 受賞作の中で最も**LPそのもの**に近い形式。一つの商品を3Dで主役にする |

#### B8. Hermès「Tutti Twilly」（2023年）

| 項目 | 内容 |
|---|---|
| URL | [Awwwards](https://www.awwwards.com/sites/hermes-tutti-twilly)<br>ブランドページ：[hermes.cn](https://www.hermes.cn/cn/en/content/321531-tutti-twilly-fragrance) |
| クレジット | Merci-Michel、Publicis et Nous |
| 受賞 | Awwwards HM（2023年9月26日）。Merci-MichelのプロフィールではSite of the Month（2023年12月）〔食い違い〕 ([Awwwards](https://www.awwwards.com/Merci-Michel/)) |
| 見た目・UX | マディソン・アベニューのエルメス店を出発し、ニューヨークの街を駆け抜けるスマホ向けのゲーム ([Journal du Luxe](https://www.journalduluxe.fr/fr/beaute/hermes-jeu-nouveau-parfum-tutti-twilly))<br>書体は幾何学的なサンセリフのJost ([Awwwards](https://www.awwwards.com/websites/Jost/)) |
| 転用ポイント | 調査範囲で唯一、**実店舗を出発点にした**インタラクション。「ゲートからブティックへ」という短いゲームやルートの演出に転用できる |

#### B9. Loewe EC（AKQA）

| 項目 | 内容 |
|---|---|
| URL | [casestudies.com](https://www.casestudies.com/company/akqa/case-study/loewe-boosts-sales-165-with-akqa) |
| クレジット | **AKQA** |
| 受賞 | 確認できない |
| 実績 | **売上が前年比+165%、コンバージョン率+108%**〔自己申告：ベンダーが掲載した事例〕 |
| 見た目・UX | 「アートギャラリーに着想した」ストアフロントと、最小限のインターフェース |
| 転用ポイント | ギャラリーのように余白を取った最小限のグリッドで、商業成果が伸びたことを示す最も明確な根拠。多数のブティックを並べる一覧に使える |

#### B10. Gucci（Vault Art Space、Gucci Town ほか）

| 項目 | 内容 |
|---|---|
| URL | [Gucci Vault Art Space](https://www.awwwards.com/sites/gucci-vault-art-space)<br>[GucciのAwwwards受賞一覧](https://www.awwwards.com/Gucci/awards) |
| クレジット | Vault Art Space：**Monks** |
| 受賞 | Vault Art Space：**Awwwards SOTDとDeveloper Award（2023年1月15日）**<br>ほかのSOTD：Mystery Unfolds（Google Geminiを使ったAIミステリー、2026年6月17日）、The Art of Silk（2025年5月18日）、Gucci Beauty Wishes（2023年12月11日）など<br>Gucci Ancora Fashion Show 2024がWebbyを受賞したとBASIC/DEPTが報告している〔未検証：二次情報〕 ([BASIC/DEPT](https://basicagency.com/blog/new-projects-on-the-podium-for-the-28th-webby-awards)) |
| 実績 | Robloxの「Gucci Town」：**ユニーク訪問者1,250万人、1日の最大200万人、平均3万〜4万人/日**〔自己申告：カンヌへのエントリー〕 ([Love The Work](https://www.lovethework.com/work-awards/campaigns/gucci-town-in-roblox-1535179))<br>Gucci Garden（2021年）の2,000万人超は二次情報〔未検証〕 ([PMI](https://www.pmi.org/most-influential-projects-2022/50-most-influential-projects-2022/gucci-town)) |
| 見た目・UX | Vault Art Spaceでは、29人のアーティストの作品を閲覧し、暗号資産ウォレットをつないで入札とミントまでできる。タイムズスクエアのデジタルビルボードとも連動した |
| 転用ポイント | 数値が出ているのはゲームとソーシャル系だけ。空港LPは自前の計測設計（店舗地図のクリック、予約のタップ）を最初から持つ必要がある |

#### その他のラグジュアリーブランドWeb

| 名称 | URL | クレジット | 受賞（年） | 見た目・UX／転用ポイント |
|---|---|---|---|---|
| Dioriviera | [Immersive Garden](https://immersive-g.com/projects/dioriviera-1) | Immersive Garden、60fps、Aura | Awwwards SOTD、FWA、CSSDA（スタジオの発表） | カプセルコレクションのための没入型の仮想旅行 |
| Dior by Starck 2023 | [Awwwards](https://www.awwwards.com/sites/dior-by-starck-2023) | — | SOTD（2023年5月21日） | 家具の3Dビューとアニメーション |
| Rouge Dior | [makemepulse](https://makemepulse.com/case-study/christian-dior-parfums-rouge-dior) | makemepulse | スタジオはSOTDと主張しているが、Awwwardsのページは得票の表示だけ〔食い違い〕 | 口紅の発売用 |
| The Maison Dior／dior.com | [AKQA](https://akqa.com/work/dior/the-maison-dior); [Mazarine](https://mazarine.com/en/projects/dior-diorcom) | AKQA：モンテーニュ通り30番地の遺産を体現する「デジタルのメゾン」へ作り変えた<br>Mazarine：2009年からdior.comを設計・運用 | AKQAのFWA受賞はLinkedInの投稿にしかない〔未検証〕 | ブランドの本拠地を、体験としてWebに移す |
| Chanel Factory 5／Holiday 2022 | [Mazarine](https://www.mazarine.com/en/projects/chanel-factory-5) | Mazarine | — | N°5の百周年の世界を、WebGLのリアルタイム3Dで丸ごとモデリング。Holiday 2022はchanel.com上で30カ国超に展開 ([Mazarine](https://mazarine.com/en/projects/chanel-holiday)) |
| BVLGARI 130th Anniversary | [Awwwards](https://www.awwwards.com/sites/bvlgari-130th-anniversary) | 不明 | SOTD | 歴史と現在をたどる「デジタルマガジン」。**8言語に対応** |
| Bulgari Eclettica ほか | [Awwwards](https://www.awwwards.com/sites/bulgari-eclettica) | stride-it | HM（2026年5月1日）。Tribute to FemininityとSerpentiformもHM | ハイジュエリーの没入表現 |
| Rimowa Unique | [Awwwards](https://www.awwwards.com/inspiration/3d-product-display-rimowa-unique) | Le Studio Digital BETC Fullsix | SOTD（2019年12月13日） | スーツケースを3Dでカスタマイズして見せる。旅行鞄なので空港の文脈と合う |
| Louis Vuitton × 草間彌生（2023年） | [Love The Work](https://lovethework.com/work-awards/campaigns/yayoi-kusama-x-louis-vuitton-1527856) | 英国のOOH：Closer。CG：Method Studios | カンヌライオンズにエントリー（受賞は未確認） | 2022年12月、クロス新宿ビジョンの3D看板で、ダミエのトランクが開いて草間のかぼちゃが現れた ([Stylus](https://stylus.com/retail-brand-comms/louis-vuitton-x-yayoi-kusama-ar-ultra-architecture-animatronic-ooh))。LPのヒーローとゲート前のサイネージで同じ3D素材を使い回せる |
| Jacquemus「Bags on Wheels」（2023年4月） | [FOOH library](https://fooh.com/library/95-jacquemus-hand-bag-on-wheels-in-paris-fooh-ad) | — | 数日でTikTok 1,120万回再生、「Jacquemus ad campaign」の検索が24時間で+900% ([Glossy](https://www.glossy.co/fashion/fashion-briefing-videos-of-things-that-never-happened-are-dominating-fashion-marketing/))<br>約200万回とする媒体もある〔食い違い〕 | 巨大なバッグがパリを走るCGI動画 |
| Hermès「Venture Beyond」（2026年1月） | [Domus](https://domusweb.it/en/news/2026/01/07/herms-new-website.html) | イラストはアーティスト（スタジオ名の記載なし） | — | hermes.comに海をテーマにしたイラストの層を重ね、ウィットのある物語として使った。手描きで、AIらしくない高級感 |
| Hermès H24 | [Superbien](https://www.superbien.studio/projects/hermes-h24-interactive-website) | Superbien | — | 都市の建築と自然を融合させた、感覚的な世界 |
| Tiffany「The Landmark」（2023年4月28日） | [JCK](https://www.jckonline.com/editorial-article/tiffany-reopens-new-york-flagship/) | 建築：Peter Marino | Webの賞はない（実店舗） | 1階の縦長スクリーンが「窓」のようにニューヨークの風景を映す。ヒーロー映像を「窓」として扱う発想 |
| Van Cleef & Arpels | [来店予約ページ](https://www.vancleefarpels.com/ch/de/in-store-appointment.html) | — | 受賞はない | 来店予約の流れと、工房の360°バーチャルツアー ([Jewellery Focus](https://www.jewelleryfocus.co.uk/8891-the-maison-completes-renovation-of-its-workshops))。ブティックごとの予約CTAの手本 |
| Audemars Piguet × GQ「The Extraordinary Lab」 | [Awwwards](https://www.awwwards.com/gq-audemars-piguet-the-extraordinary-lab.html) | Immersive Garden、Condé Nast／GQ | Awwwardsの特集（2026年6月3日）。受賞は未確認 | 時計RD#5を軸にしたリアルタイム体験 |
| Cartier「Love Is All」 | [Webby](https://winners.webbyawards.com/2022/websites-and-mobile-sites/features-design/best-use-of-video-or-moving-image/215832/cartier-love-is-all) | — | 2022年のWebbyギャラリー（Best Use of Video）に掲載。ランクは〔未検証〕 | 映像が主役の構成 |
| Omega Space Sustainability | [Awwwards](https://www.awwwards.com/sites/omega-space-sustainability) | — | HM（2023年6月22日） | — |
| Bottega Veneta「Issue」 | 第4章のE5を参照 | — | — | 店頭の発売に合わせて公開する四半期のデジタル誌 |

### 国内ブランド

国内ブランドで確認できたWebの受賞は少ない。**POLA「2029 VISION」**は、2019年4月10日にAwwwards SOTDを受賞したとコレクションページに記載がある（制作会社は不明） ([Awwwards](https://www.awwwards.com/mireia_ortega/collections/color-palettes-websites/))。**SHISEIDO MAQUILLAGEのブランドサイト**は2017年12月27日にAwwwards HM ([Awwwards](https://www.awwwards.com/sites/shiseido-maquillage-brand-site))。**Clé de Peau Beautéの「Global Master Website」**は電通デジタルと作り直したもので、世界共通の体験と各国の柔軟性の両立を狙っている（受賞の記載はない） ([MarkeZine](https://markezine.jp/article/detail/50011))。古い例では、Issey Miyake ParfumsのサイトがAwwwards SOTD（2012年9月29日）を受けている ([Awwwards](https://www.awwwards.com/inspiration_search/parfum/))。Mikimoto、Tasaki、資生堂の本体サイトの受賞は見つからなかった。

## 4. 雑誌から借りるのは「買える誌面」と「号」のリズム

ラグジュアリー・ファッション誌で、デザイン賞を確認できたものは少ない。確実なのは、T: The New York Times Style MagazineのSPD金賞くらいである。一方で、商業的に効く編集手法の根拠は豊富にある。**PORTERは全ページを購入可能にし、読者の78%が購入要素を操作した**（自己申告）。メゾンは大部数の自社メディアを持っている。Le Monde d'Hermèsは60万部・10言語、LV City Guidesは2026年版で43都市に達した。機内誌と空港誌では、Emirates Open Skiesの2017年の刷新と、Dubai Voyagerの16ページのショッピングディレクトリが空港LPに直結する。

### 主要カード

#### E1. PORTER（Net-a-Porter）

| 項目 | 内容 |
|---|---|
| 媒体 | 紙とデジタルで出す、買える雑誌 |
| URL | [net-a-porter.com/en-us/porter](https://www.net-a-porter.com/en-us/porter) |
| クレジット | Net-a-Porter／YNAP |
| 受賞 | 確認できない |
| 実績 | 2014年2月7日に創刊し、2万の販売店で発売 ([FashionUnited](https://fashionunited.uk/v1/fashion/porter-qthe-biggest-launch-of-a-british-fashion-magazineq/2014020713074))<br>**全ページが購入可能**で、アプリで誌面をスキャンすると商品ページに飛ぶ。**読者の78%が購入要素を操作した**〔自己申告〕 ([Digiday](https://digiday.com/marketing/net-porter-built-digital-shopping-experience-print-magazine/))<br>編集65%・広告35%の比率で設計 ([Marketing Week](https://www.marketingweek.com/net-a-porter-plans-to-disrupt-publishing-with-shoppable-porter-mag/))<br>2016年1月の監査では読者部数180,646（+6%） ([YNAP PDF](https://www.ynap.com/wp-content/uploads/2016/02/PORTER-Audit-release-January-2016-FINAL.pdf))<br>部数は出典によって差があり〔食い違い〕、紙版の現在の発行状況も出典が食い違う〔食い違い〕 |
| 見た目・UX | タブレット版は「1段組のグリッド、全面写真の多用、たっぷりの余白、セリフ体の見出し」という古典的なファッション誌の体験 ([FIPP](https://www.fipp.com/news/features/the-perfect-digital-fashion-magazine-experience)) |
| 転用ポイント | **LPの中心になる商業パターン**。編集写真ごとに商品のクレジットを付ける。空港では「購入」を「事前予約・ブティックの場所・営業時間」に置き換える |

#### E2. T: The New York Times Style Magazine

| 項目 | 内容 |
|---|---|
| URL | [nytimes.com/section/t-magazine](https://www.nytimes.com/section/t-magazine) |
| クレジット | クリエイティブディレクター：Patrick Li。編集長：Hanya Yanagihara ([Glossy](https://www.glossy.co/fashion/editor-in-chief-hanya-yanagihara-on-why-t-magazine-needed-a-harder-edge)) |
| 受賞 | **SPD 54 Fashion/Beauty部門 Gold Medal**（Patrick Li）。SPD 54は2019年ごろだが、要約では2018年と表記されている〔食い違い〕 ([Typeroom](https://www.typeroom.eu/article/spd54-new-york-california-all-medal-winners-years-prestigious-spd-awards)) |
| 見た目・UX | 2018年2月に「時代を映す」ためのリデザインを行った ([Design Week](https://www.designweek.co.uk/issues/19-25-february-2018/t-new-york-times-style-magazine-redesigns-reflect-times/)) |
| 転用ポイント | 大きなマストヘッドと全面のファッション写真による「表紙型」のヒーロー。はっきりしたセクションのリズム（推論） |

#### E3. Le Monde d'Hermès

| 項目 | 内容 |
|---|---|
| URL | [hermes.com](https://www.hermes.com)（ストーリー欄） |
| クレジット | FW2020のアートディレクション：Thomas Persson、Sophie Toporkoff〔未検証：帰属が不確か〕<br>イラスト：Studio Duco、Studio Hosego ([IllustrationX](https://www.illustrationx.com/au/news/4596/hermes%20paris)) |
| 実績 | 1973年創刊、年2回発行、**60万部、10言語** ([Wallpaper*](https://www.wallpaper.com/fashion/fashion-houses-take-on-publishing))<br>コート・ダジュールやバーレーンを巡回するキオスクも出した ([Journal du Luxe](https://www.journalduluxe.fr/fr/mode/kiosque-monde-hermes-france-cote-azur-magazine/amp)) |
| 見た目・UX | 刷新を続けるために、**アートディレクションを毎年交代**させている |
| 転用ポイント | 器は変えずに、季節ごとにヒーローのアートディレクションやゲストのイラストレーターを替える。ターミナルを描くゲストイラストも有効 |

#### E4. Louis Vuitton City Guides／Travel Books

| 項目 | 内容 |
|---|---|
| URL | [louisvuitton.com stories/library](https://uk.louisvuitton.com/eng-gb/stories/library) |
| クレジット | Travel Booksの挿画は招待作家による。2019年はJavier Mariscal（ロサンゼルス）とIcinori（ソウル） ([FashionNetwork](https://ae.fashionnetwork.com/news/Louis-vuitton-releases-new-illustrated-travel-guides-for-la-and-seoul,1071593.html)) |
| 受賞 | カンヌライオンズのアーカイブに「Louis Vuitton Guides」が掲載されている（ランクは不明） ([Love The Work](https://www.lovethework.com/work-awards/campaigns/louis-vuitton-guides-298520)) |
| 実績 | 1998年に開始。2026年5月の版で、紙とデジタル合わせて**43都市**に ([Miami Living](https://www.miamilivingmagazine.com/post/louis-vuitton-expands-city-guide-collection-with-enriched-2026-editions))<br>「LV The Book」は100万部と報じられている ([Graphéine](https://grapheine.com/en/magazine/luxury-brand-magazines-are-putting-up-a-fight/)) |
| 見た目・UX | 2011年版はヴィンテージのLVの荷札に着想したデザイン ([Luxe Magazine](https://luxe-magazine.com/en/article/4405-vuitton_and_the_city.html?r=17))<br>2019年の刷新で、**都市ごとに1色**を割り当てた ([Livres Hebdo](https://www.livreshebdo.fr/article/voyager-encore-plus-chic-avec-louis-vuitton)) |
| 転用ポイント | 「都市ごとの色」を「ターミナルやゾーンごとの色」に置き換える。荷札のモチーフは、ブランドカードの形（搭乗券、バゲージタグ）に使える |

#### E5. Bottega Veneta「Issue」

| 項目 | 内容 |
|---|---|
| URL | [bottegaveneta.com](https://www.bottegaveneta.com)（過去号のアーカイブ） |
| クレジット | クリエイティブディレクター：Daniel Lee<br>Issue 03の表紙：**奥山太貴**（東京を拠点とするグラフィックデザイナー）<br>寄稿：More and More、XK Studios、Isabel + Helen、Valentina Cameransi ([Numéro](https://numero.com/en/fashion/graphic-designer-okuyama-taiki-talks-about-his-collaboration-with-bottega-veneta/)) |
| 実績 | 2021年、SNSから撤退した後に始めた**四半期のデジタル誌**で、1号132ページ ([Istituto Marangoni](https://www.istitutomarangoni.com/en/maze35/fashion/why-luxury-fashion-brands-are-launching-magazines-and-what-it-says-about-culture)) |
| 見た目・UX | 長い文章の代わりに、ナレーション、音楽、写真、映像で構成する ([AnOther](https://anothermag.com/fashion-beauty/13221/summer-madness-inside-bottega-veneta-s-new-virtual-diary))<br>各号は**店頭のコレクション発売に合わせて公開**する ([FashionNetwork](https://ca.fashionnetwork.com/news/Bottega-Veneta-launches-quarterly-digital-journal,1291631.html)) |
| 転用ポイント | LPの編集部分を、店頭の新作投入に合わせて「号」単位で公開し、過去の号はアーカイブに残す。ゲストの表紙デザイナーで、号ごとの顔を作る |

#### E6. Dubai Voyager（ドバイ空港・ドバイ免税店の公式誌）

| 項目 | 内容 |
|---|---|
| URL | [Enigma Global](https://www.enigmaglobal.com/portfolio/dubai-voyager-magazine/) |
| クレジット | Enigma Global（制作会社のポートフォリオ） |
| 実績 | ある号に**16ページの独占ショッピングディレクトリ**を掲載した。現在も発行しているかは〔未検証〕 |
| 転用ポイント | 空港LPのブランド一覧の直接の先例。誌面と同じく、特集の後にA–Zやカテゴリー別の一覧を置く |

#### E7. Emirates「Open Skies」（機内誌）

| 項目 | 内容 |
|---|---|
| URL | [IMM International](https://www.imm-international.com/emirates-inflight-magazine-advertising) |
| クレジット | 発行：Motivate Media Group ([Emirates 24/7](https://www.emirates247.com/news/emirates/emirates-to-celebrate-year-of-zayed-in-flight-and-in-the-air-2017-12-27-1.663312))。デザイナーは不明 |
| 受賞 | 「数々の賞を受賞」、Executive Travelの読者投票で2回世界一とされる。出典は媒体資料の記載のみ〔未検証〕 |
| 実績 | 発行部数**141,302部**、機内で無料配布 ([Enigma Global](https://www.enigmaglobal.com/portfolio/open-skies-magazine/)) |
| 見た目・UX | 2017年に大きくリデザインした。上質な現代写真、すっきりしたミニマルなデザイン、柔らかく温かい配色 |
| 転用ポイント | 多様な旅客を迎える「温かいラグジュアリー」の基準線 |

### その他の雑誌・エディトリアル

| 名称 | URL・出典 | クレジット | 受賞・実績 | 転用ポイント |
|---|---|---|---|---|
| Fantastic Man／The Gentlewoman | [magCulture](https://magculture.com/blogs/journal/fantastic-man-37) | クリエイティブディレクター：Jop van Bennekom（共同創刊者Gert Jonkers）。The Gentlewomanは2010年創刊、編集長はPenny Martin〔帰属が不確か〕 | D&ADのアーカイブに掲載あり（ランクと年は不明） ([D&AD](https://www.dandad.org/work/d-ad-awards-archive/fantastic-man)) | 37号の刷新は「控えめで、同時に劇的」。抑えた書体で、性格の違うブランドを中立に包む |
| Wallpaper* | [Wallpaper* 2024年2月号](https://wallpaper.com/design-interiors/february-2024-issue-read-more) | Future plc。初期のクリエイティブ責任者Tony ChambersはPPA Designer of the Yearを2回受賞（キャリアの賞） ([Surface Design Show](https://surfacedesignshow.com/meet-judges/meet-judges-tony-chamber)) | Wallpaper* Design Awards 2024（第20回、Best CityはSeoul） | 「Best of」の企画を「ターミナルXの編集部セレクト」に転用する |
| Holiday | [Mr Porter Journal](https://www.mrporter.com/en-gr/journal/lifestyle/inside-the-studio-of-art-director-mr-franck-durand-513070) | Atelier Franck Durand、Marc Beaugé（2014年に復刊） | 受賞はない | 遊び心のある旅のグラフィック、実験的な写真、仏英バイリンガル |
| MR PORTER The Journal／Post | [MR PORTER](https://www.mrporter.com/en-th/journal/lifestyle/introducing-all-new-journal-daily-editorial-2020-1033908) | — | 2020年から常時更新に移行。隔月の紙「The MR PORTER Post」でベスト記事をまとめる ([Gulf News](https://gulfnews.com/lifestyle/fashion/the-directory-5-years-of-mr-porter-5-menswear-lessons-1.1683248)) | 常時更新のフィードと、厳選したヒーローの二つの速度で運用する |
| Acne Paper／Chanel Arts & Culture Magazine | [Istituto Marangoni](https://www.istitutomarangoni.com/en/maze35/fashion/why-luxury-fashion-brands-are-launching-magazines-and-what-it-says-about-culture) | Acne Studios／Chanel | Acne Paperは2024年に500ページの「本と雑誌の中間」の形で復刊。Chanelは英国百周年の250ページ版 | 章立てのある長いスクロール |
| Harrods Magazine | [PPA](https://ppa.co.uk/?p=3502) | 2018年に編集長Tiffanie Darkeが就任し、6か月で月刊誌と季刊のHarrods Manを刷新した ([FashionNetwork](https://pl.fashionnetwork.com/news/Harrods-names-editor-in-chief-as-part-of-editorial-strategy-shift,1024398.html))<br>社内に専任の「Design Editor」がいる | 社内で年15誌超を制作。Harrods Magazine Arabiaもある ([Campaign ME](https://campaignme.com/harrods-magazine-arabia-launches/))<br>広告収入の数値は見つからない | 小売の声で数十の競合ブランドを扱う編集の手本。有料の「注目ブティック」枠という発想 |
| GINZA SIX magazine | [teamLab](https://www.teamlab.art/jp/w/livingwall/) | アートディレクターと発行形態は不明 | 2017年4月20日の掲載記録がある | 原研哉のアイデンティティの中で、館としての編集の声を持つ |
| Cathay（旧Discovery） | [Campaign Asia](https://www.campaignasia.com/article/cathay-pacific-unveils-new-look-in-flight-magazines/02pvxmxxg9agrnqonvqm43tty3) | — | パンデミック中にDiscoveryを廃し、新しい誌名に。Discoveryは約2.5年で2回刷新した ([Campaign Asia](https://www.campaignasia.com/article/discovery-takes-on-second-new-look-in-two-years/irx2uunmanpndst4fqqfy1ns8s)) | 頻繁な刷新に耐える「号」のシステム |
| ANA 翼の王国 | [ANA](https://www.ana.co.jp/ja/fr/travel-information/digital-media/) | — | 2021年4月に紙からアプリとWebへ移行。スマホ向けに誌面を作り直し、日本語・英語・中国語に対応 ([Impress Watch](https://www.watch.impress.co.jp/docs/news/1308491.html)) | モバイルファーストで多言語の雑誌レイアウト |
| JAL SKYWARD／SKYWARD+ | [Aviation Wire](https://www.aviationwire.jp/?p=191622) | — | 2018年4月から国内線版に日英中のページを30〜40ページ追加。2019年にWeb版を開始 ([Fujisan](https://www.fujisan.co.jp/product/1281683686/)) | 紙とWebの併用 |
| BRUTUS／POPEYE 英語版 | [Fashionsnap](https://www.fashionsnap.com/article/2025-10-10/magazine-house-80th/) | マガジンハウス | 2025年9月に出た英語版（東京特集）が、発売から2週間以内に増刷 ([WWD Japan](https://www.wwdjapan.com/?p=905849)) | 日本の編集眼を英語で届けることへの需要の証拠 |
| Casa BRUTUS／TRANSIT | [casabrutus.com](https://casabrutus.com/); [Fujisan](https://www.fujisan.co.jp/product/1281693871/) | アートディレクターは記事ごとのクレジット（例：阿部洋介／small Inc.） ([kohei-yamamoto.com](https://kohei-yamamoto.com/photograph/article/3274)) | TRANSITの台湾号では、編集部が2024年に1か月台北へ移った | 1テーマの特集。手描きの地図と番号付きのスポットを使う街歩きの文法を、「ターミナル散歩」に |
| Stack Awards 2019：Flaneur | [It's Nice That](https://www.itsnicethat.com/news/stack-awards-winners-publication-event-151119) | アートディレクター：Fabian Saul | Magazine of the YearとArt Director of the Year | 独立系雑誌のアートディレクションの最高峰 |

国内の雑誌（BRUTUS、POPEYE、GINZA、VOGUE JAPANなど）のアートディレクター名には、調査者の事前知識による候補がある。ただし出典がないため、本書には載せていない。使う場合は各号の奥付で確かめてほしい。東京ADCのグランプリは近年、展覧会とファッションブランドのアートディレクションに与えられていて、雑誌ではない。例は2025年の北川一成（展覧会「鷹野隆大 カスババ」） ([AdverTimes](https://www.advertimes.com/20251104/article519837/)) と、井上嗣也（COMME des GARÇONS SEIGEN ONO） ([AdverTimes](https://www.advertimes.com/?p=294653)) である。賞の裏付けがある日本のグラフィックを探すなら、雑誌の誌面よりも東京ADCやJAGDAの年鑑に載ったファッションブランドの仕事のほうが当たりやすい。

## 5. 発注先は「空港の器」と「メゾン級の演出」で分かれる

制作会社の地図は、はっきり三つに分かれる。

1. **空港の大規模プラットフォーム**：ネットワーク系・コンサル系のエージェンシーが作る（Publicis Sapient、Tribal DDB／Tribal Worldwide、Ogilvy）。
2. **ラグジュアリーの「トーン」**：アイデンティティのスタジオや内装デザイナーが作る（M/M (Paris)、Pentagram、原研哉、Curiosity、Extimeの内装陣）。
3. **きらびやかなWeb演出**：パリ中心のブティックスタジオが作る（Immersive Garden、60fps、makemepulse、Merci-Michel、14islands）。

有名な空港の小売ブランドの多くも、大手のブランドエージェンシーではなく専門の小さなチームが手がけている（Base Design、Dynamo、Start Design、W Conran Design、Be-pôles）。国内では、GINZA SIX、羽田、関西のWebサイトの制作会社をどれも特定できなかった。受賞歴を最も確かめやすいのは、Garden Eightと1→10である。

### 海外：Web演出のブティックスタジオ

| スタジオ | 拠点 | 確認できたラグジュアリー案件・受賞 | 向いている用途 |
|---|---|---|---|
| Immersive Garden | パリ | Cartier W&W 2023・2024、Cartier In Time、Dioriviera、LV Collectibles、AP × GQ、Longines Spirit Flyback<br>Awwwards Studio of the Year 2017・2018・2020（紹介文による） ([DesignRush](https://www.designrush.com/agency/profile/immersive-garden))<br>[Awwwardsプロフィール](https://www.awwwards.com/immersivegarden/) | 落ち着いた「小部屋」型の多ブランドショーケース |
| 60fps | フランス・ナンシー | Chanel Les 4 Ombres（SOTDとDeveloper Award、2025年）<br>Cartier In TimeとDiorivieraに共同でクレジット ([Awwwards](https://www.awwwards.com/weare60fps/)) | 一つの商品を3Dで見せるLP |
| makemepulse | パリ | Cartier Le Chœur des Pierres（SOTD、2026年10月）、Rouge Dior ([Awwwards](https://www.awwwards.com/makemepulse/)) | 宝飾の輝きの表現 |
| Merci-Michel | パリ | 2012年創業の「ゲーミフィケーションスタジオ」。Awwwards Site of the Yearの受賞歴あり（2017年の年間賞に掲載） ([Awwwards](https://awwwards.com/annual-awards-2017))<br>The Fabulous Cartier Journey、Hermès Tutti Twilly | 旅をテーマにした遊びの演出 |
| 14islands | ストックホルム | 365 A Year of Cartier（SOTD、FWA、Lovie Silver） ([14islands](https://www.14islands.com/work/cartier365)) | 多言語でHTML先行の編集型サイト |
| Mazarine | パリ | 2009年からdior.comを担当。Chanel Factory 5とHoliday 2022 ([Mazarine](https://mazarine.com/en/projects/dior-diorcom)) | 大規模なラグジュアリーECの運用 |
| Bonhomme | パリ | 2013年創業、125超のプロジェクト、200超の国際的な受賞。Studio of the Yearに複数回ノミネート。TAG Heuer、Cartier、Loeweを担当（検索結果の抜粋のみ） ([Codrops](https://tympanus.net/codrops/2026/08/03/the-story-is-in-the-interaction-bonhommes-digital-experiences-for-luxury-brands/)) | インタラクションで物語を語る演出 |
| Cosmic Shelter | パリ | LV「The Maison of All Victories」（受賞ランクは未確認） ([Awwwards](https://www.awwwards.com/inspiration/full-experience-the-maison-of-all-victories)) | — |
| Superbien | パリ | Hermès H24 ([Superbien](https://www.superbien.studio/projects/hermes-h24-interactive-website)) | 香水の感覚的な世界観 |
| stride-it／AREA 17 | — | Bulgari Eclettica（HM、2026年）／Fondation Louis Vuitton（HM、2020年） ([Awwwards](https://www.awwwards.com/sites/fondation-louis-vuitton)) | — |
| Disko（Altavia） | パリ | 「年間最優秀ラグジュアリーデジタルエージェンシー」に選出 ([La Réclame](https://lareclame.fr/disko/news/disko-est-lagence-digitale-luxe-de-lannee)) | — |
| Lusion | 英国 | リアルタイム3DとWebGL。クライアントはPorsche、Max Maraなど。Cannes、D&AD、Webby、Awwwards、FWAで受賞 ([Codrops](https://tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-ambitious-experimentation/)) | ヒーローの一点豪華な演出 |
| Exo Ape／Unseen Studio | オランダ／ブリストル | Exo Ape：ホスピタリティやファッションなど体験型ブランドを担当。SOTM（2022年5月） ([Codrops](https://tympanus.net/codrops/2026/02/09/exo-ape-crafting-unforgettable-digital-journeys/))<br>Unseen：SOTM（2023年2月） ([Awwwards](https://www.awwwards.com/unseen-studio-by-unseen-studio-wins-sotm-february-2023.html)) | ラグジュアリーの実績は薄い |
| Resn／Locomotive／Dogstudio（DEPT） | NZ／モントリオール／ナミュール・シカゴ | Resn：Awwwards Site of the Year 2021 ([LBB](https://lbb.lbbonline.com/news/resn-and-bader-rutter-win-awwwards-site-of-the-year-for-pioneer-corn-revolutionized))<br>Locomotive：自社サイトがSOTM（2023年3月）<br>DEPTの姉妹会社BASIC/DEPTがWebby Agency of the Year 2023 ([Webby](https://www.webbyawards.com/press/press-releases/27th-annual-webby-awards-announce-winners-for-advertising-media-pr/)) | 作り込みの水準は高いが、ラグジュアリー小売の実績は確認できない |

### 海外：大規模デジタル、広告、ブランディング、空間

| 会社 | 種別 | 確認できた関連実績（出典） |
|---|---|---|
| AKQA | 大規模デジタル | The Maison Dior、Loewe EC（売上+165%〔自己申告〕）、Rinascente「Digital Renaissance」、Maison Alaïa<br>Hermès「La Maison des Carrés」（2014年、27カ国で出したオンラインのポップアップストア） ([FashionUnited](https://fashionunited.com/v1/apparel/hermes-launches-first-digital-pop-up-shop/201410022021))<br>Pradaのグローバルなデジタル体験の統合 ([Adweek](https://www.adweek.com/agencies/prada-enlists-akqa-to-refashion-its-global-digital-experience/)) |
| Publicis Sapient | 大規模デジタル | heathrow.comの刷新とプラットフォームの移行（A1） |
| Tribal DDB／Tribal Worldwide／Ogilvy | ネットワーク系 | チャンギのWeb、iShopChangi、Jewelのブランディング／Changi Airport Groupのクリエイティブ（A3） |
| Monks／Huge London／Emperia／Fantasy／Overdose | デジタル | Gucci Vault Art Space／BicesterのデジタルAOR／Bicester Virtual Village／Harrods／Lagardèreの免税サイト |
| Magnumvint | デジタル（韓国） | ロッテ免税店（Web Award Korea 2018） |
| St Luke's／Leagas Delaney／W Conran Design／Closer | 広告 | Heathrowのリテール広告／Bicester「Fresh every day」／Extimeのキャンペーン／LV × 草間彌生の英国OOH |
| Wednesday Agency | ラグジュアリー広告 | Calvin Klein、Net-a-Porter、Alexander McQueen、Galeries Lafayette。2016年にBBDOが過半数を取得 ([BoF](https://www.businessoffashion.com/articles/marketing-pr/bbdo-acquires-fashion-focused-wednesday-agency-group); [FashionNetwork](https://us.fashionnetwork.com/news/Wednesday-agency-group-bought-by-bbdo-worldwide,613625.html)) |
| Pentagram | ブランディング | Liberty（2020年）、Saks、Selfridges × McQueen、Mytheresa、Landmark、Grand Central ([Pentagram](https://pentagram.com/work/mytheresa/story)) |
| M/M (Paris) | ブランディング・アートディレクション | ギャラリー・ラファイエット シャンゼリゼ（東京TDC GP 2020）、渋谷PARCO（2019年）。Balenciaga、LV、Loewe、Pradaとも協働 ([Thames & Hudson](https://www.thamesandhudson.com/products/m-to-m-of-m-m-paris-vol-2)) |
| Base Design／Dynamo／Start Design | 空港のブランディング | JFK T4（A8）／ダブリンとコークの免税店／ハマド空港（A5） |
| Be-pôles／DNCO／Toby Ng Design | ブランディング | La Samaritaineのロゴ／Hongkong Land／K11 MUSEA（One Show 2020） |
| Baron & Baron | ラグジュアリーのブランディング | Zaraの2019年のロゴ（Didot風のセリフ）。Fabien BaronはDiorとMaison Margielaのクリエイティブディレクションを担う ([Dezeen](https://www.dezeen.com/2019/02/04/zara-logo-controversial-rebrand-baron-baron/)) |
| Commission Studio | ラグジュアリーのブランディング | Fentyのアイデンティティ（2019年） ([It's Nice That](https://www.itsnicethat.com/articles/commission-studio-fenty-visual-identity-graphic-design-060619))。クライアントにLVMH、Tiffany、Dior Parfums、TAG Heuer ([DesignRush](https://www.designrush.com/agency/profile/commission-studio)) |
| Kurppa Hosk／Peter Saville／Smith &+ Village | ブランディング | O.A. DevoldとZalando／Burberryの2018年のアイデンティティ ([Dezeen](https://www.dezeen.com/tag/burberry/))／Harrodsの菓子 |
| Benoy | 空間 | Jewelのリテールと内装、チャンギT4の内装とサイン、Westfield London ([Benoy](https://www.benoy.com/projects/terminal-4-changi-airport-2/)) |
| Chapman Taylor／Hyphen／Yabu Pushelberg | 空間 | Heathrow T2のラグジュアリー区画／Extimeのウォークスルー／La Samaritaineの内装 |
| The Design Solution | 空港リテールの空間 | AvoltaのBengaluru T2、DufryのToulouseとAmman、Abu Dhabi Midfieldのマスタープラン<br>論考「空港リテール設計を成功させる5つの要素」 ([Moodie Davitt](https://moodiedavittreport.com/opinion-the-design-solution-on-the-five-elements-of-successful-airport-retail-design/)) |
| SAA Architects／Safdie Architects／Pico | 空港の建築・サイン | チャンギT4／Jewel／Jewelのサイン（iF 2020） |
| Maxime Liautard & Hugo Toro／CHZON | 内装 | CDG T1／CDG 2G（A2） |
| Household／L'Atelier Five／Dalziel & Pow | 空間・ブランド体験 | Christian Louboutin、Harrods、Hammerson ([Creativepool](https://creativepool.com/creativepool-editorial/news/household-designing-brand-experiences-that-put-people-first.34971))／トラベルリテール専門で10周年 ([Moodie Davitt](https://moodiedavittreport.com/travel-retail-where-we-perform-best-says-latelier-five-founder-as-design-agency-celebrates-tenth-anniversary))／Gatwickのマスターブランディング（2001年） |

次の会社は、ラグジュアリー・空港の実績を確認する前に検索の上限に達した〔未検証〕。

- ブランディング・大規模デジタル：Landor & Fitch、Wolff Olins、Interbrand、Collins、Koto、DesignStudio、Saffron、Moving Brands、FutureBrand、Work & Co、Instrument、R/GA
- 小規模スタジオ：Bureau Borsche、Zak Group、OK-RM、Spin、Studio Frith、Order、Partners & Spade、Lundgren+Lindqvist、Bielke&Yang、&Walsh
- Web演出：Active Theory、Hello Monday、Obys、Build in Amsterdam、Studio Freight、ManvsMachine、Universal Everything、UNIT9
- 空間：JHP、Checkland Kindleysides、Universal Design Studio

### 国内：Web・デジタル

| スタジオ | 拠点・URL | 確認できた関連実績・受賞（出典） | 向いている用途 |
|---|---|---|---|
| Garden Eight | 東京・世田谷（欧州の本拠はコペンハーゲン）。[garden-eight.com](https://garden-eight.com/) | 検索時点のAwwwardsプロフィール：SOTM 1回、SOTD 18回、HM 22回 ([Awwwards](https://www.awwwards.com/GardenEight/))<br>「The Shift」でSOTM（2021年10月）とDeveloper Award<br>FWA of the Day 10回、Studio of the Yearにノミネート ([Invest in Denmark](https://investindk.com/cases/japanese-and-danish-web-design-meets-in-beautiful-harmony-in-copenhagen/))<br>Dezeen Awards 2021のメディア部門ショートリスト（Molten）<br>商業施設の案件は確認できない | モーション、タイポグラフィ、余白の質感の参考。演出パートの候補 |
| 1→10（ワントゥーテン） | 京都本社、東京にも拠点。[1-10.com](https://www.1-10.com/) | 国内外の受賞は120超で、カンヌを含む（求人情報の記載） ([Green Japan](https://www.green-japan.com/company/4401/job/320190))<br>前身の時代には、カンヌライオンズ金賞、One Show Interactive金賞、アドフェストのグランプリ ([AdverTimes](https://www.advertimes.com/author/sawabe_yoshiaki/))<br>主な領域は商業施設と都市空間。「羽田出島 DEJIMA by 1→10」（内容と開業年は〔未検証〕）、2024年4月に東急プラザ原宿「ハラカド」へショールームを開設 | 国内で「空港・商業施設・デジタル体験」の三つがそろう数少ない会社 |
| monopo | 東京（ロンドンにも展開）。https://monopo.co.jp/〔URL未検証〕 | 2020年にAwwwards Conferenceの公式パートナー（アジア初の開催） ([Web担当者Forum](https://webtan.impress.co.jp/r/prtimes/items/000000009.000019932))<br>Red Wing ShoesのAPAC統合キャンペーン ([casestudies.com](https://www.casestudies.com/company/monopo))<br>Toyotaの案件でCSSDA Website of the Year 2015（所属者のプロフィールによる〔未検証〕） | ブランディングと映像を含む統合案件 |
| SHIFTBRAIN | 東京。[shiftbrain.com](https://www.shiftbrain.com/) | 企画からデザイン、技術まで一貫して手がけるデジタルエージェンシー。2022年に創業20周年 ([Wantedly](https://www.wantedly.com/companies/shiftbrain/about))<br>商業施設の案件は確認できない | — |
| THA LTD.（中村勇吾） | 東京。https://tha.jp/〔URL未検証〕 | ユニクロの一連のWebディレクション、INFOBARのUI、「デザインあ」 ([デザインの手前](https://designnotemae.substack.com/p/14-cce)) | インタラクションの思想 |
| Rhizomatiks／Rhizomatiks Design | 東京。https://rhizomatiks.com/〔URL未検証〕 | 大丸心斎橋店「D-WALL」（2019年） ([Impress Watch](https://www.watch.impress.co.jp/docs/news/1189771.html))<br>2021年に東京都現代美術館で個展 ([美術手帖](https://bijutsutecho.com/magazine/news/exhibition/21149)) | 光とメディアの演出、館の「顔」 |
| MUTEK.JP／aircord | 東京 | Haneda Eternal（2021年）のクリエイティブディレクション ([GIZMODO](https://www.gizmodo.jp/2021/01/haneda-eternal-2.html))／英Spinの案件でシステムの設計と開発 ([Spin](https://spin.co.uk/projects/aircord)) | 空港でのデジタルアート、技術の実装 |
| 電通総研／電通デジタル | 東京 | 新千歳空港の公式サイト（Webグランプリ2024 優秀賞）／Clé de PeauのGlobal Master Website | 空港の大規模サイト、グローバルブランドのサイト |

### 国内：ブランディング・空間

| スタジオ | 確認できた関連実績（出典） | 向いている用途 |
|---|---|---|
| 日本デザインセンター 原デザイン研究所（原研哉） | GINZA SIXのロゴ「GSIX」（金色の「G」、ハイブランドを支える簡潔さ） ([GINZA SIX](https://ginza6.tokyo/news/3857)) | 館のワードマーク |
| good design company（水野学） | 相鉄の「ブランドアップ」、中川政七商店、茅乃舎、くまモン ([美術手帖](https://bijutsutecho.com/magazine/news/headline/18348)) | ブランド戦略とVI |
| SAMURAI（佐藤可士和） | ユニクロ、楽天、セブン-イレブン、三井物産 ([nippon.com](https://www.nippon.com/ja/people/e00109/))。商業施設のVIは確認できない | — |
| nendo（佐藤オオキ） | Peachの新ロゴと機体（2026年）、成田T1のカウンター ([Aviation Wire](https://www.aviationwire.jp/?p=341799)) | 空港の空間とブランドの語彙 |
| GKインダストリアルデザイン | 羽田のターミナル間連絡バスのデザイン監修（2020年） ([Aviation Wire](https://www.aviationwire.jp/archives/198644)) | 交通の機能美 |
| Curiosity（グエナエル・ニコラ） | GINZA SIXの共用部（Interior Design 2017 Best of Year）、GINZA SIXのMoynat店 ([Precious.jp](https://precious.jp/articles/-/697)) | ラグジュアリー商業施設の素材の語彙 |
| Wonderwall（片山正通） | FAMIMA PARK AZABUDAI（2026年7月10日開業）、UNIQLOのグローバル旗艦店、colette、ザ・リッツ・カールトン香港「OZONE」 ([PR TIMES](https://prtimes.jp/main/html/rd/p/000000004.000181032.html)) | 旗艦店の空間演出 |
| 丹青社 | 羽田と熊本の保安検査場で、環境改善の実証実験。空間デザインと全体のディレクションを担当 ([Digital PR Platform](https://digitalpr.jp/r/130999)) | 空港のストレス軽減の空間 |
| 隈研吾建築都市設計事務所 | ANAラウンジ（伊丹、福岡、那覇）のリニューアル（帰属は検索結果の要約による〔未検証〕） ([ANA](https://www.ana.co.jp/ja/jp/serviceinfo/lounge_renewal/)) | 和の素材によるラウンジ空間 |
| サニーサイドアップ | GINZA SIXの開業PR ([SUNNY SIDE UP](https://www.ssu.co.jp/eng/works/2017/08/03/640/)) | 開業告知のPR |

国内の次のスタジオは、ラグジュアリー・商業施設・空港の実績と受賞年をまだ確認していない〔未検証〕。名前だけ挙げておくので、WorksページやPR TIMESで確かめてほしい。

- Web・デジタル：KAYAC、BASSDRUM、bascule、Takram、baigie、CINRA、LIG、AID-DCC、Dentsu Lab Tokyo、PARTY、The Breakthrough Company GO、博報堂アイ・スタジオ、Fourdigit、mount、BIRDMAN、WOW、NAKED、チームラボ
- グラフィック・ブランディング：色部義昭、groovisions、NOSIGNER、DRAFT、MR_DESIGN、野老朝雄、服部一成、菊地敦己、長嶋りかこ
- 空間：SUPPOSE DESIGN OFFICE、乃村工藝社

## 6. 多ブランドを1ページに収める8つの設計原則

ここまでのリファレンスから、複数ブランドを1ページで見せるための設計原則を八つ導ける。

**第一に、器は館の声で語り、主役はメゾンに譲る。** 原研哉はGSIXのロゴで、「ハイブランドのロゴと並んでも埋もれず、それらを支える簡潔さ」を狙った ([GINZA SIX](https://ginza6.tokyo/news/3857))。Extimeは「Extra Time」というもてなしの物語で、数十のメゾンを包んでいる。DFSやAvoltaが単一のマスターブランドへ集約している動きも、同じ方向を向く。編集の世界でも、Fantastic Manの「控えめで劇的な」書体の変更や、PORTERの余白とセリフ体の見出しが、性格の違うブランドを一つのハウススタイルで並べる手法として働いている。根拠から導ける結論は次のとおりである。LPの地はモノクロームかオフホワイトに抑える。色は各メゾンの写真に任せる。金は一点だけ使う。

**第二に、建築をUIに変えて館の固有性を出す。** 次の例はどれも、建物やロゴの形をそのまま視覚システムにしている。

- Rinascente：列柱のアーチで商品写真を切り抜いた。
- ギャラリー・ラファイエット：サイコロをファサードからデジタルまで通した。
- Landmark：Bodoniの「L」を据えた。
- Hongkong Land：「H」を3Dで動くマークにした。

空港なら、屋根の曲線、ゲート番号、滑走路の誘導サイン、成田の「組紐」、GINZA SIXの麻の葉の和紙のような素材が、画像マスク、グリッド、罫線の素になる。JFK T4がターミナル独自の書体をデジタルまで持ち込んだように、空間とWebで同じ文字を使えば、他のどこでもない「その空港のLP」になる。ただし、旅のメタファーは使いすぎないこと。Cartierの飛行船、LVのトランク、LVの荷札がうまく効いているのは、それぞれ一作に一つのモチーフに絞っているからである。

**第三に、ブランド一覧は「場所と時間」まで落とし込み、予約で締める。** Extimeのブランドページは、店舗ごとにターミナルと営業時間を並べ、出発20時間前までのClick & Collectにつなぐ。ヒースローはA–Z索引とReserve & Collect、香港は「Luxury Reserve」を持つ。紙でもDubai Voyagerが、特集の後に16ページのディレクトリを置いた。LV City Guidesの「都市ごとに1色」は、ターミナルやゾーンの色分けにそのまま使える。AKQAのLoewe ECは、ギャラリーのような最小限のグリッドで売上+165%、コンバージョン率+108%を報告している（自己申告）。多数の店を並べる一覧の作法としては、これが最も強い商業的な根拠になる。羽田の「絞り込み＋テナント詳細」は、国内で超えるべき基準線である。

**第四に、メゾンごとに小部屋を並べ、WebGLは一点に絞る。** Cartier W&W 2025の「それぞれが独立した世界であるアルコーヴの連なり」は、ブランドごとに配色とモーションを変えながら一つの枠に収める型として最も優れている。Cartier 365の「HTML先行、WebGLを上に重ねる、テクスチャはKTX2」という作り方は、ターミナルのWi-Fiや海外ローミングで見る旅客への配慮としてそのまま使える。各メゾンは画像や映像の使用を厳しく管理している。したがって器は、支給される素材の質や縦横比がばらばらでも崩れないように設計しておく必要がある（推論）。

**第五に、編集写真に「場所と予約」のクレジットを付ける。** PORTERは全ページを購入可能にし、読者の78%が購入要素を操作したと発表した（自己申告）。空港では、クレジットを「ブランド・品名・価格・ターミナルとゲート・予約」に置き換える。ヒースロー限定のPradaバッグや、カタールのDior Luxury Beauty Retreatのような限定・独占の話題は、この編集枠の主役になる。

**第六に、サービスはブランド一覧と同格の枠にする。** 根拠は次のとおり。

- Bicesterのクライアントサービス売上は、2024年に+30%だった。
- ギャラリー・ラファイエット シャンゼリゼ店は、300人のパーソナルスタイリストを置いて開業した。
- ヒースローは無料のパーソナルショッピングを用意している。
- Van Cleef & Arpelsは来店予約のページを持つ。

事前予約、ゲートでの受け取り、免税、パーソナルショッパーは、ブランド名と同じ重みで見せる価値がある。

**第七に、「号」で更新し、ゾーンに名前を付ける。** 定期的に作り直す仕組みの例は次のとおり。

- Cartierは、毎年のW&W版で受賞を重ねている。
- Le Monde d'Hermèsは、毎年アートディレクションを交代する。
- Bottega VenetaのIssueは、店頭の発売に合わせて四半期ごとに出た。
- Cathayの機内誌は、約2.5年で2回刷新した。

ゾーンの命名では、HANKYU LUXURYが1フロアに名前と投資を集中させ、100万円以上の商品の売上を伸ばした（掲載月に不確かさあり）。LPは器を固定し、ヒーローと特集だけを季節や限定品の発売ごとに差し替える「号」のシステムで設計するとよい。

**第八に、多言語は手で組み、モバイルを先に作る。** 根拠は次のとおり。

- Cartier 365は、3言語105ページを手で組み直した。
- BVLGARI 130thは8言語に対応した。
- 羽田の公式サイトは、5言語のモバイルファーストで作られている。
- ANAの翼の王国は、スマホ向けに誌面を作り直して3言語にした。
- マガジンハウスの英語版は2週間で増刷され、日本の編集眼を英語で届けることへの需要を示した。

言語の切り替えはフッターの付属物ではなく、デザインの一部として扱うべきである。

「きらびやかさ」と落ち着きの釣り合いも、根拠から考えられる。Emirates Open Skiesは、温かい配色とミニマルな誌面で、多様な旅客を迎えるラグジュアリーを作った。国内の空港の空間を手がける会社（丹青社、隈研吾、GK）は、いずれもストレス軽減、和の素材、交通の機能美を軸にしている。LPの輝きは素材の光と一点のWebGLに集め、それ以外は余白で静かに保つ。これが、根拠に最も忠実な落としどころである。

反対意見も検討しておく。一つは、華やかさを最優先して全面を3Dにすべきだという立場である。しかし受賞作でも、多くは一つのモチーフや一つの体験に絞っている。また、空港の回線事情と、ブランドごとに異なる素材の扱いを考えると、全面3Dのリスクは大きい。

もう一つの注意点は数値の性質である。ヒースローとLoeweの伸び率はどちらも制作側の自己申告で、ラグジュアリーのマイクロサイトが来店を増やしたという独立したデータは見つかっていない。

| LPのモジュール | 根拠となる参照例 | 実装メモ |
|---|---|---|
| 表紙型のヒーロー | T Magazine、Holiday、Tiffany Landmarkの「窓」、LV × 草間の「開くトランク」 | 全面の季節ビジュアル、館のワードマーク、「AW26」などの号表記、3〜4本のカバーラインで構成する。動画は1本に絞る |
| ゾーン名とワードマーク | GSIX（金のGを一点だけ）、Extime、HANKYU LUXURY、香港の「Luxury Zone」 | 施設名を短く抽象化する。金は一点だけ使う |
| 目次とスティッキーナビ | 雑誌の目次 | 「01 特集／02 エディット／03 ブティック一覧／04 サービス」のように、ページ番号風に並べる |
| 注目メゾンの小部屋 | Cartier W&W 2025のアルコーヴ、カタールのDior Retreat、LV Collectiblesの長押し | ブランドから支給される映像と写真を受け止める器にする。WebGLはこの一か所だけ |
| エディット（買える誌面） | PORTER、百貨店のギフトガイド | 商品クレジットに「ブランド・品名・価格・ターミナル／ゲート」を入れ、タップで場所、予約、免税の可否を表示する |
| ブティック一覧 | Heathrow A–Z、Extimeのブランドページ、Dubai Voyagerの16ページ、Loeweのギャラリー型EC、LVの色分け | A–Z、カテゴリー、場所（エアサイド／ランドサイド、ターミナル、ゲートの近く）で絞り込めるようにする。営業時間、地図のピン、予約CTAを付ける |
| サービス | Bicesterの+30%、ギャラリー・ラファイエットの300人、ヒースローのパーソナルショッピング、VCAの来店予約、香港のLuxury Reserve | 事前予約とゲートでの受け取り、パーソナルショッパー、免税、配送 |
| ターミナル散歩 | LV City Guides、POPEYE／TRANSIT、JewelのPicoサイン、JFK T4の書体 | 番号付きのイラスト地図で、ブティック、ラウンジ、カフェを巡る |
| 多言語 | Cartier 365（105ページを手で組版）、BVLGARI 8言語、羽田 5言語、ANA | 日本語・英語・簡体字・繁体字・韓国語を、言語ごとに組版を調整する |
| 号のアーカイブ | Bottega Issue、Le Monde d'Hermès、Cartierの年次版、MR PORTER | 季節や限定品の発売ごとに更新し、過去の号を保存する |
| 計測 | Dubai Duty Freeのオンライン比率2.65%、ヒースローのコンバージョン率 | 店舗地図のクリック、予約のタップ、会員登録、来店を主なKPIにする |

## 7. 制作前に開いて確かめるべき項目

| 項目 | 現状 | 確認方法 |
|---|---|---|
| 全リファレンスの書体、配色、モーション。ブランド一覧の実装（ファーストビューに入るブランド数、ロゴカードか写真カードか、地図、固定の絞り込み、ホバー時の挙動） | 誰も画面を見ていない | 制限のない回線で各URLを開き、スクリーンショットの比較表を作る。優先は、Heathrow Shops A–Z、Extimeのブランドページ、GINZA SIXのフロアガイド、Bicesterのブランド一覧、Harrods Brands A–Z、K11、Dubai Mall |
| 空港サイトの制作会社（extime.com、dubaidutyfree.com、qatardutyfree.com、香港国際空港、tokyo-haneda.com、narita-airport.jp、関西T1特設） | 不明 | サイトのフッター、制作会社のWorksページ、S5-Style、MUUUUU.ORG、I/O 3000、81-webのクレジット欄 |
| The Moodies 2024 Best Websiteの受賞者、空港部門の受賞作（Awwwards、Webby、Cannes、D&AD、DFNI） | 未調査 | moodiedavittreport.comと、各賞のアーカイブ |
| 受賞ランクの食い違い（Tutti Twilly、Chanel Les 4 Ombres、Rouge Dior、365のクレジット、Cartier W&W 2026のスタジオ） | 〔食い違い〕〔未検証〕 | Awwwardsの各ページ |
| 数値が確定していないもの（HANKYU LUXURYの+30%の掲載月、Dubai Mallの2024年の1億1,100万人、御殿場の2025年度、伊勢丹・三越の記事との対応、Harrodsの集計範囲、PORTERの現状、HeathrowのMoodies受賞年） | 〔未検証〕〔食い違い〕 | 運営会社のIR資料と一次のプレスリリース |
| 日本の雑誌のアートディレクター名 | 事前知識による候補だけで、出典がない（本書には不掲載） | 各号の奥付 |
| 検索の上限で調べられなかった施設 | 未調査 | Zurich The Circle、Istanbul／Unifree、King Power、Heinemann、Schiphol、羽田エアポートガーデン、Le Bon Marché、KaDeWe、Bergdorf Goodman、ION Orchard、マリーナベイ・サンズのショップス、表参道ヒルズ、東京ミッドタウン、日本橋高島屋S.C.、グラングリーン大阪、NEWoMan、カンヌライオンズのLuxury Lions（2025年新設） |

## 結論

今回の調査で見えたのは、参照すべき世界が三つに分かれていて、まだ誰もそれをつないでいないということだ。

- Webデザイン賞は、メゾンのキャンペーン用マイクロサイトにある。
- 売上の裏付けは、空港と商業施設の情報設計とサービスにある。
- 華やかさへの賞は、館のアイデンティティと空間にある。

空港の多ブランドLPは単発の特設ページなので、Awwwardsがラグジュアリー領域で毎年評価している形式そのものにあたる。三つの要素を一枚に重ねれば、賞と売上の両方を狙う設計が理屈の上では成り立つ。重ねるのは、Cartierの「小部屋」の構成、Extimeのブランドページの型、GSIXの「支える簡潔さ」である。日本の空港サイトの受賞が使いやすさの評価にとどまっている以上、国内でこの組み合わせを最初に実現すること自体が差別化になる。そして日本らしい明快さは、その組み合わせの中でむしろ武器になる。

ただし、ヒースローとLoeweの伸び率は制作側の自己申告である。ラグジュアリーのマイクロサイトが来店を増やしたという独立したデータもない。ドバイ免税店のオンライン売上が2.65%にとどまることを踏まえると、成果は最初から店舗地図のクリック、事前予約、会員登録、来店で測る設計にすべきだ。デザインに入る前の最初の作業は、本書のURLを制限のない回線で開き、ブランド一覧の実装と書体・配色をスクリーンショットで比べる表を作ることである。この表が、本書の推論を事実に置き換える最初の一歩になる。
