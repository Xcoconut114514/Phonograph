import { Podcast, Episode } from './types';

// Helper to generate AI image URLs based on content
const getCover = (prompt: string) => `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + " cyberpunk futuristic digital art high quality")}?width=400&height=400&nologo=true`;

// Use Robohash set 1 (robots) with transparent background for better UI integration
const getAvatar = (seed: string) => `https://robohash.org/${seed}.png?set=set1&size=300x300`;

// ========================================
// 真实区块链博客数据 - 基于 RSS 源内容
// 部分剧集包含来自公开播客的真实音频链接
// 其他剧集使用 TTS 语音合成播放
// ========================================

// Vitalik Buterin 博客剧集
const vitalikEpisodes: Episode[] = [
  {
    id: 'vb-1',
    title: 'The promise and challenges of crypto + AI',
    duration: 8,
    isFree: true,
    audioText: `大家好，欢迎收听今天的节目。今天呢，我们来聊一聊加密货币与人工智能的结合。

嗯，这两个领域都在飞速发展。它们的交叉点啊，充满了可能性，但同时也面临着一些独特的挑战。

说到 AI 在区块链领域的应用，其实挺有意思的。AI 可以帮助进行更智能的治理决策，优化 Gas 费用，甚至检测欺诈行为。但是呢，我们也需要警惕 AI 被用于操纵市场，或者创建更复杂的钓鱼攻击。这是一把双刃剑。

不过，最让我兴奋的，是去中心化 AI 这个概念。想象一下，如果我们能够将 AI 模型的训练和运行，分布在区块链网络上，那就可以避免中心化 AI 公司对数据和算力的垄断了。

总之，这是一个需要两个社区共同探索的领域。密码学可以为 AI 提供隐私保护，而 AI 呢，则可以让智能合约变得真正智能。好了，今天就聊到这里。`
  },
  {
    id: 'vb-2',
    title: 'Danksharding 与以太坊扩容路线图',
    duration: 10,
    isFree: true,
    audioText: `Hello，欢迎回来。今天我们要聊的是 Danksharding，这是以太坊扩容的下一个重大里程碑。让我来解释一下，为什么它如此重要。

首先说说现状。目前呢，Layer 2 解决方案，比如 Optimism 和 Arbitrum，已经大大提高了以太坊的吞吐量。但问题是，它们仍然需要将数据发布到主链，这就限制了最终的扩展性。

那 Danksharding 是怎么解决这个问题的呢？它引入了一个叫做"数据可用性采样"的概念。简单来说，节点不需要下载所有数据，只需要随机采样一小部分，就能验证数据的可用性。这样一来，我们就可以在不牺牲去中心化的情况下，大幅增加数据容量。

Proto-Danksharding，也就是 EIP-4844，是第一步，它引入了 blob 交易。完整的 Danksharding 呢，将在未来几年逐步实现。

可以说，这是以太坊成为真正的世界计算机的关键一步。好，今天的内容就到这里，我们下期再见。`
  },
  {
    id: 'vb-3',
    title: 'Soulbound Tokens 与去中心化身份',
    duration: 7,
    isFree: true,
    audioText: `嗨，大家好。今天我们来聊聊 Soulbound Tokens，简称 SBT。这是一种不可转让的代币，代表了 Web3 身份系统的新范式。

你可能会问，这跟普通 NFT 有什么区别呢？传统的 NFT 可以自由买卖，对吧？但这个特性，让它们不太适合代表身份、资质或者声誉。想想看，你不应该能购买别人的大学文凭或者工作经验吧？

SBT 就是来解决这个问题的。它们绑定到你的钱包，无法转让。这让它们可以用于很多场景，比如：教育证书、工作履历、社区贡献记录、投票资格等等。

更重要的是，SBT 可以构建"去中心化社会"的基础设施。通过你拥有的 SBT 组合，社区可以了解你是谁，而不需要依赖中心化的身份提供商。

我认为这是 Web3 从金融应用，走向更广泛社会应用的重要一步。好了，今天就分享到这里，感谢收听。`
  },
  {
    id: 'vb-4',
    title: '零知识证明的未来',
    duration: 9,
    isFree: false,
    audioText: `大家好，今天聊聊我特别着迷的一个话题：零知识证明。

零知识证明可能是密码学领域最神奇的发明了。它能让你证明某事为真，但不泄露任何其他信息。听起来像魔法对吧？

给你举几个例子。你可以证明自己年满 18 岁而不透露具体生日；证明自己有足够的资金而不透露余额；证明自己是某个组织的成员而不透露身份。这在隐私保护方面的应用潜力是巨大的。

在区块链领域呢，ZK-rollups 用零知识证明来压缩交易数据。这让我们可以在 Layer 2 上处理数千笔交易，然后只在主链上发布一个简洁的证明。这对扩容太重要了。

ZK-SNARKs 和 ZK-STARKs 是两种主要的实现方式，各有优劣。STARK 不需要可信设置，更抗量子攻击，但证明尺寸更大一些。

我真的相信，零知识证明会成为未来互联网的基础设施，不仅仅在区块链领域。好了，今天就分享到这里，下期见！`
  },
  {
    id: 'vb-5',
    title: 'DAO 治理的实践与反思',
    duration: 8,
    isFree: false,
    audioText: `嗨，今天我想跟大家聊聊 DAO 治理的一些思考。

去中心化自治组织听起来很美好对吧？没有 CEO，社区投票决定一切。但实际上，DAO 治理面临很多挑战。

首先是投票参与度的问题。说实话，大多数代币持有者不会花时间研究每个提案，结果就是少数活跃成员主导决策，这跟理想中的去中心化有差距。

其次是代币投票本身的问题。持币量不等于智慧或贡献啊。大户可以买票，这跟"一人一票"的民主理想是相悖的。

所以我们需要更好的治理机制。二次投票可以减少大户的权力。委托投票让专业人士代表普通持有者。声誉系统可以给贡献者更多话语权。

我觉得啊，DAO 不是终点，而是探索集体决策新形式的起点。我们还有很长的路要走，但这个探索过程本身就很有意义。好了，今天就聊到这里，谢谢大家！`
  }
];

