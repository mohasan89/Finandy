import Head from "next/head";

import Inputs from "../components/Inputs";
import ListItems from "../components/ListItems";

import { Provider } from "react-redux";
import store from "../store";

import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <Provider store={store}>
      <Head>
        <title>test app</title>
      </Head>
      <div className={`d-flex jusify-content-cneter flex-column m-auto ${styles.landing}`}>
        <Inputs />
        <ListItems />
      </div>
    </Provider>
  );
}
