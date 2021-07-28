import { useState, useEffect, ChangeEvent } from "react";
import { Col, Row, Form, Button, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import {
  INPUT_RESET,
  PRICE_INPUT,
  QTY_INPUT,
  VALUE_INPUT,
  INPUT_INIT,
  DATA_UPDATE,
} from "../store/contants";
import { SERVER_URL } from "../constants";

const Inputs = () => {
  const [err, setErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { qty, value, price, lastInput, autoInput } = useSelector(
    (state: {
      inputs: { qty: number; value: number; price: number; lastInput: string; autoInput: string };
    }) => state.inputs
  );
  const dispatch = useDispatch();

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
      dispatch({ type: INPUT_INIT, payload: intialState });
    } else {
      window.localStorage.setItem(
        "values",
        JSON.stringify({ qty, value, price, lastInput, autoInput })
      );
    }
  }, [qty, value, price, dispatch, autoInput, lastInput]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>, element: string) => {
    const newVal = e.target.value === "" ? 0 : Number(e.target.value);
    if (newVal >= 0) {
      dispatch({ type: element, payload: newVal });
    }
  };

  const submitHandler = async () => {
    const response = await fetch(`${SERVER_URL}newData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, price, qty }),
    });
    const data = await response.json();

    const status = Number(response.status);
    if (status === 200 || status === 201) {
      setErr(false);
      dispatch({ type: DATA_UPDATE, payload: { value, qty, price } });
      dispatch({ type: INPUT_RESET });
      window.localStorage.removeItem("values");
    } else {
      setErr(true);
      setErrorMsg(
        `
        ${typeof data.message === "string" ? data.message : ""}
        ${data.message[0] ? " " + data.message[0] : ""}${
          data.message[1] ? ", " + data.message[1] : ""
        }${data.message[2] ? ", " + data.message[2] : ""}`
      );
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
      <Row className="justify-content-center">
        <div className="w-auto">
          <Button onClick={() => submitHandler()}>Submit !</Button>
        </div>
      </Row>
    </Form>
  );
};

export default Inputs;
