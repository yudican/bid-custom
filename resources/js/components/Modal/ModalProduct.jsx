import { SearchOutlined } from "@ant-design/icons"
import { Input, Modal, Tag, Tooltip } from "antd"
import React, { useState } from "react"
import { inArray, capitalizeString } from "../../helpers"

const ModalProduct = ({
  products,
  handleChange,
  value,
  disabled = false,
  type = "product",
}) => {
  const [isModalProductListVisible, setIsModalProductListVisible] =
    useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState("")

  products.sort((a, b) => b.final_stock - a.final_stock)

  const title = products?.find((product) => product?.id === value)?.name
  const filteredProducts =
    products.filter((value) => value.name.toLowerCase().includes(search)) ||
    products

  return (
    <div>
      {disabled ? (
        <div className="w-96 flex items-center border py-1 px-2 rounded-sm line-clamp-1 cursor-pointer">
          <SearchOutlined className="mr-2" />
          <span>{value ? title : `Pilih ${capitalizeString(type)}`}</span>
        </div>
      ) : (
        <Tooltip title={title}>
          <div
            className="w-96 flex items-center border py-1 px-2 rounded-sm line-clamp-1 cursor-pointer"
            onClick={() => setIsModalProductListVisible(true)}
          >
            <SearchOutlined className="mr-2" />
            <span>{value ? title : `Pilih ${capitalizeString(type)}`}</span>
          </div>
        </Tooltip>
      )}

      <Modal
        title={`Daftar ${capitalizeString(type)}`}
        open={isModalProductListVisible}
        cancelText={"Batal"}
        okText={"Pilih"}
        onOk={() => {
          handleChange(selectedProduct)
          setIsModalProductListVisible(false)
        }}
        onCancel={() => setIsModalProductListVisible(false)}
        width={900}
      >
        <div>
          <Input
            placeholder="Cari produk disini.."
            size={"large"}
            className="rounded mb-4"
            suffix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`
                mb-4 shadow-none rounded-md p-2 cursor-pointer bg-white
                ${
                  selectedProduct == product.id
                    ? "border-[1px] border-blue-400 drop-shadow-md ring-blue-500"
                    : "border border-gray-400"
                }
              `}
              onClick={() => {
                setSelectedProduct(product.id)
              }}
              // disabled={product.stock === 0}
            >
              <div className="flex max-w-[800px] justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={product.image_url}
                    alt="product_photo"
                    className="mr-4 w-20 h-20 rounded-md border"
                  />
                  <div>
                    <div className="block text-lg line-clamp-1 font-medium max-w-2xl">
                      {product.name}{" "}
                    </div>
                    <br />
                    <div className="block">
                      Tersedia di :
                      {product?.sales_channels?.map((value, index) => (
                        <Tag key={index} color="lime">
                          {value}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
                {/* {product.final_stock && ( */}
                <div className="block text-red-500">
                  Stock Tersedia: {product.final_stock}
                </div>
                {/* )} */}
                {inArray(type, ["pengemasan", "perlengkapan"]) && (
                  <div className="block">Sku: {product?.sku}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}

export default ModalProduct
