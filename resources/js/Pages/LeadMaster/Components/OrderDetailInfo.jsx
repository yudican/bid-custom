import React from "react"
import { badgeColor, formatDate, handleString } from "../../../helpers"

const OrderDetailInfo = ({ order = null }) => {
  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h1 className="text-lg text-bold ">{order?.title}</h1>
        <div
          className={`text-xs font-bold 
          ${badgeColor(order?.status_name)} 
          text-white p-2 rounded-t-full rounded-bl-full`}
        >
          {order?.status_name}
        </div>
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
                  <strong>Warehouse</strong>
                </td>
                <td>: {handleString(order?.warehouse_name) || "-"}</td>
              </tr>

              <tr>
                <td style={{ width: "50%" }} className="py-2">
                  <strong>Customer Need</strong>
                </td>
                <td>: {order?.customer_need || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <table className="w-100" style={{ width: "100%" }}>
            <tbody>
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
      </div>
    </div>
  )
}

export default OrderDetailInfo
