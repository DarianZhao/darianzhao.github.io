# www.darianzhao.com

Darian Zhao 的长期个人主页，使用 GitHub Pages 托管。

## 结构

- `index.html`：主页内容与语义结构
- `styles.css`：完整视觉系统与响应式布局
- `CNAME`：唯一正式域名 `www.darianzhao.com`
- `robots.txt`、`sitemap.xml`：搜索引擎入口
- `.nojekyll`：让 GitHub Pages 直接发布原始静态文件
- `tests/static-site.test.mjs`：发布前自动验证

站点没有数据库、登录、框架运行时或第三方脚本。GitHub Pages 直接分发 HTML 与 CSS，保持最少依赖和最大的可迁移性。

## 共同编辑

直接在 Codex 对话中描述希望增加、修改或删除的内容即可。每次变更会先经过本地验证，再提交到 GitHub；GitHub Pages 随后自动更新 `https://www.darianzhao.com`。

## 验证

```bash
npm test
```
