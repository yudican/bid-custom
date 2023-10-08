import {
  CloseCircleFilled,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { Dropdown, Input, Menu, Pagination, Popconfirm, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Layout from "../../../components/layout"
import { formatNumber, getItem, inArray } from "../../../helpers"
import FilterModal from "./Components/FilterModal"
import { productMarginListColumn } from "./config"

const ProductMarginBottomList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [datas, setDatas] = useState([])
  console.log(datas, "list data margin bottom")
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterData, setFilterData] = useState({})

  const loadData = (
    url = "/api/product-management/margin-bottom",
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
            id: item.id,
            product_image: item.product_image,
            product_name: item.product_name,
            final_price: formatNumber(item.basic_price, "Rp. "),
            margin: formatNumber(item.margin, "Rp. "),
            role_name: item.role_name,
          }
        })

        setDatas(newData)
        setLoading(false)
      })
      .catch((e) => setLoading(false))
  }
  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (page, pageSize = 10) => {
    loadData(`/api/product-management/margin-bottom/?page=${page}`, pageSize, {
      search,
      page,
      ...filterData,
    })
  }

  const handleChangeSearch = () => {
    setIsSearch(true)
    loadData(`/api/product-management/margin-bottom`, 10, { search })
  }

  const handleFilter = (data) => {
    setFilterData(data)
    loadData(`/api/product-management/margin-bottom`, 10, data)
  }

  const deleteProductMargin = (category_id) => {
    axios
      .post(`/api/product-management/margin-bottom/delete/${category_id}`, {
        _method: "DELETE",
      })
      .then((res) => {
        toast.success("Product Margin berhasil dihapus")
        loadData()
      })
      .catch((err) => {
        toast.error("Product Margin gagal dihapus")
      })
  }

  const show = !inArray(getItem("role"), ["adminsales", "leadcs", "warehouse"])

  const rightContent = (
    <div className="flex justify-between items-center">
      <FilterModal handleOk={handleFilter} />
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
    <Layout rightContent={rightContent} title="List Margin Bottom">
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
          ...productMarginListColumn,
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
                        title="Yakin Hapus Data ini?"
                        onConfirm={() => deleteProductMargin(text.id)}
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
      />
    </Layout>
  )
}

export default ProductMarginBottomList
