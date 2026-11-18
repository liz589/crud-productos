import { Injectable } from '@angular/core';
import { db } from '../firebase.config';
import { addDoc, collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';


export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  async leerProductos(): Promise<Producto[]> {
    const referencia = collection(db, 'productos');
    const resultado = await getDocs(referencia);

    return resultado.docs.map((documento) => {
      const datos = documento.data();

      return {
        id: documento.id,
        nombre: datos['nombre'],
        precio: datos['precio'],
        stock: datos['stock'],
        categoria: datos['categoria'],
      };
    });
  }
  async crearProducto(producto: Omit<Producto, 'id'>): Promise<void> {
  const referencia = collection(db, 'productos');
  await addDoc(referencia, producto);
}

async actualizarProducto(id: string, datos: Omit<Producto, 'id'>): Promise<void> {
  const referencia = doc(db, 'productos', id);
  await updateDoc(referencia, datos);
}
async eliminarProducto(id: string): Promise<void> {
  await deleteDoc(doc(db, 'productos', id));
}
  
}