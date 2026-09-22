---
title: "To What Extent Do Different News Sources Engage In Media Manipulation Through Headlines?"
author: "Jason R."
publishedAt: 2024-06-01
discipline: "Political Science"
summary: "Scoring 841 headlines from nine American news outlets on objectivity and truthfulness during the opening weeks of the Russia-Ukraine war, this paper finds that while most outlets kept articles largely truthful, objectivity varied widely — with outlets like the Daily Wire relying on emotionally manipulative, editorialized headlines that are technically accurate but designed to provoke a reaction rather than inform."
draft: false
---

The global landscape is changing. The internet is revolutionizing access to information, and we can now learn about unfolding events in unprecedented detail in astoundingly tiny amounts of time. At first, this may seem a blessing. However, it has quickly become a curse where misinformation is easier than ever to spread. Some tout traditional news as a way to avoid online misinformation, however it is far from immune from spreading this misinformation. Luckily, as this problem has risen, solutions have appeared just as quickly: fact-checking websites such as Snopes and Politifact are incredibly valuable resources when it comes to verifying online news. However, they only help with the content of articles; if a headline is misleading or editorialized, these sites will not capture and fact-check it. While this may seem irrelevant, the urgency surrounding the accuracy of headlines comes from a simple fact: most people just skim headlines without reading the article. Around 60% of all articles shared on social media never get clicked on (Gabielkov et al. 2016), especially because people cannot afford to spend time reading every single article that shows up on their social media feeds. This highlights the importance of discussing how misinformation spreads through headlines.

## Method

In this article, I explore headlines by 9 news agencies during the period of February 5–28, 2022, the leadup to the Russian invasion of Ukraine on the 24th of February and the few days following it. I am specifically focusing on American news websites, and will not include news sources from other countries, to allow more consistent terminology when analyzing political ideology; the left in the US is not the same as the left in the UK, India, or Singapore. The news sources I chose are the Associated Press, CNN, Daily Wire, Fox News, MSNBC, National Review, Newsweek, New York Post, and NPR. To balance the political beliefs represented in this sample, I used media bias rankings from AllSides, with one news source described as "left wing", three "leaning left wing", one "center", two described as "leaning right wing", and two "right wing".

The first step after choosing my news sources was to aggregate all the headlines on the Russia-Ukraine crisis in the time period mentioned above from each source. I used the Wayback Machine to get all of these headlines, 841 of which I rated. To automate this process, I used Python to scrape each of the websites, searching for keywords related to Ukraine and Russia in headlines.

Once I had all of the headlines, I classified them based on two criteria: objectivity and truth. Both were on a scale of one to five.

First, on the objectivity scale, one means the headline is entirely editorialized, and five means the headline is entirely objective. An objective headline is considered one which only contains factual information with no opinion inserted, while an editorialized headline is one which contains only opinion and no information. I gave slight penalties to headlines containing a quote with a strong opinion, and if a quotation was not attributed within the headline to a specific person or party, I did not consider it a quote. I will give an example of a headline with low objectivity and one with high objectivity, both from Fox News. An example of a low objectivity headline is "Tucker: Biden has been played by Putin": this headline contains little factual information and only provides the opinion of an analyst on Fox News. A headline with high objectivity may look as such: "Trump weighs in on GOP bill that would block military assistance to Ukraine until US border is secured." The headline only contains a statement of fact — that Trump has weighed in on a bill proposed in Congress — and gives no opinion on Trump or the bill.

The second scale is the truthfulness scale, which I decided to make a purely retrospective metric. This does lead to some articles that were believed to be true at the time being penalized, but genuine belief that an article is true at the time does not reduce the effect of misinformation — intent matters not, only impact. A fully false article with no redeemable truth would be given a 1 on the scale, while a fully true article would get a 5. The same rules about quotations and unattributed quotations apply. To illustrate, I will give examples from the Daily Wire. An example which got a very low score was "Has Putin Already Won The War?", posted around the start of the war. An example which got a high score was "Heartbreaking Footage Shows Ukrainian Nurses Comforting Newborns In Makeshift Bomb Shelter." Note that this headline is editorialized, hence having a low objectivity score, but it has a high truth score because the video that the headline speaks of is real. It is not objective but it is true.

## Analysis of Objectivity

My analysis told me exactly what I expected: modern-day news lacks objectivity. Here's the data for articles about the Russia-Ukraine war:

| Source | Objectivity average | Standard deviation | % below 4 | % below 3 |
|---|---|---|---|---|
| AP | 3.945 | 0.815 | 31.081 | 2.740 |
| CNN | 4.134 | 0.757 | 19.403 | 1.493 |
| Daily Wire | 3.705 | 1.051 | 42.708 | 12.632 |
| Fox News | 3.588 | 0.875 | 46.614 | 9.200 |
| MSNBC | 3.600 | 0.960 | 50.000 | 6.667 |
| National Review | 3.848 | 0.916 | 39.394 | 3.030 |
| Newsweek | 4.040 | 0.840 | 29.600 | 1.613 |
| NY Post | 3.590 | 0.927 | 47.170 | 12.381 |
| NPR | 4.182 | 0.605 | 10.606 | 0.000 |

