export const searchUserCreated = (search) => {
  return axios
    .post(`/api/contact/service/search-user`, { search })
    .then((res) => res.data.data)
}

export const searchContact = (search, role_type = null, limit = 5) => {
  return axios
    .post(`/api/general/search-contact`, { search, role_type, limit })
    .then((res) => res.data.data)
}

export const searchSales = (search, limit = 5) => {
  return axios
    .post(`/api/general/search-sales`, { search, limit })
    .then((res) => res.data.data)
}
