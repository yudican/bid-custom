import {
  DownOutlined,
  ShoppingCartOutlined,
  ShoppingFilled,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { Dropdown, Empty, Input, Menu, Select, Space, Table, Tabs } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { StatusCardDashboard } from "../../components/CardReusable"
import Layout from "../../components/layout"
import { formatNumber, getItem, inArray } from "../../helpers"
import { productAndStockColumn, summaryTransactionColumn } from "./config"

const { Search } = Input

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [dataAgent, setDataAgent] = useState(null)
  const [dataLead, setDataLead] = useState(null)
  const [dataFinance, setDataFinance] = useState(null)
  const [dataWarehouse, setDataWarehouse] = useState(null)

  const getDashboardData = (typeParam = "custommer", setter = setData) => {
    axios.post("/api/dashboard", { type: typeParam }).then((res) => {
      setter(res.data.data)
      // console.log(res.data.data, "res dashboard");
    })
  }

  useEffect(() => {
    // getDashboardData("custommer", setData)
    // getDashboardData("agent", setDataAgent)
    // getDashboardData("lead", setDataLead)
    // getDashboardData("finance", setDataFinance)
    // getDashboardData("warehouse", setDataWarehouse)
  }, [])

  const show = !inArray(getItem("role"), ["leadcs"])

  if (!show)
    return (
      <Layout title="Dashboard">
        <Tabs
          defaultActiveKey="1"
          onChange={{}}
          items={[
            {
              label: `Lead & Order`,
              key: "1",
              children: <ProductAndStock data={dataLead} />,
            },
            {
              label: `Case`,
              key: "2",
              children: <DashboardContentCase data={dataLead} />,
            },
          ]}
        />
      </Layout>
    )

  return (
    <Layout title="Dashboard">
      <Tabs
        defaultActiveKey="1"
        onChange={{}}
        items={[
          {
            label: `Ringkasan Transaksi`,
            key: "1",
            // children: <SummaryTransaction data={data} />,
            children: (
              <div className="h-96 flex items-center justify-center">
                <Empty description={"On Development Progress"} />
              </div>
            ),
          },
          {
            label: `Statistik`,
            key: "2",
            // children: <Statistic data={dataAgent} />,
            children: (
              <div className="h-96 flex items-center justify-center">
                <Empty description={"On Development Progress"} />
              </div>
            ),
          },
          {
            label: `Produk & Stok`,
            key: "3",
            // children: <ProductAndStock data={dataLead} />,
            children: (
              <div className="h-96 flex items-center justify-center">
                <Empty description={"On Development Progress"} />
              </div>
            ),
          },
        ]}
      />
    </Layout>
  )
}

export default Dashboard

