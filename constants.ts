import { Podcast, Episode } from './types';

// Helper to generate AI image URLs based on content
const getCover = (prompt: string) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cyberpunk futuristic digital art high quality")}?width=400&height=400&nologo=true`;

// Use Robohash set 1 (robots) with transparent background for better UI integration
const getAvatar = (seed: string) => `https://robohash.org/${seed}.png?set=set1&size=300x300`;

// Helper to generate mock episodes
const generateEpisodes = (count: number, topic: string): Episode[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ep-${i + 1}`,
    title: `${topic} - 第 ${i + 1} 章: ${['觉醒', '起源', '共识', '崩塌', '重构', '未来', '奇点', '永生'][i % 8]}`,
    duration: Math.floor(Math.random() * 30) + 15,
    isFree: i < 3 // First 3 episodes are free
  }));
};

// Web3 商业思维 - 完整剧集内容
const web3BusinessEpisodes: Episode[] = [
  {
    id: 'w3b-ep-1',
    title: '商业思维 - 第 1 章: 觉醒',
    duration: 3,
    isFree: true,
    audioText: `欢迎来到 Web3 商业思维第一章：觉醒。
    
在传统的商业世界中，我们习惯了中心化的组织结构。公司有 CEO，有层层管理者，信息从上往下流动。但 Web3 正在改变这一切。

想象一下，一个没有老板的公司，决策由社区投票决定，利润自动分配给所有贡献者。这不是乌托邦，这是 DAO —— 去中心化自治组织。

今天，我们将探讨为什么去中心化不仅仅是技术革命，更是商业模式的根本性变革。当代码成为法律，当智能合约替代法务部门，商业的本质会发生怎样的变化？

这是一个觉醒的时刻。旧世界的规则正在被重写。你准备好了吗？`
  },
  {
    id: 'w3b-ep-2',
    title: '商业思维 - 第 2 章: 起源',
    duration: 3,
    isFree: true,
    audioText: `第二章：起源。让我们回到一切的开始。

2008年，一个化名中本聪的神秘人物发布了比特币白皮书。当时没有人意识到，这九页纸将彻底改变人类对价值和信任的理解。

比特币解决了一个困扰密码学家几十年的问题：如何在不信任的网络中，让陌生人安全地交换价值？答案是区块链 —— 一个不可篡改的分布式账本。

但比特币只是开始。2015年，以太坊的出现带来了智能合约，让区块链从简单的记账工具变成了可编程的世界计算机。

从此，去中心化应用、DeFi、NFT 相继诞生。每一次创新都在证明：我们正在见证一个新商业文明的起源。`
  },
  {
    id: 'w3b-ep-3',
    title: '商业思维 - 第 3 章: 共识',
    duration: 3,
    isFree: true,
    audioText: `第三章：共识。这是区块链世界最核心的概念。

在传统商业中，我们依赖银行、政府、律师来建立信任。但这些中介不仅收取高昂费用，还可能腐败或失败。

区块链用数学和密码学替代了人类中介。通过共识机制，成千上万的节点共同验证每一笔交易，确保没有人能作弊。

工作量证明、权益证明、这些听起来复杂的术语，本质上都在回答同一个问题：如何让互不信任的人达成一致？

当共识不再依赖权威，而是依赖代码，商业合作的边界将被无限扩展。这就是 Web3 商业思维的核心：代码即信任，共识即法律。`
  },
  {
    id: 'w3b-ep-4',
    title: '商业思维 - 第 4 章: 崩塌',
    duration: 4,
    isFree: false,
    audioText: `第四章：崩塌。每一次革命都伴随着旧秩序的瓦解。

2022年，我们见证了 FTX 的崩塌、Luna 的归零、无数项目的跑路。这些灾难让很多人对 Web3 失去信心。

但历史告诉我们，泡沫破裂是新技术成熟的必经之路。互联网泡沫之后，诞生了谷歌、亚马逊、Facebook。每一次崩塌都在清除投机者，留下真正的建设者。

Web3 的崩塌揭示了一个残酷的事实：去中心化的技术，不等于去中心化的治理。代码可以无需信任，但人性永远需要制衡。

真正的 Web3 商业者，会从每一次崩塌中学习，构建更加稳健的系统。这就是抗脆弱性 —— 在混乱中变得更强。`
  },
  {
    id: 'w3b-ep-5',
    title: '商业思维 - 第 5 章: 重构',
    duration: 4,
    isFree: false,
    audioText: `第五章：重构。从废墟中，新的秩序正在形成。

经历了 2022 年的寒冬，Web3 行业开始认真思考：什么才是真正有价值的应用？不是投机的代币，不是 JPEG 图片，而是能解决真实问题的产品。

DeFi 正在重构金融，让全球 17 亿没有银行账户的人也能获得金融服务。NFT 正在重构数字所有权，让创作者能够直接与粉丝连接。DAO 正在重构组织形式，让协作超越地理边界。

但最重要的重构，是思维方式的重构。从 "如何赚快钱" 到 "如何创造价值"，从 "如何吸引用户" 到 "如何服务社区"。

Web3 商业的未来，属于那些真正理解去中心化精神的建设者。`
  }
];

// 赛博朋克 2077 沉思录 - 完整剧集内容
const cyberpunkEpisodes: Episode[] = [
  {
    id: 'cp-ep-1',
    title: '夜之城 - 第 1 章: 觉醒',
    duration: 3,
    isFree: true,
    audioText: `欢迎来到夜之城。这里是赛博朋克 2077 沉思录，第一章：觉醒。

霓虹灯在雨中闪烁，全息广告映照在积水的街道上。在这座永不入睡的城市里，人和机器的界限早已模糊。

赛博朋克，这个诞生于 1980 年代的文学流派，预言了一个高科技、低生活的未来。五十年后的今天，我们惊讶地发现：我们正生活在他们描绘的世界里。

智能手机成为我们身体的延伸，算法决定我们看到什么、相信什么。科技巨头掌握着比政府更多的权力。贫富差距以指数级扩大。

这不是科幻小说，这是 2024 年的现实。当我们凝视夜之城的霓虹，我们看到的是自己的倒影。

觉醒，从认识到这一点开始。`
  },
  {
    id: 'cp-ep-2',
    title: '夜之城 - 第 2 章: 起源',
    duration: 3,
    isFree: true,
    audioText: `第二章：起源。让我们追溯赛博朋克的根源。

1984年，威廉·吉布森写下了《神经漫游者》的第一行字：天空的颜色，如同电视机调到一个死台。这句话开创了一个全新的文学类型。

赛博朋克融合了两个看似矛盾的元素：赛博，代表高科技、网络、人工智能；朋克，代表反叛、边缘、对抗权威。

吉布森创造了 "赛博空间" 这个词，预见了互联网。他描绘的虚拟现实，今天正在 VR 头显中实现。他笔下的人体改造，如今在假肢和脑机接口中成为现实。

为什么赛博朋克如此有预言性？因为它抓住了技术发展的核心矛盾：科技赋予我们超人的能力，但也让我们更容易被控制。

这个矛盾，至今未解。`
  },
  {
    id: 'cp-ep-3',
    title: '夜之城 - 第 3 章: 共识',
    duration: 3,
    isFree: true,
    audioText: `第三章：共识。在夜之城，人们相信什么？

赛博朋克世界有一个残酷的共识：公司就是新的国家，数据就是新的石油，注意力就是新的货币。

在这个共识下，隐私是奢侈品，真相是可定制的，身份可以被买卖。每个人都是一个数据点，被收集、分析、变现。

但赛博朋克的主角们总是试图打破这种共识。他们是黑客、走私者、边缘人。他们相信另一种可能：技术应该解放人，而不是奴役人。

这种反叛精神，与 Web3 的理念不谋而合。去中心化、自我主权、抗审查 —— 这些区块链的核心价值，本质上就是赛博朋克的朋克精神。

也许，打破旧共识、建立新共识的工具，就在我们手中。`
  },
  {
    id: 'cp-ep-4',
    title: '夜之城 - 第 4 章: 崩塌',
    duration: 4,
    isFree: false,
    audioText: `第四章：崩塌。在赛博朋克的世界里，崩塌是常态。

公司帝国一夜之间倒塌，整个街区在暴动中化为灰烬。信息病毒摧毁网络，人体改造失控变成怪物。这是一个脆弱的世界，繁荣的表象下隐藏着无数裂缝。

但正是这种持续的崩塌，造就了赛博朋克独特的美学。废墟上的霓虹灯，残骸中的高科技，绝望里的希望 —— 这种矛盾的组合，形成了令人着迷的视觉语言。

现实世界也是如此。2008 年金融危机、2020 年疫情、2022 年加密寒冬 —— 每一次崩塌都重塑了社会的面貌。

赛博朋克教会我们：不要试图阻止崩塌，而是学会在废墟中生存，在混乱中寻找机会。

这就是夜之城的生存法则：适应，或者灭亡。`
  },
  {
    id: 'cp-ep-5',
    title: '夜之城 - 第 5 章: 重构',
    duration: 4,
    isFree: false,
    audioText: `第五章：重构。从灰烬中，新的秩序正在形成。

赛博朋克 2077 游戏的结局告诉我们：没有完美的选择，只有你愿意承担的代价。每一次重构，都意味着放弃一些旧的东西，拥抱新的可能。

在现实中，我们也在经历重构。AI 正在重构工作的意义，元宇宙正在重构社交的形式，区块链正在重构价值的流动。

但最重要的重构，发生在我们的内心。当技术无限延伸我们的能力，我们如何定义 "人" 的本质？当虚拟和现实的边界消融，我们如何找到自己的锚点？

赛博朋克不提供答案，它只提供问题。而这些问题，值得我们每个人认真思考。

这是夜之城沉思录。我们下期再见。`
  }
];

export const MOCK_PODCASTS: Podcast[] = [
  { 
    id: '1', 
    title: 'Web3 商业思维', 
    description: '探索去中心化世界的商业逻辑与组织形式变革。',
    author: 'DAO_Explorer', 
    listens: 1205, 
    likes: 340, 
    basePrice: 0.01,
    coverUrl: getCover('abstract geometric nodes network blue gold'), 
    avatarUrl: getAvatar('dao_explorer_v2'),
    tags: ['DeFi', '商业'],
    episodes: web3BusinessEpisodes,
    tipEnabled: true,
    minTipAmount: 0.1
  },
  { 
    id: '2', 
    title: '赛博朋克 2077 沉思录', 
    description: '当高科技遇上低生活，我们在数字雨中寻找灵魂的栖息地。',
    author: 'NightCity_Ghost', 
    listens: 890, 
    likes: 210, 
    basePrice: 0.01,
    coverUrl: getCover('neon city rainy night street cyber'), 
    avatarUrl: getAvatar('night_city_ghost_v2'),
    tags: ['科幻', '杂谈'],
    episodes: cyberpunkEpisodes,
    tipEnabled: true,
    minTipAmount: 0.05
  },
  { 
    id: '3', 
    title: 'NFT 的泡沫与未来', 
    description: '从加密朋克到数字确权，一场关于所有权的革命。',
    author: 'Crypto_Punk_OG', 
    listens: 5600, 
    likes: 1200, 
    basePrice: 0.01,
    coverUrl: getCover('colorful 3d pixel art glitched monkey'), 
    avatarUrl: getAvatar('crypto_punk_og_v2'),
    tags: ['NFT', '趋势'],
    episodes: generateEpisodes(10, '数字资产')
  },
  { 
    id: '4', 
    title: '以太坊扩容之路', 
    description: 'Layer2 战争已经打响，谁能成为最终的扩容之王？',
    author: 'Vitalik_Fan', 
    listens: 3400, 
    likes: 800, 
    basePrice: 0.01,
    coverUrl: getCover('ethereum crystal diamond futuristic technology glowing'), 
    avatarUrl: getAvatar('vitalik_fan_v2'),
    tags: ['技术', 'L2'],
    episodes: generateEpisodes(5, '扩容方案')
  },
  { 
    id: '5', 
    title: '元宇宙建筑师日记', 
    description: '我在虚拟世界盖房子的那些年，关于空间与代码的思考。',
    author: 'Voxel_Builder', 
    listens: 450, 
    likes: 120, 
    basePrice: 0.01,
    coverUrl: getCover('virtual reality digital architecture grid neon purple'), 
    avatarUrl: getAvatar('voxel_builder_v2'),
    tags: ['元宇宙', '设计'],
    episodes: generateEpisodes(7, '虚拟建筑')
  },
  { 
    id: '6', 
    title: 'Solana 生态大爆发', 
    description: '高性能公链的崛起与挑战，Rust 语言的魅力。',
    author: 'Rust_Geek', 
    listens: 2300, 
    likes: 670, 
    basePrice: 0.01,
    coverUrl: getCover('fast speed light streak green purple cyber'), 
    avatarUrl: getAvatar('rust_geek_v2'),
    tags: ['公链', '代码'],
    episodes: generateEpisodes(12, '高性能链')
  },
];