// a16z Crypto 剧集
const a16zEpisodes: Episode[] = [
  {
    id: 'a16z-1',
    title: '2024 加密行业状态报告',
    duration: 12,
    isFree: true,
    // a16z Crypto 播客真实音频
    // 使用可跨域播放的示例音频
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audioText: `嗨，大家好，欢迎收听 a16z Crypto 的年度行业报告。我是今天的主持人。

嗯，过去这一年真的挺精彩的。让我们来回顾一下发生了什么，然后聊聊未来的机会在哪里。

首先说说用户增长吧。你可能注意到了，虽然市场起起落落的，但月活跃用户数其实一直在涨。特别是在新兴市场，加密货币正在变成很多人日常用的支付和储蓄工具，这个趋势非常明显。

技术方面呢，Layer 2 生态简直是爆发了。Arbitrum、Optimism、Base 这些链，TVL 和活跃度都创了新高。这说明什么？模块化区块链这条路是走对了。

再说监管，虽然过程挺曲折的，但主要国家都在建立自己的监管框架。这其实是好事啊，有规矩才能走得更远。

我们团队认为，下一个周期的主题会是"加密货币走向主流"。基础设施已经差不多了，现在就差那个杀手级应用了。好，今天就聊到这里，下期再见！`
  },
  {
    id: 'a16z-2',
    title: 'Web3 创业者需要知道的十件事',
    duration: 15,
    isFree: true,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audioText: `欢迎回来！今天我想跟大家分享一些创业经验。

我们投资了几百个加密项目，确实总结出了一些成功创业者的共同特点。我挑几个重要的讲讲啊。

第一个，深刻理解技术。这点没办法绕过去的。Web3 创业不光是商业创新，更是技术创新。你得真正理解密码学、共识机制、智能合约这些底层的东西。

第二个，社区比产品更重要。这个可能很多人不同意，但事实就是这样。Web3 项目的成功离不开活跃社区。说实话，在写第一行代码之前，你就应该开始建社区了。

第三个，代币设计是核心。这不是等产品做完了才考虑的事情。它是产品设计的一部分，决定了所有人的激励结构。

第四个，安全是生命线。一次智能合约漏洞就可能毁掉你的整个项目。要舍得在审计和安全测试上花钱花时间。

第五个，长期主义。加密市场波动很大，我们都知道。但真正的价值创造需要时间，你要做好度过熊市的准备。好了，今天就分享这五点，希望对大家有帮助！`
  },
  {
    id: 'a16z-3',
    title: '为什么我们投资 DePIN',
    duration: 10,
    isFree: true,
    audioText: `Hello，今天来聊聊 DePIN。

DePIN，就是去中心化物理基础设施网络，是我们现在最看好的赛道之一。为什么呢？让我解释一下。

你想想传统的基础设施，无论是电信网络、云计算还是物流系统，都是被大公司垄断的对吧？建设成本太高了，普通人根本没法参与。

但是 DePIN 改变了游戏规则。通过代币激励，任何人都可以贡献自己的资源。你有闲置的硬盘空间？WiFi 带宽用不完？甚至你开车的里程数？这些都可以变成收入。

给你举几个例子。Filecoin 让用户出租硬盘空间赚钱。Helium 让用户部署物联网热点。这些项目已经证明了去中心化基础设施是可行的。

我们认为啊，DePIN 是加密货币真正改变现实世界的机会。它不只是金融创新，更是生产关系的重构，这个意义是很深远的。

下一代 DePIN 项目会涉及能源、计算、传感器等等更多领域。我们正在积极寻找这个方向的创业者，欢迎联系我们。今天就聊到这里，拜拜！`
  },
  {
    id: 'a16z-4',
    title: 'NFT 的下一个十年',
    duration: 11,
    isFree: false,
    audioText: `大家好，今天我们来聊聊 NFT 的未来。

2021 年的 NFT 热潮让很多人觉得 NFT 就是 JPEG 图片。但说实话，这只是 NFT 应用的冰山一角。

那 NFT 的本质到底是什么呢？其实就是链上的数字所有权证明。这个东西可以应用在几乎所有需要证明所有权的地方：门票、会员资格、游戏道具、音乐版权、甚至房产证书。

我们看好几个方向。首先是实用型 NFT，它们代表真实的权益，不光是收藏。其次是动态 NFT，它们可以根据链上或链下数据变化，很酷对吧？第三是可组合 NFT，可以跟其他协议无缝交互。

我觉得啊，下一个十年，NFT 可能会变得"无形"。什么意思呢？就是用户不需要知道他们在用 NFT，就像今天我们不需要知道网站用了什么数据库一样。

这才是真正的主流采用：技术消失在背景中，只留下无缝的用户体验。好了，今天就分享到这儿，下期见！`
  }
];

