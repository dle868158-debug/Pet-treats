# Pet Treats

一个面向高端天然宠物零食品牌的静态展示与前端购物车示例站点。页面以中文内容呈现，包含商品筛选、热销榜、商品详情弹窗、购物车抽屉和本地模拟下单流程。

## 功能特性

- 品牌首页首屏展示
- 商品分类筛选：全部、鸡肉、冻干、洁齿、训练奖励
- 热销榜：根据商品销量自动排序展示前三名
- 商品卡片：展示标签、价格、销量和简介
- 商品详情弹窗：展示成分、适用建议和适口性
- 购物车功能：加入商品、增减数量、删除商品、合计金额
- 本地购物车持久化：使用 `localStorage` 保存已选商品
- 模拟提交订单：前端生成模拟订单号

## 项目结构

```text
.
├── assets/
│   ├── hero-natural-treats.png
│   ├── product-chicken-strips.png
│   ├── product-dental-chews.png
│   ├── product-freeze-dried.png
│   └── product-training-bites.png
├── index.html
├── script.js
├── styles.css
├── .gitattributes
├── .gitignore
└── README.md
```

## 本地运行

这是一个纯静态项目，不需要安装依赖。

直接用浏览器打开：

```text
index.html
```

也可以在项目目录下启动任意静态服务器，例如：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

## 主要文件说明

- `index.html`：页面结构、导航、商品区、标准说明、购物车和详情弹窗容器
- `styles.css`：整体视觉风格、响应式布局、商品卡片、热销榜、购物车和弹窗样式
- `script.js`：商品数据、筛选逻辑、热销榜排序、购物车状态、详情弹窗和模拟下单逻辑
- `assets/`：首页和商品图片资源

## 商品数据维护

商品数据集中维护在 `script.js` 的 `products` 数组中。新增或调整商品时，主要修改以下字段：

```js
{
  id: "chicken-strips",
  name: "慢烘鸡胸肉条",
  category: "鸡肉",
  price: 59,
  sales: 2680,
  weight: "120g",
  image: "assets/product-chicken-strips.png",
  tags: ["高蛋白", "低脂", "猫狗通用"],
  ingredients: "...",
  suitability: "...",
  palatability: "...",
  description: "..."
}
```

热销榜会根据 `sales` 字段自动排序，无需单独维护榜单内容。

## 后续可扩展方向

- 接入真实商品后台或 CMS
- 接入真实订单与支付流程
- 增加商品搜索、规格选择和库存状态
- 增加移动端底部购物车入口
- 为商品卡片和购物车逻辑补充自动化测试

## 仓库地址

[https://github.com/dle868158-debug/Pet-treats](https://github.com/dle868158-debug/Pet-treats)
