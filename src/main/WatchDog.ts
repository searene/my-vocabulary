export class WatchDog {
  private readonly id: string;

  private starTime: Date;

  private endTime: Date | undefined;

  constructor(id: string) {
    this.starTime = new Date();
    this.id = id;
  }

  outputMeasurement() {
    this.endTime = new Date();
    const timeCostInMs = this.endTime.getTime() - this.starTime.getTime();
    console.log(`id: ${this.id}, time cost: ${timeCostInMs}ms`);
  }
}
