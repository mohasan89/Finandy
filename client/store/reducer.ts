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

const inputReducer = (
  state = { price: 0, value: 0, qty: 0, lastInput: "", autoInput: "" },
  action: { type: string; payload?: number | Object }
) => {
  const newUpdate =
    Number(!!(state.price || action.type === PRICE_INPUT)) +
      Number(!!state.value || action.type === VALUE_INPUT) +
      Number(!!state.qty || action.type === QTY_INPUT) >=
    1;

  switch (action.type) {
    case PRICE_INPUT:
      if (newUpdate && typeof action.payload === "number") {
        const autoInputVal =
          state.lastInput !== "price"
            ? state.lastInput === "value"
              ? "qty"
              : "value"
            : state.autoInput;

        const newValue =
          autoInputVal === "value" ? action.payload * state.qty : state.value / action.payload;

        return {
          ...state,
          lastInput: "price",
          autoInput: autoInputVal,
          price: action.payload,
          [autoInputVal]: newValue,
        };
      } else {
        return { ...state, price: action.payload, lastInput: "price" };
      }

    case QTY_INPUT:
      if (newUpdate && typeof action.payload === "number") {
        const autoInputVal =
          state.lastInput !== "qty"
            ? state.lastInput === "price"
              ? "value"
              : "price"
            : state.autoInput;

        const newValue =
          autoInputVal === "value" ? action.payload * state.price : state.value / action.payload;
        return {
          ...state,
          lastInput: "qty",
          autoInput: autoInputVal,
          qty: action.payload,
          [autoInputVal]: newValue,
        };
      } else {
        return { ...state, qty: action.payload, lastInput: "qty" };
      }

    case VALUE_INPUT:
      if (newUpdate && typeof action.payload === "number") {
        const autoInputVal =
          state.lastInput !== "value"
            ? state.lastInput === "price"
              ? "qty"
              : "price"
            : state.autoInput;

        const newValue =
          autoInputVal === "price" ? action.payload / state.qty : action.payload / state.price;

        return {
          ...state,
          lastInput: "value",
          autoInput: autoInputVal,
          value: action.payload,
          [autoInputVal]: newValue,
        };
      } else {
        return { ...state, qty: action.payload, lastInput: "value" };
      }

    case INPUT_RESET:
      return { qty: 0, value: 0, price: 0, lastInput: "", autoInput: "" };
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
