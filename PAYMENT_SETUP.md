# 支付宝与微信支付配置说明

本项目已接入 Vercel Serverless 支付后端，密钥只通过 Vercel Environment Variables 配置，不写入前端或 Git。

## Vercel 环境变量

必填：

- `APP_BASE_URL=https://pet-treats.vercel.app`
- `PAYMENT_ENV=sandbox` 或 `production`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_DASHBOARD_TOKEN`
- `ALIPAY_APP_ID`
- `ALIPAY_PRIVATE_KEY`
- `ALIPAY_PUBLIC_KEY`
- `ALIPAY_GATEWAY_SANDBOX`
- `ALIPAY_GATEWAY_PROD`
- `WECHAT_MCH_ID`
- `WECHAT_APP_ID`
- `WECHAT_API_V3_KEY`
- `WECHAT_PRIVATE_KEY`
- `WECHAT_SERIAL_NO`
- `WECHAT_PLATFORM_CERT_SERIAL_NO`
- `WECHAT_PLATFORM_CERT_PUBLIC_KEY`
- `WECHAT_NOTIFY_URL=https://pet-treats.vercel.app/api/webhooks/wechat`

Phase 2 微信 JSAPI 预留：

- `WECHAT_MP_APP_ID`
- `WECHAT_MP_APP_SECRET`
- `WECHAT_OAUTH_REDIRECT_URL`

## 支付平台后台配置

支付宝异步通知：

```text
https://pet-treats.vercel.app/api/webhooks/alipay
```

微信支付通知：

```text
https://pet-treats.vercel.app/api/webhooks/wechat
```

微信 H5 支付域名：

```text
pet-treats.vercel.app
```

## 接口

- `POST /api/orders`
- `POST /api/payments/alipay`
- `POST /api/payments/wechat`
- `GET /api/payments/status?orderId=`
- `POST /api/payments/alipay/query`
- `POST /api/payments/wechat/query`
- `POST /api/orders/close`
- `POST /api/webhooks/alipay`
- `POST /api/webhooks/wechat`
- `GET /api/orders/list`，需要 `Authorization: Bearer <ADMIN_DASHBOARD_TOKEN>`

## 注意

第一版只支持支付宝 PC/WAP 和微信 Native/H5。微信内 JSAPI 支付需要公众号网页授权和 `openid`，单独放在 Phase 2。

真实支付金额由服务端商品表 `api/lib/catalog.js` 计算。当前覆盖商城默认商品；如果后台新上架商品也要参与真实支付，需要把商品上架同步到服务端存储，不能只依赖浏览器 `localStorage`。
