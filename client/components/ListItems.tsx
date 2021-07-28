import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { loadData } from "../store/actions";
import { Table, Alert, Spinner } from "react-bootstrap";

const ListItems = () => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state: any) => state.data);
  useEffect(() => {
    dispatch(loadData());
  }, [dispatch]);

  return (
    <div className="d-flex justify-contetn-center">
      {error && <Alert variant="danger">Error loading data</Alert>}
      {loading && (
        <Spinner
          animation="border"
          className="m-auto"
          style={{ width: "100px", height: "100px", color: "white" }}
        />
      )}
      {data.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Цена</th>
              <th>Количество</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: { price: number; value: number; qty: number }, idx: number) => (
              <tr key={idx}>
                <td>{item.price}</td>
                <td>{item.qty}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListItems;
