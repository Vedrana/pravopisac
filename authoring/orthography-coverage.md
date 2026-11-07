# Croatian orthography coverage roadmap

Use this document to select and track future rule-paraphrase batches. It is an
authoring roadmap, not a rule brief, an approved linguistic source, or input to
`draft_question.py --rule`.

## Scope and baseline

Inventory established on 7 November 2026 against the Institute's
[*Hrvatski pravopis*](https://pravopis.hr/pravila/).
The boundary is all its rule sections, not every individual spelling in its
dictionary. The introductory material and glossary are not additional rule
briefs.

At this baseline, 19 briefs have been written:

- One human-approved brief:
  [single-word personal names and surnames](rules/capitalization-personal-names.md).
- Eighteen unreviewed drafts in
  [pull request #10](https://github.com/Vedrana/pravopisac/pull/10), at commit
  `2f28646aae6d58ea795761a70c0d6d1cfb081078`, implementing
  [issue #9](https://github.com/Vedrana/pravopisac/issues/9).
  That pull request was open when this inventory was established; its drafts
  may not be present in a checkout based on `main`.

The 18 drafts cover:

| Area | Existing draft scopes |
| --- | --- |
| Capitalization: 10 briefs | Ordinary sentence beginnings; single-word animal names; single- and multiword settlement names; single- and multiword country names; full street names; full square names; holiday names; simple book titles |
| Punctuation: 6 briefs | Statements ending in a full stop; direct questions ending in a question mark; simple exclamations; commas in simple lists; colons introducing simple lists; basic punctuation spacing |
| Separate writing: 2 briefs | Ordinary `ne` with present-tense verbs, excluding joined negative forms; `li` in ordinary direct verb questions |

The remaining inventory below does not repeat those scopes. It includes
extensions beyond their explicit exclusions. Written coverage and human
approval are separate: the 18 drafts still require linguistic review.

This is a comprehensive inventory of remaining authoring scopes, not a final
count of narrow rule files. A source section can contain several rules,
conditions, and exceptions, while an existing brief usually covers only part
of a section. Do not subtract 19 briefs from 92 source sections to estimate
the remaining work.

## Difficulty and age recommendations

The grade bands are recommended introduction levels, informed by the
[Croatian-language curriculum](https://narodne-novine.nn.hr/clanci/sluzbeni/full/2019_01_10_215.html),
not verified grade alignment or human approval of learner suitability.

| Band | Difficulty criterion |
| --- | --- |
| Grades 2-4 | Familiar vocabulary, concrete distinctions, short sentences, little grammatical terminology |
| Grades 5-6 | Word classes, cases, adjective comparison, verb forms, and straightforward word formation |
| Grades 7-8 | Sentence structure, meaning-dependent choices, interacting rules, and more extensive exceptions |
| Reference-only extension | Specialist conventions needed for complete source coverage, not ordinary grade 7-8 core |

A topic can occur in several bands without duplication. Familiar `č/ć`
spellings belong early; their grammatical patterns and exceptions belong
later. Recommended introduction does not mean that every example or exception
in a source page is suitable for that age.

## Using and maintaining this roadmap

- Select one agreed batch or a clearly identified subset for each delivery.
- Before authoring, compare its exact scopes with the
  [rule-brief index](rules/README.md) and any open authoring pull requests.
  Do not regenerate a brief merely because an unmerged file is absent locally.
- Split batch scopes into narrow, independently reviewable rule files. Keep
  source references and applicable conditions and exceptions with each rule.
- Write original Croatian descriptions, not copied or closely paraphrased
  handbook prose. Source attribution does not grant permission to reproduce
  source text.
- Mark new briefs unreviewed and follow the existing
  [authoring review process](README.md). This roadmap does not approve rules
  or authorize question generation or app publication.
- As briefs are added, update the corresponding entry with file links and the
  exact scope now covered. Keep any remaining subscopes explicit. Track human
  approval separately; do not mark a whole source section complete after
  drafting only a simplified slice.

## Grades 2-4: everyday spelling and writing

The earlier decision deferred authoring of `č/ć`, `dž/đ`, and `ije/je`; it did
not classify them as unsuitable for younger children. They should be separate,
carefully scoped batches.

| Batch | Suggested introduction | Rules or scopes still to paraphrase |
| --- | --- | --- |
| **A1. Letters and basic word division** | 2 | Croatian alphabet and alphabetical order; letter names; distinguishing single letters from the digraphs **dž, lj, nj**; their lowercase, initial-capital, and all-capital forms; basic end-of-line word division; keeping digraphs and **ije** together; not dividing one-syllable words or leaving invalid fragments |
| **A2. Familiar č/ć spellings** | 2-4 | Common words with **č** in their base; common words with **ć** in their base; selected familiar word families; straightforward diminutive and occupation-name patterns; familiar surnames ending in **-ić/-čić**; **ć** in common infinitives ending in **-ći** |
| **A3. Familiar dž/đ spellings** | 2-4 | Common words containing **dž**; common words containing **đ**; selected familiar related words; recognizing that **dž** is a digraph while **đ** is one letter |
| **A4. Familiar ije/je spellings** | 2-4 | Common words written with **ije**; common words written with **je**; selected familiar families with **ije/je/e** alternation; spellings that children must learn as vocabulary rather than derive from their own pronunciation |
| **A5. Remaining everyday capitalization** | 3-4 | Single-word nicknames; straightforward multiword personal names and surnames; multiword animal names; names of continents; familiar rivers, lakes, seas, mountains, islands, and other natural features; familiar school, kindergarten, and library names; newspaper and film titles; book titles containing another proper name; names of peoples and inhabitants; basic possessive adjectives derived from names; lowercase name-derived adjectives in **-ski/-ški/-čki** |
| **A6. Everyday lowercase and text layout** | 2-4 | Days, months, and seasons; ordinary plant, animal-breed, food, and product names; school-subject names versus ordinary references to subjects or languages; simple proper-name/common-word contrasts; headings without a final full stop; picture captions that are labels versus complete sentences; vertical lists of words versus sentences; capitalization and punctuation after a letter's opening greeting; closing greetings and signatures |
| **A7. Everyday numbers and spacing** | 3-4 | Full stops after ordinal numbers; ordinary date notation and spacing; clock-time notation; spaces between numbers and measurement or currency symbols; spaces around simple arithmetic signs; writing ordinary multiword numbers and hundreds; **prvi put**, **tri puta**, and familiar **dvaput/triput** constructions |
| **A8. Familiar word boundaries** | 2-4 | Joined negative forms **nisam, nemam, neću, nemoj** and their ordinary forms; separate writing of familiar compound verb forms; ordinary future-tense spelling, including **-ti** versus **-ći** infinitives before **ću/ćeš...**; familiar preposition-word combinations such as **sa mnom**; joined and separate greetings such as **doviđenja**, **dobar dan**, and **dobro došao** |

**Authoring boundary for A2-A4:** do not invent one universal explanation for
choosing `č/ć` or `ije/je`. A vocabulary-based brief should identify its selected
words or family explicitly. More general patterns belong in the next bands.

## Grades 5-6: grammatical patterns and broader everyday use

| Batch | Rules or scopes still to paraphrase |
| --- | --- |
| **B1. č/ć and dž/đ in word forms** | **č** corresponding to **c/k** in noun forms, adjective comparison, and verb forms; **ć** corresponding to **t** in noun, adjective, and verb forms; **đ** corresponding to **d** in forms and derivatives; **đ** in forms of **naći/proći/ući**; **dž** in the **-džba** pattern; spelling in common noun, adjective, verb, and adverb suffixes; introductory sound-change patterns using familiar examples |
| **B2. j and ije/je in familiar families** | Writing or omitting **j** between vowels; **j** in common imperatives; forms and possessive adjectives of familiar names ending in **-i/-io/-ia**; no inserted **j** in familiar **-ea/-eo** names; no **j** in forms such as **bio/želio**; **ije -> je** in common comparison and derivation patterns; common noun-family and verb-family alternations; **je -> ije** in selected verb forms |
| **B3. Broader capitalization** | Regions and provinces; city districts; parks, avenues, passages, steps, and other places excluded from the street/square briefs; generic geographical descriptors versus parts of names; astronomical names versus ordinary references to sun, moon, or earth; commemorative days excluded from the holiday brief; clubs, teams, artistic groups, and their straightforward nicknames; landmarks, bridges, public buildings, and named transport routes; awards; brands, product models, software, and websites; straightforward respectful **Ti/Vi/Tvoj/Vaš** usage |
| **B4. Nouns and adjectives: together, separately, or hyphenated** | Ordinary compound and prefixed nouns; joined **ne-** with nouns and adjectives; two-noun expressions in which both nouns decline versus hyphenated combinations whose first part does not; indeclinable adjective plus noun; common noun combinations beginning with a letter or abbreviated element; compound adjectives describing one property; adjectives joining equal properties; single shades versus combinations of colours; intensifying expressions such as **sam samcat**; possessive adjectives formed from hyphenated nouns |
| **B5. Pronouns, numbers, and verbs** | Common joined pronouns with **ne-/ni-/i-**; their separate constructions with prepositions; remaining straightforward preposition-pronoun combinations; compound cardinal and ordinal numbers; number-derived nouns and adjectives; fractions written in words; approximate numbers with a hyphen; number-derived forms using digits and suffixes; negative verbs beyond the existing present-tense brief; verbs whose base contains **ne-**; separate compound tenses and moods; joined forms such as **bismo/biste** |
| **B6. Adverbs, prepositions, conjunctions, and interjections** | Common joined adverbs of time, place, and manner; separate adverbial expressions; common meaning contrasts such as **napamet / na pamet**; alternative spellings expressly allowed by the source; joined compound prepositions versus separate prepositional expressions; common joined conjunctions; repeated or paired adverbs; repeated or combined interjections and sound imitations |
| **B7. Abbreviations and numerical notation** | Ordinary abbreviations, their full stops, and spacing; exceptions such as **gđa/gđica**, including their forms; personal initials, including digraph initials; initials of hyphenated names; common acronyms and initialisms, their capitalization and reading; ordinary direction and currency symbols; decimal commas; grouping large numbers and the financial-notation exception; fractions, ratios, percentages, and per-mille spacing; distinguishing clock-time punctuation from ratio punctuation; **@** in email addresses |
| **B8. Punctuation beyond the first batch** | Commas around direct address and interjections; place-and-date headings; commas before **itd./i sl.**, including when not to add one; indirect questions versus direct questions; semicolons between larger units and list items already containing commas; colons introducing explanations and fuller lists; ellipses for unfinished lists, pauses, interruptions, and omitted text; ordinary parentheses; numbered/lettered list labels and right parentheses; basic quotation-mark forms and spacing; marking titles with quotation marks or italics; dashes for ranges, routes, and opposing sides; slashes for alternatives, school years, and parts of a whole |

The distinction between B1/B2 and their later extensions is important:
a child can use a familiar pattern before learning every condition that
governs it.

## Grades 7-8: sentence structure, meaning, and exceptions

| Batch | Rules or scopes still to paraphrase |
| --- | --- |
| **C1. Complete sound-spelling conditions and exceptions** | Voicing assimilation and when it is not recorded in writing; assimilation by place of articulation and its exceptions; consonant loss versus retention; single versus doubled consonants at word-formation boundaries; vowel sequences and restrictions on repeated vowels; more complex **č/ć/đ** verb and derivation patterns, including **sk -> šć** and present verbal adverbs; remaining suffix patterns; loanword spelling patterns; geographical-name variants and foreign patronymics; the full conditions for **ije/je/e**, including traditional exceptions, length-dependent changes, different noun-plural patterns, **pokriveni r**, permitted variants, and cases where **ije** remains unchanged |
| **C2. Complex capitalization and meaning contrasts** | Names with foreign articles, prepositions, and particles; descriptive substitute names for people and places, including when the actual name is also present; collective names for several people or places; literal plural names versus transferred uses; historical states, alliances, and supranational organizations; administrative names and **Grad/grad** distinctions; official institutional names, departments, shortened names, and descriptive replacements; events, festivals, competitions, wars, battles, and revolutions; ordinal numbers that are or are not part of an event's official name; official documents, laws, committees, and their shortened names; complex titles, subtitles, and chapter headings; gods, mythological figures, religious names, communities, and places of worship; official titles versus honorific usage; lowercase religions, adherents, movements, disciplines, historical/geological periods, and descriptive group labels; generalized brands and terms derived from names; the remaining meaning-dependent uppercase/lowercase contrasts |
| **C3. Meaning-dependent word boundaries and complex compounds** | Joined versus separate **god** constructions, such as **tkogod / tko god**, and their adverbial counterparts; emphasis-sensitive **ijedan / i jedan**, **nijedan / ni jedan**, and related contrasts; conjunctions such as **iako** versus separate constructions; **li** outside the existing ordinary verb-question scope; remaining **put/puta/-put** distinctions; less common joined/separate adverb and preposition expressions; compound nouns and adjectives derived from multiword names; possessive versus relational adjectives from compound surnames; adjectives combining names of different people; borrowed prefixes and combining elements; hyphenated verb expressions; replacing a hyphen with a dash when a component contains several words |
| **C4. Commas in sentence structure** | Lists of clauses and repeated conjunctions; independent versus cumulative adjectives; equivalent adverbial expressions; inserted and added explanations; sentence adverbs versus ordinary adverbs and text connectors; apposition and attributes placed after nouns; subordinate clauses before, after, or inside the main clause; restrictive versus explanatory relative clauses; reduced clauses using participles or verbal adverbs; adversative, exclusive, and concluding relationships; causal **pa/te**; comparative **nego/no/nego što** and **ne samo... nego/već**; emphasis, repetition, and resumed sentence elements; explanatory versus alternative **odnosno**; the remaining cases where a comma must not be inserted; changes of meaning caused by comma placement |
| **C5. Direct speech and nested quotation** | Reporting words before the quotation; reporting words after it; reporting words interrupting it; statements versus questions and exclamations in each arrangement; quotations introduced by quotation marks versus dashes; punctuation already present at an interruption point; capitalization of a resumed quotation; embedded quotations that are not direct speech; single quotation marks for a quotation/title inside another quotation and for word meanings; ironic quotation marks |
| **C6. Advanced punctuation and editorial conventions** | **?!** versus **!?**; punctuation-only responses and questioning silence; question/exclamation marks expressing doubt, surprise, or warning, including parenthetical use; punctuation in titles; apostrophes marking omitted material in informal speech; interactions between sentence punctuation, abbreviations, ordinals, quotation marks, and brackets; avoiding duplicate full stops; nested brackets and editorial additions or omissions within quotations; parentheses inside words; more complex slash uses, including verse and stanza boundaries; advanced line-breaking at word-formation boundaries; handling foreign words, names, abbreviations, URLs, and already-hyphenated words at line endings; all-capital text containing lowercase acronym endings |
| **C7. Foreign words and names** | Adapted loanwords versus unadapted foreign words and phrases; their spelling and italics; derivatives from foreign words and names; original spellings of foreign Latin-script names; established Croatian forms of foreign names; ordinary treatment of names from non-Latin scripts; historical and classical names; registered brand spellings; spelling case endings and possessive suffixes from pronunciation rather than appearance; inserted **j**, silent letters, and spelling-preservation exceptions such as names ending in **-ca/-co** |
| **C8. Acronym and initial exceptions** | Hyphenated case endings and derivatives; acronyms pronounced as words versus by letter names; final **-A** retained in writing; inserted **j** depending on pronunciation; acronyms that do not decline; lexicalized acronyms without a hyphen; mixed uppercase/lowercase forms; Latin abbreviation/initialism exceptions; acronym-plus-noun expressions; independent strings of initials and their declined forms |
| **C9. Reading and citing sources** | Standard accent and post-accentual-length marks; length marks that distinguish otherwise identical forms; ordinary footnote markers and their placement; basic author-year-page references in running text; typography for linguistic examples; changing the emphasis style inside already-emphasized text; handwritten alternatives to italics |

## Reference-only extension

Do not force every specialist convention into an eighth-grade learning batch.
These scopes belong in a complete authoring collection but should be labelled
specialist/reference material.

| Batch | Remaining scopes |
| --- | --- |
| **R1. Scientific and linguistic notation** | Specialist bracket conventions for sounds and phonemes; dialect-specific accent marks; asterisks for reconstructed or nonstandard forms; arrows and comparison signs indicating origin, derivation, or a preferred form; notation for bound stems, prefixes, suffixes, and linking elements; Latin biological names and their capitalization/italics; italic physical-quantity symbols versus upright measurement-unit symbols; specialist angular-unit spacing |
| **R2. Legal, professional, and other specialist conventions** | Section/paragraph signs; document classes and reference-number formats; professional and academic abbreviations, their order around names, and signature layout; specialist symbols for chess, clothing sizes, and musical performance; capitalization and hyphenation of major/minor musical-key names |
| **R3. Complete bibliography conventions** | Ordering a bibliography; books with different author/editor arrangements; multiple editions, publishers, and places; journal articles; contributions to collected volumes; web and electronic sources; theses and dissertations; encyclopedia entries; punctuation and page-range conventions specific to references |
| **R4. Scripts and specialist name conversion** | Foreign letters and diacritics, including extended alphabetical ordering; detailed transcription and transliteration systems; specialist treatment of classical names; background on historical and accessibility scripts and school letterforms. Some of this is explanatory reference material rather than an additional spelling rule |

## Source coverage cross-check

This cross-check prevents less prominent chapters from disappearing from the
roadmap. Source-section counts include linked overview pages; they are not
counts of distinct teachable rules.

| Pravopis area | Source sections | Remaining batches |
| --- | --- | --- |
| [Letters](https://pravopis.hr/slova/) | 1 | A1, C6, R4 |
| [Sounds and spelling](https://pravopis.hr/kategorija/glasovi/65/) | 11 | A2-A4, B1-B2, C1, C7 |
| [Capitalization](https://pravopis.hr/kategorija/veliko-i-malo-pocetno-slovo/66/) | 11 | A5-A6, B3, C2, R1-R2 |
| [Together, separately, or hyphenated](https://pravopis.hr/kategorija/sastavljeno-i-nesastavljeno-pisanje/59/) | 25 | A7-A8, B4-B6, C3 |
| [Foreign words and names](https://pravopis.hr/kategorija/pisanje-rijeci-iz-stranih-jezika/48/) | 3 | C7, R4 |
| [Abbreviations, acronyms, initials, symbols](https://pravopis.hr/kategorija/kracenje-rijeci/47/) | 5 | B7, C8, R2 |
| [Punctuation, notation, typography, references](https://pravopis.hr/kategorija/pravopisni-znakovi/46/) | 36 | A1, A6-A7, B7-B8, C4-C6, C9, R1-R3 |
| **Total** | **92** | **29 proposed batches: 25 school-oriented batches and 4 reference extensions** |

Batch headings are organizational, not proposed giant rule files. Each resulting
brief should retain a narrow scope, precise source references, and the applicable
conditions and exceptions.
