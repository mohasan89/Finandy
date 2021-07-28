import { DATA_FAIL, DATA_LAODING, DATA_SUCCESS } from "./contants";
import { SERVER_URL } from "../constants";

export const loadData = () => async (dispatch: any) => {
  dispatch({ type: DATA_LAODING });

  const response = await fetch(`${SERVER_URL}getData`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  const status = Number(response.status);
  if (status === 200) {
    dispatch({ type: DATA_SUCCESS, payload: data.data });
  } else {
    dispatch({ type: DATA_FAIL });
  }
};
