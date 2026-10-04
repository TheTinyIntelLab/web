export const thesis = "Small models for science, built around the problem."
export const about = {
  introduction: [
    "The Tiny Intelligence Lab is an independent, one-person research lab. We build models to answer questions in science. We ask whether understanding a problem can help a model learn it better. Our first project, Opal, studies what happens when two changes are made to a cell at once.",
    "A scientific problem often gives us a head start. Sometimes we know that swapping two inputs should give the same answer. Sometimes a simple calculation already gets us part of the way. We build those facts into a model and test whether they actually help.",
  ],
  sections: [
    {
      title: "Small enough for the job",
      paragraphs: [
        "Tiny means using what the problem needs. We choose a smaller model when it gives good answers with less compute. A bigger model earns its place when it works better. We check accuracy, memory use, and how long each prediction takes.",
        "We count the whole system. That includes stored data and other models it uses. A small part doesn't make the whole model small.",
      ],
    },
    {
      title: "Open source models, usable research",
      paragraphs: [
        "We plan to release open source code and trained models. Each release will have a clear license and steps to repeat the experiments. You should be able to run the work and check our claims.",
        "A demo lets you try a model, but it doesn't prove that the model works well. We compare it with simpler methods. We test our design choices and share the results, including the ones that disappoint us.",
        "We'll explain what each model can take as input, where it struggles, and how it runs on a CPU. You can then decide whether it's useful for your work.",
      ],
    },
  ],
}
export const stoneNote =
  "Our models are named after stones. Small things can have a lot of structure."
export const importantSentences = [
  "A scientific problem often gives us a head start.",
  "We count the whole system.",
  "You should be able to run the work and check our claims.",
]
export const opal = [
  "Opal studies how a cell responds to two changes at once. It predicts average gene activity for a pair of changes, using measurements of each change on its own. Those measurements must come from the same biological setting.",
  "It starts by adding the two effects. Then it learns a correction for how they work together. Swapping the inputs gives the same prediction. We'll test it against simple addition and models that predict the combined effect directly.",
  "Opal is in research. We plan to share the experiments, trained models, and a demo. Other cell types and settings will need separate tests.",
]
