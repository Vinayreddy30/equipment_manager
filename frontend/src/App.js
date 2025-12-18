import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/equipment';

function App() {
    const [equipment, setEquipment] = useState([]);
    const [formData, setFormData] = useState({ name: '', type: '', status: '', lastCleaned: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchEquipment(); }, []);

    const fetchEquipment = async () => {
        const res = await axios.get(API_URL);
        setEquipment(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.type || !formData.status || !formData.lastCleaned) return alert("Please fill all fields");

        if (editingId) {
            await axios.put(`${API_URL}/${editingId}`, formData);
        } else {
            await axios.post(API_URL, formData);
        }
        setFormData({ name: '', type: '', status: '', lastCleaned: '' });
        setEditingId(null);
        fetchEquipment();
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData({ name: item.name, type: item.type, status: item.status, lastCleaned: item.lastCleaned });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this item?")) {
            await axios.delete(`${API_URL}/${id}`);
            fetchEquipment();
        }
    };

    return (
        <div className="container">
            <h1>Equipment Manager</h1>

            <form onSubmit={handleSubmit} className="equipment-form">
                <input type="text" placeholder="Equipment Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                    <option value="" disabled>
                        Type
                    </option>

                    {['Machine', 'Vessel', 'Tank', 'Mixer'].map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <select
                    value={formData.status}
                    onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                    }
                >
                    <option value="" disabled>
                        Status
                    </option>

                    {['Active', 'Inactive', 'Under Maintenance'].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Last cleaned"
                    value={formData.lastCleaned}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => !formData.lastCleaned && (e.target.type = "text")}
                    onChange={(e) => setFormData({ ...formData, lastCleaned: e.target.value })}
                />
                <button type="submit">{editingId ? 'Update' : 'Add'} Equipment</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Name</th><th>Type</th><th>Status</th><th>Last Cleaned</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td><span className={`status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></td>
                            <td>{item.lastCleaned}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;