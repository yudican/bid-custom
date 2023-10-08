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
import { mappingProductListColumn } from "./config"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"

const MappingWarehouseList = () => {
  const navigate = useNavigate()
  const { convert_id } = useParams()
  const [loading, setLoading] = useState(false)
  const [uidLoading, setUidLoading] = useState(false)
  const [mappingProductList, setMappingProductList] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})
  const [loadingExport, setLoadingExport] = useState(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const loadContact = (
    url = "/api/mapping/settlement",
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
            currency: item.currency,
            sfp_service_fee: item?.sfp_service_fee || "-",
            subtotal_after_seller_discounts:
              item?.subtotal_after_seller_discounts || "-",
          }
        })

        setMappingProductList(newData)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadContact()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadContact(`/api/mapping/product/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadContact(`/api/ticket`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadContact(`/api/ticket`, 10, data)
  }

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      .post(`/api/ticket/export/`, { items: selectedRowKeys })
      .then((res) => {
        const { data } = res.data
        setSelectedRowKeys([])
        window.open(data)
        setLoadingExport(false)
      })
      .catch((e) => setLoadingExport(false))
  }

  // selected row handler
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.status_submit === "submited", // Column configuration not to be checked
    }),
  }

  const handleRefreshToken = () => {
    setLoadingExport(true)
    axios
      .get(`/api/mapping/refresh/`)
      .then((res) => {
        const { data } = res.data
        // window.open(data)
        setLoadingExport(false)
      })
      .catch((e) => setLoadingExport(false))
  }

  const handleSyncron = () => {
    setLoadingExport(true)
    axios
      .get(`/api/mapping/settlement/syncron/`)
      .then((res) => {
        const { data } = res.data
        // window.open(data)
        setLoadingExport(false)
        toast.success("Berhasil Sinkronisasi!", {
          position: toast.POSITION.TOP_RIGHT,
        })
        loadContact()
      })
      .catch((e) => setLoadingExport(false))
  }

  const rightContent = (
    <div className="flex justify-between items-center">
      <FilterModal handleOk={handleFilter} />
      <button
        onClick={() => handleRefreshToken()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <span className="ml-2">Refresh Token</span>
      </button>
      <button
        onClick={() => handleSyncron()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <span className="ml-2">Sinkronisasi Data</span>
      </button>
    </div>
  )

  if (loadingExport) {
    return (
      <Layout title="List Mapping Settlement">
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <Layout rightContent={rightContent} title="List Mapping Settlement">
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
        dataSource={mappingProductList}
        columns={mappingProductListColumn}
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

export default MappingWarehouseList
