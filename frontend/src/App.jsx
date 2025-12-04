// src/App.jsx
import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./api/usersApi";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, Name: "", Email: "" });
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
      alert("Kullanıcılar alınırken hata oluştu (konsola bak)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Name || !form.Email) {
      alert("İsim ve Email zorunlu");
      return;
    }

    try {
      if (form.id) {
        await updateUser(form.id, {
          Name: form.Name,
          Email: form.Email,
        });
      } else {
        await createUser({
          Name: form.Name,
          Email: form.Email,
        });
      }

      setForm({ id: null, Name: "", Email: "" });
      await loadUsers();
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      alert("Kayıt sırasında hata oluştu (konsola bak)");
    }
  };

  const handleEdit = (user) => {
    console.log(user);
    setForm({
      id: user.Id,
      Name: user.Name,
      Email: user.Email,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Silme sırasında hata oluştu (konsola bak)");
    }
  };

  return (
    <div style={{ boxSizing: "border-box", width: "100vw", margin: "20px auto", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "50px" }}>
      <h1>MSSQL CRUD</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>İsim: </label>
          <input
            name="Name"
            value={form.Name}
            onChange={handleChange}
            placeholder="İsim"
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Email: </label>
          <input
            name="Email"
            value={form.Email}
            onChange={handleChange}
            placeholder="Email"
          />
        </div>
        <button type="submit">
          {form.id ? "Güncelle" : "Ekle"}
        </button>
        {form.id && (
          <button
            type="button"
            onClick={() => setForm({ id: null, Name: "", Email: "" })}
            style={{ marginLeft: 10 }}
          >
            Temizle
          </button>
        )}
      </form>

      {loading ? (
        <p>Yükleniyor...</p>
      ) : (
        <table border="1" cellPadding={5} width="100%">
          <thead>
            <tr>
              <th>Id</th>
              <th>İsim</th>
              <th>Email</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              
              <tr key={u.Id}>
                <td>{u.Id}</td>
                <td>{u.Name}</td>
                <td>{u.Email}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Düzenle</button>
                  
                  <button
                    onClick={() => handleDelete(u.Id)}
                    style={{ marginLeft: 5 }}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4">Hiç kullanıcı yok</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
