import {
  CloseCircleFilled,
  FileExcelOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingFilled,
} from "@ant-design/icons"
import { Input, Pagination, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/layout"
import {
  formatNumber,
  getItem,
  getStatusLeadOrder,
  paginateData,
} from "../../helpers"
import FilterModal from "./Components/FilterModal"
import { orderOnlineListColumn } from "./config"

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    )
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
}

const OrderOnlineList = () => {
  // hooks
  const navigate = useNavigate()

  // loading state
  const [loading, setLoading] = useState(false)
  const [uidLoading, setUidLoading] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)

  // data state
  const [orderList, setOrderList] = useState([])
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [filterData, setFilterData] = useState({})
  const [statusList, setStatusList] = useState([
    { label: "All", value: "all", count: 5 },
    { label: "Packing", value: "packing", count: 5 },
    { label: "Delivery", value: "delivery", count: 5 },
    { label: "Completed", value: "completed", count: 5 },
    { label: "Cancelled", value: "cancelled", count: 5 },
  ])
  const [selectedStatus, setSelectedStatus] = useState("all")

  // table state
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerpage] = useState(10)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  console.log(selectedRowKeys, "selectedRowKeys")

  const loadOrder = (
    url = "/api/order-manual",
    perpage = perPage,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios
      .post(url, {
        perpage,
        type: "manual",
        account_id: getItem("account_id"),
        ...params,
      })
      .then((res) => {
        const { data, total, current_page } = res.data.data
        setTotal(total) // set total of total data products

        const numberPages = Array(total) // create number columns data based on total data
          .fill()
          .map((_, index) => index + 1)
        const paginatedNumbers = paginateData(
          numberPages,
          current_page,
          perpage
        ) // convert to paginated data
        const newData = data.map((item, index) => {
          const number = paginatedNumbers[index] // overriding response to set paginated number per pages
          console.log(item?.product_needs, "product_needs")
          return {
            id: item.uid_lead,
            number,
            title: item.order_number,
            contact: item?.contact_name || "-",
            sales: item?.sales_name || "-",
            created_by: item?.created_by_name || "-",
            created_on: item?.created_at,
            amount_total: `Rp ${formatNumber(item?.amount)}`,
            payment_term: item?.payment_term_name || "-",
            status: getStatusLeadOrder(item?.status),
            status_submit: item?.status_submit,
            print_status: item?.print_status,
            resi_status: item?.resi_status,
            product_needs: item?.product_needs,
          }
        })

        // setOrderList(newData)

        // dummy data
        setOrderList([
          {
            key: "1",
            order_id: "ORDER/2023/00041",
            contact: "Jessica - Customer",
            created_by: "Ulfa",
            created_on: new Date(),
            amount_total: 4000000,
            payment_method: "Manual Transfer",
            status: "New Order",
          },
          {
            key: "2",
            order_id: "ORDER/2023/00042",
            contact: "Jessica - Customer",
            created_by: "Ulfa",
            created_on: new Date(),
            amount_total: 5000000,
            payment_method: "Manual Transfer",
            status: "Packing",
          },
          {
            key: "3",
            order_id: "ORDER/2023/00043",
            contact: "Jessica - Customer",
            created_by: "Ulfa",
            created_on: new Date(),
            amount_total: 6000000,
            payment_method: "Manual Transfer",
            status: "Delivery",
          },
        ])
        setLoading(false)
      })
  }

  const loadSalesChannel = () => {
    setLoading(true)
    axios
      .get("/api/order-manual/sales/channel")
      .then((res) => {
        console.log(res, "res")
        const { data } = res.data
        setStatusList(data)
        setLoading(false)
      })
      .catch(() => {
        // console.log(err, "err")
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrder()
    loadSalesChannel()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    setCurrentPage(page)
    loadOrder(`/api/order-manual/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadOrder(`/api/order-manual`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadOrder(`/api/order-manual`, 10, data)
  }

  const handleGetUid = () => {
    setUidLoading(true)
    axios
      .get("/api/order-manual/uid/get")
      .then((res) => {
        setUidLoading(false)
        // return navigate("/order-online/form/" + res.data.data)
        return navigate("/order-online/form")
      })
      .catch(() => setUidLoading(false))
  }

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      // .post(`/api/order-manual/export/`)
      .post(`/api/order-manual/export/detail/1`)
      .then((res) => {
        const { data } = res.data
        window.open(data)
        setLoadingExport(false)
      })
      .catch(() => setLoadingExport(false))
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      <FilterModal handleOk={handleFilter} />
      <button
        className="ml-3 text-white bg-green-500 hover:bg-green-500/50 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
        onClick={() => handleExportContent()}
      >
        {loadingExport ? <LoadingOutlined /> : <FileExcelOutlined />}
        <span className="ml-2">Export Excel</span>
      </button>

      <button
        onClick={handleGetUid}
        className="text-white bg-blueColor hover:bg-blueColor/50 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        {uidLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <span className="ml-2">Tambah Data</span>
      </button>
    </div>
  )

  return (
    <Layout rightContent={rightContent} title="List Order Online">
      <div className="row mb-4">
        <div className="flex overflow-y-auto mb-4 pl-3">
          {statusList?.map((item, index) => {
            const isSelected = selectedStatus === item.value

            return (
              <div
                key={index}
                className="cursor-pointer mr-4"
                onClick={() => {
                  const params = { ...filterData, sales_channel: item.value }
                  setSelectedStatus(item.value)
                  loadOrder(`/api/order-manual`, 10, {
                    search,
                    ...params,
                  })
                }}
              >
                <div
                  key={index}
                  className={`
                    card w-56 border
                    ${isSelected ? "bg-orangeOrder" : "bg-white"}
                  `}
                >
                  <div
                    className={`py-2 pl-4 border-b-[1px] 
                      ${isSelected ? "border-white" : "border-orangeOrder"} 
                      flex justify-between
                   `}
                  >
                    <div className="flex">
                      <ShoppingFilled
                        style={{
                          fontSize: 20,
                          color: isSelected ? "white" : "#ff6600",
                          marginRight: 8,
                        }}
                      />

                      <div
                        className={`text-sm font-semibold 
                          ${isSelected ? "text-white" : "text-orangeOrder"}
                        `}
                      >
                        <span className="text-xs font-normal">
                          Status
                          <br />
                        </span>
                        <strong>{item.label}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex py-2 pl-12">
                    <span
                      className={`
                        text-base font-semibold
                        ${isSelected ? "text-white" : "text-orangeOrder"} 
                      `}
                    >
                      Total : {item.count}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="col-md-12"></div>
        <div className="col-md-4 col-sm-6 col-12">
          <Input
            placeholder="Cari nomor transaksi.."
            size={"large"}
            className="rounded"
            onPressEnter={() => handleChangeSearch()}
            suffix={
              isSearch ? (
                <CloseCircleFilled
                  onClick={() => {
                    loadOrder()
                    setSearch(null)
                    setIsSearch(false)
                  }}
                />
              ) : (
                <SearchOutlined onClick={() => handleChangeSearch()} />
              )
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-8">
          <strong className="float-right mt-3 text-blueColor">
            Total Data: {total}
          </strong>
        </div>
      </div>
      <Table
        dataSource={orderList}
        columns={orderOnlineListColumn}
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        rowSelection={rowSelection}
      />
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={total}
        className="mt-4 text-center"
        onChange={handleChange}
        pageSizeOptions={["10", "20", "50", "100", "200", "500"]}
        onShowSizeChange={(current, size) => {
          setCurrentPage(current)
          setPerpage(size)
        }}
      />
    </Layout>
  )
}

export default OrderOnlineList
