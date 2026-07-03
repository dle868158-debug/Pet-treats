# 岚禾小食宠物零食品牌招商PPT - Design Spec

> Human-readable design narrative. Machine-readable execution contract: `spec_lock.md`.

## I. Project Information

| Item | Value |
| ---- | ----- |
| **Project Name** | 岚禾小食宠物零食品牌招商PPT |
| **Canvas Format** | PPT 16:9 (1280x720) |
| **Page Count** | 10 |
| **Design Style** | Mode: pyramid; Visual style: soft-rounded |
| **Target Audience** | 宠物零食渠道商、区域代理、宠物门店主理人、社区团购/私域团长，以及评估合作价值的品牌合作方。 |
| **Use Case** | 招商洽谈、合作路演、渠道初次沟通。 |
| **Delivery Purpose** | `balanced` business: 每页一个主结论，保留足够信息供会议后阅读。 |
| **Content Strategy** | 在不虚构市场规模和财务数据的前提下，基于网页与代码事实自由重构为招商叙事。 |
| **Created Date** | 2026-07-03 |

## II. Canvas Specification

| Property | Value |
| -------- | ----- |
| **Format** | PPT 16:9 |
| **Dimensions** | 1280x720 |
| **viewBox** | `0 0 1280 720` |
| **Margins** | 56px left/right, 44px top/bottom; dense pages may use 48px margins. |
| **Content Area** | 1168x620 safe area, excluding page number/source footer. |

## III. Visual Theme

### Theme Style

- **Mode**: `pyramid` — conclusion-first招商论证；每页标题写结论，而不是主题标签。
- **Visual style**: `soft-rounded` — 圆角卡片、柔和层级、亲和但商务。
- **Theme**: Light theme.
- **Tone**: 清洁、可信、亲和、可运营。

### Color Scheme

| Role | HEX | Purpose |
| ---- | --- | ------- |
| **Background** | `#F6F8F3` | 页面底色，传达清洁、天然。 |
| **Secondary bg** | `#FFFFFF` | 卡片、表格、产品图承载区。 |
| **Primary** | `#2F5D50` | 标题、主图标、关键结构线。 |
| **Accent** | `#8EB69B` | 标签、流程节点、轻强调。 |
| **Secondary accent** | `#D6A756` | 金色招商重点、价格/收益类强调。 |
| **Body text** | `#1E2A25` | 正文主色。 |
| **Secondary text** | `#5F6E65` | 注释、页脚、说明文字。 |
| **Tertiary text** | `#8A968E` | 辅助标签。 |
| **Border/divider** | `#DDE6DB` | 卡片边框、表格线。 |
| **Success** | `#2F7D55` | 正向指标。 |
| **Warning** | `#B86B45` | 风险或注意项。 |
| **Surface** | `#EEF4EC` | soft-rounded 同色系浅层背景。 |
| **Grid** | `#E7EEE5` | 细网格、弱分割。 |

### AI Image Strategy

- **Image Rendering**: `flat`
- **Image Palette**: `warm-earth`
- **Usage**: AI 只承担封面与收束页主视觉，以及必要的品牌氛围插画；产品图、界面事实、订单字段和中文标签均用本地素材或原生 SVG 文本表达。

### Gradient Scheme

Use only subtle SVG gradients when needed:

```xml
<linearGradient id="softGreenWash" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#EEF4EC"/>
  <stop offset="100%" stop-color="#F6F8F3"/>
</linearGradient>
```

## IV. Typography System

### Font Plan

**Typography direction**: 圆润商务黑体；稳定、清晰、适合招商路演。

| Role | Chinese | English | Fallback tail |
| ---- | ------- | ------- | ------------- |
| **Title** | `"Microsoft YaHei"` | `Arial` | `sans-serif` |
| **Body** | `"Microsoft YaHei"` | `Arial` | `sans-serif` |
| **Emphasis** | `"Microsoft YaHei"` | `Arial` | `sans-serif` |
| **Code** | — | `Consolas, "Courier New"` | `monospace` |