const SummaryTransaction = ({ data }) => {
  return (
    <div
      className="
        grid 
        grid-cols-1 md:grid-cols-6 lg:grid-cols-6
        gap-x-8
      "
    >
      {/* 4 split container */}
      <div className="col-span-3 grid md:grid-cols-2 md:gap-x-6 lg:gap-x-8 md:gap-y-4">
        <div className="card p-2">
          <StatusCardDashboard
            title={"Pesanan Baru"}
            subTitle={data?.available_product}
            icon={
              <ShoppingFilled
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>

        {/* total customer container */}
        <div className="card p-2">
          <StatusCardDashboard
            title={"Pesanan Diproses"}
            subTitle={data?.total_member}
            icon={
              <UserOutlined
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>

        {/* total order number container */}
        <div className="card p-2">
          <StatusCardDashboard
            title={"Jumlah Pesanan Berhasil"}
            subTitle={data?.total_order}
            icon={
              <ShoppingCartOutlined
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>

        {/* total order amount container */}
        <div className="card p-2">
          <StatusCardDashboard
            title={"Jumlah Pesanan Diproses"}
            subTitle={data?.total_amount || 0}
            icon={
              <ShoppingCartOutlined
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>
      </div>

      {/* transaction status container */}
      <div className="card col-span-3 px-6 py-4">
        <span className="text-xl font-semibold leading-none">
          Statistik Metode Pembayaran
        </span>

        <div className="mt-4 ml-3 flex flex-row justify-around items-center">
          <div className="mr-2">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-green-400 mr-2" />
              <span className="text-sm">Virtual Account</span>
            </div>
            <CircularProgressbar
              value={data?.transaction_active || 0}
              text={`${data?.transaction_active || 0}`}
              styles={buildStyles({
                strokeLinecap: "round",
                trailColor: "#DFEEDB",
                pathColor: "#A6D997",
                textColor: "#A6D997",
              })}
              className="w-28 h-28 text-2xl font-light mb-4"
            />
          </div>
          <div className="mr-2">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-purple-400 mr-2" />
              <span className="text-sm">Manual Transfer</span>
            </div>
            <CircularProgressbar
              value={data?.transaction_active || 0}
              text={`${data?.transaction_active || 0}`}
              styles={buildStyles({
                strokeLinecap: "round",
                trailColor: "#DFEEDB",
                pathColor: "#A6D997",
                textColor: "#A6D997",
              })}
              className="w-28 h-28 text-2xl font-light mb-4"
            />
          </div>
          <div className="mr-2">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-orange-400 mr-2" />
              <span className="text-sm">E-Wallet</span>
            </div>
            <CircularProgressbar
              value={data?.transaction_active || 0}
              text={`${data?.transaction_active || 0}`}
              styles={buildStyles({
                strokeLinecap: "round",
                trailColor: "#DFEEDB",
                pathColor: "#A6D997",
                textColor: "#A6D997",
              })}
              className="w-28 h-28 text-2xl font-light mb-4"
            />
          </div>
        </div>
      </div>

      {/* total transaction complete container */}
      <div className="card col-span-3 md:col-start-1 md:col-end-7 px-4 py-4">
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="leading-none">
            <h1 className="text-base font-semibold leading-none">
              Transaksi Terbaru
            </h1>
          </div>
          <div>
            {/* <ExcelIcon className="h-full" /> */}
            <Dropdown
              overlay={
                <Menu
                  items={[
                    {
                      key: "1",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.antgroup.com"
                        >
                          1st menu item
                        </a>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.aliyun.com"
                        >
                          2nd menu item (disabled)
                        </a>
                      ),
                      icon: <SmileOutlined />,
                      disabled: true,
                    },
                    {
                      key: "3",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.luohanacademy.com"
                        >
                          3rd menu item (disabled)
                        </a>
                      ),
                      disabled: true,
                    },
                    {
                      key: "4",
                      danger: true,
                      label: "a danger item",
                    },
                  ]}
                />
              }
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Last 7 days
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>

        <Table rowSelection columns={summaryTransactionColumn} />
      </div>
    </div>
  )
}

const Statistic = ({ data }) => {
  const dummyData = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]

  return (
    <div
      className="
        grid 
        grid-cols-1 md:grid-cols-3
        gap-8
      "
    >
      {[
        { title: "Jumlah Pendapatan", amount: "Rp 5.000.000" },
        { title: "Pembayaran Ongkir", amount: "Rp 2.000.000" },
        { title: "Fee Midtrans", amount: "Rp 1.000.000" },
      ].map((value, index) => (
        <div
          key={index}
          className="w-80 h-full md:w-full md:h-80 border rounded-lg p-4"
        >
          <p className="text-xs text-gray-400">{value.title}</p>
          <h1 className="text-xl lg:text-3xl font-medium">{value.amount}</h1>

          <div className="mb-4">
            <ResponsiveContainer minWidth={160} height={100}>
              <LineChart width={300} height={100} data={dummyData}>
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="border-b pt-8" />
          </div>

          <div className="flex md:block lg:flex items-center justify-between">
            <Dropdown
              overlay={
                <Menu
                  items={[
                    {
                      key: "1",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.antgroup.com"
                        >
                          1st menu item
                        </a>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.aliyun.com"
                        >
                          2nd menu item (disabled)
                        </a>
                      ),
                      icon: <SmileOutlined />,
                      disabled: true,
                    },
                    {
                      key: "3",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.luohanacademy.com"
                        >
                          3rd menu item (disabled)
                        </a>
                      ),
                      disabled: true,
                    },
                    {
                      key: "4",
                      danger: true,
                      label: "a danger item",
                    },
                  ]}
                />
              }
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  Last 7 days
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
            <div className="text-green-500">
              <a>Export Data</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const ProductAndStock = () => {
  const onChange = (value) => {
    console.log(`selected ${value}`)
  }

  const onSearch = (value) => {
    console.log("search:", value)
  }

  return (
    <div className="">
      <div className="flex justify-between items-end mb-8">
        <div className="flex">
          <div className="mr-4">
            <h1 className="text-base font-medium">Periode</h1>
            <Select
              showSearch
              placeholder="Select Periode"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </div>
          <div className="mr-4">
            <h1 className="text-base font-medium">Nama Mitra</h1>
            <Search
              placeholder="Cari Mitra"
              onSearch={onSearch}
              style={{ width: 200 }}
            />
          </div>
        </div>

        <div className="text-green-500">
          <a>Export Data</a>
        </div>
      </div>
      <Table rowSelection columns={productAndStockColumn} />
    </div>
  )
}

const DashboardContentCase = ({ data }) => {
  return (
    <div
      className="
          grid 
          grid-cols-1 md:grid-cols-6 lg:grid-cols-6
          gap-x-8
      "
    >
      {/* 3 split container left*/}
      <div className="col-span-3 grid md:grid-cols-1 md:gap-y-4">
        {/* product available container */}
        <div className="card p-2">
          {/* total debt container */}
          <StatusCardDashboard
            title={"Total Case Manual"}
            subTitle={`${formatNumber(data?.total_case_manual)}`}
            icon={
              <UserOutlined
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>

        {/* total case return */}
        <div className="card p-2">
          <StatusCardDashboard
            title={"Total Case Return"}
            subTitle={formatNumber(0)}
            icon={
              <UserOutlined
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>

        {/* total case refund */}
        <div className="card p-2">
          <StatusCardDashboard
            title={"Total Case Refund"}
            subTitle={formatNumber(0)}
            icon={
              <UserOutlined
                style={{
                  fontSize: 20,
                  color:
                    localStorage.getItem("theme") === "dark"
                      ? "#48ABF7"
                      : "#01BFFF",
                }}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}
