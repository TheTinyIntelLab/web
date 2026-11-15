export const thesis = "Small models for science, built around the problem."
export const about = {
  introduction: [
    "The Tiny Intelligence Lab is an independent, one-person research lab building models for scientific problems. We've released Opal v1, our first model. It predicts how cells respond when two biological changes happen together, using measurements of each change on its own.",
    "We're interested in what a model shouldn't have to learn from scratch. If swapping two inputs leaves the answer unchanged, the model should respect that. If a simple calculation explains part of the result, we can start there and learn what's left. We test whether building this knowledge into a model helps it learn better.",
  ],
  sections: [
    {
      title: "Small enough for the job",
      paragraphs: [
        "Small models are useful when they make the work easier to run. We compare accuracy with memory use and prediction time, and use larger models when the improvement is worth the extra compute.",
        "That comparison includes any stored data or other models needed to make a prediction. Calling one part small tells you little about what you'll need to run it.",
      ],
    },
    {
      title: "Research you can check",
      paragraphs: [
        "We plan to release open source code and trained models, with clear licenses and instructions for repeating the experiments. You should be able to check our claims yourself, including whether our design choices improve on simpler methods.",
        "We'll publish results that don't work out, too. For each model, we'll describe the inputs it needs, the cases it struggles with, and what it takes to run on a CPU. A demo can help you try it, but the experiments need to show whether it works.",
      ],
    },
  ],
}
export const stoneNote = "We name our models after stones."
export const importantSentences = [
  "We're interested in what a model shouldn't have to learn from scratch.",
  "That comparison includes any stored data or other models needed to make a prediction.",
  "You should be able to check our claims yourself, including whether our design choices improve on simpler methods.",
]
export const opal = [
  "Opal v1 is complete and released. It predicts average gene activity when two changes are made to a cell together, using measurements of each change on its own, taken in the same biological setting.",
  "The model adds the two individual effects, then learns a correction for how they interact. Swapping the inputs gives the same prediction.",
  "Results in one biological setting don't establish how Opal performs in other cell types or conditions; those need their own tests.",
]
