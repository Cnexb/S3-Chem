/** Topic 7: Redox Reactions, Chemical Cells and Electrolysis — flashcard deck (Traditional Chinese) */
export const FLASHCARD_TAGS = ["化學", "Topic7Redox", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // 日常生活中的化學電池 (8 cards)
  {
    id: 1,
    subtopic: "日常生活中的化學電池",
    front: "<strong>化學電池</strong>中發生什麼能量轉換？",
    back: "將<strong>化學能</strong>轉化為<strong>電能</strong>。"
  },
  {
    id: 2,
    subtopic: "日常生活中的化學電池",
    front: "<strong>一次電池</strong>和<strong>二次電池</strong>有何區別？",
    back: "一次電池是<strong>不可充電</strong>的，而二次電池是<strong>可充電</strong>的。"
  },
  {
    id: 3,
    subtopic: "日常生活中的化學電池",
    front: "指出<strong>碳鋅電池</strong>的優缺點。",
    back: "優點：<strong>成本低</strong>。<br>缺點：<strong>能量密度低</strong>，在高耗電電器或低溫下性能較差。"
  },
  {
    id: 4,
    subtopic: "日常生活中的化學電池",
    front: "指出<strong>鹼性錳電池</strong>相比碳鋅電池的優點。",
    back: "<strong>保質期更長</strong>、工作溫度範圍更寬、放電時<strong>電壓更穩定</strong>。"
  },
  {
    id: 5,
    subtopic: "日常生活中的化學電池",
    front: "指出<strong>氧化銀電池</strong>的優點和主要用途。",
    back: "優點：<strong>重量輕</strong>、體積小、能量密度高、電壓穩定。<br>用途：<strong>手錶和計算機</strong>等微型設備。"
  },
  {
    id: 6,
    subtopic: "日常生活中的化學電池",
    front: "指出<strong>鋰離子電池</strong>的優點。",
    back: "<strong>電壓高 (3.7 V)</strong>、能量密度高、電壓穩定，可重複充電<strong>1200次以上</strong>。"
  },
  {
    id: 7,
    subtopic: "日常生活中的化學電池",
    front: "指出<strong>鉛酸蓄電池</strong>的缺點。",
    back: "它<strong>非常笨重</strong>，且金屬鉛和鉛化合物<strong>具有高毒性</strong>。"
  },
  {
    id: 8,
    subtopic: "日常生活中的化學電池",
    front: "哪種二次電池具有<strong>高自放電率</strong>？",
    back: "<strong>鎳氫 (NiMH) 電池</strong>。"
  },

  // 氧化還原概念與方程式 (12 cards)
  {
    id: 9,
    subtopic: "氧化還原概念與方程式",
    front: "從電子轉移的角度定義<strong>氧化</strong>和<strong>還原</strong>。",
    back: "<strong>氧化</strong>是<strong>失去</strong>電子的過程（OIL）。<br><strong>還原</strong>是<strong>獲得</strong>電子的過程（RIG）。"
  },
  {
    id: 10,
    subtopic: "氧化還原概念與方程式",
    front: "從氧化數的角度定義<strong>氧化</strong>和<strong>還原</strong>。",
    back: "<strong>氧化</strong>是氧化數<strong>增加</strong>。<br><strong>還原</strong>是氧化數<strong>減少</strong>。"
  },
  {
    id: 11,
    subtopic: "氧化還原概念與方程式",
    front: "<strong>單質</strong>（例如 O₂、Na、Cl₂）的氧化數是多少？",
    back: "<strong>0</strong>。"
  },
  {
    id: 12,
    subtopic: "氧化還原概念與方程式",
    front: "化合物中<strong>氫</strong>的通常氧化數是多少？有何例外？",
    back: "通常：<strong>+1</strong>。<br>例外：在<strong>金屬氫化物</strong>中為 <strong>−1</strong>（例如 NaH、CaH₂）。"
  },
  {
    id: 13,
    subtopic: "氧化還原概念與方程式",
    front: "化合物中<strong>氧</strong>的通常氧化數是多少？有何例外？",
    back: "通常：<strong>−2</strong>。<br>例外：在<strong>過氧化物</strong>中為 <strong>−1</strong>（例如 H₂O₂），與<strong>氟結合</strong>時為 <strong>+2</strong>（例如 OF₂）。"
  },
  {
    id: 14,
    subtopic: "氧化還原概念與方程式",
    front: "確定 <strong>SO₃²⁻</strong> 和 <strong>SO₄²⁻</strong> 中 <strong>S</strong> 的氧化數。",
    back: "在 SO₃²⁻ 中為 <strong>+4</strong>。<br>在 SO₄²⁻ 中為 <strong>+6</strong>。"
  },
  {
    id: 15,
    subtopic: "氧化還原概念與方程式",
    front: "確定 <strong>Cr₂O₇²⁻</strong> 中 <strong>Cr</strong> 的氧化數。",
    back: "<strong>+6</strong> (因為 2x + 7(−2) = −2 ⇒ 2x = 12 ⇒ x = +6)。"
  },
  {
    id: 16,
    subtopic: "氧化還原概念與方程式",
    front: "寫出在酸性介質中 <strong>Cr₂O₇²⁻</strong> 還原為 <strong>Cr³⁺</strong> 的平衡離子半反應式。",
    back: "<strong>Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O</strong>"
  },
  {
    id: 17,
    subtopic: "氧化還原概念與方程式",
    front: "寫出在鹼性介質中 <strong>SO₃²⁻</strong> 氧化為 <strong>SO₄²⁻</strong> 的平衡離子半反應式。",
    back: "<strong>SO₃²⁻ + 2OH⁻ → SO₄²⁻ + H₂O + 2e⁻</strong>"
  },
  {
    id: 18,
    subtopic: "氧化還原概念與方程式",
    front: "寫出酸性介質中 <strong>SO₂</strong> 與 <strong>MnO₄⁻</strong> 反應的總平衡離子方程式。",
    back: "<strong>5SO₂ + 2MnO₄⁻ + 2H₂O → 5SO₄²⁻ + 2Mn²⁺ + 4H⁺</strong>"
  },
  {
    id: 19,
    subtopic: "氧化還原概念與方程式",
    front: "寫出鹼性介質中 <strong>SO₂</strong> 與 <strong>MnO₄⁻</strong> 反應的總平衡離子方程式。",
    back: "<strong>3SO₂ + 2MnO₄⁻ + 4OH⁻ → 3SO₄²⁻ + 2MnO₂ + 2H₂O</strong>"
  },
  {
    id: 20,
    subtopic: "氧化還原概念與方程式",
    front: "什麼是<strong>歧化反應</strong>（自身氧化還原反應）？",
    back: "一種<strong>同一種物質同時被氧化和還原</strong>的氧化還原反應。"
  },

  // 氧化劑與還原劑 (10 cards)
  {
    id: 21,
    subtopic: "氧化劑與還原劑",
    front: "當<strong>酸性 MnO₄⁻(aq)</strong> 作為氧化劑時，有何觀察結果？",
    back: "<strong>紫色溶液變為無色</strong>。"
  },
  {
    id: 22,
    subtopic: "氧化劑與還原劑",
    front: "當<strong>酸性 Cr₂O₇²⁻(aq)</strong> 作為氧化劑時，有何觀察結果？",
    back: "<strong>橘色溶液變為綠色</strong>。"
  },
  {
    id: 23,
    subtopic: "氧化劑與還原劑",
    front: "當<strong>濃硝酸 (HNO₃)</strong> 和<strong>稀硝酸</strong>與銅反應時，分別有何觀察結果？",
    back: "濃硝酸：產生<strong>紅棕色氣體 (NO₂)</strong>。<br>稀硝酸：產生<strong>無色氣體 (NO)</strong>，該氣體<strong>在空氣中會變為紅棕色</strong>（形成 NO₂）。"
  },
  {
    id: 24,
    subtopic: "氧化劑與還原劑",
    front: "當<strong>濃硫酸 (H₂SO₄)</strong> 作為氧化劑時，有何觀察結果？",
    back: "產生具有<strong>窒息性氣味的無色氣體 (SO₂)</strong>。"
  },
  {
    id: 25,
    subtopic: "氧化劑與還原劑",
    front: "為什麼氧化性酸（如濃 H₂SO₄ 或 HNO₃）加入金屬碳酸鹽中時<strong>不</strong>發生氧化還原反應？",
    back: "因為金屬碳酸鹽不是還原劑；它們僅與酸中的<strong>氫離子 (H⁺)</strong> 反應產生<strong>二氧化碳氣體 (CO₂)</strong>。"
  },
  {
    id: 26,
    subtopic: "氧化劑與還原劑",
    front: "當 <strong>Fe³⁺(aq)</strong> 還原為 <strong>Fe²⁺(aq)</strong> 時，有何觀察結果？",
    back: "<strong>黃色溶液變為綠色</strong>。"
  },
  {
    id: 27,
    subtopic: "氧化劑與還原劑",
    front: "當<strong>碘離子 (I⁻)</strong> 氧化為 <strong>碘 (I₂)</strong> 時，有何觀察結果？",
    back: "<strong>無色溶液變為棕色</strong>。"
  },
  {
    id: 28,
    subtopic: "氧化劑與還原劑",
    front: "為什麼 KMnO₄ <strong>不能</strong>用稀鹽酸 (HCl) 酸化？",
    back: "因為 MnO₄⁻ 是比 Cl₂ 更強的氧化劑，會將 <strong>Cl⁻ 氧化為有毒的 Cl₂ 氣體</strong>。"
  },
  {
    id: 29,
    subtopic: "氧化劑與還原劑",
    front: "寫出氯氣溶解在<strong>冷稀氫氧化鈉 (NaOH)</strong> 溶液中的化學方程式。",
    back: "<strong>Cl₂ + 2NaOH → NaCl + NaOCl + H₂O</strong>"
  },
  {
    id: 30,
    subtopic: "氧化劑與還原劑",
    front: "當<strong>酸</strong>加入<strong>漂白水</strong>中時會發生什麼？",
    back: "會產生有毒的<strong>氯氣 (Cl₂)</strong>：<br><strong>Cl⁻ + OCl⁻ + 2H⁺ → Cl₂ + H₂O</strong>"
  },

  // 化學電池原理 (10 cards)
  {
    id: 31,
    subtopic: "化學電池原理",
    front: "定義<strong>電解質</strong>。",
    back: "一種含有自由移動離子，且<strong>在熔融或水溶液狀態下能導電</strong>的物質。"
  },
  {
    id: 32,
    subtopic: "化學電池原理",
    front: "在化學電池中，兩個電極的名稱、極性和反應分別是什麼？",
    back: "<strong>陽極</strong>：負極，發生<strong>氧化反應</strong>（失去電子）。<br><strong>陰極</strong>：正極，發生<strong>還原反應</strong>（獲得電子）。"
  },
  {
    id: 33,
    subtopic: "化學電池原理",
    front: "在含有 Mg 和 Ag 電極及其相應硝酸鹽溶液的電池中，哪一個是陽極？其半反應式是什麼？",
    back: "<strong>Mg 電極是陽極（負極）</strong>。<br>半反應式：<strong>Mg → Mg²⁺ + 2e⁻</strong>"
  },
  {
    id: 34,
    subtopic: "化學電池原理",
    front: "指出<strong>鹽橋</strong>的<strong>兩個主要功能</strong>。",
    back: "1. 藉由允許離子在半電池之間移動來<strong>接通電路</strong>。<br>2. <strong>平衡電荷</strong>，防止半電池溶液中電荷積聚。"
  },
  {
    id: 35,
    subtopic: "化學電池原理",
    front: "為什麼常用飽和 <strong>KNO₃(aq)</strong> 來製作鹽橋？",
    back: "因為 K⁺ 和 NO₃⁻ 離子<strong>不會與電解質發生任何氧化還原反應或沉澱</strong>。"
  },
  {
    id: 36,
    subtopic: "化學電池原理",
    front: "指出<strong>多孔質紅土缸（素瓷缸）</strong>的<strong>兩個主要功能</strong>。",
    back: "1. <strong>防止兩種電解質直接混合</strong>。<br>2. 允許離子通過其微孔移動以<strong>接通電路</strong>。"
  },
  {
    id: 37,
    subtopic: "化學電池原理",
    front: "寫出在<strong>鹼性 (KOH)</strong> 電解質中，<strong>氫氧燃料電池</strong>陽極和陰極的半反應式。",
    back: "陽極 (A)：<strong>H₂ + 2OH⁻ → 2H₂O + 2e⁻</strong><br>陰極 (B)：<strong>O₂ + 2H₂O + 4e⁻ → 4OH⁻</strong>"
  },
  {
    id: 38,
    subtopic: "化學電池原理",
    front: "寫出在<strong>酸性 (H₃PO₄)</strong> 電解質中，<strong>氫氧燃料電池</strong>陽極 and 陰極的半反應式。",
    back: "陽極 (A)：<strong>H₂ → 2H⁺ + 2e⁻</strong><br>陰極 (B)：<strong>O₂ + 4H⁺ + 4e⁻ → 2H₂O</strong>"
  },
  {
    id: 39,
    subtopic: "化學電池原理",
    front: "指出燃料電池中<strong>多孔鉑電極</strong>的<strong>兩個功能</strong>。",
    back: "1. 允許氣體（H₂、O₂）和水蒸氣進出通通道。<br>2. <strong>催化</strong>氧化還原反應。"
  },
  {
    id: 40,
    subtopic: "化學電池原理",
    front: "指出<strong>氫氧燃料電池</strong>的兩個優點和兩個缺點。",
    back: "優點：<strong>能量轉換效率高</strong>、產物（水）<strong>無污染</strong>、可連續運行。<br>缺點：氫氣<strong>易燃易爆</strong>、儲存/運輸困難、鉑催化劑<strong>價格昂貴</strong>。"
  },

  // 電解與應用 (9 cards)
  {
    id: 41,
    subtopic: "電解與應用",
    front: "<strong>電解池</strong>中發生什麼能量轉換？",
    back: "將<strong>電能</strong>轉化為<strong>化學能</strong>。"
  },
  {
    id: 42,
    subtopic: "電解與應用",
    front: "在電解池中，兩個電極的名稱、極性和反應分別是什麼？",
    back: "<strong>陽極</strong>：正極（連接電池正極），發生<strong>氧化反應</strong>。<br><strong>陰極</strong>：負極（連接電池負極），發生<strong>還原反應</strong>。"
  },
  {
    id: 43,
    subtopic: "電解與應用",
    front: "預測電解<strong>熔融溴化鍶 (SrBr₂)</strong> 時，陽極和陰極的產物。",
    back: "陽極 (+)：<strong>紅棕色溴氣 (Br₂)</strong>。<br>陰極 (−)：<strong>銀灰色金屬鍶 (Sr)</strong>。"
  },
  {
    id: 44,
    subtopic: "電解與應用",
    front: "預測使用碳電極電解<strong>稀 Na₂SO₄(aq)</strong> 時的產物，並寫出其半反應式。",
    back: "陽極 (+)：<strong>O₂ 氣體</strong> (4OH⁻ → O₂ + 2H₂O + 4e⁻)。<br>陰極 (−)：<strong>H₂ 氣體</strong> (2H⁺ + 2e⁻ → H₂)。<br><em>（注意：隨着水被電解，Na₂SO₄ 的濃度會增加）</em>"
  },
  {
    id: 45,
    subtopic: "電解與應用",
    front: "預測使用碳電極電解<strong>濃 NaCl(aq)（食鹽水）</strong>時的產物，並寫出其半反應式。",
    back: "陽極 (+)：<strong>黃綠色 Cl₂ 氣體</strong> (2Cl⁻ → Cl₂ + 2e⁻)。<br>陰極 (−)：<strong>H₂ 氣體</strong> (2H⁺ + 2e⁻ → H₂)。<br><em>（注意：溶液會變為鹼性 NaOH）</em>"
  },
  {
    id: 46,
    subtopic: "電解與應用",
    front: "在鐵匙鍍銅的實驗中，陽極、陰極和電解質分別是什麼？寫出其半反應式。",
    back: "陽極 (+)：<strong>銅片</strong> (Cu → Cu²⁺ + 2e⁻)。<br>陰極 (−)：<strong>鐵匙</strong> (Cu²⁺ + 2e⁻ → Cu)。<br>電解質：<strong>CuSO₄(aq)</strong>（電解質濃度保持不變）。"
  },
  {
    id: 47,
    subtopic: "電解與應用",
    front: "在電解食鹽水時，使用<strong>汞陰極</strong>的目的是什麼？",
    back: "它促使 <strong>Na⁺ 離子</strong>比 H⁺ 離子優先放電，形成金屬鈉，並立即溶解在汞中形成<strong>鈉汞齊 (Na/Hg)</strong>。"
  },
  {
    id: 48,
    subtopic: "電解與應用",
    front: "在電解含有石蕊指示劑的 1 M NaNO₃(aq) 時，陽極和陰極周圍的顏色變化如何？",
    back: "陽極 (+)：變為<strong>紅色</strong>（OH⁻ 放電，留下過量 H⁺）。<br>陰極 (−)：變為<strong>藍色</strong>（H⁺ 放電，留下過量 OH⁻）。"
  },
  {
    id: 49,
    subtopic: "電解與應用",
    front: "在電解含有石蕊指示劑的 6 M NaCl(aq) 時，陽極周圍的顏色變化如何？",
    back: "變為<strong>紅色，然後迅速褪色</strong>，因為 Cl⁻ 放電產生 Cl₂ 氣體，溶解後形成具有酸性和漂白性的 HCl/HOCl。"
  }
];
