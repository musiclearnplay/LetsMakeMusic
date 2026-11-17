/* Music Hub data: songs, chords, pathways. Melodies: "E4:2" = note:beats (1 beat default, octave 4 default), R = rest, | ignored. */
'use strict';
const SANDBOX_URL='https://claude.ai/artifact/PNyfn9UntRH1JvXoTceBzC';

/* ---------- Tier 1: public-domain and original pieces with full notation ---------- */
const MELODIES=[
 {id:'rain-rain',t:'Rain, Rain, Go Away',by:'Traditional',lvl:1,bpm:92,key:'C',tags:'so mi la voice',
  mel:'G E G:.5 G:.5 E | G:.5 G:.5 E:.5 A:.5 G:.5 G:.5 E',ch:'C C'},
 {id:'hot-cross',t:'Hot Cross Buns',by:'Traditional',lvl:1,bpm:96,key:'C',tags:'do re mi three notes',
  mel:'E D C:2 | E D C:2 | C:.5 C:.5 C:.5 C:.5 D:.5 D:.5 D:.5 D:.5 | E D C:2',ch:'C C C_G C'},
 {id:'three-note-rock',t:'Three-Note Rock',by:'Original for the Hub',tier:'orig',lvl:1,bpm:104,key:'G',tags:'B A G three notes',
  mel:'B B A A | G G A:2 | B A G A | B:2 G:2 | B B A A | G G A:2 | B:.5 B:.5 A G A | G:4',ch:'G D G D G D G_D G'},
 {id:'open-string-groove',t:'Open String Groove',by:'Original for the Hub',tier:'orig',lvl:1,bpm:100,key:'C',tags:'ukulele open strings',
  mel:'C C E E | A A E:2 | C E A E | C:4 | A A E E | C C E:2 | A E C E | C:4',ch:'C C Am Am F F G C'},
 {id:'mary-lamb',t:'Mary Had a Little Lamb',by:'Traditional',lvl:1,bpm:104,key:'C',tags:'do re mi so',
  mel:'E D C D | E E E:2 | D D D:2 | E G G:2 | E D C D | E E E E | D D E D | C:4',ch:'C C G C C C G C'},
 {id:'au-clair',t:'Au Clair de la Lune',by:'Traditional French',lvl:1,bpm:96,key:'C',tags:'do re mi',
  mel:'C C C D | E:2 D:2 | C E D D | C:4',ch:'C C_G C_G C'},
 {id:'good-king',t:'Good King Wenceslas',by:'Traditional carol',lvl:1,bpm:108,key:'C',tags:'seasonal',
  mel:'C C C D | C C G3:2 | A3 G3 A3 B3 | C:2 C:2',ch:'C C F_G C'},
 {id:'twinkle',t:'Twinkle, Twinkle, Little Star',by:'Traditional French melody',lvl:1,bpm:100,key:'C',tags:'do so la',
  mel:'C C G G | A A G:2 | F F E E | D D C:2 | G G F F | E E D:2 | G G F F | E E D:2 | C C G G | A A G:2 | F F E E | D D C:2',
  ch:'C F_C F_C G_C C_F C_G C_F C_G C F_C F_C G_C'},
 {id:'ode-joy',t:'Ode to Joy',by:'Ludwig van Beethoven',lvl:2,bpm:108,key:'C',tags:'classical five finger',
  mel:'E E F G | G F E D | C C D E | E:1.5 D:.5 D:2 | E E F G | G F E D | C C D E | D:1.5 C:.5 C:2',ch:'C C C G C C C G_C'},
 {id:'frere-jacques',t:'Frère Jacques',by:'Traditional French',lvl:2,bpm:108,key:'C',tags:'round canon',
  mel:'C D E C | C D E C | E F G:2 | E F G:2 | G:.5 A:.5 G:.5 F:.5 E C | G:.5 A:.5 G:.5 F:.5 E C | C G3 C:2 | C G3 C:2',ch:'C C C C C C C C'},
 {id:'lightly-row',t:'Lightly Row',by:'Traditional German',lvl:2,bpm:108,key:'C',tags:'five finger',
  mel:'G E E:2 | F D D:2 | C D E F | G G G:2 | G E E E | F D D D | C E G G | C:4',ch:'C G C C C G C C'},
 {id:'skip-lou',t:'Skip to My Lou',by:'Traditional American',lvl:2,bpm:116,key:'C',tags:'two chords',
  mel:'E E C C | E E G:2 | D D B3 B3 | D D F:2 | E E C C | E E G:2 | D E:.5 F:.5 E D | C:2 C:2',ch:'C C G G C C G C'},
 {id:'yankee',t:'Yankee Doodle',by:'Traditional',lvl:2,bpm:116,key:'C',
  mel:'C C D E | C E D G3 | C C D E | C:2 B3:2 | C C D E | F E D C | B3 G3 A3 B3 | C:2 C:2',ch:'C G C G C F G C'},
 {id:'old-macdonald',t:'Old MacDonald (A section)',by:'Traditional',lvl:2,bpm:112,key:'C',
  mel:'C C C G3 | A3 A3 G3:2 | E E D D | C:3 G3 | C C C G3 | A3 A3 G3:2 | E E D D | C:4',ch:'C F_C C_G C C F_C C_G C'},
 {id:'london-bridge',t:'London Bridge',by:'Traditional English',lvl:2,bpm:112,key:'C',
  mel:'G:1.5 A:.5 G F | E F G:2 | D E F:2 | E F G:2 | G:1.5 A:.5 G F | E F G:2 | D:2 G:2 | E C:3',ch:'C C G C C C G C'},
 {id:'alouette',t:'Alouette',by:'Traditional French-Canadian',lvl:2,bpm:112,key:'C',
  mel:'C:1.5 D:.5 E E | D:.5 C:.5 D:.5 E:.5 C G3 | C:1.5 D:.5 E E | D:.5 C:.5 D:.5 E:.5 C:2',ch:'C G_C C G_C'},
 {id:'surprise',t:'Surprise Symphony Theme',by:'Joseph Haydn',lvl:2,bpm:104,key:'C',tags:'classical',
  mel:'C C E E | G G E:2 | F F D D | B3 B3 G3:2 | C C E E | G G E:2 | F F D D | B3 B3 G3:2',ch:'C C G G C C G G'},
 {id:'saints',t:'When the Saints Go Marching In',by:'Traditional American',lvl:2,bpm:132,key:'C',tags:'jazz',
  mel:'R C E F | G:4 | R C E F | G:4 | R C E F | G:2 E:2 | C:2 E:2 | D:4 | R E E D | C:3 C | E:2 G:2 | G F:3 | R:2 E F | G:2 E:2 | C:2 D:2 | C:4',
  ch:'C C C C C C C G G C C F F C G C'},
 {id:'hawker-hop',t:'Hawker Centre Hop',by:'Original for the Hub',tier:'orig',lvl:2,bpm:120,key:'C',tags:'pentatonic singapore angklung',
  mel:'C D E G | A:2 G:2 | E G A G | E:2 D:2 | C D E G | A:2 C5:2 | A G E D | C:4',ch:'C C Am Am C C F_G C'},
 {id:'jingle',t:'Jingle Bells (chorus)',by:'James Pierpont',lvl:2,bpm:120,key:'C',tags:'seasonal',
  mel:'E E E:2 | E E E:2 | E G C:1.5 D:.5 | E:4 | F F F:1.5 F:.5 | F E E E:.5 E:.5 | G G F D | C:4',ch:'C C C C F C G C'},
 {id:'oh-susanna',t:'Oh! Susanna (verse)',by:'Stephen Foster',lvl:3,bpm:116,key:'C',pickup:1,
  mel:'C:.5 D:.5 | E G G:1.5 A:.5 | G E C:1.5 D:.5 | E E D C | D:3 C:.5 D:.5 | E G G:1.5 A:.5 | G E C:1.5 D:.5 | E E D D | C:3',ch:'C C C G C C G C'},
 {id:'aura-lee',t:'Aura Lee',by:'George R. Poulton',lvl:3,bpm:92,key:'C',
  mel:'G3 C B3 C | D A3 D:2 | C B3 A3 B3 | C:4 | G3 C B3 C | D A3 D:2 | C B3 A3 B3 | C:4 | E E E:2 | E E E:2 | E D C D | E:4 | E E F E | D A3 D:2 | C B3 A3 B3 | C:4',
  ch:'C D G C C D G C C C A Dm F D G C'},
 {id:'deck-halls',t:'Deck the Halls',by:'Traditional Welsh',lvl:3,bpm:120,key:'C',tags:'seasonal',
  mel:'G:1.5 F:.5 E D | C D E C | D:.5 E:.5 F:.5 D:.5 E:1.5 D:.5 | C B3 C:2',ch:'C C G_C G_C'},
 {id:'joy-world',t:'Joy to the World (opening)',by:'Lowell Mason',lvl:3,bpm:100,key:'C',tags:'seasonal scale',
  mel:'C5:2 B:1.5 A:.5 | G:3 F | E:2 D:2 | C:3 G | A:3 A | B:3 B | C5:4',ch:'C C F_G C F G C'},
 {id:'largo',t:'Largo from the New World Symphony',by:'Antonín Dvořák',lvl:3,bpm:72,key:'C',tags:'classical pentatonic',
  mel:'E:1.5 G:.5 G:2 | E:1.5 D:.5 C:2 | D:1.5 E:.5 G:1.5 E:.5 | D:4 | E:1.5 G:.5 G:2 | E:1.5 D:.5 C:2 | D E D:1.5 C:.5 | C:4',ch:'C C G G C C G C'},
 {id:'can-can',t:'Can-Can',by:'Jacques Offenbach',lvl:3,bpm:132,key:'C',tags:'classical',
  mel:'C:2 D:.5 F:.5 E:.5 D:.5 | G G G:.5 A:.5 E:.5 F:.5 | D D D:.5 F:.5 E:.5 D:.5 | C:.5 C5:.5 B:.5 A:.5 G:.5 F:.5 E:.5 D:.5 | C:2 D:.5 F:.5 E:.5 D:.5 | G G G:.5 A:.5 E:.5 F:.5 | D D D:.5 F:.5 E:.5 D:.5 | C G C:2',
  ch:'C G G C C G G C'},
 {id:'mountain-king',t:'In the Hall of the Mountain King',by:'Edvard Grieg',lvl:3,bpm:112,key:'Am',tags:'classical minor',
  mel:'A3:.5 B3:.5 C:.5 D:.5 E:.5 C:.5 E | D#:.5 B3:.5 D# D:.5 B3:.5 D | A3:.5 B3:.5 C:.5 D:.5 E:.5 C:.5 E:.5 A:.5 | G:.5 E:.5 C:.5 E:.5 G:2',ch:'Am Am Am C'},
 {id:'monsoon-minor',t:'Monsoon Minor',by:'Original for the Hub',tier:'orig',lvl:3,bpm:96,key:'Am',tags:'minor singapore',
  mel:'A3 C E:2 | D C B3:2 | A3 C E A | G:2 E:2 | F E D C | B3 C D:2 | E D C B3 | A3:4',ch:'Am Am Am C F G E Am'},
 {id:'mrt-blues',t:'MRT Blues',by:'Original for the Hub',tier:'orig',lvl:3,bpm:108,key:'C',tags:'12-bar blues singapore',
  mel:'C Eb F:2 | C Eb F:2 | C Eb F G | Eb:2 C:2 | F Ab Bb:2 | F Ab Bb:2 | C Eb F G | Eb:2 C:2 | G:2 F:2 | F:2 Eb:2 | C Eb F Eb | C:4',
  ch:'C C C C F F C C G F C C'},
 {id:'happy-birthday',t:'Happy Birthday to You',by:'Patty and Mildred Hill',lvl:3,bpm:108,key:'C',meter:3,pickup:1,
  mel:'G3:.75 G3:.25 | A3 G3 C | B3:2 G3:.75 G3:.25 | A3 G3 D | C:2 G3:.75 G3:.25 | G E C | B3 A3 F:.75 F:.25 | E C D | C:2',ch:'C G G C C F C_G C'},
 {id:'silent-night',t:'Silent Night (opening)',by:'Franz Gruber',lvl:3,bpm:96,key:'C',meter:3,tags:'seasonal',
  mel:'G:1.5 A:.5 G | E:3 | G:1.5 A:.5 G | E:3 | D5:2 D5 | B:3 | C5:2 C5 | G:3',ch:'C C C C G G C C'},
 {id:'we-wish',t:'We Wish You a Merry Christmas',by:'Traditional English',lvl:3,bpm:132,key:'C',meter:3,pickup:1,tags:'seasonal',
  mel:'G3 | C C:.5 D:.5 C:.5 B3:.5 | A3 A3 A3 | D D:.5 E:.5 D:.5 C:.5 | B3 G3 G3 | E E:.5 F:.5 E:.5 D:.5 | C A3 G3:.5 G3:.5 | A3 D B3 | C:2',ch:'C F D G E Am F_G C'},
 {id:'row-row',t:'Row, Row, Row Your Boat',by:'Traditional',lvl:3,bpm:132,key:'C',meter:3,ts:'6/8',tags:'round canon',
  mel:'C:1.5 C:1.5 | C D:.5 E:1.5 | E D:.5 E F:.5 | G:3 | C5:.5 C5:.5 C5:.5 G:.5 G:.5 G:.5 | E:.5 E:.5 E:.5 C:.5 C:.5 C:.5 | G F:.5 E D:.5 | C:3',ch:'C C C C C C G C'},
 {id:'sakura',t:'Sakura, Sakura',by:'Traditional Japanese',lvl:3,bpm:84,key:'Am',tags:'world japan',
  mel:'A A B:2 | A A B:2 | A B C5 B | A B:.5 A:.5 F:2 | E C E F | E E:.5 C:.5 B3:2 | A B C5 B | A B:.5 A:.5 F:2 | E C E F | E E:.5 C:.5 B3:2 | A A B:2 | A A B:2 | E F B:.5 A:.5 F | E:4'},
 {id:'mo-li-hua',t:'Mo Li Hua (Jasmine Flower)',by:'Traditional Chinese',lvl:4,bpm:76,key:'C',tags:'world china pentatonic',
  mel:'E E:.5 G:.5 A:.5 C5:.5 C5:.5 A:.5 | G G:.5 A:.5 G:2 | E E:.5 G:.5 A:.5 C5:.5 C5:.5 A:.5 | G G:.5 A:.5 G:2 | G G G E:.5 G:.5 | A A G:2 | E D:.5 E:.5 G E:.5 D:.5 | C C:.5 D:.5 C:2 | E:.5 D:.5 C:.5 E:.5 D:1.5 E:.5 | G A:.5 C5:.5 G:2 | D E:.5 G:.5 D:.5 E:.5 C:.5 A3:.5 | G3:2 A3 C | D:1.5 E:.5 C:.5 D:.5 C:.5 A3:.5 | G3:4'},
 {id:'minuet-g',t:'Minuet in G',by:'Christian Petzold',lvl:4,bpm:112,key:'G',meter:3,tags:'classical baroque',
  mel:'D5 G:.5 A:.5 B:.5 C5:.5 | D5 G G | E5 C5:.5 D5:.5 E5:.5 F#5:.5 | G5 G G | C5 D5:.5 C5:.5 B:.5 A:.5 | B C5:.5 B:.5 A:.5 G:.5 | F# G:.5 A:.5 B:.5 G:.5 | A:3',ch:'G G C G Am G D D'},
 {id:'greensleeves',t:'Greensleeves (A section)',by:'Traditional English',lvl:4,bpm:108,key:'Am',meter:3,pickup:1,tags:'minor folk',
  mel:'A | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B | G:1.5 A:.5 B | C5:2 A | A:1.5 G#:.5 A | B:2 G# | E:2 A | C5:2 D5 | E5:1.5 F5:.5 E5 | D5:2 B | G:1.5 A:.5 B | C5:1.5 B:.5 A | G#:1.5 F#:.5 G# | A:3 | A:2',
  ch:'Am Am G G Am Am E E Am Am G G Am E Am Am'},
 {id:'fur-elise',t:'Für Elise (opening)',by:'Ludwig van Beethoven',lvl:4,bpm:112,key:'Am',meter:1.5,ts:'3/8',pickup:.5+.5,tags:'classical piano',
  mel:'E5:.5 D#5:.5 | E5:.5 D#5:.5 E5:.5 | B:.5 D5:.5 C5:.5 | A R:.5 | C:.5 E:.5 A:.5 | B R:.5 | E:.5 G#:.5 B:.5 | C5 R:.5 | E:.5 E5:.5 D#5:.5 | E5:.5 D#5:.5 E5:.5 | B:.5 D5:.5 C5:.5 | A R:.5 | C:.5 E:.5 A:.5 | B R:.5 | E:.5 C5:.5 B:.5 | A:1.5'},
 {id:'lullaby',t:'Lullaby',by:'Johannes Brahms',lvl:4,bpm:84,key:'C',meter:3,pickup:1,tags:'classical',
  mel:'E:.5 E:.5 | G:2 E:.5 E:.5 | G:2 E:.5 G:.5 | C5 B A | A G D:.5 E:.5 | F D D:.5 E:.5 | F:2 D:.5 F:.5 | B A G | B C5:2',ch:'C C C G G G G C'},
];

