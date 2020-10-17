import { CardType } from "./../../../main/domain/card/CardType";
import { CardTypeDO } from "./../../../main/infrastructure/do/CardTypeDO";
import { Card } from "./../../../main/domain/card/Card";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import serviceProvider from "../../ServiceProvider";
import { fieldsSlice } from "../field/fieldsSlice";

export class CardTypeVO {
  constructor(
    // CardType id
    private readonly _id: number,
    // CardType name
    private readonly _name: string,
    // fieldTypes that are bound to this cardType, separated by commas
    private readonly _fieldTypeVOs: FieldTypeVO[]
  ) {}

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get fieldTypeVOs(): FieldTypeVO[] {
    return this._fieldTypeVOs;
  }

  static fromCardType(cardType: CardType): CardTypeVO {
    return new CardTypeVO(
      cardType.id,
      cardType.name,
      cardType.fieldTypes.map(fieldType => FieldTypeVO.fromFieldType(fieldType))
    );
  }
}

export class FieldTypeVO {
  public constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _category: "text" | "google-image"
  ) {}

  public get category() {
    return this._category;
  }
  public get name(): string {
    return this._name;
  }
  public get id(): number {
    return this._id;
  }

  static fromFieldType(fieldType: FieldType): any {
    return new FieldTypeVO(fieldType.id, fieldType.name, fieldType.category);
  }
}
export class FieldVO {
  public constructor(
    private readonly _fieldTypeVO: FieldTypeVO,
    private readonly _contents: string
  ) {}

  public get contents(): string {
    return this._contents;
  }
  public get fieldTypeVO(): FieldTypeVO {
    return this._fieldTypeVO;
  }

  static fromField(field: Field) {
    return new FieldVO(
      FieldTypeVO.fromFieldType(field.fieldType),
      field.contents
    );
  }
}
export class CardVO {
  public constructor(
    private _bookId: number,
    private _cardTypeVO: CardTypeVO,
    private _fieldVOs: FieldVO[]
  ) {}

  get fieldVOs() {
    return this._fieldVOs;
  }
  get bookId() {
    return this._bookId;
  }
  get cardTypeVO() {
    return this._cardTypeVO;
  }

  static fromCard(card: Card): CardVO {
    return new CardVO(
      card.bookId,
      CardTypeVO.fromCardType(card.cardType),
      card.fields.map(field => FieldVO.fromField(field))
    );
  }

  static toCard(cardVO: CardVO) {
    throw new Error("Method not implemented.");
  }
}
interface State {
  add: AddState;
}

interface AddState {
  card: Card | undefined;
}

export type CreateEmptyCardParam = {
  bookId: number;
};

const cardSelector = (state: State) => state.add.card;

export const createEmptyCard = createAsyncThunk<
  Card,
  CreateEmptyCardParam,
  { state: State }
>("add/createEmptyCard", async ({ bookId }, { getState }) => {
  const card: Card = await serviceProvider.cardFactory.createEmptyCard();
  return card;
});

export const saveCard = createAsyncThunk<void, void, { state: State }>(
  "add/saveCard",
  async (_, { getState }) => {
    const card = cardSelector(getState());
    if (card === undefined) {
      throw new Error("cardVO cannot be undefined");
    }
    card.save();
  }
);

const initialState: AddState = {
  card: undefined,
};

export const addSlice = createSlice({
  name: "add",
  initialState: initialState,
  reducers: {
    changeFieldContents: (state, action) => {
      if (state.card === undefined) {
        throw new Error("State cannot be undefined.");
      }
      const { fieldTypeId, contents } = action.payload;
      const fields = state.card.fields.filter(
        fieldVO => fieldVO.fieldType.id == fieldTypeId
      );
      if (fields.length !== 1) {
        throw new Error("fields.length is not 1.");
      }
      fields[0].contents = contents;
    },
  },
  extraReducers: builder => {
    builder.addCase(createEmptyCard.fulfilled, (state, action) => {
      state.card = action.payload;
    });
  },
});
export const selectCard = (state: State) => state.add.card;
export const { changeFieldContents } = addSlice.actions;
