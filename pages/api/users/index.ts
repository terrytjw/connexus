import { USER_PROFILE_BUCKET } from "./../../../lib/constant";
import { retrieveImageUrl, uploadImage } from "./../../../lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, User } from "@prisma/client";
import { findAllUser, saveUser } from "../../../lib/user";

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns a list of User objects
 *     responses:
 *       200:
 *         description: A list of User objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *   post:
 *     description: Create a User object
 *     parameters:
 *       - in: object
 *         name: User
 *         required: true
 *         description: User object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: The created User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | ErrorResponse>
) {
  const { method } = req;

  switch (req.method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const user = JSON.parse(JSON.stringify(req.body)) as User;
      await handlePOST(user);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const users = await findAllUser();
      res.status(200).json(users);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(user: User) {
    try {
      const { profilePic, bannerPic } = user;
      let profilePictureUrl = "";
      let bannerPicUrl = "";


      if (profilePic) {
        const { data, error } = await uploadImage(
          USER_PROFILE_BUCKET,
          profilePic
        );

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }

        if (data)
          profilePictureUrl = await retrieveImageUrl(
            USER_PROFILE_BUCKET,
            data.path
          );
      }

      if (bannerPic) {
        const { data, error } = await uploadImage(
          USER_PROFILE_BUCKET,
          bannerPic
        );

        if (error) {
          const errorResponse = handleError(error);
          res.status(400).json(errorResponse);
        }
        if (data)
          bannerPicUrl = await retrieveImageUrl(USER_PROFILE_BUCKET, data.path);
      }
      // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAAAiCAYAAABvCirZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAlUSURBVHgB7VvfbxxHHf/M+UiTFMqlKS/ty1qQPNuoFJ7w5YnHuELqq/ceoI0A2adKkB+1bl2TJqpQfX4ICQTV67/AF154q88gISSEfOEBoRbwRqIgELXPJc0v2zf9fm9nfLNzO3eXxoqa036k9e3OfGfmuzOf+c53vrMWOCDcufL2NKScoVuPrkZLiMUv/uDHITIMDQQOALevvO3npFxKySof/eFPqsgwFMjhACAkph1Z08gwNDgYskCOObI8ZBga5PEZMOMHhfvYLUqI0xKY3LzfwrNPdfOO8hvIMDRok0XevKycU+nRY4PuF8X4hdAUZILcwZ6fgzx9DzskJ6IWcENiZPGPH+2sfOf5pzy78pzYW0SGoYGQ65d8+tvtnEqUzyw+qLWwN8kEISsxRt5wDdhbO4xDtWoYNFnsjD+7QNal8LNvHF0TcmSal6Q7u2j+ZXtn7duVNyaRYWggZOOtdfrt8jk++ljiwrv3mjT4y/RYO4x8QxNE4zU/8Ig8q8DIqWthEOl0tkJ3sbchMDJupmd4ssHLUKpzevwZgV+E88d6F9+rkAlatgnBpHrNf4OWoF22WKeQYSiQY98jLeN/2y0a8Nml2Hp043t+wCQrXgt/GqTlkyWi+IrwiDRFZBgK5NiZTcu49R9efqTgZSYmTXLQR7C3Qj9zrorZutASVqbbCjIMBdoRXOXkcgBtjC3Nn/+xu3b11w8mDpPPwfn3yMmlnwoNfpMcXU2uyrVwfrRfA0Qy8mkELVXzITI80XCG+2mQq0QMSX5LuZM26xO1pui2iLZVyYeXvrDNsZYZujzBZ0JEpueuvxMa9ZCsWGLi2Q7ygODzpgnEvhWX59gNO931FNkC4qixj05AkOWZ4KEly/kLqkw9fh/wpJhSaU1Vrm6Vm1ZyjJKS47SiSqsr/SKkg+Uqqn1Pla+pthqWfqsqTbdj6xHQVUXHwtu6Reitu84vGO+gfdhIvcuilnOShXc0ZFFopyRL5JfUdToNfiXeRsvtr+d2p747cr+7sBDl4798Z/9M6FV/doXkb7r8Gwc8xJ3lOfIDJJfBMSVfcMhHiJ3tyChvLpEhYpL1a2fLaIMHuYjuNiOrLSiZFXRIhT5tbSBJeK5PE2YKSfKXlC5bRhpP8qrVvpk/p9pjpO6IFZqq7YYz3B9bAVliq8DE4bTY2RU+bYnLNPA+ESU9Qitl4kyI5envlK5nAHjoTRRGgM7gavlCnzpXeuT7PdopGs9mG5NIb9Ojy45dLaA3Ucy27DrHjPq4zTClbOEhnzV8JInSRNKKaSvb+2wotijyxt32FpnR/q0bW+WBzoRieblMlmoBg6GCbqIwMSPjmV+gru65IwtWXoh4tplgfQO4YdZp69MLDSSXEEYRHXL4SJIxQjzzecbaS0xFPb9spTNJmOw2CXnJC/HZ4Rn3dbqOqeuUqrus9O1/NkRb4ICXo+/7s7fQfvkRM24SIWX2b8ocb7s3OOLLxwFMlhd+9LpEC/6lC2/65N806KR68dxJEaY0yYPuW21wx+nB4Dw2w4tG+0VLnh1z3dFMkHUjfwLpqKl2oOpcR4eARbgxbugWIEksHuA6XaetMvYSxTpOG21D1cn6rFr12Tr7eDQ0LT2YjMuqfd8U7HvqrJcj2mOzVZhLBOAc2+5jYq/MpJKQxNDdjbPvvreaf6YQ5Atx3wtWSmDprb+2P5ayYVsrrbhGiLizaw55nglmB2iHWKOIdJh+SWSVYXgpZW4gqVvVyv+yoywTasm4pow8U/c6YsuThkaPvIdBzWhTT1Qm6Jb69bXgQJ8oCDXDyElNzJDjv6rSjkmWhOow+o1aUpafu14NmVTs15DxGv3Si9/yUuvND/S9S7NPfgEHg2af5zRsDVjG1tG3LjPfnoB1R72u9IdFhG5Lp1FETGb+HYwstPshqyKYxd4Z/0LCGjAxnr2+MH5h5+n6+Z2nS18hApn5TJrckSOeo2LPobwJ24Rzx072kJ9IkZ/oIf84EFnPpxwXL2mhIce6uxx3HgeXRWLY/VCEGzzZR5UO+1tlA+2ltS9ZVGwl4qDaLvK8O6o4jgBucXg/rQ7yTyJHeiMlOUJS2SJix85H3EHr6ln7IVyH2VEso2cDk8reVdXx+LFmPU8oPfTF7+Chexdi624TIkSHBLZzzuncDz7iwXZtLjx0+pfLc/8xcZYtmd5kUVtdaijfXhuvhwG9lJhTB4QDY2d7czktXXabXI2y9cyDzm0uoNN5Y4hfkDtpzpLndO7oFXRvC23Zx4EqkgMdII6jsI7r6n4JSaeaB9jWnS2P3ZfmO9p5vqo3gHu55nzdv1oP7mfTokf8pydZ7mGXfQpzq4yr4Xx7mbGXo7jC9sdTCbAV+vBKder2+p/Cfd+GLA0RpezYDTFq6D+o5kxinQb50Gp/G/iY0UT3BPDQiZjqgSygYylmrPLar/CRJIV2ShkhugnTDwVLJ1+1baa363SSRS01Ae1qUgYtX5LITbtOpJN18PcucvniKy+Wzp4Q4+dOCHH2pBg9f0JU0RsB0kPWjDriWWbmzQwgHxpp5hIYpZSrO/LNdHt5sfNvGvch3I6kBhO+pu7Nfuf3MvWdMZ4jJHdhviobGWlMtpetNH3P6S6CaZKH/CB06uW/y2m5R0oIeBwH+fh3q83mb99bc4Xoz/izdB4kT1M+dwAR47xPxJog36YUP3eI8pBh/jSYs8/2UdJQRDJe0XDIFZRc5KjTlT+mniO49e2Xby8xdXTrUETnPCwNk+i9K/LUb4T+uhVUnlkm0ddtslx6X/oc97AK48Hm5lzlm8cDOMAnyrSdvnE1vFg1yXLARMnwOUGbLJc/kOsyLXQvEJ37mhh1FTY/qySnl+61M5wRZRgRW5YPpHQJsI/Rozxeer2x8t/DJ4sPckcKR3e3ml+9/fvm6P//kBFlCBFblvflhhSJ/XwbO1tbzX/+fGFuhOIsAq3oEA5F5jcpL8xKPufpWr54p/Pv+b4ObIYnDO2DxJbAokgJ2tyP/lajMyGvBTGRQ86j02fvVX+Wv8WMKDv6TevuGFmUrkpFfCiWkWXI0CYLb2PJyW3SgjPNvgvHQZhAF195qWvAOVD3CXnMefJRiCiTjno9ZBg6CDwCnp+V5tdcZq2Nf70pxpFhqPBI/xgvHFFT/lYFGYYOj0SWD8mJJcKUaPnajybKFsqUHiLD0OFTUBt1aHKoGM4AAAAASUVORK5CYII=";

      const updatedUserInfo = {
        ...user,
        profilePic: profilePictureUrl,
        bannerPic: bannerPicUrl,
      };

      const response = await saveUser(updatedUserInfo);
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}