/* ---------- Chord charts: no lyrics, no melody. Stored in an easy key. ---------- */
/* Title|Artist|key|bpm|strum|Section:bars;Section:bars  (bars split by space, two chords in a bar joined by _) */
const FOLK_CHARTS=`Rasa Sayang|Traditional Malay|C|112|s2|All:C C G7 G7 G7 G7 C C
Chan Mali Chan|Traditional Malay|C|120|s2|All:C C G7 G7 G7 G7 C C
Burung Kakak Tua|Traditional Indonesian|C|120|s6|All:C C G7 G7 G7 G7 C C|3
12-Bar Blues in C|Blues form|C|108|s2|All:C C C C F F C C G F C C
12-Bar Blues in A|Blues form|A|108|s2|All:A A A A D D A A E D A A
One-Chord Jam|Hub warm-up|C|100|s1|All:C C C C
The Four-Chord Loop|Hub warm-up|C|96|s3|All:C G Am F
The Doo-Wop Loop|Hub warm-up|C|100|s2|All:C Am F G`;
const POP_CHARTS=`Let It Be|The Beatles|C|72|s1|Verse:C G Am F C G F C;Chorus:Am G F C C G F C
I'm Yours|Jason Mraz|C|76|s3|All:C G Am F
Riptide|Vance Joy|Am|100|s3|Verse:Am G C C;Bridge:Am G C F
Stand By Me|Ben E. King|C|116|s2|All:C C Am Am F G C C
Three Little Birds|Bob Marley|C|74|s5|Chorus:C C F C;Verse:C G C F
Count on Me|Bruno Mars|C|88|s3|All:C Em Am_G F
Don't Stop Believin'|Journey|C|118|s4|All:C G Am F C G Em F
Counting Stars|OneRepublic|Am|122|s2|All:Am C G F
Perfect|Ed Sheeran|G|64|s1|All:G Em C D
Shake It Off|Taylor Swift|G|120|s4|All:Am C G G
Love Story|Taylor Swift|C|118|s3|Verse:C F Am F;Chorus:C G Am F
You Belong With Me|Taylor Swift|C|128|s4|All:C G Dm F
Anti-Hero|Taylor Swift|C|97|s2|All:F C Am G
Roar|Katy Perry|C|90|s2|All:C Dm Am F
Firework|Katy Perry|C|124|s4|All:C Dm Am F
Hey, Soul Sister|Train|C|97|s3|Verse:C G Am F;Chorus:F G C G
Viva la Vida|Coldplay|C|132|s4|All:F G C Am
Yellow|Coldplay|C|88|s4|All:C C G G F F C C
Clocks|Coldplay|D|128|s4|All:D Am Am Em
The Scientist|Coldplay|C|74|s1|All:Am F C C
A Sky Full of Stars|Coldplay|Am|124|s4|All:Am F C Em
Something Just Like This|The Chainsmokers and Coldplay|C|103|s2|All:F G Am G
Havana|Camila Cabello|Am|105|s2|All:Am F E7 E7
Dance Monkey|Tones and I|Am|98|s2|All:Am F G Em
Someone You Loved|Lewis Capaldi|C|110|s1|All:C G Am F
Can't Stop the Feeling!|Justin Timberlake|C|113|s4|All:C Am F Am
Shotgun|George Ezra|C|116|s3|All:C F Am G
Budapest|George Ezra|C|128|s3|All:C C C C F F C C G F C C
Lean on Me|Bill Withers|C|76|s1|All:C F C G C F G C
Wonderwall|Oasis|Em|87|s4|Verse:Em G D A;Chorus:C D Em Em
Ho Hey|The Lumineers|C|80|s1|Verse:C F C F;Chorus:Am G C C
Brown Eyed Girl|Van Morrison|G|148|s3|Verse:G C G D;Chorus:C D G Em C D G D
Take Me Home, Country Roads|John Denver|G|82|s2|Verse:G Em D C_G;Chorus:G D Em C G D C G
Somewhere Over the Rainbow (ukulele version)|Israel Kamakawiwo'ole|C|86|s3|All:C Em F C F C G Am_F
You Are My Sunshine|Jimmie Davis|C|110|s2|All:C C C C F F C C F F C C C G C C
This Land Is Your Land|Woody Guthrie|C|110|s2|All:F F C C G G C C F F C C G G C C
Octopus's Garden|The Beatles|C|92|s2|All:C Am F G
Yellow Submarine|The Beatles|G|110|s1|Verse:D_C G Em_Am C_D;Chorus:G D D G
Hey Jude|The Beatles|F|74|s1|All:F C C F Bb F C F
Twist and Shout|The Isley Brothers / The Beatles|C|124|s4|All:C_F G
La Bamba|Traditional, made famous by Ritchie Valens|C|144|s4|All:C_F G
Wild Thing|The Troggs|C|108|s1|All:C_F G_F
Louie Louie|The Kingsmen|C|120|s4|All:C_F Gm_F
Hound Dog|Elvis Presley|C|132|s2|All:C C C C F F C C G F C C
Rock Around the Clock|Bill Haley and His Comets|A|144|s2|All:A A A A D D A A E D A A
Johnny B. Goode|Chuck Berry|A|150|s4|All:A A A A D D A A E D A A
Can't Help Falling in Love|Elvis Presley|C|68|s1|All:C Em Am Am F C G G F G Am F C G C C
Sweet Home Alabama|Lynyrd Skynyrd|G|98|s2|All:D_C G
Bad Moon Rising|Creedence Clearwater Revival|C|120|s2|Verse:C G_F C C;Chorus:F F C C G F C C
Have You Ever Seen the Rain|Creedence Clearwater Revival|C|116|s2|Verse:C C C C G G C C;Chorus:F G C Am F G C C
Knockin' on Heaven's Door|Bob Dylan|G|70|s3|All:G D Am Am G D C C
Learning to Fly|Tom Petty|C|116|s2|All:F C Am G
Sweet Caroline|Neil Diamond|C|126|s2|Verse:C F C G;Chorus:C F F G
Take On Me|a-ha|G|160|s4|All:Am D G C
Hey Ya!|OutKast|G|80|s4|All:G C D E
I Gotta Feeling|The Black Eyed Peas|G|128|s4|All:G C Em C
Wake Me Up|Avicii|Am|124|s3|All:Am F C G
Royals|Lorde|D|85|s1|All:D D C G
Apologize|OneRepublic|Am|118|s1|All:Am F C G
Faded|Alan Walker|Am|90|s1|All:Am F C G
Radioactive|Imagine Dragons|Am|136|s1|All:Am C G D
Demons|Imagine Dragons|C|90|s1|All:C G Am F
Stay With Me|Sam Smith|Am|84|s1|All:Am F C C
All of Me|John Legend|Em|63|s1|Verse:Em C G D;Chorus:G Em Am D
Just the Way You Are|Bruno Mars|C|109|s4|All:C C Am Am F F C C
The Lazy Song|Bruno Mars|C|87|s5|All:C G F F
Uptown Funk|Mark Ronson ft. Bruno Mars|Dm|115|s4|All:Dm7 G7
Cheap Thrills|Sia|Am|90|s2|All:Am F C G
Flowers|Miley Cyrus|Am|118|s2|All:Am Dm G C
Watermelon Sugar|Harry Styles|Dm|95|s3|All:Dm7 Am7 C G
Levitating|Dua Lipa|Am|103|s4|All:Am Em Dm Dm
Blinding Lights|The Weeknd|Dm|171|s4|All:Dm Am C G
Photograph|Ed Sheeran|C|108|s1|All:C Am G F
Thinking Out Loud|Ed Sheeran|C|79|s2|All:C C/E F G
Shape of You|Ed Sheeran|Am|96|s2|All:Am Dm F G
Memories|Maroon 5|C|91|s1|All:C G Am Em F C F G
Girls Like You|Maroon 5|C|125|s2|All:C G Am F
Baby|Justin Bieber|C|130|s4|All:C Am F G
Fight Song|Rachel Platten|C|88|s1|All:C G Am F
Brave|Sara Bareilles|C|92|s4|All:C Am F G
Hall of Fame|The Script|Am|85|s1|All:Am F C G
Waka Waka (This Time for Africa)|Shakira|C|127|s4|All:C G Am F
Wavin' Flag|K'naan|C|76|s2|All:C F Am G
Rolling in the Deep|Adele|Am|105|s4|Verse:Am Em G Em_G;Chorus:Am G F G
Someone Like You|Adele|C|68|s1|Verse:C Em Am F;Chorus:C G Am F
No Woman, No Cry|Bob Marley|C|78|s5|All:C G Am F
One Love|Bob Marley|C|76|s5|All:C G F_C G_C
With or Without You|U2|C|110|s4|All:C G Am F
Let It Go|Idina Menzel, from Frozen|G|137|s1|Verse:Em C D Am;Chorus:G D Em C
A Million Dreams|From The Greatest Showman|C|74|s1|All:C G Am F
This Is Me|From The Greatest Showman|Am|96|s1|All:Am F C G
Lava|From the Pixar short|C|92|s3|All:C G7 F C_G7
The Lion Sleeps Tonight|The Tokens|C|122|s2|All:C F C G
Don't Worry, Be Happy|Bobby McFerrin|C|69|s5|All:C C Dm Dm F F C C
Jambalaya|Hank Williams|C|112|s2|All:C C G7 G7 G7 G7 C C
Achy Breaky Heart|Billy Ray Cyrus|C|120|s2|All:C C C C G G G G
Eye of the Tiger|Survivor|Am|109|s4|Verse:Am F G Am;Chorus:Dm C G G
Best Day of My Life|American Authors|C|100|s4|All:C C F F`;

