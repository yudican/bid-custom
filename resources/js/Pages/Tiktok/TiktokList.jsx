import {
  CloseCircleFilled,
  ExportOutlined,
  FileExcelOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Input, Pagination, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "../../components/atoms/Button"
import Layout from "../../components/layout"
import { getItem } from "../../helpers"
import FilterModal from "./Components/FilterModal"
import { ticketListColumn } from "./config"

const TicketList = () => {
  const navigate = useNavigate()
  const { convert_id } = useParams()
  const [loading, setLoading] = useState(false)
  const [uidLoading, setUidLoading] = useState(false)
  const [ticketList, setTicketList] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})
  const [loadingExport, setLoadingExport] = useState(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const loadContact = (
    url = "/api/tiktok",
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
            id: item.id,
            order_id: item.order_id,
            pembeli: item.pembeli,
            seller_id: item?.seller_id || "-",
            pay_method: item?.pay_method || "-",
            whatsapp: item?.whatsapp || "-",
            shipping_kabupaten: item?.shipping_kabupaten || "-",
            shipping_provinsi: item?.shipping_provinsi || "-",
            tracking_logistic: item?.tracking_logistic || "-",
            warehouse_name: item?.warehouse_name || "-",
            status_fu: item?.status_fu
          }
        })

        setTicketList(newData)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadContact()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadContact(`/api/tiktok?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadContact(`/api/tiktok`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadContact(`/api/tiktok`, 10, data)
  }

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      .post(`/api/tiktok/export/`, { items: selectedRowKeys })
      .then((res) => {
        const { data } = res.data
        setSelectedRowKeys([])
        window.open(data)
        setLoadingExport(false)
      })
      .catch((e) => setLoadingExport(false))
  }

  const handleFollowUp = (record) => {
    axios
      .get(`/api/follow-up/${record.id}`)
      .then((res) => {
        console.log("Status updated successfully.");
        loadContact();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  const listActions = [
    {
      title: "Action",
      key: "id",
      align: "center",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <button
            className="btn btn-primary btn-sm border"
            type="button"
            onClick={() => handleFollowUp(record)}
          > Follow Up
          </button>
      ),
    },
  ]

  // selected row handler
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.status_submit === "submited", // Column configuration not to be checked
    }),
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      <button
        className="ml-3 text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center mr-2"
        onClick={() => handleExportContent()}
      >
        {loadingExport ? <LoadingOutlined /> : <FileExcelOutlined />}
        <span className="ml-2">Export</span>
      </button>
      <FilterModal handleOk={handleFilter} />
    </div>
  )

  return (
    <Layout rightContent={rightContent} title="List Addon Order Tiktok">
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
        rowSelection={rowSelection}
        dataSource={ticketList}
        columns={[...ticketListColumn, ...listActions]}
        loading={loading}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
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

export default TicketList
