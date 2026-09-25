/** Topic 9: Rates of Reactions — flashcard deck (Traditional Chinese) */
export const FLASHCARD_TAGS = ["化學", "Topic9Rates", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Rate Curve & Calculations (7 cards)
  {
    id: 1,
    subtopic: "速率曲線與計算",
    front: "對於反應 <strong>A(g) + 2B(g) → 3C(g) + 4D(g)</strong>，如何計算整個反應中 <strong>A 的平均消耗速率</strong>？",
    back: "<strong>平均速率 = −Δ[A] / Δt</strong><br>其中 Δ[A] 是 A 的濃度變化量，Δt 是整個反應所需的總時間。",
    image: "./assets/1-rate-curve.png",
    imageAlt: "顯示 A 濃度隨時間變化的速率曲線"
  },
  {
    id: 2,
    subtopic: "速率曲線與計算",
    front: "如果 A 的平均消耗速率為 <strong>0.085 mol dm⁻³ min⁻¹</strong>，那麼 B 的平均消耗速率是多少？",
    back: "<strong>0.17 mol dm⁻³ min⁻¹</strong><br>（因為 A : B 的摩爾比為 1 : 2，所以 B 的速率是 A 的兩倍：0.085 × 2 = 0.17）。"
  },
  {
    id: 3,
    subtopic: "速率曲線與計算",
    front: "如何從速率曲線中確定特定時間（例如 t = 2 min）時 <strong>A 的瞬時消耗速率</strong>？",
    back: "通過計算該特定時間點曲線的<strong>切線斜率</strong>的負值。",
    image: "./assets/1-rate-curve.png",
    imageAlt: "濃度-時間圖像上的切線"
  },
  {
    id: 4,
    subtopic: "速率曲線與計算",
    front: "什麼是<strong>反應的初始速率</strong>？如何確定它？",
    back: "<strong>時間 = 0 時的瞬時速率</strong>。它是通過求 <strong>t = 0 時切線斜率</strong>的負值來確定的。",
    image: "./assets/1-rate-curve.png",
    imageAlt: "速率曲線在 t = 0 時的切線"
  },
  {
    id: 5,
    subtopic: "速率曲線與計算",
    front: "如果 A 的初始消耗速率為 <strong>0.5 mol dm⁻³ min⁻¹</strong>，那麼在反應 A(g) + 2B(g) → 3C(g) + 4D(g) 中，D 的初始生成速率是多少？",
    back: "<strong>2.0 mol dm⁻³ min⁻¹</strong><br>（因為 A : D 的摩爾比為 1 : 4，所以 D 的生成速率是 A 消耗速率的四倍：0.5 × 4 = 2.0）。"
  },
  {
    id: 6,
    subtopic: "速率曲線與計算",
    front: "為什麼反應速率通常會<strong>隨著時間推移而減慢</strong>？",
    back: "因為隨著反應物的消耗，<strong>反應物的濃度降低</strong>，導致微粒碰撞頻率下降。",
    image: "./assets/1-rate-curve.png",
    imageAlt: "速率曲線斜率隨時間減小"
  },
  {
    id: 7,
    subtopic: "速率曲線與計算",
    front: "濃度-時間曲線上的<strong>水平線</strong>代表什麼？",
    back: "反應已經<strong>停止</strong>，因為一種或多種反應物已被完全消耗（或已達到化學平衡）。",
    image: "./assets/1-rate-curve.png",
    imageAlt: "濃度-時間曲線上的水平線"
  },

  // Following Reaction Progress (8 cards)
  {
    id: 8,
    subtopic: "監測反應進度的方法",
    front: "使用氣體注射器測量<strong>氣體體積</strong>適用於哪類反應？指出一個例外。",
    back: "適用於<strong>產生氣體</strong>的反應。<br>例外：如果產生的氣體在水中的<strong>溶解度極高</strong>（如 NH₃、HCl、SO₂）且以水為溶劑，則<strong>不適用</strong>。",
    image: "./assets/2-methods-part1.png",
    imageAlt: "氣體注射器裝置"
  },
  {
    id: 9,
    subtopic: "監測反應進度的方法",
    front: "使用壓強傳感器測量<strong>壓強變化</strong>適用於哪類反應？",
    back: "適用於在密閉系統中進行且涉及<strong>氣體摩爾數變化</strong>（增加或減少）的反應。",
    image: "./assets/2-methods-part1.png",
    imageAlt: "壓強傳感器裝置"
  },
  {
    id: 10,
    subtopic: "監測反應進度的方法",
    front: "指出在速率實驗中，將<strong>數據記錄儀</strong>連接到傳感器（如壓強傳感器）的兩個優點。",
    back: "1. 可以在<strong>極短的時間間隔</strong>內收集並儲存數據。<br>2. 實驗數據可以<strong>立即在電腦上以圖像形式呈現</strong>。"
  },
  {
    id: 11,
    subtopic: "監測反應進度的方法",
    front: "使用電子天平測量反應混合物的<strong>質量變化</strong>適用於哪類反應？指出兩個例外。",
    back: "適用於<strong>產生氣體</strong>且氣體會逸出的反應。<br>例外：<strong>不適用</strong>於極易溶於水的氣體（NH₃、HCl、SO₂）或<strong>氫氣 (H₂)</strong>，因為 H₂ 的密度極低，質量變化無法準確測量。",
    image: "./assets/2-methods-part1.png",
    imageAlt: "電子天平裝置"
  },
  {
    id: 12,
    subtopic: "監測反應進度的方法",
    front: "在測量質量隨時間變化的實驗中，燒瓶口塞入<strong>棉花塞</strong>的目的是什麼？",
    back: "它允許<strong>氣體逸出</strong>，同時<strong>防止溶液濺出</strong>。",
    image: "./assets/2-methods-part1.png",
    imageAlt: "天平上燒瓶口塞有棉花"
  },
  {
    id: 13,
    subtopic: "監測反應進度的方法",
    front: "使用比色計測量<strong>顏色深淺</strong>適用於哪類反應？",
    back: "適用於因有色物質（如 Br₂(aq)）濃度增加或減少而導致<strong>顏色深淺發生變化</strong>的反應。",
    image: "./assets/3-methods-part2.png",
    imageAlt: "比色計與有色物質"
  },
  {
    id: 14,
    subtopic: "監測反應進度的方法",
    front: "利用<strong>滴定分析法</strong>監測反應進度的關鍵步驟是什麼？為什麼它必不可少？",
    back: "<strong>驟冷 (Quenching)</strong> 取出的反應混合物（通過快速冷卻、稀釋或移除催化劑）。這對於<strong>停止或極大地減慢反應</strong>必不可少，以防止在滴定過程中濃度繼續發生變化。",
    image: "./assets/3-methods-part2.png",
    imageAlt: "滴定分析步驟"
  },
  {
    id: 15,
    subtopic: "監測反應進度的方法",
    front: "指出使用<strong>滴定分析法</strong>監測反應進度的兩個局限性。",
    back: "1. 每次取出混合物時，原反應混合物會<strong>受到干擾</strong>。<br>2. 無法對反應進度進行<strong>連續監測</strong>。"
  },

  // Collision Theory (5 cards)
  {
    id: 16,
    subtopic: "碰撞理論",
    front: "根據碰撞理論，反應物微粒之間的碰撞要成為<strong>有效碰撞 (effective collision)</strong>，必須滿足哪<strong>兩個要求</strong>？",
    back: "1. 微粒碰撞時必須具有<strong>足夠的能量</strong>（等於或大於活化能）。<br>2. 微粒必須以<strong>正確的方向</strong>進行碰撞。",
    image: "./assets/5-collisions.png",
    imageAlt: "有效與無效碰撞"
  },
  {
    id: 17,
    subtopic: "碰撞理論",
    front: "什麼是<strong>活化能 (E_a)</strong>？",
    back: "碰撞的反應物微粒為了發生反應而必須擁有的<strong>最低能量</strong>。"
  },
  {
    id: 18,
    subtopic: "碰撞理論",
    front: "<strong>溫度</strong>如何影響反應物微粒的能量和反應速率？",
    back: "在較高溫度下，微粒運動更快，<strong>碰撞更頻繁</strong>。更重要的是，<strong>能量 ≥ E_a 的微粒比例大大增加</strong>，從而極大地增加了<strong>有效碰撞的頻率</strong>。",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "麥克斯韋-玻爾茲曼分佈/溫度效應"
  },
  {
    id: 19,
    subtopic: "碰撞理論",
    front: "從碰撞理論的角度，<strong>濃度</strong>如何影響反應速率？",
    back: "濃度較高意味著<strong>單位體積內的反應物微粒增多</strong>，這會增加<strong>碰撞頻率</strong>，從而提高<strong>有效碰撞的頻率</strong>。",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "濃度對碰撞的影響"
  },
  {
    id: 20,
    subtopic: "碰撞理論",
    front: "從碰撞理論的角度，固體反應物的<strong>表面積</strong>如何影響反應速率？",
    back: "較大的表面積使<strong>更多反應物微粒</strong>暴露於碰撞中，增加了<strong>碰撞頻率</strong>，從而提高了<strong>有效碰撞的頻率</strong>。",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "表面積對碰撞的影響"
  },

  // Factors Affecting Rate (10 cards)
  {
    id: 21,
    subtopic: "影響反應速率的因素",
    front: "什麼是<strong>催化劑</strong>？",
    back: "一種通過提供具有<strong>較低活化能</strong>的替代途徑來<strong>提高反應速率</strong>的物質，而其自身在反應結束時<strong>化學性質保持不變</strong>。",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "催化劑能量剖面圖"
  },
  {
    id: 22,
    subtopic: "影響反應速率的因素",
    front: "如果將 1.0 g <strong>MnO₂ (s)</strong> 作為催化劑加入 H₂O₂ (aq) 的分解反應中，反應結束時可以回收多少質量的 MnO₂？",
    back: "<strong>1.0 g</strong><br>（催化劑在化學反應中不會被消耗，因此其質量保持不變）。",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "MnO2 作為 H2O2 分解的催化劑"
  },
  {
    id: 23,
    subtopic: "影響反應速率的因素",
    front: "什麼是<strong>酶 (enzymes)</strong>？它們在溫度方面與無機催化劑有何不同？",
    back: "酶是<strong>生物催化劑（蛋白質）</strong>。與無機催化劑不同，酶的催化速率不會隨溫度持續升高，因為它們在高溫下會<strong>變性 (denatured)</strong>。",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "酶作為生物催化劑"
  },
  {
    id: 24,
    subtopic: "影響反應速率的因素",
    front: "寫出酵母中的<strong>酒化酶 (zymase)</strong> 催化葡萄糖發酵的方程式。",
    back: "<strong>C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂</strong>"
  },
  {
    id: 25,
    subtopic: "影響反應速率的因素",
    front: "在 Mg 與過量酸的反應 <strong>Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)</strong> 中，為什麼 1 M H₂SO₄ 的曲線比 1 M HCl 更陡峭？",
    back: "因為 H₂SO₄ 是<strong>二元酸 (dibasic acid)</strong>，其 <strong>[H⁺]</strong> (2 M) 高於 1 M HCl (1 M)，從而導致更高的反應速率。",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "Mg 與不同酸反應的曲線"
  },
  {
    id: 26,
    subtopic: "影響反應速率的因素",
    front: "在 Mg 與過量酸的反應中，為什麼 1 M HCl 的曲線比 1 M CH₃COOH 更陡峭？",
    back: "因為 HCl 是<strong>強酸</strong>（完全電離），其 <strong>[H⁺]</strong> 顯著高於部分電離的<strong>弱酸</strong> CH₃COOH。",
    image: "./assets/6-catalyst-concentration.png",
    imageAlt: "強酸與弱酸速率曲線對比"
  },
  {
    id: 27,
    subtopic: "影響反應速率的因素",
    front: "在過量 CaCO₃ 與 HCl 的反應中，為什麼應預先讓 HCl <strong>被 CO₂ 飽和</strong>以獲得準確結果？",
    back: "因為 CO₂ 氣體<strong>微溶於水</strong>；預先讓酸飽和可以防止生成的 CO₂ 溶解，從而確保氣體體積測量準確。",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "CaCO3 與 HCl 裝置"
  },
  {
    id: 28,
    subtopic: "影響反應速率的因素",
    front: "反應速率如何隨溫度變化？速率-溫度圖像的形狀是怎樣的？",
    back: "反應速率隨溫度升高呈<strong>指數級 (exponentially)</strong> 增加，圖像呈<strong>指數曲線</strong>。",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "速率隨溫度變化的指數曲線"
  },
  {
    id: 29,
    subtopic: "影響反應速率的因素",
    front: "在<strong>硫代硫酸鈉 (Na₂S₂O₃)</strong> 與稀硫酸的反應中，是什麼導致溶液變渾濁？",
    back: "生成了<strong>乳黃色硫固體 (S(s)) 沉澱</strong>：<br><strong>S₂O₃²⁻(aq) + 2H⁺(aq) → SO₂(g) + H₂O(l) + S(s)</strong>",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "硫代硫酸鈉與酸反應"
  },
  {
    id: 30,
    subtopic: "影響反應速率的因素",
    front: "在硫代硫酸鈉與酸的實驗中，平均反應速率與“遮蓋十字”所需的時間有何關係？",
    back: "平均反應速率與所需時間<strong>成反比</strong>（<strong>速率 ∝ 1/時間</strong>）。",
    image: "./assets/7-surface-area-temperature.png",
    imageAlt: "遮蓋十字實驗"
  },

  // Molar Volume & Calculations (5 cards)
  {
    id: 31,
    subtopic: "氣體摩爾體積與計算",
    front: "在室溫和壓強 (RTP) 下，<strong>任何氣體的摩爾體積</strong>是多少？",
    back: "<strong>24 dm³ mol⁻¹</strong>（或 24000 cm³ mol⁻¹）。",
    image: "./assets/4-molar-volume.png",
    imageAlt: "RTP 下的氣體摩爾體積"
  },
  {
    id: 32,
    subtopic: "氣體摩爾體積與計算",
    front: "寫出在 RTP 下由氣體體積計算<strong>氣體摩爾數</strong>的公式。",
    back: "<strong>氣體摩爾數 = 氣體體積 (dm³) / 24 dm³ mol⁻¹</strong><br>（或 體積 (cm³) / 24000 cm³ mol⁻¹）。",
    image: "./assets/4-molar-volume.png",
    imageAlt: "氣體摩爾數計算公式"
  },
  {
    id: 33,
    subtopic: "氣體摩爾體積與計算",
    front: "如果在 RTP 下收集到 1200 cm³ 的 CO₂，生成了多少摩爾的 CO₂？",
    back: "<strong>0.05 mol</strong><br>（1200 / 24000 = 0.05 mol）。",
    image: "./assets/4-molar-volume.png",
    imageAlt: "CO2 摩爾數計算"
  },
  {
    id: 34,
    subtopic: "氣體摩爾體積與計算",
    front: "在恆溫恆壓下的氣體反應中，<strong>摩爾比</strong>與<strong>體積比</strong>之間有何關係？",
    back: "<strong>摩爾比等於體積比</strong>（阿伏伽德羅定律）。",
    image: "./assets/4-molar-volume.png",
    imageAlt: "阿伏伽德羅定律概念"
  },
  {
    id: 35,
    subtopic: "氣體摩爾體積與計算",
    front: "若 100 cm³ 丁烷 (C₄H₁₀) 在 800 cm³ O₂ 中燃燒：<strong>2C₄H₁₀(g) + 13O₂(g) → 8CO₂(g) + 10H₂O(l)</strong>，在 RTP 下所得氣體混合物的體積是多少？",
    back: "<strong>550 cm³</strong><br>• 消耗的 O₂ = 100 × 13/2 = 650 cm³（剩餘 O₂ = 800 − 650 = 150 cm³）<br>• 生成的 CO₂ = 100 × 8/2 = 400 cm³<br>• 氣體總體積 = 150 + 400 = 550 cm³（在 RTP 下 H₂O 為液體）。",
    image: "./assets/4-molar-volume.png",
    imageAlt: "丁烷燃燒體積計算"
  }
];