const STRUMS={
 s1:{n:'Four downs',p:'D-D-D-D-'},
 s2:{n:'Down, down-up',p:'D-DUD-DU'},
 s3:{n:'Island strum',p:'D-DU-UDU'},
 s4:{n:'Eighths',p:'DUDUDUDU'},
 s5:{n:'Reggae chop',p:'--D---D-'},
 s6:{n:'Waltz',p:'D-DUDU'}
};

/* ---------- Chord shapes ---------- */
const UKE={C:'0003',Am:'2000',F:'2010',G:'0232',Dm:'2210',Em:'0432',D:'2220',Bm:'4222',A:'2100','F#m':'2120',Bb:'3211',Gm:'0231',E:'1402','C#m':'1104',
 G7:'0212',C7:'0001',D7:'2223',E7:'1202',A7:'0100',B7:'2322',B:'4322',Eb:'0331',Cm:'0333',Fm:'1013',Dm7:'2213',Am7:'0000',Em7:'0202',Cmaj7:'0002',Ab:'5343','F#':'3121','F#7':'3424','C#7':'1112',Gm7:'0211',Bm7:'2222','F#m7':'2424',Bbm:'3111','C#':'1114'};
const GTR={C:'x32010',Am:'x02210',F:'xx3211',G:'320003',Dm:'xx0231',Em:'022000',D:'xx0232',Bm:'x24432',A:'x02220','F#m':'244222',Bb:'x13331',Gm:'355333',E:'022100','C#m':'x46654',
 G7:'320001',C7:'x32310',D7:'xx0212',E7:'020100',A7:'x02020',B7:'x21202',B:'x24442',Dm7:'xx0211',Am7:'x02010',Em7:'022030',Cmaj7:'x32000',Cm:'x35543',Fm:'133111',Ab:'466544','F#':'244322','C#':'x46664',Eb:'x68886','F#7':'242322','C#7':'x46464',Gm7:'353333',Bm7:'x24232','F#m7':'242222',
 'G (easy)':'xxx003','Em (easy)':'xxx000','C (easy)':'xxx010','G7 (easy)':'xxx001','Am (easy)':'xxx210','D7 (easy)':'xxx212'};

