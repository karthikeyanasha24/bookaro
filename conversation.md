1
00:00:00,025 --> 00:00:01,938
2008 by the workflow and to each event,

2
00:00:01,938 --> 00:00:03,852
to each log will respond like a trigger

3
00:00:03,852 --> 00:00:05,287
sensitive to interrupt again. Have you

4
00:00:05,287 --> 00:00:06,961
started recording? Yes, it is OK. Yeah.

5
00:00:06,961 --> 00:00:09,113
So yeah, I was saying that right now the

6
00:00:09,113 --> 00:00:10,548
workflow is working properly. It can

7
00:00:10,548 --> 00:00:12,223
takes you from the beginning of the

8
00:00:12,223 --> 00:00:14,136
transaction until the end. So the end of

9
00:00:14,136 --> 00:00:16,049
the transaction is like when the owner or

10
00:00:16,049 --> 00:00:17,838
the current owner. It's for the ownership

11
00:00:17,838 --> 00:00:19,865
of the property profile to the new owner.

12
00:00:19,865 --> 00:00:21,385
And through that workflow logs are

13
00:00:21,385 --> 00:00:23,158
generated. So I was explaining that we

14
00:00:23,158 --> 00:00:24,932
should be using those logs to trigger

15
00:00:24,932 --> 00:00:26,705
conversation between the AI agent and the

16
00:00:26,705 --> 00:00:28,478
user, either the seller or the potential

17
00:00:28,478 --> 00:00:30,758
buyer in both side. And I was saying that

18
00:00:30,758 --> 00:00:32,532
right now we don't have yet this

19
00:00:32,532 --> 00:00:34,021
orchestrator, meaning the. Girl which

20
00:00:34,021 --> 00:00:36,366
will which will say which says that OK to

21
00:00:36,366 --> 00:00:37,929
each event corresponds to that specific

22
00:00:37,929 --> 00:00:39,752
conversation between the user and the AI

23
00:00:39,752 --> 00:00:41,836
agent. I have lined the model in Google

24
00:00:41,836 --> 00:00:43,921
sheet saying OK this is the event and

25
00:00:43,921 --> 00:00:45,484
this is the transaction that the

26
00:00:45,484 --> 00:00:47,047
conversation that this event triggers. I

27
00:00:47,047 --> 00:00:49,391
have put that on an excel sheet. Now this

28
00:00:49,391 --> 00:00:51,788
needs to be developed. And the and we

29
00:00:51,788 --> 00:00:53,955
also need to integrate in this workflow

30
00:00:53,955 --> 00:00:56,121
the AI agent interface because it's not

31
00:00:56,121 --> 00:00:58,598
there yet. Actually let me, I was just

32
00:00:58,598 --> 00:01:01,383
OK, maybe I went too far too soon, but.

33
00:01:02,417 --> 00:01:04,638
Keep in mind that OK the platform is the

34
00:01:04,638 --> 00:01:06,366
LinkedIn of the real estate. You have

35
00:01:06,366 --> 00:01:07,600
property profile, property profile. They

36
00:01:07,600 --> 00:01:09,327
are like you have real estate property

37
00:01:09,327 --> 00:01:11,302
profile. You can see them as the LinkedIn

38
00:01:11,302 --> 00:01:13,030
profile with some real estate with some

39
00:01:13,030 --> 00:01:14,511
social network features like you can

40
00:01:14,511 --> 00:01:15,991
follow real estate property profile. When

41
00:01:15,991 --> 00:01:17,472
you follow that real estate property

42
00:01:17,472 --> 00:01:19,200
profile, it means that you get notified.

43
00:01:19,258 --> 00:01:20,873
Of major events of that real estate

44
00:01:20,873 --> 00:01:22,488
property profile. So let me share my

45
00:01:22,488 --> 00:01:24,333
screen while I explain you so that you

46
00:01:24,333 --> 00:01:25,025
can better understand.

47
00:01:32,267 --> 00:01:34,335
Let me know when you can see my screen.

48
00:01:34,335 --> 00:01:36,173
Yeah, yeah, I can see your screen, Sir.

49
00:01:36,173 --> 00:01:38,011
OK, perfect. So this is the platform. I

50
00:01:38,011 --> 00:01:40,080
have an account so I'm gonna log in. Ohh.

51
00:01:40,080 --> 00:01:41,458
So in this one, I guess.

52
00:01:43,092 --> 00:01:45,467
OK, so I just logged in to the platform.

53
00:01:46,558 --> 00:01:48,052
And so let me take you through the whole

54
00:01:48,052 --> 00:01:49,380
platform and I will explain you on the

55
00:01:49,380 --> 00:01:51,568
go. So here, this is the landing page. On

56
00:01:51,568 --> 00:01:52,980
the landing page here you know you have

57
00:01:52,980 --> 00:01:55,314
this search. Uh, features, So either you

58
00:01:55,314 --> 00:01:56,780
can search for properties that are off

59
00:01:56,780 --> 00:01:58,246
market property that are for rent, that

60
00:01:58,246 --> 00:01:59,711
are for buying and the directory, the

61
00:01:59,711 --> 00:02:01,387
directory, as I told you, is like the

62
00:02:01,387 --> 00:02:02,853
LinkedIn of real estate, meaning like all

63
00:02:02,853 --> 00:02:03,900
property profile, all listed there.

64
00:02:03,900 --> 00:02:05,575
They're not for sale for rent, but they

65
00:02:05,575 --> 00:02:07,250
are still there. And you can, you can

66
00:02:07,250 --> 00:02:08,926
search them so that you can find the

67
00:02:08,926 --> 00:02:10,182
property that match hundred of your

68
00:02:10,182 --> 00:02:12,826
criterion. Then here you see your last

69
00:02:12,826 --> 00:02:14,638
search results. So if you have a saved

70
00:02:14,638 --> 00:02:16,451
search or you have like a preview search,

71
00:02:16,451 --> 00:02:19,285
here you see the result. Then

72
00:02:19,285 --> 00:02:20,926
here like it's some content to explain.

73
00:02:20,926 --> 00:02:22,333
So here nothing special. And this

74
00:02:22,333 --> 00:02:24,210
actually I'm showing it to you, but it

75
00:02:24,210 --> 00:02:26,086
has to be reworked. It's too big, too

76
00:02:26,086 --> 00:02:27,962
many information. So I have to make it

77
00:02:27,962 --> 00:02:29,838
way simpler. Here I have like the message

78
00:02:29,838 --> 00:02:31,480
section, I can exchange message. And here

79
00:02:31,480 --> 00:02:33,590
it's not like a one to one message. I

80
00:02:33,590 --> 00:02:35,467
mean, it's not like a person to person.

81
00:02:35,550 --> 00:02:37,356
Age system to send message to people, you

82
00:02:37,356 --> 00:02:39,162
have to send message to owner of a

83
00:02:39,162 --> 00:02:40,743
property. For instance, I will show you

84
00:02:40,743 --> 00:02:42,775
that later on. But here you see on the

85
00:02:42,775 --> 00:02:44,807
left side you will have the list of the

86
00:02:44,807 --> 00:02:46,387
property that you are interested in and

87
00:02:46,387 --> 00:02:48,419
then you have the chat, you have the. So

88
00:02:48,419 --> 00:02:50,226
you have the property, you have the owner

89
00:02:50,226 --> 00:02:52,032
of the property and then you have the

90
00:02:52,032 --> 00:02:54,059
chat window. Here and this is the way the

91
00:02:54,059 --> 00:02:55,360
message box works, you cannot send

92
00:02:55,360 --> 00:02:57,095
directly a message to a user of the

93
00:02:57,095 --> 00:02:58,179
platform, because users actually they

94
00:02:58,179 --> 00:02:59,480
don't officially exist in the platform,

95
00:02:59,480 --> 00:03:00,997
they don't have profile, you don't know

96
00:03:00,997 --> 00:03:02,515
nothing about them. Because I want them

97
00:03:02,515 --> 00:03:04,249
to remain unknown because I don't want to

98
00:03:04,249 --> 00:03:06,746
put name behind the property. So you

99
00:03:06,746 --> 00:03:07,907
contact people through their property and

100
00:03:07,907 --> 00:03:09,069
the people directly you contact only

101
00:03:09,069 --> 00:03:11,894
owner of properties. OK, yes,

102
00:03:11,894 --> 00:03:14,005
Sir, Yes, Sir, I get it. So you have

103
00:03:14,005 --> 00:03:15,881
already have the website. So I just need

104
00:03:15,881 --> 00:03:17,992
to modify the website or should I need to

105
00:03:17,992 --> 00:03:19,634
develop it from scratch? No, no, just

106
00:03:19,634 --> 00:03:21,041
upgrade, update, add some features that

107
00:03:21,041 --> 00:03:22,918
are missing. So you will be providing the

108
00:03:22,918 --> 00:03:24,794
source code, right? Yes. OK, yes. So let

109
00:03:24,794 --> 00:03:26,670
me continue. So that was the message box

110
00:03:26,670 --> 00:03:28,671
here. It's the plan. Like any other

111
00:03:28,671 --> 00:03:30,041
services in your, like any other sites

112
00:03:30,041 --> 00:03:31,607
platform, you can buy a plan. So it's

113
00:03:31,607 --> 00:03:33,172
like there is like a free chair plan

114
00:03:33,172 --> 00:03:34,543
where you have limited access to the

115
00:03:34,543 --> 00:03:36,108
platform, but still you can play with it.

116
00:03:36,108 --> 00:03:37,479
You can always do anything. But for

117
00:03:37,479 --> 00:03:38,849
instance, if you want to keep working

118
00:03:38,849 --> 00:03:40,023
with the transactional tool that I

119
00:03:40,023 --> 00:03:41,198
mentioned, the workflow, you need at

120
00:03:41,198 --> 00:03:42,568
least a plan. Those prices are like

121
00:03:42,568 --> 00:03:43,938
random prices. Of course, it's not going

122
00:03:43,938 --> 00:03:45,718
to be that. Those prices, but it's still

123
00:03:45,718 --> 00:03:47,305
under development and you see like the

124
00:03:47,305 --> 00:03:49,120
features. So the team, my team is still

125
00:03:49,120 --> 00:03:50,935
working on that. We are not done yet.

126
00:03:50,935 --> 00:03:52,523
Then you have the market insight. Market

127
00:03:52,523 --> 00:03:54,111
insight. Actually, we have a database of

128
00:03:54,111 --> 00:03:55,472
historical transaction. You want to know

129
00:03:55,472 --> 00:03:57,060
what transaction took place in a specific

130
00:03:57,060 --> 00:03:58,874
area in France? You can search it here.

131
00:03:58,874 --> 00:04:00,008
Here you have the professional

132
00:04:00,008 --> 00:04:01,596
repository. You want to find the real

133
00:04:01,596 --> 00:04:03,094
estate agency. The specific location, you

134
00:04:03,094 --> 00:04:05,064
can search it here. Then we have the

135
00:04:05,064 --> 00:04:06,542
Learning Center with two section, written

136
00:04:06,542 --> 00:04:08,513
and video. So the written, it's like a

137
00:04:08,513 --> 00:04:10,483
blog section. So you see like real estate

138
00:04:10,483 --> 00:04:11,715
contents around like ownership, around

139
00:04:11,715 --> 00:04:12,947
renting your property, around financing

140
00:04:12,947 --> 00:04:14,425
your purchase, buying a property. It's

141
00:04:14,425 --> 00:04:16,641
kind of a blog section. OK, Then you have

142
00:04:16,641 --> 00:04:18,119
the Learning Center, but the training

143
00:04:18,119 --> 00:04:19,825
video training section. So it's almost

144
00:04:19,825 --> 00:04:21,827
the same. You have like videos that

145
00:04:21,827 --> 00:04:23,830
explain you, that train you about like

146
00:04:23,830 --> 00:04:25,832
owning or selling a property, like buying

147
00:04:25,832 --> 00:04:27,835
sell, blah, blah. But it's all videos.

148
00:04:27,835 --> 00:04:30,123
OK, Yes, Sir. Then you have services. So

149
00:04:30,123 --> 00:04:32,125
here it's like landing page to explain

150
00:04:32,125 --> 00:04:34,128
the real estate directory as I explained

151
00:04:34,128 --> 00:04:36,869
to you. It's just like you lease the

152
00:04:36,869 --> 00:04:38,188
property so that people can anticipate

153
00:04:38,188 --> 00:04:39,507
their real estate property project 6

154
00:04:39,507 --> 00:04:41,266
months to two years and you see all

155
00:04:41,266 --> 00:04:42,585
existing properties, then you have the

156
00:04:42,585 --> 00:04:44,124
market. The market allows you to sell

