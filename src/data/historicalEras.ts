import { HistoricalEra } from '../types';

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'ancient-egypt',
    title: 'Ancient Egypt',
    year: 'c. 1350 BCE',
    eraCategory: 'ancient',
    shortDescription: 'Reign of the Pharaohs along the golden Nile Valley.',
    detailedContext: 'The 18th Dynasty Amarna period, characterized by radiant gold jewelry, lapis lazuli collars, pleated sheer linen schenti/kalasiris, and grand sunlit limestone temple colonnades.',
    icon: 'Pyramid',
    accentColor: '#D97706',
    clothingDescription: 'Wearing royal Egyptian pleated sheer white linen garments, an ornate beaded collar (usekh) inlaid with turquoise, carnelian, and lapis lazuli, gold arm cuffs, and a subtle kohl eye lining.',
    backgroundSetting: 'Inside a grand stone palace courtyard overlooking the tranquil Nile River with papyrus plants, sandstone obelisks, hieroglyphic carvings, and warm desert golden hour light.',
    artStyle: 'Photorealistic historical cinematic portrait with warm golden illumination and soft desert haze',
    scenes: [
      {
        id: 'egypt-throne',
        name: 'Pharaonic Royal Throne',
        description: 'Seated beside ornate golden lion thrones and carved sandstone pillars.',
        promptModifier: 'Seated regally beside a carved gold and ebony royal throne in a monumental limestone hall with burning incense braziers and golden sunlight streaming through clerestory windows.'
      },
      {
        id: 'egypt-nile-sunset',
        name: 'Nile Terrace at Sunset',
        description: 'Overlooking sacred felucca boats and distant pyramids during golden dusk.',
        promptModifier: 'Standing on a high stone balcony overlooking the Nile River at sunset, felucca boats gliding below, distant Giza pyramids silhouette under a purple-orange evening sky.'
      },
      {
        id: 'egypt-scribe-library',
        name: 'Sacred Temple Archives',
        description: 'Holding an ancient papyrus scroll amid sacred hieroglyphs and oil lamps.',
        promptModifier: 'In a sacred temple library surrounded by stacked papyrus scrolls, alabaster lamps with flickering flames, and walls covered in painted ceremonial hieroglyphs.'
      }
    ],
    samplePrompts: [
      'Wearing the golden crown of upper and lower Egypt',
      'Holding a ceremonial golden ankh scepter',
      'Accompanied by a sleek sacred Egyptian Mau cat with a gold collar'
    ]
  },
  {
    id: 'imperial-rome',
    title: 'Imperial Rome',
    year: 'c. 110 CE',
    eraCategory: 'ancient',
    shortDescription: 'Peak of the Roman Empire under Emperor Trajan.',
    detailedContext: 'The marble forums, grand amphitheaters, senators draped in purple-bordered togas, laurel wreaths, and Mediterranean cypress gardens.',
    icon: 'Landmark',
    accentColor: '#DC2626',
    clothingDescription: 'Draped in an authentic Roman senator toga with Tyrian purple border (toga praetexta) or an elegant stola and palla with gold fibula brooches, crowned with a delicate golden laurel leaf wreath.',
    backgroundSetting: 'A sun-drenched Roman Forum surrounded by fluted Corinthian marble columns, bronze statues, stone balustrades, and Mediterranean stone pine trees under a clear blue sky.',
    artStyle: 'High-definition classical historical portrait with crisp Mediterranean sunlight and marble reflections',
    scenes: [
      {
        id: 'rome-colosseum',
        name: 'Imperial Balcony at the Colosseum',
        description: 'Seated in the royal box above the roaring amphitheater.',
        promptModifier: 'In the shaded imperial balcony box of the Colosseum draped in crimson velarium canvas, overlooking the marble arena floor with statues of Roman deities.'
      },
      {
        id: 'rome-senate-forum',
        name: 'The Roman Senate Courtyard',
        description: 'Surrounded by marble busts, mosaic floors, and Roman standards.',
        promptModifier: 'Standing proudly before the Roman Curia with towering marble columns, SPQR golden eagle banners, polished mosaic floor, and olive trees.'
      },
      {
        id: 'rome-villa-garden',
        name: 'Tuscan Villa Peristyle Garden',
        description: 'Relaxing by a tranquil marble fountain and cypress trees.',
        promptModifier: 'In an open-air peristyle courtyard garden of a Roman luxury villa, with a bubbling marble fountain, lemon trees, and frescoes painted on the walls.'
      }
    ],
    samplePrompts: [
      'Holding a rolled Latin parchment with wax seal',
      'Wearing polished bronze gladiator shoulder guard',
      'Holding a silver chalice filled with Falernian wine'
    ]
  },
  {
    id: 'italian-renaissance',
    title: 'Italian Renaissance',
    year: 'c. 1505 CE',
    eraCategory: 'renaissance',
    shortDescription: 'Golden age of art and philosophy in Florence.',
    detailedContext: 'The atelier of master painters in Florence during Leonardo da Vinci and Raphael, with rich silk velvet doublets, pearl headbands, chiaroscuro lighting, and Tuscan landscapes.',
    icon: 'Palette',
    accentColor: '#B45309',
    clothingDescription: 'Dressed in Renaissance Florentine attire: a deep emerald green or crimson velvet doublet with slashed satin sleeves, embroidered gold brocade, white lace chemise collar, or an ornate pearl-strung gamurra dress.',
    backgroundSetting: 'An artist studio in Florence with an arched stone window framing the Tuscan hills and the Florence Duomo, wooden easels, oil paints, and soft chiaroscuro illumination.',
    artStyle: 'Masterpiece Renaissance oil painting aesthetic by Raphael and Leonardo da Vinci with sfumato shading and rich oil glazes',
    scenes: [
      {
        id: 'renaissance-studio',
        name: 'Master Painter Studio',
        description: 'Surrounded by anatomical sketches, pigments, and canvas.',
        promptModifier: 'Inside a sunlit Florentine artist atelier with canvas paintings on wooden easels, glass vials of oil pigments, and da Vinci architectural sketches on parchment.'
      },
      {
        id: 'renaissance-palazzo',
        name: 'Medici Palace Grand Salon',
        description: 'Ornate coffered ceilings, tapestry walls, and antique chandeliers.',
        promptModifier: 'Standing in a lavish Medici palazzo hall with gilded coffered ceilings, Flemish woven tapestries, candle chandeliers, and marble fireplaces.'
      },
      {
        id: 'renaissance-bridge',
        name: 'Ponte Vecchio Riverbank',
        description: 'Leaning against a stone balustrade over the Arno River.',
        promptModifier: 'On a terrace overlooking the Arno river and the historic Ponte Vecchio bridge in Florence during twilight, with warm glowing lanterns reflecting in the water.'
      }
    ],
    samplePrompts: [
      'Holding an antique brass compass and star chart',
      'Holding a painter palette with natural pigments',
      'Wearing an intricate pearl-braided headdress'
    ]
  },
  {
    id: 'feudal-japan',
    title: 'Feudal Japan (Edo Period)',
    year: 'c. 1650 CE',
    eraCategory: 'medieval',
    shortDescription: 'Samurai honor, tea ceremonies, and blossom gardens in Kyoto.',
    detailedContext: 'The peaceful and cultural zenith of the Tokugawa Shogunate, with exquisite silk kimonos, lacquer samurai armor, shoji screens, and serene Zen rock gardens.',
    icon: 'Sparkles',
    accentColor: '#BE123C',
    clothingDescription: 'Dressed in an authentic hand-woven silk kimono or formal montsuki haori and hakama adorned with family kamon crests, or ornate lacquered samurai armor with silk cord lacing.',
    backgroundSetting: 'A serene Japanese castle tea house pavilion opening into a garden with blooming cherry blossoms, manicured black pine bonsai, stone toro lanterns, and wooden tatami flooring.',
    artStyle: 'Exquisite cinematic Japanese historical drama film lighting with soft natural daylight and floating sakura petals',
    scenes: [
      {
        id: 'edo-cherry-garden',
        name: 'Cherry Blossom Tea Garden',
        description: 'Under swirling pink petals beside a koi pond.',
        promptModifier: 'Sitting on a red wooden veranda beside a tranquil koi pond surrounded by blossoming sakura cherry blossom trees, with soft pink petals drifting gently in the air.'
      },
      {
        id: 'edo-samurai-castle',
        name: 'Castle Armory & Hall',
        description: 'Beside decorated folding screens and ceremonial katana swords.',
        promptModifier: 'Inside a Shogun castle hall with golden byobu folding screens painted with pine trees and dragons, polished hinoki wood floors, and a ceremonial katana on a lacquered stand.'
      },
      {
        id: 'edo-lantern-street',
        name: 'Old Kyoto Evening Street',
        description: 'Walking past wooden machiya merchant houses lit with paper lanterns.',
        promptModifier: 'On an evening cobblestone path in Gion Kyoto, flanked by dark cedar machiya merchant townhouses, glowing andon paper lanterns, and bamboo fences.'
      }
    ],
    samplePrompts: [
      'Resting hand on the scabbard of an ornate katana sword',
      'Holding a delicately painted bamboo folding fan (sensu)',
      'Holding a hand-crafted ceramic matcha tea bowl'
    ]
  },
  {
    id: 'victorian-london',
    title: 'Victorian 1880s / Steampunk',
    year: 'c. 1888 CE',
    eraCategory: 'victorian',
    shortDescription: 'Foggy cobblestone London streets, gas lamps, and brass clockwork.',
    detailedContext: 'The industrial zenith of Victorian Britain: gentlemen in top hats, velvet waistcoats, pocket watches, corseted walking gowns with bustle skirts, and steam-powered ingenuity.',
    icon: 'Watch',
    accentColor: '#78350F',
    clothingDescription: 'Wearing tailored Victorian attire: a bespoke wool tailcoat with velvet lapels, silk cravat with antique cameo pin, brass pocket watch chain, or an elegant ruffled Victorian bustle gown with lace parasol.',
    backgroundSetting: 'A misty 1880s London cobblestone avenue under glowing amber gas lamps, Victorian brick row houses, and silhouettes of Big Ben and horse-drawn carriages in the distance.',
    artStyle: 'Atmospheric period film still with moody fog, warm gaslight reflections on wet cobblestones, and fine brass highlights',
    scenes: [
      {
        id: 'victorian-gaslight',
        name: 'Gaslit London Cobblestone Alley',
        description: 'Atmospheric foggy street with vintage carriages and iron railings.',
        promptModifier: 'Standing beside an ornate cast-iron gas lamp on a damp foggy London street at dusk, with vintage horse-drawn brougham carriages and brick facades in the soft mist.'
      },
      {
        id: 'victorian-library',
        name: 'Curiosity Cabinet & Study',
        description: 'Surrounded by leather books, brass telescopes, and globe maps.',
        promptModifier: 'In a warm mahogany study filled with floor-to-ceiling leather-bound books, antique brass telescopes, celestial globes, and a crackling fireplace.'
      },
      {
        id: 'victorian-conservatory',
        name: 'Crystal Palace Greenhouse',
        description: 'Under soaring iron-and-glass arches filled with exotic palms.',
        promptModifier: 'Inside a Victorian iron-and-glass greenhouse conservatory filled with towering tropical palms, hanging ferns, and soft filtered daylight streaming through glass panes.'
      }
    ],
    samplePrompts: [
      'Wearing brass-rimmed mechanical clockwork goggles on top hat',
      'Holding an antique silver-handled walking stick',
      'Holding a glowing brass pocket chronometer watch'
    ]
  },
  {
    id: 'roaring-twenties',
    title: 'Roaring Twenties / Art Deco',
    year: 'c. 1925 CE',
    eraCategory: '20th_century',
    shortDescription: 'Jazz clubs, Gatsby speakeasies, and geometric Art Deco glamor.',
    detailedContext: 'The vibrant 1920s jazz age: tailored tuxedos, fedora hats, flapper fringe dresses with sparkling glass bugle beads, feather headbands, and geometric gold-black architecture.',
    icon: 'Music',
    accentColor: '#CA8A04',
    clothingDescription: 'Dressed in 1920s high society glamor: a tailored double-breasted midnight blue tuxedo with satin peak lapels, or a dazzling drop-waist flapper gown embroidered with gold beads, pearl ropes, and feather aigrette headband.',
    backgroundSetting: 'A lavish Art Deco ballroom with geometric black-and-gold marble patterns, crystal chandeliers, champagne fountains, jazz instruments, and soft vintage film glow.',
    artStyle: '1920s Hollywood golden portraiture with soft diffused studio glow, gentle film grain, and sparkling specular highlights',
    scenes: [
      {
        id: 'twenties-gatsby-party',
        name: 'Gatsby Grand Ballroom',
        description: 'Under crystal chandeliers amid confetti and champagne coupes.',
        promptModifier: 'At a glittering 1920s high-society Art Deco party with crystal chandeliers, cascading champagne glasses, geometric gold wall patterns, and festive party atmosphere.'
      },
      {
        id: 'twenties-jazz-speakeasy',
        name: 'Midnight Speakeasy Lounge',
        description: 'Intimate velvet booth with brass saxophone and mood lighting.',
        promptModifier: 'In a cozy underground 1920s jazz speakeasy lounge with dark mahogany walls, red velvet banquettes, glowing brass lamps, and a vintage upright piano.'
      },
      {
        id: 'twenties-vintage-roadster',
        name: 'Classic 1920s Duesenberg Roadster',
        description: 'Posing beside a polished chrome vintage automobile.',
        promptModifier: 'Standing proudly beside a gleaming 1920s luxury roadster car with chrome spoke wheels, leather seats, in front of a grand illuminated Art Deco hotel marquee.'
      }
    ],
    samplePrompts: [
      'Holding a sparkling crystal coupe of champagne',
      'Holding a vintage 1920s box camera with flash powder',
      'Wearing a classic trilby fedora tilted with swagger'
    ]
  },
  {
    id: 'apollo-space-1969',
    title: 'Apollo Moon Mission 1969',
    year: '1969 CE',
    eraCategory: '20th_century',
    shortDescription: 'One giant leap for mankind on the lunar surface.',
    detailedContext: 'The historic Apollo 11 lunar landing: iconic pressurized spacesuits with NASA mission patches, reflective gold sun visors, gray lunar regolith, and the blue Earth in the distance.',
    icon: 'Rocket',
    accentColor: '#3B82F6',
    clothingDescription: 'Wearing the iconic white Apollo A7L spacesuit with NASA astronaut chest mission patches, red commander stripes, life-support umbilical connectors, and wrist checklists.',
    backgroundSetting: 'Standing on the powdery gray lunar surface with the American flag planted, the Apollo Lunar Module spacecraft nearby, and the brilliant blue Earth suspended in pitch-black space.',
    artStyle: 'Historic 70mm Hasselblad film photo style with crisp cosmic contrast and authentic vintage NASA film color tones',
    scenes: [
      {
        id: 'apollo-lunar-surface',
        name: 'Lunar Surface with Earthrise',
        description: 'On the Moon with planet Earth glowing in the black sky above.',
        promptModifier: 'Standing on the cratered lunar surface, boots kicking up fine moon dust, with the breathtaking blue-and-white Earth rising majestically over the moon horizon in deep black space.'
      },
      {
        id: 'apollo-command-module',
        name: 'Inside the Command Capsule',
        description: 'Surrounded by analog dials, toggle switches, and window views.',
        promptModifier: 'Inside the Apollo spacecraft cockpit surrounded by illuminated instrument dials, toggle switches, navigation displays, looking out the capsule window at the vast starry cosmos.'
      },
      {
        id: 'apollo-mission-control',
        name: 'Houston Mission Control 1969',
        description: 'Surrounded by CRT screens, flight headsets, and telemetry consoles.',
        promptModifier: 'At Houston Mission Control Center in 1969, wearing a crisp white short-sleeve shirt with skinny black tie and headset, surrounded by glowing radar screens and celebrating flight directors.'
      }
    ],
    samplePrompts: [
      'Holding the astronaut helmet under one arm with a confident smile',
      'Visor reflecting the golden descent stage of the Lunar Lander',
      'Holding a geology core sampling tool on the moon'
    ]
  },
  {
    id: 'seventies-disco',
    title: '1970s Disco Fever (Studio 54)',
    year: 'c. 1977 CE',
    eraCategory: '20th_century',
    shortDescription: 'Glittering mirror balls, roller skates, and funky disco vibes.',
    detailedContext: 'The vibrant late 1970s discotheque revolution: wide collar satin shirts, sequin jumpsuits, bell-bottom trousers, afro/feathered hair, and illuminated dance floor squares.',
    icon: 'Radio',
    accentColor: '#EC4899',
    clothingDescription: 'Dressed in flamboyant 1970s disco style: a white three-piece polyester suit with wide butterfly collar shirt unbuttoned, or a sparkling silver sequin jumpsuit with platform heels and gold hoop earrings.',
    backgroundSetting: 'On an illuminated multi-colored dance floor beneath a gigantic rotating mirror disco ball casting thousands of shimmering light specks, with neon light tubes and vintage crowd.',
    artStyle: 'Vintage 1970s 35mm Kodak film portrait with warm analog color saturation, starburst lighting, and vibrant club atmosphere',
    scenes: [
      {
        id: 'disco-dance-floor',
        name: 'Illuminated Neon Dance Floor',
        description: 'Striking a classic disco pose under flashing light squares.',
        promptModifier: 'Striking a dynamic dance pose on a glowing rainbow dance floor, with beams of light bouncing off a huge ceiling disco ball and colorful neon strobes.'
      },
      {
        id: 'disco-vip-booth',
        name: 'Velvet VIP Lounge',
        description: 'Relaxing on curved leather banquettes with champagne and record sleeves.',
        promptModifier: 'Lounging in a circular red plush VIP booth with champagne buckets, vinyl record sleeves, retro cocktail glasses, and warm ambient neon backlighting.'
      },
      {
        id: 'disco-roller-rink',
        name: 'Retro Sunset Roller Rink',
        description: 'On four-wheel roller skates under a palm tree sunset mural.',
        promptModifier: 'At a retro 1970s roller skating rink with quad roller skates, vibrant rainbow striped wall murals, and warm golden sunset lighting through open arches.'
      }
    ],
    samplePrompts: [
      'Wearing tinted rose-gold aviator sunglasses indoors',
      'Holding a vintage cassette boombox on the shoulder',
      'Holding two silver glitter microphones'
    ]
  },
  {
    id: 'cyberpunk-2099',
    title: 'Cyberpunk Neo-Metropolis 2099',
    year: '2099 CE',
    eraCategory: 'futuristic',
    shortDescription: 'Neon-drenched skyscrapers, flying hovercars, and cybernetic nomad style.',
    detailedContext: 'The distant future high-tech mega-city: neon holographic billboards in Japanese and English, sleek tactical carbon-fiber jackets with LED optic fibers, and rain-slicked skybridge promenades.',
    icon: 'Zap',
    accentColor: '#06B6D4',
    clothingDescription: 'Wearing futuristic cyber-tech fashion: a sleek waterproof dark jacket with glowing cyan fiber-optic seams, high-collar tactical techwear, subtle illuminated cybernetic ear piece or ocular implant.',
    backgroundSetting: 'A soaring multi-level skybridge in a rainy futuristic neon city at night, with towering holographic advertisements, streaming hover-vehicles, and vibrant magenta and cyan neon glow.',
    artStyle: 'High-end cinematic cyberpunk concept art with rich chromatic lighting, rain reflections, volumetric fog, and razor-sharp tech details',
    scenes: [
      {
        id: 'cyber-rooftop-skyline',
        name: 'Skybridge Overlook & Hover-Traffic',
        description: 'Overlooking a thousand-story neon skyscraper abyss.',
        promptModifier: 'Standing on the edge of a high-tech glass skybridge balcony in the rain, looking down at streams of flying hovercars and towering holographic dragons in the neon night sky.'
      },
      {
        id: 'cyber-noodle-bar',
        name: 'Rainy Alleyway Cyber Ramen Bar',
        description: 'Under steaming neon signs with glowing chopsticks.',
        promptModifier: 'Sitting at an open-air neon-lit noodle counter in a narrow cyberpunk alleyway, steam rising from bowls, neon signs reflecting in puddles on the ground.'
      },
      {
        id: 'cyber-cockpit',
        name: 'Hovercar Pilot Seat',
        description: 'Behind holographic HUD displays soaring through the clouds.',
        promptModifier: 'In the pilot seat of a sleek futuristic hover-vehicle, hands on glowing flight controls with holographic heads-up displays (HUD) projected onto the panoramic canopy.'
      }
    ],
    samplePrompts: [
      'Subtle glowing circuit-board biometric tattoo on neck or cheek',
      'Holding a glowing translucent holographic data datapad',
      'Wearing luminous holographic visor goggles'
    ]
  },
  {
    id: 'medieval-knights',
    title: 'Medieval Kingdom (c. 1250)',
    year: 'c. 1250 CE',
    eraCategory: 'medieval',
    shortDescription: 'Chivalric knights, royal stone fortresses, and tournament banners.',
    detailedContext: 'The High Middle Ages in Europe: engraved steel plate and chainmail armor, royal heraldic surcoats, stone castle banquet halls with roaring hearths, and jousting tournament pavilions.',
    icon: 'Shield',
    accentColor: '#475569',
    clothingDescription: 'Wearing authentic 13th-century knight armor: polished steel pauldrons and breastplate over riveted chainmail hauberk, crimson velvet surcoat embroidered with golden lion rampant crest, or a regal royal velvet robe with ermine fur trim.',
    backgroundSetting: 'Inside a massive stone castle great hall illuminated by blazing wall torches and a roaring stone hearth, with heraldic banners, oak banquet tables, and stained glass gothic windows.',
    artStyle: 'Epic medieval historical drama cinematography with dramatic torchlight warmth, polished steel glints, and rich fabric textures',
    scenes: [
      {
        id: 'medieval-great-hall',
        name: 'Castle Great Hall & Throne',
        description: 'Surrounded by torches, heraldic banners, and stone arches.',
        promptModifier: 'Standing beside an imposing carved stone throne in a castle great hall with blazing iron wall sconces, heraldic tapestry banners, and stained glass gothic windows.'
      },
      {
        id: 'medieval-tournament-field',
        name: 'Tournament Grounds & Pavilions',
        description: 'Beside colorful heraldic tents and jousting lists under blue sky.',
        promptModifier: 'On the tournament field with colorful striped silk pavilions, fluttering pennants, warhorses with caparisons in the background, and castle battlements.'
      },
      {
        id: 'medieval-battlements',
        name: 'Castle Fortress Battlements',
        description: 'Overlooking green misty valleys and winding rivers from the stone walls.',
        promptModifier: 'On the stone ramparts and crenellations of a high mountain fortress at sunrise, overlooking rolling green valleys, medieval village, and mist-covered forest.'
      }
    ],
    samplePrompts: [
      'Holding a polished steel broadsword with jeweled pommel point down',
      'Wearing a royal gold coronet crown set with rubies',
      'With a majestic trained hunting falcon perched on a leather gauntlet'
    ]
  },
  {
    id: 'golden-age-pirates',
    title: 'Golden Age of Piracy (c. 1715)',
    year: 'c. 1715 CE',
    eraCategory: 'renaissance',
    shortDescription: 'High-seas buccaneers, Caribbean trade winds, and treasure galleons.',
    detailedContext: 'The legendary Caribbean piracy era: weathered tricorn hats with feathers, gold-trimmed velvet captain frock coats, leather bandoliers, brass spyglasses, and the wooden quarterdeck of a pirate brigantine.',
    icon: 'Compass',
    accentColor: '#1E3A8A',
    clothingDescription: 'Dressed as a dashing Caribbean pirate captain: a weathered leather or crimson velvet long frock coat with tarnished brass buttons, ruffled linen shirt, leather cross-belt baldric, and a classic cocked tricorn hat with peacock feather.',
    backgroundSetting: 'On the wooden quarterdeck of a three-masted tall ship sailing through turquoise Caribbean waters at sunset, with billowing white canvas sails, rigging ropes, and bronze cannons.',
    artStyle: 'Vibrant nautical adventure cinematography with warm tropical sunset glow, salty ocean spray, and rich weathered textures',
    scenes: [
      {
        id: 'pirate-ship-deck',
        name: 'Galleon Quarterdeck at Sea',
        description: 'At the wooden ship wheel with sails billowing in the trade winds.',
        promptModifier: 'Standing at the wooden helm ship wheel on the quarterdeck of a pirate ship sailing across turquoise Caribbean waves with billowing canvas sails and skull-and-crossbones flag.'
      },
      {
        id: 'pirate-treasure-cove',
        name: 'Secret Tropical Treasure Cove',
        description: 'On a white sand beach beside overflowing gold treasure chests.',
        promptModifier: 'On a secluded Caribbean beach cove with coconut palms, crystal-clear turquoise waters, and an open wooden iron-bound chest overflowing with golden doubloons and gemstones.'
      },
      {
        id: 'pirate-tavern',
        name: 'Tortuga Harbor Tavern',
        description: 'Inside a bustling candlelit sea tavern with nautical maps and rum barrels.',
        promptModifier: 'In a lively wooden Tortuga seaside tavern lit by lanterns and candlelight, surrounded by rum casks, weathered sea navigation charts, and harbor view out the open door.'
      }
    ],
    samplePrompts: [
      'Looking through a brass nautical spyglass telescope towards the horizon',
      'A colorful tropical scarlet macaw parrot perched on shoulder',
      'Holding an antique brass compass and treasure map'
    ]
  },
  {
    id: 'hollywood-golden-1950s',
    title: '1950s Hollywood Golden Age',
    year: 'c. 1954 CE',
    eraCategory: '20th_century',
    shortDescription: 'Classic cinema glamor, vintage studio lights, and red carpet elegance.',
    detailedContext: 'The mid-century golden age of cinema: sharp tailored suits, fedoras, glamorous cocktail dresses, vintage Technicolor saturated tones or classic black-and-white studio portraits, and retro microphones.',
    icon: 'Film',
    accentColor: '#9333EA',
    clothingDescription: 'Wearing iconic 1950s Hollywood star attire: a tailored black tuxedo with silk bow tie and white pocket square, or an exquisite draped satin off-the-shoulder evening gown with elbow-length white satin gloves and diamond jewelry.',
    backgroundSetting: 'A classic 1950s movie soundstage with vintage metal studio floodlights, film cameras on boom arms, velvet director chairs, or a lavish red-carpet premiere with flashing vintage camera bulbs.',
    artStyle: 'Classic 1950s Technicolor movie still or high-contrast Hollywood studio glamour portrait with dramatic key lighting',
    scenes: [
      {
        id: 'hollywood-soundstage',
        name: 'Vintage Studio Soundstage',
        description: 'Under the glow of classic tungsten movie lights and vintage film cameras.',
        promptModifier: 'On a 1950s Hollywood movie studio set with vintage Mitchell 35mm film cameras, glowing studio spotlights with barn doors, and wooden clapperboards.'
      },
      {
        id: 'hollywood-red-carpet',
        name: 'Grauman’s Red Carpet Premiere',
        description: 'Under searchlights with vintage press camera flashes going off.',
        promptModifier: 'Stepping onto a crimson red carpet in front of a grand classic cinema marquee at night, with towering arc searchlights sweeping the sky and press cameras flashing.'
      },
      {
        id: 'hollywood-diner',
        name: '1950s Chrome Neon Diner',
        description: 'In a red vinyl booth with a milkshake and classic jukebox.',
        promptModifier: 'Inside a sparkling 1950s American chrome diner with red vinyl booth seating, checkered tile floor, a glowing Wurlitzer jukebox, and neon signs.'
      }
    ],
    samplePrompts: [
      'Holding a classic chrome vintage studio microphone',
      'Holding a golden Hollywood cinema award statuette',
      'Wearing classic vintage cat-eye sunglasses or tortoiseshell frames'
    ]
  }
];
