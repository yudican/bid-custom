import {
  DotChartOutlined,
  DownOutlined,
  FileExcelFilled,
  MoreOutlined,
  ShoppingCartOutlined,
  ShoppingFilled,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons"
import {
  Badge,
  DatePicker,
  Dropdown,
  Empty,
  Input,
  Menu,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { StatusCardDashboard } from "../../components/CardReusable"
import Layout from "../../components/layout"
import { formatNumber, getItem, inArray } from "../../helpers"
import { productAndStockColumn, summaryTransactionColumn } from "./config"
import DebounceSelect from "../../components/atoms/DebounceSelect"
import { searchContact } from "../CaseManual/service"

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
            children: <TransactionSummary />,
          },
          {
            label: `Statistik`,
            key: "2",
            children: <Statistic data={dataAgent} />,
          },
          {
            label: `Prospect`,
            key: "3",
            // children: <ProductAndStock data={dataLead} />,
            children: <ProspectDashboard />,
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

const StatusTransactionCard = ({ label = "label", value = "null", icon }) => {
  return (
    <div className="flex w-full h-28 border rounded-md p-4 shadow-sm">
      <div className="mt-2 mr-3">{icon}</div>
      <div>
        <div className="text-sm">{label}</div>
        <div className="text-base font-medium text-successColor">{value}</div>
      </div>
    </div>
  )
}

const TransactionSummary = ({ data }) => {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green"
            if (tag === "loser") {
              color = "volcano"
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]
  const menu = (
    <Menu>
      <Menu.Item>testing</Menu.Item>
      <Menu.Item>
        <button
        // onClick={() => handleExportContent()}
        >
          <span className="ml-2">testing2</span>
        </button>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5 mb-10">
        <div className="grid grid-cols-2 gap-5">
          <StatusTransactionCard
            icon={<ShoppingFilled style={{ color: "#43936C" }} />}
            label="Pesanan Baru"
            value="100 Pesanan"
          />
          <StatusTransactionCard
            icon={<ShoppingFilled style={{ color: "#43936C" }} />}
            label="Pesanan Diproses"
            value="100 Pesanan"
          />
          <StatusTransactionCard
            icon={<ShoppingFilled style={{ color: "#43936C" }} />}
            label="Jumlah Pesanan Berhasil"
            value={formatNumber(2500000, "Rp. ")}
          />
          <StatusTransactionCard
            icon={<ShoppingFilled style={{ color: "#43936C" }} />}
            label="Jumlah Pesanan Diproses"
            value={formatNumber(1000000, "Rp. ")}
          />
        </div>

        <div className="border rounded-md shadow-sm px-6 h-full">
          <div className="flex flex-row items-center justify-between">
            <div className="leading-none">
              <h1 className="text-[22px] font-medium leading-none">
                Statistik Metode Pembayaran
              </h1>
              <span className="text-xs text-[#C4C4C4] leading-none">
                Informasi harian tentang penjualan berdasarkan status
              </span>
            </div>
            <div>
              <MoreOutlined rotate={90} className="text-2xl" />
            </div>
          </div>

          <div className="mt-4 ml-3 flex flex-row justify-around items-center">
            <div>
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
              <h1 className="text-xs font-semibold text-center">
                Active Transaction
              </h1>
            </div>
            <div>
              <CircularProgressbar
                value={data?.waiting_payment || 0}
                text={`${data?.waiting_payment || 0}`}
                styles={buildStyles({
                  strokeLinecap: "round",
                  trailColor: "#FFD8D6",
                  pathColor: "#FE3A30",
                  textColor: "#FE3A30",
                })}
                className="w-28 h-28 text-2xl font-light mb-4"
              />
              <h1 className="text-xs font-semibold text-center">
                Waiting Payment
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center py-4">
          <div className="text-base font-medium">Transaksi Terbaru</div>
          <Dropdown overlay={menu}>
            <button
              className="text-black font-medium rounded-lg text-sm text-center inline-flex items-center"
              onClick={(e) => e.preventDefault()}
            >
              <span className="mr-2">Last 7 days</span>
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
        <Table rowSelection columns={columns} />
      </div>
    </div>
  )
}

const ProspectDashboard = ({ data }) => {
  const [contactList, setContactList] = useState([])
  const [totalProspect, setTotalProspect] = useState(0)
  const [totalActivity, setTotalActivity] = useState(0)

  const handleGetContact = () => {
    searchContact(null).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })
      setContactList(newResult)
    })
  }

  const handleSearchContact = async (e) => {
    return searchContact(e).then((results) => {
      const newResult = results.map((result) => {
        return { label: result.nama, value: result.id }
      })

      return newResult
    })
  }

  const menu = (
    <Menu>
      <Menu.Item>testing</Menu.Item>
      <Menu.Item>
        <button
        // onClick={() => handleExportContent()}
        >
          <span className="ml-2">testing2</span>
        </button>
      </Menu.Item>
    </Menu>
  )

  const handleGetProspectData = async () => {
    try {
      const response = await fetch("/api/prospect/list")
      const data = await response.json()
      const totalProspectCount = data.data.data.length
      setTotalProspect(totalProspectCount)
    } catch (error) {
      console.error("Error fetching prospect data:", error)
    }
  }

  const handleGetActivityData = async () => {
    try {
      const response = await fetch("/api/activity/list")
      const data = await response.json()
      const totalActivityCount = data.data.length
      setTotalActivity(totalActivityCount)
    } catch (error) {
      console.error("Error fetching prospect data:", error)
    }
  }

  useEffect(() => {
    handleGetProspectData()
    handleGetActivityData()
    handleGetContact()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <div className="mr-2">Filter by Contact CS</div>
          <DebounceSelect
            showSearch
            placeholder="Choose Contact"
            fetchOptions={handleSearchContact}
            filterOption={false}
            defaultOptions={contactList}
            className="w-"
            // onChange={(val) => {
            //   loadAddress(val?.value)
            // }}
          />
        </div>

        <div className="flex items-center">
          <div className="mr-2">Filter</div>

          <DatePicker.RangePicker className="w-full" />
        </div>
      </div>

      <div className="grid grid-cols-10 gap-5">
        <div className="grid col-span-2 gap-4">
          <div className="h-28 w-full rounded-md p-2 border shadow-sm">
            <span className="font-medium text-sm">Total Prospect</span>
            <br />
            <div className="border-t my-2" />
            <br />
            <h1 className="text-3xl font-medium text-blueColor">
              {totalProspect}
            </h1>
          </div>

          <div className="h-28 w-full rounded-md p-2 border shadow-sm">
            <span className="font-medium text-sm">Total Activity</span>
            <br />
            <div className="border-t my-2" />
            <br />
            <h1 className="text-3xl font-medium text-orangeOrder">
              {totalActivity}
            </h1>
          </div>
        </div>

        <div className="col-span-4 h-full w-full rounded-md p-2 border shadow-sm">
          <span className="font-medium text-sm">Prospect Status</span>
          <br />
          <div className="border-t my-2" />
          <div className="mt-4">
            {[
              { label: "New", count: 100 },
              { label: "On Process", count: 1000 },
              { label: "Closed", count: 500 },
            ].map((value, index) => {
              return (
                <div
                  className="flex justify-between items-center border-b mb-2.5 pb-2.5"
                  key={index}
                >
                  {value.label}
                  <Badge
                    style={{ color: "black" }}
                    color="#E5F9FF"
                    count={value.count}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-4 h-full w-full rounded-md p-2 border shadow-sm">
          <span className="font-medium text-sm">Prospect Tag</span>
          <br />
          <div className="border-t my-2" />

          <div className="mt-4">
            {[
              { label: "Cold", count: 100 },
              { label: "Warm", count: 1000 },
              { label: "Hot", count: 500 },
            ].map((value, index) => {
              return (
                <div
                  className="flex justify-between items-center border-b mb-2.5 pb-2.5"
                  key={index}
                >
                  {value.label}
                  <Badge
                    style={{ color: "black" }}
                    color="#E5F9FF"
                    count={value.count}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center py-4">
          <div className="text-base font-medium">Transaksi Terbaru</div>
          <Dropdown overlay={menu}>
            <button
              className="text-black font-medium rounded-lg text-sm text-center inline-flex items-center"
              onClick={(e) => e.preventDefault()}
            >
              <span className="mr-2">Last 7 days</span>
              <DownOutlined />
            </button>
          </Dropdown>
        </div>
        <Table rowSelection />
      </div>
    </div>
  )
}