157
00:04:44,124 --> 00:04:46,103
your property, but not to show it to the

158
00:04:46,103 --> 00:04:47,861
whole market. You will show it only to

159
00:04:47,861 --> 00:04:49,180
best potential buyers. Other people won't

160
00:04:49,180 --> 00:04:51,159
see it. And then if you don't find a

161
00:04:51,159 --> 00:04:52,902
buyer among the rated A. Then you can

162
00:04:52,902 --> 00:04:54,714
open it to the, to the, to the and then

163
00:04:54,714 --> 00:04:56,345
to the old market. This is what we call

164
00:04:56,345 --> 00:04:57,795
of market sale rental. I will let you

165
00:04:57,795 --> 00:04:59,425
read it later on. I will send you the

166
00:04:59,425 --> 00:05:00,875
link of the platform. Then you have the

167
00:05:00,875 --> 00:05:01,600
peer-to-peer estimation, which is

168
00:05:01,600 --> 00:05:02,868
interesting. You don't want to put your

169
00:05:02,868 --> 00:05:04,137
property inside right away, but still you

170
00:05:04,137 --> 00:05:05,586
want to know how much people would pay

171
00:05:05,586 --> 00:05:07,217
for your property. Then you can put it on

172
00:05:07,217 --> 00:05:07,942
the peer-to-peer estimation. So

173
00:05:07,942 --> 00:05:08,848
peer-to-peer estimation, it means like

174
00:05:08,848 --> 00:05:09,910
people will randomly. Estimate property.

175
00:05:09,910 --> 00:05:11,404
They will see pictures of the property.

176
00:05:11,404 --> 00:05:12,472
They will see title, description,

177
00:05:12,472 --> 00:05:13,753
characteristic and they will see the

178
00:05:13,753 --> 00:05:15,247
price you have set as the reference

179
00:05:15,247 --> 00:05:16,954
price. And then they will say, they will

180
00:05:16,954 --> 00:05:18,235
say if that reference price is

181
00:05:18,235 --> 00:05:19,089
underestimated, appropriate or expensive.

182
00:05:19,089 --> 00:05:20,797
And then they can tell you exactly how

183
00:05:20,797 --> 00:05:22,291
much they would pay for this property.

184
00:05:22,291 --> 00:05:23,785
And then they will give you some

185
00:05:23,785 --> 00:05:24,853
qualitative information like title is

186
00:05:24,853 --> 00:05:26,657
good or the picture is good. About the

187
00:05:26,657 --> 00:05:28,167
design good. Is the location good? And

188
00:05:28,167 --> 00:05:29,894
could they live in? And then they can

189
00:05:29,894 --> 00:05:31,836
give you like a text comment. And this is

190
00:05:31,836 --> 00:05:33,131
what I call a peer-to-peer estimation.

191
00:05:33,131 --> 00:05:35,074
OK, Yes, Sir. And then as the owner of

192
00:05:35,074 --> 00:05:36,369
that specific property that has been

193
00:05:36,369 --> 00:05:37,664
peer-to-peer estimated, you get a report

194
00:05:37,664 --> 00:05:39,390
when you can do some data analysis. And

195
00:05:39,390 --> 00:05:41,117
this will help you first define the right

196
00:05:41,117 --> 00:05:42,628
price for your property, but also improve

197
00:05:42,628 --> 00:05:44,787
your property profile. To make it even

198
00:05:44,787 --> 00:05:46,562
more attractive then the transaction

199
00:05:46,562 --> 00:05:49,521
tool. So this is actually the way

200
00:05:49,521 --> 00:05:51,897
it looks like as the seller. You see

201
00:05:51,897 --> 00:05:53,621
cards, cards for leads. So this one we

202
00:05:53,621 --> 00:05:55,559
see that Lady, we see the status of the

203
00:05:55,559 --> 00:05:56,851
transaction. She shared her interest in

204
00:05:56,851 --> 00:05:58,574
my property. So the next action for me

205
00:05:58,574 --> 00:06:00,513
would be to invite her for a visit here.

206
00:06:00,513 --> 00:06:02,021
I see her financial credibility score. So

207
00:06:02,021 --> 00:06:03,744
she has a financial file and we have

208
00:06:03,744 --> 00:06:05,682
reviewed it and we gave her AB. Then you

209
00:06:05,682 --> 00:06:07,405
see the stages of the sales funnel. So

210
00:06:07,405 --> 00:06:09,011
you will see that. Not moving like

211
00:06:09,011 --> 00:06:10,839
anytime a step is completed you see like

212
00:06:10,839 --> 00:06:12,668
the icon get colored and of course here

213
00:06:12,668 --> 00:06:14,725
the next action I and so on is updated.

214
00:06:15,858 --> 00:06:17,618
You can send directly a message to that

215
00:06:17,618 --> 00:06:19,378
lead. You can consult that lead, you can

216
00:06:19,378 --> 00:06:21,137
invite that lead. So here you have action

217
00:06:21,137 --> 00:06:22,677
button that are that depends on the

218
00:06:22,677 --> 00:06:24,657
status on the next, the status of the of

219
00:06:24,657 --> 00:06:26,416
that lead. Here I mentioned you, the AI

220
00:06:26,416 --> 00:06:28,176
agent that you can discuss with. So here

221
00:06:28,176 --> 00:06:29,716
you can ask him anything. And here

222
00:06:29,716 --> 00:06:31,035
current step training according of the

223
00:06:31,035 --> 00:06:32,575
status of the transaction. Here you see.

224
00:06:32,633 --> 00:06:34,166
Some video content that comes from the

225
00:06:34,166 --> 00:06:35,700
Learning Center of videos that have that

226
00:06:35,700 --> 00:06:37,671
have shown you so here you see like a

227
00:06:37,671 --> 00:06:39,204
video that will give you some tips

228
00:06:39,204 --> 00:06:40,737
according to the next action you will

229
00:06:40,737 --> 00:06:42,708
have to perform. So here it's a visit. So

230
00:06:42,708 --> 00:06:44,898
here you will see a video on how to best

231
00:06:44,898 --> 00:06:46,869
host the visit. OK, yes Sir and I will

232
00:06:46,869 --> 00:06:48,841
let you read this. But here you will see

233
00:06:48,841 --> 00:06:50,525
the features of these. Transaction flow.

234
00:06:52,000 --> 00:06:53,533
So that was the transactional tool. Then

235
00:06:53,533 --> 00:06:55,285
the My Project section here you have the

236
00:06:55,285 --> 00:06:57,037
search alerts. So you can create a new

237
00:06:57,037 --> 00:06:58,789
alert, a new alert. It's like a search.

238
00:06:58,789 --> 00:07:00,760
You create a search and you save it. Then

239
00:07:00,760 --> 00:07:02,292
the property followed. I told you that

240
00:07:02,292 --> 00:07:04,263
you can follow a property. So to follow a

241
00:07:04,263 --> 00:07:05,358
property you create a folder.

242
00:07:07,083 --> 00:07:08,697
And in that folder you see the property

243
00:07:08,697 --> 00:07:09,907
that you have followed. For instance,

244
00:07:09,907 --> 00:07:11,520
here it's a number, but it doesn't make

245
00:07:11,520 --> 00:07:12,932
sense. Like I would say, OK, holiday

246
00:07:12,932 --> 00:07:14,142
vacation, that would be my search,

247
00:07:14,142 --> 00:07:15,756
holiday vacation or like a studio for my

248
00:07:15,756 --> 00:07:17,571
kids who is going to high school. So I

249
00:07:17,571 --> 00:07:18,983
will create that folder and in that

250
00:07:18,983 --> 00:07:20,596
folder I will put all the properties that

251
00:07:20,596 --> 00:07:22,008
I follow for that specific search, like

252
00:07:22,008 --> 00:07:23,017
holiday vacation. These are the

253
00:07:23,017 --> 00:07:24,620
properties that I'm interested in. To buy

254
00:07:24,620 --> 00:07:26,600
as a holiday vacation home. OK, yes Sir.

255
00:07:26,600 --> 00:07:28,084
Then interactive properties there will be

256
00:07:28,084 --> 00:07:29,817
listed. All the property I had an

257
00:07:29,817 --> 00:07:31,549
interaction with, I liked, I followed, I

258
00:07:31,549 --> 00:07:34,024
sent a message to owner and so on so that

259
00:07:34,024 --> 00:07:36,523
I can keep track of them. Rental

260
00:07:36,523 --> 00:07:38,710
application file. So here I'm a renter, I

261
00:07:38,710 --> 00:07:41,171
want to rent the property. I can create a

262
00:07:41,171 --> 00:07:42,538
renter application file either document

263
00:07:42,538 --> 00:07:43,905
based or declarative based. Document

264
00:07:43,905 --> 00:07:46,092
based I can load the document, proof of

265
00:07:46,092 --> 00:07:47,732
identity, salary slips and some other

266
00:07:47,732 --> 00:07:49,373
optional documents. Or it can be

267
00:07:49,373 --> 00:07:51,286
declarative. I don't add document, I just

268
00:07:51,286 --> 00:07:52,927
state some information and based on

269
00:07:52,927 --> 00:07:54,561
these. Other application file we will

270
00:07:54,561 --> 00:07:56,384
calculate your score ABC D to estimate

271
00:07:56,384 --> 00:07:58,208
the seriousness of your profile and of

272
00:07:58,208 --> 00:08:00,292
your project. You have the same with the

273
00:08:00,292 --> 00:08:02,376
file. You want to buy your property so

274
00:08:02,376 --> 00:08:04,721
you can create your by your file so that

275
00:08:04,721 --> 00:08:06,805
it can be reviewed. Is all these features

276
00:08:06,805 --> 00:08:08,368
and functions are already functioning or

277
00:08:08,368 --> 00:08:10,521
should I need to make any changes?The

278
00:08:10,521 --> 00:08:12,013
options here, yeah, you're right, ask the

279
00:08:12,013 --> 00:08:13,292
question. Everything that I've shown you

280
00:08:13,292 --> 00:08:14,997
so far is functioning here for the renter

281
00:08:14,997 --> 00:08:16,489
and the buyer file. The only thing

282
00:08:16,489 --> 00:08:17,981
missing is like for the decorative, it's

283
00:08:17,981 --> 00:08:19,687
not complete yet. You know, like you only

284
00:08:19,687 --> 00:08:21,392
have three items, either you want to buy

285
00:08:21,392 --> 00:08:22,884
alone, two people or like through a

286
00:08:22,884 --> 00:08:24,376
company you want to invest in primary,

287
00:08:24,376 --> 00:08:25,441
secondary rental property, blah. So

288
00:08:25,441 --> 00:08:26,933
they're like maybe 10 to 15 more.

289
00:08:26,992 --> 00:08:28,957
Question to be asked here. So he has to

290
00:08:28,957 --> 00:08:30,704
be completed. OK, but all of the section

291
00:08:30,704 --> 00:08:32,451
that I've shown you so far, they are

292
00:08:32,451 --> 00:08:33,325
already working so then.

293
00:08:35,258 --> 00:08:36,746
Manage real estate transaction. So this

294
00:08:36,746 --> 00:08:38,482
is like the transaction home seeker. So

295
00:08:38,482 --> 00:08:40,218
the this is like the transactional tool

296
00:08:40,218 --> 00:08:41,954
here it's home seeker. So it's like

297
00:08:41,954 --> 00:08:43,442
through this transaction tool I have

298
00:08:43,442 --> 00:08:45,426
shown you like the seller side, this is

299
00:08:45,426 --> 00:08:47,409
what the seller sees here, you know like

300
00:08:47,409 --> 00:08:49,393
we are under my project home seeker. So

301
00:08:49,393 --> 00:08:51,129
this is the transactional flow but by

302
00:08:51,129 --> 00:08:53,490
your side. O here without your real

303
00:08:53,490 --> 00:08:54,878
estate transaction, manage your by your

304
00:08:54,878 --> 00:08:56,728
file. I've shown you the BIOS file seller

305
00:08:56,728 --> 00:08:58,347
file. So this should not be there

306
00:08:58,347 --> 00:08:59,966
actually. So you should only have the

307
00:08:59,966 --> 00:09:01,817
manager by your file. And here you see

308
00:09:01,817 --> 00:09:03,205
the list, one property in your

309
00:09:03,205 --> 00:09:04,824
transaction funnel. So you see the list

310
00:09:04,824 --> 00:09:06,443
of property I'm interested in or I'm

311
00:09:06,443 --> 00:09:08,293
trying to buy. I see the picture, the

312
00:09:08,293 --> 00:09:09,912
title of the property, the location, the

313
00:09:09,912 --> 00:09:11,717
postal code. The statues it's for sale or