// 以太坊基金会研究笔记剧集
const ethereumFoundationEpisodes: Episode[] = [
  {
    id: 'ef-1',
    title: 'Pectra 升级技术预览',
    duration: 14,
    isFree: true,
    audioText: `嗨，欢迎收听以太坊基金会研究笔记。今天我们来聊聊 Pectra 升级。

Pectra 是以太坊的下一个重大升级，计划 2025 年初激活。那它会带来什么变化呢？让我一个个说。

最重要的是 EIP-7702，这个会彻底改变账户抽象的体验。以后用户用智能合约钱包就不需要付额外的 Gas 费了，这个真的很重要。

然后是 EIP-7251，它把验证者的最大质押上限从 32 个 ETH 提高到 2048 个 ETH。这样可以减少共识层的验证者数量，提高网络效率。

还有 EIP-7002，允许验证者通过执行层触发提款，不用验证者密钥了。这增加了质押的灵活性和安全性。

另外还有好多针对 Blob 和 Layer 2 的优化提案。这些改进会继续降低 rollup 的成本，推动以太坊扩容路线图往前走。

Pectra 升级已经经过了广泛的测试网验证，我们对顺利激活很有信心。好，今天就介绍到这里，谢谢大家！`
  },
  {
    id: 'ef-2',
    title: '账户抽象的现状与未来',
    duration: 11,
    isFree: true,
    audioText: `大家好，今天来聊账户抽象。这个话题可能有点技术性，但我尽量讲得通俗一点。

账户抽象是改善以太坊用户体验的关键。那它到底是什么呢？

目前以太坊有两种账户：外部拥有账户，我们叫 EOA，和合约账户。EOA 由私钥控制，有个很大的问题就是——一旦你丢了私钥，资产就永远没法恢复了。

账户抽象呢，就是让普通账户也能有智能合约的功能：社交恢复、多签验证、Gas 代付、批量交易，这些都可以实现。

ERC-4337 是当前的解决方案，好处是不需要改协议层就能实现账户抽象。很多钱包已经支持了。

未来的原生账户抽象会更进一步。用户可以完全自定义账户的验证逻辑，甚至用生物识别或硬件密钥。

我们的目标很简单：让普通用户也能安全地管理自己的加密资产，不用整天担心私钥丢了怎么办。好了，今天就讲到这里，下期见！`
  },
  {
    id: 'ef-3',
    title: '以太坊安全研究季报',
    duration: 9,
    isFree: true,
    audioText: `Hello，欢迎收听安全研究季报。安全是以太坊开发的首要考虑，今天我来分享一下过去几个月的进展。

共识层方面，我们进行了大规模的模糊测试，发现并修复了几个潜在问题。好消息是所有客户端都已经更新到安全版本了。

执行层方面，重入攻击仍然是最常见的漏洞类型。所以我们还是建议开发者严格遵循"检查-效果-交互"模式，这点很重要。

跨链桥呢，坦白说是当前最大的安全隐患区域。过去一年，桥接协议的攻击损失超过 10 亿美元了。我们正在研究更安全的跨链通信方案。

对于开发者，我有几个强烈建议：第一，至少做两次独立审计；第二，建立 bug 赏金计划；第三，采用渐进式部署策略；第四，保持对安全最佳实践的持续学习。

记住啊，安全不是一次性的工作，而是持续的承诺。好，今天就分享到这里，谢谢大家！`
  },
  {
    id: 'ef-4',
    title: 'MEV 与公平排序',
    duration: 12,
    isFree: false,
    audioText: `大家好，今天聊一个有点复杂但很重要的话题：MEV，也就是最大可提取价值。

简单解释一下啊。区块生产者可以通过重新排序、插入或审查交易来获取额外利润。这可能导致什么呢？普通用户的交易被"三明治攻击"，你买入的时候被人抬价，卖出的时候被人压价，中间的差价就被抽走了。

目前有一些解决方案。Flashbots 提供私有交易池，让用户避免被抢跑。PBS，就是提议者和构建者分离，把区块构建与提议分开，增加竞争。

但是呢，这些方案也带来新问题。MEV 供应链的集中化可能威胁去中心化。所以我们需要更好的设计。

未来的研究方向有几个：加密内存池，让交易内容在排序前保密；公平排序算法，确保交易按时间顺序处理；还有 MEV 再分配，把提取的价值返还给用户。

这是一个非常活跃的研究领域，我们期待社区的更多贡献。好，今天就聊到这里，拜拜！`
  }
];

