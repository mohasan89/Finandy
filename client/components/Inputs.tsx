import { useState, useEffect, ChangeEvent } from "react";
import { Col, Row, Form, Button, Alert } from "react-bootstrap";
import { connect } from "react-redux";

type inputData = {
  qty: number;
  value: number;
  price: number;
  lastInput: string;
  autoInput: string;
  data: Array<any>;
};

interface props extends inputData {
  inputChange: Function;
  initInput: Function;
  clearInput: Function;
  updateData: Function;
  removeDataState: Function;
}

import {
  INPUT_RESET,
  PRICE_INPUT,
  QTY_INPUT,
  VALUE_INPUT,
  INPUT_INIT,
  DATA_UPDATE,
  DATA_RESET,
} from "../store/contants";

const Inputs = ({
  qty,
  value,
  price,
  lastInput,
  autoInput,
  inputChange,
  initInput,
  clearInput,
  updateData,
  removeDataState,
  data,
}: props) => {
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    if (qty === 0 && value === 0 && price === 0) {
      const storage = window.localStorage.getItem("values");
      const storageObj = storage ? JSON.parse(storage) : {};
      const intialState = {
        qty: Number(storageObj.qty) || 0,
        value: Number(storageObj.value) || 0,
        price: Number(storageObj.price) || 0,
        lastInput: String(storageObj.lastInput || ""),
        autoInput: String(storageObj.autoInput || ""),
      };
      initInput(intialState);
    } else {
      window.localStorage.setItem(
        "values",
        JSON.stringify({ qty, value, price, lastInput, autoInput })
      );
    }
  }, [qty, value, price, autoInput, lastInput]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, element: string) => {
    const newVal = e.target.value === "" ? 0 : Number(e.target.value);
    if (newVal >= 0) {
      inputChange(newVal, element);
    }
  };

  const submitHandler = async () => {
    const response = await fetch(`/api/newData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, price, qty }),
    });
    const results = await response.json();

    const status = Number(response.status);
    if (status === 200 || status === 201) {
      setErr(false);
      await updateData(data, { value, qty, price });
      clearInput();
      window.localStorage.removeItem("values");
    } else {
      setErr(true);
      setErrorMsg(
        `
        ${typeof results.message === "string" ? results.message : ""}
        ${results.message[0] ? " " + results.message[0] : ""}${
          results.message[1] ? ", " + results.message[1] : ""
        }${results.message[2] ? ", " + results.message[2] : ""}`
      );
    }
  };

  const removeData = async () => {
    const response = await fetch(`/api/removeData`, {
      method: "DELETE",
    });
    const results = await response.json();
    const status = Number(response.status);
    if (status === 200 || status === 202) {
      setErr(false);
      removeDataState();
    } else {
      setErr(true);
      setErrorMsg(results.message);
    }
  };

  return (
    <Form className="py-4">
      {err && <Alert variant="danger">{errorMsg}</Alert>}
      <Row className="justify-content-between">
        <Col md={4}>
          <Form.Group as={Row} className="mb-3" controlId="price">
            <Form.Label column md={4}>
              Цена
            </Form.Label>
            <Col md={8}>
              <Form.Control
                type="number"
                placeholder="введите цену"
                value={price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeHandler(e, PRICE_INPUT)}
              />
            </Col>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group as={Row} className="mb-3" controlId="amount">
            <Form.Label column md={4}>
              Количество
            </Form.Label>
            <Col md={8}>
              <Form.Control
                type="number"
                placeholder="введите количество"
                value={qty}
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeHandler(e, QTY_INPUT)}
              />
            </Col>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group as={Row} className="mb-3" controlId="value">
            <Form.Label column md={4}>
              Сумма
            </Form.Label>
            <Col md={8}>
              <Form.Control
                type="number"
                placeholder="введите сумму"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => changeHandler(e, VALUE_INPUT)}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center my-4">
        <div className="w-auto mx-4">
          <Button onClick={() => submitHandler()}>Submit !</Button>
        </div>
        <div className="w-auto mx-4">
          <Button onClick={() => removeData()} variant="danger">
            remove all data
          </Button>
        </div>
      </Row>
    </Form>
  );
};

const mapStateToProps = (state: { inputs: inputData; data: { data: Array<any> } }) => {
  const { inputs, data } = state;

  const { qty, value, price, lastInput, autoInput } = inputs;
  return { qty, value, price, lastInput, autoInput, data: data.data };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    inputChange: (val: number, type: string) => dispatch({ type: type, payload: val }),
    initInput: (payload: inputData) => dispatch({ type: INPUT_INIT, payload }),
    clearInput: () => dispatch({ type: INPUT_RESET }),
    updateData: async (
      data: Array<any>,
      payload: { qty: number; value: number; price: number }
    ) => {
      const newData = [payload, ...data];
      await dispatch({ type: DATA_UPDATE, payload: newData });
    },
    removeDataState: () => dispatch({ type: DATA_RESET }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inputs);