314
00:09:11,717 --> 00:09:14,564
no you don't see Not verified. I see the

315
00:09:14,564 --> 00:09:16,249
price and the status of the transaction.

316
00:09:16,249 --> 00:09:17,935
I have shared my interest next, next

317
00:09:17,935 --> 00:09:19,620
action awaiting owner to send a visit

318
00:09:19,620 --> 00:09:21,306
invite person in the pipeline. How many

319
00:09:21,306 --> 00:09:22,751
person are interested in that property

320
00:09:22,751 --> 00:09:24,918
And here are like when you later on the

321
00:09:24,918 --> 00:09:26,603
sales funnel. So here it's like the

322
00:09:26,603 --> 00:09:28,289
visit, the visit took place the property

323
00:09:28,289 --> 00:09:30,757
review the visit, review the offer. Offer

324
00:09:30,757 --> 00:09:33,021
Acceptance the signing date has been set

325
00:09:33,021 --> 00:09:35,608
and here the final sales took place and

326
00:09:35,608 --> 00:09:37,871
here you see action button that depends

327
00:09:37,871 --> 00:09:40,786
on the status. So I can

328
00:09:40,786 --> 00:09:42,114
send message to owner, I can see

329
00:09:42,114 --> 00:09:43,442
transaction history like here I see all

330
00:09:43,442 --> 00:09:44,770
the steps we went through with this

331
00:09:44,770 --> 00:09:46,288
seller. This is this the seller I think

332
00:09:46,288 --> 00:09:47,995
or maybe it's made by, I don't know, it's

333
00:09:47,995 --> 00:09:49,323
something wrong here. But here you see

334
00:09:49,323 --> 00:09:51,031
all the steps like if you have sent the

335
00:09:51,031 --> 00:09:52,169
message, if you sent document requests,

336
00:09:52,169 --> 00:09:53,876
if you shared a request, if you made an

337
00:09:53,876 --> 00:09:55,948
offer, you see everything here. Consider

338
00:09:55,948 --> 00:09:57,602
it means like you want to withdraw your

339
00:09:57,602 --> 00:09:59,256
interest in that property and as I told

340
00:09:59,256 --> 00:10:00,703
you, you see here like current step

341
00:10:00,703 --> 00:10:02,356
training. So you see a video that helps

342
00:10:02,356 --> 00:10:04,010
you on that specific stage. So this is

343
00:10:04,010 --> 00:10:06,961
like the transaction flow for the. For

344
00:10:06,961 --> 00:10:09,452
the home seeker then if we go so

345
00:10:09,452 --> 00:10:12,376
peer-to-peer estimation. When you get

346
00:10:12,376 --> 00:10:14,069
there, first you need to put your

347
00:10:14,069 --> 00:10:15,763
location so that we show you property

348
00:10:15,763 --> 00:10:17,456
that are around you because you cannot

349
00:10:17,456 --> 00:10:19,391
know the price and of the property that

350
00:10:19,391 --> 00:10:21,568
are in the city that you don't even know.

351
00:10:21,568 --> 00:10:22,778
So the peer-to-peer estimation through

352
00:10:22,778 --> 00:10:23,988
the peer-to-peer estimation, only people

353
00:10:23,988 --> 00:10:25,681
who knows the current market can estimate

354
00:10:25,681 --> 00:10:27,858
properties. So me, I live in Paris, so I

355
00:10:27,858 --> 00:10:29,917
will. Probably spell code so that I can

356
00:10:29,917 --> 00:10:31,996
see properties. So as I told you, I see

357
00:10:31,996 --> 00:10:34,946
the pictures. I see the title, the

358
00:10:34,946 --> 00:10:36,043
location, the statues characteristics,

359
00:10:36,043 --> 00:10:38,238
the price, the reference price and then I

360
00:10:38,238 --> 00:10:39,609
can decide either it's expensive,

361
00:10:39,609 --> 00:10:41,529
underestimated and then I can define my

362
00:10:41,529 --> 00:10:44,450
own price I can rate. I can write

363
00:10:44,450 --> 00:10:46,450
advice with owner and I submit. If I

364
00:10:46,450 --> 00:10:47,950
submit another property get displayed. So

365
00:10:47,950 --> 00:10:50,200
there is no more property here. So I see

366
00:10:50,200 --> 00:10:51,950
another OK yes Sir. So that was

367
00:10:51,950 --> 00:10:53,200
peer-to-peer estimation then owner space

368
00:10:53,200 --> 00:10:56,060
I see my properties. Let me show

369
00:10:56,060 --> 00:10:57,989
you, I will show you later on a property

370
00:10:57,989 --> 00:10:59,703
profile so I see my properties. I can

371
00:10:59,703 --> 00:11:02,061
edit, update my property profile. Well,

372
00:11:02,061 --> 00:11:04,874
let me. Show you acrobatic profile.

373
00:11:04,874 --> 00:11:06,122
So property profile, it's command. There

374
00:11:06,122 --> 00:11:07,578
is nothing special here. Yeah, maybe a

375
00:11:07,578 --> 00:11:09,034
few things special. So you see the

376
00:11:09,034 --> 00:11:11,628
pictures. You can share the property. So

377
00:11:11,628 --> 00:11:13,131
it's like e-mail, WhatsApp or whatever

378
00:11:13,131 --> 00:11:15,385
you can edit because it's my own. You can

379
00:11:15,385 --> 00:11:17,389
like the property here there is no, there

380
00:11:17,389 --> 00:11:19,393
is no follow button because it's my own

381
00:11:19,393 --> 00:11:21,397
property. But if you are on someone else

382
00:11:21,397 --> 00:11:23,151
property, you see, you would see the

383
00:11:23,151 --> 00:11:24,403
follow button, the title characteristic,

384
00:11:24,403 --> 00:11:25,906
the descriptions, the price, blah blah,

385
00:11:25,906 --> 00:11:27,786
the characteristic, the gas. The energy

386
00:11:27,786 --> 00:11:29,814
performer, the pricing details, the

387
00:11:29,814 --> 00:11:31,436
investments characteristic, the property

388
00:11:31,436 --> 00:11:34,213
location. Then the good to know

389
00:11:34,213 --> 00:11:35,719
section it's like statistic about my

390
00:11:35,719 --> 00:11:37,226
about the neighborhood of the property

391
00:11:37,226 --> 00:11:39,234
like this is the average price per square

392
00:11:39,234 --> 00:11:40,991
meter in the neighborhood. Same for the

393
00:11:40,991 --> 00:11:42,999
rent number of users who are looking for

394
00:11:42,999 --> 00:11:45,007
a property in this area. Looking for the

395
00:11:45,007 --> 00:11:47,015
exact same type of property in this area.

396
00:11:47,015 --> 00:11:48,521
Property with the terrace. How many

397
00:11:48,521 --> 00:11:50,299
properties are with the. That's in this

398
00:11:50,299 --> 00:11:51,968
area, how many property with the garden

399
00:11:51,968 --> 00:11:53,398
in this neighborhood, a number of

400
00:11:53,398 --> 00:11:55,067
property of that specific type in this

401
00:11:55,067 --> 00:11:56,259
neighborhood and some sections are

402
00:11:56,259 --> 00:11:57,928
missing. We don't see them here because

403
00:11:57,928 --> 00:11:59,597
there were no not added from that

404
00:11:59,597 --> 00:12:01,266
property. But you can add also the

405
00:12:01,266 --> 00:12:02,696
revenues. You see the revenues, the

406
00:12:02,696 --> 00:12:05,542
attractivity or the school. You also have

407
00:12:05,542 --> 00:12:07,236
the expenses, you can share the the

408
00:12:07,236 --> 00:12:08,687
monthly expenses related to that property

409
00:12:08,687 --> 00:12:10,139
like energy, like a home cleaning,

410
00:12:10,139 --> 00:12:11,832
insurance or whatever. Then you have a

411
00:12:11,832 --> 00:12:13,525
timeline. The timeline, it's just like a

412
00:12:13,525 --> 00:12:14,977
social network timeline. Anytime a major

413
00:12:14,977 --> 00:12:16,670
event happened to that property, it got

414
00:12:16,670 --> 00:12:18,363
listed in the timeline. For instance, the

415
00:12:18,363 --> 00:12:20,057
status has changed. Now it's for sale.

416
00:12:20,057 --> 00:12:21,750
You will see it here. The ownership.

417
00:12:21,808 --> 00:12:23,577
Change. You will see it here. New

418
00:12:23,577 --> 00:12:25,093
pictures added, new expenses added, new

419
00:12:25,093 --> 00:12:26,861
revenues added. It will create an event

420
00:12:26,861 --> 00:12:28,377
on the timeline and those timeline

421
00:12:28,377 --> 00:12:29,893
events, they trigger a notification to

422
00:12:29,893 --> 00:12:31,408
people who are following that property.

423
00:12:32,567 --> 00:12:34,583
And of course here you always have a form

424
00:12:34,583 --> 00:12:36,151
where you can contact or share your

425
00:12:36,151 --> 00:12:38,696
interest. To the owner of that property.

426
00:12:38,696 --> 00:12:41,364
So let me go back to. My properties. So

427
00:12:41,364 --> 00:12:43,446
here you see the list of your property.

428
00:12:43,446 --> 00:12:45,528
If you want to edit your property, this

429
00:12:45,528 --> 00:12:47,350
is the way it goes. The status.

430
00:12:49,975 --> 00:12:52,037
That type of property, normally you

431
00:12:52,037 --> 00:12:54,786
shouldn't be able to edit that once you

432
00:12:54,786 --> 00:12:56,848
have set it. The location, the

433
00:12:56,848 --> 00:12:58,223
characteristics, energy, performance, the

434
00:12:58,223 --> 00:13:01,208
pictures. So the one with the

435
00:13:01,208 --> 00:13:03,286
stars is the main pictures. This one. If

436
00:13:03,286 --> 00:13:05,365
I click that it's going to switch the

437
00:13:05,365 --> 00:13:07,352
descriptions. The school? The contacts?

438
00:13:07,352 --> 00:13:09,150
Do you want to share your contact?

439
00:13:16,458 --> 00:13:18,708
And it's interesting because we are

440
00:13:18,708 --> 00:13:20,208
missing some information here.

441
00:13:25,092 --> 00:13:26,400
School. Primary school.

442
00:13:29,150 --> 00:13:31,104
OK, it's here. So here you can add

443
00:13:31,104 --> 00:13:32,570
revenues, expenses, a renovation work you

444
00:13:32,570 --> 00:13:34,280
have performed. You can add them an

445
00:13:34,280 --> 00:13:35,991
external rating as well. For instance, if

446
00:13:35,991 --> 00:13:37,945
you put your property in Airbnb or in

447
00:13:37,945 --> 00:13:39,411
Booking or whatever like real estate

448
00:13:39,411 --> 00:13:41,121
platform and you have ratings there, you

449
00:13:41,121 --> 00:13:42,831
can share them here. This will increase

450
00:13:42,831 --> 00:13:43,808
your property value, OK?

451
00:13:45,650 --> 00:13:47,417
OK, then that was for the property. So

452
00:13:47,417 --> 00:13:49,183
here you can list the property. So you

453
00:13:49,183 --> 00:13:51,171
select the status is it for sale or rent

454
00:13:51,171 --> 00:13:53,158
or you want to list it in the directory?

455
00:13:54,267 --> 00:13:54,775
Umm.

456
00:13:57,700 --> 00:13:58,575
OK.

457
00:14:01,575 --> 00:14:03,149
Here these are the of market, I was

458
00:14:03,149 --> 00:14:04,723
mentioning you, so you said who can see

459
00:14:04,723 --> 00:14:06,100
your property only people with the ABCD

460
00:14:06,100 --> 00:14:07,674
rating or everyone can see it. Then you

461
00:14:07,674 --> 00:14:09,051
see all the characteristics that I have

462
00:14:09,051 --> 00:14:09,642
shared with you.

463
00:14:12,783 --> 00:14:13,508
OK.

464
00:14:15,583 --> 00:14:18,108
Then uh, instead of file as I told you,

465
00:14:18,108 --> 00:14:20,855
it's the same. So when you have a

466
00:14:20,855 --> 00:14:23,750
property, you can. You can have a set

467
00:14:23,750 --> 00:14:25,257
of, you know, like when you set a

468
00:14:25,257 --> 00:14:26,575
property, you need to have some official

469
00:14:26,575 --> 00:14:27,893
documents. If you don't, you won't be

470
00:14:27,893 --> 00:14:29,400
able to sell your property. So here I

471
00:14:29,400 --> 00:14:31,095
will let you create that set of file so

472
00:14:31,095 --> 00:14:32,413
you can Add all those information that

