"use client";
import { useState, useEffect } from 'react';
import axios from "axios";

export default function NuevaVenta() {
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userQuery, setUserQuery] = useState('');
    const [productQuery, setProductQuery] = useState('');

    // Cargar usuarios y productos inicial
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const responseUsuarios = await axios.get("http://localhost:3000/");
                const responseProductos = await axios.get("http://localhost:3000/productos");
                
                setUsuarios(responseUsuarios.data);
                setProductos(responseProductos.data);
            } catch (error) {
                console.error("Error cargando datos", error);
            }
        };
        cargarDatos();
    }, []);

    // Filtrar usuarios
    useEffect(() => {
        if (userQuery.length > 0) {
            const filtrados = usuarios.filter(usuario => 
                usuario.nombre.toLowerCase().includes(userQuery.toLowerCase())
            );
            setUsuariosFiltrados(filtrados);
        } else {
            setUsuariosFiltrados([]);
        }
    }, [userQuery, usuarios]);

    // Filtrar productos
    useEffect(() => {
        if (productQuery.length > 0) {
            const filtrados = productos.filter(producto => 
                producto.nombre.toLowerCase().includes(productQuery.toLowerCase())
            );
            setProductosFiltrados(filtrados);
        } else {
            setProductosFiltrados([]);
        }
    }, [productQuery, productos]);

    // Guardar venta
    const guardarVenta = async (e) => {
        e.preventDefault();
        
        if (!selectedUser || !selectedProduct) {
            alert("Debe seleccionar usuario y producto");
            return;
        }

        try {
            const url = "http://localhost:3000/ventas/nuevaVenta";
            const datos = {
                idUsuario: selectedUser.id,
                idProducto: selectedProduct.id,
                estatus: "Vendido",
                cantidad: 1
            };
            
            const respuesta = await axios.post(url, datos);
            location.replace("/ventas/mostrar");
        } catch (error) {
            console.error("Error guardando venta", error);
            alert("No se pudo guardar la venta");
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={guardarVenta}>
                <div className="row">
                    {/* Selector de Usuario */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Usuario</label>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Buscar usuario..."
                                value={userQuery}
                                onChange={(e) => setUserQuery(e.target.value)}
                            />
                            {usuariosFiltrados.length > 0 && (
                                <ul className="list-group">
                                    {usuariosFiltrados.map((usuario) => (
                                        <li 
                                            key={usuario.id} 
                                            className="list-group-item"
                                            onClick={() => {
                                                setSelectedUser(usuario);
                                                setUserQuery(usuario.nombre);
                                                setUsuariosFiltrados([]);
                                            }}
                                        >
                                            {usuario.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {selectedUser && (
                                <input 
                                    type="hidden" 
                                    value={selectedUser.id} 
                                    name="idUsuario" 
                                />
                            )}
                        </div>
                    </div>

                    {/* Selector de Producto */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Producto</label>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Buscar producto..."
                                value={productQuery}
                                onChange={(e) => setProductQuery(e.target.value)}
                            />
                            {productosFiltrados.length > 0 && (
                                <ul className="list-group">
                                    {productosFiltrados.map((producto) => (
                                        <li 
                                            key={producto.id} 
                                            className="list-group-item"
                                            onClick={() => {
                                                setSelectedProduct(producto);
                                                setProductQuery(producto.nombre);
                                                setProductosFiltrados([]);
                                            }}
                                        >
                                            {producto.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {selectedProduct && (
                                <input 
                                    type="hidden" 
                                    value={selectedProduct.id} 
                                    name="idProducto" 
                                />
                            )}
                        </div>
                    </div>

                    <div className="col-12 mt-3">
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={!selectedUser || !selectedProduct}
                        >
                            Guardar Venta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}