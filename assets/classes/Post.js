class Post {
  constructor() {}
  setValues(title, content, author, date, comments, likes, saves) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.date = date;
    this.comments = comments;
    this.likes = likes;
    this.saves = saves;
  }
  defaultValues(title, content, author) {
    this.setValues(
      escape(title),
      escape(content),
      author,
      new Date(),
      [],
      [],
      []
    );
  }
  objectValues(data) {
    this.setValues(
      data.title,
      data.content,
      data.author,
      data.date,
      data.comments,
      data.likes,
      data.saves
    );
  }
  get fullDate() {
    return `${this.date.getDate()} ${
      getMonthNames()[this.date.getMonth()]
    } ${this.date.getFullYear()}`;
  }

  toObject() {
    return {
      title: this.title,
      content: this.content,
      author: this.author,
      date: this.fullDate,
      comments: this.comments,
      likes: this.likes,
    };
  }

  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

function getMonthNames() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
}

export { Post };
