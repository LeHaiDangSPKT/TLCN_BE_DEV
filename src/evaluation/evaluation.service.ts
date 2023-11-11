import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Evaluation } from './schema/evaluation.schema';
import { Model, MongooseError } from 'mongoose';
import { EmojiDto } from './dto/emoji.dto';
import { InternalServerErrorExceptionCustom } from 'src/exceptions/InternalServerErrorExceptionCustom.exception';


@Injectable()
export class EvaluationService {
    constructor(
        @InjectModel(Evaluation.name)
        private readonly evaluationModel: Model<Evaluation>
    ) { }

    async create(productId: string): Promise<Evaluation> {
        try {
            const newEvaluation = await this.evaluationModel.create({ productId })
            return newEvaluation
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async update(userId: string, productId: string, body: string): Promise<boolean> {
        const evaluation = await this.evaluationModel.findOne({ productId })
        if (!evaluation) {
            return false
        }
        return this.updateEmoji(userId, body, evaluation)
    }

    async updateEmoji(userId: string, body: string, evaluation: Evaluation): Promise<boolean> {
        try {
            const index = evaluation.Emojis.findIndex(emoji => emoji.userId.toString() === userId.toString())
            const newEmoji = new EmojiDto()
            newEmoji.userId = userId
            newEmoji.name = body
            if (index == -1) {
                evaluation.Emojis.push(newEmoji)
            }
            else {
                if (evaluation.Emojis[index].name == body) {
                    evaluation.Emojis.splice(index, 1)
                }
                else {
                    evaluation.Emojis[index] = newEmoji
                }
            }
            await evaluation.save()
            return true
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }

    async getByProductId(productId: string) : Promise<Evaluation> {
        try {
            const evaluation = await this.evaluationModel.findOne({ productId })
            if(!evaluation) { return null }
            return evaluation
        }
        catch (err) {
            if (err instanceof MongooseError)
                throw new InternalServerErrorExceptionCustom()
            throw err
        }
    }


}
