import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

export const resolvers = {
  Query: {
    // Obtener todos los productos
    products: async () => await Product.find(),

    // Obtener todas las órdenes
    orders: async () =>
      await Order.find()
        .populate('user')
        .populate('items.product'),

    // Obtener una orden específica por ID
    order: async (_, { id }) =>
      await Order.findById(id)
        .populate('user')
        .populate('items.product'),

    // Obtener todos los usuarios
    users: async () => await User.find(),
  },

  Mutation: {
    // Crear una nueva orden
    addOrder: async (_, { items }, context) => {
  console.log('>> Context recibido en addOrder:', context); // Registro para depuración
  console.log('>> Items recibidos:', items); // Registro del input en la mutación

  // Verifica si el usuario está autenticado
  if (!context.user) {
    throw new Error('No autenticado. Debes iniciar sesión para realizar esta acción.');
  }

  // Busca al usuario autenticado
  const userDetails = await User.findById(context.user.id);
  if (!userDetails) {
    throw new Error('Usuario no encontrado.');
  }

  // Validación adicional: Verifica el formato de `items`
  if (!items || !Array.isArray(items)) {
    throw new Error('El formato de items es inválido. Debe ser un arreglo de objetos con product y quantity.');
  }
  items.forEach((item, index) => {
    if (!item.product) {
      throw new Error(`El producto en la posición ${index} no tiene un ID válido. Item: ${JSON.stringify(item)}`);
    }
    if (!item.quantity || item.quantity <= 0) {
      throw new Error(`El producto en la posición ${index} tiene una cantidad inválida: ${item.quantity}`);
    }
  });

  // Procesa los productos
  const productDetails = await Promise.all(
    items.map(async (item) => {
      try {
        // Busca el producto con campos específicos usando .select()
        const product = await Product.findById(item.product).select('title price description image');
        if (!product) {
          throw new Error(`Producto con ID ${item.product} no encontrado.`);
        }

        if (!product.price) {
          throw new Error(`El producto con ID ${item.product} no tiene un precio válido.`);
        }

        // Regresa el detalle del producto
        return {
          product,
          quantity: item.quantity,
          price: product.price * item.quantity,
        };
      } catch (err) {
        console.error(`Error procesando el producto con ID ${item.product}: ${err.message}`);
        throw err;
      }
    })
  );

  // Calcula el total de la orden
  const total = productDetails.reduce((sum, item) => sum + item.price, 0);

  // Valida final: El total no puede ser negativo o cero
  if (total <= 0) {
    throw new Error("El total del pedido no puede ser menor o igual a 0. Revisa los productos o sus precios.");
  }

  // Crea la nueva orden
  const order = await Order.create({
    user: context.user.id,
    items: productDetails.map((item) => ({
      product: item.product._id, // Asegúrate de solo enviar el ID del producto
      quantity: item.quantity,
      price: item.price / item.quantity, // Precio unitario
    })),
    total,
    status: 'pending', // Estado inicial: Pending
  });

  // Actualiza las órdenes asociadas al usuario
  userDetails.orders.push(order._id);
  await userDetails.save();

  // Popula los datos de la orden antes de devolverla
  const populatedOrder = await Order.findById(order._id)
    .populate('user') // Popula la información del usuario
    .populate('items.product'); // Popula el producto dentro de los ítems

  console.log('>> Orden con datos completos antes de devolver:', JSON.stringify(populatedOrder, null, 2));

  return populatedOrder;
},

    // Actualizar el estado de una orden
    updateOrderStatus: async (_, { id, status }) => {
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      return order;
    },

    // Eliminar un usuario
    deleteUser: async (_, { id }) => {
      await User.findByIdAndDelete(id);
      return 'Usuario eliminado';
    },

    // Actualizar el rol de un usuario
    updateUserRole: async (_, { id, role }) => {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
      return user;
    },
  },

  // Resolvers personalizados opcionales
  Order: {
    items: async (parent) => {
      return parent.items.map(async (item) => {
        const product = await Product.findById(item.product).select('title price description image');
        return {
          product,
          quantity: item.quantity, // Incluye el campo quantity en la respuesta
          price: item.price,
        };
      });
    },
  },
};