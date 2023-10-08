import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from "@ant-design/icons"
import { Button, Form, Input } from "antd"
import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
// import { ReactComponent as BGfis } from "../../Assets/bgfis.svg"
// import { ReactComponent as BGfis } from "../../Assets/IllustbyVids.svg"
import { ReactComponent as BGfis } from "../../Assets/LandingPicture.svg"

const Login = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = (values) => {
    setLoading(true)
    axios
      .post("/api/proccess/login", values)
      .then((res) => {
        const { data } = res
        const { message, token, redirect } = data
        setLoading(false)
        toast.success(message, {
          position: toast.POSITION.TOP_RIGHT,
        })

        localStorage.setItem("token", token)
        localStorage.removeItem("menu_id")
        setTimeout(() => {
          return (window.location.href = redirect)
        }, 2000)
      })
      .catch((err) => {
        const { message } = err.response.data
        setLoading(false)
        toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
        })
      })
  }

  return (
    <div className="bg-white font-sans">
      <div className="grid lg:grid-cols-2 h-screen my-auto">
        {/* background container */}
        {/* <div
          className="
            w-full h-screen 
            bg-[#efefef]
            hidden lg:block  
            rounded-l-lg
            bg-cover
          "
          style={{
            backgroundImage:
              "url('https://aimidev.s3.us-west-004.backblazeb2.com/upload/master/banner/ZZGIxl1oX55CRcWbIcyaL7kGa1wWTWb2h2l4z9zL.svg')",
          }}
        />*/}

        <div className="w-full h-screen lg:flex hidden justify-center items-center">
          <BGfis className="w-3/4 h-3/4" />
        </div>

        {/* form container */}
        <div
          className="
            w-full
            my-auto
            bg-white 
            rounded-lg lg:rounded-l-none
            grid grid-cols-6 gap-4
     
          "
        >
          <div className="col-start-2 col-span-4">
            <div className="mb-4">
              <div className="flex lg:hidden justify-center items-center">
                <BGfis className="md:w-1/2 w-full h-1/2 " />
              </div>
              <strong className="pt-4 mb-2 text-xl">Silahkan Masuk</strong>
            </div>
            <Form
              onKeyUp={() => {
                // Enter
                if (event.keyCode === 13) {
                  form.submit()
                }
              }}
              form={form}
              name="basic"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              className="px-8 pt-6 pb-8 mb-4 bg-white rounded"
            >
              <div className="mb-4">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input Email!",
                    },
                  ]}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email Address..."
                  />
                </Form.Item>
              </div>
              <div className="mb-6 relative z-0">
                <div className="absolute right-0 z-10">
                  <a
                    tabIndex={"-1"}
                    className="link text-blue-500 align-baseline hover:text-blue-800 cursor-pointer"
                    href="/forgot-password"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
                <Form.Item
                  label="Kata Sandi"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input Password!",
                    },
                  ]}
                >
                  <Input.Password
                    id="password"
                    type="password"
                    placeholder="Enter Password..."
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </div>
              <div className="my-6 text-center">
                <Button
                  style={{
                    backgroundColor: "#01BFFF",
                    borderColor: "#01BFFF",
                    color: "white",
                    width: "100%",
                  }}
                  type="submit"
                  onClick={() => form.submit()}
                >
                  {loading && <LoadingOutlined />}
                  Masuk
                </Button>
              </div>
            </Form>
            <hr className="mb-6 border-t" />
            <div className="text-center">
              <span>Anda belum memiliki akun? </span>
              <a
                className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                href="/register"
              >
                Daftar disini
              </a>
            </div>
            <div className="text-center text-[#D4D4D4] mt-4 text-sm font-light">
              <p>Version 2.1.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
