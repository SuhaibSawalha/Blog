// a class to create a user object
// each user has a first name, last name, email, password, posts, likes, comments, saves, and photo
class User {
  constructor() {}
  // set the values of the user
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
  // set the first name, last name, email, and password of the user and set the default values for the rest
  defalutValues(firstName, lastName, email, password) {
    this.setValues(
      escape(firstName),
      escape(lastName),
      email,
      password,
      [],
      [],
      [],
      [],
      "./../../assets/img/profile.jpg"
    );
  }
  // set the values of the user from an object
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
  // get a full name of the user
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // express the user as an object
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
  // express the user as a string
  toDataBase() {
    return JSON.stringify(this.toObject());
  }
}

// export the class to be used in other files
export { User };
