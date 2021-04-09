import { container } from "../config/inversify.config";
import { types } from "../config/types";
import { equals, Level } from "../domain/card/Level";
import { ReviewFactory } from "../domain/review/ReviewFactory";
import { DefaultScheduler } from "../domain/scheduler/DefaultScheduler";
import { ofDays, ofMinutes, equals as timeIntervalEquals } from "../domain/time/TimeInterval";
import { TimeUnit } from "../domain/time/TimeUnit";

describe("DefaultScheduler", () => {

  const initialLevelMap = {
    [Level.FORGOTTEN]: ofMinutes(10),
    [Level.HARD]: ofDays(1),
    [Level.GOOD]: ofDays(2),
    [Level.EASY]: ofDays(4),
  };

  it("testGetNextReviewTimeRecordWithoutAnyPreviousReview", async () => {
    const MockedCardInstance = jest.fn().mockImplementation(() => ({ id: 1 }));
    const mockedCardInstance = new MockedCardInstance();
    ReviewFactory.queryByCardInstanceId = jest.fn().mockReturnValue([]);
    const defaultScheduler = await container.getAsync<DefaultScheduler>(types.DefaultScheduler);
    const levelMap = await defaultScheduler.getNextReviewTimeRecord(mockedCardInstance.id);
    // check the initial time intervals
    expect(equals(levelMap, initialLevelMap)).toBeTruthy();
  });

  it("testForgotten", async () => {
    const MockedCardInstance = jest.fn().mockImplementation(() => ({ id: 1 }));
    const mockedCardInstance = new MockedCardInstance();
    const MockedReview = jest.fn().mockReturnValue({ level: Level.FORGOTTEN });
    ReviewFactory.queryByCardInstanceId = jest.fn().mockReturnValue([new MockedReview()]);
    const defaultScheduler = await container.getAsync<DefaultScheduler>(types.DefaultScheduler);
    const levelMap = await defaultScheduler.getNextReviewTimeRecord(mockedCardInstance.id);
    // check the initial time intervals
    expect(equals(levelMap, initialLevelMap)).toBeTruthy();
  });

  it("testGeneralReviewInterval", async () => {
    const MockedCardInstance = jest.fn().mockImplementation(() => ({ id: 1 }));
    const mockedCardInstance = new MockedCardInstance();
    const MockedReview = jest.fn().mockReturnValue({
      level: Level.GOOD,
      easinessFactor: 1.5,
      timeInterval: ofDays(10),
    });
    ReviewFactory.queryByCardInstanceId = jest.fn().mockReturnValue([new MockedReview()]);
    const defaultScheduler = await container.getAsync<DefaultScheduler>(types.DefaultScheduler);
    const levelMap = await defaultScheduler.getNextReviewTimeRecord(mockedCardInstance.id);
    // check the initial time intervals
    expect(Object.keys(levelMap).length).toEqual(4);
    expect(timeIntervalEquals(levelMap[Level.FORGOTTEN], ofMinutes(10))).toBeTruthy();
    expect(levelMap[Level.HARD].timeUnit).toEqual(TimeUnit.DAYS);
    expect(levelMap[Level.GOOD].timeUnit).toEqual(TimeUnit.DAYS);
    expect(levelMap[Level.EASY].timeUnit).toEqual(TimeUnit.DAYS);
    expect(levelMap[Level.HARD].value < levelMap[Level.GOOD].value);
    expect(levelMap[Level.GOOD].value < levelMap[Level.EASY].value);
  });

  it("testProcessAfterAnswer", async () => {
    const defaultScheduler = await container.getAsync<DefaultScheduler>(types.DefaultScheduler);
    ReviewFactory.queryByCardInstanceId = jest.fn().mockResolvedValue([{id: 100}]);
    const mockedUpdateByIdFunction = jest.fn(async () => {
      console.log("THERE");
      return Promise.resolve(1);
    });
    jest.spyOn(container, "getAsync").mockResolvedValue({updateById: mockedUpdateByIdFunction});
    defaultScheduler.processAfterAnswer(1, Level.GOOD);
    expect(mockedUpdateByIdFunction.mock.calls.length).toBe(1);
  });
})
