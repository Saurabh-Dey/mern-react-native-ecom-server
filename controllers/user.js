import { asyncError } from "../middlewares/erros.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import {
  sendToken,
  cookieOptions,
  getDataUri,
  sendEmail,
} from "../utils/features.js";
import cloudinary from "cloudinary";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  // if (!user) {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Incorrect Email or Password" });
  // }

  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  if (!password) return next(new ErrorHandler("Please Enter Password ", 400));

  // handle error

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }
  sendToken(user, res, `Welcome Back , ${user.name}`, 200);
});

export const signup = asyncError(async (req, res, next) => {
  const { name, email, password, address, city, country, pinCode } = req.body;

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User Already Exist", 400));

  // Adding Cloudinary here
  let avatar = undefined;

  if (req.file) {
    // console.log(req.file);
    const file = getDataUri(req.file);
    const myCloud = await cloudinary.v2.uploader.upload(file.content);

    avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  // console.log(myCloud.secure_url);

  user = await User.create({
    avatar,
    name,
    email,
    password,
    address,
    city,
    country,
    pinCode,
  });
  sendToken(user, res, `Register Successfully`, 201);
});

export const logOut = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully! ",
    });
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { name, email, address, city, country, pinCode } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (city) user.city = city;
  if (country) user.country = country;
  if (pinCode) user.pinCode = pinCode;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(
      new ErrorHandler("Please Enter Old Password and New Password", 400)
    );

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) return next(new ErrorHandler("Incorrect Old Password", 400));

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

export const updatePic = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // console.log(req.file);
  const file = getDataUri(req.file);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  const myCloud = await cloudinary.v2.uploader.upload(file.content);

  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar Updated Successfully",
  });
});

export const fotgetPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Incorrect Email", 400));

  const randomNumber = Math.random() * (999999 - 100000) + 100000;
  const otp = Math.floor(randomNumber);

  const otp_expire = 15 * 60 * 1000;
  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);
  await user.save();
  // console.log(otp);
  const message = `Your OTP For Reseting Password is ${otp}.\n Please ignore if you haven't requested this`;
  // console.log(message);
  try {
    await sendEmail("OTP For Reseting Password", user.email, message);
  } catch (error) {
    user.otp = null;
    user.otp_expire = null;
    await user.save();
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: `Email Sent To ${user.email}`,
  });
});

// export const resetPassword = asyncError(async (req, res, next) => {
//   const { otp, password } = req.body;
//   const user = await User.findOne({
//     otp,
//     otp_expire: {
//       $gt: Date.now(),
//     },
//   });

//   if (!user)
//     return next(new ErrorHandler("Incorrect OTP or has been expired", 400));
//   if (!password)
//     return next(new ErrorHandler("Please Enter New Password", 400));

//   user.password = password;
//   user.otp = undefined;
//   user.otp_expire = undefined;

//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Password Changed Successfully, You can login now",
//   });
// });

export const resetPassword = asyncError(async (req, res, next) => {
  const { otp, password } = req.body;

  const user = await User.findOne({
    otp,
    otp_expire: {
      $gt: Date.now(),
    },
  });
  console.log(user);

  if (!user)
    return next(new ErrorHandler("Incorrect OTP or has been expired", 400));

  if (!password)
    return next(new ErrorHandler("Please Enter New Password", 400));

  user.password = password;
  user.otp = undefined;
  user.otp_expire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully, You can login now",
  });
});