473
00:14:32,413 --> 00:14:33,920
you need and it helps you know exactly

474
00:14:33,920 --> 00:14:35,238
what documents you should have before to

475
00:14:35,238 --> 00:14:36,745
sell your property. So this is what we

476
00:14:36,745 --> 00:14:38,063
call the seller file here. It's the

477
00:14:38,063 --> 00:14:40,218
manager real estate transaction. So here,

478
00:14:40,218 --> 00:14:41,417
you know, like it's a transactional flow.

479
00:14:43,108 --> 00:14:45,829
Here. Import property. Well if

480
00:14:45,829 --> 00:14:48,103
I click the import property it will let

481
00:14:48,103 --> 00:14:50,093
me list my property because for instance

482
00:14:50,093 --> 00:14:52,367
I put my property in some other platform.

483
00:14:53,367 --> 00:14:55,446
And I want to bring them here and I want

484
00:14:55,446 --> 00:14:57,109
to bring the lead here to many other

485
00:14:57,109 --> 00:14:58,357
transaction from that platform. So from

486
00:14:58,357 --> 00:15:00,228
here I can just import a property in the

487
00:15:00,228 --> 00:15:01,683
future. It will be a really important

488
00:15:01,683 --> 00:15:03,346
features. So maybe you will work on that

489
00:15:03,346 --> 00:15:05,010
in the future. But for now, it's just

490
00:15:05,010 --> 00:15:06,257
like you create from scratch your

491
00:15:06,257 --> 00:15:07,713
property. In the future you would enter

492
00:15:07,713 --> 00:15:09,376
the URL of your ads somewhere else and

493
00:15:09,376 --> 00:15:10,782
we'll collect. Grab the information from

494
00:15:10,782 --> 00:15:12,042
there and create your property here.

495
00:15:14,483 --> 00:15:16,763
OK, Yes Sir, here sell along with real

496
00:15:16,763 --> 00:15:17,903
estate professional services. It's

497
00:15:17,903 --> 00:15:19,328
because through this transaction funnel

498
00:15:19,328 --> 00:15:21,323
transaction tool, we will allow you to

499
00:15:21,323 --> 00:15:22,748
buy services from real estate

500
00:15:22,748 --> 00:15:24,173
professionals. So this button normally

501
00:15:24,173 --> 00:15:26,168
should take you to the marketplace where

502
00:15:26,168 --> 00:15:28,448
you can buy those services. This is one

503
00:15:28,448 --> 00:15:30,531
of the features you will work. Because

504
00:15:30,531 --> 00:15:32,178
this is not yet available, I will show

505
00:15:32,178 --> 00:15:34,236
you later on. So here on the left you see

506
00:15:34,236 --> 00:15:35,677
your properties. So you see number of

507
00:15:35,677 --> 00:15:37,118
leads, you see the status of your

508
00:15:37,118 --> 00:15:38,147
properties, the status of your

509
00:15:38,147 --> 00:15:39,382
transaction, either sale or rental, you

510
00:15:39,382 --> 00:15:42,031
see the number of visits booked. So here

511
00:15:42,031 --> 00:15:44,863
there is nothing but. So here managed

512
00:15:44,863 --> 00:15:46,718
visit slots, once you have people in the

513
00:15:46,718 --> 00:15:48,574
flow, you can set your visit slots. Let's

514
00:15:48,574 --> 00:15:50,661
say I want to open the slot for tomorrow.

515
00:15:50,661 --> 00:15:52,517
You select the time slot and you select

516
00:15:52,517 --> 00:15:54,372
the duration. So that on the other side,

517
00:15:54,372 --> 00:15:56,228
on the lead side, this time slot it

518
00:15:56,228 --> 00:15:59,133
breaks into. Several slots of that

519
00:15:59,133 --> 00:16:01,287
specific duration. And you upload

520
00:16:01,287 --> 00:16:02,941
identity proof. This is like one of the

521
00:16:02,941 --> 00:16:04,389
requirements on the French market for to

522
00:16:04,389 --> 00:16:05,836
bring more security and more safety, we

523
00:16:05,836 --> 00:16:07,491
ask either the owner or the leads to

524
00:16:07,491 --> 00:16:09,145
share an ID before being able to visit

525
00:16:09,145 --> 00:16:12,025
the property. OK, yes, I'll send a file.

526
00:16:12,025 --> 00:16:13,648
I've shown you already the set of file

527
00:16:13,648 --> 00:16:15,068
invite lead. Maybe you want to invite

528
00:16:15,068 --> 00:16:16,894
someone who is not a user of the platform

529
00:16:16,894 --> 00:16:18,314
to come to your transaction flow because

530
00:16:18,314 --> 00:16:19,734
you know he is interested in the

531
00:16:19,734 --> 00:16:21,356
property, but you want him, you want to

532
00:16:21,356 --> 00:16:22,979
manage him through that tool. So you put

533
00:16:22,979 --> 00:16:24,602
the e-mail, he got an invite, you can

534
00:16:24,602 --> 00:16:26,225
create an account and then comes to that

535
00:16:26,225 --> 00:16:27,992
flow as a lead and set. Running dates.

536
00:16:29,358 --> 00:16:31,346
So normally those bugs should be should

537
00:16:31,346 --> 00:16:33,334
appear only when you have accepted an

538
00:16:33,334 --> 00:16:35,606
offer. Excuse me, I'm just gonna take a

539
00:16:35,606 --> 00:16:36,458
note of that.

540
00:16:55,933 --> 00:16:58,860
Is the first word right there or is it a

541
00:16:58,860 --> 00:17:00,909
typo? Yes, it's a typo. Signing date

542
00:17:00,909 --> 00:17:02,666
shouldn't be displayed until my husband

543
00:17:02,666 --> 00:17:02,958
identified.

544
00:17:05,625 --> 00:17:05,908
Yes.

545
00:17:12,042 --> 00:17:14,390
OK, so actually so from here you see

546
00:17:14,390 --> 00:17:16,480
like. Cows, cows, cows. And you know,

547
00:17:16,480 --> 00:17:18,238
like those are the cows I have shown you

548
00:17:18,238 --> 00:17:18,433
here.

549
00:17:21,675 --> 00:17:24,070
So you see those guard there? OK, yeah,

550
00:17:24,070 --> 00:17:26,465
we've already this is what you see there

551
00:17:26,465 --> 00:17:28,861
and you have like action button for each

552
00:17:28,861 --> 00:17:31,555
lead. So that was the this is like the

553
00:17:31,555 --> 00:17:33,651
transactional flow. So this is here that

554
00:17:33,651 --> 00:17:36,046
I want to integrate the AI agent that

555
00:17:36,046 --> 00:17:38,142
will provide you guidance at each steps

556
00:17:38,142 --> 00:17:40,315
then. You have the managed peer-to-peer

557
00:17:40,315 --> 00:17:42,127
estimation, so I have shown you like the

558
00:17:42,127 --> 00:17:43,938
side of the one who's gonna perform the

559
00:17:43,938 --> 00:17:45,749
estimation here. This is the side of the

560
00:17:45,749 --> 00:17:47,334
owner. So you're owner of the property.

561
00:17:47,334 --> 00:17:49,145
So here you see your properties. You can

562
00:17:49,145 --> 00:17:51,183
select the one you want to work with, and

563
00:17:51,183 --> 00:17:53,221
then here you can decide to start a new

564
00:17:53,221 --> 00:17:54,353
peer-to-peer estimation campaign. So here

565
00:17:54,353 --> 00:17:56,379
you see your credit. Remainings daily

566
00:17:56,379 --> 00:17:58,348
campaign, 24 hours campaign. You have no

567
00:17:58,348 --> 00:18:01,330
one you have. Command launched. So you

568
00:18:01,330 --> 00:18:03,178
have OK in your plan, you have one for

569
00:18:03,178 --> 00:18:05,026
each type of campaign and you can run it

570
00:18:05,026 --> 00:18:06,668
so you can start the campaign. So to

571
00:18:06,668 --> 00:18:08,311
start the campaign, as I told you, you

572
00:18:08,311 --> 00:18:09,749
said your reference price and you choose

573
00:18:09,749 --> 00:18:11,597
the type of company you want to start. Is

574
00:18:11,597 --> 00:18:13,239
it like the daily, weekly or monthly and

575
00:18:13,239 --> 00:18:16,172
that's it. Here you see the metrics of

576
00:18:16,172 --> 00:18:17,653
your campaign. So for that specific

577
00:18:17,653 --> 00:18:19,133
property, these are the global metrics.

578
00:18:20,008 --> 00:18:21,795
People think the price, the reference

579
00:18:21,795 --> 00:18:22,986
price is appropriate, overestimated,

580
00:18:22,986 --> 00:18:25,908
underestimated. These are the prize given

581
00:18:25,908 --> 00:18:28,652
by people. When they have been asked what

582
00:18:28,652 --> 00:18:30,483
would they pay for their property and

583
00:18:30,483 --> 00:18:32,313
here you see some distribution of price

584
00:18:32,313 --> 00:18:34,144
estimate. So RP it's the reference price.

585
00:18:34,144 --> 00:18:36,498
So it's based on the price people gave to

586
00:18:36,498 --> 00:18:38,067
that property. We tell you like.

587
00:18:39,392 --> 00:18:42,122
That's. So let's take this

588
00:18:42,122 --> 00:18:44,422
one, uh, reference price. People gave a

589
00:18:44,422 --> 00:18:47,050
price up to 5% above reference price. We

590
00:18:47,050 --> 00:18:49,350
say how many people give that and.

591
00:18:50,192 --> 00:18:52,309
The weight is 100% gave a reference price

592
00:18:52,309 --> 00:18:54,690
which is like from O to 5% above your

593
00:18:54,690 --> 00:18:56,543
reference price. 100% went for that. So

594
00:18:56,543 --> 00:18:58,131
you know that probably your reference

595
00:18:58,131 --> 00:19:00,248
price is low, you can increase it, you

596
00:19:00,248 --> 00:19:01,042
get the purpose.

597
00:19:02,983 --> 00:19:05,620
Yes, Sir. OK, then here these are

598
00:19:05,620 --> 00:19:07,881
like the qualitative ratings of the

599
00:19:07,881 --> 00:19:10,518
property O1 star two stars. So this

600
00:19:10,518 --> 00:19:13,155
is like 1*2*3 blah blah. So the

601
00:19:13,155 --> 00:19:15,415
title, it should be the opposite

602
00:19:15,415 --> 00:19:17,819
actually. Reverse. Normally bottom should

603
00:19:17,819 --> 00:19:20,056
be like the 1*2*35 and five star, the one

604
00:19:20,056 --> 00:19:22,044
above here, but they did the opposite so

605
00:19:22,044 --> 00:19:24,032
that you know how people see your titles,

606
00:19:24,032 --> 00:19:26,021
how people see the pictures and blah blah

607
00:19:26,021 --> 00:19:28,009
blah. And here you have the global rate,

608
00:19:28,009 --> 00:19:30,923
the average rate for the title. Here you

609
00:19:30,923 --> 00:19:32,086
see the social interactions generated

610
00:19:32,086 --> 00:19:33,248
through your campaign. Did people

611
00:19:33,248 --> 00:19:34,644
followed your property? Did they like,

612
00:19:34,644 --> 00:19:36,504
did they share it? And how many social

613
00:19:36,504 --> 00:19:38,131
estimation? And then you have the same

614
00:19:38,131 --> 00:19:39,759
data for one specific campaign. So these

615
00:19:39,759 --> 00:19:41,386
are global. So it's like aggregated data

616
00:19:41,386 --> 00:19:43,246
on all your campaigns. And this is for

617
00:19:43,246 --> 00:19:44,874
the campaign number one. For a specific

618
00:19:44,874 --> 00:19:46,269
campaign, same type of information. OK,

619
00:19:46,269 --> 00:19:48,158
Yeah. And normally. You should be able to

620
00:19:48,158 --> 00:19:49,733
see. I don't know where is that.

621
00:19:51,608 --> 00:19:53,690
See all the detailed campaign is not yet

622
00:19:53,690 --> 00:19:53,950
there.

623
00:20:00,767 --> 00:20:02,987
If you click there, it takes you to a

624
00:20:02,987 --> 00:20:04,960
screen where you see a table with all

625
00:20:04,960 --> 00:20:06,441
estimation, with all detailed. OK, Yes,

626
00:20:06,441 --> 00:20:08,414
Sir. So I think that's it. We went

627
00:20:08,414 --> 00:20:09,648
through all existing features, so

628
00:20:09,648 --> 00:20:10,881
everything is there. Everything is

629
00:20:10,881 --> 00:20:12,855
already there. So now I'm going to show