**Per-role font stacks**

- Title: `"Microsoft YaHei", Arial, sans-serif`
- Body: `"Microsoft YaHei", Arial, sans-serif`
- Emphasis: `"Microsoft YaHei", Arial, sans-serif`
- Code: `Consolas, "Courier New", monospace`

### Font Size Hierarchy

Baseline body = 24.

| Role | Size |
| ---- | ---- |
| Cover title | 76 |
| Page title | 46 |
| Subtitle | 32 |
| Lead / core message | 28 |
| Subheading | 28 |
| Body | 24 |
| Annotation | 18 |
| Footnote | 15 |
| Hero number | 62 |

## V. Layout Principles

### Page Structure

- **Header area**: 44-118px depending on page rhythm; body pages use assertion title + optional small section tag.
- **Content area**: 520-560px; cards use `rx=14`, 22-28px internal padding.
- **Footer area**: 26px; page number and source note in secondary text.

### Layout Pattern Library

- Cover and closing: full-bleed / image-as-canvas with floating title or one strong CTA.
- Product and channel pages: rounded card grids, but no nested cards.
- Operations pages: native SVG process, dashboard, and table structures; product / order numbers remain editable.
- Breathing page: one large assertion or hero structure, not a dense grid.

### Spacing Specification

| Element | Current Project |
| ------- | --------------- |
| Safe margin | 56px |
| Card gap | 22px |
| Card padding | 24px |
| Card radius | 14px |
| Icon-text gap | 12px |
| Dense table row | 52-64px |

## VI. Icon Usage Specification

- **Built-in icon library**: `tabler-filled`
- **Usage method**: SVG placeholder `<use data-icon="tabler-filled/name" .../>`
- **Approved inventory**: `paw`, `bone`, `fish-bone`, `shield-check`, `tags`, `shopping-cart`, `chart-area`, `dashboard`, `user`, `truck`, `receipt-yuan`, `list-check`

| Purpose | Icon Path | Page |
| ------- | --------- | ---- |
| Brand / pet | `tabler-filled/paw` | P01, P10 |
| Product protein | `tabler-filled/bone` | P04 |
| Freeze-dried / fish protein | `tabler-filled/fish-bone` | P04 |
| Clean standard | `tabler-filled/shield-check` | P03 |
| Category / labels | `tabler-filled/tags` | P03, P04 |
| Shopping path | `tabler-filled/shopping-cart` | P06 |
| Sales statistics | `tabler-filled/chart-area` | P02, P07 |
| Admin dashboard | `tabler-filled/dashboard` | P07 |
| Partner / customer | `tabler-filled/user` | P08 |
| Delivery / channel | `tabler-filled/truck` | P08, P09 |
| Revenue / order | `tabler-filled/receipt-yuan` | P02, P07 |
| Checklist | `tabler-filled/list-check` | P09 |

## VII. Visualization Reference List

Catalog read: 71 templates

