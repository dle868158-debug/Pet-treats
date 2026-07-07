const { listProducts, getProductFromStore, saveProduct, deleteProduct } = require("../server/lib/product-store");
const { getBearerToken, methodNotAllowed, readJson, sendJson } = require("../server/lib/http");
const { rateLimit } = require("../server/lib/rate-limit");

function requireAdmin(req, res) {
  const token = getBearerToken(req) || req.query?.token;
  if (!process.env.ADMIN_DASHBOARD_TOKEN || token !== process.env.ADMIN_DASHBOARD_TOKEN) {
    sendJson(res, 401, { ok: false, error: "UNAUTHORIZED" });
    return false;
  }
  return true;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

module.exports = async function handler(req, res) {
  const action = req.query?.action || "list";

  // GET /api/products — public, returns all products
  if (action === "list") {
    if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
    try {
      const products = await listProducts();
      return sendJson(res, 200, { ok: true, products });
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: "PRODUCT_LIST_FAILED", message: error.message });
    }
  }

  // POST /api/products — admin only, create product
  if (action === "create") {
    if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
    if (!requireAdmin(req, res)) return;
    if (await rateLimit(req, res, { prefix: "product", limit: 20, windowSec: 60 })) return;
    try {
      const body = await readJson(req);
      const product = {
        id: body.id || `${slugify(body.name || "product")}-${Date.now().toString(36)}`,
        name: String(body.name || "").trim(),
        category: String(body.category || "").trim(),
        petTypes: Array.isArray(body.petTypes) ? body.petTypes : [],
        price: Number(body.price) || 0,
        priceCents: Math.round((Number(body.price) || 0) * 100),
        sales: Number(body.sales) || 0,
        weight: String(body.weight || "").trim(),
        image: String(body.image || "assets/product-chicken-strips.png").trim(),
        tags: Array.isArray(body.tags) ? body.tags : [],
        ingredients: String(body.ingredients || "").trim(),
        suitability: String(body.suitability || "").trim(),
        palatability: String(body.palatability || "").trim(),
        description: String(body.description || "").trim()
      };
      if (!product.name) return sendJson(res, 400, { ok: false, error: "MISSING_NAME", message: "商品名称不能为空" });
      const saved = await saveProduct(product);
      return sendJson(res, 200, { ok: true, product: saved });
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: "PRODUCT_CREATE_FAILED", message: error.message });
    }
  }

  // PUT /api/products?id=xxx — admin only, update product
  if (action === "update") {
    if (req.method !== "PUT" && req.method !== "POST") return methodNotAllowed(res, ["PUT", "POST"]);
    if (!requireAdmin(req, res)) return;
    try {
      const body = await readJson(req);
      const productId = req.query?.id || body.id;
      const existing = await getProductFromStore(productId);
      if (!existing) return sendJson(res, 404, { ok: false, error: "PRODUCT_NOT_FOUND" });
      const updated = {
        ...existing,
        ...body,
        id: productId,
        priceCents: Math.round((Number(body.price ?? existing.price) || 0) * 100)
      };
      const saved = await saveProduct(updated);
      return sendJson(res, 200, { ok: true, product: saved });
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: "PRODUCT_UPDATE_FAILED", message: error.message });
    }
  }

  // DELETE /api/products?id=xxx — admin only
  if (action === "delete") {
    if (req.method !== "DELETE" && req.method !== "POST") return methodNotAllowed(res, ["DELETE", "POST"]);
    if (!requireAdmin(req, res)) return;
    try {
      const productId = req.query?.id || (await readJson(req).catch(() => ({}))).id;
      if (!productId) return sendJson(res, 400, { ok: false, error: "MISSING_ID" });
      await deleteProduct(productId);
      return sendJson(res, 200, { ok: true, deleted: productId });
    } catch (error) {
      return sendJson(res, 500, { ok: false, error: "PRODUCT_DELETE_FAILED", message: error.message });
    }
  }

  return sendJson(res, 404, { ok: false, error: "PRODUCT_ACTION_NOT_FOUND" });
};
