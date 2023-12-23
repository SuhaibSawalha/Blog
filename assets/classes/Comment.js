class Comment {
  constructor() {}
  setValues(author, post, content) {
    this.author = author;
    this.post = post;
    this.content = escape(content);
  }
  objectValues(data) {
    this.setValues(data.author, data.post, data.content);
  }
  toObject() {
    return {
      author: this.author,
      post: this.post,
      content: this.content,
    };
  }
  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

export { Comment };
