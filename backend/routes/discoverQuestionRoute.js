import express from 'express';
import DiscoverQuestion from '../models/DiscoverQuestion.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';

const discoverQuestionRoute = express.Router();

discoverQuestionRoute
  .route('/questions')
  .get(asyncErrorHandler(async (req, res) => {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const questions = await DiscoverQuestion.find(filter).sort({ createdAt: 1 });
    return res.status(200).json(questions);
  }));

export default discoverQuestionRoute;