| Page | Template | Path | Summary-quote (verbatim from `charts_index.json`) | Usage |
| ---- | -------- | ---- | ------------------------------------------------- | ----- |
| P02 | kpi_cards | `templates/charts/kpi_cards.svg` | "Pick for 4-8 standalone numeric metrics shown as overview cards (2x2 or 1x4) — exec summary opener, dashboard headline, quarterly recap, results-at-a-glance. Skip if metrics have target baselines (use bullet_chart) or single hero number (use gauge_chart)." | 0人工色素、72h低温风干、6精选配方、100%中文成分标注。 |
| P03 | vertical_list | `templates/charts/vertical_list.svg` | "Pick for 3-6 numbered key points each with a short description — design principles, core tenets, action items, key takeaways, recommendations, executive summary points. Skip for icon-style cards (use icon_grid) or sequential steps (use numbered_steps)." | 短配方、可拆解、好收纳三项产品标准。 |
| P04 | icon_grid | `templates/charts/icon_grid.svg` | "Pick for 4-9 parallel features/capabilities/services as icon cards — feature grid, service lineup, benefits matrix, brand values, product highlights. Skip for sequential ordering (use numbered_steps) or hierarchical layers (use pyramid_chart)." | 四类零食产品矩阵。 |
| P05 | hub_spoke | `templates/charts/hub_spoke.svg` | "Pick for 1 core capability + 4-8 surrounding capabilities (platform/ecosystem); each spoke = title or title + 1-2 line description. Skip if center is a system containing parts with their own descriptions (use module_composition), or surroundings exert inward pressure on the center (use hub_inward_arrows)." | 以“日常奖励”为中心展开四类消费场景。 |
| P06 | process_flow | `templates/charts/process_flow.svg` | "Pick for 3-8 sequential steps connected by simple arrows — approval workflows, customer onboarding, request handling, lifecycle stages. Skip if cyclical (use circular_stages) or stages produce named outputs (use pipeline_with_stages)." | 前台选购链路：筛选、详情、购物车、地址、订单。 |
| P07 | layered_architecture | `templates/charts/layered_architecture.svg` | "Pick for 3-4 horizontal architecture layers (presentation/service/data), 2-4 module cards per layer, each card = title + 1-line description (description required, even if source brief). Skip if no per-module descriptions (use icon_grid) or no horizontal layering (use module_composition)." | 前台、订单数据、本地后台之间的运营闭环。 |
| P08 | vertical_pillars | `templates/charts/vertical_pillars.svg` | "Pick for 1×3 / 1×4 / 1×5 vertical column layout where each pillar = one independent category with title + bullets — PEST (Political/Economic/Social/Technological), four-pillar strategy overview, side-by-side independent categories. Skip for 2×2 quadrant (use quadrant_text_bullets), pricing tiers (use comparison_columns), or 2×2 parallel aspects (use labeled_card)." | 四类合作对象与适配价值。 |
| P09 | numbered_steps | `templates/charts/numbered_steps.svg` | "Pick for 3-6 horizontal sequential steps with numeric emphasis — how-it-works section, getting-started guide, methodology overview, implementation phases. Skip if steps need connector arrows (use process_flow) or named output artifacts (use pipeline_with_stages)." | 三步合作启动路径。 |

**Runners-up considered**

- `comparison_columns` | rejected for P08: 合作对象不是价格/服务 tier，不应暗示高低档位。
- `funnel_chart` | rejected for P06: 选购流程不是单调流失漏斗，重点是闭环动作。
- `module_composition` | rejected for P07: 后台闭环更适合水平分层，不是一个父容器包多个模块。

## VIII. Image Resource List

| Filename | Dimensions | Ratio | Purpose | Type | Layout pattern | Acquire Via | Status | Reference | text_policy | page_role |
| -------- | ---------- | ----- | ------- | ---- | -------------- | ----------- | ------ | --------- | ----------- | --------- |
| ai_cover_lifestyle.png | 1280x720 | 1.78 | 封面主视觉，猫狗与天然零食陈列构成品牌招商第一印象 | Background | #1 Full-bleed background with floating title + #29 Two-stop scrim | ai | Pending | 明亮厨房台面上的天然宠物零食、猫狗陪伴、品牌招商氛围，右侧留出安静标题区 | none | hero_page |
| ai_partnership_closing.png | 1280x720 | 1.78 | 收束页主视觉，表达渠道合作与长期复购 | Background | #1 Full-bleed background with floating title + #30 Flat semi-transparent rectangle overlay | ai | Pending | 宠物门店货架、合作伙伴握手感、猫狗与零食包装同框，左侧留出CTA文字空间 | none | hero_page |
| hero-natural-treats.png | 1536x1024 | 1.50 | 品牌生活方式佐证图 | Photography | #80 Side hero image + staggered evidence cards | user | Existing | 本地素材，用于品牌价值或标准页侧栏 | | |
| product-chicken-strips.png | 900x720 | 1.25 | 原切肉类产品图 | Photography | #47 Small multiples | user | Existing | 本地商品图，用于产品矩阵 | | |
| product-freeze-dried.png | 900x720 | 1.25 | 冻干类产品图 | Photography | #47 Small multiples | user | Existing | 本地商品图，用于产品矩阵 | | |
| product-dental-chews.png | 900x720 | 1.25 | 洁齿类产品图 | Photography | #47 Small multiples | user | Existing | 本地商品图，用于产品矩阵 | | |
| product-training-bites.png | 900x720 | 1.25 | 训练奖励类产品图 | Photography | #47 Small multiples | user | Existing | 本地商品图，用于产品矩阵 | | |

