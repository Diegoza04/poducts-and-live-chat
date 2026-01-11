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
      console.log('>> Context recibido en addOrder:', context); // Registro del contexto
      console.log('>> Items recibidos:', items); // Registro de los datos enviados a la mutación

      // Verifica si el usuario está autenticado
      if (!context.user) {
        throw new Error('No autenticado. Debes iniciar sesión para realizar esta acción.');
      }

      // Busca al usuario autenticado
      const userDetails = await User.findById(context.user.id);
      if (!userDetails) {
        throw new Error('Usuario no encontrado.');
      }

      // Procesa los productos
      const productDetails = await Promise.all(
        items.map(async (item) => {
          // Busca el producto con campos específicos usando .select()
          const product = await Product.findById(item.product).select('title price description image');
          
          // Registro para depuración del producto encontrado
          console.log('>> Producto encontrado (con select):', product);

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
        })
      );

      // Calcula el total de la orden
      const total = productDetails.reduce((sum, item) => sum + item.price, 0);

      // Crea la nueva orden
      const order = await Order.create({
        user: context.user.id,
        items: productDetails.map((item) => ({
          product: item.product._id,
          quantity: item.quantity, // Asegúrate de incluir quantity correctamente
          price: item.price / item.quantity, // Precio unitario
        })),
        total,
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