import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface Addon {
  title: string;
  price: number;
  quantity: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching order details for ID:', params.id);

    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log('No authenticated user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.log('User authenticated:', session.user.id);

    // Fetch order with error handling
    try {
      // First, try to fetch just the order to verify it exists and belongs to the user
      const basicOrder = await db.query.orders.findFirst({
        where: eq(orders.id, params.id),
        columns: {
          id: true,
          userId: true
        }
      });

      if (!basicOrder) {
        console.log('Order not found:', params.id);
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Check if the order belongs to the logged-in user
      if (basicOrder.userId !== session.user.id) {
        console.log('Order does not belong to user. Order userId:', basicOrder.userId, 'Session userId:', session.user.id);
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      // Then fetch the full order with relations using a direct query
      const [orderResult] = await db
        .select({
          id: orders.id,
          orderNumber: orders.orderNumber,
          status: orders.status,
          subtotal: orders.subtotal,
          shippingAmount: orders.shippingAmount,
          totalAmount: orders.totalAmount,
          billingFirstName: orders.billingFirstName,
          billingLastName: orders.billingLastName,
          billingAddress1: orders.billingAddress1,
          billingCity: orders.billingCity,
          billingState: orders.billingState,
          billingCountry: orders.billingCountry,
          billingPostalCode: orders.billingPostalCode,
          email: orders.email,
          phone: orders.phone,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .where(eq(orders.id, params.id))
        .limit(1);

      if (!orderResult) {
        console.log('Order not found after full fetch');
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Fetch order items with product images
      const orderItemsResult = await db
        .select({
          id: orderItems.id,
          productName: orderItems.productName,
          quantity: orderItems.quantity,
          price: orderItems.price,
          totalPrice: orderItems.totalPrice,
          productImage: orderItems.productImage,
          addons: orderItems.addons,
          productId: orderItems.productId,
          productImages: products.images,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, params.id));

      // Transform the order data
      const transformedOrder = {
        ...orderResult,
        subtotal: orderResult.subtotal?.toString() ?? '0',
        shippingAmount: orderResult.shippingAmount?.toString() ?? '0',
        totalAmount: orderResult.totalAmount?.toString() ?? '0',
        createdAt: orderResult.createdAt?.toISOString() ?? new Date().toISOString(),
        items: orderItemsResult.map(item => {
          let addonsArray: Addon[] = [];
          let productImages: string[] = [];

          // Parse product images
          if (item.productImages) {
            try {
              const parsedImages = JSON.parse(item.productImages as string);
              if (Array.isArray(parsedImages)) {
                productImages = parsedImages as string[];
              }
            } catch (e) {
              console.error('Error parsing product images:', e);
            }
          }

          // Safely parse addons
          if (item.addons) {
            try {
              const parsedAddons = JSON.parse(item.addons as string);
              if (Array.isArray(parsedAddons)) {
                addonsArray = parsedAddons.map(addon => ({
                  title: addon?.title ?? '',
                  price: typeof addon?.price === 'number' ? addon.price : 0,
                  quantity: typeof addon?.quantity === 'number' ? addon.quantity : 1
                }));
              }
            } catch (e) {
              console.error('Error parsing addons:', e);
            }
          }

          return {
            productName: item.productName ?? 'Unknown Product',
            quantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity as string) || 1,
            price: item.price?.toString() ?? '0',
            totalPrice: item.totalPrice?.toString() ?? '0',
            productImage: item.productImage ?? productImages[0] ?? '',
            productImages: productImages,
            addons: addonsArray
          };
        })
      };

      console.log('Order transformed successfully');
      return NextResponse.json({ order: transformedOrder });
    } catch (dbError) {
      console.error('Database error fetching order:', dbError);
      return NextResponse.json(
        { error: 'Failed to fetch order from database', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in order details API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 