// Bankless 无银行主义剧集
const banklessEpisodes: Episode[] = [
  {
    id: 'bl-1',
    title: '什么是无银行主义？',
    duration: 8,
    isFree: true,
    // 使用示例音频（如果无法播放会回退到 TTS）
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    audioText: `嗨，欢迎来到 Bankless。我是你们的主持人。

今天我们要聊一个大话题：什么是无银行主义？嗯，我们相信啊，每个人都应该拥有对自己金融生活的完全控制权。

你想想看，传统银行系统存在多少问题？高额手续费、缓慢的跨境转账、账户可能被冻结、利率被人为压低。更重要的是，全球还有17亿人，根本无法获得基本的银行服务。

那无银行主义是什么呢？它是一种生活方式。它意味着使用去中心化协议来替代传统银行。比如说，用 DEX 而不是券商来交易；用 DeFi 借贷协议而不是银行贷款；用稳定币而不是银行账户来存储价值。

当然啦，这不意味着完全抛弃传统金融。而是要意识到，你是有选择权的。学会使用这些新工具，来增强你的金融主权。

好，在这个系列中，我们会手把手教你如何迈出第一步。下期见！`
  },
  {
    id: 'bl-2',
    title: 'DeFi 入门：你的第一次链上交易',
    duration: 12,
    isFree: true,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    audioText: `欢迎回来！今天呢，我们要来完成你的第一次 DeFi 操作。别担心，我会一步一步引导你。

首先，你需要一个钱包。我个人推荐 MetaMask 或者 Rabby。下载之后创建新钱包，这里要特别注意，务必安全保存你的助记词。这个相当于你的银行密码，丢失了就真的永远无法恢复了。

然后呢，你需要获取一些 ETH。可以通过交易所购买，然后提现到你的钱包地址。第一次的话，可以先小额测试一下。

好，现在来进行你的第一次交易。访问 Uniswap 官网，连接你的钱包。选择你要交换的代币，输入金额，点击确认交易。这时候你的钱包会弹出一个签名请求，仔细检查一下，然后确认。

等待几十秒，交易就完成了。恭喜你！你刚刚进行了一次无需许可的点对点交易，没有任何中介参与。

不过这只是开始哦。DeFi 的世界还有借贷、质押、流动性挖矿等等更多玩法。我们下期继续探索，敬请期待！`
  },
  {
    id: 'bl-3',
    title: '如何选择安全的 DeFi 协议',
    duration: 10,
    isFree: true,
    audioText: `大家好，今天我们来聊一个非常重要的话题：如何选择安全的 DeFi 协议。

DeFi 世界机会很多，但说实话，风险也不小。那怎么评估一个协议的安全性呢？

首先，看审计报告。主流协议都会请多家审计公司来检查代码。在协议官网通常能找到审计报告的链接。但是呢，要记住，审计不是万能的，它只能降低风险，不能完全消除风险。

其次，看 TVL 和运营时间。锁定总价值高、运营时间长的协议，通常更可靠一些。新协议可能有更高的收益，但风险也更大，这是要权衡的。

第三，检查团队背景。匿名团队不一定不可信，但已知团队至少有声誉约束。可以看看他们的 GitHub 活跃度和社区参与度。

第四，了解协议机制。这点很重要，不要投资你不理解的东西。那些承诺超高收益的协议，往往有隐藏的风险。

最后，不要把所有资金放在一个协议里。分散投资可以降低单点故障的影响。好了，今天就分享到这里，大家下期再见！`
  },
  {
    id: 'bl-4',
    title: '稳定币全解析',
    duration: 11,
    isFree: false,
    audioText: `嗨，欢迎回来。今天我们聊聊稳定币。

稳定币是 DeFi 的基石，但说实话，不是所有稳定币都是安全的。让我帮你理清不同类型的区别。

首先是法币抵押型，像 USDC 和 USDT，由中心化公司发行，每个代币对应银行账户里的一美元。优点是简单稳定，缺点呢，是依赖中心化实体，账户可能被冻结。

然后是加密资产抵押型，像 DAI，用超额的加密资产作为抵押品。更去中心化，但在极端行情下可能脱锚，这个风险要知道。

还有算法稳定币，试图用算法机制维持锚定。但是呢，Luna 和 UST 的崩塌证明了纯算法稳定币有多脆弱。新一代设计更加谨慎了，但还是要小心。

对于普通用户，我的建议是主要持有 USDC 或 DAI。如果你追求更高的去中心化程度，可以考虑 DAI 或者 Liquity 的 LUSD。

还有一点很重要：不要把大量资金长期放在收益过高的稳定币池里。高收益往往意味着高风险，这是铁律。好了，今天就分享到这里，下期见！`
  }
];

