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


export default { createMentor, getMentor, getAllMentors, updateMentor };