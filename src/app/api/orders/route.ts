import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user orders with order items
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        // Return items with addons as-is from database
        const itemsWithParsedAddons = items.map(item => ({
          ...item,
          addons: item.addons // Drizzle handles JSON fields automatically
        }));
        
        return {
          ...order,
          items: itemsWithParsedAddons
        };
      })
    );

    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    });

  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Starting order creation...');
    
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log('Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user?.id) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request data
    let data;
    try {
      data = await request.json();
      console.log('Received order data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Error parsing request data:', parseError);
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Validate required fields
    const requiredFields = [
      'items',
      'shippingMethodId',
      'subtotal',
      'total',
      'email',
      'firstName',
      'lastName',
      'address',
      'city',
      'state',
      'country',
      'postalCode'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      }, { status: 400 });
    }

    // Validate items array
    if (!Array.isArray(data.items) || data.items.length === 0) {
      console.log('Invalid or empty items array');
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Validate each item has required fields
    const requiredItemFields = ['productId', 'productTitle', 'productPrice', 'quantity'];
    const invalidItems = data.items.filter(item => 
      !item || requiredItemFields.some(field => !item[field])
    );

    if (invalidItems.length > 0) {
      console.log('Invalid items found:', invalidItems);
      return NextResponse.json({ 
        error: 'One or more items are missing required fields',
        invalidItems 
      }, { status: 400 });
    }

    // Generate order number
    const orderId = uuidv4();
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    console.log('Generated order number:', orderNumber);

    // Prepare order data
    const orderData = {
      id: orderId,
      orderNumber,
      userId: session.user.id,
      email: data.email,
      phone: data.phone || null,
      status: 'pending',
      subtotal: data.subtotal,
      shippingAmount: data.shippingCost || 0,
      totalAmount: data.total,
      shippingMethodId: data.shippingMethodId,
      notes: data.notes || null,
      billingFirstName: data.firstName,
      billingLastName: data.lastName,
      billingAddress1: data.address,
      billingCity: data.city,
      billingState: data.state,
      billingCountry: data.country,
      billingPostalCode: data.billingPostalCode || data.postalCode,
      shippingFirstName: data.firstName,
      shippingLastName: data.lastName,
      shippingAddress1: data.address,
      shippingCity: data.city,
      shippingState: data.state,
      shippingCountry: data.country,
      shippingPostalCode: data.shippingPostalCode || data.postalCode,
    };

    console.log('Prepared order data:', JSON.stringify(orderData, null, 2));

    try {
      // Create the order
      await db.insert(orders).values(orderData);
      console.log('Order created successfully:', orderData);

      // Create order items
      for (const item of data.items) {
        const orderItemData = {
          id: uuidv4(),
          orderId: orderId,
          productId: item.productId,
          productName: item.productTitle,
          quantity: item.quantity.toString(),
          price: item.productPrice.toString(),
          totalPrice: (item.productPrice * item.quantity).toString(),
          productImage: item.productImage || null,
          addons: JSON.stringify(item.selectedAddons || []),
        };
        
        console.log('Creating order item:', JSON.stringify(orderItemData, null, 2));
        await db.insert(orderItems).values(orderItemData);
        console.log('Order item created:', orderItemData);
      }

      return NextResponse.json({
        success: true,
        orderId: orderId,
        orderNumber: orderNumber
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      if (dbError instanceof Error) {
        console.error('DB Error name:', dbError.name);
        console.error('DB Error message:', dbError.message);
        console.error('DB Error stack:', dbError.stack);
      }
      throw dbError;
    }

  } catch (error) {
    console.error('Create order error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create order: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 