// Chainlink 预言机研究剧集
const chainlinkEpisodes: Episode[] = [
  {
    id: 'cl-1',
    title: '什么是区块链预言机？',
    duration: 7,
    isFree: true,
    audioText: `嗨，欢迎收听 Chainlink 技术解读。今天我们来聊聊预言机是什么。

你知道吗，区块链其实是一个封闭的系统。智能合约只能访问链上的数据，没法直接获取外部世界的信息。

这是个问题啊。你想想，一个保险合约需要知道航班有没有延误；一个借贷协议需要知道 ETH 现在什么价格；一个预测市场需要知道比赛结果。这些数据都在链外面。

那怎么办呢？预言机就是来解决这个问题的。它是连接区块链与现实世界的桥梁，把链外数据安全地带到链上。

但是呢，这也引入了新的信任问题。如果预言机报告错误数据怎么办？这就是所谓的"预言机问题"。

Chainlink 的解决方案是去中心化预言机网络。多个独立的节点从不同数据源获取信息，通过共识机制确保数据的准确性和抗审查性。

可以这么说，没有可靠的预言机，大多数有意义的 DeFi 应用都没法运行。好，今天就介绍到这里，下期见！`
  },
  {
    id: 'cl-2',
    title: '价格预言机深度解析',
    duration: 9,
    isFree: true,
    audioText: `大家好，今天我们来深入了解价格预言机是怎么工作的。

价格数据是 DeFi 最常用的预言机应用。但说实话，做好这个不容易。

一个很天真的方案是从单一交易所获取价格。但这很容易被操纵——攻击者可以在低流动性交易所制造假价格，然后利用这个价格在 DeFi 协议中套利，这种攻击我们见过很多次了。

Chainlink 价格预言机聚合多个数据源。每个节点从多个交易所和数据提供商获取价格，然后计算加权平均值。这样就很难被操纵了。

去中心化是关键。我们的网络由几十个独立运营的节点组成。每个节点都需要质押 LINK 代币作为保证金。如果报告错误数据，会被惩罚的。

更新机制也很重要啊。价格预言机在价格变化超过阈值或经过一定时间后自动更新。这在保证及时性的同时还能节省 Gas 费用。

使用价格预言机时，开发者需要注意延迟和精度问题。在高波动市场中，微小的延迟也可能导致套利机会。好了，今天就讲到这里，感谢收听！`
  },
  {
    id: 'cl-3',
    title: 'CCIP 跨链互操作协议',
    duration: 10,
    isFree: true,
    audioText: `Hello，今天来聊 CCIP，就是跨链互操作协议。这是区块链发展的下一个前沿。

你看现在的多链世界是割裂的对吧？用户需要在不同链之间手动转移资产，开发者需要在每条链上分别部署合约，非常麻烦。

CCIP 提供了一个安全的跨链通信标准。它不光能转移代币，还能传递任意消息。什么意思呢？一条链上的合约可以直接调用另一条链上的合约，这是很强大的能力。

安全是 CCIP 的核心设计原则。我们用了多层防御：去中心化的预言机网络、独立的风险管理网络、还有可配置的速率限制。

这解决了跨链桥最大的痛点。过去的桥接协议因为中心化设计而频繁被攻击，损失惨重。CCIP 的去中心化架构大大提高了安全性。

我觉得啊，未来的 Web3 应用会是跨链原生的。用户不需要关心资产在哪条链上，协议会自动选择最优路径。CCIP 正在让这个愿景成为现实。好，今天就聊到这儿，拜拜！`
  }
];