630
00:20:12,855 --> 00:20:15,075
you what needs to be done. OK, Yeah, I

631
00:20:15,075 --> 00:20:17,988
started to note it down. So

632
00:20:17,988 --> 00:20:20,094
you have a document of what you need

633
00:20:20,094 --> 00:20:21,937
already? Sorry. Say again, you have the

634
00:20:21,937 --> 00:20:23,779
document of what you need already. Yes,

635
00:20:23,779 --> 00:20:25,885
OK. Yes. So you're able to share that

636
00:20:25,885 --> 00:20:27,728
with me after this meeting? Yeah, yeah,

637
00:20:27,728 --> 00:20:29,833
sure. So the question here is the on

638
00:20:29,833 --> 00:20:31,676
demand service. The on demand service is

639
00:20:31,676 --> 00:20:33,519
the one I've shown you while talking

640
00:20:33,519 --> 00:20:35,457
about the transaction. I want the seller

641
00:20:35,457 --> 00:20:37,666
or the home seeker to be able to buy

642
00:20:37,666 --> 00:20:39,139
services from real estate agent or

643
00:20:39,139 --> 00:20:40,121
professionals while putting their

644
00:20:40,121 --> 00:20:41,594
property on the market. Actually before

645
00:20:41,594 --> 00:20:43,558
going there let me show you first because

646
00:20:43,558 --> 00:20:45,522
actually there are two type of work needs

647
00:20:45,522 --> 00:20:48,270
to be done. There is like design

648
00:20:48,270 --> 00:20:50,683
and then features so the design update.

649
00:20:52,033 --> 00:20:54,897
As I've shown you. This is

650
00:20:54,897 --> 00:20:56,751
the home page. Yes, ma'am. It's the home.

651
00:20:56,751 --> 00:20:58,606
Yeah. This is the home home section of

652
00:20:58,606 --> 00:21:00,460
the platform. I want to change it because

653
00:21:00,460 --> 00:21:02,547
it's too complex and I don't know why it

654
00:21:02,547 --> 00:21:04,633
is not working now. OK, so this is like

655
00:21:04,633 --> 00:21:06,256
the current home page, OK, non logged

656
00:21:06,256 --> 00:21:08,110
section. I mean, I want to change it

657
00:21:08,110 --> 00:21:09,501
completely because it's not like good

658
00:21:09,501 --> 00:21:10,892
enough. So let me show you.

659
00:21:12,708 --> 00:21:15,029
Landing page. The new non logged section

660
00:21:15,029 --> 00:21:17,350
will look like these screens. There will

661
00:21:17,350 --> 00:21:20,334
be 123-4567 and eight. It will be 8 pages

662
00:21:20,334 --> 00:21:22,987
that you can see while you are not

663
00:21:22,987 --> 00:21:25,864
plugged in. OK, thank you. I have done

664
00:21:25,864 --> 00:21:26,550
the design already.

665
00:21:29,267 --> 00:21:31,011
Actually it does not change that much.

666
00:21:31,011 --> 00:21:33,005
It's almost the same, but I needed to

667
00:21:33,005 --> 00:21:34,750
make it like more like, yeah, so

668
00:21:34,750 --> 00:21:35,996
technically doesn't change anything, but

669
00:21:35,996 --> 00:21:38,239
I want to change a little bit the layout

670
00:21:38,239 --> 00:21:39,983
and the content. So here it's like,

671
00:21:39,983 --> 00:21:41,728
what's our solution going to bring either

672
00:21:41,728 --> 00:21:44,615
for seller or buyer?Would you like

673
00:21:44,615 --> 00:21:46,855
to share this, uh, updated UI link also?

674
00:21:46,855 --> 00:21:49,628
Yes, sure. Yeah, OK. Then here it's like

675
00:21:49,628 --> 00:21:51,367
how it works. Here you have testimony,

676
00:21:51,367 --> 00:21:53,356
here we explain why we are creating the

677
00:21:53,356 --> 00:21:54,350
LinkedIn of real estate.

678
00:21:56,275 --> 00:21:58,460
It allowed to anticipate you have much

679
00:21:58,460 --> 00:22:00,333
more choices and you can create

680
00:22:00,333 --> 00:22:02,518
opportunities. And here it's a FAQ FAQ

681
00:22:02,518 --> 00:22:05,212
most frequently asked question. OK, here

682
00:22:05,212 --> 00:22:06,697
you can navigate through them through

683
00:22:06,697 --> 00:22:08,925
these two arrows. And this is the way it

684
00:22:08,925 --> 00:22:10,658
looks when it's open, when it's closed.

685
00:22:10,658 --> 00:22:12,886
And this is the one we don't see. That's

686
00:22:12,886 --> 00:22:15,114
why it's like a light Gray. And you can

687
00:22:15,114 --> 00:22:16,847
navigate them. OK, Yes, Sir. And then

688
00:22:16,847 --> 00:22:18,332
through blog contents like the learning

689
00:22:18,332 --> 00:22:20,312
centers and well, and then you have the

690
00:22:20,312 --> 00:22:22,405
header with some of those. So that

691
00:22:22,405 --> 00:22:24,468
nothing complicated, it's just to revamp

692
00:22:24,468 --> 00:22:27,329
them. OK, yeah. And then the real

693
00:22:27,329 --> 00:22:29,664
change that I need is like, OK, let me

694
00:22:29,664 --> 00:22:30,183
show you.

695
00:22:32,383 --> 00:22:34,917
You see here, let me log out.

696
00:22:36,125 --> 00:22:37,333
So this is what I see when I'm not

697
00:22:37,333 --> 00:22:39,575
logged. Then I log in.

698
00:22:41,775 --> 00:22:43,708
And this is what I see once I'm logged

699
00:22:43,708 --> 00:22:45,427
in, no changes actually. OK, And this is

700
00:22:45,427 --> 00:22:47,360
that was a mistake I made, you know, like

701
00:22:47,360 --> 00:22:49,294
I want people once they log in to be

702
00:22:49,294 --> 00:22:50,583
embedded, to be like in something.

703
00:22:50,583 --> 00:22:52,087
Actually they're just like, OK, I'm on

704
00:22:52,087 --> 00:22:53,805
the same website and I'm logged in and

705
00:22:53,805 --> 00:22:55,739
that's it. I want them to feel that day

706
00:22:55,739 --> 00:22:57,028
until something special, they enter an

707
00:22:57,028 --> 00:22:58,963
app here, we don't see that. And they are

708
00:22:58,963 --> 00:23:00,531
not good services. You just do the same

709
00:23:00,531 --> 00:23:02,099
thing actually. So here let me show you

710
00:23:02,099 --> 00:23:03,862
what it will look like. More like an app

711
00:23:03,862 --> 00:23:05,800
actually. Uh.

712
00:23:06,642 --> 00:23:08,567
OK, you see that one?

713
00:23:09,475 --> 00:23:11,212
So I don't want to change. Yeah, actually

714
00:23:11,212 --> 00:23:12,732
that content will change because once you

715
00:23:12,732 --> 00:23:14,903
log in, this is what I want you to to

716
00:23:14,903 --> 00:23:16,641
see. Here you have the left menu, just

717
00:23:16,641 --> 00:23:18,161
like on this platform. Everything you see

718
00:23:18,161 --> 00:23:19,898
is here already exists, but in the way

719
00:23:19,898 --> 00:23:20,983
that I've shown you previously.

720
00:23:22,750 --> 00:23:25,406
Yes, I understand. And we need to create

721
00:23:25,406 --> 00:23:27,321
like a dashboard. This is my dashboard. I

722
00:23:27,321 --> 00:23:28,998
can monitor my whole real estate project.

723
00:23:28,998 --> 00:23:30,674
From there I see my property attractivity

724
00:23:30,674 --> 00:23:32,590
like the number of view of my property,

725
00:23:32,590 --> 00:23:34,266
the number of shared, the number of

726
00:23:34,266 --> 00:23:36,182
messages, blah blah blah. I see my saved.

727
00:23:36,182 --> 00:23:39,077
Search your results. I see my

728
00:23:39,077 --> 00:23:40,831
pastor, I see the past transaction that

729
00:23:40,831 --> 00:23:41,833
match my search criterion.

730
00:23:43,883 --> 00:23:45,630
Everything that I'm seeing I'm showing to

731
00:23:45,630 --> 00:23:47,376
you here does exist, but this dashboard

732
00:23:47,376 --> 00:23:50,299
does not exist. Yeah, OK. You wanted it

733
00:23:50,299 --> 00:23:52,270
to look like how you're showing it right

734
00:23:52,270 --> 00:23:53,995
now, right? Yeah, exactly. OK, Yeah, you

735
00:23:53,995 --> 00:23:55,966
see like the new property in your area

736
00:23:55,966 --> 00:23:57,198
that are waiting for peer-to-peer

737
00:23:57,198 --> 00:23:59,169
estimation here you see, you see your own

738
00:23:59,169 --> 00:24:00,154
property, peer-to-peer global metrics

739
00:24:00,154 --> 00:24:02,125
that I have shown you previously. So this

740
00:24:02,125 --> 00:24:03,604
is your property, your characteristic and

741
00:24:03,604 --> 00:24:05,329
this is what people think about your

742
00:24:05,329 --> 00:24:07,229
property. Globally. Then here we show you

743
00:24:07,229 --> 00:24:09,042
the new content in the Learning Center.

744
00:24:11,400 --> 00:24:13,489
Here you see like your rental or your

745
00:24:13,489 --> 00:24:15,057
purchase pipeline, when your property you

746
00:24:15,057 --> 00:24:16,885
have used, how many properties you have

747
00:24:16,885 --> 00:24:18,713
in your pipeline, how many property you

748
00:24:18,713 --> 00:24:20,280
have visited, how many property you

749
00:24:20,280 --> 00:24:21,847
reviewed to how many property you

750
00:24:21,847 --> 00:24:24,464
applied. For rental and here how many

751
00:24:24,464 --> 00:24:26,204
purchase offer you made. So can you hold

752
00:24:26,204 --> 00:24:27,944
on a minute? The charger is getting down.

753
00:24:27,944 --> 00:24:29,467
So I'll get my charger. Yeah, yeah.

754
00:24:53,733 --> 00:24:56,133
OK, so here I was saying like here this

755
00:24:56,133 --> 00:24:58,533
is like your metrics as a seller of a

756
00:24:58,533 --> 00:25:00,400
property or someone trying to rent your

757
00:25:00,400 --> 00:25:02,533
own property. So the number of times he

758
00:25:02,533 --> 00:25:04,133
has been viewed, interest received, the

759
00:25:04,133 --> 00:25:05,467
buyer or renter financial profile,

760
00:25:05,467 --> 00:25:07,067
analyzed, the visit hosted, the visits

761
00:25:07,067 --> 00:25:08,933
that have been reviewed and the purchase

762
00:25:08,933 --> 00:25:11,597
offer. They received and here is the same

763
00:25:11,597 --> 00:25:14,270
but for a landlord. So here it's like

764
00:25:14,270 --> 00:25:16,275
how many application file you received.

765
00:25:22,467 --> 00:25:24,671
OK, you say and that's it. So that's your

766
00:25:24,671 --> 00:25:27,120
dashboard, O. As I told you, I want it to

767
00:25:27,120 --> 00:25:29,079
look like this now, so that once you

768
00:25:29,079 --> 00:25:31,038
logged in, you are like somewhere in the

769
00:25:31,038 --> 00:25:32,752
real app and you understand all the

770
00:25:32,752 --> 00:25:34,467
possibilities that you have, OK, And when

771
00:25:34,467 --> 00:25:36,916
you click here now I put it here, but I

772
00:25:36,916 --> 00:25:39,318
think it's here now, so it's not here. Or

773
00:25:39,318 --> 00:25:41,803
maybe I can keep it, we'll see. But and

774
00:25:41,803 --> 00:25:43,736
everything that is here does exist except

775
00:25:43,736 --> 00:25:45,945
this one on demand real estate pros. So

776
00:25:45,945 --> 00:25:47,878
this has to be developed from scratch,

777
00:25:47,878 --> 00:25:49,811
not from scratch because the user profile

778
00:25:49,811 --> 00:25:52,020
they do exist. We already have Stripe as

779
00:25:52,020 --> 00:25:54,229
the mean of payment, but the logic of

780
00:25:54,229 --> 00:25:56,303
booking a real estate. Gents isn't there

781
00:25:56,303 --> 00:25:58,385
yet, so let me show you what it looks

782
00:25:58,385 --> 00:26:01,145
like. Ah, and there is something else

783
00:26:01,145 --> 00:26:02,649
that is not there yet that I will show