## IX. Content Outline

### Part 1: 招商结论先行

#### Slide 01 - Cover

- **Cover impact**: Hook: “天然零食不是单品生意，而是可运营的渠道合作项目”；Composition: AI full-bleed lifestyle scene with floating title on a clean scrim.
- **Layout**: Full-bleed warm pet lifestyle image; left title stack; lower pill tags for 单一原料 / 低温慢制 / 日常奖励.
- **Title**: 岚禾小食宠物零食品牌招商方案
- **Subtitle**: 用天然短配方产品矩阵，连接门店陈列、私域复购与数字化运营
- **Info**: 2026 · 渠道合作版

#### Slide 02 - 岚禾小食适合合作方快速讲清、快速陈列、快速演示

- **Layout**: KPI cards plus right-side conclusion block.
- **Title**: 岚禾小食适合合作方快速讲清、快速陈列、快速演示
- **Core message**: 这个项目的招商价值来自“产品卖点清楚 + 购买链路完整 + 后台数据可展示”的组合。
- **Visualization**: kpi_cards
- **Content**:
  - `0` 人工色素：用“干净配方”打开信任。
  - `72h` 低温风干：用工艺语言提升产品价值感。
  - `6` 精选配方：可覆盖不同宠物和喂养场景。
  - `100%` 中文标注成分：降低导购解释成本。

### Part 2: 产品为什么能卖

#### Slide 03 - 三条产品标准把“天然”变成可复述的导购语言

- **Layout**: Vertical list with hero lifestyle image as right-side evidence panel.
- **Title**: 三条产品标准把“天然”变成可复述的导购语言
- **Core message**: 短配方、可拆解、好收纳让渠道端容易讲解，消费者也容易理解。
- **Visualization**: vertical_list
- **Content**:
  - 短配方：每款零食控制主要原料和辅料数量，避开复杂调味。
  - 可拆解：训练小粒、撕条和咀嚼棒适合按体型分量喂食。
  - 好收纳：规格适合两到三周内消耗，减少久放后的风味损耗。

#### Slide 04 - 四类零食覆盖门店最常见的购买场景

- **Layout**: Four product cards with real product images, category tags, and concise sales script.
- **Title**: 四类零食覆盖门店最常见的购买场景
- **Core message**: 原切肉、冻干、洁齿、训练奖励共同构成一套可陈列的基础产品矩阵。
- **Visualization**: icon_grid
- **Content**:
  - 原切肉：高蛋白、低脂，适合日常奖励。
  - 冻干：挑食友好，可拌粮，可加餐。
  - 洁齿：餐后咀嚼和口腔护理场景。
  - 训练奖励：小颗粒、控量，适合高频互动。

#### Slide 05 - 消费场景不是“买零食”，而是四种日常关系

- **Layout**: Hub-spoke; center is 日常奖励, four surrounding scenes.
- **Title**: 消费场景不是“买零食”，而是四种日常关系
- **Core message**: 把产品放进训练、陪伴、挑嘴和护理场景，能帮助渠道方形成复购话术。
- **Visualization**: hub_spoke
- **Content**:
  - 训练互动：小颗粒、易控量。
  - 挑嘴加餐：冻干和拌粮提升适口性。
  - 陪伴奖励：肉条和原切口感更直接。
  - 口腔护理：洁齿棒强化餐后习惯。

### Part 3: 为什么不是普通单品招商

#### Slide 06 - 前台购买链路已经具备从种草到下单的演示闭环

