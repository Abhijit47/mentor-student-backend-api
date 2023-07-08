import mongodb from 'mongodb';
import client from '../server.js';
import { successResponse, errorResponse, errorCatch } from '../utilities/utils.js';
const { ObjectId } = mongodb.BSON;

const createMentor = async (req, res, next) => {

  // 1. Getting the data from the body
  const data = req.body;

  // 2. Insertion of data into collection 'mentor'
  const result = await client
    .db('trainer-student')
    .collection('mentor')
    .insertOne(data);

  //3. Send a response to the user / client
  result.acknowledged
    ?
    res.status(200).json({ message: "Mentor registration successfully." })
    :
    res.status(400).json({ message: "Something went wrong in create mentor" });


  // res.status(200).json({ message: "Im from create mentor route." });
};

const getMentor = async (req, res, next) => {
  // 1. retrive mentor id from req.params
  const mentorId = req.params.id;
  // console.log(mentorId);

  try {
    // 2. convert a hex string to object id
    const id = ObjectId.createFromHexString(mentorId);
    // console.log(id);

    // find one mentor with given id
    const result = await client
      .db('trainer-student')
      .collection('mentor')
      .findOne({ _id: id });

    result._id
      ? res.status(200).json({ message: "Success", data: result })
      : res.status(400).json({ message: "Failed" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllMentors = async (req, res, next) => {
  // find all mentors into mentor collection
  const result = await client
    .db('trainer-student')
    .collection('mentor')
    .find({})
    .toArray();

  res.status(200).json({ message: "Success", data: result });

  // res.status(200).json({ message: "Im from Get all mentors route." });
};

const updateMentor = async (req, res, next) => {
  // 1. Get mentor id from req.params
  const mentorId = req.params.id;

  if (mentorId.length !== 24) {
    return errorResponse(res, "id not found! Please enter correct id", 400);
  }

  // 2. Get students name from body
  const { student_assigned } = req.body;

  try {
    // 3. convert a hex string to object id
    const id = ObjectId.createFromHexString(mentorId);

    // 4. find mentor using findOneAndUpdate()
    const findMentor = await client
      .db('trainer-student')
      .collection('mentor')
      .updateOne(
        // filter
        { _id: id },

        // update
        {
          $addToSet: { "student_assigned": student_assigned }
        }
      );

    // 5. send a response back
    findMentor.acknowledged
      ? successResponse(res, "success", 200, findMentor.modifiedCount)
      : errorResponse(res, "Failed to update mentor.", 400);

  } catch (err) {
    errorCatch(err);
  }

};

const assignMentor = async (req, res, next) => {
  try {
    // 1. Getting data from req.body
    const data = req.body;

    // 2. update the mentor field with body data
    const result = await client
      .db('trainer-student')
      .collection('mentor')
      .updateOne(
        { "mentor_name": data.mentor_name },
        {
          $set: { "student_assigned": data.student_assigned }
        }
      );

    // 3. Update student collection parallely
    data.student_assigned.map(async (student) => {
      await client
        .db("trainer-student")
        .collection("student")
        .updateOne(
          { "student_name": student },
          {
            $set: { "mentor_name": data.mentor_name, "mentor_assigned": true }
          }
        );
    });

    // 4. send a response to a user
    result.acknowledged
      ? successResponse(res, "Mentor assigned successfully.", 200)
      : errorResponse(res, "Something went wrong", 400);

  } catch (err) {
    errorResponse(res, err.message, 400);
    next();
  }
};

const changeMentor = async (req, res, next) => {
  // remove the student from prev. mentor
  try {
    // 1. Getting data from body
    const data = req.body;

    // 2. remove the student from the student_assigned array of the mentor
    const removeStudent = await client
      .db('trainer-student')
      .collection('mentor')
      .updateOne(
        { "mentor_name": data.prev_mentor },
        {
          $pull: { "student_assigned": data.student_name }
        }
      );

    // 2. update mentor name of student collection
    const removeMentor = await client
      .db('trainer-student')
      .collection('student')
      .updateOne(
        { "student_name": data.student_name },
        { $set: { "mentor_name": data.new_mentor } }
      );

    // 3. add the student to new mentor in mentor collection
    const addNewMentor = await client
      .db('trainer-student')
      .collection('mentor')
      .updateOne(
        { "mentor_name": data.new_mentor },
        {
          $push: { "student_assigned": data.student_name }
        }
      );

    // send back a response
    removeStudent.acknowledged && removeMentor.acknowledged && addNewMentor.acknowledged
      ? successResponse(res, `Student Leave the mentor`, 200, data.prev_mentor)
      : errorResponse(res, "Something went wrong in mentor leaving", 400);
  } catch (err) {
    errorResponse(res, err, 400);
  }
  // res.status(200).json({ message: "im from change mentor controller." });
};

export default {
  createMentor,
  getMentor,
  getAllMentors,
  updateMentor,
  assignMentor,
  changeMentor
};