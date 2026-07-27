export default function Home() {
  return (
    <main>
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />

      <header className="siteHeader">
        <a className="wordmark" href="#top" aria-label="返回首页顶部">
          DZ
        </a>
        <div className="headerMeta">
          <span>Personal atlas</span>
          <span className="status">
            <i aria-hidden="true" />
            Building in public
          </span>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="page-title">
        <div className="eyebrow">Darian Zhao · 赵达然</div>
        <h1 id="page-title">
          <span>一个持续生长的</span>
          <em>个人坐标系。</em>
        </h1>
        <div className="heroFooter">
          <p>
            我正在把经历、作品、判断与好奇心，整理成一张可以被理解、
            被探索，也会随时间更新的个人地图。
          </p>
          <a className="roundLink" href="#atlas" aria-label="查看主页信息地图">
            <span>向下探索</span>
            <b aria-hidden="true">↓</b>
          </a>
        </div>
      </section>

      <section className="atlas" id="atlas" aria-labelledby="atlas-title">
        <div className="sectionIntro">
          <p className="sectionLabel">01 / The atlas</p>
          <h2 id="atlas-title">认识一个人，不该只有一段简介。</h2>
          <p>
            这四个维度会构成主页的长期结构。下一步，我们将用真实内容逐一填满。
          </p>
        </div>

        <div className="atlasGrid">
          <article className="atlasCard">
            <span className="cardIndex">A</span>
            <div>
              <h3>我是谁</h3>
              <p>成长轨迹、重要转折、价值观，以及塑造我的人与事。</p>
            </div>
            <span className="cardState">待展开</span>
          </article>
          <article className="atlasCard">
            <span className="cardIndex">B</span>
            <div>
              <h3>我在创造什么</h3>
              <p>职业、项目、作品，以及我解决问题时所相信的方法。</p>
            </div>
            <span className="cardState">待展开</span>
          </article>
          <article className="atlasCard">
            <span className="cardIndex">C</span>
            <div>
              <h3>我如何思考</h3>
              <p>写作、观点、阅读与观察，记录判断形成的过程。</p>
            </div>
            <span className="cardState">待展开</span>
          </article>
          <article className="atlasCard">
            <span className="cardIndex">D</span>
            <div>
              <h3>此刻的我</h3>
              <p>正在投入的事情、最近的关注，以及希望遇见的合作。</p>
            </div>
            <span className="cardState">待展开</span>
          </article>
        </div>
      </section>

      <section className="principle" aria-labelledby="principle-title">
        <p className="sectionLabel">02 / A living site</p>
        <div className="principleBody">
          <h2 id="principle-title">不是一次写完的履历，而是一个长期维护的本人。</h2>
          <p>
            内容会不断补充，视觉会逐步成形。每一次更新都保留清晰版本，
            让这个站点既能稳定抵达，也能一直生长。
          </p>
        </div>
      </section>

      <footer>
        <div>
          <strong>Darian Zhao</strong>
          <span>London · 2026</span>
        </div>
        <p>Foundation edition · v0.1</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>
    </main>
  );
}
