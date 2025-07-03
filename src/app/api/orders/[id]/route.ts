import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, addons } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, params.id),
      with: {
        orderItems: {
          with: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if the order belongs to the logged-in user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Transform the order data to match the frontend interface
    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal: order.subtotal,
      shippingAmount: order.shippingAmount ?? 0,
      totalAmount: order.totalAmount,
      billingFirstName: order.billingFirstName ?? '',
      billingLastName: order.billingLastName ?? '',
      billingAddress1: order.billingAddress1 ?? '',
      billingCity: order.billingCity ?? '',
      billingState: order.billingState ?? '',
      billingCountry: order.billingCountry ?? '',
      billingPostalCode: order.billingPostalCode ?? '',
      email: order.email,
      phone: order.phone ?? '',
      createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
      items: order.orderItems.map(item => {
        // Get the first image from the images array or empty string
        const productImages = item.product?.images ? JSON.parse(item.product.images as string) : [];
        const productImage = Array.isArray(productImages) && productImages.length > 0 ? productImages[0] : '';

        return {
          productName: item.product?.name ?? 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          productImage,
          // Parse addons from JSON with null check
          addons: (item.addons ? JSON.parse(item.addons as string) : []).map((addon: any) => ({
            title: addon.title ?? '',
            price: addon.price ?? 0,
            quantity: addon.quantity ?? 1
          }))
        };
      })
    };

    return NextResponse.json({ order: transformedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 