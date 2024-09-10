# Proyecto práctico módulo backend con NodeJs

## Aplicación eCommerce para venta de productos de música sin pasarela de pagos

### Main Goal: Construir una API que sirva de backend para la aplicación frontend

### Requerimientos Base:

1. Creación de modelos o entidades a utilizar
2. Armado de arquitectura básica
3. Autenticación:
    - Añadir Login - Goal: Autenticación de usuario (LISTO)
    - Añadir Registro de Usuario - Goal: Crear una cuenta de usuario (LISTO)
    - Añadir Gestión de Roles - Goal: Asignar roles a los usuarios (vendedor, comprador, admin) - OPCIONAL (LISTO)
4. Lista de Productos Disponibles - Goal: Permitir a los compradores acceder a una lista de productos disponibles. (LISTO)
    - Añadir Paginado
    - Añadir Filtro
    - Añadir Búsqueda
    - Añadir Ordenamiento
5. Lista de Productos por Vendedor - Goal: Permitir acceder a lista de productos de un vendedor.(LISTO)
6. Visualización de Producto - Goal: Permitir a los compradores acceder a más datos o detalles de un producto disponible
    - Ver Datos de Vendedor - Goal: Obtener datos del vendedor(LISTO)
7. Añadir producto a carrito de compras - Goal: Permitir al comprador poder agregar uno o más productos a carrito de compra(LISTO)

### Requerimientos Usuario Comprador:

8. Compra de Productos - Goal: Permitir a los compradores comprar productos del carrito.vo
    - Simulación de Pagos - Goal: Simular el proceso de pago al comprar un producto(LISTO)
9. Historial de Compras - Goal: Permitir a los compradores ver su historial de compras. (LISTO)
10. Edición de Perfil Comprador: Goal: Permitir a los compradores editar su perfil y cargar una imagen.(LISTO)

### Requerimientos Usuario Vendedor:

11. Edición de Perfil Vendedor - Goal: Permitir a vendedores cargar su perfil(LISTO)
12. Administración de Mis Productos:
    -   Listado de Mis Productos (LISTO)
    -   Carga de Productos - Goal: Permitir al vendedor añadir nuevos productos (LISTO)
    -   Edición de Productos - Goal: Permitir al vendedor modificar la información de los productos (LISTO)
    -   Eliminación de Productos - Goal: Permitir al vendedor eliminar productos(LISTO)
    -   Listado de Ventas(LISTO)

### Requerimientos Usuario Administrador:

13. Administración de Usuarios - Goal: Permitir al admin ver el listado de usuarios
    -   Editar o asignar roles a los usuarios.
14. Administración de Compras - Goal: Permitir al admin ver el historial de compras por usuario
