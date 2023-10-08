import {
  CloseCircleFilled,
  PrinterTwoTone,
  SearchOutlined,
} from "@ant-design/icons"
import { Dropdown, Input, Menu, Pagination, Table } from "antd"
import axios from "axios"
import Pusher from "pusher-js"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import LoadingFallback from "../../components/LoadingFallback"
import Layout from "../../components/layout"
import { getItem } from "../../helpers"
import FilterModal from "./Components/FilterModal"
import { mappingProductListColumn } from "./config"
import SyncModal from "./Components/SyncModal"

const MappingOrderList = () => {
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
  const [totalDataTiktok, setTotalDataTiktok] = useState(0)
  const [stock, setStock] = useState(0)

  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const [pusherChannel, setPusherChannel] = useState(null)
  const [syncData, setSyncData] = useState(null)
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)
  const pusher_key = "5c63a87e285d37186b78"
  const pusher_channel = "aimi-bidflow-production"

  const loadContact = (
    url = "/api/mapping/order",
    perpage = 10,
    params = { page: currentPage },
    loading = true
  ) => {
    setLoading(loading)
    axios
      .post(url, { perpage, account_id: getItem("account_id"), ...params })
      .then((res) => {
        const { data, total, current_page, tiktok_order_total } = res.data.data
        setTotalDataTiktok(res?.data?.tiktok_order_total || 0)
        setTotal(total)
        setCurrentPage(current_page)
        setStock(res?.data?.log_error)
        console.log(res?.data?.log_error)
        const newData = data.map((item) => {
          return {
            id: item.id,
            order_id: item.tiktok_order_id,
            label_url: item.label_url,
            payment_method: item.payment_method_name,
            shipping_provider: item?.shipping_provider || "-",
            tracking_number: item?.tracking_number || "-",
            buyer_name: item?.buyer_name || "-",
            total_amount: item?.total_amount || "-",
            order_status: item?.order_status || "-",
            create_time: item?.create_time || "-",
            warehouse_tiktok_id: item?.warehouse_tiktok_id || "-",
          }
        })

        setMappingProductList(newData)
        setLoading(false)
      })
  }
  useEffect(() => {
    loadContact()

    const pusher = new Pusher(pusher_key, {
      cluster: "ap1",
    })

    const channelPusher = pusher.subscribe(pusher_channel)
    setPusherChannel(channelPusher)
  }, [])

  useEffect(() => {
    // console.log("Updated data : ", syncData);
    if (pusherChannel && pusherChannel.bind) {
      pusherChannel.unbind("progress")
      pusherChannel.bind("progress", function (data) {
        if (total >= totalDataTiktok) {
          return setSyncData({ sync: false })
        }
        // get percentage from two data
        if (data.sync) {
          setSyncData(data)
          loadContact("/api/mapping/order", 10, { page: currentPage }, false)
        } else {
          toast.success("Sync data telah selesai", {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      })
    }
  }, [pusherChannel, syncData])

  const handleChange = (page, pageSize = 10) => {
    loadContact(`/api/mapping/order/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadContact(`/api/mapping/order`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadContact(`/api/mapping/order`, 10, data)
  }

  const handleExportContent = () => {
    setLoadingExport(true)
    axios
      .post(`/api/mapping/warehouse/export/`, { items: selectedRowKeys })
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
      disabled: record.tracking_number === "-" || !record.label_url, // Column configuration not to be checked
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

  const handleSyncronTest = () => {
    setLoadingExport(true)
    axios
      .get(`/api/mapping/order/syncrontest/`)
      .then((res) => {
        const { data } = res.data
        // window.open(data)
        setLoadingExport(false)
      })
      .catch((e) => setLoadingExport(false))
  }

  const handleSyncron = (e) => {
    setLoadingExport(true)
    axios
      .post(`/api/mapping/order/syncron`, e)
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

  const cancelSync = () => {
    setLoadingExport(true)
    axios
      .get(`/api/mapping/order/syncron/cancel`)
      .then((res) => {
        const { data } = res.data
        // window.open(data)
        setLoadingExport(false)
        toast.success("Sync Berhasil Dibatalkan!", {
          position: toast.POSITION.TOP_RIGHT,
        })
        setSyncData({ sync: false })
        loadContact()
      })
      .catch((e) => {
        setLoadingExport(false)
        toast.error("Gagal Membatalkan Sinkronisasi!", {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  const handleAction = (url) => {
    setLoadingSubmit(true)
    axios
      .post(url, { transaction_id: selectedRowKeys })
      .then((res) => {
        const { data, message } = res.data
        setLoadingSubmit(false)
        toast.success(message)
        data.forEach((element) => {
          window.open(element)
        })
      })
      .catch((e) => {
        const { message } = e.response.data
        setLoadingSubmit(false)
        toast.error(message)
      })
  }

  const disabled = selectedRowKeys.length < 1
  const rightContent = (
    <div className="flex justify-between items-center">
      <div>
        <Dropdown.Button
          // style={{ borderRadius: 10, backgroundColor: "red" }}
          icon={<PrinterTwoTone />}
          disabled={disabled}
          trigger="click"
          className="rounded-lg mr-2"
          overlay={
            <Menu>
              <Menu.Item className="flex justify-between items-center">
                <PrinterTwoTone />{" "}
                <a
                  href={"#"}
                  onClick={(e) => {
                    e.preventDefault()
                    handleAction("/api/mapping/order/label")
                  }}
                >
                  <span>Cetak Label</span>
                </a>
              </Menu.Item>
              <Menu.Item className="flex justify-between items-center">
                <PrinterTwoTone />{" "}
                <a
                  href={"#"}
                  onClick={(e) => {
                    e.preventDefault()
                    handleAction("/api/mapping/order/invoice")
                  }}
                >
                  <span>Cetak Invoice</span>
                </a>
              </Menu.Item>
            </Menu>
          }
        ></Dropdown.Button>
      </div>

      <FilterModal handleOk={handleFilter} />
      {/* <button
        onClick={() => handleRefreshToken()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <span>Refresh Token</span>
      </button> */}

      {syncData?.sync ? (
        <button
          onClick={() => cancelSync()}
          className="text-white bg-red-500 hover:bg-red-600/90 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
        >
          <span>Batalkan Sync</span>
        </button>
      ) : (
        <SyncModal handleOk={(e) => handleSyncron(e)} />
      )}

      {/* <button
        onClick={() => handleSyncronTest()}
        className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        <span>Test</span>
      </button> */}
    </div>
  )

  if (loadingExport) {
    return (
      <Layout title="List Mapping Order">
        <LoadingFallback />
      </Layout>
    )
  }

  return (
    <Layout rightContent={rightContent} title="List Mapping Order">
      <div className="row mb-4">
        {syncData?.sync && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body text-mainColor text-center">
                <p>
                  Sinkronisasi data tiktok sedang berlangsung {syncData.success}{" "}
                  dari {totalDataTiktok}
                  <span id="wait">.</span>
                </p>
                {/* <Progress percent={syncData?.percentage} status="active" /> */}
              </div>
            </div>
          </div>
        )}

        {stock == 1 && (
          <div className="col-md-12">
            <div class="alert alert-danger" role="alert">
              Stock tidak tersedia, gagal mengurangi stok
            </div>
          </div>
        )}

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

export default MappingOrderList
