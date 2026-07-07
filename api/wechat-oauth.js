const { sendJson, getBaseUrl } = require("../server/lib/http");

/**
 * WeChat MP OAuth flow for JSAPI payments.
 * ?action=authorize → redirect to WeChat OAuth page
 * ?action=callback  → exchange code for openid, redirect back to frontend
 */
module.exports = async function handler(req, res) {
  const action = req.query?.action || "authorize";

  const mpAppId = process.env.WECHAT_MP_APP_ID;
  const mpAppSecret = process.env.WECHAT_MP_APP_SECRET;

  if (!mpAppId || !mpAppSecret) {
    return sendJson(res, 503, {
      ok: false,
      error: "WECHAT_JSAPI_NOT_CONFIGURED",
      message: "微信公众号 JSAPI 支付未配置"
    });
  }

  if (action === "authorize") {
    const baseUrl = getBaseUrl(req);
    const redirectUri = encodeURIComponent(
      process.env.WECHAT_OAUTH_REDIRECT_URL || `${baseUrl}/api/wechat-oauth/callback`
    );
    // snsapi_base: silent authorization, only gets openid (no user consent screen)
    const oauthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${mpAppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=pay#wechat_redirect`;
    res.writeHead(302, { Location: oauthUrl });
    res.end();
    return;
  }

  if (action === "callback") {
    const code = req.query?.code;
    if (!code) {
      return sendJson(res, 400, { ok: false, error: "MISSING_CODE", message: "缺少授权码" });
    }

    try {
      const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${mpAppId}&secret=${mpAppSecret}&code=${code}&grant_type=authorization_code`;
      const response = await fetch(tokenUrl);
      const data = await response.json();

      if (data.errcode || !data.openid) {
        return sendJson(res, 400, {
          ok: false,
          error: "WECHAT_OAUTH_FAILED",
          message: data.errmsg || "微信授权失败"
        });
      }

      // Redirect back to frontend with openid in hash (avoids server logs)
      const baseUrl = getBaseUrl(req);
      res.writeHead(302, {
        Location: `${baseUrl}/#wechat_openid=${data.openid}`
      });
      res.end();
    } catch (error) {
      return sendJson(res, 500, {
        ok: false,
        error: "WECHAT_OAUTH_ERROR",
        message: error.message
      });
    }
    return;
  }

  return sendJson(res, 404, { ok: false, error: "OAUTH_ACTION_NOT_FOUND" });
};
