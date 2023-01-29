import * as jwt from "jsonwebtoken";

export async function JwtSign(data: Record<string, any>, secret: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(data, secret, { expiresIn: "1 day" }, (err, token) => {
      if (err) {
        return reject(err);
      }

      return resolve(token);
    });
  });
}

export async function JwtVerify(token: string, secret: string): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      return resolve(decoded as jwt.JwtPayload);
    });
  });
}
