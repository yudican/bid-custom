import {
  CloseCircleFilled,
  FileExcelOutlined,
  LoadingOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Dropdown, Input, Menu, message, Pagination, Table } from "antd"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../components/layout"
import { formatNumber, getStatusLeadOrder } from "../../helpers"
import { getItem } from "../../helpers"
import ModalTax from "../Genie/Components/ModalTax"
import FilterModal from "./Components/FilterModal"
import { getStatusItems, orderLeadListColumn } from "./config"

const OrderLeadList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [orderLead, setOrderLead] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})
  const [loadingExport, setLoadingExport] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const loadContact = (
    url = "/api/order-lead",
    perpage = 10,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios
      .post(url, { perpage, account_id: getItem("account_id"), ...params })
      .then((res) => {
        const { data, total, current_page } = res.data.data
        setTotal(total)
        setCurrentPage(current_page)
        const newData = data.map((item) => {
          return {
            id: item.uid_lead,
            order_number: item.order_number,
            contact: item?.contact_name || "-",
            sales: item?.sales_name || "-",
            created_by: item?.created_by_name || "-",
            created_on: moment(item.created_at).format("DD-MM-YYYY"),
            amount_total: `Rp ${formatNumber(item?.amount)}`,
            payment_term: item?.payment_term_name || "-",
            status: getStatusLeadOrder(item?.status),
            status_submit: item?.status_submit,
            print_status: item?.print_status,
            resi_status: item?.resi_status,
          }
        })

        setOrderLead(newData)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadContact()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadContact(`/api/order-lead/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadContact(`/api/order-lead`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadContact(`/api/order-lead`, 10, data)
  }

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      // .post(`/api/order-lead/export/`, {id})
      .post(`/api/order-lead/export/detail/1`)
      .then((res) => {
        const { data } = res.data
        window.open(data)
        setLoadingExport(false)
      })
      .catch((e) => setLoadingExport(false))
  }

  const handleSubmitGp = (value) => {
    setLoadingSubmit(true)
    axios
      .post(`/api/order/order-lead/submit`, {
        ids: selectedRowKeys,
        type: "order-lead",
        ...value,
      })
      .then((res) => {
        const { data } = res.data
        toast.success("Order Lead berhasil di submit")
        setLoadingSubmit(false)
        setReadyToSubmit(false)
        setSelectedRowKeys([])
        console.log(data, "data")
      })
      .catch((e) => {
        setLoadingSubmit(false)
        toast.error("Error submitting order lead")
      })
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      {selectedRowKeys.length > 0 && (
        <ModalTax handleSubmit={(e) => handleSubmitGp(e)} />
      )}
      <button
        onClick={() => {
          if (readyToSubmit) {
            setSelectedRowKeys([])
            return setReadyToSubmit(false)
          }
          return setReadyToSubmit(true)
        }}
        className={`text-white bg-${
          !readyToSubmit ? "blue" : "red"
        }-700 hover:bg-${
          !readyToSubmit ? "blue" : "red"
        }-800 focus:ring-4 focus:outline-none focus:ring-${
          !readyToSubmit ? "blue" : "red"
        }-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2`}
      >
        <span className="ml-2">
          {readyToSubmit ? "Cancel Submit" : "Ready To Submit"}
        </span>
      </button>
      <FilterModal handleOk={handleFilter} />
      <button
        className="ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
        onClick={() => handleExportContent()}
      >
        {loadingExport ? <LoadingOutlined /> : <FileExcelOutlined />}
        <span className="ml-2">Export</span>
      </button>
    </div>
  )

  const handleActionClick = (key, record) => {
    //console.log(record, "record")
    switch (key) {
      case "detail":
        navigate(`/order/order-lead/${record.id}`)
        break
      case "detail_new_tab":
        window.open(`/order/order-lead/${record.id}`)
        break
      case "cancel":
        window.location.reload()
        return axios
          .get(`/api/order-lead/cancel/${record.id}`)
          .then(() => {
            message.success("Order Lead berhasil di cancel")
          })
    }
  }

  const listActions = [
    {
      title: "Action",
      key: "id",
      align: "center",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Dropdown.Button
          style={{
            width: 90,
          }}
          overlay={
            <Menu
              onClick={({ key }) => handleActionClick(key, record)}
              itemIcon={<RightOutlined />}
              items={getStatusItems(record?.status)}
              // onContextMenu={(e) => {
              //   console.log(e, "context menu");
              //   console.log("Right Click", e.pageX, e.pageY);
              // }}
            />
          }
        ></Dropdown.Button>
      ),
    },
  ]

  // selected row handler
  const rowSelection = {
    selectedRowKeys,
    onChange: (e) => setSelectedRowKeys(e),
    getCheckboxProps: (record) => {
      if (record.status !== "Closed") {
        return {
          disabled: true,
        }
      }

      if (record.status_submit === "submited") {
        return {
          disabled: true,
        }
      }

      return {
        disabled: false,
      }
    },
  }

  return (
    <Layout rightContent={rightContent} title="List Order Lead">
      <div className="row mb-4">
        <div className="col-md-12"></div>
        <div className="col-md-4 col-sm-6 col-12">
          <Input
            placeholder="Cari disini"
            size={"large"}
            className="rounded"
            onPressEnter={() => handleChangeSearch()}
            suffix={
              isSearch ? (
                <CloseCircleFilled
                  onClick={() => {
                    loadContact()
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
          <strong className="float-right mt-3 text-red-400">
            Total Data: {total}
          </strong>
        </div>
      </div>
      <Table
        dataSource={orderLead}
        columns={[...orderLeadListColumn, ...listActions]}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        rowSelection={readyToSubmit ? rowSelection : null}
      />
      <Pagination
        defaultCurrent={1}
        current={currentPage}
        total={total}
        className="mt-4 text-center"
        onChange={handleChange}
        pageSizeOptions={["10", "20", "50", "100", "200", "500"]}
      />
    </Layout>
  )
}

export default OrderLeadList
