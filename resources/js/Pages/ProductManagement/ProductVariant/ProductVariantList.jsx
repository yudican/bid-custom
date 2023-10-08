import {
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import {
  Dropdown,
  Input,
  Menu,
  Pagination,
  Popconfirm,
  Switch,
  Table,
} from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import { formatNumber, getItem, inArray } from "../../../helpers"
import FilterModal from "./Components/FilterModal"
import { productVariantListColumn } from "./config"

const ProductVariantList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})
  const [loadingExport, setLoadingExport] = useState(false)
  const [warehouses, setWarehouses] = useState([])
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  const loadData = (
    url = "/api/product-management/product-variant",
    perpage = 10,
    params = { page: currentPage }
  ) => {
    setLoading(true)
    axios
      .post(url, { perpage, ...params })
      .then((res) => {
        const { data, total, current_page } = res.data.data
        setTotal(total)
        setCurrentPage(current_page)
        const newData = data.map((item) => {
          return {
            ...item,
            id: item.id,
            name: item.name,
            package_name: item.package_name,
            variant_name: item.variant_name,
            product_image: item?.image_url,
            status: item?.status,
            stock: item?.stock,
            final_price: formatNumber(item?.price?.final_price, "Rp. "),
          }
        })

        setDatas(newData)
        setLoading(false)
      })
      .catch((e) => setLoading(false))
  }

  const loadWarehouses = () => {
    axios
      .get("/api/master/warehouse")
      .then((res) => {
        const { data } = res.data
        setWarehouses(data)
      })
      .catch((e) => setLoading(false))
  }

  useEffect(() => {
    loadData()
    loadWarehouses()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadData(
      `/api/product-management/product-variant/?page=${page}`,
      pageSize,
      {
        search,
        page,
        ...filterData,
      }
    )
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadData(`/api/product-management/product-variant`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadData(`/api/product-management/product-variant`, 10, data)
  }

  const deleteBanner = (banner_id) => {
    axios
      .post(`/api/product-management/product-variant/delete/${banner_id}`, {
        _method: "DELETE",
      })
      .then((res) => {
        toast.success("Banner berhasil dihapus")
        loadData()
      })
      .catch((err) => {
        toast.error("Banner gagal dihapus")
      })
  }

  const updateStatus = (record) => {
    axios
      .post(
        `/api/product-management/product-variant/status/${record.id}`,
        record
      )
      .then((res) => {
        toast.success("Status Berhasil Di update")
        loadData()
      })
      .catch((err) => {
        toast.error("Status gagal Di update")
      })
  }

  const handleExport = () => {
    setLoadingExport(true)
    axios
      .post(`/api/product-management/product-variant/export`)
      .then((res) => {
        const { data } = res.data
        setLoadingExport(false)
        return window.open(data)
      })
      .catch((err) => {
        setLoadingExport(false)
      })
  }

  const show = !inArray(getItem("role"), ["adminsales", "leadsales", "leadcs"])

  const rightContent = (
    <div className="flex justify-between items-center">
      <FilterModal handleOk={handleFilter} />
      <button
        onClick={() => (loadingExport ? null : handleExport())}
        className="text-white bg-green-800 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
      >
        {loadingExport ? <LoadingOutlined /> : <ExportOutlined />}
        <span className="ml-2">Export</span>
      </button>
      {show && (
        <button
          onClick={() => navigate("form")}
          className="text-white bg-blueColor hover:bg-blueColor/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center ml-2"
        >
          <PlusOutlined />
          <span className="ml-2">Tambah Data</span>
        </button>
      )}
    </div>
  )

  return (
    <Layout rightContent={rightContent} title="List Product Variant">
      <div className="row mb-4">
        <div className="flex overflow-y-auto mb-4">
          {warehouses?.map((item, index) => (
            <div
              key={index}
              className="col cursor-pointer"
              onClick={() => {
                setSelectedWarehouse(item)
                loadData(`/api/product-management/product-variant`, 10, {
                  warehouse_id: item.id,
                })
              }}
            >
              <div
                className={`
                  card w-96
                  bg-gradient-to-r from-white via-white ${
                    selectedWarehouse?.id === item.id ? "to-blue-500/20" : ""
                  }
                  hover:to-blue-500/20
                `}
              >
                <div className="p-3 border-b flex justify-between">
                  <div className="flex items-center">
                    <strong
                      className={`text-base font-semibold text-${
                        selectedWarehouse?.id === item.id ? "blue-500" : "black"
                      }`}
                    >
                      {item.name}
                    </strong>
                  </div>
                </div>
                <div className="card-body">
                  <strong
                    className={`text-${
                      selectedWarehouse?.id === item.id ? "blue-500" : "black"
                    } text-lg font-medium`}
                  >
                    Total Stock: {item.stock}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                    loadData()
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
        scroll={{ x: "max-content" }}
        tableLayout={"auto"}
        dataSource={datas}
        columns={[
          ...productVariantListColumn,
          {
            title: "Status",
            key: "status",
            dataIndex: "status",
            render: (text, record, index) => {
              return (
                <Switch
                  checked={text > 0}
                  onChange={(e) => {
                    updateStatus({ status: e ? "1" : "0", id: record.id })
                  }}
                />
              )
            },
          },
          {
            title: "Action",
            key: "id",
            align: "center",
            fixed: "right",
            width: 100,
            render: (text) => {
              if (!show) return null
              return (
                <Dropdown.Button
                  style={{
                    left: -16,
                  }}
                  // icon={<MoreOutlined />}
                  overlay={
                    <Menu itemIcon={<RightOutlined />}>
                      <Menu.Item
                        icon={<EditOutlined />}
                        onClick={() => navigate(`form/${text.id}`)}
                      >
                        Ubah
                      </Menu.Item>
                      <Popconfirm
                        title="Yakin hapus data ini?"
                        onConfirm={() => deleteBanner(text.id)}
                        // onCancel={cancel}
                        okText="Ya, Hapus"
                        cancelText="Batal"
                      >
                        <Menu.Item icon={<DeleteOutlined />}>
                          <span>Hapus</span>
                        </Menu.Item>
                      </Popconfirm>
                    </Menu>
                  }
                ></Dropdown.Button>
              )
            },
          },
        ]}
        loading={loading}
        pagination={false}
        rowKey="id"
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

export default ProductVariantList