/* ---------- Skill pathways: strand, "I can" statement, where it leads ---------- */
const INSTRUMENTS=[
 {id:'uke',n:'Ukulele',bench:'chords',set:['C','Am','F','G7','G','Em','Dm','D','A','Bm','E7','C7']},
 {id:'guitar',n:'Guitar',bench:'chords',set:['Em (easy)','G (easy)','C (easy)','Am (easy)','Em','Am','C','G','D','A','E','Dm','F','Bm']},
 {id:'piano',n:'Piano',bench:'keys',set:['C','G','F','Am','Dm','Em','D','A']},
 {id:'angklung',n:'Angklung and tuned percussion',bench:'bars'},
 {id:'voice',n:'Voice',bench:'echo'},
 {id:'drums',n:'Drums',bench:'kit'},
 {id:'band',n:'Rock band',bench:'band'}
];
const STRANDS={r:'Rhythm',p:'Pitch',h:'Chords',e:'Play together',c:'Create'};
const PATHS={
 uke:[
  [['r','keep a steady beat with four down strums','tool:metro'],['p','name my four strings: G, C, E, A','tool:tuner:uke'],['h','play C and Am with a clear sound','bench:C'],['e','play a one- or two-chord song','songs:chart:1']],
  [['h','play F and G7 and switch on the beat','bench:F'],['r','read and clap ta and ti-ti rhythms','tool:rhythm'],['p','pick a melody from ukulele tab','songs:mel:1:uke'],['e','play a three-chord song with the backing band','songs:chart:2']],
  [['h','play G, Em and Dm','bench:G'],['r','keep the island strum going','song:the-four-chord-loop'],['e','play a four-chord song from start to finish','songs:chart:3'],['c','write my own four-chord loop','create:chords']],
  [['h','play D, A, Bm and E7','bench:D'],['p','play a Level 3 melody from tab','songs:mel:3:uke'],['e','change the key of a song to suit a singer','songs:chart:4'],['e','hold my part in a band song','inst:band']]
 ],
 guitar:[
  [['p','name my six strings from low to high','tool:tuner:guitar'],['h','play easy Em and easy G on three strings','bench:Em (easy)'],['r','strum four steady downs','tool:metro'],['e','play a one- or two-chord song','songs:chart:1']],
  [['h','play easy C and easy Am, then full Em and Am','bench:C (easy)'],['p','pick a melody from guitar tab','songs:mel:1:gtr'],['r','read and clap ta and ti-ti rhythms','tool:rhythm'],['e','play a three-chord song with the backing band','songs:chart:2']],
  [['h','play full G, C and D','bench:G'],['r','keep down, down-up going while I change chord','song:the-doo-wop-loop'],['e','play a four-chord song from start to finish','songs:chart:3'],['c','write my own chord loop','create:chords']],
  [['h','play A, E, Dm and start on F and Bm','bench:A'],['p','play a Level 3 melody from tab','songs:mel:3:gtr'],['e','play the 12-bar blues','song:12-bar-blues-in-a'],['e','hold my part in a band song','inst:band']]
 ],
 piano:[
  [['p','find C, D and E using the two black keys','game:keys'],['r','keep a steady beat with one hand','tool:metro'],['p','play a three-note song','song:hot-cross'],['p','tell higher from lower','tool:pitch']],
  [['p','play five-finger songs in C position','songs:mel:2:letters'],['p','name notes on the treble staff','game:slide'],['h','play C and G chords with three fingers','bench:C'],['r','read and clap ta and ti-ti rhythms','tool:rhythm']],
  [['h','play F and Am chords and change on the beat','bench:F'],['p','read a Level 3 melody from the staff','songs:mel:3:staff'],['e','play chords for a four-chord song','songs:chart:3'],['c','write a melody in Song Maker','create:song']],
  [['h','play Dm, Em, D and A chords','bench:Dm'],['p','play a Level 4 piece','songs:mel:4:staff'],['e','play keys in a band song','inst:band'],['c','write a chord loop and play a melody over it','create:chords']]
 ],
 angklung:[
  [['r','shake or strike on the beat','tool:metro'],['p','play 1, 2 and 3 (do, re, mi)','bench:'],['p','play a three-note song from numbers','song:hot-cross'],['p','tell higher from lower','tool:pitch']],
  [['p','play the pentatonic notes 1 2 3 5 6','bench:'],['p','play a Level 2 song from numbers','songs:mel:2:numbers'],['r','read and clap ta and ti-ti rhythms','tool:rhythm'],['e','play my note in a two-chord song','song:rasa-sayang']],
  [['p','play the whole scale, 1 up to high 1','bench:'],['p','play a Level 3 song from numbers','songs:mel:3:numbers'],['e','build a chord with two friends (1-3-5)','songs:chart:2'],['p','name solfège by ear','tool:pitch']],
  [['p','play a world melody: Sakura or Mo Li Hua','song:sakura'],['e','play my part in a four-chord song','songs:chart:3'],['c','write a pentatonic melody','create:song'],['r','read rhythms with tika-tika','tool:rhythm']]
 ],
 voice:[
  [['p','echo so and mi in tune','bench:0'],['r','keep the beat while I sing','tool:metro'],['p','sing a so-mi-la song','song:rain-rain'],['p','tell higher from lower','tool:pitch']],
  [['p','echo do, re, mi, so, la patterns','bench:2'],['p','sing a Level 2 song with solfège','songs:mel:2:solfege'],['r','read and clap ta and ti-ti rhythms','tool:rhythm'],['p','name solfège by ear','tool:pitch']],
  [['p','echo patterns from the whole scale','bench:4'],['e','sing a round and hold my part','song:frere-jacques'],['p','sing a Level 3 song with solfège','songs:mel:3:solfege'],['e','sing with a chord backing','songs:chart:3']],
  [['e','sing a round in three groups','song:row-row'],['p','sing a minor melody','song:monsoon-minor'],['e','lead the vocals in a band song','inst:band'],['c','write a melody and sing it','create:song']]
 ],
 drums:[
  [['r','play a steady beat with the click','tool:metro'],['r','name the parts of the kit by sound','bench:'],['r','hear a rhythm and pick how it is written','tool:rhythm'],['r','know how many beats each note lasts','game:values']],
  [['r','play Rock Beat 1','create:beat:rock1'],['r','count 1 and 2 and 3 and 4 and out loud while I play','tool:metro'],['r','tap a rhythm in time with the click','game:tap'],['e','play Rock Beat 1 along with a song','songs:chart:2']],
  [['r','play Rock Beat 2','create:beat:rock2'],['r','play four on the floor','create:beat:four'],['e','keep the beat through a whole four-chord song','songs:chart:3'],['c','build my own groove','create:beat']],
  [['r','play a reggae one drop and a hip-hop beat','create:beat:onedrop'],['r','add a fill at the end of four bars','create:beat:fill'],['e','count the band in and hold the tempo','inst:band'],['c','write a beat for my band\'s song','create:beat']]
 ],
 band:[
  [['e','name each job in a band','bench:'],['e','follow our three band agreements','bench:'],['r','count the band in: 1, 2, 3, 4','tool:metro'],['e','play a one-chord jam together','song:one-chord-jam']],
  [['e','play a two-chord song and stop together','songs:chart:1'],['r','lock in with the drummer','create:beat:rock1'],['h','play my part of the four-chord loop','song:the-four-chord-loop'],['e','listen for who has the melody','songs:chart:2']],
  [['e','play a song with a verse and a chorus','songs:chart:3'],['e','change the key to fit our singer','songs:chart:3'],['h','play the 12-bar blues as a band','song:12-bar-blues-in-c'],['c','plan an intro and an ending','create:chords']],
  [['e','rehearse a song and perform it','songs:chart:4'],['c','write an original with a chord loop and a beat','create:chords'],['c','add a melody to our original','create:song'],['e','give kind, clear feedback to another band','bench:']]
 ]
};
const BAND_ROLES=[
 ['Drums','Keep the tempo steady. Count the band in. Play quieter in verses, bigger in choruses.'],
 ['Bass and low notes','Play the root of each chord on beat 1. Lock in with the kick drum.'],
 ['Guitar and ukulele','Strum the chords. Change on beat 1, even if the strum before it is messy.'],
 ['Keys','Play the chords, or fill the gaps with a short tune when the singer rests.'],
 ['Vocals','Lead the melody. Show the band where the verse and chorus start.'],
 ['Tuned percussion','Double the chord notes or the melody. Short, clear notes cut through best.']
];
const BAND_AGREEMENTS=[
 'Listen, think, act. Follow directions and wait your turn.',
 'Loud only when you need to be. Practice rooms 50%, on stage 100%, hallway 0%.',
 'Be respectful to everyone in the music department.'
];
