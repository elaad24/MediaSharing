export interface userLogin {
  userName: string;
  password: string;
}
export interface userSignup {
  userName: string;
  password: string;
  email: string;
}

export interface DBUser {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  plainPassword: string;
  role: userRoles;
}

type userRoles = "admin" | "manager" | "user";
