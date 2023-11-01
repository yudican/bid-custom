import { Button, Checkbox, Modal, Popover } from "antd"
import React, { useRef, useState } from "react"

const ModalTautanTelegram = ({ checked, data, onDisabled }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopOverOpen, setIsPopOverOpen] = useState(false)
  const [showModalDisabled, setShowModalDisabled] = useState(false)
  const modalRef = useRef()
  console.log(modalRef.current, "modalref")

  return (
    <div>
      <Checkbox
        checked={checked}
        className="mb-2"
        onChange={(e) => {
          if (!checked) {
            return setIsModalOpen(true)
          }

          return setShowModalDisabled(true)
        }}
      >
        {checked ? (
          <span className="text-danger">Matikan Notifikasi Telegram</span>
        ) : (
          <span className="text-primary">Beri Saya Notifikasi Telegram</span>
        )}
      </Checkbox>

      {/* modal aktivasi */}
      <Modal
        // bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
        open={isModalOpen}
        title="Tautkan Telegram"
        width={700}
        footer={null}
        // cancelText={"Tutup"}
        // okText={"Tautkan Sekarang"}
        onCancel={() => setIsModalOpen(false)}
        // onOk={() => {
        //   window.open("https://t.me/nabawi_cs_bot")
        // }}
      >
        <div ref={modalRef}>
          <p>
            Berikut adalah cara untuk menautkan akun telegram anda, untuk
            mendapatkan realtime notifikasi.
          </p>
          <ol>
            <li className="mb-4">
              1. Klik Tombol{" "}
              <span
                onClick={() => {
                  if (modalRef.current) {
                    modalRef.current.scrollIntoView({
                      behavior: "smooth", // You can change this to 'auto' for instant scrolling
                      block: "end", // You can change this to 'end' if you want to scroll to the bottom
                    })

                    setTimeout(() => {
                      setIsPopOverOpen(true)
                      setTimeout(() => {
                        setIsPopOverOpen(false)
                        modalRef.current.scrollIntoView({
                          behavior: "smooth", // You can change this to 'auto' for instant scrolling
                          block: "start", // You can change this to 'end' if you want to scroll to the bottom
                        })
                      }, 1500)
                    }, 500)
                  }
                }}
                className="text-primary cursor-pointer"
              >
                Tautkan sekarang
              </span>{" "}
              dibagian bawah atau{" "}
              <a
                href="https://t.me/nabawi_cs_bot"
                target="_blank"
                className="text-primary"
              >
                Klik Disini
              </a>
            </li>
            <li className="mb-4">
              <p>2. Setelah Masuk Ke Chat Kemudian Klik Start</p>
              <img
                src="https://i.ibb.co/Pcvh0bN/Jepretan-Layar-2023-11-01-pukul-11-18-50.png"
                alt=""
                className="h-52 rounded-md mx-auto"
              />
            </li>
            <li className="mb-4">
              <p>
                {" "}
                3. Selanjutnya Masukkan Customer Code dan Kirim Di Dalam Chat{" "}
                <span className="text-primary">{data?.uid}</span>
              </p>
              <img
                src="https://i.ibb.co/vZVptq2/Jepretan-Layar-2023-11-01-pukul-11-24-23.png"
                alt=""
                className="h-52 rounded-md mx-auto"
              />
            </li>
            <li className="mb-4">
              <p>
                4. Setelah Langkah-Langkah Diatas Selesai, anda akan mendapatkan
                balasan bahwa penyiapan akun notifikasi telah selesai.
              </p>
              <img
                src="https://i.ibb.co/vZVptq2/Jepretan-Layar-2023-11-01-pukul-11-24-23.png"
                alt=""
                className="h-52 rounded-md mx-auto"
              />
            </li>
          </ol>

          <div className="flex justify-end pt-3 border-t-[1px]">
            <Button
              className="mr-3"
              onClick={() => {
                setIsModalOpen(false)
              }}
            >
              Tutup
            </Button>
            <Popover
              placement="topLeft"
              open={isPopOverOpen}
              content={
                <div>
                  <p>Klik disini untuk menautkan</p>
                </div>
              }
            >
              <Button
                onClick={() => {
                  window.open("https://t.me/nabawi_cs_bot")
                }}
                type="primary"
              >
                Tautkan Sekarang
              </Button>
            </Popover>
          </div>
        </div>
      </Modal>

      {/* modal disabled */}
      <Modal
        title="Matikan Notifikasi Telegram"
        open={showModalDisabled}
        onOk={() => {
          setShowModalDisabled(false)
          onDisabled()
        }}
        cancelText={"Tutup"}
        onCancel={() => setShowModalDisabled(false)}
        okText={"Ya, Matikan"}
        width={700}
      >
        <div>
          <p>Apakah Kamu Yakin Ingin Menonaktifkan notifikasi Telegram?</p>
        </div>
      </Modal>
    </div>
  )
}

export default ModalTautanTelegram
