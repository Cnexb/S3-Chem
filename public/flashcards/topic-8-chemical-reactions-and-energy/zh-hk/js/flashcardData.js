/** Topic 8: Chemical Reactions and Energy — flashcard deck (Traditional Chinese) */
export const FLASHCARD_TAGS = ["化學", "Topic8Energy", "HKDSE", "S3"];

export const FLASHCARD_DECK = [
  // Enthalpy Change Concepts (3 cards)
  {
    id: 1,
    subtopic: "焓變概念",
    front: "什麼是<strong>焓變 (ΔH)</strong>？",
    back: "在<strong>恆壓</strong>下測得的反應熱量變化。"
  },
  {
    id: 2,
    subtopic: "焓變概念",
    front: "<strong>焓變 (ΔH)</strong> 與<strong>內能變化 (ΔU)</strong> 之間有何關係？",
    back: "反應式為 <strong>ΔH = ΔU + w</strong>，其中 <i>w</i> 是對周圍環境所做的功。"
  },
  {
    id: 3,
    subtopic: "焓變概念",
    front: "在什麼條件下，反應的<strong>焓變 (ΔH)</strong> 與其<strong>內能變化 (ΔU)</strong> 幾乎相同？",
    back: "當反應<strong>不涉及任何氣體摩爾數的變化</strong>時（對周圍環境所做的功 <i>w</i> = 0）。"
  },

  // Endothermic & Exothermic Reactions (9 cards)
  {
    id: 4,
    subtopic: "吸熱和放熱反應",
    front: "從熱量傳遞和溫度變化的角度定義<strong>放熱反應</strong>。",
    back: "反應向周圍環境<strong>釋放熱量</strong>，導致反應混合物的溫度<strong>上升</strong>（<strong>ΔH &lt; 0</strong>）。",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "放熱反應的焓剖面圖"
  },
  {
    id: 5,
    subtopic: "吸熱和放熱反應",
    front: "從熱量傳遞和溫度變化的角度定義<strong>吸熱反應</strong>。",
    back: "反應從周圍環境<strong>吸收熱量</strong>，導致反應混合物的溫度<strong>下降</strong>（<strong>ΔH &gt; 0</strong>）。",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "吸熱反應的焓剖面圖"
  },
  {
    id: 6,
    subtopic: "吸熱和放熱反應",
    front: "在<strong>放熱反應</strong>中，反應物還是生成物在能量上更穩定？為什麼？",
    back: "<strong>生成物</strong>更穩定，因為生成物的<strong>能量含量低於</strong>反應物。",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "放熱反應能量水平"
  },
  {
    id: 7,
    subtopic: "吸熱和放熱反應",
    front: "在<strong>吸熱反應</strong>中，反應物還是生成物在能量上更穩定？為什麼？",
    back: "<strong>反應物</strong>更穩定，因為反應物的<strong>能量含量低於</strong>生成物。",
    image: "./assets/1-enthalpy-change.png",
    imageAlt: "吸熱反應能量水平"
  },
  {
    id: 8,
    subtopic: "吸熱和放熱反應",
    front: "從化學鍵斷裂和形成的能量變化解釋<strong>放熱反應</strong>。",
    back: "反應物中<strong>斷裂化學鍵</strong>所吸收的能量<strong>小於</strong>生成物中<strong>形成化學鍵</strong>所釋放的能量。"
  },
  {
    id: 9,
    subtopic: "吸熱和放熱反應",
    front: "從化學鍵斷裂和形成的能量變化解釋<strong>吸熱反應</strong>。",
    back: "反應物中<strong>斷裂化學鍵</strong>所吸收的能量<strong>大於</strong>生成物中<strong>形成化學鍵</strong>所釋放的能量。"
  },
  {
    id: 10,
    subtopic: "吸熱和放熱反應",
    front: "指出三個<strong>放熱過程</strong>的物理或化學例子。",
    back: "以下任何三個：<strong>燃燒</strong>、<strong>中和</strong>、沉澱、置換、稀釋濃酸/濃鹼、凝結、凝固、凝華。"
  },
  {
    id: 11,
    subtopic: "吸熱和放熱反應",
    front: "指出三個<strong>吸熱過程</strong>的物理或化學例子。",
    back: "以下任何三個：<strong>熱分解</strong>（如 CaCO₃、Ag₂O）、<strong>裂解</strong>、弱酸/弱鹼的電離、蒸發、熔化、昇華。"
  },
  {
    id: 12,
    subtopic: "吸熱和放熱反應",
    front: "<strong>溶解鹽</strong>或<strong>生成化合物</strong>的焓變可以是吸熱或放熱的嗎？",
    back: "可以，它們可以是<strong>吸熱或放熱</strong>的。"
  },

  // Standard Enthalpy Changes (13 cards)
  {
    id: 13,
    subtopic: "標準焓變",
    front: "熱化學測量的<strong>標準條件</strong>是什麼？",
    back: "1. 溫度：<strong>298 K (25 °C)</strong><br>2. 壓力：<strong>1 atm</strong><br>3. 物質處於其<strong>標準狀態</strong>。"
  },
  {
    id: 14,
    subtopic: "標準焓變",
    front: "定義<strong>燃燒標準焓變 (ΔH<sub>c</sub><sup>⦵</sup>)</strong>。",
    back: "在標準條件下，<strong>1摩爾物質</strong>在氧氣中<strong>完全燃燒</strong>時的焓變。",
    image: "./assets/2-combustion.png",
    imageAlt: "燃燒標準焓變概念"
  },
  {
    id: 15,
    subtopic: "標準焓變",
    front: "寫出<strong>己烷 (C₆H₁₄)</strong> 的燃燒標準焓變的熱化學方程式。",
    back: "<strong>C₆H₁₄(l) + 19/2 O₂(g) → 6CO₂(g) + 7H₂O(l)</strong>",
    image: "./assets/2-combustion.png",
    imageAlt: "己烷燃燒方程式"
  },
  {
    id: 16,
    subtopic: "標準焓變",
    front: "定義<strong>中和標準焓變 (ΔH<sub>n</sub><sup>⦵</sup>)</strong>。",
    back: "在標準條件下，酸和鹼進行中和反應生成<strong>1摩爾水</strong>時的焓變。",
    image: "./assets/5-neutralization-concept.png",
    imageAlt: "中和標準焓變概念"
  },
  {
    id: 17,
    subtopic: "標準焓變",
    front: "寫出代表<strong>強酸</strong>與<strong>強鹼</strong>中和標準焓變的離子方程式。",
    back: "<strong>H⁺(aq) + OH⁻(aq) → H₂O(l)</strong> (ΔH<sub>n</sub><sup>⦵</sup> = −57.3 kJ mol⁻¹)",
    image: "./assets/5-neutralization-concept.png",
    imageAlt: "強酸-強鹼中和反應"
  },
  {
    id: 18,
    subtopic: "標準焓變",
    front: "為什麼<strong>弱酸</strong>（如 CH₃COOH）與強鹼的中和焓變放熱<strong>少於</strong> −57.3 kJ mol⁻¹？",
    back: "因為弱酸在水中僅部分電離；部分釋放的熱量被<strong>吸收用於電離</strong>未電離的弱酸分子。"
  },
  {
    id: 19,
    subtopic: "標準焓變",
    front: "定義<strong>生成標準焓變 (ΔH<sub>f</sub><sup>⦵</sup>)</strong>。",
    back: "在標準條件下，由處於標準狀態的<strong>組成元素</strong>生成<strong>1摩爾物質</strong>時的焓變。",
    image: "./assets/3-formation-concept.png",
    imageAlt: "生成標準焓變概念"
  },
  {
    id: 20,
    subtopic: "標準焓變",
    front: "寫出<strong>碳酸氫銨 (NH₄HCO₃(s))</strong> 的生成標準焓變的熱化學方程式。",
    back: "<strong>1/2 N₂(g) + 5/2 H₂(g) + C(石墨) + 3/2 O₂(g) → NH₄HCO₃(s)</strong>",
    image: "./assets/4-formation-examples.png",
    imageAlt: "碳酸氫銨生成方程式"
  },
  {
    id: 21,
    subtopic: "標準焓變",
    front: "任何<strong>處於標準狀態的元素</strong>（如 C(石墨), O₂(g)）的生成標準焓變是多少？",
    back: "<strong>0 kJ mol⁻¹</strong>。",
    image: "./assets/3-formation-concept.png",
    imageAlt: "元素的生成標準焓變為零"
  },
  {
    id: 22,
    subtopic: "標準焓變",
    front: "為什麼<strong>金剛石 (C(金剛石))</strong> 的生成標準焓變不是零，而是 <strong>+1.9 kJ mol⁻¹</strong>？",
    back: "因為金剛石<strong>不是碳的標準狀態</strong>；碳的標準狀態是石墨 (C(石墨))。"
  },
  {
    id: 23,
    subtopic: "標準焓變",
    front: "為什麼大多數化合物的生成標準焓變很難或無法<strong>直接通過實驗</strong>測定？",
    back: "1. 元素在標準條件下可能<strong>無法直接反應</strong>。<br>2. 常常會產生<strong>副產物</strong>。<br>3. 反應可能進行得<strong>太慢</strong>。<br>4. 反應<strong>放熱過於劇烈</strong>，無法安全進行實驗。"
  },
  {
    id: 24,
    subtopic: "標準焓變",
    front: "哪一個燃燒標準焓變等同於 <strong>H₂O(l)</strong> 的生成標準焓變？",
    back: "<strong>H₂(g)</strong> 的燃燒標準焓變：<br><strong>H₂(g) + 1/2 O₂(g) → H₂O(l)</strong>"
  },
  {
    id: 25,
    subtopic: "標準焓變",
    front: "哪一個燃燒標準焓變等同於 <strong>CO₂(g)</strong> 的生成標準焓變？",
    back: "<strong>C(石墨)</strong> 的燃燒標準焓變：<br><strong>C(石墨) + O₂(g) → CO₂(g)</strong>"
  },

  // Calorimetry & Experimental Errors (3 cards)
  {
    id: 26,
    subtopic: "量熱法與實驗誤差",
    front: "在簡單量熱法中，使用什麼公式來計算釋放的熱量？",
    back: "<strong>釋放的熱量 = m · c · ΔT</strong><br>其中 <i>m</i> 是水/混合物的質量，<i>c</i> 是比熱容，<i>ΔT</i> 是溫度變化。"
  },
  {
    id: 27,
    subtopic: "量熱法與實驗誤差",
    front: "指出使用簡單量熱計測定<strong>燃燒</strong>焓變時的四個誤差來源。",
    back: "1. <strong>熱量散失</strong>到周圍環境。<br>2. 燃料<strong>不完全燃燒</strong>。<br>3. 忽略了金屬罐的<strong>熱容量</strong>。<br>4. 燃料可能未經燃燒就已<strong>蒸發</strong>。"
  },
  {
    id: 28,
    subtopic: "量熱法與實驗誤差",
    front: "指出使用簡單量熱計測定<strong>中和</strong>焓變時的四個誤差來源。",
    back: "1. <strong>熱量散失</strong>到周圍環境。<br>2. 假設混合物的<strong>比熱容</strong>與水相同。<br>3. 忽略了聚苯乙烯杯的<strong>熱容量</strong>。<br>4. 假設混合物的<strong>密度</strong>與水相同。",
    image: "./assets/6-neutralization-calorimetry.png",
    imageAlt: "中和量熱法裝置與誤差"
  },

  // Hess's Law & Enthalpy Cycles (1 card)
  {
    id: 29,
    subtopic: "赫斯定律與焓循環",
    front: "簡述<strong>赫斯定律 (Hess's Law)</strong>。",
    back: "化學反應的總焓變<strong>僅取決於反應的初始狀態 and 最終狀態</strong>，而與所採取的<strong>反應途徑無關</strong>。",
    image: "./assets/7-hess-law.png",
    imageAlt: "赫斯定律循環與圖解"
  },

  // Enthalpy Calculations (6 cards)
  {
    id: 30,
    subtopic: "焓變計算",
    front: "寫出使用<strong>生成標準焓變 (ΔH<sub>f</sub><sup>⦵</sup>)</strong> 計算反應焓變 (ΔH<sup>⦵</sup>) 的公式。",
    back: "<strong>ΔH<sup>⦵</sup> = ∑ ΔH<sub>f</sub><sup>⦵</sup>(生成物) − ∑ ΔH<sub>f</sub><sup>⦵</sup>(反應物)</strong>"
  },
  {
    id: 31,
    subtopic: "焓變計算",
    front: "寫出使用<strong>燃燒標準焓變 (ΔH<sub>c</sub><sup>⦵</sup>)</strong> 計算反應焓變 (ΔH<sup>⦵</sup>) 的公式。",
    back: "<strong>ΔH<sup>⦵</sup> = ∑ ΔH<sub>c</sub><sup>⦵</sup>(反應物) − ∑ ΔH<sub>c</sub><sup>⦵</sup>(生成物)</strong>"
  },
  {
    id: 32,
    subtopic: "焓變計算",
    front: "在赫斯定律計算中，如果將化學方程式反轉，其焓變值會發生什麼變化？",
    back: "其正負號會反轉（例如：<strong>+x kJ mol⁻¹ 變成 −x kJ mol⁻¹</strong>）。"
  },
  {
    id: 33,
    subtopic: "焓變計算",
    front: "在赫斯定律計算中，如果將方程式的係數乘以 <i>n</i>，其焓變值會發生什麼變化？",
    back: "焓變值也將<strong>乘以 <i>n</i></strong>。"
  },
  {
    id: 34,
    subtopic: "焓變計算",
    front: "什麼是赫斯定律計算中的<strong>代數法</strong>？",
    back: "通過對給定的熱化學方程式進行變換（反轉、相乘）並進行代數相加，以獲得目標方程式及其焓變。",
    image: "./assets/8-algebraic-method.png",
    imageAlt: "代數法示例"
  },
  {
    id: 35,
    subtopic: "焓變計算",
    front: "在中和量熱法中，如果酸和鹼不按化學計量比反應，如何確定<strong>生成的水的摩爾數</strong>？",
    back: "先確定<strong>限量試劑</strong>，然後根據化學方程式由限量試劑計算生成的水的摩爾數。"
  }
];
