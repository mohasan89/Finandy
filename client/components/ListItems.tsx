import { useEffect } from "react";
import { connect } from "react-redux";
import { loadData } from "../store/actions";
import { Table, Alert, Spinner } from "react-bootstrap";

type elem = {
  price: number;
  value: number;
  qty: number;
};

type state = {
  data: Array<elem>;
  loading: boolean;
  err: boolean;
};

interface props extends state {
  dataLoadingAction: Function;
}

const ListItems = ({ err, data, loading, dataLoadingAction }: props) => {
  useEffect(() => {
    dataLoadingAction();
  }, []);

  return (
    <div className="d-flex justify-contetn-center">
      {err && <Alert variant="danger">Error loading data</Alert>}
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

const mapStateToProps = (state: { data: state }) => {
  const { data: fileData } = state;
  return {
    data: fileData.data,
    loading: fileData.loading,
    err: fileData.err,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dataLoadingAction: () => dispatch(loadData()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListItems);
