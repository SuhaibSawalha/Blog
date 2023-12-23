class User {
  constructor() {}
  setValues(
    firstName,
    lastName,
    email,
    password,
    posts,
    likes,
    comments,
    saves,
    photo
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.posts = posts;
    this.likes = likes;
    this.comments = comments;
    this.saves = saves;
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
      data.likes,
      data.comments,
      data.saves,
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
      likes: this.likes,
      comments: this.comments,
      saves: this.saves,
      photo: this.photo,
    };
  }
  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

export { User };
