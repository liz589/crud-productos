import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductosService, type Producto } from './services/producto';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase.config';
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('CRUD');
  protected readonly productos = signal<Producto[]>([]);
  protected readonly productoEnEdicion = signal<Producto | null>(null);
  protected readonly mensaje = signal('');
  protected readonly guardando = signal(false);
  private readonly productosService = inject(ProductosService);

  async ngOnInit(): Promise<void> {
  await auth.authStateReady();

  if (auth.currentUser) {
    await this.cargarProductos();
  }
}

async iniciarSesion(): Promise<void> {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    this.mensaje.set('Sesión iniciada.');
    await this.cargarProductos();
  } catch (error) {
    this.mensaje.set('No se pudo iniciar sesión.');
    console.error(error);
  }
}

private async cargarProductos(): Promise<void> {
  try {
    this.productos.set(await this.productosService.leerProductos());
  } catch (error) {
    this.mensaje.set('No se pudieron cargar los productos.');
    console.error(error);
  }
}
  async guardarProducto(evento: Event, formulario: HTMLFormElement): Promise<void> {
  evento.preventDefault();
  this.mensaje.set('');

  const datos = new FormData(formulario);
  const nombre = String(datos.get('nombre') ?? '').trim();
  const categoria = String(datos.get('categoria') ?? '').trim();
  const precio = Number(datos.get('precio'));
  const stock = Number(datos.get('stock'));
  const productoEditado = this.productoEnEdicion();
  const datosProducto = { nombre, precio, stock, categoria };

  if (!nombre || !categoria) {
    this.mensaje.set('Escribe un nombre y una categoría.');
    return;
  }
  if (!Number.isFinite(precio) || precio < 0) {
  this.mensaje.set('El precio debe ser un número mayor o igual a cero.');
  return;
}

if (!Number.isInteger(stock) || stock < 0) {
  this.mensaje.set('El stock debe ser un entero mayor o igual a cero.');
  return;
}

  this.guardando.set(true);

  try {
  if (productoEditado) {
    await this.productosService.actualizarProducto(
      productoEditado.id,
      datosProducto
    );
  } else {
    await this.productosService.crearProducto(datosProducto);
  }
} catch (error) {
  this.mensaje.set('No se pudo guardar el producto.');
  console.error('Error al guardar el producto:', error);
  return;
} finally {
  this.guardando.set(false);
}

this.productoEnEdicion.set(null);
formulario.reset();
  try {
    this.productos.set(await this.productosService.leerProductos());
    this.mensaje.set('Producto guardado.');
  } catch (error) {
    this.mensaje.set('El producto se guardó. Recarga la página para actualizar la tabla.');
    console.error('Error al actualizar la tabla:', error);
  }
}
async eliminarProducto(
  producto: Producto,
  formulario: HTMLFormElement
): Promise<void> {
  if (this.guardando()) return;

  const confirmado = window.confirm(
    `¿Deseas eliminar "${producto.nombre}"?`
  );

  if (!confirmado) return;

  this.mensaje.set('');
  this.guardando.set(true);

  try {
    await this.productosService.eliminarProducto(producto.id);

    if (this.productoEnEdicion()?.id === producto.id) {
      this.productoEnEdicion.set(null);
      formulario.reset();
    }

    this.mensaje.set('Producto eliminado.');
    await this.cargarProductos();
  } catch (error) {
    this.mensaje.set('No se pudo eliminar el producto.');
    console.error('Error al eliminar:', error);
  } finally {
    this.guardando.set(false);
  }
}
}

