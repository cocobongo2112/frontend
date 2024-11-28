"use client";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useParams, useRouter } from 'next/navigation';

export default function EditarVenta() {
    const router = useRouter();
    const params = useParams();
    const [usuarios, setUsuarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userQuery, setUserQuery] = useState('');
    const [productQuery, setProductQuery] = useState('');
    const [ventaActual, setVentaActual] = useState(null);

    // Cargar datos iniciales y datos de la venta a editar
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Cargar usuarios y productos
                const responseUsuarios = await axios.get("http://localhost:3000/");
                const responseProductos = await axios.get("http://localhost:3000/productos");
                
                setUsuarios(responseUsuarios.data);
                setProductos(responseProductos.data);

                // Cargar datos de la venta específica
                const responseVenta = await axios.get(`http://localhost:3000/ventas/buscarPorId/${params.id}`);
                const venta = responseVenta.data;
                
                // Buscar y establecer usuario y producto existentes
                const usuarioExistente = responseUsuarios.data.find(u => u.id === venta.idUsuario);
                const productoExistente = responseProductos.data.find(p => p.id === venta.idProducto);
                
                setSelectedUser(usuarioExistente);
                setSelectedProduct(productoExistente);
                
                // Establecer nombres en los inputs
                if (usuarioExistente) setUserQuery(usuarioExistente.nombre);
                if (productoExistente) setProductQuery(productoExistente.nombre);

                setVentaActual(venta);
            } catch (error) {
                console.error("Error cargando datos", error);
                alert("No se pudo cargar la venta");
            }
        };
        cargarDatos();
    }, [params.id]);

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

    // Actualizar venta
    const actualizarVenta = async (e) => {
        e.preventDefault();
        
        if (!selectedUser || !selectedProduct) {
            alert("Debe seleccionar usuario y producto");
            return;
        }

        try {
            const url = "http://localhost:3000/ventas/updateVentas";
            const datos = {
                id: params.id,
                idUsuario: selectedUser.id,
                idProducto: selectedProduct.id,
                estatus: "Vendido",
                cantidad: 1
            };
            
            const respuesta = await axios.post(url, datos);
            router.push("/ventas/mostrar");
        } catch (error) {
            console.error("Error actualizando venta", error);
            alert("No se pudo actualizar la venta");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Editar Venta</h2>
            <form onSubmit={actualizarVenta}>
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
                            Actualizar Venta
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}