import mongodb from 'mongodb';
import client from '../server.js';
import { successResponse, errorResponse, errorCatch } from '../utilities/utils.js';
const { ObjectId } = mongodb.BSON;

const createStudent = async (req, res, next) => {
  // 1. Getting data from body req.body
  const data = req.body;

  try {
    // 2. Insertion of data into db
    const result = await client
      .db('trainer-student')
      .collection('student')
      .insertOne(data);

    //3. Send a response to the user / client
    result.acknowledged
      ? successResponse(res, "Student created successfully", 200, result.insertedId)
      : errorResponse(res, "Something went wrong in creating student", 400);
  } catch (err) {
    errorCatch(err);
  }

};

const getAllStudents = async (req, res) => {
  try {
    // Get all un-assigned students
    const result = await client
      .db('trainer-student')
      .collection('student')
      .find({})
      .toArray();
    // send a response back to user
    successResponse(res, "Success", 200, result);
  } catch (err) {
    errorCatch(err);
  }

};

const getUnassignedStudents = async (req, res, next) => {
  try {
    // Get all un-assigned students
    const result = await client
      .db('trainer-student')
      .collection('student')
      .find({ "mentor_assigned": false })
      .toArray();

    // send a response back to user
    successResponse(res, "Success", 200, result);
  } catch (err) {
    errorCatch(err);
  }


  // res.status(200).json({ message: "Im from Get all unassigned students route." });
};

const getassignedStudents = async (req, res, next) => {
  try {
    // Get all un-assigned students
    const result = await client
      .db('trainer-student')
      .collection('student')
      .find({ "mentor_assigned": true })
      .toArray();

    // send a response back to user
    successResponse(res, "Success", 200, result);
  } catch (err) {
    errorCatch(err);
  }

};

const addMentor = async (req, res, next) => {
  // 1. Retriving the update info from req.body
  const { mentor_name, mentor_assigned } = req.body;
  // console.log(mentor_name, mentor_assigned);

  // 2. Get the corresponding id of student
  const studentId = req.params.id;
  // console.log(studentId);

  if (studentId.length !== 24) {
    return errorResponse(res, "id not found! Please enter correct id", 400);
  }

  try {
    // 3. convert a hex string to object id
    const id = ObjectId.createFromHexString(studentId);

    // 4. find student using findOneAndUpdate()
    const findStudent = await client
      .db('trainer-student')
      .collection('student')
      .findOneAndUpdate(
        // filter
        { _id: id },

        // update
        {
          $set: { "mentor_name": mentor_name, "mentor_assigned": mentor_assigned }
        },

        // options
        {
          returnDocument: "after"
        }
      );

    findStudent.ok === 1
      ? successResponse(res, "Success", 200, findStudent.value)
      : errorResponse(res, "Something went wrong", 400);

  } catch (err) {
    errorCatch(err);
  }

};

export default { createStudent, getAllStudents, getUnassignedStudents, getassignedStudents, addMentor };

/**
 * try {
    // 4. find a user

    // 1. using updateOne()
    // const findStudent = await client
    //   .db('trainer-student')
    //   .collection('student')
    //   .updateOne(
    //     // filter
    //     { _id: id },

    //     // update
    //     {
    //       $set: { "mentor_name": mentor_name, "mentor_assigned": mentor_assigned }

    //     },
    //     // options
    //     {
    //       upsert: true,
    //     }
    // );

    // findStudent.acknowledged
    //   ? res.status(200).json({ message: "Success", findStudent })
    //   : res.status(400).json({ message: "Something went wrong" });
  } catch (err) {
    // console.log(err.message);
    // res.status(400).json({ message: err.message });
  }
 * 
 */