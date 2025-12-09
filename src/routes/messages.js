import api from "./api";

export async function getMessages(token, from, to) {
  const res = await api.get(`/messages/${from}/${to}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
