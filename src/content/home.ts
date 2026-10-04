export const thesis =
  "Small models for scientific problems where structure matters."
export const about = {
  introduction: [
    "The Tiny Intelligence Lab is an independent, one-person research lab. We build models for scientific problems and ask how much useful capability comes from understanding their structure. Our first project, Opal, studies how biological interventions work together.",
    "A scientific problem often gives us a head start. We may know that swapping two inputs should leave a prediction unchanged. Or that a simple calculation already explains part of the answer. We put that knowledge into a model, then test whether it actually helps.",
  ],
  sections: [
    {
      title: "Small enough for the job",
      paragraphs: [
        "Tiny means using capacity carefully. A smaller model is useful when it gives reliable answers with less compute. A larger model makes sense when the extra capacity earns a measurable improvement. We compare accuracy, memory use, and prediction time before choosing.",
        "We count the whole system, including stored data and any models it depends on. A small trainable part doesn't make the rest of the system disappear.",
      ],
    },
    {
      title: "Open source models, usable research",
      paragraphs: [
        "We plan to release open source code and downloadable model weights, with clear licenses and instructions for repeating the experiments. You should be able to run the work and check our claims.",
        "A demo is a good way to try a model, but it can only tell you so much. We compare our ideas with simpler methods, test each design choice, and report the results that didn't go our way.",
        "We'll also explain which inputs a model supports, where it falls short, and how it runs on a CPU. That helps you decide whether it fits your question before you spend time setting it up.",
      ],
    },
  ],
}
export const stoneNote =
  "Our models take their names from stones. It's a small nod to how much structure can fit inside something compact."
export const importantSentences = [
  "A scientific problem often gives us a head start.",
  "We count the whole system, including stored data and any models it depends on.",
  "You should be able to run the work and check our claims.",
]
export const opal = [
  "Opal studies what happens when two biological interventions act together. Its first task is predicting the change in average gene expression for a pair whose individual effects have already been measured in the same biological setting.",
  "It starts by adding those effects, then learns a correction for how they interact. Swapping the inputs leaves the prediction unchanged. We'll compare it with simple addition and models that learn the combined response directly.",
  "Opal is in research. We plan to release the experiments, model weights, and a demo. Predicting responses in other biological settings will need its own evidence.",
]
