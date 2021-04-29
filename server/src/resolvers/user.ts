import { MyContext } from "../types";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { User } from "../entities/User";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
// import { getConnection } from "typeorm";

//another way than post
@InputType()
class UserData {
  @Field() username: string;
  @Field() email: string;
  @Field() password: string;
}

@ObjectType()
class Error {
  @Field() field: string;
  @Field() error: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true }) errors?: [Error];
  @Field(() => User, { nullable: true }) user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext): String {
    //this is current user so show him email
    if (req.session.userId === user.id) return user.email;

    //not the current user so hide email
    return "";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) return undefined; //user not logged in
    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req, redisClient }: MyContext
  ): Promise<UserResponse> {
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redisClient.get(key);
    if (!userId)
      return { errors: [{ field: "token", error: "Token Expired" }] };
    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);
    if (!user) return { errors: [{ field: "token", error: "User not found" }] };
    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );

    //login user
    req.session.userId = user.id;
    await redisClient.del(key);
    return { user };
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("email") email: string,
    @Ctx() { redisClient }: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ email });
    if (!user) return false; //email is not in db
    const token = v4();
    redisClient.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24
    ); //valid till 1 day
    await sendEmail(
      email,
      `<a href=http://localhost:3000/change-password/${token}>Reset Password</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserData,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    if (!options.email.match(/@.mail\.com/))
      return { errors: [{ field: "email", error: "Incorrect email" }] };
    if (options.username.includes("@"))
      return {
        errors: [{ field: "username", error: "Username can not contain '@'" }],
      };
    const hashedPassword = await argon2.hash(options.password);

    try {
      const user = await User.create({
        username: options.username,
        email: options.email,
        password: hashedPassword,
      }).save();

      //store userId in session
      //this will set cookie in browser keeping them logged in
      req.session.userId = user.id;
      return { user };

      // another way
      // const result = await getConnection()
      //     .createQueryBuilder()
      //     .insert()
      //     .into(User)
      //     .values([
      //         { username: options.username, email: options.email,password:hashedPassword },
      //      ]).returning("*")
      //     .execute();
      //const user = result.raw[0]
    } catch (err) {
      if (err.detail.includes("already exists"))
        return {
          errors: [
            {
              field: "username or email",
              error: "Username or Email already exists",
            },
          ],
        };
      else
        return {
          errors: [
            {
              field: "unknown",
              error: "Some error occured",
            },
          ],
        };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user)
      return {
        errors: [
          { field: "usernameOrEmail", error: "Entered data does not exist" },
        ],
      };
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch)
      return {
        errors: [{ field: "password", error: "Incorrect password" }],
      };

    //store userId in session
    //this will set cookie in browser keeping them logged in
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
        } else resolve(true);
      })
    );
  }
}
