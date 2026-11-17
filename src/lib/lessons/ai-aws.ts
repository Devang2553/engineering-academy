import type { Lesson } from "./model";

export const AI_LESSONS: Record<string, Lesson> = {
  "AI-U01": {
    unitId: "AI-U01",
    intro: "Let us take a gentle walk into the world of AI. You do not need a math degree for this. You only need curiosity, and a willingness to let the big picture settle before the details arrive.",
    sections: [
      {
        heading: "AI, machine learning and deep learning",
        body: [
          "Artificial intelligence is the broad field of making machines do tasks that seem to need intelligence. Machine learning sits inside it. Machine learning means systems that learn patterns from data instead of following rules written by hand. Deep learning sits inside machine learning and uses large neural networks with many layers.",
          "Every model has two working phases. Training is when the model's internal numbers, called weights, are adjusted from data. Inference is when the finished model, with its weights held fixed, produces an output for a new input.",
          "A model can only do what its training and its inputs allow. It can sound confident and still be wrong, and this is often called hallucination. Knowing this limit is part of using AI well.",
        ],
      },
      {
        heading: "How a large language model works",
        body: [
          "A large language model is trained mainly to predict the next token in a sequence of text. A token is a small piece of text, which we will explore further in the next unit. Given the words so far, the model produces a probability for each possible next token.",
          "Sampling is how one token is chosen from those probabilities. A setting called temperature controls how adventurous that choice is. Lower temperature favours the most likely tokens, and higher temperature allows more variety.",
          "Training usually happens in two stages. Pre-training learns broad language from a very large body of text. Fine-tuning then adapts the model to narrower behaviour, using a smaller and more focused set of examples.",
        ],
      },
    ],
    takeaways: [
      "AI contains machine learning, which contains deep learning.",
      "Training adjusts weights. Inference uses the fixed weights to produce an answer.",
      "An LLM predicts the next token, and temperature controls how random that choice is.",
    ],
    checks: {
      "AI-T001": [
        {
          prompt: "Which statement correctly nests the three terms?",
          options: ["Deep learning contains AI, which contains machine learning", "AI contains machine learning, which contains deep learning", "Machine learning contains AI and deep learning side by side only", "They are three unrelated fields"],
          answer: 1,
          explanation: "AI is the broadest field. Machine learning is a part of it, and deep learning is a part of machine learning.",
        },
        {
          prompt: "Which phase adjusts a model's weights?",
          options: ["Inference", "Training", "Tokenization", "Prompting"],
          answer: 1,
          explanation: "Training is where the weights change, based on data. During inference the weights stay fixed.",
        },
        {
          prompt: "Which of these is a real limitation of language models?",
          options: ["They always know today's news", "They can produce confident answers that are wrong", "They cannot process any text", "They need no data at all"],
          answer: 1,
          explanation: "A model can sound certain and still be mistaken. Checking important facts is part of working responsibly with AI.",
        },
      ],
      "AI-T002": [
        {
          prompt: "What is an LLM mainly trained to predict?",
          options: ["The next pixel in an image", "The next token in a sequence", "The next file on disk", "The next user who will log in"],
          answer: 1,
          explanation: "Language models learn by predicting the next token, given the tokens that came before.",
        },
        {
          prompt: "What does raising the temperature in sampling generally do?",
          options: ["Makes output more random", "Makes output fully deterministic", "Makes the model train faster", "Makes responses shorter"],
          answer: 0,
          explanation: "Higher temperature spreads the probability across more tokens, so the output becomes more varied.",
        },
        {
          prompt: "When does fine-tuning usually happen?",
          options: ["Before pre-training", "After pre-training, on a narrower set of examples", "During every inference call", "It never happens"],
          answer: 1,
          explanation: "Pre-training gives broad language skill. Fine-tuning comes afterwards and adapts the model to a narrower purpose.",
        },
      ],
    },
  },

  "AI-U02": {
    unitId: "AI-U02",
    intro: "Now we meet the machinery that makes modern AI work. Take your time with this one. The three ideas here, attention, tokens and context windows, will keep appearing in everything else you learn about AI.",
    sections: [
      {
        heading: "Transformers and attention",
        body: [
          "A transformer is the architecture behind most modern language models. Its central mechanism is attention. Attention lets each token in a sequence weigh how much every other token matters to it, so that a word can take its meaning from the words around it.",
          "Transformers come in shapes. Some use an encoder, which reads a whole input at once. Some use a decoder, which generates text one token at a time, from left to right. Most chat-style LLMs you use today are decoder-only models.",
          "Transformers scale well for a practical reason. During training, they can process the tokens of a sequence in parallel, instead of stepping through them one at a time as older recurrent networks did. That parallelism is a big part of why they grew so large.",
        ],
      },
      {
        heading: "Tokens",
        body: [
          "A token is a chunk of text the model works with. A token might be a whole common word, a piece of a longer word, or a punctuation mark. A tokenizer splits text into tokens before the model ever sees it.",
          "A rare or long word is usually split into several smaller tokens. As a rough guide for English, a passage has somewhat more tokens than it has words. This matters because providers count and charge by tokens, and models have limits measured in tokens.",
        ],
      },
      {
        heading: "Context windows",
        body: [
          "The context window is the maximum number of tokens a model can consider in a single request. It holds the input you send and the output the model writes back.",
          "When a conversation grows beyond the window, something must give. Older content is dropped or summarised, so the model no longer sees it. A longer window is useful, but it costs more and can respond more slowly. Putting the right information in the window matters more than filling it.",
        ],
      },
    ],
    takeaways: [
      "Attention lets each token weigh the other tokens in its sequence.",
      "Most chat LLMs are decoder-only and generate one token at a time.",
      "Tokens are the currency of models: they set cost, speed and the context window's limit.",
    ],
    checks: {
      "AI-T003": [
        {
          prompt: "What is the core idea behind attention?",
          options: ["Reading one token at a time with no memory", "Weighing how relevant each other token is", "Compressing images into text", "Sorting the vocabulary alphabetically"],
          answer: 1,
          explanation: "Attention lets every token decide how much each other token in the sequence matters to its meaning.",
        },
        {
          prompt: "Most chat-style LLMs are primarily which kind of transformer?",
          options: ["Encoder-only", "Decoder-only, generating left to right", "Neither kind", "Convolutional networks"],
          answer: 1,
          explanation: "Most chat LLMs are decoder-only. They generate the response one token at a time, from left to right.",
        },
        {
          prompt: "Why do transformers scale well during training?",
          options: ["They process tokens strictly one by one", "They can process the tokens of a sequence in parallel", "They need no training data", "They store everything in a single neuron"],
          answer: 1,
          explanation: "Transformers handle the tokens of a sequence together during training, which makes the work parallel and far more scalable.",
        },
      ],
      "AI-T004": [
        {
          prompt: "What is a token?",
          options: ["Only a complete word", "A chunk of text such as a word piece, word or punctuation", "A single letter", "A pixel in an image"],
          answer: 1,
          explanation: "Tokens are chunks of text. They can be whole words, parts of words or punctuation marks.",
        },
        {
          prompt: "How does token count usually compare with word count for English?",
          options: ["Always exactly equal", "Usually somewhat more tokens than words", "Always fewer tokens than words", "Tokens have no relation to words"],
          answer: 1,
          explanation: "Because tokenizers split longer or rarer words into pieces, English text typically has a bit more tokens than words.",
        },
        {
          prompt: "What happens to a rare, long word when a tokenizer meets it?",
          options: ["It is always one single token", "It is split into several smaller tokens", "It is removed from the text", "It is turned into an image"],
          answer: 1,
          explanation: "A word the tokenizer has not stored whole is broken into several smaller pieces, each of which counts as a token.",
        },
      ],
      "AI-T005": [
        {
          prompt: "What is a model's context window?",
          options: ["Its training dataset size", "The maximum number of tokens it can consider in one request", "The memory of the laptop it runs on", "The number of users it serves"],
          answer: 1,
          explanation: "The context window is the limit on how many tokens, input and output together, fit into a single request.",
        },
        {
          prompt: "What usually happens when a conversation exceeds the context window?",
          options: ["The model grows larger", "Older content is dropped or summarised", "Nothing changes at all", "Tokens become free"],
          answer: 1,
          explanation: "Once the limit is reached, older parts of the conversation no longer fit, so they must be dropped or condensed.",
        },
        {
          prompt: "What is a real trade-off of a very long context window?",
          options: ["It is always better with no drawbacks", "It costs more and can slow responses, so relevance matters", "It makes the model forget its training", "It removes the need for tokens"],
          answer: 1,
          explanation: "Longer inputs cost more and take longer to process. Including only the relevant information usually works better than filling the window.",
        },
      ],
    },
  },

  "AWS-U01": {
    unitId: "AWS-U01",
    intro: "Welcome to the cloud. It can feel like a vast sky at first, but it is built from a few simple shapes. Let us learn those shapes, and you will find your way around with ease.",
    sections: [
      {
        heading: "Cloud fundamentals",
        body: [
          "Cloud computing means renting computing resources over the internet instead of owning the hardware yourself. The service models are often grouped as IaaS, PaaS and SaaS. IaaS gives you virtual machines and networking, and you manage the operating system. PaaS gives you a platform to deploy code on. SaaS is a finished application that you simply use.",
          "Security is shared. The cloud provider looks after the physical facilities and the underlying infrastructure. You are responsible for what you place on it, including your data, your configuration and who has access.",
          "Most cloud services follow pay-as-you-go pricing. You pay for what you actually use, instead of buying capacity up front. For a frontend engineer, this means knowing that a static site or an API call has a cost, and that the cost follows usage.",
        ],
      },
      {
        heading: "Regions, availability zones and edge locations",
        body: [
          "A region is a geographic area, such as a country or a large part of one. Each region contains several availability zones. An availability zone is a separate location with its own power and networking, so that a fault in one does not bring down the others.",
          "Designing across more than one availability zone makes an application more resilient. If one data centre has a problem, the rest can keep serving users.",
          "Edge locations are points of presence spread around the world. Services such as a content delivery network cache content in them, so that people receive files from somewhere closer to them. That reduces latency.",
        ],
      },
    ],
    takeaways: [
      "IaaS, PaaS and SaaS are three levels of how much the provider manages for you.",
      "Security is shared: the provider secures the cloud, and you secure what you put in it.",
      "A region holds several availability zones. Edge locations cache content close to users.",
    ],
    checks: {
      "AWS-T001": [
        {
          prompt: "Which model gives you raw virtual machines that you manage yourself?",
          options: ["SaaS", "IaaS", "Email hosting", "A chat application"],
          answer: 1,
          explanation: "IaaS provides virtual machines and networking. You are responsible for the operating system and what runs on it.",
        },
        {
          prompt: "Under the shared responsibility model, who is responsible for your application's access settings?",
          options: ["The provider entirely", "You", "Nobody", "The user's browser"],
          answer: 1,
          explanation: "The provider secures the infrastructure. Your data, configuration and access policies are your responsibility.",
        },
        {
          prompt: "What does pay-as-you-go mean?",
          options: ["You prepay a fixed yearly fee regardless of use", "You pay for the resources you actually use", "Everything is free forever", "You pay per developer seat only"],
          answer: 1,
          explanation: "Pay-as-you-go charges for the resources you consume, rather than requiring capacity to be bought in advance.",
        },
      ],
      "AWS-T002": [
        {
          prompt: "What is a region?",
          options: ["A single data centre", "A geographic area containing several availability zones", "A content delivery cache", "A type of database"],
          answer: 1,
          explanation: "A region is a geographic area that contains multiple availability zones.",
        },
        {
          prompt: "Why spread an application across more than one availability zone?",
          options: ["To make it slower on purpose", "To stay available if one data centre has a problem", "To lower the price of everything", "To avoid the internet entirely"],
          answer: 1,
          explanation: "Availability zones are separate locations. Using more than one lets the application keep running when one of them fails.",
        },
        {
          prompt: "What are edge locations mainly used for?",
          options: ["Long-term backups", "Caching content closer to users to reduce latency", "Running model training jobs", "Hosting databases"],
          answer: 1,
          explanation: "Edge locations hold cached copies of content near users, so files arrive faster.",
        },
      ],
    },
  },
};
