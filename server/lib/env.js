function requiredEnv(keys) {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length) {
    const error = new Error(`缺少环境变量：${missing.join(", ")}`);
    error.code = "PAYMENT_CONFIG_MISSING";
    error.missing = missing;
    throw error;
  }
}

function paymentEnv() {
  return process.env.PAYMENT_ENV === "production" ? "production" : "sandbox";
}

function alipayGateway() {
  return paymentEnv() === "production" ? process.env.ALIPAY_GATEWAY_PROD : process.env.ALIPAY_GATEWAY_SANDBOX;
}

module.exports = { alipayGateway, paymentEnv, requiredEnv };
