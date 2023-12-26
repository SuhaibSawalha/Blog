// a class to create a post object
// each post has a title, content, author, date, comments, likes, and saves
class Post {
  constructor() {}
  // set the values of the post
  setValues(title, content, author, date, comments, likes, saves) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.date = date;
    this.comments = comments;
    this.likes = likes;
    this.saves = saves;
  }
  // set the title, content, and author of the post and set the default values for the rest
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
  // set the values of the post from an object
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
  // create a format for the date
  get fullDate() {
    return `${this.date.getDate()} ${
      getMonthNames()[this.date.getMonth()]
    } ${this.date.getFullYear()}`;
  }

  // express the post as an object
  toObject() {
    return {
      title: this.title,
      content: this.content,
      author: this.author,
      date: this.fullDate,
      likes: this.likes,
      comments: this.comments,
      saves: this.saves,
    };
  }

  // express the post as a string
  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

// get the names of the months
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

// export the class to be used in other files
export { Post };