784
00:26:02,649 --> 00:26:05,366
you. On demand OK on company

785
00:26:05,366 --> 00:26:07,454
profile On demand services On demand

786
00:26:07,454 --> 00:26:10,239
agent section OK so put yourself in a

787
00:26:10,239 --> 00:26:12,676
potential seller and you are seeking help

788
00:26:12,676 --> 00:26:14,417
from a real estate agent.

789
00:26:17,608 --> 00:26:19,889
So when you click on I don't know right

790
00:26:19,889 --> 00:26:22,170
here I put it in French, but here it's

791
00:26:22,170 --> 00:26:23,944
like on demand services, find a service.

792
00:26:23,944 --> 00:26:26,479
So here you say I need help to all the

793
00:26:26,479 --> 00:26:27,746
transaction administrative task and +2

794
00:26:27,746 --> 00:26:29,520
means like you have selected two other

795
00:26:29,520 --> 00:26:31,294
options. You said why should the website

796
00:26:31,294 --> 00:26:33,322
needs to be in English or in your

797
00:26:33,322 --> 00:26:35,190
language?I mean actually ideally it would

798
00:26:35,190 --> 00:26:36,789
be both, you know, like since the team

799
00:26:36,789 --> 00:26:38,387
developing the website is in India, I put

800
00:26:38,387 --> 00:26:39,986
them all the content in English so that

801
00:26:39,986 --> 00:26:41,184
they can understand what they are

802
00:26:41,184 --> 00:26:42,383
actually working on. Otherwise it would

803
00:26:42,383 --> 00:26:43,782
be very complicated. But it's gonna be

804
00:26:43,782 --> 00:26:45,380
like French used. The website has to be

805
00:26:45,380 --> 00:26:46,979
in French and everything I have shown you

806
00:26:46,979 --> 00:26:48,577
like on the real platform is in English.

807
00:26:48,577 --> 00:26:50,175
So once they finish, I'll have a huge

808
00:26:50,175 --> 00:26:51,533
walk to. Applies the content.

809
00:26:54,067 --> 00:26:56,406
OK, yeah, yeah. So here you you tell what

810
00:26:56,406 --> 00:26:58,485
type of search of help you are looking

811
00:26:58,485 --> 00:27:01,258
for here the location. And then?

812
00:27:02,042 --> 00:27:04,990
Show the results. And here you see

813
00:27:04,990 --> 00:27:07,269
the agent that that the agent that you

814
00:27:07,269 --> 00:27:09,263
see the services that match your search

815
00:27:09,263 --> 00:27:11,257
and you see who is offering that

816
00:27:11,257 --> 00:27:12,681
services, the experience, years of

817
00:27:12,681 --> 00:27:14,106
experience, number of services they

818
00:27:14,106 --> 00:27:15,530
provided through that platform, the

819
00:27:15,530 --> 00:27:17,809
reviews, the rating. And this is like the

820
00:27:17,809 --> 00:27:19,234
service characteristics. So it's like

821
00:27:19,234 --> 00:27:20,658
estimation, estimate your property value.

822
00:27:20,733 --> 00:27:23,185
You need you need air ones like it's like

823
00:27:23,185 --> 00:27:25,637
a one time services they work in Lil and

824
00:27:25,637 --> 00:27:27,271
around 5:00 and 5:00 kilometers around

825
00:27:27,271 --> 00:27:29,450
deal and it's like 1 estimation only the

826
00:27:29,450 --> 00:27:31,630
price. So here it's like ohh for free

827
00:27:31,630 --> 00:27:33,809
it's like free you can contact them or

828
00:27:33,809 --> 00:27:35,716
you can buy the service directly. These

829
00:27:35,716 --> 00:27:37,704
other services cost €50 this 1300. It's

830
00:27:37,704 --> 00:27:39,714
like pictures, like take pictures of your

831
00:27:39,714 --> 00:27:42,011
property. Same. It's like a a package for

832
00:27:42,011 --> 00:27:44,021
it's like a package 5 kilometers around

833
00:27:44,021 --> 00:27:46,318
Lil and it's 12 pictures included and the

834
00:27:46,318 --> 00:27:48,615
price is €300. If you hit that start,

835
00:27:48,615 --> 00:27:50,913
it's like you like you save that seller

836
00:27:50,913 --> 00:27:52,923
that's real estate agent and it's like

837
00:27:52,923 --> 00:27:54,071
here professional, it's fabricated

838
00:27:54,071 --> 00:27:55,632
professionals. So when you hit the start

839
00:27:55,632 --> 00:27:56,982
the professional that listed here in your

840
00:27:56,982 --> 00:27:59,745
favorite. OK, yes Sir. And that's

841
00:27:59,745 --> 00:28:02,176
it for that screen. So very basic. Then

842
00:28:02,176 --> 00:28:04,607
here I show you what services looks like

843
00:28:04,607 --> 00:28:07,038
when you hit the card, you see more

844
00:28:07,038 --> 00:28:09,960
detail about it. So you see

845
00:28:09,960 --> 00:28:11,943
the Bo, so same information for the real

846
00:28:11,943 --> 00:28:13,679
estate agent, you see the same info,

847
00:28:13,679 --> 00:28:15,166
information for the services. So here

848
00:28:15,166 --> 00:28:17,149
it's like a property visit. You can call,

849
00:28:17,149 --> 00:28:19,628
you can hire that Lady so that she do the

850
00:28:19,628 --> 00:28:21,611
visit on your behalf. So it's like a

851
00:28:21,611 --> 00:28:23,594
package for 10 visits and it's Lil and

852
00:28:23,594 --> 00:28:25,329
around 5 kilometer around Lil and here

853
00:28:25,329 --> 00:28:26,911
these seller. Was explained the services,

854
00:28:26,911 --> 00:28:28,694
what value this service will bring you,

855
00:28:28,694 --> 00:28:30,222
the description of the services, what

856
00:28:30,222 --> 00:28:32,005
will what the deliverable will you get

857
00:28:32,005 --> 00:28:34,043
and how the how the invoicing and the

858
00:28:34,043 --> 00:28:35,571
payment works. Basically it's like on

859
00:28:35,571 --> 00:28:37,864
like on Upwork you pay, I know the open

860
00:28:37,864 --> 00:28:39,647
open connect of Stripe does that. It's

861
00:28:39,647 --> 00:28:41,685
like you pay the services now the money

862
00:28:41,685 --> 00:28:43,816
is kept by the platform. And once the

863
00:28:43,816 --> 00:28:45,330
services has been delivered you can

864
00:28:45,330 --> 00:28:47,097
release the amount. The user released the

865
00:28:47,097 --> 00:28:49,116
amount to the seller. This is what is

866
00:28:49,116 --> 00:28:51,136
explained here. So you have the price tax

867
00:28:51,136 --> 00:28:52,650
included and then you can buy.

868
00:28:54,425 --> 00:28:55,392
OK, Yeah.

869
00:28:57,992 --> 00:29:00,308
Here just to show you, I told you that

870
00:29:00,308 --> 00:29:02,625
you can put some agent has a favorite so

871
00:29:02,625 --> 00:29:04,684
you see all the agent that you have

872
00:29:04,684 --> 00:29:07,675
favorited. Same information,

873
00:29:07,675 --> 00:29:09,875
the allocation, the the location where

874
00:29:09,875 --> 00:29:12,442
they work live, the services that they

875
00:29:12,442 --> 00:29:15,278
offer. Here this is like the

876
00:29:15,278 --> 00:29:17,039
top agent, this is like a A services that

877
00:29:17,039 --> 00:29:18,799
we will sell to the agent. Like if you

878
00:29:18,799 --> 00:29:20,364
want to get the top agent status, maybe

879
00:29:20,364 --> 00:29:22,125
you will pay a little bit more. Yourplan.

880
00:29:24,983 --> 00:29:26,681
Then purchase services. So I have

881
00:29:26,681 --> 00:29:28,379
purchased some services. So it's like

882
00:29:28,379 --> 00:29:30,360
yeah, my purchased services I get the

883
00:29:30,360 --> 00:29:32,624
list of the services that have by the

884
00:29:32,624 --> 00:29:34,605
date. The type of services are the

885
00:29:34,605 --> 00:29:36,586
property because when you buy a services,

886
00:29:36,586 --> 00:29:38,567
you buy it for a specific property.

887
00:29:39,558 --> 00:29:41,656
Here the seller, the reference number of

888
00:29:41,656 --> 00:29:43,754
my purchase, the amount paid and the

889
00:29:43,754 --> 00:29:45,552
status of the services ongoing, consoled,

890
00:29:45,552 --> 00:29:47,350
finished, complete the delivery date and

891
00:29:47,350 --> 00:29:49,148
here it's like the payment status,

892
00:29:49,148 --> 00:29:51,546
payment to the seller status. So this one

893
00:29:51,546 --> 00:29:53,944
is pending and this one has been paid.

894
00:29:53,944 --> 00:29:56,231
This one is pending. So here. It's

895
00:29:56,231 --> 00:29:57,733
written and released the defense or see

896
00:29:57,733 --> 00:29:59,450
the services there. It's maybe there is a

897
00:29:59,450 --> 00:30:00,952
problem you don't want to pay or

898
00:30:00,952 --> 00:30:02,669
whatever. So you sit there and there is

899
00:30:02,669 --> 00:30:04,385
like a form that open and you explain

900
00:30:04,385 --> 00:30:06,102
everything and then we can get in touch

901
00:30:06,102 --> 00:30:07,819
to find the solution between you and the

902
00:30:07,819 --> 00:30:10,752
solution. Once it has been paid, you

903
00:30:10,752 --> 00:30:13,467
can check the invoice. OK. Yes,

904
00:30:13,467 --> 00:30:16,455
Sir. So

905
00:30:16,455 --> 00:30:17,833
that was on the user side.

906
00:30:20,083 --> 00:30:22,913
On. Company

907
00:30:22,913 --> 00:30:24,351
side or real estate agent side? This is

908
00:30:24,351 --> 00:30:25,250
the way it looks like.

909
00:30:30,125 --> 00:30:32,232
No, sorry. On the profile of a real

910
00:30:32,232 --> 00:30:34,075
estate agent, I told you that individual

911
00:30:34,075 --> 00:30:35,655
users they don't have profile, but

912
00:30:35,655 --> 00:30:37,762
company they do have profile. Maybe I can

913
00:30:37,762 --> 00:30:39,342
show you there if I see.

914
00:30:42,783 --> 00:30:45,474
I select friends. Do we have? Yes

915
00:30:45,474 --> 00:30:48,269
so. All right,

916
00:30:48,269 --> 00:30:49,792
this one is empty. There is nothing.

917
00:30:53,842 --> 00:30:55,861
OK. So this is like the property, the

918
00:30:55,861 --> 00:30:58,307
profile of a real estate agency?Agency

919
00:30:58,307 --> 00:30:59,952
information, number of property for sale,

920
00:30:59,952 --> 00:31:02,144
blah blah. So you will see all their

921
00:31:02,144 --> 00:31:03,789
activities here about the agency service

922
00:31:03,789 --> 00:31:05,433
offered, opening hours, team members and

923
00:31:05,433 --> 00:31:07,078
their reviews. Here you see the

924
00:31:07,078 --> 00:31:07,900
properties they have.

925
00:31:11,858 --> 00:31:12,858
That's trained.

926
00:31:16,958 --> 00:31:18,640
Yeah, that's wrong. Yeah, let me note it

927
00:31:18,640 --> 00:31:18,850
down.

928
00:31:40,525 --> 00:31:43,100
OK, so this is like the profile.

929
00:31:44,975 --> 00:31:45,950
The company profile.

930
00:31:51,833 --> 00:31:52,442
And how do you know?

931
00:32:01,108 --> 00:32:02,417
Alright, thank you.

932
00:32:07,808 --> 00:32:09,362
OK. So you've seen the company profile,

933
00:32:09,362 --> 00:32:10,250
so this is that.

934
00:32:13,075 --> 00:32:15,800
And to go back, I need to I want

935
00:32:15,800 --> 00:32:18,524
to add another tab. So you see the three

936
00:32:18,524 --> 00:32:20,340
tabs in four reviews, properties, infer

937
00:32:20,340 --> 00:32:22,762
reviews and properties. So we need to add

938
00:32:22,762 --> 00:32:24,881
the extra services service like app where

939
00:32:24,881 --> 00:32:27,303
you see all the services that the real

940
00:32:27,303 --> 00:32:29,573
estate agent or the company. Have created

941
00:32:29,573 --> 00:32:30,583
it. OK, yeah.

942
00:32:39,975 --> 00:32:41,767
And this is the, the company profile

943
00:32:41,767 --> 00:32:43,815
because you know, like we have, I think

