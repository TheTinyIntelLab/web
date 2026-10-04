export const philosophy = {
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
        "We want people to run our models, inspect the code, and build on the work. Our release goal is open source code and downloadable model weights, with clear licenses and instructions for reproducing the experiments.",
        "That includes the less flattering results. We compare against strong, simple methods and explain where an idea failed. A demo helps people try a model. The experiments explain why they should trust it, and where they shouldn't.",
        "Research should be useful beyond the machine that trained it. We plan to publish supported inputs, known limits, and measured CPU performance, so people can decide whether a model actually fits the question they're asking.",
      ],
    },
    {
      title: "Why the stone names?",
      paragraphs: [
        "Our model families take their names from stones. It's a small nod to how much structure can fit inside something compact. The faceted stone in our logo carries the same idea. Opal is our first family; future names will belong to different scientific questions.",
      ],
    },
  ],
}
export const opal = [
  "Opal studies what happens when two biological interventions act together. Its first task is predicting the change in average gene expression for a pair whose individual effects have already been measured in the same biological setting.",
  "It starts by adding those individual effects, then learns a correction for how they interact. Swapping the two inputs leaves the prediction unchanged. We will test whether this structure helps against strong alternatives, and publish what the experiments show.",
  "Opal is currently in research. Its planned release includes reproducible experiments, downloadable models, and a demo. Claims about new biological settings will need separate evidence.",
]
