# Darian Zhao Personal Site

`www.darianzhao.com` 的长期个人主页工程。

当前为基础版本 `v0.1`：先建立稳定的编辑、预览、验证、发布与域名链路，再逐步补充真实经历、作品、观点与视觉表达。

## 日常共同编辑

直接在 Codex 对话中描述希望增加、修改或删除的内容即可。每次变更遵循同一条发布链路：

1. 在本地实时预览中完成修改；
2. 检查桌面端、手机端、语义结构与可访问性；
3. 运行构建、自动测试、代码检查与生产依赖安全审计；
4. 保存一个可回退的版本并发布；
5. 验证 `www.darianzhao.com` 的线上结果。

## 主要文件

- `app/page.tsx`：主页内容与语义结构
- `app/globals.css`：完整视觉系统与响应式布局
- `app/layout.tsx`：站点标题、描述、社交分享与搜索引擎信息
- `app/robots.ts`、`app/sitemap.ts`：搜索引擎入口
- `tests/rendered-html.test.mjs`：上线前自动验证
- `.openai/hosting.json`：站点发布身份，不存放密钥

## 本地验证

需要 Node.js `22.13.0` 或更高版本。

```bash
npm ci
npm run dev
npm run build
node --test tests/rendered-html.test.mjs
npm run lint
```

正式域名以 `https://www.darianzhao.com` 为唯一规范地址。站点不依赖数据库、登录或外部运行时服务，保持公开主页尽可能轻量、稳定和可迁移。
