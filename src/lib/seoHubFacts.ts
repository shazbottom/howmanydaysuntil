export interface SeoHubFactSection {
  title: string;
  intro: string;
  facts: string[];
}

export interface SeoHubFactSet {
  slug: string;
  sections: SeoHubFactSection[];
}

const factsBySlug: Record<string, SeoHubFactSet> = {
  christmas: {
    slug: "christmas",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Christmas has a longer and stranger history than most people expect.",
        facts: [
          "Christmas celebrations were banned by the English Parliament in 1644 and stayed prohibited until 1660.",
          "The Christmas Truce of 1914 saw British and German soldiers briefly stop fighting, exchange gifts, and sing carols across the Western Front.",
          "Christmas was not declared a federal holiday in the United States until June 26, 1870.",
        ],
      },
      {
        title: "Records and stats",
        intro: "The numbers around Christmas are just as big as the traditions.",
        facts: [
          "The tallest cut Christmas tree on record was a 67.36 metre Douglas fir displayed in Seattle in 1950.",
          "\"Jingle Bells\" was originally written for Thanksgiving, not Christmas, and later became the first song played in space.",
          "One of history's most famous Christmas gifts was the Statue of Liberty, formally gifted from France to the United States on Christmas Day in 1884.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Christmas looks very different depending on where you celebrate it.",
        facts: [
          "In Japan, a hugely successful 1970s KFC campaign turned fried chicken into a Christmas tradition for many families.",
          "In Ukraine, spider-web decorations are considered lucky because of a folk tale about a Christmas spider turning webs into silver and gold.",
          "In many traditions, the 12 Days of Christmas start on December 25 and continue through January 5 rather than ending on Christmas Day itself.",
        ],
      },
    ],
  },
  "christmas-eve": {
    slug: "christmas-eve",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Christmas Eve often carries as much tradition as Christmas Day itself.",
        facts: [
          "In many European traditions, Christmas Eve rather than Christmas morning is the main gift-giving moment.",
          "Midnight Mass became one of the best-known Christmas Eve observances because it symbolically welcomes Christmas Day at the first possible moment.",
          "For centuries, Christmas Eve was treated as a vigil night, blending religious observance, fasting customs, and household preparation.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Christmas Eve is one of the busiest nights of the year in its own right.",
        facts: [
          "Airports, roads, and rail networks typically hit one of their annual peaks on Christmas Eve as families complete last-minute travel.",
          "Christmas Eve is one of the highest-volume nights of the year for restaurant takeout, supermarket shopping, and gift-card redemptions.",
          "For many retailers, the final hours before Christmas Eve closing are among the busiest physical shopping periods of the whole year.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Christmas Eve traditions change dramatically from country to country.",
        facts: [
          "In parts of Europe, Christmas Eve dinner is the centerpiece of the holiday and can be more important than Christmas lunch.",
          "Many households reserve one small present, a movie, or matching pajamas specifically for Christmas Eve rather than Christmas Day.",
          "Even where Christmas Day is the main event, Christmas Eve often feels like the real emotional start of the celebration.",
        ],
      },
    ],
  },
  halloween: {
    slug: "halloween",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Halloween has older roots than costumes and candy.",
        facts: [
          "Before pumpkins became the norm, people in Ireland and Scotland carved turnips, potatoes, and beets to ward off wandering spirits.",
          "The word Halloween is a contraction of \"All Hallows' Eve,\" the night before All Saints' Day.",
          "Halloween traditions absorbed elements of Samhain, the ancient Celtic fire festival that marked the end of harvest season.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Modern Halloween is also an enormous commercial event.",
        facts: [
          "The heaviest pumpkin ever recorded weighed 2,749 pounds and was grown in Minnesota in 2023.",
          "Halloween spending in the United States alone now exceeds 12 billion dollars a year on costumes, candy, and decorations.",
          "Candy sales surge so sharply around Halloween that it remains one of the biggest seasonal retail spikes of the year.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Some of the strangest Halloween customs are the quiet ones.",
        facts: [
          "Some animal shelters used to pause black-cat adoptions during October because of fears the cats would be used in pranks or rituals.",
          "A traditional \"dumb supper\" involved eating in total silence and leaving a place at the table for deceased relatives.",
          "In several places, Halloween still blends mischief, superstition, and harvest customs rather than being only a costume holiday.",
        ],
      },
    ],
  },
  "new-year": {
    slug: "new-year",
    sections: [
      {
        title: "Historical curiosities",
        intro: "New Year traditions changed dramatically over time.",
        facts: [
          "In England and its colonies, the legal New Year once began on March 25 rather than January 1.",
          "Babylonians were making New Year's resolutions around 4,000 years ago, often promising to return borrowed farm equipment.",
          "Calendar reforms in 1752 shifted the British world onto the Gregorian calendar and helped cement January 1 as New Year.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Few annual events pull a larger global audience.",
        facts: [
          "Roughly one billion people worldwide are estimated to watch the Times Square ball drop each year.",
          "The ball drop tradition began in 1907, and the first ball was made of wood and iron.",
          "Manila set a fireworks record in 2016 by launching more than 810,000 fireworks over the course of an hour.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "The first minutes of the year are full of unusual luck rituals.",
        facts: [
          "In Scotland, the \"first foot\" after midnight is ideally a dark-haired visitor carrying gifts like coal, whisky, or shortbread.",
          "In Ecuador, people burn effigies of public figures or fictional characters to symbolically leave bad luck in the old year.",
          "Across the world, New Year customs often revolve around luck, renewal, noise, and food rather than the countdown itself.",
        ],
      },
    ],
  },
  "valentines-day": {
    slug: "valentines-day",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Valentine's Day picked up layers of myth, religion, and romance over centuries.",
        facts: [
          "The festival of Lupercalia is often cited as one of Valentine's Day's ancient predecessors, despite being far wilder than the modern holiday.",
          "The oldest known Valentine's poem was written in 1415 by Charles, Duke of Orleans, while imprisoned in the Tower of London.",
          "Valentine's customs moved from courtly romance into mass culture long before greeting cards industrialized the holiday.",
        ],
      },
      {
        title: "Records and stats",
        intro: "It is one of the biggest gifting days on the calendar.",
        facts: [
          "Valentine's Day is second only to Christmas for card sending, with around 145 million cards exchanged each year.",
          "A UK chocolate company created a record box of chocolates weighing more than 2,500 kilograms in 2023.",
          "Flowers, cards, dining, and jewelry all spike sharply in the lead-up to February 14.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Not every Valentine's custom is sweet.",
        facts: [
          "In South Korea, people who miss both Valentine's Day and White Day can mark Black Day on April 14 with black bean noodles.",
          "Victorians sometimes sent anonymous \"Vinegar Valentines\" to insult annoying neighbors or unwanted suitors.",
          "Around the world, Valentine's Day can be romantic, ironic, commercial, or deliberately anti-romantic depending on the local custom.",
        ],
      },
    ],
  },
  thanksgiving: {
    slug: "thanksgiving",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Thanksgiving took persistent lobbying to become a national fixture.",
        facts: [
          "Sarah Josepha Hale spent 36 years writing to presidents before Thanksgiving became a national holiday.",
          "The inventor of the TV dinner was solving a Thanksgiving surplus problem when Swanson ended up with tons of leftover turkey in 1953.",
          "\"Mary Had a Little Lamb\" and Thanksgiving's long national campaign are linked through the same determined writer, Sarah Josepha Hale.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Thanksgiving is one of the biggest single-day food events of the year.",
        facts: [
          "Americans are estimated to eat around 46 million turkeys on Thanksgiving Day each year.",
          "The Macy's Thanksgiving Day Parade features more than 8,000 participants and attracts millions of in-person spectators.",
          "Thanksgiving travel routinely creates one of the busiest transport periods of the entire year in the United States.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "The side traditions are almost as important as the meal.",
        facts: [
          "Turkey Trot fun runs are now a Thanksgiving-morning ritual in many cities before the big meal begins.",
          "Breaking the turkey wishbone for luck traces back to ancient Mediterranean beliefs about birds and prophecy.",
          "For many households, Thanksgiving marks the emotional handover from autumn into the Christmas season.",
        ],
      },
    ],
  },
  easter: {
    slug: "easter",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Easter is shaped by both ancient tradition and complex calendar rules.",
        facts: [
          "The Council of Nicaea in 325 AD established the rule that Easter falls on the first Sunday after the first full moon following the spring equinox.",
          "The name Easter is often linked to Eostre, a Germanic spring goddess, though the exact linguistic history is still debated.",
          "Because Easter is date-driven by lunar and solar cycles, it moves around the calendar far more than fixed annual holidays.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Easter has generated some giant traditions.",
        facts: [
          "The tallest chocolate Easter egg ever made stood 10.39 metres tall in Italy in 2011.",
          "The White House Easter Egg Roll has been a public tradition since 1878.",
          "Chocolate eggs remain one of the biggest Easter retail traditions in many countries.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Easter customs vary more wildly than many people realize.",
        facts: [
          "In Sweden and Finland, children dress as Easter witches and trade drawings for sweets in a ritual that feels a little like Halloween.",
          "In parts of Finland, huge bonfires are lit on Holy Saturday to scare away witches and evil spirits.",
          "Easter blends religious observance, spring symbolism, chocolate, family gatherings, and regional folklore in unusually different ways from country to country.",
        ],
      },
    ],
  },
  "black-friday": {
    slug: "black-friday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Black Friday became a shopping event surprisingly recently.",
        facts: [
          "The term Black Friday was once associated with heavy traffic and congestion rather than retail excitement.",
          "The shopping day only became a dominant consumer ritual after Thanksgiving travel, advertising, and store promotions converged in the late 20th century.",
          "Black Friday's importance rose further once big-box retailers and online stores turned it into a multi-day sales window.",
        ],
      },
      {
        title: "Records and stats",
        intro: "It is now one of the largest retail moments on the calendar.",
        facts: [
          "Black Friday and Cyber Monday routinely generate billions of dollars in online sales in the United States alone.",
          "Many retailers now launch Black Friday promotions before Thanksgiving itself, stretching the event into a week-long traffic surge.",
          "Search demand for Black Friday often ramps up weeks before the day arrives as shoppers build lists and compare prices.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Black Friday changed from a store event into a seasonal ritual.",
        facts: [
          "For many shoppers, Black Friday signals the practical start of Christmas gift buying more than Thanksgiving does.",
          "Some households treat Black Friday browsing as a post-Thanksgiving tradition even when they buy nothing at all.",
          "Online countdowns and deal trackers matter because shoppers increasingly plan the day before the sales actually go live.",
        ],
      },
    ],
  },
  summer: {
    slug: "summer",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Summer has picked up mythology and folklore for thousands of years.",
        facts: [
          "The phrase \"Dog Days of Summer\" comes from the ancient belief that Sirius, the Dog Star, added its heat to the sun.",
          "At Stonehenge, thousands still gather for the summer solstice sunrise in a ritual that links modern crowds to ancient seasonal observance.",
          "The idea of a summer vacation grew in the 19th century when wealthy urban families left cities for cooler country estates.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Summer is packed with weather, travel, and daylight extremes.",
        facts: [
          "Death Valley holds the highest reliably recorded air temperature on Earth at 56.7°C, set in 1913.",
          "The Eiffel Tower can grow by up to 15 centimetres in hot weather because its iron expands in the summer heat.",
          "In places like Svalbard and northern Alaska, the midnight sun means the sun can stay visible for weeks or even months.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Summer habits vary wildly depending on where you live.",
        facts: [
          "In Australia, summer overlaps with Christmas, which helps drive a huge annual spike in seafood and outdoor celebrations.",
          "In Sweden, Midsummer can rival Christmas as a cultural event, with maypoles, herring, and all-night celebrations.",
          "For many Melbourne locals, summer means outdoor cinemas, late sunsets, and hoping a cool change arrives before bedtime.",
        ],
      },
    ],
  },
  autumn: {
    slug: "autumn",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Autumn is deeply tied to harvest and seasonal change.",
        facts: [
          "The Harvest Moon was historically important because its bright light let farmers work later into the evening during harvest time.",
          "Trees do not create red and orange pigments in autumn; those colors were already there and only become visible as chlorophyll breaks down.",
          "The word \"fall\" was once common in England too, before \"autumn\" became the more formal standard there.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Autumn also powers major tourism and consumer cycles.",
        facts: [
          "New England's autumn leaf season generates billions of dollars in tourism revenue.",
          "Vermont alone can receive well over 10 million visitors during autumn foliage season, far more than its resident population.",
          "Research suggests people often eat more as days shorten and colder weather approaches.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Autumn arrives with strong rituals, foods, and sports.",
        facts: [
          "Apple bobbing began as a British courting ritual long before it became a Halloween party game.",
          "In Melbourne, autumn also means the city slides into AFL mode as team colors take over and crowds return to the MCG.",
          "Across the Northern Hemisphere, autumn now carries huge seasonal branding around pumpkins, spice flavors, and harvest festivals.",
        ],
      },
    ],
  },
  winter: {
    slug: "winter",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Winter has shaped history in dramatic ways.",
        facts: [
          "The eruption of Mount Tambora caused the \"Year Without a Summer\" in 1816, bringing global cold and crop failures.",
          "The River Thames once froze so solidly that London held Frost Fairs complete with shops and entertainment on the ice.",
          "Ancient Roman Saturnalia flipped social rules during winter, letting gambling and role reversals flourish for a few days.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Winter is the season of temperature extremes.",
        facts: [
          "The coldest temperature recorded on Earth's surface was -89.2°C at Vostok Station in Antarctica in 1983.",
          "Aomori in Japan is widely considered the snowiest major city on Earth, receiving around 8 metres of snow a year.",
          "The largest snowflake ever reported was said to be 15 inches wide and fell in Montana in 1887.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Winter traditions are often about endurance as much as celebration.",
        facts: [
          "Many Australians now celebrate a second \"Christmas in July\" just to enjoy the idea of a cold-weather festive meal.",
          "In Tasmania, winter solstice celebrations can include sunrise nude dips in the River Derwent.",
          "Nordic ideas like hygge became famous because long, dark winters turned coziness into a cultural survival skill.",
        ],
      },
    ],
  },
  spring: {
    slug: "spring",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Spring is one of the oldest symbolic markers of renewal.",
        facts: [
          "Before the 14th century, spring was often called \"Lent\" in Old English before \"springing time\" eventually took over.",
          "On the spring equinox, day and night are close to equal because the sun sits directly above the equator.",
          "The cherry trees in Washington DC were gifted by Japan in 1912 and turned spring bloom into an annual diplomatic symbol.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Spring triggers some of the fastest natural changes of the year.",
        facts: [
          "Some bamboo species can grow up to 91 centimetres in a single day during the peak spring growing season.",
          "Spring migration creates one of the largest movements of life on Earth, with birds like Arctic terns traveling enormous distances.",
          "In parts of the Northern Hemisphere, pollen can get so dense in spring that it creates a visible haze.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Spring comes with some very local habits and hazards.",
        facts: [
          "Spring cleaning became practical in the days before vacuum cleaners, when the first warm air let people throw open doors and clear out winter soot.",
          "In Australia, spring is also magpie swooping season, when cyclists and pedestrians start watching the trees more carefully.",
          "In Melbourne, spring can mean flowers for some people and the racing carnival for everyone else.",
        ],
      },
    ],
  },
  monday: {
    slug: "monday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Monday has lunar roots in a remarkable number of languages.",
        facts: [
          "Monday comes from the Old English Mōnandæg, meaning the Moon's day.",
          "Romance-language names like lundi and lunes also trace back to dies Lunae, the Latin day of the Moon.",
          "In medieval superstition, Monday was sometimes considered an unlucky day to begin a journey, marriage, or major project.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Modern Monday still has a reputation all its own.",
        facts: [
          "The so-called Monday Effect refers to the long-observed tendency for stock market returns to be weaker on Monday than on the preceding Friday.",
          "Monday is consistently one of the most common days for employees to call in sick, often linked to disrupted weekend sleep schedules.",
          "Workplace analytics often show Monday morning as a peak period for email volume, meeting load, and calendar resets.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Monday has become the symbolic villain of the workweek.",
        facts: [
          "Blue Monday, often placed on the third Monday in January, became famous as the so-called most depressing day of the year despite being based on pseudo-science.",
          "Monday jokes and dread are so widespread that the day has its own genre of memes, motivational quotes, and coping rituals.",
          "For many people, Monday is less about the day itself and more about the shock of shifting back from weekend time to work time.",
        ],
      },
    ],
  },
  tuesday: {
    slug: "tuesday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Tuesday is named for war gods on both the Norse and Roman sides of Europe.",
        facts: [
          "Tuesday is named after Tiw, the Norse god of combat and victory.",
          "In French and other Romance languages, Tuesday comes from Mars, the Roman god of war, which is why it appears as mardi or martes.",
          "In Greek tradition, Tuesday is often treated as the unluckiest day of the week because Constantinople fell on a Tuesday.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Tuesday often behaves like the true start of the workweek.",
        facts: [
          "Workplace surveys regularly rate Tuesday as the most productive day because Monday's backlog has been cleared and the weekend still feels distant.",
          "Super Tuesday turned the day into one of the most powerful recurring calendar moments in US presidential politics.",
          "Many teams schedule deep work, planning, or decision-heavy meetings on Tuesday because it tends to balance energy with focus.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Tuesday picked up one of the most successful food memes ever invented.",
        facts: [
          "Taco Tuesday became such a strong marketing phrase that Taco John's defended it as a trademark for decades before giving it up in 2023.",
          "Tuesday often feels culturally underrated, which is exactly why it became a convenient home for recurring food and pub promotions.",
          "In many offices, Tuesday has the reputation of being the day when people finally get real work done after Monday chaos.",
        ],
      },
    ],
  },
  wednesday: {
    slug: "wednesday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Wednesday still carries the name of Odin in English.",
        facts: [
          "Wednesday comes from Woden's Day, linking it to Odin, the chief Norse god.",
          "Spanish miércoles and similar forms trace back instead to Mercury, preserving the Roman naming system.",
          "German took a different path entirely and renamed the day Mittwoch, meaning simply mid-week.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Wednesday is where momentum often dips.",
        facts: [
          "Fitness and productivity tracking often show a mid-week slump on Wednesday once early-week motivation fades.",
          "The phrase Hump Day became mainstream in the 20th century because Wednesday felt like the peak of the weekly climb.",
          "Wednesday is often the pivot point when people start mentally comparing their week plan against what has actually happened.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Wednesday has become oddly meme-friendly for a middle day.",
        facts: [
          "\"On Wednesdays we wear pink\" turned a throwaway film line from Mean Girls into a long-running internet ritual.",
          "Wednesday's cultural identity is almost entirely about being the middle, which makes it unusually easy to brand and joke about.",
          "Many people treat Wednesday as the first day they can start imagining the weekend without sounding too unrealistic.",
        ],
      },
    ],
  },
  thursday: {
    slug: "thursday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Thursday is another thunder-god day hiding in plain sight.",
        facts: [
          "Thursday is Thor's Day in English, linking it to the Norse god of thunder.",
          "The Romance-language versions come from Jupiter, who occupied a similar thunder-god role in Roman religion.",
          "Maundy Thursday remains one of the most visible royal ceremonial dates in the UK through the tradition of Maundy money.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Thursday is often the turning point from workweek to weekend planning.",
        facts: [
          "In some Middle Eastern countries, Thursday was historically the practical end of the workweek before global alignment shifted schedules.",
          "Retailers and hospitality businesses often see Thursday night as the start of their weekend traffic pattern.",
          "Many offices see Thursday as the last truly full production day before Friday slows into wrap-up mode.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Thursday owns one of the most durable internet traditions.",
        facts: [
          "Throwback Thursday, or #TBT, became one of the earliest and most enduring social media rituals of the 2010s.",
          "Thursday is the day many people start making weekend plans while still pretending they are focused on the current week.",
          "The day often feels socially lighter than Wednesday because it carries the first real scent of the weekend.",
        ],
      },
    ],
  },
  friday: {
    slug: "friday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Friday has roots in both love and fear.",
        facts: [
          "Friday is named after Frigg or Freyja, linking the day to love and beauty in Norse tradition.",
          "The Latin equivalent was dedicated to Venus, which survives in names like vendredi and viernes.",
          "In Britain, Friday was once associated with public executions often enough to earn the nickname Hangman's Day.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Friday is one of the strongest recurring consumer and social triggers in the calendar.",
        facts: [
          "Black Friday is globally one of the busiest shopping days of the year and helped make Friday the commercial launchpad of the holiday season.",
          "Casual Friday grew out of Hawaii's Aloha Friday and spread worldwide as a workplace ritual.",
          "Traffic, hospitality bookings, and leisure spending often rise on Friday because it overlaps with both work completion and weekend anticipation.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Friday may have the strongest personality of any weekday.",
        facts: [
          "Paraskevidekatriaphobia is the formal term for fear of Friday the 13th.",
          "For many people, Friday is less a day on the calendar than a weekly emotional event.",
          "In modern culture, Friday is the default symbol for relief, plans, and the reward of surviving the week.",
        ],
      },
    ],
  },
  saturday: {
    slug: "saturday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Saturday is the odd one out in English day names.",
        facts: [
          "Saturday kept its Roman origin and remained tied to Saturn instead of adopting a Norse god name.",
          "In Old English it appeared as Sæturnesdæg, a direct link back to the Roman calendar tradition.",
          "In several Nordic languages, Saturday's name still reflects the old custom of bathing or washing on that day.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Saturday dominates major social scheduling.",
        facts: [
          "Saturday is statistically the most popular wedding day by a wide margin.",
          "In Australia, federal elections are held on Saturdays to maximize turnout.",
          "Sport, retail, nightlife, and hospitality industries all rely heavily on Saturday as their biggest weekly demand peak.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Saturday is where workweek logic gives way to leisure culture.",
        facts: [
          "Saturday night became a global party institution in the late 20th century, helped along by music, television, and nightlife culture.",
          "For many families, Saturday is the designated day for errands, sport, events, and social plans all fighting for the same calendar space.",
          "Few days carry a stronger built-in expectation of freedom than Saturday.",
        ],
      },
    ],
  },
  sunday: {
    slug: "sunday",
    sections: [
      {
        title: "Historical curiosities",
        intro: "Sunday carries both solar and religious identities.",
        facts: [
          "Sunday comes from the Sun's day and preserves one of the oldest astronomical naming traditions in English.",
          "In many Romance languages, Sunday shifted from the Sun to \"the Lord's Day\" as Christianity reshaped the weekly calendar.",
          "The question of whether Sunday is the first or last day of the week still depends on culture and calendar standard.",
        ],
      },
      {
        title: "Records and stats",
        intro: "Sunday has become one of the most psychologically loaded days of the week.",
        facts: [
          "The Sunday Scaries describes the spike in anxiety many people feel late on Sunday as the workweek approaches.",
          "While ISO standards place Monday first, many calendars in the US, Canada, and Japan still begin with Sunday.",
          "Sunday afternoon often marks a visible shift in online behavior from leisure browsing toward planning, errands, and Monday preparation.",
        ],
      },
      {
        title: "Cultural quirks",
        intro: "Sunday often blends tradition, food, and dread in one package.",
        facts: [
          "The Sunday roast became a British and Australian institution partly because families could leave meat cooking while they were at church.",
          "For some people, Sunday is a slow, sacred reset day; for others it feels like a countdown to Monday with snacks.",
          "Sunday is one of the few days still strongly shaped by both religious tradition and modern work culture at the same time.",
        ],
      },
    ],
  },
};

export function getSeoHubFacts(slug: string): SeoHubFactSet | null {
  if (slug === "fall") {
    return factsBySlug.autumn ?? null;
  }

  return factsBySlug[slug] ?? null;
}
