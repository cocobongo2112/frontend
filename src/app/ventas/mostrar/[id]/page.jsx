"use client";
import axios from "axios";

// Fetch available products
async function fetchAvailableProducts() {
    const url = "http://localhost:3000/productos";
    const productos = await axios.get(url);
    return productos.data;
}

// Fetch available clients
async function fetchUsuarios() {
    const url = "http://localhost:3000/";
    const usuarios = await axios.get(url);
    return usuarios.data;
}

async function getVentaU(idU,id) {
    var guaradaridU;
    idU.forEach(u => {
        if(u.id == id) {
            guaradaridU=u.nombre;
        }
    });
    return guaradaridU;
}

async function getVentaP(idP, id) {
    var guaradaridP;
    idP.forEach(p => {
        if (p.id == id) {
            guaradaridP=p.nombre;
        }
    });
    return guaradaridP;
}

async function guardarUsuario(e) {
    e.preventDefault();
    const url = "http://localhost:3000/ventas/updateVentas";
    const datos = {
        id:document.getElementById("id").value,
        idUsuario:document.getElementById("idUsuario").value,
        idProducto:document.getElementById("idProducto").value
    }
    const respuesta = await axios.post(url,datos);
    location.replace("/ventas/mostrar")
}
export default async function Nuevo({params}) {
    const url = "http://localhost:3000/ventas/buscarPorId/"+params.id;
    var dataV = await axios.get(url);
    var venta = dataV.data;
    var usuarios = await fetchUsuarios();
    var productos = await fetchAvailableProducts();
    return (
        <div className="m-0 row justify-content-center">
            <form className="text-center col-6 mt-5" action="" onSubmit={guardarUsuario}>
                <div className="card">
                    <div className="card-header">
                        <h1>Nueva venta</h1>
                    </div>
                    <div className="card-body">
                        <input type="text" className="form-control mb-3" style={{height:"50px"}} id="id" value={`${venta.id}`}/>
                        <div class="form-floating">
                            <select className="form-select mb-2" style={{height:"50px"}} id="idUsuario" aria-label="Floating label select example">
                                <option value={venta.idUsuario} selected>{getVentaU(usuarios,venta.idUsuario)}</option>
                                {
                                    usuarios.map((usuario) => (
                                    <option value={usuario.id}>
                                        {usuario.nombre}
                                    </option>
                                    ))
                                }
                            </select>
                            <label for="floatingSelect">Usuario:</label>
                        </div>
                        <div className="form-floating">
                            <select className="form-select mb-2" style={{height:"50px"}} id="idProducto" aria-label="Floating label select example">
                            <option value={venta.idProducto} selected>{getVentaP(productos, venta.idProducto)}</option>
                                {
                                    productos.map((product) => (
                                        <option value={product.id}>
                                            {product.nombre}
                                        </option>
                                    ))
                                }
                            </select>
                            <label for="floatingSelect">Producro:</label>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button style={{height:"50px"}} className="btn btn-primary col w-100">Realizar cambios</button>
                    </div>
                </div>
            </form>
        </div>
    );
};