- **Layout**: Process flow with five rounded nodes and small UI callouts.
- **Title**: 前台购买链路已经具备从种草到下单的演示闭环
- **Core message**: 合作方看到的不只是产品图，而是一个能演示筛选、详情、购物车和订单的消费路径。
- **Visualization**: process_flow
- **Content**:
  - 筛选：按猫狗和食品类型分层选购。
  - 详情：成分、适用建议、适口性标准化展示。
  - 购物车：加购、增减数量、合计金额。
  - 地址：登录后管理收货地址。
  - 订单：确认购买后写入本地订单。

#### Slide 07 - 管理后台把招商演示从“产品展示”推进到“经营展示”

- **Layout**: Layered architecture, from storefront to local order data to admin dashboard.
- **Title**: 管理后台把招商演示从“产品展示”推进到“经营展示”
- **Core message**: 订单、营业额、销量排行和新品上架能力让合作方能理解后续运营方式。
- **Visualization**: layered_architecture
- **Content**:
  - 前台层：商品列表、筛选、详情、购物车。
  - 数据层：`pawNaturalOrders` 和 `pawNaturalProducts` 记录订单与新品。
  - 后台层：营业额、订单数、售出件数、销量冠军、订单列表。
  - 运营动作：新品上架后自动同步到前台参与筛选和购买。

### Part 4: 谁适合合作、怎么启动

#### Slide 08 - 四类渠道都能找到自己的合作切入点

- **Layout**: Four vertical pillars.
- **Title**: 四类渠道都能找到自己的合作切入点
- **Core message**: 门店、社区团购、私域团长和区域代理的诉求不同，但都能承接“产品矩阵 + 场景话术 + 数据演示”。
- **Visualization**: vertical_pillars
- **Content**:
  - 宠物门店：适合做货架陈列与导购推荐。
  - 社区团购：适合用“日常奖励”和“挑嘴加餐”形成组合包。
  - 私域团长：适合用短配方和宠物场景做内容种草。
  - 区域代理：适合打包产品、物料和后台演示能力。

#### Slide 09 - 合作启动可以压缩为选品、陈列、复盘三步

- **Layout**: Numbered steps with deliverables under each step.
- **Title**: 合作启动可以压缩为选品、陈列、复盘三步
- **Core message**: 第一轮合作不需要复杂系统，先用标准品类和本地后台跑出可复盘的销售闭环。
- **Visualization**: numbered_steps
- **Content**:
  - 1 选品：从原切肉、冻干、洁齿、训练奖励中组合首批 SKU。
  - 2 陈列：按猫狗、食品类型和消费场景组织货架/私域内容。
  - 3 复盘：用订单、销量排行、商品销售明细判断补货与新品方向。

#### Slide 10 - Closing

- **Closing impact**: Leave-behind: “把天然宠物零食做成能被渠道持续运营的合作项目”；Composition: AI partnership scene with large CTA and three commitment chips.
- **Layout**: Full-bleed AI closing image; foreground CTA panel; three chips: 产品矩阵 / 场景话术 / 数据复盘.
- **Title**: 一起把天然宠物零食做成可复购的渠道生意
- **Content**: 以标准化产品矩阵进入渠道，以场景化导购提高转化，以订单与销量数据持续复盘。

## X. Speaker Notes Requirements

- **Filename**: match SVG name, e.g. `01_cover.md`.
- **Style**: 商务、清晰、结论先行；每页先说结论，再说 2-3 个支持点。
- **Duration**: 10-12 minutes total.
- **Purpose**: persuade channel partners to start a first cooperation conversation.

## XI. Technical Constraints Reminder

1. viewBox: `0 0 1280 720`.
2. Text wrapping uses `<tspan>`; `<foreignObject>` forbidden.
3. Transparency uses `fill-opacity` / `stroke-opacity`; `rgba()` forbidden.
4. Forbidden: `<style>`, `class`, `textPath`, `animate*`, `script`, `<g opacity>`.
5. Chinese labels, data and cooperation terms must be SVG text, not baked into images.
