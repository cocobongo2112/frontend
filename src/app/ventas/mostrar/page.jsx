'use client';

import { useState, useEffect } from 'react';
import axios from "axios";
import Boton from "@/components/boton";
import Link from 'next/link';

export default function Ventas() {
    const [sells, setSells] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchVentas() {
            try {
                const url = "http://localhost:3000/ventas";
                const response = await axios.get(url);
                setSells(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching sales:", error);
                setError("No se pudieron cargar las ventas");
                setLoading(false);
            }
        }

        fetchVentas();
    }, []);

    async function cancelarVenta(id) {
        try {
            const url = `http://localhost:3000/ventas/cancelar/${id}`;
            await axios.put(url);
            // Remove the canceled sale from the list
            setSells(sells.filter(sell => sell.id !== id));
        } catch (error) {
            console.error("Error canceling sale:", error);
            alert("No se pudo cancelar la venta");
        }
    }

    if (loading) return <div>Cargando ventas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Ventas</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre Usuario</th>
                        <th>Nombre Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sells.map((sell) => (
                        <tr key={sell.id}>
                            <td>{sell.nombreUsuario}</td>
                            <td>{sell.nombreProducto}</td>
                            <td>${sell.precio}</td>
                            <td>{sell.cantidad}</td>
                            <td>{sell.fecha}</td>
                            <td>
                                <Link 
                                    href={`/ventas/editar/${sell.id}`} 
                                    className="btn btn-primary me-2"
                                >
                                    Editar
                                </Link>
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => cancelarVenta(sell.id)}
                                >
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Boton />
        </div>
    );
}