export interface StoryPage {
  id: string;
  title: string;
  content: string;
  voiceText: string;
  imagePrompt: string;
  practiceText?: string;
}

export interface ComedyStory {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium';
  estimatedTime: number;
  theme: string;
  pages: StoryPage[];
}

export const comedyStories: ComedyStory[] = [
  {
    id: 'silly-chef-max',
    title: 'Silly Chef Max and the Dancing Vegetables',
    description: 'Chef Max tries to cook dinner but the vegetables have other plans!',
    difficulty: 'easy',
    estimatedTime: 8,
    theme: 'cooking',
    pages: [
      {
        id: 'page-1',
        title: 'Meet Chef Max',
        content: 'Chef Max put on his big white hat and stepped into his colorful kitchen. "Today I will make the most delicious soup!" he announced proudly. But as soon as he said this, something very strange happened...',
        voiceText: 'Chef Max put on his big white hat and stepped into his colorful kitchen. Today I will make the most delicious soup, he announced proudly.',
        imagePrompt: 'A happy chef with a big white hat in a bright colorful kitchen, cartoon style, child-friendly',
        practiceText: 'Chef Max put on his big white hat and stepped into his colorful kitchen. "Today I will make the most delicious soup!" he announced proudly. But as soon as he said this, something very strange happened...'
      },
      {
        id: 'page-2',
        title: 'The Dancing Carrots',
        content: 'The carrots in his basket started wiggling! Then they jumped out and began dancing around the kitchen floor. "Wait, wait!" called Chef Max. "I need you for my soup!" But the carrots just giggled and kept dancing.',
        voiceText: 'The carrots in his basket started wiggling! Then they jumped out and began dancing around the kitchen floor.',
        imagePrompt: 'Orange carrots with cute faces dancing around a kitchen floor, cartoon style, very cute and funny',
        practiceText: 'The carrots in his basket started wiggling! Then they jumped out and began dancing around the kitchen floor. "Wait, wait!" called Chef Max. "I need you for my soup!" But the carrots just giggled and kept dancing.'
      },
      {
        id: 'page-3',
        title: 'The Singing Onions',
        content: 'Next, the onions started singing a silly song! "♪ We don\'t want to make you cry, we just want to reach the sky! ♪" they sang as they rolled around. Chef Max scratched his head. This had never happened before!',
        voiceText: 'Next, the onions started singing a silly song! We don\'t want to make you cry, we just want to reach the sky, they sang as they rolled around.',
        imagePrompt: 'Round onions with happy faces singing and rolling around a kitchen, musical notes floating in air, cartoon style',
        practiceText: 'Next, the onions started singing a silly song! "♪ We don\'t want to make you cry, we just want to reach the sky! ♪" they sang as they rolled around. Chef Max scratched his head. This had never happened before!'
      },
      {
        id: 'page-4',
        title: 'The Bouncing Potatoes',
        content: 'Then the potatoes started bouncing like basketballs! Boing, boing, boing! They bounced off the walls, off the ceiling, and even off Chef Max\'s hat! "This is getting very silly!" he laughed.',
        voiceText: 'Then the potatoes started bouncing like basketballs! Boing, boing, boing! They bounced off the walls, off the ceiling, and even off Chef Max\'s hat!',
        imagePrompt: 'Brown potatoes bouncing like basketballs in a kitchen, bouncing off walls and ceiling, cartoon style, very fun',
        practiceText: 'Then the potatoes started bouncing like basketballs! Boing, boing, boing! They bounced off the walls, off the ceiling, and even off Chef Max\'s hat! "This is getting very silly!" he laughed.'
      },
      {
        id: 'page-5',
        title: 'The Great Idea',
        content: 'Chef Max had a wonderful idea! "If you all want to play instead of becoming soup, how about we have a vegetable dance party instead?" All the vegetables cheered! "Hooray!" they shouted together.',
        voiceText: 'Chef Max had a wonderful idea! If you all want to play instead of becoming soup, how about we have a vegetable dance party instead?',
        imagePrompt: 'Chef Max smiling with his arms spread wide, surrounded by happy dancing vegetables in a kitchen, party atmosphere',
        practiceText: 'Chef Max had a wonderful idea! "If you all want to play instead of becoming soup, how about we have a vegetable dance party instead?" All the vegetables cheered! "Hooray!" they shouted together.'
      },
      {
        id: 'page-6',
        title: 'The Best Party Ever',
        content: 'So Chef Max turned on music and joined the vegetables in the silliest dance party ever! The carrots did the twist, the onions did the wiggle, and the potatoes did the bounce. They all had so much fun that they forgot all about making soup!',
        voiceText: 'So Chef Max turned on music and joined the vegetables in the silliest dance party ever! The carrots did the twist, the onions did the wiggle, and the potatoes did the bounce.',
        imagePrompt: 'A big dance party in kitchen with chef and all vegetables dancing together, music notes, very happy and colorful',
        practiceText: 'So Chef Max turned on music and joined the vegetables in the silliest dance party ever! The carrots did the twist, the onions did the wiggle, and the potatoes did the bounce. They all had so much fun that they forgot all about making soup!'
      }
    ]
  },
  {
    id: 'cricket-chaos',
    title: 'Tommy\'s Cricket Chaos',
    description: 'Tommy tries to play cricket but everything goes hilariously wrong!',
    difficulty: 'easy',
    estimatedTime: 7,
    theme: 'sports',
    pages: [
      {
        id: 'page-1',
        title: 'Ready to Play',
        content: 'Tommy grabbed his cricket bat and ran to the playground. "Today I\'m going to hit the ball so far!" he said excitedly. His friends were already there, setting up the wickets and getting ready for a fun game.',
        voiceText: 'Tommy grabbed his cricket bat and ran to the playground. Today I\'m going to hit the ball so far, he said excitedly.',
        imagePrompt: 'A happy boy with a cricket bat running to a playground with cricket wickets, sunny day, cartoon style',
        practiceText: 'Tommy grabbed his cricket bat and ran to the playground. "Today I\'m going to hit the ball so far!" he said excitedly. His friends were already there, setting up the wickets and getting ready for a fun game.'
      },
      {
        id: 'page-2',
        title: 'The Flying Hat',
        content: 'Tommy swung his bat with all his might! But instead of hitting the ball, he hit his own hat! WHOOSH! His hat flew high into the air and landed right on top of the wickets. Everyone started giggling.',
        voiceText: 'Tommy swung his bat with all his might! But instead of hitting the ball, he hit his own hat! Whoosh! His hat flew high into the air.',
        imagePrompt: 'A cricket hat flying through the air above a cricket field, children giggling in background, cartoon style',
        practiceText: 'Tommy swung his bat with all his might! But instead of hitting the ball, he hit his own hat! WHOOSH! His hat flew high into the air and landed right on top of the wickets. Everyone started giggling.'
      },
      {
        id: 'page-3',
        title: 'The Runaway Ball',
        content: 'When Tommy tried again, he missed the ball completely! The ball kept rolling and rolling. It rolled past the boundary, past the swings, and right into the sandbox where it got buried in the sand!',
        voiceText: 'When Tommy tried again, he missed the ball completely! The ball kept rolling and rolling. It rolled past the boundary, past the swings, and right into the sandbox.',
        imagePrompt: 'A cricket ball rolling across playground past swings into a sandbox, children chasing after it, cartoon style',
        practiceText: 'When Tommy tried again, he missed the ball completely! The ball kept rolling and rolling. It rolled past the boundary, past the swings, and right into the sandbox where it got buried in the sand!'
      },
      {
        id: 'page-4',
        title: 'The Backwards Run',
        content: 'Finally, Tommy hit the ball! But he was so excited that he ran the wrong way! Instead of running to the other wicket, he ran backwards! His teammates were laughing so hard they could barely stand up.',
        voiceText: 'Finally, Tommy hit the ball! But he was so excited that he ran the wrong way! Instead of running to the other wicket, he ran backwards!',
        imagePrompt: 'A boy running backwards on cricket field while other children laugh and point, very funny scene, cartoon style',
        practiceText: 'Finally, Tommy hit the ball! But he was so excited that he ran the wrong way! Instead of running to the other wicket, he ran backwards! His teammates were laughing so hard they could barely stand up.'
      },
      {
        id: 'page-5',
        title: 'The Helpful Dog',
        content: 'Suddenly, a friendly dog ran onto the field! The dog picked up the ball in its mouth and started running around in circles. "Come back!" everyone shouted, but the dog thought it was all a fun game of fetch!',
        voiceText: 'Suddenly, a friendly dog ran onto the field! The dog picked up the ball in its mouth and started running around in circles.',
        imagePrompt: 'A happy dog running in circles on cricket field holding cricket ball in mouth, children chasing the dog, cartoon style',
        practiceText: 'Suddenly, a friendly dog ran onto the field! The dog picked up the ball in its mouth and started running around in circles. "Come back!" everyone shouted, but the dog thought it was all a fun game of fetch!'
      },
      {
        id: 'page-6',
        title: 'The Best Game Ever',
        content: 'In the end, everyone was laughing so much that they decided this was the best cricket game ever! Tommy learned that sometimes the funniest games are the ones where everything goes wrong. They all agreed to play "silly cricket" every week!',
        voiceText: 'In the end, everyone was laughing so much that they decided this was the best cricket game ever! Tommy learned that sometimes the funniest games are the ones where everything goes wrong.',
        imagePrompt: 'All children sitting on cricket field laughing together with dog, everyone very happy, sunny playground, cartoon style',
        practiceText: 'In the end, everyone was laughing so much that they decided this was the best cricket game ever! Tommy learned that sometimes the funniest games are the ones where everything goes wrong. They all agreed to play "silly cricket" every week!'
      }
    ]
  },
  {
    id: 'magic-homework',
    title: 'Emma\'s Magic Homework Helper',
    description: 'Emma finds a magic pencil that does her homework, but it has its own silly ideas!',
    difficulty: 'medium',
    estimatedTime: 9,
    theme: 'school',
    pages: [
      {
        id: 'page-1',
        title: 'The Magic Pencil',
        content: 'Emma found a sparkly golden pencil under her desk at school. "This looks special!" she thought. When she got home and started her math homework, something amazing happened - the pencil started moving by itself!',
        voiceText: 'Emma found a sparkly golden pencil under her desk at school. This looks special, she thought. When she got home and started her math homework, something amazing happened.',
        imagePrompt: 'A young girl at school desk looking at a sparkly golden magic pencil, classroom setting, cartoon style',
        practiceText: 'This looks special!'
      },
      {
        id: 'page-2',
        title: 'Silly Math Answers',
        content: 'The magic pencil started writing answers, but they were very silly! For "2 + 2 = ?", it wrote "2 + 2 = a rainbow!" For "5 - 3 = ?", it wrote "5 - 3 = tickles!" Emma giggled. "That\'s not right, magic pencil!"',
        voiceText: 'The magic pencil started writing answers, but they were very silly! For two plus two equals, it wrote two plus two equals a rainbow!',
        imagePrompt: 'Math homework with silly answers written in golden sparkly text, rainbow and funny drawings on paper, cartoon style',
        practiceText: 'That\'s not right, magic pencil!'
      },
      {
        id: 'page-3',
        title: 'Creative Writing Gone Wild',
        content: 'For her story about "My Pet," the pencil wrote: "My pet is a purple elephant who loves to eat bubble gum and can fly backwards while juggling marshmallows!" Emma laughed. "My teacher will think I\'m very imaginative!"',
        voiceText: 'For her story about My Pet, the pencil wrote: My pet is a purple elephant who loves to eat bubble gum and can fly backwards while juggling marshmallows!',
        imagePrompt: 'A purple cartoon elephant flying backwards while juggling marshmallows, very silly and colorful, child-friendly',
        practiceText: 'My teacher will think I\'m very imaginative!'
      },
      {
        id: 'page-4',
        title: 'Drawing Disasters',
        content: 'When Emma tried to draw a house for art class, the magic pencil drew a house with legs that was dancing! It added a smiling sun wearing sunglasses and clouds shaped like ice cream cones. "This is not what I planned!" Emma giggled.',
        voiceText: 'When Emma tried to draw a house for art class, the magic pencil drew a house with legs that was dancing! It added a smiling sun wearing sunglasses and clouds shaped like ice cream cones.',
        imagePrompt: 'A house with legs dancing, sun wearing sunglasses, ice cream cone shaped clouds, very silly children\'s drawing, cartoon style',
        practiceText: 'This is not what I planned!'
      },
      {
        id: 'page-5',
        title: 'The Pencil\'s Secret',
        content: 'Emma asked the pencil, "Why do you write such silly things?" The pencil wrote back: "Because learning should be fun! I make mistakes on purpose so you can learn the right way while laughing!" Emma thought that was pretty smart.',
        voiceText: 'Emma asked the pencil, Why do you write such silly things? The pencil wrote back: Because learning should be fun! I make mistakes on purpose so you can learn the right way while laughing!',
        imagePrompt: 'Magic golden pencil writing on paper with sparkles around it, child watching with understanding expression, cartoon style',
        practiceText: 'Because learning should be fun!'
      },
      {
        id: 'page-6',
        title: 'The Perfect Partnership',
        content: 'From that day on, Emma and her magic pencil became the perfect team! The pencil would write silly answers first to make Emma laugh, then together they would figure out the real answers. Emma\'s homework became the most fun part of her day!',
        voiceText: 'From that day on, Emma and her magic pencil became the perfect team! The pencil would write silly answers first to make Emma laugh, then together they would figure out the real answers.',
        imagePrompt: 'Happy girl doing homework with magic pencil, both smiling, homework papers with correct answers, warm lighting, cartoon style',
        practiceText: 'Emma\'s homework became the most fun part of her day!'
      }
    ]
  },
  {
    id: 'zoo-adventure',
    title: 'The Day Animals Switched Jobs',
    description: 'At Sunny Zoo, all the animals decide to try each other\'s jobs for a day!',
    difficulty: 'medium',
    estimatedTime: 10,
    theme: 'animals',
    pages: [
      {
        id: 'page-1',
        title: 'A Crazy Idea',
        content: 'At Sunny Zoo, the animals were feeling bored. "I wish I could try something new!" said Leo the Lion. "Me too!" agreed Ellie the Elephant. Then Momo the Monkey had a crazy idea: "Let\'s all switch jobs for one day!"',
        voiceText: 'At Sunny Zoo, the animals were feeling bored. I wish I could try something new, said Leo the Lion. Me too, agreed Ellie the Elephant.',
        imagePrompt: 'A lion, elephant, and monkey talking together in a colorful zoo setting, cartoon style, very friendly animals',
        practiceText: 'Let\'s all switch jobs for one day!'
      },
      {
        id: 'page-2',
        title: 'The Monkey Zookeeper',
        content: 'Momo the Monkey put on the zookeeper\'s hat and tried to feed the lions. But instead of giving them meat, he gave them bananas! "This is what I like to eat!" he said. The lions looked very confused and a little grumpy.',
        voiceText: 'Momo the Monkey put on the zookeeper\'s hat and tried to feed the lions. But instead of giving them meat, he gave them bananas!',
        imagePrompt: 'A monkey wearing zookeeper hat offering bananas to confused lions in zoo enclosure, cartoon style, very funny',
        practiceText: 'This is what I like to eat!'
      },
      {
        id: 'page-3',
        title: 'The Elephant Tour Guide',
        content: 'Ellie the Elephant became the tour guide! But she was so big that she accidentally picked up the visitors with her trunk instead of pointing at things! "Welcome to the zoo!" she trumpeted, while holding three giggling children in the air.',
        voiceText: 'Ellie the Elephant became the tour guide! But she was so big that she accidentally picked up the visitors with her trunk instead of pointing at things!',
        imagePrompt: 'A big friendly elephant holding laughing children with her trunk, zoo visitors giggling, cartoon style, very cute',
        practiceText: 'Welcome to the zoo!'
      },
      {
        id: 'page-4',
        title: 'The Lion Gardener',
        content: 'Leo the Lion tried to be the gardener. He wanted to water the flowers, but his big roar was so loud that it blew all the flower petals away! "ROOOAR!" he said, trying to be gentle, but the flowers just scattered everywhere.',
        voiceText: 'Leo the Lion tried to be the gardener. He wanted to water the flowers, but his big roar was so loud that it blew all the flower petals away!',
        imagePrompt: 'A lion trying to garden with flower petals flying everywhere from his roar, scattered colorful petals, cartoon style, funny scene',
        practiceText: 'ROOOAR!'
      },
      {
        id: 'page-5',
        title: 'The Penguin Ice Cream Vendor',
        content: 'Penny the Penguin tried to sell ice cream, but she kept eating it all herself! "It\'s so cold and delicious!" she said with her beak full of ice cream. The children in line started laughing at her chocolate-covered face.',
        voiceText: 'Penny the Penguin tried to sell ice cream, but she kept eating it all herself! It\'s so cold and delicious, she said with her beak full of ice cream.',
        imagePrompt: 'A cute penguin with chocolate ice cream all over her face behind ice cream cart, children laughing, cartoon style',
        practiceText: 'It\'s so cold and delicious!'
      },
      {
        id: 'page-6',
        title: 'Back to Normal',
        content: 'By the end of the day, all the animals realized they were much better at their own jobs! The real zookeeper came back and found everything in happy chaos. "What happened here?" he laughed. "We learned that being ourselves is the best!" said all the animals together.',
        voiceText: 'By the end of the day, all the animals realized they were much better at their own jobs! The real zookeeper came back and found everything in happy chaos.',
        imagePrompt: 'All zoo animals and zookeeper laughing together in zoo, everyone happy and content, sunset lighting, cartoon style',
        practiceText: 'We learned that being ourselves is the best!'
      }
    ]
  }
];