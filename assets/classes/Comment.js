// a class to create a comment object
// each comment has an author, a post, and a content
class Comment {
  constructor() {}
  // set the values of the comment
  setValues(author, post, content) {
    this.author = author;
    this.post = post;
    this.content = escape(content);
  }
  // set the values of the comment from an object
  objectValues(data) {
    this.setValues(data.author, data.post, data.content);
  }
  // express the comment as an object
  toObject() {
    return {
      author: this.author,
      post: this.post,
      content: this.content,
    };
  }
  // express the comment as a string
  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

// export the class to be used in other files
export { Comment };
