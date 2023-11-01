import React from "react"
import debounce from "lodash.debounce"
import { Empty, Select, Spin } from "antd"
import { VerifiedOutlined } from "@ant-design/icons"

export default function DebounceSelect({
  fetchOptions,
  debounceTimeout = 800,
  defaultOptions = [],
  value = null,
  isVerified = false,
  ...props
}) {
  const [fetching, setFetching] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const fetchRef = React.useRef(0)
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      if (value) {
        setFetching(true)
        fetchOptions(value)
          .then((newOptions) => {
            if (fetchId !== fetchRef.current) {
              // for fetch callback order
              return
            }

            setOptions(newOptions)
            setFetching(false)
          })
          .finally(() => {
            setFetching(false)
          })
      }
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  const newOption = options.length > 0 ? options : defaultOptions
  return (
    <Select
      {...props}
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
      suffixIcon={isVerified && <VerifiedOutlined color="green" />}
      options={newOption}
      value={value}
    />
  )
} // Usage of DebounceSelect
