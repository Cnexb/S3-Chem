/** Sample bank — replace in Step 5 with chapter content. */
export const QUIZ_SECTIONS = [
  { id: "sample", label: "Sample topic", labelZh: "示例主題" },
];

export const QUIZ_ITEMS = [
  {
    id: "sample-mcq-1",
    section: "sample",
    difficulty: "Foundation",
    stem: "Which particle has a relative mass of 1 and no charge?",
    options: [
      { key: "A", text: "Proton" },
      { key: "B", text: "Neutron" },
      { key: "C", text: "Electron" },
      { key: "D", text: "Nucleus" },
    ],
    answer: "B",
    hint: "It is found in the nucleus alongside protons.",
  },
  {
    id: "sample-tf-1",
    format: "tf",
    section: "sample",
    difficulty: "Foundation",
    stem: "Electrons carry a positive charge.",
    options: [
      { key: "T", text: "True" },
      { key: "F", text: "False" },
    ],
    answer: "F",
    hint: "Electrons are negatively charged.",
  },
];
