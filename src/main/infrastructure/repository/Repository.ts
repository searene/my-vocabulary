export declare type ObjectType<T> = {
  new (): T;
};

export interface Repository<Entity> {
  save(entity: Entity[]): Promise<Entity>;
  save(entities: Entity[]): Promise<Entity[]>;
  findOne(id?: string | number): Promise<Entity | undefined>;
}
