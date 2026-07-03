# Storyboard

**Format:** 1920x1080
**Audio:** Mandarin system TTS voiceover using `Microsoft Huihui Desktop` + timed subtitles. Voiceover is split into six scene-specific files under `voice/` so each sentence starts with its matching visual beat. Kokoro `zf_xiaobei` timed out in this environment.
**VO direction:** 轻松、自然、有一点玩笑感；开场反差明显，后半段转入清晰招商表达。
**Style basis:** `DESIGN.md` with warm paper background, sage-green controls, cream cards, clay/gold accents.

## Asset Audit

| Asset | Type | Assign to Beat | Role |
| --- | --- | --- | --- |
| `assets/hero-natural-treats.png` | Hero image | 1, 6 | Full-bleed lifestyle background and closing image |
| `assets/product-chicken-strips.png` | Product photo | 2 | Daily reward SKU card |
| `assets/product-freeze-dried.png` | Product photo | 2 | Nutrition snack SKU card |
| `assets/product-dental-chews.png` | Product photo | 2 | Dental care SKU card |
| `assets/product-training-bites.png` | Product photo | 2 | Training treat SKU card |
| HTML/CSS reconstructed UI | UI graphics | 4, 5 | Storefront flow and admin dashboard |

## Beat 1 — Brand Hook (0.00-4.00s)

**VO:** 给每一次奖励，配得上的干净配方。

**Concept:** 开场回到品牌钩子，用干净、温暖、可信的生活方式画面建立“天然奖励”的第一印象。

**Visual:** Hero 图全屏慢慢推进，左侧米色半透明面板承载品牌名和大标题“给每一次奖励”。三枚小标签依次弹出：猫狗通用、天然肉源、小批量烘制。右下角出现小小的“爪味自然”品牌印章。

**Animation:** 背景 Ken Burns 缓慢放大；标题从左侧滑入；标签错峰上浮；品牌印章轻微弹性入场；字幕底部出现并做轻微 scale-pop。

**Transition:** Light leak into Beat 2, 0.55s.

## Beat 2 — Product Matrix (4.00-9.00s)

**VO:** 从日常奖励，到营养加餐、口腔护理和训练互动，爪味自然把常见喂养场景整理成清晰货盘。

**Concept:** 从玩笑转入产品力，四张商品卡像货架一样依次排列，表现“可陈列、可讲解”的 SKU 结构。

**Visual:** 背景为 `#FAF7EF`，四张白色商品卡从下方错峰进入。每张卡有产品图、场景标签、价格和一句导购话术。顶部有“按场景挑选天然零食”标题。

**Animation:** 商品图在卡片内做 1.0→1.04 慢缩放；卡片错峰上浮；标签像筛选 chip 一样点亮；价格用 clay 色短暂强调。

**Transition:** Blur crossfade into Beat 3, 0.5s.

## Beat 3 — Clean Standards (9.00-14.00s)

**VO:** 真实肉源、轻加工、看得懂的成分表，让宠物主人更容易理解，也让门店更容易讲清。

**Concept:** 用三项标准把“天然”说清楚，节奏从商品展示转为信任证明。

**Visual:** 三个大号编号 01/02/03 纵向排布，旁边分别是“真实肉源”“轻加工”“场景化选择”。右侧是一张放大的 hero 局部图作为天然食材证据。

**Animation:** 编号线条逐条绘制；三个标准卡片依次落位；右侧图片做轻微透视漂浮；关键词用 gold 细线扫过。

**Transition:** Blur crossfade into Beat 4, 0.5s.

## Beat 4 — Storefront Flow (14.00-19.00s)

**VO:** 前台不仅展示商品，还能完成筛选、详情查看、加入购物车和模拟下单。

**Concept:** 把网页功能压缩成一条可视化购买路径，强调不是静态图册，而是能操作的商城。

**Visual:** 五个流程节点横向推进：分类筛选、商品详情、加入购物车、确认地址、生成订单。背景出现半透明的商品网格和购物车抽屉轮廓。

**Animation:** 节点沿路径逐个点亮；购物车数字从 0 数到 3；订单号标签弹出；路径线条从左向右绘制。

**Transition:** Blur crossfade into Beat 5, 0.5s.

## Beat 5 — Admin Loop (19.00-24.00s)

**VO:** 后台同步订单、营业额和销量排行，让招商演示从产品展示进入经营展示。

**Concept:** 让合作方看到经营闭环，画面从前台商品卡切换到后台指标面板。

**Visual:** 左侧是四个指标卡：营业额、订单数、售出件数、销量冠军。右侧是订单列表和销量排行。底部是一条数据流从“前台下单”流向“后台复盘”。

**Animation:** 指标数字快速 count-up；表格行逐条滑入；销量条形从左到右增长；数据流光点沿线移动。

**Transition:** Warm blur crossfade into Beat 6, 0.6s.

## Beat 6 — CTA Close (24.00-30.83s)

**VO:** 一起把天然宠物零食，做成可复购、可复盘的渠道生意。

**Concept:** 回到品牌主视觉，用招商 CTA 收束，让观众记住“产品矩阵 + 场景话术 + 数据复盘”。

**Visual:** Hero 图片再次全屏，左侧浮出大标题“把天然宠物零食做成可复购的渠道生意”。三枚合作标签排成一行：产品矩阵、场景话术、数据复盘。品牌名和网址式落款在底部。

**Animation:** 标题缓慢上浮；三枚标签依次点亮；背景继续慢缩放；最后 0.8s 全局轻微淡出到暖色。

**Transition:** Final fade only.

## Production Architecture

```text
project/
├── index.html
├── DESIGN.md
├── SCRIPT.md
├── STORYBOARD.md
├── narration.txt
├── narration.wav
├── transcript.json
├── assets/
├── capture/
├── capture_local/
└── snapshots/
```
