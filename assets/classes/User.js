class User {
  constructor() {}
  setValues(
    firstName,
    lastName,
    email,
    password,
    posts,
    comments,
    likes,
    photo
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.posts = posts;
    this.comments = comments;
    this.likes = likes;
    this.photo = photo;
  }
  defalutValues(firstName, lastName, email, password) {
    this.setValues(
      firstName,
      lastName,
      email,
      password,
      [],
      [],
      [],
      "./../../assets/img/profile.jpg"
    );
  }
  objectValues(data) {
    this.setValues(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.posts,
      data.comments,
      data.likes,
      data.photo
    );
  }
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  toObject() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      posts: this.posts,
      comments: this.comments,
      likes: this.likes,
      photo: this.photo,
    };
  }
  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

export { User };
