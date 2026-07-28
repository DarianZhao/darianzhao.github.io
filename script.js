const yearElement = document.querySelector("#copyrightYear");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const noteList = document.querySelector("#note-list");
const notes = Array.isArray(window.DARIAN_NOTES) ? window.DARIAN_NOTES : [];

if (noteList && notes.length) {
  noteList.replaceChildren(
    ...notes.map((note, index) => {
      const article = document.createElement("article");
      article.className = "note-card";

      const meta = document.createElement("div");
      const time = document.createElement("time");
      time.dateTime = note.date;
      time.textContent = note.displayDate;
      const category = document.createElement("span");
      category.textContent = note.category;
      meta.append(time, category);

      const title = document.createElement("h3");
      title.textContent = note.title;
      const summary = document.createElement("p");
      summary.textContent = note.summary;
      const number = document.createElement("small");
      number.textContent = `NOTE ${String(notes.length - index).padStart(3, "0")}`;

      article.append(meta, title, summary, number);
      return article;
    }),
  );
}
