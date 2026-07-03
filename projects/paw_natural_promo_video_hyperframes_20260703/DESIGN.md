# Design System

## Overview

爪味自然是一个暖调、干净、亲和的宠物零食商城。页面以米色纸感背景、鼠尾草绿按钮、陶土棕价格强调和圆角卡片构成主要视觉。整体布局像高端食品电商：首屏生活方式大图建立信任，商品区用整齐卡片承载 SKU，后台页用指标卡和表格表达经营能力。

## Colors

- **Ink**: `#222926` — 标题、主正文和深色信息区。
- **Muted Text**: `#69716B` — 说明文字、辅助标签、注释。
- **Paper**: `#FAF7EF` — 页面主背景。
- **Warm Surface**: `#EFE8DC` — 浅暖区块和表单底色。
- **Sage**: `#6F8974` — 温和绿色强调。
- **Sage Dark**: `#3F594A` — 主按钮、品牌标识、关键标题。
- **Clay**: `#B98558` — 价格、转化提示和轻松反差开场强调。
- **Gold**: `#C79B4B` — 热销榜、招商亮点和 CTA 辅助色。
- **White Cream**: `#FFFDF7` — 卡片、商品容器、弹窗。

## Typography

- **Primary**: `"Microsoft YaHei"`，权重 400/700/800/900。用于全部中文标题、正文、按钮和字幕。
- **Fallback**: `"PingFang SC", Arial, sans-serif`。保持中文清晰、圆润和商务感。
- **Video hierarchy**: 大标题 78-112px，二级标题 54-72px，正文 30-38px，标签不低于 22px，字幕 44-52px。
- **Numbers**: 价格、订单数、销量使用 `font-variant-numeric: tabular-nums`。

## Elevation

深度来自柔和阴影、圆角卡片和半透明暖色遮罩。商品图使用轻微透视和 Ken Burns 缓慢缩放，后台 UI 使用浮动面板，不做强烈玻璃拟态或霓虹效果。

## Components

- **Fixed Brand Header**: 米色半透明导航，圆形“爪”品牌标。
- **Lifestyle Hero**: 左侧大标题、右侧天然宠物零食图，浅色遮罩保证文字可读。
- **Product Cards**: 白色圆角卡片、商品图、标签、价格和按钮。
- **Filter Chips**: 胶囊筛选器，激活态为 `#3F594A`。
- **Hot Sales Band**: 深色横向榜单，金色 rank badge。
- **Admin Metrics**: 四个指标卡 + 销量排行 + 订单表格，表达经营闭环。

## Do's and Don'ts

### Do's

- 使用 `#FAF7EF`、`#FFFDF7` 和 `#3F594A` 建立干净天然的主视觉。
- 用真实商品图和 UI 卡片做镜头主体，不做空泛抽象图形。
- 让每个镜头至少有一个缓慢运动的图片或面板，避免静态幻灯片感。
- 文案短句大字，保持手机和会议大屏都可读。

### Don'ts

- 不使用高饱和荧光色、暗黑科技风或强烈紫蓝渐变。
- 不把中文卖点烘焙进图片，字幕和标题保持 HTML 可编辑文本。
- 不用跳切；场景之间使用柔和模糊转场或 light leak。
- 不把画面做成网页录屏流水账，要重构为品牌宣传节奏。
