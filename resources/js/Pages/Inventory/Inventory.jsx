import axios from "axios";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout";
import FilterModal from "../Contact/Components/FilterModal";

const Inventory = () => {
  // hooks
  const navigate = useNavigate();

  // state
  const [data, setData] = useState([]);

  // api
  const getInventoryData = () => {
    axios.get("/api/inventory/item").then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    getInventoryData();
  }, []);

  return (
    <Layout title="Inventory List">
      <div className="grid md:grid-cols-2 gap-6">
        {data?.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-header">
              <div className="header-titl">
                <strong>{item.title}</strong>
              </div>
            </div>
            <div className="card-body">
              <strong className={`text-${item.color}`}>
                Total Produk : {item.value}
              </strong>

              <Button
                type="primary"
                size={"large"}
                onClick={() => navigate(item.path)}
                style={{ width: "100%", marginTop: 48 }}
              >
                Lihat Daftar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Inventory;
