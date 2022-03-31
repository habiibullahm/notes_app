const joi = require("joi");
const { User, Notes} = require("../models");
const catchError = require("../utils/error");

module.exports = {
  getNotes: async (req, res) => {
    try {
      const notes = await Notes.findAll({
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["fullName", "image"],
          },
        ],
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      });

      if (notes.length == 0) {
        return res.status(404).json({
          status: "Not Found",
          message: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: notes,
      });
    } catch (error) {
       catchError(error, res);
    }
  },
  getNote: async (req, res) => {
    const { notesId } = req.query;
    try {
      const notes = await Notes.findOne({
        where: {
          id : notesId,
        },
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["fullName", "image"],
          },
        ],
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      });

      if (!notes) {
        return res.status(404).json({
          status: "Not Found",
          message: "The data is empty",
          result: [],
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Successfully retrieve the data",
        result: notes,
      });
    } catch (error) {
      catchError(error, res);
    }
  },
  createNotes: async (req, res) => {
    try {
      const body = req.body;
      const { user } = req;

      const schema = joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        user_id : joi.number().required(),
      });
      const { error } = schema.validate({
        ...body,
        user_id: user.id,
      });
      if (error) {
        return res.status(400).json({
          status: "Bad Request",
          message: error.message || failed,
        });
      }
      const notes = await Notes.create({
        ...body,
        user_id: user.id,
      });
      if (!notes) {
        return res.status(500).json({
          status: "Internal server error",
          message: "Failed to create notes",
          result: {},
        });
      }
      res.status(201).json({
        status: "Success",
        message: "Successfuly create an notes",
        result: notes,
      });
    } catch (error) {
      catchError(error, res);
    }
  }
};