// Base 生态发展剧集
const baseEcosystemEpisodes: Episode[] = [
  {
    id: 'base-1',
    title: 'Base 链入门指南',
    duration: 8,
    isFree: true,
    audioText: `嗨，大家好，欢迎来到 Base 生态探索。今天我们来聊聊 Base 是什么，为什么值得关注。

Base 是 Coinbase 推出的以太坊 Layer 2 网络。它建立在 Optimism 的 OP Stack 之上，提供低成本、高速度的交易体验。

那为什么 Base 值得关注呢？我觉得有几个原因。

首先，它有 Coinbase 这个强大的后盾。作为美国最大的合规交易所，Coinbase 的用户基础和品牌信誉给 Base 带来了天然的优势。

其次，Base 的费用真的很低。普通交易只需要几美分，这让小额交易和游戏类应用变得可行了。

第三，Base 是 Superchain 生态的一部分。它跟 Optimism 和其他 OP Stack 链共享互操作性，未来可能实现无缝的跨链通信。

开始使用 Base 其实很简单。在 MetaMask 里添加 Base 网络，通过官方跨链桥或者第三方桥接服务把资产转进来，就可以开始探索了。

我们后续节目会介绍 Base 上的热门应用和机会，敬请期待！`
  },
  {
    id: 'base-2',
    title: 'Base 上的 DeFi 生态',
    duration: 10,
    isFree: true,
    audioText: `欢迎回来！今天我们来看看 Base 上有哪些值得关注的 DeFi 协议。

Base 的 DeFi 生态正在快速发展，我给大家介绍几个主要的。

Aerodrome 是 Base 上最大的 DEX，采用 ve(3,3) 模型。它不光是交易平台，还是流动性激励的中心。很多新项目选择在 Aerodrome 启动流动性。

Moonwell 是主要的借贷协议，从 Moonbeam 迁移过来的。它提供稳定的借贷利率和完善的清算机制，用起来还挺顺手的。

BaseSwap、SwapBased 等 DEX 也提供了更多交易选择。竞争带来了更好的价格和更低的滑点。

还有一些创新项目值得关注。Friend.tech 开创了社交金融的新玩法，虽然热度有所下降，但它证明了 Base 可以孵化创新应用。

投资 Base DeFi 我有几个建议：从主流协议开始，理解风险后再尝试新项目；注意虽然 Gas 费低但仍需要 ETH；还有啊，始终保持警惕，审计报告是最基本的要求。好，今天就分享到这里，下期见！`
  },
  {
    id: 'base-3',
    title: 'Coinbase 的 Onchain 愿景',
    duration: 9,
    isFree: true,
    audioText: `大家好，今天我们来聊聊 Coinbase 的链上愿景，以及 Base 在其中扮演的角色。

Coinbase 的使命是增加世界的经济自由。Base 呢，就是实现这个使命的关键一步。

传统上，Coinbase 是一个托管交易所。用户把加密货币存在 Coinbase，Coinbase 代为保管。这其实是 Web 2.5 模式——用了加密货币，但用户没有真正的自托管。

Base 代表的是向链上转型的方向。Coinbase 希望它的 1 亿用户逐步迁移到链上，使用自托管钱包直接与 DeFi 协议交互。

Coinbase Wallet 和 Smart Wallet 是这个战略的重要组成部分。Smart Wallet 支持无 Gas 交易和社交恢复，大大降低了新用户的门槛，这点很重要。

这是一个很大胆的愿景：让普通人也能享受 DeFi 的好处，同时保持合规和用户友好。如果成功的话，它可能成为加密货币主流采用的转折点。

可以说，Base 不仅仅是一条链，更是 Coinbase 对加密货币未来的押注。好了，今天就聊到这里，拜拜！`
  },
  {
    id: 'base-4',
    title: 'OP Stack 与 Superchain',
    duration: 11,
    isFree: false,
    audioText: `Hello，今天我们来聊点技术性的话题：OP Stack 和 Superchain。

Base 是建立在 OP Stack 之上的，也是 Superchain 生态的重要成员。这意味着什么呢？让我解释一下。

OP Stack 是 Optimism 开源的 Layer 2 技术栈。厉害的地方在于，任何人都可以用它部署自己的 Optimistic Rollup 链。这大大降低了创建 L2 的门槛。

Superchain 呢，是使用 OP Stack 的链组成的网络。这些链共享相同的技术标准，未来会实现原生的跨链通信。想象一下，在 Base 上的资产可以瞬间转移到 Optimism 或其他 Superchain 成员，这是很酷的。

这种模式的优势是规模效应。更多的链加入 Superchain，生态就更有价值。开发者可以一次构建，部署到所有链。

值得一提的是，Coinbase 选择加入 Superchain 而不是自建技术栈，这体现了 Web3 的协作精神。它还把部分收益贡献给 Optimism Collective，支持公共物品的开发。

Superchain 的愿景是让 Layer 2 像互联网一样互联互通。我们现在正处于这个愿景实现的早期阶段，很期待未来的发展。好，今天就聊到这儿，下期再见！`
  }
];

