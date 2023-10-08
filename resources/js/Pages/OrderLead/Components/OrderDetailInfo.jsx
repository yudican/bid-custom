import { PrinterTwoTone } from "@ant-design/icons"
import { Dropdown, Menu } from "antd"
import React from "react"
import { useNavigate } from "react-router-dom"
import { formatDate, handleString, RenderIf } from "../../../helpers"

const OrderDetailInfo = ({ order = null, printUrl }) => {
  let navigate = useNavigate()
  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h1 className="text-lg text-bold ">{order?.title}</h1>
        <RenderIf isTrue={order?.status !== "4"}>
          <div>
            <Dropdown.Button
              style={{ borderRadius: 10 }}
              icon={<PrinterTwoTone />}
              overlay={
                <Menu>
                  {order?.status != 1 && (
                    <Menu.Item className="flex justify-between items-center">
                      <PrinterTwoTone />{" "}
                      <a href={printUrl?.si} target="_blank">
                        <span>Print SI</span>
                      </a>
                    </Menu.Item>
                  )}
                  <Menu.Item className="flex justify-between items-center">
                    <PrinterTwoTone />{" "}
                    <a href={printUrl?.so} target="_blank">
                      <span>Print SO</span>
                    </a>
                  </Menu.Item>
                  <Menu.Item className="flex justify-between items-center">
                    <PrinterTwoTone />{" "}
                    <a href={printUrl?.sj} target="_blank">
                      <span>Print SJ</span>
                    </a>
                  </Menu.Item>
                </Menu>
              }
            ></Dropdown.Button>
          </div>
        </RenderIf>
      </div>
      <div className="card-body row">
        <div className="col-md-6">
          <table className="w-100" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Contact</strong>
                </td>
                <td>: {order?.contact_user?.name || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Company</strong>
                </td>
                <td>
                  : {handleString(order?.contact_user?.company?.name) || "-"}
                </td>
              </tr>

              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Customer Need</strong>
                </td>
                <td>: {order?.customer_need || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>PIC Sales</strong>
                </td>
                <td>: {order?.sales_user?.name || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Created On</strong>
                </td>
                <td>: {formatDate(order?.created_at) || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Created By</strong>
                </td>
                <td>: {order?.create_user?.name || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <table className="w-100" style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>PIC Warehouse</strong>
                </td>
                <td>: {order?.courier_user?.name || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Warehouse</strong>
                </td>
                <td>: {handleString(order?.warehouse_name) || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Order Number</strong>
                </td>
                <td>: {order?.order_number || "-"}</td>
              </tr>

              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Invoice Number</strong>
                </td>
                <td>: {order?.invoice_number || "-"}</td>
              </tr>
              {/* <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Reference No</strong>
                </td>
                <td>: {order?.reference_number || "-"}</td>
              </tr> */}
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Payment Term</strong>
                </td>
                <td>: {order?.payment_term?.name || "-"}</td>
              </tr>
              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Due Date</strong>
                </td>
                <td>: {order?.due_date || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailInfo
