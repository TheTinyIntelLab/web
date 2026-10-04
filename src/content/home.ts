export const philosophy = {
  introduction: [
    "The Tiny Intelligence Lab is an independent, one-person research lab. We study a simple question: how much can a model learn when we give it the structure of a problem? Our work starts with scientific questions that have something useful to teach us about intelligence.",
    "Nature gives us patterns. Two interventions may act together. A prediction may need to stay the same when we swap its inputs. We build those facts into our models, then ask whether they actually help. The answer has to come from experiments.",
  ],
  sections: [
    {
      title: "Small is a question, too",
      paragraphs: [
        "Tiny is an ambition for efficiency. A small model is useful when it does the job well. A bigger one earns its place when it gives us a reliable improvement. We measure accuracy alongside memory and the time a prediction takes. Size alone tells us very little.",
        "And we count the whole system, including stored data and anything it borrows from another model. Efficiency should survive a closer look.",
      ],
    },
    {
      title: "Let the experiments disagree",
      paragraphs: [
        "An idea can sound right and still fail. We compare our models with strong, simpler methods and test each design choice separately. We keep test data out of training. When results are weak or mixed, we say so. That changes what we try next. We save data splits and settings so another researcher can check whether a result holds up beyond a single run.",
      ],
    },
    {
      title: "Research you can run",
      paragraphs: [
        "We plan to share the code, trained models, and experiments behind our results. Someone else should be able to run the work and check our claims. A good demo is a useful invitation, but the evidence needs to stand on its own.",
        "Our models take their names from stones. The faceted stone in our logo carries that idea: a small object whose structure gives it character. Opal is the first. Each new name will belong to a distinct scientific question.",
      ],
    },
  ],
}
export const opal = [
  "Opal studies what happens when two biological interventions act together. Its first task is predicting the change in average gene expression for a pair whose individual effects have already been measured in the same biological setting.",
  "It starts by adding those individual effects, then learns a correction for how they interact. Swapping the two inputs leaves the prediction unchanged. We will test whether this structure helps against strong alternatives, and publish what the experiments show.",
  "Opal v1 is in research. Its planned release includes reproducible experiments, downloadable models, and a demo. Claims about new biological settings will need separate evidence.",
]