944
00:32:43,815 --> 00:32:45,863
we have two, we have three type of

945
00:32:45,863 --> 00:32:47,400
companies. We have real estate agency,

946
00:32:47,400 --> 00:32:48,936
real estate agents and real estate

947
00:32:48,936 --> 00:32:51,704
hunters. And I

948
00:32:51,704 --> 00:32:53,821
think through that screen, I want to make

949
00:32:53,821 --> 00:32:55,673
some, uh, few changes. Actually, I think

950
00:32:55,673 --> 00:32:58,628
it's only here. Yeah, that's

951
00:32:58,628 --> 00:33:01,107
yeah, that's like a minor change. I want

952
00:33:01,107 --> 00:33:04,084
to. Put the status here so it's few

953
00:33:04,084 --> 00:33:06,614
changes, nothing big. So let me close

954
00:33:06,614 --> 00:33:07,067
that one.

955
00:33:09,358 --> 00:33:11,208
Then umm.

956
00:33:13,600 --> 00:33:16,393
So then for that, uh, on demand

957
00:33:16,393 --> 00:33:19,225
services. Let me show you the way

958
00:33:19,225 --> 00:33:21,063
so I've shown you the way it looks like

959
00:33:21,063 --> 00:33:21,675
for individual user.

960
00:33:28,017 --> 00:33:29,490
I've shown you the way it looks on the

961
00:33:29,490 --> 00:33:30,308
company profile for you there.

962
00:33:32,750 --> 00:33:34,073
Now I'm going to show you the way it

963
00:33:34,073 --> 00:33:34,808
looks like for the company.

964
00:33:38,383 --> 00:33:38,925
So.

965
00:33:44,683 --> 00:33:46,025
So you see this is the company profile

966
00:33:46,025 --> 00:33:47,367
about company blah blah and then you have

967
00:33:47,367 --> 00:33:48,541
a section which is called on demand

968
00:33:48,541 --> 00:33:51,381
services. And there you

969
00:33:51,381 --> 00:33:53,309
see the list of services that you have

970
00:33:53,309 --> 00:33:53,550
created.

971
00:33:56,542 --> 00:33:58,937
Are you back?Hello, sorry for the

972
00:33:58,937 --> 00:33:59,838
interruption. Yeah, sorry for the

973
00:33:59,838 --> 00:34:01,098
interruption, Sir. Yeah, no issue. So I

974
00:34:01,098 --> 00:34:02,539
was saying here, you know like there is

975
00:34:02,539 --> 00:34:03,980
like on the left menu you have the

976
00:34:03,980 --> 00:34:05,240
company profile menu. So of course when

977
00:34:05,240 --> 00:34:06,861
you are at a company, you don't see that.

978
00:34:06,861 --> 00:34:08,662
Here you are a company so you see it. And

979
00:34:08,662 --> 00:34:10,463
if you go to the last item which is on

980
00:34:10,463 --> 00:34:11,724
demand services, then you can manage your

981
00:34:11,724 --> 00:34:13,164
on demand services. So you see the list

982
00:34:13,164 --> 00:34:14,425
of the services that you have created.

983
00:34:14,892 --> 00:34:17,115
The date you created it, the category and

984
00:34:17,115 --> 00:34:18,782
the subcategories or cell. Put your

985
00:34:18,782 --> 00:34:21,005
property in the market and the type of

986
00:34:21,005 --> 00:34:22,672
services visit hosting visit writing ads,

987
00:34:22,672 --> 00:34:24,617
the price, the number of times you've

988
00:34:24,617 --> 00:34:26,284
solved that service, the total turnover

989
00:34:26,284 --> 00:34:27,952
generated through that services and the

990
00:34:27,952 --> 00:34:29,619
status of that services. Active and

991
00:34:29,619 --> 00:34:31,564
active. You can inactivate, you can see

992
00:34:31,564 --> 00:34:33,970
it. You can edit or you can remove it and

993
00:34:33,970 --> 00:34:35,810
here it's to add the new services to

994
00:34:35,810 --> 00:34:38,502
create the services. Then add

995
00:34:38,502 --> 00:34:41,445
a new service screen. It's very basic O

996
00:34:41,445 --> 00:34:43,652
these are the categories of categories.

997
00:34:43,652 --> 00:34:45,858
Services type all the time it's.

998
00:34:47,167 --> 00:34:49,256
The drop down list. So it means that from

999
00:34:49,256 --> 00:34:51,114
the admin side I should have a section

1000
00:34:51,114 --> 00:34:52,971
where I can define which type of services

1001
00:34:52,971 --> 00:34:54,828
can be selected by the company or the

1002
00:34:54,828 --> 00:34:57,612
real estate agent. Location and the

1003
00:34:57,612 --> 00:34:59,844
quantity of that services, the type is it

1004
00:34:59,844 --> 00:35:02,634
like a package or it's like a A1 by one

1005
00:35:02,634 --> 00:35:05,145
basis the price and then you see like the

1006
00:35:05,145 --> 00:35:07,098
the value bring brought that the services

1007
00:35:07,098 --> 00:35:08,773
brings, the description of the services,

1008
00:35:08,773 --> 00:35:10,168
deliverables, payment and invoicing. This

1009
00:35:10,168 --> 00:35:11,842
one won't change, it is fixed.

1010
00:35:13,375 --> 00:35:14,956
You cannot change it because we have the

1011
00:35:14,956 --> 00:35:16,537
platform, we decide the way it works. I

1012
00:35:16,537 --> 00:35:18,118
wanted to keep it here so that's the

1013
00:35:18,118 --> 00:35:19,897
seller has in mind how it works. Then you

1014
00:35:19,897 --> 00:35:21,874
can save it as a draft or you can create

1015
00:35:21,874 --> 00:35:22,467
and activate it.

1016
00:35:26,408 --> 00:35:27,442
Then you have the.

1017
00:35:31,100 --> 00:35:32,892
List of the services that you have sold.

1018
00:35:37,533 --> 00:35:40,144
All of them ongoing finished consult

1019
00:35:40,144 --> 00:35:42,938
and you see. Same information

1020
00:35:42,938 --> 00:35:43,642
that previously.

1021
00:35:46,250 --> 00:35:48,019
So you see the total services that you

1022
00:35:48,019 --> 00:35:49,125
have sold to the users.

1023
00:35:50,892 --> 00:35:52,600
OK. Yes, Sir.

1024
00:35:55,992 --> 00:35:58,893
So. You have seen here the the

1025
00:35:58,893 --> 00:36:00,558
new design. You have seen the feature,

1026
00:36:00,558 --> 00:36:02,460
you have seen the the fronts that needs

1027
00:36:02,460 --> 00:36:04,600
to be updated so the landing page and the

1028
00:36:04,600 --> 00:36:06,502
page that goes for non logged user. You

1029
00:36:06,502 --> 00:36:08,642
have seen the new layout for the menu on

1030
00:36:08,642 --> 00:36:10,544
the left side. You have seen the on

1031
00:36:10,544 --> 00:36:11,971
demand service that needs to be

1032
00:36:11,971 --> 00:36:14,943
implemented. And the

1033
00:36:14,943 --> 00:36:17,881
last major change that I need is like

1034
00:36:17,881 --> 00:36:20,779
the QR code. Months. This

1035
00:36:20,779 --> 00:36:22,516
does not exist yet. It's not complicated,

1036
00:36:22,516 --> 00:36:24,500
but still I think it can be useful.

1037
00:36:25,800 --> 00:36:27,575
I want people. I want to let people.

1038
00:36:29,125 --> 00:36:31,130
Who have put their property on some of

1039
00:36:31,130 --> 00:36:32,885
their marketplace or some of their real

1040
00:36:32,885 --> 00:36:34,890
estate add location to be able to bring

1041
00:36:34,890 --> 00:36:36,895
their leads back to my platform. The easy

1042
00:36:36,895 --> 00:36:39,151
way, the easy way and I thought that this

1043
00:36:39,151 --> 00:36:41,156
easy way would be to allow them, the

1044
00:36:41,156 --> 00:36:43,161
owner to generate a QR code that they

1045
00:36:43,161 --> 00:36:44,665
will place in their ads pictures

1046
00:36:44,665 --> 00:36:47,429
somewhere else. So this is what I'm

1047
00:36:47,429 --> 00:36:49,243
trying to explain here. Create your QR

1048
00:36:49,243 --> 00:36:51,316
code. Add your poster QR code in other

1049
00:36:51,316 --> 00:36:53,513
platforms. People from other platform,

1050
00:36:53,513 --> 00:36:56,508
they just scan it. And then they get to

1051
00:36:56,508 --> 00:36:58,012
my platform where they can see more

1052
00:36:58,012 --> 00:36:59,302
information about your property and where

1053
00:36:59,302 --> 00:37:00,591
they can benefit from the transactional

1054
00:37:00,591 --> 00:37:02,310
tool and everything that we offer on the

1055
00:37:02,310 --> 00:37:04,000
platform. Yes, Sir.

1056
00:37:05,158 --> 00:37:06,700
So you select the property.

1057
00:37:08,683 --> 00:37:10,052
If you don't have a record for that

1058
00:37:10,052 --> 00:37:11,250
property, you hit generate the QR code.

1059
00:37:11,250 --> 00:37:12,619
If you already have one, it's there, you

1060
00:37:12,619 --> 00:37:13,817
can download it, you can see it.

1061
00:37:15,567 --> 00:37:17,221
You can scan. You can count the number of

1062
00:37:17,221 --> 00:37:18,692
times it has been scanned, so it means.

1063
00:37:20,200 --> 00:37:22,295
The QR code should take. I don't know how

1064
00:37:22,295 --> 00:37:24,389
you can do that, but I know it's possible

1065
00:37:24,389 --> 00:37:26,018
like to create like a specific URL

1066
00:37:26,018 --> 00:37:27,648
because each property has its own URL.

1067
00:37:27,648 --> 00:37:29,510
But before taking to that URL, we can

1068
00:37:29,510 --> 00:37:31,604
take the user to a specific URL, then go

1069
00:37:31,604 --> 00:37:33,932
to the final URL so that we can count how

1070
00:37:33,932 --> 00:37:35,561
many times these specific URL has been

1071
00:37:35,561 --> 00:37:37,951
like consulted that's been. I used. I

1072
00:37:37,951 --> 00:37:39,711
don't know if you get my point. The

1073
00:37:39,711 --> 00:37:41,470
purpose is just to do like what Bitly

1074
00:37:41,470 --> 00:37:44,432
does. You know Bitly. No Sir, I'm not

1075
00:37:44,432 --> 00:37:45,758
familiar with that Bitly. You know, like

1076
00:37:45,758 --> 00:37:47,273
it's the URL tracker you want to track

1077
00:37:47,273 --> 00:37:48,788
either URL has been entered or not. Ohh

1078
00:37:48,788 --> 00:37:50,492
yeah, I have used it way long back. So

1079
00:37:50,492 --> 00:37:52,196
yeah. So I want to do almost the same

1080
00:37:52,196 --> 00:37:53,521
like because if you take the user

1081
00:37:53,521 --> 00:37:54,847
directly to the property URL, you won't

1082
00:37:54,847 --> 00:37:56,551
be able to know that it comes from that

1083
00:37:56,551 --> 00:37:57,687
specific channel because any other people

1084
00:37:57,687 --> 00:37:59,013
going to that specific property will use

1085
00:37:59,013 --> 00:38:00,527
that same URL. So what I'm saying is

1086
00:38:00,527 --> 00:38:02,120
that. Record instead of taking to the

1087
00:38:02,120 --> 00:38:03,582
directly to the URL of the property,

1088
00:38:03,582 --> 00:38:05,253
maybe we could take user to like a

1089
00:38:05,253 --> 00:38:06,924
specific URL, then take him to the final

1090
00:38:06,924 --> 00:38:08,804
URL of the property so that we can count

1091
00:38:08,804 --> 00:38:10,266
how many times these specific URL has

1092
00:38:10,266 --> 00:38:12,075
been visited. Yeah, that makes sense.

1093
00:38:13,067 --> 00:38:15,856
So, and that's it for the QR code,

1094
00:38:15,856 --> 00:38:18,297
very basic requirement. So let me check.

1095
00:38:18,297 --> 00:38:19,692
Sorry, let me check.

1096
00:38:43,225 --> 00:38:46,130
OK, so let me go back to the file to

1097
00:38:46,130 --> 00:38:48,164
check. If so on demand services, we've

1098
00:38:48,164 --> 00:38:49,616
discussed that conversational agent into

1099
00:38:49,616 --> 00:38:51,650
the transaction tool. OK, wait, let me.

