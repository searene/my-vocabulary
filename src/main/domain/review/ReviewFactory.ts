import { container } from "../../config/inversify.config";
import { types } from "../../config/types";
import { ReviewRepository } from "../../infrastructure/repository/ReviewRepository";
import { Review } from "./Review";

export class ReviewFactory {
  static async queryById(reviewId: number): Promise<Review | undefined> {
    const reviewRepository: ReviewRepository = await container.getAsync(
      types.ReviewRepository
    );
    const reviewDO = await reviewRepository.queryById(reviewId);
    if (reviewDO == undefined) {
      return undefined;
    }
    return await Review.fromReviewDO(reviewDO);
  }

  static async queryByCardInstanceId(
    cardInstanceId: number
  ): Promise<Review[]> {
    const reviewRepository: ReviewRepository = await container.getAsync(
      types.ReviewRepository
    );
    const reviewDOs = await reviewRepository.query({ cardInstanceId });
    if (reviewDOs == undefined) {
      return [];
    }
    const result: Review[] = [];
    for (const reviewDO of reviewDOs) {
      result.push(await Review.fromReviewDO(reviewDO));
    }
    return result;
  }
}