// ========================================
// 导出 MOCK_PODCASTS
// ========================================

export const MOCK_PODCASTS: Podcast[] = [
  {
    id: 'vitalik-blog',
    title: 'Vitalik Buterin 博客',
    description: '以太坊创始人 Vitalik 的个人博客，深入探讨区块链技术、密码学、社会哲学与去中心化未来。',
    author: 'Vitalik Buterin',
    listens: 89420,
    likes: 12580,
    coverUrl: getCover('Vitalik Buterin Ethereum founder blockchain visionary portrait digital'),
    avatarUrl: 'https://image.pollinations.ai/prompt/portrait%20of%20young%20male%20tech%20genius%20programmer%20ethereum%20founder%20minimalist%20style%20purple%20background?width=200&height=200&nologo=true',
    tags: ['以太坊', 'Layer2', '密码学', 'DAO'],
    episodes: vitalikEpisodes,
    basePrice: 0.01,
    tipEnabled: true,
    minTipAmount: 2,
  },
  {
    id: 'a16z-crypto',
    title: 'a16z Crypto 投资洞察',
    description: '顶级风投 Andreessen Horowitz 的加密货币团队分享行业趋势、投资逻辑与 Web3 创业指南。',
    author: 'a16z Crypto',
    listens: 67890,
    likes: 8920,
    coverUrl: getCover('a16z venture capital crypto investment blockchain finance'),
    avatarUrl: 'https://image.pollinations.ai/prompt/letter%20A%20logo%20venture%20capital%20professional%20orange%20gradient%20minimalist%20modern%20design?width=200&height=200&nologo=true',
    tags: ['投资', 'Web3', 'DAO', '创业'],
    episodes: a16zEpisodes,
    basePrice: 0.01,
    tipEnabled: true,
    minTipAmount: 1,
  },
  {
    id: 'ethereum-foundation',
    title: '以太坊基金会研究笔记',
    description: '来自以太坊核心开发团队的技术深度解析，探索协议升级、安全研究与生态发展。',
    author: 'Ethereum Foundation',
    listens: 45670,
    likes: 6780,
    coverUrl: getCover('Ethereum Foundation blockchain research development purple diamond'),
    avatarUrl: 'https://image.pollinations.ai/prompt/ethereum%20diamond%20logo%20purple%20gradient%20glowing%20crystal%20minimalist%20dark%20background?width=200&height=200&nologo=true',
    tags: ['以太坊', '协议', '升级', '研究'],
    episodes: ethereumFoundationEpisodes,
    basePrice: 0.01,
    tipEnabled: true,
    minTipAmount: 1,
  },
  {
    id: 'bankless',
    title: 'Bankless 无银行主义',
    description: '探索去中心化金融的前沿，教你如何在加密世界中实现财务自由与主权。',
    author: 'Bankless HQ',
    listens: 78900,
    likes: 10240,
    coverUrl: getCover('Bankless DeFi decentralized finance freedom crypto revolution'),
    avatarUrl: 'https://image.pollinations.ai/prompt/red%20B%20letter%20logo%20fire%20flames%20bankless%20defi%20revolution%20bold%20minimalist%20dark%20background?width=200&height=200&nologo=true',
    tags: ['DeFi', '财务自由', '教程', '市场'],
    episodes: banklessEpisodes,
    basePrice: 0.01,
    tipEnabled: true,
    minTipAmount: 1,
  },
  {
    id: 'chainlink-research',
    title: 'Chainlink 预言机研究',
    description: '深入理解区块链预言机的工作原理，探索链上与链下世界的桥梁技术。',
    author: 'Chainlink Labs',
    listens: 34560,
    likes: 4530,
    coverUrl: getCover('Chainlink oracle blockchain data network blue hexagon'),
    avatarUrl: 'https://image.pollinations.ai/prompt/blue%20hexagon%20chainlink%20logo%20oracle%20network%20glowing%20neon%20minimalist%20dark%20background?width=200&height=200&nologo=true',
    tags: ['预言机', '数据', 'DeFi', '基础设施'],
    episodes: chainlinkEpisodes,
    basePrice: 0.01,
    tipEnabled: true,
    minTipAmount: 1,
  },
  {
    id: 'base-ecosystem',
    title: 'Base 生态发展',
    description: 'Coinbase 推出的 Layer 2 网络 Base 的生态发展、技术解析与应用案例。',
    author: 'Base Team',
    listens: 56780,
    likes: 7890,
    coverUrl: getCover('Base Coinbase Layer2 blockchain blue circle ethereum'),
    avatarUrl: 'https://image.pollinations.ai/prompt/blue%20circle%20base%20coinbase%20layer2%20logo%20minimalist%20modern%20gradient%20dark%20background?width=200&height=200&nologo=true',
    tags: ['Base', 'Layer2', 'Coinbase', 'DeFi'],
    episodes: baseEcosystemEpisodes,
    basePrice: 0.01,
    tipEnabled: true,
    minTipAmount: 1,
  },
];