1100
00:38:52,983 --> 00:38:55,283
Ohh gosh hold I'm going to leave this.

1101
00:38:56,750 --> 00:38:58,358
Let me try to find something.

1102
00:39:04,775 --> 00:39:07,650
It's just system maximum, yes, OK.

1103
00:39:19,042 --> 00:39:21,256
There is something that I need to show

1104
00:39:21,256 --> 00:39:21,533
you.

1105
00:39:25,783 --> 00:39:26,300
No.

1106
00:39:30,567 --> 00:39:33,165
No, yes. So I was like, you know, I

1107
00:39:33,165 --> 00:39:34,608
implement the conversational AI agent

1108
00:39:34,608 --> 00:39:36,918
into the transaction tool. So here I will

1109
00:39:36,918 --> 00:39:39,516
send you that file. So I have one short

1110
00:39:39,516 --> 00:39:41,537
explanation, but I wanted to show you

1111
00:39:41,537 --> 00:39:44,445
that file, that file. Use the

1112
00:39:44,445 --> 00:39:46,820
table that I mentioned earlier that lists

1113
00:39:46,820 --> 00:39:49,194
the trigger events and the action taken

1114
00:39:49,194 --> 00:39:51,908
by the AI agent. So for instance here.

1115
00:39:55,533 --> 00:39:57,556
User, OK, maybe that one we're not going

1116
00:39:57,556 --> 00:39:59,578
to do it we just created an account

1117
00:39:59,578 --> 00:40:01,600
welcome user and inform him on what he

1118
00:40:01,600 --> 00:40:03,622
can get in our platform so for instance,

1119
00:40:03,622 --> 00:40:05,392
that's AI agent once someone has logged

1120
00:40:05,392 --> 00:40:07,161
creating an account and has logged in,

1121
00:40:07,161 --> 00:40:09,183
he's back on the platform then this AI

1122
00:40:09,183 --> 00:40:10,953
agent can dynamically send him a message

1123
00:40:10,953 --> 00:40:13,386
to welcome the user and. From him on the

1124
00:40:13,386 --> 00:40:15,039
features of the platform, the recipients

1125
00:40:15,039 --> 00:40:16,968
of all user frequency, once front content

1126
00:40:16,968 --> 00:40:19,172
context blah blah. So nothing here. So is

1127
00:40:19,172 --> 00:40:22,038
it already trained model Sir?It's a

1128
00:40:22,038 --> 00:40:24,288
trained model, but I mean it's we have.

1129
00:40:24,288 --> 00:40:26,538
OK, yes. And I didn't mention that I

1130
00:40:26,538 --> 00:40:29,392
worked with. With a dev

1131
00:40:29,392 --> 00:40:31,425
we took the open the eye.

1132
00:40:32,308 --> 00:40:34,397
OK, I don't know which one but we were

1133
00:40:34,397 --> 00:40:36,253
like we tried it and it does work

1134
00:40:36,253 --> 00:40:38,341
properly to do what we need to do. Like

1135
00:40:38,341 --> 00:40:40,198
it's a generalist but still it does the

1136
00:40:40,198 --> 00:40:41,822
job properly. Like I didn't mention it

1137
00:40:41,822 --> 00:40:43,910
but I need to write it down. The module

1138
00:40:43,910 --> 00:40:45,535
we have developed allows us to search

1139
00:40:45,535 --> 00:40:46,695
property through natural language. So

1140
00:40:46,695 --> 00:40:48,319
because the platform as I've shown you

1141
00:40:48,319 --> 00:40:50,026
it's APIs. Search property to lease the

1142
00:40:50,026 --> 00:40:51,407
property. So through these models that

1143
00:40:51,407 --> 00:40:52,787
through these modules that we have

1144
00:40:52,787 --> 00:40:54,398
developed, we can say, OK, I'm looking

1145
00:40:54,398 --> 00:40:56,470
for a property in Paris, I'd like it to

1146
00:40:56,470 --> 00:40:58,311
have a terrace, blah blah, blah. And then

1147
00:40:58,311 --> 00:41:00,382
he makes a call to our API and retrieved

1148
00:41:00,382 --> 00:41:01,993
information so it works. There are like

1149
00:41:01,993 --> 00:41:04,064
some work that needs to be done, like to

1150
00:41:04,064 --> 00:41:06,083
narrow it down to make sure that. It

1151
00:41:06,083 --> 00:41:07,533
doesn't talk about anything else that

1152
00:41:07,533 --> 00:41:09,467
than real estate, but still I don't need

1153
00:41:09,467 --> 00:41:11,158
to get like a specific specific training

1154
00:41:11,158 --> 00:41:13,092
for that model because so far with this

1155
00:41:13,092 --> 00:41:14,783
simple version it allows to cover our

1156
00:41:14,783 --> 00:41:15,992
needs here and it's cheap.

1157
00:41:17,858 --> 00:41:19,579
So these are like the first interaction

1158
00:41:19,579 --> 00:41:21,300
we see. They are like very generic.

1159
00:41:23,033 --> 00:41:25,398
If I dive into the file, you don't get

1160
00:41:25,398 --> 00:41:27,237
invited by owner to visit the property.

1161
00:41:27,237 --> 00:41:28,025
So let me.

1162
00:41:29,700 --> 00:41:30,300
Please.

1163
00:41:42,992 --> 00:41:43,517
Hey.

1164
00:41:51,067 --> 00:41:52,594
So for instance trigger event user get

1165
00:41:52,594 --> 00:41:54,122
invited by the owner to visit the

1166
00:41:54,122 --> 00:41:55,432
property interaction purpose. So this is

1167
00:41:55,432 --> 00:41:56,960
like the purpose of the interaction give

1168
00:41:56,960 --> 00:41:58,706
the user the. So give the lead some

1169
00:41:58,706 --> 00:42:00,233
advice on how to prepare a visit.

1170
00:42:02,033 --> 00:42:03,986
So who's going to receive that message?

1171
00:42:03,986 --> 00:42:06,217
The lead frequency just once? So it means

1172
00:42:06,217 --> 00:42:08,727
if he gets invited 7 times for like 7

1173
00:42:08,727 --> 00:42:10,401
different properties, we're not going to

1174
00:42:10,401 --> 00:42:12,632
send him again the same message but to

1175
00:42:12,632 --> 00:42:14,585
the point of the frequency, the prompt

1176
00:42:14,585 --> 00:42:17,560
content. So normally I should send?The

1177
00:42:17,560 --> 00:42:20,442
prompt to my AI module, some contents and

1178
00:42:20,442 --> 00:42:22,603
some context information like here for

1179
00:42:22,603 --> 00:42:24,765
instance, the the prompt content would

1180
00:42:24,765 --> 00:42:27,750
be. I I would

1181
00:42:27,750 --> 00:42:30,292
feel this user will visit

1182
00:42:30,292 --> 00:42:31,817
a property tomorrow.

1183
00:42:32,558 --> 00:42:35,292
Please show. Not with him.

1184
00:42:36,275 --> 00:42:38,537
Your 10 best

1185
00:42:38,537 --> 00:42:40,798
advices to make

1186
00:42:40,798 --> 00:42:43,060
this visit success

1187
00:42:43,060 --> 00:42:45,321
and prepare his

1188
00:42:45,321 --> 00:42:46,075
purchase.

1189
00:42:47,867 --> 00:42:50,271
Please write as if

1190
00:42:50,271 --> 00:42:52,075
you were direct.

1191
00:42:53,692 --> 00:42:56,606
The talking to him so that would be

1192
00:42:56,606 --> 00:42:59,156
the prompt content and this prompt will

1193
00:42:59,156 --> 00:43:01,342
be passed with some context information

1194
00:43:01,342 --> 00:43:03,892
that could be sorry, let me just.

1195
00:43:06,250 --> 00:43:08,540
So so this is. That would be the prompt

1196
00:43:08,540 --> 00:43:10,066
and context information. So lead name

1197
00:43:10,066 --> 00:43:11,867
would be. Cool.

1198
00:43:13,058 --> 00:43:15,900
Uh, property characteristics.

1199
00:43:18,250 --> 00:43:20,979
House with the basement, with the with

1200
00:43:20,979 --> 00:43:23,783
the garden. Square meter.

1201
00:43:26,367 --> 00:43:28,267
Located in Paris.

1202
00:43:30,792 --> 00:43:33,725
Uh state is good.

1203
00:43:35,192 --> 00:43:37,317
Both failed since two months.

1204
00:43:41,342 --> 00:43:44,282
This it happens at

1205
00:43:44,282 --> 00:43:47,281
12:00. So you see, we provide

1206
00:43:47,281 --> 00:43:49,330
the AI module with as much information as

1207
00:43:49,330 --> 00:43:51,635
we can on this event. So the visit that's

1208
00:43:51,635 --> 00:43:53,427
gonna be performed. So that's the AI

1209
00:43:53,427 --> 00:43:54,964
module together with all this information

1210
00:43:54,964 --> 00:43:57,013
can reply to the user saying, OK, great,

1211
00:43:57,013 --> 00:43:58,806
this is what you should absolutely do

1212
00:43:58,806 --> 00:44:00,343
during the visit, ask that specific

1213
00:44:00,343 --> 00:44:01,879
question, blah, blah, blah. And here

1214
00:44:01,879 --> 00:44:03,580
actually expected. And user if through

1215
00:44:03,580 --> 00:44:05,840
the message the AI module will send to

1216
00:44:05,840 --> 00:44:08,101
the user, we expect some action from the

1217
00:44:08,101 --> 00:44:10,644
user, we should also pass it to the AI

1218
00:44:10,644 --> 00:44:12,904
module. In that case, no, there is no

1219
00:44:12,904 --> 00:44:15,516
action expected. But for instance. When

1220
00:44:15,516 --> 00:44:17,903
the user creates an account, user just

1221
00:44:17,903 --> 00:44:20,793
creates an account here. Get

1222
00:44:20,793 --> 00:44:23,007
the user to use the calculator umm for

1223
00:44:23,007 --> 00:44:24,667
instance here the action expected say

1224
00:44:24,667 --> 00:44:26,604
list property or start the first search.

1225
00:44:26,604 --> 00:44:28,818
So meaning that the AI module in the

1226
00:44:28,818 --> 00:44:31,308
prompt he will send to the user, in the

1227
00:44:31,308 --> 00:44:33,521
message he will send to the user should

1228
00:44:33,521 --> 00:44:35,735
also target this action from the user. So

1229
00:44:35,735 --> 00:44:38,703
you get the point. So this is

1230
00:44:38,703 --> 00:44:40,890
the table I was mentioning. So on the

1231
00:44:40,890 --> 00:44:42,803
trigger event here normally you see all

1232
00:44:42,803 --> 00:44:44,717
the actions that are like that. Normally

1233
00:44:44,717 --> 00:44:46,903
I should be adding a current which is

1234
00:44:46,903 --> 00:44:47,450
like log.

1235
00:44:49,725 --> 00:44:51,183
We'll put it after.

1236
00:44:52,742 --> 00:44:54,813
Up there is the trigger event and there

1237
00:44:54,813 --> 00:44:56,885
is the related log. I will ask my

1238
00:44:56,885 --> 00:44:58,698
development team working on it right now

1239
00:44:58,698 --> 00:45:00,770
to fill that column with the related logs

1240
00:45:00,770 --> 00:45:03,359
so that we know what we need to watch to

1241
00:45:03,359 --> 00:45:04,913
monitor as the trigger. Technically here

1242
00:45:04,913 --> 00:45:06,467
this is like business side trigger

1243
00:45:06,467 --> 00:45:08,280
events, but this business event has a

1244
00:45:08,280 --> 00:45:10,555
technical event, so we need to. To, to,

1245
00:45:10,555 --> 00:45:12,585
to, to, to watch these technical events

1246
00:45:12,585 --> 00:45:14,615
to know exactly when we should trigger

1247
00:45:14,615 --> 00:45:15,775
this this workflow here.

1248
00:45:19,483 --> 00:45:22,146
So you get it? Yeah, Yeah. OK,

1249
00:45:22,146 --> 00:45:24,225
perfect. So I think that's all.

1250
00:45:24,975 --> 00:45:25,633
That's all.

1251
00:45:28,542 --> 00:45:30,375
So what have you explained so far? I have

1252
00:45:30,375 --> 00:45:32,004
taken notes, so I'll make a document out

1253
00:45:32,004 --> 00:45:34,041
of it and I'll send it to you. Just make

1254
00:45:34,041 --> 00:45:35,874
sure that we are on the same page. Yeah,

1255
00:45:35,874 --> 00:45:37,708
sure. And I will send you the the recall

1256
00:45:37,708 --> 00:45:39,133
so that you can use it as.