To some extent, these objectivity levels are concerningly low. NPR is the best source for objectivity by a decent margin (though CNN comes close), which was not too surprising since I personally always viewed NPR as a reliable source of news. CNN definitely surprised me, however: I had always felt CNN was too focused on clicks. This high objectivity could be because the Russia-Ukraine crisis sold itself — there was no need to overly editorialize headlines about the topic since coverage on the war would get clicks regardless of how much it is sensationalized. On the other end, despite the Daily Wire's average objectivity being only 4th worst, it has a high standard deviation indicating there is a large spread, and these fluctuations led me to consider the Daily Wire as the worst of these sources.

Proving this is that 12% of its articles are given an objectivity rating of below 3. The Daily Wire skews its average objectivity upwards by having some good and objective headlines, but purposefully incites interactions for most of its articles through emotional manipulation. Here's one such headline with an objectivity ranking of 2, written on 2022/02/25: "Not A Joke: John Kerry Is Worried War In Ukraine Will Distract World Leaders From Climate Change." This headline is designed to make readers angry. First, it informs readers about someone's apathy towards a dire and serious war. Second, the headline involves a topic that the Daily Wire often uses as an example of a frivolous issue (climate change), which would further anger regular readers. Third, the headline starts with "Not a Joke," implicitly shaming readers if you think the rest of the headline is describing something reasonable. Every part of this headline is crafted to generate an emotional reaction from the reader, which is generally the purpose and the impact of low objectivity in headlines.

## Analysis of Truth

The results for the truthfulness of articles about the Russia-Ukraine war held more interesting results:

| Source | Truth average | Standard deviation | % below 3 | % below 4 |
|---|---|---|---|---|
| AP | 4.603 | 0.795 | 2.740 | 8.108 |
| CNN | 4.507 | 0.766 | 2.985 | 10.448 |
| Daily Wire | 4.168 | 0.930 | 4.211 | 22.917 |
| Fox News | 4.104 | 0.805 | 4.000 | 18.327 |
| MSNBC | 4.300 | 0.646 | 1.667 | 6.667 |
| National Review | 4.288 | 0.576 | 0.000 | 6.061 |
| Newsweek | 4.339 | 0.815 | 4.032 | 13.600 |
| NY Post | 4.181 | 0.818 | 3.810 | 17.925 |
| NPR | 4.515 | 0.588 | 0.000 | 4.545 |

Most noticeably, levels of truth are much higher than levels of objectivity. Only two sources have an objectivity of above 4.1, while all truth levels are above that threshold; many sources have 40–50% of their articles at a 3 or below in objectivity, while the highest percentage of articles at a 3 or below in truth is 23%, with the majority of sources having 10% or less of their articles rated a 3 in truth or lower. The high levels of truth in the news illustrate something important: in an internet era where speed is required and misinformation is rampant, traditional news manages to avoid the shortcomings of social media. Even though the Russia-Ukraine war was rapidly unfolding, likely resulting in tight deadlines for editors and journalists, high levels of truth were still maintained.

Of the sources analyzed, AP News managed to have the highest level of truth, with CNN and NPR practically tied in a somewhat distant second, and the rest long behind them. I would give NPR the tiebreaker over CNN because, despite their nearly identical average truth score, its standard deviation, and consequently the percentage of its articles scoring below 4 and 3, are lower than CNN's. Consistent truth is important; without consistency, there is an onus on the reader to figure out what's true or not, which — for the average person — is an unfair expectation, especially since articles from a seemingly trusted source are assumed to be true.

## Conclusions

News has come remarkably far. The fact that an unfolding conflict like the Russia-Ukraine war, nearly halfway around the world, can be reported mostly accurately by American news in almost real time is remarkable. However, news is also more sensationalist than ever, and the impacts of this are far more harmful than misinformation. Misinformation can be disproven, but sensationalized headlines cannot be, since technically nothing is incorrect. News sources that want to manipulate the public mind have realized that the most effective method of doing so is through sensationalization — they attempt to impact what people feel about certain events and certain actors without lying. There's also a noticeable effect where untruth and sensationalization tends to be on the margins, as we saw with the example of the Daily Wire, where it has a slightly higher objectivity than some other sources but a large number of articles with a low objectivity score. To maintain some credibility, news sources must manage to strike a balance between manipulating people and providing trustworthy and accurate reporting, so as to not be immediately dismissed. I think that reading full articles will never quite go back into style, so we must make sure that news sources remain responsible when it comes to crafting headlines. News sources certainly have the monetary incentive (in generating clicks and thus ad revenue) to sensationalize their headlines, so there must be more accountability in media headline creation.

## Works Cited

- Gabielkov, Maksym, Arthi Ramachandran, Augustin Chaintreau, and Arnaud Legout. "Social Clicks: What and Who Gets Read on Twitter?" ACM SIGMETRICS / IFIP Performance 2016, June 2016, Antibes Juan-les-Pins, France.
- "AllSides Media Bias Ratings." AllSides. Accessed 14 Oct. 2023.
