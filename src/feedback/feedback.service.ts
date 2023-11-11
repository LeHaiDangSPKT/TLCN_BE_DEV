import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback } from './schema/feedback.schema';
import { Model, MongooseError, Types } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Feedback.name)
        private readonly feedbackModel: Model<Feedback>
    ) { }

    async create(userId: string, productId: string, feedback: CreateFeedbackDto): Promise<Feedback> {
        try {
            const newFeedback = await this.feedbackModel.create(feedback)
            newFeedback.userId = userId
            newFeedback.productId = productId
            await newFeedback.save()
            return newFeedback
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }
}
