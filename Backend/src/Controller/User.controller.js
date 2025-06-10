import { DocumentModel } from "../Models/Document.model.js";
import { requestmodel } from "../Models/Request.model.js";
import { UserModel } from "../Models/User.model.js";
import ApiResponse from "../Utils/Apiresponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const RegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(username, email, password);
    const user = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (user) {
      return res.status(404).json({ message: "User exists already ,do login" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newuser = await UserModel.create({
      username,
      email,
      password: hashpassword,
    });
    const createduser = await UserModel.findById(newuser._id);
    if (!createduser) {
      return res
        .status(404)
        .json({ message: "Server issue while creating user" });
    }
    res
      .status(200)
      .json(new ApiResponse(200, createduser, "User registered successfully"));
  } catch (error) {
    return res
      .status(404)
      .json({ message: `Having error in the registering user ${error}` });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({
    $or: [{ email }],
  });
  if (!user) {
    return res
      .status(404)
      .json({ message: "User is not exists in the database , do register " });
  }
  const ispasscorrect = await bcrypt.compare(password, user.password);
  console.log(ispasscorrect);
  if (!ispasscorrect) {
    return res.status(404).json({ message: "wrong password " });
  }
  const jsonewbestoken = jwt.sign(
    { email: user.email, _id: user.id },
    process.env.Authentication_for_jsonwebtoken,
    { expiresIn: "24h" }
  );
  res.status(200).json({
    message: "User login successfully",
    success: "true",
    user: user,
    jwttoken: jsonewbestoken,
  });
};

const saving_title = async (req, res) => {
  const { title, docid, user_id } = req.body;
  console.log(title, docid, user_id);
  if (!title || !docid || !user_id) {
    return res.status(400).json({
      message: "Please provide all required fields: title, docid, and user_id.",
    });
  }

  try {
    const doc = await DocumentModel.findOne({ _id: docid });
    if (doc) {
      console.log("doc exist");
      doc.title = title;
      doc.owner = user_id;
      doc.updatedAt = Date.now();
      await doc.save();
      return res.status(200).json({
        message: "Document updated successfully.",
        data: doc,
      });
    } else {
      console.log("doc not");
      const newDoc = await DocumentModel.create({
        title: title,
        _id: docid,
        owner: user_id,
      });
      return res.status(200).json({
        message: "Document created successfully.",
        data: newDoc,
      });
    }
  } catch (error) {
    console.error("Error updating document title:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const autosave = async (req, res) => {
  const { docid, content } = req.body;
  console.log(docid, content);
  if (!docid || !content) {
    return res.status(400).json({
      message: "Please provide all required fields: docid and content.",
    });
  }
  try {
    const doc = await DocumentModel.findOne({ _id: docid });
    if (doc) {
      doc.data = content;
      doc.updatedAt = Date.now();
      await doc.save();
      return res.status(200).json({
        message: "Document resaved successfully.",
        data: doc,
      });
    } else {
      return res.status(404).json({ message: "Document not found." });
    }
  } catch (error) {
    console.error("Error autosave document content:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getting_doc_content = async (req, res) => {
  const { docid } = req.body;
  console.log(docid);
  if (!docid) {
    return res.status(400).json({
      message: "Please provide all required fields: docid.",
    });
  }
  try {
    const doc = await DocumentModel.findOne({ _id: docid });
    if (!doc) {
      return res.status(404).json({ message: "Document not found." });
    }
    if (doc.data) {
      return res.status(200).json({
        message: "Document fetched successfully.",
        data: doc.data,
        doc:doc
      });
    } else {
      return res.status(200).json({
        message: "Document not having any data.",
        data: doc.data,
        doc:doc
      });
    }
  } catch (error) {
    console.error("Error while fetching document content:", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      data: false,
    });
  }
};

const checking_loggedinuser = async (req, res) => {
  const { docid } = req.body;
  if (!docid) {
    return res.status(400).json({
      message: "Please provide all required fields: docid and user_id.",
    });
  }

  try {
    const doc = await DocumentModel.findById(docid).populate("owner");

    if (!doc) {
      return res
        .status(404)
        .json({ message: "Document not found.", data: false });
    }
    if (doc.owner && doc.owner._id) {
      return res.status(200).json({
        data: doc.owner._id,
        message: true,
      });
    } else {
      return res.status(200).json({
        data: "Doc not having any owner save it to",
        message: false,
      });
    }
  } catch (error) {
    console.error("Error while checking owner:", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      data: false,
    });
  }
};
const anyuser = async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  if (!user_id) {
    return res.status(400).json({
      message: "Please provide all required fields: user_id.",
    });
  }
  console.log(typeof(user_id), user_id);
  try {
    const user = await UserModel.find({ _id: user_id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not exist.", data: false });
    }
    res.status(200).json({
      data: user,
      message: "User getting succesfully",
    });
  } catch (error) {
    console.error("Error while checking owner:", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      data: false,
    });
  }
};
const mydocs = async (req, res) => {
  const { user_id } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }
    const docs = await DocumentModel.find({ owner: user_id });
    if (docs.length === 0) {
      return res.status(200).json({ message: "No documents found.", docs: [] });
    }
    return res
      .status(200)
      .json({ message: "Documents retrieved successfully.", docs });
  } catch (error) {
    return res.status(404).json({ message: `Having error while ${error}` });
  }
};

const all_docs = async (req, res) => {
  try {
    const documents = await DocumentModel.find({});

    res.status(200).json({
      success: true,
      data: documents,
      message: "Documents retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching documents",
    });
  }
};

const get_title = async (req, res) => {
  const { docid } = req.body;
  if (!docid) {
    return res.status(400).json({
      message: "Please provide all required fields: docid.",
    });
  }
  try {
    const doc = await DocumentModel.findById(docid);
    if (!doc || doc?.title === "") {
      return res.status(200).json({
        data: false,
      });
    } else {
      return res.status(200).json({
        data: true,
      });
    }
  } catch (error) {
    console.error("Error while fetching document title:", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      data: false,
    });
  }
};


const status_of_req = async (req, res) => {
  const { docid, user_id } = req.body;
  console.log(docid, user_id);
  if (!docid || !user_id) {
    return res.status(400).json({
      message: "Please provide all required fields: docid and user_id.",
    });
  }
  try {
    const request = await requestmodel.findOne({ document: docid ,requester: user_id });
    if(!request) {
      return res.status(200).json({
        message: "Request To collaborate",
        data: false,
      });
    }
    if (request.status === "pending") {
      return res.status(200).json({
        message: "pending......",
        data: true,
      });
    } else if (request.status === "accepted") {
      return res.status(200).json({
        message: "accepted",
        data: true,
      });
    } else if (request.status === "rejected") {
      return res.status(200).json({
        message: "rejected",
        data: false,
      });
    } else {
      return res.status(200).json({
        message: "Unknown request status.",
        data: false,
      });
    }
  }catch (error) {
    console.error("Error while checking owner:", error);
    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
      data: false,
    });
  }
}

export {
  RegisterUser,
  LoginUser,
  saving_title,
  checking_loggedinuser,
  mydocs,
  anyuser,
  all_docs,
  get_title,
  getting_doc_content,
  autosave,
  status_of_req
};
