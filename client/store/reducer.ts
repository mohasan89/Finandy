import {
  INPUT_INIT,
  INPUT_RESET,
  PRICE_INPUT,
  QTY_INPUT,
  VALUE_INPUT,
  DATA_FAIL,
  DATA_LAODING,
  DATA_SUCCESS,
  DATA_UPDATE,
  DATA_RESET,
} from "./contants";

type inputData = {
  price: number;
  value: number;
  qty: number;
};

const newState = (state: any, action: any) => {
  const newKey =
    action.type === PRICE_INPUT
      ? "price"
      : action.type === VALUE_INPUT
      ? "value"
      : action.type === QTY_INPUT
      ? "qty"
      : null;

  const newValues = state.values;
  //@ts-ignore
  if (newKey) newValues[newKey] = action.payload;

  const newLastValue: Array<any> = state.lastInput;
  //@ts-ignore
  if (newLastValue[newLastValue.length - 1] !== newKey) newLastValue.push(newKey);
  if (newLastValue.length === 2) {
    if (!newLastValue.includes("qty")) newLastValue.unshift("qty");
    if (!newLastValue.includes("value")) newLastValue.unshift("value");
    if (!newLastValue.includes("price")) newLastValue.unshift("price");
  }
  console.log(newLastValue[0]);
  if (newLastValue.length >= 3) {
    const autoKey = newLastValue[0];
    console.log(autoKey);
    //@ts-ignore
    if (autoKey === "value") {
      newValues["value"] = newValues["qty"] * newValues["price"];
      //@ts-ignore
    } else if (autoKey === "price") {
      newValues["price"] = newValues["value"] / newValues["qty"];
    } else {
      newValues["qty"] = newValues["value"] / newValues["price"];
    }
  }
  if (newLastValue.length >= 4) newLastValue.shift();
  return { values: newValues, lastInput: newLastValue };
};

const inputReducer = (
  state = { values: { price: 0, value: 0, qty: 0 }, lastInput: [] },
  action: { type: string; payload?: number | Object }
) => {
  switch (action.type) {
    case PRICE_INPUT:
      return newState(state, action);
    case VALUE_INPUT:
      return newState(state, action);
    case QTY_INPUT:
      return newState(state, action);
    case INPUT_RESET:
      return { values: { qty: 0, value: 0, price: 0 }, lastInput: [] };
    case INPUT_INIT:
      return action.payload;
    default:
      return state;
  }
};

const dataReducer = (
  state = { loading: false, err: false, data: [] },
  action: { type: string; payload?: Array<inputData> | inputData }
) => {
  switch (action.type) {
    case DATA_LAODING:
      return { data: [], err: false, loading: true };
    case DATA_FAIL:
      return { data: [], err: true, loading: false };
    case DATA_SUCCESS:
      return { data: action.payload, err: false, loading: false };
    case DATA_UPDATE:
      //@ts-ignore
      return { data: action.payload, err: false, loading: false };
    case DATA_RESET:
      return { ...state, data: [] };
    default:
      return state;
  }
};

export { inputReducer, dataReducer };
