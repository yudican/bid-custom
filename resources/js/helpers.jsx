import { message } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"

const getBase64 = (img, callback) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result))
  reader.readAsDataURL(img)
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"

  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!")
  }

  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isLt2M) {
    message.error("Image must smaller than 2MB!")
  }

  return isJpgOrPng && isLt2M
}

const subStr = (str, length = 25) => {
  if (str?.length > length) {
    return str?.substr(0, length) + "..."
  } else {
    return str
  }
}

// pluck
//
// Description: pluck an array of objects
//
// Arguments:
//   array: array of objects
//   key: key to pluck
//
// Returns: array of plucked values
//
// Example:
//   pluck([{a: 1}, {a: 2}], 'a')
//   // => [1, 2]
//
const pluck = (array, key) => array.map((item) => item[key])

function sumPriceTotal(array) {
  let sum = 0
  // check if is array
  if (Array.isArray(array)) {
    array.map((item) => {
      sum += item.product.price.final_price * item.qty
    })
  }
  return sum
}

// export fuction format number indonesia
function formatNumber(number, prefix = null) {
  // change number format it's number greater than 0
  if (number > 0) {
    const format = parseInt(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    if (prefix) {
      return `${prefix} ${format}`
    }
    return format
  } else {
    return 0
  }
}

const getStatusLeadOrder = (status = 1) => {
  switch (status) {
    case "-1":
      return "Draft"
    case "1":
      return "New"
    case "2":
      return "Open"
    case "3":
      return "Closed"
    case "4":
      return "Canceled"

    default:
      return "New"
  }
}

const statusDetailTransaksi = (status = 1) => {
  switch (status) {
    case 1:
      return "Waiting Payment"
    case 2:
      return "Checking Payment"
    case 3:
      return "Payment Confirmed"
    case 4:
      return "Canceled"
    case 7:
      return "Payment Confirmed"

    default:
      return "Canceled"
  }
}

const truncateString = (fullStr, strLen = 30, separator = "...") => {
  if (fullStr?.length <= strLen) {
    return fullStr
  }

  separator = separator || "..."

  var sepLen = separator?.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2)

  return (
    fullStr?.substr(0, frontChars) +
    separator +
    fullStr?.substr(fullStr?.length - backChars)
  )
}

const snakeToCapitalize = (string) =>
  string
    .replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()) // Initial char (after -/_)
    .replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase()) // First char after each -/_

const capitalizeString = (str) => {
  return str.replace(/^(.)(.*)$/, function (_, firstChar, restOfString) {
    return firstChar.toUpperCase() + restOfString
  })
}

const capitalizeEachWord = (str) =>
  str
    .split(" ") // Split the string into an array of words
    .map((value, index) => capitalizeString(value)) // Capitalize the first letter of each word
    .join(" ") // Join the words back into a single string

const RenderIf = ({ isTrue = false, children }) => (isTrue ? children : null)

const mapApiKey = "AIzaSyCH6ql7a8mP4xZmfZ-mqXejHTwzfuHqoMI"

const badgeColor = (color) => {
  switch (color) {
    case "New Lead":
      return "bg-purple-500"
    case "New":
      return "bg-purple-500"

    case "Waiting Approval":
      return "bg-secondaryOutlineColor"

    case "In Progress":
      return "bg-blueColor"

    case "Qualified":
      return "bg-green-500"
    case "Approved":
      return "bg-green-500"

    case "Rejected":
      return "bg-red-500"
    case "Unqualified":
      return "bg-red-500"
    case "Cancelled":
      return "bg-red-500"

    case "Open":
      return "bg-blueColor"
    case "Closed":
      return "bg-blueColor"
    default:
      return "bg-movementColor"
  }
}

const useScript = (url) => {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = url;
  //   script.async = true;
  //   document.body.appendChild(script);
  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
}

const removeArrayItemWithSpecificString = (arr, value) => {
  return arr.filter(function (ele) {
    return ele != value
  })
}

const formatDate = (date, format = "DD-MM-YYYY") => {
  if (date) {
    return moment(new Date(date)).format(format)
  }
  return "-"
}

const getItem = (key, parse = false) => {
  if (parse) {
    return JSON.parse(localStorage.getItem(key))
  }
  return localStorage.getItem(key)
}

//Hide Menu
const inArray = (needle, haystack) => {
  var length = haystack.length
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true
  }
  return false
}

const groupBy = (array, key) => {
  if (array) {
    const ids = array.map((o) => o[key])
    const filtered = array.filter(
      (val, index) => !ids.includes(val[key], index + 1)
    )
    return filtered
  }

  return []
}

// sum value array object without key

const useDebounce = (value, timeout = 500) => {
  const [state, setState] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout)

    return () => clearTimeout(handler)
  }, [value, timeout])

  return state
}

const handleString = (string) => {
  if (
    string === "undefined" ||
    string === undefined ||
    string === "" ||
    string === null ||
    string === "null"
  ) {
    return "-"
  } else {
    return string
  }
}

export {
  getBase64,
  beforeUpload,
  pluck,
  sumPriceTotal,
  formatNumber,
  getStatusLeadOrder,
  statusDetailTransaksi,
  truncateString,
  snakeToCapitalize,
  RenderIf,
  subStr,
  mapApiKey,
  badgeColor,
  useScript,
  removeArrayItemWithSpecificString,
  formatDate,
  getItem,
  inArray,
  groupBy,
  useDebounce,
  handleString,
  capitalizeString,
  capitalizeEachWord,
}
